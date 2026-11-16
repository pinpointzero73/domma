/**
 * Escape text for HTML - element content AND quoted attribute values.
 *
 * The textContent -> innerHTML trick several modules used to copy leaves `"` and `'` as they
 * are, so anything placed inside `value="..."` could close the attribute and add its own.
 */

const HTML_ESCAPES = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};

/**
 * @param {*} text - Value to escape (null/undefined become '')
 * @returns {string}
 */
export function escapeHtml(text) {
    if (text == null) return '';
    return String(text).replace(/[&<>"']/g, ch => HTML_ESCAPES[ch]);
}

/**
 * A value for use inside a double-quoted CSS string, as in `[name="..."]`: a
 * quote, backslash or line break in it would otherwise end the string or make
 * the selector invalid.
 *
 * @param {*} value
 * @returns {string}
 */
export function cssString(value) {
    return String(value ?? '')
        .replace(/[\\"]/g, '\\$&')
        .replace(/[\0-\x1f\x7f]/g, ch => `\\${ch.charCodeAt(0).toString(16)} `);
}
