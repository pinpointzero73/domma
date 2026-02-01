import { DommaElement, getThemeVariables } from '../../../../../src/web-components/base/domma-element.js';

/**
 * Star Rating Web Component
 * Interactive 5-star rating with hover effects
 *
 * Usage:
 *   <dm-star-rating value="3" max="5"></dm-star-rating>
 *
 * Attributes:
 *   - value: Current rating (0-max)
 *   - max: Maximum number of stars (default: 5)
 *   - readonly: Boolean for read-only display (default: false)
 *   - size: Star size in pixels (default: 24)
 *   - color: Active star color (default: #fbbf24)
 *
 * Events:
 *   - change: Fired when rating changes, detail: { value }
 */
export class StarRating extends DommaElement {
    static defaults = {
        value: 0,
        max: 5,
        readonly: false,
        size: 24,
        color: '#fbbf24'
    };

    static get observedAttributes() {
        return ['value', 'max', 'readonly', 'size', 'color'];
    }

    _getStyles() {
        return `
            ${getThemeVariables()}

            :host {
                display: inline-block;
            }

            .stars-container {
                display: flex;
                gap: 4px;
                align-items: center;
            }

            .star {
                cursor: pointer;
                font-size: var(--star-size, 24px);
                color: var(--dm-gray-300, #dee2e6);
                transition: all var(--dm-transition-fast, 150ms);
                user-select: none;
                line-height: 1;
            }

            .star.active {
                color: var(--star-color, #fbbf24);
            }

            .star:hover {
                transform: scale(1.1);
            }

            .stars-container:hover .star {
                color: var(--dm-gray-300, #dee2e6);
            }

            .stars-container:hover .star.hovered,
            .stars-container:hover .star.hovered ~ .star {
                color: var(--dm-gray-300, #dee2e6);
            }

            .stars-container:hover .star.hovered {
                color: var(--star-color, #fbbf24);
            }

            /* Highlight stars before and including hovered */
            .stars-container:hover .star.before-hover {
                color: var(--star-color, #fbbf24);
            }

            .star.readonly {
                cursor: default;
            }

            .star.readonly:hover {
                transform: none;
            }

            .rating-text {
                margin-left: 8px;
                font-size: 14px;
                color: var(--dm-gray-600, #6c757d);
            }
        `;
    }

    _render() {
        const { value, max, readonly, size, color } = this._options;

        // Clear existing content (preserve style tag)
        const existingContainer = this.shadowRoot.querySelector('.stars-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        const container = document.createElement('div');
        container.className = 'stars-container';
        container.style.setProperty('--star-size', `${size}px`);
        container.style.setProperty('--star-color', color);

        for (let i = 1; i <= max; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            if (i <= value) {
                star.classList.add('active');
            }
            if (readonly) {
                star.classList.add('readonly');
            }
            star.textContent = '★';
            star.dataset.value = String(i);
            container.appendChild(star);
        }

        this.shadowRoot.appendChild(container);
    }

    _bindEvents() {
        const { readonly } = this._options;

        if (readonly) return;

        const stars = this.shadowRoot.querySelectorAll('.star');

        stars.forEach((star, index) => {
            // Click to set rating
            this._addEventListener(star, 'click', () => {
                const newValue = parseInt(star.dataset.value);
                this.setAttribute('value', String(newValue));
                this._emit('change', { value: newValue });
            });

            // Hover effect
            this._addEventListener(star, 'mouseenter', () => {
                const hoverValue = parseInt(star.dataset.value);
                stars.forEach((s, i) => {
                    s.classList.remove('hovered', 'before-hover');
                    if (i + 1 === hoverValue) {
                        s.classList.add('hovered');
                    } else if (i + 1 < hoverValue) {
                        s.classList.add('before-hover');
                    }
                });
            });
        });

        // Reset to actual value when mouse leaves container
        const container = this.shadowRoot.querySelector('.stars-container');
        this._addEventListener(container, 'mouseleave', () => {
            const currentValue = parseInt(this.getAttribute('value')) || 0;
            stars.forEach((star, index) => {
                star.classList.remove('hovered', 'before-hover');
                if (index + 1 <= currentValue) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        });
    }

    _onAttributeChange(name, oldValue, newValue) {
        // Re-render when attributes change
        this._render();
        this._bindEvents();
    }

    // Public API
    setValue(value) {
        this.setAttribute('value', String(value));
    }

    getValue() {
        return parseInt(this.getAttribute('value')) || 0;
    }

    reset() {
        this.setValue(0);
    }
}

// Register the custom element
customElements.define('dm-star-rating', StarRating);
