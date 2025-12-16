/**
 * Domma Theme Engine
 * Provides theme management with CSS class toggle and JavaScript API
 */

const STORAGE_KEY = 'domma-theme';
const STORAGE_VARIANT_KEY = 'domma-theme-variant';
const CLASS_PREFIX = 'dm-theme-';

class ThemeEngine {
    constructor() {
        this._theme = 'light';
        this._variant = null;
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
     * @param {string} [options.theme] - Initial theme ('light' or 'dark')
     * @param {string} [options.variant] - Initial variant ('ocean', 'forest', 'sunset')
     * @param {boolean} [options.autoDetect=false] - Respect system preference
     * @param {boolean} [options.persist=true] - Save to localStorage
     * @param {boolean} [options.disabled=false] - Disable theming entirely (no classes applied)
     * @param {HTMLElement|string} [options.target=document.body] - Target element
     * @returns {ThemeEngine}
     */
    init(options = {}) {
        const {
            theme = null,
            variant = null,
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
        let initialVariant = variant;

        // Check localStorage first (if persisting)
        if (persist) {
            const stored = this._loadFromStorage();
            if (stored.theme && !theme) {
                initialTheme = stored.theme;
            }
            if (stored.variant && !variant) {
                initialVariant = stored.variant;
            }
        }

        // Check system preference if auto-detect enabled
        if (autoDetect && !initialTheme) {
            initialTheme = this._getSystemPreference();
            this._setupSystemListener();
        }

        // Default to light
        initialTheme = initialTheme || 'light';

        // Apply theme
        this._theme = initialTheme;
        this._variant = initialVariant;
        this._applyTheme();

        this._initialised = true;
        return this;
    }

    /**
     * Get the current theme
     * @returns {string}
     */
    get() {
        return this._theme;
    }

    /**
     * Get the current variant
     * @returns {string|null}
     */
    getVariant() {
        return this._variant;
    }

    /**
     * Check if dark theme is active
     * @returns {boolean}
     */
    isDark() {
        return this._theme === 'dark';
    }

    /**
     * Check if light theme is active
     * @returns {boolean}
     */
    isLight() {
        return this._theme === 'light';
    }

    /**
     * Set the theme
     * @param {string} theme - Theme name ('light' or 'dark')
     * @returns {ThemeEngine}
     */
    set(theme) {
        if (!['light', 'dark'].includes(theme)) {
            console.warn(`Invalid theme: ${theme}. Use 'light' or 'dark'.`);
            return this;
        }

        const oldTheme = this._theme;
        if (oldTheme === theme) {
            return this;
        }

        this._theme = theme;
        this._applyTheme();
        this._saveToStorage();
        this._notifyListeners(oldTheme, theme, this._variant);

        return this;
    }

    /**
     * Set the colour variant
     * @param {string|null} variant - Variant name or null
     * @returns {ThemeEngine}
     */
    setVariant(variant) {
        const validVariants = ['ocean', 'forest', 'sunset', 'royal', 'lemon', 'silver', 'charcoal', null];
        if (!validVariants.includes(variant)) {
            console.warn(`Invalid variant: ${variant}. Use one of: ${validVariants.filter(v => v).join(', ')}, or null.`);
            return this;
        }

        const oldVariant = this._variant;
        if (oldVariant === variant) {
            return this;
        }

        this._variant = variant;
        this._applyTheme();
        this._saveToStorage();
        this._notifyListeners(this._theme, this._theme, variant, oldVariant);

        return this;
    }

    /**
     * Toggle between light and dark themes
     * @returns {ThemeEngine}
     */
    toggle() {
        return this.set(this._theme === 'dark' ? 'light' : 'dark');
    }

    /**
     * Register a callback for theme changes
     * @param {Function} callback - Callback function
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
     * Preview a theme temporarily
     * @param {string} theme - Theme to preview
     * @param {string} [variant] - Variant to preview
     * @returns {Function} Restore function
     */
    preview(theme, variant = undefined) {
        const originalTheme = this._theme;
        const originalVariant = this._variant;

        // Apply preview without saving
        this._theme = theme;
        if (variant !== undefined) {
            this._variant = variant;
        }
        this._applyTheme(false);

        // Return restore function
        return () => {
            this._theme = originalTheme;
            this._variant = originalVariant;
            this._applyTheme(false);
        };
    }

    /**
     * List available themes
     * @returns {string[]}
     */
    listThemes() {
        return ['light', 'dark'];
    }

    /**
     * List available variants
     * @returns {string[]}
     */
    listVariants() {
        return ['ocean', 'forest', 'sunset', 'royal', 'lemon', 'silver', 'charcoal', 'christmas'];
    }

    /**
     * Get current theme configuration
     * @returns {Object}
     */
    getConfig() {
        return {
            theme: this._theme,
            variant: this._variant,
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

        meta.content = colors[this._theme] || colors.light;
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

        // Add current theme class
        classes.push(`${CLASS_PREFIX}${this._theme}`);

        // Add variant class if set
        if (this._variant) {
            classes.push(`${CLASS_PREFIX}${this._variant}`);
        }

        target.className = classes.join(' ').trim();

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
            localStorage.setItem(STORAGE_KEY, this._theme);
            if (this._variant) {
                localStorage.setItem(STORAGE_VARIANT_KEY, this._variant);
            } else {
                localStorage.removeItem(STORAGE_VARIANT_KEY);
            }
        } catch (e) {
            // localStorage might be disabled
        }
    }

    /**
     * Load theme from localStorage
     * @returns {Object}
     * @private
     */
    _loadFromStorage() {
        if (typeof localStorage === 'undefined') {
            return {theme: null, variant: null};
        }

        try {
            return {
                theme: localStorage.getItem(STORAGE_KEY),
                variant: localStorage.getItem(STORAGE_VARIANT_KEY)
            };
        } catch (e) {
            return {theme: null, variant: null};
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

        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }

    /**
     * Set up system preference listener
     * @private
     */
    _setupSystemListener() {
        if (typeof window === 'undefined' || !window.matchMedia) {
            return;
        }

        this._systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handler = (e) => {
            if (this._autoDetect) {
                this.set(e.matches ? 'dark' : 'light');
            }
        };

        // Use addEventListener for modern browsers, addListener for older ones
        if (this._systemMediaQuery.addEventListener) {
            this._systemMediaQuery.addEventListener('change', handler);
        } else if (this._systemMediaQuery.addListener) {
            this._systemMediaQuery.addListener(handler);
        }
    }

    /**
     * Notify all listeners of theme change
     * @param {string} oldTheme
     * @param {string} newTheme
     * @param {string|null} newVariant
     * @param {string|null} [oldVariant]
     * @private
     */
    _notifyListeners(oldTheme, newTheme, newVariant, oldVariant = null) {
        const event = {
            oldTheme,
            newTheme,
            variant: newVariant,
            oldVariant: oldVariant || this._variant,
            isDark: newTheme === 'dark',
            isLight: newTheme === 'light'
        };

        this._listeners.forEach(callback => {
            try {
                callback(event);
            } catch (e) {
                console.error('Theme change callback error:', e);
            }
        });
    }

    /**
     * Clean up resources
     */
    destroy() {
        this._listeners = [];
        this._initialised = false;
    }
}

// Create singleton instance
const theme = new ThemeEngine();

export {theme, ThemeEngine};
export default theme;
