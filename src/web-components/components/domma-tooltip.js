/**
 * Domma Tooltip Web Component
 * Contextual popup for additional information
 */

import { DommaElement, getThemeVariables } from '../base/domma-element.js';

export class DommaTooltip extends DommaElement {
    static defaults = {
        content: '',
        position: 'top',          // 'top', 'bottom', 'left', 'right'
        trigger: 'hover',         // 'hover', 'click', 'focus'
        delay: 0,                 // Show delay in ms
        hideDelay: 0,             // Hide delay in ms
        animation: true,
        offset: 8,                // Distance from element in px
        html: false,
        visible: false
    };

    static get observedAttributes() {
        return ['content', 'position', 'trigger', 'delay', 'hide-delay', 'animation', 'offset', 'html', 'visible'];
    }

    constructor() {
        super();
        this._tooltip = null;
        this._isVisible = false;
        this._showTimeout = null;
        this._hideTimeout = null;
    }

    _injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            ${getThemeVariables()}

            :host {
                display: contents;
            }

            .tooltip-wrapper {
                position: relative;
                display: inline-block;
            }

            .tooltip {
                position: fixed;
                z-index: 1000;
                padding: 0.5rem 0.75rem;
                background: var(--dm-text, #212529);
                color: var(--dm-surface, #fff);
                border-radius: 4px;
                font-size: 0.875rem;
                line-height: 1.4;
                max-width: 250px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.15s ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }

            .tooltip.show {
                opacity: 1;
            }

            /* Arrow */
            .tooltip::before {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border: 5px solid transparent;
            }

            .tooltip[data-position="top"]::before {
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                border-top-color: var(--dm-text, #212529);
            }

            .tooltip[data-position="bottom"]::before {
                top: -10px;
                left: 50%;
                transform: translateX(-50%);
                border-bottom-color: var(--dm-text, #212529);
            }

            .tooltip[data-position="left"]::before {
                right: -10px;
                top: 50%;
                transform: translateY(-50%);
                border-left-color: var(--dm-text, #212529);
            }

            .tooltip[data-position="right"]::before {
                left: -10px;
                top: 50%;
                transform: translateY(-50%);
                border-right-color: var(--dm-text, #212529);
            }
        `;
        this.shadowRoot.appendChild(style);
    }

    _render() {
        // Create wrapper for slotted content
        const wrapper = document.createElement('div');
        wrapper.className = 'tooltip-wrapper';
        wrapper.setAttribute('part', 'wrapper');

        const slot = document.createElement('slot');
        wrapper.appendChild(slot);

        this.shadowRoot.appendChild(wrapper);
        this._wrapper = wrapper;
    }

    _bindEvents() {
        const { trigger } = this._options;

        if (trigger === 'hover') {
            this._addEventListener(this._wrapper, 'mouseenter', () => this.show());
            this._addEventListener(this._wrapper, 'mouseleave', () => this.hide());
        } else if (trigger === 'click') {
            this._addEventListener(this._wrapper, 'click', () => this.toggle());
        } else if (trigger === 'focus') {
            this._addEventListener(this._wrapper, 'focusin', () => this.show());
            this._addEventListener(this._wrapper, 'focusout', () => this.hide());
        }
    }

    _onAttributeChange(name, oldValue, newValue) {
        switch (name) {
            case 'content':
                if (this._tooltip && this._isVisible) {
                    this._updateTooltipContent();
                }
                break;

            case 'position':
                if (this._tooltip && this._isVisible) {
                    this._positionTooltip();
                }
                break;

            case 'trigger':
                // Re-bind events with new trigger
                this._cleanup();
                this._bindEvents();
                break;

            case 'visible':
                const isVisible = newValue === '' || newValue === 'true';
                if (isVisible) {
                    this.show();
                } else {
                    this.hide();
                }
                break;
        }
    }

    _onConnect() {
        // Check if initially visible
        if (this._options.visible) {
            this.show();
        }
    }

    _onDisconnect() {
        // Clean up tooltip on disconnect
        clearTimeout(this._showTimeout);
        clearTimeout(this._hideTimeout);
        if (this._tooltip) {
            this._tooltip.remove();
            this._tooltip = null;
        }
    }

    // Public API
    show() {
        clearTimeout(this._hideTimeout);

        if (this._isVisible) return this;

        const { delay } = this._options;

        this._showTimeout = setTimeout(() => {
            this._createTooltip();
            this._positionTooltip();
            this._emit('show');
        }, delay);

        return this;
    }

    hide() {
        clearTimeout(this._showTimeout);

        if (!this._isVisible) return this;

        const { hideDelay } = this._options;

        this._hideTimeout = setTimeout(() => {
            if (this._tooltip) {
                this._tooltip.classList.remove('show');
                this._tooltip.style.opacity = '0';

                setTimeout(() => {
                    if (this._tooltip) {
                        this._tooltip.remove();
                        this._tooltip = null;
                    }
                    this._isVisible = false;
                    this._emit('hide');
                }, 150);
            }
        }, hideDelay);

        return this;
    }

    toggle() {
        return this._isVisible ? this.hide() : this.show();
    }

    isVisible() {
        return this._isVisible;
    }

    setContent(content) {
        this.setAttribute('content', content);
        return this;
    }

    setPosition(position) {
        this.setAttribute('position', position);
        return this;
    }

    _createTooltip() {
        const { content, position, html } = this._options;

        this._tooltip = document.createElement('div');
        this._tooltip.className = 'domma-tooltip';
        this._tooltip.setAttribute('data-position', position);

        // Apply inline styles since tooltip is rendered outside Shadow DOM
        this._applyTooltipStyles();

        if (html) {
            // Sanitize HTML content if DOMPurify is available
            const sanitizedContent = (typeof DOMPurify !== 'undefined')
                ? DOMPurify.sanitize(content)
                : content;
            this._tooltip.innerHTML = sanitizedContent;
        } else {
            this._tooltip.textContent = content;
        }

        document.body.appendChild(this._tooltip);

        // Trigger reflow for animation
        this._tooltip.offsetHeight;
        this._tooltip.classList.add('show');

        // Set opacity inline (since we're using inline styles, CSS classes won't override)
        this._tooltip.style.opacity = '1';

        this._isVisible = true;
    }

    _applyTooltipStyles() {
        // Base styles for the tooltip
        Object.assign(this._tooltip.style, {
            position: 'fixed',
            zIndex: '1000',
            padding: '0.5rem 0.75rem',
            background: 'var(--dm-text, #212529)',
            color: 'var(--dm-surface, #fff)',
            borderRadius: '4px',
            fontSize: '0.875rem',
            lineHeight: '1.4',
            maxWidth: '250px',
            pointerEvents: 'none',
            transition: 'opacity 0.15s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        });

        // Set initial opacity via style (will be overridden by .show class)
        this._tooltip.style.opacity = '0';

        // Add arrow using ::before (via inline style won't work, so inject a style tag)
        this._injectGlobalTooltipStyles();
    }

    _injectGlobalTooltipStyles() {
        // Only inject once per page
        if (document.getElementById('domma-tooltip-styles')) return;

        const style = document.createElement('style');
        style.id = 'domma-tooltip-styles';
        style.textContent = `
            .domma-tooltip.show {
                opacity: 1 !important;
            }

            /* Arrow */
            .domma-tooltip::before {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border: 5px solid transparent;
            }

            .domma-tooltip[data-position="top"]::before {
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                border-top-color: var(--dm-text, #212529);
            }

            .domma-tooltip[data-position="bottom"]::before {
                top: -10px;
                left: 50%;
                transform: translateX(-50%);
                border-bottom-color: var(--dm-text, #212529);
            }

            .domma-tooltip[data-position="left"]::before {
                right: -10px;
                top: 50%;
                transform: translateY(-50%);
                border-left-color: var(--dm-text, #212529);
            }

            .domma-tooltip[data-position="right"]::before {
                left: -10px;
                top: 50%;
                transform: translateY(-50%);
                border-right-color: var(--dm-text, #212529);
            }
        `;
        document.head.appendChild(style);
    }

    _updateTooltipContent() {
        const { content, html } = this._options;

        if (html) {
            // Sanitize HTML content if DOMPurify is available
            const sanitizedContent = (typeof DOMPurify !== 'undefined')
                ? DOMPurify.sanitize(content)
                : content;
            this._tooltip.innerHTML = sanitizedContent;
        } else {
            this._tooltip.textContent = content;
        }

        this._positionTooltip();
    }

    _positionTooltip() {
        if (!this._tooltip || !this._wrapper) return;

        const { position, offset } = this._options;
        const rect = this._wrapper.getBoundingClientRect();
        const tooltipRect = this._tooltip.getBoundingClientRect();

        let top, left;

        switch (position) {
            case 'top':
                top = rect.top - tooltipRect.height - offset;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = rect.bottom + offset;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.left - tooltipRect.width - offset;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.right + offset;
                break;
            default:
                top = rect.top - tooltipRect.height - offset;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
        }

        // Keep tooltip within viewport (fixed positioning uses viewport coordinates)
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (left < 0) left = 8;
        if (left + tooltipRect.width > viewportWidth) {
            left = viewportWidth - tooltipRect.width - 8;
        }
        if (top < 0) top = 8;
        if (top + tooltipRect.height > viewportHeight) {
            top = viewportHeight - tooltipRect.height - 8;
        }

        this._tooltip.style.top = top + 'px';
        this._tooltip.style.left = left + 'px';
    }
}

// Register component
if (!customElements.get('domma-tooltip')) {
    customElements.define('domma-tooltip', DommaTooltip);
}
