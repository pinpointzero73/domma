/**
 * HTML Sanitisation Module
 * Provides XSS protection for DOM manipulation
 *
 * SECURITY: This module is critical for preventing XSS attacks
 * - Uses DOMPurify when available for robust sanitisation
 * - Falls back to HTML escaping when DOMPurify is not present
 * - Provides configurable allowlists for different use cases
 */

/**
 * Basic HTML escape function (fallback when DOMPurify not available)
 * Escapes HTML special characters to prevent XSS
 *
 * @param {string} html - HTML string to escape
 * @returns {string} - Escaped HTML safe for insertion
 */
function escapeHtml(html) {
    if (html == null) return '';

    const div = document.createElement('div');
    div.textContent = String(html);
    return div.innerHTML;
}

/**
 * Check if DOMPurify is available
 * @returns {boolean}
 */
function isDOMPurifyAvailable() {
    return typeof window !== 'undefined' &&
           typeof window.DOMPurify !== 'undefined';
}

/**
 * Default configuration for DOMPurify
 */
const DEFAULT_CONFIG = {
    ALLOWED_TAGS: [
        // Text formatting
        'b', 'i', 'em', 'strong', 'u', 's', 'mark', 'small', 'del', 'ins', 'sub', 'sup',
        // Structure
        'p', 'br', 'hr', 'div', 'span', 'blockquote', 'pre', 'code',
        // Lists
        'ul', 'ol', 'li', 'dl', 'dt', 'dd',
        // Headings
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        // Links
        'a',
        // Tables
        'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'col', 'colgroup',
        // Media (safe subset)
        'img', 'figure', 'figcaption',
        // Semantic
        'article', 'section', 'nav', 'aside', 'header', 'footer', 'main', 'time', 'address'
    ],
    ALLOWED_ATTR: [
        'href', 'title', 'target', 'rel',
        'class', 'id',
        'alt', 'src', 'width', 'height',
        'colspan', 'rowspan',
        'aria-label', 'aria-describedby', 'aria-hidden',
        'role'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SAFE_FOR_TEMPLATES: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    FORCE_BODY: true
};

/**
 * Strict configuration (for user-generated content)
 */
const STRICT_CONFIG = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title', 'target'],
    ALLOW_DATA_ATTR: false
};

/**
 * Basic configuration (minimal HTML)
 */
const BASIC_CONFIG = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false
};

/**
 * Sanitisation presets
 */
const PRESETS = {
    default: DEFAULT_CONFIG,
    strict: STRICT_CONFIG,
    basic: BASIC_CONFIG
};

/**
 * Main sanitisation function
 *
 * @param {string} html - HTML string to sanitise
 * @param {Object} options - Sanitisation options
 * @param {string} options.preset - Preset name ('default', 'strict', 'basic')
 * @param {Array} options.allowedTags - Custom allowed tags (overrides preset)
 * @param {Array} options.allowedAttrs - Custom allowed attributes (overrides preset)
 * @param {boolean} options.allowDataAttrs - Allow data-* attributes
 * @returns {string} - Sanitised HTML
 */
export function sanitise(html, options = {}) {
    if (html == null || html === '') {
        return '';
    }

    // Convert to string
    html = String(html);

    // If DOMPurify is available, use it
    if (isDOMPurifyAvailable()) {
        // Get preset config
        const preset = options.preset || 'default';
        const baseConfig = PRESETS[preset] || DEFAULT_CONFIG;

        // Merge with custom options
        const config = {
            ...baseConfig,
            ...(options.allowedTags && { ALLOWED_TAGS: options.allowedTags }),
            ...(options.allowedAttrs && { ALLOWED_ATTR: options.allowedAttrs }),
            ...(options.allowDataAttrs !== undefined && { ALLOW_DATA_ATTR: options.allowDataAttrs })
        };

        try {
            return window.DOMPurify.sanitize(html, config);
        } catch (error) {
            console.error('DOMPurify sanitisation failed:', error);
            // Fall back to escape
            return escapeHtml(html);
        }
    }

    // Fallback: HTML escape
    console.warn('DOMPurify not available. Using HTML escape fallback. For better XSS protection, include DOMPurify.');
    return escapeHtml(html);
}

/**
 * Sanitise for basic text with minimal formatting
 * Only allows: b, i, em, strong, br
 *
 * @param {string} html - HTML string to sanitise
 * @returns {string} - Sanitised HTML
 */
export function sanitiseBasic(html) {
    return sanitise(html, { preset: 'basic' });
}

/**
 * Sanitise for user-generated content (strict)
 * Only allows: b, i, em, strong, p, br, a, ul, ol, li
 *
 * @param {string} html - HTML string to sanitise
 * @returns {string} - Sanitised HTML
 */
export function sanitiseUserContent(html) {
    return sanitise(html, { preset: 'strict' });
}

/**
 * Escape HTML completely (no tags allowed)
 * Use for plain text that should be displayed as-is
 *
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export function escape(text) {
    return escapeHtml(text);
}

/**
 * Check if DOMPurify is loaded
 * @returns {boolean}
 */
export function hasDOMPurify() {
    return isDOMPurifyAvailable();
}

/**
 * Install warning if DOMPurify is not present
 */
if (typeof window !== 'undefined' && !isDOMPurifyAvailable()) {
    console.warn(
        '%c⚠️ Security Warning: DOMPurify not loaded',
        'color: orange; font-weight: bold; font-size: 14px;',
        '\nFor robust XSS protection, include DOMPurify before Domma:',
        '\n<script src="https://cdn.jsdelivr.net/npm/dompurify@3/dist/purify.min.js"></script>',
        '\nCurrently using HTML escape fallback.'
    );
}

// Export default sanitise function
export default {
    sanitise,
    sanitiseBasic,
    sanitiseUserContent,
    escape,
    hasDOMPurify
};
