/**
 * Domma Icons Module - TypeScript Declarations
 * SVG icon library with categories and rendering
 */

export type IconCategory =
    | 'ui'
    | 'navigation'
    | 'media'
    | 'communication'
    | 'files'
    | 'social'
    | 'status'
    | 'commerce';

export interface IconDefinition {
    /** SVG path or full SVG content */
    svg: string;
    /** Icon category */
    category?: IconCategory;
    /** Icon tags for search */
    tags?: string[];
    /** ViewBox dimensions */
    viewBox?: string;
}

export interface RenderOptions {
    /** Icon size in pixels or CSS value */
    size?: number | string;
    /** Icon colour */
    color?: string;
    /** Additional CSS class */
    className?: string;
    /** Additional inline styles */
    style?: Record<string, string>;
    /** Accessible label */
    ariaLabel?: string;
    /** Custom attributes */
    attrs?: Record<string, string>;
}

export interface Icons {
    /**
     * Render an icon as an SVG element
     * @param name - Icon name
     * @param options - Render options
     * @returns SVG element or null if not found
     */
    render(name: string, options?: RenderOptions): SVGElement | null;

    /**
     * Get icon as HTML string
     * @param name - Icon name
     * @param options - Render options
     * @returns SVG HTML string or empty string if not found
     */
    html(name: string, options?: RenderOptions): string;

    /**
     * Inject icon into a DOM element
     * @param selector - Target element selector or element
     * @param name - Icon name
     * @param options - Render options
     * @returns The target element or null
     */
    inject(selector: string | HTMLElement, name: string, options?: RenderOptions): HTMLElement | null;

    /**
     * Scan DOM for icon placeholders and inject icons
     * @param container - Container to scan (default: document)
     * @param attribute - Data attribute to look for (default: 'data-icon')
     * @returns Number of icons injected
     */
    scan(container?: HTMLElement | Document, attribute?: string): number;

    /**
     * Register a custom icon
     * @param name - Icon name
     * @param definition - Icon definition (SVG string or full definition)
     */
    register(name: string, definition: string | IconDefinition): void;

    /**
     * Unregister an icon
     * @param name - Icon name
     * @returns true if icon was removed
     */
    unregister(name: string): boolean;

    /**
     * Check if an icon exists
     * @param name - Icon name
     * @returns true if icon exists
     */
    has(name: string): boolean;

    /**
     * Get icon definition
     * @param name - Icon name
     * @returns Icon definition or undefined
     */
    get(name: string): IconDefinition | undefined;

    /**
     * List all icon names
     * @param category - Optional category filter
     * @returns Array of icon names
     */
    list(category?: IconCategory): string[];

    /**
     * List all categories
     * @returns Array of category names
     */
    listCategories(): IconCategory[];

    /**
     * Get total icon count
     * @param category - Optional category filter
     * @returns Number of icons
     */
    count(category?: IconCategory): number;

    /**
     * Search icons by name or tags
     * @param query - Search query
     * @returns Array of matching icon names
     */
    search(query: string): string[];

    /**
     * Create an SVG sprite sheet
     * @param icons - Array of icon names (default: all icons)
     * @returns SVG sprite element
     */
    createSprite(icons?: string[]): SVGElement;

    /**
     * Use an icon from a sprite sheet
     * @param name - Icon name
     * @param options - Render options
     * @returns SVG use element HTML string
     */
    use(name: string, options?: RenderOptions): string;
}

export declare const icons: Icons;
