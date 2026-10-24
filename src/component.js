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
        this._listeners = {};

        if (this.element) {
            this.element._dommaComponent = this;
        }
    }

    /**
     * Listen for a component event (fired through _emit).
     * @param {string} event - Event name, e.g. 'open'
     * @param {Function} handler - Called with the event detail
     * @returns {this}
     */
    on(event, handler) {
        if (typeof handler === 'function') {
            (this._listeners[event] ||= []).push(handler);
        }
        return this;
    }

    /**
     * Stop listening. Without a handler, removes every listener for the event.
     * @param {string} event
     * @param {Function} [handler]
     * @returns {this}
     */
    off(event, handler) {
        if (!this._listeners[event]) return this;
        this._listeners[event] = handler
            ? this._listeners[event].filter(h => h !== handler)
            : [];
        return this;
    }

    /**
     * Fire an event to .on() listeners and as a bubbling `dm:<event>` DOM event on the element.
     * @param {string} event
     * @param {*} [detail]
     * @returns {boolean} false if a DOM listener called preventDefault()
     * @protected
     */
    _emit(event, detail) {
        for (const handler of [...(this._listeners[event] || [])]) {
            handler.call(this, detail);
        }
        if (!this.element || typeof CustomEvent === 'undefined') return true;
        return this.element.dispatchEvent(new CustomEvent(`dm:${event}`, {
            bubbles: true, cancelable: true, detail
        }));
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
        this._listeners = {};
        if (this.element) {
            delete this.element._dommaComponent;
        }
    }
}

export default Component;
