/**
 * Domma Elements Module
 * UI Components: Cards, Modals, Tabs, Accordions, Tooltips, BackToTop
 *
 * Note: ThemeRoller, QuickRoller, and Editor are in the separate tools bundle (domma-tools.min.js)
 */

import Component from './component.js';
import TreeView from './treeview.js';

// ============================================
// Card Component
// ============================================

class Card extends Component {
    static defaults = {
        hoverable: true,
        shadow: 'medium',
        rounded: true,
        animation: true,
        animationDuration: 200,
        onHover: null,
        onLeave: null,
        onClick: null
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this._init();
    }

    _init() {
        if (!this.element) return;

        const el = this.element;
        const opts = this.options;

        // Apply base styles
        el.style.transition = opts.animation
            ? `transform ${opts.animationDuration}ms ease, box-shadow ${opts.animationDuration}ms ease`
            : 'none';

        if (opts.rounded) {
            el.style.borderRadius = '8px';
        }

        this._applyShadow(opts.shadow);

        if (opts.hoverable) {
            this._addEventListener(el, 'mouseenter', (e) => {
                el.style.transform = 'scale(1.02)';
                this._applyShadow('large');
                if (opts.onHover) opts.onHover(e, this);
            });

            this._addEventListener(el, 'mouseleave', (e) => {
                el.style.transform = 'scale(1)';
                this._applyShadow(opts.shadow);
                if (opts.onLeave) opts.onLeave(e, this);
            });
        }

        if (opts.onClick) {
            el.style.cursor = 'pointer';
            this._addEventListener(el, 'click', (e) => {
                opts.onClick(e, this);
            });
        }
    }

    _applyShadow(size) {
        const shadows = {
            none: 'none',
            small: '0 1px 3px rgba(0,0,0,0.12)',
            medium: '0 2px 8px rgba(0,0,0,0.15)',
            large: '0 8px 20px rgba(0,0,0,0.2)'
        };
        this.element.style.boxShadow = shadows[size] || shadows.medium;
    }

    setShadow(size) {
        this.options.shadow = size;
        this._applyShadow(size);
        return this;
    }
}

// ============================================
// Modal Component
// ============================================

class Modal extends Component {
    static defaults = {
        backdrop: true,
        backdropClose: true,
        keyboard: true,
        animation: 'fade',
        animationDuration: 300,
        closeButton: true,
        onOpen: null,
        onOpened: null,
        onClose: null,
        onClosed: null,

        // Factory mode options
        size: 'medium',              // 'small', 'medium', 'large', 'xl'
        centered: true,
        scrollable: false,

        // Content options (for programmatic creation)
        title: '',
        content: '',
        footer: '',
        buttons: [],                 // [{id, text, variant, close}]

        // Styling options
        className: '',
        headerClass: '',
        bodyClass: '',
        footerClass: '',
        onButtonClick: null
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this._backdrop = null;
        this._isOpen = false;
        this._init();
    }

    _init() {
        if (!this.element) return;

        const el = this.element;
        const opts = this.options;

        // Skip inline positioning for factory-created modals (they use flexbox overlay)
        if (!opts._factoryCreated) {
            // Traditional modal: use fixed positioning with manual centering
            el.style.display = 'none';
            el.style.position = 'fixed';
            el.style.top = '50%';
            el.style.left = '50%';
            el.style.transform = 'translate(-50%, -50%)';
            el.style.zIndex = '1001';
            el.style.opacity = '0';
            el.style.transition = `opacity ${opts.animationDuration}ms ease, transform ${opts.animationDuration}ms ease`;
        } else {
            // Factory modal: positioned by flexbox overlay, only set initial opacity
            el.style.opacity = '0';
            el.style.transition = `opacity ${opts.animationDuration}ms ease, transform ${opts.animationDuration}ms ease`;
        }

        // Keyboard handler
        if (opts.keyboard) {
            this._keyHandler = (e) => {
                if (e.key === 'Escape' && this._isOpen) {
                    this.close();
                }
            };
            document.addEventListener('keydown', this._keyHandler);
        }

        // Close button (header × button)
        if (opts.closeButton) {
            const closeBtn = el.querySelector('[data-close], .modal-close, .close');
            if (closeBtn) {
                this._addEventListener(closeBtn, 'click', () => this.close());
            }
        }

        // Close button(s) in footer (e.g., Cancel, Close buttons)
        const closeBtns = el.querySelectorAll('.modal-close-btn');
        closeBtns.forEach(btn => {
            this._addEventListener(btn, 'click', () => this.close());
        });
    }

    open() {
        if (this._isOpen) return this;

        const opts = this.options;
        const el = this.element;

        if (opts.onOpen) opts.onOpen(this);

        // Create backdrop
        if (opts.backdrop) {
            this._backdrop = document.createElement('div');
            this._backdrop.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                opacity: 0;
                transition: opacity ${opts.animationDuration}ms ease;
            `;
            document.body.appendChild(this._backdrop);

            if (opts.backdropClose) {
                this._addEventListener(this._backdrop, 'click', () => this.close());
            }

            // Trigger reflow and fade in
            this._backdrop.offsetHeight;
            this._backdrop.style.opacity = '1';
        }

        // Show modal
        el.style.display = 'block';
        el.offsetHeight; // Trigger reflow

        // Apply animation
        if (opts.animation === 'fade') {
            el.style.opacity = '1';
        } else if (opts.animation === 'slide') {
            el.style.transform = 'translate(-50%, -50%)';
            el.style.opacity = '1';
        } else if (opts.animation === 'zoom') {
            el.style.transform = 'translate(-50%, -50%) scale(1)';
            el.style.opacity = '1';
        } else {
            el.style.opacity = '1';
        }

        this._isOpen = true;

        // Call onOpened after animation
        setTimeout(() => {
            if (opts.onOpened) opts.onOpened(this);
        }, opts.animationDuration);

        return this;
    }

    close() {
        if (!this._isOpen) return this;

        const opts = this.options;
        const el = this.element;

        if (opts.onClose) opts.onClose(this);

        // Fade out
        el.style.opacity = '0';

        if (this._backdrop) {
            this._backdrop.style.opacity = '0';
        }

        setTimeout(() => {
            el.style.display = 'none';

            if (this._backdrop) {
                this._backdrop.remove();
                this._backdrop = null;
            }

            this._isOpen = false;

            if (opts.onClosed) opts.onClosed(this);
        }, opts.animationDuration);

        return this;
    }

    toggle() {
        return this._isOpen ? this.close() : this.open();
    }

    isOpen() {
        return this._isOpen;
    }

    destroy() {
        super.destroy();
        if (this._keyHandler) {
            document.removeEventListener('keydown', this._keyHandler);
        }
        if (this._backdrop) {
            this._backdrop.remove();
        }
    }

    remove() {
        if (this._isOpen) {
            this.close();
        }

        // Wait for close animation
        setTimeout(() => {
            this.destroy();

            if (this.element && this.element.parentNode) {
                this.element.remove();
            }

            if (this._backdrop) {
                this._backdrop.remove();
                this._backdrop = null;
            }

            // Remove from instances map (access via elements namespace)
            const elementsNS = typeof elements !== 'undefined' ? elements :
              (typeof window !== 'undefined' && window.Domma && window.Domma.elements) || null;
            if (elementsNS && elementsNS._instances && elementsNS._instances.has(this.element)) {
                elementsNS._instances.delete(this.element);
            }

            // Remove overlay if factory-created
            if (this._overlay && this._overlay.parentNode) {
                this._overlay.remove();
            }
        }, this.options.animationDuration);

        return this;
    }
}

// ============================================
// Modal Factory (Programmatic Creation)
// ============================================

const ModalFactory = {
    _container: null,
    _zIndexBase: 1050,
    _activeModals: [],
    _defaults: {
        size: 'medium',
        title: '',
        content: '',
        buttons: [{id: 'close', text: 'Close', variant: 'secondary'}],
        backdrop: true,
        backdropClose: true,
        keyboard: true,
        animation: true,
        animationDuration: 300,
        className: '',
        headerClass: '',
        bodyClass: '',
        footerClass: '',
        scrollable: false,
        onButtonClick: null,
        onOpen: null,
        onClose: null
    },

    _ensureContainer() {
        if (!this._container) {
            this._container = document.createElement('div');
            this._container.className = 'dm-dialog-container';
            this._container.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 1040;';
            document.body.appendChild(this._container);
        }
        return this._container;
    },

    _createElements(options) {
        const opts = {...this._defaults, ...options};
        const container = this._ensureContainer();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'dm-dialog-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: ${this._getNextZIndex()};
            pointer-events: auto;
            opacity: 0;
            transition: opacity ${opts.animationDuration}ms ease;
        `;

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = `dm-dialog dm-dialog-${opts.size}${opts.className ? ' ' + opts.className : ''}`;
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.style.cssText = `
            background: white;
            border-radius: 8px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 90%;
            max-height: 90vh;
            overflow: hidden;
            transform: scale(0.95) translateY(-10px);
            transition: transform ${opts.animationDuration}ms ease, opacity ${opts.animationDuration}ms ease;
            opacity: 0;
        `;

        // Build content
        let html = '<div class="dm-dialog-content">';

        if (opts.title) {
            html += `<div class="dm-dialog-header${opts.headerClass ? ' ' + opts.headerClass : ''}" style="position: relative; padding: 1.5rem 1.5rem 1rem; border-bottom: 1px solid #e5e7eb;">`;
            html += `<h3 class="dm-dialog-title" style="margin: 0; font-size: 1.25rem; font-weight: 600;">${opts.title}</h3>`;
            if (opts.backdrop && opts.backdropClose) {
                html += '<button type="button" class="dm-dialog-close" aria-label="Close" style="position: absolute; right: 1rem; top: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280; line-height: 1; padding: 0; width: 2rem; height: 2rem;">&times;</button>';
            }
            html += '</div>';
        }

        html += `<div class="dm-dialog-body${opts.bodyClass ? ' ' + opts.bodyClass : ''}${opts.scrollable ? ' dm-dialog-body-scrollable' : ''}" style="padding: 1.5rem;">`;
        html += opts.content;
        html += '</div>';

        if (opts.buttons && opts.buttons.length > 0) {
            html += `<div class="dm-dialog-footer${opts.footerClass ? ' ' + opts.footerClass : ''}" style="display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; background: #f9fafb;">`;
            opts.buttons.forEach(btn => {
                const variant = btn.variant || 'secondary';
                html += `<button type="button" class="btn btn-${variant}" data-button-id="${btn.id}">${btn.text}</button>`;
            });
            html += '</div>';
        }

        html += '</div>';
        dialog.innerHTML = html;
        overlay.appendChild(dialog);

        return {overlay, dialog, opts};
    },

    _getNextZIndex() {
        return this._zIndexBase + (this._activeModals.length * 10);
    },

    createModal(options) {
        const {overlay, dialog, opts} = this._createElements(options);

        // Pass factory flag via options so _init() can check it
        opts._factoryCreated = true;

        // Create Modal instance using the generated dialog element
        const modal = new Modal(dialog, opts);
        modal._overlay = overlay;
        modal._factoryCreated = true;

        // Append to container (hidden initially)
        this._ensureContainer().appendChild(overlay);

        // Button click handling
        const closeButton = dialog.querySelector('.dm-dialog-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.close();
                if (modal._factoryCreated) {
                    setTimeout(() => modal.remove(), opts.animationDuration);
                }
            });
        }

        dialog.querySelectorAll('[data-button-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const buttonId = btn.getAttribute('data-button-id');
                if (opts.onButtonClick) {
                    opts.onButtonClick(buttonId, modal);
                }

                const buttonConfig = opts.buttons.find(b => b.id === buttonId);
                if (!buttonConfig || buttonConfig.close !== false) {
                    modal.close();
                    if (modal._factoryCreated) {
                        setTimeout(() => modal.remove(), opts.animationDuration);
                    }
                }
            });
        });

        // Backdrop click handling
        if (opts.backdropClose) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    modal.close();
                    if (modal._factoryCreated) {
                        setTimeout(() => modal.remove(), opts.animationDuration);
                    }
                }
            });
        }

        // Override open to show overlay with animation
        const originalOpen = modal.open.bind(modal);
        modal.open = function () {
            overlay.style.display = 'flex';
            dialog.style.display = 'block';
            this._activeModals.push(modal);

            // Trigger animations
            setTimeout(() => {
                overlay.style.opacity = '1';
                dialog.style.transform = 'scale(1) translateY(0)';
                dialog.style.opacity = '1';
            }, 10);

            // Call callbacks
            if (opts.onOpen) opts.onOpen(modal);
            if (opts.onOpened) {
                setTimeout(() => opts.onOpened(modal), opts.animationDuration);
            }

            modal._isOpen = true;
            return modal;
        }.bind(this);

        // Override close to hide overlay with animation
        const originalClose = modal.close.bind(modal);
        modal.close = function () {
            if (!modal._isOpen) return modal;

            if (opts.onClose) opts.onClose(modal);

            // Trigger animations
            overlay.style.opacity = '0';
            dialog.style.transform = 'scale(0.95) translateY(-10px)';
            dialog.style.opacity = '0';

            setTimeout(() => {
                overlay.style.display = 'none';
                dialog.style.display = 'none';
                const index = this._activeModals.indexOf(modal);
                if (index > -1) this._activeModals.splice(index, 1);

                modal._isOpen = false;

                if (opts.onClosed) opts.onClosed(modal);
            }, opts.animationDuration);

            return modal;
        }.bind(this);

        return modal;
    },

    showModal(options) {
        return new Promise((resolve) => {
            const modal = this.createModal({
                ...options,
                onButtonClick: (buttonId, modalInstance) => {
                    if (options.onButtonClick) {
                        options.onButtonClick(buttonId, modalInstance);
                    }
                    resolve(buttonId);
                }
            });

            modal.open();
        });
    }
};

// ============================================
// Tabs Component
// ============================================

class Tabs extends Component {
    static defaults = {
        active: 0,
        animation: 'fade',
        animationDuration: 200,
        tabSelector: '.tab-item, [data-tab]',
        panelSelector: '.tab-panel, [data-panel]',
        activeClass: 'active',
        onChange: null
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this._activeIndex = this.options.active;
        this._init();
    }

    _init() {
        if (!this.element) return;

        const opts = this.options;
        this._tabs = this.element.querySelectorAll(opts.tabSelector);
        this._panels = this.element.querySelectorAll(opts.panelSelector);

        // Setup tabs
        this._tabs.forEach((tab, index) => {
            this._addEventListener(tab, 'click', (e) => {
                e.preventDefault();
                this.activate(index);
            });
        });

        // Initial state
        this._updateState();
    }

    activate(index) {
        if (index === this._activeIndex) return this;
        if (index < 0 || index >= this._tabs.length) return this;

        const opts = this.options;
        const oldIndex = this._activeIndex;
        this._activeIndex = index;

        this._updateState();

        if (opts.onChange) {
            opts.onChange({index, oldIndex, tab: this._tabs[index], panel: this._panels[index]});
        }

        return this;
    }

    _updateState() {
        const opts = this.options;

        this._tabs.forEach((tab, i) => {
            if (i === this._activeIndex) {
                tab.classList.add(opts.activeClass);
            } else {
                tab.classList.remove(opts.activeClass);
            }
        });

        this._panels.forEach((panel, i) => {
            if (i === this._activeIndex) {
                panel.style.display = 'block';
                if (opts.animation === 'fade') {
                    panel.style.opacity = '0';
                    panel.style.transition = `opacity ${opts.animationDuration}ms ease`;
                    panel.offsetHeight;
                    panel.style.opacity = '1';
                }
            } else {
                panel.style.display = 'none';
            }
        });
    }

    getActive() {
        return this._activeIndex;
    }

    // Alias for activate
    show(index) {
        return this.activate(index);
    }

    next() {
        const nextIndex = (this._activeIndex + 1) % this._tabs.length;
        return this.activate(nextIndex);
    }

    prev() {
        const prevIndex = (this._activeIndex - 1 + this._tabs.length) % this._tabs.length;
        return this.activate(prevIndex);
    }
}

// ============================================
// Accordion Component
// ============================================

class Accordion extends Component {
    static defaults = {
        allowMultiple: false,
        multiExpand: null,  // Alias for allowMultiple
        activeIndex: null,  // Initially open panel(s)
        animation: true,
        animationDuration: 300,
        headerSelector: '.accordion-header, [data-accordion-header]',
        contentSelector: '.accordion-body, [data-accordion-content]',
        activeClass: 'active',
        onChange: null
    };

    constructor(selector, options = {}) {
        super(selector, options);
        // Support multiExpand as alias for allowMultiple
        if (this.options.multiExpand !== null) {
            this.options.allowMultiple = this.options.multiExpand;
        }
        this._init();
    }

    _init() {
        if (!this.element) return;

        const opts = this.options;
        this._headers = this.element.querySelectorAll(opts.headerSelector);
        this._contents = this.element.querySelectorAll(opts.contentSelector);

        // Setup initial state based on activeIndex or existing active class
        this._contents.forEach((content, index) => {
            content.style.overflow = 'hidden';
            content.style.transition = opts.animation
                ? `height ${opts.animationDuration}ms ease`
                : 'none';

            // Check if should be active: via activeIndex option or existing class
            const parent = this._headers[index]?.parentElement;
            let shouldBeActive = parent?.classList.contains(opts.activeClass);

            // activeIndex can be number or array
            if (opts.activeIndex !== null) {
                if (Array.isArray(opts.activeIndex)) {
                    shouldBeActive = opts.activeIndex.includes(index);
                } else {
                    shouldBeActive = opts.activeIndex === index;
                }
                // Update class to match
                if (shouldBeActive) {
                    parent?.classList.add(opts.activeClass);
                } else {
                    parent?.classList.remove(opts.activeClass);
                }
            }

            if (shouldBeActive) {
                // Active items need explicit height for overflow:hidden to work
                content.style.height = 'auto';
            } else {
                content.style.height = '0';
            }
        });

        // Bind click handlers
        this._headers.forEach((header, index) => {
            this._addEventListener(header, 'click', () => {
                this.toggle(index);
            });
        });
    }

    toggle(index) {
        const opts = this.options;
        const header = this._headers[index];
        const content = this._contents[index];
        const parent = header.parentElement;
        const isActive = parent.classList.contains(opts.activeClass);

        if (!opts.allowMultiple) {
            // Close all others
            this._headers.forEach((h, i) => {
                if (i !== index) {
                    this._close(i);
                }
            });
        }

        if (isActive) {
            this._close(index);
        } else {
            this._open(index);
        }

        if (opts.onChange) {
            opts.onChange({index, isOpen: !isActive, header, content});
        }

        return this;
    }

    _open(index) {
        const opts = this.options;
        const header = this._headers[index];
        const content = this._contents[index];
        const parent = header.parentElement;

        parent.classList.add(opts.activeClass);
        content.style.height = content.scrollHeight + 'px';

        // Remove height after animation for responsive content
        setTimeout(() => {
            content.style.height = 'auto';
        }, opts.animationDuration);
    }

    _close(index) {
        const opts = this.options;
        const header = this._headers[index];
        const content = this._contents[index];
        const parent = header.parentElement;

        parent.classList.remove(opts.activeClass);

        // Set current height first for animation
        content.style.height = content.scrollHeight + 'px';
        content.offsetHeight; // Force reflow
        content.style.height = '0';
    }

    open(index) {
        if (index >= 0 && index < this._headers.length) {
            this._open(index);
        }
        return this;
    }

    close(index) {
        if (index >= 0 && index < this._headers.length) {
            this._close(index);
        }
        return this;
    }

    openAll() {
        this._headers.forEach((_, i) => this._open(i));
        return this;
    }

    closeAll() {
        this._headers.forEach((_, i) => this._close(i));
        return this;
    }
}

// ============================================
// Tooltip Component
// ============================================

class Tooltip extends Component {
    static defaults = {
        content: '',
        position: 'top',
        trigger: 'hover',
        delay: {show: 0, hide: 0},
        animation: true,
        animationDuration: 150,
        html: false,
        offset: [0, 8],
        container: null,
        onShow: null,
        onHide: null
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this._tooltip = null;
        this._isVisible = false;
        this._showTimeout = null;
        this._hideTimeout = null;
        this._init();
    }

    _init() {
        if (!this.element) return;

        const opts = this.options;
        const el = this.element;

        // Get content from data attribute if not specified
        if (!opts.content && el.dataset.tooltip) {
            opts.content = el.dataset.tooltip;
        }

        if (opts.trigger === 'hover') {
            this._addEventListener(el, 'mouseenter', () => this.show());
            this._addEventListener(el, 'mouseleave', () => this.hide());
        } else if (opts.trigger === 'click') {
            this._addEventListener(el, 'click', () => this.toggle());
        } else if (opts.trigger === 'focus') {
            this._addEventListener(el, 'focus', () => this.show());
            this._addEventListener(el, 'blur', () => this.hide());
        }
    }

    show() {
        clearTimeout(this._hideTimeout);

        if (this._isVisible) return this;

        const opts = this.options;

        this._showTimeout = setTimeout(() => {
            this._createTooltip();
            this._positionTooltip();

            if (opts.onShow) opts.onShow(this);
        }, opts.delay.show);

        return this;
    }

    hide() {
        clearTimeout(this._showTimeout);

        if (!this._isVisible) return this;

        const opts = this.options;

        this._hideTimeout = setTimeout(() => {
            if (this._tooltip) {
                this._tooltip.classList.remove('show');

                setTimeout(() => {
                    if (this._tooltip) {
                        this._tooltip.remove();
                        this._tooltip = null;
                    }
                    this._isVisible = false;

                    if (opts.onHide) opts.onHide(this);
                }, opts.animationDuration);
            }
        }, opts.delay.hide);

        return this;
    }

    toggle() {
        return this._isVisible ? this.hide() : this.show();
    }

    _createTooltip() {
        const opts = this.options;

        this._tooltip = document.createElement('div');
        this._tooltip.className = 'domma-tooltip';

        if (opts.html) {
            this._tooltip.innerHTML = opts.content;
        } else {
            this._tooltip.textContent = opts.content;
        }

        const container = opts.container || document.body;
        container.appendChild(this._tooltip);

        // Trigger animation
        this._tooltip.offsetHeight;
        this._tooltip.classList.add('show');

        this._isVisible = true;
    }

    _positionTooltip() {
        if (!this._tooltip || !this.element) return;

        const opts = this.options;
        const rect = this.element.getBoundingClientRect();
        const tooltipRect = this._tooltip.getBoundingClientRect();
        const [offsetX, offsetY] = opts.offset;

        let top, left;

        switch (opts.position) {
            case 'top':
                top = rect.top - tooltipRect.height - offsetY;
                left = rect.left + (rect.width - tooltipRect.width) / 2 + offsetX;
                break;
            case 'bottom':
                top = rect.bottom + offsetY;
                left = rect.left + (rect.width - tooltipRect.width) / 2 + offsetX;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2 + offsetX;
                left = rect.left - tooltipRect.width - offsetY;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2 + offsetX;
                left = rect.right + offsetY;
                break;
            default:
                top = rect.top - tooltipRect.height - offsetY;
                left = rect.left + (rect.width - tooltipRect.width) / 2 + offsetX;
        }

        // Add scroll offset
        top += window.scrollY;
        left += window.scrollX;

        this._tooltip.style.top = top + 'px';
        this._tooltip.style.left = left + 'px';
    }

    setContent(content) {
        this.options.content = content;
        if (this._tooltip) {
            if (this.options.html) {
                this._tooltip.innerHTML = content;
            } else {
                this._tooltip.textContent = content;
            }
            this._positionTooltip();
        }
        return this;
    }

    destroy() {
        super.destroy();
        clearTimeout(this._showTimeout);
        clearTimeout(this._hideTimeout);
        if (this._tooltip) {
            this._tooltip.remove();
        }
    }
}

// ============================================
// Badge Component
// ============================================

class Badge extends Component {
    static defaults = {
        variant: 'primary',
        size: 'medium',
        pill: false,
        outline: false,
        removable: false,
        onClick: null,
        onRemove: null
    };

    static variants = {
        primary: {bg: '#4f46e5', color: '#fff'},
        secondary: {bg: '#6b7280', color: '#fff'},
        success: {bg: '#10b981', color: '#fff'},
        danger: {bg: '#ef4444', color: '#fff'},
        warning: {bg: '#f59e0b', color: '#000'},
        info: {bg: '#3b82f6', color: '#fff'},
        light: {bg: '#f3f4f6', color: '#111'},
        dark: {bg: '#1f2937', color: '#fff'}
    };

    static sizes = {
        small: {padding: '2px 6px', fontSize: '10px'},
        medium: {padding: '4px 10px', fontSize: '12px'},
        large: {padding: '6px 14px', fontSize: '14px'}
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this._init();
    }

    _init() {
        if (!this.element) return;

        this._applyStyles();

        if (this.options.onClick) {
            this.element.style.cursor = 'pointer';
            this._addEventListener(this.element, 'click', (e) => {
                if (!e.target.classList.contains('domma-badge-remove')) {
                    this.options.onClick(e, this);
                }
            });
        }

        if (this.options.removable) {
            this._addRemoveButton();
        }
    }

    _applyStyles() {
        const opts = this.options;
        const variant = Badge.variants[opts.variant] || Badge.variants.primary;
        const size = Badge.sizes[opts.size] || Badge.sizes.medium;

        let styles = {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: '500',
            lineHeight: '1',
            borderRadius: opts.pill ? '9999px' : '4px',
            transition: 'all 150ms ease',
            ...size
        };

        if (opts.outline) {
            styles.background = 'transparent';
            styles.color = variant.bg;
            styles.border = `1px solid ${variant.bg}`;
        } else {
            styles.background = variant.bg;
            styles.color = variant.color;
            styles.border = 'none';
        }

        Object.assign(this.element.style, styles);
    }

    _addRemoveButton() {
        const removeBtn = document.createElement('span');
        removeBtn.className = 'domma-badge-remove';
        removeBtn.innerHTML = '&times;';

        this._addEventListener(removeBtn, 'click', (e) => {
            e.stopPropagation();
            if (this.options.onRemove) {
                this.options.onRemove(e, this);
            }
            this.remove();
        });

        this.element.appendChild(removeBtn);
    }

    setVariant(variant) {
        this.options.variant = variant;
        this._applyStyles();
        return this;
    }

    setText(text) {
        // Preserve remove button if exists
        const removeBtn = this.element.querySelector('.domma-badge-remove');
        this.element.textContent = text;
        if (removeBtn) {
            this.element.appendChild(removeBtn);
        }
        return this;
    }

    remove() {
        if (this.element) {
            this.element.remove();
        }
        this.destroy();
    }
}

// ============================================
// Dropdown Component
// ============================================

class Dropdown extends Component {
    static defaults = {
        trigger: 'click',
        position: 'bottom-start',
        offset: [0, 4],
        animation: true,
        animationDuration: 150,
        closeOnSelect: true,
        closeOnClickOutside: true,
        items: [],
        model: null,
        modelKey: null,
        itemTemplate: null,
        onOpen: null,
        onClose: null,
        onSelect: null
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this._menu = null;
        this._isOpen = false;
        this._items = [...this.options.items];
        this._selectedValue = null;
        this._modelUnsubscribe = null;
        this._init();
    }

    _init() {
        if (!this.element) return;

        const opts = this.options;

        // Setup trigger
        if (opts.trigger === 'click') {
            this._addEventListener(this.element, 'click', (e) => {
                e.stopPropagation();
                this.toggle();
            });
        } else if (opts.trigger === 'hover') {
            this._addEventListener(this.element, 'mouseenter', () => this.open());
            this._addEventListener(this.element, 'mouseleave', () => this.close());
        }

        // Close on click outside
        if (opts.closeOnClickOutside) {
            this._outsideClickHandler = (e) => {
                if (this._isOpen && !this.element.contains(e.target) &&
                    (!this._menu || !this._menu.contains(e.target))) {
                    this.close();
                }
            };
            document.addEventListener('click', this._outsideClickHandler);
        }

        // Bind to model if specified
        if (opts.model && opts.modelKey) {
            this._bindToModel(opts.model, opts.modelKey);
        }
    }

    _bindToModel(model, key) {
        // Check if model has the expected interface
        if (model && typeof model.get === 'function') {
            // Get initial value
            const value = model.get(key);
            if (Array.isArray(value)) {
                this._items = [...value];
            }

            // Subscribe to changes
            if (typeof model.onChange === 'function') {
                this._modelUnsubscribe = model.onChange((field, newVal) => {
                    if (field === key && Array.isArray(newVal)) {
                        this._items = [...newVal];
                        if (this._isOpen) {
                            this._renderMenu();
                        }
                    }
                });
            }
        }
    }

    open() {
        if (this._isOpen) return this;

        const opts = this.options;

        if (opts.onOpen) opts.onOpen(this);

        this._createMenu();
        this._positionMenu();
        this._isOpen = true;

        return this;
    }

    close() {
        if (!this._isOpen) return this;

        const opts = this.options;

        if (this._menu) {
            this._menu.classList.remove('show');

            setTimeout(() => {
                if (this._menu) {
                    this._menu.remove();
                    this._menu = null;
                }
            }, opts.animationDuration);
        }

        this._isOpen = false;

        if (opts.onClose) opts.onClose(this);

        return this;
    }

    toggle() {
        return this._isOpen ? this.close() : this.open();
    }

    _createMenu() {
        const opts = this.options;

        this._menu = document.createElement('div');
        this._menu.className = 'domma-dropdown-menu';

        this._renderMenu();

        document.body.appendChild(this._menu);

        // Trigger animation
        this._menu.offsetHeight;
        this._menu.classList.add('show');
    }

    _renderMenu() {
        if (!this._menu) return;

        const opts = this.options;
        this._menu.innerHTML = '';

        this._items.forEach((item, index) => {
            const menuItem = document.createElement('div');
            menuItem.className = 'domma-dropdown-item';

            // Handle different item formats
            if (typeof item === 'string') {
                menuItem.textContent = item;
                menuItem.dataset.value = item;
            } else if (item.divider) {
                menuItem.className = 'domma-dropdown-divider';
                this._menu.appendChild(menuItem);
                return;
            } else if (item.header) {
                menuItem.className = 'domma-dropdown-header';
                menuItem.textContent = item.header;
                this._menu.appendChild(menuItem);
                return;
            } else {
                if (opts.itemTemplate) {
                    menuItem.innerHTML = opts.itemTemplate(item, index);
                } else {
                    menuItem.textContent = item.label || item.text || item.name || '';
                }
                menuItem.dataset.value = item.value !== undefined ? item.value : index;

                if (item.disabled) {
                    menuItem.classList.add('disabled');
                }

                if (item.icon) {
                    const iconSpan = document.createElement('span');
                    iconSpan.className = 'domma-dropdown-icon';
                    iconSpan.innerHTML = item.icon;
                    menuItem.insertBefore(iconSpan, menuItem.firstChild);
                }
            }

            this._addEventListener(menuItem, 'click', (e) => {
                e.stopPropagation();
                this._selectItem(item, index, menuItem.dataset.value);
            });

            this._menu.appendChild(menuItem);
        });
    }

    _selectItem(item, index, value) {
        const opts = this.options;

        this._selectedValue = value;

        if (opts.onSelect) {
            opts.onSelect({item, index, value}, this);
        }

        // Update model if bound
        if (opts.model && opts.modelKey && typeof opts.model.set === 'function') {
            // If there's a separate selectedKey, use that
            const selectedKey = opts.selectedKey || opts.modelKey + '_selected';
            opts.model.set(selectedKey, value);
        }

        if (opts.closeOnSelect) {
            this.close();
        }
    }

    _positionMenu() {
        if (!this._menu || !this.element) return;

        const opts = this.options;
        const rect = this.element.getBoundingClientRect();
        const [offsetX, offsetY] = opts.offset;

        let top, left;

        switch (opts.position) {
            case 'bottom-start':
                top = rect.bottom + offsetY;
                left = rect.left + offsetX;
                break;
            case 'bottom-end':
                top = rect.bottom + offsetY;
                left = rect.right - this._menu.offsetWidth + offsetX;
                break;
            case 'top-start':
                top = rect.top - this._menu.offsetHeight - offsetY;
                left = rect.left + offsetX;
                break;
            case 'top-end':
                top = rect.top - this._menu.offsetHeight - offsetY;
                left = rect.right - this._menu.offsetWidth + offsetX;
                break;
            default:
                top = rect.bottom + offsetY;
                left = rect.left + offsetX;
        }

        // Add scroll offset
        top += window.scrollY;
        left += window.scrollX;

        this._menu.style.top = top + 'px';
        this._menu.style.left = left + 'px';
    }

    setItems(items) {
        this._items = [...items];
        if (this._isOpen) {
            this._renderMenu();
        }
        return this;
    }

    addItem(item) {
        this._items.push(item);
        if (this._isOpen) {
            this._renderMenu();
        }
        return this;
    }

    removeItem(index) {
        this._items.splice(index, 1);
        if (this._isOpen) {
            this._renderMenu();
        }
        return this;
    }

    getSelected() {
        return this._selectedValue;
    }

    isOpen() {
        return this._isOpen;
    }

    destroy() {
        super.destroy();
        if (this._outsideClickHandler) {
            document.removeEventListener('click', this._outsideClickHandler);
        }
        if (this._modelUnsubscribe && typeof this._modelUnsubscribe === 'function') {
            this._modelUnsubscribe();
        }
        if (this._menu) {
            this._menu.remove();
        }
    }
}

// ============================================
// Toast Component
// ============================================

class Toast {
    static defaults = {
        position: 'top-right',
        duration: 3000,
        pauseOnHover: true,
        showProgress: true,
        animation: 'slide',
        animationDuration: 300,
        closable: true,
        maxToasts: 5
    };

    static _containers = {};
    static _toasts = [];

    static _getContainer(position) {
        if (!Toast._containers[position]) {
            const container = document.createElement('div');
            container.className = `domma-toast-container domma-toast-${position}`;

            document.body.appendChild(container);
            Toast._containers[position] = container;
        }

        return Toast._containers[position];
    }

    static show(message, options = {}) {
        const opts = {...Toast.defaults, ...options};
        const container = Toast._getContainer(opts.position);

        // Enforce max toasts
        while (Toast._toasts.length >= opts.maxToasts) {
            const oldest = Toast._toasts.shift();
            if (oldest) oldest.close();
        }

        const toast = new ToastInstance(message, opts, container);
        Toast._toasts.push(toast);

        return toast;
    }

    static success(message, options = {}) {
        return Toast.show(message, {
            ...options,
            type: 'success',
            icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>'
        });
    }

    static error(message, options = {}) {
        return Toast.show(message, {
            ...options,
            type: 'error',
            icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>'
        });
    }

    static warning(message, options = {}) {
        return Toast.show(message, {
            ...options,
            type: 'warning',
            icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>'
        });
    }

    static info(message, options = {}) {
        return Toast.show(message, {
            ...options,
            type: 'info',
            icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'
        });
    }

    static closeAll() {
        Toast._toasts.forEach(toast => toast.close());
        Toast._toasts = [];
    }
}

class ToastInstance {
    static typeStyles = {
        default: {bg: '#1f2937', color: '#fff', accent: '#6b7280'},
        success: {bg: '#065f46', color: '#fff', accent: '#10b981'},
        error: {bg: '#991b1b', color: '#fff', accent: '#ef4444'},
        warning: {bg: '#92400e', color: '#fff', accent: '#f59e0b'},
        info: {bg: '#1e40af', color: '#fff', accent: '#3b82f6'}
    };

    constructor(message, options, container) {
        this.options = options;
        this.container = container;
        this._element = null;
        this._progressBar = null;
        this._timeout = null;
        this._isPaused = false;
        this._remainingTime = options.duration;
        this._startTime = null;

        this._create(message);
        this._show();

        if (options.duration > 0) {
            this._startTimer();
        }
    }

    _create(message) {
        const opts = this.options;
        const typeStyle = ToastInstance.typeStyles[opts.type || 'default'];

        this._element = document.createElement('div');
        this._element.className = `domma-toast domma-toast-${opts.type || 'default'}`;

        // Icon
        if (opts.icon) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'domma-toast-icon';
            iconWrapper.innerHTML = opts.icon;
            this._element.appendChild(iconWrapper);
        }

        // Content
        const content = document.createElement('div');
        content.className = 'domma-toast-content';

        if (opts.title) {
            const title = document.createElement('div');
            title.className = 'domma-toast-title';
            title.textContent = opts.title;
            content.appendChild(title);
        }

        const messageEl = document.createElement('div');
        messageEl.className = 'domma-toast-message';
        if (opts.html) {
            messageEl.innerHTML = message;
        } else {
            messageEl.textContent = message;
        }
        content.appendChild(messageEl);

        // Action buttons
        if (opts.actions && opts.actions.length) {
            const actions = document.createElement('div');
            actions.className = 'domma-toast-actions';

            opts.actions.forEach(action => {
                const btn = document.createElement('button');
                btn.textContent = action.label;
                btn.style.cssText = `
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    background: ${action.primary ? typeStyle.accent : 'rgba(255,255,255,0.2)'};
                    color: #fff;
                    transition: opacity 150ms;
                `;
                btn.addEventListener('mouseenter', () => btn.style.opacity = '0.8');
                btn.addEventListener('mouseleave', () => btn.style.opacity = '1');
                btn.addEventListener('click', () => {
                    if (action.onClick) action.onClick(this);
                    if (action.closeOnClick !== false) this.close();
                });
                actions.appendChild(btn);
            });

            content.appendChild(actions);
        }

        this._element.appendChild(content);

        // Close button
        if (opts.closable) {
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = `
                background: none;
                border: none;
                color: inherit;
                font-size: 20px;
                cursor: pointer;
                opacity: 0.7;
                padding: 0;
                line-height: 1;
                flex-shrink: 0;
                transition: opacity 150ms;
            `;
            closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
            closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');
            closeBtn.addEventListener('click', () => this.close());
            this._element.appendChild(closeBtn);
        }

        // Progress bar
        if (opts.showProgress && opts.duration > 0) {
            this._progressBar = document.createElement('div');
            this._progressBar.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: ${typeStyle.accent};
                width: 100%;
                transform-origin: left;
                transition: transform linear;
            `;
            this._element.appendChild(this._progressBar);
        }

        // Pause on hover
        if (opts.pauseOnHover) {
            this._element.addEventListener('mouseenter', () => this._pause());
            this._element.addEventListener('mouseleave', () => this._resume());
        }

        this.container.appendChild(this._element);
    }

    _show() {
        // Trigger reflow and animate in
        this._element.offsetHeight;
        this._element.classList.add('show');
    }

    _startTimer() {
        this._startTime = Date.now();

        if (this._progressBar) {
            this._progressBar.style.transitionDuration = this._remainingTime + 'ms';
            this._progressBar.offsetHeight;
            this._progressBar.style.transform = 'scaleX(0)';
        }

        this._timeout = setTimeout(() => this.close(), this._remainingTime);
    }

    _pause() {
        if (this._isPaused || !this._timeout) return;

        this._isPaused = true;
        clearTimeout(this._timeout);
        this._remainingTime -= Date.now() - this._startTime;

        if (this._progressBar) {
            const computed = getComputedStyle(this._progressBar);
            this._progressBar.style.transitionDuration = '0ms';
            this._progressBar.style.transform = computed.transform;
        }
    }

    _resume() {
        if (!this._isPaused) return;

        this._isPaused = false;
        this._startTimer();
    }

    close() {
        if (!this._element) return;

        const opts = this.options;

        clearTimeout(this._timeout);

        this._element.classList.add('hiding');
        this._element.classList.remove('show');

        setTimeout(() => {
            if (this._element) {
                this._element.remove();
                this._element = null;

                // Remove from toasts array
                const index = Toast._toasts.indexOf(this);
                if (index > -1) {
                    Toast._toasts.splice(index, 1);
                }

                if (opts.onClose) opts.onClose(this);
            }
        }, opts.animationDuration);
    }

    update(message, options = {}) {
        if (!this._element) return;

        const messageEl = this._element.querySelector('.domma-toast > div:nth-child(2) > div:last-of-type');
        if (messageEl) {
            if (options.html) {
                messageEl.innerHTML = message;
            } else {
                messageEl.textContent = message;
            }
        }

        return this;
    }
}

// ============================================
// DesktopNotification Component
// ============================================

/**
 * DesktopNotification - Browser native notification wrapper
 * Provides a clean API for desktop notifications with permission handling
 */
class DesktopNotification {
    // Static properties
    static permission = typeof Notification !== 'undefined' ? Notification.permission : 'denied';
    static isSupported = typeof Notification !== 'undefined';
    static _instances = [];

    // Static defaults
    static defaults = {
        title: 'Notification',
        body: '',
        icon: null,
        badge: null,
        tag: null,
        requireInteraction: false,
        silent: false,
        data: null,
        onClick: null,
        onClose: null,
        onError: null,
        onShow: null
    };

    /**
     * Request notification permission
     * @returns {Promise<string>} Permission state: 'granted', 'denied', or 'default'
     */
    static async requestPermission() {
        if (!DesktopNotification.isSupported) {
            console.warn('Notifications are not supported in this browser');
            return 'denied';
        }

        try {
            const permission = await Notification.requestPermission();
            DesktopNotification.permission = permission;
            return permission;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return 'denied';
        }
    }

    /**
     * Quick static method to show a notification
     * @param {string} title - Notification title
     * @param {Object} options - Notification options
     * @returns {DesktopNotification|null} Notification instance or null if not supported/denied
     */
    static notify(title, options = {}) {
        const notification = new DesktopNotification({title, ...options});
        notification.show();
        return notification;
    }

    /**
     * Close all active notifications
     */
    static closeAll() {
        DesktopNotification._instances.forEach(instance => {
            if (instance.isShown()) {
                instance.close();
            }
        });
        DesktopNotification._instances = [];
    }

    /**
     * Constructor
     * @param {Object} options - Notification options
     */
    constructor(options = {}) {
        this.options = {...DesktopNotification.defaults, ...options};
        this.notification = null;
        this._shown = false;
    }

    /**
     * Show the notification
     * @returns {Promise<this>} Resolves when notification is shown or rejects if denied/error
     */
    async show() {
        if (!DesktopNotification.isSupported) {
            console.warn('Notifications are not supported in this browser');
            if (this.options.onError) {
                this.options.onError(new Error('Notifications not supported'));
            }
            return this;
        }

        // Check permission
        if (DesktopNotification.permission !== 'granted') {
            if (DesktopNotification.permission === 'default') {
                // Auto-request if not yet decided
                const permission = await DesktopNotification.requestPermission();
                if (permission !== 'granted') {
                    console.warn('Notification permission denied');
                    if (this.options.onError) {
                        this.options.onError(new Error('Permission denied'));
                    }
                    return this;
                }
            } else {
                console.warn('Notification permission denied');
                if (this.options.onError) {
                    this.options.onError(new Error('Permission denied'));
                }
                return this;
            }
        }

        try {
            // Create notification options
            const notificationOptions = {};
            if (this.options.body) notificationOptions.body = this.options.body;
            if (this.options.icon) notificationOptions.icon = this.options.icon;
            if (this.options.badge) notificationOptions.badge = this.options.badge;
            if (this.options.tag) notificationOptions.tag = this.options.tag;
            if (this.options.requireInteraction !== undefined) {
                notificationOptions.requireInteraction = this.options.requireInteraction;
            }
            if (this.options.silent !== undefined) notificationOptions.silent = this.options.silent;
            if (this.options.data) notificationOptions.data = this.options.data;

            // Create native notification
            this.notification = new Notification(this.options.title, notificationOptions);
            this._shown = true;

            // Add to instances
            DesktopNotification._instances.push(this);

            // Setup event handlers
            if (this.options.onClick) {
                this.notification.onclick = (event) => {
                    this.options.onClick(event, this);
                };
            }

            if (this.options.onClose) {
                this.notification.onclose = (event) => {
                    this._shown = false;
                    // Remove from instances
                    const index = DesktopNotification._instances.indexOf(this);
                    if (index > -1) {
                        DesktopNotification._instances.splice(index, 1);
                    }
                    this.options.onClose(event, this);
                };
            } else {
                // Default onclose to clean up instances
                this.notification.onclose = () => {
                    this._shown = false;
                    const index = DesktopNotification._instances.indexOf(this);
                    if (index > -1) {
                        DesktopNotification._instances.splice(index, 1);
                    }
                };
            }

            if (this.options.onError) {
                this.notification.onerror = (event) => {
                    this._shown = false;
                    this.options.onError(event, this);
                };
            }

            if (this.options.onShow) {
                this.notification.onshow = (event) => {
                    this.options.onShow(event, this);
                };
            }

        } catch (error) {
            console.error('Error showing notification:', error);
            if (this.options.onError) {
                this.options.onError(error);
            }
        }

        return this;
    }

    /**
     * Close the notification
     * @returns {this}
     */
    close() {
        if (this.notification && this._shown) {
            this.notification.close();
            this._shown = false;
        }
        return this;
    }

    /**
     * Check if notification is currently shown
     * @returns {boolean}
     */
    isShown() {
        return this._shown;
    }
}

// ============================================
// Timer Component
// ============================================

/**
 * Timer - Countdown timer with optional visual display
 * Works in both visual mode (with DOM element) and headless mode (pure logic)
 */
class Timer extends Component {
    static defaults = {
        duration: 60000,          // 1 minute default (ms)
        autoStart: false,
        format: 'mm:ss',          // Display format: HH:MM:SS, MM:SS, SS
        showControls: false,      // Show start/pause/reset buttons
        updateInterval: 100,      // Update frequency (ms)
        notification: false,      // Desktop notification on complete
        notificationOptions: {},
        sound: false,
        soundUrl: null,
        onTick: null,             // (remaining) => {}
        onComplete: null,         // () => {}
        onStart: null,
        onPause: null,
        onReset: null
    };

    constructor(selector, options = {}) {
        // Must call super before accessing 'this' in derived class
        super(selector, options);

        // Headless mode: Allow null/undefined selector (no DOM element)
        if (!selector) {
            this.element = null;
            this.options = {...Timer.defaults, ...options};
        }

        this._running = false;
        this._remaining = this.options.duration;
        this._intervalId = null;
        this._startTime = null;
        this._pausedTime = null;
        this._display = null;
        this._controls = null;
        this._audio = null;

        this._init();
    }

    _init() {
        // If element exists, create display
        if (this.element) {
            this._createDisplay();
            if (this.options.showControls) {
                this._createControls();
            }
        }

        // Preload audio if sound enabled
        if (this.options.sound && this.options.soundUrl) {
            this._audio = new Audio(this.options.soundUrl);
        }

        if (this.options.autoStart) {
            this.start();
        }
    }

    /**
     * Create visual display
     * @private
     */
    _createDisplay() {
        if (!this.element) return;

        // Create timer container
        const container = document.createElement('div');
        container.className = 'dm-timer';

        // Create display
        this._display = document.createElement('div');
        this._display.className = 'dm-timer-display';

        const timeSpan = document.createElement('span');
        timeSpan.className = 'dm-timer-time';
        timeSpan.textContent = this._formatTime(this._remaining);

        this._display.appendChild(timeSpan);
        container.appendChild(this._display);

        // Clear element and add container
        this.element.innerHTML = '';
        this.element.appendChild(container);

        this._container = container;
    }

    /**
     * Create control buttons
     * @private
     */
    _createControls() {
        if (!this.element || !this._container) return;

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'dm-timer-controls';

        // Start button
        this._startBtn = document.createElement('button');
        this._startBtn.className = 'dm-timer-button dm-timer-start';
        this._startBtn.textContent = 'Start';
        this._startBtn.addEventListener('click', () => this.start());

        // Pause button
        this._pauseBtn = document.createElement('button');
        this._pauseBtn.className = 'dm-timer-button dm-timer-pause';
        this._pauseBtn.textContent = 'Pause';
        this._pauseBtn.style.display = 'none';
        this._pauseBtn.addEventListener('click', () => this.pause());

        // Reset button
        this._resetBtn = document.createElement('button');
        this._resetBtn.className = 'dm-timer-button dm-timer-reset';
        this._resetBtn.textContent = 'Reset';
        this._resetBtn.addEventListener('click', () => this.reset());

        controlsDiv.appendChild(this._startBtn);
        controlsDiv.appendChild(this._pauseBtn);
        controlsDiv.appendChild(this._resetBtn);

        this._container.appendChild(controlsDiv);
        this._controls = controlsDiv;
    }

    /**
     * Update visual display
     * @private
     */
    _updateDisplay() {
        if (!this._display) return;

        const timeSpan = this._display.querySelector('.dm-timer-time');
        if (timeSpan) {
            timeSpan.textContent = this._formatTime(this._remaining);
        }
    }

    /**
     * Format milliseconds to time string
     * @param {number} ms - Milliseconds
     * @returns {string} Formatted time
     * @private
     */
    _formatTime(ms) {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const format = this.options.format.toLowerCase();

        if (format === 'hh:mm:ss') {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else if (format === 'mm:ss') {
            const totalMinutes = Math.floor(totalSeconds / 60);
            return `${String(totalMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else if (format === 'ss') {
            return String(totalSeconds).padStart(2, '0');
        } else {
            // Default to mm:ss
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }

    /**
     * Timer tick - called on each update interval
     * @private
     */
    _tick() {
        if (!this._running) return;

        const now = Date.now();
        const elapsed = now - this._startTime;
        this._remaining = Math.max(0, this.options.duration - elapsed);

        // Update display
        this._updateDisplay();

        // Call onTick callback
        if (this.options.onTick) {
            this.options.onTick(this._remaining);
        }

        // Check if complete
        if (this._remaining === 0) {
            this._complete();
        }
    }

    /**
     * Timer completion handler
     * @private
     */
    _complete() {
        this.stop();

        // Play sound if enabled
        if (this.options.sound && this._audio) {
            this._audio.play().catch(err => {
                console.warn('Failed to play timer sound:', err);
            });
        }

        // Show notification if enabled
        if (this.options.notification && DesktopNotification.isSupported) {
            const notifOptions = {
                title: 'Timer Complete',
                body: 'Your countdown has finished',
                ...this.options.notificationOptions
            };
            DesktopNotification.notify(notifOptions.title, notifOptions);
        }

        // Call onComplete callback
        if (this.options.onComplete) {
            this.options.onComplete();
        }
    }

    /**
     * Start the timer
     * @returns {this}
     */
    start() {
        if (this._running) return this;

        this._running = true;
        this._startTime = Date.now() - (this.options.duration - this._remaining);

        // Start interval
        this._intervalId = setInterval(() => this._tick(), this.options.updateInterval);

        // Update button states
        if (this._startBtn) {
            this._startBtn.style.display = 'none';
        }
        if (this._pauseBtn) {
            this._pauseBtn.style.display = 'inline-block';
        }

        // Call onStart callback
        if (this.options.onStart) {
            this.options.onStart();
        }

        return this;
    }

    /**
     * Pause the timer
     * @returns {this}
     */
    pause() {
        if (!this._running) return this;

        this._running = false;
        this._pausedTime = Date.now();

        // Clear interval
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }

        // Update button states
        if (this._startBtn) {
            this._startBtn.style.display = 'inline-block';
        }
        if (this._pauseBtn) {
            this._pauseBtn.style.display = 'none';
        }

        // Call onPause callback
        if (this.options.onPause) {
            this.options.onPause();
        }

        return this;
    }

    /**
     * Reset the timer to initial duration
     * @returns {this}
     */
    reset() {
        this.stop();
        this._remaining = this.options.duration;
        this._updateDisplay();

        // Update button states
        if (this._startBtn) {
            this._startBtn.style.display = 'inline-block';
        }
        if (this._pauseBtn) {
            this._pauseBtn.style.display = 'none';
        }

        // Call onReset callback
        if (this.options.onReset) {
            this.options.onReset();
        }

        return this;
    }

    /**
     * Stop the timer (pause without resuming)
     * @returns {this}
     */
    stop() {
        this._running = false;

        // Clear interval
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }

        return this;
    }

    /**
     * Add time to the timer
     * @param {number} ms - Milliseconds to add
     * @returns {this}
     */
    add(ms) {
        this._remaining = Math.min(this._remaining + ms, 24 * 60 * 60 * 1000); // Max 24 hours
        this._updateDisplay();
        return this;
    }

    /**
     * Subtract time from the timer
     * @param {number} ms - Milliseconds to subtract
     * @returns {this}
     */
    subtract(ms) {
        this._remaining = Math.max(0, this._remaining - ms);
        this._updateDisplay();

        // Check if we hit zero
        if (this._remaining === 0 && this._running) {
            this._complete();
        }

        return this;
    }

    /**
     * Set a new duration
     * @param {number} ms - New duration in milliseconds
     * @returns {this}
     */
    setDuration(ms) {
        this.options.duration = ms;
        if (!this._running) {
            this._remaining = ms;
            this._updateDisplay();
        }
        return this;
    }

    /**
     * Check if timer is running
     * @returns {boolean}
     */
    isRunning() {
        return this._running;
    }

    /**
     * Get remaining time
     * @returns {number} Remaining time in milliseconds
     */
    getRemaining() {
        return this._remaining;
    }

    /**
     * Get elapsed time
     * @returns {number} Elapsed time in milliseconds
     */
    getElapsed() {
        return this.options.duration - this._remaining;
    }

    /**
     * Destroy the timer
     */
    destroy() {
        this.stop();

        // Remove event listeners if controls exist
        if (this._startBtn) {
            this._startBtn.removeEventListener('click', this.start);
        }
        if (this._pauseBtn) {
            this._pauseBtn.removeEventListener('click', this.pause);
        }
        if (this._resetBtn) {
            this._resetBtn.removeEventListener('click', this.reset);
        }

        // Clear display
        if (this.element && this._container) {
            this.element.removeChild(this._container);
        }

        // Clear references
        this._display = null;
        this._controls = null;
        this._audio = null;
        this._container = null;

        if (super.destroy) {
            super.destroy();
        }
    }
}

// ============================================
// Alarm Component
// ============================================

/**
 * Alarm - Scheduled time-based alerts with localStorage persistence
 * Singleton pattern - only one instance manages all alarms
 */
class Alarm {
    static defaults = {
        alarms: [],
        timezone: 'local',
        checkInterval: 30000,     // Check every 30 seconds
        storageKey: 'domma-alarms',
        onTrigger: null,
        onSnooze: null,
        onDismiss: null,
        onAlarmAdd: null,
        onAlarmRemove: null
    };

    static _instance = null;      // Singleton
    static _checkInterval = null;
    static _nextAlarmId = 1;

    /**
     * Constructor - implements singleton pattern
     * @param {Object} options - Alarm options
     */
    constructor(options = {}) {
        // Singleton pattern - return existing instance if it exists
        if (Alarm._instance) {
            return Alarm._instance;
        }

        this.options = {...Alarm.defaults, ...options};
        this._alarms = [];
        this._init();

        Alarm._instance = this;
    }

    /**
     * Initialize alarm system
     * @private
     */
    _init() {
        this._loadAlarms();
        this._startChecking();
    }

    /**
     * Load alarms from localStorage
     * @private
     */
    _loadAlarms() {
        try {
            const stored = localStorage.getItem(this.options.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                this._alarms = Array.isArray(parsed) ? parsed : [];

                // Update nextAlarmId based on existing alarms
                if (this._alarms.length > 0) {
                    const maxId = Math.max(...this._alarms.map(a => {
                        const match = String(a.id).match(/\d+$/);
                        return match ? parseInt(match[0]) : 0;
                    }));
                    Alarm._nextAlarmId = maxId + 1;
                }
            } else if (this.options.alarms && this.options.alarms.length > 0) {
                // Use initial alarms from options
                this._alarms = this.options.alarms.map(alarm => ({
                    id: `alarm-${Alarm._nextAlarmId++}`,
                    enabled: true,
                    notification: true,
                    notificationOptions: {},
                    sound: false,
                    soundUrl: null,
                    repeat: null,
                    lastTriggered: null,
                    snoozedUntil: null,
                    ...alarm
                }));
                this._saveAlarms();
            }
        } catch (error) {
            console.error('Failed to load alarms from localStorage:', error);
            this._alarms = [];
        }
    }

    /**
     * Save alarms to localStorage
     * @private
     */
    _saveAlarms() {
        try {
            localStorage.setItem(this.options.storageKey, JSON.stringify(this._alarms));
        } catch (error) {
            console.error('Failed to save alarms to localStorage:', error);
        }
    }

    /**
     * Start checking alarms at regular interval
     * @private
     */
    _startChecking() {
        if (Alarm._checkInterval) return;

        Alarm._checkInterval = setInterval(() => {
            this._checkAlarms();
        }, this.options.checkInterval);

        // Also check immediately
        this._checkAlarms();
    }

    /**
     * Stop checking alarms
     * @private
     */
    _stopChecking() {
        if (Alarm._checkInterval) {
            clearInterval(Alarm._checkInterval);
            Alarm._checkInterval = null;
        }
    }

    /**
     * Check all alarms and trigger if needed
     * @private
     */
    _checkAlarms() {
        const now = new Date();

        this._alarms.forEach(alarm => {
            if (!alarm.enabled) return;

            // Check if snoozed
            if (alarm.snoozedUntil && now < new Date(alarm.snoozedUntil)) {
                return;
            }

            // Clear snooze if past snooze time
            if (alarm.snoozedUntil && now >= new Date(alarm.snoozedUntil)) {
                alarm.snoozedUntil = null;
                this._saveAlarms();
            }

            if (this._shouldTrigger(alarm, now)) {
                this._triggerAlarm(alarm);
            }
        });
    }

    /**
     * Check if alarm should trigger at the given time
     * @param {Object} alarm - Alarm object
     * @param {Date} now - Current time
     * @returns {boolean}
     * @private
     */
    _shouldTrigger(alarm, now) {
        // Parse alarm time
        const {hours, minutes} = this._parseTime(alarm.time);

        // Check if current time matches alarm time (within check interval tolerance)
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        if (currentHours !== hours || currentMinutes !== minutes) {
            return false;
        }

        // Check if already triggered in the last minute to avoid double-firing
        if (alarm.lastTriggered) {
            const lastTrigger = new Date(alarm.lastTriggered);
            const timeSinceLastTrigger = now - lastTrigger;

            // Don't trigger if triggered in the last 50 seconds
            if (timeSinceLastTrigger < 50000) {
                return false;
            }
        }

        // Check repeat pattern
        if (!this._matchesRepeatPattern(alarm, now)) {
            return false;
        }

        return true;
    }

    /**
     * Parse time string (HH:MM format)
     * @param {string} timeString - Time in HH:MM format
     * @returns {Object} { hours, minutes }
     * @private
     */
    _parseTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(n => parseInt(n, 10));
        return {hours, minutes};
    }

    /**
     * Check if alarm matches repeat pattern for given date
     * @param {Object} alarm - Alarm object
     * @param {Date} date - Date to check
     * @returns {boolean}
     * @private
     */
    _matchesRepeatPattern(alarm, date) {
        if (!alarm.repeat) {
            // One-time alarm - always match (user needs to disable after first trigger)
            return true;
        }

        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

        if (alarm.repeat === 'daily') {
            return true;
        }

        if (alarm.repeat === 'weekdays') {
            return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday-Friday
        }

        if (alarm.repeat === 'weekends') {
            return dayOfWeek === 0 || dayOfWeek === 6; // Saturday-Sunday
        }

        if (Array.isArray(alarm.repeat)) {
            // Custom days array: ['mon', 'wed', 'fri']
            const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
            const currentDayName = dayNames[dayOfWeek];
            return alarm.repeat.includes(currentDayName);
        }

        return false;
    }

    /**
     * Trigger an alarm
     * @param {Object} alarm - Alarm to trigger
     * @private
     */
    _triggerAlarm(alarm) {
        // Update lastTriggered timestamp
        alarm.lastTriggered = Date.now();
        this._saveAlarms();

        // Play sound if enabled
        if (alarm.sound && alarm.soundUrl) {
            const audio = new Audio(alarm.soundUrl);
            audio.play().catch(err => {
                console.warn('Failed to play alarm sound:', err);
            });
        }

        // Show notification if enabled
        if (alarm.notification && DesktopNotification.isSupported) {
            const notifOptions = {
                title: 'Alarm',
                body: alarm.label || `Alarm at ${alarm.time}`,
                requireInteraction: true,
                ...alarm.notificationOptions
            };
            DesktopNotification.notify(notifOptions.title, notifOptions);
        }

        // Call onTrigger callback
        if (this.options.onTrigger) {
            this.options.onTrigger(alarm);
        }

        // Disable one-time alarms after triggering
        if (!alarm.repeat) {
            alarm.enabled = false;
            this._saveAlarms();
        }
    }

    /**
     * Add a new alarm
     * @param {Object} alarm - Alarm configuration
     * @returns {Object} Created alarm with ID
     */
    add(alarm) {
        const newAlarm = {
            id: `alarm-${Alarm._nextAlarmId++}`,
            enabled: true,
            notification: true,
            notificationOptions: {},
            sound: false,
            soundUrl: null,
            repeat: null,
            lastTriggered: null,
            snoozedUntil: null,
            ...alarm
        };

        this._alarms.push(newAlarm);
        this._saveAlarms();

        if (this.options.onAlarmAdd) {
            this.options.onAlarmAdd(newAlarm);
        }

        return newAlarm;
    }

    /**
     * Remove an alarm by ID
     * @param {string} id - Alarm ID
     * @returns {boolean} True if removed
     */
    remove(id) {
        const index = this._alarms.findIndex(a => a.id === id);
        if (index === -1) return false;

        const removed = this._alarms.splice(index, 1)[0];
        this._saveAlarms();

        if (this.options.onAlarmRemove) {
            this.options.onAlarmRemove(removed);
        }

        return true;
    }

    /**
     * Update an alarm
     * @param {string} id - Alarm ID
     * @param {Object} changes - Changes to apply
     * @returns {Object|null} Updated alarm or null if not found
     */
    update(id, changes) {
        const alarm = this._alarms.find(a => a.id === id);
        if (!alarm) return null;

        Object.assign(alarm, changes);
        this._saveAlarms();

        return alarm;
    }

    /**
     * Enable an alarm
     * @param {string} id - Alarm ID
     * @returns {boolean} True if enabled
     */
    enable(id) {
        return this.update(id, {enabled: true}) !== null;
    }

    /**
     * Disable an alarm
     * @param {string} id - Alarm ID
     * @returns {boolean} True if disabled
     */
    disable(id) {
        return this.update(id, {enabled: false}) !== null;
    }

    /**
     * Toggle alarm enabled state
     * @param {string} id - Alarm ID
     * @returns {boolean} New enabled state or null if not found
     */
    toggle(id) {
        const alarm = this._alarms.find(a => a.id === id);
        if (!alarm) return null;

        alarm.enabled = !alarm.enabled;
        this._saveAlarms();

        return alarm.enabled;
    }

    /**
     * Snooze an alarm for a duration
     * @param {string} id - Alarm ID
     * @param {number} duration - Snooze duration in milliseconds (default 5 minutes)
     * @returns {boolean} True if snoozed
     */
    snooze(id, duration = 300000) {
        const alarm = this._alarms.find(a => a.id === id);
        if (!alarm) return false;

        alarm.snoozedUntil = Date.now() + duration;
        this._saveAlarms();

        if (this.options.onSnooze) {
            this.options.onSnooze(alarm, duration);
        }

        return true;
    }

    /**
     * Get all alarms
     * @returns {Array} Array of alarm objects
     */
    getAlarms() {
        return [...this._alarms];
    }

    /**
     * Get a specific alarm by ID
     * @param {string} id - Alarm ID
     * @returns {Object|null} Alarm object or null
     */
    getAlarm(id) {
        return this._alarms.find(a => a.id === id) || null;
    }

    /**
     * Get the next alarm that will trigger
     * @returns {Object|null} Next alarm object with trigger time
     */
    getNextAlarm() {
        const now = new Date();
        let nextAlarm = null;
        let nextTime = null;

        this._alarms.forEach(alarm => {
            if (!alarm.enabled) return;

            const occurrence = this._getNextOccurrence(alarm, now);
            if (!occurrence) return;

            if (!nextTime || occurrence < nextTime) {
                nextTime = occurrence;
                nextAlarm = {
                    ...alarm,
                    nextTrigger: occurrence
                };
            }
        });

        return nextAlarm;
    }

    /**
     * Get next occurrence time for an alarm
     * @param {Object} alarm - Alarm object
     * @param {Date} from - Start date
     * @returns {Date|null} Next occurrence date
     * @private
     */
    _getNextOccurrence(alarm, from) {
        const {hours, minutes} = this._parseTime(alarm.time);
        const now = new Date(from);

        // Start checking from today
        const checkDate = new Date(now);
        checkDate.setHours(hours, minutes, 0, 0);

        // If time already passed today, start from tomorrow
        if (checkDate <= now) {
            checkDate.setDate(checkDate.getDate() + 1);
        }

        // Check next 7 days to find matching repeat pattern
        for (let i = 0; i < 7; i++) {
            if (this._matchesRepeatPattern(alarm, checkDate)) {
                return checkDate;
            }
            checkDate.setDate(checkDate.getDate() + 1);
        }

        return null;
    }

    /**
     * Clear all alarms
     * @returns {this}
     */
    clearAll() {
        this._alarms = [];
        this._saveAlarms();
        return this;
    }

    /**
     * Destroy alarm system
     */
    destroy() {
        this._stopChecking();
        this._alarms = [];
        Alarm._instance = null;
    }
}

// ============================================
// Carousel Component
// ============================================

class Carousel extends Component {
    static defaults = {
        autoplay: false,
        interval: 5000,
        pauseOnHover: true,
        loop: true,
        animation: 'slide',
        animationDuration: 500,
        showArrows: true,
        showIndicators: true,
        slideSelector: '.carousel-slide, [data-slide]',
        activeClass: 'active',
        onChange: null
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this._currentIndex = 0;
        this._autoplayTimer = null;
        this._isAnimating = false;
        this._init();
    }

    _init() {
        if (!this.element) return;

        const opts = this.options;
        this._slides = this.element.querySelectorAll(opts.slideSelector);
        this._track = this.element.querySelector('.carousel-track');

        if (this._slides.length === 0) return;

        // Setup container styles
        this.element.style.position = 'relative';
        this.element.style.overflow = 'hidden';

        // Setup slides
        this._slides.forEach((slide, i) => {
            if (opts.animation === 'fade') {
                // First slide stays relative to maintain container height
                // Other slides are absolutely positioned on top
                slide.style.position = i === 0 ? 'relative' : 'absolute';
                slide.style.top = '0';
                slide.style.left = '0';
                slide.style.width = '100%';
                slide.style.opacity = i === 0 ? '1' : '0';
                slide.style.zIndex = i === 0 ? '1' : '0';
                slide.style.transition = `opacity ${opts.animationDuration}ms ease`;
            } else {
                slide.style.position = 'relative';
                slide.style.width = '100%';
                slide.style.flexShrink = '0';
            }
        });

        // Setup track for slide animation
        if (opts.animation === 'slide' && this._track) {
            this._track.style.display = 'flex';
            this._track.style.transition = `transform ${opts.animationDuration}ms ease`;
        }

        // Create arrows
        if (opts.showArrows) {
            this._createArrows();
        }

        // Create indicators
        if (opts.showIndicators) {
            this._createIndicators();
        }

        // Autoplay
        if (opts.autoplay) {
            this._startAutoplay();

            if (opts.pauseOnHover) {
                this._addEventListener(this.element, 'mouseenter', () => this._stopAutoplay());
                this._addEventListener(this.element, 'mouseleave', () => this._startAutoplay());
            }
        }

        // Keyboard navigation
        this._addEventListener(this.element, 'keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Make focusable
        this.element.tabIndex = 0;

        // Initial state
        this._updateState();
    }

    _createArrows() {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-arrow carousel-prev';
        prevBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>';
        prevBtn.style.cssText = `
            position: absolute;
            top: 50%;
            left: 1rem;
            transform: translateY(-50%);
            z-index: 10;
            background: rgba(255,255,255,0.9);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        `;
        this._addEventListener(prevBtn, 'click', () => this.prev());
        this._addEventListener(prevBtn, 'mouseenter', () => prevBtn.style.background = '#fff');
        this._addEventListener(prevBtn, 'mouseleave', () => prevBtn.style.background = 'rgba(255,255,255,0.9)');

        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-arrow carousel-next';
        nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
        nextBtn.style.cssText = prevBtn.style.cssText.replace('left: 1rem', 'right: 1rem');
        this._addEventListener(nextBtn, 'click', () => this.next());
        this._addEventListener(nextBtn, 'mouseenter', () => nextBtn.style.background = '#fff');
        this._addEventListener(nextBtn, 'mouseleave', () => nextBtn.style.background = 'rgba(255,255,255,0.9)');

        this.element.appendChild(prevBtn);
        this.element.appendChild(nextBtn);

        this._prevBtn = prevBtn;
        this._nextBtn = nextBtn;
    }

    _createIndicators() {
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        indicators.style.cssText = `
            position: absolute;
            bottom: 1rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 0.5rem;
            z-index: 10;
        `;

        this._slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-indicator';
            dot.style.cssText = `
                width: 10px;
                height: 10px;
                border-radius: 50%;
                border: none;
                background: rgba(255,255,255,0.5);
                cursor: pointer;
                padding: 0;
                transition: all 0.2s ease;
            `;
            this._addEventListener(dot, 'click', () => this.goTo(i));
            indicators.appendChild(dot);
        });

        this.element.appendChild(indicators);
        this._indicators = indicators;
    }

    _updateState() {
        const opts = this.options;

        // Update slides
        if (opts.animation === 'fade') {
            this._slides.forEach((slide, i) => {
                const isActive = i === this._currentIndex;
                // Active slide is relative to maintain container height
                slide.style.position = isActive ? 'relative' : 'absolute';
                slide.style.opacity = isActive ? '1' : '0';
                slide.style.zIndex = isActive ? '1' : '0';
            });
        } else if (this._track) {
            this._track.style.transform = `translateX(-${this._currentIndex * 100}%)`;
        }

        // Update indicators
        if (this._indicators) {
            const dots = this._indicators.querySelectorAll('.carousel-indicator');
            dots.forEach((dot, i) => {
                dot.style.background = i === this._currentIndex
                    ? 'rgba(255,255,255,1)'
                    : 'rgba(255,255,255,0.5)';
                dot.style.transform = i === this._currentIndex ? 'scale(1.2)' : 'scale(1)';
            });
        }

        // Update arrow visibility if not looping
        if (!opts.loop && this._prevBtn && this._nextBtn) {
            this._prevBtn.style.opacity = this._currentIndex === 0 ? '0.3' : '1';
            this._prevBtn.style.pointerEvents = this._currentIndex === 0 ? 'none' : 'auto';
            this._nextBtn.style.opacity = this._currentIndex === this._slides.length - 1 ? '0.3' : '1';
            this._nextBtn.style.pointerEvents = this._currentIndex === this._slides.length - 1 ? 'none' : 'auto';
        }
    }

    _startAutoplay() {
        if (this._autoplayTimer) return;

        this._autoplayTimer = setInterval(() => {
            this.next();
        }, this.options.interval);
    }

    _stopAutoplay() {
        if (this._autoplayTimer) {
            clearInterval(this._autoplayTimer);
            this._autoplayTimer = null;
        }
    }

    goTo(index) {
        if (this._isAnimating) return this;

        const opts = this.options;
        const oldIndex = this._currentIndex;
        const maxIndex = this._slides.length - 1;

        // Handle bounds
        if (opts.loop) {
            if (index < 0) index = maxIndex;
            if (index > maxIndex) index = 0;
        } else {
            if (index < 0 || index > maxIndex) return this;
        }

        if (index === this._currentIndex) return this;

        this._isAnimating = true;
        this._currentIndex = index;
        this._updateState();

        setTimeout(() => {
            this._isAnimating = false;
        }, opts.animationDuration);

        if (opts.onChange) {
            opts.onChange({index, oldIndex, slide: this._slides[index]});
        }

        return this;
    }

    next() {
        return this.goTo(this._currentIndex + 1);
    }

    prev() {
        return this.goTo(this._currentIndex - 1);
    }

    play() {
        this._startAutoplay();
        return this;
    }

    pause() {
        this._stopAutoplay();
        return this;
    }

    getIndex() {
        return this._currentIndex;
    }

    getSlide(index = this._currentIndex) {
        return this._slides[index];
    }

    destroy() {
        super.destroy();
        this._stopAutoplay();
    }
}

// ============================================
// BackToTop Component
// ============================================

class BackToTop extends Component {
    static defaults = {
        showAfter: null,        // Scroll distance to show (null = viewport height)
        duration: 300,          // Scroll animation duration in ms
        position: 'bottom-right', // Position: bottom-right, bottom-left
        offset: 16,             // Distance from edge in px
        target: null,           // Existing button selector (null = create new)
        zIndex: 1000,
        onShow: null,
        onHide: null,
        onScroll: null
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this._isVisible = false;
        this._isScrolling = false;
        this._init();
    }

    _init() {
        this._setupButton();
        this._bindEvents();
        this._checkVisibility();
    }

    _setupButton() {
        // Use existing button or create new one
        if (this.options.target) {
            this._button = typeof this.options.target === 'string'
                ? document.querySelector(this.options.target)
                : this.options.target;
            this._created = false;
        } else {
            this._button = this._createButton();
            this._created = true;
            document.body.appendChild(this._button);
        }

        if (this._button) {
            this._applyStyles();
        }
    }

    _createButton() {
        const btn = document.createElement('button');
        btn.className = 'dm-back-to-top';
        btn.setAttribute('title', 'Back to top');
        btn.setAttribute('aria-label', 'Scroll back to top');
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>`;
        return btn;
    }

    _applyStyles() {
        const {position, offset, zIndex} = this.options;
        const isLeft = position === 'bottom-left';

        const styles = {
            position: 'fixed',
            bottom: `${offset}px`,
            [isLeft ? 'left' : 'right']: `${offset}px`,
            padding: '0.5rem',
            background: 'var(--dm-surface, #fff)',
            border: '1px solid var(--dm-border, #dee2e6)',
            borderRadius: '9999px',
            cursor: 'pointer',
            zIndex: zIndex,
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: '0',
            visibility: 'hidden',
            transform: 'translateY(10px)',
            transition: 'opacity 0.2s ease, transform 0.15s ease, visibility 0.2s, background 0.2s ease, box-shadow 0.15s ease'
        };

        Object.assign(this._button.style, styles);

        // Add hover styles via event listeners
        this._addEventListener(this._button, 'mouseenter', () => {
            if (this._isVisible) {
                this._button.style.background = 'var(--dm-hover-bg, rgba(0,0,0,0.04))';
                this._button.style.transform = 'translateY(0) scale(1.1)';
                this._button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            }
        });

        this._addEventListener(this._button, 'mouseleave', () => {
            if (this._isVisible) {
                this._button.style.background = 'var(--dm-surface, #fff)';
                this._button.style.transform = 'translateY(0)';
                this._button.style.boxShadow = 'none';
            }
        });

        // Style the SVG
        const svg = this._button.querySelector('svg');
        if (svg) {
            svg.style.color = 'var(--dm-text, #212529)';
        }
    }

    _bindEvents() {
        // Scroll listener
        this._scrollHandler = () => this._checkVisibility();
        window.addEventListener('scroll', this._scrollHandler, {passive: true});

        // Click handler
        this._addEventListener(this._button, 'click', (e) => {
            e.preventDefault();
            this.scroll();
        });
    }

    _checkVisibility() {
        const threshold = this.options.showAfter ?? window.innerHeight;
        const shouldShow = window.scrollY > threshold;

        if (shouldShow && !this._isVisible) {
            this.show();
        } else if (!shouldShow && this._isVisible) {
            this.hide();
        }

        if (this.options.onScroll) {
            this.options.onScroll({scrollY: window.scrollY, isVisible: this._isVisible});
        }
    }

    scroll() {
        if (this._isScrolling) return this;

        this._isScrolling = true;
        const start = window.scrollY;
        const startTime = performance.now();
        const duration = this.options.duration;

        // easeOutQuad: fast start, gentle end
        const easeOutQuad = t => t * (2 - t);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuad(progress);

            window.scrollTo(0, start * (1 - eased));

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
        this._button.style.opacity = '1';
        this._button.style.visibility = 'visible';
        this._button.style.transform = 'translateY(0)';

        if (this.options.onShow) {
            this.options.onShow({button: this._button});
        }

        return this;
    }

    hide() {
        if (!this._isVisible) return this;

        this._isVisible = false;
        this._button.style.opacity = '0';
        this._button.style.visibility = 'hidden';
        this._button.style.transform = 'translateY(10px)';

        if (this.options.onHide) {
            this.options.onHide({button: this._button});
        }

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

    destroy() {
        window.removeEventListener('scroll', this._scrollHandler);
        super.destroy();

        if (this._created && this._button && this._button.parentNode) {
            this._button.parentNode.removeChild(this._button);
        }
    }
}

// ============================================
// Dialog Component (Alert, Confirm, Prompt)
// ============================================

const Dialog = {
    _container: null,
    _defaults: {
        title: '',
        message: '',
        confirmText: 'OK',
        cancelText: 'Cancel',
        inputPlaceholder: '',
        inputValue: '',
        inputType: 'text',
        animation: true,
        backdrop: true,
        backdropClose: false,
        keyboard: true,
        className: ''
    },

    _ensureContainer() {
        if (!this._container) {
            this._container = document.createElement('div');
            this._container.className = 'dm-dialog-container';
            document.body.appendChild(this._container);
        }
        return this._container;
    },

    _createDialog(type, options) {
        const opts = {...this._defaults, ...options};
        const container = this._ensureContainer();

        return new Promise((resolve) => {
            // Create dialog elements
            const overlay = document.createElement('div');
            overlay.className = `dm-dialog-overlay${opts.animation ? ' dm-dialog-animate' : ''}`;

            const dialog = document.createElement('div');
            dialog.className = `dm-dialog dm-dialog-${type}${opts.className ? ' ' + opts.className : ''}`;
            dialog.setAttribute('role', 'dialog');
            dialog.setAttribute('aria-modal', 'true');

            // Build dialog content
            let html = '<div class="dm-dialog-content">';

            if (opts.title) {
                html += `<div class="dm-dialog-header"><h3 class="dm-dialog-title">${opts.title}</h3></div>`;
            }

            html += '<div class="dm-dialog-body">';
            if (opts.message) {
                html += `<p class="dm-dialog-message">${opts.message}</p>`;
            }

            if (type === 'prompt') {
                html += `<input type="${opts.inputType}" class="dm-dialog-input form-input" placeholder="${opts.inputPlaceholder}" value="${opts.inputValue}">`;
            }

            html += '</div>';

            // Footer with buttons
            html += '<div class="dm-dialog-footer">';

            if (type === 'confirm' || type === 'prompt') {
                html += `<button type="button" class="btn btn-outline dm-dialog-cancel">${opts.cancelText}</button>`;
            }

            html += `<button type="button" class="btn btn-primary dm-dialog-confirm">${opts.confirmText}</button>`;
            html += '</div></div>';

            dialog.innerHTML = html;
            overlay.appendChild(dialog);
            container.appendChild(overlay);

            // Get elements
            const confirmBtn = dialog.querySelector('.dm-dialog-confirm');
            const cancelBtn = dialog.querySelector('.dm-dialog-cancel');
            const input = dialog.querySelector('.dm-dialog-input');

            // Focus management
            const focusTarget = input || confirmBtn;
            setTimeout(() => focusTarget?.focus(), 50);

            // Select input text if present
            if (input) {
                input.select();
            }

            // Cleanup function
            const cleanup = (result) => {
                if (opts.animation) {
                    overlay.classList.add('dm-dialog-closing');
                    setTimeout(() => {
                        overlay.remove();
                        resolve(result);
                    }, 200);
                } else {
                    overlay.remove();
                    resolve(result);
                }
            };

            // Event handlers
            const handleConfirm = () => {
                if (type === 'prompt') {
                    cleanup(input.value);
                } else if (type === 'confirm') {
                    cleanup(true);
                } else {
                    cleanup(undefined);
                }
            };

            const handleCancel = () => {
                if (type === 'prompt') {
                    cleanup(null);
                } else {
                    cleanup(false);
                }
            };

            confirmBtn.addEventListener('click', handleConfirm);
            cancelBtn?.addEventListener('click', handleCancel);

            // Backdrop click
            if (opts.backdropClose) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        handleCancel();
                    }
                });
            }

            // Keyboard handling
            if (opts.keyboard) {
                const handleKeydown = (e) => {
                    if (e.key === 'Escape') {
                        handleCancel();
                        document.removeEventListener('keydown', handleKeydown);
                    } else if (e.key === 'Enter' && type !== 'prompt') {
                        handleConfirm();
                        document.removeEventListener('keydown', handleKeydown);
                    } else if (e.key === 'Enter' && type === 'prompt' && e.target === input) {
                        handleConfirm();
                        document.removeEventListener('keydown', handleKeydown);
                    }
                };
                document.addEventListener('keydown', handleKeydown);
            }
        });
    },

    /**
     * Show an alert dialog
     * @param {string} message - The message to display
     * @param {object} options - Optional configuration
     * @returns {Promise<void>}
     */
    alert(message, options = {}) {
        if (typeof message === 'object') {
            options = message;
            message = options.message || '';
        }
        return this._createDialog('alert', {...options, message});
    },

    /**
     * Show a confirm dialog
     * @param {string} message - The message to display
     * @param {object} options - Optional configuration
     * @returns {Promise<boolean>} - True if confirmed, false if cancelled
     */
    confirm(message, options = {}) {
        if (typeof message === 'object') {
            options = message;
            message = options.message || '';
        }
        return this._createDialog('confirm', {...options, message});
    },

    /**
     * Show a prompt dialog
     * @param {string} message - The message to display
     * @param {object} options - Optional configuration
     * @returns {Promise<string|null>} - Input value if confirmed, null if cancelled
     */
    prompt(message, options = {}) {
        if (typeof message === 'object') {
            options = message;
            message = options.message || '';
        }
        return this._createDialog('prompt', {...options, message});
    }
};

// ============================================
// ButtonGroup Component
// ============================================

class ButtonGroup extends Component {
    static defaults = {
        mode: 'single',           // 'single' (radio) or 'multiple' (checkbox)
        activeClass: 'active',
        allowEmpty: false,        // Allow no selection in single mode
        onChange: null
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this._init();
    }

    _init() {
        if (!this.element) return;

        this.buttons = Array.from(this.element.querySelectorAll('.btn'));

        this.buttons.forEach((btn, index) => {
            btn.dataset.index = index;
            this._addEventListener(btn, 'click', (e) => {
                e.preventDefault();
                this._handleClick(btn, index);
            });
        });
    }

    _handleClick(btn, index) {
        const wasActive = btn.classList.contains(this.options.activeClass);

        if (this.options.mode === 'single') {
            // In single mode, deselect all others
            if (!wasActive || !this.options.allowEmpty) {
                this.buttons.forEach(b => b.classList.remove(this.options.activeClass));
                btn.classList.add(this.options.activeClass);
            } else if (this.options.allowEmpty) {
                btn.classList.remove(this.options.activeClass);
            }
        } else {
            // In multiple mode, just toggle this button
            btn.classList.toggle(this.options.activeClass);
        }

        if (this.options.onChange) {
            this.options.onChange(this.getValue(), index, btn);
        }
    }

    /**
     * Get the current value(s)
     * @returns {number|number[]|null} Index (single) or array of indices (multiple)
     */
    getValue() {
        const activeIndices = this.buttons
            .map((btn, i) => btn.classList.contains(this.options.activeClass) ? i : -1)
            .filter(i => i !== -1);

        if (this.options.mode === 'single') {
            return activeIndices.length > 0 ? activeIndices[0] : null;
        }
        return activeIndices;
    }

    /**
     * Get the active button element(s)
     * @returns {HTMLElement|HTMLElement[]|null}
     */
    getActive() {
        const active = this.buttons.filter(btn =>
            btn.classList.contains(this.options.activeClass)
        );

        if (this.options.mode === 'single') {
            return active.length > 0 ? active[0] : null;
        }
        return active;
    }

    /**
     * Set the active button(s) by index
     * @param {number|number[]} value - Index or array of indices
     * @returns {this}
     */
    setValue(value) {
        const indices = Array.isArray(value) ? value : [value];

        this.buttons.forEach((btn, i) => {
            if (indices.includes(i)) {
                btn.classList.add(this.options.activeClass);
            } else {
                btn.classList.remove(this.options.activeClass);
            }
        });

        return this;
    }

    /**
     * Toggle a specific button by index
     * @param {number} index
     * @returns {this}
     */
    toggle(index) {
        if (index >= 0 && index < this.buttons.length) {
            this._handleClick(this.buttons[index], index);
        }
        return this;
    }

    /**
     * Select all buttons (multiple mode only)
     * @returns {this}
     */
    selectAll() {
        if (this.options.mode === 'multiple') {
            this.buttons.forEach(btn => btn.classList.add(this.options.activeClass));
            if (this.options.onChange) {
                this.options.onChange(this.getValue(), -1, null);
            }
        }
        return this;
    }

    /**
     * Deselect all buttons
     * @returns {this}
     */
    deselectAll() {
        this.buttons.forEach(btn => btn.classList.remove(this.options.activeClass));
        if (this.options.onChange) {
            this.options.onChange(this.getValue(), -1, null);
        }
        return this;
    }
}

// ============================================
// Loader Component
// ============================================

class Loader extends Component {
    static defaults = {
        type: 'spinner',        // 'spinner', 'dots', 'pulse', 'bars'
        size: 'medium',         // 'small', 'medium', 'large', or number (px)
        color: 'primary',       // 'primary', 'secondary', 'white', or hex
        overlay: false,         // Show with backdrop overlay
        text: '',               // Optional loading text
        centered: true          // Centre in container
    };

    static sizes = {
        small: 24,
        medium: 40,
        large: 64
    };

    static _overlayInstances = new Map();

    constructor(selector, options = {}) {
        super(selector, options);
        this._visible = false;
        this._init();
    }

    _init() {
        if (!this.element) return;
        this._render();
    }

    _getSize() {
        const {size} = this.options;
        if (typeof size === 'number') return size;
        return Loader.sizes[size] || Loader.sizes.medium;
    }

    _getColor() {
        const {color} = this.options;
        const colorMap = {
            primary: 'var(--dm-primary, #6495ED)',
            secondary: 'var(--dm-secondary, #6c757d)',
            success: 'var(--dm-success, #28a745)',
            danger: 'var(--dm-danger, #dc3545)',
            warning: 'var(--dm-warning, #ffc107)',
            info: 'var(--dm-info, #17a2b8)',
            white: '#ffffff',
            dark: 'var(--dm-gray-800, #343a40)'
        };
        return colorMap[color] || color;
    }

    _render() {
        const size = this._getSize();
        const color = this._getColor();
        const {type, overlay, text, centered} = this.options;

        // Create wrapper
        this._wrapper = document.createElement('div');
        this._wrapper.className = 'dm-loader';
        this._wrapper.setAttribute('role', 'status');
        this._wrapper.setAttribute('aria-live', 'polite');

        // Base wrapper styles
        const wrapperStyles = {
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
        };

        if (overlay) {
            Object.assign(wrapperStyles, {
                position: 'absolute',
                inset: '0',
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: '1000'
            });
            this.element.style.position = 'relative';
        } else if (centered) {
            Object.assign(wrapperStyles, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            });
            if (getComputedStyle(this.element).position === 'static') {
                this.element.style.position = 'relative';
            }
        }

        Object.assign(this._wrapper.style, wrapperStyles);

        // Create spinner element
        this._spinner = document.createElement('div');
        this._spinner.className = `dm-loader-${type}`;

        // Apply type-specific rendering
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

        this._wrapper.appendChild(this._spinner);

        // Add text if provided
        if (text) {
            this._textEl = document.createElement('span');
            this._textEl.className = 'dm-loader-text';
            this._textEl.textContent = text;
            this._textEl.style.cssText = `
                color: ${overlay ? '#fff' : 'var(--dm-text, #212529)'};
                font-size: var(--dm-text-sm, 0.875rem);
            `;
            this._wrapper.appendChild(this._textEl);
        }

        // Add to DOM but hidden initially
        this._wrapper.style.display = 'none';
        this.element.appendChild(this._wrapper);
    }

    _renderSpinner(size, color) {
        this._spinner.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            border: ${Math.max(2, size / 10)}px solid ${color};
            border-top-color: transparent;
            border-radius: 50%;
            animation: dm-loader-spin 0.8s linear infinite;
        `;

        this._injectKeyframes('dm-loader-spin', `
            @keyframes dm-loader-spin {
                to { transform: rotate(360deg); }
            }
        `);
    }

    _renderDots(size, color) {
        const dotSize = size / 4;
        this._spinner.style.cssText = `
            display: flex;
            gap: ${dotSize / 2}px;
        `;

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dot.style.cssText = `
                width: ${dotSize}px;
                height: ${dotSize}px;
                background: ${color};
                border-radius: 50%;
                animation: dm-loader-bounce 1.4s ease-in-out ${i * 0.16}s infinite both;
            `;
            this._spinner.appendChild(dot);
        }

        this._injectKeyframes('dm-loader-bounce', `
            @keyframes dm-loader-bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }
        `);
    }

    _renderPulse(size, color) {
        this._spinner.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            animation: dm-loader-pulse 1.2s ease-in-out infinite;
        `;

        this._injectKeyframes('dm-loader-pulse', `
            @keyframes dm-loader-pulse {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(1); opacity: 0; }
            }
        `);
    }

    _renderBars(size, color) {
        const barWidth = size / 6;
        const barHeight = size;

        this._spinner.style.cssText = `
            display: flex;
            align-items: center;
            gap: ${barWidth / 2}px;
            height: ${barHeight}px;
        `;

        for (let i = 0; i < 4; i++) {
            const bar = document.createElement('span');
            bar.style.cssText = `
                width: ${barWidth}px;
                height: 100%;
                background: ${color};
                border-radius: 2px;
                animation: dm-loader-bars 1s ease-in-out ${i * 0.1}s infinite;
            `;
            this._spinner.appendChild(bar);
        }

        this._injectKeyframes('dm-loader-bars', `
            @keyframes dm-loader-bars {
                0%, 40%, 100% { transform: scaleY(0.4); }
                20% { transform: scaleY(1); }
            }
        `);
    }

    _injectKeyframes(name, css) {
        if (document.getElementById(`dm-loader-${name}`)) return;

        const style = document.createElement('style');
        style.id = `dm-loader-${name}`;
        style.textContent = css;
        document.head.appendChild(style);
    }

    show() {
        if (this._wrapper) {
            this._wrapper.style.display = 'inline-flex';
            this._visible = true;
        }
        return this;
    }

    hide() {
        if (this._wrapper) {
            this._wrapper.style.display = 'none';
            this._visible = false;
        }
        return this;
    }

    toggle() {
        return this._visible ? this.hide() : this.show();
    }

    isVisible() {
        return this._visible;
    }

    setText(text) {
        if (this._textEl) {
            this._textEl.textContent = text;
        } else if (text && this._wrapper) {
            this._textEl = document.createElement('span');
            this._textEl.className = 'dm-loader-text';
            this._textEl.textContent = text;
            this._textEl.style.cssText = `
                color: ${this.options.overlay ? '#fff' : 'var(--dm-text, #212529)'};
                font-size: var(--dm-text-sm, 0.875rem);
            `;
            this._wrapper.appendChild(this._textEl);
        }
        return this;
    }

    destroy() {
        if (this._wrapper) {
            this._wrapper.remove();
        }
        super.destroy();
    }

    // Static convenience methods
    static show(selector, options = {}) {
        const el = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;

        if (!el) return null;

        let instance = Loader._overlayInstances.get(el);
        if (!instance) {
            instance = new Loader(el, options);
            Loader._overlayInstances.set(el, instance);
        }

        instance.show();
        return instance;
    }

    static hide(selector) {
        const el = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;

        const instance = Loader._overlayInstances.get(el);
        if (instance) {
            instance.hide();
        }
    }

    static fullscreen(text = 'Loading...', options = {}) {
        let container = document.getElementById('dm-loader-fullscreen');

        if (!container) {
            container = document.createElement('div');
            container.id = 'dm-loader-fullscreen';
            container.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            `;
            document.body.appendChild(container);
        }

        const instance = new Loader(container, {
            type: options.type || 'spinner',
            size: options.size || 'large',
            color: options.color || 'white',
            text,
            overlay: false,
            centered: false
        });

        instance.show();
        instance._fullscreenContainer = container;

        // Override destroy to also remove the container
        const originalDestroy = instance.destroy.bind(instance);
        instance.destroy = () => {
            originalDestroy();
            if (container.parentNode) {
                container.remove();
            }
        };

        return instance;
    }
}

// ============================================
// Breadcrumbs Component
// ============================================

class Breadcrumbs extends Component {
    static defaults = {
        items: [],
        separator: '/',        // '/', '>', '→', 'chevron', or custom HTML
        homeIcon: false,       // Show home icon for first item
        responsive: true,      // Collapse on mobile
        onChange: null         // Callback when item clicked
    };

    static separators = {
        '/': '/',
        '>': '›',
        '→': '→',
        'chevron': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>'
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this._init();
    }

    _init() {
        if (!this.element) return;
        this._render();
        this._bindEvents();
    }

    _getSeparatorHTML() {
        const {separator} = this.options;
        return Breadcrumbs.separators[separator] || separator;
    }

    _render() {
        const {items, homeIcon, responsive} = this.options;
        const separatorHTML = this._getSeparatorHTML();

        this.element.className = 'dm-breadcrumbs';
        if (responsive) {
            this.element.classList.add('dm-breadcrumbs-responsive');
        }

        this.element.setAttribute('aria-label', 'Breadcrumb');
        this.element.style.cssText = `
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.5rem;
            font-size: var(--dm-text-sm, 0.875rem);
            color: var(--dm-text-muted, #6c757d);
        `;

        let html = '';
        items.forEach((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;

            // Add separator (except before first item)
            if (index > 0) {
                html += `<span class="dm-breadcrumb-separator" aria-hidden="true" style="
                    display: inline-flex;
                    align-items: center;
                    opacity: 0.5;
                ">${separatorHTML}</span>`;
            }

            // Item content
            let content = item.text || item;
            if (isFirst && homeIcon) {
                content = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>${content}`;
            }

            if (isLast || item.active) {
                html += `<span class="dm-breadcrumb-item active" aria-current="page" style="
                    color: var(--dm-text, #212529);
                    font-weight: 500;
                ">${content}</span>`;
            } else {
                html += `<a href="${item.url || '#'}" class="dm-breadcrumb-item dm-breadcrumb-link" data-index="${index}" style="
                    color: inherit;
                    text-decoration: none;
                    transition: color 0.15s ease;
                ">${content}</a>`;
            }
        });

        this.element.innerHTML = html;

        // Add hover styles
        this._injectStyles();
    }

    _injectStyles() {
        if (document.getElementById('dm-breadcrumbs-styles')) return;

        const style = document.createElement('style');
        style.id = 'dm-breadcrumbs-styles';
        style.textContent = `
            .dm-breadcrumb-link:hover {
                color: var(--dm-primary, #6495ED) !important;
            }
            @media (max-width: 576px) {
                .dm-breadcrumbs-responsive .dm-breadcrumb-item:not(:last-child):not(:first-child) {
                    display: none;
                }
                .dm-breadcrumbs-responsive .dm-breadcrumb-separator:not(:first-of-type):not(:last-of-type) {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    _bindEvents() {
        this._addEventListener(this.element, 'click', (e) => {
            const link = e.target.closest('.dm-breadcrumb-link');
            if (link) {
                const index = parseInt(link.dataset.index, 10);
                if (this.options.onChange) {
                    e.preventDefault();
                    this.options.onChange(this.options.items[index], index, e);
                }
            }
        });
    }

    setItems(items) {
        this.options.items = items;
        this._render();
        return this;
    }

    addItem(item) {
        // Remove active from previous last item
        if (this.options.items.length > 0) {
            const last = this.options.items[this.options.items.length - 1];
            if (typeof last === 'object') {
                last.active = false;
            }
        }
        this.options.items.push(item);
        this._render();
        return this;
    }

    removeItem(index) {
        if (index >= 0 && index < this.options.items.length) {
            this.options.items.splice(index, 1);
            this._render();
        }
        return this;
    }

    getItems() {
        return [...this.options.items];
    }
}

// ============================================
// Navbar Component
// ============================================

class Navbar extends Component {
    static defaults = {
        brand: null,            // { text, logo, url }
        items: [],              // [{ text, url, active, items (for dropdown) }]
        position: 'static',     // 'static', 'fixed', 'sticky'
        variant: 'light',       // 'light', 'dark', 'transparent'
        collapsible: true,      // Mobile hamburger menu
        collapseAt: 768,        // Breakpoint for collapse
        actions: [],            // Right-side buttons/elements [{ text, url, variant }]
        onItemClick: null
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this._isCollapsed = true;
        this._init();
    }

    _init() {
        if (!this.element) return;
        this._render();
        this._bindEvents();
    }

    _render() {
        const {brand, items, position, variant, collapsible, actions} = this.options;

        // Set up navbar element
        this.element.className = 'navbar';
        this.element.classList.add(`navbar-${variant}`);
        if (position !== 'static') {
            this.element.classList.add(`navbar-${position}`);
        }

        this.element.setAttribute('role', 'navigation');

        let html = '<div class="navbar-container">';

        // Brand section
        if (brand) {
            html += '<div class="navbar-brand">';
            if (brand.url) {
                html += `<a href="${brand.url}" class="navbar-brand-link">`;
            }
            // Support custom HTML or standard logo/text
            if (brand.html) {
                html += brand.html;
            } else {
                if (brand.logo) {
                    html += `<img src="${brand.logo}" alt="${brand.text || ''}" class="navbar-logo">`;
                }
                if (brand.text) {
                    html += `<span class="navbar-brand-text">${brand.text}</span>`;
                }
            }
            if (brand.url) {
                html += '</a>';
            }
            html += '</div>';
        }

        // Mobile toggle button
        if (collapsible) {
            html += `
                <button class="navbar-toggle" aria-label="Toggle navigation" aria-expanded="false">
                    <span class="navbar-toggle-icon"></span>
                </button>
            `;
        }

        // Nav items container
        html += '<div class="navbar-collapse">';
        html += '<ul class="navbar-nav">';

        items.forEach((item, index) => {
            if (item.items && item.items.length > 0) {
                // Dropdown
                html += `<li class="navbar-item navbar-dropdown">`;
                html += `<button class="navbar-link navbar-dropdown-toggle" data-index="${index}">
                    ${item.text}
                    <svg class="navbar-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </button>`;
                html += '<ul class="navbar-dropdown-menu">';
                item.items.forEach((subItem, subIndex) => {
                    html += `<li><a href="${subItem.url || '#'}" class="navbar-dropdown-item" data-index="${index}" data-subindex="${subIndex}">${subItem.text}</a></li>`;
                });
                html += '</ul>';
                html += '</li>';
            } else {
                // Regular item
                html += `<li class="navbar-item">`;
                html += `<a href="${item.url || '#'}" class="navbar-link${item.active ? ' active' : ''}" data-index="${index}">${item.text}</a>`;
                html += '</li>';
            }
        });

        html += '</ul>';

        // Actions section
        if (actions && actions.length > 0) {
            html += '<div class="navbar-actions">';
            actions.forEach((action, index) => {
                const variant = action.variant || 'primary';
                html += `<a href="${action.url || '#'}" class="navbar-action dm-btn dm-btn-${variant}" data-action="${index}">${action.text}</a>`;
            });
            html += '</div>';
        }

        html += '</div>'; // .navbar-collapse
        html += '</div>'; // .navbar-container

        this.element.innerHTML = html;

        // Store references
        this._toggle = this.element.querySelector('.navbar-toggle');
        this._collapse = this.element.querySelector('.navbar-collapse');
    }

    _bindEvents() {
        // Toggle button click
        if (this._toggle) {
            this._addEventListener(this._toggle, 'click', () => {
                this.toggle();
            });
        }

        // Nav link clicks
        this._addEventListener(this.element, 'click', (e) => {
            const link = e.target.closest('.navbar-link:not(.navbar-dropdown-toggle)');
            if (link) {
                const index = parseInt(link.dataset.index, 10);
                if (this.options.onItemClick) {
                    e.preventDefault();
                    this.options.onItemClick(this.options.items[index], index, e);
                }
                // Collapse on mobile after click
                if (window.innerWidth < this.options.collapseAt) {
                    this.collapse();
                }
            }

            // Dropdown item clicks
            const dropdownItem = e.target.closest('.navbar-dropdown-item');
            if (dropdownItem) {
                const index = parseInt(dropdownItem.dataset.index, 10);
                const subIndex = parseInt(dropdownItem.dataset.subindex, 10);
                if (this.options.onItemClick) {
                    e.preventDefault();
                    const parentItem = this.options.items[index];
                    this.options.onItemClick(parentItem.items[subIndex], subIndex, e, parentItem);
                }
            }
        });

        // Dropdown toggle
        this._addEventListener(this.element, 'click', (e) => {
            const toggle = e.target.closest('.navbar-dropdown-toggle');
            if (toggle) {
                const dropdown = toggle.closest('.navbar-dropdown');
                dropdown.classList.toggle('open');
            }
        });

        // Close dropdowns on outside click
        this._addEventListener(document, 'click', (e) => {
            if (!e.target.closest('.navbar-dropdown')) {
                this.element.querySelectorAll('.navbar-dropdown.open').forEach(dd => {
                    dd.classList.remove('open');
                });
            }
        });

        // Handle resize
        this._addEventListener(window, 'resize', () => {
            if (window.innerWidth >= this.options.collapseAt) {
                this._collapse?.classList.remove('show');
                this._isCollapsed = true;
                if (this._toggle) {
                    this._toggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    setActive(index) {
        this.options.items.forEach((item, i) => {
            item.active = i === index;
        });
        this._render();
        return this;
    }

    setItems(items) {
        this.options.items = items;
        this._render();
        return this;
    }

    expand() {
        if (this._collapse) {
            this._collapse.classList.add('show');
            this._isCollapsed = false;
            if (this._toggle) {
                this._toggle.setAttribute('aria-expanded', 'true');
            }
        }
        return this;
    }

    collapse() {
        if (this._collapse) {
            this._collapse.classList.remove('show');
            this._isCollapsed = true;
            if (this._toggle) {
                this._toggle.setAttribute('aria-expanded', 'false');
            }
        }
        return this;
    }

    toggle() {
        return this._isCollapsed ? this.expand() : this.collapse();
    }

    isCollapsed() {
        return this._isCollapsed;
    }
}

// ============================================
// Autocomplete Component
// ============================================

class Autocomplete extends Component {
    static defaults = {
        data: [],
        dataSource: null,
        minChars: 1,
        maxResults: 10,
        debounce: 300,
        filterFn: null,
        renderItem: null,
        highlightMatches: true,
        position: 'auto',
        placeholder: '',
        emptyMessage: 'No results found',
        loadingMessage: 'Loading...',
        caseSensitive: false,
        selectOnEnter: true,
        clearOnSelect: false,
        onSelect: null,
        onChange: null,
        onOpen: null,
        onClose: null,
        onFilter: null
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this.model = options.model || null;
        this.modelKey = options.modelKey || null;
        this._isOpen = false;
        this._activeIndex = -1;
        this._filteredData = [];
        this._loading = false;
        this._debounceTimer = null;
        this._dropdown = null;
        this._list = null;
        this._loadingEl = null;
        this._emptyEl = null;
        this._init();

        // Subscribe to model changes
        if (this.model && typeof this.model.onChange === 'function') {
            this._modelUnsubscribe = this.model.onChange((field, newVal) => {
                if (field === this.modelKey && newVal !== this.getValue()) {
                    this.setValue(newVal);
                }
            });
        }
    }

    _init() {
        if (!this.element) return;

        // Ensure element is an input
        if (this.element.tagName !== 'INPUT') {
            console.error('Autocomplete requires an input element');
            return;
        }

        // Set placeholder
        if (this.options.placeholder) {
            this.element.setAttribute('placeholder', this.options.placeholder);
        }

        // Create dropdown structure
        this._createDropdown();

        // Set up event listeners
        this._bindEvents();

        // Set ARIA attributes
        this.element.setAttribute('role', 'combobox');
        this.element.setAttribute('aria-autocomplete', 'list');
        this.element.setAttribute('aria-expanded', 'false');
        this.element.setAttribute('aria-controls', this._dropdown.id);
    }

    _createDropdown() {
        // Create wrapper if input doesn't have one
        let wrapper = this.element.parentElement;
        if (!wrapper || !wrapper.classList.contains('dm-autocomplete')) {
            wrapper = document.createElement('div');
            wrapper.className = 'dm-autocomplete';
            this.element.parentNode.insertBefore(wrapper, this.element);
            wrapper.appendChild(this.element);
        }

        // Create dropdown
        this._dropdown = document.createElement('div');
        this._dropdown.className = 'dm-autocomplete-dropdown';
        this._dropdown.id = `autocomplete-${Math.random().toString(36).substr(2, 9)}`;
        this._dropdown.setAttribute('role', 'listbox');
        this._dropdown.style.display = 'none';

        // Create loading indicator
        this._loadingEl = document.createElement('div');
        this._loadingEl.className = 'dm-autocomplete-loading';
        this._loadingEl.textContent = this.options.loadingMessage;
        this._loadingEl.style.display = 'none';
        this._dropdown.appendChild(this._loadingEl);

        // Create empty message
        this._emptyEl = document.createElement('div');
        this._emptyEl.className = 'dm-autocomplete-empty';
        this._emptyEl.textContent = this.options.emptyMessage;
        this._emptyEl.style.display = 'none';
        this._dropdown.appendChild(this._emptyEl);

        // Create list
        this._list = document.createElement('ul');
        this._list.className = 'dm-autocomplete-list';
        this._dropdown.appendChild(this._list);

        wrapper.appendChild(this._dropdown);
    }

    _bindEvents() {
        const inputHandler = this._handleInput.bind(this);
        const keydownHandler = this._handleKeydown.bind(this);
        const focusHandler = () => {
            if (this.element.value.length >= this.options.minChars) {
                this._filterData(this.element.value);
            }
        };
        const blurHandler = (e) => {
            // Delay close to allow click events on dropdown items
            setTimeout(() => {
                if (!this._dropdown.contains(document.activeElement)) {
                    this.close();
                }
            }, 200);
        };

        this._addEventListener(this.element, 'input', inputHandler);
        this._addEventListener(this.element, 'keydown', keydownHandler);
        this._addEventListener(this.element, 'focus', focusHandler);
        this._addEventListener(this.element, 'blur', blurHandler);
    }

    _handleInput(e) {
        const value = e.target.value;

        // Clear debounce timer
        if (this._debounceTimer) {
            clearTimeout(this._debounceTimer);
        }

        // Sync to model
        if (this.model && this.modelKey) {
            this.model.set(this.modelKey, value);
        }

        // Trigger onChange callback
        if (this.options.onChange) {
            this.options.onChange(value, e);
        }

        // Check minimum characters
        if (value.length < this.options.minChars) {
            this.close();
            return;
        }

        // Debounce filtering
        this._debounceTimer = setTimeout(() => {
            this._filterData(value);
        }, this.options.debounce);
    }

    _handleKeydown(e) {
        if (!this._isOpen) {
            // Open on arrow down if min chars met
            if (e.key === 'ArrowDown' && this.element.value.length >= this.options.minChars) {
                e.preventDefault();
                this._filterData(this.element.value);
            }
            return;
        }

        const items = this._list.querySelectorAll('.dm-autocomplete-item');

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this._activeIndex = Math.min(this._activeIndex + 1, items.length - 1);
                this._updateActive();
                break;

            case 'ArrowUp':
                e.preventDefault();
                this._activeIndex = Math.max(this._activeIndex - 1, -1);
                this._updateActive();
                break;

            case 'Enter':
                e.preventDefault();
                if (this._activeIndex >= 0 && this.options.selectOnEnter) {
                    this._selectItem(this._activeIndex);
                }
                break;

            case 'Escape':
                e.preventDefault();
                this.close();
                break;

            case 'Tab':
                if (this._activeIndex >= 0) {
                    e.preventDefault();
                    this._selectItem(this._activeIndex);
                }
                this.close();
                break;
        }
    }

    async _filterData(query) {
        let results = [];

        // Show loading if using async data source
        if (this.options.dataSource) {
            this._setLoading(true);

            try {
                results = await this.options.dataSource(query);
            } catch (error) {
                console.error('Autocomplete dataSource error:', error);
                results = [];
            }

            this._setLoading(false);
        } else {
            // Filter static data
            const filterFn = this.options.filterFn || this._defaultFilter.bind(this);
            results = this.options.data.filter(item => filterFn(item, query));
        }

        // Limit results
        if (this.options.maxResults) {
            results = results.slice(0, this.options.maxResults);
        }

        // Trigger onFilter callback
        if (this.options.onFilter) {
            results = this.options.onFilter(results, query) || results;
        }

        this._filteredData = results;
        this._renderResults(query);
    }

    _defaultFilter(item, query) {
        const itemStr = typeof item === 'string' ? item : item.label || item.value || String(item);
        const queryStr = this.options.caseSensitive ? query : query.toLowerCase();
        const compareStr = this.options.caseSensitive ? itemStr : itemStr.toLowerCase();
        return compareStr.includes(queryStr);
    }

    _renderResults(query) {
        // Clear list
        this._list.innerHTML = '';
        this._activeIndex = -1;

        // Show/hide empty message
        if (this._filteredData.length === 0) {
            this._emptyEl.style.display = 'block';
            this._list.style.display = 'none';
            this.open();
            return;
        }

        this._emptyEl.style.display = 'none';
        this._list.style.display = 'block';

        // Render items
        this._filteredData.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'dm-autocomplete-item';
            li.setAttribute('role', 'option');
            li.setAttribute('data-index', index);

            // Use custom renderer if provided
            if (this.options.renderItem) {
                const rendered = this.options.renderItem(item, query);
                li.innerHTML = typeof rendered === 'string' ? rendered : '';
                if (typeof rendered !== 'string') {
                    li.appendChild(rendered);
                }
            } else {
                // Default rendering with highlighting
                const text = typeof item === 'string' ? item : item.label || item.value || String(item);
                if (this.options.highlightMatches) {
                    li.innerHTML = this._highlightMatch(text, query);
                } else {
                    li.textContent = text;
                }
            }

            // Click handler
            li.addEventListener('click', () => {
                this._selectItem(index);
            });

            // Hover handler
            li.addEventListener('mouseenter', () => {
                this._activeIndex = index;
                this._updateActive();
            });

            this._list.appendChild(li);
        });

        this.open();
    }

    _highlightMatch(text, query) {
        if (!query) return text;

        const regex = new RegExp(`(${this._escapeRegex(query)})`, this.options.caseSensitive ? 'g' : 'gi');
        return text.replace(regex, '<span class="dm-autocomplete-match">$1</span>');
    }

    _escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    _updateActive() {
        const items = this._list.querySelectorAll('.dm-autocomplete-item');
        items.forEach((item, index) => {
            if (index === this._activeIndex) {
                item.classList.add('active');
                item.setAttribute('aria-selected', 'true');
                // Scroll into view if needed
                item.scrollIntoView({block: 'nearest'});
            } else {
                item.classList.remove('active');
                item.setAttribute('aria-selected', 'false');
            }
        });

        // Update ARIA activedescendant
        if (this._activeIndex >= 0) {
            const activeItem = items[this._activeIndex];
            if (activeItem) {
                const id = activeItem.id || `autocomplete-item-${this._activeIndex}`;
                activeItem.id = id;
                this.element.setAttribute('aria-activedescendant', id);
            }
        } else {
            this.element.removeAttribute('aria-activedescendant');
        }
    }

    _selectItem(index) {
        const item = this._filteredData[index];
        if (!item) return;

        const value = typeof item === 'string' ? item : item.value || item.label || String(item);
        this.element.value = value;

        // Trigger onSelect callback
        if (this.options.onSelect) {
            this.options.onSelect(item, {target: this.element});
        }

        // Clear on select if option enabled
        if (this.options.clearOnSelect) {
            setTimeout(() => {
                this.element.value = '';
            }, 100);
        }

        this.close();
        this.element.focus();
    }

    _setLoading(loading) {
        this._loading = loading;
        if (loading) {
            this._loadingEl.style.display = 'block';
            this._list.style.display = 'none';
            this._emptyEl.style.display = 'none';
            this.open();
        } else {
            this._loadingEl.style.display = 'none';
        }
    }

    _updatePosition() {
        if (!this._isOpen || !this._dropdown) return;

        const inputRect = this.element.getBoundingClientRect();
        const dropdownHeight = this._dropdown.offsetHeight;
        const viewportHeight = window.innerHeight;

        let position = this.options.position;

        // Auto-detect position if set to 'auto'
        if (position === 'auto') {
            const spaceBelow = viewportHeight - inputRect.bottom;
            const spaceAbove = inputRect.top;

            position = spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove ? 'below' : 'above';
        }

        // Apply position
        if (position === 'above') {
            this._dropdown.style.top = 'auto';
            this._dropdown.style.bottom = '100%';
            this._dropdown.style.marginBottom = '4px';
            this._dropdown.style.marginTop = '0';
        } else {
            this._dropdown.style.top = '100%';
            this._dropdown.style.bottom = 'auto';
            this._dropdown.style.marginTop = '4px';
            this._dropdown.style.marginBottom = '0';
        }
    }

    // Public methods

    open() {
        if (this._isOpen) return this;

        this._isOpen = true;
        this._dropdown.style.display = 'block';
        this.element.setAttribute('aria-expanded', 'true');
        this._updatePosition();

        if (this.options.onOpen) {
            this.options.onOpen();
        }

        return this;
    }

    close() {
        if (!this._isOpen) return this;

        this._isOpen = false;
        this._dropdown.style.display = 'none';
        this.element.setAttribute('aria-expanded', 'false');
        this._activeIndex = -1;

        if (this.options.onClose) {
            this.options.onClose();
        }

        return this;
    }

    toggle() {
        return this._isOpen ? this.close() : this.open();
    }

    isOpen() {
        return this._isOpen;
    }

    setValue(value) {
        this.element.value = value;
        return this;
    }

    getValue() {
        return this.element.value;
    }

    setData(data) {
        this.options.data = data;
        return this;
    }

    refresh() {
        const value = this.element.value;
        if (value.length >= this.options.minChars) {
            this._filterData(value);
        }
        return this;
    }

    focus() {
        this.element.focus();
        return this;
    }

    clearValue() {
        this.element.value = '';
        this.close();
        return this;
    }

    destroy() {
        this.close();
        if (this._dropdown && this._dropdown.parentNode) {
            this._dropdown.parentNode.removeChild(this._dropdown);
        }
        if (this._debounceTimer) {
            clearTimeout(this._debounceTimer);
        }
        // Unsubscribe from model
        if (this._modelUnsubscribe) {
            this._modelUnsubscribe();
        }
        super.destroy();
    }
}

// ============================================
// Pillbox Component
// ============================================

class Pillbox extends Component {
    static defaults = {
        data: [],
        value: [],
        placeholder: 'Add items...',
        searchable: true,
        creatable: false,
        maxItems: null,
        duplicates: false,
        clearable: true,
        size: 'medium',
        renderPill: null,
        renderOption: null,
        pillTemplate: '<span>{label}</span>',
        validatePill: null,
        maxItemsMessage: 'Maximum {max} items allowed',
        duplicateMessage: 'Item already exists',
        noResultsMessage: 'No results found',
        onAdd: null,
        onRemove: null,
        onChange: null,
        onCreate: null,
        onMaxReached: null,
        onValidationError: null
    };

    constructor(selector, options = {}) {
        super(selector, options);
        this.model = options.model || null;
        this.modelKey = options.modelKey || null;
        this._pills = [];
        this._isOpen = false;
        this._activeIndex = -1;
        this._container = null;
        this._input = null;
        this._clearBtn = null;
        this._dropdown = null;
        this._optionsList = null;
        this._filteredData = [];
        this._init();

        // Subscribe to model changes
        if (this.model && typeof this.model.onChange === 'function') {
            this._modelUnsubscribe = this.model.onChange((field, newVal) => {
                if (field === this.modelKey && Array.isArray(newVal)) {
                    const currentVal = this.getValue();
                    // Only update if values differ (avoid infinite loops)
                    if (JSON.stringify(currentVal) !== JSON.stringify(newVal)) {
                        this.setValue(newVal);
                    }
                }
            });
        }
    }

    _init() {
        if (!this.element) return;

        // Ensure element is an input
        if (this.element.tagName !== 'INPUT') {
            console.error('Pillbox requires an input element');
            return;
        }

        // Hide original input (we'll create our own)
        this.element.style.display = 'none';

        // Create pillbox structure
        this._createStructure();

        // Initialize from value option
        if (this.options.value && this.options.value.length > 0) {
            this.options.value.forEach(val => {
                const item = this._findItemByValue(val);
                if (item) {
                    this._addPill(item.value, item.label);
                } else if (typeof val === 'string') {
                    this._addPill(val, val);
                }
            });
        }

        // Bind events
        this._bindEvents();

        // Set ARIA attributes
        this._input.setAttribute('role', 'combobox');
        this._input.setAttribute('aria-autocomplete', 'list');
        this._input.setAttribute('aria-expanded', 'false');
    }

    _createStructure() {
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = `dm-pillbox dm-pillbox-${this.options.size}`;

        // Create container for pills + input
        this._container = document.createElement('div');
        this._container.className = 'dm-pillbox-container';

        // Create input
        this._input = document.createElement('input');
        this._input.type = 'text';
        this._input.className = 'dm-pillbox-input';
        this._input.placeholder = this.options.placeholder;
        this._container.appendChild(this._input);

        wrapper.appendChild(this._container);

        // Create clear button
        if (this.options.clearable) {
            this._clearBtn = document.createElement('button');
            this._clearBtn.type = 'button';
            this._clearBtn.className = 'dm-pillbox-clear';
            this._clearBtn.innerHTML = '&times;';
            this._clearBtn.title = 'Clear all';
            this._clearBtn.style.display = 'none';
            wrapper.appendChild(this._clearBtn);
        }

        // Create dropdown (if searchable)
        if (this.options.searchable) {
            this._dropdown = document.createElement('div');
            this._dropdown.className = 'dm-pillbox-dropdown';
            this._dropdown.style.display = 'none';

            this._optionsList = document.createElement('ul');
            this._optionsList.className = 'dm-pillbox-options';
            this._dropdown.appendChild(this._optionsList);

            const emptyEl = document.createElement('div');
            emptyEl.className = 'dm-pillbox-empty';
            emptyEl.textContent = this.options.noResultsMessage;
            emptyEl.style.display = 'none';
            this._dropdown.appendChild(emptyEl);

            wrapper.appendChild(this._dropdown);
        }

        // Insert after original input
        this.element.parentNode.insertBefore(wrapper, this.element.nextSibling);
        this._wrapper = wrapper;
    }

    _bindEvents() {
        // Input events
        const inputHandler = this._handleInput.bind(this);
        const keydownHandler = this._handleKeydown.bind(this);
        const focusHandler = () => {
            if (this.options.searchable && this._input.value) {
                this._filterOptions(this._input.value);
            }
        };
        const blurHandler = () => {
            setTimeout(() => {
                if (!this._dropdown?.contains(document.activeElement)) {
                    this.close();
                }
            }, 200);
        };

        this._addEventListener(this._input, 'input', inputHandler);
        this._addEventListener(this._input, 'keydown', keydownHandler);
        this._addEventListener(this._input, 'focus', focusHandler);
        this._addEventListener(this._input, 'blur', blurHandler);

        // Clear button
        if (this._clearBtn) {
            this._addEventListener(this._clearBtn, 'click', () => {
                this.clear();
                this._input.focus();
            });
        }

        // Container click - focus input
        this._addEventListener(this._container, 'click', (e) => {
            if (e.target === this._container) {
                this._input.focus();
            }
        });
    }

    _handleInput(e) {
        const value = e.target.value;

        if (this.options.searchable && value) {
            this._filterOptions(value);
        } else {
            this.close();
        }
    }

    _handleKeydown(e) {
        const value = this._input.value;

        // Backspace on empty input - remove last pill
        if (e.key === 'Backspace' && !value && this._pills.length > 0) {
            e.preventDefault();
            const lastPill = this._container.querySelectorAll('.dm-pill')[this._pills.length - 1];
            this._removePill(lastPill);
            return;
        }

        // Enter - create new pill if creatable
        if (e.key === 'Enter' && value) {
            e.preventDefault();

            if (this._isOpen && this._activeIndex >= 0) {
                // Select from dropdown
                this._selectOption(this._activeIndex);
            } else if (this.options.creatable) {
                // Create new pill
                this._createPill(value);
            }
            return;
        }

        // Arrow navigation in dropdown
        if (this._isOpen) {
            const options = this._optionsList.querySelectorAll('.dm-pillbox-option');

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this._activeIndex = Math.min(this._activeIndex + 1, options.length - 1);
                    this._updateActive();
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    this._activeIndex = Math.max(this._activeIndex - 1, -1);
                    this._updateActive();
                    break;

                case 'Escape':
                    e.preventDefault();
                    this.close();
                    break;

                case 'Tab':
                    this.close();
                    break;
            }
        }
    }

    _filterOptions(query) {
        const queryLower = query.toLowerCase();

        // Filter available options (excluding already selected)
        const selectedValues = this._pills.map(p => p.value);
        this._filteredData = this.options.data.filter(item => {
            const itemValue = typeof item === 'string' ? item : item.value;
            const itemLabel = typeof item === 'string' ? item : item.label || item.value;

            // Exclude selected
            if (selectedValues.includes(itemValue)) {
                return false;
            }

            // Check disabled
            if (item.disabled) {
                return false;
            }

            // Filter by query
            return itemLabel.toLowerCase().includes(queryLower);
        });

        this._renderOptions();
    }

    _renderOptions() {
        this._optionsList.innerHTML = '';
        this._activeIndex = -1;

        const emptyEl = this._dropdown.querySelector('.dm-pillbox-empty');

        if (this._filteredData.length === 0) {
            emptyEl.style.display = 'block';
            this._optionsList.style.display = 'none';
            this.open();
            return;
        }

        emptyEl.style.display = 'none';
        this._optionsList.style.display = 'block';

        this._filteredData.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'dm-pillbox-option';
            li.setAttribute('data-index', index);

            if (this.options.renderOption) {
                const rendered = this.options.renderOption(item);
                li.innerHTML = typeof rendered === 'string' ? rendered : '';
                if (typeof rendered !== 'string') {
                    li.appendChild(rendered);
                }
            } else {
                const label = typeof item === 'string' ? item : item.label || item.value;
                li.textContent = label;
            }

            li.addEventListener('click', () => {
                this._selectOption(index);
            });

            li.addEventListener('mouseenter', () => {
                this._activeIndex = index;
                this._updateActive();
            });

            this._optionsList.appendChild(li);
        });

        this.open();
    }

    _updateActive() {
        const options = this._optionsList.querySelectorAll('.dm-pillbox-option');
        options.forEach((opt, index) => {
            if (index === this._activeIndex) {
                opt.classList.add('active');
                opt.scrollIntoView({block: 'nearest'});
            } else {
                opt.classList.remove('active');
            }
        });
    }

    _selectOption(index) {
        const item = this._filteredData[index];
        if (!item) return;

        const value = typeof item === 'string' ? item : item.value;
        const label = typeof item === 'string' ? item : item.label || item.value;

        this._addPill(value, label);
        this._input.value = '';
        this.close();
        this._input.focus();
    }

    _createPill(text) {
        if (!text.trim()) return;

        // Validate
        const error = this._validate(text);
        if (error) {
            if (this.options.onValidationError) {
                this.options.onValidationError(error, text);
            }
            return;
        }

        this._addPill(text, text);
        this._input.value = '';

        if (this.options.onCreate) {
            this.options.onCreate(text);
        }
    }

    _addPill(value, label) {
        // Validate
        const error = this._validate(value);
        if (error) {
            if (this.options.onValidationError) {
                this.options.onValidationError(error, value);
            }
            return;
        }

        // Create pill element
        const pill = document.createElement('div');
        pill.className = 'dm-pill';
        pill.setAttribute('data-value', value);

        if (this.options.renderPill) {
            const rendered = this.options.renderPill({value, label});
            pill.innerHTML = typeof rendered === 'string' ? rendered : '';
            if (typeof rendered !== 'string') {
                pill.appendChild(rendered);
            }
        } else {
            const template = this.options.pillTemplate.replace('{label}', label);
            pill.innerHTML = template;
        }

        // Add remove button
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'dm-pill-remove';
        removeBtn.innerHTML = '&times;';
        removeBtn.title = `Remove ${label}`;
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._removePill(pill);
        });
        pill.appendChild(removeBtn);

        // Insert before input
        this._container.insertBefore(pill, this._input);

        // Track internally
        this._pills.push({value, label, element: pill});

        // Update hidden input value
        this._updateHiddenInput();

        // Show clear button
        if (this._clearBtn) {
            this._clearBtn.style.display = 'block';
        }

        // Trigger onAdd
        if (this.options.onAdd) {
            this.options.onAdd(value, pill);
        }

        // Trigger onChange
        this._triggerChange();
    }

    _removePill(pillElement) {
        const value = pillElement.getAttribute('data-value');
        const index = this._pills.findIndex(p => p.value === value);

        if (index === -1) return;

        const pill = this._pills[index];

        // Remove from DOM
        pillElement.remove();

        // Remove from array
        this._pills.splice(index, 1);

        // Update hidden input
        this._updateHiddenInput();

        // Hide clear button if empty
        if (this._pills.length === 0 && this._clearBtn) {
            this._clearBtn.style.display = 'none';
        }

        // Trigger onRemove
        if (this.options.onRemove) {
            this.options.onRemove(value, pillElement);
        }

        // Trigger onChange
        this._triggerChange();
    }

    _validate(value) {
        // Check max items
        if (this.options.maxItems && this._pills.length >= this.options.maxItems) {
            if (this.options.onMaxReached) {
                this.options.onMaxReached();
            }
            return this.options.maxItemsMessage.replace('{max}', this.options.maxItems);
        }

        // Check duplicates
        if (!this.options.duplicates && this._pills.some(p => p.value === value)) {
            return this.options.duplicateMessage;
        }

        // Custom validation
        if (this.options.validatePill) {
            const result = this.options.validatePill(value);
            if (result !== true && result !== undefined) {
                return typeof result === 'string' ? result : 'Invalid value';
            }
        }

        return null;
    }

    _findItemByValue(value) {
        return this.options.data.find(item => {
            const itemValue = typeof item === 'string' ? item : item.value;
            return itemValue === value;
        });
    }

    _updateHiddenInput() {
        const values = this._pills.map(p => p.value);
        this.element.value = JSON.stringify(values);
    }

    _triggerChange() {
        const values = this.getValue();

        // Sync to model
        if (this.model && this.modelKey) {
            this.model.set(this.modelKey, values);
        }

        // Trigger onChange callback
        if (this.options.onChange) {
            this.options.onChange(values);
        }
    }

    // Public methods

    open() {
        if (!this._dropdown || this._isOpen) return this;

        this._isOpen = true;
        this._dropdown.style.display = 'block';
        this._input.setAttribute('aria-expanded', 'true');

        return this;
    }

    close() {
        if (!this._dropdown || !this._isOpen) return this;

        this._isOpen = false;
        this._dropdown.style.display = 'none';
        this._input.setAttribute('aria-expanded', 'false');
        this._activeIndex = -1;

        return this;
    }

    isOpen() {
        return this._isOpen;
    }

    getValue() {
        return this._pills.map(p => p.value);
    }

    setValue(values) {
        this.clear();

        if (Array.isArray(values)) {
            values.forEach(val => {
                const item = this._findItemByValue(val);
                if (item) {
                    const label = typeof item === 'string' ? item : item.label || item.value;
                    this._addPill(val, label);
                } else if (typeof val === 'string') {
                    this._addPill(val, val);
                }
            });
        }

        return this;
    }

    addPill(value, label) {
        label = label || value;
        this._addPill(value, label);
        return this;
    }

    removePill(value) {
        const pill = this._container.querySelector(`.dm-pill[data-value="${value}"]`);
        if (pill) {
            this._removePill(pill);
        }
        return this;
    }

    removePillAt(index) {
        if (index >= 0 && index < this._pills.length) {
            this._removePill(this._pills[index].element);
        }
        return this;
    }

    clear() {
        // Remove all pills
        [...this._pills].forEach(pill => {
            this._removePill(pill.element);
        });
        return this;
    }

    getCount() {
        return this._pills.length;
    }

    setData(data) {
        this.options.data = data;
        return this;
    }

    focus() {
        this._input.focus();
        return this;
    }

    enable() {
        this._input.disabled = false;
        this._wrapper.classList.remove('disabled');
        return this;
    }

    disable() {
        this._input.disabled = true;
        this._wrapper.classList.add('disabled');
        this.close();
        return this;
    }

    destroy() {
        this.close();
        if (this._wrapper && this._wrapper.parentNode) {
            this._wrapper.parentNode.removeChild(this._wrapper);
        }
        this.element.style.display = '';
        // Unsubscribe from model
        if (this._modelUnsubscribe) {
            this._modelUnsubscribe();
        }
        super.destroy();
    }
}

// ============================================
// Editor Component
// ============================================

/**
 * Universal Editor Component
 * Supports three modes: text, rich (WYSIWYG), and code
 * Features: Model integration, autosave, image paste, code blocks, embeds
 */

// ============================================
// Elements Module Export
// ============================================

export const elements = {
    _instances: new Map(),

    card(selector, options = {}) {
        const instance = new Card(selector, options);
        if (instance.element) {
            this._instances.set(instance.element, instance);
        }
        return instance;
    },

    modal(selectorOrOptions, options = {}) {
        // Detect factory mode: first arg is plain object (not string, not DOM element)
        if (typeof selectorOrOptions === 'object' &&
          !selectorOrOptions.nodeType &&
          typeof selectorOrOptions !== 'string') {
            return ModalFactory.createModal(selectorOrOptions);
        }

        // Traditional selector mode
        const instance = new Modal(selectorOrOptions, options);
        if (instance.element) {
            this._instances.set(instance.element, instance);
        }
        return instance;
    },

    tabs(selector, options = {}) {
        const instance = new Tabs(selector, options);
        if (instance.element) {
            this._instances.set(instance.element, instance);
        }
        return instance;
    },

    accordion(selector, options = {}) {
        const instance = new Accordion(selector, options);
        if (instance.element) {
            this._instances.set(instance.element, instance);
        }
        return instance;
    },

    tooltip(selector, options = {}) {
        // Support multiple elements
        const selectorElements = typeof selector === 'string'
            ? document.querySelectorAll(selector)
            : [selector];

        const instances = [];

        for (const el of selectorElements) {
            const instance = new Tooltip(el, options);
            this._instances.set(el, instance);
            instances.push(instance);
        }

        return instances.length === 1 ? instances[0] : instances;
    },

    badge(selector, options = {}) {
        // Support multiple elements
        const selectorElements = typeof selector === 'string'
            ? document.querySelectorAll(selector)
            : [selector];

        const instances = [];

        for (const el of selectorElements) {
            const instance = new Badge(el, options);
            this._instances.set(el, instance);
            instances.push(instance);
        }

        return instances.length === 1 ? instances[0] : instances;
    },

    dropdown(selector, options = {}) {
        const instance = new Dropdown(selector, options);
        if (instance.element) {
            this._instances.set(instance.element, instance);
        }
        return instance;
    },

    carousel(selector, options = {}) {
        const instance = new Carousel(selector, options);
        if (instance.element) {
            this._instances.set(instance.element, instance);
        }
        return instance;
    },

    backToTop(selector, options = {}) {
        const instance = new BackToTop(selector, options);
        this._instances.set('backToTop', instance);
        return instance;
    },

    buttonGroup(selector, options = {}) {
        // Support multiple elements
        const selectorElements = typeof selector === 'string'
            ? document.querySelectorAll(selector)
            : [selector];

        const instances = [];

        for (const el of selectorElements) {
            const instance = new ButtonGroup(el, options);
            this._instances.set(el, instance);
            instances.push(instance);
        }

        return instances.length === 1 ? instances[0] : instances;
    },

    loader(selector, options = {}) {
        const instance = new Loader(selector, options);
        if (instance.element) {
            this._instances.set(instance.element, instance);
        }
        return instance;
    },

    // Static loader methods for convenience
    showLoader: Loader.show.bind(Loader),
    hideLoader: Loader.hide.bind(Loader),
    fullscreenLoader: Loader.fullscreen.bind(Loader),

    breadcrumbs(selector, options = {}) {
        const instance = new Breadcrumbs(selector, options);
        if (instance.element) {
            this._instances.set(instance.element, instance);
        }
        return instance;
    },

    navbar(selector, options = {}) {
        const instance = new Navbar(selector, options);
        if (instance.element) {
            this._instances.set(instance.element, instance);
        }
        return instance;
    },

    notification(options = {}) {
        return new DesktopNotification(options);
    },

    // Convenience method for quick notifications
    notify(title, options = {}) {
        return DesktopNotification.notify(title, options);
    },

    timer(selector, options = {}) {
        const instance = new Timer(selector, options);
        // Only track in instances if attached to element
        if (instance.element) {
            this._instances.set(instance.element, instance);
        }
        return instance;
    },

    alarm(options = {}) {
        // Singleton - always returns same instance
        return new Alarm(options);
    },

    autocomplete(selector, options = {}) {
        const instance = new Autocomplete(selector, options);
        if (instance.element) {
            this._instances.set(instance.element, instance);
        }
        return instance;
    },

    pillbox(selector, options = {}) {
        const instance = new Pillbox(selector, options);
        if (instance.element) {
            this._instances.set(instance.element, instance);
        }
        return instance;
    },

    treeView(selector, options = {}) {
        const instance = new TreeView(selector, options);
        if (instance.element) {
            this._instances.set(instance.element, instance);
        }
        return instance;
    },

    // Toast wrapper - callable as function or use static methods
    toast: Object.assign(
        (message, options = {}) => Toast.show(message, options),
        {
            show: Toast.show.bind(Toast),
            success: Toast.success.bind(Toast),
            error: Toast.error.bind(Toast),
            warning: Toast.warning.bind(Toast),
            info: Toast.info.bind(Toast),
            closeAll: Toast.closeAll.bind(Toast)
        }
    ),

    dialog: Dialog,

    // Convenience shortcuts for dialog methods
    alert: Dialog.alert.bind(Dialog),
    confirm: Dialog.confirm.bind(Dialog),
    prompt: Dialog.prompt.bind(Dialog),

    // Modal factory methods
    createModal: ModalFactory.createModal.bind(ModalFactory),
    showModal: ModalFactory.showModal.bind(ModalFactory),

    // Note: themeRoller() and pageRoller() are in domma-tools.min.js
    // Load that bundle to enable: Domma.elements.themeRoller(), Domma.elements.pageRoller()

    get(selector) {
        const el = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;
        return this._instances.get(el);
    },

    destroy(selector) {
        const el = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;
        const instance = this._instances.get(el);
        if (instance) {
            instance.destroy();
            this._instances.delete(el);
        }
    },

    destroyAll() {
        for (const instance of this._instances.values()) {
            instance.destroy();
        }
        this._instances.clear();
    },

    // Component registry for custom components
    _registry: new Map(),

    register(name, ComponentClass) {
        this._registry.set(name, ComponentClass);
    },

    create(name, selector, options = {}) {
        const ComponentClass = this._registry.get(name);
        if (ComponentClass) {
            return new ComponentClass(selector, options);
        }
        throw new Error(`Unknown component: ${name}`);
    }
};

// Export component classes for direct access to static methods
export {DesktopNotification, TreeView};
