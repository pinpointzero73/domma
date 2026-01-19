/**
 * Domma BackToTop Web Component
 * Scroll-to-top button that appears after scrolling
 */

import { DommaElement, getThemeVariables } from '../base/domma-element.js';

export class DommaBackToTop extends DommaElement {
    static defaults = {
        showAfter: null,        // Scroll distance to show (null = viewport height)
        duration: 300,          // Scroll animation duration in ms
        position: 'bottom-right', // Position: bottom-right, bottom-left
        offset: 16,             // Distance from edge in px
        target: null,           // Scroll container to monitor (null = window)
        zIndex: 1000,
        visible: false          // Initial visibility state
    };

    static get observedAttributes() {
        return ['show-after', 'duration', 'position', 'offset', 'target', 'z-index', 'visible'];
    }

    constructor() {
        super();
        this._isVisible = false;
        this._isScrolling = false;
        this._scrollContainer = null;
        this._scrollHandler = null;
    }

    _injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            ${getThemeVariables()}

            :host {
                display: block;
                position: fixed;
                z-index: var(--z-index, 1000);
            }

            :host([hidden]) {
                display: none;
            }

            .back-to-top-button {
                padding: 0.5rem;
                background: var(--dm-surface, #fff);
                border: 1px solid var(--dm-border, #dee2e6);
                border-radius: 9999px;
                cursor: pointer;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transform: translateY(10px);
                transition: opacity 0.2s ease, transform 0.15s ease, visibility 0.2s, background 0.2s ease, box-shadow 0.15s ease;
            }

            .back-to-top-button.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .back-to-top-button:hover {
                background: var(--dm-hover-bg, rgba(0,0,0,0.04));
                transform: translateY(0) scale(1.1);
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }

            svg {
                color: var(--dm-text, #212529);
            }
        `;
        this.shadowRoot.appendChild(style);
    }

    _render() {
        const { position, offset, zIndex } = this._options;
        const isLeft = position === 'bottom-left';

        // Apply host positioning
        this.style.position = 'fixed';
        this.style.bottom = `${offset}px`;
        this.style[isLeft ? 'left' : 'right'] = `${offset}px`;
        this.style.zIndex = zIndex;

        // Create button with SVG using safe DOM methods
        this._button = document.createElement('button');
        this._button.className = 'back-to-top-button';
        this._button.setAttribute('part', 'button');
        this._button.setAttribute('title', 'Back to top');
        this._button.setAttribute('aria-label', 'Scroll back to top');

        // Create SVG safely
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M18 15l-6-6-6 6');
        svg.appendChild(path);

        this._button.appendChild(svg);
        this.shadowRoot.appendChild(this._button);
    }

    _bindEvents() {
        // Click handler
        this._addEventListener(this._button, 'click', (e) => {
            e.preventDefault();
            this.scroll();
        });

        // Setup scroll monitoring
        this._setupScrollMonitoring();
    }

    _setupScrollMonitoring() {
        // Cleanup existing listener
        if (this._scrollHandler) {
            const oldTarget = this._scrollContainer || window;
            oldTarget.removeEventListener('scroll', this._scrollHandler);
        }

        // Setup scroll container
        if (this._options.target) {
            this._scrollContainer = typeof this._options.target === 'string'
                ? document.querySelector(this._options.target)
                : this._options.target;
        } else {
            this._scrollContainer = null;
        }

        // Attach scroll listener
        const scrollTarget = this._scrollContainer || window;
        this._scrollHandler = () => this._checkVisibility();
        scrollTarget.addEventListener('scroll', this._scrollHandler, { passive: true });

        // Initial check
        this._checkVisibility();
    }

    _checkVisibility() {
        const threshold = this._options.showAfter ?? (this._scrollContainer ? this._scrollContainer.clientHeight : window.innerHeight);
        const scrollY = this._scrollContainer
            ? this._scrollContainer.scrollTop
            : window.scrollY;

        const shouldShow = scrollY > threshold;

        if (shouldShow && !this._isVisible) {
            this.show();
        } else if (!shouldShow && this._isVisible) {
            this.hide();
        }

        // Note: Removed _emit('scroll') here as it was causing infinite recursion
        // The scroll event would trigger another visibility check, creating a loop
    }

    _onAttributeChange(name, oldValue, newValue) {
        switch (name) {
            case 'position':
            case 'offset':
            case 'z-index':
                const { position, offset, zIndex } = this._options;
                const isLeft = position === 'bottom-left';
                this.style.bottom = `${offset}px`;
                this.style.left = isLeft ? `${offset}px` : '';
                this.style.right = isLeft ? '' : `${offset}px`;
                this.style.zIndex = zIndex;
                break;

            case 'target':
            case 'show-after':
                this._setupScrollMonitoring();
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
        // Setup scroll monitoring when connected
        this._setupScrollMonitoring();
    }

    _onDisconnect() {
        // Cleanup scroll listener
        if (this._scrollHandler) {
            const scrollTarget = this._scrollContainer || window;
            scrollTarget.removeEventListener('scroll', this._scrollHandler);
        }
    }

    // Public API
    scroll() {
        if (this._isScrolling) return this;

        this._isScrolling = true;
        const start = this._scrollContainer
            ? this._scrollContainer.scrollTop
            : window.scrollY;
        const startTime = performance.now();
        const duration = this._options.duration;

        // easeOutQuad: fast start, gentle end
        const easeOutQuad = t => t * (2 - t);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuad(progress);

            if (this._scrollContainer) {
                this._scrollContainer.scrollTop = start * (1 - eased);
            } else {
                window.scrollTo(0, start * (1 - eased));
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this._isScrolling = false;
            }
        };

        requestAnimationFrame(animate);
        return this;
    }

    show() {
        if (this._isVisible) return this;

        this._isVisible = true;
        this._button.classList.add('visible');
        this._emit('show');
        return this;
    }

    hide() {
        if (!this._isVisible) return this;

        this._isVisible = false;
        this._button.classList.remove('visible');
        this._emit('hide');
        return this;
    }

    toggle() {
        return this._isVisible ? this.hide() : this.show();
    }

    isVisible() {
        return this._isVisible;
    }

    getButton() {
        return this._button;
    }

    setShowAfter(value) {
        this.setAttribute('show-after', String(value));
        return this;
    }

    setPosition(position) {
        this.setAttribute('position', position);
        return this;
    }

    setOffset(offset) {
        this.setAttribute('offset', String(offset));
        return this;
    }
}

// Register component
if (!customElements.get('domma-back-to-top')) {
    customElements.define('domma-back-to-top', DommaBackToTop);
}
