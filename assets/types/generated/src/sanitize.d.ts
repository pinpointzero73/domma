/**
 * Main sanitisation function
 *
 * @param {string} html - HTML string to sanitise
 * @param {SanitiseOptions} [options] - Sanitisation options (preset, allowedTags, allowedAttrs, allowDataAttrs)
 * @returns {string} - Sanitised HTML
 */
export function sanitise(html: string, options?: SanitiseOptions): string;
/**
 * Sanitise for basic text with minimal formatting
 * Only allows: b, i, em, strong, br
 *
 * @param {string} html - HTML string to sanitise
 * @returns {string} - Sanitised HTML
 */
export function sanitiseBasic(html: string): string;
/**
 * Sanitise for user-generated content (strict)
 * Only allows: b, i, em, strong, p, br, a, ul, ol, li
 *
 * @param {string} html - HTML string to sanitise
 * @returns {string} - Sanitised HTML
 */
export function sanitiseUserContent(html: string): string;
/**
 * Escape HTML completely (no tags allowed)
 * Use for plain text that should be displayed as-is
 *
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export function escape(text: string): string;
/**
 * Check if DOMPurify is loaded
 * @returns {boolean}
 */
export function hasDOMPurify(): boolean;
declare const _default: Sanitize;
export default _default;
/**
 * Options for `sanitise()`. Used only when DOMPurify is loaded; without it the input is
 * HTML-escaped whatever the options say.
 */
export type SanitiseOptions = {
    /**
     * - Allowlist preset ('default', 'strict', 'basic')
     */
    preset?: "default" | "strict" | "basic";
    /**
     * - Custom allowed tags (overrides preset)
     */
    allowedTags?: string[];
    /**
     * - Custom allowed attributes (overrides preset)
     */
    allowedAttrs?: string[];
    /**
     * - Allow data-* attributes
     */
    allowDataAttrs?: boolean;
};
/**
 * The sanitise module (`Domma.sanitize`).
 */
export type Sanitize = {
    /**
     * - Sanitise HTML (DOMPurify, or HTML escaping without it)
     */
    sanitise: typeof sanitise;
    /**
     * - Allow only b, i, em, strong, br
     */
    sanitiseBasic: typeof sanitiseBasic;
    /**
     * - Allow only b, i, em, strong, p, br, a, ul, ol, li
     */
    sanitiseUserContent: typeof sanitiseUserContent;
    /**
     * - Escape HTML completely (no tags allowed)
     */
    escape: typeof escape;
    /**
     * - Whether DOMPurify is loaded
     */
    hasDOMPurify: typeof hasDOMPurify;
    /**
     * - Whether a URL is safe to put in an href/src
     */
    isSafeUrl: typeof isSafeUrl;
    /**
     * - The resolved absolute URL when safe, else null
     */
    safeUrl: typeof safeUrl;
};
import { isSafeUrl } from './safe-url.js';
import { safeUrl } from './safe-url.js';
export { isSafeUrl, safeUrl };
