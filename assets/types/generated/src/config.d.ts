export namespace configEngine {
    let _configs: Map<any, any>;
    let _components: Map<any, any>;
    let _eventHandlers: Map<any, any>;
    let _initCallbacks: any[];
    let _domReady: boolean;
    let _autoWrap: boolean;
    /**
     * Process initial configuration
     * @param {SetupConfig & {$init?: () => void}} config - Configuration object keyed by selector
     *   (`$init` runs once, first)
     * @param {{autoWrap?: boolean}} [options] - Processing options
     * @param {boolean} [options.autoWrap=true] - Automatically wrap in DOMContentLoaded
     */
    function process(config: SetupConfig & {
        $init?: () => void;
    }, options?: {
        autoWrap?: boolean;
    }): void;
    /**
     * Internal config processing (after DOM ready check)
     * @private
     */
    function _processConfig(config: any): void;
    /**
     * Update configuration for a selector
     * @param {string} selector - CSS selector
     * @param {Partial<SelectorConfig>} changes - Changes to merge into existing config
     * @returns {SelectorConfig} The merged configuration
     */
    function update(selector: string, changes: Partial<SelectorConfig>): SelectorConfig;
    /**
     * Retrieve the configuration of every selector
     * @overload
     * @returns {Record<string, SelectorConfig>}
     */
    function config(): Record<string, SelectorConfig>;
    /**
     * Retrieve configuration for a selector
     * @overload
     * @param {string} selector - Selector to get config for
     * @returns {SelectorConfig | null} Configuration object or null if not found
     */
    function config(selector: string): SelectorConfig | null;
    /**
     * Retrieve the live component instance created for a selector.
     *
     * $.setup() keeps instances internally, so page code has no other way to
     * reach them - calling a component's methods (modal.open(), tabs.show(),
     * timer.start()) requires this accessor.
     *
     * @overload
     * @returns {Map<string, any>} Every instance, by selector
     */
    function getComponent(): Map<string, any>;
    /**
     * @overload
     * @param {string} selector - Selector the component was configured under
     * @returns {any} The instance, or null
     */
    function getComponent(selector: string): any;
    /**
     * Reset/destroy configuration for a selector or all selectors
     * @param {string} [selector] - Optional selector to reset
     */
    function reset(selector?: string): void;
    /**
     * Initialise a component
     * @param {string} selector - CSS selector
     * @param {ComponentType} componentType - Component type name
     * @param {Record<string, any>} options - Component options
     * @returns {any} Component instance
     */
    function initComponent(selector: string, componentType: ComponentType, options: Record<string, any>): any;
    /**
     * Apply properties to DOM elements
     * @param {import('./dom.js').DommaCollection} domElements - Domma collection
     * @param {InitialProperties} properties - Properties to apply
     */
    function applyProperties(domElements: import("./dom.js").DommaCollection, properties: InitialProperties): void;
    /**
     * Bind events to elements
     * @param {string} selector - CSS selector
     * @param {Record<string, EventActions>} events - Event handlers object
     * @param {boolean} [track=false] - Whether to track handlers for later removal
     */
    function bindEvents(selector: string, events: Record<string, EventActions>, track?: boolean): void;
    /**
     * Unbind all tracked events for a selector
     * @param {string} selector - CSS selector
     */
    function unbindEvents(selector: string): void;
    /**
     * Update events for a selector (replaces existing handlers for same events)
     * @param {string} selector - CSS selector
     * @param {Record<string, EventActions>} newEvents - New event handlers
     */
    function updateEvents(selector: string, newEvents: Record<string, EventActions>): void;
    /**
     * Execute actions for an event
     * @param {Event} event - DOM event
     * @param {EventActions} actions - Actions to execute
     */
    function executeActions(event: Event, actions: EventActions): void;
    /**
     * Register a callback to run when DOM is ready
     * @param {() => void} callback - Function to execute when DOM is ready
     * @returns {void}
     */
    function ready(callback: () => void): void;
}
/**
 * A component `$.setup()` can create for a selector - the keys of the map in `initComponent()`.
 */
export type ComponentType = "card" | "modal" | "tabs" | "accordion" | "tooltip" | "carousel" | "dropdown" | "contextMenu" | "sortable" | "skeleton" | "avatar" | "avatarGroup" | "inputGroup" | "popover" | "badge" | "numberBadge" | "listGroup" | "cookieConsent" | "backToTop" | "buttonGroup" | "loader" | "breadcrumbs" | "navbar" | "sidebar" | "footer" | "notification" | "timer" | "alarm" | "autocomplete" | "pillbox" | "signature" | "form" | "breathe" | "pulse" | "scribe";
/**
 * Properties applied to the matched elements once (`initial`) - each is the collection method of the same name.
 */
export type InitialProperties = {
    css?: Record<string, string | number>;
    text?: string;
    html?: string;
    addClass?: string;
    removeClass?: string;
    toggleClass?: string;
    /**
     * Attribute name -> value
     */
    attr?: Record<string, string>;
};
/**
 * A declarative event action: applied to `target` (a selector) or else to the element the event fired on.
 */
export type EventAction = {
    /**
     * Selector of the elements to change (default: the event target)
     */
    target?: string;
    css?: Record<string, string | number>;
    text?: string;
    html?: string;
    addClass?: string;
    removeClass?: string;
    toggleClass?: string;
    /**
     * Written to the console
     */
    log?: string;
};
/**
 * An event handler in a setup config. `this` is the event target.
 */
export type ConfigEventHandler = (this: EventTarget, event: Event, $el: import("./dom.js").DommaCollection) => void;
/**
 * What an event runs: a handler, an action, or a list of either (run in order).
 */
export type EventActions = ConfigEventHandler | EventAction | Array<ConfigEventHandler | EventAction>;
/**
 * The configuration for one selector.
 */
export type SelectorConfig = {
    /**
     * Component to create on the selector
     */
    component?: ComponentType;
    /**
     * Options for that component (`schema` and `data` for `form`)
     */
    options?: Record<string, any>;
    /**
     * Applied to the matched elements once
     */
    initial?: InitialProperties;
    /**
     * Event name -> what it runs
     */
    events?: Record<string, EventActions>;
    /**
     * Called first with the matched elements
     */
    init?: (this: import("./dom.js").DommaCollection, $el: import("./dom.js").DommaCollection) => void;
};
/**
 * Configuration keyed by selector.
 */
export type SetupConfig = {
    [selector: string]: SelectorConfig;
};
/**
 * The declarative configuration engine behind `$.setup()`, `$.update()`, `$.config()`, `$.getComponent()` and
 * `$.reset()`.
 */
export type ConfigEngine = typeof configEngine;
