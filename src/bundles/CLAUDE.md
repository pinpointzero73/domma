# CLAUDE.md - Custom Bundles

This file provides guidance for creating and managing custom Domma bundles.

## Bundles Overview

Domma is split into multiple bundles:

| Bundle                | Size   | Contents                                                                                          |
|-----------------------|--------|---------------------------------------------------------------------------------------------------|
| `domma.min.js`        | ~258KB | Core framework (DOM, utils, dates, models, elements, tables, config, http, storage, theme, icons) |
| `domma-tools.min.js`  | ~78KB  | Developer tools (Theme Roller, Quick Roller, Editor)                                              |
| `domma-syntax.min.js` | ~4KB   | Syntax highlighting addon (JavaScript, HTML, CSS)                                                 |

**Usage:**

```html
<!-- Core only -->
<script src="dist/domma.min.js"></script>

<!-- With developer tools -->
<script src="dist/domma.min.js"></script>
<script src="dist/domma-tools.min.js"></script>

<!-- With syntax highlighting -->
<script src="dist/domma.min.js"></script>
<script src="dist/domma-syntax.min.js"></script>
```

The tools bundle attaches to `Domma.elements` automatically when loaded:

```javascript
// Available after loading domma-tools.min.js
Domma.elements.themeRoller('#container', options);
Domma.elements.quickRoller('#container', options);
Domma.elements.editor('#editor', options);
```

The syntax highlighter attaches to `Domma.syntax` and `window.DommaSyntax`:

```javascript
// Available after loading domma-syntax.min.js
Domma.syntax.highlight(element, 'javascript');
Domma.syntax.scan();  // Auto-highlight all code blocks
```

Zero external dependencies.

## Custom Bundles

Domma supports custom bundles for optimised file sizes. Several preset bundles are provided, or you can create your own.

### Preset Bundles

| Bundle                      | Size   | Modules                                  | Use Case                             |
|-----------------------------|--------|------------------------------------------|--------------------------------------|
| `domma-minimal.min.js`      | ~144KB | dom, utils, storage, icons               | Simple DOM manipulation              |
| `domma-essentials.min.js`   | ~211KB | minimal + elements, config, http         | Interactive sites with UI components |
| `domma-data-focused.min.js` | ~172KB | dom, utils, tables, icons, storage, http | Data-heavy applications, dashboards  |
| `domma-no-ui.min.js`        | ~39KB  | utils, http, dates, models, storage      | Headless/BYOS integration            |
| `domma.min.js` (Full)       | ~258KB | All modules                              | Complete framework                   |

**Size Comparison:**

- **Minimal**: 44% smaller than full bundle
- **Essentials**: 18% smaller
- **Data-Focused**: 33% smaller
- **No-UI**: 85% smaller (perfect for headless apps)

### Using Preset Bundles

```html
<!-- Minimal bundle - just DOM and utilities -->
<script src="dist/domma-minimal.min.js"></script>

<!-- Essentials bundle - most common features -->
<script src="dist/domma-essentials.min.js"></script>

<!-- No-UI bundle - BYOS (Bring Your Own Styles) -->
<script src="dist/domma-no-ui.min.js"></script>
```

### Creating Custom Bundles

Visit the [Download Page](../../public/showcase/download/index.html) and use the **Bundle Builder** to:

1. Select specific modules you need
2. View automatic dependency resolution (dependencies are selected automatically)
3. Download pre-built preset bundles instantly
4. Generate build instructions for truly custom combinations

**Example:** If you only need DOM manipulation and HTTP requests, select `dom`, `utils`, and `http`. The Bundle Builder
will automatically include `utils` (required by `dom`) and show you the total size.

### Module Dependencies

When creating custom bundles, these dependencies are automatically included:

- **dom** → requires `utils`
- **models** → requires `utils`, `storage`
- **tables** → requires `utils`, `icons`
- **config** → requires `dom`, `elements`, `utils`

The Bundle Builder handles this automatically - when you select a module, its dependencies are selected and locked.

### Build Your Own

To manually create a custom bundle:

1. Create an entry point in `src/bundles/` (or use the Bundle Builder to generate one)
2. Add configuration to `rollup.config.js`
3. Run `npm run build`

See `src/bundles/README.md` for detailed instructions and examples.

## Entry Point Files

This directory contains entry point files for preset bundles:

```
src/bundles/
├── README.md           ← Bundle documentation (existing)
├── CLAUDE.md           ← This file - Claude Code guidance
├── minimal.js          ← Minimal bundle entry
├── essentials.js       ← Essentials bundle entry
├── data-focused.js     ← Data-focused bundle entry
└── no-ui.js            ← No-UI bundle entry
```

Each entry point imports only the modules needed for that bundle configuration.

## Creating New Bundle Entry Points

To create a new custom bundle:

1. **Create entry point file** in this directory (e.g., `my-bundle.js`):

```javascript
// src/bundles/my-bundle.js
import dom from '../dom.js';
import utils from '../utils.js';
import http from '../http.js';

export default {
    dom,
    utils,
    http
};
```

2. **Add Rollup configuration** in `rollup.config.js`:

```javascript
{
    input: 'src/bundles/my-bundle.js',
    output: {
        file: 'dist/domma-my-bundle.min.js',
        format: 'umd',
        name: 'Domma'
    },
    plugins: [/* ... */]
}
```

3. **Build**:

```bash
npm run build
```

## Bundle Testing

After creating a custom bundle:

1. Test in browser - load `dist/domma-[name].min.js`
2. Verify all expected modules are available
3. Check file size meets requirements
4. Test with showcase examples

## Development Guidelines

- Always include required dependencies
- Document bundle purpose and contents
- Update bundle list in main README.md
- Test bundles before committing
- Keep bundle entry points simple - just imports and exports

## Related Documentation

- [Main CLAUDE.md](../../CLAUDE.md) - Project overview
- [Core Modules](../CLAUDE.md) - Module architecture
- [Bundle README](./README.md) - Detailed bundle instructions
