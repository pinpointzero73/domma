/** @typedef {'spinner'|'dots'|'pulse'|'bars'} LoaderType */
/**
 * @typedef {object} LoaderOptions
 * @property {LoaderType} [type='spinner'] - Animation
 * @property {'small'|'sm'|'medium'|'md'|'large'|'lg'|number} [size='medium'] - Named size or px
 * @property {string} [color='primary'] - Theme colour name, 'white', 'dark', or any CSS colour
 * @property {boolean} [overlay=false] - Cover the container with a backdrop
 * @property {string} [text] - Text under the indicator (also its accessible name)
 * @property {boolean} [centered=true] - Centre in the container
 * @property {boolean} [visible=true] - Show at once
 * @property {boolean} [fullscreen=false] - (fullscreenLoader) the container is shown and hidden with it
 * @property {string} [label='Loading'] - Accessible name when there is no text
 * @property {((loader: LoaderInstance) => void)|null} [onShow] - When the loader shows
 * @property {((loader: LoaderInstance) => void)|null} [onHide] - When the loader hides
 */
/** @typedef {Loader} LoaderInstance */
export class Loader extends Component {
    static defaults: {
        type: string;
        size: string;
        color: string;
        overlay: boolean;
        text: string;
        centered: boolean;
        visible: boolean;
        fullscreen: boolean;
        label: string;
        onShow: any;
        onHide: any;
    };
    /**
     * @param {import('./shared.js').ComponentTarget} selector - The container
     * @param {LoaderOptions} [options]
     */
    constructor(selector: import("./shared.js").ComponentTarget, options?: LoaderOptions);
    /** The `.dm-loader` element. @type {HTMLDivElement} */
    indicator: HTMLDivElement;
    _visible: boolean;
    _render(): void;
    _textEl: HTMLSpanElement;
    _setShown(shown: any): void;
    /** @returns {this} */
    show(): this;
    /** @returns {this} */
    hide(): this;
    /**
     * Alias of show(), by name - the overlay verbs every component shares.
     * @returns {this}
     */
    open(...args: any[]): this;
    /**
     * Alias of hide(), by name.
     * @returns {this}
     */
    close(...args: any[]): this;
    /** @returns {this} */
    toggle(): this;
    /** @returns {boolean} */
    isVisible(): boolean;
    /** @returns {boolean} */
    isOpen(): boolean;
    /**
     * @param {string} text
     * @returns {this}
     */
    setText(text: string): this;
    /**
     * @param {LoaderType} type
     * @returns {this}
     */
    setType(type: LoaderType): this;
    /**
     * @param {LoaderOptions['size']} size
     * @returns {this}
     */
    setSize(size: LoaderOptions["size"]): this;
    /**
     * @param {string} color
     * @returns {this}
     */
    setColor(color: string): this;
    _applyOptions(): void;
}
export default Loader;
export type LoaderType = "spinner" | "dots" | "pulse" | "bars";
export type LoaderOptions = {
    /**
     * - Animation
     */
    type?: LoaderType;
    /**
     * - Named size or px
     */
    size?: "small" | "sm" | "medium" | "md" | "large" | "lg" | number;
    /**
     * - Theme colour name, 'white', 'dark', or any CSS colour
     */
    color?: string;
    /**
     * - Cover the container with a backdrop
     */
    overlay?: boolean;
    /**
     * - Text under the indicator (also its accessible name)
     */
    text?: string;
    /**
     * - Centre in the container
     */
    centered?: boolean;
    /**
     * - Show at once
     */
    visible?: boolean;
    /**
     * - (fullscreenLoader) the container is shown and hidden with it
     */
    fullscreen?: boolean;
    /**
     * - Accessible name when there is no text
     */
    label?: string;
    /**
     * - When the loader shows
     */
    onShow?: ((loader: LoaderInstance) => void) | null;
    /**
     * - When the loader hides
     */
    onHide?: ((loader: LoaderInstance) => void) | null;
};
export type LoaderInstance = Loader;
import Component from '../component.js';
