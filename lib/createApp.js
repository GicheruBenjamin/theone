//
// Application bootstrap and shared state store.
// Keeps concerns separate: the store manages state, createApp wires everything together.

// ─── Store ─────────────────────────────────────────────────────────────────────

/**
 * Creates a lightweight reactive state store.
 *
 * The store holds a single plain-object state tree.  Subscribers are notified
 * synchronously after every `setState` call so the UI always reflects the
 * latest state.
 *
 * @template {Record<string, any>} S
 * @param {S} [initial={}] - The initial state.
 * @returns {{
*   getState: () => S,
*   setState: (update: Partial<S> | ((prev: S) => Partial<S>)) => void,
*   subscribe: (fn: (state: S) => void) => () => void,
* }}
*
* @example
* const store = createStore({ count: 0 });
* store.subscribe(s => console.log('count:', s.count));
* store.setState({ count: 1 }); // logs "count: 1"
* store.setState(prev => ({ count: prev.count + 1 })); // logs "count: 2"
*/
export function createStore(initial = {}) {
 let state = { ...initial };

 /** @type {Set<(state: Object) => void>} */
 const listeners = new Set();

 /**
  * Merges `update` into the current state and notifies all subscribers.
  * Accepts either a partial state object or an updater function.
  *
  * @param {Object|((prev: Object) => Object)} update
  */
 function setState(update) {
   const patch = typeof update === 'function' ? update(state) : update;
   if (patch && typeof patch === 'object') {
     state = { ...state, ...patch };
     listeners.forEach(fn => fn(state));
   }
 }

 /**
  * Registers a subscriber that is called with the full state after each update.
  * Returns an unsubscribe function.
  *
  * @param {(state: Object) => void} fn
  * @returns {() => void}
  */
 function subscribe(fn) {
   listeners.add(fn);
   return () => listeners.delete(fn);
 }

 return { getState: () => state, setState, subscribe };
}

// ─── App Bootstrap ─────────────────────────────────────────────────────────────

/**
* Bootstraps the application by mounting the router into the specified DOM element.
*
* `createApp` is the single entry point that wires together the store, the
* router, and any shared context (such as `refs`) that needs to flow through
* the component tree.
*
* @param {string}  mount   - A CSS selector for the root element (e.g. `"#app"`).
* @param {Object}  router  - A router instance created with `createRouter`.
* @param {{
*   store?: ReturnType<typeof createStore>,
*   refs?:  Record<string, Element>,
* }} [options={}]
* @returns {{ ctx: Object, store: Object|null }}
*
* @throws {Error} If the mount element cannot be found in the document.
*
* @example
* import { createApp, createStore } from './lib/createApp.js';
* import { createRouter }            from './lib/createRouter.js';
* import HomePage                    from './pages/Home.js';
*
* const store  = createStore({ user: null });
* const router = createRouter([{ path: '/', page: HomePage }]);
* createApp('#app', router, { store });
*/
export function createApp(mount, router, options = {}) {
 const root = document.querySelector(mount);

 if (!root) {
   throw new Error(
     `[createApp] Could not find a DOM element matching "${mount}". ` +
     'Make sure the element exists before calling createApp.'
   );
 }

 /**
  * Shared context object forwarded to every component via the renderer.
  * - `store`  – the reactive store (if provided).
  * - `refs`   – a mutable map that components can write named element refs into.
  */
 const ctx = {
   store: options.store || null,
   refs:  options.refs  || {},
 };

 // Hand the container and context off to the router.
 router.init(root, ctx);

 return { ctx, store: options.store || null };
}