/**
 * NumberBadge Web Component
 * Displays a positioned notification counter on top of its slotted content
 */

import { DommaElement, getThemeVariables } from '../base/domma-element.js';
import { baseStyles } from '../styles/shared-styles.js';

export class DommaNumberBadge extends DommaElement {
    static defaults = {
        count: 0,
        variant: 'danger',
        dot: false,
        pulse: false,
        borderColor: null
    };

    static get observedAttributes() {
        return ['count', 'variant', 'dot', 'pulse', 'border-color'];
    }

    static variants = {
        primary:   { bg: 'var(--dm-primary, #4f46e5)',         color: '#fff' },
        secondary: { bg: 'var(--dm-background-alt, #f3f4f6)',  color: 'var(--dm-text, #111)' },
        success:   { bg: 'var(--dm-success, #10b981)',         color: '#fff' },
        danger:    { bg: 'var(--dm-danger, #ef4444)',          color: '#fff' },
        warning:   { bg: 'var(--dm-warning, #f59e0b)',         color: '#000' },
        info:      { bg: 'var(--dm-info, #3b82f6)',            color: '#fff' },
        light:     { bg: 'var(--dm-background-alt, #f3f4f6)',  color: 'var(--dm-text, #111)' },
        dark:      { bg: 'var(--dm-surface-overlay, #1f2937)', color: '#fff' }
    };

    _getStyles() {
        return `
            ${getThemeVariables()}
            ${baseStyles}

            :host {
                position: relative;
                display: inline-flex;
            }

            .counter {
                position: absolute;
                top: -6px;
                right: -8px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 1.25rem;
                height: 1.25rem;
                padding: 0 0.3em;
                font-size: 0.65rem;
                font-weight: 700;
                font-variant-numeric: tabular-nums;
                line-height: 1;
                border-radius: 9999px;
                border: 2px solid var(--dm-background, #fff);
                z-index: 1;
                transition: transform 150ms ease;
            }

            .counter.dot {
                top: -2px;
                right: -2px;
                min-width: 0.5rem;
                height: 0.5rem;
                padding: 0;
            }

            .counter.hidden {
                display: none;
            }

            @keyframes badge-pulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                50%       { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
            }

            .counter.pulse {
                animation: badge-pulse 2s ease-in-out infinite;
            }
        `;
    }

    _render() {
        const { count, variant, dot, pulse, borderColor } = this._options;
        const variantStyle = DommaNumberBadge.variants[variant] || DommaNumberBadge.variants.danger;

        // Slot for the child element being badged
        const slot = document.createElement('slot');

        // Counter span
        const counter = document.createElement('span');
        counter.className = 'counter';
        counter.setAttribute('part', 'counter');
        counter.setAttribute('aria-live', 'polite');
        counter.setAttribute('role', 'status');

        // Apply variant colours
        counter.style.backgroundColor = variantStyle.bg;
        counter.style.color = variantStyle.color;

        // Custom border colour
        if (borderColor) {
            counter.style.borderColor = borderColor;
        }

        // Dot mode
        if (dot) {
            counter.classList.add('dot');
            counter.textContent = '';
        } else {
            counter.textContent = String(count);
        }

        // Pulse animation
        if (pulse) {
            counter.classList.add('pulse');
        }

        // Hide when count is zero and not in dot mode
        if (!dot && Number(count) === 0) {
            counter.classList.add('hidden');
        }

        this._counter = counter;
        this.shadowRoot.appendChild(slot);
        this.shadowRoot.appendChild(counter);
    }

    _onAttributeChange(name, oldValue, newValue) {
        this.shadowRoot.textContent = '';
        this._injectStyles();
        this._render();
    }

    _applyOptions() {
        this.shadowRoot.textContent = '';
        this._injectStyles();
        this._render();
    }

    // Public API
    setCount(count) {
        this._options.count = Number(count);
        this.setAttribute('count', String(count));
        return this;
    }

    increment(by = 1) {
        const next = (Number(this._options.count) || 0) + by;
        this.setCount(next);
        return this;
    }

    decrement(by = 1) {
        const next = Math.max(0, (Number(this._options.count) || 0) - by);
        this.setCount(next);
        return this;
    }

    setDot(dot) {
        this._options.dot = dot;
        if (dot) {
            this.setAttribute('dot', '');
        } else {
            this.removeAttribute('dot');
        }
        return this;
    }

    setVariant(variant) {
        this.setAttribute('variant', variant);
        return this;
    }

    setPulse(pulse) {
        this._options.pulse = pulse;
        if (pulse) {
            this.setAttribute('pulse', '');
        } else {
            this.removeAttribute('pulse');
        }
        return this;
    }

    getCount() {
        return Number(this._options.count) || 0;
    }
}

// Register the component
if (!customElements.get('domma-number-badge')) {
    customElements.define('domma-number-badge', DommaNumberBadge);
}
