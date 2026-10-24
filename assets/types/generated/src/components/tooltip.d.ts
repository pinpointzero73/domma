/**
 * E.tooltip: an instance per matched element (an existing one is updated, not doubled).
 * @param {Element[]} elements
 * @param {TooltipOptions} [options]
 * @returns {Tooltip[]}
 */
export function tooltipsFor(elements: Element[], options?: TooltipOptions): Tooltip[];
/**
 * Show / hide delays in ms.
 * @typedef {object} TooltipDelay
 * @property {number} [show]
 * @property {number} [hide]
 */
/**
 * @typedef {object} TooltipOptions
 * @property {string|Node|((target: HTMLElement) => string|Node)} [content] - Tooltip content (falls back to data-tooltip, then title)
 * @property {import('../elements.js').TooltipPosition} [position='top'] - Position relative to element (flips when there is no room)
 * @property {import('../elements.js').TooltipPosition} [placement] - Alias of `position`
 * @property {'hover'|'click'|'focus'|'manual'|(string & {})} [trigger='hover'] - How to trigger; several separated by spaces ('hover focus')
 * @property {number|TooltipDelay} [delay=0] - Show delay in ms, or {show, hide}
 * @property {number} [hideDelay=0] - Hide delay in ms
 * @property {boolean} [animation=true] - Fade in and out
 * @property {number} [offset=8] - Gap in px between target and bubble
 * @property {boolean} [html=false] - String content is HTML (sanitised unless `safe: false`), not text
 * @property {boolean} [safe=true] - Sanitise HTML content
 * @property {boolean} [visible=false] - Show at once
 * @property {string} [className] - Extra classes on the bubble
 * @property {number|string|null} [maxWidth] - Any CSS width; numbers are px
 * @property {((tooltip: TooltipInstance) => void)|null} [onShow] - When the tooltip shows
 * @property {((tooltip: TooltipInstance) => void)|null} [onHide] - When the tooltip hides
 */
/** @typedef {Tooltip} TooltipInstance */
export class Tooltip extends Component {
    static defaults: {
        content: string;
        position: string;
        trigger: string;
        delay: number;
        hideDelay: number;
        animation: boolean;
        offset: number;
        html: boolean;
        safe: boolean;
        visible: boolean;
        className: string;
        maxWidth: any;
        onShow: any;
        onHide: any;
    };
    /**
     * Option aliases the old wrapper accepted.
     * @param {TooltipOptions} [options]
     * @returns {TooltipOptions}
     */
    static normalise(options?: TooltipOptions): TooltipOptions;
    /**
     * @param {string|Element} element
     * @param {TooltipOptions} [options]
     */
    constructor(element: string | Element, options?: TooltipOptions);
    _visible: boolean;
    _bubble: HTMLDivElement;
    _timers: {};
    /** Content falls back to data-tooltip / title; a title is held aside so the browser's own does not show too. */
    _takeTitle(): void;
    _title: string;
    _content(): any;
    _bindTrigger(): void;
    _clear(name: any): void;
    _make(): void;
    _write(): void;
    _unmake(): void;
    /** Place the bubble beside the target, flipping to the other side when it would leave the viewport. */
    _place(): void;
    _onScroll: () => void;
    /**
     * Show the tooltip (after `delay`).
     * @returns {this}
     */
    open(): this;
    /**
     * Hide the tooltip (after `hideDelay`, unless `immediate`).
     * @param {{immediate?: boolean}} [opts]
     * @returns {this}
     */
    close(opts?: {
        immediate?: boolean;
    }): this;
    /**
     * Permanent alias of open(), by name.
     * @returns {this}
     */
    show(...args: any[]): this;
    /**
     * Permanent alias of close(), by name.
     * @param {...{immediate?: boolean}} args
     * @returns {this}
     */
    hide(...args: {
        immediate?: boolean;
    }[]): this;
    /**
     * Toggle tooltip visibility.
     * @returns {this}
     */
    toggle(): this;
    /** @returns {boolean} */
    isVisible(): boolean;
    /** @returns {boolean} */
    isOpen(): boolean;
    /**
     * Update tooltip content.
     * @param {TooltipOptions['content']} content
     * @returns {this}
     */
    setContent(content: TooltipOptions["content"]): this;
    /**
     * @param {import('../elements.js').TooltipPosition} position
     * @returns {this}
     */
    setPosition(position: import("../elements.js").TooltipPosition): this;
    /**
     * @param {TooltipOptions} [newOptions]
     * @returns {this}
     */
    setOptions(newOptions?: TooltipOptions): this;
    _applyOptions(): void;
}
export default Tooltip;
/**
 * Show / hide delays in ms.
 */
export type TooltipDelay = {
    show?: number;
    hide?: number;
};
export type TooltipOptions = {
    /**
     * - Tooltip content (falls back to data-tooltip, then title)
     */
    content?: string | Node | ((target: HTMLElement) => string | Node);
    /**
     * - Position relative to element (flips when there is no room)
     */
    position?: import("../elements.js").TooltipPosition;
    /**
     * - Alias of `position`
     */
    placement?: import("../elements.js").TooltipPosition;
    /**
     * - How to trigger; several separated by spaces ('hover focus')
     */
    trigger?: "hover" | "click" | "focus" | "manual" | (string & {});
    /**
     * - Show delay in ms, or {show, hide}
     */
    delay?: number | TooltipDelay;
    /**
     * - Hide delay in ms
     */
    hideDelay?: number;
    /**
     * - Fade in and out
     */
    animation?: boolean;
    /**
     * - Gap in px between target and bubble
     */
    offset?: number;
    /**
     * - String content is HTML (sanitised unless `safe: false`), not text
     */
    html?: boolean;
    /**
     * - Sanitise HTML content
     */
    safe?: boolean;
    /**
     * - Show at once
     */
    visible?: boolean;
    /**
     * - Extra classes on the bubble
     */
    className?: string;
    /**
     * - Any CSS width; numbers are px
     */
    maxWidth?: number | string | null;
    /**
     * - When the tooltip shows
     */
    onShow?: ((tooltip: TooltipInstance) => void) | null;
    /**
     * - When the tooltip hides
     */
    onHide?: ((tooltip: TooltipInstance) => void) | null;
};
export type TooltipInstance = Tooltip;
import Component from '../component.js';
