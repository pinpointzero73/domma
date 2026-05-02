# CLAUDE.md

This file provides high-level guidance to Claude Code (claude.ai/code) when working with code in this repository.

For detailed, context-specific guidance, consult the distributed CLAUDE.md files in relevant folders.

## What is Domma?

**D**ynamic **O**bject **M**anipulation & **M**odeling **A**PI

A lightweight, zero-dependency JavaScript framework combining jQuery-style DOM manipulation, Lodash utilities, and
modern UI components.

## ⚠️ STOP - Convention Enforcement

**Before writing code, check this table to use Domma's built-in features instead of reinventing them:**

| When you need...                  | Use Domma's...                | NOT...                          |
|-----------------------------------|-------------------------------|---------------------------------|
| DOM selection/manipulation        | `$('#el').addClass('active')` | `document.querySelector()`      |
| Store data locally                | `S.set('key', data)`          | `localStorage.setItem()`        |
| Make HTTP requests                | `H.get('/api/users')`         | `fetch('/api/users')`           |
| Utility functions (map, filter)   | `_.map(array, fn)`            | Manual `array.map()`            |
| Date manipulation                 | `D().add(1, 'day')`           | Manual date arithmetic          |
| Reactive data models              | `M.create(blueprint)`         | Manual state management         |
| Form generation                   | `F.create(selector, blueprint)` | Manual `<form>` HTML          |
| UI components (modals, tabs)      | `E.modal(selector, options)`  | Manual HTML/CSS/JS              |
| Toast notifications               | `E.toast('Message', {type})`  | Manual notification divs        |
| Icons                             | `<span data-icon="name">`     | Manual SVG/icon fonts           |
| DataTables                        | `T.create(selector, {data})`  | Manual table generation         |
| Confirm dialogs                   | `await E.confirm('Sure?')`    | `window.confirm()`              |
| Templates                         | `templateUrl: 'path.html'`    | Large template strings in JS    |

**Template File Convention:**
- ✅ **DO**: Use `templateUrl: 'path/to/template.html'` for view templates
- ✅ **DO**: Store templates in `/templates/` directories near view files
- ✅ **DO**: Use `partials: { name: 'path.html' }` for reusable template sections
- ❌ **DON'T**: Put large HTML template strings in JavaScript const variables
- ❌ **DON'T**: Use inline `template:` strings longer than ~5 lines

**When Unsure:**
- If you're about to write vanilla JavaScript for something common (HTTP, storage, DOM, forms, dates), **ASK** if Domma provides it
- If you're about to paste a large HTML string into a JavaScript file, **ASK** about using `templateUrl`
- Check the [Domma Features Reference](#domma-features-reference) below before implementing manually

## Commands

**Build:**
```bash
npm install
npm run build
```

Full build chain (in order):
1. `generate:bundles` — generate preset bundle entry points
2. `rollup -c` — compile JS bundles to `public/dist/`
3. `build:info` — write `build-info.json`
4. `build:metadata` — copy `bundle-metadata.json`
5. `copy:themes` — copy theme CSS files to `public/dist/themes/`
6. `build:css` — compile CSS source → `public/dist/*.css`
7. `build:css-bundles` — compile preset CSS bundles
8. `build:archives` — generate `.tar.gz` preset archives
9. **`build:kickstart-files`** — copy templates + dist files to `public/download/kickstart-files/` and generate `kickstart-manifest.json`
10. `build:miniapps` — build all miniapps

**Kickstart files only** (fast, no JS/CSS rebuild needed):
```bash
npm run build:kickstart-files
```

**Showcase:**

```bash
npm run showcase  # Comprehensive showcase with all features
```

**Tests:**
Open `tests/test.html` in a browser.

## Documentation Structure

This project uses distributed CLAUDE.md files for focused, context-specific guidance. When working in a specific area,
consult that folder's CLAUDE.md for detailed information.

### Core Framework

- [src/CLAUDE.md](./src/CLAUDE.md) - Core modules architecture and development (DOM, utils, dates, models, elements,
  tables, config, http, storage)
- [src/bundles/CLAUDE.md](./src/bundles/CLAUDE.md) - Custom bundle creation and configuration

### Showcase & Examples

- [public/showcase/CLAUDE.md](./public/showcase/CLAUDE.md) - Showcase development guide (meta)
- [public/showcase/dom/CLAUDE.md](./public/showcase/dom/CLAUDE.md) - DOM module showcase examples
- [public/showcase/utils/CLAUDE.md](./public/showcase/utils/CLAUDE.md) - Utils module showcase examples
- [public/showcase/dates/CLAUDE.md](./public/showcase/dates/CLAUDE.md) - Dates module showcase examples
- [public/showcase/models/CLAUDE.md](./public/showcase/models/CLAUDE.md) - Models module showcase examples
- [public/showcase/tables/CLAUDE.md](./public/showcase/tables/CLAUDE.md) - Tables module showcase examples
- [public/showcase/elements/CLAUDE.md](./public/showcase/elements/CLAUDE.md) - UI components showcase examples
- [public/showcase/config/CLAUDE.md](./public/showcase/config/CLAUDE.md) - Configuration engine showcase examples
- [public/showcase/http/CLAUDE.md](./public/showcase/http/CLAUDE.md) - HTTP client showcase examples
- [public/showcase/storage/CLAUDE.md](./public/showcase/storage/CLAUDE.md) - Storage wrapper showcase examples
- [public/showcase/theme-roller/CLAUDE.md](./public/showcase/theme-roller/CLAUDE.md) - Developer tools (Editor, Page
  Roller, Theme Roller)

### Additional Documentation

- [docs/API.md](./docs/API.md) - Complete API reference
- [docs/DommaDocumentation.md](./docs/DommaDocumentation.md) - Comprehensive user documentation
- [docs/GettingStarted.md](./docs/GettingStarted.md) - Quick start guide
- [README.md](./README.md) - Project overview

**When working in a specific folder, consult that folder's CLAUDE.md for focused guidance.**

## Aliases

| Full Path        | Alias | Global     | Description                      |
|------------------|-------|------------|----------------------------------|
| `Domma()`        | `$`   | `window.$` | DOM selection/manipulation       |
| `Domma.utils`    | `_`   | `window._` | Utility functions                |
| `Domma.models`   | `M`   | `window.M` | Reactive models & pub/sub        |
| Blueprint        | `B`   | `window.B` | Blueprint composition (extend, pick, omit) |
| `Domma.dates()`  | `D()` | `window.D` | Date manipulation                |
| `Domma.storage`  | `S`   | `window.S` | localStorage wrapper             |
| `Domma.auth`     | `A`   | `window.A` | Authentication module            |
| `Domma.forms`    | `F`   | `window.F` | Form builder                     |
| `Domma.http`     | `H`   | `window.H` | HTTP client                      |
| `Domma.elements` | `E`   | `window.E` | UI components                    |
| `Domma.icons`    | `I`   | `window.I` | SVG icon system                  |
| `Domma.tables`   | `T`   | `window.T` | DataTable functionality          |
| `Domma.router`   | `R`   | `window.R` | Client-side router               |

## CSS Architecture

Domma's CSS follows a proper build process with single source of truth:

**Source Files (edit these):**
```
src/css/
├── domma.css           # Base styles, typography, utilities
├── grid.css            # Grid system (Bootstrap + CSS Grid)
└── elements.css        # UI components - 22 components
```

**Production Files (built):**

```
public/dist/
├── domma.css           # Built from src/css/domma.css (~61KB)
├── grid.css            # Built from src/css/grid.css (~5KB)
├── elements.css        # Built from src/css/elements.css (~41KB)
└── themes/
    └── domma-themes.css # Built from public/assets/themes/* (~43KB)
```

**Build Process:**

```bash
npm run build:css  # Builds src/css/* → public/dist/*
```

**Load Order:**
```html

<link rel="stylesheet" href="dist/domma.css">       <!-- 1. Base + utilities -->
<link rel="stylesheet" href="dist/grid.css">        <!-- 2. Grid system -->
<link rel="stylesheet" href="dist/elements.css">    <!-- 3. UI components -->
<link rel="stylesheet" href="dist/themes/domma-themes.css"> <!-- 4. Theming -->
```

**What's in each file:**

- **domma.css** - Foundation
  - CSS variables (design tokens)
  - Reset/normalize styles
  - Base typography
  - Utility classes (spacing, display, colors)
  - Form controls (inputs, selects, textareas)

- **grid.css** - Layout systems
  - Bootstrap-style row/column grid (12 columns)
  - CSS Grid utilities (Tailwind-style)
  - Responsive containers
  - Flexbox utilities

- **elements.css** - UI components (22 total)
  - Buttons, Cards, Modals, Tabs, Accordion
  - Tooltip, Table, Form elements, Badges, Pills
  - Alert, Code blocks, Pagination, Navbar, Sidebar
  - Footer, hero, Carousel, Dialog, Slideover, Dropdown, Progression

- **domma-themes.css** - Visual styling
  - Theme color definitions
  - Light/dark theme variants
  - Component theming

**Why this architecture?**

1. **Modularity** - Load only what you need
2. **Clarity** - Clear separation of concerns
3. **Maintainability** - Easy to find and update styles
4. **Performance** - Can cache base styles separately from components

## File Structure

```
src/
├── index.js         # Main entry, exports Domma + aliases
├── tools.js         # Tools bundle entry (Theme Roller, Page Roller, Editor, Print-to-PDF)
├── dom.js           # jQuery-compatible DOM API
├── utils.js         # Lodash-compatible utilities
├── dates.js         # Moment-style date manipulation
├── models.js        # Reactive models & pub/sub
├── elements.js      # UI components
├── tables.js        # DataTable functionality
├── config.js        # JSON configuration engine
├── http.js          # HTTP client
├── storage.js       # localStorage wrapper
├── theme.js         # Theme management
├── icons.js         # SVG icon system
├── theme-roller.js  # Theme customisation tool (tools bundle)
├── quick-roller.js  # Page builder tool (tools bundle)
├── editor.js        # Content editor tool (tools bundle)
└── print-to-pdf.js  # Print-to-PDF tool (tools bundle)

showcase/            # Comprehensive demos for each namespace
public/dist/         # Built bundles (UMD + ESM)
```

## Public Folder Structure

The `/public` directory contains the user-facing website, documentation, and examples:

```
public/
├── index.html           # Landing page (root level only)
├── about/               # About page
│   └── index.html
├── faq/                 # FAQ page
│   └── index.html
├── blog/                # Blog section
│   └── index.html
├── showcase/            # Feature demonstrations (40+ examples)
│   ├── index.html
│   ├── dom/
│   ├── utils/
│   ├── dates/
│   ├── models/
│   ├── elements/
│   ├── tables/
│   ├── config/
│   ├── http/
│   ├── storage/
│   ├── icons/
│   ├── themes/
│   ├── grid/
│   ├── theme-roller/
│   └── page-roller/
├── download/            # Downloads page + Kickstart Builder
│   ├── index.html
│   ├── bundle-builder.js
│   ├── kickstart-builder.js     # Browser-side JSZip scaffolder
│   ├── kickstart-manifest.json  # GENERATED — do not edit manually
│   └── kickstart-files/         # GENERATED — gitignored build artefact
│       ├── mpa/                 # MPA template files (served statically)
│       ├── spa/                 # SPA template files (served statically)
│       └── dist/                # Domma dist files for kickstart zips
├── examples/            # Working example applications
│   └── todo/
├── quickstart/          # Getting-started docs (SPA-first)
│   ├── index.html       # Hub page — SPA listed first
│   ├── spa/             # SPA QuickStart guide
│   └── mpa/             # MPA QuickStart guide
├── layouts/             # Layout system (presets, modules, config)
│   ├── css/
│   ├── js/
│   └── config/
├── assets/              # Static resources
│   ├── icons/
│   ├── logo/
│   ├── themes/
│   └── ide/
└── dist/                # Built JavaScript bundles
    ├── domma.min.js
    ├── domma.esm.js
    ├── domma-tools.min.js
    └── themes/
```

**Important Notes:**

- All production pages use folder structure (e.g., `/about/index.html`, `/faq/index.html`)
- Only `index.html` exists at root level - everything else is in subdirectories
- This structure ensures clean, consistent URLs (`/about/`, `/faq/`, etc.)
- Test files and backups are not stored in the public directory

## Kickstart & Distribution

Three overlapping but distinct distribution concepts:

| Concept | What it is | Entry point |
|---------|-----------|-------------|
| **QuickStart** | Step-by-step getting-started docs | `public/quickstart/index.html` |
| **Kickstart** | Project scaffold templates (`npx domma init`) | `templates/kickstart/` (MPA), `templates/kickstart-spa/` (SPA) |
| **Preset Archives** | Downloadable `.tar.gz` bundles (JS + CSS only) | `public/dist/archives/` |

### CLI Default

`npx domma init` defaults to **SPA** mode. Pass `--mpa` to scaffold a Multi-Page Application.

```bash
npx domma init            # SPA (default)
npx domma init --spa      # explicit SPA
npx domma init --mpa      # Multi-Page Application
```

### Template Directories (npm published)

Only these template directories are included in the npm package (`"files"` in `package.json`):

```
templates/
├── kickstart/        # MPA scaffold (published)
├── kickstart-spa/    # SPA scaffold (published)
├── page-template/    # Add-a-page helper (published)
└── view-template/    # Add-a-view helper (published)
```

`templates/kickstart-old/` has been removed. Do not recreate it.

### Browser-Side Kickstart Builder (`public/download/`)

The Downloads page hosts a browser-side zip assembler powered by JSZip + FileSaver.js.

**How it works:**
1. `npm run build:kickstart-files` (`scripts/build-kickstart-files.js`) copies template files and dist assets to `public/download/kickstart-files/` and writes `public/download/kickstart-manifest.json`
2. The browser loads the manifest, lets the user configure their project (mode, name, theme, pages, AI files), then fetches the selected files, applies `{{placeholder}}` substitution in-memory, and triggers a `.zip` download — no server needed

**Build artefacts** (both gitignored, regenerated on every build):
- `public/download/kickstart-files/` — raw template and dist files served statically
- `public/download/kickstart-manifest.json` — file index with category/group/required metadata

**Key files:**
- `scripts/build-kickstart-files.js` — build script (classifies files as `core`, `page`, `view`, `ai`, `config`, `dist`)
- `public/download/kickstart-builder.js` — browser UI (uses DOMPurify for innerHTML, JSZip for zipping, FileSaver for download)

**Template variable substitutions** (applied to all non-binary files at download time):
- `{{projectName}}` — user's chosen project name
- `{{year}}` — current year
- `{{theme}}` — chosen theme (e.g. `charcoal-dark`)
- `{{includeThemeSelector}}` — `"true"` or `"false"`

## Project Guidelines

- When updating features or adding new ones, the documentation and showcase should be updated in-line
- Where and whenever possible use Domma in the showcase, documentation and tutorials
- When making changes to the namespaces/modules ensure that we update the PHPStorm code intelligence files at
  `public/assets/ide/phpstorm`
- Do not run a server as I am running one
- Audit your own work and reiterate where possible
- **British English**: Use British spellings in all new code, comments, and documentation (-ise not -ize, -yse not -yze, -our not -or). Existing code may use American spellings for backwards compatibility.
- When adding a new public page, add its entry to `public/sitemap.xml`

## Domma Features Reference

This comprehensive list covers ALL Domma features. **Always check this list before implementing features manually.**

### JavaScript Modules

#### DOM Manipulation (`$` / `Domma()`)

- 90+ jQuery-compatible methods
- Traversal: `find()`, `children()`, `parent()`, `parents()`, `closest()`, `siblings()`, `next()`, `prev()`, etc.
- Content: `html()`, `text()`, `val()`
- Attributes: `attr()`, `removeAttr()`, `prop()`, `removeProp()`, `data()`, `removeData()`
- CSS/Classes: `css()`, `addClass()`, `removeClass()`, `toggleClass()`, `hasClass()`
- Manipulation: `append()`, `prepend()`, `after()`, `before()`, `wrap()`, `unwrap()`, `remove()`, `clone()`, etc.
- Events: `on()`, `off()`, `one()`, `trigger()`, `hover()` + all event shortcuts
- Effects: `show()`, `hide()`, `toggle()`, `fadeIn()`, `fadeOut()`, `fadeToggle()`, `slideUp()`, `slideDown()`,
  `slideToggle()`, `animate()`
- Dimensions: `width()`, `height()`, `innerWidth()`, `innerHeight()`, `outerWidth()`, `outerHeight()`, `offset()`,
  `position()`, `scrollTop()`, `scrollLeft()`

#### Utils (`_` / `Domma.utils`)

- 120+ Lodash-compatible utilities
- Array: `chunk()`, `compact()`, `difference()`, `flatten()`, `uniq()`, `zip()`, `intersection()`, `union()`, etc.
- Collection: `each()`, `filter()`, `find()`, `groupBy()`, `keyBy()`, `map()`, `orderBy()`, `sortBy()`, `reduce()`, etc.
- Function: `debounce()`, `throttle()`, `memoize()`, `once()`, `curry()`, `partial()`, `flow()`, `compose()`, `chain()`
- Object: `get()`, `set()`, `has()`, `pick()`, `omit()`, `merge()`, `cloneDeep()`, `mapKeys()`, `mapValues()`, etc.
- Lang: `isArray()`, `isObject()`, `isFunction()`, `isEmpty()`, `isEqual()`, etc.
- String: `camelCase()`, `kebabCase()`, `snakeCase()`, `capitalize()`, `truncate()`, etc.
- Math: `sum()`, `mean()`, `max()`, `min()`, `clamp()`, `random()`
- Template: `template()`, `render()` (Mustache-style with `{{}}`, `{{#if}}`, `{{#each}}`, `{{> partial}}`)
- Browser: `copyToClipboard()`

#### Dates (`D()` / `Domma.dates`)

- Moment.js-style API
- Create: `D()`, `D('2025-12-25')`, `D(timestamp)`
- Manipulate: `add()`, `subtract()`, `startOf()`, `endOf()`, `set()`
- Format: `format()`, `toISOString()`, `unix()`
- Getters: `year()`, `month()`, `date()`, `day()`, `hour()`, `minute()`, `second()`
- Compare: `isBefore()`, `isAfter()`, `isSame()`, `isBetween()`, `diff()`
- Relative: `fromNow()`, `from()`, `toNow()`, `to()`

#### Blueprints (`M.extend()`, `M.pick()`, `M.omit()`)

- Unified schema system - define data structure once, use everywhere
- Powers Models, Forms, and CRUD operations
- **Composition:**
  - `M.extend(blueprint1, blueprint2, ...)` - Merge multiple blueprints
  - `M.pick(blueprint, ['field1', 'field2'])` - Extract specific fields
  - `M.omit(blueprint, ['field1', 'field2'])` - Remove specific fields
- **Type System:** `M.types.string`, `number`, `boolean`, `array`, `object`, `date`, `any`
- **Validation:** required, min, max, minLength, maxLength, pattern, custom validators
- **Integration:**
  - Models: `M.create(blueprint)` - Reactive data models
  - Forms: `Domma.forms.create(blueprint)` - Auto-generate forms
  - CRUD: `Domma.forms.crud(selector, blueprint)` - Complete CRUD from single blueprint
- **Documentation:** See [docs/Blueprints.md](./docs/Blueprints.md) for comprehensive guide

#### Models (`M` / `Domma.models`)

- Reactive data models with validation
- Pub/Sub: `subscribe()`, `publish()`, `unsubscribe()`, `once()`
- Model: `create()`, `get()`, `set()`, `toJSON()`, `validate()`, `onChange()`, `reset()`
- Persistence: `save()`, `load()`, `clearStorage()`, `isPersisted()`
- DOM Binding: `M.bind()`, `M.unbind()` (two-way binding)
- Types: `M.types.string`, `M.types.number`, `M.types.boolean`, `M.types.array`, `M.types.object`, `M.types.date`

#### Elements (`Domma.elements`)

- **23 UI Components:**
  - Modal - `modal()` with backdrop, keyboard, animation options
  - Tabs - `tabs()` with active index, onChange
  - Accordion - `accordion()` with multiExpand
  - Tooltip - `tooltip()` with positioning, triggers
  - Carousel - `carousel()` with autoplay, interval, loop
  - Card - `card()` with hover, clickable, **collapsible** (with localStorage persistence)
  - Dropdown - `dropdown()` with positioning
  - Toast - Static `toast()` method with types
  - Dialog - Promise-based `alert()`, `confirm()`, `prompt()`
  - Loader - `loader()` with types (spinner, dots, pulse, bars)
  - Badge - `badge()` component
  - NumberBadge - `numberBadge()` notification counter with positioning, dot mode, pulse
  - ListGroup - `listGroup()` selectable lists with keyboard nav, colour variants, flush mode
  - Signature - `signature()` canvas signature pad — mouse/touch/stylus, undo/redo, PNG/SVG export, type fallback
  - BackToTop - `backToTop()` with scroll behavior
  - ButtonGroup - `buttonGroup()` for radio/checkbox groups
  - Breadcrumbs - `breadcrumbs()` with separators
  - Navbar - `navbar()` responsive navigation
  - Sidebar - `sidebar()` with unlimited depth nesting, mobile drawer, state persistence
  - Footer - `footer()` with three layout modes (simple, columns, minimal) and theme variants
  - DesktopNotification - Browser notifications wrapper
  - Timer - `timer()` countdown with visual display
  - Alarm - `alarm()` scheduled alerts with persistence
  - hero - CSS-only hero sections with multiple variants
  - Slideover - `slideover()` panel overlays from screen edges
  - Progression - `progression()` unified timeline/roadmap component with dual modes, status tracking

- **Form Components:**
  - Autocomplete - `autocomplete()` with data/dataSource, highlighting, keyboard nav
  - Pillbox - `pillbox()` multi-select tag input with validation

#### Tables (`Domma.tables`)

- DataTable-like functionality
- Features: Sorting, filtering, pagination, search, row selection
- Export: `toCSV()`, `toJSON()`, `download()`
- Striping: Named color variants or custom colors
- Methods: `setData()`, `addRow()`, `updateRow()`, `removeRow()`, `search()`, `filter()`, `sort()`

#### Forms (`Domma.forms`)

- Blueprint-driven form generation
- **Components:**
  - FormBuilder - `create()` with validation, layouts (stacked/grid/inline)
  - Modal Forms - `modal()` with save/error handling
  - Wizard - `wizard()` multi-step forms
  - CRUD Helper - `crud()` complete CRUD with API integration
- **Features:**
  - Input types: string, email, password, number, date, select, textarea, radio, checkbox-group, file, etc.
  - Validation: required, minLength, maxLength, pattern, custom validators, async validation
  - Layouts: stacked, grid (2/3 columns), inline, sections
  - Model integration: Two-way binding with reactive models

#### Config (`$.setup()` / `Domma.setup`)

- Declarative configuration engine
- **Features:**
  - Component auto-initialization (16 supported components)
  - Event binding with delegation
  - Initial state configuration
  - Mutable config: `$.update()`, `$.config()`, `$.reset()`

#### HTTP (`Domma.http`)

- Fetch-based HTTP client
- Methods: `get()`, `post()`, `put()`, `delete()`
- Auto JSON handling
- Promise-based API

#### Storage (`S` / `Domma.storage`)

- localStorage wrapper with auto JSON serialization
- Methods: `get()`, `set()`, `remove()`, `has()`, `clear()`, `keys()`
- Features: Namespaced keys (`domma:` prefix), size tracking, graceful fallbacks

#### Theme (`Domma.theme`)

- Dynamic theme management
- 10+ built-in themes with light/dark variants
- Methods: `init()`, `set()`, `setVariant()`, `toggle()`
- Auto system preference detection
- Persistence to localStorage

#### Icons (`Domma.icons`)

- 200+ SVG icons in 15 categories
- Methods: `render()`, `inject()`, `scan()` (auto-scan `data-icon` attributes)
- Customizable size and color

#### Effects (`Domma.effects`)

- **breathe()** - Sinusoidal floating animation with configurable amplitude and duration
- **pulse()** - Pulsing scale animation for attention-grabbing elements
- **scribe()** - Text animation with configurable granularity (characters, words, or sentences)
  - Modes: `typewriter` (char-by-char), `word` (word-by-word), `sentence` (sentence-by-sentence)
  - Actions: `render` (type text), `wait` (pause), `undoRender` (delete text)
  - Effects: `none`, `fade`, `bounce`, `glow` (per-unit entrance animations)
  - Features: Blinking cursor, looping, partial undo, pause on hover, mode-aware deletion
- **reveal()** - Scroll-triggered entrance animations using IntersectionObserver
  - Animations: `fade`, `slide-up`, `slide-down`, `slide-left`, `slide-right`, `zoom`, `flip`
  - Features: Stagger, threshold, once/repeat, onReveal callback
- **scramble()** - Text cipher/decode animation
  - Reveal orders: `left-to-right`, `right-to-left`, `random`, `center-out`
  - Features: Custom character pools, looping, per-character callbacks
- **counter()** - Animated number counting with easing
  - Easing: `linear`, `ease-out`, `ease-in-out`
  - Features: Prefix/suffix, thousands separator, decimals, scroll trigger
- **ripple()** - Material Design click ripple effect
  - Features: Custom colour, centred mode, unbounded overflow, configurable trigger
- **shake()** - Attention/error shake animation
  - Directions: `horizontal`, `vertical`, `both`
  - Features: Configurable intensity, iterations, stagger, onComplete callback
- **tickerTape()** - Canvas-based ticker-tape parade — coloured rectangular strips drop from above, sway, rotate, and fade
  - Modes: full-page overlay (`null` selector) or container-scoped
  - Palettes: `'theme'` (auto from CSS variables), `'rainbow'`, `'festive'`, `'gold'`, `'silver'`, `'pastel'`, `'mono'`, `'sunset'`, `'ocean'`, `'forest'`, `'bridal'`, or a custom array of CSS colour strings
  - Behaviour: continuous stream with configurable density, or one-shot `burst` for celebration moments
  - Tunable: `speed`, `sway`, `rotationSpeed`, `fadeStart`, strip width/height ranges, `zIndex`
- All effects support `respectMotionPreference` and return control objects with `pause()`, `resume()`, `stop()`, `restart()`, `destroy()`

### CSS Features

#### Base Utilities (domma.css)

- **Typography:** Font families, sizes, weights, line heights
- **Spacing:** Margin/padding utilities (`.m-*`, `.p-*`, `.mt-*`, `.mb-*`, etc.)
- **Display:** `.d-block`, `.d-inline`, `.d-flex`, `.d-grid`, `.d-none`
- **Colors:** Full color palette (slate, blue, green, red, amber, sky, etc.)
- **Opacity:** Full scale `.opacity-0` → `.opacity-100` (steps of 10, plus `.opacity-25`, `.opacity-75`)
- **Translucency:**
  - Semantic: `.translucent-light` (0.85), `.translucent` (0.70), `.translucent-heavy` (0.50)
  - Glass: `.translucent-glass` — semi-transparent background + `backdrop-filter: blur()`
  - Hover variants: `.translucent-hover`, `.translucent-light-hover`, `.translucent-heavy-hover`
  - All include `transition: opacity` for smooth state changes
- **Effects:**
  - Glow: `.glow-primary`, `.glow-success`, `.glow-danger`, etc.
  - Shadows: `.shadow-sm`, `.shadow-md`, `.shadow-lg`, `.shadow-xl`
  - Elevation: `.elevation-1` through `.elevation-5`
  - Fireworks: `.firework-on-click`, `.firework-on-hover`, `.firework-sparkle`
  - Text effects: `.text-shadow-sm`, `.text-shadow-md`, `.text-shadow-lg`

#### Grid System (grid.css)

- **Bootstrap-style Grid:** 12-column responsive grid with `.row`, `.col-*`, breakpoints (sm, md, lg, xl)
- **CSS Grid Utilities:** `.grid`, `.grid-cols-*`, `.gap-*`, `.auto-fill`, `.auto-fit`
- **Flexbox:** `.flex`, `.flex-row`, `.flex-col`, `.justify-*`, `.align-*`, `.flex-wrap`

#### Elements (elements.css)

- 22 UI components with full styling
- Buttons, Cards, Modals, Forms, Tables, Navigation (Navbar, Sidebar, Footer), Progression, etc.
- Responsive and theme-aware

#### Themes (domma-themes.css)

- 10+ pre-built themes
- Light/dark variants for each
- Named themes: charcoal, ocean, forest, sunset, etc.

### Tools Bundle

#### Theme Roller

- Visual theme customization tool
- Live preview and export

#### Page Roller

- Page builder tool
- Component library and layout management

#### Editor

- Content editor with rich text
- Export to multiple formats

#### Print-to-PDF

- Print and PDF export functionality

### Advanced Features

#### Stagger Animations

- **IMPORTANT:** Built-in stagger animations for entrance effects
- Used for cascading element appearances
- Check documentation before implementing manually

#### Animation Utilities

- Fireworks animations (`.firework-*`)
- Glow effects (`.glow-*`)
- Fade/slide effects via JavaScript API

#### Accessibility

- ARIA support throughout
- Keyboard navigation for all interactive components
- Reduced motion support (`prefers-reduced-motion`)
- Screen reader friendly

#### Performance

- Lazy loading support
- Event delegation
- Debounce/throttle utilities
- Component cleanup (`destroy()` methods)

## Quick Reference

For detailed module documentation, see:

- **Core modules**: [src/CLAUDE.md](./src/CLAUDE.md)
- **Bundles**: [src/bundles/CLAUDE.md](./src/bundles/CLAUDE.md)
- **Showcase development**: [public/showcase/CLAUDE.md](./public/showcase/CLAUDE.md)
- **Full documentation index**: [Documentation Structure](#documentation-structure) section above
- Use the innate Domma grid system where possible
- Adding an element should automatically trigger full documentation and a showcase page replete with examples and a tutorial
- Always use the Domma Ecosystem where possible