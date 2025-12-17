/**
 * Domma Minimal Bundle
 * Core DOM manipulation and utilities
 *
 * Modules: utils, dom, storage, icons
 * Estimated Size: ~144KB
 * Use Case: Simple DOM manipulation, no UI components
 */

import {utils} from '../utils.js';
import {dom} from '../dom.js';
import {storage} from '../storage.js';
import {icons} from '../icons.js';

const Domma = (selector, context) => dom(selector, context);

// Version and build info (injected at build time by Rollup)
/* eslint-disable no-undef */
Domma.version = __BUILD_VERSION__;
Domma.buildInfo = {
    version: __BUILD_VERSION__,
    built: __BUILD_DATE__,
    commit: __BUILD_COMMIT__,
    preset: 'minimal'
};
/* eslint-enable no-undef */

// Attach modules
Domma.utils = utils;
Domma.dom = dom;
Domma.storage = storage;
Domma.icons = icons;

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
