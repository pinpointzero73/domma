import {dom} from './dom.js';
import {http} from './http.js';
import {utils} from './utils.js';
import {configEngine} from './config.js';
import {models} from './models.js';
import {elements} from './elements.js';
import {dates} from './dates.js';
import {tables} from './tables.js';
import {theme} from './theme.js';
import {icons} from './icons.js';

const Domma = (selector) => dom(selector);

// Attach modules
Domma.http = http;
Domma.utils = utils;
Domma.setup = (config) => {
    // Handle theme configuration
    if (config.theme || config.themeVariant || config.autoDetectTheme) {
        theme.init({
            theme: config.theme,
            variant: config.themeVariant,
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
Domma.theme = theme;
Domma.icons = icons;

// Short aliases
const $ = Domma;
const _ = utils;
const M = models;
const D = dates;

// Attach aliases to Domma
Domma.M = M;
Domma.D = D;

// Expose globally if needed
if (typeof window !== 'undefined') {
    window.Domma = Domma;
    window.$ = $;
    window._ = _;
    window.M = M;
    window.D = D;
}

export default Domma;
export {Domma, $, _, M, D};
