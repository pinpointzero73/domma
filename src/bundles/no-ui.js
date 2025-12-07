/**
 * Domma No-UI Bundle
 * Headless utilities (BYOS)
 *
 * Modules: utils, http, dates, models, storage
 * Estimated Size: ~80KB
 * Use Case: Integration with existing frameworks
 */

import {utils} from '../utils.js';
import {http} from '../http.js';
import {dates} from '../dates.js';
import {models} from '../models.js';
import {storage} from '../storage.js';

const Domma = (selector) => null;

// Version and build info (injected at build time by Rollup)
/* eslint-disable no-undef */
Domma.version = __BUILD_VERSION__;
Domma.buildInfo = {
    version: __BUILD_VERSION__,
    built: __BUILD_DATE__,
    commit: __BUILD_COMMIT__,
    preset: 'no-ui'
};
/* eslint-enable no-undef */

// Attach modules
Domma.utils = utils;
Domma.http = http;
Domma.dates = dates;
Domma.models = models;
Domma.storage = storage;

// Short aliases
const _ = utils;
const D = dates;
const M = models;
const S = storage;

// Attach aliases to Domma
Domma._ = _;
Domma.D = D;
Domma.M = M;
Domma.S = S;

// Expose globally if needed
if (typeof window !== 'undefined') {
    window.Domma = Domma;
    window._ = _;
    window.D = D;
    window.M = M;
    window.S = S;
}

export default Domma;
export {Domma, _, D, M, S};
