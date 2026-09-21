/**
 * Domma ContextMenu - cursor affordance
 *
 * A right-click menu is invisible until someone right-clicks. This draws the
 * pointer that says a region has one: an arrow with the three-rule glyph from
 * Domma's own `list` icon parked at its lower right.
 *
 * WHY THIS IS NOT JUST `cursor: context-menu`
 *
 * CSS has a keyword for exactly this, and it is the right default - it costs
 * nothing, it can never be wrong, and it honours the viewer's own cursor theme,
 * including an enlarged pointer set for low vision that a fixed-size image
 * would silently override with something smaller. The catch is that on Windows
 * the contextual-menu cursor is by platform convention identical to the normal
 * arrow, so a large share of users see no change at all. Hence: keyword by
 * default, this as an opt-in for interfaces that need the affordance to land.
 *
 * WHY A STYLESHEET RULE RATHER THAN A STYLE ATTRIBUTE
 *
 * Two reasons, and both bite.
 *
 * ContextMenu resolves `match` live against the event target rather than
 * snapshotting elements, precisely so that rows rendered long after the menu
 * was declared are still covered. A class or inline style applied at bind time
 * would miss every one of them. A rule composed from selector + match covers
 * them for free, with no observer.
 *
 * And a data URI carries characters - quotes, parentheses, apostrophes - that
 * terminate an HTML attribute or a url() early. `cursor: url("data:...")`
 * inside `style="..."` is silently truncated by the parser and the cursor never
 * appears, which is a genuinely baffling ten minutes. See `encodeSvg`.
 *
 * WHY THE COLOURS ARE READ FROM THE THEME
 *
 * A cursor image is its own document: it cannot inherit `currentColor`, so the
 * colours have to be baked in. Baking one set would make the cursor invisible
 * on roughly half of Domma's themes. Instead the arrow takes `--dm-text` and
 * its halo takes `--dm-text-inverse` - a pair every theme defines - and the
 * rules are regenerated when the theme changes.
 */

import {theme} from './theme.js';

/** The size that read best in testing. Browsers cap cursors at 128px and
 *  recommend 32; past about 30 it stops reading as a pointer. */
export const DEFAULT_CURSOR_SIZE = 26;

const MAX_CURSOR_SIZE = 32;
const STYLE_ID = 'dm-context-cursor-rules';

// Used when there is no document to read tokens from, or a theme that somehow
// defines neither token: a near-black arrow with a white halo.
const FALLBACK = {fill: '#111827', halo: '#ffffff'};

// Classic pointer, tip at 1,1 so the outline stroke has room inside the box.
const ARROW = 'M1,1 L1,17 L5.2,12.9 L8,19 L10.6,17.7 L7.9,11.8 L13.6,11.6 Z';

// Three rules and their leading dots, from the `list` icon, scaled down and
// parked at the lower right.
const ROWS = [15.5, 18.5, 21.5];

/**
 * encodeURIComponent leaves ' ( ) * ! alone. Any of them can close a url() or
 * an attribute early depending on where the value lands, so they go too. The
 * result is safe in a stylesheet rule, in a style attribute, and under either
 * quoting style.
 */
function encodeSvg(svg) {
    return encodeURIComponent(svg)
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/!/g, '%21');
}

/**
 * Read the arrow and halo colours from the live theme.
 * @param {Document} [doc]
 * @returns {{fill: string, halo: string}}
 */
export function resolveCursorColours(doc = typeof document !== 'undefined' ? document : null) {
    if (!doc || !doc.documentElement || typeof getComputedStyle !== 'function') {
        return {...FALLBACK};
    }
    let styles;
    try {
        styles = getComputedStyle(doc.documentElement);
    } catch {
        return {...FALLBACK};
    }
    const fill = (styles.getPropertyValue('--dm-text') || '').trim();
    const halo = (styles.getPropertyValue('--dm-text-inverse') || '').trim();
    return {
        fill: fill || FALLBACK.fill,
        halo: halo || FALLBACK.halo
    };
}

/**
 * The cursor as an SVG string.
 *
 * Chrome ignores an SVG cursor with no natural size, so width and height are
 * explicit on the root and the geometry lives in a fixed viewBox.
 *
 * @param {Object} [options]
 * @param {number} [options.size=26]
 * @param {string} [options.fill]  arrow body
 * @param {string} [options.halo]  outline and glyph backing
 * @returns {string}
 */
export function cursorSvg({size = DEFAULT_CURSOR_SIZE, fill, halo} = {}) {
    const colours = (fill && halo) ? {fill, halo} : {...resolveCursorColours(), ...(fill ? {fill} : {}), ...(halo ? {halo} : {})};
    const px = Math.max(12, Math.min(MAX_CURSOR_SIZE, Number(size) || DEFAULT_CURSOR_SIZE));

    const line = (y, colour, width) =>
        `<path d="M17.2 ${y}h5.4" stroke="${colour}" stroke-width="${width}" stroke-linecap="round"/>`;
    const dot = (y, colour, width) =>
        `<path d="M14.4 ${y}h.01" stroke="${colour}" stroke-width="${width}" stroke-linecap="round"/>`;

    const backing = ROWS.map((y) => dot(y, colours.halo, 3.6) + line(y, colours.halo, 3.4)).join('');
    const marks = ROWS.map((y) => dot(y, colours.fill, 1.9) + line(y, colours.fill, 1.7)).join('');

    return [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 26 26">`,
        `<path d="${ARROW}" fill="${colours.halo}" stroke="${colours.halo}" stroke-width="2.6" stroke-linejoin="round"/>`,
        `<path d="${ARROW}" fill="${colours.fill}"/>`,
        backing,
        marks,
        '</svg>'
    ].join('');
}

/**
 * The full CSS `cursor` value, keyword fallback included.
 *
 * The fallback is not optional decoration: the spec requires a keyword at the
 * end of the list, and `context-menu` is the one that means this, so both
 * options ship in a single declaration and the keyword covers anything that
 * refuses the image.
 *
 * @param {Object} [options] see cursorSvg
 * @returns {string}
 */
export function cursorValue(options = {}) {
    return `url('data:image/svg+xml,${encodeSvg(cursorSvg(options))}') 1 1, context-menu`;
}

// ---- the shared stylesheet ---------------------------------------------

/** id -> {selector, size} for every instance that asked for a glyph cursor. */
const glyphRules = new Map();

/** id -> {selector, value} for keyword and verbatim cursors, which never change. */
const staticRules = new Map();

let themeUnsubscribe = null;

function styleEl() {
    if (typeof document === 'undefined') return null;
    let el = document.getElementById(STYLE_ID);
    if (!el) {
        el = document.createElement('style');
        el.id = STYLE_ID;
        document.head.appendChild(el);
    }
    return el;
}

/**
 * A custom cursor bakes in a colour, so it cannot answer a forced-colours
 * palette. Under high contrast the image is dropped and the keyword stands in.
 */
function ruleText(selector, value) {
    return `${selector}{cursor:${value};}`
        + `@media (forced-colors:active){${selector}{cursor:context-menu;}}`;
}

function render() {
    const el = styleEl();
    if (!el) return;

    if (!glyphRules.size && !staticRules.size) {
        el.textContent = '';
        return;
    }

    const colours = resolveCursorColours();
    const out = [];
    staticRules.forEach(({selector, value}) => out.push(ruleText(selector, value)));
    glyphRules.forEach(({selector, size}) => {
        out.push(ruleText(selector, cursorValue({size, ...colours})));
    });
    el.textContent = out.join('\n');
}

/**
 * Regenerate every glyph cursor against the current theme. Registered once,
 * the first time a glyph rule is added, and dropped again when the last one
 * goes - a page with no glyph cursors holds no theme listener.
 */
function syncThemeSubscription() {
    if (glyphRules.size && !themeUnsubscribe) {
        themeUnsubscribe = theme.onChange(() => render());
    } else if (!glyphRules.size && themeUnsubscribe) {
        themeUnsubscribe();
        themeUnsubscribe = null;
    }
}

/**
 * Add or replace one menu's cursor rule.
 *
 * @param {string|number} id        unique per instance
 * @param {string} selector         the CSS selector the rule applies to
 * @param {Object} spec
 * @param {'glyph'|'keyword'|'custom'} spec.kind
 * @param {number} [spec.size]      glyph only
 * @param {string} [spec.value]     custom only, used verbatim
 */
export function setCursorRule(id, selector, spec) {
    if (!selector) return;
    glyphRules.delete(id);
    staticRules.delete(id);

    if (spec.kind === 'glyph') {
        glyphRules.set(id, {selector, size: spec.size || DEFAULT_CURSOR_SIZE});
    } else if (spec.kind === 'keyword') {
        staticRules.set(id, {selector, value: 'context-menu'});
    } else if (spec.kind === 'custom' && spec.value) {
        staticRules.set(id, {selector, value: spec.value});
    }

    syncThemeSubscription();
    render();
}

/** Drop one menu's rule. Called from ContextMenu#destroy. */
export function clearCursorRule(id) {
    const had = glyphRules.delete(id) || staticRules.delete(id);
    if (!had) return;
    syncThemeSubscription();
    render();
}

/** Test seam: forget every rule and detach the theme listener. */
export function _resetCursorRules() {
    glyphRules.clear();
    staticRules.clear();
    syncThemeSubscription();
    const el = typeof document !== 'undefined' ? document.getElementById(STYLE_ID) : null;
    if (el) el.remove();
}

export default {
    cursorSvg,
    cursorValue,
    resolveCursorColours,
    setCursorRule,
    clearCursorRule,
    DEFAULT_CURSOR_SIZE
};
