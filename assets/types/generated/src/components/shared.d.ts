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
export function resolveElement(target: ComponentTarget): HTMLElement | null;
/**
 * Every element a selector matches (one for an element).
 * @param {ComponentTarget} target
 * @returns {HTMLElement[]}
 */
export function resolveAll(target: ComponentTarget): HTMLElement[];
/**
 * A boolean option that may have arrived as a string ('false' from an attribute, or
 * from a caller who worked around the old wrappers dropping a boolean false).
 * @param {*} value
 * @param {boolean} [fallback]
 * @returns {boolean}
 */
export function flag(value: any, fallback?: boolean): boolean;
/**
 * A number option that may be a string; anything unparseable gives the fallback.
 * @param {*} value
 * @param {number} [fallback]
 * @returns {number}
 */
export function num(value: any, fallback?: number): number;
/**
 * Put content into an element. Strings are HTML, sanitised the way `$().html()` does
 * (DOMPurify, or escaped without it) unless `{safe: false}`; Nodes are appended.
 * @param {Element} el
 * @param {string|Node|null} content
 * @param {{safe?: boolean, text?: boolean}} [opts] - `text: true` writes a string as text
 */
export function fill(el: Element, content: string | Node | null, opts?: {
    safe?: boolean;
    text?: boolean;
}): void;
/**
 * Scan new markup for `data-icon` placeholders when the icon module is loaded.
 * @param {Element|null|undefined} el
 */
export function scanIcons(el: Element | null | undefined): void;
/**
 * A page-unique id with a prefix.
 * @param {string} prefix
 * @returns {string}
 */
export function uniqueId(prefix: string): string;
/**
 * Give the first of several instances a non-enumerable `all()` that returns every
 * one, so `E.tooltip('.many')` initialises each match and still returns an instance.
 * @template {object} T
 * @param {T[]} list
 * @returns {(T & {all(): T[]})|null}
 */
export function firstWithAll<T extends unknown>(list: T[]): (T & {
    all(): T[];
}) | null;
/**
 * The component of this kind already on an element, given any new options - so calling
 * E.card(el) twice updates one card instead of stacking a second set of listeners on it.
 * @param {Element} el
 * @param {string} name - componentName
 * @param {Record<string, any>} [options]
 * @returns {any}
 */
export function reuse(el: Element, name: string, options?: Record<string, any>): any;
/** Whether the user asked for less motion. */
export function reducedMotion(): boolean;
/**
 * What a component accepts as its host: a CSS selector, an element, or a Domma/jQuery-like
 * collection (its first element is used).
 */
export type ComponentTarget = string | Element | ArrayLike<Element> | null | undefined;
