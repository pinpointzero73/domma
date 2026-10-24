/**
 * Domma Base Component Class
 * Shared base class for all Domma UI components
 *
 * The conventions every component shares (docs/Components.md, "Conventions"):
 * - `instance.element` is the host element; `E.get(el)` finds the instance.
 * - Events: every `onX` option has a matching event. `instance.on('x', fn)` gets the same
 *   arguments the option does, and `dm:<component>:x` is dispatched on the element
 *   (bubbling, cancelable) with `detail = {instance, args}`.
 * - A `before...` event is cancelable: an `onBeforeX` or `.on()` handler returning false,
 *   or a DOM listener calling preventDefault(), stops the action.
 * - Overlays: open() / close() / toggle() / isOpen() are the names; show() / hide() /
 *   isVisible() are permanent aliases that look open/close up by name at call time, so a
 *   guard patched onto `instance.close` still runs. close() fires a cancelable
 *   `beforeclose` (open(): `beforeopen`); teardown closes through `_forcedClose()`.
 */

/**
 * Every live component, by host element. A WeakMap, so a removed element takes its
 * entries with it. An element can host more than one component (a sortable list in a
 * slideover body), so each entry is a list, newest last.
 */
const registry = new WeakMap();

/**
 * Instances on an element, newest last.
 * @param {Element} element
 * @returns {Component[]}
 */
export function instancesOf(element) {
    return (element && registry.get(element)) || [];
}

/**
 * The kind of an instance: a Component's `static componentName`, or a `componentName`
 * on a plain handle (skeleton, avatar) that registered itself.
 * @param {Object} instance
 * @returns {string|undefined}
 */
export function componentNameOf(instance) {
    return instance?.constructor?.componentName || instance?.componentName;
}

/**
 * The newest instance on an element, optionally of one component kind.
 * @param {Element} element
 * @param {string} [name] - componentName, e.g. 'slideover'
 * @returns {Component|null}
 */
export function instanceOf(element, name) {
    const list = instancesOf(element);
    for (let i = list.length - 1; i >= 0; i--) {
        if (!name || componentNameOf(list[i]) === name) return list[i];
    }
    return null;
}

/**
 * Add an instance to the registry. Component does this itself; factories whose objects
 * are not Components (wrappers, handles) call it so E.get finds them too.
 * @param {Element} element
 * @param {Object} instance
 */
export function register(element, instance) {
    if (!element || typeof element !== 'object') return;
    const list = registry.get(element) || [];
    if (!list.includes(instance)) list.push(instance);
    registry.set(element, list);
}

/**
 * @param {Element} element
 * @param {Object} instance
 */
export function unregister(element, instance) {
    if (!element) return;
    const list = registry.get(element);
    if (!list) return;
    const rest = list.filter(i => i !== instance);
    if (rest.length) registry.set(element, rest);
    else registry.delete(element);
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

class Component {
    /** Used in `dm:<componentName>:<event>`. Subclasses set it - class names do not survive minification. */
    static componentName = 'component';

    constructor(selector, options = {}) {
        this.element = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;
        this.options = {...this.constructor.defaults, ...options};
        this._eventHandlers = [];
        this._listeners = {};

        if (this.element) {
            this.element._dommaComponent = this;
            register(this.element, this);
        }
    }

    /**
     * Listen for a component event. The handler gets the same arguments as the matching
     * `onX` option. Returning false from a handler of a `before...` event cancels it.
     * @param {string} event - Event name, e.g. 'open', 'change', 'beforeclose'
     * @param {Function} handler
     * @returns {this}
     */
    on(event, handler) {
        if (typeof handler === 'function') {
            (this._listeners[event] ||= []).push(handler);
        }
        return this;
    }

    /**
     * Listen once.
     * @param {string} event
     * @param {Function} handler
     * @returns {this}
     */
    once(event, handler) {
        if (typeof handler !== 'function') return this;
        const wrapped = (...args) => {
            this.off(event, wrapped);
            return handler.apply(this, args);
        };
        wrapped._original = handler;
        return this.on(event, wrapped);
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
            ? this._listeners[event].filter(h => h !== handler && h._original !== handler)
            : [];
        return this;
    }

    /**
     * Call the .on() listeners for an event.
     * @param {string} event
     * @param {...*} args
     * @returns {boolean} false if a listener returned false
     * @protected
     */
    _notify(event, ...args) {
        let ok = true;
        for (const handler of [...(this._listeners?.[event] || [])]) {
            if (handler.apply(this, args) === false) ok = false;
        }
        return ok;
    }

    /**
     * .on() listeners plus the `dm:<component>:<event>` DOM event - not the onX option.
     * @param {string} event
     * @param {...*} args
     * @returns {boolean} false if a listener returned false or a DOM listener called preventDefault()
     * @protected
     */
    _emit(event, ...args) {
        const ok = this._notify(event, ...args);
        if (!this.element || typeof CustomEvent === 'undefined' || !this.element.dispatchEvent) return ok;
        const name = this.constructor.componentName;
        const notPrevented = this.element.dispatchEvent(new CustomEvent(`dm:${name}:${event}`, {
            bubbles: true, cancelable: true, detail: {instance: this, args}
        }));
        return ok && notPrevented;
    }

    /**
     * Fire an event the whole way: the `onX` option (called as `this.options.onX(...)` has
     * always been called), then .on() listeners and the DOM event.
     * @param {string} event - e.g. 'change' for onChange, 'beforeClose' or 'beforeclose' for onBeforeClose
     * @param {...*} args
     * @returns {*} the option's return value, or false when anything cancelled
     * @protected
     */
    _fire(event, ...args) {
        const key = event.toLowerCase();
        const option = this._optionFor(key);
        const result = typeof option === 'function' ? option.apply(this.options, args) : undefined;
        const ok = this._emit(key, ...args);
        return result === false || !ok ? false : result;
    }

    /** The onX option for a lower-case event name ('beforeclose' -> onBeforeClose). */
    _optionFor(key) {
        for (const name of Object.keys(this.options)) {
            if (name.length > 2 && name.startsWith('on') && name.slice(2).toLowerCase() === key) {
                return this.options[name];
            }
        }
        return this.options[`on${cap(key)}`];
    }

    /**
     * close() without the cancelable `beforeclose` - for destroy() and teardown that must
     * not be refused. Still calls `this.close()` by name, so a patched close runs too.
     * @param {...*} args - passed to close()
     * @returns {*} close()'s return value
     * @protected
     */
    _forcedClose(...args) {
        this._forceClose = true;
        try {
            return this.close(...args);
        } finally {
            this._forceClose = false;
        }
    }

    /**
     * The cancelable `beforeclose` an overlay's close() asks first. Skipped (true) while
     * `_forcedClose()` runs.
     * @param {...*} args - the same arguments onClose gets
     * @returns {boolean} false when a handler refused
     * @protected
     */
    _mayClose(...args) {
        return this._forceClose || this._fire('beforeclose', ...args) !== false;
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
            if (this.element._dommaComponent === this) delete this.element._dommaComponent;
            unregister(this.element, this);
        }
    }
}

export default Component;
