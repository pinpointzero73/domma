/**
 * Inline HTML an author may write in a form's own wording - a helper line, a
 * checkbox label ("I agree to the <a>terms</a>"), a wizard step's title - cleaned
 * to a short list of inline tags. Needs no library: the markup is read by the
 * browser's own parser in an inert <template> (nothing loads or runs there) and
 * the result is written out again from scratch, so only the tags and attributes
 * listed here can come out, whatever went in.
 *
 * Kept: a (href, title, target="_blank"), abbr (title), b, strong, i, em, u, s,
 * del, ins, small, mark, code, kbd, sub, sup, span, br. Any other element gives
 * way to its own text; script, style and the like are dropped with what they hold.
 */

import {escapeHtml} from './escape.js';

const KEPT = new Set(['a', 'abbr', 'b', 'strong', 'i', 'em', 'u', 's', 'del', 'ins', 'small', 'mark', 'code', 'kbd', 'sub', 'sup', 'span', 'br']);

/**
 * Elements whose content is not wording: dropped whole. A form is among them
 * because a control named "childNodes" inside one replaces that property.
 */
const DROPPED = new Set(['form', 'script', 'style', 'template', 'noscript', 'iframe', 'frame', 'frameset', 'object', 'embed', 'applet',
    'svg', 'math', 'title', 'head', 'textarea', 'select', 'option', 'button', 'input', 'audio', 'video', 'canvas', 'noembed', 'noframes', 'xmp', 'plaintext']);

/**
 * http(s), mailto, tel, or relative. Read against a fixed web address, not the
 * page's own, so a relative link is kept on a page opened from a file as well.
 */
function followable(href) {
    try {
        return /^(https?:|mailto:|tel:)$/.test(new URL(href, 'http://relative.invalid/').protocol);
    } catch {
        return false;
    }
}

const HTML_NS = 'http://www.w3.org/1999/xhtml';
const MAX_DEPTH = 32;

function attrsOf(el, tag) {
    let out = '';
    if (tag === 'a') {
        const href = el.getAttribute('href');
        if (href && followable(href)) out += ` href="${escapeHtml(href)}"`;
        if ((el.getAttribute('target') || '').toLowerCase() === '_blank') out += ' target="_blank" rel="noopener noreferrer"';
    }
    if (tag === 'a' || tag === 'abbr') {
        const title = el.getAttribute('title');
        if (title) out += ` title="${escapeHtml(title)}"`;
    }
    return out;
}

function write(node, depth) {
    let out = '';
    for (const child of node.childNodes) {
        if (child.nodeType === 3) {
            out += escapeHtml(child.nodeValue);
            continue;
        }
        if (child.nodeType !== 1) continue; // comments, processing instructions
        const tag = child.localName;
        if (child.namespaceURI !== HTML_NS || DROPPED.has(tag)) continue;
        // Past the depth limit the wording is kept and the tags are not
        const inner = write(child, depth + 1);
        if (!KEPT.has(tag) || depth >= MAX_DEPTH) {
            out += inner;
        } else if (tag === 'br') {
            out += '<br>';
        } else {
            out += `<${tag}${attrsOf(child, tag)}>${inner}</${tag}>`;
        }
    }
    return out;
}

/**
 * @param {*} html - Author-written inline HTML (null/undefined become '')
 * @returns {string} HTML holding only the inline tags above
 */
export function cleanInline(html) {
    if (html == null || html === '') return '';
    const text = String(html);
    // Nothing a parser would read as markup or an entity: plain text, as typed
    if (!/[<&]/.test(text)) return escapeHtml(text);
    if (typeof document === 'undefined') return escapeHtml(text);
    try {
        const template = document.createElement('template');
        template.innerHTML = text;
        return write(template.content, 0);
    } catch {
        // Nested past what the walk can follow, or a parser that failed: show it as typed
        return escapeHtml(text);
    }
}

export default cleanInline;
