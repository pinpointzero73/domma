/**
 * Legacy Wrappers for Domma Web Components
 * Maintain backwards compatibility with existing API
 */

import { DommaBadge } from '../components/domma-badge.js';
import { DommaTooltip } from '../components/domma-tooltip.js';
import { DommaLoader } from '../components/domma-loader.js';
import { DommaBackToTop } from '../components/domma-back-to-top.js';

/**
 * Convert camelCase to kebab-case
 */
function toKebabCase(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
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

        // Create Web Component wrapper
        const webComponent = document.createElement('domma-tooltip');

        // Apply options as attributes or event listeners
        for (const [key, value] of Object.entries(options)) {
            if (typeof value === 'function') {
                // Handle callbacks via events
                const eventName = key.replace(/^on/, '').toLowerCase();
                webComponent.addEventListener(eventName, (e) => {
                    value(webComponent);
                });
            } else if (key === 'delay' && typeof value === 'object') {
                // Handle delay object {show: X, hide: Y}
                if (value.show !== undefined) {
                    webComponent.setAttribute('delay', String(value.show));
                }
                if (value.hide !== undefined) {
                    webComponent.setAttribute('hide-delay', String(value.hide));
                }
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

        // Wrap the original element
        el.parentNode.insertBefore(webComponent, el);
        webComponent.appendChild(el);

        // Store reference for retrieval
        webComponent._dommaComponent = webComponent;

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
 */
export function createBackToTopWrapper(selector, options = {}) {
    // BackToTop can work without a selector (auto-creates button)
    let element = null;
    if (selector) {
        element = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;
    }

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

    // If selector provided, replace it; otherwise append to body
    if (element) {
        element.replaceWith(webComponent);
    } else {
        document.body.appendChild(webComponent);
    }

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
