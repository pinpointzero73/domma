/**
 * Domma Data-Focused Bundle
 * Data manipulation and tables
 *
 * Modules: utils, dom, tables, icons, storage, http
 * Estimated Size: ~150KB
 * Use Case: Data-heavy applications, dashboards
 */

import {utils} from '../utils.js';
import {dom} from '../dom.js';
import {tables} from '../tables.js';
import {icons} from '../icons.js';
import {storage} from '../storage.js';
import {http} from '../http.js';

const Domma = (selector) => dom(selector);

// Version and build info (injected at build time by Rollup)
/* eslint-disable no-undef */
Domma.version = __BUILD_VERSION__;
Domma.buildInfo = {
    version: __BUILD_VERSION__,
    built: __BUILD_DATE__,
    commit: __BUILD_COMMIT__,
    preset: 'data-focused'
};
/* eslint-enable no-undef */

// Attach modules
Domma.utils = utils;
Domma.dom = dom;
Domma.tables = tables;
Domma.icons = icons;
Domma.storage = storage;
Domma.http = http;

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
