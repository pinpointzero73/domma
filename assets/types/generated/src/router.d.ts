export namespace router {
    let _routes: any[];
    let _views: {};
    let _currentRoute: any;
    let _container: any;
    let _defaultRoute: string;
    let _notFoundView: any;
    let _middleware: any[];
    let _transitioning: boolean;
    let _routing: boolean;
    let _missedChange: boolean;
    let _shownPath: any;
    let _transitions: {};
    let _initialised: boolean;
    let _templateCache: {};
    /**
     * Initialise the router
     * @param {RouterOptions} options - Configuration options (see RouterOptions: container, routes, views, default, notFound, transitions)
     * @returns {Router} Router instance for chaining
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
    function init(options?: RouterOptions): Router;
    /**
     * Navigate to a route
     * @param {string} path - Route path (without #)
     * @param {NavigateOptions} [options] - Navigation options (`replace`: replace current history entry)
     * @returns {void}
     *
     * @example
     * R.navigate('/about');
     * R.navigate('/user/123', { replace: true });
     */
    function navigate(path: string, options?: NavigateOptions): void;
    /**
     * Go back in browser history
     * @returns {void}
     *
     * @example
     * R.back();
     */
    function back(): void;
    /**
     * Go forward in browser history
     * @returns {void}
     *
     * @example
     * R.forward();
     */
    function forward(): void;
    /**
     * Get current route information
     * @returns {Route|null} Current route object or null
     *
     * @example
     * const currentRoute = R.current();
     * console.log(currentRoute.path, currentRoute.params);
     */
    function current(): Route | null;
    /**
     * Register a view
     * @param {string} name - View name
     * @param {RouterView} view - Template string, render function, or view object
     * @returns {Router} Router instance for chaining
     *
     * @example
     * R.view('home', '<h1>Home</h1>');
     * R.view('about', { template: '<h1>About</h1>', onMount: ($el) => {} });
     * R.view('user', async (params) => `<h1>User ${params.id}</h1>`);
     */
    function view(name: string, view: RouterView): Router;
    /**
     * Add a route
     * @param {RouteDefinition} route - Route definition (path supports :param for dynamic segments; view, title, onEnter, onLeave, meta)
     * @returns {Router} Router instance for chaining
     *
     * @example
     * R.route({
     *   path: '/user/:id',
     *   view: 'user',
     *   title: 'User Profile',
     *   onEnter: async (params) => { await loadUser(params.id); }
     * });
     */
    function route(route: RouteDefinition): Router;
    /**
     * Add middleware function
     * @param {RouterMiddleware} fn - Middleware function (to, from, next)
     * @returns {Router} Router instance for chaining
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
    function use(fn: RouterMiddleware): Router;
    /**
     * Destroy the router and clean up
     * @returns {void}
     *
     * @example
     * R.destroy();
     */
    function destroy(): void;
    function _runRouteChange(): Promise<void>;
    function _reportError(error: any, route: any, view: any): void;
    /**
     * Run the route for the current address. Changes are handled one at a time:
     * an address change that arrives while one is running (its middleware, the
     * fade out, the render, the fade in) is remembered, and once the change in
     * hand is done the router catches up with the address - if it still differs
     * from what is on screen. Dropping it left the hash on one route and the
     * screen on another (a link, Back/Forward or a typed address within the
     * transition).
     */
    function _handleRouteChange(): Promise<void>;
    function _routeOnce(): Promise<void>;
    /**
     * A refused change (a guard that did not call next(), onLeave/onEnter returning
     * false) leaves the screen where it was, so the address goes back to it -
     * replaceState, which fires no hashchange, so nothing routes a second time.
     * Not when the address has moved on meanwhile (a guard that navigated elsewhere,
     * or restored it itself).
     */
    function _restoreAddress(attempted: any): void;
    function _stripQuery(path: any): string;
    function _parseQuery(path: any): {
        [k: string]: string;
    };
    function _decode(segment: any): any;
    function _matchRoute(path: any): {
        route: any;
        params: {};
    };
    function _extractParams(pattern: any, path: any): {};
    function _runMiddleware(to: any, from: any): Promise<boolean | {
        redirect: any;
    }>;
    function _renderView(viewName: any, params: any): Promise<void>;
    function _showContainer(): void;
    function _loadTemplate(url: any): Promise<any>;
    function _renderContent(view: any, params: any, $container: any): Promise<void>;
    function _renderTemplate(template: any, params: any, partials?: {}): any;
    function _renderNotFound(path: any): Promise<void>;
}
/**
 * Values of a route's `:param` segments, decoded (`/user/:id` at `#/user/42` -> `{id: '42'}`).
 * The not-found view gets `{path}`, the address that matched nothing.
 */
export type RouteParams = Record<string, string>;
/**
 * The query string of an address as an object (`#/search?q=a%20b&f` -> `{q: 'a b', f: ''}`).
 */
export type RouteQuery = Record<string, string>;
/**
 * A route as registered with `R.init({routes})` or `R.route()`.
 */
export type RouteDefinition = {
    /**
     * - Route path; `:name` segments are parameters (`/user/:id`). A query string is not part of the match
     */
    path: string;
    /**
     * - Name of the view to render (a key of `views` / `R.view()`)
     */
    view: string;
    /**
     * - Sets `document.title` when the route is entered
     */
    title?: string;
    /**
     * - Runs before the view renders (may be async). Returning (or resolving to) `false` cancels the change and puts the address back
     */
    onEnter?: (params: RouteParams, to: Route) => unknown;
    /**
     * - Runs when leaving this route (may be async). Returning (or resolving to) `false` cancels the change
     */
    onLeave?: () => unknown;
    /**
     * - Custom metadata, e.g. `{requiresAuth: true}` for a middleware to read
     */
    meta?: Record<string, any>;
};
/**
 * The route being entered or currently shown (`R.current()`, a middleware's `to`/`from`):
 * its definition plus the address it was reached at.
 */
export type Route = Omit<RouteDefinition, "path"> & {
    path: string;
    params: RouteParams;
    query: RouteQuery;
};
/**
 * A view given as a function: called with the route params, returns the HTML (may be async).
 */
export type ViewRenderFunction = (params: RouteParams) => string | Promise<string>;
/**
 * A view object. `template` (or `templateUrl`) is rendered with the route params through Domma's
 * template engine (`{{name}}`, partials as `{{> name}}`).
 */
export type ViewDefinition = {
    /**
     * - Inline template, or a function returning the HTML
     */
    template?: string | ViewRenderFunction;
    /**
     * - URL of a template file, fetched once and cached (used when `template` is not set)
     */
    templateUrl?: string;
    /**
     * - Partial name -> template URL, each fetched and cached
     */
    partials?: Record<string, string>;
    /**
     * - Called after the view's HTML is in the container
     */
    onMount?: ($container: import("./dom.js").DommaCollection) => void;
};
/**
 * A view that renders a standalone component (`Domma.component()`): the container is emptied and
 * the custom element appended, with the props set as attributes (camelCase -> kebab-case; `true`
 * is an empty attribute, `false`/`null` none, objects JSON).
 */
export type ComponentViewDefinition = {
    /**
     * - Custom element tag name
     */
    component: string;
    /**
     * - Props, or a function of the route params returning them
     */
    props?: Record<string, any> | ((params: RouteParams) => Record<string, any>);
    /**
     * - Called after the element is appended
     */
    onMount?: ($container: import("./dom.js").DommaCollection) => void;
};
/**
 * Anything `R.view()` / `R.init({views})` accepts: a template string, a render function, a view
 * object or a component view.
 */
export type RouterView = string | ViewRenderFunction | ViewDefinition | ComponentViewDefinition;
/**
 * Transition settings. Only `duration` is used (the fade out and in); `enter`/`leave` are stored.
 */
export type RouterTransitions = {
    /**
     * - Enter animation
     */
    enter?: string;
    /**
     * - Leave animation
     */
    leave?: string;
    /**
     * - Animation duration in ms
     */
    duration?: number;
};
/**
 * Options for `R.init()`.
 */
export type RouterOptions = {
    /**
     * - Selector for the view container element (throws when not found)
     */
    container: string;
    /**
     * - Route definitions
     */
    routes?: RouteDefinition[];
    /**
     * - View registry `{name: view}`
     */
    views?: Record<string, RouterView>;
    /**
     * - Route used when the address has no hash
     */
    default?: string;
    /**
     * - Name of the view rendered for an address no route matches
     */
    notFound?: string;
    /**
     * - Transition animation options (replaces the defaults as a whole)
     */
    transitions?: RouterTransitions;
};
/**
 * Options for `R.navigate()`.
 */
export type NavigateOptions = {
    /**
     * - Replace the current history entry instead of adding one
     */
    replace?: boolean;
};
/**
 * A middleware's `next`: call it to let the change go ahead, or with a path to go there instead
 * (replacing the refused entry). Not calling it refuses the change.
 */
export type RouterNext = (redirect?: string) => void;
/**
 * A middleware, run in order before every route change (may be async).
 */
export type RouterMiddleware = (to: Route, from: Route | null, next: RouterNext) => void | Promise<void>;
/**
 * Payload of the `router:beforeChange` and `router:afterChange` events (`M.subscribe`).
 */
export type RouterChangeEvent = {
    from: Route | null;
    to: Route;
};
/**
 * Payload of the `router:error` event (`M.subscribe`): a failed route change or render.
 */
export type RouterErrorEvent = {
    error: any;
    /**
     * - The address being routed
     */
    route: string;
    /**
     * - The view being rendered, when the failure was in a render
     */
    view?: string;
};
/**
 * The router (`R`, `Domma.router`).
 */
export type Router = typeof router;
