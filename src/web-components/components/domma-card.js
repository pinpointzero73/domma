/**
 * Domma Card Web Component
 * Card container with hover effects and collapsible functionality
 */

import { DommaElement, getThemeVariables } from '../base/domma-element.js';

export class DommaCard extends DommaElement {
    static defaults = {
        hoverable: true,
        shadow: 'medium',           // 'none', 'small', 'medium', 'large'
        rounded: true,
        animation: true,
        animationDuration: 200,
        collapsible: false,
        collapsed: false,
        persistKey: null,
        collapseIcon: 'chevron-down',
        visible: true
    };

    static get observedAttributes() {
        return ['hoverable', 'shadow', 'rounded', 'animation', 'animation-duration',
                'collapsible', 'collapsed', 'persist-key', 'collapse-icon', 'visible'];
    }

    constructor() {
        super();
        this._header = null;
        this._body = null;
        this._collapseIcon = null;
    }

    _injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            ${getThemeVariables()}

            :host {
                display: block;
                background: var(--dm-surface, #fff);
                border: 1px solid var(--dm-border, #e5e7eb);
                border-radius: 8px;
                overflow: hidden;
                margin-bottom: 1.5rem;
                transition: transform var(--animation-duration, 200ms) ease,
                           box-shadow var(--animation-duration, 200ms) ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }

            :host([hidden]) {
                display: none;
            }

            :host([shadow="none"]) {
                box-shadow: none;
            }

            :host([shadow="small"]) {
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
            }

            :host([shadow="medium"]) {
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }

            :host([shadow="large"]) {
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            }

            :host([rounded="false"]) {
                border-radius: 0;
            }

            :host([hoverable]:hover) {
                transform: scale(1.02);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            }

            :host([animation="false"]) {
                transition: none;
            }

            /* Collapsible styles */
            :host([collapsible]) ::slotted(.card-header),
            .card-header-wrapper[data-collapsible="true"] {
                cursor: pointer;
                user-select: none;
            }

            .card-header-wrapper {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0;
                border-bottom: 1px solid var(--dm-border, #e5e7eb);
                background: var(--dm-background-alt, #f8fafc);
                transition: background-color var(--dm-transition-fast, 150ms ease);
            }

            .card-header-content {
                flex: 1;
                background: transparent;
            }

            .card-collapse-icon {
                margin-left: 1rem;
                display: flex;
                align-items: center;
                transition: transform 200ms ease;
                color: var(--dm-text-secondary);
                background: transparent;
                padding: 1rem 1.5rem;
            }

            :host([collapsible]) .card-header-wrapper:hover .card-collapse-icon {
                color: var(--dm-text);
            }

            :host([collapsible]) .card-header-wrapper:hover {
                background: var(--dm-hover-bg);
            }

            :host([collapsed]) .card-collapse-icon {
                transform: rotate(-90deg);
            }

            .card-body-wrapper {
                overflow: hidden;
                transition: height 200ms ease;
            }

            :host([collapsed]) .card-body-wrapper {
                height: 0 !important;
            }

            ::slotted(.card-header) {
                margin: 0;
                padding: 1rem 1.5rem;
                border-bottom: 1px solid var(--dm-border, #e5e7eb);
                background: var(--dm-background-alt, #f8fafc);
            }

            ::slotted(.card-body) {
                padding: 1.5rem;
            }

            ::slotted(.card-footer) {
                padding: 1rem 1.5rem;
                border-top: 1px solid var(--dm-border, #e5e7eb);
                background: var(--dm-background-alt, #f8fafc);
            }
        `;
        this.shadowRoot.appendChild(style);
    }

    _render() {
        const { collapsible, collapsed } = this._options;

        // Check if content has card-header/body/footer structure
        const headerSlot = document.createElement('slot');
        headerSlot.name = 'header';

        const bodySlot = document.createElement('slot');
        bodySlot.name = 'body';

        const footerSlot = document.createElement('slot');
        footerSlot.name = 'footer';

        // Default slot for unstructured content
        const defaultSlot = document.createElement('slot');

        // Create body wrapper for collapse animation
        this._bodyWrapper = document.createElement('div');
        this._bodyWrapper.className = 'card-body-wrapper';
        
        // Check for slotted header
        const hasHeader = this.querySelector('[slot="header"]');
        
        if (collapsible && hasHeader) {
            // Wrap header with collapse icon
            this._headerWrapper = document.createElement('div');
            this._headerWrapper.className = 'card-header-wrapper';
            this._headerWrapper.setAttribute('data-collapsible', 'true');
            
            const headerContent = document.createElement('div');
            headerContent.className = 'card-header-content';
            headerContent.appendChild(headerSlot);
            
            this._collapseIcon = document.createElement('span');
            this._collapseIcon.className = 'card-collapse-icon';
            this._collapseIcon.innerHTML = this._getCollapseIconSVG();
            
            this._headerWrapper.appendChild(headerContent);
            this._headerWrapper.appendChild(this._collapseIcon);
            
            this.shadowRoot.appendChild(this._headerWrapper);
        } else {
            this.shadowRoot.appendChild(headerSlot);
        }

        // Body and footer
        this._bodyWrapper.appendChild(bodySlot);
        this._bodyWrapper.appendChild(defaultSlot);
        this.shadowRoot.appendChild(this._bodyWrapper);
        this.shadowRoot.appendChild(footerSlot);
    }

    _getCollapseIconSVG() {
        // Chevron down icon
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>`;
    }

    _bindEvents() {
        if (this._options.collapsible && this._headerWrapper) {
            this._addEventListener(this._headerWrapper, 'click', () => this.toggle());
        }

        // Restore collapsed state from localStorage
        this._restoreState();
    }

    _onAttributeChange(name, oldValue, newValue) {
        switch (name) {
            case 'collapsed':
                const isCollapsed = newValue === '' || newValue === 'true';
                this._setCollapsed(isCollapsed, false);
                break;

            case 'collapsible':
                // Re-render to add/remove collapse icon
                if (this._headerWrapper || this._collapseIcon) {
                    this.shadowRoot.innerHTML = '';
                    this._injectStyles();
                    this._render();
                    this._bindEvents();
                }
                break;

            case 'shadow':
            case 'hoverable':
            case 'rounded':
            case 'animation':
                // These are handled via CSS attributes
                break;
        }
    }

    _onConnect() {
        // Restore state after connection
        if (this._options.collapsible) {
            this._restoreState();
        }
    }

    _onDisconnect() {
        // Save state if needed
        if (this._options.collapsible && this.isCollapsed()) {
            this._saveState();
        }
    }

    _getStorageKey() {
        return this._options.persistKey ||
            (this.id ? `domma-card-${this.id}` : null);
    }

    _restoreState() {
        if (!this._options.collapsible) return;

        const key = this._getStorageKey();
        if (key && typeof Domma !== 'undefined' && Domma.storage) {
            const saved = Domma.storage.get(key);
            if (saved?.collapsed) {
                this._setCollapsed(true, false);
                return;
            }
        }

        // Apply initial collapsed state
        if (this._options.collapsed) {
            this._setCollapsed(true, false);
        }
    }

    _saveState() {
        const key = this._getStorageKey();
        if (key && typeof Domma !== 'undefined' && Domma.storage) {
            Domma.storage.set(key, { collapsed: this.isCollapsed() });
        }
    }

    _setCollapsed(collapsed, save = true) {
        if (!this._bodyWrapper) return;

        if (collapsed) {
            // Get current height
            const currentHeight = this._bodyWrapper.scrollHeight;
            this._bodyWrapper.style.height = currentHeight + 'px';
            
            // Force reflow
            this._bodyWrapper.offsetHeight;
            
            // Collapse to 0
            this._bodyWrapper.style.height = '0px';
            this.setAttribute('collapsed', '');
            this._emit('collapse');
        } else {
            // Expand to full height
            this.removeAttribute('collapsed');
            const targetHeight = this._bodyWrapper.scrollHeight;
            this._bodyWrapper.style.height = targetHeight + 'px';
            
            // Reset to auto after animation
            setTimeout(() => {
                if (this._bodyWrapper && !this.hasAttribute('collapsed')) {
                    this._bodyWrapper.style.height = 'auto';
                }
            }, this._options.animationDuration);
            
            this._emit('expand');
        }

        if (save) {
            this._saveState();
        }
    }

    // Public API
    collapse() {
        this._setCollapsed(true);
        return this;
    }

    expand() {
        this._setCollapsed(false);
        return this;
    }

    toggle() {
        this._setCollapsed(!this.isCollapsed());
        return this;
    }

    isCollapsed() {
        return this.hasAttribute('collapsed');
    }

    setShadow(size) {
        this.setAttribute('shadow', size);
        return this;
    }

    setHoverable(hoverable) {
        if (hoverable) {
            this.setAttribute('hoverable', '');
        } else {
            this.removeAttribute('hoverable');
        }
        return this;
    }

    setContent(content) {
        // Find or create card body in light DOM (slotted content)
        let bodySlot = this.querySelector('[slot="body"]');

        if (!bodySlot) {
            // Create a slotted body element if it doesn't exist
            bodySlot = document.createElement('div');
            bodySlot.setAttribute('slot', 'body');
            bodySlot.className = 'card-body';
            this.appendChild(bodySlot);
        }

        // XSS Protection: Sanitize HTML using DOMPurify wrapper (Domma.sanitize.sanitize)
        const sanitizedContent = (typeof Domma !== 'undefined' && Domma.sanitize && typeof Domma.sanitize.sanitize === 'function')
            ? Domma.sanitize.sanitize(content)
            : content;
        bodySlot.innerHTML = sanitizedContent;

        // Scan for icons if available
        if (typeof Domma !== 'undefined' && Domma.icons && typeof Domma.icons.scan === 'function') {
            Domma.icons.scan(bodySlot);
        }

        return this;
    }

    getBody() {
        // Return the slotted body element (or create one if needed)
        let bodySlot = this.querySelector('[slot="body"]');
        if (!bodySlot) {
            bodySlot = document.createElement('div');
            bodySlot.setAttribute('slot', 'body');
            bodySlot.className = 'card-body';
            this.appendChild(bodySlot);
        }
        return bodySlot;
    }

    updateHeight() {
        // Recalculate height if card is collapsible and expanded
        if (this._options.collapsible && !this.isCollapsed() && this._bodyWrapper) {
            this._bodyWrapper.style.height = 'auto';
            const height = this._bodyWrapper.scrollHeight;
            this._bodyWrapper.style.height = height + 'px';
        }
        return this;
    }
}

if (!customElements.get('domma-card')) {
    customElements.define('domma-card', DommaCard);
}
