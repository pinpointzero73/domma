import {dom} from './dom.js';
import {http} from './http.js';
import {utils} from './utils.js';
import {configEngine} from './config.js';
import {models} from './models.js';
import {DesktopNotification, elements} from './elements.js';
import {dates} from './dates.js';
import {tables} from './tables.js';
import {forms} from './forms.js';
import {theme} from './theme.js';
import {icons} from './icons.js';
import {storage} from './storage.js';
import {auth} from './auth.js';
import sanitizeModule from './sanitize.js';

// Register Web Components (Badge, Tooltip, Loader, BackToTop)
import {registerComponents} from './web-components/index.js';
registerComponents();

// Cloaking - hide page immediately to prevent FOUC
let cloakEnabled = true;
if (typeof document !== 'undefined' && document.body) {
    document.body.classList.add('dm-cloaked');
} else if (typeof document !== 'undefined') {
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

// Configuration reset/destroy method
Domma.reset = (selector) => configEngine.reset(selector);

// DOMReady helper method
Domma.ready = (callback) => configEngine.ready(callback);

Domma.models = models;
Domma.elements = elements;
Domma.dates = dates;
Domma.tables = tables;
Domma.forms = forms;
Domma.theme = theme;
Domma.icons = icons;
Domma.storage = storage;
Domma.auth = auth;
Domma.sanitize = sanitizeModule;

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
Domma.B = B;

// Expose globally if needed
if (typeof window !== 'undefined') {
    window.Domma = Domma;
    window.$ = $;
    window._ = _;
    window.M = M;
    window.D = D;
    window.S = S;
    window.A = A;
    window.F = F;
    window.H = H;
    window.E = E;
    window.I = I;
    window.T = T;
    window.B = B;
}

export default Domma;
export {Domma, $, _, M, D, S, A, F, H, E, I, T, B};

// Reveal page after Domma is ready
if (typeof document !== 'undefined') {
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
