/**
 * Base class for all Domma Web Components
 * Provides common functionality: options handling, theming, event management
 */
export class DommaElement extends HTMLElement {
    static defaults = {};

    // Observed attributes - override in subclasses
    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();
        this._eventHandlers = [];
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
            this._options = this._mergeOptions();
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
     */
    _attrToOption(attr) {
        return attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    }

    /**
     * Parse attribute value (handle booleans, numbers, JSON)
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
     * Emit custom event
     */
    _emit(eventName, detail = {}) {
        this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            composed: true, // Crosses shadow DOM boundary
            detail
        }));
    }

    /**
     * Set options programmatically (for wrapper compatibility)
     */
    setOptions(newOptions) {
        this._options = { ...this._options, ...newOptions };
        if (typeof this._applyOptions === 'function') {
            this._applyOptions();
        }
        return this;
    }

    /**
     * Destroy component
     */
    destroy() {
        this._cleanup();
        this.remove();
    }
}

/**
 * Helper to get CSS variables from host document
 * Enables theme inheritance into Shadow DOM
 */
export function getThemeVariables() {
    return `
        :host {
            --dm-primary: var(--dm-primary, #6495ED);
            --dm-secondary: var(--dm-secondary, #6c757d);
            --dm-success: var(--dm-success, #28a745);
            --dm-danger: var(--dm-danger, #dc3545);
            --dm-warning: var(--dm-warning, #ffc107);
            --dm-info: var(--dm-info, #17a2b8);
            --dm-white: var(--dm-white, #ffffff);
            --dm-gray-100: var(--dm-gray-100, #f8f9fa);
            --dm-gray-200: var(--dm-gray-200, #e9ecef);
            --dm-gray-300: var(--dm-gray-300, #dee2e6);
            --dm-gray-400: var(--dm-gray-400, #ced4da);
            --dm-gray-500: var(--dm-gray-500, #adb5bd);
            --dm-gray-600: var(--dm-gray-600, #6c757d);
            --dm-gray-700: var(--dm-gray-700, #495057);
            --dm-gray-800: var(--dm-gray-800, #343a40);
            --dm-gray-900: var(--dm-gray-900, #212529);
            --dm-radius-sm: var(--dm-radius-sm, 0.25rem);
            --dm-radius-md: var(--dm-radius-md, 0.375rem);
            --dm-radius-lg: var(--dm-radius-lg, 0.5rem);
            --dm-radius-full: var(--dm-radius-full, 9999px);
            --dm-transition-fast: var(--dm-transition-fast, 150ms);
            --dm-transition-normal: var(--dm-transition-normal, 300ms);
            --dm-transition-slow: var(--dm-transition-slow, 500ms);
            --dm-shadow-sm: var(--dm-shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
            --dm-shadow-md: var(--dm-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
            --dm-shadow-lg: var(--dm-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
            --dm-shadow-xl: var(--dm-shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
        }
    `;
}
