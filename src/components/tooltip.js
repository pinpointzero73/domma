/**
 * Tooltip - E.tooltip(selector, options).
 *
 * Nothing wraps the target: the bubble is a page-level `.domma-tooltip` on
 * document.body, `position: fixed` at the target (the way Popover places its panel),
 * styled by elements.css. Every match of a selector gets its own instance; the first
 * is returned, with a non-enumerable `all()` for the rest.
 *
 * Events: show, hide - as `onShow` / `onHide`, `.on()` and `dm:tooltip:show|hide`.
 */

import Component, {instanceOf} from '../component.js';
import {fill, flag, num, uniqueId} from './shared.js';

const OPPOSITE = {top: 'bottom', bottom: 'top', left: 'right', right: 'left'};

// The bubble lives on <body>, so a target taken off the page (a row re-rendered by the
// click that was hovering it) never gets its mouseleave. One observer, running only while
// a tooltip is showing, hides the bubbles whose targets have gone.
const showing = new Set();
let observer = null;

function watch(tooltip) {
    showing.add(tooltip);
    if (observer || typeof MutationObserver === 'undefined' || !document.body) return;
    observer = new MutationObserver(() => {
        for (const t of [...showing]) {
            if (!t.element || !t.element.isConnected) t.close({immediate: true});
        }
    });
    observer.observe(document.body, {childList: true, subtree: true});
}

function unwatch(tooltip) {
    showing.delete(tooltip);
    if (!showing.size && observer) {
        observer.disconnect();
        observer = null;
    }
}

export class Tooltip extends Component {
    static componentName = 'tooltip';

    static defaults = {
        content: '',
        position: 'top',            // 'top' | 'bottom' | 'left' | 'right' (alias: placement)
        trigger: 'hover',           // 'hover' | 'click' | 'focus' | 'manual', or several: 'hover focus'
        delay: 0,                   // ms, or {show, hide}
        hideDelay: 0,
        animation: true,
        offset: 8,
        html: false,
        safe: true,
        visible: false,
        className: '',
        maxWidth: null,
        onShow: null,
        onHide: null
    };

    constructor(element, options = {}) {
        super(element, Tooltip.normalise(options));
        if (!this.element) return;
        this._visible = false;
        this._bubble = null;
        this._timers = {};
        this._takeTitle();
        this._bindTrigger();
        if (flag(this.options.visible)) this.show();
    }

    /** Option aliases the old wrapper accepted. */
    static normalise(options = {}) {
        const o = {...options};
        if (o.placement && !o.position) o.position = o.placement;
        if (o.delay && typeof o.delay === 'object') {
            if (o.delay.hide !== undefined && o.hideDelay === undefined) o.hideDelay = o.delay.hide;
            o.delay = o.delay.show ?? 0;
        }
        return o;
    }

    /** Content falls back to data-tooltip / title; a title is held aside so the browser's own does not show too. */
    _takeTitle() {
        const el = this.element;
        const c = this.options.content;
        if ((c === undefined || c === null || c === '') && !el.dataset.tooltip && el.hasAttribute('title')) {
            this._title = el.getAttribute('title');
            el.removeAttribute('title');
        }
    }

    _content() {
        const c = this.options.content;
        if (c !== undefined && c !== null && c !== '') return typeof c === 'function' ? c(this.element) : c;
        return this.element.dataset.tooltip || this._title || '';
    }

    _bindTrigger() {
        for (const {element, event, handler} of this._eventHandlers) element.removeEventListener(event, handler);
        this._eventHandlers = [];
        const el = this.element;
        const triggers = String(this.options.trigger || 'hover').split(/\s+/);
        if (triggers.includes('hover')) {
            this._addEventListener(el, 'mouseenter', () => this.show());
            this._addEventListener(el, 'mouseleave', () => this.hide());
        }
        if (triggers.includes('focus') || triggers.includes('hover')) {
            // A hover tooltip shows for keyboard focus too, not for the focus a click gives.
            const keyboardOnly = !triggers.includes('focus');
            this._addEventListener(el, 'focusin', (e) => {
                let visible = true;
                try { visible = e.target.matches(':focus-visible'); } catch { /* old engine */ }
                if (!keyboardOnly || visible) this.show();
            });
            this._addEventListener(el, 'focusout', () => this.hide());
        }
        if (triggers.includes('click')) {
            this._addEventListener(el, 'click', () => this.toggle());
        }
        this._addEventListener(el, 'keydown', (e) => {
            if (e.key === 'Escape' && this._visible) this.hide({immediate: true});
        });
    }

    _clear(name) {
        clearTimeout(this._timers[name]);
        this._timers[name] = null;
    }

    _make() {
        const o = this.options;
        const bubble = document.createElement('div');
        bubble.className = `domma-tooltip${o.className ? ' ' + o.className : ''}`;
        bubble.id = uniqueId('dm-tooltip');
        bubble.setAttribute('role', 'tooltip');
        if (o.maxWidth) bubble.style.maxWidth = typeof o.maxWidth === 'number' ? `${o.maxWidth}px` : String(o.maxWidth);
        if (!flag(o.animation, true)) bubble.style.transition = 'none';
        this._bubble = bubble;
        this._write();
        document.body.appendChild(bubble);
        const ids = (this.element.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
        if (!ids.includes(bubble.id)) this.element.setAttribute('aria-describedby', [...ids, bubble.id].join(' '));
    }

    _write() {
        if (!this._bubble) return;
        const c = this._content();
        fill(this._bubble, c, {text: !flag(this.options.html), safe: this.options.safe});
    }

    _unmake() {
        const bubble = this._bubble;
        if (!bubble) return;
        this._bubble = null;
        bubble.remove();
        const ids = (this.element.getAttribute('aria-describedby') || '').split(/\s+/).filter(id => id && id !== bubble.id);
        if (ids.length) this.element.setAttribute('aria-describedby', ids.join(' '));
        else this.element.removeAttribute('aria-describedby');
    }

    /** Place the bubble beside the target, flipping to the other side when it would leave the viewport. */
    _place() {
        const bubble = this._bubble;
        if (!bubble) return;
        const r = this.element.getBoundingClientRect();
        const b = bubble.getBoundingClientRect();
        const gap = num(this.options.offset, 8);
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const at = (side) => {
            switch (side) {
                case 'bottom': return {top: r.bottom + gap, left: r.left + (r.width - b.width) / 2};
                case 'left': return {top: r.top + (r.height - b.height) / 2, left: r.left - b.width - gap};
                case 'right': return {top: r.top + (r.height - b.height) / 2, left: r.right + gap};
                default: return {top: r.top - b.height - gap, left: r.left + (r.width - b.width) / 2};
            }
        };
        const fits = (p) => p.top >= 0 && p.left >= 0 && p.top + b.height <= vh && p.left + b.width <= vw;
        let side = OPPOSITE[this.options.position] ? this.options.position : 'top';
        let pos = at(side);
        if (!fits(pos) && fits(at(OPPOSITE[side]))) {
            side = OPPOSITE[side];
            pos = at(side);
        }
        pos.left = Math.min(Math.max(8, pos.left), Math.max(8, vw - b.width - 8));
        pos.top = Math.min(Math.max(8, pos.top), Math.max(8, vh - b.height - 8));
        bubble.style.top = `${Math.round(pos.top)}px`;
        bubble.style.left = `${Math.round(pos.left)}px`;
        bubble.dataset.position = side;
    }

    _onScroll = () => {
        if (!this._visible) return;
        if (!this.element.isConnected) this.close({immediate: true});
        else this._place();
    };

    // ---- public API -----------------------------------------------------

    open() {
        this._clear('hide');
        if (this._visible || this._timers.show) return this;
        const run = () => {
            this._timers.show = null;
            if (!this.element.isConnected) return;
            if (!this._bubble) this._make();
            this._visible = true;
            this._place();
            void this._bubble.offsetHeight;
            this._bubble.classList.add('show');
            window.addEventListener('scroll', this._onScroll, {capture: true, passive: true});
            window.addEventListener('resize', this._onScroll, {passive: true});
            watch(this);
            this._fire('show', this);
        };
        const ms = num(this.options.delay, 0);
        if (ms > 0) this._timers.show = setTimeout(run, ms);
        else run();
        return this;
    }

    close(opts = {}) {
        this._clear('show');
        if (!this._visible || this._timers.hide) return this;
        const run = () => {
            this._timers.hide = null;
            this._visible = false;
            unwatch(this);
            window.removeEventListener('scroll', this._onScroll, {capture: true});
            window.removeEventListener('resize', this._onScroll);
            const bubble = this._bubble;
            if (bubble) bubble.classList.remove('show');
            const fade = flag(this.options.animation, true) && !opts.immediate ? 150 : 0;
            if (fade) this._timers.fade = setTimeout(() => { if (!this._visible) this._unmake(); }, fade);
            else this._unmake();
            this._fire('hide', this);
        };
        const ms = opts.immediate ? 0 : num(this.options.hideDelay, 0);
        if (ms > 0) this._timers.hide = setTimeout(run, ms);
        else run();
        return this;
    }

    /** Permanent alias of open(), by name. */
    show(...args) {
        return this.open(...args);
    }

    /** Permanent alias of close(), by name. */
    hide(...args) {
        return this.close(...args);
    }

    toggle() {
        return this._visible ? this.close() : this.open();
    }

    isVisible() {
        return this._visible;
    }

    isOpen() {
        return this._visible;
    }

    setContent(content) {
        this.options.content = content;
        this._write();
        if (this._visible) this._place();
        return this;
    }

    setPosition(position) {
        this.options.position = position;
        if (this._visible) this._place();
        return this;
    }

    setOptions(newOptions = {}) {
        return super.setOptions(Tooltip.normalise(newOptions));
    }

    _applyOptions() {
        this._bindTrigger();
        this._write();
        if (this._visible) this._place();
    }

    destroy() {
        Object.values(this._timers || {}).forEach(clearTimeout);
        if (this._bubble) {
            window.removeEventListener('scroll', this._onScroll, {capture: true});
            window.removeEventListener('resize', this._onScroll);
        }
        this._unmake();
        this._visible = false;
        unwatch(this);
        if (this._title !== undefined && this.element && !this.element.hasAttribute('title')) {
            this.element.setAttribute('title', this._title);
        }
        super.destroy();
    }
}

/**
 * E.tooltip: an instance per matched element (an existing one is updated, not doubled).
 * @param {Element[]} elements
 * @param {Object} options
 * @returns {Tooltip[]}
 */
export function tooltipsFor(elements, options = {}) {
    return elements.map((el) => {
        const existing = instanceOf(el, 'tooltip');
        if (existing) return existing.setOptions(options);
        return new Tooltip(el, options);
    });
}

export default Tooltip;
