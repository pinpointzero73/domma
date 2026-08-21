/**
 * Domma Flags Module - TypeScript Declarations
 * Nation flags as inline SVG, keyed by ISO 3166-1 alpha-2 code.
 *
 * Opt-in module: load domma-flags.min.js after domma.min.js.
 * Exposes the FL global and Domma.flags / Domma.FL.
 */

export type FlagRegion = 'europe' | 'americas' | 'africa' | 'asia' | 'oceania' | string;

export type FlagShape = 'rect' | 'rounded' | 'square' | 'circle';

/** A single overlay primitive used to compose a flag. */
export interface FlagOverlay {
    type: 'rect' | 'circle' | 'ellipse' | 'line' | 'path' | 'star' | 'crescent' | 'group';
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    [key: string]: unknown;
}

/** A flag definition - either raw SVG markup or a compact descriptor. */
export interface FlagDefinition {
    /** Country name */
    name: string;
    /** Region group (defaults to 'custom' when registered) */
    region?: FlagRegion;
    /** Raw inner SVG markup (60×40 canvas) */
    svg?: string;
    /** Solid background colour */
    bg?: string;
    /** Stripe descriptor */
    stripes?: {
        dir?: 'h' | 'v';
        colors: string[];
        weights?: number[];
    };
    /** Nordic (offset) cross descriptor */
    cross?: {
        bg: string;
        colour: string;
        border?: string;
        thickness?: number;
    };
    /** Overlay primitives drawn on top */
    overlays?: FlagOverlay[];
}

/** Options for rendering a flag. */
export interface FlagRenderOptions {
    /** Height in px; width follows the 3:2 aspect (default 24) */
    size?: number;
    /** Explicit width override */
    width?: number;
    /** Explicit height override */
    height?: number;
    /** Output shape (default 'rect') */
    shape?: FlagShape;
    /** Add a hairline border; pass a colour string to customise */
    border?: boolean | string;
    /** Extra CSS classes */
    class?: string;
    /** Accessible title (defaults to the country name) */
    title?: string;
    /** Additional SVG attributes */
    attrs?: Record<string, string>;
}

export interface FlagInjectOptions extends FlagRenderOptions {
    /** Where to place the flag relative to the target (default 'prepend') */
    position?: 'prepend' | 'append' | 'replace';
}

export interface FlagRegionMeta {
    name: string;
    description?: string;
    codes: string[];
}

/** The flag registry (FL / Domma.flags). */
export interface Flags {
    /** Render a flag as an SVG element. */
    render(code: string, options?: FlagRenderOptions): SVGElement | null;

    /** Get a flag as an HTML string. */
    html(code: string, options?: FlagRenderOptions): string;

    /** Inject a flag into a target element or selector. */
    inject(target: string | HTMLElement, code: string, options?: FlagInjectOptions): SVGElement | null;

    /** Replace all [data-flag] elements within a container with SVGs. */
    scan(container?: HTMLElement | string): number;

    /** Register (or override) a flag. */
    register(code: string, definition: FlagDefinition): Flags;

    /** Remove a registered flag. */
    unregister(code: string): boolean;

    /** Whether a flag exists. */
    has(code: string): boolean;

    /** Get a flag definition. */
    get(code: string): FlagDefinition | null;

    /** Get the country name for a code. */
    name(code: string): string | null;

    /** List flag codes, optionally filtered by region. */
    list(region?: FlagRegion): string[];

    /** List all regions with metadata. */
    listRegions(): Record<string, FlagRegionMeta>;

    /** Total number of flags. */
    count(): number;

    /** Search flags by code or country name. */
    search(query: string): string[];
}

export const flags: Flags;

declare global {
    /**
     * FL - Domma Flags (opt-in module)
     * Nation flags as inline SVG, keyed by ISO 3166-1 alpha-2 code.
     */
    const FL: Flags;
}
