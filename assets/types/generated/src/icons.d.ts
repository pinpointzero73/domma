export default icons;
/**
 * Built-in icon categories (keys of `listCategories()`); `custom` appears once an icon is registered.
 */
export type IconCategory = "ui" | "communication" | "media" | "files" | "social" | "commerce" | "status" | "navigation" | "seasonal" | "weather" | "devices" | "finance" | "health" | "sport" | "buildings" | "emojis" | "transport" | "code" | "forms" | "custom";
/**
 * A category entry as returned by `listCategories()`.
 */
export type IconCategoryInfo = {
    /**
     * Display name
     */
    name: string;
    description: string;
    /**
     * Icon names in the category
     */
    icons: string[];
};
/**
 * An icon: SVG path data plus the attributes put on the `<svg>`.
 */
export type IconDefinition = {
    /**
     * SVG viewBox (default '0 0 24 24')
     */
    viewBox?: string;
    /**
     * Single path data
     */
    path?: string;
    /**
     * Multiple path data
     */
    paths?: string[];
    /**
     * Stroke colour (usually 'currentColor')
     */
    stroke?: string;
    /**
     * Fill colour ('none', or 'currentColor' for filled icons)
     */
    fill?: string;
    /**
     * Stroke width
     */
    strokeWidth?: number | string;
    strokeLinecap?: string;
    strokeLinejoin?: string;
};
/**
 * Options for `render()`, `html()` and `use()` (`use()` reads only `size` and `class`).
 */
export type RenderOptions = {
    /**
     * Icon size in pixels
     */
    size?: number | string;
    /**
     * Additional CSS classes
     */
    class?: string;
    /**
     * Icon colour (overrides currentColor)
     */
    colour?: string;
    /**
     * Alias for colour
     */
    color?: string;
    /**
     * Additional attributes
     */
    attrs?: Record<string, string>;
};
/**
 * Options for `inject()`: render options plus where the icon goes.
 */
export type IconInjectOptions = RenderOptions & {
    position?: "prepend" | "append" | "replace";
};
export type Icons = IconRegistry;
export const icons: IconRegistry;
/**
 * Built-in icon categories (keys of `listCategories()`); `custom` appears once an icon is registered.
 * @typedef {'ui'|'communication'|'media'|'files'|'social'|'commerce'|'status'|'navigation'|'seasonal'|'weather'|'devices'|'finance'|'health'|'sport'|'buildings'|'emojis'|'transport'|'code'|'forms'|'custom'} IconCategory
 */
/**
 * A category entry as returned by `listCategories()`.
 * @typedef {object} IconCategoryInfo
 * @property {string} name Display name
 * @property {string} description
 * @property {string[]} icons Icon names in the category
 */
/**
 * An icon: SVG path data plus the attributes put on the `<svg>`.
 * @typedef {object} IconDefinition
 * @property {string} [viewBox] SVG viewBox (default '0 0 24 24')
 * @property {string} [path] Single path data
 * @property {string[]} [paths] Multiple path data
 * @property {string} [stroke] Stroke colour (usually 'currentColor')
 * @property {string} [fill] Fill colour ('none', or 'currentColor' for filled icons)
 * @property {number|string} [strokeWidth] Stroke width
 * @property {string} [strokeLinecap]
 * @property {string} [strokeLinejoin]
 */
/**
 * Options for `render()`, `html()` and `use()` (`use()` reads only `size` and `class`).
 * @typedef {object} RenderOptions
 * @property {number|string} [size=24] Icon size in pixels
 * @property {string} [class] Additional CSS classes
 * @property {string} [colour] Icon colour (overrides currentColor)
 * @property {string} [color] Alias for colour
 * @property {Record<string, string>} [attrs] Additional attributes
 */
/**
 * Options for `inject()`: render options plus where the icon goes.
 * @typedef {RenderOptions & {position?: 'prepend'|'append'|'replace'}} IconInjectOptions
 */
/** @typedef {IconRegistry} Icons */
export class IconRegistry {
    /** @type {Record<string, IconDefinition>} @private */
    private _icons;
    /** @type {Partial<Record<IconCategory, IconCategoryInfo>>} @private */
    private _categories;
    /**
     * Render an icon as an SVG element
     * @param {string} name - Icon name
     * @param {RenderOptions} [options] - Render options
     * @returns {SVGElement|null}
     */
    render(name: string, options?: RenderOptions): SVGElement | null;
    /**
     * Get icon as HTML string
     * @param {string} name - Icon name
     * @param {RenderOptions} [options] - Render options (same as render())
     * @returns {string}
     */
    html(name: string, options?: RenderOptions): string;
    /**
     * Inject icon into an element
     * @param {string|HTMLElement} target - Target element or selector
     * @param {string} name - Icon name
     * @param {IconInjectOptions} [options] - Render options (same as render()), plus `position`: 'prepend' (default), 'append', or 'replace'
     * @returns {SVGElement|null}
     */
    inject(target: string | HTMLElement, name: string, options?: IconInjectOptions): SVGElement | null;
    /**
     * Scan document for [data-icon] elements and replace with SVGs
     * @param {Element|Document|DocumentFragment|string} [container=document] - Container to scan
     * @returns {number} Number of icons replaced
     */
    scan(container?: Element | Document | DocumentFragment | string): number;
    /**
     * Register a custom icon
     * @param {string} name - Icon name
     * @param {IconDefinition} definition - Icon definition (needs `path` or `paths`; `viewBox` defaults to '0 0 24 24')
     * @returns {this}
     */
    register(name: string, definition: IconDefinition): this;
    /**
     * Unregister an icon
     * @param {string} name - Icon name
     * @returns {boolean}
     */
    unregister(name: string): boolean;
    /**
     * Check if an icon exists
     * @param {string} name - Icon name
     * @returns {boolean}
     */
    has(name: string): boolean;
    /**
     * Get icon definition
     * @param {string} name - Icon name
     * @returns {IconDefinition|null}
     */
    get(name: string): IconDefinition | null;
    /**
     * List all icon names
     * @param {IconCategory|null} [category] - Filter by category
     * @returns {string[]}
     */
    list(category?: IconCategory | null): string[];
    /**
     * List all categories
     * @returns {Partial<Record<IconCategory, IconCategoryInfo>>}
     */
    listCategories(): Partial<Record<IconCategory, IconCategoryInfo>>;
    /**
     * Get icon count
     * @returns {number}
     */
    count(): number;
    /**
     * Search icons by name
     * @param {string} query - Search query
     * @returns {string[]}
     */
    search(query: string): string[];
    /**
     * Create a sprite sheet of all icons (for performance)
     * @returns {SVGElement}
     */
    createSprite(): SVGElement;
    /**
     * Use an icon from sprite sheet
     * @param {string} name - Icon name
     * @param {RenderOptions} [options] - Render options (`size` and `class`)
     * @returns {SVGElement|null}
     */
    use(name: string, options?: RenderOptions): SVGElement | null;
}
