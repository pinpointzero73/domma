/**
 * Toast - E.toast(message, options), E.toast.success/error/warning/info/show/closeAll.
 *
 * Light DOM: a `.domma-toast` in a `.domma-toast-container` per position, styled by
 * elements.css so the page's theme reaches it. The message is text; `html: true` makes
 * it HTML, sanitised unless `safe: false`.
 *
 * Events: show, close (after the exit animation, just before removal), pause, resume,
 * action - as `onX`, `.on('x')` and `dm:toast:x`.
 */

import Component from '../component.js';
import {fill, flag, num, scanIcons} from './shared.js';

const ICONS = {
    success: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
    error: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
    warning: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
    info: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
};

/** The built-in type icon as an SVG node (trusted constant markup, built with the DOM). */
function typeIcon(type) {
    const d = ICONS[type];
    if (!d || typeof document === 'undefined') return null;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('clip-rule', 'evenodd');
    path.setAttribute('d', d);
    svg.appendChild(path);
    return svg;
}

const containers = {};
let live = [];

function containerFor(position) {
    let box = containers[position];
    if (!box || !box.isConnected) {
        box = document.createElement('div');
        box.className = `domma-toast-container domma-toast-${position}`;
        box.setAttribute('aria-live', 'polite');
        box.setAttribute('aria-atomic', 'true');
        // A focus trap (a modal, a slideover) lets focus into a toast's buttons.
        box.setAttribute('data-focus-trap-allow', '');
        document.body.appendChild(box);
        containers[position] = box;
    }
    return box;
}

/**
 * An action button in a toast.
 * @typedef {object} ToastAction
 * @property {string} [label='OK'] - Button label (`text` is accepted too)
 * @property {string} [text] - Alias of `label`
 * @property {(event: MouseEvent, toast: ToastInstance) => void} [onClick] - Click handler
 * @property {boolean} [closeOnClick=true] - Close toast on click
 * @property {boolean} [primary] - Primary style
 */

/**
 * @typedef {object} ToastOptions
 * @property {string|Node} [message] - The message (text unless `html: true`)
 * @property {string} [title] - Toast title
 * @property {import('../elements.js').ToastType} [type='default'] - Toast type
 * @property {import('../elements.js').ToastPosition} [position='top-right'] - Toast position
 * @property {number} [duration=3000] - Auto-dismiss duration in ms (0 = no auto-dismiss)
 * @property {boolean} [pauseOnHover=true] - Pause countdown on hover
 * @property {boolean} [showProgress=true] - Show progress bar
 * @property {'slide'|'fade'|(string & {})} [animation='slide'] - Animation style
 * @property {number} [animationDuration=300] - Animation duration in ms
 * @property {boolean} [closable=true] - Show close button
 * @property {boolean} [html=false] - The message is HTML (sanitised unless `safe: false`)
 * @property {boolean} [safe=true] - Sanitise HTML message / icon
 * @property {string|Node|null} [icon] - Icon name (data-icon), HTML string or Node; the typed helpers default to the type's icon
 * @property {ToastAction[]} [actions] - Action buttons
 * @property {ToastAction} [action] - One action button (used when `actions` is empty)
 * @property {number} [maxToasts=5] - Maximum number of toasts on screen; the oldest closes
 * @property {string} [className] - Extra classes on the toast
 * @property {((toast: ToastInstance) => void)|null} [onShow] - When the toast shows
 * @property {((toast: ToastInstance) => void)|null} [onClose] - After the exit animation, just before removal
 * @property {((toast: ToastInstance) => void)|null} [onPause] - The countdown paused (hover)
 * @property {((toast: ToastInstance) => void)|null} [onResume] - The countdown resumed
 * @property {((detail: {action: ToastAction, index: number}, toast: ToastInstance) => void)|null} [onAction] - An action button was clicked
 */

/** @typedef {Toast} ToastInstance */

/**
 * E.toast: show a toast, with typed helpers.
 * @typedef {((message: string|Node|ToastOptions, options?: ToastOptions) => ToastInstance) & {
 *     show(message: string|Node|ToastOptions, options?: ToastOptions): ToastInstance,
 *     success(message: string|Node, options?: ToastOptions): ToastInstance,
 *     error(message: string|Node, options?: ToastOptions): ToastInstance,
 *     warning(message: string|Node, options?: ToastOptions): ToastInstance,
 *     info(message: string|Node, options?: ToastOptions): ToastInstance,
 *     closeAll(): void
 * }} ToastStatic
 */

export class Toast extends Component {
    static componentName = 'toast';

    static defaults = {
        message: '',
        title: '',
        type: 'default',            // 'default' | 'success' | 'error' | 'warning' | 'info'
        position: 'top-right',      // top-/bottom- left|right|center
        duration: 3000,             // ms; 0 stays until closed
        pauseOnHover: true,
        showProgress: true,
        animation: 'slide',
        animationDuration: 300,
        closable: true,
        html: false,
        safe: true,
        icon: '',                   // name (data-icon), HTML string (sanitised unless safe: false) or Node
        actions: [],                // [{label, primary, closeOnClick, onClick}]
        maxToasts: 5,
        className: '',
        onShow: null,
        onClose: null,
        onPause: null,
        onResume: null,
        onAction: null
    };

    /**
     * @param {string|Node} [message]
     * @param {ToastOptions} [options]
     */
    constructor(message, options = {}) {
        const el = document.createElement('div');
        super(el, options);
        if (message !== undefined) this.options.message = message;
        if (this.options.action && !(this.options.actions || []).length) {
            this.options.actions = [this.options.action];
        }
        this._visible = false;
        this._timer = null;
        this._remaining = 0;
        this._started = 0;
        this._paused = false;
        this._render();
        this._bind();
    }

    _render() {
        const o = this.options;
        const el = this.element;
        const type = o.type || 'default';
        el.className = `domma-toast domma-toast-${type}${o.className ? ' ' + o.className : ''}`;
        const urgent = type === 'error';
        el.setAttribute('role', urgent ? 'alert' : 'status');
        el.setAttribute('aria-live', urgent ? 'assertive' : 'polite');
        el.setAttribute('aria-atomic', 'true');
        el.replaceChildren();

        const icon = o.icon;
        if (icon) {
            const wrap = document.createElement('div');
            wrap.className = 'domma-toast-icon';
            if (typeof Node !== 'undefined' && icon instanceof Node) {
                wrap.appendChild(icon);
            } else if (typeof icon === 'string' && !icon.includes('<')) {
                const span = document.createElement('span');
                span.setAttribute('data-icon', icon);
                wrap.appendChild(span);
            } else {
                fill(wrap, icon, {safe: o.safe});
            }
            el.appendChild(wrap);
            scanIcons(wrap);
        }

        const content = document.createElement('div');
        content.className = 'domma-toast-content';
        this._titleEl = document.createElement('div');
        this._titleEl.className = 'domma-toast-title';
        this._titleEl.textContent = o.title ? String(o.title) : '';
        this._titleEl.hidden = !o.title;
        content.appendChild(this._titleEl);

        this._messageEl = document.createElement('div');
        this._messageEl.className = 'domma-toast-message';
        this._writeMessage();
        content.appendChild(this._messageEl);

        this._actionsEl = document.createElement('div');
        this._actionsEl.className = 'domma-toast-actions';
        content.appendChild(this._actionsEl);
        this._renderActions();
        el.appendChild(content);

        if (flag(o.closable, true)) {
            const x = document.createElement('button');
            x.type = 'button';
            x.className = 'domma-toast-close';
            x.setAttribute('aria-label', 'Close');
            x.innerHTML = '&times;';
            x.addEventListener('click', () => this.close());
            el.appendChild(x);
        }

        this._bar = null;
        if (flag(o.showProgress, true) && num(o.duration, 3000) > 0) {
            const track = document.createElement('div');
            track.className = 'domma-toast-progress';
            this._bar = document.createElement('div');
            this._bar.className = 'domma-toast-progress-bar';
            track.appendChild(this._bar);
            el.appendChild(track);
        }
        el.style.setProperty('--dm-toast-duration', `${num(o.animationDuration, 300)}ms`);
    }

    _writeMessage() {
        const o = this.options;
        const m = o.message;
        if (typeof Node !== 'undefined' && m instanceof Node) fill(this._messageEl, m);
        else fill(this._messageEl, m == null ? '' : String(m), {text: !flag(o.html), safe: o.safe});
    }

    _renderActions() {
        const list = Array.isArray(this.options.actions) ? this.options.actions : [];
        this._actionsEl.replaceChildren();
        this._actionsEl.hidden = !list.length;
        list.forEach((action, index) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `domma-toast-action${action.primary ? ' is-primary' : ''}`;
            btn.textContent = action.label ?? action.text ?? 'OK';
            btn.addEventListener('click', (event) => {
                if (typeof action.onClick === 'function') action.onClick(event, this);
                this._fire('action', {action, index}, this);
                if (action.closeOnClick !== false) this.close();
            });
            this._actionsEl.appendChild(btn);
        });
    }

    _bind() {
        this._addEventListener(this.element, 'mouseenter', () => {
            if (flag(this.options.pauseOnHover, true)) this._pause();
        });
        this._addEventListener(this.element, 'mouseleave', () => {
            if (flag(this.options.pauseOnHover, true)) this._resume();
        });
    }

    _startTimer() {
        clearTimeout(this._timer);
        this._timer = null;
        if (this._remaining <= 0) return;
        this._started = Date.now();
        this._timer = setTimeout(() => this.close(), this._remaining);
        if (this._bar) {
            const bar = this._bar;
            bar.style.transition = 'none';
            bar.style.width = `${(this._remaining / num(this.options.duration, 3000)) * 100}%`;
            const run = () => {
                bar.style.transition = `width ${this._remaining}ms linear`;
                bar.style.width = '0%';
            };
            if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => requestAnimationFrame(run));
            else run();
        }
    }

    _pause() {
        if (this._paused || !this._timer) return;
        this._paused = true;
        clearTimeout(this._timer);
        this._timer = null;
        this._remaining = Math.max(0, this._remaining - (Date.now() - this._started));
        if (this._bar) {
            const width = this._bar.getBoundingClientRect().width;
            const track = this._bar.parentElement?.getBoundingClientRect().width || 0;
            this._bar.style.transition = 'none';
            this._bar.style.width = track ? `${(width / track) * 100}%` : this._bar.style.width;
        }
        this._fire('pause', this);
    }

    _resume() {
        if (!this._paused) return;
        this._paused = false;
        this._startTimer();
        this._fire('resume', this);
    }

    // ---- public API -----------------------------------------------------

    /**
     * Put the toast on screen (E.toast() does this).
     * @returns {this}
     */
    open() {
        if (this._visible) return this;
        const o = this.options;
        while (live.length >= num(o.maxToasts, 5)) {
            const oldest = live.shift();
            oldest?.close();
        }
        this._visible = true;
        live.push(this);
        const box = containerFor(o.position || 'top-right');
        box.appendChild(this.element);
        const reveal = () => {
            this.element.classList.remove('hiding');
            this.element.classList.add('show');
        };
        if (typeof requestAnimationFrame === 'function') requestAnimationFrame(reveal);
        else reveal();
        this._remaining = num(o.duration, 3000);
        this._startTimer();
        this._fire('show', this);
        return this;
    }

    /**
     * Close the toast (removed after the exit animation).
     * @returns {this}
     */
    close() {
        if (!this._visible) return this;
        this._visible = false;
        clearTimeout(this._timer);
        this._timer = null;
        live = live.filter(t => t !== this);
        this.element.classList.remove('show');
        this.element.classList.add('hiding');
        setTimeout(() => {
            this._fire('close', this);
            this.element.remove();
            super.destroy();
        }, num(this.options.animationDuration, 300));
        return this;
    }

    /**
     * Permanent alias of open(), by name.
     * @returns {this}
     */
    show(...args) {
        return this.open(...args);
    }

    /**
     * Permanent alias of close(), by name.
     * @returns {this}
     */
    hide(...args) {
        return this.close(...args);
    }

    /** @returns {this} */
    toggle() {
        return this._visible ? this.close() : this.open();
    }

    /** @returns {boolean} */
    isVisible() {
        return this._visible;
    }

    /** @returns {boolean} */
    isOpen() {
        return this._visible;
    }

    /**
     * Update the message.
     * @param {string|Node} message
     * @returns {this}
     */
    setMessage(message) {
        this.options.message = message;
        this._writeMessage();
        return this;
    }

    /**
     * @param {string} title - Empty hides the title
     * @returns {this}
     */
    setTitle(title) {
        this.options.title = title;
        this._titleEl.textContent = title ? String(title) : '';
        this._titleEl.hidden = !title;
        return this;
    }

    /**
     * @param {import('../elements.js').ToastType} type
     * @returns {this}
     */
    setType(type) {
        const was = this.options.type || 'default';
        this.options.type = type || 'default';
        this.element.classList.remove(`domma-toast-${was}`);
        this.element.classList.add(`domma-toast-${this.options.type}`);
        const urgent = this.options.type === 'error';
        this.element.setAttribute('role', urgent ? 'alert' : 'status');
        this.element.setAttribute('aria-live', urgent ? 'assertive' : 'polite');
        return this;
    }

    /**
     * @param {ToastAction[]|null} actions
     * @returns {this}
     */
    setActions(actions) {
        this.options.actions = actions || [];
        this._renderActions();
        return this;
    }

    _applyOptions() {
        const visible = this._visible;
        this._render();
        if (visible) this.element.classList.add('show');
    }

    /**
     * Remove at once, without the exit animation or the close event.
     * @returns {void}
     */
    destroy() {
        clearTimeout(this._timer);
        this._visible = false;
        live = live.filter(t => t !== this);
        this.element.remove();
        super.destroy();
    }
}

/**
 * Show a toast.
 * @param {string|Node|ToastOptions} message - the text (or `{message, ...options}`)
 * @param {ToastOptions} [options]
 * @returns {Toast}
 */
export function showToast(message, options = {}) {
    if (message && typeof message === 'object' && !(typeof Node !== 'undefined' && message instanceof Node)) {
        options = {...message, ...options};
        message = options.message;
    }
    return new Toast(message, options).open();
}

const typed = (type) => (message, options = {}) => showToast(message, {
    ...options,
    type,
    icon: options.icon ?? typeIcon(type)
});

/**
 * The E.toast function with its statics.
 * @type {ToastStatic}
 */
export const toast = Object.assign(
    (message, options = {}) => showToast(message, options),
    {
        show: showToast,
        success: typed('success'),
        error: typed('error'),
        warning: typed('warning'),
        info: typed('info'),
        closeAll() {
            for (const t of [...live]) t.close();
            live = [];
        }
    }
);

export default Toast;
