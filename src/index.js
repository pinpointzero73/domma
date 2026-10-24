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
import effects from './effects.js';
import sanitizeModule from './sanitize.js';
import {components, createComponent} from './component-factory.js';

// Importing registers the Web Components (Badge, Tooltip, Loader, BackToTop, ...)
import './web-components/index.js';
import {installGlobals, loadOption} from './globals.js';

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
Domma.update = (selector, changes) => configEngine.update(selector, changes);

// Configuration retrieval method
Domma.config = (selector) => configEngine.config(selector);

// Live component instance created by $.setup() for a selector.
// NOTE: named getComponent, not component - Domma.component() defines a
// standalone Web Component and must not be shadowed.
Domma.getComponent = (selector) => configEngine.getComponent(selector);

// Configuration reset/destroy method
Domma.reset = (selector) => configEngine.reset(selector);

// DOMReady helper method
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

/**
 * Shorthand for Domma.components.define() - register a standalone component.
 * Usage: Domma.component('tag-name', definition)
 *
 * @param {string} tagName
 * @param {Object} definition
 */
Domma.component = (tagName, definition) => createComponent(tagName, definition);

// Expose DesktopNotification class for static method access
Domma.DesktopNotification = DesktopNotification;

// Short aliases
const $ = Domma;
const _ = utils;
const M = models;
const D = dates;
const S = storage;
const A = auth;
const F = forms;
const H = http;
const E = elements;
const I = icons;
const T = tables;
const R = router;
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
export {Domma, $, _, M, D, S, A, F, H, E, I, T, R, B, components, smoothCaret};

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
