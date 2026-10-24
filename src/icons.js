/**
 * Domma Icon Registry
 * Provides SVG icon rendering, injection, and management
 */

import {categories, icons as defaultIcons} from '../public/assets/icons/index.js';

const NAMESPACE = 'http://www.w3.org/2000/svg';

/**
 * Built-in icon categories (keys of `listCategories()`); `custom` appears once an icon is registered.
 * @typedef {'ui'|'communication'|'media'|'files'|'social'|'commerce'|'status'|'navigation'|'seasonal'|'weather'|'devices'|'finance'|'health'|'sport'|'buildings'|'emojis'|'transport'|'code'|'forms'|'custom'} IconCategory
 */

/**
 * A category entry as returned by `listCategories()`.
 * @typedef {object} IconCategoryInfo
 * @property {string} name Display name
 * @property {string} description
 * @property {string[]} icons Icon names in the category
 */

/**
 * An icon: SVG path data plus the attributes put on the `<svg>`.
 * @typedef {object} IconDefinition
 * @property {string} [viewBox] SVG viewBox (default '0 0 24 24')
 * @property {string} [path] Single path data
 * @property {string[]} [paths] Multiple path data
 * @property {string} [stroke] Stroke colour (usually 'currentColor')
 * @property {string} [fill] Fill colour ('none', or 'currentColor' for filled icons)
 * @property {number|string} [strokeWidth] Stroke width
 * @property {string} [strokeLinecap]
 * @property {string} [strokeLinejoin]
 */

/**
 * Options for `render()`, `html()` and `use()` (`use()` reads only `size` and `class`).
 * @typedef {object} RenderOptions
 * @property {number|string} [size=24] Icon size in pixels
 * @property {string} [class] Additional CSS classes
 * @property {string} [colour] Icon colour (overrides currentColor)
 * @property {string} [color] Alias for colour
 * @property {Record<string, string>} [attrs] Additional attributes
 */

/**
 * Options for `inject()`: render options plus where the icon goes.
 * @typedef {RenderOptions & {position?: 'prepend'|'append'|'replace'}} IconInjectOptions
 */

/** @typedef {IconRegistry} Icons */

class IconRegistry {
    constructor() {
        /** @type {Record<string, IconDefinition>} @private */
        this._icons = {...defaultIcons};
        /** @type {Partial<Record<IconCategory, IconCategoryInfo>>} @private */
        this._categories = {...categories};
    }

    /**
     * Render an icon as an SVG element
     * @param {string} name - Icon name
     * @param {RenderOptions} [options] - Render options
     * @returns {SVGElement|null}
     */
    render(name, options = {}) {
        const icon = this._icons[name];
        if (!icon) {
            console.warn(`Icon "${name}" not found`);
            return null;
        }

        const {
            size = 24,
            class: className = '',
            colour = null,
            color = null,
            attrs = {}
        } = options;

        const svg = document.createElementNS(NAMESPACE, 'svg');
        svg.setAttribute('viewBox', icon.viewBox || '0 0 24 24');
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.setAttribute('fill', icon.fill || 'none');
        svg.setAttribute('aria-hidden', 'true');

        // Build class string
        const classes = ['dm-icon'];
        if (className) {
            classes.push(className);
        }
        svg.setAttribute('class', classes.join(' '));

        // Set stroke attributes
        if (icon.stroke) {
            svg.setAttribute('stroke', colour || color || icon.stroke);
        }
        if (icon.strokeWidth) {
            svg.setAttribute('stroke-width', icon.strokeWidth);
        }
        if (icon.strokeLinecap) {
            svg.setAttribute('stroke-linecap', icon.strokeLinecap);
        }
        if (icon.strokeLinejoin) {
            svg.setAttribute('stroke-linejoin', icon.strokeLinejoin);
        }

        // Apply colour override for filled icons
        if ((colour || color) && icon.fill === 'currentColor') {
            svg.setAttribute('fill', colour || color);
        }

        // Apply additional attributes
        Object.entries(attrs).forEach(([key, value]) => {
            svg.setAttribute(key, value);
        });

        // Create path elements
        if (icon.path) {
            const path = document.createElementNS(NAMESPACE, 'path');
            path.setAttribute('d', icon.path);
            if (icon.fill === 'currentColor') {
                path.setAttribute('fill', colour || color || 'currentColor');
            }
            svg.appendChild(path);
        }

        // Handle multiple paths
        if (icon.paths) {
            icon.paths.forEach(pathData => {
                const path = document.createElementNS(NAMESPACE, 'path');
                path.setAttribute('d', pathData);
                if (icon.fill === 'currentColor') {
                    path.setAttribute('fill', colour || color || 'currentColor');
                }
                svg.appendChild(path);
            });
        }

        return svg;
    }

    /**
     * Get icon as HTML string
     * @param {string} name - Icon name
     * @param {RenderOptions} [options] - Render options (same as render())
     * @returns {string}
     */
    html(name, options = {}) {
        const svg = this.render(name, options);
        if (!svg) {
            return '';
        }

        const container = document.createElement('div');
        container.appendChild(svg);
        return container.innerHTML;
    }

    /**
     * Inject icon into an element
     * @param {string|HTMLElement} target - Target element or selector
     * @param {string} name - Icon name
     * @param {IconInjectOptions} [options] - Render options (same as render()), plus `position`: 'prepend' (default), 'append', or 'replace'
     * @returns {SVGElement|null}
     */
    inject(target, name, options = {}) {
        const {position = 'prepend', ...renderOptions} = options;

        const element = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        if (!element) {
            console.warn(`Target element not found: ${target}`);
            return null;
        }

        const svg = this.render(name, renderOptions);
        if (!svg) {
            return null;
        }

        switch (position) {
            case 'append':
                element.appendChild(svg);
                break;
            case 'replace':
                element.innerHTML = '';
                element.appendChild(svg);
                break;
            case 'prepend':
            default:
                element.insertBefore(svg, element.firstChild);
                break;
        }

        return svg;
    }

    /**
     * Scan document for [data-icon] elements and replace with SVGs
     * @param {Element|Document|DocumentFragment|string} [container=document] - Container to scan
     * @returns {number} Number of icons replaced
     */
    scan(container = document) {
        const root = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!root) {
            return 0;
        }

      const elements = root.querySelectorAll('[data-icon]:not([data-icon-processed]):not([data-icon-processing])');
        let count = 0;

        elements.forEach(el => {
          // Skip if already processed or is already an SVG
          if (el.tagName.toLowerCase() === 'svg' ||
            el.hasAttribute('data-icon-processed') ||
            el.querySelector('svg')) {
            return;
          }

            const name = el.dataset.icon;
            const size = parseInt(el.dataset.iconSize, 10) || 24;
            const colour = el.dataset.iconColour || el.dataset.iconColor || null;
            const className = el.dataset.iconClass || '';

            const svg = this.render(name, {size, colour, class: className});
            if (svg) {
                // Preserve existing classes
                const existingClasses = el.className;
                if (existingClasses) {
                    svg.classList.add(...existingClasses.split(' ').filter(c => c));
                }

              // Mark SVG as processed with metadata - CRITICAL: Keep data-icon attribute
              svg.setAttribute('data-icon', name);
              svg.setAttribute('data-icon-processed', 'true');
              svg.setAttribute('data-original-icon', name);
              svg.setAttribute('data-icon-converted', Date.now().toString());

                el.replaceWith(svg);
                count++;
            } else {
              // Mark as processed even if render failed
              el.setAttribute('data-icon-processed', 'true');
            }
        });

        return count;
    }

    /**
     * Register a custom icon
     * @param {string} name - Icon name
     * @param {IconDefinition} definition - Icon definition (needs `path` or `paths`; `viewBox` defaults to '0 0 24 24')
     * @returns {this}
     */
    register(name, definition) {
        if (!name || !definition) {
            console.warn('Invalid icon registration: name and definition required');
            return this;
        }

        if (!definition.viewBox) {
            definition.viewBox = '0 0 24 24';
        }

        if (!definition.path && !definition.paths) {
            console.warn(`Icon "${name}" must have a path or paths property`);
            return this;
        }

        this._icons[name] = definition;

        // Add to custom category
        if (!this._categories.custom) {
            this._categories.custom = {
                name: 'Custom',
                description: 'Custom registered icons',
                icons: []
            };
        }
        this._categories.custom.icons.push(name);

        return this;
    }

    /**
     * Unregister an icon
     * @param {string} name - Icon name
     * @returns {boolean}
     */
    unregister(name) {
        if (this._icons[name]) {
            delete this._icons[name];

            // Remove from custom category
            if (this._categories.custom) {
                const index = this._categories.custom.icons.indexOf(name);
                if (index > -1) {
                    this._categories.custom.icons.splice(index, 1);
                }
            }

            return true;
        }
        return false;
    }

    /**
     * Check if an icon exists
     * @param {string} name - Icon name
     * @returns {boolean}
     */
    has(name) {
        return !!this._icons[name];
    }

    /**
     * Get icon definition
     * @param {string} name - Icon name
     * @returns {IconDefinition|null}
     */
    get(name) {
        return this._icons[name] || null;
    }

    /**
     * List all icon names
     * @param {IconCategory|null} [category] - Filter by category
     * @returns {string[]}
     */
    list(category = null) {
        if (category && this._categories[category]) {
            return [...this._categories[category].icons];
        }
        return Object.keys(this._icons);
    }

    /**
     * List all categories
     * @returns {Partial<Record<IconCategory, IconCategoryInfo>>}
     */
    listCategories() {
        return {...this._categories};
    }

    /**
     * Get icon count
     * @returns {number}
     */
    count() {
        return Object.keys(this._icons).length;
    }

    /**
     * Search icons by name
     * @param {string} query - Search query
     * @returns {string[]}
     */
    search(query) {
        const q = query.toLowerCase();
        return Object.keys(this._icons).filter(name =>
            name.toLowerCase().includes(q)
        );
    }

    /**
     * Create a sprite sheet of all icons (for performance)
     * @returns {SVGElement}
     */
    createSprite() {
        const svg = document.createElementNS(NAMESPACE, 'svg');
        svg.setAttribute('xmlns', NAMESPACE);
        svg.style.display = 'none';

        Object.entries(this._icons).forEach(([name, icon]) => {
            const symbol = document.createElementNS(NAMESPACE, 'symbol');
            symbol.setAttribute('id', `dm-icon-${name}`);
            symbol.setAttribute('viewBox', icon.viewBox || '0 0 24 24');

            if (icon.path) {
                const path = document.createElementNS(NAMESPACE, 'path');
                path.setAttribute('d', icon.path);
                if (icon.fill) {
                    path.setAttribute('fill', icon.fill);
                }
                if (icon.stroke) {
                    path.setAttribute('stroke', icon.stroke);
                    if (icon.strokeWidth) {
                        path.setAttribute('stroke-width', icon.strokeWidth);
                    }
                    if (icon.strokeLinecap) {
                        path.setAttribute('stroke-linecap', icon.strokeLinecap);
                    }
                    if (icon.strokeLinejoin) {
                        path.setAttribute('stroke-linejoin', icon.strokeLinejoin);
                    }
                }
                symbol.appendChild(path);
            }

            if (icon.paths) {
                icon.paths.forEach(pathData => {
                    const path = document.createElementNS(NAMESPACE, 'path');
                    path.setAttribute('d', pathData);
                    if (icon.fill) {
                        path.setAttribute('fill', icon.fill);
                    }
                    if (icon.stroke) {
                        path.setAttribute('stroke', icon.stroke);
                    }
                    symbol.appendChild(path);
                });
            }

            svg.appendChild(symbol);
        });

        return svg;
    }

    /**
     * Use an icon from sprite sheet
     * @param {string} name - Icon name
     * @param {RenderOptions} [options] - Render options (`size` and `class`)
     * @returns {SVGElement|null}
     */
    use(name, options = {}) {
        if (!this._icons[name]) {
            console.warn(`Icon "${name}" not found`);
            return null;
        }

        const {size = 24, class: className = ''} = options;

        const svg = document.createElementNS(NAMESPACE, 'svg');
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.setAttribute('aria-hidden', 'true');

        const classes = ['dm-icon'];
        if (className) {
            classes.push(className);
        }
        svg.setAttribute('class', classes.join(' '));

        const use = document.createElementNS(NAMESPACE, 'use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#dm-icon-${name}`);
        svg.appendChild(use);

        return svg;
    }
}

// Create singleton instance
const icons = new IconRegistry();

export {icons, IconRegistry};
export default icons;
