/**
 * Domma Theme Engine v2.0 (v0.5.0a)
 * Unified theme system - 16 independent themes
 * Migrates from light/dark + variants to single theme names (e.g., 'ocean-dark', 'forest-light')
 */

const STORAGE_KEY = 'domma-theme';
const STORAGE_VARIANT_KEY = 'domma-theme-variant'; // Legacy key for migration
const CLASS_PREFIX = 'dm-theme-';

// List of all available themes
const AVAILABLE_THEMES = [
    'ocean-light', 'ocean-dark',
    'forest-light', 'forest-dark',
    'sunset-light', 'sunset-dark',
    'royal-light', 'royal-dark',
    'lemon-light', 'lemon-dark',
    'silver-light', 'silver-dark',
    'charcoal-light', 'charcoal-dark',
    'christmas-light', 'christmas-dark',
    'unicorn-light', 'unicorn-dark',
    'dreamy-light', 'dreamy-dark',
    'grayve-light', 'grayve-dark',
    'mint-light', 'mint-dark',
    'core-light'
];

// Default theme
const DEFAULT_THEME = 'charcoal-dark';

class ThemeEngine {
    constructor() {
        this._theme = DEFAULT_THEME; // Now stores full theme name like 'ocean-dark'
        this._listeners = [];
        this._target = null;
        this._initialised = false;
        this._systemMediaQuery = null;
        this._autoDetect = false;
        this._disabled = false;
    }

    /**
     * Initialise the theme engine
     * @param {Object} options - Configuration options
     * @param {string} [options.theme] - Initial theme (e.g., 'ocean-dark', 'forest-light')
     * @param {boolean} [options.autoDetect=false] - Respect system preference (maps to light/dark variants)
     * @param {boolean} [options.persist=true] - Save to localStorage
     * @param {boolean} [options.disabled=false] - Disable theming entirely (no classes applied)
     * @param {HTMLElement|string} [options.target=document.body] - Target element
     * @returns {ThemeEngine}
     */
    init(options = {}) {
        const {
            theme = null,
            autoDetect = false,
            persist = true,
            disabled = false,
            target = document.body
        } = options;

        // If disabled, skip all theme application
        if (disabled) {
            this._disabled = true;
            this._initialised = true;
            return this;
        }

        // Set target element
        this._target = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        if (!this._target) {
            this._target = document.body;
        }

        this._persist = persist;
        this._autoDetect = autoDetect;

        // Determine initial theme
        let initialTheme = theme;

        // Check localStorage first (if persisting) - includes migration logic
        if (persist) {
            const stored = this._loadFromStorage();
            if (stored && !theme) {
                initialTheme = stored;
            }
        }

        // Check system preference if auto-detect enabled
        if (autoDetect && !initialTheme) {
            const systemPref = this._getSystemPreference();
            // Map system preference to default theme with that mode
            initialTheme = systemPref === 'dark' ? 'charcoal-dark' : 'charcoal-light';
            this._setupSystemListener();
        }

        // Default to charcoal-dark
        initialTheme = initialTheme || DEFAULT_THEME;

        // Validate and apply theme
        if (!AVAILABLE_THEMES.includes(initialTheme)) {
            console.warn(`Invalid theme: ${initialTheme}. Using default: ${DEFAULT_THEME}`);
            initialTheme = DEFAULT_THEME;
        }

        this._theme = initialTheme;
        this._applyTheme();

        this._initialised = true;
        return this;
    }

    /**
     * Get the current theme (full name, e.g., 'ocean-dark')
     * @returns {string}
     */
    get() {
        return this._theme;
    }

    /**
     * Get the theme base colour (e.g., 'ocean' from 'ocean-dark')
     * @returns {string}
     */
    getBase() {
        return this._theme.split('-').slice(0, -1).join('-');
    }

    /**
     * Get the theme mode (e.g., 'dark' from 'ocean-dark', 'light' from 'forest-light')
     * @returns {string}
     */
    getMode() {
        return this._theme.split('-').pop();
    }

    /**
     * Check if dark mode is active
     * @returns {boolean}
     */
    isDark() {
        const mode = this.getMode();
        return mode === 'dark';
    }

    /**
     * Check if light mode is active
     * @returns {boolean}
     */
    isLight() {
        return this.getMode() === 'light';
    }

    /**
     * Set the theme (e.g., 'ocean-dark', 'forest-light')
     * @param {string} theme - Full theme name
     * @returns {ThemeEngine}
     */
    set(theme) {
        if (!AVAILABLE_THEMES.includes(theme)) {
            console.warn(`Invalid theme: ${theme}. Available themes: ${AVAILABLE_THEMES.join(', ')}`);
            return this;
        }

        const oldTheme = this._theme;
        if (oldTheme === theme) {
            return this;
        }

        this._theme = theme;
        this._applyTheme();
        this._saveToStorage();
        this._notifyListeners(oldTheme, theme);

        return this;
    }

    /**
     * @deprecated Use set() with full theme name instead (e.g., set('ocean-dark'))
     */
    setVariant() {
        console.warn('[ThemeEngine] setVariant() is deprecated. Use set() with full theme name (e.g., set("ocean-dark"))');
        return this;
    }

    /**
     * @deprecated No longer applicable with unified theme system. Use variant selector UI instead.
     */
    toggle() {
        console.warn('[ThemeEngine] toggle() is deprecated. Use variant selector UI or set() method.');
        return this;
    }

    /**
     * Register a callback for theme changes
     * @param {Function} callback - Callback function(oldTheme, newTheme)
     * @returns {Function} Unsubscribe function
     */
    onChange(callback) {
        if (typeof callback !== 'function') {
            console.warn('onChange requires a function callback');
            return () => {
            };
        }

        this._listeners.push(callback);

        return () => {
            const index = this._listeners.indexOf(callback);
            if (index > -1) {
                this._listeners.splice(index, 1);
            }
        };
    }

    /**
     * Preview a theme temporarily without saving
     * @param {string} theme - Theme to preview (e.g., 'ocean-dark')
     * @returns {Function} Restore function
     */
    preview(theme) {
        if (!AVAILABLE_THEMES.includes(theme)) {
            console.warn(`Invalid theme for preview: ${theme}`);
            return () => {
            };
        }

        const originalTheme = this._theme;

        // Apply preview without saving
        this._theme = theme;
        this._applyTheme(false);

        // Return restore function
        return () => {
            this._theme = originalTheme;
            this._applyTheme(false);
        };
    }

    /**
     * List all available themes
     * @returns {string[]} Array of all 16 theme names
     */
    listThemes() {
        return [...AVAILABLE_THEMES];
    }

    /**
     * List available colour bases (without mode suffix)
     * @returns {string[]}
     */
    listBases() {
        return ['ocean', 'forest', 'sunset', 'royal', 'lemon', 'silver', 'charcoal', 'christmas', 'unicorn', 'dreamy', 'grayve', 'mint'];
    }

    /**
     * @deprecated Use listThemes() instead. Kept for backward compatibility.
     */
    listVariants() {
        console.warn('[ThemeEngine] listVariants() is deprecated. Use listThemes() instead.');
        return this.listBases();
    }

    /**
     * Get current theme configuration
     * @returns {Object}
     */
    getConfig() {
        return {
            theme: this._theme,
            base: this.getBase(),
            mode: this.getMode(),
            autoDetect: this._autoDetect,
            persist: this._persist,
            disabled: this._disabled
        };
    }

    /**
     * Update the meta theme-color for mobile browsers
     * @private
     */
    _updateMetaThemeColor() {
        const colors = {
            light: '#ffffff',
            dark: '#121212'
        };

        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'theme-color';
            document.head.appendChild(meta);
        }

        meta.content = colors[this.getMode()] || colors.dark;
    }

    /**
     * Check if theming is disabled
     * @returns {boolean}
     */
    isDisabled() {
        return this._disabled;
    }

    /**
     * Enable theming (if previously disabled)
     * @returns {ThemeEngine}
     */
    enable() {
        this._disabled = false;

        // Re-initialize target if it's missing
        if (!this._target) {
            this._target = document.body;
        }

        this._applyTheme();
        return this;
    }

    /**
     * Disable theming (remove all theme classes)
     * @returns {ThemeEngine}
     */
    disable() {
        this._disabled = true;
        if (this._target) {
            // Remove all theme classes
            const classes = this._target.className.split(' ').filter(c => !c.startsWith(CLASS_PREFIX));
            this._target.className = classes.join(' ').trim();
            // Remove data-mode attribute
            this._target.removeAttribute('data-mode');
        }
        return this;
    }

    /**
     * Apply the current theme to the target element
     * @param {boolean} [updateMeta=true] - Whether to update meta theme-color
     * @private
     */
    _applyTheme(updateMeta = true) {
        if (this._disabled) {
            return;
        }

        // Fallback to document.body if target is null
        const target = this._target || document.body;

        if (!target) {
            console.error('[ThemeEngine] No target element available for theme application');
            return;
        }

        // Remove all theme classes
        const classes = target.className.split(' ').filter(c => !c.startsWith(CLASS_PREFIX));

        // Add current theme class (single class now, e.g., 'dm-theme-ocean-dark')
        classes.push(`${CLASS_PREFIX}${this._theme}`);

        target.className = classes.join(' ').trim();

        // Set data-mode attribute for consistent dark mode detection
        const mode = this.isDark() ? 'dark' : 'light';
        target.setAttribute('data-mode', mode);

        // Update meta theme-color
        if (updateMeta) {
            this._updateMetaThemeColor();
        }
    }

    /**
     * Save theme to localStorage
     * @private
     */
    _saveToStorage() {
        if (!this._persist || typeof localStorage === 'undefined') {
            return;
        }

        try {
            // Save full theme name
            localStorage.setItem(STORAGE_KEY, this._theme);
            // Clean up old variant key if it exists
            localStorage.removeItem(STORAGE_VARIANT_KEY);
        } catch (e) {
            // localStorage might be disabled
        }
    }

    /**
     * Load theme from localStorage with automatic migration from old format
     * @returns {string|null}
     * @private
     */
    _loadFromStorage() {
        if (typeof localStorage === 'undefined') {
            return null;
        }

        try {
            // Try to load new format first
            const stored = localStorage.getItem(STORAGE_KEY);

            // Check if it's a valid theme name (new format)
            if (stored && AVAILABLE_THEMES.includes(stored)) {
                return stored;
            }

            // Migration: Check for old format (separate theme + variant keys)
            const oldTheme = stored; // Will be 'light' or 'dark' in old format
            const oldVariant = localStorage.getItem(STORAGE_VARIANT_KEY);

            if (oldTheme && ['light', 'dark'].includes(oldTheme)) {
                // Migrate from old format
                const base = oldVariant || 'charcoal'; // Default to charcoal if no variant
                const newTheme = `${base}-${oldTheme}`;

                console.log(`[ThemeEngine] Migrating theme: ${oldTheme} + ${oldVariant} → ${newTheme}`);

                // Validate migrated theme
                if (AVAILABLE_THEMES.includes(newTheme)) {
                    // Save in new format
                    localStorage.setItem(STORAGE_KEY, newTheme);
                    localStorage.removeItem(STORAGE_VARIANT_KEY);
                    return newTheme;
                }
            }

            // Invalid or missing - return null to use default
            return null;
        } catch (e) {
            return null;
        }
    }

    /**
     * Get system colour scheme preference
     * @returns {string}
     * @private
     */
    _getSystemPreference() {
        if (typeof window === 'undefined' || !window.matchMedia) {
            return 'light';
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    /**
     * Setup listener for system preference changes
     * @private
     */
    _setupSystemListener() {
        if (typeof window === 'undefined' || !window.matchMedia) {
            return;
        }

        this._systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handler = (e) => {
            if (!this._autoDetect) {
                return;
            }

            // When system preference changes, switch to corresponding mode of current base
            const newMode = e.matches ? 'dark' : 'light';
            const base = this.getBase();
            const newTheme = `${base}-${newMode}`;

            if (AVAILABLE_THEMES.includes(newTheme)) {
                this.set(newTheme);
            }
        };

        // Modern browsers
        if (this._systemMediaQuery.addEventListener) {
            this._systemMediaQuery.addEventListener('change', handler);
        } else {
            // Fallback for older browsers
            this._systemMediaQuery.addListener(handler);
        }
    }

    /**
     * Notify all registered listeners of theme change
     * @param {string} oldTheme - Previous theme
     * @param {string} newTheme - New theme
     * @private
     */
    _notifyListeners(oldTheme, newTheme) {
        this._listeners.forEach(callback => {
            try {
                callback(oldTheme, newTheme);
            } catch (e) {
                console.error('[ThemeEngine] Error in change listener:', e);
            }
        });
    }

    /**
     * Cleanup and destroy the theme engine
     */
    destroy() {
        if (this._systemMediaQuery) {
            if (this._systemMediaQuery.removeEventListener) {
                // Can't remove without storing the handler reference, skip for now
            }
        }
        this._listeners = [];
        this._target = null;
        this._initialised = false;
    }
}

// Create singleton instance
const themeEngine = new ThemeEngine();

// Auto-initialize on DOM ready (with defaults)
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (!themeEngine._initialised) {
                themeEngine.init({persist: true, autoDetect: false});
            }
        });
    } else {
        // DOM already loaded
        if (!themeEngine._initialised) {
            themeEngine.init({persist: true, autoDetect: false});
        }
    }
}

// Export for ES modules
export {themeEngine as theme};
export default themeEngine;

