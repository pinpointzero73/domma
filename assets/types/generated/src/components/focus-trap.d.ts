/**
 * The floating layer an outside element belongs to, or null when it is part of the
 * page. A layer is the nearest of:
 * - an element carrying `data-focus-trap-allow` (an opt-in for anything else);
 * - an element with `position: fixed` (toasts, popovers, context menus, palettes,
 *   another overlay that did not trap focus);
 * - a direct child of <body> that is absolutely positioned (portalled pickers and
 *   dropdowns), or that was put there after `since` was taken - something opened
 *   while the trap was on top.
 * @param {Element} target
 * @param {Set<Element>} [since] - the children <body> had when the trap activated
 * @returns {Element|null}
 */
export function layerOf(target: Element, since?: Set<Element>): Element | null;
/**
 * The tabbable elements in some containers, in Tab order: positive tabindex first (in
 * ascending order), then the rest in document order. Of a radio group only the checked
 * button - or the first, when none is - takes part, as the browser does.
 * @param {Element|Element[]} containers
 * @param {{shadow?: boolean}} [opts] - shadow: false skips shadow roots
 * @returns {HTMLElement[]}
 */
export function tabbables(containers: Element | Element[], opts?: {
    shadow?: boolean;
}): HTMLElement[];
/**
 * A trap round some containers - the small util other components use.
 * @param {FocusTarget|Element|Array<FocusTarget|Element>} containers
 * @param {FocusTrapOptions} [options]
 * @returns {FocusTrap}
 */
export function createFocusTrap(containers: FocusTarget | Element | Array<FocusTarget | Element>, options?: FocusTrapOptions): FocusTrap;
/** Marks an element (and what is inside it) as a layer any trap lets focus into. */
export const ALLOW_ATTR: "data-focus-trap-allow";
export class FocusTrap extends Component {
    /** @type {FocusTrapOptions} */
    static defaults: FocusTrapOptions;
    /**
     * @param {FocusTarget|Element|Array<FocusTarget|Element>} containers
     * @returns {HTMLElement[]}
     * @protected
     */
    protected static _resolve(containers: FocusTarget | Element | Array<FocusTarget | Element>): HTMLElement[];
    /**
     * The trap that currently listens: the newest active one.
     * @returns {FocusTrap|null}
     */
    static top(): FocusTrap | null;
    /**
     * @param {FocusTarget|Element|Array<FocusTarget|Element>} containers - one container, or several
     * @param {FocusTrapOptions} [options]
     */
    constructor(containers: FocusTarget | Element | Array<FocusTarget | Element>, options?: FocusTrapOptions);
    _containers: HTMLElement[];
    _bodyAtStart: Set<Element>;
    _pendingTab: {
        shift: any;
        fromInside: boolean;
    };
    _active: boolean;
    _paused: boolean;
    _returnTo: Element;
    _lastFocused: any;
    _madeFocusable: any[];
    _inerted: any[];
    _bound: boolean;
    /** Capture phase: Escape, and a note of the Tab that is on its way. */
    _onKeyDown(e: any): void;
    /** Bubble phase on window: move focus, unless something on the way used the key. */
    _onTab(e: any): void;
    _onFocusIn(e: any): void;
    _onPointerDown(e: any): void;
    _onClick(e: any): void;
    /**
     * Capture phase: an event aimed inside the trap opens a short window in which focus may
     * leave - until the handlers of this event, and anything they chain with
     * Promise.then, have run. A Tab never opens it (Tab is the trap's own business).
     */
    _onInsideEvent(e: any): void;
    /**
     * Start trapping. Pauses the trap that was on top, if any, and moves focus in.
     * @param {{initialFocus?: FocusTrapOptions['initialFocus']}} [opts] - overrides the option for this activation
     * @returns {this}
     */
    activate(opts?: {
        initialFocus?: FocusTrapOptions["initialFocus"];
    }): this;
    /**
     * Stop trapping. Unpauses the trap beneath, and returns focus unless told not to.
     * @param {{returnFocus?: boolean|FocusTarget}} [opts]
     * @returns {this}
     */
    deactivate(opts?: {
        returnFocus?: boolean | FocusTarget;
    }): this;
    /**
     * Stop listening without deactivating - another trap has taken over.
     * @returns {this}
     */
    pause(): this;
    /**
     * Listen again after pause(). Focus comes back into the containers if it is outside.
     * @param {{focus?: boolean}} [opts] - focus: false leaves focus where it is
     * @returns {this}
     */
    unpause(opts?: {
        focus?: boolean;
    }): this;
    /**
     * Trap a different set of containers (takes effect at the next key press).
     * @param {FocusTarget|Element|Array<FocusTarget|Element>} containers
     * @returns {this}
     */
    updateContainers(containers: FocusTarget | Element | Array<FocusTarget | Element>): this;
    /** @returns {HTMLElement[]} the trapped containers */
    containers(): HTMLElement[];
    /** @returns {boolean} active (paused or not) */
    isActive(): boolean;
    /** @returns {boolean} active but paused by a trap above it */
    isPaused(): boolean;
    /**
     * The tabbable elements in the containers right now, in Tab order.
     * @returns {HTMLElement[]}
     */
    tabbables(): HTMLElement[];
    _destroyed: boolean;
    _contains(node: any): boolean;
    _eventInside(e: any): boolean;
    _bind(): void;
    _unbind(): void;
    /** A container that can hold focus itself, for when there is nothing tabbable. */
    _fallback(): any;
    _clearFocusable(): void;
    _firstTarget(): any;
    _focusInitial(initial: any): void;
    _focus(el: any, scroll?: boolean): void;
    /**
     * A move Tab asked for: scrolls the element into view as native Tab does
     * (`preventScroll` is for activation and return only). Should the element not take
     * focus after all, the next candidate in `list` is tried, so Tab never sticks.
     */
    _tabTo(el: any, list: any, back?: boolean): void;
    /**
     * Containers that left the page (a view removed the overlay without closing it)
     * leave nothing to trap: the trap lets go rather than hold focus nowhere.
     * @returns {boolean} true when it let go
     */
    _gone(): boolean;
    /** Whether focus may stay on an element outside the containers. */
    _mayFocusOutside(target: any, e: any): boolean;
    /** The tabbable after (or before) a non-tabbable element inside the containers. */
    _nextFrom(active: any, list: any, back: any): any;
    /**
     * Tab inside a floating layer the trap let focus into (a popover opened from the
     * overlay, a toast's button): it moves through the layer, and off either end it
     * comes back to the overlay as though the layer sat just after what had focus
     * before - Shift+Tab to that element, Tab to the one after it.
     */
    _tabInLayer(e: any, layer: any, active: any): void;
    _scriptTurn: {};
    /**
     * `inert` on every sibling of the containers and of their ancestors, up to <body>, so
     * the rest of the page cannot be reached by anything - pointer, Tab or a screen
     * reader's virtual cursor. What was inert already is left alone and stays so.
     */
    _applyInert(): void;
    _clearInert(): void;
}
export default FocusTrap;
/**
 * A container or element: a CSS selector or the element itself.
 */
export type FocusTarget = string | HTMLElement;
export type FocusTrapOptions = {
    /**
     * Where focus goes on activate: a selector, an element, a function returning one, or false to leave it. Default: focus already inside stays, else the first tabbable, else the container.
     */
    initialFocus?: FocusTarget | (() => HTMLElement | null) | false;
    /**
     * Where focus goes when nothing is tabbable (default: the first container, given tabindex="-1")
     */
    fallbackFocus?: FocusTarget | (() => HTMLElement | null);
    /**
     * true (default): back to what had focus before activate(); or an element / selector; false: nowhere
     */
    returnFocus?: boolean | FocusTarget;
    /**
     * Escape deactivates (default false - the owning overlay decides)
     */
    escapeDeactivates?: boolean | ((e: KeyboardEvent) => boolean);
    /**
     * A press outside deactivates (default false)
     */
    clickOutsideDeactivates?: boolean | ((e: MouseEvent) => boolean);
    /**
     * Let clicks outside through (default false: they are blocked)
     */
    allowOutsideClick?: boolean | ((e: MouseEvent) => boolean);
    /**
     * Let a click, key or input handler on something inside the trap move focus outside on purpose - e.g. "Insert" focusing the editor behind a slideover before closing it (default false; the overlays turn it on)
     */
    allowScriptFocus?: boolean;
    /**
     * Let focus stay outside: true, 'layers' (floating layers such as toasts and popovers, never the page or a trap beneath), or a function (default false)
     */
    allowOutsideFocus?: boolean | "layers" | ((el: Element, e: Event | null) => boolean);
    /**
     * false: keep the trap out of E.get(container) (default true)
     */
    register?: boolean;
    /**
     * Set `inert` on everything outside the containers while active (default false)
     */
    inert?: boolean;
    /**
     * Walk open shadow roots (default true)
     */
    shadow?: boolean;
    /**
     * Focus without scrolling (default true)
     */
    preventScroll?: boolean;
    onActivate?: ((trap: FocusTrapInstance) => void) | null;
    onDeactivate?: ((trap: FocusTrapInstance) => void) | null;
    onPause?: ((trap: FocusTrapInstance) => void) | null;
    onUnpause?: ((trap: FocusTrapInstance) => void) | null;
};
export type FocusTrapInstance = FocusTrap;
/**
 * `E.focusTrap(containers, options)` - null when nothing matched - with its helpers.
 */
export type FocusTrapFactory = ((containers: FocusTarget | FocusTarget[], options?: FocusTrapOptions) => FocusTrapInstance | null) & {
    tabbables: (containers: Element | Element[], opts?: {
        shadow?: boolean;
    }) => HTMLElement[];
    top: () => FocusTrapInstance | null;
};
import Component from '../component.js';
