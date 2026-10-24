/**
 * @param {string} href
 * @returns {string|null} the resolved absolute URL, or null when it is not safe
 */
export function safeUrl(href: string): string | null;
/**
 * @param {string} href
 * @returns {boolean}
 */
export function isSafeUrl(href: string): boolean;
