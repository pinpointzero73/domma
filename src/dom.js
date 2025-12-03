import { utils } from './utils.js';

class DommaCollection {
    constructor(selector) {
        if (typeof selector === 'string') {
            this.elements = Array.from(document.querySelectorAll(selector));
        } else if (selector instanceof HTMLElement) {
            this.elements = [selector];
        } else if (selector instanceof NodeList) {
            this.elements = Array.from(selector);
        } else {
            this.elements = [];
        }
    }

    each(callback) {
        utils.each(this.elements, callback);
        return this;
    }

    html(content) {
        if (content === undefined) {
            return this.elements[0] ? this.elements[0].innerHTML : '';
        }
        return this.each(el => el.innerHTML = content);
    }

    text(content) {
        if (content === undefined) {
            return this.elements[0] ? this.elements[0].textContent : '';
        }
        return this.each(el => el.textContent = content);
    }

    css(property, value) {
        if (typeof property === 'object') {
            return this.each(el => {
                utils.each(property, (val, prop) => {
                    el.style[prop] = val;
                });
            });
        }
        if (value === undefined) {
            return this.elements[0] ? getComputedStyle(this.elements[0])[property] : '';
        }
        return this.each(el => el.style[property] = value);
    }

    addClass(className) {
        return this.each(el => el.classList.add(...className.split(' ')));
    }

    removeClass(className) {
        return this.each(el => el.classList.remove(...className.split(' ')));
    }

    on(event, handler) {
        return this.each(el => el.addEventListener(event, handler));
    }

    off(event, handler) {
        return this.each(el => el.removeEventListener(event, handler));
    }

    click(handler) {
        return this.on('click', handler);
    }

    dblclick(handler) {
        return this.on('dblclick', handler);
    }
}

export const dom = (selector) => new DommaCollection(selector);
