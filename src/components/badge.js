/**
 * Badge - E.badge(selector, options) - and NumberBadge - E.numberBadge(target, options).
 *
 * Light DOM. A Badge is the caller's element with `.badge .badge-<variant>` classes
 * (elements.css), its children - icons included - left where they are. A NumberBadge
 * is a `.badge-counter` span placed in the corner of the target.
 *
 * Badge events: click, remove. NumberBadge events: change. As `onX`, `.on('x')` and
 * `dm:badge:x` / `dm:number-badge:x`.
 */

import Component from '../component.js';
import {flag, num, resolveElement} from './shared.js';

const VARIANTS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
const SIZES = {small: 'badge-sm', sm: 'badge-sm', large: 'badge-lg', lg: 'badge-lg'};

/**
 * @typedef {object} BadgeOptions
 * @property {import('../elements.js').BadgeVariant} [variant='primary'] - Badge variant/colour
 * @property {import('../elements.js').BadgeSize|'sm'|'lg'} [size='medium'] - Badge size
 * @property {boolean} [pill=false] - Use pill/rounded style
 * @property {boolean} [outline=false] - Use outline style
 * @property {boolean} [removable=false] - Show remove button
 * @property {boolean} [pulse=false] - Pulse animation
 * @property {((event: MouseEvent, badge: BadgeInstance) => void)|null} [onClick] - Callback on click (not the remove button)
 * @property {((badge: BadgeInstance, event: MouseEvent) => boolean|void)|null} [onRemove] - Callback on remove; return false to keep the badge
 */

/** @typedef {Badge} BadgeInstance */

export class Badge extends Component {
    static componentName = 'badge';

    static defaults = {
        variant: 'primary',
        size: 'medium',             // 'small' | 'medium' | 'large'
        pill: false,
        outline: false,
        removable: false,
        pulse: false,
        onClick: null,
        onRemove: null
    };

    /**
     * @param {import('./shared.js').ComponentTarget} selector
     * @param {BadgeOptions} [options]
     */
    constructor(selector, options = {}) {
        super(resolveElement(selector), options);
        if (!this.element) return;
        this._had = new Set(this.element.classList);
        this._apply();
        this._addEventListener(this.element, 'click', (e) => {
            if (this._removeBtn && this._removeBtn.contains(e.target)) return;
            this._fire('click', e, this);
        });
    }

    _apply() {
        const el = this.element;
        const o = this.options;
        const keep = (cls) => this._had.has(cls);
        for (const v of VARIANTS) if (!keep(`badge-${v}`)) el.classList.remove(`badge-${v}`);
        for (const c of ['badge-sm', 'badge-lg', 'badge-pill', 'badge-rounded', 'badge-outline', 'badge-pulse']) {
            if (!keep(c)) el.classList.remove(c);
        }
        const variant = VARIANTS.includes(o.variant) ? o.variant : 'primary';
        for (const v of VARIANTS) el.classList.remove(`badge-outline-${v}`);
        // An outline badge has no fill: .badge-outline-<variant> colours its text and ring
        if (flag(o.outline)) el.classList.add('badge', 'badge-outline', `badge-outline-${variant}`);
        else el.classList.add('badge', `badge-${variant}`);
        if (SIZES[o.size]) el.classList.add(SIZES[o.size]);
        el.classList.add(flag(o.pill) ? 'badge-pill' : 'badge-rounded');
        if (flag(o.pulse)) el.classList.add('badge-pulse');

        if (flag(o.removable) && !this._removeBtn) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'domma-badge-remove';
            btn.setAttribute('aria-label', 'Remove');
            btn.textContent = '×';
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this._fire('remove', this, e) === false) return;
                this.element.remove();
                this.destroy();
            });
            el.appendChild(btn);
            this._removeBtn = btn;
        } else if (!flag(o.removable) && this._removeBtn) {
            this._removeBtn.remove();
            this._removeBtn = null;
        }
    }

    _applyOptions() {
        this._apply();
    }

    /**
     * Set the badge variant.
     * @param {import('../elements.js').BadgeVariant} variant
     * @returns {this}
     */
    setVariant(variant) {
        this.options.variant = variant;
        this._apply();
        return this;
    }

    /**
     * Set the badge size.
     * @param {import('../elements.js').BadgeSize|'sm'|'lg'} size
     * @returns {this}
     */
    setSize(size) {
        this.options.size = size;
        this._apply();
        return this;
    }

    /**
     * Replace the text, keeping the remove button.
     * @param {string|number|null} text
     * @returns {this}
     */
    setText(text) {
        for (const node of Array.from(this.element.childNodes)) {
            if (node !== this._removeBtn) node.remove();
        }
        this.element.insertBefore(document.createTextNode(text == null ? '' : String(text)), this._removeBtn || null);
        return this;
    }

    destroy() {
        const el = this.element;
        if (el) {
            for (const c of ['badge', ...VARIANTS.map(v => `badge-${v}`), ...VARIANTS.map(v => `badge-outline-${v}`), 'badge-sm', 'badge-lg', 'badge-pill',
                'badge-rounded', 'badge-outline', 'badge-pulse']) {
                if (!this._had?.has(c)) el.classList.remove(c);
            }
            this._removeBtn?.remove();
            this._removeBtn = null;
        }
        super.destroy();
    }

    /**
     * Permanent alias of destroy() (the element stays in the page).
     * @returns {void}
     */
    remove(...args) {
        return this.destroy(...args);
    }
}

const VOID = new Set(['IMG', 'INPUT', 'BR', 'HR', 'AREA', 'BASE', 'COL', 'EMBED', 'LINK', 'META', 'SOURCE', 'TRACK', 'WBR', 'TEXTAREA', 'SELECT']);

/** @typedef {'primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark'} NumberBadgeVariant */

/**
 * @typedef {object} NumberBadgeOptions
 * @property {number} [count=0] - Initial count to display (0 hides the counter unless `dot`)
 * @property {number|null} [max] - Cap, e.g. 99 shows "99+"
 * @property {NumberBadgeVariant} [variant='danger'] - Colour variant
 * @property {boolean} [dot=false] - Show as dot indicator instead of number
 * @property {boolean} [pulse=false] - Enable pulse animation
 * @property {string|null} [borderColor] - Custom border ring colour
 * @property {string|null} [label] - Accessible name (default: the count, or "New" for a dot)
 * @property {((count: number, previous: number, badge: NumberBadgeInstance) => void)|null} [onChange] - The count changed
 */

/** @typedef {NumberBadge} NumberBadgeInstance */

export class NumberBadge extends Component {
    static componentName = 'number-badge';

    static defaults = {
        count: 0,
        max: null,                  // e.g. 99 shows "99+"
        variant: 'danger',
        dot: false,
        pulse: false,
        borderColor: null,
        label: null,                // accessible name; default "N"
        onChange: null
    };

    /**
     * @param {import('./shared.js').ComponentTarget} selector - The element the counter sits on
     * @param {NumberBadgeOptions} [options]
     */
    constructor(selector, options = {}) {
        super(resolveElement(selector), options);
        if (!this.element) return;
        const el = this.element;
        // A tag that cannot hold children carries the counter in its parent instead.
        this._holder = VOID.has(el.tagName) && el.parentElement ? el.parentElement : el;
        this._hostClassAdded = !this._holder.classList.contains('badge-counter-host');
        this._holder.classList.add('badge-counter-host');
        /** The `.badge-counter` span. @type {HTMLSpanElement} */
        this.counter = document.createElement('span');
        this.counter.className = 'badge-counter';
        this.counter.setAttribute('role', 'status');
        this.counter.setAttribute('aria-live', 'polite');
        this._holder.appendChild(this.counter);
        this._paint();
    }

    _paint() {
        const o = this.options;
        const c = this.counter;
        const count = Math.max(0, Math.trunc(num(o.count, 0)));
        o.count = count;
        c.className = `badge-counter badge-counter-${VARIANTS.includes(o.variant) ? o.variant : 'danger'}`;
        if (flag(o.dot)) c.classList.add('badge-dot');
        if (flag(o.pulse)) c.classList.add('badge-pulse');
        if (!flag(o.dot) && count === 0) c.classList.add('badge-counter-hidden');
        c.style.borderColor = o.borderColor || '';
        const max = o.max == null ? null : num(o.max, null);
        c.textContent = flag(o.dot) ? '' : (max !== null && count > max ? `${max}+` : String(count));
        c.setAttribute('aria-label', o.label || (flag(o.dot) ? 'New' : String(count)));
    }

    _applyOptions() {
        this._paint();
    }

    /**
     * Set the badge count.
     * @param {number} count
     * @returns {this}
     */
    setCount(count) {
        const previous = this.options.count;
        this.options.count = count;
        this._paint();
        if (this.options.count !== previous) this._fire('change', this.options.count, previous, this);
        return this;
    }

    /**
     * Increment the badge count.
     * @param {number} [by=1]
     * @returns {this}
     */
    increment(by = 1) {
        return this.setCount(this.getCount() + num(by, 1));
    }

    /**
     * Decrement the badge count (min 0).
     * @param {number} [by=1]
     * @returns {this}
     */
    decrement(by = 1) {
        return this.setCount(Math.max(0, this.getCount() - num(by, 1)));
    }

    /** @returns {number} The current count */
    getCount() {
        return num(this.options.count, 0);
    }

    /**
     * Toggle dot mode.
     * @param {boolean} dot
     * @returns {this}
     */
    setDot(dot) {
        this.options.dot = dot;
        this._paint();
        return this;
    }

    /**
     * Set the colour variant.
     * @param {NumberBadgeVariant} variant
     * @returns {this}
     */
    setVariant(variant) {
        this.options.variant = variant;
        this._paint();
        return this;
    }

    /**
     * Toggle pulse animation.
     * @param {boolean} pulse
     * @returns {this}
     */
    setPulse(pulse) {
        this.options.pulse = pulse;
        this._paint();
        return this;
    }

    destroy() {
        this.counter?.remove();
        if (this._holder && this._hostClassAdded) this._holder.classList.remove('badge-counter-host');
        super.destroy();
    }

    /**
     * Permanent alias of destroy() (the element stays in the page).
     * @returns {void}
     */
    remove(...args) {
        return this.destroy(...args);
    }
}

export default Badge;
