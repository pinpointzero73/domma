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

Domma.models = models;
Domma.elements = elements;
Domma.dates = dates;
Domma.tables = tables;
Domma.forms = forms;
Domma.theme = theme;
Domma.icons = icons;
Domma.storage = storage;
Domma.auth = auth;

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

// Attach aliases to Domma
Domma.M = M;
Domma.D = D;
Domma.S = S;
Domma.A = A;

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
}

export default Domma;
export {Domma, $, _, M, D, S, A, F};
