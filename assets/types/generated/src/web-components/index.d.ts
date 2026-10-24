/**
 * Define every `<domma-*>` tag. Safe to call more than once; does nothing outside a browser.
 * @returns {void}
 */
export function registerComponents(): void;
/**
 * Define the tags when `root` contains one.
 * @param {ParentNode|null} [root] - Defaults to `document`
 * @returns {void}
 */
export function registerIfPresent(root?: ParentNode | null): void;
/** The `<domma-*>` tag names. @type {string[]} */
export const TAGS: string[];
export { DommaElement, getThemeVariables } from "./base/domma-element.js";
