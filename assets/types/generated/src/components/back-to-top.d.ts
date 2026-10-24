/**
 * @typedef {object} BackToTopOptions
 * @property {number|null} [showAfter] - Px scrolled before it shows (null: one viewport / container height)
 * @property {number} [duration=300] - Scroll animation duration in ms (0 under reduced motion)
 * @property {import('../elements.js').BackToTopPosition} [position='bottom-right'] - Button position
 * @property {number|{bottom?: number, right?: number, left?: number}|null} [offset] - Px from the edges (null: the stylesheet's)
 * @property {string|HTMLElement|null} [target] - Scroll container to watch (null: the window)
 * @property {number|null} [zIndex] - z-index for the button
 * @property {string} [label='Scroll back to top'] - aria-label when the button has none
 * @property {((backToTop: BackToTopInstance) => void)|null} [onShow] - When the button shows
 * @property {((backToTop: BackToTopInstance) => void)|null} [onHide] - When the button hides
 * @property {((backToTop: BackToTopInstance) => void)|null} [onScroll] - When a scroll to the top starts
 */
/** @typedef {BackToTop} BackToTopInstance */
export class BackToTop extends Component {
    static defaults: {
        showAfter: any;
        duration: number;
        position: string;
        offset: any;
        target: any;
        zIndex: any;
        label: string;
        onShow: any;
        onHide: any;
        onScroll: any;
    };
    /**
     * @param {import('./shared.js').ComponentTarget} selector - A button / link / `.dm-back-to-top` to use; anything else adds a button to the body
     * @param {BackToTopOptions} [options]
     */
    constructor(selector: import("./shared.js").ComponentTarget, options?: BackToTopOptions);
    _made: boolean;
    _visible: boolean;
    _scrolling: boolean;
    /** The button element. @type {HTMLElement} */
    button: HTMLElement;
    _place(): void;
    _container(): any;
    _watch(): void;
    _box: any;
    _scrollTarget: any;
    _onScroll: () => void;
    _check(): void;
    /**
     * Scroll to the top; `duration` overrides the option for this call.
     * @param {number} [duration] - ms
     * @returns {this}
     */
    scroll(duration?: number): this;
    /**
     * Show the button.
     * @returns {this}
     */
    show(): this;
    /**
     * Hide the button.
     * @returns {this}
     */
    hide(): this;
    /**
     * Alias of show(), by name.
     * @returns {this}
     */
    open(...args: any[]): this;
    /**
     * Alias of hide(), by name.
     * @returns {this}
     */
    close(...args: any[]): this;
    /**
     * Toggle button visibility.
     * @returns {this}
     */
    toggle(): this;
    /** @returns {boolean} */
    isVisible(): boolean;
    /** @returns {boolean} */
    isOpen(): boolean;
    /**
     * The button element.
     * @returns {HTMLElement}
     */
    getButton(): HTMLElement;
    /**
     * @param {number|string|null} value - Px; null or '' for one viewport / container height
     * @returns {this}
     */
    setShowAfter(value: number | string | null): this;
    /**
     * @param {import('../elements.js').BackToTopPosition} position
     * @returns {this}
     */
    setPosition(position: import("../elements.js").BackToTopPosition): this;
    /**
     * @param {BackToTopOptions['offset']} offset
     * @returns {this}
     */
    setOffset(offset: BackToTopOptions["offset"]): this;
    _applyOptions(): void;
}
export default BackToTop;
export type BackToTopOptions = {
    /**
     * - Px scrolled before it shows (null: one viewport / container height)
     */
    showAfter?: number | null;
    /**
     * - Scroll animation duration in ms (0 under reduced motion)
     */
    duration?: number;
    /**
     * - Button position
     */
    position?: import("../elements.js").BackToTopPosition;
    /**
     * - Px from the edges (null: the stylesheet's)
     */
    offset?: number | {
        bottom?: number;
        right?: number;
        left?: number;
    } | null;
    /**
     * - Scroll container to watch (null: the window)
     */
    target?: string | HTMLElement | null;
    /**
     * - z-index for the button
     */
    zIndex?: number | null;
    /**
     * - aria-label when the button has none
     */
    label?: string;
    /**
     * - When the button shows
     */
    onShow?: ((backToTop: BackToTopInstance) => void) | null;
    /**
     * - When the button hides
     */
    onHide?: ((backToTop: BackToTopInstance) => void) | null;
    /**
     * - When a scroll to the top starts
     */
    onScroll?: ((backToTop: BackToTopInstance) => void) | null;
};
export type BackToTopInstance = BackToTop;
import Component from '../component.js';
