import { dom } from './dom.js';
import { http } from './http.js';
import { utils } from './utils.js';
import { configEngine } from './config.js';

const Domma = (selector) => dom(selector);

// Attach modules
Domma.http = http;
Domma.utils = utils;
Domma.setup = (config) => configEngine.process(config);

// Expose globally if needed
if (typeof window !== 'undefined') {
    window.Domma = Domma;
}

export default Domma;
