/**
 * Badge Web Component
 * Displays a small label or notification badge
 */

import { DommaElement, getThemeVariables } from '../base/domma-element.js';
import { baseStyles, buttonStyles } from '../styles/shared-styles.js';

export class DommaBadge extends DommaElement {
    static defaults = {
        variant: 'primary',
        size: 'medium',
        pill: false,
        outline: false,
        removable: false
    };

    static get observedAttributes() {
        return ['variant', 'size', 'pill', 'outline', 'removable'];
    }

    static variants = {
        primary: { bg: 'var(--dm-primary, #4f46e5)', color: '#fff' },
        secondary: { bg: 'var(--dm-secondary, #6b7280)', color: '#fff' },
        success: { bg: 'var(--dm-success, #10b981)', color: '#fff' },
        danger: { bg: 'var(--dm-danger, #ef4444)', color: '#fff' },
        warning: { bg: 'var(--dm-warning, #f59e0b)', color: '#000' },
        info: { bg: 'var(--dm-info, #3b82f6)', color: '#fff' },
        light: { bg: 'var(--dm-background-alt, #f3f4f6)', color: 'var(--dm-text, #111)' },
        dark: { bg: 'var(--dm-surface-overlay, #1f2937)', color: 'var(--dm-white, #fff)' }
    };

    static sizes = {
        small: { padding: '2px 6px', fontSize: '10px' },
        medium: { padding: '4px 10px', fontSize: '12px' },
        large: { padding: '6px 14px', fontSize: '14px' }
    };

    _getStyles() {
        return `
            ${getThemeVariables()}
            ${baseStyles}
            ${buttonStyles}

            :host {
                display: inline-flex;
            }

            .badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-weight: 500;
                line-height: 1;
                transition: all 150ms ease;
            }

            .badge-clickable {
                cursor: pointer;
            }

            .remove-btn {
                margin-left: 2px;
                width: 14px;
                height: 14px;
                font-size: 16px;
                line-height: 1;
                opacity: 0.7;
            }

            .remove-btn:hover {
                opacity: 1;
            }
        `;
    }

    _render() {
        const { variant, size, pill, outline, removable } = this._options;
        const variantStyle = DommaBadge.variants[variant] || DommaBadge.variants.primary;
        const sizeStyle = DommaBadge.sizes[size] || DommaBadge.sizes.medium;

        // Create badge element
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.setAttribute('part', 'badge');

        // Apply styles
        const borderRadius = pill ? '9999px' : '4px';
        const bgColor = outline ? 'transparent' : variantStyle.bg;
        const textColor = outline ? variantStyle.bg : variantStyle.color;
        const border = outline ? `1px solid ${variantStyle.bg}` : 'none';

        badge.style.cssText = `
            background: ${bgColor};
            color: ${textColor};
            border: ${border};
            border-radius: ${borderRadius};
            padding: ${sizeStyle.padding};
            font-size: ${sizeStyle.fontSize};
        `;

        // Slot for content
        const slot = document.createElement('slot');
        badge.appendChild(slot);

        // Add remove button if needed
        if (removable) {
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.setAttribute('part', 'remove-btn');
            removeBtn.setAttribute('aria-label', 'Remove');
            removeBtn.textContent = '×';

            this._addEventListener(removeBtn, 'click', (e) => {
                e.stopPropagation();
                this._emit('remove', { badge: this });
                this.remove();
            });

            badge.appendChild(removeBtn);
        }

        this._badge = badge;
        this.shadowRoot.appendChild(badge);
    }

    _bindEvents() {
        // Handle click on badge
        this._addEventListener(this._badge, 'click', (e) => {
            // Only emit if not clicking the remove button
            if (!e.target.classList.contains('remove-btn')) {
                this._emit('click', { badge: this, event: e });
            }
        });
    }

    _onAttributeChange(name, oldValue, newValue) {
        // Re-render on attribute change
        this.shadowRoot.textContent = '';
        this._injectStyles();
        this._render();
        this._bindEvents();
    }

    _applyOptions() {
        // Re-render when options are programmatically updated
        this.shadowRoot.textContent = '';
        this._injectStyles();
        this._render();
        this._bindEvents();
    }

    // Public API methods for wrapper compatibility
    setVariant(variant) {
        this.setAttribute('variant', variant);
        return this;
    }

    setSize(size) {
        this.setAttribute('size', size);
        return this;
    }

    setText(text) {
        this.textContent = text;
        return this;
    }
}

// Register the component
if (!customElements.get('domma-badge')) {
    customElements.define('domma-badge', DommaBadge);
}
