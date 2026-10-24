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

    constructor(selector, options = {}) {
        super(resolveElement(selector), options);
        if (!this.element) return;
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

    show() {
        const was = this._visible;
        this._visible = true;
        this._setShown(true);
        if (!this.indicator.isConnected && this.element) this.element.appendChild(this.indicator);
        if (!was) this._fire('show', this);
        return this;
    }

    hide() {
        const was = this._visible;
        this._visible = false;
        this._setShown(false);
        if (was) this._fire('hide', this);
        return this;
    }

    /** Alias of show(), by name - the overlay verbs every component shares. */
    open(...args) {
        return this.show(...args);
    }

    /** Alias of hide(), by name. */
    close(...args) {
        return this.hide(...args);
    }

    toggle() {
        return this._visible ? this.hide() : this.show();
    }

    isVisible() {
        return this._visible;
    }

    isOpen() {
        return this._visible;
    }

    setText(text) {
        this.options.text = text;
        this._render();
        return this;
    }

    setType(type) {
        this.options.type = type;
        this._render();
        return this;
    }

    setSize(size) {
        this.options.size = size;
        this._render();
        return this;
    }

    setColor(color) {
        this.options.color = color;
        this._render();
        return this;
    }

    _applyOptions() {
        this._render();
        this._setShown(this._visible);
    }

    /** Remove the indicator; the container stays. */
    destroy() {
        this.indicator?.remove();
        this.element?.classList.remove('dm-loader-host');
        if (flag(this.options.fullscreen) && this.element) this.element.style.display = 'none';
        super.destroy();
    }
}

export default Loader;
