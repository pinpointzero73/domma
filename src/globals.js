/**
 * Global installation for Domma and its short aliases ($, _, M, D, ...).
 *
 * Set `window.DommaOptions = {globals: ...}` BEFORE Domma loads to choose:
 *   true    (default) install every alias, remembering what was there before
 *   'safe'  install only aliases that are free - an existing jQuery `$` or Lodash `_` is left alone
 *   false   install `window.Domma` only
 *
 * `Domma.noConflict()` hands `$` and `_` back to whatever owned them before Domma loaded;
 * `Domma.noConflict(true)` hands back every alias and `window.Domma` too. Either way it
 * returns Domma, so `const dm = Domma.noConflict();` keeps a handle.
 */

const SHARED = ['$', '_'];

/**
 * Read a load-time option from `window.DommaOptions`.
 * @param {string} key
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
        const names = deep ? [...Object.keys(installed), 'Domma'] : SHARED;
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
        if (mode === 'safe' && window[name] !== undefined && window[name] !== value) return;
        previous[name] = window[name];
        installed[name] = value;
        window[name] = value;
    };

    take('Domma', Domma);
    if (mode !== false) {
        for (const [name, value] of Object.entries(aliases)) take(name, value);
    }
    return Domma;
}
