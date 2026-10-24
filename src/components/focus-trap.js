/**
 * Focus trap - E.focusTrap(container, options).
 *
 * Keeps keyboard focus inside one or more containers while it is active: Tab and
 * Shift+Tab wrap from the last tabbable element to the first and back, and focus that
 * escapes some other way (a click, a script) is brought back. Overlays (a dialog, a
 * command palette, a drawer) use it so a keyboard user cannot wander into the page
 * behind them.
 *
 * The tabbable elements are looked up on every key press rather than once, so controls
 * added after activation (a list that loaded, a form step) are part of the cycle. Open
 * shadow roots are walked in the order the browser renders them - slotted children at
 * their slot - so a trap round a Domma modal reaches its X and footer buttons too.
 *
 * Traps stack. Activating a second trap pauses the one before it; deactivating it
 * unpauses that one again, so a confirm dialog opened from a palette hands focus back
 * to the palette, not to the page. A trap that goes while one above it is still open
 * hands its return target up, so focus never comes back to a panel that has gone.
 *
 * Tab is decided late: the trap's own Tab handling runs as the key bubbles up to
 * `window`, so anything on the way that used Tab itself (a textarea that indents, a
 * grid that moves between cells, a popover steering Tab out of its panel) calls
 * preventDefault() and the trap leaves the key alone.
 *
 * Focus outside the containers is brought back unless `allowOutsideFocus` lets it
 * stay. 'layers' (what Domma's overlays use) lets focus into floating layers - toasts,
 * popovers, context menus, date pickers - but never into the page behind or into an
 * overlay beneath this one. See `layerOf()`.
 *
 * Events: activate, deactivate, pause, unpause - as `onX`, `.on('x')` and
 * `dm:focus-trap:x` (dispatched on the first container).
 */

import Component, {register, unregister} from '../component.js';
import {resolveAll, resolveElement} from './shared.js';

const TABBABLE = [
    'a[href]', 'area[href]', 'button', 'input', 'select', 'textarea', 'iframe', 'object', 'embed',
    'summary', 'audio[controls]', 'video[controls]', '[contenteditable]:not([contenteditable="false"])',
    '[tabindex]'
].join(',');

/** Active traps, oldest first. Only the last one listens. */
const stack = [];

/** Marks an element (and what is inside it) as a layer any trap lets focus into. */
export const ALLOW_ATTR = 'data-focus-trap-allow';

/** The parent across a shadow boundary: a shadow root's parent is its host. */
function parentOf(node) {
    if (!node) return null;
    if (node.assignedSlot) return node.assignedSlot;
    if (node.parentNode && node.parentNode.nodeType === 11 && node.parentNode.host) return node.parentNode.host;
    return node.parentNode;
}

/** Whether `node` is `root` or inside it, looking through shadow roots and slots. */
function containsDeep(root, node) {
    for (let n = node; n; n = parentOf(n)) {
        if (n === root) return true;
    }
    return false;
}

/** The focused element, through any open shadow roots it sits in. */
function deepActiveElement() {
    if (typeof document === 'undefined') return null;
    let active = document.activeElement;
    while (active && active.shadowRoot && active.shadowRoot.activeElement) {
        active = active.shadowRoot.activeElement;
    }
    return active;
}

/** Whether an element could take focus from Tab right now. */
function canTab(el) {
    if (!el.matches(TABBABLE)) return false;
    if (el.tabIndex < 0) return false;
    if (el.matches(':disabled')) return false;
    if (el.tagName === 'INPUT' && el.type === 'hidden') return false;
    // A <summary> only takes focus as the first summary of its <details>.
    if (el.tagName === 'SUMMARY' && el.parentElement?.querySelector(':scope > summary') !== el) return false;
    for (let n = el; n; n = parentOf(n)) {
        if (n.nodeType === 1 && (n.hasAttribute('hidden') || n.hasAttribute('inert'))) return false;
    }
    // Links and buttons inside an editing area cannot take focus; only the area itself can.
    if (el.parentElement?.closest?.('[contenteditable]:not([contenteditable="false"])')) return false;
    // display:none / visibility:hidden (a closed panel, a collapsed section). jsdom has no
    // checkVisibility, so everything counts as visible there.
    if (typeof el.checkVisibility === 'function' && !el.checkVisibility({visibilityProperty: true})) return false;
    return true;
}

/** Elements under `node` in rendering order: shadow trees first, slots by what they show. */
function collect(node, out, shadow) {
    const kids = node.nodeType === 1 && node.tagName === 'SLOT' && typeof node.assignedElements === 'function'
        ? (node.assignedElements({flatten: true}).length ? node.assignedElements({flatten: true}) : Array.from(node.children))
        : Array.from(node.children || []);
    for (const child of kids) {
        out.push(child);
        if (shadow && child.shadowRoot) collect(child.shadowRoot, out, shadow);
        else collect(child, out, shadow);
    }
}

/** Every element in some containers, in the order the browser renders them. */
function flatten(containers, shadow) {
    const roots = Array.isArray(containers) ? containers : [containers];
    const all = [];
    for (const root of roots) {
        if (!root) continue;
        if (shadow && root.shadowRoot) collect(root.shadowRoot, all, shadow);
        else collect(root, all, shadow);
    }
    return all;
}

/**
 * The floating layer an outside element belongs to, or null when it is part of the
 * page. A layer is the nearest of:
 * - an element carrying `data-focus-trap-allow` (an opt-in for anything else);
 * - an element with `position: fixed` (toasts, popovers, context menus, palettes,
 *   another overlay that did not trap focus);
 * - a direct child of <body> that is absolutely positioned (portalled pickers and
 *   dropdowns), or that was put there after `since` was taken - something opened
 *   while the trap was on top.
 * @param {Element} target
 * @param {Set<Element>} [since] - the children <body> had when the trap activated
 * @returns {Element|null}
 */
export function layerOf(target, since) {
    if (typeof document === 'undefined' || !target) return null;
    const body = document.body;
    for (let n = target; n && n !== body && n !== document.documentElement; n = parentOf(n)) {
        if (n.nodeType !== 1) continue;
        if (n.hasAttribute(ALLOW_ATTR)) return n;
        let position = '';
        try { position = getComputedStyle(n).position; } catch { /* not rendered */ }
        if (position === 'fixed') return n;
        if (parentOf(n) === body && (position === 'absolute' || (since && !since.has(n)))) return n;
    }
    return null;
}

/**
 * The tabbable elements in some containers, in Tab order: positive tabindex first (in
 * ascending order), then the rest in document order. Of a radio group only the checked
 * button - or the first, when none is - takes part, as the browser does.
 * @param {Element|Element[]} containers
 * @param {{shadow?: boolean}} [opts] - shadow: false skips shadow roots
 * @returns {HTMLElement[]}
 */
export function tabbables(containers, opts = {}) {
    const all = flatten(containers, opts.shadow !== false).filter(canTab);
    const radios = new Map();
    const kept = all.filter((el) => {
        if (el.tagName !== 'INPUT' || el.type !== 'radio' || !el.name) return true;
        const scope = el.form || el.getRootNode();
        const key = `${el.name}`;
        if (!radios.has(scope)) radios.set(scope, new Map());
        const groups = radios.get(scope);
        if (!groups.has(key)) {
            const group = all.filter(r => r.tagName === 'INPUT' && r.type === 'radio' && r.name === el.name
                && (r.form || r.getRootNode()) === scope);
            groups.set(key, group.find(r => r.checked) || group[0]);
        }
        return groups.get(key) === el;
    });
    const positive = kept.filter(el => el.tabIndex > 0).sort((a, b) => a.tabIndex - b.tabIndex);
    return [...positive, ...kept.filter(el => el.tabIndex <= 0)];
}

/**
 * A container or element: a CSS selector or the element itself.
 * @typedef {string|HTMLElement} FocusTarget
 */

/**
 * @typedef {object} FocusTrapOptions
 * @property {FocusTarget|(() => HTMLElement|null)|false} [initialFocus] Where focus goes on activate: a selector, an element, a function returning one, or false to leave it. Default: focus already inside stays, else the first tabbable, else the container.
 * @property {FocusTarget|(() => HTMLElement|null)} [fallbackFocus] Where focus goes when nothing is tabbable (default: the first container, given tabindex="-1")
 * @property {boolean|FocusTarget} [returnFocus] true (default): back to what had focus before activate(); or an element / selector; false: nowhere
 * @property {boolean|((e: KeyboardEvent) => boolean)} [escapeDeactivates] Escape deactivates (default false - the owning overlay decides)
 * @property {boolean|((e: MouseEvent) => boolean)} [clickOutsideDeactivates] A press outside deactivates (default false)
 * @property {boolean|((e: MouseEvent) => boolean)} [allowOutsideClick] Let clicks outside through (default false: they are blocked)
 * @property {boolean} [allowScriptFocus] Let a click, key or input handler on something inside the trap move focus outside on purpose - e.g. "Insert" focusing the editor behind a slideover before closing it (default false; the overlays turn it on)
 * @property {boolean|'layers'|((el: Element, e: Event|null) => boolean)} [allowOutsideFocus] Let focus stay outside: true, 'layers' (floating layers such as toasts and popovers, never the page or a trap beneath), or a function (default false)
 * @property {boolean} [register] false: keep the trap out of E.get(container) (default true)
 * @property {boolean} [inert] Set `inert` on everything outside the containers while active (default false)
 * @property {boolean} [shadow] Walk open shadow roots (default true)
 * @property {boolean} [preventScroll] Focus without scrolling (default true)
 * @property {((trap: FocusTrapInstance) => void)|null} [onActivate]
 * @property {((trap: FocusTrapInstance) => void)|null} [onDeactivate]
 * @property {((trap: FocusTrapInstance) => void)|null} [onPause]
 * @property {((trap: FocusTrapInstance) => void)|null} [onUnpause]
 */

/** @typedef {FocusTrap} FocusTrapInstance */

/**
 * `E.focusTrap(containers, options)` - null when nothing matched - with its helpers.
 * @typedef {((containers: FocusTarget|FocusTarget[], options?: FocusTrapOptions) => FocusTrapInstance|null) & {
 *   tabbables: (containers: Element|Element[], opts?: {shadow?: boolean}) => HTMLElement[],
 *   top: () => FocusTrapInstance|null
 * }} FocusTrapFactory
 */

/** An option that may be a value or a function of the event. */
function decide(option, event) {
    return typeof option === 'function' ? !!option(event) : !!option;
}

/** Events whose handlers may move focus out of a trap with allowScriptFocus. */
const SCRIPT_EVENTS = ['click', 'keydown', 'input', 'change', 'submit'];

export class FocusTrap extends Component {
    static componentName = 'focus-trap';

    /** @type {FocusTrapOptions} */
    static defaults = {
        initialFocus: undefined,        // selector | element | () => element | false (leave focus alone)
        fallbackFocus: undefined,       // where focus goes when nothing is tabbable (default: the container)
        returnFocus: true,              // true | false | selector | element
        escapeDeactivates: false,       // boolean | (event) => boolean - the owning overlay usually decides
        clickOutsideDeactivates: false, // boolean | (event) => boolean
        allowOutsideClick: false,       // boolean | (event) => boolean
        allowOutsideFocus: false,       // boolean | 'layers' | (element, event) => boolean
        allowScriptFocus: false,        // true: a script handling a click/key INSIDE may move focus out
        inert: false,                   // set `inert` on everything outside the containers while active
        shadow: true,                   // walk open shadow roots
        preventScroll: true,
        register: true,                 // false: E.get(container) keeps finding the owner, not the trap
        onActivate: null,
        onDeactivate: null,
        onPause: null,
        onUnpause: null
    };

    /**
     * @param {FocusTarget|Element|Array<FocusTarget|Element>} containers - one container, or several
     * @param {FocusTrapOptions} [options]
     */
    constructor(containers, options = {}) {
        const list = FocusTrap._resolve(containers);
        const owner = list[0]?._dommaComponent;
        super(list[0] || null, options);
        if (this.options.register === false && this.element) {
            // An overlay's own trap: E.get(el) and el._dommaComponent stay the overlay's.
            unregister(this.element, this);
            if (owner) this.element._dommaComponent = owner;
            else delete this.element._dommaComponent;
        }
        this._containers = list;
        this._bodyAtStart = null;
        this._pendingTab = null;
        this._active = false;
        this._paused = false;
        this._returnTo = null;
        this._lastFocused = null;
        this._madeFocusable = [];
        this._inerted = [];
        this._bound = false;
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onTab = this._onTab.bind(this);
        this._onFocusIn = this._onFocusIn.bind(this);
        this._onPointerDown = this._onPointerDown.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onInsideEvent = this._onInsideEvent.bind(this);
    }

    /**
     * @param {FocusTarget|Element|Array<FocusTarget|Element>} containers
     * @returns {HTMLElement[]}
     * @protected
     */
    static _resolve(containers) {
        if (Array.isArray(containers)) {
            return containers.map(c => resolveElement(c)).filter(Boolean);
        }
        if (typeof containers === 'string') return resolveAll(containers);
        const one = resolveElement(containers);
        return one ? [one] : [];
    }

    /**
     * The trap that currently listens: the newest active one.
     * @returns {FocusTrap|null}
     */
    static top() {
        return stack[stack.length - 1] || null;
    }

    // ---- public API -----------------------------------------------------

    /**
     * Start trapping. Pauses the trap that was on top, if any, and moves focus in.
     * @param {{initialFocus?: FocusTrapOptions['initialFocus']}} [opts] - overrides the option for this activation
     * @returns {this}
     */
    activate(opts = {}) {
        if (this._active || this._destroyed || !this._containers.length) return this;
        const below = FocusTrap.top();
        if (below && below !== this) below.pause();
        this._active = true;
        this._paused = false;
        stack.push(this);
        this._returnTo = deepActiveElement();
        this._lastFocused = null;
        this._bodyAtStart = typeof document !== 'undefined' && document.body
            ? new Set(document.body.children) : null;
        this._applyInert();
        this._bind();
        const initial = 'initialFocus' in opts ? opts.initialFocus : this.options.initialFocus;
        if (initial !== false) this._focusInitial(initial);
        this._fire('activate', this);
        return this;
    }

    /**
     * Stop trapping. Unpauses the trap beneath, and returns focus unless told not to.
     * @param {{returnFocus?: boolean|FocusTarget}} [opts]
     * @returns {this}
     */
    deactivate(opts = {}) {
        if (!this._active) return this;
        this._active = false;
        this._paused = false;
        this._unbind();
        this._clearInert();
        const wasTop = FocusTrap.top() === this;
        const i = stack.indexOf(this);
        if (i > -1) stack.splice(i, 1);
        this._clearFocusable();
        this._pendingTab = null;

        const ret = 'returnFocus' in opts ? opts.returnFocus : this.options.returnFocus;
        const before = this._returnTo;
        let target = ret === true ? before
            : (ret && ret !== false ? resolveElement(ret) : null);
        this._returnTo = null;

        if (!wasTop) {
            // Going from under a newer trap (a slideover closed by the confirm on top of
            // it). Focus stays with the top one; a trap above that would hand focus back
            // into these containers hands it to where this one would have, instead.
            for (const above of stack.slice(Math.max(i, 0))) {
                if (above._returnTo && this._contains(above._returnTo)) above._returnTo = target || before;
            }
            target = null;
        }

        // The trap beneath takes over first, so the focus we hand back is not pulled away.
        const next = FocusTrap.top();
        if (wasTop && next && next._paused) next.unpause({focus: !target, _leaving: this});
        if (target && target.isConnected && typeof target.focus === 'function') {
            try { target.focus({preventScroll: !!this.options.preventScroll}); } catch { /* gone */ }
        }
        // The element to return to could not take focus (hidden since): the trap beneath
        // has it, rather than the panel that is going.
        if (wasTop && target && next && FocusTrap.top() === next && !next._paused) {
            const now = deepActiveElement();
            if (now !== target && !next._contains(now)) {
                next._focus(next._lastFocused && next._lastFocused.isConnected && canTab(next._lastFocused)
                    ? next._lastFocused : next._firstTarget());
            }
        }
        this._fire('deactivate', this);
        return this;
    }

    /**
     * Stop listening without deactivating - another trap has taken over.
     * @returns {this}
     */
    pause() {
        if (!this._active || this._paused) return this;
        this._paused = true;
        this._unbind();
        this._clearInert();
        this._fire('pause', this);
        return this;
    }

    /**
     * Listen again after pause(). Focus comes back into the containers if it is outside.
     * @param {{focus?: boolean}} [opts] - focus: false leaves focus where it is
     * @returns {this}
     */
    unpause(opts = {}) {
        if (!this._active || !this._paused) return this;
        // Only the top trap may listen; a lower one stays paused until the ones above go.
        if (FocusTrap.top() !== this) return this;
        this._paused = false;
        this._applyInert();
        this._bind();
        const active = deepActiveElement();
        // Focus in a floating layer this trap allows (a popover still open over it) stays
        // there - unless it is in the trap that just went (opts._leaving).
        const inLayer = active && active !== document.body && !(opts._leaving && opts._leaving._contains(active))
            && this._mayFocusOutside(active, null);
        if (opts.focus !== false && !this._contains(active) && !inLayer) {
            this._focus(this._lastFocused && canTab(this._lastFocused) ? this._lastFocused : this._firstTarget());
        }
        this._fire('unpause', this);
        return this;
    }

    /**
     * Trap a different set of containers (takes effect at the next key press).
     * @param {FocusTarget|Element|Array<FocusTarget|Element>} containers
     * @returns {this}
     */
    updateContainers(containers) {
        const list = FocusTrap._resolve(containers);
        const first = list[0] || null;
        if (first !== this.element) {
            if (this.element && this.options.register !== false) unregister(this.element, this);
            this.element = first;
            if (first && this.options.register !== false) register(first, this);
        }
        this._containers = list;
        if (this._active && !this._paused) {
            this._clearInert();
            this._applyInert();
        }
        return this;
    }

    /** @returns {HTMLElement[]} the trapped containers */
    containers() {
        return this._containers.slice();
    }

    /** @returns {boolean} active (paused or not) */
    isActive() {
        return this._active;
    }

    /** @returns {boolean} active but paused by a trap above it */
    isPaused() {
        return this._active && this._paused;
    }

    /**
     * The tabbable elements in the containers right now, in Tab order.
     * @returns {HTMLElement[]}
     */
    tabbables() {
        return tabbables(this._containers, {shadow: this.options.shadow});
    }

    /** @returns {void} */
    destroy() {
        if (this._destroyed) return;
        this.deactivate({returnFocus: false});
        this._destroyed = true;
        super.destroy();
    }

    // ---- internals ------------------------------------------------------

    _contains(node) {
        return !!node && this._containers.some(c => containsDeep(c, node));
    }

    _eventInside(e) {
        const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
        if (path.length) return this._containers.some(c => path.includes(c));
        return this._contains(e.target);
    }

    _bind() {
        if (this._bound || typeof document === 'undefined') return;
        document.addEventListener('keydown', this._onKeyDown, true);
        // Tab is decided after everything else had the key (see the header).
        window.addEventListener('keydown', this._onTab);
        document.addEventListener('focusin', this._onFocusIn, true);
        document.addEventListener('pointerdown', this._onPointerDown, true);
        document.addEventListener('mousedown', this._onPointerDown, true);
        document.addEventListener('click', this._onClick, true);
        for (const type of SCRIPT_EVENTS) document.addEventListener(type, this._onInsideEvent, true);
        this._bound = true;
    }

    _unbind() {
        if (!this._bound) return;
        document.removeEventListener('keydown', this._onKeyDown, true);
        window.removeEventListener('keydown', this._onTab);
        document.removeEventListener('focusin', this._onFocusIn, true);
        document.removeEventListener('pointerdown', this._onPointerDown, true);
        document.removeEventListener('mousedown', this._onPointerDown, true);
        document.removeEventListener('click', this._onClick, true);
        for (const type of SCRIPT_EVENTS) document.removeEventListener(type, this._onInsideEvent, true);
        this._bound = false;
    }

    /** A container that can hold focus itself, for when there is nothing tabbable. */
    _fallback() {
        const given = this.options.fallbackFocus;
        const el = typeof given === 'function' ? given() : (given ? resolveElement(given) : null);
        if (el) return el;
        const container = this._containers[0];
        if (container && !container.hasAttribute('tabindex')) {
            container.setAttribute('tabindex', '-1');
            this._madeFocusable.push(container);
        }
        return container;
    }

    _clearFocusable() {
        for (const el of this._madeFocusable) el.removeAttribute('tabindex');
        this._madeFocusable = [];
    }

    _firstTarget() {
        return this.tabbables()[0] || this._fallback();
    }

    _focusInitial(initial) {
        let target = null;
        if (typeof initial === 'function') target = resolveElement(initial());
        else if (initial) {
            target = typeof initial === 'string'
                ? this._containers.map(c => c.querySelector(initial)).find(Boolean) || resolveElement(initial)
                : resolveElement(initial);
        }
        if (!target) {
            // Focus that is already inside (autofocus, a caller's own choice) stays put.
            const active = deepActiveElement();
            if (this._contains(active) && active !== document.body) {
                this._lastFocused = active;
                return;
            }
            target = this._firstTarget();
        }
        this._focus(target);
    }

    _focus(el, scroll = false) {
        if (!el || typeof el.focus !== 'function') return;
        try { el.focus({preventScroll: scroll ? false : !!this.options.preventScroll}); } catch { /* not focusable */ }
        this._lastFocused = el;
    }

    /**
     * A move Tab asked for: scrolls the element into view as native Tab does
     * (`preventScroll` is for activation and return only). Should the element not take
     * focus after all, the next candidate in `list` is tried, so Tab never sticks.
     */
    _tabTo(el, list, back = false) {
        this._focus(el, true);
        if (!list || !el || deepActiveElement() === el) return;
        const start = list.indexOf(el);
        for (let k = 1; start > -1 && k < list.length; k++) {
            const next = list[(start + (back ? -k : k) + list.length * k) % list.length];
            this._focus(next, true);
            if (deepActiveElement() === next) return;
        }
    }

    /**
     * Containers that left the page (a view removed the overlay without closing it)
     * leave nothing to trap: the trap lets go rather than hold focus nowhere.
     * @returns {boolean} true when it let go
     */
    _gone() {
        if (this._containers.some(c => c.isConnected)) return false;
        this.deactivate({returnFocus: false});
        return true;
    }

    /** Whether focus may stay on an element outside the containers. */
    _mayFocusOutside(target, e) {
        const allow = this.options.allowOutsideFocus;
        if (typeof allow === 'function') return !!allow(target, e);
        if (allow !== 'layers') return !!allow;
        if (stack.some(t => t !== this && t._contains(target))) return false;
        return !!layerOf(target, this._bodyAtStart);
    }

    /** Capture phase: Escape, and a note of the Tab that is on its way. */
    _onKeyDown(e) {
        if (this._gone()) return;
        if (e.key === 'Escape' && !e.defaultPrevented && decide(this.options.escapeDeactivates, e)) {
            e.preventDefault();
            this.deactivate();
            return;
        }
        if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return;
        // Should the key never reach window (a handler stopped it without using it),
        // the focus it moves natively is caught in _onFocusIn and wrapped from here.
        const pending = {shift: e.shiftKey, fromInside: this._contains(deepActiveElement())};
        this._pendingTab = pending;
        setTimeout(() => { if (this._pendingTab === pending) this._pendingTab = null; }, 0);
    }

    /** Bubble phase on window: move focus, unless something on the way used the key. */
    _onTab(e) {
        if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return;
        this._pendingTab = null;
        if (e.defaultPrevented || this._gone()) return;
        const active = deepActiveElement();
        if (active && active !== document.body && !this._contains(active)) {
            const layer = this._mayFocusOutside(active, e) ? layerOf(active, this._bodyAtStart) : null;
            if (layer) {
                this._tabInLayer(e, layer, active);
                return;
            }
        }
        const list = this.tabbables();
        e.preventDefault();
        if (!list.length) {
            this._tabTo(this._fallback());
            return;
        }
        let i = list.indexOf(active);
        let next;
        if (i > -1) {
            next = e.shiftKey ? list[(i - 1 + list.length) % list.length] : list[(i + 1) % list.length];
        } else if (active && this._contains(active)) {
            // Focus is on something that is not itself tabbable (the container, a
            // tabindex="-1" row, a dialog frame in a shadow root): carry on from where it
            // is in rendering order - document order cannot compare across shadow trees.
            next = this._nextFrom(active, list, e.shiftKey);
        } else {
            next = e.shiftKey ? list[list.length - 1] : list[0];
        }
        this._tabTo(next, list, e.shiftKey);
    }

    /** The tabbable after (or before) a non-tabbable element inside the containers. */
    _nextFrom(active, list, back) {
        const order = flatten(this._containers, this.options.shadow !== false);
        const at = order.indexOf(active);
        if (at < 0) return back ? list[list.length - 1] : list[0];
        const pos = (el) => order.indexOf(el);
        if (back) {
            const before = list.filter(el => pos(el) < at);
            return before[before.length - 1] || list[list.length - 1];
        }
        return list.find(el => pos(el) > at) || list[0];
    }

    /**
     * Tab inside a floating layer the trap let focus into (a popover opened from the
     * overlay, a toast's button): it moves through the layer, and off either end it
     * comes back to the overlay as though the layer sat just after what had focus
     * before - Shift+Tab to that element, Tab to the one after it.
     */
    _tabInLayer(e, layer, active) {
        const inLayer = tabbables(layer, {shadow: this.options.shadow});
        const i = inLayer.indexOf(active);
        e.preventDefault();
        if (i > -1) {
            const next = inLayer[e.shiftKey ? i - 1 : i + 1];
            if (next) {
                next.focus({preventScroll: false});
                return;
            }
        } else if (inLayer.length) {
            inLayer[e.shiftKey ? inLayer.length - 1 : 0].focus({preventScroll: false});
            return;
        }
        const list = this.tabbables();
        const anchor = this._lastFocused && this._lastFocused.isConnected && this._contains(this._lastFocused)
            ? this._lastFocused : null;
        if (!list.length) {
            this._tabTo(anchor || this._fallback());
            return;
        }
        if (!anchor) {
            this._tabTo(e.shiftKey ? list[list.length - 1] : list[0]);
            return;
        }
        if (e.shiftKey) {
            this._tabTo(anchor);
            return;
        }
        const at = list.indexOf(anchor);
        this._tabTo(at > -1 ? list[(at + 1) % list.length] : this._nextFrom(anchor, list, false));
    }

    _onFocusIn(e) {
        if (this._gone()) return;
        const target = typeof e.composedPath === 'function' ? (e.composedPath()[0] || e.target) : e.target;
        if (this._eventInside(e)) {
            this._lastFocused = target;
            return;
        }
        const pending = this._pendingTab;
        this._pendingTab = null;
        // A floating layer (a popover the overlay opened, a toast) keeps it - even when a
        // Tab handler put it there on purpose (a popover trigger sending Tab into its panel).
        if (this._mayFocusOutside(target, e)) return;
        // A Tab the trap never saw on window moved focus out natively: wrap it.
        if (pending && pending.fromInside) {
            e.stopImmediatePropagation?.();
            const list = this.tabbables();
            this._tabTo(list.length ? (pending.shift ? list[list.length - 1] : list[0]) : this._fallback());
            return;
        }
        // A handler for a click, key or input inside the trap moved focus out on purpose
        // (the CMS's "Insert" focuses the editor behind its slideover, inserts, then closes).
        if (this.options.allowScriptFocus && this._scriptTurn) return;
        // Focus got out (a click elsewhere, a script): bring it back.
        e.stopImmediatePropagation?.();
        const last = this._lastFocused && this._lastFocused.isConnected && this._contains(this._lastFocused)
            ? this._lastFocused : null;
        // Out of the end of an iframe: its keys never reach this document, so which way
        // it went is told by where focus landed - after the containers wraps to the first.
        if (last && /^(IFRAME|OBJECT|EMBED)$/.test(last.tagName)) {
            const list = this.tabbables();
            const after = this._containers.some(c => c.compareDocumentPosition(target) & 4);
            this._tabTo(list.length ? (after ? list[0] : list[list.length - 1]) : this._fallback());
            return;
        }
        this._focus(last || this._firstTarget());
    }

    _onPointerDown(e) {
        if (this._eventInside(e)) return;
        if (decide(this.options.clickOutsideDeactivates, e)) {
            // A click on something that takes focus keeps it there; otherwise focus goes back.
            const focusable = e.target?.closest?.(TABBABLE);
            this.deactivate({returnFocus: !focusable && this.options.returnFocus});
            return;
        }
        if (decide(this.options.allowOutsideClick, e)) return;
        // The press would move focus out; stop it before it does.
        e.preventDefault();
    }

    /**
     * Capture phase: an event aimed inside the trap opens a short window in which focus may
     * leave - until the handlers of this event, and anything they chain with
     * Promise.then, have run. A Tab never opens it (Tab is the trap's own business).
     */
    _onInsideEvent(e) {
        if (!this.options.allowScriptFocus || !this._eventInside(e)) return;
        if (e.type === 'keydown' && e.key === 'Tab') return;
        const turn = {};
        this._scriptTurn = turn;
        setTimeout(() => { if (this._scriptTurn === turn) this._scriptTurn = null; }, 0);
    }

    _onClick(e) {
        if (this._eventInside(e)) return;
        if (decide(this.options.clickOutsideDeactivates, e) || decide(this.options.allowOutsideClick, e)) return;
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    /**
     * `inert` on every sibling of the containers and of their ancestors, up to <body>, so
     * the rest of the page cannot be reached by anything - pointer, Tab or a screen
     * reader's virtual cursor. What was inert already is left alone and stays so.
     */
    _applyInert() {
        if (!this.options.inert || typeof document === 'undefined') return;
        const keep = this._containers;
        const seen = new Set();
        for (const container of keep) {
            for (let node = container; node && node !== document.body && node.parentElement; node = node.parentElement) {
                for (const sibling of node.parentElement.children) {
                    if (sibling === node || seen.has(sibling)) continue;
                    if (keep.some(c => sibling.contains(c))) continue;
                    if (/^(SCRIPT|STYLE|TEMPLATE|LINK|META)$/.test(sibling.tagName)) continue;
                    seen.add(sibling);
                    if (sibling.hasAttribute('inert')) continue;
                    sibling.setAttribute('inert', '');
                    this._inerted.push(sibling);
                }
            }
        }
    }

    _clearInert() {
        for (const el of this._inerted) el.removeAttribute('inert');
        this._inerted = [];
    }
}

/**
 * A trap round some containers - the small util other components use.
 * @param {FocusTarget|Element|Array<FocusTarget|Element>} containers
 * @param {FocusTrapOptions} [options]
 * @returns {FocusTrap}
 */
export function createFocusTrap(containers, options = {}) {
    return new FocusTrap(containers, options);
}

export default FocusTrap;
