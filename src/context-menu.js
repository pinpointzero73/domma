/**
 * Domma ContextMenu Component
 *
 * A right-click menu bound to a container and, through delegation, to every
 * descendant it chooses to claim. Menus nest: binding one inside another does
 * not override the outer one, it shadows it for the region it covers and the
 * outer menu keeps everything else.
 *
 * The whole component shares ONE document-level `contextmenu` listener and a
 * registry of bound containers. That is deliberate. Every instance owning its
 * own document listener would make the winner depend on which script
 * registered first, so a menu could shadow its own parent or be shadowed by it
 * purely on bundle order - intermittently, and differently in dev and prod.
 * With a single listener the resolution is a walk from the event target
 * outward, and DOM depth decides. Load order cannot enter into it.
 *
 * Nothing here calls stopPropagation(). A menu that swallowed the event would
 * also silence unrelated contextmenu listeners - analytics, editors, the
 * host application - which is how the same bug arrives from the other side.
 */

import Component from './component.js';

// Every live instance, in registration order. Small by construction: one entry
// per bound container pattern, not per element.
const registry = new Set();

// Only one context menu is ever on screen. Unlike a dropdown, two open at once
// is never a legitimate state.
let active = null;

let docBound = false;

// Deduplication window for the touch path. Android fires a real `contextmenu`
// after a long press and iOS does not, so the long-press timer and the native
// event can both arrive for one gesture.
let lastOpenAt = 0;
const OPEN_DEDUPE_MS = 400;

const isFn = (v) => typeof v === 'function';

/** An observable is callable AND carries subscribe(); an items resolver is just callable. */
const isObservable = (v) => isFn(v) && isFn(v.subscribe);

function resolveValue(value, ...args) {
    if (isObservable(value)) return value();
    if (isFn(value)) return value(...args);
    return value;
}

// ============================================
// Resolution
// ============================================

/**
 * Walk outward from `target` collecting the registered containers that enclose
 * it, innermost first. An element carrying two menus is ordered by `priority`,
 * highest first; depth beats priority in every other case.
 */
function collectCandidates(target) {
    const found = [];
    let el = target instanceof Element ? target : null;

    while (el) {
        const here = [];
        for (const instance of registry) {
            if (instance._enabledFlag && instance.matchesContainer(el)) {
                here.push(instance);
            }
        }
        if (here.length > 1) here.sort((a, b) => b.options.priority - a.options.priority);
        for (const instance of here) found.push({instance, container: el});

        // Cross a shadow boundary if there is one, otherwise step up.
        el = el.parentElement
            || (el.parentNode && el.parentNode.host ? el.parentNode.host : null);
    }

    return found;
}

/**
 * The full chain for one gesture: every candidate that accepts, innermost
 * first. The first entry owns the menu; the rest only matter when it inherits.
 */
function resolveChain(target, event) {
    const candidates = collectCandidates(target);

    /*
     * An exclusive menu is offered the gesture BEFORE anything nested inside
     * it, so a menu it pre-empts never runs its own `onBeforeOpen`. Asking the
     * inner ones first and discarding them afterwards would reach the same
     * menu while firing callbacks for menus that were never going to open.
     */
    const exIdx = candidates.findIndex((c) => c.instance.options.exclusive);
    let start = 0;
    let exclusiveHit = null;

    if (exIdx > -1) {
        const c = candidates[exIdx];
        exclusiveHit = c.instance._accept(c.container, target, event);
        // It declines: it owns nothing here, so the inner menus get their turn.
        if (exclusiveHit) start = exIdx;
    }

    const chain = [];
    for (let i = start; i < candidates.length; i++) {
        if (i === exIdx && exclusiveHit) {
            chain.push(exclusiveHit);           // already evaluated, do not re-run
            continue;
        }
        const candidate = candidates[i];
        const accepted = candidate.instance._accept(candidate.container, target, event);
        if (accepted) chain.push(accepted);
    }
    return chain;
}

function openFromEvent(event, x, y) {
    const chain = resolveChain(event.target, event);
    if (!chain.length) return false;

    const primary = chain[0];
    const items = primary.instance._assembleItems(chain, event);
    if (!items.length && !primary.instance.options.render) return false;

    event.preventDefault();
    lastOpenAt = Date.now();
    primary.instance._openResolved(x, y, primary, items, event, false, chain);
    return true;
}

// ============================================
// Document listeners
// ============================================

let onDocContextMenu = null;
let onDocKeyDown = null;
let onTouchStart = null;
let onTouchMove = null;
let onTouchEnd = null;
let longPressTimer = null;
let longPressOrigin = null;

function bindDocListeners() {
    if (docBound || typeof document === 'undefined') return;
    docBound = true;

    onDocContextMenu = (e) => {
        // Shift is the escape hatch back to the browser's own menu. Suppressing
        // it unconditionally takes away "open in new tab" and spellcheck, which
        // people notice and resent far more than they enjoy a custom menu.
        if (e.shiftKey && anyRegisteredAllowsNative(e.target)) return;
        if (active) active.close();
        openFromEvent(e, e.clientX, e.clientY);
    };
    document.addEventListener('contextmenu', onDocContextMenu);

    // Right-click has no keyboard equivalent, so without this the entire
    // feature is unreachable without a pointer.
    onDocKeyDown = (e) => {
        const isMenuKey = e.key === 'ContextMenu';
        const isShiftF10 = e.key === 'F10' && e.shiftKey;
        if (!isMenuKey && !isShiftF10) return;
        if (active) return;

        const target = document.activeElement;
        if (!target || target === document.body) return;

        const chain = resolveChain(target, e);
        if (!chain.length) return;
        const primary = chain[0];
        if (!primary.instance.options.keyboardTrigger) return;

        const items = primary.instance._assembleItems(chain, e);
        if (!items.length && !primary.instance.options.render) return;

        e.preventDefault();
        const rect = target.getBoundingClientRect();
        lastOpenAt = Date.now();
        primary.instance._openResolved(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            primary, items, e, true, chain
        );
    };
    document.addEventListener('keydown', onDocKeyDown);

    // Touch long-press. Chiefly for iOS, which answers a long press with the
    // native callout and never sends `contextmenu`.
    onTouchStart = (e) => {
        if (active) return;
        if (!e.touches || e.touches.length !== 1) return;
        const touch = e.touches[0];
        const chain = resolveChain(e.target, e);
        if (!chain.length) return;
        const primary = chain[0];
        const delay = primary.instance.options.longPress;
        if (!delay) return;

        longPressOrigin = {x: touch.clientX, y: touch.clientY, target: e.target};
        longPressTimer = setTimeout(() => {
            longPressTimer = null;
            if (Date.now() - lastOpenAt < OPEN_DEDUPE_MS) return;
            const items = primary.instance._assembleItems(chain, e);
            if (!items.length && !primary.instance.options.render) return;
            lastOpenAt = Date.now();
            primary.instance._openResolved(
                longPressOrigin.x, longPressOrigin.y, primary, items, e, false, chain
            );
        }, delay);
    };

    onTouchMove = (e) => {
        if (!longPressTimer || !longPressOrigin || !e.touches || !e.touches.length) return;
        const touch = e.touches[0];
        const tolerance = 10;
        if (Math.abs(touch.clientX - longPressOrigin.x) > tolerance
            || Math.abs(touch.clientY - longPressOrigin.y) > tolerance) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    };

    onTouchEnd = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    };

    document.addEventListener('touchstart', onTouchStart, {passive: true});
    document.addEventListener('touchmove', onTouchMove, {passive: true});
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('touchcancel', onTouchEnd);
}

function anyRegisteredAllowsNative(target) {
    for (const candidate of collectCandidates(target)) {
        if (candidate.instance.options.nativeOnShift) return true;
    }
    return false;
}

function unbindDocListeners() {
    if (!docBound || registry.size) return;
    docBound = false;
    document.removeEventListener('contextmenu', onDocContextMenu);
    document.removeEventListener('keydown', onDocKeyDown);
    document.removeEventListener('touchstart', onTouchStart);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
    document.removeEventListener('touchcancel', onTouchEnd);
    onDocContextMenu = onDocKeyDown = onTouchStart = onTouchMove = onTouchEnd = null;
}

// ============================================
// ContextMenu Component
// ============================================

class ContextMenu extends Component {
    static defaults = {
        // Targeting and cascade
        items: [],
        match: null,
        exclude: null,
        enabled: true,
        inherit: 'append',      // 'append' | 'prepend' | false
        priority: 0,

        /*
         * A menu that owns its region outright: once it encloses the click and
         * accepts it, nothing bound DEEPER is offered the gesture.
         *
         * This inverts the usual depth rule on purpose, for a component that
         * must not be shadowed by application menus - a data grid with its own
         * filter panel, an editor, a canvas. The alternative is a guard on
         * every menu that might collide with it, which protects nothing the
         * first time a registration path forgets one. Declared here, the
         * protection travels with the thing being protected.
         *
         * It is not a veto: an exclusive menu that DECLINES (`enabled` false,
         * `exclude`, a `match` miss) steps aside completely and the inner menus
         * are offered the gesture as normal.
         */
        exclusive: false,

        // Behaviour
        nativeOnShift: true,
        closeOnSelect: true,
        closeOnEscape: true,
        closeOnClickOutside: true,
        closeOnScroll: true,
        longPress: 500,

        // Presentation
        className: '',
        minWidth: '200px',
        maxWidth: '320px',
        maxHeight: '60vh',
        offset: [2, 2],
        flip: true,
        animation: true,
        animationDuration: 120,
        itemTemplate: null,
        submenuDelay: 150,

        /*
         * Escape hatch for a panel this component cannot express as items - a
         * live attribute editor, a filter builder, anything with its own
         * inputs. The cascade still arbitrates: `enabled`, `exclude`, `match`
         * and `onBeforeOpen` decide whether this menu claims the gesture, and
         * only then is `render` called. Return an element for Domma to
         * position and dismiss, or nothing to manage it entirely yourself.
         *
         * A rendered panel is opaque, so ancestor items are not merged into it.
         */
        render: null,

        // Accessibility
        keyboardTrigger: true,
        typeahead: true,
        ariaLabel: 'Context menu',

        // Reactive
        model: null,
        modelKey: null,

        // Callbacks
        onBeforeOpen: null,
        onOpen: null,
        onClose: null,
        onSelect: null
    };

    constructor(selector, options = {}) {
        super(selector, options);

        // Component resolves a selector to its FIRST match. A context menu has
        // to cover every match, including elements that do not exist yet - the
        // CMS renders collections long after the menu is declared - so the
        // selector is kept and matched live against the event target's
        // ancestors rather than snapshotted into an element list.
        this.selector = typeof selector === 'string' ? selector : null;
        this._node = this.selector ? null : this.element;

        this._menu = null;
        this._submenus = [];
        this._isOpen = false;
        this._enabledFlag = true;
        this._focusIndex = -1;
        this._renderedItems = [];
        this._ctx = null;
        this._typeaheadBuffer = '';
        this._typeaheadTimer = null;
        this._submenuTimer = null;
        this._observableDispose = null;
        this._restoreFocusTo = null;
        this._chain = null;

        registry.add(this);
        bindDocListeners();
        this._applyTouchCallout();
    }

    /**
     * iOS answers a long press with its own text-callout, which arrives before
     * any timer and cannot be cancelled once shown.
     */
    _applyTouchCallout() {
        if (!this.options.longPress || !this.selector || typeof document === 'undefined') return;
        document.querySelectorAll(this.selector).forEach((el) => {
            el.style.webkitTouchCallout = 'none';
        });
    }

    matchesContainer(el) {
        if (this.selector) {
            return isFn(el.matches) && el.matches(this.selector);
        }
        return el === this._node;
    }

    // ---- resolution -----------------------------------------------------

    /**
     * Decide whether this instance takes the gesture for `container`. Returning
     * null is not a dead click: the caller carries on walking outward, so the
     * next menu up gets its chance.
     */
    _accept(container, target, event) {
        const opts = this.options;

        if (opts.exclude && target.closest(opts.exclude)
            && container.contains(target.closest(opts.exclude))) {
            return null;
        }

        let resolvedTarget = container;
        if (opts.match) {
            const matched = target.closest(opts.match);
            if (!matched || !container.contains(matched)) return null;
            resolvedTarget = matched;
        }

        const ctx = {
            target: resolvedTarget,
            container,
            x: event && event.clientX !== undefined ? event.clientX : 0,
            y: event && event.clientY !== undefined ? event.clientY : 0,
            event,
            menu: null,
            instance: this
        };

        if (!resolveValue(opts.enabled, resolvedTarget, ctx)) return null;
        if (opts.onBeforeOpen && opts.onBeforeOpen(ctx) === false) return null;

        return {instance: this, container, target: resolvedTarget, ctx};
    }

    _ownItems(hit) {
        const opts = this.options;
        let items;

        if (opts.model && opts.modelKey && isFn(opts.model.get)) {
            items = opts.model.get(opts.modelKey);
        } else {
            items = resolveValue(opts.items, hit.target, hit.ctx);
        }

        return Array.isArray(items) ? items : [];
    }

    /**
     * The primary menu's items, plus - when it inherits - the items of every
     * ancestor menu that also accepted, each behind a divider. Inheritance is
     * the primary's decision: an inner menu that wants to stand alone sets
     * `inherit: false` and the outer items stay out.
     */
    _assembleItems(chain, event) {
        const primary = chain[0];
        const own = this._ownItems(primary);
        const mode = this.options.inherit;

        if (!mode || chain.length < 2) return this._filterItems(own, primary);

        let inherited = [];
        for (let i = 1; i < chain.length; i++) {
            const hit = chain[i];
            const items = hit.instance._filterItems(hit.instance._ownItems(hit), hit);
            if (!items.length) continue;
            if (inherited.length) inherited.push({type: 'divider'});
            inherited = inherited.concat(items);
        }

        const mine = this._filterItems(own, primary);
        if (!inherited.length) return mine;
        if (!mine.length) return inherited;

        return mode === 'prepend'
            ? inherited.concat([{type: 'divider'}], mine)
            : mine.concat([{type: 'divider'}], inherited);
    }

    /** Drop invisible items and collapse the dividers that stranded. */
    _filterItems(items, hit) {
        const visible = items.filter((item) => {
            if (!item) return false;
            if (item.visible === undefined) return true;
            return !!resolveValue(item.visible, hit.target, hit.ctx);
        });

        const out = [];
        for (const item of visible) {
            const isDivider = item.type === 'divider' || item.divider;
            if (isDivider && (!out.length || out[out.length - 1]._isDivider)) continue;
            out.push(isDivider ? {type: 'divider', _isDivider: true} : item);
        }
        while (out.length && out[out.length - 1]._isDivider) out.pop();
        return out;
    }

    // ---- open / close ---------------------------------------------------

    /**
     * Programmatic open. Resolves the chain itself so a menu opened from a
     * "..." button behaves exactly like the right-click on the same row.
     */
    open(x, y, target) {
        const el = target || (this.selector ? document.querySelector(this.selector) : this._node);
        if (!el) return this;
        const chain = resolveChain(el, {clientX: x, clientY: y, target: el});
        const primary = chain.find((hit) => hit.instance === this) || chain[0];
        if (!primary) return this;
        const ordered = [primary, ...chain.filter((h) => h !== primary)];
        const items = primary.instance._assembleItems(ordered, null);
        if (!items.length && !primary.instance.options.render) return this;
        if (active) active.close();
        primary.instance._openResolved(x, y, primary, items, null, false, ordered);
        return this;
    }

    _openResolved(x, y, hit, items, event, fromKeyboard = false, chain = null) {
        if (active && active !== this) active.close();
        if (this._isOpen) this.close();

        const opts = this.options;
        this._chain = chain || [hit];
        this._ctx = hit.ctx;
        this._ctx.x = x;
        this._ctx.y = y;
        this._renderedItems = items;
        this._restoreFocusTo = fromKeyboard ? document.activeElement : null;

        if (opts.render) {
            const panel = opts.render(this._ctx);
            if (!panel) {
                // The caller owns the panel outright, including its dismissal.
                // The gesture is still claimed, which is the point: it went
                // through the same arbitration as every other menu.
                this._chain = null;
                this._ctx = null;
                return;
            }
            this._menu = panel;
            if (!panel.parentNode) document.body.appendChild(panel);
            panel.style.position = 'fixed';
            this._ctx.menu = panel;
            this._positionAt(panel, x, y);
            this._bindOpenListeners();
            this._isOpen = true;
            active = this;
            if (opts.onOpen) opts.onOpen(this._ctx);
            return;
        }

        this._menu = this._createMenu();
        this._renderInto(this._menu, items, hit);
        document.body.appendChild(this._menu);
        this._ctx.menu = this._menu;

        this._positionAt(this._menu, x, y);
        this._bindOpenListeners();

        this._isOpen = true;
        active = this;

        if (isObservable(opts.items)) {
            this._observableDispose = opts.items.subscribe(() => {
                if (this._isOpen) this.refresh();
            });
        }

        if (opts.animation) {
            this._menu.style.transition = `opacity ${opts.animationDuration}ms ease, transform ${opts.animationDuration}ms ease`;
            requestAnimationFrame(() => {
                if (!this._menu) return;
                this._menu.style.opacity = '1';
                this._menu.style.transform = 'scale(1)';
            });
        } else {
            this._menu.style.opacity = '1';
            this._menu.style.transform = 'scale(1)';
        }

        this._menu.focus({preventScroll: true});
        if (fromKeyboard) this._moveFocus(1);

        if (opts.onOpen) opts.onOpen(this._ctx);
    }

    close() {
        if (!this._isOpen) return this;

        this._closeSubmenus(0);
        this._unbindOpenListeners();

        if (this._observableDispose) {
            if (isFn(this._observableDispose)) this._observableDispose();
            else if (isFn(this._observableDispose.dispose)) this._observableDispose.dispose();
            this._observableDispose = null;
        }

        const menu = this._menu;
        const opts = this.options;
        this._menu = null;
        this._isOpen = false;
        this._focusIndex = -1;
        if (active === this) active = null;

        if (menu) {
            if (opts.animation) {
                menu.style.opacity = '0';
                menu.style.transform = 'scale(0.97)';
                setTimeout(() => menu.remove(), opts.animationDuration);
            } else {
                menu.remove();
            }
        }

        if (this._restoreFocusTo && isFn(this._restoreFocusTo.focus)) {
            this._restoreFocusTo.focus({preventScroll: true});
        }
        this._restoreFocusTo = null;

        if (opts.onClose) opts.onClose(this._ctx);
        this._ctx = null;
        return this;
    }

    /** Rebuild the open menu in place, keeping its position. */
    refresh() {
        if (!this._isOpen || !this._ctx) return this;
        const hit = this._chain && this._chain.length
            ? this._chain[0]
            : {instance: this, container: this._ctx.container, target: this._ctx.target, ctx: this._ctx};
        const items = this._assembleItems(this._chain && this._chain.length ? this._chain : [hit], null);
        this._renderedItems = items;
        this._closeSubmenus(0);
        this._renderInto(this._menu, items, hit);
        this._positionAt(this._menu, this._ctx.x, this._ctx.y);
        return this;
    }

    isOpen() {
        return this._isOpen;
    }

    setItems(items) {
        this.options.items = items;
        if (this._isOpen) this.refresh();
        return this;
    }

    enable() {
        this._enabledFlag = true;
        return this;
    }

    disable() {
        if (this._isOpen) this.close();
        this._enabledFlag = false;
        return this;
    }

    // ---- rendering ------------------------------------------------------

    _createMenu(isSub = false) {
        const opts = this.options;
        const menu = document.createElement('div');
        menu.className = 'dm-context-menu' + (isSub ? ' dm-context-menu-sub' : '')
            + (opts.className ? ' ' + opts.className : '');
        menu.setAttribute('role', 'menu');
        menu.setAttribute('tabindex', '-1');
        if (!isSub) menu.setAttribute('aria-label', opts.ariaLabel);
        menu.style.minWidth = opts.minWidth;
        menu.style.maxWidth = opts.maxWidth;
        menu.style.maxHeight = opts.maxHeight;
        menu.style.opacity = '0';
        menu.style.transform = 'scale(0.97)';
        return menu;
    }

    _renderInto(menu, items, hit) {
        if (!menu) return;
        menu.innerHTML = '';
        const opts = this.options;

        items.forEach((item, index) => {
            if (item.type === 'divider' || item.divider) {
                const sep = document.createElement('div');
                sep.className = 'dm-context-menu-divider';
                sep.setAttribute('role', 'separator');
                menu.appendChild(sep);
                return;
            }

            if (item.type === 'header' || item.header) {
                const header = document.createElement('div');
                header.className = 'dm-context-menu-header';
                header.setAttribute('role', 'presentation');
                header.textContent = item.header || item.label || '';
                menu.appendChild(header);
                return;
            }

            const disabled = !!resolveValue(item.disabled, hit.target, hit.ctx);
            const el = document.createElement('button');
            el.type = 'button';
            el.className = 'dm-context-menu-item';
            el.setAttribute('role', item.type === 'checkbox' ? 'menuitemcheckbox'
                : item.type === 'radio' ? 'menuitemradio' : 'menuitem');
            el.setAttribute('tabindex', '-1');
            el.dataset.index = String(index);
            if (item.danger) el.classList.add('is-danger');
            if (disabled) {
                el.classList.add('is-disabled');
                el.setAttribute('aria-disabled', 'true');
                el.disabled = true;
            }

            if (item.type === 'checkbox' || item.type === 'radio') {
                const checked = !!resolveValue(item.checked, hit.target, hit.ctx);
                el.setAttribute('aria-checked', String(checked));
                if (checked) el.classList.add('is-checked');
            }

            if (opts.itemTemplate) {
                el.innerHTML = opts.itemTemplate(item, index);
            } else {
                const icon = document.createElement('span');
                icon.className = 'dm-context-menu-icon';
                if (item.icon) {
                    icon.setAttribute('data-icon', item.icon);
                    icon.setAttribute('data-size', '16');
                }
                el.appendChild(icon);

                const label = document.createElement('span');
                label.className = 'dm-context-menu-label';
                label.textContent = item.label || item.text || item.name || '';
                el.appendChild(label);

                if (item.shortcut) {
                    const shortcut = document.createElement('span');
                    shortcut.className = 'dm-context-menu-shortcut';
                    shortcut.textContent = item.shortcut;
                    el.appendChild(shortcut);
                }
            }

            const submenu = item.submenu;
            if (submenu) {
                el.classList.add('has-submenu');
                el.setAttribute('aria-haspopup', 'true');
                el.setAttribute('aria-expanded', 'false');
                const chevron = document.createElement('span');
                chevron.className = 'dm-context-menu-chevron';
                chevron.setAttribute('data-icon', 'chevron-right');
                chevron.setAttribute('data-size', '14');
                el.appendChild(chevron);
            }

            if (!disabled) {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (submenu) {
                        this._openSubmenu(el, item, hit, this._depthOf(menu));
                    } else {
                        this._activate(item, index);
                    }
                });
                el.addEventListener('mouseenter', () => {
                    this._closeSubmenus(this._depthOf(menu) + 1);
                    clearTimeout(this._submenuTimer);
                    if (submenu) {
                        this._submenuTimer = setTimeout(
                            () => this._openSubmenu(el, item, hit, this._depthOf(menu)),
                            opts.submenuDelay
                        );
                    }
                });
            }

            menu.appendChild(el);
        });

        if (typeof window !== 'undefined' && window.Domma && window.Domma.icons
            && isFn(window.Domma.icons.scan)) {
            window.Domma.icons.scan(menu);
        }
    }

    _depthOf(menu) {
        const idx = this._submenus.indexOf(menu);
        return idx === -1 ? 0 : idx + 1;
    }

    _openSubmenu(itemEl, item, hit, depth) {
        this._closeSubmenus(depth + 1);

        const items = this._filterItems(
            (resolveValue(item.submenu, hit.target, hit.ctx) || []), hit
        );
        if (!items.length) return;

        const sub = this._createMenu(true);
        this._renderInto(sub, items, hit);
        document.body.appendChild(sub);
        this._submenus[depth] = sub;

        const rect = itemEl.getBoundingClientRect();
        this._positionAt(sub, rect.right, rect.top, rect);

        itemEl.setAttribute('aria-expanded', 'true');
        itemEl.classList.add('is-open');
        sub.dataset.owner = itemEl.dataset.index;

        requestAnimationFrame(() => {
            sub.style.opacity = '1';
            sub.style.transform = 'scale(1)';
        });
    }

    _closeSubmenus(fromDepth) {
        for (let i = this._submenus.length - 1; i >= fromDepth; i--) {
            const sub = this._submenus[i];
            if (!sub) continue;
            const owner = this._menu && sub.dataset.owner !== undefined
                ? this._menu.querySelector(`[data-index="${sub.dataset.owner}"]`)
                : null;
            if (owner) {
                owner.setAttribute('aria-expanded', 'false');
                owner.classList.remove('is-open');
            }
            sub.remove();
            this._submenus.splice(i, 1);
        }
    }

    _activate(item, index) {
        const ctx = this._ctx;
        const opts = this.options;

        if (opts.onSelect) opts.onSelect(item, ctx);
        if (isFn(item.action)) item.action(ctx ? ctx.target : null, ctx);

        if (opts.closeOnSelect) this.close();
    }

    // ---- positioning ----------------------------------------------------

    /**
     * Anchored to a point, not to a rect. `position: fixed`, so there is no
     * scroll offset to fold in - and the menu closes on scroll anyway.
     *
     * A menu that will not fit below-right of the cursor flips to the other
     * side OF THE CURSOR rather than to the other side of an element, which is
     * the part that differs from Dropdown._positionMenu().
     */
    _positionAt(menu, x, y, anchorRect = null) {
        const opts = this.options;
        const [offsetX, offsetY] = opts.offset;
        const width = menu.offsetWidth;
        const height = menu.offsetHeight;
        const viewW = document.documentElement.clientWidth;
        const viewH = document.documentElement.clientHeight;
        const margin = 8;

        let left = x + offsetX;
        let top = y + offsetY;

        if (opts.flip) {
            if (left + width > viewW - margin) {
                // A submenu flips across its parent item, a root menu across the cursor.
                const flipped = anchorRect ? anchorRect.left - width : x - width - offsetX;
                if (flipped >= margin) left = flipped;
            }
            if (top + height > viewH - margin) {
                const flipped = anchorRect ? y - height + anchorRect.height : y - height - offsetY;
                if (flipped >= margin) top = flipped;
            }
        }

        if (width <= viewW - margin * 2) {
            left = Math.max(margin, Math.min(left, viewW - width - margin));
        } else {
            left = margin;
        }
        if (height <= viewH - margin * 2) {
            top = Math.max(margin, Math.min(top, viewH - height - margin));
        } else {
            top = margin;
        }

        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
    }

    // ---- listeners while open -------------------------------------------

    _bindOpenListeners() {
        const opts = this.options;

        this._outsideHandler = (e) => {
            if (!this._isOpen) return;
            if (this._menu && this._menu.contains(e.target)) return;
            if (this._submenus.some((sub) => sub && sub.contains(e.target))) return;
            this.close();
        };
        if (opts.closeOnClickOutside) {
            document.addEventListener('mousedown', this._outsideHandler, true);
        }

        // A second right-click elsewhere must relocate the menu, not leave the
        // old one behind: the document handler opens the new one, so this only
        // has to retire the old.
        this._contextHandler = (e) => {
            if (this._menu && this._menu.contains(e.target)) e.preventDefault();
        };
        document.addEventListener('contextmenu', this._contextHandler);

        this._keyHandler = (e) => this._onKeyDown(e);
        document.addEventListener('keydown', this._keyHandler, true);

        // Unlike a dropdown, a context menu does not chase its anchor on
        // scroll: the point it was opened against has moved and no longer
        // means anything, so it closes.
        if (opts.closeOnScroll) {
            this._scrollHandler = () => this.close();
            window.addEventListener('scroll', this._scrollHandler, true);
        }

        this._resizeHandler = () => this.close();
        window.addEventListener('resize', this._resizeHandler);
    }

    _unbindOpenListeners() {
        if (this._outsideHandler) {
            document.removeEventListener('mousedown', this._outsideHandler, true);
            this._outsideHandler = null;
        }
        if (this._contextHandler) {
            document.removeEventListener('contextmenu', this._contextHandler);
            this._contextHandler = null;
        }
        if (this._keyHandler) {
            document.removeEventListener('keydown', this._keyHandler, true);
            this._keyHandler = null;
        }
        if (this._scrollHandler) {
            window.removeEventListener('scroll', this._scrollHandler, true);
            this._scrollHandler = null;
        }
        if (this._resizeHandler) {
            window.removeEventListener('resize', this._resizeHandler);
            this._resizeHandler = null;
        }
        clearTimeout(this._submenuTimer);
        clearTimeout(this._typeaheadTimer);
    }

    _focusableItems() {
        const menu = this._submenus.length
            ? this._submenus[this._submenus.length - 1]
            : this._menu;
        if (!menu) return [];
        return Array.from(menu.querySelectorAll('.dm-context-menu-item:not(.is-disabled)'));
    }

    _moveFocus(delta) {
        const items = this._focusableItems();
        if (!items.length) return;
        const current = items.indexOf(document.activeElement);
        let next = current + delta;
        if (next < 0) next = items.length - 1;
        if (next >= items.length) next = 0;
        items[next].focus({preventScroll: true});
    }

    _onKeyDown(e) {
        if (!this._isOpen) return;
        const opts = this.options;

        switch (e.key) {
            case 'Escape':
                if (!opts.closeOnEscape) return;
                e.preventDefault();
                e.stopPropagation();
                if (this._submenus.length) this._closeSubmenus(this._submenus.length - 1);
                else this.close();
                return;

            case 'ArrowDown':
                e.preventDefault();
                this._moveFocus(1);
                return;

            case 'ArrowUp':
                e.preventDefault();
                this._moveFocus(-1);
                return;

            case 'Home': {
                e.preventDefault();
                const first = this._focusableItems()[0];
                if (first) first.focus({preventScroll: true});
                return;
            }

            case 'End': {
                e.preventDefault();
                const all = this._focusableItems();
                if (all.length) all[all.length - 1].focus({preventScroll: true});
                return;
            }

            case 'ArrowRight': {
                const el = document.activeElement;
                if (el && el.classList.contains('has-submenu')) {
                    e.preventDefault();
                    el.click();
                    requestAnimationFrame(() => this._moveFocus(1));
                }
                return;
            }

            case 'ArrowLeft':
                if (this._submenus.length) {
                    e.preventDefault();
                    this._closeSubmenus(this._submenus.length - 1);
                    const items = this._focusableItems();
                    if (items.length) items[0].focus({preventScroll: true});
                }
                return;

            case 'Enter':
            case ' ': {
                const el = document.activeElement;
                if (el && el.classList.contains('dm-context-menu-item')) {
                    e.preventDefault();
                    el.click();
                }
                return;
            }

            default:
                break;
        }

        if (opts.typeahead && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            this._typeahead(e.key);
        }
    }

    _typeahead(char) {
        clearTimeout(this._typeaheadTimer);
        this._typeaheadBuffer += char.toLowerCase();
        this._typeaheadTimer = setTimeout(() => {
            this._typeaheadBuffer = '';
        }, 600);

        const items = this._focusableItems();
        const match = items.find((el) => {
            const label = el.querySelector('.dm-context-menu-label');
            return label && label.textContent.toLowerCase().startsWith(this._typeaheadBuffer);
        });
        if (match) match.focus({preventScroll: true});
    }

    // ---- teardown -------------------------------------------------------

    destroy() {
        this.close();
        registry.delete(this);
        unbindDocListeners();
        super.destroy();
    }
}

// ============================================
// Statics
// ============================================

ContextMenu.closeAll = function closeAll() {
    if (active) active.close();
};

ContextMenu.active = function activeMenu() {
    return active;
};

/** Bound containers, innermost-first for a given element, else registration order. */
ContextMenu.registry = function registryList(forElement = null) {
    if (forElement) return collectCandidates(forElement).map((c) => c.instance);
    return Array.from(registry);
};

export default ContextMenu;
export {registry as _registry, collectCandidates as _collectCandidates};
