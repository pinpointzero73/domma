/**
 * Domma Router Module
 * Hash-based SPA routing with lifecycle hooks and middleware support
 *
 * @module router
 * @alias R (window.R / Domma.router)
 */

/**
 * Router module for hash-based single-page applications
 * Provides client-side routing with transitions, lifecycle hooks, and middleware
 */
export const router = {
    _routes: [],
    _views: {},
    _currentRoute: null,
    _container: null,
    _defaultRoute: '/',
    _notFoundView: null,
    _middleware: [],
    _transitioning: false,
    _routing: false,
    _missedChange: false,
    _shownPath: null,         // the address whose screen is showing (a not-found one too)
    _transitions: {},
    _initialised: false,
    _templateCache: {},

    /**
     * Initialise the router
     * @param {Object} options - Configuration options
     * @param {string} options.container - Selector for view container element
     * @param {Array} options.routes - Route definitions
     * @param {Object} options.views - View registry { name: template/function }
     * @param {string} [options.default='/'] - Default route path
     * @param {string} [options.notFound='404'] - 404 view name
     * @param {Object} [options.transitions] - Transition animation options
     * @param {string} [options.transitions.enter='fadeIn'] - Enter animation
     * @param {string} [options.transitions.leave='fadeOut'] - Leave animation
     * @param {number} [options.transitions.duration=200] - Animation duration in ms
     * @returns {Object} Router instance for chaining
     *
     * @example
     * R.init({
     *   container: '#app',
     *   routes: [
     *     { path: '/', view: 'home', title: 'Home' },
     *     { path: '/about', view: 'about', title: 'About' }
     *   ],
     *   views: { home: homeView, about: aboutView },
     *   transitions: { duration: 300 }
     * });
     */
    init(options = {}) {
        if (this._initialised) {
            console.warn('[Domma Router] Already initialised');
            return this;
        }

        // Store container
        this._container = document.querySelector(options.container);
        if (!this._container) {
            throw new Error(`[Domma Router] Container "${options.container}" not found`);
        }

        // Store configuration
        this._routes = options.routes || [];
        this._views = options.views || {};
        this._defaultRoute = options.default || '/';
        this._notFoundView = options.notFound || '404';
        this._transitions = options.transitions || {
            enter: 'fadeIn',
            leave: 'fadeOut',
            duration: 200
        };

        // Listen for hash changes. The handler is kept so destroy() can remove it, and it
        // looks _handleRouteChange up at event time, so a wrapper installed on the router
        // (Domma CMS installs one) is the one that runs.
        this._onHashChange = () => this._runRouteChange();
        window.addEventListener('hashchange', this._onHashChange);

        // Handle initial route
        this._runRouteChange();

        this._initialised = true;

        // Publish router ready event
        if (typeof window !== 'undefined' && window.M) {
            window.M.publish('router:ready', {router: this});
        }

        return this;
    },

    /**
     * Navigate to a route
     * @param {string} path - Route path (without #)
     * @param {Object} [options] - Navigation options
     * @param {boolean} [options.replace=false] - Replace current history entry
     * @returns {void}
     *
     * @example
     * R.navigate('/about');
     * R.navigate('/user/123', { replace: true });
     */
    navigate(path, options = {}) {
        if (!this._initialised) {
            console.error('[Domma Router] Router not initialised. Call R.init() first.');
            return;
        }

        if (options.replace) {
            window.location.replace(`#${path}`);
        } else {
            window.location.hash = path;
        }
    },

    /**
     * Go back in browser history
     * @returns {void}
     *
     * @example
     * R.back();
     */
    back() {
        window.history.back();
    },

    /**
     * Go forward in browser history
     * @returns {void}
     *
     * @example
     * R.forward();
     */
    forward() {
        window.history.forward();
    },

    /**
     * Get current route information
     * @returns {Object|null} Current route object or null
     *
     * @example
     * const currentRoute = R.current();
     * console.log(currentRoute.path, currentRoute.params);
     */
    current() {
        return this._currentRoute;
    },

    /**
     * Register a view
     * @param {string} name - View name
     * @param {string|Function|Object} view - Template string, render function, or view object
     * @returns {Object} Router instance for chaining
     *
     * @example
     * R.view('home', '<h1>Home</h1>');
     * R.view('about', { template: '<h1>About</h1>', onMount: ($el) => {} });
     * R.view('user', async (params) => `<h1>User ${params.id}</h1>`);
     */
    view(name, view) {
        this._views[name] = view;
        return this;
    },

    /**
     * Add a route
     * @param {Object} route - Route definition
     * @param {string} route.path - Route path (supports :param for dynamic segments)
     * @param {string} route.view - View name
     * @param {string} [route.title] - Page title
     * @param {Function} [route.onEnter] - Before enter hook
     * @param {Function} [route.onLeave] - Before leave hook
     * @param {Object} [route.meta] - Custom metadata
     * @returns {Object} Router instance for chaining
     *
     * @example
     * R.route({
     *   path: '/user/:id',
     *   view: 'user',
     *   title: 'User Profile',
     *   onEnter: async (params) => { await loadUser(params.id); }
     * });
     */
    route(route) {
        this._routes.push(route);
        return this;
    },

    /**
     * Add middleware function
     * @param {Function} fn - Middleware function (to, from, next)
     * @returns {Object} Router instance for chaining
     *
     * @example
     * R.use((to, from, next) => {
     *   if (to.meta.requiresAuth && !isAuthenticated()) {
     *     R.navigate('/login');
     *   } else {
     *     next();
     *   }
     * });
     */
    use(fn) {
        this._middleware.push(fn);
        return this;
    },

    /**
     * Destroy the router and clean up
     * @returns {void}
     *
     * @example
     * R.destroy();
     */
    destroy() {
        if (this._onHashChange) {
            window.removeEventListener('hashchange', this._onHashChange);
            this._onHashChange = null;
        }
        this._routes = [];
        this._views = {};
        this._middleware = [];
        this._currentRoute = null;
        this._shownPath = null;
        this._routing = false;
        this._missedChange = false;
        this._initialised = false;
    },

    // Internal: run a route change from an event, so a failure is reported, never an unhandled rejection.
    _runRouteChange() {
        const result = this._handleRouteChange();
        if (result && typeof result.catch === 'function') {
            result.catch(error => this._reportError(error, window.location.hash.slice(1) || this._defaultRoute));
        }
        return result;
    },

    // Internal: log a routing failure and publish router:error.
    _reportError(error, route, view) {
        console.error(`[Domma Router] Error on ${route}:`, error);
        if (typeof window !== 'undefined' && window.M) {
            window.M.publish('router:error', {error, route, view});
        }
    },

    // Internal: Handle route changes
    /**
     * Run the route for the current address. Changes are handled one at a time:
     * an address change that arrives while one is running (its middleware, the
     * fade out, the render, the fade in) is remembered, and once the change in
     * hand is done the router catches up with the address - if it still differs
     * from what is on screen. Dropping it left the hash on one route and the
     * screen on another (a link, Back/Forward or a typed address within the
     * transition).
     */
    async _handleRouteChange() {
        if (this._routing || this._transitioning) {
            this._missedChange = true;
            return;
        }
        this._routing = true;
        try {
            await this._routeOnce();
            // Each catch-up is a navigation the user made; a handful is plenty.
            let i = 0;
            for (; this._missedChange && i < 5; i++) {
                this._missedChange = false;
                const now = window.location.hash.slice(1) || this._defaultRoute;
                if (this._shownPath === now) break;
                await this._routeOnce();
            }
            // Still changing after that many: start again, rather than drop the latest.
            if (this._missedChange && i >= 5) setTimeout(() => this._handleRouteChange(), 0);
        } finally {
            this._routing = false;
            this._missedChange = false;
        }
    },

    // Internal: one route change for the current address (see _handleRouteChange).
    async _routeOnce() {
        const hash = window.location.hash.slice(1) || this._defaultRoute;
        const {route, params} = this._matchRoute(hash);

        if (!route) {
            const result = await this._renderNotFound(hash);
            // A not-found override may load more routes and ask again (Domma CMS does, for plugins):
            // only an address that still matches nothing is the one on screen.
            if (!this._matchRoute(hash).route) this._shownPath = hash;
            return result;
        }

        const from = this._currentRoute;
        const to = {...route, params, query: this._parseQuery(hash), path: hash};

        // Run middleware
        const allowed = await this._runMiddleware(to, from);
        if (allowed !== true) {
            if (allowed && typeof allowed.redirect === 'string') {
                // next('/somewhere'): go there instead, in place of the refused entry.
                window.location.replace(`#${allowed.redirect}`);
            } else {
                this._restoreAddress(hash);
            }
            return;
        }

        // Run onLeave hook
        if (from?.onLeave) {
            const result = await from.onLeave();
            if (result === false) { this._restoreAddress(hash); return; }
        }

        // Publish before change event
        if (typeof window !== 'undefined' && window.M) {
            window.M.publish('router:beforeChange', {from, to});
        }

        // Run onEnter hook
        if (route.onEnter) {
            const result = await route.onEnter(params, to);
            if (result === false) { this._restoreAddress(hash); return; }
        }

        // Update document title
        if (route.title) {
            document.title = route.title;
        }

        // Render the view
        await this._renderView(route.view, params);

        this._currentRoute = to;
        this._shownPath = hash;

        // Publish after change event
        if (typeof window !== 'undefined' && window.M) {
            window.M.publish('router:afterChange', {from, to});
        }
    },

    /**
     * A refused change (a guard that did not call next(), onLeave/onEnter returning
     * false) leaves the screen where it was, so the address goes back to it -
     * replaceState, which fires no hashchange, so nothing routes a second time.
     * Not when the address has moved on meanwhile (a guard that navigated elsewhere,
     * or restored it itself).
     */
    _restoreAddress(attempted) {
        const shown = this._shownPath;
        if (shown === null || shown === undefined || shown === attempted) return;
        const now = window.location.hash.slice(1) || this._defaultRoute;
        if (now !== attempted) return;
        if (window.history && typeof window.history.replaceState === 'function') {
            window.history.replaceState(window.history.state, '', `#${shown}`);
        }
    },

    // Internal: the path part of an address ('/search?q=x' -> '/search').
    _stripQuery(path) {
        const s = String(path);
        const q = s.indexOf('?');
        return q === -1 ? s : s.slice(0, q);
    },

    // Internal: the query of an address as an object ('/s?q=a%20b&f' -> {q: 'a b', f: ''}).
    _parseQuery(path) {
        const s = String(path);
        const q = s.indexOf('?');
        if (q === -1) return {};
        try {
            return Object.fromEntries(new URLSearchParams(s.slice(q + 1)));
        } catch {
            return {};
        }
    },

    // Internal: decodeURIComponent that keeps the raw text when it is malformed.
    _decode(segment) {
        try {
            return decodeURIComponent(segment);
        } catch {
            return segment;
        }
    },

    // Internal: Match route with params (a query string is not part of the match)
    _matchRoute(path) {
        path = this._stripQuery(path);
        for (const route of this._routes) {
            const params = this._extractParams(route.path, path);
            if (params !== null) {
                return {route, params};
            }
        }
        return {route: null, params: {}};
    },

    // Internal: Extract route params (e.g., /user/:id -> { id: '123' })
    _extractParams(pattern, path) {
        const patternParts = pattern.split('/').filter(Boolean);
        const pathParts = path.split('/').filter(Boolean);

        if (patternParts.length !== pathParts.length) {
            return null;
        }

        const params = {};

        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
                params[patternParts[i].slice(1)] = this._decode(pathParts[i]);
            } else if (patternParts[i] !== pathParts[i] && patternParts[i] !== this._decode(pathParts[i])) {
                return null;
            }
        }

        return params;
    },

    // Internal: Run middleware chain
    // true = carry on, false = refused, {redirect} = next('/path') asked to go elsewhere.
    async _runMiddleware(to, from) {
        for (const middleware of this._middleware) {
            let nextCalled = false;
            let redirect = null;
            const next = (target) => {
                nextCalled = true;
                if (typeof target === 'string') redirect = target;
            };

            await middleware(to, from, next);

            if (!nextCalled) {
                return false;
            }
            if (redirect !== null) {
                return {redirect};
            }
        }
        return true;
    },

    // Internal: Render a view with transitions
    // A failure (a template or partial that will not load, a throwing render or onMount)
    // is logged and published as router:error, the container is shown again, and the
    // router is left free for the next change - it never stays mid-transition.
    async _renderView(viewName, params) {
        this._transitioning = true;
        try {
            const view = this._views[viewName];
            if (!view) {
                console.error(`[Domma Router] View "${viewName}" not found`);
                return;
            }

            // Get jQuery wrapper if available
            const $ = typeof window !== 'undefined' && window.$ ? window.$ : null;
            if (!$) {
                console.error('[Domma Router] jQuery/Domma $ not found. Cannot animate transitions.');
                await this._renderViewStatic(view, params);
                return;
            }

            const $container = $(this._container);

            // Fade out current content
            await new Promise(resolve => {
                $container.fadeOut(this._transitions.duration, resolve);
            });

            // Render new content
            await this._renderContent(view, params, $container);

            // Fade in new content
            await new Promise(resolve => {
                $container.fadeIn(this._transitions.duration, resolve);
            });
        } catch (error) {
            this._showContainer();
            this._reportError(error, window.location.hash.slice(1) || this._defaultRoute, viewName);
        } finally {
            this._transitioning = false;
        }
    },

    // Internal: undo a fade-out left half done by a failed render.
    _showContainer() {
        const el = this._container && (this._container[0] || this._container);
        if (el && el.style) {
            el.style.display = '';
            el.style.opacity = '';
            el.style.transition = '';
        }
    },

    // Internal: Load template from URL with caching
    async _loadTemplate(url) {
        if (this._templateCache[url]) {
            return this._templateCache[url];
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load template: ${url} (${response.status})`);
            }
            const text = await response.text();
            this._templateCache[url] = text;
            return text;
        } catch (error) {
            console.error(`[Domma Router] Template load error:`, error);
            throw error;
        }
    },

    // Internal: Render content (template string or function)
    async _renderContent(view, params, $container) {
        let html;

        // ── Component-based routes ──────────────────────────────────────────
        // Route definition: { component: 'tag-name', props: (params) => ({…}) }
        if (typeof view === 'object' && view.component && !Array.isArray(view)) {
            const tagName     = view.component;
            const containerEl = $container[0] || $container;

            // Resolve props (accepts object literal or function)
            const resolvedProps = typeof view.props === 'function'
                ? view.props(params)
                : (view.props || {});

            // Build and configure the custom element
            const el = document.createElement(tagName);
            for (const [key, val] of Object.entries(resolvedProps)) {
                const attr = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                if (val === true || val === '') {
                    el.setAttribute(attr, '');
                } else if (val !== false && val !== null && val !== undefined) {
                    el.setAttribute(
                        attr,
                        typeof val === 'object' ? JSON.stringify(val) : String(val)
                    );
                }
            }

            // Clear container safely, then append the component element
            while (containerEl.firstChild) {
                containerEl.removeChild(containerEl.firstChild);
            }
            containerEl.appendChild(el);

            if (typeof view.onMount === 'function') {
                view.onMount($container);
            }
            return;
        }

        // Check if view is an object with template property
        if (typeof view === 'object' && !Array.isArray(view)) {
            let template = view.template;

            // Load template from URL if templateUrl specified
            if (!template && view.templateUrl) {
                template = await this._loadTemplate(view.templateUrl);
            }

            // Load partials from URLs if specified
            let partials = {};
            if (view.partials) {
                const entries = Object.entries(view.partials);
                const loaded = await Promise.all(
                    entries.map(([name, url]) => this._loadTemplate(url).then(t => [name, t]))
                );
                partials = Object.fromEntries(loaded);
            }

            // Render template
            if (typeof template === 'function') {
                html = await template(params);
            } else if (typeof template === 'string') {
                html = this._renderTemplate(template, params, partials);
            }

            // Set HTML (bypass sanitisation for trusted templates)
            $container.html(html, {safe: false});

            // Scan for icons
            if (typeof window !== 'undefined' && window.I) {
                window.I.scan(this._container);
            }

            // Call onMount lifecycle hook
            if (view.onMount && typeof view.onMount === 'function') {
                view.onMount($container);
            }
        } else if (typeof view === 'function') {
            // View is a render function
            html = await view(params);
            $container.html(html, {safe: false});

            if (typeof window !== 'undefined' && window.I) {
                window.I.scan(this._container);
            }
        } else if (typeof view === 'string') {
            // View is a template string
            html = this._renderTemplate(view, params);
            $container.html(html, {safe: false});

            if (typeof window !== 'undefined' && window.I) {
                window.I.scan(this._container);
            }
        }
    },

    // Internal: Render template using Domma template engine
    _renderTemplate(template, params, partials = {}) {
        if (typeof window !== 'undefined' && window._ && typeof window._.render === 'function') {
            return window._.render(template, params || {}, { partials });
        }
        // Fallback: simple replacement
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => params[key] || '');
    },

    // Internal: Static render (no animations) - uses trusted application templates
    async _renderViewStatic(view, params) {
        // ── Component-based routes (no animation path) ──────────────────────
        if (typeof view === 'object' && view.component && !Array.isArray(view)) {
            const tagName     = view.component;
            const containerEl = this._container[0] || this._container;
            const resolvedProps = typeof view.props === 'function'
                ? view.props(params)
                : (view.props || {});
            const el = document.createElement(tagName);
            for (const [key, val] of Object.entries(resolvedProps)) {
                const attr = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                if (val === true || val === '') {
                    el.setAttribute(attr, '');
                } else if (val !== false && val !== null && val !== undefined) {
                    el.setAttribute(attr, typeof val === 'object' ? JSON.stringify(val) : String(val));
                }
            }
            while (containerEl.firstChild) containerEl.removeChild(containerEl.firstChild);
            containerEl.appendChild(el);
            if (typeof view.onMount === 'function') view.onMount(this._container);
            if (typeof window !== 'undefined' && window.I) window.I.scan(containerEl);
            return;
        }

        let html;

        if (typeof view === 'object' && !Array.isArray(view)) {
            let template = view.template;

            // Load template from URL if templateUrl specified
            if (!template && view.templateUrl) {
                template = await this._loadTemplate(view.templateUrl);
            }

            // Load partials from URLs if specified
            let partials = {};
            if (view.partials) {
                const entries = Object.entries(view.partials);
                const loaded = await Promise.all(
                    entries.map(([name, url]) => this._loadTemplate(url).then(t => [name, t]))
                );
                partials = Object.fromEntries(loaded);
            }

            if (typeof template === 'function') {
                html = await template(params);
            } else if (typeof template === 'string') {
                html = this._renderTemplate(template, params, partials);
            }
            // Safe: html is from application-controlled templates, not user input
            this._container.innerHTML = html;

            if (view.onMount && typeof view.onMount === 'function') {
                view.onMount(this._container);
            }
        } else if (typeof view === 'function') {
            html = await view(params);
            this._container.innerHTML = html;
        } else if (typeof view === 'string') {
            html = this._renderTemplate(view, params);
            this._container.innerHTML = html;
        }

        if (typeof window !== 'undefined' && window.I) {
            window.I.scan(this._container);
        }
    },

    // Internal: Render 404 view - uses DOM methods to safely handle user-controlled path
    async _renderNotFound(path) {
        const view = this._views[this._notFoundView];
        if (view) {
            await this._renderView(this._notFoundView, {path});
        } else {
            // Default 404 message - use DOM methods to avoid XSS with user-controlled path
            const container = this._container;
            container.textContent = ''; // Clear safely

            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'text-align: center; padding: 4rem 1rem;';

            const heading = document.createElement('h1');
            heading.style.cssText = 'font-size: 4rem; margin-bottom: 1rem;';
            heading.textContent = '404';

            const message = document.createElement('p');
            message.style.cssText = 'font-size: 1.25rem; color: #666;';
            message.textContent = `Page not found: ${path}`;

            const link = document.createElement('a');
            link.href = '#/';
            link.style.cssText = 'color: #3b82f6; text-decoration: underline; margin-top: 1rem; display: inline-block;';
            link.textContent = 'Go Home';

            wrapper.appendChild(heading);
            wrapper.appendChild(message);
            wrapper.appendChild(link);
            container.appendChild(wrapper);
        }
    }
};
