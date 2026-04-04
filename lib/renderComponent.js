// lib/renderComponent.js
//
// Core rendering engine. Converts plain JS component descriptors into real DOM nodes,
// handles stateful function components, manages event listener cleanup, and applies
// a keyed virtual-diff algorithm to minimise DOM mutations on re-render.

/** @type {WeakMap<Element, Array<() => void>>} Maps DOM elements to their cleanup callbacks. */
const cleanupMap = new WeakMap();

// ─── Render Batching ──────────────────────────────────────────────────────────

/**
 * Pending renders scheduled for the next animation frame.
 * Using a Map (render-id → fn) lets later calls overwrite earlier ones for the
 * same component, so only one render fires per component per frame.
 * @type {Map<symbol, () => void>}
 */
const renderQueue = new Map();

/** Whether a rAF tick is already scheduled. */
let scheduled = false;

/**
 * Enqueues a render function, keyed by a stable component ID, so that multiple
 * `setState` calls within the same synchronous block collapse into a single render.
 *
 * @param {symbol} id   - Unique identity of the component instance.
 * @param {() => void} fn - The render function to run on the next frame.
 */
function scheduleRender(id, fn) {
  renderQueue.set(id, fn);

  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(() => {
      // Snapshot the queue so renders triggered during this flush don't run twice.
      const pending = [...renderQueue.values()];
      renderQueue.clear();
      scheduled = false;
      pending.forEach(f => f());
    });
  }
}

// ─── DOM Diff ─────────────────────────────────────────────────────────────────

/**
 * Runs cleanup callbacks registered against `el` and removes them from the map.
 * Safe to call on nodes that have no registered cleanup.
 *
 * @param {Node} el
 */
function runCleanup(el) {
  const fns = cleanupMap.get(el);
  if (fns) {
    fns.forEach(fn => fn());
    cleanupMap.delete(el);
  }
}

/**
 * Resolves the effective text-like content of a node for comparison purposes.
 * Returns null when the node has element children so we never incorrectly wipe
 * child nodes by touching `textContent`.
 *
 * @param {Node} node
 * @returns {string|null}
 */
function leafText(node) {
  if (node.childNodes.length === 0) return node.textContent;
  if (node.childNodes.length === 1 && node.firstChild.nodeType === Node.TEXT_NODE) {
    return node.firstChild.textContent;
  }
  return null;
}

/**
 * Minimally patches `oldNode` in-place to match `newNode`.
 *
 * Key behaviours:
 *  - Node-type or tag changes → full replacement (cleans up old node first).
 *  - Text nodes → updates `.nodeValue` directly.
 *  - Element nodes → reconciles attributes, then children with keyed diffing.
 *  - Child removal is explicit: any old children without a new counterpart are
 *    removed from the DOM (no append-only assumption).
 *  - Keyed children are reordered, not just matched in-place.
 *
 * @param {Node}    oldNode - The existing live DOM node.
 * @param {Node}    newNode - A freshly-rendered node describing the desired state.
 * @returns {Node} The node now in the DOM (may be `oldNode` or a replacement).
 */
function diff(oldNode, newNode) {
  // Guard: nothing to diff against
  if (!oldNode) return newNode;
  if (!newNode) { runCleanup(oldNode); oldNode.remove(); return null; }

  // ── Text nodes ──────────────────────────────────────────────────────────────
  if (oldNode.nodeType === Node.TEXT_NODE && newNode.nodeType === Node.TEXT_NODE) {
    if (oldNode.nodeValue !== newNode.nodeValue) {
      oldNode.nodeValue = newNode.nodeValue;
    }
    return oldNode;
  }

  // ── Node-type mismatch or tag change → full replacement ─────────────────────
  const tagsMatch =
    oldNode.nodeType === newNode.nodeType &&
    oldNode.nodeName === newNode.nodeName;

  if (!tagsMatch) {
    runCleanup(oldNode);
    oldNode.replaceWith(newNode);
    return newNode;
  }

  // ── Same element type – patch in-place ──────────────────────────────────────
  const el = oldNode;

  // Attributes: remove stale ones, set new/changed ones.
  const oldAttrNames = el.getAttributeNames ? el.getAttributeNames() : [];
  oldAttrNames.forEach(name => {
    if (!newNode.hasAttribute(name)) el.removeAttribute(name);
  });
  Array.from(newNode.attributes || []).forEach(({ name, value }) => {
    if (el.getAttribute(name) !== value) el.setAttribute(name, value);
  });

  // Text content: only touch it when the element is purely a text leaf.
  const oldText = leafText(el);
  const newText = leafText(newNode);
  if (oldText !== null && newText !== null && oldText !== newText) {
    el.textContent = newText;
    return el; // no children to reconcile
  }

  // ── Keyed child reconciliation ───────────────────────────────────────────────
  const oldChildren = Array.from(el.childNodes);
  const newChildren = Array.from(newNode.childNodes);

  // Build a key → old-node map for O(1) lookup.
  /** @type {Map<string, Node>} */
  const keyedOld = new Map();
  /** @type {Node[]} Unkeyed old nodes in document order. */
  const unkeyedOld = [];

  oldChildren.forEach(child => {
    const k = child.__key;
    if (k != null) keyedOld.set(k, child);
    else unkeyedOld.push(child);
  });

  let unkeyedIdx = 0;

  // Walk new children in order, inserting/patching as required.
  newChildren.forEach((newChild, i) => {
    const key = newChild.__key;
    let oldChild;

    if (key != null) {
      oldChild = keyedOld.get(key) || null;
      if (oldChild) keyedOld.delete(key); // consumed
    } else {
      oldChild = unkeyedOld[unkeyedIdx++] || null;
    }

    const patched = oldChild ? diff(oldChild, newChild) : newChild;

    // Ensure correct position (handles reorders for keyed nodes).
    const currentAtPosition = el.childNodes[i];
    if (currentAtPosition !== patched) {
      el.insertBefore(patched, currentAtPosition || null);
    }
  });

  // Remove any old keyed nodes that have no new counterpart.
  keyedOld.forEach(orphan => { runCleanup(orphan); orphan.remove(); });

  // Remove any leftover unkeyed nodes.
  while (unkeyedIdx < unkeyedOld.length) {
    const orphan = unkeyedOld[unkeyedIdx++];
    runCleanup(orphan);
    orphan.remove();
  }

  return el;
}

// ─── Component Renderer ───────────────────────────────────────────────────────

/**
 * Renders a component descriptor or function component into a real DOM node.
 *
 * **Function components** receive `{ props, state, setState, refs, store }` and
 * must return an element descriptor object.  They may also return a `life`
 * property containing lifecycle hooks (`onMount`, `onUnmount`).
 *
 * **Element descriptors** are plain objects with the shape:
 * ```js
 * {
 *   tag?:        string,          // default "div"
 *   key?:        string,          // for keyed diffing
 *   ref?:        string,          // stored in ctx.refs[ref]
 *   text?:       string,          // text content (leaf nodes only)
 *   class?:      string[],        // CSS class list
 *   styles?:     Record<string, string>,
 *   attributes?: Record<string, string|boolean>,
 *   events?:     Record<string, EventListener>,
 *   children?:   descriptor[],
 * }
 * ```
 *
 * @param {Function|Object} c         - Component function or element descriptor.
 * @param {Object}          [props={}] - Props passed to function components.
 * @param {Element|null}    [container=null] - Parent container (used during diff).
 * @param {Object}          [ctx={}]   - Shared context: `{ refs, store }`.
 * @returns {Node} The rendered DOM node.
 */
export function renderComponent(c, props = {}, container = null, ctx = {}) {
  const refs  = ctx.refs  || {};
  const store = ctx.store || {};

  // ── Function component ────────────────────────────────────────────────────
  if (typeof c === 'function') {
    /**
     * A stable symbol that identifies this component instance across renders.
     * Used as the key into the render batch queue.
     */
    const instanceId = Symbol('component');

    /**
     * Mutable instance envelope. All closures below share this reference so
     * that state and the current DOM node stay synchronised without
     * re-creating closures on every render cycle.
     */
    const instance = {
      state:     {},
      currentEl: /** @type {Node|null} */ null,
      mounted:   false,
    };

    /**
     * Merges a partial state update (or a function that produces one) into the
     * current state, then schedules a re-render for the next animation frame.
     * Multiple `setState` calls in the same synchronous block are batched.
     *
     * @param {Object|((prev: Object) => Object)} update
     */
    function setState(update) {
      instance.state = {
        ...instance.state,
        ...(typeof update === 'function' ? update(instance.state) : update),
      };
      scheduleRender(instanceId, rerender);
    }

    /**
     * Builds the component's latest descriptor, renders it to a DOM node, then
     * diffs it against the previously rendered node so only changed parts of
     * the DOM are updated.
     *
     * @returns {Node}
     */
    function rerender() {
      const descriptor = c({ ...props, state: instance.state, setState, refs, store });
      const newEl = renderComponent(descriptor, {}, container, ctx);

      if (instance.currentEl) {
        // Clean up the outgoing node's event listeners before diff-replacing.
        const patched = diff(instance.currentEl, newEl);
        instance.currentEl = patched;
      } else {
        instance.currentEl = newEl;
      }

      return instance.currentEl;
    }

    // ── Initialise state ─────────────────────────────────────────────────────
    // Call the component once with empty state to extract initial state value.
    // We ignore the returned descriptor at this point.
    const bootstrap = c({ ...props, state: {}, setState, refs, store });
    instance.state = typeof bootstrap.state === 'function'
      ? bootstrap.state()
      : (bootstrap.state || {});

    // ── First render ─────────────────────────────────────────────────────────
    const el = rerender();

    // ── Lifecycle: onMount ───────────────────────────────────────────────────
    // Run once, after the element has been returned to the caller and (in the
    // normal flow) appended to the DOM.  We use a microtask (Promise.resolve)
    // rather than setTimeout so it fires as early as possible while still
    // being asynchronous — and we guard against double-firing.
    const liveDescriptor = c({ ...props, state: instance.state, setState, refs, store });

    if (liveDescriptor.life?.onMount && !instance.mounted) {
      Promise.resolve().then(() => {
        if (!instance.mounted) {
          instance.mounted = true;
          liveDescriptor.life.onMount(instance.currentEl);
        }
      });
    }

    // ── Lifecycle: onUnmount ─────────────────────────────────────────────────
    // Register onUnmount as a cleanup callback on the root element so it fires
    // whenever the diff algorithm removes the node from the DOM.
    if (liveDescriptor.life?.onUnmount) {
      if (!cleanupMap.has(el)) cleanupMap.set(el, []);
      cleanupMap.get(el).push(() => liveDescriptor.life.onUnmount(instance.currentEl));
    }

    return el;
  }

  // ── Element descriptor ────────────────────────────────────────────────────

  const el = document.createElement(c.tag || 'div');

  // Keyed diffing support
  if (c.key != null) el.__key = c.key;

  // Ref registration
  if (c.ref) refs[c.ref] = el;

  // Text content (leaf nodes only — don't set if children are present)
  if (c.text !== undefined && !c.children?.length) {
    el.textContent = String(c.text);
  }

  // CSS classes
  if (Array.isArray(c.class) && c.class.length) {
    el.classList.add(...c.class.filter(Boolean));
  } else if (typeof c.class === 'string' && c.class) {
    el.className = c.class;
  }

  // Inline styles
  if (c.styles && typeof c.styles === 'object') {
    Object.entries(c.styles).forEach(([k, v]) => {
      if (v != null) el.style[k] = v;
    });
  }

  // HTML attributes
  if (c.attributes && typeof c.attributes === 'object') {
    Object.entries(c.attributes).forEach(([k, v]) => {
      if (v == null) return;
      if (typeof v === 'boolean') {
        if (v) el.setAttribute(k, '');
        // false → omit the attribute entirely
      } else {
        el.setAttribute(k, String(v));
      }
    });
  }

  // Event listeners (registered with cleanup)
  if (c.events && typeof c.events === 'object') {
    Object.entries(c.events).forEach(([event, handler]) => {
      if (typeof handler !== 'function') return;
      el.addEventListener(event, handler);
      if (!cleanupMap.has(el)) cleanupMap.set(el, []);
      cleanupMap.get(el).push(() => el.removeEventListener(event, handler));
    });
  }

  // Children — recurse
  if (Array.isArray(c.children)) {
    c.children.forEach(child => {
      if (child == null) return; // skip null/undefined slots
      el.appendChild(renderComponent(child, {}, el, ctx));
    });
  }

  return el;
}