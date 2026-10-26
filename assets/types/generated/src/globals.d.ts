/**
 * Read a load-time option from `window.DommaOptions`.
 * @param {keyof DommaLoadOptions} key
 * @param {*} fallback
 * @returns {*}
 */
export function loadOption(key: keyof DommaLoadOptions, fallback: any): any;
/**
 * Install Domma and its aliases on `window`, and attach `Domma.noConflict`.
 * @param {Function} Domma - The Domma function
 * @param {Object<string, *>} aliases - Alias name -> value
 * @returns {Function} Domma
 */
export function installGlobals(Domma: Function, aliases: {
    [x: string]: any;
}): Function;
/**
 * Options read from `window.DommaOptions` when Domma loads - set it before the script tag.
 */
export type DommaLoadOptions = {
    /**
     * true (default): every alias; 'safe': only aliases nobody else owns; false: window.Domma only
     */
    globals?: boolean | "safe";
    /**
     * false: never add the `dm-cloaked` class
     */
    cloak?: boolean;
    /**
     * false: don't initialise the theme engine automatically
     */
    theme?: boolean;
    /**
     * false: no console warning when DOMPurify is missing
     */
    purifyWarning?: boolean;
    /**
     * false: no deprecation warnings (none are pending in 1.0)
     */
    deprecationWarnings?: boolean;
    /**
     * false: no console warning for a missing translation
     */
    i18nWarnings?: boolean;
};
