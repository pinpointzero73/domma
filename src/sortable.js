/**
 * Domma Sortable Component
 *
 * Drag-to-reorder for the children of one container, by pointer (mouse, pen
 * and touch) and by keyboard. Two modes:
 *
 *   - live (the default): siblings slide out of the way while you drag and
 *     the component moves the element itself. `onSort` reports the new order.
 *   - indicator (`nest: true`, or `live: false`): nothing moves until the
 *     drop. A marker shows where the item would land - before, after, or
 *     (with `nest`) into another item - and `onDrop` hands that to the host,
 *     which updates its data and re-renders. The component then animates the
 *     re-render: every item keyed by `key` glides from where it was to where
 *     it now is, and the dragged item lands in its new place.
 *
 * Pointer events rather than the HTML5 drag-and-drop API, because native drag
 * cannot animate its neighbours, draws its own ghost, and does not exist on
 * touch screens at all.
 *
 * `persist` makes the order sticky: live mode saves the item keys through
 * Domma storage after every sort and puts them back in that order on the next
 * page load.
 *
 * Listeners are delegated from the container, so items rendered after the
 * component was created are sortable without a refresh. A container that
 * re-renders its whole contents keeps working.
 */

import Component from './component.js';
import {storage} from './storage.js';

const STORAGE_PREFIX = 'sortable:';

// Distance (px) from the edge of the scroll area at which dragging scrolls it.
const SCROLL_EDGE = 48;
const SCROLL_MAX_SPEED = 18;

const INTERACTIVE = 'input, textarea, select, button, option, a[href], [contenteditable=""], [contenteditable="true"]';

const isFn = (v) => typeof v === 'function';

function prefersReducedMotion() {
    try {
        return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    } catch {
        return false;
    }
}

/** The nearest ancestor that actually scrolls on `axis`, or null for the page. */
function scrollParentOf(el, axis) {
    // The container itself first: a list with overflow:auto scrolls itself.
    let node = el;
    while (node && node !== document.body && node !== document.documentElement) {
        const style = getComputedStyle(node);
        const overflow = axis === 'x' ? style.overflowX : style.overflowY;
        const scrolls = axis === 'x'
            ? node.scrollWidth > node.clientWidth
            : node.scrollHeight > node.clientHeight;
        if (scrolls && /(auto|scroll|overlay)/.test(overflow)) return node;
        node = node.parentElement;
    }
    return null;
}

class Sortable extends Component {
    static defaults = {
        items: null,            // selector for the sortable items; null = the container's children
        handle: null,           // selector inside an item that starts a drag; null = the whole item
        nest: false,            // adds an "into" drop zone (indicator mode)
        live: null,             // null = !nest. false = indicator mode without nesting
        axis: 'y',              // 'y' (a column) or 'x' (a row)
        key: 'data-id',         // attribute that identifies an item across re-renders
        animation: 200,         // ms; 0 turns animation off (reduced motion always does)
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        threshold: 4,           // px the pointer must travel before a press becomes a drag
        touchDelay: 220,        // ms a finger must rest on an item with no handle before it drags
        nestZone: 0.5,          // share of an item's height, centred, that means "into"
        accepts: null,          // (item, target, zone) => boolean - veto a drop
        disabled: false,
        keyboard: true,         // Alt+Arrow moves the focused item (live mode)
        persist: false,         // storage key (or true = the container id): remember the order
        autoScroll: true,
        ghostParent: null,      // where the dragged copy lives; null = the container
        onStart: null,
        onMove: null,
        onSort: null,           // live mode: ({item, from, to, order, previous})
        onDrop: null,           // indicator mode: ({item, target, zone, key, targetKey}) - return false to refuse
        onCancel: null,
        onEnd: null
    };

    constructor(selector, options = {}) {
        super(selector, options);
        if (!this.element) return;

        this._drag = null;
        this._pending = null;
        this._animating = new WeakSet();
        this._flips = new WeakMap();
        this._docHandlers = [];

        this.element.classList.add('dm-sortable');
        this._markHandles();

        // Handles need touch-action set before a finger lands on them, and a
        // container that re-renders brings new ones - so watch for them.
        if (typeof MutationObserver !== 'undefined') {
            this._observer = new MutationObserver(() => this._markHandles());
            this._observer.observe(this.element, {childList: true, subtree: true});
        }

        this._addEventListener(this.element, 'pointerdown', (e) => this._onPointerDown(e));
        this._addEventListener(this.element, 'keydown', (e) => this._onKeyDown(e));
        // A link or image inside an item would start the browser's own drag.
        this._addEventListener(this.element, 'dragstart', (e) => {
            if (this._pending || this._drag) e.preventDefault();
        });

        if (this.options.persist && this._isLive()) this.restore();
    }

    // ============================================
    // Public API
    // ============================================

    /** The keys of the items, in their current order. */
    toArray() {
        return this._items().map((el) => this._keyOf(el));
    }

    /** Put the items in the order of `keys`. Items not named keep their slots. */
    sort(keys, {animate = true} = {}) {
        const apply = () => {
            const items = this._items();
            const rank = new Map(keys.map((k, i) => [String(k), i]));
            const known = items.filter((el) => rank.has(this._keyOf(el)));
            if (!known.length) return;
            const ordered = [...known].sort((a, b) => rank.get(this._keyOf(a)) - rank.get(this._keyOf(b)));
            // Swap into the slots the known items already hold, so unknown items
            // (added since the order was saved) stay where the page put them.
            const markers = known.map((el) => {
                const m = document.createComment('');
                el.before(m);
                return m;
            });
            markers.forEach((m, i) => {
                m.replaceWith(ordered[i]);
            });
        };
        if (animate) this.animate(apply); else apply();
        return this;
    }

    /** Re-apply the saved order (live mode with `persist`). */
    restore() {
        const saved = this._storageKey() ? storage.get(this._storageKey()) : null;
        if (Array.isArray(saved) && saved.length) this.sort(saved, {animate: false});
        return this;
    }

    /** Forget the saved order. */
    forget() {
        const key = this._storageKey();
        if (key) storage.remove(key);
        return this;
    }

    /**
     * Run `mutate` (which may re-render the container) and animate every item
     * from where it was to where it is afterwards, matched by `key`.
     * Returns whatever `mutate` returns; a promise is awaited before animating.
     */
    animate(mutate) {
        const before = this._snapshot();
        const result = mutate();
        if (result && isFn(result.then)) {
            return result.then((value) => {
                this._playFlip(before);
                return value;
            });
        }
        this._playFlip(before);
        return result;
    }

    enable() {
        this.options.disabled = false;
        this.element?.classList.remove('dm-sortable-disabled');
        return this;
    }

    disable() {
        if (this._drag) this._cancel();
        this.options.disabled = true;
        this.element?.classList.add('dm-sortable-disabled');
        return this;
    }

    get dragging() {
        return !!this._drag;
    }

    destroy() {
        if (this._drag) this._finish(false);
        this._clearPending();
        this._observer?.disconnect();
        this._liveRegion?.remove();
        if (this.element) {
            this.element.classList.remove('dm-sortable', 'dm-sortable-disabled', 'dm-sortable-active');
            this.element.querySelectorAll('.dm-sortable-handle').forEach((h) => h.classList.remove('dm-sortable-handle'));
        }
        super.destroy();
    }

    _applyOptions() {
        this._markHandles();
        this.element?.classList.toggle('dm-sortable-disabled', !!this.options.disabled);
    }

    // ============================================
    // Items
    // ============================================

    _isLive() {
        return this.options.live == null ? !this.options.nest : !!this.options.live;
    }

    _items() {
        const root = this.element;
        if (!root) return [];
        const list = this.options.items
            ? Array.from(root.querySelectorAll(this.options.items))
            : Array.from(root.children);
        return list.filter((el) => !el.classList.contains('dm-sortable-ghost')
            && !el.classList.contains('dm-sortable-indicator')
            && !el.classList.contains('dm-sortable-live')
            && this._ownerOf(el) === root);
    }

    /** The sortable container an element belongs to - a nested sortable claims its own. */
    _ownerOf(el) {
        let node = el.parentElement;
        while (node && !node.classList.contains('dm-sortable')) node = node.parentElement;
        return node;
    }

    _itemFrom(node) {
        if (!(node instanceof Element)) return null;
        const items = this._items();
        let el = node;
        while (el && el !== this.element) {
            if (items.includes(el)) return el;
            el = el.parentElement;
        }
        return null;
    }

    _keyOf(el) {
        const attr = this.options.key;
        const v = attr ? el.getAttribute(attr) : null;
        return v == null ? null : String(v);
    }

    _byKey(key) {
        if (key == null) return null;
        return this._items().find((el) => this._keyOf(el) === key) || null;
    }

    _markHandles() {
        if (!this.element || !this.options.handle) return;
        this.element.querySelectorAll(this.options.handle).forEach((h) => {
            if (!h.classList.contains('dm-sortable-handle')) h.classList.add('dm-sortable-handle');
        });
    }

    _storageKey() {
        const p = this.options.persist;
        if (!p) return null;
        if (p === true) return this.element?.id ? STORAGE_PREFIX + this.element.id : null;
        return STORAGE_PREFIX + p;
    }

    _duration() {
        return prefersReducedMotion() ? 0 : Math.max(0, Number(this.options.animation) || 0);
    }

    // ============================================
    // Pointer
    // ============================================

    _onPointerDown(e) {
        // One press at a time: a second finger during a hold must not replace the first.
        if (this.options.disabled || this._drag || this._pending || e.button !== 0 || e._dmSortable) return;
        const item = this._itemFrom(e.target);
        if (!item) return;
        // An inner sortable already claimed this press.
        e._dmSortable = true;

        const {handle} = this.options;
        if (handle) {
            const h = e.target.closest(handle);
            if (!h || !item.contains(h)) return;
            // Stops text selection starting from the handle.
            e.preventDefault();
        } else if (e.target.closest(INTERACTIVE) && e.target.closest(INTERACTIVE) !== item) {
            return;
        }

        const touchNeedsHold = e.pointerType === 'touch' && !handle;
        this._pending = {
            item,
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            ready: !touchNeedsHold,
            timer: null
        };
        if (touchNeedsHold) {
            this._pending.timer = setTimeout(() => {
                if (this._pending) {
                    this._pending.ready = true;
                    this._guard(() => this._begin(this._pending.startX, this._pending.startY));
                }
            }, this.options.touchDelay);
        }

        this._listenDoc('pointermove', (ev) => this._guard(() => this._onPointerMove(ev)));
        this._listenDoc('pointerup', (ev) => this._guard(() => this._onPointerUp(ev)));
        this._listenDoc('pointercancel', (ev) => this._guard(() => this._onPointerCancel(ev)));
        // Capture phase, and stopped there: Esc ends the drag, not the dialog around it.
        this._listenDoc('keydown', (ev) => {
            if (ev.key === 'Escape' && this._drag) {
                ev.preventDefault();
                ev.stopPropagation();
                this._guard(() => this._cancel());
            }
        }, true);
        // No right-click menu over a drag in progress.
        this._listenDoc('contextmenu', (ev) => {
            if (this._drag) ev.preventDefault();
        }, true);
        this._listenWin('blur', () => this._guard(() => {
            if (this._drag) this._cancel(); else this._clearPending();
        }));
        // Once a drag has begun, a finger's movement must not scroll the page.
        this._listenDoc('touchmove', (ev) => {
            if (this._drag) ev.preventDefault();
        }, {passive: false});
    }

    _onPointerMove(e) {
        const p = this._pending;
        if (p && e.pointerId === p.pointerId && !this._drag) {
            const moved = Math.hypot(e.clientX - p.startX, e.clientY - p.startY);
            if (!p.ready) {
                // The finger moved before the hold completed: it is a scroll.
                if (moved > 8) this._clearPending();
                return;
            }
            if (moved < this.options.threshold) return;
            this._begin(p.startX, p.startY);
        }
        if (this._drag && e.pointerId === this._drag.pointerId) {
            // The release happened somewhere we never heard about (another
            // window, a native dialog): the button is up, so treat it as a drop.
            if (e.pointerType === 'mouse' && e.buttons === 0) {
                this._onPointerUp(e);
                return;
            }
            e.preventDefault();
            this._moveTo(e.clientX, e.clientY);
        }
    }

    /**
     * Run pointer/keyboard work so that a host callback which throws cannot
     * leave the page stuck mid-drag (ghost on screen, grab cursor, listeners on).
     */
    _guard(fn) {
        try {
            return fn();
        } catch (err) {
            if (this._drag) {
                try {
                    this._cancel();
                } catch { /* a throwing onCancel must not stop the tidy-up */ }
                if (this._drag) this._finish(false);
            } else {
                this._clearPending();
            }
            throw err;
        }
    }

    _onPointerUp(e) {
        if (this._drag && e.pointerId === this._drag.pointerId) {
            this._moveTo(e.clientX, e.clientY);
            this._drop();
            return;
        }
        this._clearPending();
    }

    _onPointerCancel(e) {
        if (this._drag && e.pointerId === this._drag.pointerId) this._cancel();
        else this._clearPending();
    }

    _listenDoc(event, handler, opts) {
        document.addEventListener(event, handler, opts);
        this._docHandlers.push({target: document, event, handler, opts});
    }

    _listenWin(event, handler, opts) {
        window.addEventListener(event, handler, opts);
        this._docHandlers.push({target: window, event, handler, opts});
    }

    _unlistenDoc() {
        for (const {target, event, handler, opts} of this._docHandlers) {
            target.removeEventListener(event, handler, opts);
        }
        this._docHandlers = [];
    }

    _clearPending() {
        if (this._pending?.timer) clearTimeout(this._pending.timer);
        this._pending = null;
        if (!this._drag) this._unlistenDoc();
    }

    // ============================================
    // Drag lifecycle
    // ============================================

    _begin(startX, startY) {
        const {item, pointerId} = this._pending;
        if (this._pending.timer) clearTimeout(this._pending.timer);
        this._pending = null;

        const rect = item.getBoundingClientRect();
        const items = this._items();
        const ghost = item.cloneNode(true);
        ghost.removeAttribute('id');
        // Nothing looking an item up by key should find the copy.
        if (this.options.key) ghost.removeAttribute(this.options.key);
        ghost.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
        ghost.classList.add('dm-sortable-ghost');
        ghost.setAttribute('aria-hidden', 'true');
        Object.assign(ghost.style, {
            position: 'fixed',
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            margin: '0',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            transform: 'translate3d(0, 0, 0)'
        });
        (this.options.ghostParent || this.element).appendChild(ghost);
        // Next frame, so the lift transitions in rather than appearing lifted.
        requestAnimationFrame(() => ghost.classList.add('dm-sortable-ghost-lifted'));

        item.classList.add('dm-sortable-placeholder');
        this.element.classList.add('dm-sortable-active');
        document.documentElement.classList.add('dm-sortable-dragging');
        try {
            window.getSelection?.().removeAllRanges();
        } catch { /* nothing selected */ }

        this._drag = {
            item,
            pointerId,
            ghost,
            rect,
            offsetX: startX - rect.left,
            offsetY: startY - rect.top,
            x: startX,
            y: startY,
            from: items.indexOf(item),
            previous: items.map((el) => this._keyOf(el)),
            origin: {parent: item.parentNode, next: item.nextSibling},
            key: this._keyOf(item),
            target: null,
            zone: null,
            indicator: null,
            scrollRaf: null
        };

        if (!this._isLive()) {
            const ind = document.createElement('div');
            ind.className = 'dm-sortable-indicator';
            ind.setAttribute('aria-hidden', 'true');
            this.element.appendChild(ind);
            this._drag.indicator = ind;
        }

        this._emit('start', {item, from: this._drag.from});
        if (this.options.autoScroll) this._scrollLoop();
    }

    _moveTo(x, y) {
        const d = this._drag;
        if (!d || d.settling) return;
        d.x = x;
        d.y = y;
        d.ghost.style.transform = `translate3d(${x - d.offsetX - d.rect.left}px, ${y - d.offsetY - d.rect.top}px, 0)`;

        const hit = document.elementFromPoint(x, y);
        const target = hit ? this._itemFrom(hit) : null;

        if (this._isLive()) {
            if (target && target !== d.item && !this._animating.has(target)) this._liveSwap(target, x, y);
        } else {
            this._indicate(target, x, y);
        }
        this._emit('move', {item: d.item, target: d.target || target, zone: d.zone, x, y});
    }

    /**
     * Move the placeholder past `target` once the pointer is far enough over it
     * that, after the move, the pointer would sit on the placeholder. Anything
     * less oscillates when the two differ in size.
     */
    _liveSwap(target, x, y) {
        const d = this._drag;
        const items = this._items();
        const di = items.indexOf(d.item);
        const ti = items.indexOf(target);
        if (di < 0 || ti < 0) return;

        const size = d.item.getBoundingClientRect();
        const t = target.getBoundingClientRect();
        const horizontal = this.options.axis === 'x';
        const pos = horizontal ? x : y;
        const extent = horizontal ? size.width : size.height;
        const start = horizontal ? t.left : t.top;
        const end = horizontal ? t.right : t.bottom;

        const down = di < ti;
        const pass = down ? pos > end - extent : pos < start + extent;
        if (!pass) return;

        if (this.options.accepts && !this.options.accepts(d.item, target, down ? 'after' : 'before')) return;

        this._flipItems(() => {
            if (down) target.after(d.item);
            else target.before(d.item);
        });
    }

    _zoneFor(target, x, y) {
        const r = target.getBoundingClientRect();
        const horizontal = this.options.axis === 'x';
        const size = horizontal ? r.width : r.height;
        const ratio = size ? ((horizontal ? x - r.left : y - r.top) / size) : 0.5;
        if (this.options.nest) {
            const edge = (1 - Math.min(Math.max(this.options.nestZone, 0), 1)) / 2;
            if (ratio < edge) return 'before';
            if (ratio > 1 - edge) return 'after';
            return 'into';
        }
        return ratio < 0.5 ? 'before' : 'after';
    }

    _indicate(target, x, y) {
        const d = this._drag;
        let zone = null;
        if (target && target !== d.item) {
            zone = this._zoneFor(target, x, y);
            if (this.options.accepts && !this.options.accepts(d.item, target, zone)) {
                // An "into" the host refuses falls back to the nearer edge.
                if (zone === 'into') {
                    const r = target.getBoundingClientRect();
                    const mid = this.options.axis === 'x' ? r.left + r.width / 2 : r.top + r.height / 2;
                    zone = (this.options.axis === 'x' ? x : y) < mid ? 'before' : 'after';
                    if (!this.options.accepts(d.item, target, zone)) zone = null;
                } else {
                    zone = null;
                }
            }
        }
        if (!zone) target = null;

        if (d.target !== target || d.zone !== zone) {
            d.target?.classList.remove('dm-sortable-over', 'dm-sortable-over-before', 'dm-sortable-over-after', 'dm-sortable-over-into');
            if (target) target.classList.add('dm-sortable-over', `dm-sortable-over-${zone}`);
            d.target = target;
            d.zone = zone;
        }
        this._placeIndicator();
    }

    _placeIndicator() {
        const d = this._drag;
        const ind = d?.indicator;
        if (!ind) return;
        if (!d.target) {
            ind.classList.remove('is-visible');
            return;
        }
        const r = d.target.getBoundingClientRect();
        const horizontal = this.options.axis === 'x';
        let box;
        if (d.zone === 'into') {
            box = {left: r.left, top: r.top, width: r.width, height: r.height};
        } else if (horizontal) {
            box = {left: (d.zone === 'before' ? r.left : r.right) - 1.5, top: r.top, width: 3, height: r.height};
        } else {
            box = {left: r.left, top: (d.zone === 'before' ? r.top : r.bottom) - 1.5, width: r.width, height: 3};
        }
        const first = !ind.classList.contains('is-visible');
        if (first) ind.style.transition = 'none';
        Object.assign(ind.style, {
            left: `${box.left}px`,
            top: `${box.top}px`,
            width: `${box.width}px`,
            height: `${box.height}px`
        });
        ind.classList.toggle('is-into', d.zone === 'into');
        ind.classList.add('is-visible');
        if (first) {
            // Arrive in place, then glide from there on.
            void ind.offsetWidth;
            ind.style.transition = '';
        }
    }

    _drop() {
        const d = this._drag;
        if (!d) return;
        // Now, at pointerup: the click follows at once, before any async onDrop settles.
        this._suppressClick();

        if (this._isLive()) {
            const order = this.toArray();
            const to = this._items().indexOf(d.item);
            const changed = to !== d.from;
            this._finish(true);
            if (changed) {
                this._save(order);
                this._emit('sort', {item: d.item, from: d.from, to, order, previous: d.previous});
            }
            this._emit('end', {item: d.item, changed});
            return;
        }

        const {target, zone} = d;
        if (!target || !zone) {
            this._cancel();
            return;
        }

        const detail = {
            item: d.item,
            target,
            zone,
            key: d.key,
            targetKey: this._keyOf(target)
        };

        // From here the host decides; the pointer no longer steers anything.
        this._unlistenDoc();
        if (d.scrollRaf) cancelAnimationFrame(d.scrollRaf);
        d.settling = true;

        let accepted = true;
        const result = this.animate(() => {
            if (isFn(this.options.onDrop)) {
                const r = this.options.onDrop(detail);
                if (r === false) accepted = false;
                return r;
            }
            // No handler: move the element itself. "into" has nothing to do.
            if (zone === 'before') target.before(d.item);
            else if (zone === 'after') target.after(d.item);
            return undefined;
        });
        this._dispatch('drop', detail);

        const settle = () => {
            if (this._drag !== d) return;
            if (!accepted) {
                this._cancel();
                return;
            }
            this._finish(true);
            this._emit('end', {item: d.item, changed: true});
        };
        if (result && isFn(result.then)) {
            result.then(settle, () => {
                if (this._drag === d) this._cancel();
            });
        }
        else settle();
    }

    _cancel() {
        const d = this._drag;
        if (!d) return;
        if (this._isLive()) {
            // Back to where it started, sliding the others back too.
            this._flipItems(() => {
                if (d.origin.parent) d.origin.parent.insertBefore(d.item, d.origin.next?.parentNode === d.origin.parent ? d.origin.next : null);
            });
        }
        this._finish(false);
        this._emit('cancel', {item: d.item});
        this._emit('end', {item: d.item, changed: false});
    }

    /** Land the ghost on the item's (possibly new) element, then tidy up. */
    _finish(landed) {
        const d = this._drag;
        if (!d) return;
        this._drag = null;
        this._unlistenDoc();
        if (d.scrollRaf) cancelAnimationFrame(d.scrollRaf);

        d.target?.classList.remove('dm-sortable-over', 'dm-sortable-over-before', 'dm-sortable-over-after', 'dm-sortable-over-into');
        d.indicator?.remove();
        this.element?.classList.remove('dm-sortable-active');
        document.documentElement.classList.remove('dm-sortable-dragging');

        // The host may have re-rendered: find the item's element again by key.
        const home = (landed && d.key != null ? this._byKey(d.key) : null)
            || (d.item.isConnected ? d.item : null);
        if (d.item !== home) d.item.classList.remove('dm-sortable-placeholder');

        const ghost = d.ghost;
        const duration = this._duration();
        if (!home || !duration) {
            ghost.remove();
            home?.classList.remove('dm-sortable-placeholder');
            if (home) this._announce(home);
            return;
        }

        // A host that re-rendered the container took the ghost with it.
        if (!ghost.isConnected) (this.options.ghostParent || this.element).appendChild(ghost);
        home.classList.add('dm-sortable-placeholder', 'dm-sortable-landing');
        const r = home.getBoundingClientRect();
        ghost.style.transition = `transform ${duration}ms ${this.options.easing}, width ${duration}ms ${this.options.easing}, height ${duration}ms ${this.options.easing}, scale ${duration}ms ${this.options.easing}, box-shadow ${duration}ms ${this.options.easing}`;
        ghost.classList.remove('dm-sortable-ghost-lifted');
        ghost.style.transform = `translate3d(${r.left - d.rect.left}px, ${r.top - d.rect.top}px, 0)`;
        ghost.style.width = `${r.width}px`;
        ghost.style.height = `${r.height}px`;

        let done = false;
        const settle = () => {
            if (done) return;
            done = true;
            ghost.remove();
            home.classList.remove('dm-sortable-placeholder', 'dm-sortable-landing');
            this._announce(home);
        };
        ghost.addEventListener('transitionend', (e) => {
            if (e.propertyName === 'transform') settle();
        });
        setTimeout(settle, duration + 80);
    }

    /** A drag that ends over an item must not also click it. */
    _suppressClick() {
        const stop = (e) => {
            e.stopPropagation();
            e.preventDefault();
        };
        document.addEventListener('click', stop, true);
        setTimeout(() => document.removeEventListener('click', stop, true), 0);
    }

    _scrollLoop() {
        const d = this._drag;
        if (!d) return;
        const axis = this.options.axis === 'x' ? 'x' : 'y';
        const scroller = scrollParentOf(this.element, axis);
        const step = () => {
            if (this._drag !== d || d.settling) return;
            const bounds = scroller
                ? scroller.getBoundingClientRect()
                : {top: 0, left: 0, bottom: window.innerHeight, right: window.innerWidth};
            const pos = axis === 'x' ? d.x : d.y;
            const lo = axis === 'x' ? bounds.left : bounds.top;
            const hi = axis === 'x' ? bounds.right : bounds.bottom;
            let delta = 0;
            if (pos < lo + SCROLL_EDGE) delta = -Math.ceil(SCROLL_MAX_SPEED * (1 - Math.max(pos - lo, 0) / SCROLL_EDGE));
            else if (pos > hi - SCROLL_EDGE) delta = Math.ceil(SCROLL_MAX_SPEED * (1 - Math.max(hi - pos, 0) / SCROLL_EDGE));
            if (delta) {
                const target = scroller || window;
                if (axis === 'x') target.scrollBy(delta, 0); else target.scrollBy(0, delta);
                this._moveTo(d.x, d.y);
            }
            d.scrollRaf = requestAnimationFrame(step);
        };
        d.scrollRaf = requestAnimationFrame(step);
    }

    // ============================================
    // Keyboard
    // ============================================

    _onKeyDown(e) {
        if (!this.options.keyboard || this.options.disabled || this._drag || !this._isLive() || !e.altKey) return;
        const horizontal = this.options.axis === 'x';
        const back = horizontal ? 'ArrowLeft' : 'ArrowUp';
        const fwd = horizontal ? 'ArrowRight' : 'ArrowDown';
        if (e.key !== back && e.key !== fwd) return;

        const item = this._itemFrom(e.target);
        // Only the item itself or its handle - not a text field inside it.
        if (!item || (e.target !== item && !(this.options.handle && e.target.closest(this.options.handle)))) return;

        const items = this._items();
        const from = items.indexOf(item);
        const to = e.key === back ? from - 1 : from + 1;
        if (to < 0 || to >= items.length) return;
        const other = items[to];
        if (this.options.accepts && !this.options.accepts(item, other, e.key === back ? 'before' : 'after')) return;

        e.preventDefault();
        const previous = items.map((el) => this._keyOf(el));
        this._flipItems(() => {
            if (e.key === back) other.before(item); else other.after(item);
        });
        e.target.focus();
        const order = this.toArray();
        this._save(order);
        this._emit('sort', {item, from, to, order, previous});
        this._emit('end', {item, changed: true});
        this._announce(item);
    }

    /** Tell screen readers where the item now sits. */
    _announce(item) {
        const items = this._items();
        const at = items.indexOf(item);
        if (at < 0) return;
        if (!this._liveRegion) {
            const region = document.createElement('div');
            region.className = 'dm-sortable-live';
            region.setAttribute('role', 'status');
            region.setAttribute('aria-live', 'polite');
            // On the body, not in the container: a host that re-renders the
            // list would otherwise replace the region in the same task, and
            // screen readers do not announce a region that is brand new.
            document.body.appendChild(region);
            this._liveRegion = region;
        }
        this._liveRegion.textContent = `Moved to position ${at + 1} of ${items.length}`;
    }

    // ============================================
    // Animation (FLIP)
    // ============================================

    /** Where every item is now, by element and by key. */
    _snapshot({withDragged = false} = {}) {
        const map = new Map();
        const d = this._drag;
        for (const el of this._items()) {
            // In indicator mode the dragged item lands with the ghost instead of
            // sliding from where it was hidden; in live mode it is the slot and
            // slides with the others.
            if (d && el === d.item && !withDragged) continue;
            const r = el.getBoundingClientRect();
            map.set(el, r);
            const key = this._keyOf(el);
            if (key != null) map.set(`key:${key}`, r);
        }
        return map;
    }

    /** Animate each item from its rect in `before` to where it is now. */
    _playFlip(before) {
        const duration = this._duration();
        if (!duration) return;
        for (const el of this._items()) {
            const key = this._keyOf(el);
            const was = before.get(el) || (key != null ? before.get(`key:${key}`) : null);
            if (!was || !isFn(el.animate)) continue;
            const now = el.getBoundingClientRect();
            const dx = was.left - now.left;
            const dy = was.top - now.top;
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
            // A second move while the first is still gliding: start from where
            // it is now, and only the latest animation clears the flag.
            this._flips.get(el)?.cancel();
            this._animating.add(el);
            const anim = el.animate(
                [{transform: `translate(${dx}px, ${dy}px)`}, {transform: 'translate(0, 0)'}],
                {duration, easing: this.options.easing}
            );
            this._flips.set(el, anim);
            const clear = () => {
                if (this._flips.get(el) !== anim) return;
                this._flips.delete(el);
                this._animating.delete(el);
            };
            anim.onfinish = clear;
            anim.oncancel = clear;
        }
    }

    /** Live mode: move elements and slide everything, the slot included, into place. */
    _flipItems(mutate) {
        const before = this._snapshot({withDragged: true});
        mutate();
        this._playFlip(before);
    }

    // ============================================
    // Persistence and events
    // ============================================

    _save(order) {
        const key = this._storageKey();
        if (key && this._isLive()) storage.set(key, order.filter((k) => k != null));
    }

    _emit(name, detail) {
        const cb = this.options[`on${name[0].toUpperCase()}${name.slice(1)}`];
        if (isFn(cb)) cb(detail);
        this._dispatch(name, detail);
    }

    _dispatch(name, detail) {
        this.element?.dispatchEvent(new CustomEvent(`sortable:${name}`, {detail, bubbles: true}));
    }
}

export default Sortable;
