/**
 * Base class for all Domma Web Components
 * Provides common functionality: options handling, theming, event management
 */
// Outside a browser (SSR, Node, tests without a DOM) there is no HTMLElement; an empty base
// keeps the import from throwing, and registerComponents() has no customElements to define into.
/** @type {typeof HTMLElement} */
const ElementBase = typeof HTMLElement === 'undefined' ? class {} : HTMLElement;

/**
 * Base HTMLElement class that registered Domma components extend.
 * Provides Shadow DOM initialisation, options from attributes, tracked event listeners,
 * and programmatic control.
 */
export class DommaElement extends ElementBase {
    /** Default options, merged under the element's attributes. @type {Record<string, any>} */
    static defaults = {};

    // Observed attributes - override in subclasses
    /** @returns {string[]} */
    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();
        /** @protected @type {{element: EventTarget, event: string, handler: EventListenerOrEventListenerObject, options?: boolean|AddEventListenerOptions}[]} */
        this._eventHandlers = [];
        /** Current options (defaults, attributes, then setOptions()). @protected @type {Record<string, any>} */
        this._options = {};
        this._initialised = false;

        // Create Shadow DOM
        this.attachShadow({ mode: 'open' });
    }

    /**
     * Lifecycle: Called when element is added to DOM
     */
    connectedCallback() {
        if (!this._initialised) {
            // Options set on the element before it was added to the page (a factory setting
            // `buttons`, say) are kept over the defaults and attributes, not thrown away.
            this._options = {...this._mergeOptions(), ...this._options};
            this._onBeforeMount?.();
            this._injectStyles();
            this._render();
            this._bindEvents();
            this._initialised = true;
        }
        this._onConnect?.();
    }

    /**
     * Lifecycle: Called when element is removed from DOM
     */
    disconnectedCallback() {
        this._onBeforeUnmount?.();
        this._cleanup();
        this._onDisconnect?.();
    }

    /**
     * Lifecycle: Called when observed attribute changes
     * @param {string} name
     * @param {string|null} oldValue
     * @param {string|null} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this._initialised) {
            this._options[this._attrToOption(name)] = this._parseAttrValue(newValue);
            this._onAttributeChange?.(name, oldValue, newValue);
        }
    }

    /**
     * Lifecycle hook called before the initial render (override in subclass).
     * Fired once, before _render() and _bindEvents().
     */
    _onBeforeMount() {}

    /**
     * Lifecycle hook called after reactive data updates the DOM (override in subclass).
     * Fired every time a model field change triggers a DOM update.
     */
    _onUpdated() {}

    /**
     * Lifecycle hook called before the element is removed from the DOM (override in subclass).
     * Fired once, before _cleanup().
     */
    _onBeforeUnmount() {}

    /**
     * Merge attributes with defaults to create options object
     * @returns {Record<string, any>}
     */
    _mergeOptions() {
        const options = { ...this.constructor.defaults };

        // Parse attributes into options
        for (const attr of this.attributes) {
            const optName = this._attrToOption(attr.name);
            options[optName] = this._parseAttrValue(attr.value);
        }

        return options;
    }

    /**
     * Convert kebab-case attribute to camelCase option
     * @param {string} attr
     * @returns {string}
     */
    _attrToOption(attr) {
        return attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    }

    /**
     * Parse attribute value (handle booleans, numbers, JSON)
     * @param {string} value
     * @returns {any}
     */
    _parseAttrValue(value) {
        if (value === '' || value === 'true') return true;
        if (value === 'false') return false;
        if (!isNaN(value) && value !== '') return Number(value);
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    /**
     * Inject styles into Shadow DOM
     * Includes base CSS variables from parent document
     */
    _injectStyles() {
        const style = document.createElement('style');
        style.textContent = this._getStyles();
        this.shadowRoot.appendChild(style);
    }

    /**
     * Get component-specific styles (override in subclass)
     * @returns {string}
     */
    _getStyles() {
        return this.constructor.styles || '';
    }

    /**
     * Render component (override in subclass)
     */
    _render() {
        // Override in subclass
    }

    /**
     * Bind events (override in subclass)
     */
    _bindEvents() {
        // Override in subclass
    }

    /**
     * Add event listener with tracking for cleanup
     * @param {EventTarget} element
     * @param {string} event
     * @param {EventListenerOrEventListenerObject} handler
     * @param {boolean|AddEventListenerOptions} [options]
     */
    _addEventListener(element, event, handler, options) {
        element.addEventListener(event, handler, options);
        this._eventHandlers.push({ element, event, handler, options });
    }

    /**
     * Cleanup event listeners
     */
    _cleanup() {
        for (const { element, event, handler, options } of this._eventHandlers) {
            element.removeEventListener(event, handler, options);
        }
        this._eventHandlers = [];
    }

    /**
     * Emit custom event (bubbles, crosses the shadow boundary)
     * @param {string} eventName
     * @param {any} [detail]
     */
    _emit(eventName, detail = {}) {
        this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            composed: true, // Crosses shadow DOM boundary
            detail
        }));
    }

    /**
     * Set options programmatically (for wrapper compatibility).
     * Merges `newOptions` into the existing options and, if the subclass
     * implements `_applyOptions()`, applies them immediately.
     * @param {Record<string, any>} newOptions - Partial options to merge
     * @returns {this}
     */
    setOptions(newOptions) {
        this._options = { ...this._options, ...newOptions };
        if (typeof this._applyOptions === 'function') {
            this._applyOptions();
        }
        return this;
    }

    /**
     * Destroy component: remove tracked event listeners and detach the element from the DOM
     * @returns {void}
     */
    destroy() {
        this._cleanup();
        this.remove();
    }
}

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
export function getThemeVariables() {
    return '';
}
