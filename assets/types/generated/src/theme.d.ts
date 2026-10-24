export { themeEngine as theme };
export default themeEngine;
/**
 * Light/dark mode - the final segment of a standard theme name.
 */
export type ThemeMode = "light" | "dark";
/**
 * Colour base of a theme (the name before the final segment), as listed by `listBases()`
 * (`core` is the base of `core-light`).
 */
export type ThemeVariant = "ocean" | "forest" | "sunset" | "royal" | "lemon" | "silver" | "charcoal" | "christmas" | "unicorn" | "dreamy" | "grayve" | "mint" | "wedding" | "core" | "corporate" | "admin-smooth" | "admin-sharp" | "admin-slate";
/**
 * Standalone Admin family (no light/dark) - finish-accent full names.
 */
export type AdminTheme = "admin-smooth-steel" | "admin-smooth-indigo" | "admin-smooth-teal" | "admin-sharp-steel" | "admin-sharp-indigo" | "admin-sharp-teal" | "admin-slate-steel" | "admin-slate-indigo" | "admin-slate-teal";
/**
 * A full theme name, e.g. 'ocean-dark' or 'admin-sharp-steel'.
 */
export type ThemeName = `${"ocean" | "forest" | "sunset" | "royal" | "lemon" | "silver" | "charcoal" | "christmas" | "unicorn" | "dreamy" | "grayve" | "mint" | "wedding" | "corporate"}-${ThemeMode}` | "core-light" | AdminTheme;
/**
 * What `getConfig()` returns.
 */
export type ThemeConfig = {
    /**
     * Current full theme name
     */
    theme: ThemeName;
    /**
     * Colour base (see `getBase()`)
     */
    base: ThemeVariant;
    /**
     * Final segment (see `getMode()`)
     */
    mode: ThemeMode | "steel" | "indigo" | "teal";
    /**
     * Whether the system preference is followed
     */
    autoDetect: boolean;
    /**
     * Whether the choice is saved to localStorage (undefined before init)
     */
    persist: boolean | undefined;
    /**
     * Whether theming is disabled
     */
    disabled: boolean;
};
/**
 * Called with the previous and the new theme name when the theme changes.
 */
export type ThemeChangeCallback = (oldTheme: ThemeName, newTheme: ThemeName) => void;
/**
 * Options for `init()`.
 */
export type ThemeOptions = {
    /**
     * Initial theme (e.g., 'ocean-dark', 'forest-light')
     */
    theme?: ThemeName;
    /**
     * Respect system preference (maps to light/dark variants)
     */
    autoDetect?: boolean;
    /**
     * Save to localStorage
     */
    persist?: boolean;
    /**
     * Disable theming entirely (no classes applied)
     */
    disabled?: boolean;
    /**
     * Target element
     */
    target?: HTMLElement | string;
};
export type Theme = ThemeEngine;
declare const themeEngine: ThemeEngine;
/**
 * Light/dark mode - the final segment of a standard theme name.
 * @typedef {'light'|'dark'} ThemeMode
 */
/**
 * Colour base of a theme (the name before the final segment), as listed by `listBases()`
 * (`core` is the base of `core-light`).
 * @typedef {'ocean'|'forest'|'sunset'|'royal'|'lemon'|'silver'|'charcoal'|'christmas'|'unicorn'|'dreamy'|'grayve'|'mint'|'wedding'|'core'|'corporate'|'admin-smooth'|'admin-sharp'|'admin-slate'} ThemeVariant
 */
/**
 * Standalone Admin family (no light/dark) - finish-accent full names.
 * @typedef {'admin-smooth-steel'|'admin-smooth-indigo'|'admin-smooth-teal'|'admin-sharp-steel'|'admin-sharp-indigo'|'admin-sharp-teal'|'admin-slate-steel'|'admin-slate-indigo'|'admin-slate-teal'} AdminTheme
 */
/**
 * A full theme name, e.g. 'ocean-dark' or 'admin-sharp-steel'.
 * @typedef {`${'ocean'|'forest'|'sunset'|'royal'|'lemon'|'silver'|'charcoal'|'christmas'|'unicorn'|'dreamy'|'grayve'|'mint'|'wedding'|'corporate'}-${ThemeMode}`|'core-light'|AdminTheme} ThemeName
 */
/**
 * What `getConfig()` returns.
 * @typedef {object} ThemeConfig
 * @property {ThemeName} theme Current full theme name
 * @property {ThemeVariant} base Colour base (see `getBase()`)
 * @property {ThemeMode|'steel'|'indigo'|'teal'} mode Final segment (see `getMode()`)
 * @property {boolean} autoDetect Whether the system preference is followed
 * @property {boolean|undefined} persist Whether the choice is saved to localStorage (undefined before init)
 * @property {boolean} disabled Whether theming is disabled
 */
/**
 * Called with the previous and the new theme name when the theme changes.
 * @callback ThemeChangeCallback
 * @param {ThemeName} oldTheme
 * @param {ThemeName} newTheme
 * @returns {void}
 */
/**
 * Options for `init()`.
 * @typedef {object} ThemeOptions
 * @property {ThemeName} [theme] Initial theme (e.g., 'ocean-dark', 'forest-light')
 * @property {boolean} [autoDetect=false] Respect system preference (maps to light/dark variants)
 * @property {boolean} [persist=true] Save to localStorage
 * @property {boolean} [disabled=false] Disable theming entirely (no classes applied)
 * @property {HTMLElement|string} [target=document.body] Target element
 */
/** @typedef {ThemeEngine} Theme */
declare class ThemeEngine {
    _theme: string;
    _listeners: any[];
    _target: HTMLElement | Element;
    _initialised: boolean;
    _systemMediaQuery: MediaQueryList;
    _autoDetect: boolean;
    _disabled: boolean;
    /**
     * Initialise the theme engine
     * @param {ThemeOptions} [options] - Configuration options
     * @returns {this}
     */
    init(options?: ThemeOptions): this;
    _persist: boolean;
    /**
     * Get the current theme (full name, e.g., 'ocean-dark')
     * @returns {ThemeName}
     */
    get(): ThemeName;
    /**
     * Get the theme base colour (everything before the final '-' segment).
     * For standard themes this is the colour name (e.g., 'ocean' from 'ocean-dark').
     * For Admin themes the base is the finish (e.g., 'admin-sharp' from 'admin-sharp-steel').
     * @returns {ThemeVariant}
     */
    getBase(): ThemeVariant;
    /**
     * Get the final '-' segment of the theme name.
     * For standard themes this is the light/dark mode (e.g., 'dark' from 'ocean-dark',
     * 'light' from 'forest-light'). Admin themes have no light/dark mode, so this
     * returns the accent name instead (e.g., 'steel', 'indigo', or 'teal').
     * @returns {ThemeMode|'steel'|'indigo'|'teal'}
     */
    getMode(): ThemeMode | "steel" | "indigo" | "teal";
    /**
     * Check if dark mode is active
     * @returns {boolean}
     */
    isDark(): boolean;
    /**
     * Check if light mode is active
     * @returns {boolean}
     */
    isLight(): boolean;
    /**
     * Set the theme (e.g., 'ocean-dark', 'forest-light')
     * @param {ThemeName} theme - Full theme name
     * @returns {this}
     */
    set(theme: ThemeName): this;
    /**
     * @deprecated Use set() with full theme name instead (e.g., set('ocean-dark'))
     * @returns {this}
     */
    setVariant(): this;
    /**
     * @deprecated No longer applicable with unified theme system. Use variant selector UI instead.
     * @returns {this}
     */
    toggle(): this;
    /**
     * Register a callback for theme changes
     * @param {ThemeChangeCallback} callback - Callback function(oldTheme, newTheme)
     * @returns {() => void} Unsubscribe function
     */
    onChange(callback: ThemeChangeCallback): () => void;
    /**
     * Preview a theme temporarily without saving
     * @param {ThemeName} theme - Theme to preview (e.g., 'ocean-dark')
     * @returns {() => void} Restore function
     */
    preview(theme: ThemeName): () => void;
    /**
     * List all available themes
     * @returns {ThemeName[]} Array of all 33 theme names
     */
    listThemes(): ThemeName[];
    /**
     * List available colour bases (without mode suffix)
     * @returns {ThemeVariant[]}
     */
    listBases(): ThemeVariant[];
    /**
     * @deprecated Use listThemes() instead. Kept for backward compatibility.
     * @returns {ThemeVariant[]}
     */
    listVariants(): ThemeVariant[];
    /**
     * Get current theme configuration
     * @returns {ThemeConfig}
     */
    getConfig(): ThemeConfig;
    /**
     * Update the meta theme-color for mobile browsers
     * @private
     */
    private _updateMetaThemeColor;
    /**
     * Check if theming is disabled
     * @returns {boolean}
     */
    isDisabled(): boolean;
    /**
     * Enable theming (if previously disabled)
     * @returns {this}
     */
    enable(): this;
    /**
     * Disable theming (remove all theme classes)
     * @returns {this}
     */
    disable(): this;
    /**
     * Apply the current theme to the target element
     * @param {boolean} [updateMeta=true] - Whether to update meta theme-color
     * @private
     */
    private _applyTheme;
    /**
     * Save theme to localStorage
     * @private
     */
    private _saveToStorage;
    /**
     * Load theme from localStorage with automatic migration from old format
     * @returns {string|null}
     * @private
     */
    private _loadFromStorage;
    /**
     * Get system colour scheme preference
     * @returns {string}
     * @private
     */
    private _getSystemPreference;
    /**
     * Setup listener for system preference changes
     * @private
     */
    private _setupSystemListener;
    /**
     * Notify all registered listeners of theme change
     * @param {string} oldTheme - Previous theme
     * @param {string} newTheme - New theme
     * @private
     */
    private _notifyListeners;
    /**
     * Cleanup and destroy the theme engine
     * @returns {void}
     */
    destroy(): void;
}
