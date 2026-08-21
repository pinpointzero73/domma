/**
 * Legacy Wrappers for Domma Web Components
 * Maintain backwards compatibility with existing API
 */

import { DommaBadge } from '../components/domma-badge.js';
import { DommaNumberBadge } from '../components/domma-number-badge.js';
import { DommaTooltip } from '../components/domma-tooltip.js';
import { DommaLoader } from '../components/domma-loader.js';
import { DommaBackToTop } from '../components/domma-back-to-top.js';
import { DommaToast } from '../components/domma-toast.js';
import { DommaModal } from '../components/domma-modal.js';
import { DommaCard } from '../components/domma-card.js';

/**
 * Convert camelCase to kebab-case
 */
function toKebabCase(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Carry the host element's identity onto the web component that replaces it.
 *
 * These wrappers swap the author's element for a custom element via
 * replaceWith(). Without this, the original id, classes and data-* attributes
 * are discarded - so `#my-modal` simply stops existing once it is initialised,
 * and every later selector lookup (including the config engine's own event
 * bindings and $.update()/$.reset()) silently fails.
 *
 * Option-derived attributes already set on the web component win; only
 * `class` is merged rather than overwritten.
 *
 * `baseClass` is the legacy class the component replaces (.modal, .card,
 * .badge) and is deliberately NOT copied. Those rules in elements.css describe
 * the hand-written, JS-free version of the component and are driven by class
 * toggles the Web Component never performs - `.modal` sets
 * `opacity: 0; pointer-events: none`, undone only by `.modal.active`, while the
 * component shows itself via `:host([visible])`. Copying it onto the host lets
 * outer-document CSS override the shadow styling and renders the component
 * invisible. Author classes are still carried across.
 *
 * @param {Element} original
 * @param {Element} webComponent
 * @param {string} [baseClass] Legacy class to skip when merging
 */
function preserveIdentity(original, webComponent, baseClass) {
    if (!original || !webComponent) return;

    for (const attr of Array.from(original.attributes)) {
        const name = attr.name;

        if (name === 'class') {
            for (const cls of original.classList) {
                if (cls === baseClass) continue;
                webComponent.classList.add(cls);
            }
            continue;
        }

        // Never clobber an attribute the options already configured
        if (webComponent.hasAttribute(name)) continue;

        webComponent.setAttribute(name, attr.value);
    }
}

/**
 * Badge Wrapper
 * Maintains exact API: Domma.elements.badge(selector, options)
 */
export function createBadgeWrapper(selector, options = {}) {
    const element = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

    if (!element) return null;

    // Preserve existing content
    const content = element.textContent;

    // Create Web Component
    const webComponent = document.createElement('domma-badge');

    // Transfer content
    webComponent.textContent = content;

    // Apply options as attributes or event listeners
    for (const [key, value] of Object.entries(options)) {
        if (typeof value === 'function') {
            // Handle callbacks via events
            const eventName = key.replace(/^on/, '').toLowerCase();
            webComponent.addEventListener(eventName, (e) => {
                value(e.detail.event || e, webComponent);
            });
        } else if (typeof value === 'boolean') {
            // Boolean attributes
            if (value) {
                webComponent.setAttribute(toKebabCase(key), '');
            }
        } else if (value !== null && value !== undefined) {
            // Other attributes
            webComponent.setAttribute(toKebabCase(key), String(value));
        }
    }

    // Replace original element with Web Component
    preserveIdentity(element, webComponent, 'badge');
    element.replaceWith(webComponent);

    // Store reference for retrieval (compatibility with existing code)
    webComponent._dommaComponent = webComponent;

    // Return API-compatible object
    return {
        element: webComponent,
        options: webComponent._options,

        setOptions(newOptions) {
            webComponent.setOptions(newOptions);
            return this;
        },

        setVariant(variant) {
            webComponent.setVariant(variant);
            return this;
        },

        setSize(size) {
            webComponent.setSize(size);
            return this;
        },

        setText(text) {
            webComponent.setText(text);
            return this;
        },

        remove() {
            webComponent.remove();
        },

        destroy() {
            webComponent.destroy();
        }
    };
}

/**
 * NumberBadge Wrapper
 * Maintains exact API: Domma.elements.numberBadge(selector, options)
 */
export function createNumberBadgeWrapper(selector, options = {}) {
    const element = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

    if (!element) return null;

    // Create web component, wrapping the target element
    const webComponent = document.createElement('domma-number-badge');

    // Apply options as attributes
    if (options.count !== undefined) {
        webComponent.setAttribute('count', String(options.count));
    }
    if (options.variant) {
        webComponent.setAttribute('variant', options.variant);
    }
    if (options.dot) {
        webComponent.setAttribute('dot', '');
    }
    if (options.pulse) {
        webComponent.setAttribute('pulse', '');
    }
    if (options.borderColor) {
        webComponent.setAttribute('border-color', options.borderColor);
    }

    // Replace element with wrapper containing the element inside
    element.parentNode.insertBefore(webComponent, element);
    webComponent.appendChild(element);

    webComponent._dommaComponent = webComponent;

    return {
        element: webComponent,
        options: webComponent._options,

        setOptions(newOptions) {
            webComponent.setOptions(newOptions);
            return this;
        },

        setCount(count) {
            webComponent.setCount(count);
            return this;
        },

        increment(by = 1) {
            webComponent.increment(by);
            return this;
        },

        decrement(by = 1) {
            webComponent.decrement(by);
            return this;
        },

        setDot(dot) {
            webComponent.setDot(dot);
            return this;
        },

        setVariant(variant) {
            webComponent.setVariant(variant);
            return this;
        },

        setPulse(pulse) {
            webComponent.setPulse(pulse);
            return this;
        },

        getCount() {
            return webComponent.getCount();
        },

        remove() {
            // Unwrap element from web component before removing
            if (webComponent.parentNode && element.parentNode === webComponent) {
                webComponent.parentNode.insertBefore(element, webComponent);
            }
            webComponent.remove();
        },

        destroy() {
            webComponent.destroy();
        }
    };
}

/**
 * Tooltip Wrapper
 * Maintains exact API: Domma.elements.tooltip(selector, options)
 */
export function createTooltipWrapper(selector, options = {}) {
    const elements = typeof selector === 'string'
        ? document.querySelectorAll(selector)
        : [selector];

    if (elements.length === 0) return null;

    const instances = [];

    elements.forEach(el => {
        if (!el) return;

        // The <domma-tooltip> renders only its `content` attribute - it has no
        // data-attribute fallback. Callers commonly wire by data-tooltip alone
        // (the framework table re-render, forms.js label tooltips), passing no
        // explicit content; without this fallback those tooltips render empty.
        // Source the content from data-tooltip / title, matching the legacy
        // Tooltip class behaviour.
        const opts = (options.content === undefined || options.content === null || options.content === '')
            ? { ...options, content: el.dataset.tooltip || el.title || '' }
            : options;

        // Apply options as attributes or event listeners.
        const applyOpts = (wc) => {
            for (const [key, value] of Object.entries(opts)) {
                if (typeof value === 'function') {
                    // Handle callbacks via events
                    const eventName = key.replace(/^on/, '').toLowerCase();
                    wc.addEventListener(eventName, () => value(wc));
                } else if (key === 'delay' && typeof value === 'object') {
                    // Handle delay object {show: X, hide: Y}
                    if (value.show !== undefined) wc.setAttribute('delay', String(value.show));
                    if (value.hide !== undefined) wc.setAttribute('hide-delay', String(value.hide));
                } else if (typeof value === 'boolean') {
                    // Boolean attributes
                    if (value) wc.setAttribute(toKebabCase(key), '');
                } else if (value !== null && value !== undefined) {
                    // Other attributes
                    wc.setAttribute(toKebabCase(key), String(value));
                }
            }
        };

        // Idempotent: if this element is ALREADY wrapped by a <domma-tooltip>,
        // refresh that wrapper instead of nesting a second one. Double-wrapping
        // breaks the tooltip, and it happens whenever two layers wire the same
        // element - e.g. the framework table re-render and a view both calling
        // E.tooltip on the same action button.
        let webComponent;
        if (el.parentNode && el.parentNode.tagName === 'DOMMA-TOOLTIP') {
            webComponent = el.parentNode;
            applyOpts(webComponent);
        } else {
            // Create Web Component wrapper
            webComponent = document.createElement('domma-tooltip');
            applyOpts(webComponent);

            // Wrap the original element
            el.parentNode.insertBefore(webComponent, el);
            webComponent.appendChild(el);

            // Store reference for retrieval
            webComponent._dommaComponent = webComponent;
        }

        // Return API-compatible object
        instances.push({
            element: webComponent,
            options: webComponent._options,

            show() {
                webComponent.show();
                return this;
            },

            hide() {
                webComponent.hide();
                return this;
            },

            toggle() {
                webComponent.toggle();
                return this;
            },

            setContent(content) {
                webComponent.setContent(content);
                return this;
            },

            setPosition(position) {
                webComponent.setPosition(position);
                return this;
            },

            isVisible() {
                return webComponent.isVisible();
            },

            destroy() {
                // Unwrap and restore original element
                const child = webComponent.querySelector('*');
                if (child && webComponent.parentNode) {
                    webComponent.parentNode.insertBefore(child, webComponent);
                }
                webComponent.remove();
            }
        });
    });

    // Return single instance or array based on selector
    return instances.length === 1 ? instances[0] : instances;
}

/**
 * Loader Wrapper
 * Maintains exact API: Domma.elements.loader(selector, options)
 */
export function createLoaderWrapper(selector, options = {}) {
    const element = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

    if (!element) return null;

    // Create Web Component
    const webComponent = document.createElement('domma-loader');

    // Apply options as attributes or properties
    for (const [key, value] of Object.entries(options)) {
        if (typeof value === 'function') {
            // Handle callbacks via events
            const eventName = key.replace(/^on/, '').toLowerCase();
            webComponent.addEventListener(eventName, (e) => {
                value(webComponent);
            });
        } else if (typeof value === 'boolean') {
            // Boolean attributes
            if (value) {
                webComponent.setAttribute(toKebabCase(key), '');
            }
        } else if (value !== null && value !== undefined) {
            // Other attributes
            webComponent.setAttribute(toKebabCase(key), String(value));
        }
    }

    // Append to container
    element.appendChild(webComponent);

    // Store reference for retrieval
    webComponent._dommaComponent = webComponent;

    // Return API-compatible object
    return {
        element: webComponent,
        options: webComponent._options,

        show() {
            webComponent.show();
            return this;
        },

        hide() {
            webComponent.hide();
            return this;
        },

        toggle() {
            webComponent.toggle();
            return this;
        },

        isVisible() {
            return webComponent.isVisible();
        },

        setText(text) {
            webComponent.setText(text);
            return this;
        },

        setType(type) {
            webComponent.setType(type);
            return this;
        },

        setSize(size) {
            webComponent.setSize(size);
            return this;
        },

        setColor(color) {
            webComponent.setColor(color);
            return this;
        },

        destroy() {
            webComponent.destroy();
        }
    };
}

/**
 * BackToTop Wrapper
 * Maintains exact API: Domma.elements.backToTop(selector, options)
 * Note: selector parameter is ignored - backToTop always appends to body
 */
export function createBackToTopWrapper(selector, options = {}) {
    // BackToTop always appends to body (selector parameter ignored for backwards compatibility)
    // This prevents catastrophic bugs when selector is 'body' or other critical elements

    // Create Web Component
    const webComponent = document.createElement('domma-back-to-top');

    // Apply options as attributes or properties
    for (const [key, value] of Object.entries(options)) {
        if (typeof value === 'function') {
            // Handle callbacks via events
            const eventName = key.replace(/^on/, '').toLowerCase();
            webComponent.addEventListener(eventName, (e) => {
                value(e.detail || webComponent);
            });
        } else if (typeof value === 'boolean') {
            // Boolean attributes
            if (value) {
                webComponent.setAttribute(toKebabCase(key), '');
            }
        } else if (value !== null && value !== undefined) {
            // Other attributes
            webComponent.setAttribute(toKebabCase(key), String(value));
        }
    }

    // Always append to body - backToTop is a fixed-position element
    document.body.appendChild(webComponent);

    // Store reference for retrieval
    webComponent._dommaComponent = webComponent;

    // Return API-compatible object
    return {
        element: webComponent,
        options: webComponent._options,

        scroll() {
            webComponent.scroll();
            return this;
        },

        show() {
            webComponent.show();
            return this;
        },

        hide() {
            webComponent.hide();
            return this;
        },

        toggle() {
            webComponent.toggle();
            return this;
        },

        isVisible() {
            return webComponent.isVisible();
        },

        getButton() {
            return webComponent.getButton();
        },

        setShowAfter(value) {
            webComponent.setShowAfter(value);
            return this;
        },

        setPosition(position) {
            webComponent.setPosition(position);
            return this;
        },

        setOffset(offset) {
            webComponent.setOffset(offset);
            return this;
        },

        destroy() {
            webComponent.destroy();
        }
    };
}

/**
 * Toast Wrapper - Static API Pattern
 * Maintains exact API: Domma.elements.toast.show(), .success(), etc.
 */
export class ToastWrapper {
    static defaults = {
        position: 'top-right',
        duration: 3000,
        pauseOnHover: true,
        showProgress: true,
        animation: 'slide',
        animationDuration: 300,
        closable: true,
        maxToasts: 5
    };

    static _containers = {};
    static _toasts = [];

    static _getContainer(position) {
        if (!ToastWrapper._containers[position]) {
            const container = document.createElement('div');
            container.className = `domma-toast-container domma-toast-${position}`;
            container.style.cssText = `
                position: fixed;
                z-index: 9999;
                pointer-events: none;
                ${position.includes('top') ? 'top: 16px;' : 'bottom: 16px;'}
                ${position.includes('right') ? 'right: 16px;' : 'left: 16px;'}
                display: flex;
                flex-direction: column;
                gap: 12px;
            `;
            document.body.appendChild(container);
            ToastWrapper._containers[position] = container;
        }
        return ToastWrapper._containers[position];
    }

    static show(message, options = {}) {
        const opts = {...ToastWrapper.defaults, ...options};
        const container = ToastWrapper._getContainer(opts.position);

        // Enforce max toasts
        while (ToastWrapper._toasts.length >= opts.maxToasts) {
            const oldest = ToastWrapper._toasts.shift();
            if (oldest) oldest.close();
        }

        // Create Web Component
        const webComponent = document.createElement('domma-toast');
        webComponent.style.pointerEvents = 'auto';

        // Apply options as attributes
        webComponent.setAttribute('message', message);
        if (opts.title) webComponent.setAttribute('title', opts.title);
        if (opts.type) webComponent.setAttribute('type', opts.type);
        if (opts.position) webComponent.setAttribute('position', opts.position);
        if (opts.duration !== undefined) webComponent.setAttribute('duration', String(opts.duration));
        if (opts.pauseOnHover !== undefined) webComponent.setAttribute('pause-on-hover', String(opts.pauseOnHover));
        if (opts.showProgress !== undefined) webComponent.setAttribute('show-progress', String(opts.showProgress));
        if (opts.animation) webComponent.setAttribute('animation', opts.animation);
        if (opts.animationDuration !== undefined) webComponent.setAttribute('animation-duration', String(opts.animationDuration));
        if (opts.closable !== undefined) webComponent.setAttribute('closable', String(opts.closable));
        if (opts.html !== undefined) webComponent.setAttribute('html', String(opts.html));
        if (opts.icon) webComponent.setAttribute('icon', opts.icon);

        // Handle actions array
        if (opts.actions && opts.actions.length > 0) {
            webComponent._options = webComponent._options || {};
            webComponent._options.actions = opts.actions;
        }

        // Handle callbacks via events
        const eventHandlers = {};
        for (const [key, value] of Object.entries(opts)) {
            if (typeof value === 'function') {
                const eventName = key.replace(/^on/, '').toLowerCase();
                const handler = (e) => value(e.detail || webComponent);
                webComponent.addEventListener(eventName, handler);
                eventHandlers[eventName] = handler;
            }
        }

        // Append to container
        container.appendChild(webComponent);

        // Auto-show
        webComponent.show();

        // Create instance wrapper
        const instance = {
            element: webComponent,

            close() {
                webComponent.close();
                // Remove from tracking
                const index = ToastWrapper._toasts.indexOf(instance);
                if (index > -1) {
                    ToastWrapper._toasts.splice(index, 1);
                }
                return this;
            },

            setMessage(message) {
                webComponent.setMessage(message);
                return this;
            },

            setTitle(title) {
                webComponent.setTitle(title);
                return this;
            },

            setType(type) {
                webComponent.setType(type);
                return this;
            },

            setActions(actions) {
                webComponent.setActions(actions);
                return this;
            },

            isVisible() {
                return webComponent.isVisible();
            }
        };

        ToastWrapper._toasts.push(instance);
        return instance;
    }

    static success(message, options = {}) {
        return ToastWrapper.show(message, {
            ...options,
            type: 'success',
            icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>'
        });
    }

    static error(message, options = {}) {
        return ToastWrapper.show(message, {
            ...options,
            type: 'error',
            icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>'
        });
    }

    static warning(message, options = {}) {
        return ToastWrapper.show(message, {
            ...options,
            type: 'warning',
            icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>'
        });
    }

    static info(message, options = {}) {
        return ToastWrapper.show(message, {
            ...options,
            type: 'info',
            icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'
        });
    }

    static closeAll() {
        ToastWrapper._toasts.forEach(toast => toast.close());
        ToastWrapper._toasts = [];
    }
}

/**
 * Modal Wrapper - Instance-based Pattern
 * Maintains exact API: Domma.elements.modal(selector, options)
 */
export function createModalWrapper(selector, options = {}) {
    const element = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

    if (!element) return null;

    // Create Web Component wrapper around existing element
    const webComponent = document.createElement('domma-modal');

    // Transfer options as attributes
    for (const [key, value] of Object.entries(options)) {
        if (typeof value === 'function') {
            // Handle callbacks via events
            const eventName = key.replace(/^on/, '').toLowerCase();
            webComponent.addEventListener(eventName, (e) => {
                value(e.detail || webComponent);
            });
        } else if (typeof value === 'boolean') {
            if (value) {
                webComponent.setAttribute(toKebabCase(key), '');
            }
        } else if (key === 'buttons' && Array.isArray(value)) {
            webComponent._options = webComponent._options || {};
            webComponent._options.buttons = value;
        } else if (value !== null && value !== undefined) {
            webComponent.setAttribute(toKebabCase(key), String(value));
        }
    }

    // Move child elements into web component
    while (element.firstChild) {
        webComponent.appendChild(element.firstChild);
    }

    // Replace original element
    preserveIdentity(element, webComponent, 'modal');
    element.replaceWith(webComponent);

    // Return API-compatible object
    return {
        element: webComponent,
        options: webComponent._options,

        open() {
            webComponent.open();
            return this;
        },

        close() {
            webComponent.close();
            return this;
        },

        toggle() {
            webComponent.toggle();
            return this;
        },

        isOpen() {
            return webComponent.isOpen();
        },

        setTitle(title) {
            webComponent.setTitle(title);
            return this;
        },

        setContent(content) {
            webComponent.setContent(content);
            return this;
        },

        setButtons(buttons) {
            webComponent.setButtons(buttons);
            return this;
        },

        destroy() {
            webComponent.destroy();
        },

        remove() {
            webComponent.remove();
        }
    };
}

/**
 * Modal Factory Wrapper - Static API Pattern
 * Maintains exact API: ModalFactory.createModal(), .showModal()
 */
export class ModalFactoryWrapper {
    static _container = null;
    static _zIndexBase = 1050;
    static _activeModals = [];
    static _defaults = {
        size: 'large',
        title: '',
        content: '',
        buttons: [{id: 'close', text: 'Close', variant: 'secondary'}],
        backdrop: true,
        backdropClose: true,
        keyboard: true,
        animation: 'fade',
        animationDuration: 300,
        className: '',
        headerClass: '',
        bodyClass: '',
        footerClass: '',
        scrollable: false,
        onButtonClick: null,
        onOpen: null,
        onClose: null
    };

    static _ensureContainer() {
        if (!this._container) {
            this._container = document.createElement('div');
            this._container.className = 'dm-dialog-container';
            this._container.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 1040;';
            document.body.appendChild(this._container);
        }
        return this._container;
    }

    static _getNextZIndex() {
        return this._zIndexBase + (this._activeModals.length * 10);
    }

    static createModal(options = {}) {
        const opts = {...this._defaults, ...options};
        const container = this._ensureContainer();

        // Create Web Component
        const webComponent = document.createElement('domma-modal');
        webComponent.style.zIndex = this._getNextZIndex();
        webComponent.style.pointerEvents = 'auto';

        // Apply options as attributes
        if (opts.size) webComponent.setAttribute('size', opts.size);
        if (opts.title) webComponent.setAttribute('title', opts.title);
        if (opts.content) webComponent.setAttribute('content', opts.content);
        if (opts.backdrop !== undefined) webComponent.setAttribute('backdrop', String(opts.backdrop));
        if (opts.backdropClose !== undefined) webComponent.setAttribute('backdrop-close', String(opts.backdropClose));
        if (opts.keyboard !== undefined) webComponent.setAttribute('keyboard', String(opts.keyboard));
        if (opts.animation) webComponent.setAttribute('animation', opts.animation);
        if (opts.animationDuration !== undefined) webComponent.setAttribute('animation-duration', String(opts.animationDuration));
        if (opts.scrollable !== undefined) webComponent.setAttribute('scrollable', String(opts.scrollable));
        if (opts.className) webComponent.setAttribute('class-name', opts.className);
        if (opts.closeButton !== undefined) webComponent.setAttribute('close-button', String(opts.closeButton));

        // Handle buttons array
        if (opts.buttons && opts.buttons.length > 0) {
            webComponent._options = webComponent._options || {};
            webComponent._options.buttons = opts.buttons;
            webComponent._options.footerClass = opts.footerClass;
        }

        // Handle callbacks via events
        if (opts.onOpen) {
            webComponent.addEventListener('open', () => opts.onOpen(modalAPI));
        }
        if (opts.onClose) {
            webComponent.addEventListener('close', () => opts.onClose(modalAPI));
        }
        if (opts.onButtonClick) {
            webComponent.addEventListener('buttonclick', (e) => {
                opts.onButtonClick(e.detail.buttonId, modalAPI);
            });
        }

        // Append to container
        container.appendChild(webComponent);

        // Create API-compatible wrapper
        const modalAPI = {
            element: webComponent,
            _factoryCreated: true,

            open() {
                webComponent.open();
                ModalFactoryWrapper._activeModals.push(this);
                return this;
            },

            close() {
                webComponent.close();
                const index = ModalFactoryWrapper._activeModals.indexOf(this);
                if (index > -1) {
                    ModalFactoryWrapper._activeModals.splice(index, 1);
                }
                return this;
            },

            toggle() {
                webComponent.toggle();
                return this;
            },

            isOpen() {
                return webComponent.isOpen();
            },

            setTitle(title) {
                webComponent.setTitle(title);
                return this;
            },

            setContent(content) {
                webComponent.setContent(content);
                return this;
            },

            setButtons(buttons) {
                webComponent.setButtons(buttons);
                return this;
            },

            remove() {
                this.close();
                setTimeout(() => {
                    webComponent.remove();
                    const index = ModalFactoryWrapper._activeModals.indexOf(this);
                    if (index > -1) {
                        ModalFactoryWrapper._activeModals.splice(index, 1);
                    }
                }, opts.animationDuration);
                return this;
            },

            destroy() {
                this.remove();
            }
        };

        return modalAPI;
    }

    static showModal(options = {}) {
        return new Promise((resolve) => {
            const modal = this.createModal({
                ...options,
                onButtonClick: (buttonId, modalInstance) => {
                    if (options.onButtonClick) {
                        options.onButtonClick(buttonId, modalInstance);
                    }
                    resolve(buttonId);
                }
            });

            modal.open();
        });
    }
}

/**
 * Card Wrapper - Instance-based Pattern
 * Maintains exact API: Domma.elements.card(selector, options)
 */
export function createCardWrapper(selector, options = {}) {
    const element = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

    if (!element) return null;

    // Create Web Component wrapper
    const webComponent = document.createElement('domma-card');

    // Hoisted so callback closures can hand back the object this factory
    // returns. Listeners only ever run after the assignment at the end.
    let api = null;

    // Transfer options as attributes
    for (const [key, value] of Object.entries(options)) {
        if (typeof value === 'function') {
            // Handle callbacks via events.
            //
            // Callbacks receive the card instance, not e.detail. The component
            // emits with the base class's default detail of {}, and native
            // events (click) put the click COUNT in detail - so forwarding
            // e.detail handed callers an empty object or the number 1.
            const eventName = key.replace(/^on/, '').toLowerCase();
            webComponent.addEventListener(eventName, () => {
                value(api || webComponent);
            });
        } else if (typeof value === 'boolean') {
            if (value) {
                webComponent.setAttribute(toKebabCase(key), '');
            }
        } else if (value !== null && value !== undefined) {
            webComponent.setAttribute(toKebabCase(key), String(value));
        }
    }

    // Create header from title/icon options if provided
    if (options.title) {
        const header = document.createElement('div');
        header.setAttribute('slot', 'header');
        header.className = 'card-header';

        const titleElement = document.createElement('h4');
        titleElement.className = 'card-title';

        if (options.icon) {
            const iconSpan = document.createElement('span');
            iconSpan.setAttribute('data-icon', options.icon);
            iconSpan.className = 'card-title-icon';
            titleElement.appendChild(iconSpan);
        }

        titleElement.appendChild(document.createTextNode(options.title));
        header.appendChild(titleElement);
        webComponent.appendChild(header);
    }

    // Create body from content option if provided
    if (options.content) {
        const body = document.createElement('div');
        body.setAttribute('slot', 'body');
        body.className = 'card-body';
        // Use Domma sanitization if available
        const sanitizedContent = (typeof Domma !== 'undefined' && Domma.sanitize && typeof Domma.sanitize.sanitize === 'function')
            ? Domma.sanitize.sanitize(options.content)
            : options.content;
        body.innerHTML = sanitizedContent;
        webComponent.appendChild(body);
    }

    // Move child elements into web component
    // Preserve card-header, card-body, card-footer structure
    const children = Array.from(element.children);
    children.forEach(child => {
        if (child.classList.contains('card-header')) {
            child.setAttribute('slot', 'header');
        } else if (child.classList.contains('card-body')) {
            child.setAttribute('slot', 'body');
        } else if (child.classList.contains('card-footer')) {
            child.setAttribute('slot', 'footer');
        }
        webComponent.appendChild(child);
    });

    // Replace original element
    preserveIdentity(element, webComponent, 'card');
    element.replaceWith(webComponent);

    // Return API-compatible object
    api = {
        element: webComponent,
        options: webComponent._options,

        collapse() {
            webComponent.collapse();
            return this;
        },

        expand() {
            webComponent.expand();
            return this;
        },

        toggle() {
            webComponent.toggle();
            return this;
        },

        isCollapsed() {
            return webComponent.isCollapsed();
        },

        setShadow(size) {
            webComponent.setShadow(size);
            return this;
        },

        setHoverable(hoverable) {
            webComponent.setHoverable(hoverable);
            return this;
        },

        setContent(content) {
            webComponent.setContent(content);
            return this;
        },

        getBody() {
            return webComponent.getBody();
        },

        updateHeight() {
            webComponent.updateHeight();
            return this;
        },

        destroy() {
            webComponent.destroy();
        }
    };

    return api;
}
