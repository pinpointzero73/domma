/**
 * Domma Base Component Class
 * Shared base class for all Domma UI components
 */

class Component {
    constructor(selector, options = {}) {
        this.element = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;
        this.options = {...this.constructor.defaults, ...options};
        this._eventHandlers = [];

        if (this.element) {
            this.element._dommaComponent = this;
        }
    }

    on(event, handler) {
        if (this.options[event] && typeof this.options[event] === 'function') {
            this.options[event](handler);
        }
    }

    /**
     * Update component options at runtime
     * @param {Object} newOptions - New options to merge
     * @returns {this} The component instance for chaining
     */
    setOptions(newOptions) {
        this.options = {...this.options, ...newOptions};

        // Call _applyOptions if the subclass implements it
        if (typeof this._applyOptions === 'function') {
            this._applyOptions();
        }

        return this;
    }

    _addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this._eventHandlers.push({element, event, handler});
    }

    destroy() {
        for (const {element, event, handler} of this._eventHandlers) {
            element.removeEventListener(event, handler);
        }
        this._eventHandlers = [];
        if (this.element) {
            delete this.element._dommaComponent;
        }
    }
}

export default Component;
