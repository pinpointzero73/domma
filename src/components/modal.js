/**
 * Modal - E.modal(selector, options) and E.modal({...}) / E.createModal / E.showModal.
 *
 * One implementation for both modes. The instance's `element` is the caller's element
 * (selector mode) or the one the factory made; nothing is replaced. The dialog chrome
 * (backdrop, frame, title, X, buttons) is drawn in a shadow root on that element, and
 * the element's own children are projected into the body through a slot - so
 * `modal.element.appendChild(panel)` puts `panel` in the body, styled by the page.
 * A tag that cannot take a shadow root gets an inner host div instead.
 *
 * Focus is trapped while it is open (`trapFocus`, on by default; off for a modal with
 * no backdrop unless asked for): Tab cycles through the X, the slotted body and the
 * footer buttons in the order they show, and closing puts focus back where it was
 * (`returnFocus`). Toasts, popovers and pickers opened from the modal keep focus.
 *
 * Events: open, opened, close, closed, beforeopen, beforeclose (cancelable), buttonclick -
 * each as `onX`, `.on('x')` and `dm:modal:x`.
 */

import Component from '../component.js';
import {fill, flag, num, resolveElement, uniqueId} from './shared.js';
import FocusTrap from './focus-trap.js';

const SIZES = {
    small: '400px', sm: '400px',
    medium: '600px', md: '600px',
    large: '800px', lg: '800px',
    xl: '1140px', xlarge: '1140px',
    full: '96vw'
};

const STYLES = `
:host {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 1050;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    --dm-modal-duration: 300ms;
}
:host(.dm-modal-visible) { display: flex; }
:host(.dm-modal-no-backdrop) { pointer-events: none; }
:host(.dm-modal-top) { align-items: flex-start; padding-top: 5vh; }
* { box-sizing: border-box; }
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: var(--dm-modal-backdrop, rgba(0, 0, 0, 0.5));
    opacity: 0;
    transition: opacity var(--dm-modal-duration) ease;
}
:host(.dm-modal-shown) .modal-backdrop { opacity: 1; }
.modal-dialog {
    position: relative;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    max-width: min(var(--dm-modal-width, 600px), 90%);
    max-height: 90vh;
    background: var(--dm-surface, #fff);
    color: var(--dm-text, #212529);
    border: 1px solid var(--dm-border, transparent);
    border-radius: var(--dm-radius-lg, 8px);
    box-shadow: var(--dm-shadow-xl, 0 20px 60px rgba(0, 0, 0, 0.3));
    overflow: hidden;
    outline: none;
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
    transition: opacity var(--dm-modal-duration) ease, transform var(--dm-modal-duration) ease;
}
:host([data-animation="zoom"]) .modal-dialog { transform: scale(0.7); }
:host([data-animation="slide"]) .modal-dialog { transform: translateY(-50px); }
:host(.dm-modal-shown) .modal-dialog { opacity: 1; transform: none; }
:host([data-animation="none"]) .modal-dialog,
:host([data-animation="none"]) .modal-backdrop { transition: none; }
.modal-content { display: flex; flex-direction: column; min-height: 0; flex: 1 1 auto; }
.modal-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--dm-border, #e5e7eb);
}
.modal-header[hidden], .modal-footer[hidden] { display: none; }
.modal-title { margin: 0; flex: 1; font-size: 1.25rem; font-weight: 600; color: inherit; }
.modal-close {
    margin-left: auto;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: none;
    background: none;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    color: var(--dm-text-muted, #6b7280);
    border-radius: var(--dm-radius-sm, 4px);
}
.modal-close:hover { color: var(--dm-text, #212529); }
.modal-close:focus-visible, .modal-footer button:focus-visible {
    outline: 2px solid var(--dm-border-focus, var(--dm-primary, #6495ED));
    outline-offset: 2px;
}
.modal-body { padding: 1.5rem; overflow: auto; min-height: 0; flex: 1 1 auto; }
:host(.dm-modal-authored) .modal-body { padding: 0; }
.modal-body-scrollable { max-height: 60vh; overflow-y: auto; }
.modal-footer {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--dm-border, #e5e7eb);
    /* --dm-background-alt: every theme sets it (--dm-surface-secondary is light outside .dm-theme-dark) */
    background: var(--dm-background-alt, var(--dm-surface, #f9fafb));
}
.modal-footer button {
    padding: 0.5rem 1rem;
    border: 1px solid transparent;
    border-radius: var(--dm-radius-md, 4px);
    font: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    background: var(--dm-secondary, #6c757d);
    color: var(--dm-secondary-text, #fff);
    transition: filter 0.15s ease;
}
.modal-footer button:hover { filter: brightness(0.92); }
.modal-footer .btn-primary { background: var(--dm-primary, #6495ED); color: var(--dm-primary-text, #fff); }
.modal-footer .btn-success { background: var(--dm-success, #28a745); color: var(--dm-success-text, #fff); }
.modal-footer .btn-danger { background: var(--dm-danger, #dc3545); color: var(--dm-danger-text, #fff); }
.modal-footer .btn-warning { background: var(--dm-warning, #ffc107); color: var(--dm-warning-text, #212529); }
.modal-footer .btn-info { background: var(--dm-info, #17a2b8); color: var(--dm-info-text, #fff); }
.modal-footer .btn-outline, .modal-footer .btn-ghost, .modal-footer .btn-link {
    background: transparent;
    color: var(--dm-text, #212529);
    border-color: var(--dm-border, #dee2e6);
}
`;

/** Open modals, newest last - Escape closes only the top one. */
const openStack = [];

let keyBound = false;
function onKeyDown(e) {
    if (e.key !== 'Escape' || e.defaultPrevented) return;
    const top = openStack[openStack.length - 1];
    if (top && top.options.keyboard !== false && top.options.closeOnEscape !== false) {
        top.close();
    }
}
function bindKeys() {
    if (keyBound || typeof document === 'undefined') return;
    document.addEventListener('keydown', onKeyDown);
    keyBound = true;
}
function unbindKeys() {
    if (!keyBound || openStack.length) return;
    document.removeEventListener('keydown', onKeyDown);
    keyBound = false;
}

const AUTHORED = ':scope > .modal-header, :scope > .modal-body, :scope > .modal-footer, :scope > .modal-content, :scope > .modal-dialog';
const LIGHT_CLOSE = '[data-close], [data-dismiss="modal"], [data-dm-close], .modal-close, .btn-close';

/** Whether an element can take a shadow root (HTML spec list plus custom elements). */
function canHostShadow(el) {
    const ok = ['ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'BODY', 'DIV', 'FOOTER', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
        'HEADER', 'MAIN', 'NAV', 'P', 'SECTION', 'SPAN'];
    return ok.includes(el.tagName) || el.tagName.includes('-');
}

/**
 * A footer button.
 * @typedef {object} ModalButton
 * @property {string} [id] - Passed to onButtonClick (default `btn-<index>`)
 * @property {string} [text='Button'] - Label
 * @property {string} [variant='secondary'] - Adds `btn-<variant>`
 * @property {string} [className] - Extra classes
 * @property {boolean} [close=true] - false keeps the modal open after the click
 * @property {(modal: ModalInstance, event: MouseEvent) => void} [onClick]
 */

/**
 * @typedef {object} ModalOptions
 * @property {boolean} [backdrop=true] - Show backdrop overlay
 * @property {boolean} [backdropClose=true] - Close modal when clicking backdrop
 * @property {boolean} [keyboard=true] - Close modal on Escape key
 * @property {boolean} [closeOnEscape=true] - Same as `keyboard`; either false keeps Escape from closing
 * @property {import('../elements.js').AnimationType|false} [animation='fade'] - Animation type
 * @property {number} [animationDuration=300] - Animation duration in ms
 * @property {boolean} [closeButton=true] - Show close button
 * @property {'small'|'sm'|'medium'|'md'|'large'|'lg'|'xl'|'xlarge'|'full'|(string & {})} [size='medium'] - A named size or any CSS width (the factory's default is 'large')
 * @property {boolean} [centered=true] - Centre vertically (false: near the top)
 * @property {boolean} [scrollable=false] - Scroll the body inside a capped height
 * @property {string} [title] - Title text
 * @property {string|Node} [content] - Body content (factory mode): HTML (sanitised unless `safe: false`) or a Node
 * @property {string} [footer] - Footer text
 * @property {ModalButton[]} [buttons] - Footer buttons (the factory's default is one Close button)
 * @property {boolean} [safe=true] - false: content is trusted HTML (not sanitised)
 * @property {string} [className] - Extra classes on the dialog
 * @property {string} [headerClass] - Extra classes on the header
 * @property {string} [bodyClass] - Extra classes on the body
 * @property {string} [footerClass] - Extra classes on the footer
 * @property {boolean} [focus=true] - Focus the dialog on open
 * @property {boolean} [trapFocus=true] - Keep Tab inside while open (default true; false without a backdrop unless given)
 * @property {boolean} [returnFocus=true] - Put focus back where it was on close
 * @property {boolean} [visible=false] - Open at once
 * @property {((modal: ModalInstance) => void)|null} [onOpen] - When opening starts
 * @property {((modal: ModalInstance) => void)|null} [onOpened] - After open animation completes
 * @property {((modal: ModalInstance) => void)|null} [onClose] - When closing starts
 * @property {((modal: ModalInstance) => void)|null} [onClosed] - After close animation completes
 * @property {((modal: ModalInstance) => boolean|void)|null} [onBeforeOpen] - Return false to refuse the open
 * @property {((modal: ModalInstance) => boolean|void)|null} [onBeforeClose] - Return false to refuse the close
 * @property {((buttonId: string, modal: ModalInstance) => void)|null} [onButtonClick] - A footer button was clicked
 */

/** @typedef {Modal} ModalInstance */

export class Modal extends Component {
    static componentName = 'modal';

    static defaults = {
        backdrop: true,
        backdropClose: true,
        keyboard: true,
        closeOnEscape: true,
        animation: 'fade',          // 'fade' | 'slide' | 'zoom' | false
        animationDuration: 300,
        closeButton: true,
        size: 'medium',             // 'small' | 'medium' | 'large' | 'xl' | 'full' | CSS width
        centered: true,
        scrollable: false,
        title: '',
        content: '',
        footer: '',
        buttons: [],                // [{id, text, variant, close}]
        safe: true,                 // false: content is trusted HTML (not sanitised)
        className: '',
        headerClass: '',
        bodyClass: '',
        footerClass: '',
        focus: true,
        trapFocus: true,            // Tab stays in the modal; default off when backdrop is false
        returnFocus: true,          // closing puts focus back where it was
        visible: false,
        onOpen: null,
        onOpened: null,
        onClose: null,
        onClosed: null,
        onBeforeOpen: null,
        onBeforeClose: null,
        onButtonClick: null
    };

    /**
     * @param {import('./shared.js').ComponentTarget} selector - the element to make a modal; null makes one
     * @param {ModalOptions} [options]
     */
    constructor(selector, options = {}) {
        const given = resolveElement(selector);
        const made = !given;
        let element = given;
        if (made) {
            element = document.createElement('div');
            element.className = 'dm-modal';
        }
        super(element, options);
        this._factoryMade = made;
        this._isOpen = false;
        this._timers = [];
        this._restoreFocus = null;
        this._given = options || {};
        this._init();
    }

    _init() {
        const el = this.element;
        const o = this.options;

        // Selector mode: read a size from the classes / data-size the markup carries.
        if (!this._factoryMade && !('size' in this._givenOptions())) {
            if (el.classList.contains('modal-sm')) o.size = 'small';
            else if (el.classList.contains('modal-lg')) o.size = 'large';
            else if (el.classList.contains('modal-xl')) o.size = 'xl';
            if (el.dataset.size) o.size = el.dataset.size;
        }
        this._authored = !this._factoryMade && !!el.querySelector(AUTHORED);

        // The shadow host: the element itself, or an inner div for a tag that cannot take one.
        if (el.shadowRoot && el.shadowRoot.querySelector('.modal-dialog')) {
            this._host = el;
        } else if (!el.shadowRoot && canHostShadow(el)) {
            el.attachShadow({mode: 'open'});
            this._host = el;
        } else if (el.shadowRoot) {
            this._host = el;
        } else {
            const inner = document.createElement('div');
            inner.className = 'dm-modal-inner';
            while (el.firstChild) inner.appendChild(el.firstChild);
            inner.attachShadow({mode: 'open'});
            el.appendChild(inner);
            this._host = inner;
        }
        this._addedClasses = ['dm-modal-host'];
        this._host.classList.add('dm-modal-host');
        if (this._host !== el) el.classList.add('dm-modal-host');
        if (this._authored) {
            this._host.classList.add('dm-modal-authored');
            this._addedClasses.push('dm-modal-authored');
        }

        // ARIA on the element callers hold.
        this._addedAttrs = [];
        const setAttr = (name, value) => {
            if (el.hasAttribute(name)) return;
            el.setAttribute(name, value);
            this._addedAttrs.push(name);
        };
        setAttr('role', 'dialog');
        setAttr('aria-modal', 'true');
        const lightTitle = el.querySelector('.modal-title');
        if (lightTitle) {
            if (!lightTitle.id) lightTitle.id = uniqueId('dm-modal-title');
            setAttr('aria-labelledby', lightTitle.id);
        }
        for (const btn of el.querySelectorAll(LIGHT_CLOSE)) {
            if (!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', 'Close');
        }

        if (this._factoryMade && o.content) {
            fill(el, o.content, {safe: o.safe});
        }

        this._render();
        this._bind();
        if (flag(o.visible)) this.open();
    }

    /** Whether this open traps focus: on by default, except over a page left usable (no backdrop). */
    _wantsTrap() {
        const o = this.options;
        if (!flag(o.trapFocus, true)) return false;
        return flag(o.backdrop, true) || 'trapFocus' in this._givenOptions();
    }

    _startTrap() {
        if (!this._wantsTrap() || typeof document === 'undefined') return;
        if (!this._trap) {
            this._trap = new FocusTrap(this.element, {
                initialFocus: false,                // open() focuses the dialog frame itself
                fallbackFocus: () => this._dialog,
                returnFocus: true,
                escapeDeactivates: false,           // Escape stays with the modal (close() by name)
                allowOutsideClick: true,
                allowOutsideFocus: 'layers',
                allowScriptFocus: true,
                register: false
            });
        }
        this._trap.activate();
    }

    /** Options the caller passed, without the defaults. */
    _givenOptions() {
        return this._given || {};
    }

    _render() {
        const o = this.options;
        const root = this._host.shadowRoot;
        root.replaceChildren();

        const style = document.createElement('style');
        style.textContent = STYLES;
        root.appendChild(style);

        const anim = o.animation === false || o.animation === 'none' || o.animation === 'false'
            ? 'none' : String(o.animation || 'fade');
        this._host.dataset.animation = anim;
        this._host.style.setProperty('--dm-modal-duration', `${anim === 'none' ? 0 : num(o.animationDuration, 300)}ms`);
        const width = SIZES[o.size] || (o.size ? String(o.size) : SIZES.medium);
        this._host.style.setProperty('--dm-modal-width', width);
        this._host.classList.toggle('dm-modal-no-backdrop', !flag(o.backdrop, true));
        this._host.classList.toggle('dm-modal-top', o.centered === false || o.centered === 'false');

        this._backdrop = null;
        if (flag(o.backdrop, true)) {
            this._backdrop = document.createElement('div');
            this._backdrop.className = 'modal-backdrop';
            this._backdrop.setAttribute('part', 'backdrop');
            root.appendChild(this._backdrop);
        }

        const dialog = document.createElement('div');
        dialog.className = `modal-dialog${o.className ? ' ' + o.className : ''}`;
        dialog.setAttribute('part', 'dialog');
        dialog.tabIndex = -1;
        this._dialog = dialog;

        const content = document.createElement('div');
        content.className = 'modal-content';
        content.setAttribute('part', 'content');

        // Header: a title, and the X unless the markup brings its own header.
        const header = document.createElement('div');
        header.className = `modal-header${o.headerClass ? ' ' + o.headerClass : ''}`;
        header.setAttribute('part', 'header');
        this._titleEl = document.createElement('h3');
        this._titleEl.className = 'modal-title';
        this._titleEl.setAttribute('part', 'title');
        this._titleEl.id = uniqueId('dm-modal-shadow-title');
        if (o.title) this._titleEl.textContent = String(o.title);
        else this._titleEl.hidden = true;
        header.appendChild(this._titleEl);
        if (flag(o.closeButton, true) && !this._authored) {
            const x = document.createElement('button');
            x.type = 'button';
            x.className = 'modal-close';
            x.setAttribute('part', 'close');
            x.setAttribute('aria-label', 'Close');
            x.innerHTML = '&times;';
            // Looked up when clicked, so a close() a caller replaced is the one that runs.
            x.addEventListener('click', () => this.close());
            header.appendChild(x);
        }
        header.hidden = !o.title && (this._authored || !flag(o.closeButton, true));
        this._header = header;
        content.appendChild(header);
        if (o.title && !this.element.hasAttribute('aria-labelledby') && !this.element.hasAttribute('aria-label')) {
            this.element.setAttribute('aria-label', String(o.title));
            this._addedAttrs.push('aria-label');
        }

        const body = document.createElement('div');
        body.className = `modal-body${o.bodyClass ? ' ' + o.bodyClass : ''}${flag(o.scrollable) ? ' modal-body-scrollable' : ''}`;
        body.setAttribute('part', 'body');
        body.appendChild(document.createElement('slot'));
        this._body = body;
        content.appendChild(body);

        const footer = document.createElement('div');
        footer.className = `modal-footer${o.footerClass ? ' ' + o.footerClass : ''}`;
        footer.setAttribute('part', 'footer');
        const footerSlot = document.createElement('slot');
        footerSlot.name = 'footer';
        footer.appendChild(footerSlot);
        this._footer = footer;
        this._footerText = null;
        if (o.footer) {
            this._footerText = document.createElement('span');
            this._footerText.textContent = String(o.footer);
            footer.appendChild(this._footerText);
        }
        content.appendChild(footer);
        this._renderButtons();

        dialog.appendChild(content);
        root.appendChild(dialog);
    }

    _renderButtons() {
        const footer = this._footer;
        for (const b of footer.querySelectorAll('button[data-button-id]')) b.remove();
        const buttons = Array.isArray(this.options.buttons) ? this.options.buttons : [];
        buttons.forEach((btn, index) => {
            const id = btn.id || `btn-${index}`;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `btn btn-${btn.variant || 'secondary'}${btn.className ? ' ' + btn.className : ''}`;
            button.textContent = btn.text || 'Button';
            button.dataset.buttonId = id;
            button.addEventListener('click', (event) => {
                this._fire('buttonClick', id, this);
                if (typeof btn.onClick === 'function') btn.onClick(this, event);
                if (btn.close !== false) this.close();
            });
            footer.appendChild(button);
        });
        const slotted = this.element.querySelector(':scope > [slot="footer"]');
        footer.hidden = !buttons.length && !this._footerText && !slotted;
    }

    _bind() {
        const host = this._host;
        // Backdrop click, decided on where the press started as well as where it ended,
        // so a drag that began inside the dialog does not close it.
        this._addEventListener(host.shadowRoot, 'pointerdown', (e) => {
            this._downOnBackdrop = e.composedPath()[0] === this._backdrop;
        });
        this._addEventListener(host.shadowRoot, 'click', (e) => {
            const onBackdrop = e.composedPath()[0] === this._backdrop;
            const started = this._downOnBackdrop !== false;
            this._downOnBackdrop = undefined;
            if (onBackdrop && started && this._isOpen && flag(this.options.backdropClose, true)) {
                this.close();
            }
        });
        // Close controls in the caller's own markup.
        this._addEventListener(this.element, 'click', (e) => {
            const btn = e.target.closest?.(LIGHT_CLOSE);
            if (btn && this.element.contains(btn) && this._ownsNode(btn)) {
                e.preventDefault();
                this.close();
            }
        });
    }

    /** A node is ours unless it sits inside another modal nested in this one. */
    _ownsNode(node) {
        const nearest = node.closest('.dm-modal-host');
        return !nearest || nearest === this.element || nearest === this._host;
    }

    _later(fn, ms) {
        const t = setTimeout(() => {
            this._timers = this._timers.filter(x => x !== t);
            fn();
        }, ms);
        this._timers.push(t);
    }

    _clearTimers() {
        this._timers.forEach(clearTimeout);
        this._timers = [];
    }

    _duration() {
        return this._host.dataset.animation === 'none' ? 0 : num(this.options.animationDuration, 300);
    }

    // ---- public API -----------------------------------------------------

    /**
     * Open the modal.
     * @returns {this}
     */
    open() {
        if (this._isOpen) return this;
        if (this._fire('beforeOpen', this) === false) return this;
        this._clearTimers();
        this._isOpen = true;
        const host = this._host;
        // A container something removed (a view swapped out) is made again.
        if (this._factoryMade && !this.element.isConnected) ensureContainer().appendChild(this.element);
        // Markup hidden until first use (style="display: none" or hidden) is shown by the class from now on.
        if (this.element.style.display === 'none') this.element.style.removeProperty('display');
        this.element.hidden = false;
        host.classList.add('dm-modal-visible');
        if (host !== this.element) this.element.classList.add('dm-modal-visible');
        openStack.push(this);
        bindKeys();

        if (flag(this.options.focus, true) && typeof document !== 'undefined') {
            this._restoreFocus = document.activeElement;
        }
        this._startTrap();
        const show = () => {
            if (!this._isOpen) return;
            host.classList.add('dm-modal-shown');
            if (flag(this.options.focus, true) && !this.element.contains(document.activeElement)) {
                try { this._dialog.focus({preventScroll: true}); } catch { /* not focusable yet */ }
            }
        };
        if (this._duration() && typeof requestAnimationFrame === 'function') {
            // Two frames: the display change has to be painted before the transition runs.
            requestAnimationFrame(() => requestAnimationFrame(show));
        } else {
            show();
        }
        this._fire('open', this);
        this._later(() => this._fire('opened', this), this._duration());
        return this;
    }

    /**
     * Close the modal (a `beforeclose` handler can refuse).
     * @returns {this}
     */
    close() {
        if (!this._isOpen) return this;
        if (!this._mayClose(this)) return this;
        this._clearTimers();
        this._isOpen = false;
        const host = this._host;
        host.classList.remove('dm-modal-shown');
        const i = openStack.indexOf(this);
        if (i > -1) openStack.splice(i, 1);
        unbindKeys();
        if (this._trap && this._trap.isActive()) {
            // The trap hands focus back now (and to the overlay beneath, when stacked).
            const back = flag(this.options.focus, true) && flag(this.options.returnFocus, true);
            this._trap.deactivate({returnFocus: back});
            this._restoreFocus = null;
        }
        this._fire('close', this);

        const finish = () => {
            host.classList.remove('dm-modal-visible');
            this.element.classList.remove('dm-modal-visible');
            const back = flag(this.options.returnFocus, true) ? this._restoreFocus : null;
            this._restoreFocus = null;
            if (back && typeof back.focus === 'function' && back.isConnected) {
                try { back.focus({preventScroll: true}); } catch { /* gone */ }
            }
            this._fire('closed', this);
        };
        const ms = this._duration();
        if (ms) this._later(finish, ms);
        else finish();
        return this;
    }

    /**
     * Toggle modal visibility.
     * @returns {this}
     */
    toggle() {
        return this._isOpen ? this.close() : this.open();
    }

    /**
     * Whether the modal is open.
     * @returns {boolean}
     */
    isOpen() {
        return this._isOpen;
    }

    /**
     * Permanent alias: delegates to open() by name, so a replaced open() is honoured.
     * @returns {this}
     */
    show(...args) {
        return this.open(...args);
    }

    /**
     * Permanent alias: delegates to close() by name.
     * @returns {this}
     */
    hide(...args) {
        return this.close(...args);
    }

    /**
     * Replace the title; empty hides it.
     * @param {string|null} title
     * @returns {this}
     */
    setTitle(title) {
        this.options.title = title;
        this._titleEl.textContent = title == null ? '' : String(title);
        this._titleEl.hidden = !title;
        this._header.hidden = !title && (this._authored || !flag(this.options.closeButton, true));
        return this;
    }

    /**
     * Replace the body content (the element's children other than a footer slot).
     * A string is HTML, sanitised unless `{safe: false}`; a Node is appended.
     * @param {string|Node|null} content
     * @param {{safe?: boolean}} [opts]
     * @returns {this}
     */
    setContent(content, opts = {}) {
        const keep = Array.from(this.element.querySelectorAll(':scope > [slot]'));
        const target = this._host === this.element ? this.element : this._host;
        fill(target, content, {safe: opts.safe ?? this.options.safe});
        keep.forEach(n => target.appendChild(n));
        return this;
    }

    /**
     * Replace the footer buttons.
     * @param {ModalButton[]|null} buttons
     * @returns {this}
     */
    setButtons(buttons) {
        this.options.buttons = buttons || [];
        this._renderButtons();
        return this;
    }

    _applyOptions() {
        const wasOpen = this._isOpen;
        this._render();
        if (wasOpen) {
            this._host.classList.add('dm-modal-visible', 'dm-modal-shown');
        }
    }

    /**
     * Tear down. A modal the factory made is removed from the page (after its close
     * animation if it is open); a caller's element is left in place with its own
     * children showing and Domma's classes and attributes taken off.
     * @returns {void}
     */
    destroy() {
        if (this._destroyed) return;
        this._destroyed = true;
        const wasOpen = this._isOpen;
        if (wasOpen) this._forcedClose();
        const i = openStack.indexOf(this);
        if (i > -1) openStack.splice(i, 1);
        unbindKeys();
        if (this._trap) {
            this._trap.destroy();
            this._trap = null;
        }
        super.destroy();
        const el = this.element;
        if (this._factoryMade) {
            const remove = () => el.remove();
            if (wasOpen && this._duration()) setTimeout(remove, this._duration());
            else remove();
            return;
        }
        this._clearTimers();
        const root = this._host.shadowRoot;
        root.replaceChildren(document.createElement('slot'));
        this._host.classList.remove(...this._addedClasses, 'dm-modal-visible', 'dm-modal-shown',
            'dm-modal-no-backdrop', 'dm-modal-top');
        el.classList.remove('dm-modal-host', 'dm-modal-visible');
        delete this._host.dataset.animation;
        this._host.style.removeProperty('--dm-modal-duration');
        this._host.style.removeProperty('--dm-modal-width');
        for (const name of this._addedAttrs) el.removeAttribute(name);
    }

    /**
     * Permanent alias of destroy().
     * @returns {void}
     */
    remove(...args) {
        return this.destroy(...args);
    }
}

// ---- factory: E.modal({...}), E.createModal, E.showModal ---------------------

const FACTORY_DEFAULTS = {
    size: 'large',
    buttons: [{id: 'close', text: 'Close', variant: 'secondary'}]
};
const Z_BASE = 1050;
let container = null;

function ensureContainer() {
    // A container something removed from the page (a view swapped out) is made again.
    if (!container || !container.isConnected) {
        container = document.createElement('div');
        container.className = 'dm-dialog-container';
        container.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 1040;';
        document.body.appendChild(container);
    }
    return container;
}

/**
 * A new modal in the shared dialog container.
 * @param {ModalOptions} [options]
 * @returns {Modal}
 */
export function createModal(options = {}) {
    const box = ensureContainer();
    const modal = new FactoryModal(null, {...FACTORY_DEFAULTS, ...options});
    modal.element.style.zIndex = String(Z_BASE + openStack.length * 10);
    box.appendChild(modal.element);
    return modal;
}

/**
 * Open a new modal and resolve with the id of the button that closed it
 * (null when it was closed another way - X, backdrop or Escape).
 * @param {ModalOptions} [options]
 * @returns {Promise<string|null>}
 */
export function showModal(options = {}) {
    return new Promise((resolve) => {
        let settled = false;
        const modal = createModal({
            ...options,
            onButtonClick(buttonId, instance, ...rest) {
                if (typeof options.onButtonClick === 'function') options.onButtonClick(buttonId, instance, ...rest);
                settled = true;
                resolve(buttonId);
            }
        });
        modal.on('closed', () => {
            if (!settled) {
                settled = true;
                resolve(null);
            }
        });
        modal.open();
    });
}

/** A Modal the factory made: `_factoryCreated`, kept for callers that test it. */
class FactoryModal extends Modal {
    get _factoryCreated() {
        return true;
    }
}

export default Modal;
