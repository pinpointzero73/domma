/**
 * Global installation for Domma and its short aliases ($, _, M, D, ...).
 *
 * Set `window.DommaOptions = {globals: ...}` BEFORE Domma loads to choose:
 *   true    (default) install every alias, remembering what was there before
 *   'safe'  install only aliases that are free - an existing jQuery `$` or Lodash `_` is left alone
 *   false   install `window.Domma` only
 *
 * `window.Domma` is always installed: parts of the library still reach each other through it.
 * `Domma.noConflict()` hands `$` and `_` back to whatever owned them before Domma loaded;
 * `Domma.noConflict(true)` hands back every short alias. Either way it returns Domma, so
 * `const dm = Domma.noConflict();` keeps a handle.
 */

/**
 * Options read from `window.DommaOptions` when Domma loads - set it before the script tag.
 * @typedef {object} DommaLoadOptions
 * @property {boolean | 'safe'} [globals] true (default): every alias; 'safe': only aliases nobody else owns; false: window.Domma only
 * @property {boolean} [cloak] false: never add the `dm-cloaked` class
 * @property {boolean} [theme] false: don't initialise the theme engine automatically
 * @property {boolean} [purifyWarning] false: no console warning when DOMPurify is missing
 * @property {boolean} [deprecationWarnings] false: no deprecation warnings
 * @property {boolean} [i18nWarnings] false: no console warning for a missing translation
 */

const SHARED = ['$', '_'];

// An element with id="E" shows up as window.E (named access) - that is not an owner to respect.
const isNamedAccess = (value) => (typeof Element !== 'undefined' && value instanceof Element)
    || (typeof HTMLCollection !== 'undefined' && value instanceof HTMLCollection);
const isTaken = (current, ours) => current !== undefined && current !== ours && !isNamedAccess(current);

/**
 * Read a load-time option from `window.DommaOptions`.
 * @param {keyof DommaLoadOptions} key
 * @param {*} fallback
 * @returns {*}
 */
export function loadOption(key, fallback) {
    if (typeof window === 'undefined') return fallback;
    const opts = window.DommaOptions;
    return opts && typeof opts === 'object' && key in opts ? opts[key] : fallback;
}

/**
 * Install Domma and its aliases on `window`, and attach `Domma.noConflict`.
 * @param {Function} Domma - The Domma function
 * @param {Object<string, *>} aliases - Alias name -> value
 * @returns {Function} Domma
 */
export function installGlobals(Domma, aliases) {
    const previous = {};
    const installed = {};

    Domma.noConflict = (deep = false) => {
        if (typeof window === 'undefined') return Domma;
        const names = deep ? Object.keys(installed).filter(n => n !== 'Domma') : SHARED;
        for (const name of names) {
            // Only give a name back if it is still ours - something loaded after us owns it otherwise
            if (installed[name] && window[name] === installed[name]) {
                if (previous[name] === undefined) delete window[name];
                else window[name] = previous[name];
                delete installed[name];
            }
        }
        return Domma;
    };

    if (typeof window === 'undefined') return Domma;

    const mode = loadOption('globals', true);
    const take = (name, value) => {
        if (mode === 'safe' && name !== 'Domma' && isTaken(window[name], value)) return;
        previous[name] = isNamedAccess(window[name]) ? undefined : window[name];
        installed[name] = value;
        window[name] = value;
    };

    take('Domma', Domma);
    if (mode !== false) {
        for (const [name, value] of Object.entries(aliases)) take(name, value);
    }
    return Domma;
}
