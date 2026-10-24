/**
 * BackToTop - E.backToTop(selector, options).
 *
 * Light DOM: a `.dm-back-to-top` button (elements.css), fixed in a corner, shown once
 * the page (or `target` container) has scrolled past `showAfter`. A `<button>` / `<a>`
 * or `.dm-back-to-top` passed as the selector is used as the button; anything else
 * (old callers passed 'body') is ignored and a button is added to the body.
 *
 * Events: show, hide, scroll - as `onX`, `.on('x')` and `dm:back-to-top:x`.
 */

import Component from '../component.js';
import {flag, num, reducedMotion, resolveElement} from './shared.js';

function arrow() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    for (const [k, v] of Object.entries({
        width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true'
    })) svg.setAttribute(k, v);
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', 'M18 15l-6-6-6 6');
    svg.appendChild(path);
    return svg;
}

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
    static componentName = 'back-to-top';

    static defaults = {
        showAfter: null,            // px scrolled before it shows (null: one viewport / container height)
        duration: 300,              // scroll animation, ms
        position: 'bottom-right',   // 'bottom-right' | 'bottom-left'
        offset: null,               // px from the edges, or {bottom, right|left} (null: the stylesheet's)
        target: null,               // scroll container (null: the window)
        zIndex: null,
        label: 'Scroll back to top',
        onShow: null,
        onHide: null,
        onScroll: null
    };

    /**
     * @param {import('./shared.js').ComponentTarget} selector - A button / link / `.dm-back-to-top` to use; anything else adds a button to the body
     * @param {BackToTopOptions} [options]
     */
    constructor(selector, options = {}) {
        let el = resolveElement(selector);
        const usable = el && (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName.includes('-')
            || el.classList.contains('dm-back-to-top'));
        let made = false;
        if (!usable) {
            el = document.createElement('button');
            el.type = 'button';
            made = true;
        }
        super(el, options);
        this._made = made;
        this._visible = false;
        this._scrolling = false;
        // A <domma-back-to-top> tag holds a real button; a button is its own.
        if (el.tagName.includes('-')) {
            /** The button element. @type {HTMLElement} */
            this.button = el.querySelector(':scope > button.dm-back-to-top') || document.createElement('button');
            this.button.type = 'button';
            if (!this.button.isConnected) el.appendChild(this.button);
        } else {
            this.button = el;
        }
        this.button.classList.add('dm-back-to-top');
        if (!this.button.hasAttribute('aria-label')) this.button.setAttribute('aria-label', String(this.options.label));
        if (!this.button.hasAttribute('title')) this.button.setAttribute('title', 'Back to top');
        if (!this.button.querySelector('svg') && !this.button.textContent.trim()) this.button.appendChild(arrow());
        if (made) document.body.appendChild(el);
        this._place();
        this._addEventListener(this.button, 'click', (e) => {
            e.preventDefault();
            this.scroll();
        });
        this._watch();
    }

    _place() {
        const o = this.options;
        const btn = this.button;
        const s = btn.style;
        const box = this._container();
        // A button inside the container it watches sticks to that container's corner.
        const contained = !!(box && box.contains(btn));
        btn.classList.toggle('dm-back-to-top-contained', contained);
        const left = o.position === 'bottom-left' || (o.offset && typeof o.offset === 'object' && o.offset.left !== undefined);
        btn.classList.toggle('dm-back-to-top-left', left);
        const off = o.offset;
        const px = (v) => (v === undefined || v === null || v === '' ? '' : `${num(v, 16)}px`);
        let bottom = '';
        let side = '';
        if (off && typeof off === 'object') {
            bottom = px(off.bottom);
            side = px(left ? off.left : off.right);
        } else {
            bottom = px(off);
            side = px(off);
        }
        s.bottom = bottom;
        if (contained) {
            s.left = '';
            s.right = '';
            s.marginLeft = left ? side : '';
            s.marginRight = left ? '' : side;
        } else {
            s.left = left ? (side || '1.5rem') : 'auto';
            s.right = left ? 'auto' : side;
            if (!left && !side) s.right = '';
            if (!left) s.left = '';
        }
        s.zIndex = o.zIndex === null || o.zIndex === undefined ? '' : String(o.zIndex);
    }

    _container() {
        const t = this.options.target;
        if (!t) return null;
        return typeof t === 'string' ? document.querySelector(t) : t;
    }

    _watch() {
        if (this._scrollTarget) this._scrollTarget.removeEventListener('scroll', this._onScroll);
        this._box = this._container();
        this._scrollTarget = this._box || window;
        this._onScroll = () => this._check();
        this._scrollTarget.addEventListener('scroll', this._onScroll, {passive: true});
        this._check();
    }

    _check() {
        const box = this._box;
        const threshold = this.options.showAfter ?? (box ? box.clientHeight : window.innerHeight);
        const y = box ? box.scrollTop : window.scrollY;
        if (y > num(threshold, 0)) this.show();
        else this.hide();
    }

    // ---- public API -----------------------------------------------------

    /**
     * Scroll to the top; `duration` overrides the option for this call.
     * @param {number} [duration] - ms
     * @returns {this}
     */
    scroll(duration) {
        if (this._scrolling) return this;
        const box = this._box;
        const start = box ? box.scrollTop : window.scrollY;
        const ms = reducedMotion() ? 0 : num(duration ?? this.options.duration, 300);
        const set = (y) => {
            if (box) box.scrollTop = y;
            else window.scrollTo(0, y);
        };
        this._fire('scroll', this);
        if (!ms || typeof requestAnimationFrame !== 'function') {
            set(0);
            return this;
        }
        this._scrolling = true;
        const t0 = performance.now();
        const step = (now) => {
            const p = Math.min((now - t0) / ms, 1);
            set(start * (1 - p * (2 - p)));
            if (p < 1) requestAnimationFrame(step);
            else this._scrolling = false;
        };
        requestAnimationFrame(step);
        return this;
    }

    /**
     * Show the button.
     * @returns {this}
     */
    show() {
        if (this._visible) return this;
        this._visible = true;
        this.button.classList.add('show');
        this._fire('show', this);
        return this;
    }

    /**
     * Hide the button.
     * @returns {this}
     */
    hide() {
        if (!this._visible) return this;
        this._visible = false;
        this.button.classList.remove('show');
        this._fire('hide', this);
        return this;
    }

    /**
     * Alias of show(), by name.
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

    /**
     * Toggle button visibility.
     * @returns {this}
     */
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
     * The button element.
     * @returns {HTMLElement}
     */
    getButton() {
        return this.button;
    }

    /**
     * @param {number|string|null} value - Px; null or '' for one viewport / container height
     * @returns {this}
     */
    setShowAfter(value) {
        this.options.showAfter = value === null || value === '' ? null : num(value, null);
        this._check();
        return this;
    }

    /**
     * @param {import('../elements.js').BackToTopPosition} position
     * @returns {this}
     */
    setPosition(position) {
        this.options.position = position;
        this._place();
        return this;
    }

    /**
     * @param {BackToTopOptions['offset']} offset
     * @returns {this}
     */
    setOffset(offset) {
        this.options.offset = offset;
        this._place();
        return this;
    }

    _applyOptions() {
        this._place();
        this._watch();
    }

    destroy() {
        if (this._scrollTarget) this._scrollTarget.removeEventListener('scroll', this._onScroll);
        if (this._made) this.element.remove();
        else {
            this.button.classList.remove('dm-back-to-top', 'show', 'dm-back-to-top-contained', 'dm-back-to-top-left');
        }
        super.destroy();
    }
}

export default BackToTop;
