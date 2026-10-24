/**
 * Loader - E.loader(container, options), E.showLoader / hideLoader / fullscreenLoader.
 *
 * Light DOM: a `.dm-loader` indicator appended inside the caller's container (the
 * instance's `element`), styled by elements.css. Colour names map to theme tokens;
 * anything else is used as a CSS colour.
 *
 * Events: show, hide - as `onShow` / `onHide`, `.on()` and `dm:loader:show|hide`.
 */

import Component from '../component.js';
import {flag, resolveElement} from './shared.js';

const SIZES = {small: 24, sm: 24, medium: 40, md: 40, large: 64, lg: 64};
const TOKENS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
const PARTS = {spinner: 0, dots: 3, pulse: 0, bars: 4};

function colourOf(color) {
    if (!color) return 'var(--dm-primary)';
    if (TOKENS.includes(color)) return `var(--dm-${color})`;
    if (color === 'white') return '#fff';
    if (color === 'dark') return 'var(--dm-text)';
    return String(color);
}

function sizeOf(size) {
    if (typeof size === 'number') return size;
    if (size !== undefined && size !== null && size !== '' && !isNaN(size)) return parseInt(size, 10);
    return SIZES[size] || SIZES.medium;
}

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
    static componentName = 'loader';

    static defaults = {
        type: 'spinner',            // 'spinner' | 'dots' | 'pulse' | 'bars'
        size: 'medium',             // 'small' | 'medium' | 'large' or px
        color: 'primary',           // theme colour name, 'white', 'dark', or any CSS colour
        overlay: false,             // cover the container with a backdrop
        text: '',
        centered: true,             // centre in the container
        visible: true,
        fullscreen: false,          // (fullscreenLoader) the container is shown and hidden with it
        label: 'Loading',
        onShow: null,
        onHide: null
    };

    /**
     * @param {import('./shared.js').ComponentTarget} selector - The container
     * @param {LoaderOptions} [options]
     */
    constructor(selector, options = {}) {
        super(resolveElement(selector), options);
        if (!this.element) return;
        /** The `.dm-loader` element. @type {HTMLDivElement} */
        this.indicator = document.createElement('div');
        this.indicator.setAttribute('role', 'status');
        this.indicator.setAttribute('aria-live', 'polite');
        this._visible = false;
        this._render();
        this.element.appendChild(this.indicator);
        if (flag(this.options.visible, true)) this.show();
        else this._setShown(false);
    }

    _render() {
        const o = this.options;
        const ind = this.indicator;
        const type = PARTS[o.type] !== undefined ? o.type : 'spinner';
        const overlay = flag(o.overlay);
        ind.className = `dm-loader dm-loader-js${overlay ? ' dm-loader-overlay' : ''}${flag(o.centered, true) && !overlay ? ' dm-loader-centered' : ''}`;
        ind.style.setProperty('--dm-loader-size', `${sizeOf(o.size)}px`);
        ind.style.setProperty('--dm-loader-color', colourOf(o.color));
        ind.setAttribute('aria-label', o.text ? String(o.text) : String(o.label || 'Loading'));
        this.element.classList.toggle('dm-loader-host', overlay);

        const anim = document.createElement('div');
        anim.className = `dm-loader-anim dm-loader-anim-${type}`;
        anim.setAttribute('aria-hidden', 'true');
        for (let i = 0; i < PARTS[type]; i++) anim.appendChild(document.createElement('span'));
        ind.replaceChildren(anim);
        this._textEl = null;
        if (o.text) {
            this._textEl = document.createElement('span');
            this._textEl.className = 'dm-loader-text';
            this._textEl.textContent = String(o.text);
            ind.appendChild(this._textEl);
        }
    }

    _setShown(shown) {
        this.indicator.hidden = !shown;
        if (flag(this.options.fullscreen)) this.element.style.display = shown ? 'flex' : 'none';
    }

    /** @returns {this} */
    show() {
        const was = this._visible;
        this._visible = true;
        this._setShown(true);
        if (!this.indicator.isConnected && this.element) this.element.appendChild(this.indicator);
        if (!was) this._fire('show', this);
        return this;
    }

    /** @returns {this} */
    hide() {
        const was = this._visible;
        this._visible = false;
        this._setShown(false);
        if (was) this._fire('hide', this);
        return this;
    }

    /**
     * Alias of show(), by name - the overlay verbs every component shares.
     * @returns {this}
     */
    open(...args) {
        return this.show(...args);
    }

    /**
     * Alias of hide(), by name.
     * @returns {this}
     */
    close(...args) {
        return this.hide(...args);
    }

    /** @returns {this} */
    toggle() {
        return this._visible ? this.hide() : this.show();
    }

    /** @returns {boolean} */
    isVisible() {
        return this._visible;
    }

    /** @returns {boolean} */
    isOpen() {
        return this._visible;
    }

    /**
     * @param {string} text
     * @returns {this}
     */
    setText(text) {
        this.options.text = text;
        this._render();
        return this;
    }

    /**
     * @param {LoaderType} type
     * @returns {this}
     */
    setType(type) {
        this.options.type = type;
        this._render();
        return this;
    }

    /**
     * @param {LoaderOptions['size']} size
     * @returns {this}
     */
    setSize(size) {
        this.options.size = size;
        this._render();
        return this;
    }

    /**
     * @param {string} color
     * @returns {this}
     */
    setColor(color) {
        this.options.color = color;
        this._render();
        return this;
    }

    _applyOptions() {
        this._render();
        this._setShown(this._visible);
    }

    /**
     * Remove the indicator; the container stays.
     * @returns {void}
     */
    destroy() {
        this.indicator?.remove();
        this.element?.classList.remove('dm-loader-host');
        if (flag(this.options.fullscreen) && this.element) this.element.style.display = 'none';
        super.destroy();
    }
}

export default Loader;
