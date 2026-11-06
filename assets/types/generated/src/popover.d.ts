export default Popover;
export type PopoverSide = "top" | "bottom" | "left" | "right";
export type PopoverPlacement = PopoverSide | "auto" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end" | "right-start" | "right-end" | "auto-start" | "auto-end";
/**
 * 'click', 'hover', 'focus', 'manual', or several separated by spaces ('hover focus').
 */
export type PopoverTrigger = "click" | "hover" | "focus" | "manual" | (string & {});
/**
 * Text, a DOM node or collection, or a function returning either - called on every open.
 */
export type PopoverContent = string | Node | ArrayLike<Node> | null | ((popover: Popover) => string | Node | ArrayLike<Node> | null);
export type PopoverOptions = {
    /**
     * - Text (default), a Node, or a function returning either; see `html`
     */
    content?: PopoverContent | undefined;
    /**
     * - Heading; empty for none
     */
    title?: PopoverContent | undefined;
    /**
     * - Treat string content/title as HTML, passed through Domma's sanitiser (default: false)
     */
    html?: boolean | undefined;
    /**
     * - 'click' (default), 'hover', 'focus', 'manual', or several separated by spaces
     */
    trigger?: PopoverTrigger | undefined;
    /**
     * - Preferred side and alignment (default: 'bottom')
     */
    placement?: PopoverPlacement | undefined;
    /**
     * - Try the other sides when the preferred one has no room (default: true)
     */
    flip?: boolean | undefined;
    /**
     * - Gap in px, or [crossAxis, mainAxis] (default: 10)
     */
    offset?: number | [number, number] | undefined;
    /**
     * - Show the arrow (default: true)
     */
    arrow?: boolean | undefined;
    /**
     * - Show a close (x) button (default: false)
     */
    dismissible?: boolean | undefined;
    /**
     * - Close on a pointer press or focus outside (default: true)
     */
    closeOnOutside?: boolean | undefined;
    /**
     * - Close on Escape (default: true)
     */
    closeOnEscape?: boolean | undefined;
    /**
     * - One open at a time per group; null = independent (default: 'default')
     */
    group?: string | null | undefined;
    /**
     * - Any CSS width; numbers are px
     */
    width?: string | number | null | undefined;
    /**
     * - Any CSS width; the stylesheet default is 20rem
     */
    maxWidth?: string | number | null | undefined;
    /**
     * - Extra classes on the panel
     */
    className?: string | undefined;
    /**
     * - Panel id (generated when omitted)
     */
    id?: string | null | undefined;
    /**
     * - 'dialog', or 'tooltip' for hover/focus-only triggers (default: auto)
     */
    role?: (string & {}) | "dialog" | "tooltip" | null | undefined;
    /**
     * - Accessible name when there is no title
     */
    ariaLabel?: string | null | undefined;
    /**
     * - Move focus into the panel on open; null = for click popovers
     */
    autoFocus?: boolean | null | undefined;
    /**
     * - Tab cycles inside the panel instead of leaving it, with a focus trap while focus is in it (default: false)
     */
    trapFocus?: boolean | undefined;
    /**
     * - Hover delays in ms (default: {show: 80, hide: 120})
     */
    delay?: number | {
        show?: number;
        hide?: number;
    } | undefined;
    /**
     * - Fade and scale (default: true; skipped under reduced motion)
     */
    animation?: boolean | undefined;
    /**
     * - ms (default: 150)
     */
    animationDuration?: number | undefined;
    /**
     * - Where the panel is placed (default: document.body)
     */
    container?: string | HTMLElement | null | undefined;
    /**
     * - Override the stylesheet's z-index (10045)
     */
    zIndex?: number | null | undefined;
    /**
     * - Before opening; return false to cancel
     */
    onShow?: ((popover: Popover) => boolean | void) | null | undefined;
    /**
     * - After the open transition
     */
    onShown?: ((popover: Popover) => void) | null | undefined;
    /**
     * - Before closing; return false to cancel
     */
    onHide?: ((popover: Popover) => boolean | void) | null | undefined;
    /**
     * - After the panel has been removed
     */
    onHidden?: ((popover: Popover) => void) | null | undefined;
};
/**
 * event.detail of dm:popover:show / shown / hide / hidden (bubbling, fired on the trigger).
 */
export type PopoverEventDetail = {
    instance: Popover;
    args: Popover[];
};
export type PopoverInstance = Popover;
/**
 * `E.popover` - the factory plus its statics: `scan(root)` creates popovers from
 * [data-popover] / [data-popover-content] markup under root and returns the new ones;
 * `closeAll(group)` closes every open popover, or one group's; `getInstance(trigger)` is the
 * popover bound to a trigger; `open()` lists the open popovers, oldest first.
 */
export type PopoverStatic = {
    (trigger: string | HTMLElement | ArrayLike<HTMLElement>, options?: PopoverOptions): Popover;
    scan(root?: string | Element | Document): Popover[];
    closeAll(group?: string | null): void;
    getInstance(trigger: string | HTMLElement): Popover | null;
    open(): Popover[];
};
/** @typedef {'top'|'bottom'|'left'|'right'} PopoverSide */
/**
 * @typedef {PopoverSide|'auto'|'top-start'|'top-end'|'bottom-start'|'bottom-end'|'left-start'|'left-end'|'right-start'|'right-end'|'auto-start'|'auto-end'} PopoverPlacement
 */
/**
 * 'click', 'hover', 'focus', 'manual', or several separated by spaces ('hover focus').
 * @typedef {'click'|'hover'|'focus'|'manual'|(string & {})} PopoverTrigger
 */
/**
 * Text, a DOM node or collection, or a function returning either - called on every open.
 * @typedef {string|Node|ArrayLike<Node>|null|((popover: Popover) => string|Node|ArrayLike<Node>|null)} PopoverContent
 */
/**
 * @typedef {object} PopoverOptions
 * @property {PopoverContent} [content] - Text (default), a Node, or a function returning either; see `html`
 * @property {PopoverContent} [title] - Heading; empty for none
 * @property {boolean} [html] - Treat string content/title as HTML, passed through Domma's sanitiser (default: false)
 * @property {PopoverTrigger} [trigger] - 'click' (default), 'hover', 'focus', 'manual', or several separated by spaces
 * @property {PopoverPlacement} [placement] - Preferred side and alignment (default: 'bottom')
 * @property {boolean} [flip] - Try the other sides when the preferred one has no room (default: true)
 * @property {number|[number, number]} [offset] - Gap in px, or [crossAxis, mainAxis] (default: 10)
 * @property {boolean} [arrow] - Show the arrow (default: true)
 * @property {boolean} [dismissible] - Show a close (x) button (default: false)
 * @property {boolean} [closeOnOutside] - Close on a pointer press or focus outside (default: true)
 * @property {boolean} [closeOnEscape] - Close on Escape (default: true)
 * @property {string|null} [group] - One open at a time per group; null = independent (default: 'default')
 * @property {string|number|null} [width] - Any CSS width; numbers are px
 * @property {string|number|null} [maxWidth] - Any CSS width; the stylesheet default is 20rem
 * @property {string} [className] - Extra classes on the panel
 * @property {string|null} [id] - Panel id (generated when omitted)
 * @property {'dialog'|'tooltip'|(string & {})|null} [role] - 'dialog', or 'tooltip' for hover/focus-only triggers (default: auto)
 * @property {string|null} [ariaLabel] - Accessible name when there is no title
 * @property {boolean|null} [autoFocus] - Move focus into the panel on open; null = for click popovers
 * @property {boolean} [trapFocus] - Tab cycles inside the panel instead of leaving it, with a focus trap while focus is in it (default: false)
 * @property {number|{show?: number, hide?: number}} [delay] - Hover delays in ms (default: {show: 80, hide: 120})
 * @property {boolean} [animation] - Fade and scale (default: true; skipped under reduced motion)
 * @property {number} [animationDuration] - ms (default: 150)
 * @property {string|HTMLElement|null} [container] - Where the panel is placed (default: document.body)
 * @property {number|null} [zIndex] - Override the stylesheet's z-index (10045)
 * @property {((popover: Popover) => boolean|void)|null} [onShow] - Before opening; return false to cancel
 * @property {((popover: Popover) => void)|null} [onShown] - After the open transition
 * @property {((popover: Popover) => boolean|void)|null} [onHide] - Before closing; return false to cancel
 * @property {((popover: Popover) => void)|null} [onHidden] - After the panel has been removed
 */
/**
 * event.detail of dm:popover:show / shown / hide / hidden (bubbling, fired on the trigger).
 * @typedef {object} PopoverEventDetail
 * @property {Popover} instance
 * @property {Popover[]} args
 */
/** @typedef {Popover} PopoverInstance */
/**
 * `E.popover` - the factory plus its statics: `scan(root)` creates popovers from
 * [data-popover] / [data-popover-content] markup under root and returns the new ones;
 * `closeAll(group)` closes every open popover, or one group's; `getInstance(trigger)` is the
 * popover bound to a trigger; `open()` lists the open popovers, oldest first.
 * @typedef {{
 *     (trigger: string|HTMLElement|ArrayLike<HTMLElement>, options?: PopoverOptions): Popover,
 *     scan(root?: string|Element|Document): Popover[],
 *     closeAll(group?: string|null): void,
 *     getInstance(trigger: string|HTMLElement): Popover|null,
 *     open(): Popover[]
 * }} PopoverStatic
 */
declare class Popover extends Component {
    /** @type {PopoverOptions} */
    static defaults: PopoverOptions;
    /**
     * Turn every `[data-popover]` (or `[data-popover-content]`) under `root`
     * into a popover. Safe to call again: a trigger that already has one is
     * skipped. Returns the instances created.
     *
     * @param {Element|Document|string} [root=document]
     * @param {((el: HTMLElement, options: PopoverOptions) => Popover)|null} [factory] - defaults to `new Popover`
     * @returns {Popover[]}
     */
    static scan(root?: Element | Document | string, factory?: ((el: HTMLElement, options: PopoverOptions) => Popover) | null): Popover[];
    /**
     * Read the declarative options off a trigger's data-popover-* attributes.
     * @param {HTMLElement} el
     * @returns {PopoverOptions}
     */
    static optionsFromAttributes(el: HTMLElement): PopoverOptions;
    /**
     * Close every open popover, or only those in `group`.
     * @param {string|null} [group]
     * @returns {void}
     */
    static closeAll(group?: string | null): void;
    /**
     * The popover bound to a trigger, if any - the same answer as E.get(trigger, 'popover').
     * @param {string|HTMLElement} trigger
     * @returns {Popover|null}
     */
    static getInstance(trigger: string | HTMLElement): Popover | null;
    /**
     * The open popovers, oldest first.
     * @returns {Popover[]}
     */
    static openPopovers(): Popover[];
    /**
     * @param {string|HTMLElement|ArrayLike<HTMLElement>|null} trigger - Selector, element or collection
     * @param {PopoverOptions} [options]
     */
    constructor(trigger: string | HTMLElement | ArrayLike<HTMLElement> | null, options?: PopoverOptions);
    _open: boolean;
    _panel: HTMLDivElement | null;
    _parent: any;
    _timers: {
        show: null;
        hide: null;
        remove: null;
        shown: null;
    };
    _triggerHandlers: any[];
    _openHandlers: any[];
    _savedAttrs: {} | null;
    _frame: any;
    _resizeObserver: ResizeObserver | null;
    _destroyed: boolean;
    /** Panel id. @type {string} */
    id: string;
    /**
     * The panel element (created on first show).
     * @returns {HTMLElement|null}
     */
    get panel(): HTMLElement | null;
    /**
     * The trigger element.
     * @returns {HTMLElement|null}
     */
    get trigger(): HTMLElement | null;
    /** @returns {boolean} */
    isOpen(): boolean;
    /**
     * Open the popover.
     * @param {{focus?: boolean}} [opts] - focus overrides `autoFocus` for this open
     * @returns {this}
     */
    show(opts?: {
        focus?: boolean;
    }): this;
    _openedBy: any;
    /**
     * Close the popover.
     * @param {{returnFocus?: boolean}} [opts] - default: only when focus is inside the panel
     * @returns {this}
     */
    hide(opts?: {
        returnFocus?: boolean;
    }): this;
    _returningFocus: boolean | undefined;
    /**
     * @param {{focus?: boolean, returnFocus?: boolean}} [opts]
     * @returns {this}
     */
    toggle(opts?: {
        focus?: boolean;
        returnFocus?: boolean;
    }): this;
    /**
     * Alias of show().
     * @param {...{focus?: boolean}} args - passed to show()
     * @returns {this}
     */
    open(...args: {
        focus?: boolean;
    }[]): this;
    /**
     * Alias of hide().
     * @param {...{returnFocus?: boolean}} args - passed to hide()
     * @returns {this}
     */
    close(...args: {
        returnFocus?: boolean;
    }[]): this;
    /**
     * Alias of isOpen().
     * @returns {boolean}
     */
    isVisible(): boolean;
    /**
     * Replace the content. Same types as the `content` option.
     * @param {PopoverContent} content
     * @returns {this}
     */
    setContent(content: PopoverContent): this;
    /**
     * Replace the title. An empty value removes the header.
     * @param {PopoverContent} title
     * @returns {this}
     */
    setTitle(title: PopoverContent): this;
    /**
     * Recalculate the position (after the trigger moved or the content changed size).
     * @returns {this}
     */
    update(): this;
    _trap: FocusTrap | null | undefined;
    /**
     * @param {PopoverOptions} [newOptions]
     * @returns {this}
     */
    setOptions(newOptions?: PopoverOptions): this;
    _changedKeys: string[] | null | undefined;
    _applyOptions(): void;
    _triggers(): string[];
    _role(): any;
    _closesOnFocusLeave(): any;
    _on(el: any, event: any, handler: any, list: any): void;
    _bindTrigger(): void;
    _unbindTrigger(): void;
    _scheduleShow(ms: any): void;
    /** `reason` is what asked: a popover a click opened (or claimed) ignores hover and focus leaving. */
    _scheduleHide(ms: any, reason?: null): void;
    _saveAttrs(): void;
    _restoreAttrs(): void;
    _applyTriggerAria(): void;
    _setExpanded(open: any): void;
    _ensurePanel(): HTMLDivElement;
    _parts: {
        arrow: HTMLDivElement;
        header: HTMLDivElement;
        title: HTMLDivElement;
        body: HTMLDivElement;
        close: HTMLButtonElement;
    } | undefined;
    _styleNode(): void;
    _render(): void;
    _renderTitle(): void;
    _renderBody(): void;
    _label(): void;
    /**
     * Put a content value into `el`. Returns whether anything was put there.
     * Text by default; nodes are appended as they are; strings become HTML
     * only with `html: true`, and then only after sanitising.
     */
    _fill(el: any, value: any): boolean;
    _duration(): number;
    /** trapFocus: a FocusTrap round the panel while focus is in it. */
    _holdTrap(): void;
    _releaseTrap(): void;
    /** First tabbable in the content; the panel itself when there is none. */
    _focusInside(): void;
    _onPanelKeyDown(e: any): void;
    _nextTabbableAfterTrigger(): HTMLElement | null;
    _bindOpen(): void;
    _frameIsTimeout: boolean | undefined;
    _unbindOpen(): void;
    _contains(node: any): boolean;
    _isAncestorOf(other: any): boolean;
    _position(): void;
    /**
     * Run the callback, then the .on() listeners and `dm:popover:<name>`. For a
     * cancelable phase, returns false when any of them said no.
     */
    _phase(name: any, cancelable?: boolean): boolean;
}
import Component from './component.js';
import FocusTrap from './components/focus-trap.js';
