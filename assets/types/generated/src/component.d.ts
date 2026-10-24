/**
 * Instances on an element, newest last.
 * @param {Element} element
 * @returns {Component[]}
 */
export function instancesOf(element: Element): Component[];
/**
 * The kind of an instance: a Component's `static componentName`, or a `componentName`
 * on a plain handle (skeleton, avatar) that registered itself.
 * @param {Object} instance
 * @returns {string|undefined}
 */
export function componentNameOf(instance: any): string | undefined;
/**
 * The newest instance on an element, optionally of one component kind.
 * @param {Element} element
 * @param {string} [name] - componentName, e.g. 'slideover'
 * @returns {Component|null}
 */
export function instanceOf(element: Element, name?: string): Component | null;
/**
 * Add an instance to the registry. Component does this itself; factories whose objects
 * are not Components (wrappers, handles) call it so E.get finds them too.
 * @param {Element} element
 * @param {Object} instance
 */
export function register(element: Element, instance: any): void;
/**
 * @param {Element} element
 * @param {Object} instance
 */
export function unregister(element: Element, instance: any): void;
export default Component;
/**
 * A component event handler: gets the same arguments as the matching `onX` option.
 * Returning false from a handler of a `before...` event cancels it.
 */
export type ComponentEventHandler = (...args: any[]) => any;
/**
 * The instance type every component shares (the Component base class).
 */
export type ComponentInstance = Component;
/**
 * A component event handler: gets the same arguments as the matching `onX` option.
 * Returning false from a handler of a `before...` event cancels it.
 * @typedef {(...args: any[]) => any} ComponentEventHandler
 */
/**
 * The instance type every component shares (the Component base class).
 * @typedef {Component} ComponentInstance
 */
declare class Component {
    /** Used in `dm:<componentName>:<event>`. Subclasses set it - class names do not survive minification. */
    static componentName: string;
    /**
     * @param {string|Element|null} [selector] - CSS selector or the host element
     * @param {Record<string, any>} [options]
     */
    constructor(selector?: string | Element | null, options?: Record<string, any>);
    /** The DOM element this component is attached to. @type {HTMLElement|null} */
    element: HTMLElement | null;
    /** Component options (defaults merged with what was passed). @type {Record<string, any>} */
    options: Record<string, any>;
    /** @protected @type {{element: EventTarget, event: string, handler: EventListenerOrEventListenerObject}[]} */
    protected _eventHandlers: {
        element: EventTarget;
        event: string;
        handler: EventListenerOrEventListenerObject;
    }[];
    /** @protected @type {Record<string, ComponentEventHandler[]>} */
    protected _listeners: Record<string, ComponentEventHandler[]>;
    /**
     * Listen for a component event. The handler gets the same arguments as the matching
     * `onX` option. Returning false from a handler of a `before...` event cancels it.
     * @param {string} event - Event name, e.g. 'open', 'change', 'beforeclose'
     * @param {ComponentEventHandler} handler
     * @returns {this}
     */
    on(event: string, handler: ComponentEventHandler): this;
    /**
     * Listen once.
     * @param {string} event
     * @param {ComponentEventHandler} handler
     * @returns {this}
     */
    once(event: string, handler: ComponentEventHandler): this;
    /**
     * Stop listening. Without a handler, removes every listener for the event.
     * @param {string} event
     * @param {ComponentEventHandler} [handler]
     * @returns {this}
     */
    off(event: string, handler?: ComponentEventHandler): this;
    /**
     * Call the .on() listeners for an event.
     * @param {string} event
     * @param {...*} args
     * @returns {boolean} false if a listener returned false
     * @protected
     */
    protected _notify(event: string, ...args: any[]): boolean;
    /**
     * .on() listeners plus the `dm:<component>:<event>` DOM event - not the onX option.
     * @param {string} event
     * @param {...*} args
     * @returns {boolean} false if a listener returned false or a DOM listener called preventDefault()
     * @protected
     */
    protected _emit(event: string, ...args: any[]): boolean;
    /**
     * Fire an event the whole way: the `onX` option (called as `this.options.onX(...)` has
     * always been called), then .on() listeners and the DOM event.
     * @param {string} event - e.g. 'change' for onChange, 'beforeClose' or 'beforeclose' for onBeforeClose
     * @param {...*} args
     * @returns {*} the option's return value, or false when anything cancelled
     * @protected
     */
    protected _fire(event: string, ...args: any[]): any;
    /**
     * The onX option for a lower-case event name ('beforeclose' -> onBeforeClose).
     * @protected
     * @param {string} key
     * @returns {*}
     */
    protected _optionFor(key: string): any;
    /**
     * close() without the cancelable `beforeclose` - for destroy() and teardown that must
     * not be refused. Still calls `this.close()` by name, so a patched close runs too.
     * @param {...*} args - passed to close()
     * @returns {*} close()'s return value
     * @protected
     */
    protected _forcedClose(...args: any[]): any;
    _forceClose: boolean;
    /**
     * The cancelable `beforeclose` an overlay's close() asks first. Skipped (true) while
     * `_forcedClose()` runs.
     * @param {...*} args - the same arguments onClose gets
     * @returns {boolean} false when a handler refused
     * @protected
     */
    protected _mayClose(...args: any[]): boolean;
    /**
     * Update component options at runtime
     * @param {Record<string, any>} newOptions - New options to merge
     * @returns {this} The component instance for chaining
     */
    setOptions(newOptions: Record<string, any>): this;
    /**
     * addEventListener that destroy() undoes.
     * @protected
     * @param {EventTarget} element
     * @param {string} event
     * @param {EventListenerOrEventListenerObject} handler
     */
    protected _addEventListener(element: EventTarget, event: string, handler: EventListenerOrEventListenerObject): void;
    /**
     * Destroy the component and clean up its event listeners.
     * @returns {void}
     */
    destroy(): void;
}
