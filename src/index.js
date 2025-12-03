import {dom} from './dom.js';
import {http} from './http.js';
import {utils} from './utils.js';
import {configEngine} from './config.js';
import {models} from './models.js';
import {elements} from './elements.js';
import {dates} from './dates.js';
import {tables} from './tables.js';

const Domma = (selector) => dom(selector);

// Attach modules
Domma.http = http;
Domma.utils = utils;
Domma.setup = (config) => configEngine.process(config);
Domma.models = models;
Domma.elements = elements;
Domma.dates = dates;
Domma.tables = tables;

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
