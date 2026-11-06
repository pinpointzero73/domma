/**
 * Region group a flag is listed under; registered flags default to 'custom'.
 * @typedef {'europe'|'americas'|'africa'|'asia'|'oceania'|'custom'|(string & {})} FlagRegion
 */
/** @typedef {'rect'|'rounded'|'square'|'circle'} FlagShape */
/**
 * A single overlay primitive used to compose a flag (on the 60x40 canvas). Which coordinates
 * are read depends on `type`: rect (x, y, w, h, rx), circle (cx, cy, r), ellipse (cx, cy, rx, ry),
 * line (x1, y1, x2, y2), path (d), star (cx, cy, r, points, innerRatio, rotation),
 * crescent (cx, cy, r, off), group (transform, children).
 * @typedef {object} FlagOverlay
 * @property {'rect'|'circle'|'ellipse'|'line'|'path'|'star'|'crescent'|'group'} type
 * @property {string} [fill]
 * @property {string} [stroke]
 * @property {number} [strokeWidth]
 * @property {number} [x]
 * @property {number} [y]
 * @property {number} [w]
 * @property {number} [h]
 * @property {number} [rx]
 * @property {number} [ry]
 * @property {number} [cx]
 * @property {number} [cy]
 * @property {number} [r]
 * @property {number} [x1]
 * @property {number} [y1]
 * @property {number} [x2]
 * @property {number} [y2]
 * @property {string} [d] Path data
 * @property {number} [points] Star points (default 5)
 * @property {number} [innerRatio] Star inner radius as a fraction of outer (default 0.382)
 * @property {number} [rotation] Star rotation in degrees (default -90, pointing up)
 * @property {number} [off] Crescent carving-circle offset
 * @property {string} [transform] Group transform
 * @property {FlagOverlay[]} [children] Group members
 */
/**
 * A flag definition - either raw SVG markup or a compact descriptor.
 * @typedef {object} FlagDefinition
 * @property {string} name Country name
 * @property {FlagRegion} [region] Region group (defaults to 'custom' when registered)
 * @property {string} [svg] Raw inner SVG markup (60x40 canvas)
 * @property {string} [bg] Solid background colour
 * @property {{dir?: 'h'|'v', colors: string[], weights?: number[]}} [stripes] Stripe descriptor
 * @property {{bg: string, colour: string, border?: string, thickness?: number}} [cross] Nordic (offset) cross descriptor
 * @property {FlagOverlay[]} [overlays] Overlay primitives drawn on top
 */
/**
 * Options for rendering a flag.
 * @typedef {object} FlagRenderOptions
 * @property {number} [size=24] Height in px (width follows aspect)
 * @property {number} [width] Explicit width override
 * @property {number} [height] Explicit height override
 * @property {FlagShape} [shape='rect'] Output shape
 * @property {boolean|string} [border=false] Add a hairline border (or colour)
 * @property {string} [class] Extra CSS classes
 * @property {string|null} [title] Accessible title (defaults to country name)
 * @property {Record<string, string>} [attrs] Additional attributes
 */
/**
 * Options for `inject()`.
 * @typedef {FlagRenderOptions & {position?: 'prepend'|'append'|'replace'}} FlagInjectOptions
 */
/**
 * @typedef {object} FlagRegionMeta
 * @property {string} name
 * @property {string} [description]
 * @property {string[]} codes
 */
/** The flag registry (FL / Domma.flags). @typedef {FlagRegistry} Flags */
/**
 * Generate an n-pointed star path.
 * @param {number} cx - Centre x
 * @param {number} cy - Centre y
 * @param {number} outerR - Outer radius
 * @param {number} [points=5] - Number of points
 * @param {number} [innerRatio=0.382] - Inner radius as a fraction of outer
 * @param {number} [rotation=-90] - Rotation in degrees (-90 points up)
 * @returns {string} SVG path data
 */
export function starPath(cx: number, cy: number, outerR: number, points?: number, innerRatio?: number, rotation?: number): string;
/**
 * Generate a crescent path (a lune) opening towards the fly (right).
 * The inner arc passes through the top and bottom of the outer circle.
 * @param {number} cx - Outer circle centre x
 * @param {number} cy - Outer circle centre y
 * @param {number} r - Outer radius
 * @param {number} [off=r*0.45] - Horizontal offset of the carving circle
 * @returns {string} SVG path data
 */
export function crescentPath(cx: number, cy: number, r: number, off?: number): string;
export default flags;
/**
 * Region group a flag is listed under; registered flags default to 'custom'.
 */
export type FlagRegion = "europe" | "americas" | "africa" | "asia" | "oceania" | "custom" | (string & {});
export type FlagShape = "rect" | "rounded" | "square" | "circle";
/**
 * A single overlay primitive used to compose a flag (on the 60x40 canvas). Which coordinates
 * are read depends on `type`: rect (x, y, w, h, rx), circle (cx, cy, r), ellipse (cx, cy, rx, ry),
 * line (x1, y1, x2, y2), path (d), star (cx, cy, r, points, innerRatio, rotation),
 * crescent (cx, cy, r, off), group (transform, children).
 */
export type FlagOverlay = {
    type: "rect" | "circle" | "ellipse" | "line" | "path" | "star" | "crescent" | "group";
    fill?: string | undefined;
    stroke?: string | undefined;
    strokeWidth?: number | undefined;
    x?: number | undefined;
    y?: number | undefined;
    w?: number | undefined;
    h?: number | undefined;
    rx?: number | undefined;
    ry?: number | undefined;
    cx?: number | undefined;
    cy?: number | undefined;
    r?: number | undefined;
    x1?: number | undefined;
    y1?: number | undefined;
    x2?: number | undefined;
    y2?: number | undefined;
    /**
     * Path data
     */
    d?: string | undefined;
    /**
     * Star points (default 5)
     */
    points?: number | undefined;
    /**
     * Star inner radius as a fraction of outer (default 0.382)
     */
    innerRatio?: number | undefined;
    /**
     * Star rotation in degrees (default -90, pointing up)
     */
    rotation?: number | undefined;
    /**
     * Crescent carving-circle offset
     */
    off?: number | undefined;
    /**
     * Group transform
     */
    transform?: string | undefined;
    /**
     * Group members
     */
    children?: FlagOverlay[] | undefined;
};
/**
 * A flag definition - either raw SVG markup or a compact descriptor.
 */
export type FlagDefinition = {
    /**
     * Country name
     */
    name: string;
    /**
     * Region group (defaults to 'custom' when registered)
     */
    region?: FlagRegion | undefined;
    /**
     * Raw inner SVG markup (60x40 canvas)
     */
    svg?: string | undefined;
    /**
     * Solid background colour
     */
    bg?: string | undefined;
    /**
     * Stripe descriptor
     */
    stripes?: {
        dir?: "h" | "v";
        colors: string[];
        weights?: number[];
    } | undefined;
    /**
     * Nordic (offset) cross descriptor
     */
    cross?: {
        bg: string;
        colour: string;
        border?: string;
        thickness?: number;
    } | undefined;
    /**
     * Overlay primitives drawn on top
     */
    overlays?: FlagOverlay[] | undefined;
};
/**
 * Options for rendering a flag.
 */
export type FlagRenderOptions = {
    /**
     * Height in px (width follows aspect)
     */
    size?: number | undefined;
    /**
     * Explicit width override
     */
    width?: number | undefined;
    /**
     * Explicit height override
     */
    height?: number | undefined;
    /**
     * Output shape
     */
    shape?: FlagShape | undefined;
    /**
     * Add a hairline border (or colour)
     */
    border?: string | boolean | undefined;
    /**
     * Extra CSS classes
     */
    class?: string | undefined;
    /**
     * Accessible title (defaults to country name)
     */
    title?: string | null | undefined;
    /**
     * Additional attributes
     */
    attrs?: Record<string, string> | undefined;
};
/**
 * Options for `inject()`.
 */
export type FlagInjectOptions = FlagRenderOptions & {
    position?: "prepend" | "append" | "replace";
};
export type FlagRegionMeta = {
    name: string;
    description?: string | undefined;
    codes: string[];
};
/**
 * The flag registry (FL / Domma.flags).
 */
export type Flags = FlagRegistry;
export const flags: FlagRegistry;
export class FlagRegistry {
    /** @type {Record<string, FlagDefinition>} @private */
    private _flags;
    /** @type {Record<string, FlagRegionMeta>} @private */
    private _regions;
    /** @type {Record<string, string|null>} @private */
    private _cache;
    /** @private @param {string} code @returns {string|null} */
    private _markup;
    /**
     * Render a flag as an SVG element.
     * @param {string} code - ISO 3166-1 alpha-2 code (case-insensitive)
     * @param {FlagRenderOptions} [options]
     * @returns {SVGElement|null}
     */
    render(code: string, options?: FlagRenderOptions): SVGElement | null;
    /**
     * Get a flag as an HTML string.
     * @param {string} code
     * @param {FlagRenderOptions} [options] - Same as render()
     * @returns {string}
     */
    html(code: string, options?: FlagRenderOptions): string;
    /**
     * Inject a flag into an element.
     * @param {string|HTMLElement} target
     * @param {string} code
     * @param {FlagInjectOptions} [options] - Same as render(), plus position: 'prepend' (default) | 'append' | 'replace'
     * @returns {SVGElement|null}
     */
    inject(target: string | HTMLElement, code: string, options?: FlagInjectOptions): SVGElement | null;
    /**
     * Scan a container for [data-flag] elements and replace them with SVGs.
     * Supported attributes: data-flag, data-flag-size, data-flag-shape,
     * data-flag-class, data-flag-border, data-flag-title.
     * @param {Element|Document|DocumentFragment|string} [container=document]
     * @returns {number} Number of flags replaced
     */
    scan(container?: Element | Document | DocumentFragment | string): number;
    /**
     * Register a custom flag (or override an existing one).
     * @param {string} code - ISO alpha-2 code
     * @param {FlagDefinition} definition - { name, region?, svg? | stripes?/cross?/bg?/overlays? }
     * @returns {this}
     */
    register(code: string, definition: FlagDefinition): this;
    /**
     * Remove a registered flag.
     * @param {string} code
     * @returns {boolean}
     */
    unregister(code: string): boolean;
    /**
     * Check whether a flag exists.
     * @param {string} code
     * @returns {boolean}
     */
    has(code: string): boolean;
    /**
     * Get a flag definition.
     * @param {string} code
     * @returns {FlagDefinition|null}
     */
    get(code: string): FlagDefinition | null;
    /**
     * Get the country name for a code.
     * @param {string} code
     * @returns {string|null}
     */
    name(code: string): string | null;
    /**
     * List flag codes, optionally filtered by region.
     * @param {FlagRegion|null} [region]
     * @returns {string[]}
     */
    list(region?: FlagRegion | null): string[];
    /**
     * List all regions with metadata.
     * @returns {Record<string, FlagRegionMeta>}
     */
    listRegions(): Record<string, FlagRegionMeta>;
    /**
     * Total number of flags.
     * @returns {number}
     */
    count(): number;
    /**
     * Search flags by code or country name.
     * @param {string} query
     * @returns {string[]} Matching codes
     */
    search(query: string): string[];
}
