/**
 * Domma Grayve Theme Preset Bundle
 * Preset with Bootswatch Slate theme
 *
 * Modules: utils, dom, storage, icons, elements, config, http, dates, models, tables, theme
 * Estimated Size: ~258KB
 * Use Case: Applications using all features with Grayve theme
 */

import {utils} from '../utils.js';
import {dom} from '../dom.js';
import {storage} from '../storage.js';
import {icons} from '../icons.js';
import {elements} from '../elements.js';
import {configEngine as config} from '../config.js';
import {http} from '../http.js';
import {dates} from '../dates.js';
import {models} from '../models.js';
import {tables} from '../tables.js';
import {theme} from '../theme.js';

const Domma = (selector, context) => dom(selector, context);

// Version and build info (injected at build time by Rollup)
/* eslint-disable no-undef */
Domma.version = __BUILD_VERSION__;
Domma.buildInfo = {
  version: __BUILD_VERSION__,
  built: __BUILD_DATE__,
  commit: __BUILD_COMMIT__,
  preset: 'grayve'
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
Domma.dates = dates;
Domma.models = models;
Domma.tables = tables;
Domma.theme = theme;

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
const D = dates;
const M = models;

// Attach aliases to Domma
Domma._ = _;
Domma.$ = $;
Domma.S = S;
Domma.D = D;
Domma.M = M;

// Expose globally if needed
if (typeof window !== 'undefined') {
  window.Domma = Domma;
  window._ = _;
  window.$ = $;
  window.S = S;
  window.D = D;
  window.M = M;
}

export default Domma;
export {Domma, _, $, S, D, M};
