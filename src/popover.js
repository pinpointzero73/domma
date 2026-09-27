/**
 * Domma Popover Component
 *
 * A floating panel anchored to a trigger - rich content, an optional title and
 * close button, opened by click, hover, focus or code. The panel is portalled
 * to `document.body` and positioned with `position: fixed`, so an ancestor
 * with `overflow: hidden` or its own stacking context cannot clip it.
 *
 * Differences from Tooltip that are deliberate:
 *
 *   - Nothing wraps the trigger. `E.tooltip` puts the target inside a
 *     `<domma-tooltip>` element, which moves it in the DOM and means it must
 *     already be in the document. The popover only adds attributes to the
 *     trigger and restores them on destroy().
 *   - Content is text unless you say otherwise. A string is set with
 *     textContent; a DOM node (or a function returning one) is appended; a
 *     string with `html: true` goes through Domma's sanitiser first.
 *   - It takes the pointer and the keyboard. A click popover is a non-modal
 *     dialog: focus moves in, Tab leaves it in document order as if the panel
 *     sat straight after the trigger, and Esc or closing puts focus back.
 *
 * Positioning prefers the requested side, flips to the opposite one when that
 * does not fit, tries the two perpendicular sides after that, and finally
 * shifts along the cross axis to stay inside the viewport. The arrow keeps
 * pointing at the trigger through the shift. While open it follows scrolling
 * and resizing.
 *
 * All open popovers share one set of document listeners (Escape, outside
 * pointer, focus leaving), bound on the first open and removed with the last.
 */

import Component from './component.js';
import sanitizeModule from './sanitize.js';

const SIDES = ['top', 'bottom', 'left', 'right'];
const OPPOSITE = {top: 'bottom', bottom: 'top', left: 'right', right: 'left'};
const PERPENDICULAR = {top: ['right', 'left'], bottom: ['right', 'left'], left: ['bottom', 'top'], right: ['bottom', 'top']};
const AUTO_ORDER = ['bottom', 'top', 'right', 'left'];

// Distance kept between the panel and the viewport edge.
const VIEWPORT_MARGIN = 8;
// Keeps the arrow off the rounded corners.
const ARROW_PADDING = 12;

const TABBABLE = [
    'a[href]', 'area[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])', 'textarea:not([disabled])', 'iframe', 'summary',
    '[contenteditable=""]', '[contenteditable="true"]', '[tabindex]'
].join(',');

const NATIVE_INTERACTIVE = 'a[href], button, input, select, textarea, summary';

const isFn = (v) => typeof v === 'function';
const isNode = (v) => typeof Node !== 'undefined' && v instanceof Node;

// Open popovers, oldest first. The last one is "on top" for Escape.
const openStack = [];
// Trigger element -> instance, for getInstance() and so scan() is idempotent.
const byTrigger = new WeakMap();
let seq = 0;
let docBound = false;

function prefersReducedMotion() {
    try {
        return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    } catch {
        return false;
    }
}

function viewport() {
    const de = document.documentElement;
    return {
        width: de.clientWidth || window.innerWidth || 0,
        height: de.clientHeight || window.innerHeight || 0
    };
}

/** Accept a selector, an element, or a Domma/jQuery-style collection. */
function resolveElement(target) {
    if (!target) return null;
    if (typeof target === 'string') return document.querySelector(target);
    if (isNode(target)) return target;
    if (typeof target.get === 'function' && isNode(target.get(0))) return target.get(0);
    if (isNode(target[0])) return target[0];
    return null;
}

function tabbablesIn(root) {
    if (!root) return [];
    return Array.from(root.querySelectorAll(TABBABLE)).filter((el) => {
        if (el.tabIndex < 0) return false;
        return !el.closest('[hidden], [inert]');
    });
}

/** "top-start" -> ['top', 'start']; anything unknown falls back to the default. */
function parsePlacement(value) {
    const [side, align] = String(value || 'bottom').split('-');
    const s = side === 'auto' || SIDES.includes(side) ? side : 'bottom';
    const a = align === 'start' || align === 'end' ? align : 'center';
    return [s, a];
}

function parseOffset(value) {
    if (Array.isArray(value)) return [Number(value[0]) || 0, Number(value[1]) || 0];
    const n = Number(value);
    return [0, Number.isFinite(n) ? n : 10];
}

function parseDelay(value) {
    if (value && typeof value === 'object') {
        return {show: Number(value.show) || 0, hide: Number(value.hide) || 0};
    }
    const n = Number(value) || 0;
    return {show: n, hide: n};
}

// ============================================
// Shared document listeners
// ============================================

function onDocPointerDown(e) {
    const target = e.target;
    for (const instance of openStack.slice().reverse()) {
        if (!instance._open || !instance.options.closeOnOutside) continue;
        if (instance._contains(target)) continue;
        instance.hide({returnFocus: false});
    }
}

function onDocKeyDown(e) {
    if (e.key !== 'Escape' && e.key !== 'Esc') return;
    const top = openStack[openStack.length - 1];
    if (!top || !top.options.closeOnEscape) return;
    const hadFocus = top._contains(document.activeElement);
    e.preventDefault();
    // Stop here, so a modal or slideover round the trigger stays open.
    e.stopPropagation();
    top.hide({returnFocus: hadFocus});
}

function onDocFocusIn(e) {
    const target = e.target;
    for (const instance of openStack.slice().reverse()) {
        if (!instance._open || !instance._closesOnFocusLeave()) continue;
        if (instance._contains(target)) continue;
        instance.hide({returnFocus: false});
    }
}

function bindDoc() {
    if (docBound || typeof document === 'undefined') return;
    docBound = true;
    document.addEventListener('pointerdown', onDocPointerDown, true);
    document.addEventListener('keydown', onDocKeyDown, true);
    document.addEventListener('focusin', onDocFocusIn, true);
}

function unbindDoc() {
    if (!docBound || openStack.length) return;
    docBound = false;
    document.removeEventListener('pointerdown', onDocPointerDown, true);
    document.removeEventListener('keydown', onDocKeyDown, true);
    document.removeEventListener('focusin', onDocFocusIn, true);
}

// ============================================
// Popover Component
// ============================================

class Popover extends Component {
    static defaults = {
        content: '',            // string (text), Node, or (popover) => string | Node
        title: '',              // same types as content
        html: false,            // true: string content/title is sanitised HTML, not text
        trigger: 'click',       // 'click' | 'hover' | 'focus' | 'manual', or several: 'hover focus'
        placement: 'bottom',    // top | bottom | left | right | auto, each with -start / -end
        flip: true,             // try the other sides when the preferred one does not fit
        offset: 10,             // px between trigger and panel, or [crossAxis, mainAxis]
        arrow: true,
        dismissible: false,     // show a close (x) button
        closeOnOutside: true,   // a pointer press or focus outside closes it
        closeOnEscape: true,
        group: 'default',       // one open at a time per group; null = independent
        width: null,            // any CSS width
        maxWidth: null,         // any CSS width; the stylesheet default is 20rem
        className: '',
        id: null,               // panel id; generated when not given
        role: null,             // null = 'dialog', or 'tooltip' for hover/focus-only triggers
        ariaLabel: null,        // accessible name when there is no title
        autoFocus: null,        // null = move focus in when opened by click
        trapFocus: false,       // true: Tab cycles inside the panel
        delay: {show: 80, hide: 120},  // hover only; a number sets both
        animation: true,
        animationDuration: 150,
        container: null,        // where the panel is portalled; default document.body
        zIndex: null,
        onShow: null,           // return false to cancel
        onShown: null,
        onHide: null,           // return false to cancel
        onHidden: null
    };

    constructor(trigger, options = {}) {
        super(resolveElement(trigger), options);

        this._open = false;
        this._panel = null;
        this._parent = null;
        this._timers = {show: null, hide: null, remove: null, shown: null};
        this._triggerHandlers = [];
        this._openHandlers = [];
        this._savedAttrs = null;
        this._frame = null;
        this._resizeObserver = null;
        this._destroyed = false;

        if (!this.element) return;

        const previous = byTrigger.get(this.element);
        if (previous && previous !== this) previous.destroy();
        byTrigger.set(this.element, this);

        this.id = this.options.id || `dm-popover-${++seq}`;
        this._saveAttrs();
        this._applyTriggerAria();
        this._bindTrigger();
    }

    // ============================================
    // Public API
    // ============================================

    /** The panel element (created on first show). */
    get panel() {
        return this._panel;
    }

    /** The trigger element. */
    get trigger() {
        return this.element;
    }

    isOpen() {
        return this._open;
    }

    /**
     * Open the popover.
     * @param {{focus?: boolean}} [opts] - focus overrides `autoFocus` for this open
     */
    show(opts = {}) {
        if (!this.element || this._destroyed) return this;
        clearTimeout(this._timers.show);
        clearTimeout(this._timers.hide);
        if (this._open) return this;
        if (!this._emit('show', true)) return this;

        const panel = this._ensurePanel();
        this._render();

        // A popover opened from inside another one is its child: it does not
        // close its parent through the group rule, and an outside click in it
        // is not "outside" for the parent.
        this._parent = openStack.slice().reverse()
            .find((p) => p !== this && p._panel && p._panel.contains(this.element)) || null;

        const group = this.options.group;
        if (group !== null && group !== undefined && group !== false) {
            for (const other of openStack.slice()) {
                if (other === this || other.options.group !== group) continue;
                if (other._isAncestorOf(this)) continue;
                other.hide({returnFocus: false});
            }
        }

        clearTimeout(this._timers.remove);
        clearTimeout(this._timers.shown);
        const container = resolveElement(this.options.container) || document.body;
        if (panel.parentNode !== container) container.appendChild(panel);

        this._open = true;
        openStack.push(this);
        bindDoc();
        this._bindOpen();
        this._setExpanded(true);

        panel.classList.remove('is-open');
        this.update();
        // Reflow, so the transition runs from the closed state.
        void panel.offsetHeight;
        panel.classList.add('is-open');

        const wantFocus = opts.focus !== undefined ? opts.focus
            : this.options.autoFocus !== null ? this.options.autoFocus
                : this._triggers().includes('click');
        if (wantFocus) this._focusInside();

        const duration = this._duration();
        if (duration) {
            this._timers.shown = setTimeout(() => {
                if (this._open) this._emit('shown');
            }, duration);
        } else {
            this._emit('shown');
        }
        return this;
    }

    /**
     * Close the popover.
     * @param {{returnFocus?: boolean}} [opts] - default: only when focus is inside the panel
     */
    hide(opts = {}) {
        clearTimeout(this._timers.show);
        clearTimeout(this._timers.hide);
        if (!this._open) return this;
        if (!this._emit('hide', true)) return this;

        // Children first, so none is left pointing at a panel that has gone.
        for (const child of openStack.slice()) {
            if (child !== this && child._parent === this) child.hide({returnFocus: false});
        }

        const panel = this._panel;
        const focusInside = panel && panel.contains(document.activeElement);
        const returnFocus = opts.returnFocus !== undefined ? opts.returnFocus : focusInside;

        this._open = false;
        this._parent = null;
        const idx = openStack.indexOf(this);
        if (idx > -1) openStack.splice(idx, 1);
        this._unbindOpen();
        unbindDoc();
        this._setExpanded(false);
        clearTimeout(this._timers.shown);

        if (returnFocus && this.element && isFn(this.element.focus)) {
            this.element.focus({preventScroll: true});
        }

        if (panel) {
            panel.classList.remove('is-open');
            const finish = () => {
                if (this._open) return;
                panel.remove();
                this._emit('hidden');
            };
            const duration = this._duration();
            if (duration) this._timers.remove = setTimeout(finish, duration);
            else finish();
        }
        return this;
    }

    toggle(opts = {}) {
        return this._open ? this.hide(opts) : this.show(opts);
    }

    /** Replace the content. Same types as the `content` option. */
    setContent(content) {
        this.options.content = content;
        if (this._panel) {
            this._renderBody();
            if (this._open) this.update();
        }
        return this;
    }

    /** Replace the title. An empty value removes the header. */
    setTitle(title) {
        this.options.title = title;
        if (this._panel) {
            this._renderTitle();
            if (this._open) this.update();
        }
        return this;
    }

    /** Recalculate the position (after the trigger moved or the content changed size). */
    update() {
        if (!this._open || !this._panel || !this.element) return this;
        if (!this.element.isConnected) {
            this.hide({returnFocus: false});
            return this;
        }
        this._position();
        return this;
    }

    destroy() {
        if (this._destroyed) return;
        this._destroyed = true;

        // Close at once: an animated close would outlive the instance.
        const idx = openStack.indexOf(this);
        if (idx > -1) {
            for (const child of openStack.slice()) {
                if (child !== this && child._parent === this) child.hide({returnFocus: false});
            }
            openStack.splice(openStack.indexOf(this), 1);
        }
        const hadFocus = this._panel && this._panel.contains(document.activeElement);
        this._open = false;
        this._unbindOpen();
        unbindDoc();
        Object.values(this._timers).forEach((t) => clearTimeout(t));
        if (this._panel) {
            this._panel.remove();
            this._panel = null;
        }
        this._unbindTrigger();
        this._restoreAttrs();
        if (hadFocus && this.element && isFn(this.element.focus)) this.element.focus({preventScroll: true});
        if (this.element && byTrigger.get(this.element) === this) byTrigger.delete(this.element);
        super.destroy();
    }

    _applyOptions() {
        if (!this.element || this._destroyed) return;
        this._unbindTrigger();
        this._applyTriggerAria();
        this._bindTrigger();
        if (this._panel) {
            this._styleNode();
            this._render();
            if (this._open) this.update();
        }
    }

    // ============================================
    // Triggers
    // ============================================

    _triggers() {
        return String(this.options.trigger || 'click').split(/[\s,]+/).filter(Boolean);
    }

    _role() {
        if (this.options.role) return this.options.role;
        const t = this._triggers();
        const tooltipOnly = t.length && t.every((x) => x === 'hover' || x === 'focus');
        return tooltipOnly ? 'tooltip' : 'dialog';
    }

    _closesOnFocusLeave() {
        const t = this._triggers();
        return this.options.closeOnOutside || t.includes('focus') || t.includes('hover');
    }

    _on(el, event, handler, list) {
        el.addEventListener(event, handler);
        list.push({el, event, handler});
    }

    _bindTrigger() {
        const el = this.element;
        const list = this._triggerHandlers;
        const triggers = this._triggers();
        const delay = () => parseDelay(this.options.delay);

        if (triggers.includes('click')) {
            this._on(el, 'click', (e) => {
                if (el.matches?.('a[href]')) e.preventDefault();
                this.toggle();
            }, list);
            // A span or div made into a trigger needs the keys a button has.
            if (!el.matches?.(NATIVE_INTERACTIVE)) {
                this._on(el, 'keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggle({focus: true});
                    }
                }, list);
            }
        }

        if (triggers.includes('hover')) {
            this._on(el, 'mouseenter', () => this._scheduleShow(delay().show), list);
            this._on(el, 'mouseleave', () => this._scheduleHide(delay().hide), list);
        }

        // Hover popovers open on keyboard focus too, or keyboard users never see them.
        if (triggers.includes('focus') || triggers.includes('hover')) {
            this._on(el, 'focusin', () => this.show({focus: false}), list);
            this._on(el, 'focusout', (e) => {
                if (this._contains(e.relatedTarget)) return;
                // Click into a non-focusable part of the page: nothing takes
                // focus, relatedTarget is null, and the popover goes.
                this._scheduleHide(0);
            }, list);
        }

        // Tab from the trigger goes into the panel first, as if the panel sat
        // straight after the trigger in the document.
        this._on(el, 'keydown', (e) => {
            if (e.key !== 'Tab' || e.shiftKey || !this._open || !this._panel) return;
            const inside = tabbablesIn(this._panel);
            if (!inside.length) return;
            e.preventDefault();
            inside[0].focus();
        }, list);
    }

    _unbindTrigger() {
        for (const {el, event, handler} of this._triggerHandlers) el.removeEventListener(event, handler);
        this._triggerHandlers = [];
    }

    _scheduleShow(ms) {
        clearTimeout(this._timers.hide);
        clearTimeout(this._timers.show);
        if (this._open) return;
        if (ms > 0) this._timers.show = setTimeout(() => this.show({focus: false}), ms);
        else this.show({focus: false});
    }

    _scheduleHide(ms) {
        clearTimeout(this._timers.show);
        clearTimeout(this._timers.hide);
        if (!this._open) return;
        if (ms > 0) this._timers.hide = setTimeout(() => this.hide(), ms);
        else this.hide();
    }

    // ============================================
    // ARIA
    // ============================================

    _saveAttrs() {
        const el = this.element;
        const names = ['aria-haspopup', 'aria-expanded', 'aria-controls', 'aria-describedby', 'tabindex', 'role'];
        this._savedAttrs = {};
        for (const name of names) {
            this._savedAttrs[name] = el.hasAttribute(name) ? el.getAttribute(name) : null;
        }
    }

    _restoreAttrs() {
        const el = this.element;
        if (!el || !this._savedAttrs) return;
        for (const [name, value] of Object.entries(this._savedAttrs)) {
            if (value === null) el.removeAttribute(name);
            else el.setAttribute(name, value);
        }
        el.classList.remove('dm-popover-trigger', 'is-popover-open');
    }

    _applyTriggerAria() {
        const el = this.element;
        // Start from what the page had, so a change of trigger type leaves nothing behind.
        this._restoreAttrs();
        el.classList.add('dm-popover-trigger');

        if (this._role() === 'dialog') {
            el.setAttribute('aria-haspopup', 'dialog');
            el.setAttribute('aria-expanded', this._open ? 'true' : 'false');
        }

        // Something that opens on click or focus has to be reachable by keyboard.
        const t = this._triggers();
        const needsFocus = t.includes('click') || t.includes('focus') || t.includes('hover');
        if (needsFocus && !el.matches?.(NATIVE_INTERACTIVE) && !el.hasAttribute('tabindex')) {
            el.setAttribute('tabindex', '0');
        }
        if (t.includes('click') && !el.matches?.(NATIVE_INTERACTIVE) && !el.hasAttribute('role')) {
            el.setAttribute('role', 'button');
        }
        if (this._open) this._setExpanded(true);
    }

    _setExpanded(open) {
        const el = this.element;
        if (!el) return;
        el.classList.toggle('is-popover-open', open);
        if (this._role() === 'dialog') {
            el.setAttribute('aria-expanded', open ? 'true' : 'false');
            // Only point at the panel while it is in the document.
            if (open) el.setAttribute('aria-controls', this.id);
            else if (this._savedAttrs?.['aria-controls'] != null) el.setAttribute('aria-controls', this._savedAttrs['aria-controls']);
            else el.removeAttribute('aria-controls');
        } else {
            const tokens = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter((x) => x && x !== this.id);
            if (open) tokens.push(this.id);
            if (tokens.length) el.setAttribute('aria-describedby', tokens.join(' '));
            else el.removeAttribute('aria-describedby');
        }
    }

    // ============================================
    // Panel
    // ============================================

    _ensurePanel() {
        if (this._panel) return this._panel;

        const panel = document.createElement('div');
        panel.id = this.id;
        panel.setAttribute('tabindex', '-1');

        const arrow = document.createElement('div');
        arrow.className = 'dm-popover-arrow';
        arrow.setAttribute('aria-hidden', 'true');

        const header = document.createElement('div');
        header.className = 'dm-popover-header';
        const title = document.createElement('div');
        title.className = 'dm-popover-title';
        title.id = `${this.id}-title`;
        header.appendChild(title);

        const body = document.createElement('div');
        body.className = 'dm-popover-body';

        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'dm-popover-close';
        close.setAttribute('aria-label', 'Close');
        // Glyph in a child: Domma.icons.scan() replaces the element carrying data-icon.
        const glyph = document.createElement('span');
        glyph.setAttribute('data-icon', 'x');
        glyph.setAttribute('data-icon-size', '16');
        glyph.setAttribute('aria-hidden', 'true');
        close.appendChild(glyph);

        panel.append(arrow, header, body, close);

        this._panel = panel;
        this._parts = {arrow, header, title, body, close};

        close.addEventListener('click', () => this.hide({returnFocus: true}));
        panel.addEventListener('keydown', (e) => this._onPanelKeyDown(e));
        panel.addEventListener('mouseenter', () => {
            if (this._triggers().includes('hover')) clearTimeout(this._timers.hide);
        });
        panel.addEventListener('mouseleave', () => {
            if (this._triggers().includes('hover')) this._scheduleHide(parseDelay(this.options.delay).hide);
        });
        panel.addEventListener('focusout', (e) => {
            const t = this._triggers();
            if (!(t.includes('focus') || t.includes('hover'))) return;
            if (this._contains(e.relatedTarget)) return;
            this._scheduleHide(0);
        });

        this._styleNode();
        return panel;
    }

    _styleNode() {
        const panel = this._panel;
        const opts = this.options;
        const role = this._role();
        const classes = ['dm-popover'];
        if (opts.dismissible) classes.push('is-dismissible');
        if (!opts.arrow) classes.push('no-arrow');
        if (this._open) classes.push('is-open');
        if (opts.className) classes.push(...String(opts.className).split(/\s+/).filter(Boolean));
        panel.className = classes.join(' ');
        panel.setAttribute('role', role);
        panel.dataset.animation = opts.animation ? 'on' : 'off';
        panel.style.setProperty('--dm-popover-duration', `${this._duration()}ms`);

        const setVar = (name, value) => {
            if (value === null || value === undefined || value === '') panel.style.removeProperty(name);
            else panel.style.setProperty(name, typeof value === 'number' ? `${value}px` : String(value));
        };
        setVar('--dm-popover-width', opts.width);
        setVar('--dm-popover-max-width', opts.maxWidth);
        if (opts.zIndex !== null && opts.zIndex !== undefined) panel.style.zIndex = String(opts.zIndex);
        else panel.style.removeProperty('z-index');

        this._parts.arrow.hidden = !opts.arrow;
        this._parts.close.hidden = !opts.dismissible;
    }

    _render() {
        this._renderTitle();
        this._renderBody();
    }

    _renderTitle() {
        const {title, header} = this._parts;
        const has = this._fill(title, this.options.title);
        header.hidden = !has;
        this._panel.classList.toggle('has-title', has);
        this._label();
    }

    _renderBody() {
        this._fill(this._parts.body, this.options.content);
        if (typeof window !== 'undefined' && window.Domma?.icons && isFn(window.Domma.icons.scan)) {
            window.Domma.icons.scan(this._panel);
        }
    }

    _label() {
        const panel = this._panel;
        const hasTitle = !this._parts.header.hidden;
        if (hasTitle) {
            panel.setAttribute('aria-labelledby', this._parts.title.id);
            panel.removeAttribute('aria-label');
        } else {
            panel.removeAttribute('aria-labelledby');
            if (this.options.ariaLabel) panel.setAttribute('aria-label', this.options.ariaLabel);
            else panel.removeAttribute('aria-label');
        }
    }

    /**
     * Put a content value into `el`. Returns whether anything was put there.
     * Text by default; nodes are appended as they are; strings become HTML
     * only with `html: true`, and then only after sanitising.
     */
    _fill(el, value) {
        el.textContent = '';
        let v = value;
        if (isFn(v)) v = v.call(this, this);
        if (v === null || v === undefined || v === false || v === '') return false;

        if (isNode(v)) {
            el.appendChild(v);
            return true;
        }
        // A Domma collection or an array of nodes.
        if (typeof v === 'object' && typeof v.length === 'number' && isNode(v[0])) {
            Array.from(v).forEach((node) => isNode(node) && el.appendChild(node));
            return true;
        }

        const str = String(v);
        if (this.options.html) el.innerHTML = sanitizeModule.sanitise(str);
        else el.textContent = str;
        return true;
    }

    _duration() {
        if (!this.options.animation || prefersReducedMotion()) return 0;
        return Math.max(0, Number(this.options.animationDuration) || 0);
    }

    // ============================================
    // Focus
    // ============================================

    /** First tabbable in the content; the panel itself when there is none. */
    _focusInside() {
        const panel = this._panel;
        if (!panel) return;
        const candidates = tabbablesIn(panel).filter((el) => !el.closest('.dm-popover-close'));
        const target = candidates[0] || panel;
        target.focus({preventScroll: true});
    }

    _onPanelKeyDown(e) {
        if (e.key !== 'Tab' || !this._open) return;
        const items = tabbablesIn(this._panel);
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;

        if (this.options.trapFocus) {
            if (!items.length) {
                e.preventDefault();
                return;
            }
            if (e.shiftKey && (active === first || active === this._panel)) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            }
            return;
        }

        // Non-modal: behave as though the panel sat right after the trigger.
        if (e.shiftKey && (!items.length || active === first || active === this._panel)) {
            e.preventDefault();
            this.element.focus();
            return;
        }
        if (!e.shiftKey && (!items.length || active === last)) {
            const next = this._nextTabbableAfterTrigger();
            e.preventDefault();
            this.hide({returnFocus: !next});
            if (next) next.focus();
        }
    }

    _nextTabbableAfterTrigger() {
        const trigger = this.element;
        const all = tabbablesIn(document.body).filter((el) =>
            !el.closest('.dm-popover') && !trigger.contains(el));
        return all.find((el) =>
            trigger.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) || null;
    }

    // ============================================
    // Open-state listeners
    // ============================================

    _bindOpen() {
        const list = this._openHandlers;
        const schedule = () => {
            if (this._frame) return;
            const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (fn) => setTimeout(fn, 16);
            this._frame = raf(() => {
                this._frame = null;
                this.update();
            });
        };
        const onScroll = () => schedule();
        window.addEventListener('scroll', onScroll, {capture: true, passive: true});
        list.push({el: window, event: 'scroll', handler: onScroll, capture: true});
        window.addEventListener('resize', schedule);
        list.push({el: window, event: 'resize', handler: schedule});

        if (typeof ResizeObserver !== 'undefined') {
            this._resizeObserver = new ResizeObserver(schedule);
            this._resizeObserver.observe(this._panel);
            this._resizeObserver.observe(this.element);
        }
    }

    _unbindOpen() {
        for (const {el, event, handler, capture} of this._openHandlers) {
            el.removeEventListener(event, handler, capture ? {capture: true} : undefined);
        }
        this._openHandlers = [];
        this._resizeObserver?.disconnect();
        this._resizeObserver = null;
        if (this._frame) {
            if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(this._frame);
            clearTimeout(this._frame);
            this._frame = null;
        }
    }

    // ============================================
    // Relationships
    // ============================================

    _contains(node) {
        if (!node || !isNode(node)) return false;
        if (this.element && this.element.contains(node)) return true;
        if (this._panel && this._panel.contains(node)) return true;
        return openStack.some((child) => child !== this && child._parent === this && child._contains(node));
    }

    _isAncestorOf(other) {
        let p = other._parent;
        while (p) {
            if (p === this) return true;
            p = p._parent;
        }
        return false;
    }

    // ============================================
    // Positioning
    // ============================================

    _position() {
        const panel = this._panel;
        const opts = this.options;
        const t = this.element.getBoundingClientRect();
        const {width: vw, height: vh} = viewport();

        // A trigger scrolled out of view takes its panel with it rather than
        // leaving it pinned to the edge of the screen.
        const outOfView = t.bottom < 0 || t.top > vh || t.right < 0 || t.left > vw;
        panel.classList.toggle('is-detached', outOfView);

        const pw = panel.offsetWidth;
        const ph = panel.offsetHeight;
        const [skid, gap] = parseOffset(opts.offset);
        let [side, align] = parsePlacement(opts.placement);

        const space = {
            top: t.top - VIEWPORT_MARGIN,
            bottom: vh - t.bottom - VIEWPORT_MARGIN,
            left: t.left - VIEWPORT_MARGIN,
            right: vw - t.right - VIEWPORT_MARGIN
        };
        const need = (s) => (s === 'top' || s === 'bottom' ? ph : pw) + gap;
        const fits = (s) => space[s] >= need(s);

        if (side === 'auto') {
            side = AUTO_ORDER.find(fits) || AUTO_ORDER.reduce((a, b) => (space[b] > space[a] ? b : a));
        } else if (opts.flip && !fits(side)) {
            const order = [OPPOSITE[side], ...PERPENDICULAR[side]];
            const found = order.find(fits);
            if (found) side = found;
            else if (space[OPPOSITE[side]] > space[side]) side = OPPOSITE[side];
        }

        let left;
        let top;
        const vertical = side === 'top' || side === 'bottom';
        if (vertical) {
            top = side === 'top' ? t.top - gap - ph : t.bottom + gap;
            if (align === 'start') left = t.left + skid;
            else if (align === 'end') left = t.right - pw - skid;
            else left = t.left + t.width / 2 - pw / 2 + skid;
        } else {
            left = side === 'left' ? t.left - gap - pw : t.right + gap;
            if (align === 'start') top = t.top + skid;
            else if (align === 'end') top = t.bottom - ph - skid;
            else top = t.top + t.height / 2 - ph / 2 + skid;
        }

        // Shift inside the viewport. A panel bigger than the viewport pins to
        // the margin; its body scrolls (see the stylesheet).
        const clamp = (value, size, limit) => (size + VIEWPORT_MARGIN * 2 > limit
            ? VIEWPORT_MARGIN
            : Math.min(Math.max(value, VIEWPORT_MARGIN), limit - size - VIEWPORT_MARGIN));
        left = clamp(left, pw, vw);
        top = clamp(top, ph, vh);

        panel.style.left = `${Math.round(left)}px`;
        panel.style.top = `${Math.round(top)}px`;
        panel.dataset.side = side;
        panel.dataset.placement = align === 'center' ? side : `${side}-${align}`;

        // The arrow points at the middle of the trigger, wherever the panel shifted to.
        const arrow = this._parts.arrow;
        if (opts.arrow) {
            if (vertical) {
                const x = t.left + t.width / 2 - left;
                arrow.style.left = `${Math.round(Math.min(Math.max(x, ARROW_PADDING), pw - ARROW_PADDING))}px`;
                arrow.style.top = '';
            } else {
                const y = t.top + t.height / 2 - top;
                arrow.style.top = `${Math.round(Math.min(Math.max(y, ARROW_PADDING), ph - ARROW_PADDING))}px`;
                arrow.style.left = '';
            }
        }
    }

    // ============================================
    // Events
    // ============================================

    /**
     * Run the callback, then dispatch `popover:<name>` on the trigger.
     * For a cancelable phase, returns false when either said no.
     */
    _emit(name, cancelable = false) {
        const cb = this.options[`on${name[0].toUpperCase()}${name.slice(1)}`];
        let ok = true;
        if (isFn(cb) && cb.call(this, this) === false && cancelable) ok = false;
        if (!this.element) return ok;
        const event = new CustomEvent(`popover:${name}`, {
            detail: {popover: this},
            bubbles: true,
            cancelable
        });
        const notPrevented = this.element.dispatchEvent(event);
        return ok && (notPrevented || !cancelable);
    }

    // ============================================
    // Statics
    // ============================================

    /**
     * Turn every `[data-popover]` (or `[data-popover-content]`) under `root`
     * into a popover. Safe to call again: a trigger that already has one is
     * skipped. Returns the instances created.
     *
     * @param {Element|Document|string} [root=document]
     * @param {Function} [factory] - (el, options) => instance; defaults to `new Popover`
     */
    static scan(root = document, factory = null) {
        const host = typeof root === 'string' ? document.querySelector(root) : (resolveElement(root) || root);
        if (!host || !isFn(host.querySelectorAll)) return [];

        const found = [];
        const selector = '[data-popover], [data-popover-content]';
        const nodes = Array.from(host.querySelectorAll(selector));
        if (isFn(host.matches) && host.matches(selector)) nodes.unshift(host);

        for (const el of nodes) {
            if (byTrigger.has(el)) continue;
            const options = Popover.optionsFromAttributes(el);
            found.push(factory ? factory(el, options) : new Popover(el, options));
        }
        return found;
    }

    /** Read the declarative options off a trigger's data-popover-* attributes. */
    static optionsFromAttributes(el) {
        const d = el.dataset || {};
        const options = {};
        const bool = (v) => v !== undefined && v !== 'false' && v !== '0';

        if (d.popover) options.content = d.popover;
        if (d.popoverContent) {
            // A <template> (or any element) elsewhere in the page supplies rich
            // content. It is cloned on every open, so the source stays put.
            const source = document.querySelector(d.popoverContent);
            if (source) {
                options.content = () => {
                    if (source.tagName === 'TEMPLATE') return source.content.cloneNode(true);
                    const copy = source.cloneNode(true);
                    copy.removeAttribute('id');
                    copy.removeAttribute('hidden');
                    return copy;
                };
            }
        }
        if (d.popoverTitle) options.title = d.popoverTitle;
        if (d.popoverTrigger) options.trigger = d.popoverTrigger;
        if (d.popoverPlacement) options.placement = d.popoverPlacement;
        if (d.popoverGroup !== undefined) options.group = d.popoverGroup === '' || d.popoverGroup === 'none' ? null : d.popoverGroup;
        if (d.popoverDismissible !== undefined) options.dismissible = bool(d.popoverDismissible);
        if (d.popoverArrow !== undefined) options.arrow = bool(d.popoverArrow);
        if (d.popoverWidth) options.width = d.popoverWidth;
        if (d.popoverMaxWidth) options.maxWidth = d.popoverMaxWidth;
        if (d.popoverClass) options.className = d.popoverClass;
        return options;
    }

    /** Close every open popover, or only those in `group`. */
    static closeAll(group) {
        for (const instance of openStack.slice().reverse()) {
            if (group === undefined || instance.options.group === group) instance.hide({returnFocus: false});
        }
    }

    /** The popover bound to a trigger, if any. */
    static getInstance(trigger) {
        const el = resolveElement(trigger);
        return el ? byTrigger.get(el) || null : null;
    }

    /** The open popovers, oldest first. */
    static openPopovers() {
        return openStack.slice();
    }
}

export default Popover;
