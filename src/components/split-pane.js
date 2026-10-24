/**
 * Split pane - E.splitPane(container, options).
 *
 * The container's element children are the panes; a gutter is inserted between each
 * pair. Layout is plain flexbox: every pane gets a fixed `flex-basis` worked out from its
 * share of the space left after the gutters, so nothing is absolutely positioned and a
 * pane can hold anything, another split pane included.
 *
 * Sizes are percentages of that space and always add up to 100. Minimum and maximum
 * sizes may be pixels or percentages; pixels are turned into percentages against the
 * container's current size whenever they are needed, which is why a resize of the
 * container re-applies them.
 *
 * Gutters are focusable `role="separator"` elements: the arrow keys move them, Home/End
 * go to the limits and Enter collapses a collapsible pane.
 *
 * Events: beforedrag (cancelable), dragstart, drag, dragend, resize, collapse, expand.
 */

import Component, {instanceOf} from '../component.js';
import storage from '../storage.js';
import {flag, num, uniqueId} from './shared.js';

const STORE_PREFIX = 'split-pane:';

/** The per-pane value of an option that may be one value or an array. */
function perPane(value, i, fallback) {
    const v = Array.isArray(value) ? value[i] : value;
    return v === undefined || v === null ? fallback : v;
}

const round = (n) => Math.round(n * 1000) / 1000;

/**
 * A pane size limit: px as a number, or a percentage string such as '20%'.
 * @typedef {number|string} SplitPaneSize
 */

/**
 * @typedef {object} SplitPaneOptions
 * @property {'horizontal'|'vertical'} [direction] - 'horizontal' = side by side (default), 'vertical' = stacked
 * @property {number[]|null} [sizes] - Percentages, one per pane (scaled to add up to 100); equal by default
 * @property {SplitPaneSize|SplitPaneSize[]} [minSize] - Minimum size, one value or one per pane (default 0)
 * @property {SplitPaneSize|null|Array<SplitPaneSize|null>} [maxSize] - Maximum size, one value or one per pane (default none)
 * @property {number} [gutterSize] - Gutter thickness in px (default 8)
 * @property {number} [snapOffset] - Snap to a limit when dragged within this many px of it (default 0)
 * @property {boolean|boolean[]} [collapsible] - Which panes the gutter gestures may collapse
 * @property {SplitPaneSize|SplitPaneSize[]} [collapsedSize] - What a collapsed pane shrinks to (default 0)
 * @property {boolean} [collapseButton] - A small toggle button in gutters next to a collapsible pane
 * @property {string|null} [persistKey] - Remember sizes and collapse state with S under 'split-pane:<key>'
 * @property {string|null} [cursor] - Gutter cursor (default col-resize / row-resize)
 * @property {boolean} [disabled]
 * @property {number} [step] - Percent per arrow key (default 1)
 * @property {number} [largeStep] - Percent per Shift+arrow (default 10)
 * @property {string} [gutterLabel] - The gutters' aria-label
 * @property {((gutterIndex: number, event: PointerEvent) => boolean|void)|null} [onBeforeDrag] - Return false to refuse a drag
 * @property {((sizes: number[], gutterIndex: number) => void)|null} [onDragStart]
 * @property {((sizes: number[], gutterIndex: number) => void)|null} [onDrag]
 * @property {((sizes: number[], gutterIndex: number) => void)|null} [onDragEnd]
 * @property {((sizes: number[]) => void)|null} [onResize] - Any size change: drag, keys, setSizes, collapse
 * @property {((paneIndex: number) => void)|null} [onCollapse]
 * @property {((paneIndex: number) => void)|null} [onExpand]
 */

/** @typedef {SplitPane} SplitPaneInstance */

export class SplitPane extends Component {
    static componentName = 'split-pane';

    static defaults = {
        direction: 'horizontal',   // 'horizontal' = side by side, 'vertical' = stacked
        sizes: null,               // percentages, one per pane; equal when omitted
        minSize: 0,                // px number or '20%' string; or an array, one per pane
        maxSize: null,             // as minSize; null = no maximum
        gutterSize: 8,             // px
        snapOffset: 0,             // px: a pane dragged within this of its minimum snaps to it
        collapsible: false,        // true, or an array of booleans, one per pane
        collapsedSize: 0,          // px or %: what a collapsed pane shrinks to
        collapseButton: false,     // draw a small collapse/expand button in each gutter that has a collapsible pane
        persistKey: null,          // remember sizes with S under 'split-pane:<key>'
        cursor: null,              // defaults to col-resize / row-resize
        disabled: false,
        step: 1,                   // % per arrow key
        largeStep: 10,             // % per Shift+arrow
        gutterLabel: 'Resize panes',
        onBeforeDrag: null,
        onDragStart: null,
        onDrag: null,
        onDragEnd: null,
        onResize: null,
        onCollapse: null,
        onExpand: null
    };

    /**
     * @param {string|HTMLElement} element - The container; its element children are the panes
     * @param {SplitPaneOptions} [options]
     */
    constructor(element, options = {}) {
        super(element, options);
        if (!this.element) return;
        this._gutters = [];
        this._drag = null;
        this._collapsed = [];
        this._restoreTo = [];
        this._addedIds = [];
        this._frame = 0;
        this._containerStyle = this.element.getAttribute('style');
        /** The pane elements. @type {HTMLElement[]} */
        this.panes = Array.from(this.element.children);
        this._paneStyles = this.panes.map(p => p.getAttribute('style'));
        this._build();
    }

    get horizontal() {
        return this.options.direction !== 'vertical';
    }

    // ---- set up ------------------------------------------------------------

    _build() {
        const el = this.element;
        el.classList.add('dm-split', this.horizontal ? 'dm-split-horizontal' : 'dm-split-vertical');
        this.panes.forEach((pane, i) => {
            pane.classList.add('dm-split-pane');
            if (!pane.id) {
                pane.id = uniqueId('dm-split-pane');
                this._addedIds.push(pane);
            }
            if (i > 0) this._gutters.push(this._makeGutter(i - 1));
        });
        this._gutters.forEach((g, i) => el.insertBefore(g, this.panes[i + 1]));

        let sizes = this._normalise(this.options.sizes);
        const stored = this._load();
        if (stored) {
            sizes = stored.sizes;
            this._collapsed = stored.collapsed;
            this._restoreTo = stored.restoreTo;
        }
        this._sizes = sizes;
        this._apply(this._clampAll(sizes));
        this._applyOptions();

        // A container that shrinks can push a pane under its pixel minimum. Re-clamp on the
        // next frame: only flex-basis changes, which never changes the container's own size,
        // so this cannot feed back into the observer.
        if (typeof ResizeObserver !== 'undefined') {
            this._observer = new ResizeObserver(() => {
                if (this._frame || this._drag) return;
                this._frame = requestAnimationFrame(() => {
                    this._frame = 0;
                    if (this.element) this._apply(this._clampAll(this._sizes));
                });
            });
            this._observer.observe(el);
        }
    }

    _makeGutter(i) {
        const g = document.createElement('div');
        g.className = 'dm-split-gutter';
        g.setAttribute('role', 'separator');
        g.setAttribute('aria-orientation', this.horizontal ? 'vertical' : 'horizontal');
        g.setAttribute('aria-controls', this.panes[i].id);
        g.dataset.index = String(i);
        this._addEventListener(g, 'pointerdown', (e) => this._onPointerDown(e, i));
        this._addEventListener(g, 'keydown', (e) => this._onKey(e, i));
        this._addEventListener(g, 'dblclick', (e) => {
            if (this.options.disabled || e.target.closest('.dm-split-toggle')) return;
            this._toggleFromGutter(i);
        });
        return g;
    }

    /** Settings that can change after set-up: disabled, gutter size, cursor, label, buttons. */
    _applyOptions() {
        if (!this._gutters) return;
        const o = this.options;
        const disabled = flag(o.disabled);
        const size = `${Math.max(0, num(o.gutterSize, 8))}px`;
        this.element.classList.toggle('dm-split-disabled', disabled);
        this._gutters.forEach((g, i) => {
            g.style.flex = `0 0 ${size}`;
            g.style.cursor = disabled ? '' : (o.cursor || (this.horizontal ? 'col-resize' : 'row-resize'));
            g.setAttribute('aria-label', o.gutterLabel || 'Resize panes');
            g.tabIndex = disabled ? -1 : 0;
            if (disabled) g.setAttribute('aria-disabled', 'true');
            else g.removeAttribute('aria-disabled');
            this._syncButton(g, i);
        });
        this._apply(this._clampAll(this._sizes));
    }

    _syncButton(gutter, i) {
        const want = flag(this.options.collapseButton) && this._collapseTarget(i) !== null;
        let btn = gutter.querySelector('.dm-split-toggle');
        if (!want) {
            if (btn) btn.remove();
            return;
        }
        if (!btn) {
            btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'dm-split-toggle';
            // The separator itself answers Enter, so the button is for the pointer only:
            // out of the tab order and hidden from the accessibility tree, not a second stop.
            btn.tabIndex = -1;
            btn.setAttribute('aria-hidden', 'true');
            this._addEventListener(btn, 'pointerdown', (e) => e.stopPropagation());
            this._addEventListener(btn, 'click', (e) => {
                e.stopPropagation();
                if (!this.options.disabled) this._toggleFromGutter(i);
            });
            gutter.appendChild(btn);
        }
        btn.disabled = flag(this.options.disabled);
    }

    // ---- sizes -------------------------------------------------------------

    /** Sizes as percentages that add up to 100, one per pane. */
    _normalise(sizes) {
        const n = this.panes.length;
        if (!n) return [];
        const list = Array.isArray(sizes) && sizes.length === n
            ? sizes.map(s => Math.max(0, parseFloat(s) || 0))
            : null;
        const total = list ? list.reduce((a, b) => a + b, 0) : 0;
        if (!list || total <= 0) return Array(n).fill(100 / n);
        return list.map(s => (s / total) * 100);
    }

    /** Space shared by the panes: the container less its gutters, in px. */
    _available() {
        const el = this.element;
        // The content box: percentages in flex-basis are of that, not of the border box.
        let whole = this.horizontal ? el.clientWidth : el.clientHeight;
        if (whole > 0) {
            const cs = getComputedStyle(el);
            whole -= this.horizontal
                ? (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0)
                : (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
        } else {
            const r = el.getBoundingClientRect(); // no layout box (or a test DOM)
            whole = this.horizontal ? r.width : r.height;
        }
        return Math.max(0, whole - this._gutters.length * Math.max(0, num(this.options.gutterSize, 8)));
    }

    /** A px number or '%' string as a percentage of the shared space. */
    _toPercent(value, available, fallback) {
        if (value === null || value === undefined || value === '') return fallback;
        const s = String(value).trim();
        if (s.endsWith('%')) return Math.min(100, Math.max(0, parseFloat(s) || 0));
        const px = parseFloat(s);
        if (!Number.isFinite(px)) return fallback;
        if (available <= 0) return px > 0 ? fallback : 0;
        return Math.min(100, Math.max(0, (px / available) * 100));
    }

    _limits(i, available = this._available()) {
        const o = this.options;
        const collapsed = !!this._collapsed[i];
        const min = collapsed
            ? this._toPercent(perPane(o.collapsedSize, i, 0), available, 0)
            : this._toPercent(perPane(o.minSize, i, 0), available, 0);
        const max = collapsed ? min : this._toPercent(perPane(o.maxSize, i, null), available, 100);
        return {min, max: Math.max(min, max)};
    }

    /** Pull every pane inside its limits, moving the difference to its neighbours. */
    _clampAll(sizes) {
        const available = this._available();
        const out = sizes.slice();
        for (let pass = 0; pass < 2; pass++) {
            for (let i = 0; i < out.length; i++) {
                const {min, max} = this._limits(i, available);
                const want = Math.min(max, Math.max(min, out[i]));
                const diff = want - out[i];
                if (!diff) continue;
                // Take from (or give to) the nearest panes that can spare it.
                let rest = diff;
                for (const j of this._neighbours(i)) {
                    if (!rest) break;
                    const lim = this._limits(j, available);
                    const next = Math.min(lim.max, Math.max(lim.min, out[j] - rest));
                    rest -= out[j] - next;
                    out[j] = next;
                }
                out[i] = want - rest;
            }
        }
        return out;
    }

    /** Pane indexes ordered by distance from i, nearest first. */
    _neighbours(i) {
        const list = [];
        for (let d = 1; d < this.panes.length; d++) {
            if (i + d < this.panes.length) list.push(i + d);
            if (i - d >= 0) list.push(i - d);
        }
        return list;
    }

    _apply(sizes) {
        this._sizes = sizes.map(round);
        const gutterTotal = this._gutters.length * Math.max(0, num(this.options.gutterSize, 8));
        this.panes.forEach((pane, i) => {
            const p = this._sizes[i];
            // P% of (container - gutters), written so the browser does the arithmetic.
            pane.style.flex = `0 0 calc(${p}% - ${round((gutterTotal * p) / 100)}px)`;
            pane.classList.toggle('dm-split-collapsed', !!this._collapsed[i]);
        });
        this._syncAria();
    }

    _syncAria() {
        const available = this._available();
        this._gutters.forEach((g, i) => {
            const a = this._limits(i, available);
            const b = this._limits(i + 1, available);
            const pair = this._sizes[i] + this._sizes[i + 1];
            g.setAttribute('aria-valuenow', String(Math.round(this._sizes[i])));
            g.setAttribute('aria-valuemin', String(Math.round(Math.max(a.min, pair - b.max))));
            g.setAttribute('aria-valuemax', String(Math.round(Math.min(a.max, pair - b.min))));
        });
    }

    /**
     * Move the boundary between pane i and pane i + 1 so pane i is `want` percent,
     * within both panes' limits.
     */
    _moveBoundary(i, want, {snap = false} = {}) {
        const available = this._available();
        const a = this._limits(i, available);
        const b = this._limits(i + 1, available);
        const pair = this._sizes[i] + this._sizes[i + 1];
        const lo = Math.max(a.min, pair - b.max);
        const hi = Math.min(a.max, pair - b.min);
        let next = Math.min(hi, Math.max(lo, want));
        if (snap && available > 0) {
            const snapPct = (Math.max(0, num(this.options.snapOffset, 0)) / available) * 100;
            if (next - a.min <= snapPct) next = Math.max(lo, a.min);
            else if (pair - next - b.min <= snapPct) next = Math.min(hi, pair - b.min);
        }
        const sizes = this._sizes.slice();
        sizes[i] = next;
        sizes[i + 1] = pair - next;
        const changed = Math.abs(sizes[i] - this._sizes[i]) > 1e-6;
        if (changed) {
            this._apply(sizes);
            this._fire('resize', this.getSizes());
        }
        return changed;
    }

    // ---- dragging ----------------------------------------------------------

    _onPointerDown(e, i) {
        if (this.options.disabled || this._drag) return;
        if (e.button !== undefined && e.button !== 0) return;
        if (this._fire('beforedrag', i, e) === false) return;
        e.preventDefault();
        const gutter = this._gutters[i];
        const rtl = this.horizontal && getComputedStyle(this.element).direction === 'rtl';
        this._drag = {
            index: i,
            pointerId: e.pointerId,
            start: this.horizontal ? e.clientX : e.clientY,
            startSize: this._sizes[i],
            available: this._available(),
            sign: rtl ? -1 : 1,
            gutter
        };
        try { gutter.setPointerCapture?.(e.pointerId); } catch { /* not a live pointer */ }
        // Panes stop taking pointer events while dragging, so an iframe in one cannot
        // swallow the moves (see .dm-split-dragging in elements.css).
        this.element.classList.add('dm-split-dragging');
        gutter.classList.add('is-dragging');
        gutter.addEventListener('pointermove', this._onPointerMove);
        gutter.addEventListener('pointerup', this._onPointerUp);
        gutter.addEventListener('pointercancel', this._onPointerUp);
        gutter.addEventListener('lostpointercapture', this._onPointerUp);
        this._fire('dragstart', this.getSizes(), i);
    }

    _onPointerMove = (e) => {
        const d = this._drag;
        if (!d || (d.pointerId !== undefined && e.pointerId !== undefined && e.pointerId !== d.pointerId)) return;
        if (d.available <= 0) return;
        const delta = ((this.horizontal ? e.clientX : e.clientY) - d.start) * d.sign;
        this._uncollapseForDrag(d.index);
        const want = d.startSize + (delta / d.available) * 100;
        if (this._moveBoundary(d.index, want, {snap: true})) this._fire('drag', this.getSizes(), d.index);
    };

    _onPointerUp = (e) => {
        const d = this._drag;
        if (!d) return;
        this._drag = null;
        const g = d.gutter;
        g.removeEventListener('pointermove', this._onPointerMove);
        g.removeEventListener('pointerup', this._onPointerUp);
        g.removeEventListener('pointercancel', this._onPointerUp);
        g.removeEventListener('lostpointercapture', this._onPointerUp);
        try { if (e?.pointerId !== undefined) g.releasePointerCapture?.(e.pointerId); } catch { /* already released */ }
        this.element.classList.remove('dm-split-dragging');
        g.classList.remove('is-dragging');
        this._save();
        this._fire('dragend', this.getSizes(), d.index);
    };

    /** Dragging either side of a collapsed pane opens it from its collapsed size. */
    _uncollapseForDrag(i) {
        for (const p of [i, i + 1]) {
            if (this._collapsed[p]) {
                this._collapsed[p] = false;
                this._restoreTo[p] = undefined;
                this._fire('expand', p);
            }
        }
    }

    // ---- keyboard ----------------------------------------------------------

    _onKey(e, i) {
        if (this.options.disabled) return;
        const rtl = this.horizontal && getComputedStyle(this.element).direction === 'rtl';
        const back = this.horizontal ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
        const fwd = this.horizontal ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
        const step = e.shiftKey ? num(this.options.largeStep, 10) : num(this.options.step, 1);
        let want = null;
        if (e.key === back) want = this._sizes[i] - step;
        else if (e.key === fwd) want = this._sizes[i] + step;
        else if (e.key === 'Home') want = -Infinity;
        else if (e.key === 'End') want = Infinity;
        else if (e.key === 'Enter') {
            if (this._collapseTarget(i) === null) return;
            e.preventDefault();
            this._toggleFromGutter(i);
            return;
        } else return;
        e.preventDefault();
        this._uncollapseForDrag(i);
        if (this._moveBoundary(i, want)) this._save();
    }

    // ---- collapsing --------------------------------------------------------

    _isCollapsible(i) {
        const c = this.options.collapsible;
        return Array.isArray(c) ? flag(c[i]) : flag(c);
    }

    /** The pane a gutter collapses: the one before it if it may, else the one after. */
    _collapseTarget(gutter) {
        // An already collapsed pane is the one to restore.
        if (this._collapsed[gutter] && this._isCollapsible(gutter)) return gutter;
        if (this._collapsed[gutter + 1] && this._isCollapsible(gutter + 1)) return gutter + 1;
        if (this._isCollapsible(gutter)) return gutter;
        if (this._isCollapsible(gutter + 1)) return gutter + 1;
        return null;
    }

    _toggleFromGutter(i) {
        const target = this._collapseTarget(i);
        if (target === null) return;
        if (this._collapsed[target]) this.expand(target);
        else this.collapse(target);
    }

    /**
     * Collapse a pane toward the edge it sits against; the space goes to its neighbour.
     * Works on any pane, collapsible or not (the option only governs the gutter's gestures).
     * @param {number} i - pane index
     * @returns {this}
     */
    collapse(i) {
        if (!this.panes?.[i] || this._collapsed[i]) return this;
        const neighbour = i + 1 < this.panes.length ? i + 1 : i - 1;
        if (neighbour < 0) return this;
        this._restoreTo[i] = this._sizes[i];
        this._collapsed[i] = true;
        const target = this._limits(i).min;
        const sizes = this._sizes.slice();
        sizes[neighbour] += sizes[i] - target;
        sizes[i] = target;
        this._apply(this._clampAll(sizes));
        this._save();
        this._fire('resize', this.getSizes());
        this._fire('collapse', i);
        return this;
    }

    /**
     * Restore a collapsed pane to the size it had, taking the space back from its neighbour.
     * @param {number} i - pane index
     * @returns {this}
     */
    expand(i) {
        if (!this.panes?.[i] || !this._collapsed[i]) return this;
        this._collapsed[i] = false;
        const neighbour = i + 1 < this.panes.length ? i + 1 : i - 1;
        const want = this._restoreTo[i] ?? 100 / this.panes.length;
        this._restoreTo[i] = undefined;
        const sizes = this._sizes.slice();
        const lim = this._limits(neighbour);
        const give = Math.max(0, Math.min(want - sizes[i], sizes[neighbour] - lim.min));
        sizes[i] += give;
        sizes[neighbour] -= give;
        this._apply(this._clampAll(sizes));
        this._save();
        this._fire('resize', this.getSizes());
        this._fire('expand', i);
        return this;
    }

    /** @param {number} i @returns {boolean} whether pane i is collapsed */
    isCollapsed(i) {
        return !!this._collapsed?.[i];
    }

    // ---- public API --------------------------------------------------------

    /**
     * The pane sizes, as percentages of the space the panes share (they add up to 100).
     * @returns {number[]}
     */
    getSizes() {
        return (this._sizes || []).map(s => Math.round(s * 100) / 100);
    }

    /**
     * Set every pane's size. The array is scaled to add up to 100 and then pulled inside
     * each pane's limits. Collapsed panes are expanded.
     * @param {number[]} sizes - one per pane
     * @returns {this}
     */
    setSizes(sizes) {
        if (!this.panes?.length) return this;
        this._collapsed = [];
        this._restoreTo = [];
        this._apply(this._clampAll(this._normalise(sizes)));
        this._save();
        this._fire('resize', this.getSizes());
        return this;
    }

    _load() {
        const key = this.options.persistKey;
        if (!key) return null;
        let data = null;
        try { data = storage.get(STORE_PREFIX + key); } catch { return null; }
        const sizes = Array.isArray(data) ? data : data?.sizes;
        if (!Array.isArray(sizes) || sizes.length !== this.panes.length || !sizes.every(Number.isFinite)) return null;
        return {
            sizes: this._normalise(sizes),
            collapsed: Array.isArray(data?.collapsed) ? data.collapsed.map(Boolean) : [],
            restoreTo: Array.isArray(data?.restoreTo) ? data.restoreTo.map(v => (Number.isFinite(v) ? v : undefined)) : []
        };
    }

    _save() {
        const key = this.options.persistKey;
        if (!key) return;
        try {
            storage.set(STORE_PREFIX + key, {
                sizes: this.getSizes(),
                collapsed: this.panes.map((_, i) => !!this._collapsed[i]),
                restoreTo: this.panes.map((_, i) => this._restoreTo[i] ?? null)
            });
        } catch { /* storage full or blocked - sizes simply are not remembered */ }
    }

    /**
     * Remove the gutters and give the panes and container back their own styles.
     * @returns {void}
     */
    destroy() {
        if (this._drag) this._onPointerUp({});
        if (this._frame) cancelAnimationFrame(this._frame);
        this._observer?.disconnect();
        this._observer = null;
        for (const g of this._gutters || []) g.remove();
        this._gutters = [];
        (this.panes || []).forEach((pane, i) => {
            pane.classList.remove('dm-split-pane', 'dm-split-collapsed');
            const style = this._paneStyles[i];
            if (style === null) pane.removeAttribute('style');
            else pane.setAttribute('style', style);
        });
        for (const pane of this._addedIds || []) pane.removeAttribute('id');
        if (this.element) {
            this.element.classList.remove('dm-split', 'dm-split-horizontal', 'dm-split-vertical',
                'dm-split-dragging', 'dm-split-disabled');
            if (this._containerStyle === null || this._containerStyle === undefined) this.element.removeAttribute('style');
            else this.element.setAttribute('style', this._containerStyle);
        }
        super.destroy();
        this._onDestroy?.();
    }
}

/**
 * E.splitPane: one instance per container; calling it again updates the existing one.
 * @param {Element} el
 * @param {SplitPaneOptions} [options]
 * @returns {SplitPane}
 */
export function splitPaneFor(el, options = {}) {
    const existing = instanceOf(el, 'split-pane');
    if (existing) return existing.setOptions(options);
    return new SplitPane(el, options);
}

export default SplitPane;
