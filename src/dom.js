import sanitiseModule from './sanitize.js';

// DOMPurify parses as if into <body>, where a lone <tr> or <td> is dropped. Into one of
// these elements the markup is sanitised inside the same table context, then unwrapped.
const TABLE_CONTEXT = {
    TABLE: ['<table>', '</table>', ''],
    THEAD: ['<table><thead>', '</thead></table>', ':scope > thead'],
    TBODY: ['<table><tbody>', '</tbody></table>', ':scope > tbody'],
    TFOOT: ['<table><tfoot>', '</tfoot></table>', ':scope > tfoot'],
    TR: ['<table><tbody><tr>', '</tr></tbody></table>', ':scope > tbody > tr'],
    COLGROUP: ['<table><colgroup>', '</colgroup></table>', ':scope > colgroup']
};

/**
 * Sanitise `content` for `el`, keeping table rows and cells meant for a table part.
 * Anything that is not table markup (text, a <div>) would be moved out in front of the
 * wrapper by the parser, so then the plain sanitised string is used, as before.
 */
function sanitiseFor(el, content, options) {
    const plain = () => sanitiseModule.sanitise(content, options);
    const context = TABLE_CONTEXT[el.tagName];
    if (!context || !sanitiseModule.hasDOMPurify() || content == null || content === '') return plain();
    const [open, close, path] = context;
    const template = document.createElement('template');
    template.innerHTML = sanitiseModule.sanitise(open + String(content) + close, options);
    const nodes = template.content.childNodes;
    const table = nodes.length === 1 ? nodes[0] : null;
    if (!table || table.nodeName !== 'TABLE') return plain();
    const part = path ? table.querySelector(path) : table;
    return part ? part.innerHTML : plain();
}

/**
 * Document coordinates of an element (`offset()`).
 * @typedef {object} Offset
 * @property {number} top
 * @property {number} left
 */

/**
 * Coordinates of an element relative to its offset parent (`position()`).
 * @typedef {object} Position
 * @property {number} top
 * @property {number} left
 */

/**
 * CSS properties to animate; numbers are pixels.
 * @typedef {{[property: string]: string | number}} AnimationProperties
 */

/**
 * Animation length in ms, or `'fast'` (200) / `'slow'` (600); anything else is 400.
 * @typedef {number | 'fast' | 'slow'} Duration
 */

/**
 * @typedef {(this: HTMLElement, index: number, element: HTMLElement) => boolean} FilterFunction
 */

/**
 * Returns the class name(s) to add/remove, space-separated.
 * @typedef {(this: HTMLElement, index: number, currentClass: string) => string} ClassFunction
 */

/**
 * Returns the content to insert into one target; receives that target's current inner HTML.
 * @typedef {(this: HTMLElement, index: number, currentContent: string) => string | HTMLElement | DommaCollection} ContentFunction
 */

/**
 * Returns the wrapper for one element.
 * @typedef {(this: HTMLElement, index: number) => string | HTMLElement | DommaCollection} WrapperFunction
 */

/**
 * Returns the new width/height of one element; receives its current one.
 * @typedef {(this: HTMLElement, index: number, currentValue: number) => number | string} ValueFunction
 */

/**
 * An event handler; `this` is the element (the matched descendant for a delegated handler).
 * @template {Event} [E=Event]
 * @typedef {(this: HTMLElement, event: E) => void} EventHandler
 */

/**
 * What `$()` accepts: a CSS selector or an HTML string (`'<li>One</li>'`), a node, a NodeList or
 * HTMLCollection, an array (only its HTMLElements are kept) or another collection.
 * @typedef {string | Node | NodeList | HTMLCollection | Element[] | DommaCollection} DommaSelector
 */

/**
 * Sanitisation options for `html()`.
 * @typedef {object} DommaHtmlOptions
 * @property {boolean} [safe=true] - Sanitise content (true = safe, false = raw - TRUSTED content only)
 * @property {'default'|'strict'|'basic'} [preset='default'] - Sanitiser preset
 * @property {string[]} [allowedTags] - Custom allowed HTML tags (overrides the preset)
 * @property {string[]} [allowedAttrs] - Custom allowed attributes (overrides the preset)
 * @property {boolean} [allowDataAttrs] - Allow data-* attributes
 */

/**
 * jQuery-compatible chainable DOM collection - what `$()` returns.
 * Elements are also reachable by index (`$('li')[0]`, same as `get(0)`).
 */
export class DommaCollection {
    /**
     * @param {DommaSelector} [selector] - CSS selector, HTML string, element(s) or a collection
     * @param {Document | Element | DocumentFragment} [context] - Where to look for a CSS selector (default: document)
     */
    constructor(selector, context) {
        if (typeof selector === 'string') {
            if (selector.trim().startsWith('<')) {
                // HTML string - create elements
                const temp = document.createElement('div');
                temp.innerHTML = selector.trim();
                /**
                 * The matched elements.
                 * @type {HTMLElement[]}
                 */
                this.elements = Array.from(temp.children);
            } else {
                // CSS selector
                const ctx = context || document;
                this.elements = Array.from(ctx.querySelectorAll(selector));
            }
        } else if (selector instanceof Node) {
            // Handles HTMLElement, Document, Window, and all other Node types
            this.elements = [selector];
        } else if (selector instanceof NodeList || selector instanceof HTMLCollection) {
            this.elements = Array.from(selector);
        } else if (Array.isArray(selector)) {
            this.elements = selector.filter(el => el instanceof HTMLElement);
        } else if (selector instanceof DommaCollection) {
            this.elements = [...selector.elements];
        } else {
            this.elements = [];
        }
        /**
         * Number of matched elements.
         * @type {number}
         */
        this.length = this.elements.length;

        // Numeric index properties, so `$('#el')[0]` works the way it does in
        // jQuery - and the way this project's own DOM showcase documents it
        // ("$('.items')[0]  // Same as get(0)"). Without them `[0]` was
        // `undefined`, which is silent until something dereferences it: the
        // dot-notation showcase did exactly that and died on `.tagName`.
        //
        // Safe to do here and only here: the constructor is the sole place
        // `this.elements` is ever assigned, and no method mutates it in place,
        // so the indices cannot drift out of step with the array. Assigning
        // them also makes the collection array-LIKE, so `Array.from($('.x'))`
        // and spread both work.
        for (let i = 0; i < this.elements.length; i++) {
            this[i] = this.elements[i];
        }
    }

    // ============================================
    // Traversal Methods
    // ============================================

    /**
     * Get descendants matching selector.
     * @param {string} selector
     * @returns {DommaCollection}
     */
    find(selector) {
        const found = [];
        this.elements.forEach(el => {
            found.push(...el.querySelectorAll(selector));
        });
        return new DommaCollection(found);
    }

    /**
     * Get immediate children, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    children(selector) {
        const children = [];
        this.elements.forEach(el => {
            children.push(...el.children);
        });
        if (selector) {
            return new DommaCollection(children.filter(el => el.matches(selector)));
        }
        return new DommaCollection(children);
    }

    /**
     * Get parent of each element, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    parent(selector) {
        const parents = [];
        this.elements.forEach(el => {
            if (el.parentElement) {
                if (!selector || el.parentElement.matches(selector)) {
                    if (!parents.includes(el.parentElement)) {
                        parents.push(el.parentElement);
                    }
                }
            }
        });
        return new DommaCollection(parents);
    }

    /**
     * Get all ancestors, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    parents(selector) {
        const ancestors = [];
        this.elements.forEach(el => {
            let parent = el.parentElement;
            while (parent) {
                if (!selector || parent.matches(selector)) {
                    if (!ancestors.includes(parent)) {
                        ancestors.push(parent);
                    }
                }
                parent = parent.parentElement;
            }
        });
        return new DommaCollection(ancestors);
    }

    /**
     * Get closest ancestor matching selector.
     * @param {string} selector
     * @returns {DommaCollection}
     */
    closest(selector) {
        const closest = [];
        this.elements.forEach(el => {
            const match = el.closest(selector);
            if (match && !closest.includes(match)) {
                closest.push(match);
            }
        });
        return new DommaCollection(closest);
    }

    /**
     * Get siblings, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    siblings(selector) {
        const sibs = [];
        this.elements.forEach(el => {
            if (el.parentElement) {
                Array.from(el.parentElement.children).forEach(child => {
                    if (child !== el && !sibs.includes(child)) {
                        if (!selector || child.matches(selector)) {
                            sibs.push(child);
                        }
                    }
                });
            }
        });
        return new DommaCollection(sibs);
    }

    /**
     * Get next sibling, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    next(selector) {
        const nexts = [];
        this.elements.forEach(el => {
            let sibling = el.nextElementSibling;
            if (sibling) {
                if (!selector || sibling.matches(selector)) {
                    nexts.push(sibling);
                }
            }
        });
        return new DommaCollection(nexts);
    }

    /**
     * Get all following siblings, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    nextAll(selector) {
        const nexts = [];
        this.elements.forEach(el => {
            let sibling = el.nextElementSibling;
            while (sibling) {
                if (!selector || sibling.matches(selector)) {
                    if (!nexts.includes(sibling)) {
                        nexts.push(sibling);
                    }
                }
                sibling = sibling.nextElementSibling;
            }
        });
        return new DommaCollection(nexts);
    }

    /**
     * Get previous sibling, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    prev(selector) {
        const prevs = [];
        this.elements.forEach(el => {
            let sibling = el.previousElementSibling;
            if (sibling) {
                if (!selector || sibling.matches(selector)) {
                    prevs.push(sibling);
                }
            }
        });
        return new DommaCollection(prevs);
    }

    /**
     * Get all preceding siblings, optionally filtered by selector.
     * @param {string} [selector]
     * @returns {DommaCollection}
     */
    prevAll(selector) {
        const prevs = [];
        this.elements.forEach(el => {
            let sibling = el.previousElementSibling;
            while (sibling) {
                if (!selector || sibling.matches(selector)) {
                    if (!prevs.includes(sibling)) {
                        prevs.unshift(sibling);
                    }
                }
                sibling = sibling.previousElementSibling;
            }
        });
        return new DommaCollection(prevs);
    }

    /**
     * Get first element in collection.
     * @returns {DommaCollection}
     */
    first() {
        return new DommaCollection(this.elements[0] ? [this.elements[0]] : []);
    }

    /**
     * Get last element in collection.
     * @returns {DommaCollection}
     */
    last() {
        return new DommaCollection(this.elements.length ? [this.elements[this.elements.length - 1]] : []);
    }

    /**
     * Get element at index.
     * @param {number} index
     * @returns {DommaCollection}
     */
    eq(index) {
        const idx = index < 0 ? this.elements.length + index : index;
        return new DommaCollection(this.elements[idx] ? [this.elements[idx]] : []);
    }

    /**
     * Get every element as an array.
     * @overload
     * @returns {HTMLElement[]}
     */
    /**
     * Get the raw element at index (negative counts from the end).
     * @overload
     * @param {number} index
     * @returns {HTMLElement|undefined}
     */
    /**
     * Get raw element at index, or every element when no index is given.
     * @param {number} [index]
     * @returns {HTMLElement|HTMLElement[]|undefined}
     */
    get(index) {
        if (index === undefined) {
            return this.elements;
        }
        const idx = index < 0 ? this.elements.length + index : index;
        return this.elements[idx];
    }

    /**
     * Filter elements by selector or function.
     * @param {string|FilterFunction} selector
     * @returns {DommaCollection}
     */
    filter(selector) {
        if (typeof selector === 'function') {
            return new DommaCollection(this.elements.filter((el, i) => selector.call(el, i, el)));
        }
        return new DommaCollection(this.elements.filter(el => el.matches(selector)));
    }

    /**
     * Remove elements matching selector from collection.
     * @param {string|FilterFunction} selector
     * @returns {DommaCollection}
     */
    not(selector) {
        if (typeof selector === 'function') {
            return new DommaCollection(this.elements.filter((el, i) => !selector.call(el, i, el)));
        }
        return new DommaCollection(this.elements.filter(el => !el.matches(selector)));
    }

    /**
     * Check if any element matches selector.
     * @param {string} selector
     * @returns {boolean}
     */
    is(selector) {
        return this.elements.some(el => el.matches(selector));
    }

    /**
     * Filter elements that have descendants matching selector.
     * @param {string} selector
     * @returns {DommaCollection}
     */
    has(selector) {
        return new DommaCollection(this.elements.filter(el => el.querySelector(selector)));
    }

    /**
     * Add elements to the collection.
     * @param {DommaSelector} selector
     * @returns {DommaCollection}
     */
    add(selector) {
        const additional = new DommaCollection(selector);
        const combined = [...this.elements];
        additional.elements.forEach(el => {
            if (!combined.includes(el)) {
                combined.push(el);
            }
        });
        return new DommaCollection(combined);
    }

    /**
     * Get children including text nodes.
     * @returns {DommaCollection}
     */
    contents() {
        const contents = [];
        this.elements.forEach(el => {
            contents.push(...el.childNodes);
        });
        return new DommaCollection(contents);
    }

    /**
     * Convert to array.
     * @returns {HTMLElement[]}
     */
    toArray() {
        return [...this.elements];
    }

    /**
     * Index of the first element among its siblings (-1 when it has no parent).
     * @overload
     * @returns {number}
     */
    /**
     * Index of the first element within the elements matching a selector.
     * @overload
     * @param {string} selector
     * @returns {number}
     */
    /**
     * Index of an element within this collection.
     * @overload
     * @param {HTMLElement} element
     * @returns {number}
     */
    /**
     * Get index of element in collection or in parent.
     * @param {string|HTMLElement} [selector]
     * @returns {number}
     */
    index(selector) {
        if (selector === undefined) {
            const el = this.elements[0];
            if (!el || !el.parentElement) return -1;
            return Array.from(el.parentElement.children).indexOf(el);
        }
        if (typeof selector === 'string') {
            return new DommaCollection(selector).elements.indexOf(this.elements[0]);
        }
        return this.elements.indexOf(selector);
    }

    // ============================================
    // Content Methods
    // ============================================

    /**
     * Iterate over each element.
     * @param {(this: HTMLElement, index: number, element: HTMLElement) => void} callback
     * @returns {this}
     */
    each(callback) {
        this.elements.forEach((el, i) => callback.call(el, i, el));
        return this;
    }

    /**
     * Get the inner HTML of the first element ('' when the collection is empty).
     * @overload
     * @returns {string}
     */
    /**
     * Set the inner HTML of every element, sanitised unless `options.safe` is false.
     * @overload
     * @param {string} content - HTML content to set
     * @param {DommaHtmlOptions} [options] - Sanitisation options
     * @returns {this}
     */
    /**
     * Get or set inner HTML with automatic XSS protection.
     *
     * SECURITY: Content is sanitised by default to prevent XSS attacks.
     * Use {safe: false} option only for TRUSTED server content.
     *
     * @param {string} [content] - HTML content to set
     * @param {DommaHtmlOptions} [options] - Sanitisation options
     * @returns {string|this}
     *
     * @example
     * // Safe by default (sanitised)
     * $('#content').html(userInput);
     *
     * // Unsafe - for TRUSTED content only
     * $('#content').html(trustedServerHtml, {safe: false});
     *
     * // Strict mode - only basic formatting
     * $('#content').html(userBio, {preset: 'strict'});
     */
    html(content, options = {}) {
        if (content === undefined) {
            const firstEl = this.elements[0];
            return firstEl ? firstEl.innerHTML : '';
        }
        if (options.safe === false) {
            return this.each((i, el) => {
                el.innerHTML = content;
            });
        }
        const clean = sanitiseModule.sanitise(content, options);
        return this.each((i, el) => {
            el.innerHTML = TABLE_CONTEXT[el.tagName] ? sanitiseFor(el, content, options) : clean;
        });
    }


    /**
     * Get the combined text content of every element.
     * @overload
     * @returns {string}
     */
    /**
     * Set the text content of every element.
     * @overload
     * @param {string} content
     * @returns {this}
     */
    /**
     * Get or set text content.
     * @param {string} [content]
     * @returns {string|this}
     */
    text(content) {
        if (content === undefined) {
            return this.elements.map(el => el.textContent).join('');
        }
        return this.each((i, el) => { el.textContent = content; });
    }

    /**
     * Get the value of the first form element: an array for a multiple select, undefined for an unchecked checkbox/radio or an empty collection.
     * @overload
     * @returns {string|string[]|undefined}
     */
    /**
     * Set the value of every form element (checks checkboxes/radios whose value matches; selects options of a multiple select).
     * @overload
     * @param {string|string[]} value
     * @returns {this}
     */
    /**
     * Get or set form element value.
     * @param {string|string[]} [value]
     * @returns {string|string[]|undefined|this}
     */
    val(value) {
        if (value === undefined) {
            const el = this.elements[0];
            if (!el) return undefined;
            if (el.type === 'checkbox' || el.type === 'radio') {
                return el.checked ? el.value : undefined;
            }
            if (el.tagName === 'SELECT' && el.multiple) {
                return Array.from(el.selectedOptions).map(opt => opt.value);
            }
            return el.value;
        }
        return this.each((i, el) => {
            if (el.type === 'checkbox' || el.type === 'radio') {
                el.checked = Array.isArray(value) ? value.includes(el.value) : el.value === value;
            } else if (el.tagName === 'SELECT' && el.multiple && Array.isArray(value)) {
                Array.from(el.options).forEach(opt => {
                    opt.selected = value.includes(opt.value);
                });
            } else {
                el.value = value;
            }
        });
    }

    // ============================================
    // Attribute Methods
    // ============================================

    /**
     * Set several attributes on every element.
     * @overload
     * @param {Record<string, string>} attributes
     * @returns {this}
     */
    /**
     * Get an attribute of the first element (null when absent, undefined when the collection is empty).
     * @overload
     * @param {string} name
     * @returns {string|null|undefined}
     */
    /**
     * Set an attribute on every element.
     * @overload
     * @param {string} name
     * @param {string} value
     * @returns {this}
     */
    /**
     * Get or set attribute.
     * @param {string|Record<string, string>} name
     * @param {string} [value]
     * @returns {string|null|undefined|this}
     */
    attr(name, value) {
        if (typeof name === 'object') {
            return this.each((i, el) => {
                Object.entries(name).forEach(([key, val]) => {
                    el.setAttribute(key, val);
                });
            });
        }
        if (value === undefined) {
            return this.elements[0] ? this.elements[0].getAttribute(name) : undefined;
        }
        return this.each((i, el) => { el.setAttribute(name, value); });
    }

    /**
     * Remove attribute(s) - space-separated names.
     * @param {string} name
     * @returns {this}
     */
    removeAttr(name) {
        const attrs = name.split(/\s+/);
        return this.each((i, el) => {
            attrs.forEach(attr => el.removeAttribute(attr));
        });
    }

    /**
     * Set several properties on every element.
     * @overload
     * @param {Record<string, any>} properties
     * @returns {this}
     */
    /**
     * Get a property of the first element.
     * @overload
     * @param {string} name
     * @returns {any}
     */
    /**
     * Set a property on every element.
     * @overload
     * @param {string} name
     * @param {any} value
     * @returns {this}
     */
    /**
     * Get or set property.
     * @param {string|Record<string, any>} name
     * @param {any} [value]
     * @returns {any}
     */
    prop(name, value) {
        if (typeof name === 'object') {
            return this.each((i, el) => {
                Object.entries(name).forEach(([key, val]) => {
                    el[key] = val;
                });
            });
        }
        if (value === undefined) {
            return this.elements[0] ? this.elements[0][name] : undefined;
        }
        return this.each((i, el) => { el[name] = value; });
    }

    /**
     * Remove property.
     * @param {string} name
     * @returns {this}
     */
    removeProp(name) {
        return this.each((i, el) => { delete el[name]; });
    }

    /**
     * Get every data attribute of the first element (undefined when the collection is empty).
     * @overload
     * @returns {Record<string, string>|undefined}
     */
    /**
     * Set several data attributes on every element.
     * @overload
     * @param {Record<string, any>} data
     * @returns {this}
     */
    /**
     * Get a data attribute of the first element (camelCase key).
     * @overload
     * @param {string} key
     * @returns {string|undefined}
     */
    /**
     * Set a data attribute on every element.
     * @overload
     * @param {string} key
     * @param {any} value
     * @returns {this}
     */
    /**
     * Get or set data attributes.
     * @param {string|Record<string, any>} [key]
     * @param {any} [value]
     * @returns {any}
     */
    data(key, value) {
        if (key === undefined) {
            const el = this.elements[0];
            if (!el) return undefined;
            const data = {};
            Object.keys(el.dataset).forEach(k => {
                data[k] = el.dataset[k];
            });
            return data;
        }
        if (typeof key === 'object') {
            return this.each((i, el) => {
                Object.entries(key).forEach(([k, v]) => {
                    el.dataset[k] = v;
                });
            });
        }
        if (value === undefined) {
            return this.elements[0] ? this.elements[0].dataset[key] : undefined;
        }
        return this.each((i, el) => { el.dataset[key] = value; });
    }

    /**
     * Remove data attribute.
     * @param {string} key
     * @returns {this}
     */
    removeData(key) {
        return this.each((i, el) => { delete el.dataset[key]; });
    }

    // ============================================
    // CSS/Class Methods
    // ============================================

    /**
     * Set several CSS properties on every element.
     * @overload
     * @param {Record<string, string|number>} properties
     * @returns {this}
     */
    /**
     * Get a computed CSS property of the first element ('' when the collection is empty).
     * @overload
     * @param {string} property
     * @returns {string}
     */
    /**
     * Set a CSS property on every element.
     * @overload
     * @param {string} property
     * @param {string|number} value
     * @returns {this}
     */
    /**
     * Get or set CSS styles.
     * @param {string|Record<string, string|number>} property
     * @param {string|number} [value]
     * @returns {string|this}
     */
    css(property, value) {
        if (typeof property === 'object') {
            return this.each((i, el) => {
                Object.entries(property).forEach(([prop, val]) => {
                    el.style[prop] = val;
                });
            });
        }
        if (value === undefined) {
            return this.elements[0] ? getComputedStyle(this.elements[0])[property] : '';
        }
        return this.each((i, el) => { el.style[property] = value; });
    }

    /**
     * Add class(es) - space-separated.
     * @param {string|ClassFunction} className
     * @returns {this}
     */
    addClass(className) {
        if (typeof className === 'function') {
            return this.each((i, el) => {
                const classes = className.call(el, i, el.className);
                if (classes) el.classList.add(...classes.split(/\s+/).filter(Boolean));
            });
        }
        const classes = className.split(/\s+/).filter(Boolean);
        return this.each((i, el) => { el.classList.add(...classes); });
    }

    /**
     * Remove class(es) - space-separated, or every class when no argument is given.
     * @param {string|ClassFunction} [className]
     * @returns {this}
     */
    removeClass(className) {
        if (className === undefined) {
            return this.each((i, el) => { el.className = ''; });
        }
        if (typeof className === 'function') {
            return this.each((i, el) => {
                const classes = className.call(el, i, el.className);
                if (classes) el.classList.remove(...classes.split(/\s+/).filter(Boolean));
            });
        }
        const classes = className.split(/\s+/).filter(Boolean);
        return this.each((i, el) => { el.classList.remove(...classes); });
    }

    /**
     * Toggle class(es).
     * @param {string|((this: HTMLElement, index: number, currentClass: string, state?: boolean) => string)} className
     * @param {boolean} [state]
     * @returns {this}
     */
    toggleClass(className, state) {
        if (typeof className === 'function') {
            return this.each((i, el) => {
                const classes = className.call(el, i, el.className, state);
                if (classes) {
                    classes.split(/\s+/).filter(Boolean).forEach(cls => {
                        el.classList.toggle(cls, state);
                    });
                }
            });
        }
        const classes = className.split(/\s+/).filter(Boolean);
        return this.each((i, el) => {
            classes.forEach(cls => {
                el.classList.toggle(cls, state);
            });
        });
    }

    /**
     * Check if any element has class.
     * @param {string} className
     * @returns {boolean}
     */
    hasClass(className) {
        return this.elements.some(el => el.classList.contains(className));
    }

    // ============================================
    // DOM Manipulation
    // ============================================

    /**
     * Append content to each element.
     *
     * An element or collection is **moved** into place, so the node you built
     * is the node in the page and any handler bound to it beforehand still
     * fires. A markup string is parsed fresh for each target. Appending into
     * several targets at once copies for all but the last - see `_getNodes`.
     *
     * @param {string|HTMLElement|DommaCollection|ContentFunction} content
     * @returns {this}
     */
    append(content) {
        const last = this.elements.length - 1;
        return this.each((i, el) => {
            const nodes = this._getNodes(content, i, el, i === last);
            nodes.forEach(node => el.appendChild(node));
        });
    }

    /**
     * Prepend content to each element.
     * @param {string|HTMLElement|DommaCollection|ContentFunction} content
     * @returns {this}
     */
    prepend(content) {
        const last = this.elements.length - 1;
        return this.each((i, el) => {
            const nodes = this._getNodes(content, i, el, i === last);
            const first = el.firstChild;
            nodes.forEach(node => el.insertBefore(node, first));
        });
    }

    /**
     * Insert content after each element.
     * @param {string|HTMLElement|DommaCollection|ContentFunction} content
     * @returns {this}
     */
    after(content) {
        const last = this.elements.length - 1;
        return this.each((i, el) => {
            const nodes = this._getNodes(content, i, el, i === last);
            const parent = el.parentNode;
            const next = el.nextSibling;
            nodes.forEach(node => parent.insertBefore(node, next));
        });
    }

    /**
     * Insert content before each element.
     * @param {string|HTMLElement|DommaCollection|ContentFunction} content
     * @returns {this}
     */
    before(content) {
        const last = this.elements.length - 1;
        return this.each((i, el) => {
            const nodes = this._getNodes(content, i, el, i === last);
            const parent = el.parentNode;
            nodes.forEach(node => parent.insertBefore(node, el));
        });
    }

    /**
     * Append elements to target.
     * @param {DommaSelector} target
     * @returns {this}
     */
    appendTo(target) {
        new DommaCollection(target).append(this);
        return this;
    }

    /**
     * Prepend elements to target.
     * @param {DommaSelector} target
     * @returns {this}
     */
    prependTo(target) {
        new DommaCollection(target).prepend(this);
        return this;
    }

    /**
     * Insert elements after target.
     * @param {DommaSelector} target
     * @returns {this}
     */
    insertAfter(target) {
        new DommaCollection(target).after(this);
        return this;
    }

    /**
     * Insert elements before target.
     * @param {DommaSelector} target
     * @returns {this}
     */
    insertBefore(target) {
        new DommaCollection(target).before(this);
        return this;
    }

    /**
     * Wrap each element with structure.
     * @param {string|HTMLElement|DommaCollection|WrapperFunction} wrapper
     * @returns {this}
     */
    wrap(wrapper) {
        return this.each((i, el) => {
            const wrap = this._getWrapper(wrapper, i, el);
            if (el.parentNode) {
                el.parentNode.insertBefore(wrap, el);
                wrap.appendChild(el);
            }
        });
    }

    /**
     * Wrap all elements together with structure.
     * @param {string|HTMLElement|DommaCollection} wrapper
     * @returns {this}
     */
    wrapAll(wrapper) {
        if (this.elements.length === 0) return this;
        const wrap = this._getWrapper(wrapper, 0, this.elements[0]);
        this.elements[0].parentNode.insertBefore(wrap, this.elements[0]);
        this.elements.forEach(el => wrap.appendChild(el));
        return this;
    }

    /**
     * Wrap inner contents of each element.
     * @param {string|HTMLElement|DommaCollection|WrapperFunction} wrapper
     * @returns {this}
     */
    wrapInner(wrapper) {
        return this.each((i, el) => {
            const wrap = this._getWrapper(wrapper, i, el);
            while (el.firstChild) {
                wrap.appendChild(el.firstChild);
            }
            el.appendChild(wrap);
        });
    }

    /**
     * Remove parent wrapper from each element.
     * @param {string} [selector]
     * @returns {this}
     */
    unwrap(selector) {
        this.parent(selector).each((i, parent) => {
            const grandparent = parent.parentNode;
            while (parent.firstChild) {
                grandparent.insertBefore(parent.firstChild, parent);
            }
            grandparent.removeChild(parent);
        });
        return this;
    }

    /**
     * Remove elements from DOM.
     * @param {string} [selector]
     * @returns {this}
     */
    remove(selector) {
        const toRemove = selector ? this.filter(selector) : this;
        toRemove.each((i, el) => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        return this;
    }

    /**
     * Remove elements from DOM (alias for remove, simplified).
     * @returns {this}
     */
    detach() {
        return this.remove();
    }

    /**
     * Remove all children from elements.
     * @returns {this}
     */
    empty() {
        return this.each((i, el) => { el.innerHTML = ''; });
    }

    /**
     * Clone elements.
     * @param {boolean} [deep=true]
     * @returns {DommaCollection}
     */
    clone(deep = true) {
        return new DommaCollection(this.elements.map(el => el.cloneNode(deep)));
    }

    /**
     * Replace each element with content.
     * @param {string|HTMLElement|DommaCollection|ContentFunction} content
     * @returns {this}
     */
    replaceWith(content) {
        const last = this.elements.length - 1;
        return this.each((i, el) => {
            const nodes = this._getNodes(content, i, el, i === last);
            const parent = el.parentNode;
            nodes.forEach((node, idx) => {
                if (idx === 0) {
                    parent.replaceChild(node, el);
                } else {
                    parent.insertBefore(node, nodes[idx - 1].nextSibling);
                }
            });
        });
    }

    /**
     * Replace target with elements.
     * @param {DommaSelector} target
     * @returns {this}
     */
    replaceAll(target) {
        new DommaCollection(target).replaceWith(this);
        return this;
    }

    /**
     * Resolve insertion content to the nodes to insert into one target.
     *
     * An existing node is **moved**, not copied, which is what jQuery does and
     * what callers assume: `$('<input>').on('change', fn)` followed by an
     * append has to put *that* input in the page, or the handler is bound to a
     * node nobody can click and the state set with `prop()` is lost with it.
     * Copying was silent - the markup looked right and nothing threw.
     *
     * Only a collection with more than one target needs copies, because a node
     * cannot be in two places. The original then goes to the **last** target,
     * as in jQuery, and the earlier ones get `cloneNode(true)`.
     *
     * `cloneNode` copies attributes and descendants, never listeners or
     * properties, so a handler bound before a *multi-target* insert still only
     * survives on the last one. Bind after inserting, or delegate from a
     * container, when inserting into several targets at once.
     *
     * @param {string|HTMLElement|DommaCollection|Function} content
     * @param {number} index - Index of the target being filled
     * @param {HTMLElement} element - The target being filled
     * @param {boolean} [isLast=true] - Whether this is the final target, and so
     *   receives the original nodes rather than copies
     * @returns {Node[]}
     * @private
     */
    _getNodes(content, index, element, isLast = true) {
        if (typeof content === 'function') {
            content = content.call(element, index, element.innerHTML);
        }
        if (typeof content === 'string') {
            if (content.trim().startsWith('<')) {
                const temp = document.createElement('div');
                temp.innerHTML = content;
                return Array.from(temp.childNodes);
            }
            return [document.createTextNode(content)];
        }
        if (content instanceof HTMLElement) {
            return [isLast ? content : content.cloneNode(true)];
        }
        if (content instanceof DommaCollection) {
            return content.elements.map(el => isLast ? el : el.cloneNode(true));
        }
        return [];
    }

    // Helper: Get wrapper element
    /**
     * @param {string|HTMLElement|DommaCollection|WrapperFunction} wrapper
     * @param {number} index
     * @param {HTMLElement} element
     * @returns {Node}
     * @private
     */
    _getWrapper(wrapper, index, element) {
        let resultWrap;

        if (typeof wrapper === 'function') {
            wrapper = wrapper.call(element, index);
        }
        if (typeof wrapper === 'string') {
            const temp = document.createElement('div');
            temp.innerHTML = wrapper.trim();
            resultWrap = temp.firstElementChild;
        } else if (wrapper instanceof HTMLElement) {
            resultWrap = wrapper.cloneNode(true);
        } else if (wrapper instanceof DommaCollection) {
            resultWrap = wrapper.elements[0].cloneNode(true);
        } else {
            resultWrap = document.createElement('div');
        }
        return resultWrap;
    }

    // ============================================
    // Event Methods
    // ============================================

    /**
     * Attach a handler for a DOM event (the event object is typed from its name).
     * @template {keyof HTMLElementEventMap} K
     * @overload
     * @param {K} event
     * @param {EventHandler<HTMLElementEventMap[K]>} handler
     * @returns {this}
     */
    /**
     * Attach a handler for one or more space-separated events.
     * @template {Event} [E=Event]
     * @overload
     * @param {string} event
     * @param {EventHandler<E>} handler
     * @returns {this}
     */
    /**
     * Attach a delegated handler: it runs for events from descendants matching `selector`, with `this` set to the match.
     * @template {keyof HTMLElementEventMap} K
     * @overload
     * @param {K} event
     * @param {string} selector
     * @param {EventHandler<HTMLElementEventMap[K]>} handler
     * @returns {this}
     */
    /**
     * Attach a delegated handler for one or more space-separated events.
     * @template {Event} [E=Event]
     * @overload
     * @param {string} event
     * @param {string} selector
     * @param {EventHandler<E>} handler
     * @returns {this}
     */
    /**
     * Attach event handler.
     * @param {string} event
     * @param {string|EventHandler<any>|null} [selector]
     * @param {EventHandler<any>} [handler]
     * @returns {this}
     */
    on(event, selector, handler) {
        if (typeof selector === 'function') {
            handler = selector;
            selector = null;
        }
        const events = event.split(/\s+/);
        return this.each((i, el) => {
            events.forEach(evt => {
                if (selector) {
                    // Delegated event
                    const delegated = (e) => {
                        const target = e.target.closest(selector);
                        if (target && el.contains(target)) {
                            handler.call(target, e);
                        }
                    };
                    el.addEventListener(evt, delegated);
                    el._dommaHandlers = el._dommaHandlers || [];
                    el._dommaHandlers.push({ event: evt, selector, handler, delegated });
                } else {
                    el.addEventListener(evt, handler);
                }
            });
        });
    }

    /**
     * Remove a handler (nothing is removed without both an event and a handler).
     * @overload
     * @param {string} [event]
     * @param {EventHandler<any>} [handler]
     * @returns {this}
     */
    /**
     * Remove delegated handlers bound with this selector (all of them when no handler is given).
     * @overload
     * @param {string} event
     * @param {string} selector
     * @param {EventHandler<any>} [handler]
     * @returns {this}
     */
    /**
     * Remove event handler.
     * @param {string} [event]
     * @param {string|EventHandler<any>|null} [selector]
     * @param {EventHandler<any>} [handler]
     * @returns {this}
     */
    off(event, selector, handler) {
        if (typeof selector === 'function') {
            handler = selector;
            selector = null;
        }
        return this.each((i, el) => {
            if (event) {
                const events = event.split(/\s+/);
                events.forEach(evt => {
                    if (selector && el._dommaHandlers) {
                        el._dommaHandlers = el._dommaHandlers.filter(h => {
                            if (h.event === evt && h.selector === selector && (!handler || h.handler === handler)) {
                                el.removeEventListener(evt, h.delegated);
                                return false;
                            }
                            return true;
                        });
                    } else if (handler) {
                        el.removeEventListener(evt, handler);
                    }
                });
            }
        });
    }

    /**
     * Attach a handler that runs once.
     * @template {keyof HTMLElementEventMap} K
     * @overload
     * @param {K} event
     * @param {EventHandler<HTMLElementEventMap[K]>} handler
     * @returns {this}
     */
    /**
     * Attach a handler that runs once.
     * @template {Event} [E=Event]
     * @overload
     * @param {string} event
     * @param {EventHandler<E>} handler
     * @returns {this}
     */
    /**
     * Attach a delegated handler that runs once.
     * @template {keyof HTMLElementEventMap} K
     * @overload
     * @param {K} event
     * @param {string} selector
     * @param {EventHandler<HTMLElementEventMap[K]>} handler
     * @returns {this}
     */
    /**
     * Attach a delegated handler that runs once.
     * @template {Event} [E=Event]
     * @overload
     * @param {string} event
     * @param {string} selector
     * @param {EventHandler<E>} handler
     * @returns {this}
     */
    /**
     * Attach handler that executes once.
     * @param {string} event
     * @param {string|EventHandler<any>|null} [selector]
     * @param {EventHandler<any>} [handler]
     * @returns {this}
     */
    one(event, selector, handler) {
        if (typeof selector === 'function') {
            handler = selector;
            selector = null;
        }
        const self = this;
        const wrapper = function(e) {
            handler.call(this, e);
            self.off(event, selector, wrapper);
        };
        return this.on(event, selector, wrapper);
    }

    /**
     * Trigger event on elements: a bubbling, cancelable CustomEvent with `data` as its `detail`.
     * @param {string} event
     * @param {any} [data]
     * @returns {this}
     */
    trigger(event, data) {
        const evt = new CustomEvent(event, { detail: data, bubbles: true, cancelable: true });
        return this.each((i, el) => { el.dispatchEvent(evt); });
    }

    /**
     * Trigger native event.
     * @param {string} eventType
     * @returns {this}
     */
    triggerNative(eventType) {
        return this.each((i, el) => {
            const evt = new Event(eventType, { bubbles: true, cancelable: true });
            el.dispatchEvent(evt);
        });
    }

    // Event shortcuts
    /**
     * Trigger a native click.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `click` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `click` handler, or trigger a native click when none is given.
     * @param {EventHandler<MouseEvent>} [handler]
     * @returns {this}
     */
    click(handler) {
        return handler ? this.on('click', handler) : this.triggerNative('click');
    }
    /**
     * Trigger a `dblclick` event.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `dblclick` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `dblclick` handler, or trigger a `dblclick` event when none is given.
     * @param {EventHandler<MouseEvent>} [handler]
     * @returns {this}
     */
    dblclick(handler) { return handler ? this.on('dblclick', handler) : this.trigger('dblclick'); }
    /**
     * Trigger a `mousedown` event.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `mousedown` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `mousedown` handler, or trigger a `mousedown` event when none is given.
     * @param {EventHandler<MouseEvent>} [handler]
     * @returns {this}
     */
    mousedown(handler) { return handler ? this.on('mousedown', handler) : this.trigger('mousedown'); }
    /**
     * Trigger a `mouseup` event.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `mouseup` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `mouseup` handler, or trigger a `mouseup` event when none is given.
     * @param {EventHandler<MouseEvent>} [handler]
     * @returns {this}
     */
    mouseup(handler) { return handler ? this.on('mouseup', handler) : this.trigger('mouseup'); }
    /**
     * Trigger a `mousemove` event.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `mousemove` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `mousemove` handler, or trigger a `mousemove` event when none is given.
     * @param {EventHandler<MouseEvent>} [handler]
     * @returns {this}
     */
    mousemove(handler) { return handler ? this.on('mousemove', handler) : this.trigger('mousemove'); }
    /**
     * Trigger a `mouseover` event.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `mouseover` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `mouseover` handler, or trigger a `mouseover` event when none is given.
     * @param {EventHandler<MouseEvent>} [handler]
     * @returns {this}
     */
    mouseover(handler) { return handler ? this.on('mouseover', handler) : this.trigger('mouseover'); }
    /**
     * Trigger a `mouseout` event.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `mouseout` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `mouseout` handler, or trigger a `mouseout` event when none is given.
     * @param {EventHandler<MouseEvent>} [handler]
     * @returns {this}
     */
    mouseout(handler) { return handler ? this.on('mouseout', handler) : this.trigger('mouseout'); }
    /**
     * Trigger a `mouseenter` event.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `mouseenter` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `mouseenter` handler, or trigger a `mouseenter` event when none is given.
     * @param {EventHandler<MouseEvent>} [handler]
     * @returns {this}
     */
    mouseenter(handler) { return handler ? this.on('mouseenter', handler) : this.trigger('mouseenter'); }
    /**
     * Trigger a `mouseleave` event.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `mouseleave` handler.
     * @overload
     * @param {EventHandler<MouseEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `mouseleave` handler, or trigger a `mouseleave` event when none is given.
     * @param {EventHandler<MouseEvent>} [handler]
     * @returns {this}
     */
    mouseleave(handler) { return handler ? this.on('mouseleave', handler) : this.trigger('mouseleave'); }
    /**
     * Trigger a `keydown` event.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `keydown` handler.
     * @overload
     * @param {EventHandler<KeyboardEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `keydown` handler, or trigger a `keydown` event when none is given.
     * @param {EventHandler<KeyboardEvent>} [handler]
     * @returns {this}
     */
    keydown(handler) { return handler ? this.on('keydown', handler) : this.trigger('keydown'); }
    /**
     * Trigger a `keyup` event.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `keyup` handler.
     * @overload
     * @param {EventHandler<KeyboardEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `keyup` handler, or trigger a `keyup` event when none is given.
     * @param {EventHandler<KeyboardEvent>} [handler]
     * @returns {this}
     */
    keyup(handler) { return handler ? this.on('keyup', handler) : this.trigger('keyup'); }
    /**
     * Trigger a `keypress` event.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `keypress` handler.
     * @overload
     * @param {EventHandler<KeyboardEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `keypress` handler, or trigger a `keypress` event when none is given.
     * @param {EventHandler<KeyboardEvent>} [handler]
     * @returns {this}
     */
    keypress(handler) { return handler ? this.on('keypress', handler) : this.trigger('keypress'); }
    /**
     * Trigger focus on every element.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `focus` handler.
     * @overload
     * @param {EventHandler<FocusEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `focus` handler, or trigger focus on every element when none is given.
     * @param {EventHandler<FocusEvent>} [handler]
     * @returns {this}
     */
    focus(handler) { return handler ? this.on('focus', handler) : this.each((i, el) => el.focus()); }
    /**
     * Trigger blur on every element.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `blur` handler.
     * @overload
     * @param {EventHandler<FocusEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `blur` handler, or trigger blur on every element when none is given.
     * @param {EventHandler<FocusEvent>} [handler]
     * @returns {this}
     */
    blur(handler) { return handler ? this.on('blur', handler) : this.each((i, el) => el.blur()); }
    /**
     * Trigger a `change` event.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `change` handler.
     * @overload
     * @param {EventHandler<Event>} handler
     * @returns {this}
     */
    /**
     * Attach a `change` handler, or trigger a `change` event when none is given.
     * @param {EventHandler<Event>} [handler]
     * @returns {this}
     */
    change(handler) { return handler ? this.on('change', handler) : this.trigger('change'); }
    /**
     * Trigger a `select` event.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `select` handler.
     * @overload
     * @param {EventHandler<Event>} handler
     * @returns {this}
     */
    /**
     * Attach a `select` handler, or trigger a `select` event when none is given.
     * @param {EventHandler<Event>} [handler]
     * @returns {this}
     */
    select(handler) { return handler ? this.on('select', handler) : this.trigger('select'); }
    /**
     * Trigger submit on every form.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `submit` handler.
     * @overload
     * @param {EventHandler<SubmitEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `submit` handler, or trigger submit on every form when none is given.
     * @param {EventHandler<SubmitEvent>} [handler]
     * @returns {this}
     */
    submit(handler) {
        if (handler) {
            return this.on('submit', handler);
        }
        return this.each((i, el) => { if (el.submit) el.submit(); });
    }
    /**
     * Trigger a `scroll` event.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `scroll` handler.
     * @overload
     * @param {EventHandler<Event>} handler
     * @returns {this}
     */
    /**
     * Attach a `scroll` handler, or trigger a `scroll` event when none is given.
     * @param {EventHandler<Event>} [handler]
     * @returns {this}
     */
    scroll(handler) { return handler ? this.on('scroll', handler) : this.trigger('scroll'); }
    /**
     * Trigger a `resize` event.
     * @overload
     * @returns {this}
     */
    /**
     * Attach a `resize` handler.
     * @overload
     * @param {EventHandler<UIEvent>} handler
     * @returns {this}
     */
    /**
     * Attach a `resize` handler, or trigger a `resize` event when none is given.
     * @param {EventHandler<UIEvent>} [handler]
     * @returns {this}
     */
    resize(handler) { return handler ? this.on('resize', handler) : this.trigger('resize'); }

    /**
     * Handle mouseenter and mouseleave (one handler for both when leaveHandler is omitted).
     * @param {EventHandler<MouseEvent>} enterHandler
     * @param {EventHandler<MouseEvent>} [leaveHandler]
     * @returns {this}
     */
    hover(enterHandler, leaveHandler) {
        this.on('mouseenter', enterHandler);
        if (leaveHandler) {
            this.on('mouseleave', leaveHandler);
        } else {
            this.on('mouseleave', enterHandler);
        }
        return this;
    }

    // ============================================
    // Effects/Animation
    // ============================================

    /**
     * Show elements.
     * @param {Duration} [duration]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    show(duration, callback) {
        return this.each((i, el) => {
            if (duration) {
                el.style.display = '';
                el.style.opacity = '0';
                el.style.transition = `opacity ${this._getDuration(duration)}ms`;
                requestAnimationFrame(() => {
                    el.style.opacity = '1';
                    if (callback) {
                        setTimeout(() => callback.call(el), this._getDuration(duration));
                    }
                });
            } else {
                el.style.display = '';
                if (callback) callback.call(el);
            }
        });
    }

    /**
     * Hide elements.
     * @param {Duration} [duration]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    hide(duration, callback) {
        return this.each((i, el) => {
            if (duration) {
                el.style.transition = `opacity ${this._getDuration(duration)}ms`;
                el.style.opacity = '0';
                setTimeout(() => {
                    el.style.display = 'none';
                    el.style.opacity = '';
                    el.style.transition = '';
                    if (callback) callback.call(el);
                }, this._getDuration(duration));
            } else {
                el.style.display = 'none';
                if (callback) callback.call(el);
            }
        });
    }

    /**
     * Toggle visibility.
     * @param {Duration} [duration]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    toggle(duration, callback) {
        return this.each((i, el) => {
            const isHidden = getComputedStyle(el).display === 'none';
            if (isHidden) {
                new DommaCollection(el).show(duration, callback);
            } else {
                new DommaCollection(el).hide(duration, callback);
            }
        });
    }

    /**
     * Fade in elements.
     * @param {Duration} [duration=400]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    fadeIn(duration = 400, callback) {
        return this.each((i, el) => {
            el.style.display = '';
            el.style.opacity = '0';
            el.style.transition = `opacity ${this._getDuration(duration)}ms`;
            requestAnimationFrame(() => {
                el.style.opacity = '1';
                setTimeout(() => {
                    el.style.transition = '';
                    if (callback) callback.call(el);
                }, this._getDuration(duration));
            });
        });
    }

    /**
     * Fade out elements.
     * @param {Duration} [duration=400]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    fadeOut(duration = 400, callback) {
        return this.each((i, el) => {
            el.style.transition = `opacity ${this._getDuration(duration)}ms`;
            el.style.opacity = '0';
            setTimeout(() => {
                el.style.display = 'none';
                el.style.opacity = '';
                el.style.transition = '';
                if (callback) callback.call(el);
            }, this._getDuration(duration));
        });
    }

    /**
     * Toggle fade.
     * @param {Duration} [duration=400]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    fadeToggle(duration = 400, callback) {
        return this.each((i, el) => {
            const isHidden = getComputedStyle(el).display === 'none' || getComputedStyle(el).opacity === '0';
            if (isHidden) {
                new DommaCollection(el).fadeIn(duration, callback);
            } else {
                new DommaCollection(el).fadeOut(duration, callback);
            }
        });
    }

    /**
     * Fade to opacity.
     * @param {Duration} duration
     * @param {number} opacity
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    fadeTo(duration, opacity, callback) {
        return this.each((i, el) => {
            el.style.display = '';
            el.style.transition = `opacity ${this._getDuration(duration)}ms`;
            requestAnimationFrame(() => {
                el.style.opacity = String(opacity);
                setTimeout(() => {
                    el.style.transition = '';
                    if (callback) callback.call(el);
                }, this._getDuration(duration));
            });
        });
    }

    /**
     * Slide up (hide).
     * @param {Duration} [duration=400]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    slideUp(duration = 400, callback) {
        return this.each((i, el) => {
            const height = el.offsetHeight;
            el.style.overflow = 'hidden';
            el.style.height = height + 'px';
            el.style.transition = `height ${this._getDuration(duration)}ms`;
            requestAnimationFrame(() => {
                el.style.height = '0';
                setTimeout(() => {
                    el.style.display = 'none';
                    el.style.height = '';
                    el.style.overflow = '';
                    el.style.transition = '';
                    if (callback) callback.call(el);
                }, this._getDuration(duration));
            });
        });
    }

    /**
     * Slide down (show).
     * @param {Duration} [duration=400]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    slideDown(duration = 400, callback) {
        return this.each((i, el) => {
            el.style.display = '';
            const height = el.scrollHeight;
            el.style.overflow = 'hidden';
            el.style.height = '0';
            el.style.transition = `height ${this._getDuration(duration)}ms`;
            requestAnimationFrame(() => {
                el.style.height = height + 'px';
                setTimeout(() => {
                    el.style.height = '';
                    el.style.overflow = '';
                    el.style.transition = '';
                    if (callback) callback.call(el);
                }, this._getDuration(duration));
            });
        });
    }

    /**
     * Toggle slide.
     * @param {Duration} [duration=400]
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    slideToggle(duration = 400, callback) {
        return this.each((i, el) => {
            const isHidden = getComputedStyle(el).display === 'none';
            if (isHidden) {
                new DommaCollection(el).slideDown(duration, callback);
            } else {
                new DommaCollection(el).slideUp(duration, callback);
            }
        });
    }

    /**
     * Animate CSS properties (numbers are pixels).
     * @overload
     * @param {AnimationProperties} properties
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    /**
     * Animate CSS properties (numbers are pixels).
     * @overload
     * @param {AnimationProperties} properties
     * @param {Duration} duration
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    /**
     * Animate CSS properties (numbers are pixels) with a CSS easing.
     * @overload
     * @param {AnimationProperties} properties
     * @param {Duration} duration
     * @param {string} easing
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    /**
     * Animate CSS properties.
     * @param {AnimationProperties} properties
     * @param {Duration|((this: HTMLElement) => void)} [duration=400]
     * @param {string|((this: HTMLElement) => void)} [easing='ease']
     * @param {(this: HTMLElement) => void} [callback]
     * @returns {this}
     */
    animate(properties, duration = 400, easing = 'ease', callback) {
        if (typeof duration === 'function') {
            callback = duration;
            duration = 400;
            easing = 'ease';
        } else if (typeof easing === 'function') {
            callback = easing;
            easing = 'ease';
        }

        const props = Object.keys(properties).join(', ');
        const dur = this._getDuration(duration);

        return this.each((i, el) => {
            el.style.transition = `${props} ${dur}ms ${easing}`;
            requestAnimationFrame(() => {
                Object.entries(properties).forEach(([prop, value]) => {
                    el.style[prop] = typeof value === 'number' ? value + 'px' : value;
                });
                setTimeout(() => {
                    el.style.transition = '';
                    if (callback) callback.call(el);
                }, dur);
            });
        });
    }

    /**
     * Stop animations.
     * @returns {this}
     */
    stop() {
        return this.each((i, el) => {
            const computed = getComputedStyle(el);
            el.style.transition = 'none';
            // Capture current computed values
            ['opacity', 'height', 'width'].forEach(prop => {
                if (el.style[prop]) {
                    el.style[prop] = computed[prop];
                }
            });
        });
    }

    /**
     * Delay next animation: resolves with this collection after `duration` ms.
     * @param {number} duration
     * @returns {Promise<this>}
     */
    delay(duration) {
        return new Promise(resolve => {
            setTimeout(() => resolve(this), duration);
        });
    }

    // Helper: Convert duration string to ms
    /**
     * @param {Duration} duration
     * @returns {number}
     * @private
     */
    _getDuration(duration) {
        if (typeof duration === 'number') return duration;
        if (duration === 'fast') return 200;
        if (duration === 'slow') return 600;
        return 400;
    }

    // ============================================
    // Dimensions
    // ============================================

    /**
     * Get the rendered width of the first element (undefined when the collection is empty).
     * @overload
     * @returns {number|undefined}
     */
    /**
     * Set the width of every element (numbers are pixels).
     * @overload
     * @param {number|string|ValueFunction} value
     * @returns {this}
     */
    /**
     * Get or set width.
     * @param {number|string|ValueFunction} [value]
     * @returns {number|undefined|this}
     */
    width(value) {
        if (value === undefined) {
            const el = this.elements[0];
            if (!el) return undefined;
            return el.getBoundingClientRect().width;
        }
        return this.each((i, el) => {
            const val = typeof value === 'function' ? value.call(el, i, new DommaCollection(el).width()) : value;
            el.style.width = typeof val === 'number' ? val + 'px' : val;
        });
    }

    /**
     * Get the rendered height of the first element (undefined when the collection is empty).
     * @overload
     * @returns {number|undefined}
     */
    /**
     * Set the height of every element (numbers are pixels).
     * @overload
     * @param {number|string|ValueFunction} value
     * @returns {this}
     */
    /**
     * Get or set height.
     * @param {number|string|ValueFunction} [value]
     * @returns {number|undefined|this}
     */
    height(value) {
        if (value === undefined) {
            const el = this.elements[0];
            if (!el) return undefined;
            return el.getBoundingClientRect().height;
        }
        return this.each((i, el) => {
            const val = typeof value === 'function' ? value.call(el, i, new DommaCollection(el).height()) : value;
            el.style.height = typeof val === 'number' ? val + 'px' : val;
        });
    }

    /**
     * Get inner width (content + padding).
     * @returns {number|undefined}
     */
    innerWidth() {
        const el = this.elements[0];
        return el ? el.clientWidth : undefined;
    }

    /**
     * Get inner height (content + padding).
     * @returns {number|undefined}
     */
    innerHeight() {
        const el = this.elements[0];
        return el ? el.clientHeight : undefined;
    }

    /**
     * Get outer width (content + padding + border + optional margin).
     * @param {boolean} [includeMargin=false]
     * @returns {number|undefined}
     */
    outerWidth(includeMargin = false) {
        const el = this.elements[0];
        if (!el) return undefined;
        let width = el.offsetWidth;
        if (includeMargin) {
            const style = getComputedStyle(el);
            width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        }
        return width;
    }

    /**
     * Get outer height (content + padding + border + optional margin).
     * @param {boolean} [includeMargin=false]
     * @returns {number|undefined}
     */
    outerHeight(includeMargin = false) {
        const el = this.elements[0];
        if (!el) return undefined;
        let height = el.offsetHeight;
        if (includeMargin) {
            const style = getComputedStyle(el);
            height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        }
        return height;
    }

    /**
     * Get the position of the first element relative to the document.
     * @overload
     * @returns {Offset|undefined}
     */
    /**
     * Move every element to these document coordinates (static elements become relative).
     * @overload
     * @param {Partial<Offset>} coords
     * @returns {this}
     */
    /**
     * Get or set offset (position relative to document).
     * @param {Partial<Offset>} [coords]
     * @returns {Offset|undefined|this}
     */
    offset(coords) {
        if (coords === undefined) {
            const el = this.elements[0];
            if (!el) return undefined;
            const rect = el.getBoundingClientRect();
            return {
                top: rect.top + window.pageYOffset,
                left: rect.left + window.pageXOffset
            };
        }
        return this.each((i, el) => {
            const position = getComputedStyle(el).position;
            if (position === 'static') {
                el.style.position = 'relative';
            }
            const currentOffset = new DommaCollection(el).offset();
            const currentLeft = parseFloat(getComputedStyle(el).left) || 0;
            const currentTop = parseFloat(getComputedStyle(el).top) || 0;

            if (coords.left !== undefined) {
                el.style.left = (currentLeft + coords.left - currentOffset.left) + 'px';
            }
            if (coords.top !== undefined) {
                el.style.top = (currentTop + coords.top - currentOffset.top) + 'px';
            }
        });
    }

    /**
     * Get position (relative to offset parent).
     * @returns {Position|undefined}
     */
    position() {
        const el = this.elements[0];
        if (!el) return undefined;
        return {
            top: el.offsetTop,
            left: el.offsetLeft
        };
    }

    /**
     * Get the scroll top position of the first element.
     * @overload
     * @returns {number|undefined}
     */
    /**
     * Set the scroll top position of every element.
     * @overload
     * @param {number} value
     * @returns {this}
     */
    /**
     * Get or set scroll top position.
     * @param {number} [value]
     * @returns {number|undefined|this}
     */
    scrollTop(value) {
        if (value === undefined) {
            const el = this.elements[0];
            if (!el) return undefined;
            return el === window ? window.pageYOffset : el.scrollTop;
        }
        return this.each((i, el) => {
            if (el === window) {
                window.scrollTo(window.pageXOffset, value);
            } else {
                el.scrollTop = value;
            }
        });
    }

    /**
     * Get the scroll left position of the first element.
     * @overload
     * @returns {number|undefined}
     */
    /**
     * Set the scroll left position of every element.
     * @overload
     * @param {number} value
     * @returns {this}
     */
    /**
     * Get or set scroll left position.
     * @param {number} [value]
     * @returns {number|undefined|this}
     */
    scrollLeft(value) {
        if (value === undefined) {
            const el = this.elements[0];
            if (!el) return undefined;
            return el === window ? window.pageXOffset : el.scrollLeft;
        }
        return this.each((i, el) => {
            if (el === window) {
                window.scrollTo(value, window.pageYOffset);
            } else {
                el.scrollLeft = value;
            }
        });
    }

    /**
     * Get offset parent.
     * @returns {DommaCollection}
     */
    offsetParent() {
        return new DommaCollection(this.elements.map(el => el.offsetParent || document.body));
    }
}

/**
 * Wrap elements in a DommaCollection.
 * @overload
 * @param {DommaSelector} selector - CSS selector, HTML string, element(s) or a collection
 * @param {Document | Element | DocumentFragment} [context] - Where to look for a CSS selector (default: document)
 * @returns {DommaCollection}
 */
/**
 * Run a function when the DOM is ready (straight away if it already is).
 * @overload
 * @param {() => void} callback
 * @returns {DommaCollection} An empty collection
 */
/**
 * DOM factory: `$(selector)` or `$(readyCallback)`.
 * @param {DommaSelector | (() => void)} selector
 * @param {Document | Element | DocumentFragment} [context]
 * @returns {DommaCollection}
 */
export const dom = (selector, context) => {
    // Handle function (DOM ready callback)
    if (typeof selector === 'function') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', selector);
        } else {
            // DOM is already ready
            selector();
        }
        return new DommaCollection([]);
    }

    return new DommaCollection(selector, context);
};

/**
 * Is this a Domma collection (the result of `$()`)?
 * @param {unknown} value
 * @returns {value is DommaCollection}
 */
export const isDomma = (value) => value instanceof DommaCollection;
