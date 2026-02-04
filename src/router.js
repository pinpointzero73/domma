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
    _transitions: {},
    _initialised: false,

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

        // Listen for hash changes
        window.addEventListener('hashchange', () => this._handleRouteChange());

        // Handle initial route
        this._handleRouteChange();

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
        window.removeEventListener('hashchange', this._handleRouteChange);
        this._routes = [];
        this._views = {};
        this._middleware = [];
        this._currentRoute = null;
        this._initialised = false;
    },

    // Internal: Handle route changes
    async _handleRouteChange() {
        if (this._transitioning) return;

        const hash = window.location.hash.slice(1) || this._defaultRoute;
        const {route, params} = this._matchRoute(hash);

        if (!route) {
            return this._renderNotFound(hash);
        }

        const from = this._currentRoute;
        const to = {...route, params, path: hash};

        // Run middleware
        const allowed = await this._runMiddleware(to, from);
        if (!allowed) return;

        // Run onLeave hook
        if (from?.onLeave) {
            const result = await from.onLeave();
            if (result === false) return;
        }

        // Publish before change event
        if (typeof window !== 'undefined' && window.M) {
            window.M.publish('router:beforeChange', {from, to});
        }

        // Run onEnter hook
        if (route.onEnter) {
            const result = await route.onEnter(params);
            if (result === false) return;
        }

        // Update document title
        if (route.title) {
            document.title = route.title;
        }

        // Render the view
        await this._renderView(route.view, params);

        this._currentRoute = to;

        // Publish after change event
        if (typeof window !== 'undefined' && window.M) {
            window.M.publish('router:afterChange', {from, to});
        }
    },

    // Internal: Match route with params
    _matchRoute(path) {
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
                params[patternParts[i].slice(1)] = pathParts[i];
            } else if (patternParts[i] !== pathParts[i]) {
                return null;
            }
        }

        return params;
    },

    // Internal: Run middleware chain
    async _runMiddleware(to, from) {
        for (const middleware of this._middleware) {
            let nextCalled = false;
            const next = () => {
                nextCalled = true;
            };

            await middleware(to, from, next);

            if (!nextCalled) {
                return false;
            }
        }
        return true;
    },

    // Internal: Render a view with transitions
    async _renderView(viewName, params) {
        this._transitioning = true;

        const view = this._views[viewName];
        if (!view) {
            console.error(`[Domma Router] View "${viewName}" not found`);
            this._transitioning = false;
            return;
        }

        // Get jQuery wrapper if available
        const $ = typeof window !== 'undefined' && window.$ ? window.$ : null;
        if (!$) {
            console.error('[Domma Router] jQuery/Domma $ not found. Cannot animate transitions.');
            this._renderViewStatic(view, params);
            this._transitioning = false;
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

        this._transitioning = false;
    },

    // Internal: Render content (template string or function)
    async _renderContent(view, params, $container) {
        let html;

        // Check if view is an object with template property
        if (typeof view === 'object' && !Array.isArray(view)) {
            const template = view.template;

            // Render template
            if (typeof template === 'function') {
                html = await template(params);
            } else if (typeof template === 'string') {
                html = this._renderTemplate(template, params);
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
    _renderTemplate(template, params) {
        if (typeof window !== 'undefined' && window._) {
            return window._.render(template, params);
        }
        // Fallback: simple replacement
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => params[key] || '');
    },

    // Internal: Static render (no animations) - uses trusted application templates
    async _renderViewStatic(view, params) {
        let html;

        if (typeof view === 'object' && !Array.isArray(view)) {
            const template = view.template;
            if (typeof template === 'function') {
                html = await template(params);
            } else if (typeof template === 'string') {
                html = this._renderTemplate(template, params);
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
