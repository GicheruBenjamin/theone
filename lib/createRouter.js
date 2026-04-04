// lib/createRouter.js
//
// Client-side router supporting hash-based and History API (pushState) routing,
// named URL parameters, optional parameters, query-string parsing, and a simple
// route-match cache to avoid redundant work on repeated navigations.

import { renderComponent } from './renderComponent.js';

/**
 * Creates a router that maps URL paths to page components and mounts them into
 * the DOM.
 *
 * ### Route syntax
 * | Pattern          | Matches                  | Notes                         |
 * |------------------|--------------------------|-------------------------------|
 * | `/about`         | `/about`                 | Static segment                |
 * | `/user/:id`      | `/user/42`               | Named param → `params.id`     |
 * | `/post/:id?`     | `/post` or `/post/7`     | Optional param (trailing `?`) |
 *
 * Query strings are parsed automatically and available as `query` on the
 * route context object passed to page components.
 *
 * ### History modes
 * - **`hash`** (default) – uses `location.hash` (`/#/path`).  No server config needed.
 * - **`history`**        – uses the History API (`/path`).  Requires the server to
 *   serve `index.html` for all routes (SPA catch-all).
 *
 * @param {Array<{path: string, page: Function}>} routes
 *   Ordered list of route definitions.  Earlier entries take priority.
 * @param {{ mode?: 'hash'|'history', cacheSize?: number }} [options={}]
 * @returns {{ init: Function, navigate: Function }}
 */
export function createRouter(routes = [], options = {}) {
  const mode      = options.mode      || 'hash';
  const cacheSize = options.cacheSize || 50;

  /** The element that router-managed pages are rendered into. */
  let rootContainer = null;

  /** Shared app context forwarded from `createApp`. */
  let appCtx = {};

  /** The component currently mounted in `rootContainer` (for unnecessary-wipe guard). */
  let currentPage = null;

  /** The path that produced `currentPage`. */
  let currentPath = null;

  /**
   * LRU-style match cache.  Stores `path → { route, params }` so repeated
   * visits to the same URL skip the matching loop.
   * @type {Map<string, {route: Object, params: Object}|null>}
   */
  const matchCache = new Map();

  // ─── URL Utilities ─────────────────────────────────────────────────────────

  /**
   * Returns the current "logical path" regardless of history mode.
   * In hash mode:    `/#/user/5?foo=bar` → `/user/5`
   * In history mode: `/user/5?foo=bar`   → `/user/5`
   * Query string is stripped here; use `parseQuery` separately.
   *
   * @returns {string}
   */
  function getPath() {
    if (mode === 'hash') {
      const hash = window.location.hash.slice(1) || '/';
      return hash.split('?')[0];
    }
    return window.location.pathname;
  }

  /**
   * Returns the raw query string for the current URL (without the leading `?`).
   * Works in both hash and history modes.
   *
   * @returns {string}
   */
  function getRawQuery() {
    if (mode === 'hash') {
      const hash = window.location.hash.slice(1) || '';
      return hash.includes('?') ? hash.split('?')[1] : '';
    }
    return window.location.search.slice(1);
  }

  /**
   * Parses a query string into a plain object.
   * `"foo=1&bar=hello%20world"` → `{ foo: "1", bar: "hello world" }`
   *
   * @param {string} raw
   * @returns {Record<string, string>}
   */
  function parseQuery(raw) {
    if (!raw) return {};
    return Object.fromEntries(new URLSearchParams(raw));
  }

  // ─── Route Matching ────────────────────────────────────────────────────────

  /**
   * Tests whether `routePath` matches `actualPath` and extracts named params.
   *
   * Supports:
   *  - Static segments: `/about`
   *  - Named params:    `/user/:id`
   *  - Optional params: `/post/:slug?` — the trailing segment may be absent.
   *
   * @param {string} routePath  - The pattern, e.g. `/user/:id`.
   * @param {string} actualPath - The real URL path, e.g. `/user/42`.
   * @returns {Record<string, string>|null} Extracted params, or `null` on mismatch.
   */
  function parseRoute(routePath, actualPath) {
    const params     = {};
    const routeParts = routePath.split('/');
    const pathParts  = actualPath.split('/');

    // Allow one extra missing segment for a single trailing optional param.
    const lenDiff = routeParts.length - pathParts.length;
    if (lenDiff < 0 || lenDiff > 1) return null;

    for (let i = 0; i < routeParts.length; i++) {
      const r = routeParts[i];
      const p = pathParts[i];
      const isOptional = r.endsWith('?');
      const paramName  = isOptional ? r.slice(1, -1) : (r.startsWith(':') ? r.slice(1) : null);

      if (paramName) {
        // Named (or optional) param
        if (p === undefined && isOptional) {
          params[paramName] = '';   // optional + absent → empty string
        } else if (p !== undefined) {
          params[paramName] = decodeURIComponent(p);
        } else {
          return null; // required param missing
        }
      } else {
        // Static segment — must match exactly
        if (r !== p) return null;
      }
    }

    return params;
  }

  /**
   * Finds the first route that matches `path`.
   * Results are memoised in `matchCache` (bounded to `cacheSize` entries).
   *
   * @param {string} path
   * @returns {{ route: Object, params: Object }|null}
   */
  function matchRoute(path) {
    if (matchCache.has(path)) return matchCache.get(path);

    let result = null;
    for (const route of routes) {
      const params = parseRoute(route.path, path);
      if (params !== null) {
        result = { route, params };
        break;
      }
    }

    // Evict oldest entry when cache is full.
    if (matchCache.size >= cacheSize) {
      matchCache.delete(matchCache.keys().next().value);
    }
    matchCache.set(path, result);

    return result;
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  /**
   * Navigates to `path`, updating the browser URL.
   * Accepts an optional `query` object that is serialised into a query string.
   *
   * @param {string}                      path
   * @param {Record<string, string>}      [query={}]
   * @param {{ replace?: boolean }}       [navOptions={}]
   *   Pass `{ replace: true }` to use `replaceState` instead of `pushState`
   *   (or to replace the hash without adding a history entry).
   */
  function navigate(path, query = {}, navOptions = {}) {
    const qs = new URLSearchParams(query).toString();
    const full = qs ? `${path}?${qs}` : path;

    if (mode === 'history') {
      if (navOptions.replace) {
        window.history.replaceState(null, '', full);
      } else {
        window.history.pushState(null, '', full);
      }
      // pushState/replaceState don't fire `popstate`, so we render manually.
      handleNavigation();
    } else {
      // Hash mode — the `hashchange` event will trigger `handleNavigation`.
      if (navOptions.replace) {
        window.location.replace(`#${full}`);
      } else {
        window.location.hash = full;
      }
    }
  }

  // ─── Rendering ─────────────────────────────────────────────────────────────

  /**
   * Handles a navigation event.  Matches the current URL, then mounts the
   * appropriate page component.  Skips a full DOM wipe if the matched route
   * (and therefore the page component) has not changed.
   */
  function handleNavigation() {
    const path  = getPath();
    const query = parseQuery(getRawQuery());
    const match = matchRoute(path);

    if (!match) {
      if (currentPath !== '@@404') {
        rootContainer.innerHTML = '<h1>404 – Page not found</h1>';
        currentPage = null;
        currentPath = '@@404';
      }
      return;
    }

    // Avoid re-mounting the same page when only the hash fragment changed and
    // the route + component is identical.
    if (match.route.page === currentPage && path === currentPath) return;

    // Clear the container only when we actually need a different component.
    rootContainer.innerHTML = '';

    const el = renderComponent(
      match.route.page,
      { params: match.params, query, navigate },
      rootContainer,
      appCtx
    );

    rootContainer.appendChild(el);

    currentPage = match.route.page;
    currentPath = path;
  }

  // ─── Initialisation ────────────────────────────────────────────────────────

  /**
   * Attaches the router to a DOM container and starts listening for URL changes.
   * Called automatically by `createApp`.
   *
   * @param {Element} container - The DOM element to render pages into.
   * @param {Object}  ctx       - Shared app context (`{ store, refs }`).
   */
  function init(container, ctx) {
    rootContainer = container;
    appCtx = ctx || {};

    if (mode === 'history') {
      window.addEventListener('popstate', handleNavigation);
    } else {
      window.addEventListener('hashchange', handleNavigation);
    }

    // Render the page that matches the URL present on initial load.
    handleNavigation();
  }

  return { init, navigate };
}