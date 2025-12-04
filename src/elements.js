/**
 * Domma Elements Module
 * UI Components: Cards, Modals, Tabs, Accordions, Tooltips
 */

// ============================================
// Base Component Class
// ============================================

class Component {
    constructor(selector, options = {}) {
        this.element = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;
        this.options = {...this.constructor.defaults, ...options};
        this._eventHandlers = [];

        if (this.element) {
            this.element._dommaComponent = this;
        }
    }

    on(event, handler) {
        if (this.options[event] && typeof this.options[event] === 'function') {
            this.options[event](handler);
        }
    }

    /**
     * Update component options at runtime
     * @param {Object} newOptions - New options to merge
     * @returns {this} The component instance for chaining
     */
    setOptions(newOptions) {
        this.options = {...this.options, ...newOptions};

        // Call _applyOptions if the subclass implements it
        if (typeof this._applyOptions === 'function') {
            this._applyOptions();
        }

        return this;
    }

    _addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this._eventHandlers.push({element, event, handler});
    }

    destroy() {
        for (const {element, event, handler} of this._eventHandlers) {
            element.removeEventListener(event, handler);
        }
        this._eventHandlers = [];
        if (this.element) {
            delete this.element._dommaComponent;
        }
    }
}

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
        onClosed: null
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

        // Initial hidden state
        el.style.display = 'none';
        el.style.position = 'fixed';
        el.style.top = '50%';
        el.style.left = '50%';
        el.style.transform = 'translate(-50%, -50%)';
        el.style.zIndex = '1001';
        el.style.opacity = '0';
        el.style.transition = `opacity ${opts.animationDuration}ms ease, transform ${opts.animationDuration}ms ease`;

        // Keyboard handler
        if (opts.keyboard) {
            this._keyHandler = (e) => {
                if (e.key === 'Escape' && this._isOpen) {
                    this.close();
                }
            };
            document.addEventListener('keydown', this._keyHandler);
        }

        // Close button
        if (opts.closeButton) {
            const closeBtn = el.querySelector('[data-close], .modal-close, .close');
            if (closeBtn) {
                this._addEventListener(closeBtn, 'click', () => this.close());
            }
        }
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
}

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
        contentSelector: '.accordion-body, .accordion-content, [data-accordion-content]',
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

            if (!shouldBeActive) {
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
                this._tooltip.style.opacity = '0';

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
        this._tooltip.style.cssText = `
            position: absolute;
            z-index: 10000;
            padding: 6px 12px;
            background: #333;
            color: #fff;
            font-size: 14px;
            border-radius: 4px;
            pointer-events: none;
            opacity: 0;
            transition: opacity ${opts.animationDuration}ms ease;
            white-space: nowrap;
        `;

        if (opts.html) {
            this._tooltip.innerHTML = opts.content;
        } else {
            this._tooltip.textContent = opts.content;
        }

        const container = opts.container || document.body;
        container.appendChild(this._tooltip);

        // Trigger animation
        this._tooltip.offsetHeight;
        this._tooltip.style.opacity = '1';

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
        removeBtn.style.cssText = `
            cursor: pointer;
            font-size: 1.2em;
            line-height: 1;
            opacity: 0.7;
            margin-left: 2px;
        `;

        this._addEventListener(removeBtn, 'mouseenter', () => {
            removeBtn.style.opacity = '1';
        });

        this._addEventListener(removeBtn, 'mouseleave', () => {
            removeBtn.style.opacity = '0.7';
        });

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
            this._menu.style.opacity = '0';
            this._menu.style.transform = 'translateY(-4px)';

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
        this._menu.style.cssText = `
            position: absolute;
            z-index: 10000;
            min-width: 160px;
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            opacity: 0;
            transform: translateY(-4px);
            transition: opacity ${opts.animationDuration}ms ease, transform ${opts.animationDuration}ms ease;
        `;

        this._renderMenu();

        document.body.appendChild(this._menu);

        // Trigger animation
        this._menu.offsetHeight;
        this._menu.style.opacity = '1';
        this._menu.style.transform = 'translateY(0)';
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
                menuItem.style.cssText = 'height: 1px; background: #e5e7eb; margin: 4px 0;';
                this._menu.appendChild(menuItem);
                return;
            } else if (item.header) {
                menuItem.textContent = item.header;
                menuItem.style.cssText = `
                    padding: 8px 12px;
                    font-size: 11px;
                    font-weight: 600;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                `;
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
                    menuItem.style.opacity = '0.5';
                    menuItem.style.pointerEvents = 'none';
                }

                if (item.icon) {
                    menuItem.innerHTML = `<span style="margin-right: 8px;">${item.icon}</span>` + menuItem.innerHTML;
                }
            }

            menuItem.style.cssText += `
                padding: 8px 12px;
                cursor: pointer;
                font-size: 14px;
                color: #374151;
                transition: background 100ms ease;
            `;

            this._addEventListener(menuItem, 'mouseenter', () => {
                menuItem.style.background = '#f3f4f6';
            });

            this._addEventListener(menuItem, 'mouseleave', () => {
                menuItem.style.background = 'transparent';
            });

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

            const posStyles = {
                'top-left': 'top: 16px; left: 16px;',
                'top-right': 'top: 16px; right: 16px;',
                'top-center': 'top: 16px; left: 50%; transform: translateX(-50%);',
                'bottom-left': 'bottom: 16px; left: 16px;',
                'bottom-right': 'bottom: 16px; right: 16px;',
                'bottom-center': 'bottom: 16px; left: 50%; transform: translateX(-50%);'
            };

            container.style.cssText = `
                position: fixed;
                z-index: 99999;
                display: flex;
                flex-direction: column;
                gap: 8px;
                pointer-events: none;
                ${posStyles[position] || posStyles['top-right']}
            `;

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
        const typeStyle = ToastInstance.typeStyles[opts.type] || ToastInstance.typeStyles.default;

        this._element = document.createElement('div');
        this._element.className = 'domma-toast';
        this._element.style.cssText = `
            display: flex;
            align-items: flex-start;
            gap: 12px;
            min-width: 280px;
            max-width: 420px;
            padding: 14px 16px;
            background: ${typeStyle.bg};
            color: ${typeStyle.color};
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            font-size: 14px;
            line-height: 1.4;
            pointer-events: auto;
            position: relative;
            overflow: hidden;
            opacity: 0;
            transform: translateX(${opts.position.includes('right') ? '100%' : opts.position.includes('left') ? '-100%' : '0'})
                       translateY(${opts.position.includes('bottom') ? '20px' : opts.position.includes('top') ? '-20px' : '0'});
            transition: opacity ${opts.animationDuration}ms ease, transform ${opts.animationDuration}ms ease;
        `;

        // Icon
        if (opts.icon) {
            const iconWrapper = document.createElement('div');
            iconWrapper.style.cssText = `flex-shrink: 0; color: ${typeStyle.accent};`;
            iconWrapper.innerHTML = opts.icon;
            this._element.appendChild(iconWrapper);
        }

        // Content
        const content = document.createElement('div');
        content.style.cssText = 'flex: 1;';

        if (opts.title) {
            const title = document.createElement('div');
            title.style.cssText = 'font-weight: 600; margin-bottom: 4px;';
            title.textContent = opts.title;
            content.appendChild(title);
        }

        const messageEl = document.createElement('div');
        if (opts.html) {
            messageEl.innerHTML = message;
        } else {
            messageEl.textContent = message;
        }
        content.appendChild(messageEl);

        // Action buttons
        if (opts.actions && opts.actions.length) {
            const actions = document.createElement('div');
            actions.style.cssText = 'display: flex; gap: 8px; margin-top: 12px;';

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
        this._element.style.opacity = '1';
        this._element.style.transform = 'translateX(0) translateY(0)';
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

        this._element.style.opacity = '0';
        this._element.style.transform = `translateX(${opts.position.includes('right') ? '100%' : opts.position.includes('left') ? '-100%' : '0'})`;

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

    modal(selector, options = {}) {
        const instance = new Modal(selector, options);
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

    toast: Toast,

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
