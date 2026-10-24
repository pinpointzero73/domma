/**
 * Read the arrow and halo colours from the live theme.
 * @param {Document} [doc]
 * @returns {{fill: string, halo: string}}
 */
export function resolveCursorColours(doc?: Document): {
    fill: string;
    halo: string;
};
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
export function cursorSvg({ size, fill, halo }?: {
    size?: number;
    fill?: string;
    halo?: string;
}): string;
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
export function cursorValue(options?: any): string;
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
export function setCursorRule(id: string | number, selector: string, spec: {
    kind: "glyph" | "keyword" | "custom";
    size?: number;
    value?: string;
}): void;
/** Drop one menu's rule. Called from ContextMenu#destroy. */
export function clearCursorRule(id: any): void;
/** Test seam: forget every rule and detach the theme listener. */
export function _resetCursorRules(): void;
/** The size that read best in testing. Browsers cap cursors at 128px and
 *  recommend 32; past about 30 it stops reading as a pointer. */
export const DEFAULT_CURSOR_SIZE: 26;
declare namespace _default {
    export { cursorSvg };
    export { cursorValue };
    export { resolveCursorColours };
    export { setCursorRule };
    export { clearCursorRule };
    export { DEFAULT_CURSOR_SIZE };
}
export default _default;
