# Domma Bundle System

This directory contains entry points for preset Domma bundles.

## Overview

These files are **automatically generated** by `scripts/generate-bundles.js` from `src/bundle-metadata.json`. Do not
edit these files directly - instead, update the metadata file and regenerate.

## Available Bundles

### Minimal (`minimal.js`)

**Size:** ~100KB
**Modules:** dom, utils, storage, icons
**Use Case:** Simple DOM manipulation without UI components

Perfect for projects that only need basic DOM manipulation and utilities. No UI components or advanced features.

### Essentials (`essentials.js`)

**Size:** ~180KB
**Modules:** dom, utils, storage, icons, elements, config, http
**Use Case:** Interactive sites with UI components

Includes all commonly-used features: DOM manipulation, UI components (modals, tabs, etc.), configuration engine, and
HTTP client.

### Data-Focused (`data-focused.js`)

**Size:** ~150KB
**Modules:** dom, utils, tables, icons, storage, http
**Use Case:** Data-heavy applications, dashboards

Optimised for data-centric applications. Includes the powerful DataTable component for sorting, filtering, pagination,
and export.

### No-UI (`no-ui.js`)

**Size:** ~80KB
**Modules:** utils, http, dates, models, storage
**Use Case:** Headless utilities, integration with existing frameworks

BYOS (Bring Your Own Styles) - perfect for integrating with React, Vue, or other frameworks. Just utilities, no DOM
manipulation or UI.

### Full (`../index.js`)

**Size:** ~258KB
**Modules:** All modules
**Use Case:** Applications using all features

The complete Domma framework. This bundle uses `src/index.js` as its entry point.

## Creating a Custom Bundle

If none of the presets fit your needs, you can create a custom bundle:

### 1. Create Entry Point

Create a new file in this directory (e.g., `custom.js`):

```javascript
import { dom } from '../dom.js';
import { utils } from '../utils.js';
import { http } from '../http.js';

// Context parameter allows scoped DOM searches:
// Domma('.item', container)  // Search within container only
const Domma = (selector, context) => dom(selector, context);

Domma.version = __BUILD_VERSION__;
Domma.buildInfo = {
    version: __BUILD_VERSION__,
    built: __BUILD_DATE__,
    commit: __BUILD_COMMIT__,
    preset: 'custom'
};

// Attach modules
Domma.utils = utils;
Domma.http = http;

// Short aliases
const $ = Domma;
const _ = utils;

// Attach aliases
Domma._ = _;

// Expose globally
if (typeof window !== 'undefined') {
    window.Domma = Domma;
    window.$ = $;
    window._ = _;
}

export default Domma;
export { Domma, $, _ };
```

### 2. Update Rollup Config

Add your bundle to `rollup.config.js`:

```javascript
{
    input: 'src/bundles/custom.js',
    output: [
        {
            file: 'public/dist/domma-custom.min.js',
            format: 'umd',
            name: 'Domma',
            sourcemap: false,
            banner
        },
        {
            file: 'public/dist/domma-custom.esm.js',
            format: 'es',
            sourcemap: false,
            banner
        }
    ],
    plugins: commonPlugins
}
```

### 3. Build

```bash
npm run build
```

Your custom bundle will be in `public/dist/domma-custom.min.js`.

## Module Dependencies

Some modules depend on others. When creating custom bundles, ensure dependencies are included:

- **dom** → requires utils
- **models** → requires utils, storage
- **tables** → requires utils, icons
- **config** → requires dom, elements, utils

### Example: Minimal Valid Bundle

```javascript
// Minimal: Just utilities
import { utils } from '../utils.js';

// Also valid: DOM manipulation
import { dom } from '../dom.js';
import { utils } from '../utils.js'; // dom requires utils!
```

## Regenerating Bundles

To regenerate all preset bundles after updating `bundle-metadata.json`:

```bash
npm run generate:bundles
```

This will recreate all `*.js` files in this directory.

## Bundle Sizes

Actual sizes may vary slightly depending on:

- Minification settings
- Tree-shaking effectiveness
- Rollup version

Run `npm run build` to see exact sizes in `public/dist/build-info.json`.
