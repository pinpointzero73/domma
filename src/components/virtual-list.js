/**
 * Virtual list - E.virtualList(container, options).
 *
 * Renders only the rows in (and just around) the visible part of a scrolling container,
 * so a list of 100,000 rows costs the same as a list of 30. The container is the
 * scroller: give it a height in CSS (a fixed height, a max-height, or a flex child with
 * `min-height: 0`) and the list fills it.
 *
 * Inside the container:
 *   .dm-vlist-spacer  - an empty block as tall as every row together, which is what the
 *                       scrollbar measures;
 *   .dm-vlist-items   - role="list", holding the rendered rows, each absolutely placed
 *                       with a transform at its own offset (no layout of the rows above it);
 *   .dm-vlist-status  - the loading / end / error row of an infinite list.
 *
 * Every row is placed by its own offset rather than flowed, so a row can stay rendered
 * while it is far outside the window - which is how the focused row survives being
 * scrolled away (a screen reader or keyboard user would otherwise lose their place).
 *
 * Heights are either fixed (`itemHeight: 40`) or measured (`itemHeight: 'auto'`, with
 * `estimatedItemHeight` for rows not yet seen). Measured heights are cached by key, and
 * a row above the viewport that turns out taller or shorter than its estimate moves the
 * scroll position by the difference, so what is on screen stays put.
 *
 * Strings returned by `render()` are HTML and are sanitised (`sanitise()` in
 * src/sanitize.js, DOMPurify when loaded) unless `safe: false`. Return an Element to
 * put your own nodes in untouched.
 *
 * Not supported: horizontal lists and sticky group headers - both need a second layout
 * model, and neither is needed for the common cases (feeds, logs, pickers, tables of
 * records). Use CSS `position: sticky` inside a row for a row-local header.
 *
 * Events: render, scroll, loadmore, loaded, end, error, itemclick.
 */

import Component, {instanceOf} from '../component.js';
import {fill, flag, num, reducedMotion, uniqueId} from './shared.js';

export class VirtualList extends Component {
    static componentName = 'virtual-list';

    static defaults = {
        items: null,               // an array; or use count + getItem
        count: 0,
        getItem: null,             // (index) => item
        itemHeight: 40,            // px, or 'auto' to measure every row
        estimatedItemHeight: 40,   // px, for rows not yet measured ('auto' only)
        overscan: 4,               // rows rendered beyond each edge of the viewport
        render: null,              // (item, index) => string | Element
        safe: true,                // false: render() strings are inserted unsanitised
        keyField: null,            // property name or (item, index) => key; default: the index
        label: null,               // aria-label for the list
        loadMore: null,            // ({count, page}) => Promise<items[] | {items, done}>
        threshold: 200,            // px from the end at which loadMore is called
        loadingTemplate: null,     // string (HTML) | Element | () => string|Element
        endTemplate: null,         // shown once loadMore says it is done; nothing by default
        errorTemplate: null,       // a [data-vlist-retry] element inside it retries
        rowClass: '',
        onRender: null,
        onScroll: null,
        onLoadMore: null,
        onLoaded: null,
        onEnd: null,
        onError: null,
        onItemClick: null
    };

    constructor(element, options = {}) {
        super(element, options);
        if (!this.element) return;
        this._id = uniqueId('dm-vlist');
        this._rows = new Map();        // key -> {el, index, item, key}
        this._rowByEl = new WeakMap();  // row element -> the same record
        this._heights = new Map();     // key -> measured px ('auto' only)
        this._offsets = null;          // Float64Array(count + 1), 'auto' only
        this._dirtyFrom = 0;
        this._active = -1;
        this._focusWithin = false;
        this._frame = 0;
        this._range = {start: 0, end: -1};
        this._load = {busy: false, done: false, error: null, page: 0, gen: 0};
        this._statusHeight = 0;
        this._setData(this.options.items, this.options.count, this.options.getItem);
        this._build();
        this._render();
    }

    // ---- data ----------------------------------------------------------------

    _setData(items, count, getItem) {
        if (Array.isArray(items) || (items && typeof items !== 'number' && typeof items.length === 'number')) {
            this._items = Array.from(items);
            this._count = null;
            this._getItem = null;
        } else if (typeof getItem === 'function') {
            this._items = null;
            this._count = Math.max(0, Math.floor(num(count, 0)));
            this._getItem = getItem;
        } else {
            this._items = [];
            this._count = null;
            this._getItem = null;
        }
        this._dirtyFrom = 0;
    }

    /** How many rows there are. */
    get count() {
        return this._items ? this._items.length : this._count;
    }

    _itemAt(i) {
        return this._items ? this._items[i] : this._getItem(i);
    }

    _keyOf(item, i) {
        const kf = this.options.keyField;
        if (typeof kf === 'function') return kf(item, i);
        if (kf && item !== null && typeof item === 'object' && item[kf] !== undefined) return item[kf];
        return i;
    }

    get _fixed() {
        const h = this.options.itemHeight;
        return h !== 'auto' && num(h, 0) > 0;
    }

    get _rowHeight() {
        return num(this.options.itemHeight, 40);
    }

    get _estimate() {
        return Math.max(1, num(this.options.estimatedItemHeight, 40));
    }

    // ---- geometry ------------------------------------------------------------

    /** Bring the offset table up to date ('auto' only). Linear from the first change. */
    _syncOffsets() {
        const n = this.count;
        if (!this._offsets || this._offsets.length !== n + 1) {
            const next = new Float64Array(n + 1);
            this._offsets = next;
            this._dirtyFrom = 0;
        }
        if (this._dirtyFrom > n) return;
        const off = this._offsets;
        const est = this._estimate;
        for (let i = this._dirtyFrom; i < n; i++) {
            const h = this._heights.get(this._keyOf(this._itemAt(i), i));
            off[i + 1] = off[i] + (h === undefined ? est : h);
        }
        this._dirtyFrom = n + 1;
    }

    _dirty(index) {
        this._dirtyFrom = Math.min(this._dirtyFrom, Math.max(0, index));
    }

    _offset(i) {
        if (this._fixed) return i * this._rowHeight;
        this._syncOffsets();
        return this._offsets[Math.min(Math.max(0, i), this.count)];
    }

    _heightOf(i) {
        if (this._fixed) return this._rowHeight;
        return this._offset(i + 1) - this._offset(i);
    }

    _total() {
        return this._offset(this.count);
    }

    /** The index of the row covering y (clamped to the list). */
    _indexAt(y) {
        const n = this.count;
        if (!n) return 0;
        if (this._fixed) return Math.min(n - 1, Math.max(0, Math.floor(y / this._rowHeight)));
        this._syncOffsets();
        const off = this._offsets;
        let lo = 0;
        let hi = n - 1;
        while (lo < hi) {
            const mid = (lo + hi + 1) >> 1;
            if (off[mid] <= y) lo = mid;
            else hi = mid - 1;
        }
        return lo;
    }

    _viewport() {
        return Math.max(0, this.element.clientHeight || 0);
    }

    /**
     * The rows at least partly on screen, first and last index inclusive.
     * @returns {{start: number, end: number}} end is -1 for an empty list
     */
    getVisibleRange() {
        const n = this.count;
        if (!n || !this.element) return {start: 0, end: -1};
        const top = this.element.scrollTop;
        const start = this._indexAt(top);
        const end = this._indexAt(top + Math.max(1, this._viewport()) - 1);
        return {start, end};
    }

    // ---- DOM -----------------------------------------------------------------

    _build() {
        const el = this.element;
        // The caller's own children are put back by destroy().
        this._original = document.createDocumentFragment();
        while (el.firstChild) this._original.appendChild(el.firstChild);
        el.classList.add('dm-vlist');
        el.classList.toggle('dm-vlist-fixed', this._fixed);

        this._spacer = document.createElement('div');
        this._spacer.className = 'dm-vlist-spacer';
        this._spacer.setAttribute('aria-hidden', 'true');

        this._list = document.createElement('div');
        this._list.className = 'dm-vlist-items';
        this._list.id = this._id;
        this._list.setAttribute('role', 'list');
        this._list.tabIndex = -1;       // somewhere for focus to land when the rows go
        if (this.options.label) this._list.setAttribute('aria-label', this.options.label);

        this._status = document.createElement('div');
        this._status.className = 'dm-vlist-status';
        this._status.setAttribute('role', 'status');
        this._status.setAttribute('aria-live', 'polite');
        this._status.hidden = true;

        el.append(this._spacer, this._list, this._status);

        this._addEventListener(el, 'scroll', this._onScroll);
        this._addEventListener(this._list, 'click', this._onClick);
        this._addEventListener(this._list, 'keydown', this._onKey);
        this._addEventListener(this._list, 'focusin', this._onFocusIn);
        this._addEventListener(this._list, 'focusout', this._onFocusOut);
        this._addEventListener(this._status, 'click', (e) => {
            if (e.target.closest?.('[data-vlist-retry]')) this.retry();
        });

        if (typeof ResizeObserver !== 'undefined') {
            // The viewport changing height changes which rows are needed. Our writes never
            // change the container's size, so this cannot loop.
            this._hostObserver = new ResizeObserver(() => this._schedule());
            this._hostObserver.observe(el);
            // Rows whose content changes height later (an image loading) are re-measured.
            this._rowObserver = new ResizeObserver((entries) => this._onRowResize(entries));
        }
    }

    _schedule() {
        if (this._frame || !this.element) return;
        const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (fn) => setTimeout(fn, 16);
        this._frame = raf(() => {
            this._frame = 0;
            if (!this.element) return;
            this._render();
        });
    }

    _onScroll = () => {
        if (this._frame) return;
        const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (fn) => setTimeout(fn, 16);
        this._frame = raf(() => {
            this._frame = 0;
            if (!this.element) return;
            this._render();
            this._fire('scroll', this.getVisibleRange());
        });
    };

    _makeRow() {
        const row = document.createElement('div');
        row.className = 'dm-vlist-row' + (this.options.rowClass ? ` ${this.options.rowClass}` : '');
        row.setAttribute('role', 'listitem');
        row.tabIndex = -1;
        return row;
    }

    _fillRow(row, item, index) {
        const render = this.options.render;
        if (typeof render !== 'function') {
            row.textContent = item === null || item === undefined ? '' : String(
                typeof item === 'object' ? (item.label ?? item.title ?? item.name ?? '') : item
            );
            return;
        }
        fill(row, render(item, index), {safe: this.options.safe !== false && this.options.safe !== 'false'});
    }

    /**
     * Render the rows the viewport needs. Synchronous: used by the scroll frame and by
     * every method that changes the data.
     * @param {boolean} [force] - re-render every row's content, not just new ones
     */
    _render(force = false) {
        if (!this.element || !this._list) return;
        const hadFocus = this._focusWithin && this._list.contains(document.activeElement);
        // Measuring a new row can change which rows are needed; a couple of passes settle it.
        let changedRange = false;
        for (let pass = 0; pass < 3; pass++) {
            const measured = this._renderPass(force && pass === 0);
            if (measured.range) changedRange = true;
            if (!measured.resized) break;
        }

        const n = this.count;
        if (this._active >= n) this._active = n - 1;
        this._syncTabStop();
        if (hadFocus && !this._list.contains(document.activeElement)) {
            const row = this._rowFor(this._active);
            (row || this._list).focus({preventScroll: true});
        }
        if (changedRange) this._fire('render', {...this._range});
        this._maybeLoad();
    }

    /** One placement pass. @returns {{range: boolean, resized: boolean}} */
    _renderPass(force) {
        const n = this.count;
        const fixed = this._fixed;
        const top = this.element.scrollTop;
        const viewport = this._viewport();
        const overscan = Math.max(0, Math.floor(num(this.options.overscan, 4)));

        let start = 0;
        let end = -1;
        if (n) {
            const first = this._indexAt(top);
            const last = this._indexAt(top + Math.max(1, viewport) - 1);
            start = Math.max(0, first - overscan);
            end = Math.min(n - 1, last + overscan);
        }

        const wanted = new Map(); // key -> index
        for (let i = start; i <= end; i++) wanted.set(this._keyOf(this._itemAt(i), i), i);
        // The focused row stays rendered wherever it is.
        if (this._focusWithin && this._active >= 0 && this._active < n && (this._active < start || this._active > end)) {
            wanted.set(this._keyOf(this._itemAt(this._active), this._active), this._active);
        }

        for (const [key, row] of this._rows) {
            if (!wanted.has(key)) {
                this._rowObserver?.unobserve(row.el);
                row.el.remove();
                this._rows.delete(key);
            }
        }

        const setSize = this.options.loadMore && !this._load.done ? -1 : n;
        const fresh = [];
        const frag = document.createDocumentFragment();
        for (const [key, index] of wanted) {
            const item = this._itemAt(index);
            let row = this._rows.get(key);
            if (!row) {
                row = {el: this._makeRow(), index: -1, item: undefined, key};
                this._rows.set(key, row);
                this._rowByEl.set(row.el, row);
                this._fillRow(row.el, item, index);
                row.item = item;
                frag.appendChild(row.el);
                fresh.push(row);
            } else if (force || row.item !== item || row.index !== index) {
                // New data, or a keyed row that moved (render() may show its index).
                this._fillRow(row.el, item, index);
                row.item = item;
                if (!fixed) fresh.push(row);
            }
            if (row.index !== index) {
                row.index = index;
                row.el.dataset.index = String(index);
                row.el.setAttribute('aria-posinset', String(index + 1));
            }
            if (row.el.getAttribute('aria-setsize') !== String(setSize)) row.el.setAttribute('aria-setsize', String(setSize));
            if (fixed) {
                const h = `${this._rowHeight}px`;
                if (row.el.style.height !== h) row.el.style.height = h;
            }
        }
        if (frag.firstChild) this._list.appendChild(frag);

        // Measure the new rows in one read, after every write above.
        let resized = false;
        if (!fixed && fresh.length) {
            let anchor = 0;
            const firstVisible = n ? this._indexAt(top) : 0;
            const sizes = fresh.map(r => r.el.offsetHeight);
            fresh.forEach((row, k) => {
                const h = sizes[k];
                if (!h) return; // not laid out (hidden, or a test DOM): keep the estimate
                const before = this._heightOf(row.index);
                if (Math.abs(h - before) < 0.5) {
                    this._heights.set(row.key, h);
                    return;
                }
                if (row.index < firstVisible) anchor += h - before;
                this._heights.set(row.key, h);
                this._dirty(row.index);
                resized = true;
            });
            for (const row of fresh) this._rowObserver?.observe(row.el);
            if (anchor) this.element.scrollTop = top + anchor;
        }

        for (const row of this._rows.values()) {
            const t = `translateY(${this._offset(row.index)}px)`;
            if (row.el.style.transform !== t) row.el.style.transform = t;
        }

        this._placeStatus();
        const range = start !== this._range.start || end !== this._range.end;
        this._range = {start, end};
        return {range, resized};
    }

    _placeStatus() {
        const total = this._total();
        const t = `translateY(${total}px)`;
        if (this._status.style.transform !== t) this._status.style.transform = t;
        const h = `${total + (this._status.hidden ? 0 : this._statusHeight)}px`;
        if (this._spacer.style.height !== h) this._spacer.style.height = h;
    }

    _onRowResize(entries) {
        if (this._fixed || !this.element) return;
        let changed = false;
        let anchor = 0;
        const top = this.element.scrollTop;
        const firstVisible = this.count ? this._indexAt(top) : 0;
        for (const entry of entries) {
            const row = this._rowByEl.get(entry.target);
            if (!row || this._rows.get(row.key) !== row) continue;
            const box = entry.borderBoxSize?.[0];
            const h = box ? box.blockSize : row.el.offsetHeight;
            if (!h) continue;
            const before = this._heights.get(row.key);
            if (before !== undefined && Math.abs(before - h) < 0.5) continue;
            const was = this._heightOf(row.index);
            if (row.index < firstVisible) anchor += h - was;
            this._heights.set(row.key, h);
            this._dirty(row.index);
            changed = true;
        }
        if (!changed) return;
        if (anchor) this.element.scrollTop = top + anchor;
        this._schedule();
    }

    _rowFor(index) {
        for (const row of this._rows.values()) if (row.index === index) return row.el;
        return null;
    }

    /** One tab stop: the active row, or the first row on screen when that is not rendered. */
    _syncTabStop() {
        let stop = this._rowFor(this._active);
        if (!stop && this.count) {
            const {start} = this.getVisibleRange();
            stop = this._rowFor(start) || this._list.querySelector('.dm-vlist-row');
        }
        for (const row of this._rows.values()) {
            const want = row.el === stop ? 0 : -1;
            if (row.el.tabIndex !== want) row.el.tabIndex = want;
        }
    }

    // ---- interaction ---------------------------------------------------------

    _rowOf(target) {
        const el = target?.closest?.('.dm-vlist-row');
        return el && el.parentNode === this._list ? el : null;
    }

    _onClick = (e) => {
        const el = this._rowOf(e.target);
        if (!el) return;
        const index = Number(el.dataset.index);
        this._active = index;
        this._syncTabStop();
        this._fire('itemclick', this._itemAt(index), index, e);
    };

    _onFocusIn = (e) => {
        this._focusWithin = true;
        const el = this._rowOf(e.target);
        if (el) {
            this._active = Number(el.dataset.index);
            this._syncTabStop();
        }
    };

    _onFocusOut = (e) => {
        // Focus left the list: the active row no longer needs pinning. (A row removed
        // while focused is handled by _render(), which checked for focus before it began.)
        if (!e.relatedTarget || !this._list.contains(e.relatedTarget)) this._focusWithin = false;
    };

    _onKey = (e) => {
        const el = this._rowOf(e.target);
        // Only the row itself: arrow keys inside an input in a row belong to the input.
        if (!el || e.target !== el) return;
        const index = Number(el.dataset.index);
        const n = this.count;
        const visible = this.getVisibleRange();
        const page = Math.max(1, visible.end - visible.start);
        let next = null;
        switch (e.key) {
            case 'ArrowDown': next = index + 1; break;
            case 'ArrowUp': next = index - 1; break;
            case 'Home': next = 0; break;
            case 'End': next = n - 1; break;
            case 'PageDown': next = index + page; break;
            case 'PageUp': next = index - page; break;
            case 'Enter':
                e.preventDefault();
                this._fire('itemclick', this._itemAt(index), index, e);
                return;
            default: return;
        }
        e.preventDefault();
        this.focusIndex(Math.min(n - 1, Math.max(0, next)));
    };

    /**
     * Make a row the active one, scroll it into view and focus it.
     * @param {number} index
     * @returns {this}
     */
    focusIndex(index) {
        const n = this.count;
        if (!n) return this;
        const i = Math.min(n - 1, Math.max(0, Math.floor(num(index, 0))));
        this._active = i;
        this._focusWithin = true;
        this.scrollToIndex(i, {align: 'auto'});
        const row = this._rowFor(i);
        if (row) row.focus({preventScroll: true});
        this._syncTabStop();
        return this;
    }

    // ---- infinite loading ----------------------------------------------------

    _maybeLoad() {
        const L = this._load;
        if (typeof this.options.loadMore !== 'function' || L.busy || L.done || L.error) return;
        const el = this.element;
        const remaining = this._total() - (el.scrollTop + this._viewport());
        if (remaining <= Math.max(0, num(this.options.threshold, 200))) this._loadNext();
    }

    _loadNext() {
        const L = this._load;
        L.busy = true;
        const gen = L.gen;
        this._list.setAttribute('aria-busy', 'true');
        this._showStatus('loading');
        this._placeStatus();
        this._fire('loadmore', {count: this.count, page: L.page});
        let pending;
        try {
            pending = Promise.resolve(this.options.loadMore({count: this.count, page: L.page}));
        } catch (err) {
            pending = Promise.reject(err);
        }
        pending.then((result) => {
            if (gen !== this._load.gen || !this.element) return;
            const items = Array.isArray(result) ? result : (Array.isArray(result?.items) ? result.items : []);
            const done = (!Array.isArray(result) && !!result?.done) || items.length === 0;
            L.busy = false;
            L.page += 1;
            this._list.removeAttribute('aria-busy');
            if (done) L.done = true;
            this._showStatus(done ? 'end' : null);
            if (items.length) this._appendItems(items);
            else this._render();
            this._fire('loaded', items);
            if (done) this._fire('end');
        }, (err) => {
            if (gen !== this._load.gen || !this.element) return;
            L.busy = false;
            L.error = err || new Error('loadMore failed');
            this._list.removeAttribute('aria-busy');
            this._showStatus('error');
            this._placeStatus();
            this._fire('error', L.error);
        });
    }

    /**
     * Try a failed load again.
     * @returns {this}
     */
    retry() {
        if (!this._load?.error) return this;
        this._load.error = null;
        this._loadNext();
        return this;
    }

    /** Whether loadMore has said there is nothing more. */
    isDone() {
        return !!this._load?.done;
    }

    _template(kind) {
        const o = this.options;
        const given = {loading: o.loadingTemplate, end: o.endTemplate, error: o.errorTemplate}[kind];
        const value = typeof given === 'function' ? given(this._load.error) : given;
        if (value !== null && value !== undefined && value !== '') return value;
        // Built as nodes, not HTML: the sanitiser would strip the retry button.
        if (kind === 'loading') {
            const wrap = document.createElement('div');
            wrap.className = 'dm-vlist-loading';
            const spin = document.createElement('span');
            spin.className = 'dm-vlist-spinner';
            spin.setAttribute('aria-hidden', 'true');
            wrap.append(spin, document.createTextNode('Loading more…'));
            return wrap;
        }
        if (kind === 'error') {
            const wrap = document.createElement('div');
            wrap.className = 'dm-vlist-error';
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-sm btn-outline';
            btn.dataset.vlistRetry = '';
            btn.textContent = 'Retry';
            wrap.append(document.createTextNode('Could not load more. '), btn);
            return wrap;
        }
        return null;
    }

    _showStatus(kind) {
        const status = this._status;
        const content = kind ? this._template(kind) : null;
        status.dataset.state = kind || '';
        if (content === null || content === undefined) {
            status.replaceChildren();
            status.hidden = true;
            this._statusHeight = 0;
            return;
        }
        fill(status, content, {safe: this.options.safe !== false && this.options.safe !== 'false'});
        status.hidden = false;
        this._statusHeight = status.offsetHeight || 0;
    }

    // ---- public API ----------------------------------------------------------

    /**
     * Replace every item. Resets infinite loading (a new list can load more again).
     * @param {Array} items
     * @returns {this}
     */
    setItems(items) {
        this._setData(items || [], 0, null);
        if (!this.options.keyField) this._heights.clear();
        this._resetLoading();
        this._render();
        return this;
    }

    /**
     * Count mode: change how many rows `getItem` serves.
     * @param {number} count
     * @returns {this}
     */
    setCount(count) {
        if (this._items) return this;
        this._count = Math.max(0, Math.floor(num(count, 0)));
        this._dirty(0);
        this._render();
        return this;
    }

    _resetLoading() {
        const L = this._load;
        L.gen += 1;
        L.busy = false;
        L.done = false;
        L.error = null;
        L.page = 0;
        this._list?.removeAttribute('aria-busy');
        if (this._status) this._showStatus(null);
    }

    _materialise() {
        if (this._items) return;
        const list = [];
        for (let i = 0; i < this._count; i++) list.push(this._getItem(i));
        this._items = list;
        this._count = null;
        this._getItem = null;
    }

    _appendItems(items) {
        this._materialise();
        const from = this._items.length;
        for (const item of items) this._items.push(item);
        this._dirty(from);
        this._render();
    }

    /**
     * Add items at the end.
     * @param {Array} items
     * @returns {this}
     */
    append(items) {
        if (!items?.length) return this;
        this._appendItems(Array.from(items));
        return this;
    }

    /**
     * Add items at the start without moving what is on screen.
     * @param {Array} items
     * @returns {this}
     */
    prepend(items) {
        if (!items?.length) return this;
        this._materialise();
        const list = Array.from(items);
        // Without keys, a row's height is filed by index, and every index just moved:
        // the old heights would be wrong, so they are dropped and re-measured.
        if (!this.options.keyField) this._heights.clear();
        let added = 0;
        if (this._fixed) {
            added = list.length * this._rowHeight;
        } else {
            list.forEach((item, i) => {
                const h = this._heights.get(this._keyOf(item, i));
                added += h === undefined ? this._estimate : h;
            });
        }
        const top = this.element.scrollTop;
        this._items.unshift(...list);
        if (this._active >= 0) this._active += list.length;
        this._dirty(0);
        this._spacer.style.height = `${this._total() + this._statusHeight}px`;
        this.element.scrollTop = top + added;
        this._render();
        return this;
    }

    /**
     * The index of the item with a key, or -1.
     * @param {*} key
     * @returns {number}
     */
    indexOfKey(key) {
        const n = this.count;
        for (let i = 0; i < n; i++) {
            if (this._keyOf(this._itemAt(i), i) === key) return i;
        }
        return -1;
    }

    /**
     * Replace one item. A number is an index; anything else is a key (for numeric keys,
     * pass `list.indexOfKey(key)`).
     * @param {number|*} indexOrKey
     * @param {*} item
     * @returns {this}
     */
    update(indexOrKey, item) {
        const n = this.count;
        const index = typeof indexOrKey === 'number' ? Math.floor(indexOrKey) : this.indexOfKey(indexOrKey);
        if (!(index >= 0 && index < n)) return this;
        if (this._items) this._items[index] = item;
        const key = this._keyOf(item, index);
        const row = this._rows.get(key);
        if (row) row.item = undefined; // re-render (and in 'auto', re-measure)
        this._render();
        return this;
    }

    /**
     * Scroll so a row is in view.
     * @param {number} index
     * @param {{align?: 'start'|'center'|'end'|'auto', smooth?: boolean}} [opts]
     * @returns {this}
     */
    scrollToIndex(index, opts = {}) {
        const n = this.count;
        if (!n || !this.element) return this;
        const i = Math.min(n - 1, Math.max(0, Math.floor(num(index, 0))));
        const align = opts.align || 'auto';
        const smooth = !!opts.smooth && !reducedMotion() && typeof this.element.scrollTo === 'function';
        const target = () => {
            const top = this._offset(i);
            const h = this._heightOf(i);
            const vh = this._viewport();
            const st = this.element.scrollTop;
            if (align === 'start') return top;
            if (align === 'end') return top + h - vh;
            if (align === 'center') return top + h / 2 - vh / 2;
            if (top < st) return top;
            if (top + h > st + vh) return top + h - vh;
            return null;
        };
        const go = target();
        if (go === null) {
            this._render();
            return this;
        }
        const max = Math.max(0, this._total() + this._statusHeight - this._viewport());
        const to = Math.min(max, Math.max(0, go));
        if (smooth) {
            this.element.scrollTo({top: to, behavior: 'smooth'});
            return this;
        }
        this.element.scrollTop = to;
        this._render();
        // Measured rows may have moved the target; settle on it.
        if (!this._fixed) {
            for (let k = 0; k < 2; k++) {
                const again = target();
                if (again === null || Math.abs(again - this.element.scrollTop) < 1) break;
                this.element.scrollTop = Math.max(0, again);
                this._render();
            }
        }
        return this;
    }

    /**
     * Re-render every rendered row (and re-measure them in 'auto' mode), e.g. after
     * the data an item points at has changed.
     * @returns {this}
     */
    refresh() {
        this._dirty(0);
        this._render(true);
        return this;
    }

    /** The rendered range, overscan included. @returns {{start: number, end: number}} */
    getRenderedRange() {
        return {...this._range};
    }

    _applyOptions() {
        if (!this._list) return;
        this.element.classList.toggle('dm-vlist-fixed', this._fixed);
        if (this.options.label) this._list.setAttribute('aria-label', this.options.label);
        else this._list.removeAttribute('aria-label');
        this._dirty(0);
        this._render(true);
    }

    setOptions(newOptions = {}) {
        const data = 'items' in newOptions || 'count' in newOptions || 'getItem' in newOptions;
        this.options = {...this.options, ...newOptions};
        if (data) {
            this._setData(this.options.items, this.options.count, this.options.getItem);
            if (!this.options.keyField) this._heights.clear();
        }
        this._applyOptions();
        return this;
    }

    /** Remove everything the list added and give the container its children back. */
    destroy() {
        if (this._load) this._load.gen += 1;
        if (this._frame) {
            (typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : clearTimeout)(this._frame);
            this._frame = 0;
        }
        this._hostObserver?.disconnect();
        this._rowObserver?.disconnect();
        this._hostObserver = this._rowObserver = null;
        this._spacer?.remove();
        this._list?.remove();
        this._status?.remove();
        this._rows?.clear();
        if (this.element) {
            this.element.classList.remove('dm-vlist', 'dm-vlist-fixed');
            if (this._original) this.element.appendChild(this._original);
        }
        this._original = null;
        super.destroy();
        this._onDestroy?.();
        this._list = null;
    }
}

/**
 * E.virtualList: one instance per container; calling it again updates the existing one.
 * @param {Element} el
 * @param {Object} options
 * @returns {VirtualList}
 */
export function virtualListFor(el, options = {}) {
    const existing = instanceOf(el, 'virtual-list');
    if (existing) return existing.setOptions(options);
    return new VirtualList(el, options);
}

export default VirtualList;
