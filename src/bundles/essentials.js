/**
 * Domma Essentials Bundle
 * Most commonly used features
 *
 * Modules: utils, dom, storage, icons, elements, config, http
 * Estimated Size: ~211KB
 * Use Case: Interactive sites with UI components
 */

import {utils} from '../utils.js';
import {dom} from '../dom.js';
import {storage} from '../storage.js';
import {icons} from '../icons.js';
import {elements} from '../elements.js';
import {configEngine as config} from '../config.js';
import {http} from '../http.js';

const Domma = (selector) => dom(selector);

// Version and build info (injected at build time by Rollup)
/* eslint-disable no-undef */
Domma.version = __BUILD_VERSION__;
Domma.buildInfo = {
    version: __BUILD_VERSION__,
    built: __BUILD_DATE__,
    commit: __BUILD_COMMIT__,
    preset: 'essentials'
};
/* eslint-enable no-undef */

// Attach modules
Domma.utils = utils;
Domma.dom = dom;
Domma.storage = storage;
Domma.icons = icons;
Domma.elements = elements;
Domma.config = config;
Domma.http = http;

// Configuration methods (from config module)
Domma.setup = (config) => {
    // Handle theme configuration
    if (config.noStyles && Domma.theme) {
        Domma.theme.init({disabled: true});
    } else if ((config.theme || config.themeVariant || config.autoDetectTheme) && Domma.theme) {
        Domma.theme.init({
            theme: config.theme,
            variant: config.themeVariant,
            autoDetect: config.autoDetectTheme,
            persist: config.persistTheme !== false
        });
    }

    // Scan for icons if enabled
    if (config.scanIcons && Domma.icons) {
        Domma.icons.scan();
    }

    // Process component configuration
    return config.process(config);
};

Domma.update = (selector, changes) => config.update(selector, changes);
Domma.config = (selector) => config.config(selector);
Domma.reset = (selector) => config.reset(selector);

// Short aliases
const _ = utils;
const $ = dom;
const S = storage;

// Attach aliases to Domma
Domma._ = _;
Domma.$ = $;
Domma.S = S;

// Expose globally if needed
if (typeof window !== 'undefined') {
    window.Domma = Domma;
    window._ = _;
    window.$ = $;
    window.S = S;
}

export default Domma;
export {Domma, _, $, S};
