import { DommaElement, getThemeVariables } from '../../../../../src/web-components/base/domma-element.js';

/**
 * Bar Chart Web Component
 * Pure CSS bar chart for visualizing usage statistics
 *
 * Usage:
 *   <dm-bar-chart data='[{"label": "Mon", "value": 12}, ...]' max-value="20"></dm-bar-chart>
 *
 * Attributes:
 *   - data: JSON array of {label, value} objects
 *   - max-value: Maximum value for scaling (auto-calculated if omitted)
 *   - bar-color: CSS color for bars (default: primary theme color)
 *   - show-values: Boolean to show values on top of bars (default: true)
 */
export class BarChart extends DommaElement {
    static defaults = {
        data: [],
        maxValue: null,
        barColor: null,
        showValues: true
    };

    static get observedAttributes() {
        return ['data', 'max-value', 'bar-color', 'show-values'];
    }

    _getStyles() {
        return `
            ${getThemeVariables()}

            :host {
                display: block;
                width: 100%;
            }

            .chart-container {
                display: flex;
                align-items: flex-end;
                gap: 4px;
                height: 120px;
                padding: 10px 0;
            }

            .bar-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
                position: relative;
                min-width: 30px;
            }

            .bar-value {
                font-size: 11px;
                font-weight: 600;
                margin-bottom: 4px;
                color: var(--dm-gray-700, #495057);
                opacity: 0;
                animation: fadeInDown 0.3s forwards;
            }

            .bar {
                width: 100%;
                background: var(--bar-color, var(--dm-primary, #6495ED));
                border-radius: 4px 4px 0 0;
                transition: all var(--dm-transition-normal, 300ms);
                height: 0;
                animation: growUp 0.5s ease-out forwards;
            }

            .bar:hover {
                opacity: 0.8;
                filter: brightness(1.1);
                cursor: pointer;
            }

            .bar-label {
                font-size: 10px;
                margin-top: 6px;
                color: var(--dm-gray-600, #6c757d);
                text-align: center;
                word-wrap: break-word;
                max-width: 100%;
            }

            .empty-state {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 120px;
                color: var(--dm-gray-500, #adb5bd);
                font-size: 14px;
            }

            @keyframes growUp {
                from {
                    height: 0;
                }
                to {
                    height: var(--bar-height);
                }
            }

            @keyframes fadeInDown {
                from {
                    opacity: 0;
                    transform: translateY(-5px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
    }

    _render() {
        const data = this._parseData();
        const maxValue = this._options.maxValue || this._calculateMax(data);
        const barColor = this._options.barColor;
        const showValues = this._options.showValues;

        // Clear existing content
        while (this.shadowRoot.firstChild && this.shadowRoot.firstChild.tagName !== 'STYLE') {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }

        if (!data || data.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-state';
            emptyDiv.textContent = 'No data available';
            this.shadowRoot.appendChild(emptyDiv);
            return;
        }

        const container = document.createElement('div');
        container.className = 'chart-container';

        data.forEach((item, index) => {
            const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            const delay = index * 50; // Stagger animation

            // Create bar wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'bar-wrapper';

            // Value label (if enabled)
            if (showValues) {
                const valueSpan = document.createElement('span');
                valueSpan.className = 'bar-value';
                valueSpan.textContent = String(item.value || 0);
                valueSpan.style.animationDelay = `${delay}ms`;
                wrapper.appendChild(valueSpan);
            }

            // Bar element
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.setProperty('--bar-height', `${height}%`);
            bar.style.animationDelay = `${delay}ms`;
            if (barColor) {
                bar.style.background = barColor;
            }
            bar.dataset.value = String(item.value || 0);
            bar.dataset.label = String(item.label || '');
            wrapper.appendChild(bar);

            // Label
            const labelSpan = document.createElement('span');
            labelSpan.className = 'bar-label';
            labelSpan.textContent = String(item.label || '');
            wrapper.appendChild(labelSpan);

            container.appendChild(wrapper);
        });

        this.shadowRoot.appendChild(container);
    }

    _bindEvents() {
        // Add click event to bars
        this.shadowRoot.querySelectorAll('.bar').forEach((bar, index) => {
            this._addEventListener(bar, 'click', () => {
                const data = this._parseData();
                this._emit('bar-click', {
                    index,
                    label: data[index]?.label,
                    value: data[index]?.value
                });
            });
        });
    }

    _parseData() {
        const dataAttr = this.getAttribute('data');
        if (!dataAttr) return [];

        try {
            const parsed = JSON.parse(dataAttr);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error('BarChart: Invalid data attribute', e);
            return [];
        }
    }

    _calculateMax(data) {
        if (!data || data.length === 0) return 0;
        return Math.max(...data.map(item => item.value || 0));
    }

    _onAttributeChange(name, oldValue, newValue) {
        // Re-render when attributes change
        const styleEl = this.shadowRoot.querySelector('style');
        this.shadowRoot.innerHTML = '';
        if (styleEl) {
            this.shadowRoot.appendChild(styleEl);
        } else {
            this._injectStyles();
        }
        this._render();
        this._bindEvents();
    }

    // Public API for programmatic updates
    setData(data) {
        this.setAttribute('data', JSON.stringify(data));
    }

    getData() {
        return this._parseData();
    }
}

// Register the custom element
customElements.define('dm-bar-chart', BarChart);
