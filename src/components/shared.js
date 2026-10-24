/**
 * Small helpers shared by the E.* components in this folder.
 */

import {sanitise} from '../sanitize.js';
import {instanceOf} from '../component.js';

/**
 * What a component accepts as its host: a CSS selector, an element, or a Domma/jQuery-like
 * collection (its first element is used).
 * @typedef {string|Element|ArrayLike<Element>|null|undefined} ComponentTarget
 */

/**
 * An element from a selector, an element, or a Domma/jQuery-like collection.
 * @param {ComponentTarget} target
 * @returns {HTMLElement|null}
 */
export function resolveElement(target) {
    if (!target) return null;
    if (typeof target === 'string') {
        return typeof document === 'undefined' ? null : document.querySelector(target);
    }
    if (target.nodeType === 1) return target;
    if (typeof target.get === 'function' && target.length !== undefined) return target.get(0) || null;
    if (target[0] && target[0].nodeType === 1) return target[0];
    return null;
}

/**
 * Every element a selector matches (one for an element).
 * @param {ComponentTarget} target
 * @returns {HTMLElement[]}
 */
export function resolveAll(target) {
    if (!target) return [];
    if (typeof target === 'string') {
        return typeof document === 'undefined' ? [] : Array.from(document.querySelectorAll(target));
    }
    if (target.nodeType === 1) return [target];
    if (typeof target.length === 'number') return Array.from(target).filter(el => el && el.nodeType === 1);
    return [];
}

/**
 * A boolean option that may have arrived as a string ('false' from an attribute, or
 * from a caller who worked around the old wrappers dropping a boolean false).
 * @param {*} value
 * @param {boolean} [fallback]
 * @returns {boolean}
 */
export function flag(value, fallback = false) {
    if (value === undefined || value === null) return fallback;
    if (value === '' || value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return Boolean(value);
}

/**
 * A number option that may be a string; anything unparseable gives the fallback.
 * @param {*} value
 * @param {number} [fallback]
 * @returns {number}
 */
export function num(value, fallback = 0) {
    if (value === undefined || value === null || value === '') return fallback;
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

/**
 * Put content into an element. Strings are HTML, sanitised the way `$().html()` does
 * (DOMPurify, or escaped without it) unless `{safe: false}`; Nodes are appended.
 * @param {Element} el
 * @param {string|Node|null} content
 * @param {{safe?: boolean, text?: boolean}} [opts] - `text: true` writes a string as text
 */
export function fill(el, content, opts = {}) {
    el.replaceChildren();
    if (content === undefined || content === null) return;
    if (typeof Node !== 'undefined' && content instanceof Node) {
        el.appendChild(content);
        return;
    }
    const str = String(content);
    if (opts.text) el.textContent = str;
    else el.innerHTML = opts.safe === false ? str : sanitise(str);
}

/**
 * Scan new markup for `data-icon` placeholders when the icon module is loaded.
 * @param {Element|null|undefined} el
 */
export function scanIcons(el) {
    const icons = typeof window !== 'undefined' ? window.Domma?.icons : null;
    if (el && icons && typeof icons.scan === 'function') {
        try { icons.scan(el); } catch { /* icons are decoration */ }
    }
}

let uid = 0;
/**
 * A page-unique id with a prefix.
 * @param {string} prefix
 * @returns {string}
 */
export function uniqueId(prefix) {
    uid += 1;
    return `${prefix}-${uid}`;
}

/**
 * Give the first of several instances a non-enumerable `all()` that returns every
 * one, so `E.tooltip('.many')` initialises each match and still returns an instance.
 * @template {object} T
 * @param {T[]} list
 * @returns {(T & {all(): T[]})|null}
 */
export function firstWithAll(list) {
    if (!list.length) return null;
    const first = list[0];
    Object.defineProperty(first, 'all', {
        value: () => list.slice(),
        enumerable: false,
        configurable: true,
        writable: true
    });
    return first;
}

/**
 * The component of this kind already on an element, given any new options - so calling
 * E.card(el) twice updates one card instead of stacking a second set of listeners on it.
 * @param {Element} el
 * @param {string} name - componentName
 * @param {Record<string, any>} [options]
 * @returns {any}
 */
export function reuse(el, name, options = {}) {
    const existing = instanceOf(el, name);
    if (!existing) return null;
    if (options && Object.keys(options).length) existing.setOptions(options);
    return existing;
}

/** Whether the user asked for less motion. */
export function reducedMotion() {
    try {
        return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    } catch {
        return false;
    }
}
