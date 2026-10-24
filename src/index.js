import {dom, isDomma} from './dom.js';
import {http} from './http.js';
import {utils} from './utils.js';
import {configEngine} from './config.js';
import {models} from './models.js';
import {DesktopNotification, elements} from './elements.js';
import {dates} from './dates.js';
import {tables} from './tables.js';
import {forms} from './forms.js';
import {smoothCaret} from './smooth-caret.js';
import {theme} from './theme.js';
import {icons} from './icons.js';
import {storage} from './storage.js';
import {auth} from './auth.js';
import {router} from './router.js';
import {i18n} from './i18n.js';
import effects from './effects.js';
import sanitizeModule from './sanitize.js';
import {components, createComponent} from './component-factory.js';

// Importing registers the Web Components (Badge, Tooltip, Loader, BackToTop, ...)
import './web-components/index.js';
import {installGlobals, loadOption} from './globals.js';

/**
 * `$.setup()` input: page-wide switches, then selectors, each with a {@link SelectorConfig}.
 * @typedef {DommaSetupOptions & {[selector: string]: import('./config.js').SelectorConfig | string | boolean
 *   | (() => void) | undefined}} DommaSetupConfig
 */
/**
 * The page-wide switches `$.setup()` reads before the selectors.
 * @typedef {object} DommaSetupOptions
 * @property {boolean} [cloak] false: reveal the page now and stop cloaking it
 * @property {boolean} [noStyles] true: switch Domma's theming off (bring your own styles)
 * @property {string} [theme] Theme to start, e.g. 'ocean-dark'
 * @property {boolean} [autoDetectTheme] Follow the system light/dark preference
 * @property {boolean} [persistTheme] false: do not remember the theme (default true)
 * @property {boolean} [scanIcons] true: run `I.scan()` over the page
 * @property {() => void} [$init] Runs once, before the selectors
 */

// Cloaking - hide page immediately to prevent FOUC. `window.DommaOptions = {cloak: false}`
// before Domma loads turns it off before it can apply; `Domma.setup({cloak: false})` is too late for that.
let cloakEnabled = loadOption('cloak', true) !== false;
if (cloakEnabled && typeof document !== 'undefined' && document.body) {
    document.body.classList.add('dm-cloaked');
} else if (cloakEnabled && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if (cloakEnabled) {
            document.body.classList.add('dm-cloaked');
        }
    });
}

/**
 * Wrap elements in a {@link DommaCollection}: a CSS selector, an HTML string (`'<li>One</li>'`), an element,
 * a NodeList, an array of elements or another collection.
 * @overload
 * @param {import('./dom.js').DommaSelector} selector - CSS selector, HTML string, element(s) or a collection
 * @param {Document | Element | DocumentFragment} [context] - Where to look for a CSS selector (default: document)
 * @returns {import('./dom.js').DommaCollection}
 */
/**
 * Run a function when the DOM is ready (straight away if it already is).
 * @overload
 * @param {() => void} callback
 * @returns {import('./dom.js').DommaCollection} An empty collection
 */
/**
 * @param {*} selector
 * @param {*} [context]
 */
const Domma = (selector, context) => dom(selector, context);

// Version and build info (injected at build time by Rollup)
/* eslint-disable no-undef */
Domma.version = __BUILD_VERSION__;
Domma.buildInfo = {
    version: __BUILD_VERSION__,
    built: __BUILD_DATE__,
    commit: __BUILD_COMMIT__
};
/* eslint-enable no-undef */

// Attach modules
Domma.http = http;
Domma.utils = utils;
/**
 * Set up components, initial state and events declaratively, keyed by selector.
 * @param {DommaSetupConfig} config
 * @returns {void}
 */
Domma.setup = (config) => {
    // Handle cloak configuration (default: enabled)
    if (config.cloak === false) {
        cloakEnabled = false;
        if (typeof document !== 'undefined' && document.body) {
            document.body.classList.remove('dm-cloaked');
            document.body.classList.add('dm-ready');
        }
    }

    // Handle theme configuration
    // noStyles: true disables all Domma theming (for BYOS - Bring Your Own Styles)
    if (config.noStyles) {
        theme.init({disabled: true});
    } else if (config.theme || config.autoDetectTheme) {
        theme.init({
            theme: config.theme, // Now expects full theme name like 'ocean-dark'
            autoDetect: config.autoDetectTheme,
            persist: config.persistTheme !== false
        });
    }

    // Scan for icons if enabled
    if (config.scanIcons) {
        icons.scan();
    }

    // Process component configuration
    return configEngine.process(config);
};

// Configuration update method
/**
 * Update the configuration for a selector (deep merged) and apply the changes.
 * @param {string} selector
 * @param {Partial<import('./config.js').SelectorConfig>} changes
 * @returns {import('./config.js').SelectorConfig} The merged configuration
 */
Domma.update = (selector, changes) => configEngine.update(selector, changes);

// Configuration retrieval method
/** @type {import('./config.js').ConfigEngine['config']} */
Domma.config = (selector) => configEngine.config(selector);

// Live component instance created by $.setup() for a selector.
// NOTE: named getComponent, not component - Domma.component() defines a
// standalone Web Component and must not be shadowed.
/** @type {import('./config.js').ConfigEngine['getComponent']} */
Domma.getComponent = (selector) => configEngine.getComponent(selector);

// Configuration reset/destroy method
/** @type {import('./config.js').ConfigEngine['reset']} */
Domma.reset = (selector) => configEngine.reset(selector);

// DOMReady helper method
/** @type {import('./config.js').ConfigEngine['ready']} */
Domma.ready = (callback) => configEngine.ready(callback);

Domma.models = models;
Domma.elements = elements;
Domma.effects = effects;
Domma.dates = dates;
Domma.tables = tables;
Domma.forms = forms;
Domma.smoothCaret = smoothCaret;
Domma.theme = theme;
Domma.icons = icons;
Domma.storage = storage;
Domma.auth = auth;
Domma.router = router;
Domma.sanitize = sanitizeModule;
Domma.components = components;
Domma.i18n = i18n;
// Domma.t('key', params) - the call you write most, so it gets a short name on Domma itself.
/**
 * Translate a key - shortcut for `Domma.i18n.t()`.
 * @param {string} key
 * @param {Record<string, any> | null} [params] - Values for `{name}` placeholders, `count` for plurals
 * @param {import('./i18n.js').I18nTranslateOptions} [options]
 * @returns {string}
 */
Domma.t = (key, params, options) => i18n.t(key, params, options);

/**
 * Shorthand for Domma.components.define() - register a standalone component.
 * Usage: Domma.component('tag-name', definition)
 *
 * @param {string} tagName
 * @param {import('./component-factory.js').ComponentDefinition} definition
 * @returns {ReturnType<typeof createComponent>}
 */
Domma.component = (tagName, definition) => createComponent(tagName, definition);

// Expose DesktopNotification class for static method access
Domma.DesktopNotification = DesktopNotification;

/**
 * The Domma function and everything on it. `$` is the same function.
 * @typedef {typeof Domma & DommaExtras} DommaStatic
 */
/**
 * Statics attached outside this file: `noConflict` by installGlobals() (globals.js), `flags` / `FL` by the
 * opt-in domma-flags bundle.
 * @typedef {object} DommaExtras
 * @property {(deep?: boolean) => DommaStatic} noConflict Give `$` and `_` back to whatever owned them before
 *   Domma loaded (jQuery, Lodash). With `deep`, give back every short alias (`window.Domma` stays). Returns
 *   Domma, so `const dm = Domma.noConflict()` keeps a handle.
 * @property {import('./flags.js').Flags} [flags] Nation flags - present when domma-flags is loaded
 * @property {import('./flags.js').Flags} [FL] Alias for `flags` (opt-in module)
 */

// Short aliases
/** @type {DommaStatic} */
const $ = Domma;
/** @type {typeof utils} */
const _ = utils;
/** @type {typeof models} */
const M = models;
/** @type {typeof dates} */
const D = dates;
/** @type {typeof storage} */
const S = storage;
/** @type {typeof auth} */
const A = auth;
/** @type {typeof forms} */
const F = forms;
/** @type {typeof http} */
const H = http;
/** @type {typeof elements} */
const E = elements;
/** @type {typeof icons} */
const I = icons;
/** @type {typeof tables} */
const T = tables;
/** @type {typeof router} */
const R = router;
/**
 * Blueprint composition: `B.extend`, `B.pick`, `B.omit` (the same functions as `M.extend` / `M.pick` / `M.omit`).
 * @type {{extend: typeof models.extend, pick: typeof models.pick, omit: typeof models.omit}}
 */
const B = {  // Blueprint composition methods
    extend: models.extend.bind(models),
    pick: models.pick.bind(models),
    omit: models.omit.bind(models)
};

// Attach aliases to Domma
Domma.M = M;
Domma.D = D;
Domma.S = S;
Domma.A = A;
Domma.F = F;
Domma.H = H;
Domma.E = E;
Domma.I = I;
Domma.T = T;
Domma.R = R;
Domma.B = B;

Domma.isDomma = isDomma;

// Expose globally - see globals.js for `DommaOptions.globals` and `Domma.noConflict()`
installGlobals(Domma, {$, _, M, D, S, A, F, H, E, I, T, R, B});

export default Domma;
export {Domma, $, _, M, D, S, A, F, H, E, I, T, R, B, components, smoothCaret, i18n};

// Reveal page after Domma is ready
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    const reveal = () => {
        if (cloakEnabled && document.body.classList.contains('dm-cloaked')) {
            document.body.classList.add('dm-ready');
        }
    };

    if (document.readyState === 'complete') {
        setTimeout(reveal, 0);
    } else {
        window.addEventListener('load', reveal);
    }
}
