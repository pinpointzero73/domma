/**
 * Card - E.card(selector, options).
 *
 * Light DOM: the caller's element is the card (`.card`, styled by elements.css), its
 * children stay where they are. Options add a header (title/icon), body content
 * (sanitised like `$().html()`, `{safe: false}` for trusted markup), a hover style,
 * shadow and corners, and collapsing with the state kept in storage.
 *
 * Events: collapse, expand, click - as `onX`, `.on('x')` and `dm:card:x`.
 */

import Component from '../component.js';
import {storage} from '../storage.js';
import {fill, flag, num, resolveElement, scanIcons} from './shared.js';

const CHEVRON = 'M6 9l6 6 6-6';

function chevron() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    for (const [k, v] of Object.entries({
        width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true'
    })) svg.setAttribute(k, v);
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', CHEVRON);
    svg.appendChild(path);
    return svg;
}

export class Card extends Component {
    static componentName = 'card';

    static defaults = {
        hoverable: true,
        shadow: 'medium',           // 'none' | 'small' | 'medium' | 'large'
        rounded: true,
        animation: true,
        animationDuration: 200,
        collapsible: false,
        collapsed: false,
        persistKey: null,
        title: '',
        icon: '',
        content: '',
        safe: true,
        clickable: false,
        color: null,                // 'primary' → .card-primary
        onCollapse: null,
        onExpand: null,
        onClick: null
    };

    constructor(selector, options = {}) {
        super(resolveElement(selector), options);
        if (!this.element) return;
        if (options.hover !== undefined && options.hoverable === undefined) this.options.hoverable = options.hover;
        this._added = [];
        this._made = [];
        this._apply();
        this._bind();
        if (flag(this.options.collapsible)) this._restoreState();
    }

    _addClass(...names) {
        for (const n of names) {
            if (!this.element.classList.contains(n)) {
                this.element.classList.add(n);
                this._added.push(n);
            }
        }
    }

    _apply() {
        const el = this.element;
        const o = this.options;
        this._addClass('card');
        el.classList.toggle('card-hover', flag(o.hoverable, true));
        el.classList.toggle('card-clickable', flag(o.clickable) || typeof o.onClick === 'function');
        for (const s of ['none', 'sm', 'lg']) el.classList.remove(`card-shadow-${s}`);
        const shadow = {none: 'none', small: 'sm', sm: 'sm', large: 'lg', lg: 'lg'}[o.shadow];
        if (shadow) el.classList.add(`card-shadow-${shadow}`);
        el.classList.toggle('card-square', o.rounded === false || o.rounded === 'false');
        if (this._colorClass) el.classList.remove(this._colorClass);
        this._colorClass = o.color ? `card-${o.color}` : null;
        if (this._colorClass && !el.classList.contains(this._colorClass)) el.classList.add(this._colorClass);
        else if (this._colorClass) this._colorClass = null;
        el.classList.toggle('card-no-animation', o.animation === false || o.animation === 'false');
        el.style.setProperty('--dm-card-duration', `${num(o.animationDuration, 200)}ms`);

        if (o.title && !this._header()) {
            const header = document.createElement('div');
            header.className = 'card-header';
            const title = document.createElement('h4');
            title.className = 'card-title';
            if (o.icon) {
                const icon = document.createElement('span');
                icon.setAttribute('data-icon', o.icon);
                icon.className = 'card-title-icon';
                title.appendChild(icon);
            }
            title.appendChild(document.createTextNode(String(o.title)));
            header.appendChild(title);
            el.insertBefore(header, el.firstChild);
            this._made.push(header);
            scanIcons(header);
        }
        if (o.content) {
            this.setContent(o.content, {safe: o.safe});
        }

        const collapsible = flag(o.collapsible);
        el.classList.toggle('card-collapsible', collapsible);
        const header = this._header();
        if (collapsible && header) {
            if (!header.querySelector(':scope > .card-collapse-icon')) {
                const icon = document.createElement('span');
                icon.className = 'card-collapse-icon';
                icon.appendChild(chevron());
                header.appendChild(icon);
                this._made.push(icon);
            }
            if (!header.hasAttribute('tabindex')) {
                header.setAttribute('tabindex', '0');
                this._headerTabindex = true;
            }
            header.setAttribute('role', 'button');
            header.setAttribute('aria-expanded', String(!this.isCollapsed()));
        }
    }

    _header() {
        return this.element.querySelector(':scope > .card-header');
    }

    _body() {
        return this.element.querySelector(':scope > .card-body');
    }

    _bind() {
        this._addEventListener(this.element, 'click', (e) => {
            const header = this._header();
            if (flag(this.options.collapsible) && header && header.contains(e.target)
                && !e.target.closest('a, button, input, select, textarea, [data-no-collapse]')) {
                this.toggle();
                return;
            }
            this._fire('click', this, e);
        });
        this._addEventListener(this.element, 'keydown', (e) => {
            const header = this._header();
            if (!flag(this.options.collapsible) || e.target !== header) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    _storageKey() {
        return this.options.persistKey || (this.element.id ? `domma-card-${this.element.id}` : null);
    }

    _restoreState() {
        const key = this._storageKey();
        const saved = key ? storage.get(key) : null;
        if (saved?.collapsed || (!saved?.collapsed && flag(this.options.collapsed))) {
            this._setCollapsed(true, false, false);
        }
    }

    _saveState() {
        const key = this._storageKey();
        if (key) storage.set(key, {collapsed: this.isCollapsed()});
    }

    _setCollapsed(collapsed, save = true, animate = true) {
        const el = this.element;
        const body = this._body();
        const ms = el.classList.contains('card-no-animation') || !animate ? 0 : num(this.options.animationDuration, 200);
        clearTimeout(this._heightTimer);
        if (collapsed) {
            if (body && ms) {
                body.style.height = `${body.scrollHeight}px`;
                void body.offsetHeight;
            }
            el.classList.add('card-collapsed');
            if (body) body.style.height = '';
            this._fire('collapse', this);
        } else {
            el.classList.remove('card-collapsed');
            if (body && ms) {
                body.style.height = '0px';
                void body.offsetHeight;
                body.style.height = `${body.scrollHeight}px`;
                this._heightTimer = setTimeout(() => {
                    if (!el.classList.contains('card-collapsed')) body.style.height = '';
                }, ms);
            }
            this._fire('expand', this);
        }
        this._header()?.setAttribute('aria-expanded', String(!collapsed));
        if (save) this._saveState();
    }

    // ---- public API -----------------------------------------------------

    collapse() {
        if (!this.isCollapsed()) this._setCollapsed(true);
        return this;
    }

    expand() {
        if (this.isCollapsed()) this._setCollapsed(false);
        return this;
    }

    toggle() {
        this._setCollapsed(!this.isCollapsed());
        return this;
    }

    isCollapsed() {
        return this.element.classList.contains('card-collapsed');
    }

    setShadow(size) {
        this.options.shadow = size;
        this._apply();
        return this;
    }

    setHoverable(hoverable) {
        this.options.hoverable = hoverable;
        this.element.classList.toggle('card-hover', flag(hoverable, true));
        return this;
    }

    /**
     * Replace the body's content. A string is HTML, sanitised like `$().html()` unless
     * `{safe: false}`; a Node is appended.
     */
    setContent(content, opts = {}) {
        const body = this.getBody();
        fill(body, content, {safe: opts.safe ?? this.options.safe});
        scanIcons(body);
        return this;
    }

    /** The `.card-body`, made if the card has none. */
    getBody() {
        let body = this._body();
        if (!body) {
            body = document.createElement('div');
            body.className = 'card-body';
            const footer = this.element.querySelector(':scope > .card-footer');
            this.element.insertBefore(body, footer);
            this._made.push(body);
        }
        return body;
    }

    /** Re-measure an expanded collapsible body whose content changed. */
    updateHeight() {
        const body = this._body();
        if (body && !this.isCollapsed()) body.style.height = '';
        return this;
    }

    _applyOptions() {
        this._apply();
        if (!flag(this.options.collapsible)) this.element.classList.remove('card-collapsed');
    }

    destroy() {
        clearTimeout(this._heightTimer);
        const el = this.element;
        if (el) {
            el.classList.remove(...this._added, 'card-hover', 'card-clickable', 'card-collapsible', 'card-collapsed',
                'card-square', 'card-no-animation', 'card-shadow-none', 'card-shadow-sm', 'card-shadow-lg');
            el.style.removeProperty('--dm-card-duration');
            if (this._colorClass) el.classList.remove(this._colorClass);
            for (const node of this._made) {
                if (node.classList?.contains('card-collapse-icon') || node.classList?.contains('card-header')) node.remove();
            }
            const header = this._header();
            if (header) {
                if (this._headerTabindex) header.removeAttribute('tabindex');
                header.removeAttribute('role');
                header.removeAttribute('aria-expanded');
            }
        }
        super.destroy();
    }
}

export default Card;
