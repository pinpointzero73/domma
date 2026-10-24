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
 * to the palette, not to the page.
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

/**
 * The tabbable elements in some containers, in Tab order: positive tabindex first (in
 * ascending order), then the rest in document order. Of a radio group only the checked
 * button - or the first, when none is - takes part, as the browser does.
 * @param {Element|Element[]} containers
 * @param {{shadow?: boolean}} [opts] - shadow: false skips shadow roots
 * @returns {Element[]}
 */
export function tabbables(containers, opts = {}) {
    const shadow = opts.shadow !== false;
    const roots = Array.isArray(containers) ? containers : [containers];
    const all = [];
    for (const root of roots) {
        if (!root) continue;
        const list = [];
        if (shadow && root.shadowRoot) collect(root.shadowRoot, list, shadow);
        else collect(root, list, shadow);
        all.push(...list.filter(canTab));
    }
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

/** An option that may be a value or a function of the event. */
function decide(option, event) {
    return typeof option === 'function' ? !!option(event) : !!option;
}

export class FocusTrap extends Component {
    static componentName = 'focus-trap';

    static defaults = {
        initialFocus: undefined,        // selector | element | () => element | false (leave focus alone)
        fallbackFocus: undefined,       // where focus goes when nothing is tabbable (default: the container)
        returnFocus: true,              // true | false | selector | element
        escapeDeactivates: false,       // boolean | (event) => boolean - the owning overlay usually decides
        clickOutsideDeactivates: false, // boolean | (event) => boolean
        allowOutsideClick: false,       // boolean | (event) => boolean
        inert: false,                   // set `inert` on everything outside the containers while active
        shadow: true,                   // walk open shadow roots
        preventScroll: true,
        onActivate: null,
        onDeactivate: null,
        onPause: null,
        onUnpause: null
    };

    /**
     * @param {string|Element|Element[]} containers - one container, or several
     * @param {Object} [options]
     */
    constructor(containers, options = {}) {
        const list = FocusTrap._resolve(containers);
        super(list[0] || null, options);
        this._containers = list;
        this._active = false;
        this._paused = false;
        this._returnTo = null;
        this._lastFocused = null;
        this._madeFocusable = [];
        this._inerted = [];
        this._bound = false;
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onFocusIn = this._onFocusIn.bind(this);
        this._onPointerDown = this._onPointerDown.bind(this);
        this._onClick = this._onClick.bind(this);
    }

    static _resolve(containers) {
        if (Array.isArray(containers)) {
            return containers.map(c => resolveElement(c)).filter(Boolean);
        }
        if (typeof containers === 'string') return resolveAll(containers);
        const one = resolveElement(containers);
        return one ? [one] : [];
    }

    /** The trap that currently listens: the newest active one. */
    static top() {
        return stack[stack.length - 1] || null;
    }

    // ---- public API -----------------------------------------------------

    /**
     * Start trapping. Pauses the trap that was on top, if any, and moves focus in.
     * @param {{initialFocus?: *}} [opts] - overrides the option for this activation
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
        this._applyInert();
        this._bind();
        const initial = 'initialFocus' in opts ? opts.initialFocus : this.options.initialFocus;
        if (initial !== false) this._focusInitial(initial);
        this._fire('activate', this);
        return this;
    }

    /**
     * Stop trapping. Unpauses the trap beneath, and returns focus unless told not to.
     * @param {{returnFocus?: boolean|string|Element}} [opts]
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

        const ret = 'returnFocus' in opts ? opts.returnFocus : this.options.returnFocus;
        const target = ret === true ? this._returnTo
            : (ret && ret !== false ? resolveElement(ret) : null);
        this._returnTo = null;

        // The trap beneath takes over first, so the focus we hand back is not pulled away.
        const next = FocusTrap.top();
        if (wasTop && next && next._paused) next.unpause({focus: !target});
        if (target && target.isConnected && typeof target.focus === 'function') {
            try { target.focus({preventScroll: !!this.options.preventScroll}); } catch { /* gone */ }
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
        if (opts.focus !== false && !this._contains(deepActiveElement())) {
            this._focus(this._lastFocused && canTab(this._lastFocused) ? this._lastFocused : this._firstTarget());
        }
        this._fire('unpause', this);
        return this;
    }

    /**
     * Trap a different set of containers (takes effect at the next key press).
     * @param {Array<string|Element>|string|Element} containers
     * @returns {this}
     */
    updateContainers(containers) {
        const list = FocusTrap._resolve(containers);
        const first = list[0] || null;
        if (first !== this.element) {
            if (this.element) unregister(this.element, this);
            this.element = first;
            if (first) register(first, this);
        }
        this._containers = list;
        if (this._active && !this._paused) {
            this._clearInert();
            this._applyInert();
        }
        return this;
    }

    /** @returns {Element[]} the trapped containers */
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

    /** The tabbable elements in the containers right now, in Tab order. */
    tabbables() {
        return tabbables(this._containers, {shadow: this.options.shadow});
    }

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
        document.addEventListener('focusin', this._onFocusIn, true);
        document.addEventListener('pointerdown', this._onPointerDown, true);
        document.addEventListener('mousedown', this._onPointerDown, true);
        document.addEventListener('click', this._onClick, true);
        this._bound = true;
    }

    _unbind() {
        if (!this._bound) return;
        document.removeEventListener('keydown', this._onKeyDown, true);
        document.removeEventListener('focusin', this._onFocusIn, true);
        document.removeEventListener('pointerdown', this._onPointerDown, true);
        document.removeEventListener('mousedown', this._onPointerDown, true);
        document.removeEventListener('click', this._onClick, true);
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

    _focus(el) {
        if (!el || typeof el.focus !== 'function') return;
        try { el.focus({preventScroll: !!this.options.preventScroll}); } catch { /* not focusable */ }
        this._lastFocused = el;
    }

    _onKeyDown(e) {
        if (e.key === 'Escape' && !e.defaultPrevented && decide(this.options.escapeDeactivates, e)) {
            e.preventDefault();
            this.deactivate();
            return;
        }
        if (e.key !== 'Tab' || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
        const list = this.tabbables();
        e.preventDefault();
        if (!list.length) {
            this._focus(this._fallback());
            return;
        }
        const active = deepActiveElement();
        let i = list.indexOf(active);
        let next;
        if (i > -1) {
            next = e.shiftKey ? list[(i - 1 + list.length) % list.length] : list[(i + 1) % list.length];
        } else if (active && this._contains(active) && typeof active.compareDocumentPosition === 'function') {
            // Focus is on something that is not itself tabbable (the container, a
            // tabindex="-1" row): carry on from where it is in the document.
            if (e.shiftKey) {
                const before = list.filter(el => active.compareDocumentPosition(el) & 2);
                next = before[before.length - 1] || list[list.length - 1];
            } else {
                next = list.find(el => active.compareDocumentPosition(el) & 4) || list[0];
            }
        } else {
            next = e.shiftKey ? list[list.length - 1] : list[0];
        }
        this._focus(next);
    }

    _onFocusIn(e) {
        const target = typeof e.composedPath === 'function' ? (e.composedPath()[0] || e.target) : e.target;
        if (this._eventInside(e)) {
            this._lastFocused = target;
            return;
        }
        // Focus got out (a click elsewhere, a script): bring it back.
        e.stopImmediatePropagation?.();
        const back = this._lastFocused && this._lastFocused.isConnected && this._contains(this._lastFocused)
            ? this._lastFocused : this._firstTarget();
        this._focus(back);
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
 * @param {string|Element|Element[]} containers
 * @param {Object} [options]
 * @returns {FocusTrap}
 */
export function createFocusTrap(containers, options = {}) {
    return new FocusTrap(containers, options);
}

export default FocusTrap;
