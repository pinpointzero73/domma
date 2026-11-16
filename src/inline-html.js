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
/** Wording is never this long; past it the input is shown as typed, not parsed. */
const MAX_LENGTH = 20000;

/**
 * A form control named "childNodes" or "localName" replaces that property on
 * its form, so the walk reads through the prototypes' own getters and never
 * through a property of the node.
 */
const getter = (proto, name) => {
    const found = Object.getOwnPropertyDescriptor(proto, name)?.get;
    if (!found) throw new Error(`no ${name} getter`);
    return node => found.call(node);
};
let read = null;
function readers() {
    return read || (read = {
        childNodes: getter(Node.prototype, 'childNodes'),
        nodeType: getter(Node.prototype, 'nodeType'),
        nodeValue: getter(Node.prototype, 'nodeValue'),
        localName: getter(Element.prototype, 'localName'),
        namespaceURI: getter(Element.prototype, 'namespaceURI'),
        attr: (el, name) => Element.prototype.getAttribute.call(el, name)
    });
}

function attrsOf(el, tag) {
    let out = '';
    if (tag === 'a') {
        const href = read.attr(el, 'href');
        if (href && followable(href)) out += ` href="${escapeHtml(href)}"`;
        if ((read.attr(el, 'target') || '').toLowerCase() === '_blank') out += ' target="_blank" rel="noopener noreferrer"';
    }
    if (tag === 'a' || tag === 'abbr') {
        const title = read.attr(el, 'title');
        if (title) out += ` title="${escapeHtml(title)}"`;
    }
    return out;
}

function write(node, depth) {
    let out = '';
    for (const child of Array.from(read.childNodes(node))) {
        const type = read.nodeType(child);
        if (type === 3) {
            out += escapeHtml(read.nodeValue(child));
            continue;
        }
        if (type !== 1) continue; // comments, processing instructions
        const tag = read.localName(child);
        if (typeof tag !== 'string' || read.namespaceURI(child) !== HTML_NS || DROPPED.has(tag)) continue;
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
    let text;
    try {
        text = String(html);
    } catch {
        return '';
    }
    // Nothing a parser would read as markup or an entity: plain text, as typed
    if (!/[<&]/.test(text)) return escapeHtml(text);
    if (typeof document === 'undefined' || text.length > MAX_LENGTH) return escapeHtml(text);
    try {
        readers();
        const template = document.createElement('template');
        template.innerHTML = text;
        return write(template.content, 0);
    } catch {
        // Nested past what the walk can follow, or a parser that failed: show it as typed
        return escapeHtml(text);
    }
}

export default cleanInline;
