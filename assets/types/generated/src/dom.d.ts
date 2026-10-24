/**
 * Document coordinates of an element (`offset()`).
 * @typedef {object} Offset
 * @property {number} top
 * @property {number} left
 */
/**
 * Coordinates of an element relative to its offset parent (`position()`).
 * @typedef {object} Position
 * @property {number} top
 * @property {number} left
 */
/**
 * CSS properties to animate; numbers are pixels.
 * @typedef {{[property: string]: string | number}} AnimationProperties
 */
/**
 * Animation length in ms, or `'fast'` (200) / `'slow'` (600); anything else is 400.
 * @typedef {number | 'fast' | 'slow'} Duration
 */
/**
 * @typedef {(this: HTMLElement, index: number, element: HTMLElement) => boolean} FilterFunction
 */
/**
 * Returns the class name(s) to add/remove, space-separated.
 * @typedef {(this: HTMLElement, index: number, currentClass: string) => string} ClassFunction
 */
/**
 * Returns the content to insert into one target; receives that target's current inner HTML.
 * @typedef {(this: HTMLElement, index: number, currentContent: string) => string | HTMLElement | DommaCollection} ContentFunction
 */
/**
 * Returns the wrapper for one element.
 * @typedef {(this: HTMLElement, index: number) => string | HTMLElement | DommaCollection} WrapperFunction
 */
/**
 * Returns the new width/height of one element; receives its current one.
 * @typedef {(this: HTMLElement, index: number, currentValue: number) => number | string} ValueFunction
 */
/**
 * An event handler; `this` is the element (the matched descendant for a delegated handler).
 * @template {Event} [E=Event]
 * @typedef {(this: HTMLElement, event: E) => void} EventHandler
 */
/**
 * What `$()` accepts: a CSS selector or an HTML string (`'<li>One</li>'`), a node, a NodeList or
 * HTMLCollection, an array (only its HTMLElements are kept) or another collection.
 * @typedef {string | Node | NodeList | HTMLCollection | Element[] | DommaCollection} DommaSelector
 */
/**
 * Sanitisation options for `html()`.
 * @typedef {object} DommaHtmlOptions
 * @property {boolean} [safe=true] - Sanitise content (true = safe, false = raw - TRUSTED content only)
 * @property {'default'|'strict'|'basic'} [preset='default'] - Sanitiser preset
 * @property {string[]} [allowedTags] - Custom allowed HTML tags (overrides the preset)
 * @property {string[]} [allowedAttrs] - Custom allowed attributes (overrides the preset)
 * @property {boolean} [allowDataAttrs] - Allow data-* attributes
 */
/**
 * jQuery-compatible chainable DOM collection - what `$()` returns.
 * Elements are also reachable by index (`$('li')[0]`, same as `get(0)`).
 */
export class DommaCollection {
    /**
     * @param {DommaSelector} [selector] - CSS selector, HTML string, element(s) or a collection
     * @param {Document | Element | DocumentFragment} [context] - Where to look for a CSS selector (default: document)
     */
    constructor(selector?: DommaSelector, context?: Document | Element | DocumentFragment);
    /**
     * The matched elements.
     * @type {HTMLElement[]}
     */
    elements: HTMLElement[];
    /**
     * Number of matched elements.
     * @type {number}
     */
    length: number;
    /**
     * Get descendants matching selector.
     * @param {string} selector
     * @returns {DommaCollection}
     */
    find(selector: string): DommaCollection;
    /**
     * Get immediate children, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    children(selector?: string): DommaCollection;
    /**
     * Get parent of each element, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    parent(selector?: string): DommaCollection;
    /**
     * Get all ancestors, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    parents(selector?: string): DommaCollection;
    /**
     * Get closest ancestor matching selector.
     * @param {string} selector
     * @returns {DommaCollection}
     */
    closest(selector: string): DommaCollection;
    /**
     * Get siblings, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    siblings(selector?: string): DommaCollection;
    /**
     * Get next sibling, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    next(selector?: string): DommaCollection;
    /**
     * Get all following siblings, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    nextAll(selector?: string): DommaCollection;
    /**
     * Get previous sibling, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    prev(selector?: string): DommaCollection;
    /**
     * Get all preceding siblings, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    prevAll(selector?: string): DommaCollection;
    /**
     * Get first element in collection.
     * @returns {DommaCollection}
     */
    first(): DommaCollection;
    /**
     * Get last element in collection.
     * @returns {DommaCollection}
     */
    last(): DommaCollection;
    /**
     * Get element at index.
     * @param {number} index
     * @returns {DommaCollection}
     */
    eq(index: number): DommaCollection;
    /**
     * Get every element as an array.
     * @overload
     * @returns {HTMLElement[]}
     */
    get(): HTMLElement[];
    /**
     * Get the raw element at index (negative counts from the end).
     * @overload
     * @param {number} index
     * @returns {HTMLElement|undefined}
     */
    get(index: number): HTMLElement | undefined;
    /**
     * Filter elements by selector or function.
     * @param {string|FilterFunction} selector
     * @returns {DommaCollection}
     */
    filter(selector: string | FilterFunction): DommaCollection;
    /**
     * Remove elements matching selector from collection.
     * @param {string|FilterFunction} selector
     * @returns {DommaCollection}
     */
    not(selector: string | FilterFunction): DommaCollection;
    /**
     * Check if any element matches selector.
     * @param {string} selector
     * @returns {boolean}
     */
    is(selector: string): boolean;
    /**
     * Filter elements that have descendants matching selector.
     * @param {string} selector
     * @returns {DommaCollection}
     */
    has(selector: string): DommaCollection;
    /**
     * Add elements to the collection.
     * @param {DommaSelector} selector
     * @returns {DommaCollection}
     */
    add(selector: DommaSelector): DommaCollection;
    /**
     * Get children including text nodes.
     * @returns {DommaCollection}
     */
    contents(): DommaCollection;
    /**
     * Convert to array.
     * @returns {HTMLElement[]}
     */
    toArray(): HTMLElement[];
    /**
     * Index of the first element among its siblings (-1 when it has no parent).
     * @overload
     * @returns {number}
     */
    index(): number;
    /**
     * Index of the first element within the elements matching a selector.
     * @overload
     * @param {string} selector
     * @returns {number}
     */
    index(selector: string): number;
    /**
     * Index of an element within this collection.
     * @overload
     * @param {HTMLElement} element
     * @returns {number}
     */
    index(element: HTMLElement): number;
    /**
     * Iterate over each element.
     * @param {(this: HTMLElement, index: number, element: HTMLElement) => void} callback
     * @returns {this}
     */
    each(callback: (this: HTMLElement, index: number, element: HTMLElement) => void): this;
    /**
     * Get the inner HTML of the first element ('' when the collection is empty).
     * @overload
     * @returns {string}
     */
    html(): string;
    /**
     * Set the inner HTML of every element, sanitised unless `options.safe` is false.
     * @overload
     * @param {string} content - HTML content to set
     * @param {DommaHtmlOptions} [options] - Sanitisation options
     * @returns {this}
     */
    html(content: string, options?: DommaHtmlOptions): this;
    /**
     * Get the combined text content of every element.
     * @overload
     * @returns {string}
     */
    text(): string;
    /**
     * Set the text content of every element.
     * @overload
     * @param {string} content
     * @returns {this}
     */
    text(content: string): this;
    /**
     * Get the value of the first form element: an array for a multiple select, undefined for an unchecked checkbox/radio or an empty collection.
     * @overload
     * @returns {string|string[]|undefined}
     */
    val(): string | string[] | undefined;
    /**
     * Set the value of every form element (checks checkboxes/radios whose value matches; selects options of a multiple select).
     * @overload
     * @param {string|string[]} value
     * @returns {this}
     */
    val(value: string | string[]): this;
    /**
     * Set several attributes on every element.
     * @overload
     * @param {Record<string, string>} attributes
     * @returns {this}
     */
    attr(attributes: Record<string, string>): this;
    /**
     * Get an attribute of the first element (null when absent, undefined when the collection is empty).
     * @overload
     * @param {string} name
     * @returns {string|null|undefined}
     */
    attr(name: string): string | null | undefined;
    /**
     * Set an attribute on every element.
     * @overload
     * @param {string} name
     * @param {string} value
     * @returns {this}
     */
    attr(name: string, value: string): this;
    /**
     * Remove attribute(s) - space-separated names.
     * @param {string} name
     * @returns {this}
     */
    removeAttr(name: string): this;
    /**
     * Set several properties on every element.
     * @overload
     * @param {Record<string, any>} properties
     * @returns {this}
     */
    prop(properties: Record<string, any>): this;
    /**
     * Get a property of the first element.
     * @overload
     * @param {string} name
     * @returns {any}
     */
    prop(name: string): any;
    /**
     * Set a property on every element.
     * @overload
     * @param {string} name
     * @param {any} value
     * @returns {this}
     */
    prop(name: string, value: any): this;
    /**
     * Remove property.
     * @param {string} name
     * @returns {this}
     */
    removeProp(name: string): this;
    /**
     * Get every data attribute of the first element (undefined when the collection is empty).
     * @overload
     * @returns {Record<string, string>|undefined}
     */
    data(): Record<string, string> | undefined;
    /**
     * Set several data attributes on every element.
     * @overload
     * @param {Record<string, any>} data
     * @returns {this}
     */
    data(data: Record<string, any>): this;
    /**
     * Get a data attribute of the first element (camelCase key).
     * @overload
     * @param {string} key
     * @returns {string|undefined}
     */
    data(key: string): string | undefined;
    /**
     * Set a data attribute on every element.
     * @overload
     * @param {string} key
     * @param {any} value
     * @returns {this}
     */
    data(key: string, value: any): this;
    /**
     * Remove data attribute.
     * @param {string} key
     * @returns {this}
     */
    removeData(key: string): this;
    /**
     * Set several CSS properties on every element.
     * @overload
     * @param {Record<string, string|number>} properties
     * @returns {this}
     */
    css(properties: Record<string, string | number>): this;
    /**
     * Get a computed CSS property of the first element ('' when the collection is empty).
     * @overload
     * @param {string} property
     * @returns {string}
     */
    css(property: string): string;
    /**
     * Set a CSS property on every element.
     * @overload
     * @param {string} property
     * @param {string|number} value
     * @returns {this}
     */
    css(property: string, value: string | number): this;
    /**
     * Add class(es) - space-separated.
     * @param {string|ClassFunction} className
     * @returns {this}
     */
    addClass(className: string | ClassFunction): this;
    /**
     * Remove class(es) - space-separated, or every class when no argument is given.
     * @param {string|ClassFunction} [className]
     * @returns {this}
     */
    removeClass(className?: string | ClassFunction): this;
    /**
     * Toggle class(es).
     * @param {string|((this: HTMLElement, index: number, currentClass: string, state?: boolean) => string)} className
     * @param {boolean} [state]
     * @returns {this}
     */
    toggleClass(className: string | ((this: HTMLElement, index: number, currentClass: string, state?: boolean) => string), state?: boolean): this;
    /**
     * Check if any element has class.
     * @param {string} className
     * @returns {boolean}
     */
    hasClass(className: string): boolean;
    /**
     * Append content to each element.
     *
     * An element or collection is **moved** into place, so the node you built
     * is the node in the page and any handler bound to it beforehand still
     * fires. A markup string is parsed fresh for each target. Appending into
     * several targets at once copies for all but the last - see `_getNodes`.
     *
     * @param {string|HTMLElement|DommaCollection|ContentFunction} content
     * @returns {this}
     */
    append(content: string | HTMLElement | DommaCollection | ContentFunction): this;
    /**
     * Prepend content to each element.
     * @param {string|HTMLElement|DommaCollection|ContentFunction} content
     * @returns {this}
     */
    prepend(content: string | HTMLElement | DommaCollection | ContentFunction): this;
    /**
     * Insert content after each element.
     * @param {string|HTMLElement|DommaCollection|ContentFunction} content
     * @returns {this}
     */
    after(content: string | HTMLElement | DommaCollection | ContentFunction): this;
    /**
     * Insert content before each element.
     * @param {string|HTMLElement|DommaCollection|ContentFunction} content
     * @returns {this}
     */
    before(content: string | HTMLElement | DommaCollection | ContentFunction): this;
    /**
     * Append elements to target.
     * @param {DommaSelector} target
     * @returns {this}
     */
    appendTo(target: DommaSelector): this;
    /**
     * Prepend elements to target.
     * @param {DommaSelector} target
     * @returns {this}
     */
    prependTo(target: DommaSelector): this;
    /**
     * Insert elements after target.
     * @param {DommaSelector} target
     * @returns {this}
     */
    insertAfter(target: DommaSelector): this;
    /**
     * Insert elements before target.
     * @param {DommaSelector} target
     * @returns {this}
     */
    insertBefore(target: DommaSelector): this;
    /**
     * Wrap each element with structure.
     * @param {string|HTMLElement|DommaCollection|WrapperFunction} wrapper
     * @returns {this}
     */
    wrap(wrapper: string | HTMLElement | DommaCollection | WrapperFunction): this;
    /**
     * Wrap all elements together with structure.
     * @param {string|HTMLElement|DommaCollection} wrapper
     * @returns {this}
     */
    wrapAll(wrapper: string | HTMLElement | DommaCollection): this;
    /**
     * Wrap inner contents of each element.
     * @param {string|HTMLElement|DommaCollection|WrapperFunction} wrapper
     * @returns {this}
     */
    wrapInner(wrapper: string | HTMLElement | DommaCollection | WrapperFunction): this;
    /**
     * Remove parent wrapper from each element.
     * @param {string} [selector]
     * @returns {this}
     */
    unwrap(selector?: string): this;
    /**
     * Remove elements from DOM.
     * @param {string} [selector]
     * @returns {this}
     */
    remove(selector?: string): this;
    /**
     * Remove elements from DOM (alias for remove, simplified).
     * @returns {this}
     */
    detach(): this;
    /**
     * Remove all children from elements.
     * @returns {this}
     */
    empty(): this;
    /**
     * Clone elements.
     * @param {boolean} [deep=true]
     * @returns {DommaCollection}
     */
    clone(deep?: boolean): DommaCollection;
    /**
     * Replace each element with content.
     * @param {string|HTMLElement|DommaCollection|ContentFunction} content
     * @returns {this}
     */
    replaceWith(content: string | HTMLElement | DommaCollection | ContentFunction): this;
    /**
     * Replace target with elements.
     * @param {DommaSelector} target
     * @returns {this}
     */
    replaceAll(target: DommaSelector): this;
    /**
     * Resolve insertion content to the nodes to insert into one target.
     *
     * An existing node is **moved**, not copied, which is what jQuery does and
     * what callers assume: `$('<input>').on('change', fn)` followed by an
     * append has to put *that* input in the page, or the handler is bound to a
     * node nobody can click and the state set with `prop()` is lost with it.
     * Copying was silent - the markup looked right and nothing threw.
     *
     * Only a collection with more than one target needs copies, because a node
     * cannot be in two places. The original then goes to the **last** target,
     * as in jQuery, and the earlier ones get `cloneNode(true)`.
     *
     * `cloneNode` copies attributes and descendants, never listeners or
     * properties, so a handler bound before a *multi-target* insert still only
     * survives on the last one. Bind after inserting, or delegate from a
     * container, when inserting into several targets at once.
     *
     * @param {string|HTMLElement|DommaCollection|Function} content
     * @param {number} index - Index of the target being filled
     * @param {HTMLElement} element - The target being filled
     * @param {boolean} [isLast=true] - Whether this is the final target, and so
     *   receives the original nodes rather than copies
     * @returns {Node[]}
     * @private
     */
    private _getNodes;
    /**
     * @param {string|HTMLElement|DommaCollection|WrapperFunction} wrapper
     * @param {number} index
     * @param {HTMLElement} element
     * @returns {Node}
     * @private
     */
    private _getWrapper;
    /**
     * Attach a handler for a DOM event (the event object is typed from its name).
     * @template {keyof HTMLElementEventMap} K
     * @overload
     * @param {K} event
     * @param {EventHandler<HTMLElementEventMap[K]>} handler
     * @returns {this}
     */
    on<K extends keyof HTMLElementEventMap>(event: K, handler: EventHandler<HTMLElementEventMap[K]>): this;
    /**
     * Attach a handler for one or more space-separated events.
     * @template {Event} [E=Event]
     * @overload
     * @param {string} event
     * @param {EventHandler<E>} handler
     * @returns {this}
     */
    on<E extends Event = Event>(event: string, handler: EventHandler<E>): this;
    /**
     * Attach a delegated handler: it runs for events from descendants matching `selector`, with `this` set to the match.
     * @template {keyof HTMLElementEventMap} K
     * @overload
     * @param {K} event
     * @param {string} selector
     * @param {EventHandler<HTMLElementEventMap[K]>} handler
     * @returns {this}
     */
    on<K extends keyof HTMLElementEventMap>(event: K, selector: string, handler: EventHandler<HTMLElementEventMap[K]>): this;
    /**
     * Attach a delegated handler for one or more space-separated events.
     * @template {Event} [E=Event]
     * @overload
     * @param {string} event
     * @param {string} selector
     * @param {EventHandler<E>} handler
     * @returns {this}
     */
    on<E extends Event = Event>(event: string, selector: string, handler: EventHandler<E>): this;
    /**
     * Remove a handler (nothing is removed without both an event and a handler).
     * @overload
     * @param {string} [event]
     * @param {EventHandler<any>} [handler]
     * @returns {this}
     */
    off(event?: string, handler?: EventHandler<any>): this;
    /**
     * Remove delegated handlers bound with this selector (all of them when no handler is given).
     * @overload
     * @param {string} event
     * @param {string} selector
     * @param {EventHandler<any>} [handler]
     * @returns {this}
     */
    off(event: string, selector: string, handler?: EventHandler<any>): this;
    /**
     * Attach a handler that runs once.
     * @template {keyof HTMLElementEventMap} K
     * @overload
     * @param {K} event
     * @param {EventHandler<HTMLElementEventMap[K]>} handler
     * @returns {this}
     */
    one<K extends keyof HTMLElementEventMap>(event: K, handler: EventHandler<HTMLElementEventMap[K]>): this;
    /**
     * Attach a handler that runs once.
     * @template {Event} [E=Event]
     * @overload
     * @param {string} event
     * @param {EventHandler<E>} handler
     * @returns {this}
     */
    one<E extends Event = Event>(event: string, handler: EventHandler<E>): this;
    /**
     * Attach a delegated handler that runs once.
     * @template {keyof HTMLElementEventMap} K
     * @overload
     * @param {K} event
     * @param {string} selector
     * @param {EventHandler<HTMLElementEventMap[K]>} handler
     * @returns {this}
     */
    one<K extends keyof HTMLElementEventMap>(event: K, selector: string, handler: EventHandler<HTMLElementEventMap[K]>): this;
    /**
     * Attach a delegated handler that runs once.
     * @template {Event} [E=Event]
     * @overload
     * @param {string} event
     * @param {string} selector
     * @param {EventHandler<E>} handler
     * @returns {this}
     */
    one<E extends Event = Event>(event: string, selector: string, handler: EventHandler<E>): this;
    /**
     * Trigger event on elements: a bubbling, cancelable CustomEvent with `data` as its `detail`.
     * @param {string} event
     * @param {any} [data]
     * @returns {this}
     */
    trigger(event: string, data?: any): this;
    /**
     * Trigger native event.
     * @param {string} eventType
     * @returns {this}
     */
    triggerNative(eventType: string): this;
    /**
     * Trigger a native click.
     * @overload
     * @returns {this}
     */
    click(): this;
    /**
     * Attach a `click` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    click(handler: EventHandler<MouseEvent>): this;
    /**
     * Trigger a `dblclick` event.
     * @overload
     * @returns {this}
     */
    dblclick(): this;
    /**
     * Attach a `dblclick` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    dblclick(handler: EventHandler<MouseEvent>): this;
    /**
     * Trigger a `mousedown` event.
     * @overload
     * @returns {this}
     */
    mousedown(): this;
    /**
     * Attach a `mousedown` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    mousedown(handler: EventHandler<MouseEvent>): this;
    /**
     * Trigger a `mouseup` event.
     * @overload
     * @returns {this}
     */
    mouseup(): this;
    /**
     * Attach a `mouseup` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    mouseup(handler: EventHandler<MouseEvent>): this;
    /**
     * Trigger a `mousemove` event.
     * @overload
     * @returns {this}
     */
    mousemove(): this;
    /**
     * Attach a `mousemove` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    mousemove(handler: EventHandler<MouseEvent>): this;
    /**
     * Trigger a `mouseover` event.
     * @overload
     * @returns {this}
     */
    mouseover(): this;
    /**
     * Attach a `mouseover` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    mouseover(handler: EventHandler<MouseEvent>): this;
    /**
     * Trigger a `mouseout` event.
     * @overload
     * @returns {this}
     */
    mouseout(): this;
    /**
     * Attach a `mouseout` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    mouseout(handler: EventHandler<MouseEvent>): this;
    /**
     * Trigger a `mouseenter` event.
     * @overload
     * @returns {this}
     */
    mouseenter(): this;
    /**
     * Attach a `mouseenter` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    mouseenter(handler: EventHandler<MouseEvent>): this;
    /**
     * Trigger a `mouseleave` event.
     * @overload
     * @returns {this}
     */
    mouseleave(): this;
    /**
     * Attach a `mouseleave` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    mouseleave(handler: EventHandler<MouseEvent>): this;
    /**
     * Trigger a `keydown` event.
     * @overload
     * @returns {this}
     */
    keydown(): this;
    /**
     * Attach a `keydown` handler.
     * @overload
     * @param {EventHandler<KeyboardEvent>} handler
     * @returns {this}
     */
    keydown(handler: EventHandler<KeyboardEvent>): this;
    /**
     * Trigger a `keyup` event.
     * @overload
     * @returns {this}
     */
    keyup(): this;
    /**
     * Attach a `keyup` handler.
     * @overload
     * @param {EventHandler<KeyboardEvent>} handler
     * @returns {this}
     */
    keyup(handler: EventHandler<KeyboardEvent>): this;
    /**
     * Trigger a `keypress` event.
     * @overload
     * @returns {this}
     */
    keypress(): this;
    /**
     * Attach a `keypress` handler.
     * @overload
     * @param {EventHandler<KeyboardEvent>} handler
     * @returns {this}
     */
    keypress(handler: EventHandler<KeyboardEvent>): this;
    /**
     * Trigger focus on every element.
     * @overload
     * @returns {this}
     */
    focus(): this;
    /**
     * Attach a `focus` handler.
     * @overload
     * @param {EventHandler<FocusEvent>} handler
     * @returns {this}
     */
    focus(handler: EventHandler<FocusEvent>): this;
    /**
     * Trigger blur on every element.
     * @overload
     * @returns {this}
     */
    blur(): this;
    /**
     * Attach a `blur` handler.
     * @overload
     * @param {EventHandler<FocusEvent>} handler
     * @returns {this}
     */
    blur(handler: EventHandler<FocusEvent>): this;
    /**
     * Trigger a `change` event.
     * @overload
     * @returns {this}
     */
    change(): this;
    /**
     * Attach a `change` handler.
     * @overload
     * @param {EventHandler<Event>} handler
     * @returns {this}
     */
    change(handler: EventHandler<Event>): this;
    /**
     * Trigger a `select` event.
     * @overload
     * @returns {this}
     */
    select(): this;
    /**
     * Attach a `select` handler.
     * @overload
     * @param {EventHandler<Event>} handler
     * @returns {this}
     */
    select(handler: EventHandler<Event>): this;
    /**
     * Trigger submit on every form.
     * @overload
     * @returns {this}
     */
    submit(): this;
    /**
     * Attach a `submit` handler.
     * @overload
     * @param {EventHandler<SubmitEvent>} handler
     * @returns {this}
     */
    submit(handler: EventHandler<SubmitEvent>): this;
    /**
     * Trigger a `scroll` event.
     * @overload
     * @returns {this}
     */
    scroll(): this;
    /**
     * Attach a `scroll` handler.
     * @overload
     * @param {EventHandler<Event>} handler
     * @returns {this}
     */
    scroll(handler: EventHandler<Event>): this;
    /**
     * Trigger a `resize` event.
     * @overload
     * @returns {this}
     */
    resize(): this;
    /**
     * Attach a `resize` handler.
     * @overload
     * @param {EventHandler<UIEvent>} handler
     * @returns {this}
     */
    resize(handler: EventHandler<UIEvent>): this;
    /**
     * Handle mouseenter and mouseleave (one handler for both when leaveHandler is omitted).
     * @param {EventHandler<MouseEvent>} enterHandler
     * @param {EventHandler<MouseEvent>} [leaveHandler]
     * @returns {this}
     */
    hover(enterHandler: EventHandler<MouseEvent>, leaveHandler?: EventHandler<MouseEvent>): this;
    /**
     * Show elements.
     * @param {Duration} [duration]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    show(duration?: Duration, callback?: (this: HTMLElement) => void): this;
    /**
     * Hide elements.
     * @param {Duration} [duration]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    hide(duration?: Duration, callback?: (this: HTMLElement) => void): this;
    /**
     * Toggle visibility.
     * @param {Duration} [duration]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    toggle(duration?: Duration, callback?: (this: HTMLElement) => void): this;
    /**
     * Fade in elements.
     * @param {Duration} [duration=400]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    fadeIn(duration?: Duration, callback?: (this: HTMLElement) => void): this;
    /**
     * Fade out elements.
     * @param {Duration} [duration=400]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    fadeOut(duration?: Duration, callback?: (this: HTMLElement) => void): this;
    /**
     * Toggle fade.
     * @param {Duration} [duration=400]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    fadeToggle(duration?: Duration, callback?: (this: HTMLElement) => void): this;
    /**
     * Fade to opacity.
     * @param {Duration} duration
     * @param {number} opacity
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    fadeTo(duration: Duration, opacity: number, callback?: (this: HTMLElement) => void): this;
    /**
     * Slide up (hide).
     * @param {Duration} [duration=400]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    slideUp(duration?: Duration, callback?: (this: HTMLElement) => void): this;
    /**
     * Slide down (show).
     * @param {Duration} [duration=400]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    slideDown(duration?: Duration, callback?: (this: HTMLElement) => void): this;
    /**
     * Toggle slide.
     * @param {Duration} [duration=400]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    slideToggle(duration?: Duration, callback?: (this: HTMLElement) => void): this;
    /**
     * Animate CSS properties (numbers are pixels).
     * @overload
     * @param {AnimationProperties} properties
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    animate(properties: AnimationProperties, callback?: (this: HTMLElement) => void): this;
    /**
     * Animate CSS properties (numbers are pixels).
     * @overload
     * @param {AnimationProperties} properties
     * @param {Duration} duration
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    animate(properties: AnimationProperties, duration: Duration, callback?: (this: HTMLElement) => void): this;
    /**
     * Animate CSS properties (numbers are pixels) with a CSS easing.
     * @overload
     * @param {AnimationProperties} properties
     * @param {Duration} duration
     * @param {string} easing
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    animate(properties: AnimationProperties, duration: Duration, easing: string, callback?: (this: HTMLElement) => void): this;
    /**
     * Stop animations.
     * @returns {this}
     */
    stop(): this;
    /**
     * Delay next animation: resolves with this collection after `duration` ms.
     * @param {number} duration
     * @returns {Promise<this>}
     */
    delay(duration: number): Promise<this>;
    /**
     * @param {Duration} duration
     * @returns {number}
     * @private
     */
    private _getDuration;
    /**
     * Get the rendered width of the first element (undefined when the collection is empty).
     * @overload
     * @returns {number|undefined}
     */
    width(): number | undefined;
    /**
     * Set the width of every element (numbers are pixels).
     * @overload
     * @param {number|string|ValueFunction} value
     * @returns {this}
     */
    width(value: number | string | ValueFunction): this;
    /**
     * Get the rendered height of the first element (undefined when the collection is empty).
     * @overload
     * @returns {number|undefined}
     */
    height(): number | undefined;
    /**
     * Set the height of every element (numbers are pixels).
     * @overload
     * @param {number|string|ValueFunction} value
     * @returns {this}
     */
    height(value: number | string | ValueFunction): this;
    /**
     * Get inner width (content + padding).
     * @returns {number|undefined}
     */
    innerWidth(): number | undefined;
    /**
     * Get inner height (content + padding).
     * @returns {number|undefined}
     */
    innerHeight(): number | undefined;
    /**
     * Get outer width (content + padding + border + optional margin).
     * @param {boolean} [includeMargin=false]
     * @returns {number|undefined}
     */
    outerWidth(includeMargin?: boolean): number | undefined;
    /**
     * Get outer height (content + padding + border + optional margin).
     * @param {boolean} [includeMargin=false]
     * @returns {number|undefined}
     */
    outerHeight(includeMargin?: boolean): number | undefined;
    /**
     * Get the position of the first element relative to the document.
     * @overload
     * @returns {Offset|undefined}
     */
    offset(): Offset | undefined;
    /**
     * Move every element to these document coordinates (static elements become relative).
     * @overload
     * @param {Partial<Offset>} coords
     * @returns {this}
     */
    offset(coords: Partial<Offset>): this;
    /**
     * Get position (relative to offset parent).
     * @returns {Position|undefined}
     */
    position(): Position | undefined;
    /**
     * Get the scroll top position of the first element.
     * @overload
     * @returns {number|undefined}
     */
    scrollTop(): number | undefined;
    /**
     * Set the scroll top position of every element.
     * @overload
     * @param {number} value
     * @returns {this}
     */
    scrollTop(value: number): this;
    /**
     * Get the scroll left position of the first element.
     * @overload
     * @returns {number|undefined}
     */
    scrollLeft(): number | undefined;
    /**
     * Set the scroll left position of every element.
     * @overload
     * @param {number} value
     * @returns {this}
     */
    scrollLeft(value: number): this;
    /**
     * Get offset parent.
     * @returns {DommaCollection}
     */
    offsetParent(): DommaCollection;
}
/**
 * Wrap elements in a DommaCollection.
 * @overload
 * @param {DommaSelector} selector - CSS selector, HTML string, element(s) or a collection
 * @param {Document | Element | DocumentFragment} [context] - Where to look for a CSS selector (default: document)
 * @returns {DommaCollection}
 */
export function dom(selector: DommaSelector, context?: Document | Element | DocumentFragment): DommaCollection;
/**
 * Run a function when the DOM is ready (straight away if it already is).
 * @overload
 * @param {() => void} callback
 * @returns {DommaCollection} An empty collection
 */
export function dom(callback: () => void): DommaCollection;
export function isDomma(value: unknown): value is DommaCollection;
/**
 * Document coordinates of an element (`offset()`).
 */
export type Offset = {
    top: number;
    left: number;
};
/**
 * Coordinates of an element relative to its offset parent (`position()`).
 */
export type Position = {
    top: number;
    left: number;
};
/**
 * CSS properties to animate; numbers are pixels.
 */
export type AnimationProperties = {
    [property: string]: string | number;
};
/**
 * Animation length in ms, or `'fast'` (200) / `'slow'` (600); anything else is 400.
 */
export type Duration = number | "fast" | "slow";
export type FilterFunction = (this: HTMLElement, index: number, element: HTMLElement) => boolean;
/**
 * Returns the class name(s) to add/remove, space-separated.
 */
export type ClassFunction = (this: HTMLElement, index: number, currentClass: string) => string;
/**
 * Returns the content to insert into one target; receives that target's current inner HTML.
 */
export type ContentFunction = (this: HTMLElement, index: number, currentContent: string) => string | HTMLElement | DommaCollection;
/**
 * Returns the wrapper for one element.
 */
export type WrapperFunction = (this: HTMLElement, index: number) => string | HTMLElement | DommaCollection;
/**
 * Returns the new width/height of one element; receives its current one.
 */
export type ValueFunction = (this: HTMLElement, index: number, currentValue: number) => number | string;
/**
 * An event handler; `this` is the element (the matched descendant for a delegated handler).
 */
export type EventHandler<E extends Event = Event> = (this: HTMLElement, event: E) => void;
/**
 * What `$()` accepts: a CSS selector or an HTML string (`'<li>One</li>'`), a node, a NodeList or
 * HTMLCollection, an array (only its HTMLElements are kept) or another collection.
 */
export type DommaSelector = string | Node | NodeList | HTMLCollection | Element[] | DommaCollection;
/**
 * Sanitisation options for `html()`.
 */
export type DommaHtmlOptions = {
    /**
     * - Sanitise content (true = safe, false = raw - TRUSTED content only)
     */
    safe?: boolean;
    /**
     * - Sanitiser preset
     */
    preset?: "default" | "strict" | "basic";
    /**
     * - Custom allowed HTML tags (overrides the preset)
     */
    allowedTags?: string[];
    /**
     * - Custom allowed attributes (overrides the preset)
     */
    allowedAttrs?: string[];
    /**
     * - Allow data-* attributes
     */
    allowDataAttrs?: boolean;
};
