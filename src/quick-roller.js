/**
 * Quick Roller - Page Builder Component
 *
 * A visual page builder for creating web pages through drag-and-drop
 * with template management, split-screen preview, and multiple export options.
 *
 * @module quick-roller
 */

import {storage as S} from './storage.js';
import {utils} from './utils.js';

// ============================================================================
// Section Registry - Defines available page sections
// ============================================================================

const SECTION_REGISTRY = {
    hero: {
        name: 'Hero',
        icon: 'layout',
        category: 'headers',
        description: 'Large header section with title, subtitle and call-to-action',
        defaults: {
            title: 'Welcome to My Site',
            subtitle: 'A brief description of what you offer.',
            backgroundType: 'gradient',
            backgroundColor: '#6495ED',
            backgroundGradient: 'linear-gradient(135deg, #6495ED 0%, #5280d8 100%)',
            backgroundImage: '',
            textColor: '#ffffff',
            alignment: 'center',
            size: 'large',
            overlay: false,
            buttons: [
                {text: 'Get Started', style: 'primary', url: '#'}
            ]
        },
        editableFields: [
            {key: 'title', type: 'text', label: 'Title'},
            {key: 'subtitle', type: 'textarea', label: 'Subtitle'},
            {key: 'backgroundType', type: 'select', label: 'Background', options: ['solid', 'gradient', 'image']},
            {key: 'backgroundColor', type: 'color', label: 'Background Colour', showWhen: {backgroundType: 'solid'}},
            {key: 'backgroundGradient', type: 'text', label: 'Gradient CSS', showWhen: {backgroundType: 'gradient'}},
            {key: 'backgroundImage', type: 'text', label: 'Image URL', showWhen: {backgroundType: 'image'}},
            {key: 'textColor', type: 'color', label: 'Text Colour'},
            {key: 'alignment', type: 'select', label: 'Alignment', options: ['left', 'center', 'right']},
            {key: 'size', type: 'select', label: 'Size', options: ['small', 'medium', 'large']},
            {key: 'overlay', type: 'toggle', label: 'Dark Overlay'},
            {key: 'buttons', type: 'buttons', label: 'Buttons'}
        ],
        template: (config) => {
            const sizeClass = config.size === 'small' ? 'py-8' : config.size === 'large' ? 'py-16' : 'py-12';
            const alignClass = config.alignment === 'left' ? 'text-left' : config.alignment === 'right' ? 'text-right' : 'text-center';

            let bgStyle = '';
            if (config.backgroundType === 'solid') {
                bgStyle = `background-color: ${config.backgroundColor};`;
            } else if (config.backgroundType === 'gradient') {
                bgStyle = `background: ${config.backgroundGradient};`;
            } else if (config.backgroundType === 'image') {
                bgStyle = `background-image: url('${config.backgroundImage}'); background-size: cover; background-position: center;`;
            }

            const overlayHtml = config.overlay ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.4);"></div>' : '';

            const buttonsHtml = config.buttons.map(btn => {
                const btnClass = btn.style === 'primary' ? 'btn btn-primary' :
                    btn.style === 'secondary' ? 'btn btn-secondary' :
                        btn.style === 'outline' ? 'btn btn-outline' : 'btn';
                return `<a href="${btn.url}" class="${btnClass}">${btn.text}</a>`;
            }).join('\n                ');

            return `<section class="hero ${sizeClass}" style="${bgStyle} color: ${config.textColor}; position: relative;">
    ${overlayHtml}
    <div class="container ${alignClass}" style="position: relative; z-index: 1;">
        <h1 class="hero-title">${config.title}</h1>
        <p class="hero-subtitle">${config.subtitle}</p>
        <div class="hero-buttons" style="margin-top: 2rem;">
            ${buttonsHtml}
        </div>
    </div>
</section>`;
        }
    },

    cardGrid: {
        name: 'Card Grid',
        icon: 'grid',
        category: 'content',
        description: 'Grid of cards for features, products, or team members',
        defaults: {
            columns: 3,
            gap: 'medium',
            cardStyle: 'default',
            sectionTitle: '',
            sectionSubtitle: '',
            cards: [
                {title: 'Feature One', text: 'Description of the first feature.', image: '', icon: 'star', link: '#'},
                {title: 'Feature Two', text: 'Description of the second feature.', image: '', icon: 'zap', link: '#'},
                {title: 'Feature Three', text: 'Description of the third feature.', image: '', icon: 'check', link: '#'}
            ]
        },
        editableFields: [
            {key: 'sectionTitle', type: 'text', label: 'Section Title'},
            {key: 'sectionSubtitle', type: 'textarea', label: 'Section Subtitle'},
            {key: 'columns', type: 'number', label: 'Columns', min: 1, max: 6},
            {key: 'gap', type: 'select', label: 'Gap', options: ['small', 'medium', 'large']},
            {
                key: 'cardStyle',
                type: 'select',
                label: 'Card Style',
                options: ['default', 'bordered', 'shadow', 'minimal']
            },
            {key: 'cards', type: 'cards', label: 'Cards'}
        ],
        template: (config) => {
            const gapClass = config.gap === 'small' ? 'gap-2' : config.gap === 'large' ? 'gap-6' : 'gap-4';

            const headerHtml = config.sectionTitle ? `
        <div class="text-center mb-8">
            <h2 class="text-3xl font-bold mb-2">${config.sectionTitle}</h2>
            ${config.sectionSubtitle ? `<p class="text-muted">${config.sectionSubtitle}</p>` : ''}
        </div>` : '';

            const cardsHtml = config.cards.map(card => {
                const cardClass = config.cardStyle === 'bordered' ? 'card card-bordered' :
                    config.cardStyle === 'shadow' ? 'card card-shadow' :
                        config.cardStyle === 'minimal' ? 'card card-minimal' : 'card';

                const imageHtml = card.image ? `<img src="${card.image}" alt="${card.title}" class="card-img-top">` : '';
                const iconHtml = !card.image && card.icon ? `<div class="card-icon mb-3"><span data-icon="${card.icon}" data-icon-size="32"></span></div>` : '';

                return `        <div class="${cardClass}">
            ${imageHtml}
            <div class="card-body">
                ${iconHtml}
                <h3 class="card-title">${card.title}</h3>
                <p class="card-text">${card.text}</p>
                ${card.link && card.link !== '#' ? `<a href="${card.link}" class="btn btn-link">Learn more</a>` : ''}
            </div>
        </div>`;
            }).join('\n');

            return `<section class="py-12">
    <div class="container">
        ${headerHtml}
        <div class="grid grid-cols-${config.columns} ${gapClass}">
${cardsHtml}
        </div>
    </div>
</section>`;
        }
    },

    form: {
        name: 'Form Section',
        icon: 'edit',
        category: 'interactive',
        description: 'Contact form, newsletter signup, or custom form',
        defaults: {
            title: 'Contact Us',
            description: 'Get in touch with us and we\'ll respond within 24 hours.',
            layout: 'stacked',
            submitText: 'Send Message',
            backgroundColor: '',
            fields: [
                {type: 'text', name: 'name', label: 'Name', required: true, placeholder: 'Your name'},
                {type: 'email', name: 'email', label: 'Email', required: true, placeholder: 'your@email.com'},
                {type: 'textarea', name: 'message', label: 'Message', required: false, placeholder: 'Your message...'}
            ],
            action: '',
            method: 'POST'
        },
        editableFields: [
            {key: 'title', type: 'text', label: 'Title'},
            {key: 'description', type: 'textarea', label: 'Description'},
            {key: 'backgroundColor', type: 'color', label: 'Background Colour'},
            {key: 'layout', type: 'select', label: 'Layout', options: ['stacked', 'inline', 'two-column']},
            {key: 'submitText', type: 'text', label: 'Submit Button Text'},
            {key: 'fields', type: 'formFields', label: 'Form Fields'},
            {key: 'action', type: 'text', label: 'Form Action URL'},
            {key: 'method', type: 'select', label: 'Method', options: ['GET', 'POST']}
        ],
        template: (config) => {
            const bgStyle = config.backgroundColor ? `background-color: ${config.backgroundColor};` : '';
            const layoutClass = config.layout === 'inline' ? 'form-inline' :
                config.layout === 'two-column' ? 'grid grid-cols-2 gap-4' : '';

            const fieldsHtml = config.fields.map(field => {
                const requiredAttr = field.required ? 'required' : '';
                const requiredMark = field.required ? ' <span class="text-danger">*</span>' : '';

                if (field.type === 'textarea') {
                    return `            <div class="form-group">
                <label for="${field.name}">${field.label}${requiredMark}</label>
                <textarea class="form-input" id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ''}" rows="4" ${requiredAttr}></textarea>
            </div>`;
                }

                return `            <div class="form-group">
                <label for="${field.name}">${field.label}${requiredMark}</label>
                <input type="${field.type}" class="form-input" id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ''}" ${requiredAttr}>
            </div>`;
            }).join('\n');

            return `<section class="py-12" style="${bgStyle}">
    <div class="container">
        <div class="max-w-lg mx-auto">
            <div class="text-center mb-6">
                <h2 class="text-3xl font-bold mb-2">${config.title}</h2>
                ${config.description ? `<p class="text-muted">${config.description}</p>` : ''}
            </div>
            <form action="${config.action}" method="${config.method}" class="${layoutClass}">
${fieldsHtml}
                <div class="form-group">
                    <button type="submit" class="btn btn-primary btn-block">${config.submitText}</button>
                </div>
            </form>
        </div>
    </div>
</section>`;
        }
    },

    footer: {
        name: 'Footer',
        icon: 'layout',
        category: 'footers',
        description: 'Page footer with copyright, links, and social icons',
        defaults: {
            style: 'simple',
            backgroundColor: '#1f2937',
            textColor: '#e9ecef',
            copyright: '© 2025 My Company. All rights reserved.',
            showNavLinks: true,
            navLinks: [
                {text: 'Home', url: '#'},
                {text: 'About', url: '#'},
                {text: 'Services', url: '#'},
                {text: 'Contact', url: '#'}
            ],
            columns: [
                {
                    title: 'Company',
                    links: [{text: 'About Us', url: '#'}, {text: 'Careers', url: '#'}, {text: 'Contact', url: '#'}]
                },
                {
                    title: 'Resources',
                    links: [{text: 'Blog', url: '#'}, {text: 'Documentation', url: '#'}, {text: 'Support', url: '#'}]
                }
            ],
            showSocial: true,
            socialLinks: [
                {platform: 'twitter', url: '#'},
                {platform: 'facebook', url: '#'},
                {platform: 'instagram', url: '#'}
            ]
        },
        editableFields: [
            {key: 'style', type: 'select', label: 'Style', options: ['simple', 'columns', 'centered']},
            {key: 'backgroundColor', type: 'color', label: 'Background'},
            {key: 'textColor', type: 'color', label: 'Text Colour'},
            {key: 'copyright', type: 'text', label: 'Copyright Text'},
            {key: 'showNavLinks', type: 'toggle', label: 'Show Nav Links'},
            {key: 'navLinks', type: 'links', label: 'Navigation Links', showWhen: {showNavLinks: true}},
            {key: 'columns', type: 'footerColumns', label: 'Columns', showWhen: {style: 'columns'}},
            {key: 'showSocial', type: 'toggle', label: 'Show Social Icons'},
            {key: 'socialLinks', type: 'socialLinks', label: 'Social Links', showWhen: {showSocial: true}}
        ],
        template: (config) => {
            const bgStyle = `background-color: ${config.backgroundColor}; color: ${config.textColor};`;

            const socialHtml = config.showSocial ? `
            <div class="footer-social">
                ${config.socialLinks.map(link => `<a href="${link.url}" class="social-link" aria-label="${link.platform}"><span data-icon="${link.platform}" data-icon-size="20"></span></a>`).join('\n                ')}
            </div>` : '';

            if (config.style === 'simple') {
                const navHtml = config.showNavLinks ? `
            <nav class="footer-nav mb-3">
                ${config.navLinks.map(link => `<a href="${link.url}">${link.text}</a>`).join(' · ')}
            </nav>` : '';

                return `<footer class="footer py-6" style="${bgStyle}">
    <div class="container text-center">
        ${navHtml}
        ${socialHtml}
        <p class="footer-copyright mt-3">${config.copyright}</p>
    </div>
</footer>`;
            }

            if (config.style === 'columns') {
                const columnsHtml = config.columns.map(col => `
            <div class="footer-column">
                <h4 class="footer-column-title">${col.title}</h4>
                <ul class="footer-links">
                    ${col.links.map(link => `<li><a href="${link.url}">${link.text}</a></li>`).join('\n                    ')}
                </ul>
            </div>`).join('');

                return `<footer class="footer py-8" style="${bgStyle}">
    <div class="container">
        <div class="grid grid-cols-${config.columns.length + 1} gap-6">
            <div class="footer-brand">
                <h3 class="text-xl font-bold mb-3">My Company</h3>
                <p class="text-sm opacity-75">Building amazing things.</p>
                ${socialHtml}
            </div>
            ${columnsHtml}
        </div>
        <div class="footer-bottom mt-6 pt-4" style="border-top: 1px solid rgba(255,255,255,0.1);">
            <p class="text-center text-sm opacity-75">${config.copyright}</p>
        </div>
    </div>
</footer>`;
            }

            // centered style
            return `<footer class="footer py-8" style="${bgStyle}">
    <div class="container text-center">
        ${socialHtml}
        <p class="footer-copyright mt-4">${config.copyright}</p>
    </div>
</footer>`;
        }
    },

    content: {
        name: 'Content Block',
        icon: 'document-text',
        category: 'content',
        description: 'Rich text content section with optional image',
        defaults: {
            title: 'About Us',
            content: '<p>Write your content here. This section supports rich text formatting.</p>',
            layout: 'text-only',
            imagePosition: 'right',
            image: '',
            imageAlt: ''
        },
        editableFields: [
            {key: 'title', type: 'text', label: 'Title'},
            {key: 'content', type: 'richtext', label: 'Content'},
            {key: 'layout', type: 'select', label: 'Layout', options: ['text-only', 'text-image', 'image-text']},
            {key: 'image', type: 'text', label: 'Image URL', showWhen: {layout: ['text-image', 'image-text']}},
            {key: 'imageAlt', type: 'text', label: 'Image Alt Text', showWhen: {layout: ['text-image', 'image-text']}}
        ],
        template: (config) => {
            if (config.layout === 'text-only') {
                return `<section class="py-12">
    <div class="container">
        <div class="max-w-3xl mx-auto">
            ${config.title ? `<h2 class="text-3xl font-bold mb-4">${config.title}</h2>` : ''}
            <div class="content">
                ${config.content}
            </div>
        </div>
    </div>
</section>`;
            }

            const imageFirst = config.layout === 'image-text';
            const imageCol = `<div class="col-6">
                <img src="${config.image}" alt="${config.imageAlt}" class="img-fluid rounded">
            </div>`;
            const textCol = `<div class="col-6">
                ${config.title ? `<h2 class="text-3xl font-bold mb-4">${config.title}</h2>` : ''}
                <div class="content">
                    ${config.content}
                </div>
            </div>`;

            return `<section class="py-12">
    <div class="container">
        <div class="row align-center gap-6">
            ${imageFirst ? imageCol : textCol}
            ${imageFirst ? textCol : imageCol}
        </div>
    </div>
</section>`;
        }
    },

    navbar: {
        name: 'Navigation Bar',
        icon: 'menu',
        category: 'headers',
        description: 'Top navigation bar with logo and menu links',
        defaults: {
            brandText: 'My Site',
            brandImage: '',
            style: 'light',
            sticky: false,
            links: [
                {text: 'Home', url: '#'},
                {text: 'About', url: '#'},
                {text: 'Services', url: '#'},
                {text: 'Contact', url: '#'}
            ],
            showCta: true,
            ctaText: 'Get Started',
            ctaUrl: '#'
        },
        editableFields: [
            {key: 'brandText', type: 'text', label: 'Brand Text'},
            {key: 'brandImage', type: 'text', label: 'Logo URL'},
            {key: 'style', type: 'select', label: 'Style', options: ['light', 'dark', 'transparent']},
            {key: 'sticky', type: 'toggle', label: 'Sticky'},
            {key: 'links', type: 'links', label: 'Menu Links'},
            {key: 'showCta', type: 'toggle', label: 'Show CTA Button'},
            {key: 'ctaText', type: 'text', label: 'CTA Text', showWhen: {showCta: true}},
            {key: 'ctaUrl', type: 'text', label: 'CTA URL', showWhen: {showCta: true}}
        ],
        template: (config) => {
            const styleClass = config.style === 'dark' ? 'navbar-dark' :
                config.style === 'transparent' ? 'navbar-transparent' : 'navbar-light';
            const stickyClass = config.sticky ? 'navbar-sticky' : '';

            const brandHtml = config.brandImage ?
                `<img src="${config.brandImage}" alt="${config.brandText}" class="navbar-logo">` :
                `<span class="navbar-brand-text">${config.brandText}</span>`;

            const linksHtml = config.links.map(link =>
                `<a href="${link.url}" class="nav-link">${link.text}</a>`
            ).join('\n            ');

            const ctaHtml = config.showCta ?
                `<a href="${config.ctaUrl}" class="btn btn-primary btn-sm">${config.ctaText}</a>` : '';

            return `<nav class="navbar ${styleClass} ${stickyClass}">
    <div class="container">
        <a href="#" class="navbar-brand">
            ${brandHtml}
        </a>
        <div class="navbar-nav">
            ${linksHtml}
        </div>
        <div class="navbar-actions">
            ${ctaHtml}
        </div>
    </div>
</nav>`;
        }
    }
};


// ============================================================================
// Template Manager - Handles localStorage persistence
// ============================================================================

class TemplateManager {
    static STORAGE_KEY = 'quick-roller-templates';
    static ACTIVE_KEY = 'quick-roller-active';

    /**
     * List all saved templates
     * @returns {string[]} Template names
     */
    static list() {
        const data = S.get(this.STORAGE_KEY, {});
        return Object.keys(data);
    }

    /**
     * Get all templates with metadata
     * @returns {Object} All templates
     */
    static getAll() {
        return S.get(this.STORAGE_KEY, {});
    }

    /**
     * Load a template by name
     * @param {string} name - Template name
     * @returns {Object|null} Template data or null
     */
    static load(name) {
        const data = S.get(this.STORAGE_KEY, {});
        return data[name] || null;
    }

    /**
     * Save a template
     * @param {string} name - Template name
     * @param {Object} template - Template data
     * @returns {boolean} Success
     */
    static save(name, template) {
        const data = S.get(this.STORAGE_KEY, {});
        template.name = name;
        template.modified = new Date().toISOString();
        if (!template.created) {
            template.created = template.modified;
        }
        data[name] = template;
        return S.set(this.STORAGE_KEY, data);
    }

    /**
     * Delete a template
     * @param {string} name - Template name
     * @returns {boolean} Success
     */
    static delete(name) {
        const data = S.get(this.STORAGE_KEY, {});
        if (data[name]) {
            delete data[name];
            return S.set(this.STORAGE_KEY, data);
        }
        return false;
    }

    /**
     * Rename a template
     * @param {string} oldName - Current name
     * @param {string} newName - New name
     * @returns {boolean} Success
     */
    static rename(oldName, newName) {
        const data = S.get(this.STORAGE_KEY, {});
        if (data[oldName] && !data[newName]) {
            data[newName] = {...data[oldName], name: newName, modified: new Date().toISOString()};
            delete data[oldName];
            return S.set(this.STORAGE_KEY, data);
        }
        return false;
    }

    /**
     * Save active working document
     * @param {Object} page - Current page state
     */
    static saveActive(page) {
        S.set(this.ACTIVE_KEY, page);
    }

    /**
     * Load active working document
     * @returns {Object|null}
     */
    static loadActive() {
        return S.get(this.ACTIVE_KEY, null);
    }

    /**
     * Clear active working document
     */
    static clearActive() {
        S.remove(this.ACTIVE_KEY);
    }
}


// ============================================================================
// QuickRoller Class - Main component
// ============================================================================

/**
 * QuickRoller - Page Builder Component
 */
class QuickRoller {
    static defaults = {
        template: null,
        theme: 'light',
        themeVariant: null,
        useGrid: true,
        useTheme: true,
        useThemeRoller: false,
        splitView: true,
        autoSave: true,
        autoSaveInterval: 30000,
        onChange: null,
        onSave: null,
        onExport: null
    };

    /**
     * Create a QuickRoller instance
     * @param {string|Element} selector - Container selector or element
     * @param {Object} options - Configuration options
     */
    constructor(selector, options = {}) {
        this.element = typeof selector === 'string' ?
            document.querySelector(selector) : selector;

        if (!this.element) {
            console.error('QuickRoller: Container element not found');
            return;
        }

        this.options = {...QuickRoller.defaults, ...options};
        this._sections = [];
        this._selectedIndex = -1;
        this._pageConfig = {
            theme: this.options.theme,
            variant: this.options.themeVariant,
            useGrid: this.options.useGrid,
            useTheme: this.options.useTheme,
            customCSS: '',
            meta: {
                title: 'My Page',
                description: '',
                charset: 'UTF-8',
                viewport: 'width=device-width, initial-scale=1.0'
            }
        };
        this._templateName = '';
        this._isDirty = false;
        this._autoSaveTimer = null;
        this._eventHandlers = [];

        this._init();
    }

    /**
     * Initialise the component
     * @private
     */
    _init() {
        // Load active document or template
        if (this.options.template) {
            this.loadTemplate(this.options.template);
        } else {
            const active = TemplateManager.loadActive();
            if (active) {
                this._loadPageData(active);
            }
        }

        this._render();
        this._bindEvents();

        // Scan icons in the entire component
        if (typeof Domma !== 'undefined' && Domma.icons) {
            Domma.icons.scan(this.element);
        }

        this._refreshPreview();

        // Set up auto-save
        if (this.options.autoSave) {
            this._autoSaveTimer = setInterval(() => {
                this.saveToStorage();
            }, this.options.autoSaveInterval);
        }
    }

    /**
     * Render the component UI
     * @private
     */
    _render() {
        this.element.classList.add('qr-container');
        this.element.innerHTML = this._buildHTML();

        // Cache DOM references
        this._refs = {
            header: this.element.querySelector('.qr-header'),
            templateName: this.element.querySelector('.qr-template-name'),
            library: this.element.querySelector('.qr-library'),
            canvas: this.element.querySelector('.qr-canvas'),
            editor: this.element.querySelector('.qr-editor'),
            preview: this.element.querySelector('.qr-preview-frame'),
            actions: this.element.querySelector('.qr-actions')
        };
    }

    /**
     * Build the main HTML structure
     * @private
     * @returns {string} HTML string
     */
    _buildHTML() {
        const sectionItems = Object.entries(SECTION_REGISTRY).map(([key, def]) => `
            <div class="qr-library-item" data-section-type="${key}" draggable="true" title="${def.description}">
                <span class="qr-library-icon" data-icon="${def.icon}" data-icon-size="20"></span>
                <span class="qr-library-name">${def.name}</span>
            </div>
        `).join('');

        const themeOptions = `
            <option value="">No Theme</option>
            <option value="light" ${this._pageConfig.theme === 'light' ? 'selected' : ''}>Light</option>
            <option value="dark" ${this._pageConfig.theme === 'dark' ? 'selected' : ''}>Dark</option>
        `;

        const variantOptions = `
            <option value="">Default</option>
            <option value="ocean">Ocean</option>
            <option value="forest">Forest</option>
            <option value="sunset">Sunset</option>
            <option value="royal">Royal</option>
            <option value="lemon">Lemon</option>
            <option value="silver">Silver</option>
            <option value="charcoal">Charcoal</option>
        `;

        return `
            <div class="qr-header">
                <div class="qr-header-left">
                    <button class="qr-btn qr-btn-icon" data-action="new" title="New Page">
                        <span data-icon="document-add" data-icon-size="18"></span>
                    </button>
                    <button class="qr-btn qr-btn-icon" data-action="save" title="Save Template">
                        <span data-icon="save" data-icon-size="18"></span>
                    </button>
                    <div class="qr-dropdown">
                        <button class="qr-btn qr-btn-icon" data-action="load" title="Load Template">
                            <span data-icon="folder-open" data-icon-size="18"></span>
                        </button>
                        <div class="qr-dropdown-menu qr-templates-menu"></div>
                    </div>
                    <input type="text" class="qr-template-name" placeholder="Untitled Page" value="${this._escapeHtml(this._templateName)}">
                </div>
                <div class="qr-header-center">
                    <span class="qr-title">Quick Roller</span>
                </div>
                <div class="qr-header-right">
                    <label class="qr-label">Theme:</label>
                    <select class="qr-select qr-theme-select">${themeOptions}</select>
                    <select class="qr-select qr-variant-select">${variantOptions}</select>
                    <label class="qr-checkbox">
                        <input type="checkbox" class="qr-grid-toggle" ${this._pageConfig.useGrid ? 'checked' : ''}>
                        <span>Grid</span>
                    </label>
                </div>
            </div>

            <div class="qr-body">
                <div class="qr-sidebar">
                    <div class="qr-library">
                        <div class="qr-section-title">Sections</div>
                        ${sectionItems}
                    </div>
                    <div class="qr-editor">
                        <div class="qr-section-title">Properties</div>
                        <div class="qr-editor-content">
                            <p class="qr-editor-placeholder">Select a section to edit its properties</p>
                        </div>
                    </div>
                </div>

                <div class="qr-main">
                    <div class="qr-canvas-container">
                        <div class="qr-canvas">
                            <div class="qr-drop-zone qr-drop-zone-empty" data-position="0">
                                <span data-icon="plus" data-icon-size="24"></span>
                                <span>Click a section or drag here to add</span>
                            </div>
                        </div>
                    </div>
                    ${this.options.splitView ? `
                    <div class="qr-preview-container">
                        <div class="qr-preview-header">
                            <span>Preview</span>
                            <button class="qr-btn qr-btn-sm" data-action="preview-full" title="Open in new window">
                                <span data-icon="external-link" data-icon-size="14"></span>
                            </button>
                        </div>
                        <iframe class="qr-preview-frame" sandbox="allow-same-origin"></iframe>
                    </div>
                    ` : ''}
                </div>
            </div>

            <div class="qr-actions">
                <button class="qr-btn" data-action="copy">
                    <span data-icon="copy" data-icon-size="16"></span>
                    Copy HTML
                </button>
                <button class="qr-btn" data-action="download">
                    <span data-icon="download" data-icon-size="16"></span>
                    Download
                </button>
                <button class="qr-btn" data-action="save-storage">
                    <span data-icon="database" data-icon-size="16"></span>
                    Save to Browser
                </button>
                <button class="qr-btn qr-btn-primary" data-action="preview-full">
                    <span data-icon="eye" data-icon-size="16"></span>
                    Full Preview
                </button>
            </div>
        `;
    }

    /**
     * Bind event handlers
     * @private
     */
    _bindEvents() {
        // Header actions
        this._on(this.element, 'click', '[data-action]', (e) => {
            const action = e.target.closest('[data-action]').dataset.action;
            this._handleAction(action);
        });

        // Template name change
        this._on(this._refs.templateName, 'input', null, (e) => {
            this._templateName = e.target.value;
            this._markDirty();
        });

        // Theme and variant selects
        this._on(this.element, 'change', '.qr-theme-select', (e) => {
            this._pageConfig.theme = e.target.value || null;
            this._markDirty();
            this._refreshPreview();
        });

        this._on(this.element, 'change', '.qr-variant-select', (e) => {
            this._pageConfig.variant = e.target.value || null;
            this._markDirty();
            this._refreshPreview();
        });

        this._on(this.element, 'change', '.qr-grid-toggle', (e) => {
            this._pageConfig.useGrid = e.target.checked;
            this._markDirty();
            this._refreshPreview();
        });

        // Library item click to add
        this._on(this._refs.library, 'click', '.qr-library-item', (e) => {
            const type = e.target.closest('.qr-library-item').dataset.sectionType;
            this.addSection(type);
        });

        // Library item drag start
        this._on(this._refs.library, 'dragstart', '.qr-library-item', (e) => {
            e.dataTransfer.setData('section-type', e.target.closest('.qr-library-item').dataset.sectionType);
            e.dataTransfer.effectAllowed = 'copy';
            this._dragSource = 'library';
        });

        // Canvas section click to select
        this._on(this._refs.canvas, 'click', '.qr-section', (e) => {
            if (e.target.closest('.qr-section-controls')) return;
            const index = parseInt(e.target.closest('.qr-section').dataset.index);
            this._selectSection(index);
        });

        // Canvas section controls
        this._on(this._refs.canvas, 'click', '.qr-section-controls button', (e) => {
            const btn = e.target.closest('button');
            const section = btn.closest('.qr-section');
            const index = parseInt(section.dataset.index);
            const action = btn.dataset.action;

            if (action === 'move-up') {
                this.moveSection(index, index - 1);
            } else if (action === 'move-down') {
                this.moveSection(index, index + 1);
            } else if (action === 'delete') {
                this.removeSection(index);
            } else if (action === 'duplicate') {
                this._duplicateSection(index);
            }
        });

        // Canvas drag and drop
        this._on(this._refs.canvas, 'dragstart', '.qr-section', (e) => {
            e.dataTransfer.setData('section-index', e.target.closest('.qr-section').dataset.index);
            e.dataTransfer.effectAllowed = 'move';
            this._dragSource = 'canvas';
            e.target.closest('.qr-section').classList.add('qr-dragging');
        });

        this._on(this._refs.canvas, 'dragend', '.qr-section', (e) => {
            e.target.closest('.qr-section').classList.remove('qr-dragging');
        });

        this._on(this._refs.canvas, 'dragover', '.qr-drop-zone', (e) => {
            e.preventDefault();
            e.target.closest('.qr-drop-zone').classList.add('qr-drop-active');
        });

        this._on(this._refs.canvas, 'dragleave', '.qr-drop-zone', (e) => {
            e.target.closest('.qr-drop-zone').classList.remove('qr-drop-active');
        });

        this._on(this._refs.canvas, 'drop', '.qr-drop-zone', (e) => {
            e.preventDefault();
            const zone = e.target.closest('.qr-drop-zone');
            zone.classList.remove('qr-drop-active');
            const position = parseInt(zone.dataset.position);

            if (this._dragSource === 'library') {
                const type = e.dataTransfer.getData('section-type');
                this.addSection(type, position);
            } else {
                const fromIndex = parseInt(e.dataTransfer.getData('section-index'));
                this.moveSection(fromIndex, position);
            }
        });

        // Editor form changes
        this._on(this._refs.editor, 'input', 'input, textarea, select', (e) => {
            this._handleEditorChange(e);
        });

        this._on(this._refs.editor, 'change', 'input[type="checkbox"], select', (e) => {
            this._handleEditorChange(e);
        });

        // Load templates dropdown
        this._on(this.element, 'click', '.qr-templates-menu .qr-menu-item', (e) => {
            const name = e.target.closest('.qr-menu-item').dataset.template;
            if (name) {
                this.loadTemplate(name);
            }
        });
    }

    /**
     * Utility for event delegation with cleanup tracking
     * @private
     */
    _on(element, event, selector, handler) {
        const wrapper = (e) => {
            if (selector) {
                const target = e.target.closest(selector);
                if (target && element.contains(target)) {
                    handler.call(target, e);
                }
            } else {
                handler.call(element, e);
            }
        };

        element.addEventListener(event, wrapper);
        this._eventHandlers.push({element, event, wrapper});
    }

    /**
     * Handle toolbar actions
     * @private
     */
    _handleAction(action) {
        switch (action) {
            case 'new':
                this.newPage();
                break;
            case 'save':
                this._showSaveDialog();
                break;
            case 'load':
                this._toggleTemplatesMenu();
                break;
            case 'copy':
                this.copyToClipboard();
                break;
            case 'download':
                this.download();
                break;
            case 'save-storage':
                this.saveToStorage();
                break;
            case 'preview-full':
                this.openPreviewWindow();
                break;
        }
    }

    /**
     * Handle editor field changes
     * @private
     */
    _handleEditorChange(e) {
        if (this._selectedIndex < 0) return;

        const field = e.target.closest('[data-field]');
        if (!field) return;

        const key = field.dataset.field;
        let value;

        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        } else if (e.target.type === 'number') {
            value = parseInt(e.target.value) || 0;
        } else {
            value = e.target.value;
        }

        this._sections[this._selectedIndex].config[key] = value;
        this._markDirty();
        this._refreshPreview();
        this._renderCanvasSections();
    }

    /**
     * Mark document as dirty (unsaved changes)
     * @private
     */
    _markDirty() {
        this._isDirty = true;
        if (this.options.onChange) {
            this.options.onChange(this._getPageData());
        }
    }

    /**
     * Select a section for editing
     * @private
     */
    _selectSection(index) {
        this._selectedIndex = index;

        // Update canvas selection
        this._refs.canvas.querySelectorAll('.qr-section').forEach((el, i) => {
            el.classList.toggle('qr-selected', i === index);
        });

        // Render editor
        this._renderEditor();
    }

    /**
     * Render the editor panel for selected section
     * @private
     */
    _renderEditor() {
        const content = this._refs.editor.querySelector('.qr-editor-content');

        if (this._selectedIndex < 0 || !this._sections[this._selectedIndex]) {
            content.innerHTML = '<p class="qr-editor-placeholder">Select a section to edit its properties</p>';
            return;
        }

        const section = this._sections[this._selectedIndex];
        const definition = SECTION_REGISTRY[section.type];

        if (!definition) {
            content.innerHTML = '<p class="qr-editor-placeholder">Unknown section type</p>';
            return;
        }

        let fieldsHtml = '';

        for (const field of definition.editableFields) {
            // Check showWhen condition
            if (field.showWhen) {
                const conditionMet = Object.entries(field.showWhen).every(([key, value]) => {
                    if (Array.isArray(value)) {
                        return value.includes(section.config[key]);
                    }
                    return section.config[key] === value;
                });
                if (!conditionMet) continue;
            }

            fieldsHtml += this._renderEditorField(field, section.config[field.key]);
        }

        content.innerHTML = `
            <div class="qr-editor-section-header">
                <span data-icon="${definition.icon}" data-icon-size="18"></span>
                <span>${definition.name}</span>
            </div>
            <div class="qr-editor-fields">
                ${fieldsHtml}
            </div>
        `;

        // Scan for icons
        if (typeof Domma !== 'undefined' && Domma.icons) {
            Domma.icons.scan(content);
        }
    }

    /**
     * Render a single editor field
     * @private
     */
    _renderEditorField(field, value) {
        const escaped = this._escapeHtml(String(value ?? ''));

        switch (field.type) {
            case 'text':
                return `
                    <div class="qr-field" data-field="${field.key}">
                        <label class="qr-field-label">${field.label}</label>
                        <input type="text" class="qr-input" value="${escaped}">
                    </div>
                `;

            case 'textarea':
                return `
                    <div class="qr-field" data-field="${field.key}">
                        <label class="qr-field-label">${field.label}</label>
                        <textarea class="qr-input qr-textarea">${escaped}</textarea>
                    </div>
                `;

            case 'richtext':
                return `
                    <div class="qr-field" data-field="${field.key}">
                        <label class="qr-field-label">${field.label}</label>
                        <textarea class="qr-input qr-textarea qr-richtext">${escaped}</textarea>
                    </div>
                `;

            case 'number':
                return `
                    <div class="qr-field" data-field="${field.key}">
                        <label class="qr-field-label">${field.label}</label>
                        <input type="number" class="qr-input" value="${value}" min="${field.min ?? ''}" max="${field.max ?? ''}">
                    </div>
                `;

            case 'color':
                return `
                    <div class="qr-field" data-field="${field.key}">
                        <label class="qr-field-label">${field.label}</label>
                        <div class="qr-color-wrapper">
                            <input type="color" class="qr-color" value="${escaped}">
                            <input type="text" class="qr-input qr-color-text" value="${escaped}">
                        </div>
                    </div>
                `;

            case 'select':
                const options = field.options.map(opt =>
                    `<option value="${opt}" ${value === opt ? 'selected' : ''}>${this._capitalize(opt)}</option>`
                ).join('');
                return `
                    <div class="qr-field" data-field="${field.key}">
                        <label class="qr-field-label">${field.label}</label>
                        <select class="qr-select">${options}</select>
                    </div>
                `;

            case 'toggle':
                return `
                    <div class="qr-field" data-field="${field.key}">
                        <label class="qr-checkbox">
                            <input type="checkbox" ${value ? 'checked' : ''}>
                            <span>${field.label}</span>
                        </label>
                    </div>
                `;

            case 'buttons':
            case 'cards':
            case 'formFields':
            case 'links':
            case 'footerColumns':
            case 'socialLinks':
                // Complex fields - simplified for now
                return `
                    <div class="qr-field" data-field="${field.key}">
                        <label class="qr-field-label">${field.label}</label>
                        <p class="qr-field-note">Edit in JSON format (advanced)</p>
                        <textarea class="qr-input qr-textarea qr-json">${JSON.stringify(value, null, 2)}</textarea>
                    </div>
                `;

            default:
                return '';
        }
    }

    /**
     * Render canvas sections
     * @private
     */
    _renderCanvasSections() {
        let html = '';

        if (this._sections.length === 0) {
            html = `
                <div class="qr-drop-zone qr-drop-zone-empty" data-position="0">
                    <span data-icon="plus" data-icon-size="24"></span>
                    <span>Click a section or drag here to add</span>
                </div>
            `;
        } else {
            html = '<div class="qr-drop-zone" data-position="0"></div>';

            this._sections.forEach((section, index) => {
                const def = SECTION_REGISTRY[section.type];
                const isSelected = index === this._selectedIndex;

                html += `
                    <div class="qr-section ${isSelected ? 'qr-selected' : ''}"
                         data-index="${index}"
                         data-type="${section.type}"
                         draggable="true">
                        <div class="qr-section-header">
                            <span data-icon="${def?.icon || 'box'}" data-icon-size="16"></span>
                            <span class="qr-section-name">${def?.name || section.type}</span>
                        </div>
                        <div class="qr-section-preview">
                            ${this._getSectionPreviewLabel(section)}
                        </div>
                        <div class="qr-section-controls">
                            <button data-action="move-up" title="Move Up" ${index === 0 ? 'disabled' : ''}>
                                <span data-icon="chevron-up" data-icon-size="14"></span>
                            </button>
                            <button data-action="move-down" title="Move Down" ${index === this._sections.length - 1 ? 'disabled' : ''}>
                                <span data-icon="chevron-down" data-icon-size="14"></span>
                            </button>
                            <button data-action="duplicate" title="Duplicate">
                                <span data-icon="copy" data-icon-size="14"></span>
                            </button>
                            <button data-action="delete" title="Delete">
                                <span data-icon="trash" data-icon-size="14"></span>
                            </button>
                        </div>
                    </div>
                    <div class="qr-drop-zone" data-position="${index + 1}"></div>
                `;
            });
        }

        this._refs.canvas.innerHTML = html;

        // Scan icons
        if (typeof Domma !== 'undefined' && Domma.icons) {
            Domma.icons.scan(this._refs.canvas);
        }
    }

    /**
     * Get a preview label for a section
     * @private
     */
    _getSectionPreviewLabel(section) {
        const config = section.config;

        switch (section.type) {
            case 'hero':
                return this._escapeHtml(config.title || 'Untitled Hero');
            case 'cardGrid':
                return `${config.cards?.length || 0} cards, ${config.columns} columns`;
            case 'form':
                return this._escapeHtml(config.title || 'Untitled Form');
            case 'footer':
                return `${this._capitalize(config.style)} style`;
            case 'content':
                return this._escapeHtml(config.title || 'Content Block');
            case 'navbar':
                return this._escapeHtml(config.brandText || 'Navigation');
            default:
                return section.type;
        }
    }

    /**
     * Refresh the preview iframe
     * @private
     */
    _refreshPreview() {
        if (!this._refs.preview) return;

        const html = this._generatePreviewHTML();
        this._refs.preview.srcdoc = html;
    }

    /**
     * Generate HTML specifically for the preview iframe with inlined styles
     * @private
     */
    _generatePreviewHTML() {
        // Get computed styles from the current page for theme variables
        const computedStyle = getComputedStyle(document.documentElement);
        const themeVars = [
            '--dm-primary', '--dm-primary-hover', '--dm-secondary', '--dm-success',
            '--dm-danger', '--dm-warning', '--dm-info', '--dm-text', '--dm-text-muted',
            '--dm-background', '--dm-surface', '--dm-border', '--dm-hover-bg',
            '--dm-gray-100', '--dm-gray-200', '--dm-gray-300', '--dm-gray-400',
            '--dm-gray-500', '--dm-gray-600', '--dm-gray-700', '--dm-gray-800', '--dm-gray-900',
            '--dm-radius-sm', '--dm-radius-md', '--dm-radius-lg', '--dm-radius-xl', '--dm-radius-full',
            '--dm-shadow-sm', '--dm-shadow-md', '--dm-shadow-lg', '--dm-shadow-xl',
            '--dm-font-sans', '--dm-font-mono', '--dm-text-xs', '--dm-text-sm', '--dm-text-base',
            '--dm-text-lg', '--dm-text-xl', '--dm-text-2xl', '--dm-text-3xl',
            '--dm-transition-fast', '--dm-transition-normal'
        ];

        let cssVars = ':root {\n';
        for (const v of themeVars) {
            const value = computedStyle.getPropertyValue(v);
            if (value) {
                cssVars += `    ${v}: ${value.trim()};\n`;
            }
        }
        cssVars += '}\n';

        // Basic preview styles
        const previewStyles = `
            ${cssVars}
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                font-family: var(--dm-font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
                color: var(--dm-text, #212529);
                background: var(--dm-background, #fff);
                line-height: 1.5;
            }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
            .text-center { text-align: center; }
            .text-left { text-align: left; }
            .text-right { text-align: right; }
            .text-muted { color: var(--dm-text-muted, #6c757d); }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-3 { margin-bottom: 0.75rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mb-8 { margin-bottom: 2rem; }
            .mt-3 { margin-top: 0.75rem; }
            .mt-4 { margin-top: 1rem; }
            .mt-6 { margin-top: 1.5rem; }
            .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
            .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
            .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
            .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
            .pt-4 { padding-top: 1rem; }
            .text-sm { font-size: 0.875rem; }
            .text-xl { font-size: 1.25rem; }
            .text-2xl { font-size: 1.5rem; }
            .text-3xl { font-size: 1.875rem; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .max-w-lg { max-width: 32rem; }
            .max-w-3xl { max-width: 48rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .opacity-75 { opacity: 0.75; }

            /* Grid */
            .grid { display: grid; }
            .grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
            .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
            .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
            .grid-cols-5 { grid-template-columns: repeat(5, 1fr); }
            .grid-cols-6 { grid-template-columns: repeat(6, 1fr); }
            .gap-2 { gap: 0.5rem; }
            .gap-4 { gap: 1rem; }
            .gap-6 { gap: 1.5rem; }

            /* Row/Col */
            .row { display: flex; flex-wrap: wrap; gap: 1rem; }
            .col-6 { flex: 0 0 calc(50% - 0.5rem); }
            .align-center { align-items: center; }

            /* Hero */
            .hero { position: relative; }
            .hero-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; }
            .hero-subtitle { font-size: 1.125rem; opacity: 0.9; max-width: 600px; margin: 0 auto; }
            .hero-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

            /* Buttons */
            .btn {
                display: inline-flex; align-items: center; justify-content: center;
                padding: 0.625rem 1.25rem; border-radius: var(--dm-radius-md, 0.375rem);
                font-weight: 500; text-decoration: none; cursor: pointer;
                border: 1px solid transparent; transition: all 0.15s ease;
            }
            .btn-primary { background: var(--dm-primary, #6495ED); color: white; }
            .btn-primary:hover { background: var(--dm-primary-hover, #5280d8); }
            .btn-secondary { background: var(--dm-secondary, #6c757d); color: white; }
            .btn-outline { background: transparent; border-color: currentColor; }
            .btn-link { background: none; border: none; color: var(--dm-primary, #6495ED); padding: 0; }
            .btn-block { width: 100%; }
            .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.875rem; }

            /* Cards */
            .card {
                background: var(--dm-surface, #fff);
                border: 1px solid var(--dm-border, #dee2e6);
                border-radius: var(--dm-radius-lg, 0.5rem);
                overflow: hidden;
            }
            .card-bordered { border-width: 2px; }
            .card-shadow { box-shadow: var(--dm-shadow-md); }
            .card-minimal { border: none; background: transparent; }
            .card-body { padding: 1.25rem; }
            .card-title { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }
            .card-text { color: var(--dm-text-muted, #6c757d); font-size: 0.875rem; }
            .card-img-top { width: 100%; height: auto; }
            .card-icon { color: var(--dm-primary, #6495ED); }

            /* Forms */
            .form-group { margin-bottom: 1rem; }
            .form-group label { display: block; margin-bottom: 0.375rem; font-weight: 500; }
            .form-input {
                width: 100%; padding: 0.625rem 0.875rem;
                border: 1px solid var(--dm-border, #dee2e6);
                border-radius: var(--dm-radius-md, 0.375rem);
                font-size: 1rem; font-family: inherit;
                background: var(--dm-background, #fff);
                color: var(--dm-text, #212529);
            }
            .form-input:focus { outline: none; border-color: var(--dm-primary, #6495ED); }
            textarea.form-input { resize: vertical; min-height: 100px; }
            .text-danger { color: var(--dm-danger, #dc3545); }

            /* Footer */
            .footer { color: inherit; }
            .footer a { color: inherit; text-decoration: none; opacity: 0.8; }
            .footer a:hover { opacity: 1; }
            .footer-nav { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
            .footer-social { display: flex; gap: 1rem; justify-content: center; margin-bottom: 1rem; }
            .footer-copyright { opacity: 0.7; font-size: 0.875rem; }
            .footer-column-title { font-weight: 600; margin-bottom: 0.75rem; }
            .footer-links { list-style: none; }
            .footer-links li { margin-bottom: 0.5rem; }
            .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); }

            /* Navbar */
            .navbar {
                display: flex; align-items: center; padding: 1rem 0;
                background: var(--dm-surface, #fff);
            }
            .navbar-dark { background: var(--dm-gray-800, #343a40); color: white; }
            .navbar-light { background: var(--dm-surface, #fff); color: var(--dm-text, #212529); }
            .navbar-transparent { background: transparent; }
            .navbar-sticky { position: sticky; top: 0; z-index: 100; }
            .navbar .container { display: flex; align-items: center; justify-content: space-between; width: 100%; }
            .navbar-brand { font-weight: 600; font-size: 1.25rem; text-decoration: none; color: inherit; }
            .navbar-nav { display: flex; gap: 1.5rem; }
            .nav-link { text-decoration: none; color: inherit; opacity: 0.8; }
            .nav-link:hover { opacity: 1; }
            .navbar-actions { display: flex; gap: 0.5rem; }

            /* Images */
            .img-fluid { max-width: 100%; height: auto; }
            .rounded { border-radius: var(--dm-radius-lg, 0.5rem); }

            /* Content */
            .content p { margin-bottom: 1rem; }
            .content h1, .content h2, .content h3 { margin-bottom: 0.75rem; }
        `;

        // Build body classes
        const bodyClasses = [];
        if (this._pageConfig.theme) bodyClasses.push(`dm-theme-${this._pageConfig.theme}`);
        if (this._pageConfig.variant) bodyClasses.push(`dm-theme-${this._pageConfig.variant}`);

        // Generate section HTML
        let sectionsHtml = '';
        for (const section of this._sections) {
            const definition = SECTION_REGISTRY[section.type];
            if (definition?.template) {
                sectionsHtml += definition.template(section.config);
                sectionsHtml += '\n';
            }
        }

        // If no sections, show placeholder
        if (!sectionsHtml) {
            sectionsHtml = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: var(--dm-text-muted);">
                    <div style="text-align: center;">
                        <p style="font-size: 1.25rem; margin-bottom: 0.5rem;">No sections yet</p>
                        <p style="font-size: 0.875rem;">Click a section from the library to add it</p>
                    </div>
                </div>
            `;
        }

        // Calculate absolute URL to theme CSS
        // Try to find the theme CSS link in the parent document
        let themeCssUrl = '';
        const themeLink = document.querySelector('link[href*="domma-themes"]');
        if (themeLink) {
            // Convert relative path to absolute URL
            themeCssUrl = new URL(themeLink.getAttribute('href'), window.location.href).href;
        }

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    ${themeCssUrl ? `<link rel="stylesheet" href="${themeCssUrl}">` : ''}
    <style>${previewStyles}</style>
</head>
<body${bodyClasses.length ? ` class="${bodyClasses.join(' ')}"` : ''}>
${sectionsHtml}
</body>
</html>`;
    }

    /**
     * Show save dialog
     * @private
     */
    _showSaveDialog() {
        const name = prompt('Enter template name:', this._templateName || 'My Template');
        if (name) {
            this.saveTemplate(name);
        }
    }

    /**
     * Toggle templates dropdown menu
     * @private
     */
    _toggleTemplatesMenu() {
        const menu = this.element.querySelector('.qr-templates-menu');
        const templates = TemplateManager.list();

        if (templates.length === 0) {
            menu.innerHTML = '<div class="qr-menu-empty">No saved templates</div>';
        } else {
            menu.innerHTML = templates.map(name => `
                <div class="qr-menu-item" data-template="${this._escapeHtml(name)}">
                    <span data-icon="document" data-icon-size="14"></span>
                    <span>${this._escapeHtml(name)}</span>
                </div>
            `).join('');
        }

        menu.classList.toggle('qr-visible');

        // Scan icons
        if (typeof Domma !== 'undefined' && Domma.icons) {
            Domma.icons.scan(menu);
        }
    }

    /**
     * Duplicate a section
     * @private
     */
    _duplicateSection(index) {
        if (index < 0 || index >= this._sections.length) return;

        const original = this._sections[index];
        const copy = {
            type: original.type,
            config: JSON.parse(JSON.stringify(original.config))
        };

        this._sections.splice(index + 1, 0, copy);
        this._markDirty();
        this._renderCanvasSections();
        this._refreshPreview();
        this._selectSection(index + 1);
    }

    /**
     * Get page data object
     * @private
     */
    _getPageData() {
        return {
            name: this._templateName,
            config: {...this._pageConfig},
            sections: this._sections.map(s => ({
                type: s.type,
                config: {...s.config}
            }))
        };
    }

    /**
     * Load page data
     * @private
     */
    _loadPageData(data) {
        if (!data) return;

        this._templateName = data.name || '';
        this._pageConfig = {...this._pageConfig, ...data.config};
        this._sections = (data.sections || []).map(s => ({
            type: s.type,
            config: {...(SECTION_REGISTRY[s.type]?.defaults || {}), ...s.config}
        }));
        this._selectedIndex = -1;
    }

    /**
     * Escape HTML special characters
     * @private
     */
    _escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Capitalise first letter
     * @private
     */
    _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Show a toast notification
     * @private
     */
    _showToast(message, type = 'info') {
        if (typeof Domma !== 'undefined' && Domma.elements?.toast) {
            Domma.elements.toast[type]?.(message, {
                position: 'bottom-center',
                duration: 3000
            }) || Domma.elements.toast.show(message);
        } else {
            console.log(`[QuickRoller] ${message}`);
        }
    }

    // ========================================================================
    // Public API
    // ========================================================================

    /**
     * Add a section to the page
     * @param {string} type - Section type from registry
     * @param {number} [position] - Insert position (defaults to end)
     * @returns {QuickRoller} this
     */
    addSection(type, position) {
        const definition = SECTION_REGISTRY[type];
        if (!definition) {
            console.error(`QuickRoller: Unknown section type "${type}"`);
            return this;
        }

        const section = {
            type,
            config: {...definition.defaults}
        };

        if (typeof position === 'number' && position >= 0 && position <= this._sections.length) {
            this._sections.splice(position, 0, section);
            this._selectedIndex = position;
        } else {
            this._sections.push(section);
            this._selectedIndex = this._sections.length - 1;
        }

        this._markDirty();
        this._renderCanvasSections();
        this._renderEditor();
        this._refreshPreview();

        return this;
    }

    /**
     * Remove a section by index
     * @param {number} index - Section index
     * @returns {QuickRoller} this
     */
    removeSection(index) {
        if (index < 0 || index >= this._sections.length) return this;

        this._sections.splice(index, 1);

        if (this._selectedIndex === index) {
            this._selectedIndex = -1;
        } else if (this._selectedIndex > index) {
            this._selectedIndex--;
        }

        this._markDirty();
        this._renderCanvasSections();
        this._renderEditor();
        this._refreshPreview();

        return this;
    }

    /**
     * Move a section to a new position
     * @param {number} from - Current index
     * @param {number} to - Target position
     * @returns {QuickRoller} this
     */
    moveSection(from, to) {
        if (from < 0 || from >= this._sections.length) return this;
        if (to < 0 || to > this._sections.length) return this;
        if (from === to) return this;

        const [section] = this._sections.splice(from, 1);
        const insertAt = to > from ? to - 1 : to;
        this._sections.splice(insertAt, 0, section);

        if (this._selectedIndex === from) {
            this._selectedIndex = insertAt;
        }

        this._markDirty();
        this._renderCanvasSections();
        this._refreshPreview();

        return this;
    }

    /**
     * Update a section's configuration
     * @param {number} index - Section index
     * @param {Object} config - Configuration updates
     * @returns {QuickRoller} this
     */
    updateSection(index, config) {
        if (index < 0 || index >= this._sections.length) return this;

        this._sections[index].config = {...this._sections[index].config, ...config};
        this._markDirty();
        this._refreshPreview();

        if (index === this._selectedIndex) {
            this._renderEditor();
        }

        return this;
    }

    /**
     * Get a section by index
     * @param {number} index - Section index
     * @returns {Object|null} Section data
     */
    getSection(index) {
        return this._sections[index] || null;
    }

    /**
     * Get all sections
     * @returns {Array} All sections
     */
    getSections() {
        return [...this._sections];
    }

    /**
     * Set theme and variant
     * @param {string|null} theme - 'light', 'dark', or null
     * @param {string|null} [variant] - Theme variant
     * @returns {QuickRoller} this
     */
    setTheme(theme, variant) {
        this._pageConfig.theme = theme;
        if (typeof variant !== 'undefined') {
            this._pageConfig.variant = variant;
        }

        // Update selects
        const themeSelect = this.element.querySelector('.qr-theme-select');
        const variantSelect = this.element.querySelector('.qr-variant-select');
        if (themeSelect) themeSelect.value = theme || '';
        if (variantSelect) variantSelect.value = variant || '';

        this._markDirty();
        this._refreshPreview();

        return this;
    }

    /**
     * Set grid enabled state
     * @param {boolean} enabled
     * @returns {QuickRoller} this
     */
    setGridEnabled(enabled) {
        this._pageConfig.useGrid = enabled;

        const toggle = this.element.querySelector('.qr-grid-toggle');
        if (toggle) toggle.checked = enabled;

        this._markDirty();
        this._refreshPreview();

        return this;
    }

    /**
     * Get page configuration
     * @returns {Object} Page config
     */
    getPageConfig() {
        return {...this._pageConfig};
    }

    /**
     * Generate HTML string
     * @param {Object} [options] - Export options
     * @returns {string} HTML string
     */
    exportHTML(options = {}) {
        const {
            minify = false,
            includeComments = true,
            standalone = true
        } = options;

        let html = '';

        if (standalone) {
            html += '<!DOCTYPE html>\n';
            html += '<html lang="en">\n';
            html += '<head>\n';
            html += `    <meta charset="${this._pageConfig.meta.charset}">\n`;
            html += `    <meta name="viewport" content="${this._pageConfig.meta.viewport}">\n`;
            html += `    <title>${this._escapeHtml(this._pageConfig.meta.title)}</title>\n`;

            if (this._pageConfig.meta.description) {
                html += `    <meta name="description" content="${this._escapeHtml(this._pageConfig.meta.description)}">\n`;
            }

            // CSS
            if (this._pageConfig.useTheme) {
                html += '    <link rel="stylesheet" href="domma-themes.css">\n';
            }
            if (this._pageConfig.useGrid) {
                html += '    <link rel="stylesheet" href="domma.css">\n';
            }

            // Custom CSS
            if (this._pageConfig.customCSS) {
                html += '    <style>\n';
                html += this._pageConfig.customCSS;
                html += '\n    </style>\n';
            }

            html += '</head>\n';

            // Body classes
            const bodyClasses = [];
            if (this._pageConfig.theme) bodyClasses.push(`dm-theme-${this._pageConfig.theme}`);
            if (this._pageConfig.variant) bodyClasses.push(`dm-theme-${this._pageConfig.variant}`);

            html += `<body${bodyClasses.length ? ` class="${bodyClasses.join(' ')}"` : ''}>\n`;
        }

        // Sections
        for (const section of this._sections) {
            const definition = SECTION_REGISTRY[section.type];
            if (definition?.template) {
                if (includeComments) {
                    html += `\n<!-- ${definition.name} Section -->\n`;
                }
                html += definition.template(section.config);
                html += '\n';
            }
        }

        if (standalone) {
            // Scripts
            html += '\n    <script src="domma.min.js"><\/script>\n';
            html += '    <script>\n';
            html += '        // Initialise Domma\n';
            html += '        Domma.icons.scan();\n';
            html += '    <\/script>\n';
            html += '</body>\n';
            html += '</html>\n';
        }

        return minify ? html.replace(/\n\s*/g, '') : html;
    }

    /**
     * Copy HTML to clipboard
     * @returns {Promise<QuickRoller>} this
     */
    async copyToClipboard() {
        const html = this.exportHTML({standalone: true});

        await utils.copyToClipboard(html);
        this._showToast('HTML copied to clipboard', 'success');

        if (this.options.onExport) {
            this.options.onExport({type: 'copy', html});
        }

        return this;
    }

    /**
     * Download as HTML file
     * @param {string} [filename='page'] - Filename without extension
     * @returns {QuickRoller} this
     */
    download(filename) {
        const name = filename || this._templateName || 'page';
        const html = this.exportHTML({standalone: true});
        const blob = new Blob([html], {type: 'text/html'});
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${name}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        this._showToast('Page downloaded', 'success');

        if (this.options.onExport) {
            this.options.onExport({type: 'download', filename: name, html});
        }

        return this;
    }

    /**
     * Save to localStorage
     * @returns {QuickRoller} this
     */
    saveToStorage() {
        TemplateManager.saveActive(this._getPageData());
        this._isDirty = false;
        this._showToast('Page saved to browser', 'success');
        return this;
    }

    /**
     * Save as named template
     * @param {string} name - Template name
     * @returns {QuickRoller} this
     */
    saveTemplate(name) {
        this._templateName = name;
        this._refs.templateName.value = name;

        TemplateManager.save(name, this._getPageData());
        this._isDirty = false;
        this._showToast(`Template "${name}" saved`, 'success');

        if (this.options.onSave) {
            this.options.onSave({name, data: this._getPageData()});
        }

        return this;
    }

    /**
     * Load a named template
     * @param {string} name - Template name
     * @returns {QuickRoller} this
     */
    loadTemplate(name) {
        const template = TemplateManager.load(name);
        if (!template) {
            this._showToast(`Template "${name}" not found`, 'error');
            return this;
        }

        this._loadPageData(template);
        this._refs.templateName.value = this._templateName;

        // Update UI
        const themeSelect = this.element.querySelector('.qr-theme-select');
        const variantSelect = this.element.querySelector('.qr-variant-select');
        const gridToggle = this.element.querySelector('.qr-grid-toggle');

        if (themeSelect) themeSelect.value = this._pageConfig.theme || '';
        if (variantSelect) variantSelect.value = this._pageConfig.variant || '';
        if (gridToggle) gridToggle.checked = this._pageConfig.useGrid;

        this._renderCanvasSections();
        this._renderEditor();
        this._refreshPreview();
        this._isDirty = false;

        this._showToast(`Template "${name}" loaded`, 'success');

        return this;
    }

    /**
     * Delete a named template
     * @param {string} name - Template name
     * @returns {QuickRoller} this
     */
    deleteTemplate(name) {
        if (TemplateManager.delete(name)) {
            this._showToast(`Template "${name}" deleted`, 'success');
        }
        return this;
    }

    /**
     * List all saved templates
     * @returns {string[]} Template names
     */
    listTemplates() {
        return TemplateManager.list();
    }

    /**
     * Start a new page
     * @returns {QuickRoller} this
     */
    newPage() {
        if (this._isDirty) {
            if (!confirm('You have unsaved changes. Start a new page anyway?')) {
                return this;
            }
        }

        this._sections = [];
        this._selectedIndex = -1;
        this._templateName = '';
        this._pageConfig = {
            theme: 'light',
            variant: null,
            useGrid: true,
            useTheme: true,
            customCSS: '',
            meta: {
                title: 'My Page',
                description: '',
                charset: 'UTF-8',
                viewport: 'width=device-width, initial-scale=1.0'
            }
        };

        this._refs.templateName.value = '';
        this.element.querySelector('.qr-theme-select').value = 'light';
        this.element.querySelector('.qr-variant-select').value = '';
        this.element.querySelector('.qr-grid-toggle').checked = true;

        this._renderCanvasSections();
        this._renderEditor();
        this._refreshPreview();
        this._isDirty = false;

        TemplateManager.clearActive();

        return this;
    }

    /**
     * Open preview in new window
     * Uses the same inlined CSS approach as the iframe preview
     * @returns {QuickRoller} this
     */
    openPreviewWindow() {
        // Use the same preview HTML as the iframe (with inlined styles)
        const html = this._generatePreviewHTML();
        const win = window.open('', '_blank');
        win.document.write(html);
        win.document.close();
        return this;
    }

    /**
     * Force preview refresh
     * @returns {QuickRoller} this
     */
    refreshPreview() {
        this._refreshPreview();
        return this;
    }

    /**
     * Destroy the component
     */
    destroy() {
        // Clear auto-save timer
        if (this._autoSaveTimer) {
            clearInterval(this._autoSaveTimer);
        }

        // Remove event listeners
        for (const {element, event, wrapper} of this._eventHandlers) {
            element.removeEventListener(event, wrapper);
        }
        this._eventHandlers = [];

        // Clear element
        this.element.classList.remove('qr-container');
        this.element.innerHTML = '';
    }
}

// Export
export {QuickRoller, TemplateManager, SECTION_REGISTRY};
