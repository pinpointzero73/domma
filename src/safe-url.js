/**
 * The one URL check: is this a link a browser can follow without running anything?
 * http(s), mailto, tel, or relative (a path, a query, a fragment). Everything else -
 * javascript:, data:, vbscript:, blob:, unknown schemes - is refused. The URL parser does
 * the reading, so tabs, newlines and odd case inside a scheme ("java\tscript:") do not
 * slip past.
 *
 * Used by the command palette (a command's href) and i18n (data-i18n-attr URL attributes).
 */

const SAFE_PROTOCOL = /^(https?:|mailto:|tel:)$/;

/**
 * @param {string} href
 * @returns {string|null} the resolved absolute URL, or null when it is not safe
 */
export function safeUrl(href) {
    if (!href || typeof href !== 'string') return null;
    try {
        const base = typeof location !== 'undefined' ? location.href : 'http://localhost/';
        const url = new URL(href, base);
        return SAFE_PROTOCOL.test(url.protocol) ? url.href : null;
    } catch {
        return null;
    }
}

/**
 * @param {string} href
 * @returns {boolean}
 */
export function isSafeUrl(href) {
    return safeUrl(href) !== null;
}
