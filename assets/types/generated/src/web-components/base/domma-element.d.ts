/**
 * Theme tokens for a shadow root.
 *
 * Custom properties inherit across the shadow boundary, so the page's `--dm-*` theme
 * tokens are already set inside every shadow root; a component's own styles give their
 * fallbacks at the point of use (`var(--dm-primary, #6495ED)`).
 *
 * This used to return `:host { --dm-primary: var(--dm-primary, #6495ED); ... }`. A
 * property that refers to itself is a cycle, which makes it invalid at computed-value
 * time - so inside every shadow root those tokens were reset, and each component drew
 * its hard-coded fallback colour whatever the theme (measured in Chrome under
 * ocean-dark: --dm-primary #48cae4 on the page, rgb(79, 70, 229) on a badge).
 * Kept as an empty hook so callers that concatenate it still work.
 *
 * @returns {string}
 */
export function getThemeVariables(): string;
/**
 * Base HTMLElement class that registered Domma components extend.
 * Provides Shadow DOM initialisation, options from attributes, tracked event listeners,
 * and programmatic control.
 */
export class DommaElement extends HTMLElement {
    /** Default options, merged under the element's attributes. @type {Record<string, any>} */
    static defaults: Record<string, any>;
    /** @returns {string[]} */
    static get observedAttributes(): string[];
    /** @protected @type {{element: EventTarget, event: string, handler: EventListenerOrEventListenerObject, options?: boolean|AddEventListenerOptions}[]} */
    protected _eventHandlers: {
        element: EventTarget;
        event: string;
        handler: EventListenerOrEventListenerObject;
        options?: boolean | AddEventListenerOptions;
    }[];
    /** Current options (defaults, attributes, then setOptions()). @protected @type {Record<string, any>} */
    protected _options: Record<string, any>;
    _initialised: boolean;
    /**
     * Lifecycle: Called when element is added to DOM
     */
    connectedCallback(): void;
    /**
     * Lifecycle: Called when element is removed from DOM
     */
    disconnectedCallback(): void;
    /**
     * Lifecycle: Called when observed attribute changes
     * @param {string} name
     * @param {string|null} oldValue
     * @param {string|null} newValue
     */
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Lifecycle hook called before the initial render (override in subclass).
     * Fired once, before _render() and _bindEvents().
     */
    _onBeforeMount(): void;
    /**
     * Lifecycle hook called after reactive data updates the DOM (override in subclass).
     * Fired every time a model field change triggers a DOM update.
     */
    _onUpdated(): void;
    /**
     * Lifecycle hook called before the element is removed from the DOM (override in subclass).
     * Fired once, before _cleanup().
     */
    _onBeforeUnmount(): void;
    /**
     * Merge attributes with defaults to create options object
     * @returns {Record<string, any>}
     */
    _mergeOptions(): Record<string, any>;
    /**
     * Convert kebab-case attribute to camelCase option
     * @param {string} attr
     * @returns {string}
     */
    _attrToOption(attr: string): string;
    /**
     * Parse attribute value (handle booleans, numbers, JSON)
     * @param {string} value
     * @returns {any}
     */
    _parseAttrValue(value: string): any;
    /**
     * Inject styles into Shadow DOM
     * Includes base CSS variables from parent document
     */
    _injectStyles(): void;
    /**
     * Get component-specific styles (override in subclass)
     * @returns {string}
     */
    _getStyles(): string;
    /**
     * Render component (override in subclass)
     */
    _render(): void;
    /**
     * Bind events (override in subclass)
     */
    _bindEvents(): void;
    /**
     * Add event listener with tracking for cleanup
     * @param {EventTarget} element
     * @param {string} event
     * @param {EventListenerOrEventListenerObject} handler
     * @param {boolean|AddEventListenerOptions} [options]
     */
    _addEventListener(element: EventTarget, event: string, handler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    /**
     * Cleanup event listeners
     */
    _cleanup(): void;
    /**
     * Emit custom event (bubbles, crosses the shadow boundary)
     * @param {string} eventName
     * @param {any} [detail]
     */
    _emit(eventName: string, detail?: any): void;
    /**
     * Set options programmatically (for wrapper compatibility).
     * Merges `newOptions` into the existing options and, if the subclass
     * implements `_applyOptions()`, applies them immediately.
     * @param {Record<string, any>} newOptions - Partial options to merge
     * @returns {this}
     */
    setOptions(newOptions: Record<string, any>): this;
    /**
     * Destroy component: remove tracked event listeners and detach the element from the DOM
     * @returns {void}
     */
    destroy(): void;
}
