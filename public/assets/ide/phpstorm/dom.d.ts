/**
 * Domma DOM Module - TypeScript Declarations
 * jQuery-compatible DOM manipulation with chainable API
 */

export interface Offset {
    top: number;
    left: number;
}

export interface Position {
    top: number;
    left: number;
}

export interface AnimationProperties {
    [property: string]: string | number;
}

export type Duration = number | 'fast' | 'slow';

export type FilterFunction = (this: HTMLElement, index: number, element: HTMLElement) => boolean;
export type ClassFunction = (this: HTMLElement, index: number, currentClass: string) => string;
export type ContentFunction = (this: HTMLElement, index: number, currentContent: string) => string | HTMLElement | DommaCollection;
export type WrapperFunction = (this: HTMLElement, index: number) => string | HTMLElement;
export type ValueFunction = (this: HTMLElement, index: number, currentValue: number) => number | string;
export type EventHandler = (this: HTMLElement, event: Event) => void;

/**
 * DommaCollection - jQuery-compatible chainable DOM collection
 */
export declare class DommaCollection {
    /** Array of matched elements */
    elements: HTMLElement[];
    /** Number of matched elements */
    length: number;

    constructor(selector: string | HTMLElement | NodeList | HTMLCollection | HTMLElement[] | DommaCollection, context?: Document | HTMLElement);

    // ============================================
    // Traversal Methods (22)
    // ============================================

    /** Get descendants matching selector */
    find(selector: string): DommaCollection;

    /** Get immediate children, optionally filtered by selector */
    children(selector?: string): DommaCollection;

    /** Get parent of each element, optionally filtered by selector */
    parent(selector?: string): DommaCollection;

    /** Get all ancestors, optionally filtered by selector */
    parents(selector?: string): DommaCollection;

    /** Get closest ancestor matching selector */
    closest(selector: string): DommaCollection;

    /** Get siblings, optionally filtered by selector */
    siblings(selector?: string): DommaCollection;

    /** Get next sibling, optionally filtered by selector */
    next(selector?: string): DommaCollection;

    /** Get all following siblings, optionally filtered by selector */
    nextAll(selector?: string): DommaCollection;

    /** Get previous sibling, optionally filtered by selector */
    prev(selector?: string): DommaCollection;

    /** Get all preceding siblings, optionally filtered by selector */
    prevAll(selector?: string): DommaCollection;

    /** Get first element in collection */
    first(): DommaCollection;

    /** Get last element in collection */
    last(): DommaCollection;

    /** Get element at index (supports negative indices) */
    eq(index: number): DommaCollection;

    /** Get raw element at index, or all elements if no index */
    get(): HTMLElement[];
    get(index: number): HTMLElement | undefined;

    /** Filter elements by selector or function */
    filter(selector: string): DommaCollection;
    filter(fn: FilterFunction): DommaCollection;

    /** Remove elements matching selector from collection */
    not(selector: string): DommaCollection;
    not(fn: FilterFunction): DommaCollection;

    /** Check if any element matches selector */
    is(selector: string): boolean;

    /** Filter elements that have descendants matching selector */
    has(selector: string): DommaCollection;

    /** Add elements to the collection */
    add(selector: string | HTMLElement | DommaCollection): DommaCollection;

    /** Get children including text nodes */
    contents(): DommaCollection;

    /** Convert to array of elements */
    toArray(): HTMLElement[];

    /** Get index of element in collection or in parent */
    index(): number;
    index(selector: string): number;
    index(element: HTMLElement): number;

    // ============================================
    // Content Methods (4)
    // ============================================

    /** Iterate over each element */
    each(callback: (this: HTMLElement, index: number, element: HTMLElement) => void): DommaCollection;

    /** Get inner HTML of first element */
    html(): string;
    /** Set inner HTML of all elements */
    html(content: string): DommaCollection;

    /** Get combined text content of all elements */
    text(): string;
    /** Set text content of all elements */
    text(content: string): DommaCollection;

    /** Get value of first form element */
    val(): string | string[] | undefined;
    /** Set value of all form elements */
    val(value: string | string[]): DommaCollection;

    // ============================================
    // Attribute Methods (6)
    // ============================================

    /** Get attribute value */
    attr(name: string): string | undefined;
    /** Set attribute value */
    attr(name: string, value: string): DommaCollection;
    /** Set multiple attributes */
    attr(attributes: Record<string, string>): DommaCollection;

    /** Remove attribute(s) - space-separated */
    removeAttr(name: string): DommaCollection;

    /** Get property value */
    prop(name: string): any;
    /** Set property value */
    prop(name: string, value: any): DommaCollection;
    /** Set multiple properties */
    prop(properties: Record<string, any>): DommaCollection;

    /** Remove property */
    removeProp(name: string): DommaCollection;

    /** Get all data attributes */
    data(): Record<string, string>;
    /** Get data attribute value */
    data(key: string): string | undefined;
    /** Set data attribute value */
    data(key: string, value: any): DommaCollection;
    /** Set multiple data attributes */
    data(data: Record<string, any>): DommaCollection;

    /** Remove data attribute */
    removeData(key: string): DommaCollection;

    // ============================================
    // CSS/Class Methods (5)
    // ============================================

    /** Get computed CSS property value */
    css(property: string): string;
    /** Set CSS property value */
    css(property: string, value: string | number): DommaCollection;
    /** Set multiple CSS properties */
    css(properties: Record<string, string | number>): DommaCollection;

    /** Add class(es) - space-separated */
    addClass(className: string): DommaCollection;
    addClass(fn: ClassFunction): DommaCollection;

    /** Remove class(es) - space-separated, or all if no argument */
    removeClass(): DommaCollection;
    removeClass(className: string): DommaCollection;
    removeClass(fn: ClassFunction): DommaCollection;

    /** Toggle class(es) */
    toggleClass(className: string, state?: boolean): DommaCollection;
    toggleClass(fn: (this: HTMLElement, index: number, currentClass: string, state?: boolean) => string, state?: boolean): DommaCollection;

    /** Check if any element has class */
    hasClass(className: string): boolean;

    // ============================================
    // DOM Manipulation (16)
    // ============================================

    /** Append content to each element */
    append(content: string | HTMLElement | DommaCollection): DommaCollection;
    append(fn: ContentFunction): DommaCollection;

    /** Prepend content to each element */
    prepend(content: string | HTMLElement | DommaCollection): DommaCollection;
    prepend(fn: ContentFunction): DommaCollection;

    /** Insert content after each element */
    after(content: string | HTMLElement | DommaCollection): DommaCollection;
    after(fn: ContentFunction): DommaCollection;

    /** Insert content before each element */
    before(content: string | HTMLElement | DommaCollection): DommaCollection;
    before(fn: ContentFunction): DommaCollection;

    /** Append elements to target */
    appendTo(target: string | HTMLElement | DommaCollection): DommaCollection;

    /** Prepend elements to target */
    prependTo(target: string | HTMLElement | DommaCollection): DommaCollection;

    /** Insert elements after target */
    insertAfter(target: string | HTMLElement | DommaCollection): DommaCollection;

    /** Insert elements before target */
    insertBefore(target: string | HTMLElement | DommaCollection): DommaCollection;

    /** Wrap each element with structure */
    wrap(wrapper: string | HTMLElement): DommaCollection;
    wrap(fn: WrapperFunction): DommaCollection;

    /** Wrap all elements together with structure */
    wrapAll(wrapper: string | HTMLElement): DommaCollection;

    /** Wrap inner contents of each element */
    wrapInner(wrapper: string | HTMLElement): DommaCollection;
    wrapInner(fn: WrapperFunction): DommaCollection;

    /** Remove parent wrapper from each element */
    unwrap(selector?: string): DommaCollection;

    /** Remove elements from DOM */
    remove(selector?: string): DommaCollection;

    /** Remove elements from DOM (alias for remove) */
    detach(): DommaCollection;

    /** Remove all children from elements */
    empty(): DommaCollection;

    /** Clone elements */
    clone(deep?: boolean): DommaCollection;

    /** Replace each element with content */
    replaceWith(content: string | HTMLElement | DommaCollection): DommaCollection;
    replaceWith(fn: ContentFunction): DommaCollection;

    /** Replace target with elements */
    replaceAll(target: string | HTMLElement | DommaCollection): DommaCollection;

    // ============================================
    // Event Methods (22+)
    // ============================================

    /** Attach event handler */
    on(event: string, handler: EventHandler): DommaCollection;
    /** Attach delegated event handler */
    on(event: string, selector: string, handler: EventHandler): DommaCollection;

    /** Remove event handler */
    off(event?: string, handler?: EventHandler): DommaCollection;
    /** Remove delegated event handler */
    off(event: string, selector: string, handler?: EventHandler): DommaCollection;

    /** Attach handler that executes once */
    one(event: string, handler: EventHandler): DommaCollection;
    one(event: string, selector: string, handler: EventHandler): DommaCollection;

    /** Trigger event on elements */
    trigger(event: string, data?: any): DommaCollection;

    /** Trigger native event */
    triggerNative(eventType: string): DommaCollection;

    // Event shortcuts
    click(): DommaCollection;
    click(handler: EventHandler): DommaCollection;

    dblclick(): DommaCollection;
    dblclick(handler: EventHandler): DommaCollection;

    mousedown(): DommaCollection;
    mousedown(handler: EventHandler): DommaCollection;

    mouseup(): DommaCollection;
    mouseup(handler: EventHandler): DommaCollection;

    mousemove(): DommaCollection;
    mousemove(handler: EventHandler): DommaCollection;

    mouseover(): DommaCollection;
    mouseover(handler: EventHandler): DommaCollection;

    mouseout(): DommaCollection;
    mouseout(handler: EventHandler): DommaCollection;

    mouseenter(): DommaCollection;
    mouseenter(handler: EventHandler): DommaCollection;

    mouseleave(): DommaCollection;
    mouseleave(handler: EventHandler): DommaCollection;

    keydown(): DommaCollection;
    keydown(handler: EventHandler): DommaCollection;

    keyup(): DommaCollection;
    keyup(handler: EventHandler): DommaCollection;

    keypress(): DommaCollection;
    keypress(handler: EventHandler): DommaCollection;

    focus(): DommaCollection;
    focus(handler: EventHandler): DommaCollection;

    blur(): DommaCollection;
    blur(handler: EventHandler): DommaCollection;

    change(): DommaCollection;
    change(handler: EventHandler): DommaCollection;

    select(): DommaCollection;
    select(handler: EventHandler): DommaCollection;

    submit(): DommaCollection;
    submit(handler: EventHandler): DommaCollection;

    scroll(): DommaCollection;
    scroll(handler: EventHandler): DommaCollection;

    resize(): DommaCollection;
    resize(handler: EventHandler): DommaCollection;

    /** Handle mouseenter and mouseleave */
    hover(enterHandler: EventHandler, leaveHandler?: EventHandler): DommaCollection;

    // ============================================
    // Effects/Animation (12)
    // ============================================

    /** Show elements */
    show(duration?: Duration, callback?: (this: HTMLElement) => void): DommaCollection;

    /** Hide elements */
    hide(duration?: Duration, callback?: (this: HTMLElement) => void): DommaCollection;

    /** Toggle visibility */
    toggle(duration?: Duration, callback?: (this: HTMLElement) => void): DommaCollection;

    /** Fade in elements */
    fadeIn(duration?: Duration, callback?: (this: HTMLElement) => void): DommaCollection;

    /** Fade out elements */
    fadeOut(duration?: Duration, callback?: (this: HTMLElement) => void): DommaCollection;

    /** Toggle fade */
    fadeToggle(duration?: Duration, callback?: (this: HTMLElement) => void): DommaCollection;

    /** Fade to specific opacity */
    fadeTo(duration: Duration, opacity: number, callback?: (this: HTMLElement) => void): DommaCollection;

    /** Slide up (hide) */
    slideUp(duration?: Duration, callback?: (this: HTMLElement) => void): DommaCollection;

    /** Slide down (show) */
    slideDown(duration?: Duration, callback?: (this: HTMLElement) => void): DommaCollection;

    /** Toggle slide */
    slideToggle(duration?: Duration, callback?: (this: HTMLElement) => void): DommaCollection;

    /** Animate CSS properties */
    animate(properties: AnimationProperties, duration?: Duration, easing?: string, callback?: (this: HTMLElement) => void): DommaCollection;
    animate(properties: AnimationProperties, duration?: Duration, callback?: (this: HTMLElement) => void): DommaCollection;
    animate(properties: AnimationProperties, callback?: (this: HTMLElement) => void): DommaCollection;

    /** Stop animations */
    stop(): DommaCollection;

    /** Delay next animation - returns Promise */
    delay(duration: number): Promise<DommaCollection>;

    // ============================================
    // Dimensions (11)
    // ============================================

    /** Get width */
    width(): number | undefined;
    /** Set width */
    width(value: number | string): DommaCollection;
    width(fn: ValueFunction): DommaCollection;

    /** Get height */
    height(): number | undefined;
    /** Set height */
    height(value: number | string): DommaCollection;
    height(fn: ValueFunction): DommaCollection;

    /** Get inner width (content + padding) */
    innerWidth(): number | undefined;

    /** Get inner height (content + padding) */
    innerHeight(): number | undefined;

    /** Get outer width (content + padding + border + optional margin) */
    outerWidth(includeMargin?: boolean): number | undefined;

    /** Get outer height (content + padding + border + optional margin) */
    outerHeight(includeMargin?: boolean): number | undefined;

    /** Get offset (position relative to document) */
    offset(): Offset | undefined;
    /** Set offset */
    offset(coords: Partial<Offset>): DommaCollection;

    /** Get position (relative to offset parent) */
    position(): Position | undefined;

    /** Get scroll top position */
    scrollTop(): number | undefined;
    /** Set scroll top position */
    scrollTop(value: number): DommaCollection;

    /** Get scroll left position */
    scrollLeft(): number | undefined;
    /** Set scroll left position */
    scrollLeft(value: number): DommaCollection;

    /** Get offset parent */
    offsetParent(): DommaCollection;
}

/**
 * DOM factory function - creates DommaCollection
 */
export declare function dom(selector: string | HTMLElement | NodeList | HTMLCollection | HTMLElement[] | DommaCollection, context?: Document | HTMLElement): DommaCollection;
