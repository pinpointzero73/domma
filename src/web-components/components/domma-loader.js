/**
 * Domma Loader Web Component
 * Loading indicators with multiple animation types
 */

import { DommaElement, getThemeVariables } from '../base/domma-element.js';

export class DommaLoader extends DommaElement {
    static defaults = {
        type: 'spinner',        // 'spinner', 'dots', 'pulse', 'bars'
        size: 'medium',         // 'small', 'medium', 'large', or number (px)
        color: 'primary',       // 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'white', 'dark', or hex
        overlay: false,         // Show with backdrop overlay
        text: '',               // Optional loading text
        centered: true,         // Centre in container
        visible: true           // Show immediately
    };

    static sizes = {
        small: 24,
        medium: 40,
        large: 64
    };

    static colors = {
        primary: '#6495ED',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        white: '#ffffff',
        dark: '#343a40'
    };

    static get observedAttributes() {
        return ['type', 'size', 'color', 'overlay', 'text', 'centered', 'visible'];
    }

    constructor() {
        super();
        this._visible = false;
    }

    _getSize() {
        const { size } = this._options;
        if (typeof size === 'number') return size;
        if (!isNaN(size)) return parseInt(size, 10);
        return DommaLoader.sizes[size] || DommaLoader.sizes.medium;
    }

    _getColor() {
        const { color } = this._options;
        return DommaLoader.colors[color] || color;
    }

    _injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            ${getThemeVariables()}

            :host {
                display: block;
                position: relative;
            }

            :host([hidden]) {
                display: none;
            }

            .loader-wrapper {
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
            }

            .loader-wrapper.hidden {
                display: none !important;
            }

            .loader-wrapper.overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000;
            }

            .loader-wrapper.centered {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .loader-text {
                color: var(--loader-text-color, var(--dm-text, #212529));
                font-size: var(--dm-text-sm, 0.875rem);
            }

            .loader-wrapper.overlay .loader-text {
                color: #ffffff;
            }

            /* Spinner */
            .loader-spinner {
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            /* Dots */
            .loader-dots {
                display: flex;
                gap: var(--dot-gap);
            }

            .loader-dots span {
                border-radius: 50%;
                animation: bounce 1.4s ease-in-out infinite both;
            }

            .loader-dots span:nth-child(1) { animation-delay: 0s; }
            .loader-dots span:nth-child(2) { animation-delay: 0.16s; }
            .loader-dots span:nth-child(3) { animation-delay: 0.32s; }

            @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }

            /* Pulse */
            .loader-pulse {
                border-radius: 50%;
                animation: pulse 1.2s ease-in-out infinite;
            }

            @keyframes pulse {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(1); opacity: 0; }
            }

            /* Bars */
            .loader-bars {
                display: flex;
                align-items: center;
                gap: var(--bar-gap);
            }

            .loader-bars span {
                border-radius: 2px;
                animation: bars 1s ease-in-out infinite;
            }

            .loader-bars span:nth-child(1) { animation-delay: 0s; }
            .loader-bars span:nth-child(2) { animation-delay: 0.1s; }
            .loader-bars span:nth-child(3) { animation-delay: 0.2s; }
            .loader-bars span:nth-child(4) { animation-delay: 0.3s; }

            @keyframes bars {
                0%, 40%, 100% { transform: scaleY(0.4); }
                20% { transform: scaleY(1); }
            }
        `;
        this.shadowRoot.appendChild(style);
    }

    _render() {
        const size = this._getSize();
        const color = this._getColor();
        const { type, overlay, text, centered, visible } = this._options;

        // Create wrapper
        this._wrapper = document.createElement('div');
        this._wrapper.className = 'loader-wrapper';
        this._wrapper.setAttribute('part', 'wrapper');
        this._wrapper.setAttribute('role', 'status');
        this._wrapper.setAttribute('aria-live', 'polite');

        if (overlay) this._wrapper.classList.add('overlay');
        if (centered && !overlay) this._wrapper.classList.add('centered');
        if (!visible) this._wrapper.classList.add('hidden');

        // Create loader element
        this._loaderEl = document.createElement('div');
        this._loaderEl.className = `loader-${type}`;
        this._loaderEl.setAttribute('part', 'loader');

        // Render specific type
        switch (type) {
            case 'dots':
                this._renderDots(size, color);
                break;
            case 'pulse':
                this._renderPulse(size, color);
                break;
            case 'bars':
                this._renderBars(size, color);
                break;
            case 'spinner':
            default:
                this._renderSpinner(size, color);
        }

        this._wrapper.appendChild(this._loaderEl);

        // Add text if provided
        if (text) {
            this._textEl = document.createElement('span');
            this._textEl.className = 'loader-text';
            this._textEl.setAttribute('part', 'text');
            this._textEl.textContent = text;
            this._wrapper.appendChild(this._textEl);
        }

        this.shadowRoot.appendChild(this._wrapper);
        this._visible = visible;
    }

    _renderSpinner(size, color) {
        const borderWidth = Math.max(2, size / 10);
        this._loaderEl.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            border: ${borderWidth}px solid ${color};
            border-top-color: transparent;
        `;
    }

    _renderDots(size, color) {
        const dotSize = size / 4;
        const gap = dotSize / 2;

        this._loaderEl.style.setProperty('--dot-gap', `${gap}px`);

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dot.style.cssText = `
                width: ${dotSize}px;
                height: ${dotSize}px;
                background: ${color};
            `;
            this._loaderEl.appendChild(dot);
        }
    }

    _renderPulse(size, color) {
        this._loaderEl.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
        `;
    }

    _renderBars(size, color) {
        const barWidth = size / 6;
        const barHeight = size;
        const gap = barWidth / 2;

        this._loaderEl.style.cssText = `
            height: ${barHeight}px;
        `;
        this._loaderEl.style.setProperty('--bar-gap', `${gap}px`);

        for (let i = 0; i < 4; i++) {
            const bar = document.createElement('span');
            bar.style.cssText = `
                width: ${barWidth}px;
                height: 100%;
                background: ${color};
            `;
            this._loaderEl.appendChild(bar);
        }
    }

    _onAttributeChange(name, oldValue, newValue) {
        if (!this._wrapper) return;

        switch (name) {
            case 'type':
            case 'size':
            case 'color':
                // Full re-render for these changes
                this._loaderEl.remove();
                if (this._textEl) this._textEl.remove();

                this._loaderEl = document.createElement('div');
                this._loaderEl.className = `loader-${this._options.type}`;
                this._loaderEl.setAttribute('part', 'loader');

                const size = this._getSize();
                const color = this._getColor();

                switch (this._options.type) {
                    case 'dots':
                        this._renderDots(size, color);
                        break;
                    case 'pulse':
                        this._renderPulse(size, color);
                        break;
                    case 'bars':
                        this._renderBars(size, color);
                        break;
                    default:
                        this._renderSpinner(size, color);
                }

                this._wrapper.insertBefore(this._loaderEl, this._wrapper.firstChild);
                break;

            case 'text':
                if (newValue) {
                    if (!this._textEl) {
                        this._textEl = document.createElement('span');
                        this._textEl.className = 'loader-text';
                        this._textEl.setAttribute('part', 'text');
                        this._wrapper.appendChild(this._textEl);
                    }
                    this._textEl.textContent = newValue;
                } else if (this._textEl) {
                    this._textEl.remove();
                    this._textEl = null;
                }
                break;

            case 'overlay':
                this._wrapper.classList.toggle('overlay', newValue === '' || newValue === 'true');
                break;

            case 'centered':
                this._wrapper.classList.toggle('centered', newValue === '' || newValue === 'true');
                break;

            case 'visible':
                const isVisible = newValue === '' || newValue === 'true';
                this._visible = isVisible;
                this._wrapper.classList.toggle('hidden', !isVisible);
                break;
        }
    }

    // Public API
    show() {
        this._visible = true;
        this._wrapper.classList.remove('hidden');
        this.setAttribute('visible', '');
        this._emit('show');
        return this;
    }

    hide() {
        this._visible = false;
        this._wrapper.classList.add('hidden');
        this.removeAttribute('visible');
        this._emit('hide');
        return this;
    }

    toggle() {
        return this._visible ? this.hide() : this.show();
    }

    isVisible() {
        return this._visible;
    }

    setText(text) {
        this.setAttribute('text', text);
        return this;
    }

    setType(type) {
        this.setAttribute('type', type);
        return this;
    }

    setSize(size) {
        this.setAttribute('size', String(size));
        return this;
    }

    setColor(color) {
        this.setAttribute('color', color);
        return this;
    }
}

// Register component
if (!customElements.get('domma-loader')) {
    customElements.define('domma-loader', DommaLoader);
}
