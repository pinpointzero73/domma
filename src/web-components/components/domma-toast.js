/**
 * Domma Toast Web Component
 * Notification messages with auto-dismiss
 */

import { DommaElement, getThemeVariables } from '../base/domma-element.js';

export class DommaToast extends DommaElement {
    static defaults = {
        message: '',
        title: '',
        type: 'default',
        position: 'top-right',
        duration: 3000,
        pauseOnHover: true,
        showProgress: true,
        animation: 'slide',
        animationDuration: 300,
        closable: true,
        html: false,
        icon: '',
        actions: [],
        visible: false
    };

    static get observedAttributes() {
        return ['message', 'title', 'type', 'position', 'duration', 'pause-on-hover',
                'show-progress', 'animation', 'animation-duration', 'closable', 'html', 'icon', 'visible'];
    }

    constructor() {
        super();
        this._progressBar = null;
        this._timeout = null;
        this._isPaused = false;
        this._remainingTime = 0;
        this._startTime = null;
        this._isVisible = false;
    }

    _injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            ${getThemeVariables()}

            :host {
                display: block;
                min-width: 300px;
                max-width: 500px;
                margin-bottom: 12px;
                opacity: 0;
                transform: translateX(100%);
                transition: opacity ${this._options.animationDuration}ms ease,
                            transform ${this._options.animationDuration}ms ease;
            }

            :host([hidden]) { display: none; }
            :host(.show) { opacity: 1; transform: translateX(0); }
            :host(.hiding) { opacity: 0; transform: translateX(100%); }

            .toast {
                position: relative;
                display: flex;
                align-items: flex-start;
                padding: 16px;
                background: var(--toast-bg);
                color: var(--toast-color);
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                overflow: hidden;
            }

            :host([type="default"]) { --toast-bg: #1f2937; --toast-color: #fff; --toast-accent: #6b7280; }
            :host([type="success"]) { --toast-bg: #065f46; --toast-color: #fff; --toast-accent: #10b981; }
            :host([type="error"]) { --toast-bg: #991b1b; --toast-color: #fff; --toast-accent: #ef4444; }
            :host([type="warning"]) { --toast-bg: #92400e; --toast-color: #fff; --toast-accent: #f59e0b; }
            :host([type="info"]) { --toast-bg: #1e40af; --toast-color: #fff; --toast-accent: #3b82f6; }

            .toast-icon { flex-shrink: 0; margin-right: 12px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
            .toast-icon svg { width: 20px; height: 20px; }
            .toast-content { flex: 1; min-width: 0; }
            .toast-title { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
            .toast-message { font-size: 14px; line-height: 1.4; }
            .toast-actions { display: flex; gap: 8px; margin-top: 8px; }
            .toast-close { flex-shrink: 0; margin-left: 12px; padding: 0; background: none; border: none; color: currentColor; cursor: pointer; opacity: 0.7; transition: opacity 0.15s ease; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
            .toast-close:hover { opacity: 1; }
            .toast-progress { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: rgba(255, 255, 255, 0.2); overflow: hidden; }
            .toast-progress-bar { height: 100%; background: var(--toast-accent); transition: width linear; }
        `;
        this.shadowRoot.appendChild(style);
    }

    _render() {
        const { message, title, closable, icon, showProgress } = this._options;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('part', 'toast');
        toast.setAttribute('role', 'alert');

        if (icon) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'toast-icon';
            iconWrapper.innerHTML = icon;
            toast.appendChild(iconWrapper);
        }

        const content = document.createElement('div');
        content.className = 'toast-content';

        if (title) {
            const titleEl = document.createElement('div');
            titleEl.className = 'toast-title';
            titleEl.textContent = title;
            content.appendChild(titleEl);
        }

        const messageEl = document.createElement('div');
        messageEl.className = 'toast-message';
        if (this._options.html) {
            messageEl.innerHTML = message;
        } else {
            messageEl.textContent = message;
        }
        content.appendChild(messageEl);

        if (this._options.actions && this._options.actions.length) {
            this._renderActions(content);
        }

        toast.appendChild(content);

        if (closable) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'toast-close';
            closeBtn.innerHTML = '&times;';
            this._addEventListener(closeBtn, 'click', () => this.close());
            toast.appendChild(closeBtn);
        }

        if (showProgress && this._options.duration > 0) {
            const progress = document.createElement('div');
            progress.className = 'toast-progress';
            this._progressBar = document.createElement('div');
            this._progressBar.className = 'toast-progress-bar';
            this._progressBar.style.width = '100%';
            progress.appendChild(this._progressBar);
            toast.appendChild(progress);
        }

        this.shadowRoot.appendChild(toast);
        this._toast = toast;
    }

    _renderActions(content) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'toast-actions';
        this._options.actions.forEach((action, index) => {
            const btn = document.createElement('button');
            btn.textContent = action.label;
            btn.style.cssText = `padding: 6px 12px; border: none; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; background: ${action.primary ? "var(--toast-accent)" : "rgba(255,255,255,0.2)"}; color: #fff;`;
            this._addEventListener(btn, 'click', () => {
                this._emit('action', { action, index });
                if (action.closeOnClick !== false) this.close();
            });
            actionsContainer.appendChild(btn);
        });
        content.appendChild(actionsContainer);
    }

    _bindEvents() {
        if (this._options.pauseOnHover) {
            this._addEventListener(this._toast, 'mouseenter', () => this._pause());
            this._addEventListener(this._toast, 'mouseleave', () => this._resume());
        }
    }

    _onAttributeChange(name, oldValue, newValue) {
        if (!this._toast) return;
        switch (name) {
            case 'message':
            case 'title':
            case 'icon':
                this.shadowRoot.innerHTML = '';
                this._injectStyles();
                this._render();
                this._bindEvents();
                break;
            case 'visible':
                const isVisible = newValue === '' || newValue === 'true';
                if (isVisible) this.show(); else this.close();
                break;
            case 'duration':
                this._options.duration = parseInt(newValue, 10);
                if (this._isVisible && this._options.duration > 0) this._startTimer();
                break;
        }
    }

    _onConnect() { if (this._options.visible) this.show(); }
    _onDisconnect() { this._clearTimer(); }

    show() {
        if (this._isVisible) return this;
        this._isVisible = true;
        this._remainingTime = this._options.duration;
        requestAnimationFrame(() => {
            this.classList.add('show');
            this.classList.remove('hiding');
        });
        if (this._options.duration > 0) this._startTimer();
        this._emit('show');
        return this;
    }

    close() {
        if (!this._isVisible) return this;
        this._clearTimer();
        this._isVisible = false;
        this.classList.add('hiding');
        this.classList.remove('show');
        setTimeout(() => {
            this._emit('close');
            this.remove();
        }, this._options.animationDuration);
        return this;
    }

    _startTimer() {
        this._clearTimer();
        if (this._options.duration <= 0) return;
        this._startTime = Date.now();
        this._timeout = setTimeout(() => this.close(), this._remainingTime);
        if (this._progressBar) {
            this._progressBar.style.transition = `width ${this._remainingTime}ms linear`;
            requestAnimationFrame(() => this._progressBar.style.width = '0%');
        }
    }

    _clearTimer() {
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
    }

    _pause() {
        if (this._isPaused || !this._timeout) return;
        this._isPaused = true;
        this._clearTimer();
        const elapsed = Date.now() - this._startTime;
        this._remainingTime = Math.max(0, this._remainingTime - elapsed);
        if (this._progressBar) {
            this._progressBar.style.transition = 'none';
            const currentWidth = parseFloat(getComputedStyle(this._progressBar).width);
            this._progressBar.style.width = currentWidth + 'px';
        }
        this._emit('pause');
    }

    _resume() {
        if (!this._isPaused) return;
        this._isPaused = false;
        this._startTimer();
        this._emit('resume');
    }

    setMessage(message) { this.setAttribute('message', message); return this; }
    setTitle(title) { this.setAttribute('title', title); return this; }
    setType(type) { this.setAttribute('type', type); return this; }
    setActions(actions) {
        this._options.actions = actions;
        const content = this._toast.querySelector('.toast-content');
        const existingActions = content.querySelector('.toast-actions');
        if (existingActions) existingActions.remove();
        if (actions && actions.length) this._renderActions(content);
        return this;
    }
    isVisible() { return this._isVisible; }
}

if (!customElements.get('domma-toast')) {
    customElements.define('domma-toast', DommaToast);
}
