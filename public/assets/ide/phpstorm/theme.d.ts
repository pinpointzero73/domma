/**
 * Domma Theme Module - TypeScript Declarations
 * Theme system with light/dark modes and colour variants
 */

export type ThemeMode = 'light' | 'dark';
export type ThemeVariant = 'ocean' | 'forest' | 'sunset' | 'royal' | 'lemon' | 'silver' | 'charcoal' | 'christmas' | 'unicorn' | 'dreamy' | 'grayve' | 'mint' | 'wedding' | 'admin-smooth' | 'admin-sharp' | 'default';

/** Standalone Admin family (no light/dark) — finish-accent full names. */
export type AdminTheme =
    | 'admin-smooth-steel' | 'admin-smooth-indigo' | 'admin-smooth-teal'
    | 'admin-sharp-steel' | 'admin-sharp-indigo' | 'admin-sharp-teal';

export interface ThemeConfig {
    /** Current theme mode */
    mode: ThemeMode;
    /** Current colour variant */
    variant: ThemeVariant;
    /** Auto-detect system preference */
    auto?: boolean;
}

export interface ThemeChangeEvent {
    mode: ThemeMode;
    variant: ThemeVariant;
    previousMode: ThemeMode;
    previousVariant: ThemeVariant;
}

export type ThemeChangeCallback = (event: ThemeChangeEvent) => void;
export type UnsubscribeFn = () => void;

export interface ThemeOptions {
    /** Initial theme mode */
    mode?: ThemeMode;
    /** Initial colour variant */
    variant?: ThemeVariant;
    /** Auto-detect system preference */
    auto?: boolean;
    /** Persist preference to localStorage */
    persist?: boolean;
    /** localStorage key for persistence */
    persistKey?: string;
    /** CSS selector for theme container (default: document.documentElement) */
    container?: string | HTMLElement;
    /** Transition duration in ms when changing themes */
    transitionDuration?: number;
}

export interface Theme {
    /**
     * Initialise the theme system
     * @param options - Theme options
     * @returns The theme instance
     */
    init(options?: ThemeOptions): Theme;

    /**
     * Get the current theme mode
     * @returns Current theme mode
     */
    get(): ThemeMode;

    /**
     * Get the current variant
     * @returns Current variant name
     */
    getVariant(): ThemeVariant;

    /**
     * Check if current mode is dark
     * @returns true if dark mode
     */
    isDark(): boolean;

    /**
     * Check if current mode is light
     * @returns true if light mode
     */
    isLight(): boolean;

    /**
     * Set the theme mode
     * @param mode - Theme mode to set
     * @returns The theme instance
     */
    set(mode: ThemeMode): Theme;

    /**
     * Set the colour variant
     * @param variant - Variant to set
     * @returns The theme instance
     */
    setVariant(variant: ThemeVariant): Theme;

    /**
     * Toggle between light and dark modes
     * @returns The theme instance
     */
    toggle(): Theme;

    /**
     * Subscribe to theme changes
     * @param callback - Callback function
     * @returns Unsubscribe function
     */
    onChange(callback: ThemeChangeCallback): UnsubscribeFn;

    /**
     * Preview a theme without persisting
     * @param mode - Theme mode to preview
     * @param variant - Optional variant to preview
     * @returns The theme instance
     */
    preview(mode: ThemeMode, variant?: ThemeVariant): Theme;

    /**
     * List available theme modes
     * @returns Array of theme modes
     */
    listThemes(): ThemeMode[];

    /**
     * List available variants
     * @returns Array of variant names
     */
    listVariants(): ThemeVariant[];

    /**
     * Get current theme configuration
     * @returns Theme configuration object
     */
    getConfig(): ThemeConfig;

    /**
     * Destroy the theme instance and cleanup
     */
    destroy(): void;
}

export declare const theme: Theme;
