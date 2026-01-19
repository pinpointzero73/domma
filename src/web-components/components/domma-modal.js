/**
 * Domma Modal Web Component
 * Dialog/modal with backdrop, animations, and keyboard support
 */

import { DommaElement, getThemeVariables } from '../base/domma-element.js';

export class DommaModal extends DommaElement {
    static defaults = {
        backdrop: true,
        backdropClose: true,
        keyboard: true,
        animation: 'fade',          // 'fade', 'slide', 'zoom'
        animationDuration: 300,
        closeButton: true,
        size: 'medium',             // 'small', 'medium', 'large', 'xl'
        centered: true,
        scrollable: false,
        title: '',
        content: '',
        footer: '',
        buttons: [],                // [{id, text, variant, close}]
        className: '',
        headerClass: '',
            bodyClass: '',
        footerClass: '',
        visible: false
    };

    static get observedAttributes() {
        return ['visible', 'backdrop', 'backdrop-close', 'keyboard', 'animation', 
                'animation-duration', 'close-button', 'size', 'centered', 'scrollable',
                'title', 'content', 'footer', 'class-name'];
    }

    constructor() {
        super();
        this._backdrop = null;
        this._isOpen = false;
        this._keyHandler = null;
        this._dialog = null;
    }

    _injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            ${getThemeVariables()}

            :host {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1050;
                align-items: center;
                justify-content: center;
            }

            :host([visible]) {
                display: flex;
            }

            .modal-dialog {
                background: var(--dm-surface, #fff);
                border-radius: 8px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: 90%;
                max-height: 90vh;
                overflow: hidden;
                position: relative;
                opacity: 0;
                transform: scale(0.95) translateY(-10px);
                transition: opacity var(--animation-duration, 300ms) ease,
                           transform var(--animation-duration, 300ms) ease;
            }

            :host(.show) .modal-dialog {
                opacity: 1;
                transform: scale(1) translateY(0);
            }

            :host([size="small"]) .modal-dialog { max-width: 400px; }
            :host([size="medium"]) .modal-dialog { max-width: 600px; }
            :host([size="large"]) .modal-dialog { max-width: 800px; }
            :host([size="xl"]) .modal-dialog { max-width: 1000px; }

            :host([animation="zoom"]) .modal-dialog {
                transform: scale(0.7);
            }

            :host([animation="zoom"].show) .modal-dialog {
                transform: scale(1);
            }

            :host([animation="slide"]) .modal-dialog {
                transform: translateY(-50px);
            }

            :host([animation="slide"].show) .modal-dialog {
                transform: translateY(0);
            }

            .modal-content {
                display: flex;
                flex-direction: column;
            }

            .modal-header {
                position: relative;
                padding: 1.5rem 1.5rem 1rem;
                border-bottom: 1px solid var(--dm-border, #e5e7eb);
            }

            .modal-title {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--dm-text, #212529);
            }

            .modal-close {
                position: absolute;
                right: 1rem;
                top: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--dm-text-muted, #6b7280);
                line-height: 1;
                padding: 0;
                width: 2rem;
                height: 2rem;
                transition: color 0.15s ease;
            }

            .modal-close:hover {
                color: var(--dm-text, #212529);
            }

            .modal-body {
                padding: 1.5rem;
                color: var(--dm-text, #212529);
            }

            .modal-body-scrollable {
                max-height: 60vh;
                overflow-y: auto;
            }

            .modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 0.5rem;
                padding: 1rem 1.5rem;
                border-top: 1px solid var(--dm-border, #e5e7eb);
                background: var(--dm-surface-subtle, #f9fafb);
            }

            .modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: -1;
                opacity: 0;
                transition: opacity var(--animation-duration, 300ms) ease;
            }

            :host(.show) .modal-backdrop {
                opacity: 1;
            }

            /* Button styles */
            button:not(.modal-close) {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 4px;
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.15s ease;
            }

            .btn-primary {
                background: var(--dm-primary, #6495ED);
                color: white;
            }

            .btn-primary:hover {
                background: var(--dm-primary-dark, #4169E1);
            }

            .btn-secondary {
                background: var(--dm-secondary, #6c757d);
                color: white;
            }

            .btn-secondary:hover {
                background: var(--dm-secondary-dark, #5a6268);
            }

            .btn-success {
                background: var(--dm-success, #28a745);
                color: white;
            }

            .btn-success:hover {
                background: var(--dm-success-dark, #218838);
            }

            .btn-danger {
                background: var(--dm-danger, #dc3545);
                color: white;
            }

            .btn-danger:hover {
                background: var(--dm-danger-dark, #c82333);
            }
        `;
        this.shadowRoot.appendChild(style);
    }

    _render() {
        const { title, content, footer, closeButton, buttons, headerClass, bodyClass, footerClass, scrollable, backdrop } = this._options;

        // Create backdrop
        if (backdrop) {
            this._backdrop = document.createElement('div');
            this._backdrop.className = 'modal-backdrop';
            this.shadowRoot.appendChild(this._backdrop);
        }

        // Create dialog
        this._dialog = document.createElement('div');
        this._dialog.className = 'modal-dialog';
        this._dialog.setAttribute('part', 'dialog');
        this._dialog.setAttribute('role', 'dialog');
        this._dialog.setAttribute('aria-modal', 'true');

        const contentDiv = document.createElement('div');
        contentDiv.className = 'modal-content';

        // Header
        if (title || closeButton) {
            const header = document.createElement('div');
            header.className = `modal-header${headerClass ? ' ' + headerClass : ''}`;
            header.setAttribute('part', 'header');

            if (title) {
                const titleEl = document.createElement('h3');
                titleEl.className = 'modal-title';
                titleEl.textContent = title;
                header.appendChild(titleEl);
            }

            if (closeButton) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'modal-close';
                closeBtn.setAttribute('part', 'close');
                closeBtn.setAttribute('aria-label', 'Close');
                closeBtn.innerHTML = '&times;';
                this._addEventListener(closeBtn, 'click', () => this.close());
                header.appendChild(closeBtn);
            }

            contentDiv.appendChild(header);
        }

        // Body
        const body = document.createElement('div');
        body.className = `modal-body${bodyClass ? ' ' + bodyClass : ''}${scrollable ? ' modal-body-scrollable' : ''}`;
        body.setAttribute('part', 'body');
        
        // Check if content is from slot or provided option
        const slot = document.createElement('slot');
        if (content) {
            body.textContent = content;
        } else {
            body.appendChild(slot);
        }
        
        contentDiv.appendChild(body);

        // Footer
        if (buttons && buttons.length > 0) {
            this._renderFooter(contentDiv, buttons, footerClass);
        } else if (footer) {
            const footerEl = document.createElement('div');
            footerEl.className = `modal-footer${footerClass ? ' ' + footerClass : ''}`;
            footerEl.setAttribute('part', 'footer');
            footerEl.textContent = footer;
            contentDiv.appendChild(footerEl);
        }

        this._dialog.appendChild(contentDiv);
        this.shadowRoot.appendChild(this._dialog);
    }

    _renderFooter(parentEl, buttons, footerClass) {
        const footer = document.createElement('div');
        footer.className = `modal-footer${footerClass ? ' ' + footerClass : ''}`;
        footer.setAttribute('part', 'footer');

        buttons.forEach((btn, index) => {
            const button = document.createElement('button');
            button.className = `btn btn-${btn.variant || 'secondary'}`;
            button.textContent = btn.text || 'Button';
            button.setAttribute('data-button-id', btn.id || `btn-${index}`);
            
            this._addEventListener(button, 'click', () => {
                this._emit('buttonclick', { 
                    buttonId: btn.id || `btn-${index}`,
                    button: btn 
                });
                
                if (btn.close !== false) {
                    this.close();
                }
            });

            footer.appendChild(button);
        });

        parentEl.appendChild(footer);
    }

    _bindEvents() {
        // Keyboard handler (ESC key)
        if (this._options.keyboard) {
            this._keyHandler = (e) => {
                if (e.key === 'Escape' && this._isOpen) {
                    this.close();
                }
            };
            document.addEventListener('keydown', this._keyHandler);
        }

        // Backdrop click
        if (this._backdrop && this._options.backdropClose) {
            this._addEventListener(this, 'click', (e) => {
                if (e.target === this) {
                    this.close();
                }
            });
        }
    }

    _onAttributeChange(name, oldValue, newValue) {
        if (!this._dialog) return;

        switch (name) {
            case 'visible':
                const isVisible = newValue === '' || newValue === 'true';
                if (isVisible) {
                    this.open();
                } else {
                    this.close();
                }
                break;

            case 'title':
            case 'content':
            case 'footer':
            case 'close-button':
                // Full re-render needed
                this.shadowRoot.innerHTML = '';
                this._injectStyles();
                this._render();
                this._bindEvents();
                break;

            case 'size':
            case 'animation':
            case 'centered':
            case 'scrollable':
                // These are handled via attributes/CSS
                break;
        }
    }

    _onConnect() {
        if (this._options.visible) {
            this.open();
        }
    }

    _onDisconnect() {
        if (this._keyHandler) {
            document.removeEventListener('keydown', this._keyHandler);
        }
    }

    // Public API
    open() {
        if (this._isOpen) return this;

        this._isOpen = true;
        this.setAttribute('visible', '');
        
        this._emit('open');

        // Trigger animation
        requestAnimationFrame(() => {
            this.classList.add('show');
        });

        // Call opened callback after animation
        setTimeout(() => {
            this._emit('opened');
        }, this._options.animationDuration);

        return this;
    }

    close() {
        if (!this._isOpen) return this;

        this._emit('close');

        // Trigger close animation
        this.classList.remove('show');

        setTimeout(() => {
            this._isOpen = false;
            this.removeAttribute('visible');
            this._emit('closed');
        }, this._options.animationDuration);

        return this;
    }

    toggle() {
        return this._isOpen ? this.close() : this.open();
    }

    isOpen() {
        return this._isOpen;
    }

    setTitle(title) {
        this.setAttribute('title', title);
        return this;
    }

    setContent(content) {
        const body = this._dialog.querySelector('.modal-body');
        if (body) {
            body.textContent = content;
        }
        return this;
    }

    setButtons(buttons) {
        this._options.buttons = buttons;
        const contentDiv = this._dialog.querySelector('.modal-content');
        const existingFooter = contentDiv.querySelector('.modal-footer');
        if (existingFooter) existingFooter.remove();
        if (buttons && buttons.length > 0) {
            this._renderFooter(contentDiv, buttons, this._options.footerClass);
        }
        return this;
    }
}

if (!customElements.get('domma-modal')) {
    customElements.define('domma-modal', DommaModal);
}
