/**
 * Domma Theme Roller
 * Visual theme customisation component with live preview and export
 */

import {theme} from './theme.js';
import {storage as S} from './storage.js';
import {utils} from './utils.js';

// ============================================
// Variable Registry
// ============================================

const VARIABLE_REGISTRY = {
    // ========================================
    // COLOURS - Brand
    // ========================================
    '--dm-primary': {
        category: 'colours',
        subCategory: 'brand',
        type: 'color',
        label: 'Primary',
        defaultLight: '#6495ED',
        defaultDark: '#6ea8fe'
    },
    '--dm-primary-hover': {
        category: 'colours',
        subCategory: 'brand',
        type: 'color',
        label: 'Primary Hover',
        defaultLight: '#5280d8',
        defaultDark: '#8bb9fe'
    },
    '--dm-primary-active': {
        category: 'colours',
        subCategory: 'brand',
        type: 'color',
        label: 'Primary Active',
        defaultLight: '#4169c0',
        defaultDark: '#a8cafe'
    },
    '--dm-secondary': {
        category: 'colours',
        subCategory: 'brand',
        type: 'color',
        label: 'Secondary',
        defaultLight: '#6c757d',
        defaultDark: '#adb5bd'
    },
    '--dm-secondary-hover': {
        category: 'colours',
        subCategory: 'brand',
        type: 'color',
        label: 'Secondary Hover',
        defaultLight: '#5c636a',
        defaultDark: '#b1b8bf'
    },

    // ========================================
    // COLOURS - Status
    // ========================================
    '--dm-success': {
        category: 'colours',
        subCategory: 'status',
        type: 'color',
        label: 'Success',
        defaultLight: '#198754',
        defaultDark: '#75b798'
    },
    '--dm-success-hover': {
        category: 'colours',
        subCategory: 'status',
        type: 'color',
        label: 'Success Hover',
        defaultLight: '#157347',
        defaultDark: '#8cc5a7'
    },
    '--dm-danger': {
        category: 'colours',
        subCategory: 'status',
        type: 'color',
        label: 'Danger',
        defaultLight: '#dc3545',
        defaultDark: '#ea868f'
    },
    '--dm-danger-hover': {
        category: 'colours',
        subCategory: 'status',
        type: 'color',
        label: 'Danger Hover',
        defaultLight: '#bb2d3b',
        defaultDark: '#ee9aa1'
    },
    '--dm-warning': {
        category: 'colours',
        subCategory: 'status',
        type: 'color',
        label: 'Warning',
        defaultLight: '#ffc107',
        defaultDark: '#ffda6a'
    },
    '--dm-warning-hover': {
        category: 'colours',
        subCategory: 'status',
        type: 'color',
        label: 'Warning Hover',
        defaultLight: '#ffca2c',
        defaultDark: '#ffe083'
    },
    '--dm-info': {
        category: 'colours',
        subCategory: 'status',
        type: 'color',
        label: 'Info',
        defaultLight: '#0dcaf0',
        defaultDark: '#6edff6'
    },
    '--dm-info-hover': {
        category: 'colours',
        subCategory: 'status',
        type: 'color',
        label: 'Info Hover',
        defaultLight: '#31d2f2',
        defaultDark: '#89e5f8'
    },

    // ========================================
    // COLOURS - Backgrounds
    // ========================================
    '--dm-background': {
        category: 'colours',
        subCategory: 'backgrounds',
        type: 'color',
        label: 'Background',
        defaultLight: '#ffffff',
        defaultDark: '#121212'
    },
    '--dm-background-alt': {
        category: 'colours',
        subCategory: 'backgrounds',
        type: 'color',
        label: 'Background Alt',
        defaultLight: '#f8f9fa',
        defaultDark: '#1e1e1e'
    },
    '--dm-surface': {
        category: 'colours',
        subCategory: 'backgrounds',
        type: 'color',
        label: 'Surface',
        defaultLight: '#ffffff',
        defaultDark: '#1e1e1e'
    },
    '--dm-surface-raised': {
        category: 'colours',
        subCategory: 'backgrounds',
        type: 'color',
        label: 'Surface Raised',
        defaultLight: '#ffffff',
        defaultDark: '#2d2d2d'
    },

    // ========================================
    // COLOURS - Text
    // ========================================
    '--dm-text': {
        category: 'colours',
        subCategory: 'text',
        type: 'color',
        label: 'Text',
        defaultLight: '#212529',
        defaultDark: '#e9ecef'
    },
    '--dm-text-secondary': {
        category: 'colours',
        subCategory: 'text',
        type: 'color',
        label: 'Text Secondary',
        defaultLight: '#495057',
        defaultDark: '#adb5bd'
    },
    '--dm-text-muted': {
        category: 'colours',
        subCategory: 'text',
        type: 'color',
        label: 'Text Muted',
        defaultLight: '#6c757d',
        defaultDark: '#868e96'
    },

    // ========================================
    // COLOURS - Borders
    // ========================================
    '--dm-border': {
        category: 'colours',
        subCategory: 'borders',
        type: 'color',
        label: 'Border',
        defaultLight: '#dee2e6',
        defaultDark: '#3d3d3d'
    },
    '--dm-border-light': {
        category: 'colours',
        subCategory: 'borders',
        type: 'color',
        label: 'Border Light',
        defaultLight: '#e9ecef',
        defaultDark: '#2d2d2d'
    },
    '--dm-divider': {
        category: 'colours',
        subCategory: 'borders',
        type: 'color',
        label: 'Divider',
        defaultLight: '#e9ecef',
        defaultDark: '#3d3d3d'
    },

    // ========================================
    // TYPOGRAPHY - Font Families
    // ========================================
    '--dm-font-sans': {
        category: 'typography',
        subCategory: 'families',
        type: 'select',
        label: 'Sans-serif Font',
        default: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        options: [
            {value: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", label: 'System UI'},
            {value: "'Inter', sans-serif", label: 'Inter'},
            {value: "'Open Sans', sans-serif", label: 'Open Sans'},
            {value: "'Roboto', sans-serif", label: 'Roboto'},
            {value: "'Lato', sans-serif", label: 'Lato'},
            {value: "'Poppins', sans-serif", label: 'Poppins'}
        ]
    },
    '--dm-font-mono': {
        category: 'typography',
        subCategory: 'families',
        type: 'select',
        label: 'Monospace Font',
        default: "'SF Mono', Monaco, 'Cascadia Code', Consolas, monospace",
        options: [
            {value: "'SF Mono', Monaco, 'Cascadia Code', Consolas, monospace", label: 'SF Mono'},
            {value: "'Fira Code', monospace", label: 'Fira Code'},
            {value: "'JetBrains Mono', monospace", label: 'JetBrains Mono'},
            {value: "'Source Code Pro', monospace", label: 'Source Code Pro'}
        ]
    },

    // ========================================
    // TYPOGRAPHY - Font Sizes
    // ========================================
    '--dm-text-xs': {
        category: 'typography',
        subCategory: 'sizes',
        type: 'size',
        label: 'Extra Small',
        default: '0.75rem',
        unit: 'rem',
        min: 0.5,
        max: 1,
        step: 0.0625
    },
    '--dm-text-sm': {
        category: 'typography',
        subCategory: 'sizes',
        type: 'size',
        label: 'Small',
        default: '0.875rem',
        unit: 'rem',
        min: 0.625,
        max: 1.25,
        step: 0.0625
    },
    '--dm-text-base': {
        category: 'typography',
        subCategory: 'sizes',
        type: 'size',
        label: 'Base',
        default: '1rem',
        unit: 'rem',
        min: 0.75,
        max: 1.5,
        step: 0.0625
    },
    '--dm-text-lg': {
        category: 'typography',
        subCategory: 'sizes',
        type: 'size',
        label: 'Large',
        default: '1.125rem',
        unit: 'rem',
        min: 0.875,
        max: 1.75,
        step: 0.0625
    },
    '--dm-text-xl': {
        category: 'typography',
        subCategory: 'sizes',
        type: 'size',
        label: 'Extra Large',
        default: '1.25rem',
        unit: 'rem',
        min: 1,
        max: 2,
        step: 0.0625
    },
    '--dm-text-2xl': {
        category: 'typography',
        subCategory: 'sizes',
        type: 'size',
        label: '2XL',
        default: '1.5rem',
        unit: 'rem',
        min: 1.25,
        max: 2.5,
        step: 0.125
    },

    // ========================================
    // SPACING
    // ========================================
    '--dm-space-1': {
        category: 'spacing',
        subCategory: 'scale',
        type: 'size',
        label: 'Space 1 (4px)',
        default: '0.25rem',
        unit: 'rem',
        min: 0,
        max: 0.5,
        step: 0.0625
    },
    '--dm-space-2': {
        category: 'spacing',
        subCategory: 'scale',
        type: 'size',
        label: 'Space 2 (8px)',
        default: '0.5rem',
        unit: 'rem',
        min: 0.25,
        max: 1,
        step: 0.0625
    },
    '--dm-space-3': {
        category: 'spacing',
        subCategory: 'scale',
        type: 'size',
        label: 'Space 3 (12px)',
        default: '0.75rem',
        unit: 'rem',
        min: 0.5,
        max: 1.25,
        step: 0.0625
    },
    '--dm-space-4': {
        category: 'spacing',
        subCategory: 'scale',
        type: 'size',
        label: 'Space 4 (16px)',
        default: '1rem',
        unit: 'rem',
        min: 0.5,
        max: 2,
        step: 0.125
    },
    '--dm-space-6': {
        category: 'spacing',
        subCategory: 'scale',
        type: 'size',
        label: 'Space 6 (24px)',
        default: '1.5rem',
        unit: 'rem',
        min: 1,
        max: 3,
        step: 0.125
    },
    '--dm-space-8': {
        category: 'spacing',
        subCategory: 'scale',
        type: 'size',
        label: 'Space 8 (32px)',
        default: '2rem',
        unit: 'rem',
        min: 1,
        max: 4,
        step: 0.25
    },

    // ========================================
    // BORDERS - Radius
    // ========================================
    '--dm-radius-sm': {
        category: 'borders',
        subCategory: 'radius',
        type: 'size',
        label: 'Small Radius',
        default: '0.125rem',
        unit: 'rem',
        min: 0,
        max: 0.5,
        step: 0.0625
    },
    '--dm-radius-md': {
        category: 'borders',
        subCategory: 'radius',
        type: 'size',
        label: 'Medium Radius',
        default: '0.25rem',
        unit: 'rem',
        min: 0,
        max: 0.75,
        step: 0.0625
    },
    '--dm-radius-lg': {
        category: 'borders',
        subCategory: 'radius',
        type: 'size',
        label: 'Large Radius',
        default: '0.5rem',
        unit: 'rem',
        min: 0,
        max: 1,
        step: 0.0625
    },
    '--dm-radius-xl': {
        category: 'borders',
        subCategory: 'radius',
        type: 'size',
        label: 'XL Radius',
        default: '0.75rem',
        unit: 'rem',
        min: 0,
        max: 1.5,
        step: 0.125
    },
    '--dm-radius-2xl': {
        category: 'borders',
        subCategory: 'radius',
        type: 'size',
        label: '2XL Radius',
        default: '1rem',
        unit: 'rem',
        min: 0,
        max: 2,
        step: 0.125
    },

    // ========================================
    // TRANSITIONS
    // ========================================
    '--dm-transition-fast': {
        category: 'transitions',
        subCategory: 'durations',
        type: 'transition',
        label: 'Fast',
        default: '150ms ease',
        min: 50,
        max: 300,
        step: 25
    },
    '--dm-transition-normal': {
        category: 'transitions',
        subCategory: 'durations',
        type: 'transition',
        label: 'Normal',
        default: '200ms ease',
        min: 100,
        max: 400,
        step: 25
    },
    '--dm-transition-slow': {
        category: 'transitions',
        subCategory: 'durations',
        type: 'transition',
        label: 'Slow',
        default: '300ms ease',
        min: 200,
        max: 600,
        step: 25
    },

    // ========================================
    // INTERACTIVE STATES
    // ========================================
    '--dm-disabled-opacity': {
        category: 'states',
        subCategory: 'interactive',
        type: 'opacity',
        label: 'Disabled Opacity',
        default: '0.65',
        min: 0.3,
        max: 1,
        step: 0.05
    }
};

// Category metadata for UI sections
const CATEGORIES = {
    colours: {
        name: 'Colours',
        icon: 'palette',
        subCategories: {
            brand: 'Brand',
            status: 'Status',
            backgrounds: 'Backgrounds',
            text: 'Text',
            borders: 'Borders'
        }
    },
    typography: {
        name: 'Typography',
        icon: 'type',
        subCategories: {
            families: 'Font Families',
            sizes: 'Font Sizes'
        }
    },
    spacing: {
        name: 'Spacing',
        icon: 'maximize',
        subCategories: {
            scale: 'Spacing Scale'
        }
    },
    borders: {
        name: 'Borders & Radius',
        icon: 'square',
        subCategories: {
            radius: 'Border Radius'
        }
    },
    transitions: {
        name: 'Transitions',
        icon: 'zap',
        subCategories: {
            durations: 'Durations'
        }
    },
    states: {
        name: 'Interactive States',
        icon: 'mouse-pointer',
        subCategories: {
            interactive: 'States'
        }
    }
};

// ============================================
// ThemeRoller Class
// ============================================

class ThemeRoller {
    static defaults = {
      baseTheme: 'charcoal-dark',
        sections: ['colours', 'typography', 'spacing', 'borders', 'transitions', 'states'],
        livePreview: true,
        showPreviewPanel: true,
        onChange: null,
        onApply: null,
        onExport: null,
        onReset: null
    };

    constructor(selector, options = {}) {
        this.element = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;

        this.options = {...ThemeRoller.defaults, ...options};
        this._changes = {};
        this._previewStyle = null;
        this._eventHandlers = [];
        this._accordionInstance = null;

        if (this.element) {
            this._init();
        }
    }

    /**
     * Initialise the Theme Roller
     * @private
     */
    _init() {
        this._createPreviewStyle();
        this._render();

        // Initialize accordion BEFORE binding events (so events attach to accordion-processed DOM)
        if (typeof Domma !== 'undefined' && Domma.elements) {
            this._accordionInstance = Domma.elements.accordion('#theme-roller-accordion', {
                multiExpand: true,
                activeIndex: 0
            });
        }

        this._bindEvents();

      // Set initial theme (uses full theme name like 'charcoal-dark')
        if (this.options.baseTheme) {
            theme.set(this.options.baseTheme);
        }
    }

    /**
     * Create the preview style element
     * @private
     */
    _createPreviewStyle() {
        this._previewStyle = document.getElementById('dm-theme-roller-preview');
        if (!this._previewStyle) {
            this._previewStyle = document.createElement('style');
            this._previewStyle.id = 'dm-theme-roller-preview';
            document.head.appendChild(this._previewStyle);
        }
    }

    /**
     * Render the Theme Roller UI
     * @private
     */
    _render() {
      // Get current theme
      const currentTheme = theme.get();

        let html = `
            <div class="dm-theme-roller">
                <div class="dm-theme-roller-header">
                    <h3 class="dm-theme-roller-title">Theme Roller</h3>
                    <div class="dm-theme-roller-controls">
                        <label for="theme-select" class="dm-theme-select-label">Theme:</label>
                        <select id="theme-select" class="dm-theme-select form-select">
                            <optgroup label="Ocean">
                                <option value="ocean-light" ${currentTheme === 'ocean-light' ? 'selected' : ''}>Ocean Light ☀️</option>
                                <option value="ocean-dark" ${currentTheme === 'ocean-dark' ? 'selected' : ''}>Ocean Dark 🌙</option>
                            </optgroup>
                            <optgroup label="Forest">
                                <option value="forest-light" ${currentTheme === 'forest-light' ? 'selected' : ''}>Forest Light ☀️</option>
                                <option value="forest-dark" ${currentTheme === 'forest-dark' ? 'selected' : ''}>Forest Dark 🌙</option>
                            </optgroup>
                            <optgroup label="Sunset">
                                <option value="sunset-light" ${currentTheme === 'sunset-light' ? 'selected' : ''}>Sunset Light ☀️</option>
                                <option value="sunset-dark" ${currentTheme === 'sunset-dark' ? 'selected' : ''}>Sunset Dark 🌙</option>
                            </optgroup>
                            <optgroup label="Royal">
                                <option value="royal-light" ${currentTheme === 'royal-light' ? 'selected' : ''}>Royal Light ☀️</option>
                                <option value="royal-dark" ${currentTheme === 'royal-dark' ? 'selected' : ''}>Royal Dark 🌙</option>
                            </optgroup>
                            <optgroup label="Lemon">
                                <option value="lemon-light" ${currentTheme === 'lemon-light' ? 'selected' : ''}>Lemon Light ☀️</option>
                                <option value="lemon-dark" ${currentTheme === 'lemon-dark' ? 'selected' : ''}>Lemon Dark 🌙</option>
                            </optgroup>
                            <optgroup label="Silver">
                                <option value="silver-light" ${currentTheme === 'silver-light' ? 'selected' : ''}>Silver Light ☀️</option>
                                <option value="silver-dark" ${currentTheme === 'silver-dark' ? 'selected' : ''}>Silver Dark 🌙</option>
                            </optgroup>
                            <optgroup label="Charcoal">
                                <option value="charcoal-light" ${currentTheme === 'charcoal-light' ? 'selected' : ''}>Charcoal Light ☀️</option>
                                <option value="charcoal-dark" ${currentTheme === 'charcoal-dark' ? 'selected' : ''}>Charcoal Dark 🌙</option>
                            </optgroup>
                            <optgroup label="Christmas">
                                <option value="christmas-light" ${currentTheme === 'christmas-light' ? 'selected' : ''}>Christmas Light ☀️</option>
                                <option value="christmas-dark" ${currentTheme === 'christmas-dark' ? 'selected' : ''}>Christmas Dark 🌙</option>
                            </optgroup>
                            <optgroup label="Unicorn">
                                <option value="unicorn-light" ${currentTheme === 'unicorn-light' ? 'selected' : ''}>Unicorn Light ☀️</option>
                                <option value="unicorn-dark" ${currentTheme === 'unicorn-dark' ? 'selected' : ''}>Unicorn Dark 🌙</option>
                            </optgroup>
                            <optgroup label="Dreamy">
                                <option value="dreamy-light" ${currentTheme === 'dreamy-light' ? 'selected' : ''}>Dreamy Light ☀️</option>
                                <option value="dreamy-dark" ${currentTheme === 'dreamy-dark' ? 'selected' : ''}>Dreamy Dark 🌙</option>
                            </optgroup>
                        </select>
                    </div>
                </div>
        `;

        // Accordion sections
        html += `<div class="dm-theme-roller-sections accordion" id="theme-roller-accordion">`;

        for (const categoryKey of this.options.sections) {
            const category = CATEGORIES[categoryKey];
            if (!category) continue;

            html += `
                <div class="accordion-item" data-category="${categoryKey}">
                    <div class="accordion-header">
                        <span data-icon="${category.icon}" data-icon-size="18"></span>
                        ${category.name}
                        <span class="accordion-icon">&#9660;</span>
                    </div>
                    <div class="accordion-body">
                        <div class="accordion-content">
                            ${this._renderCategoryContent(categoryKey, category)}
                        </div>
                    </div>
                </div>
            `;
        }

        html += `</div>`;

        // Preview panel
        if (this.options.showPreviewPanel) {
            html += this._renderPreviewPanel();
        }

        // Action buttons
        html += `
            <div class="dm-theme-roller-actions">
                <button class="dm-btn dm-btn-secondary" data-action="reset">
                    <span data-icon="refresh-cw" data-icon-size="16"></span>
                    Reset
                </button>
                <button class="dm-btn dm-btn-secondary" data-action="save">
                    <span data-icon="save" data-icon-size="16"></span>
                    Save
                </button>
                <button class="dm-btn dm-btn-secondary" data-action="copy">
                    <span data-icon="copy" data-icon-size="16"></span>
                    Copy CSS
                </button>
                <button class="dm-btn dm-btn-primary" data-action="download">
                    <span data-icon="download" data-icon-size="16"></span>
                    Download
                </button>
            </div>
        `;

        html += `</div>`;

        this.element.innerHTML = html;

        // Force color input swatches to display by setting values via JavaScript
        this.element.querySelectorAll('input[type="color"]').forEach(input => {
            const value = input.getAttribute('value');
            if (value) {
                input.value = value;
            }
        });

        // Scan icons
        if (typeof Domma !== 'undefined' && Domma.icons) {
            Domma.icons.scan(this.element);
        }
    }

    /**
     * Render content for a category section
     * @param {string} categoryKey
     * @param {Object} category
     * @returns {string}
     * @private
     */
    _renderCategoryContent(categoryKey, category) {
        let html = '';
        const isDark = theme.isDark();

        for (const [subKey, subLabel] of Object.entries(category.subCategories)) {
            const variables = Object.entries(VARIABLE_REGISTRY)
                .filter(([, v]) => v.category === categoryKey && v.subCategory === subKey);

            if (variables.length === 0) continue;

            html += `<div class="dm-var-group"><h4 class="dm-var-group-title">${subLabel}</h4><div class="dm-var-grid">`;

            for (const [varName, varDef] of variables) {
                const defaultValue = isDark
                    ? (varDef.defaultDark || varDef.default)
                    : (varDef.defaultLight || varDef.default);

                // Get actual computed value from CSS (read from body where theme classes are applied)
                let computedValue = getComputedStyle(document.body)
                  .getPropertyValue(varName).trim();

                if (varDef.type === 'color') {
                    console.log(`[ThemeRoller] Reading ${varName}: "${computedValue}"`);
                }

                // Convert RGB to hex for color inputs
                if (varDef.type === 'color' && computedValue.startsWith('rgb')) {
                    const match = computedValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                    if (match) {
                        const r = parseInt(match[1]).toString(16).padStart(2, '0');
                        const g = parseInt(match[2]).toString(16).padStart(2, '0');
                        const b = parseInt(match[3]).toString(16).padStart(2, '0');
                        computedValue = `#${r}${g}${b}`.toUpperCase();
                    }
                }

                const currentValue = this._changes[varName] || computedValue || defaultValue;

                html += this._renderInput(varName, varDef, currentValue);
            }

            html += `</div></div>`;
        }

        return html;
    }

    /**
     * Render an input control for a variable
     * @param {string} varName
     * @param {Object} varDef
     * @param {string} currentValue
     * @returns {string}
     * @private
     */
    _renderInput(varName, varDef, currentValue) {
        const inputId = `tr-${varName.replace(/--dm-/g, '').replace(/-/g, '_')}`;

        let inputHtml = '';

        switch (varDef.type) {
            case 'color':
                inputHtml = `
                    <div class="dm-var-item dm-var-color">
                        <label for="${inputId}">${varDef.label}</label>
                        <div class="dm-color-input-wrapper">
                            <input type="color" id="${inputId}" data-var="${varName}" value="${currentValue}">
                            <input type="text" class="dm-color-text" data-var="${varName}" value="${currentValue}" maxlength="7">
                        </div>
                    </div>
                `;
                break;

            case 'size':
                const numValue = parseFloat(currentValue);
                inputHtml = `
                    <div class="dm-var-item dm-var-size">
                        <label for="${inputId}">${varDef.label}</label>
                        <div class="dm-size-input-wrapper">
                            <input type="range" id="${inputId}" data-var="${varName}"
                                min="${varDef.min}" max="${varDef.max}" step="${varDef.step}"
                                value="${numValue}">
                            <span class="dm-size-value">${currentValue}</span>
                        </div>
                    </div>
                `;
                break;

            case 'select':
                inputHtml = `
                    <div class="dm-var-item dm-var-select">
                        <label for="${inputId}">${varDef.label}</label>
                        <select id="${inputId}" data-var="${varName}">
                            ${varDef.options.map(opt => `
                                <option value="${opt.value}" ${opt.value === currentValue ? 'selected' : ''}>
                                    ${opt.label}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                `;
                break;

            case 'transition':
                const msValue = parseInt(currentValue);
                inputHtml = `
                    <div class="dm-var-item dm-var-transition">
                        <label for="${inputId}">${varDef.label}</label>
                        <div class="dm-size-input-wrapper">
                            <input type="range" id="${inputId}" data-var="${varName}"
                                min="${varDef.min}" max="${varDef.max}" step="${varDef.step}"
                                value="${msValue}">
                            <span class="dm-size-value">${msValue}ms</span>
                        </div>
                    </div>
                `;
                break;

            case 'opacity':
                const opValue = parseFloat(currentValue);
                inputHtml = `
                    <div class="dm-var-item dm-var-opacity">
                        <label for="${inputId}">${varDef.label}</label>
                        <div class="dm-size-input-wrapper">
                            <input type="range" id="${inputId}" data-var="${varName}"
                                min="${varDef.min}" max="${varDef.max}" step="${varDef.step}"
                                value="${opValue}">
                            <span class="dm-size-value">${opValue}</span>
                        </div>
                    </div>
                `;
                break;

            default:
                inputHtml = `
                    <div class="dm-var-item">
                        <label for="${inputId}">${varDef.label}</label>
                        <input type="text" id="${inputId}" data-var="${varName}" value="${currentValue}">
                    </div>
                `;
        }

        return inputHtml;
    }

    /**
     * Render the live preview panel
     * @returns {string}
     * @private
     */
    _renderPreviewPanel() {
        return `
            <div class="dm-theme-roller-preview">
                <h4>Live Preview</h4>
                <div class="dm-preview-content">
                    <div class="dm-preview-buttons">
                        <button class="btn btn-primary">Primary</button>
                        <button class="btn btn-secondary">Secondary</button>
                        <button class="btn btn-success">Success</button>
                        <button class="btn btn-danger">Danger</button>
                        <button class="btn btn-warning">Warning</button>
                        <button class="btn btn-info">Info</button>
                    </div>
                    <div class="dm-preview-card">
                        <h5>Sample Card</h5>
                        <p>This card demonstrates the current theme settings including colours, typography, and spacing.</p>
                    </div>
                    <div class="dm-preview-input">
                        <input type="text" placeholder="Sample input field">
                    </div>
                    <div class="dm-preview-alerts">
                        <div class="dm-alert dm-alert-success">Success message</div>
                        <div class="dm-alert dm-alert-warning">Warning message</div>
                        <div class="dm-alert dm-alert-danger">Error message</div>
                        <div class="dm-alert dm-alert-info">Info message</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Bind event handlers (declarative style inspired by Domma.config)
     * @private
     */
    _bindEvents() {
        const eventConfig = {
          '#theme-select': {
            on: 'change',
                call: (e, el) => {
                  const newTheme = el.value;
                  console.log('[ThemeRoller] Theme changed to:', newTheme);
                    theme.set(newTheme);
                    this._refreshInputs();
                }
            },
            'input[type="color"]': {
                on: 'input',
                call: (e, el) => {
                    const varName = el.dataset.var;
                    this.set(varName, el.value);
                    // Sync text input
                    const textInput = this.element.querySelector(`.dm-color-text[data-var="${varName}"]`);
                    if (textInput) textInput.value = el.value;
                }
            },
            '.dm-color-text': {
                on: 'change',
                call: (e, el) => {
                    const varName = el.dataset.var;
                    const value = el.value;
                    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                        this.set(varName, value);
                        // Sync colour picker
                        const colorInput = this.element.querySelector(`input[type="color"][data-var="${varName}"]`);
                        if (colorInput) colorInput.value = value;
                    }
                }
            },
            'input[type="range"]': {
                on: 'input',
                call: (e, el) => {
                    const varName = el.dataset.var;
                    const varDef = VARIABLE_REGISTRY[varName];
                    let value = el.value;
                    let displayValue = value;

                    if (varDef.type === 'size') {
                        value = `${value}${varDef.unit}`;
                        displayValue = value;
                    } else if (varDef.type === 'transition') {
                        displayValue = `${value}ms`;
                        value = `${value}ms ease`;
                    }

                    this.set(varName, value);

                    // Update display value
                    const valueSpan = el.parentElement.querySelector('.dm-size-value');
                    if (valueSpan) valueSpan.textContent = displayValue;
                }
            },
            'select[data-var]': {
                on: 'change',
                call: (e, el) => {
                    const varName = el.dataset.var;
                    this.set(varName, el.value);
                }
            },
            '[data-action]': {
                on: 'click',
                call: async (e, el) => {
                    const action = el.dataset.action;
                    switch (action) {
                        case 'reset':
                            this.reset();
                            break;
                        case 'save':
                            this.saveToStorage();
                            break;
                        case 'copy':
                            await this.copyToClipboard();
                            break;
                        case 'download':
                            this.download();
                            break;
                    }
                }
            }
        };

        console.log('[ThemeRoller] Setting up event bindings (declarative style)');
        // Apply event config to elements within container
        Object.keys(eventConfig).forEach(selector => {
            const elements = this.element.querySelectorAll(selector);
            const {on, call} = eventConfig[selector];

            elements.forEach(el => {
                el.addEventListener(on, (e) => call(e, el));
            });
        });
    }

    /**
     * Add event listener and track for cleanup
     * @private
     */
    _addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this._eventHandlers.push({element, event, handler});
    }

    /**
     * Update theme dropdown selected option
     * @private
     */
    _updateThemeDropdown() {
      const currentTheme = theme.get();
      const dropdown = this.element.querySelector('#theme-select');
      if (dropdown) {
        dropdown.value = currentTheme;
      }
    }

    /**
     * Refresh all input values
     * @private
     */
    _refreshInputs() {
        console.log('[ThemeRoller] _refreshInputs starting');
        this._changes = {};
        this._updatePreview();
        // Re-render to update default values based on theme
        console.log('[ThemeRoller] About to re-render');
        this._render();
        console.log('[ThemeRoller] Re-render completed');

        // Re-initialize accordion after re-render
        if (typeof Domma !== 'undefined' && Domma.elements && this._accordionInstance) {
            console.log('[ThemeRoller] Destroying old accordion instance');
            this._accordionInstance.destroy();
        }
        if (typeof Domma !== 'undefined' && Domma.elements) {
            console.log('[ThemeRoller] Creating new accordion instance');
            this._accordionInstance = Domma.elements.accordion('#theme-roller-accordion', {
                multiExpand: true,
                activeIndex: 0
            });
        }

        console.log('[ThemeRoller] About to rebind events');
        this._bindEvents();
        console.log('[ThemeRoller] _refreshInputs complete');
    }

    /**
     * Update the preview style element
     * @private
     */
    _updatePreview() {
        if (!this.options.livePreview || !this._previewStyle) return;

        if (Object.keys(this._changes).length === 0) {
            this._previewStyle.textContent = '';
            return;
        }

        // Apply changes to body (where theme classes are applied) AND root (for universal access)
        let css = 'body, :root {\n';
        for (const [variable, value] of Object.entries(this._changes)) {
            css += `    ${variable}: ${value} !important;\n`;
        }
        css += '}';

        this._previewStyle.textContent = css;
    }

    /**
     * Capitalise first letter
     * @param {string} str
     * @returns {string}
     * @private
     */
    _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ========================================
    // Public API
    // ========================================

    /**
     * Get a variable value
     * @param {string} variable - CSS variable name
     * @returns {string|null}
     */
    get(variable) {
        return this._changes[variable] || null;
    }

    /**
     * Set a variable value
     * @param {string} variable - CSS variable name
     * @param {string} value - New value
     * @returns {ThemeRoller}
     */
    set(variable, value) {
        this._changes[variable] = value;
        this._updatePreview();

        if (this.options.onChange) {
            this.options.onChange(variable, value);
        }

        return this;
    }

    /**
     * Get all customisations
     * @returns {Object}
     */
    getAll() {
        return {...this._changes};
    }

    /**
     * Set multiple values
     * @param {Object} changes - Variable/value pairs
     * @returns {ThemeRoller}
     */
    setAll(changes) {
        for (const [variable, value] of Object.entries(changes)) {
            this._changes[variable] = value;
        }
        this._updatePreview();
        return this;
    }

    /**
     * Reset all customisations
     * @returns {ThemeRoller}
     */
    reset() {
        this._changes = {};
        this._updatePreview();
        this._refreshInputs();

        if (this.options.onReset) {
            this.options.onReset();
        }

        this._showToast('Theme reset to defaults');
        return this;
    }

    /**
     * Load a theme (replaces old preset functionality)
     * @param {string} themeName - Full theme name like 'ocean-dark'
     * @returns {ThemeRoller}
     * @deprecated Use theme dropdown in UI instead
     */
    loadPreset(themeName) {
      console.warn('[ThemeRoller] loadPreset() is deprecated. Use the theme dropdown instead.');

      if (!themeName) {
        themeName = 'charcoal-dark'; // Default theme
      }

        // Enable theme engine if it was disabled
        if (theme.isDisabled()) {
            theme.enable();
        }

      // Apply theme
      theme.set(themeName);

        // Force browser reflow to apply new CSS
      document.body.offsetHeight;

      // Refresh inputs after short delay
        setTimeout(() => {
            this._refreshInputsDelayed();
        }, 50);

        this._changes = {};
        this._updatePreview();
      this._updateThemeDropdown();
        return this;
    }

    /**
     * Refresh inputs after delay (for async theme changes)
     * @private
     */
    _refreshInputsDelayed() {
        console.log('[ThemeRoller] _refreshInputsDelayed called');
        this._changes = {};
        this._updatePreview();
        this._refreshInputs();
        this._showToast(`Theme preset loaded`);
    }

    /**
     * Generate CSS string
     * @param {Object} options - Export options
     * @returns {string}
     */
    exportCSS(options = {}) {
        const {
            themeName = 'custom',
            includeHeader = true,
            minify = false
        } = options;

        if (Object.keys(this._changes).length === 0) {
            return '';
        }

        const nl = minify ? '' : '\n';
        const indent = minify ? '' : '    ';

        let css = '';

        if (includeHeader) {
            css += `/**${nl}`;
            css += ` * Custom Domma Theme${nl}`;
            css += ` * Generated: ${new Date().toISOString().split('T')[0]}${nl}`;
            css += ` * Base: ${theme.get()}${nl}`;
            css += ` */${nl}${nl}`;
        }

        css += `.dm-theme-${themeName} {${nl}`;

        for (const [variable, value] of Object.entries(this._changes)) {
            css += `${indent}${variable}: ${value};${nl}`;
        }

        css += `}${nl}`;

        if (this.options.onExport) {
            this.options.onExport(css);
        }

        return css;
    }

    /**
     * Download CSS file
     * @param {string} filename - Filename (without extension)
     * @returns {ThemeRoller}
     */
    download(filename = 'custom-theme') {
        const css = this.exportCSS();

        if (!css) {
            this._showToast('No changes to export', 'warning');
            return this;
        }

        const blob = new Blob([css], {type: 'text/css'});
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.css`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        this._showToast('Theme downloaded successfully');
        return this;
    }

    /**
     * Copy CSS to clipboard
     * @returns {Promise<ThemeRoller>}
     */
    async copyToClipboard() {
        const css = this.exportCSS();

        if (!css) {
            this._showToast('No changes to copy', 'warning');
            return this;
        }

        await utils.copyToClipboard(css);
        this._showToast('CSS copied to clipboard');

        return this;
    }

    /**
     * Save to localStorage
     * @returns {ThemeRoller}
     */
    saveToStorage() {
        S.set('theme-roller-custom', {
          theme: theme.get(), // Now stores full theme name like 'ocean-dark'
            changes: this._changes
        });

        this._showToast('Theme saved to browser');
        return this;
    }

    /**
     * Load from localStorage
     * @returns {ThemeRoller}
     */
    loadFromStorage() {
        const data = S.get('theme-roller-custom');

        if (data) {
          // Handle both old and new storage formats
          if (data.theme) {
            // New format: full theme name like 'ocean-dark'
            // Old format: just 'light' or 'dark' (will be migrated by ThemeEngine)
            theme.set(data.theme);
          }
            if (data.changes) this.setAll(data.changes);
          this._updateThemeDropdown();
            this._showToast('Theme loaded from browser');
        }

        return this;
    }

    /**
     * Show a toast notification
     * @param {string} message
     * @param {string} type
     * @private
     */
    _showToast(message, type = 'success') {
        if (typeof Domma !== 'undefined' && Domma.elements && Domma.elements.toast) {
            Domma.elements.toast[type](message, {
                position: 'bottom-center',
                duration: 2000
            });
        }
    }

    /**
     * Apply changes permanently (inject into document)
     * @returns {ThemeRoller}
     */
    apply() {
        // Changes are already applied via preview style
        // This method commits them by marking as "applied"
        if (this.options.onApply) {
            this.options.onApply(this._changes);
        }

        this._showToast('Theme applied');
        return this;
    }

    /**
     * Clean up and destroy the component
     */
    destroy() {
        // Remove event handlers
        for (const {element, event, handler} of this._eventHandlers) {
            element.removeEventListener(event, handler);
        }
        this._eventHandlers = [];

        // Remove preview style
        if (this._previewStyle) {
            this._previewStyle.remove();
        }

        // Clear accordion
        if (this._accordionInstance) {
            this._accordionInstance.destroy();
        }

        // Clear element
        if (this.element) {
            this.element.innerHTML = '';
        }
    }
}

// Export
export {ThemeRoller, VARIABLE_REGISTRY, CATEGORIES};
export default ThemeRoller;
