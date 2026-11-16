/**
 * @param {*} text - Value to escape (null/undefined become '')
 * @returns {string}
 */
export function escapeHtml(text: any): string;
/**
 * A value for use inside a double-quoted CSS string, as in `[name="..."]`: a
 * quote, backslash or line break in it would otherwise end the string or make
 * the selector invalid.
 *
 * @param {*} value
 * @returns {string}
 */
export function cssString(value: any): string;
