# CLAUDE.md

This file provides high-level guidance to Claude Code (claude.ai/code) when working with code in this repository.

For detailed, context-specific guidance, consult the distributed CLAUDE.md files in relevant folders.

## What is Domma?

**D**ynamic **O**bject **M**anipulation & **M**odeling **A**PI

A lightweight, zero-dependency JavaScript framework combining jQuery-style DOM manipulation, Lodash utilities, and
modern UI components.

## Commands

**Build:**
```bash
npm install
npm run build
```

Outputs minified + obfuscated bundles to `dist/`.

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
│   ├── page-roller/
│   └── download/
├── examples/            # Working example applications
│   └── todo/
├── kickstart/           # Template for quick project setup
│   └── index.html
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

## Project Guidelines

- When updating features or adding new ones, the documentation and showcase should be updated in-line
- Where and whenever possible use Domma in the showcase, documentation and tutorials
- When making changes to the namespaces/modules ensure that we update the PHPStorm code intelligence files at
  `public/assets/ide/phpstorm`
- Do not run a server as I am running one
- Audit your own work and reiterate where possible
- **British English**: Use British spellings in all new code, comments, and documentation (-ise not -ize, -yse not -yze, -our not -or). Existing code may use American spellings for backwards compatibility.

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

- **22 UI Components:**
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

### CSS Features

#### Base Utilities (domma.css)

- **Typography:** Font families, sizes, weights, line heights
- **Spacing:** Margin/padding utilities (`.m-*`, `.p-*`, `.mt-*`, `.mb-*`, etc.)
- **Display:** `.d-block`, `.d-inline`, `.d-flex`, `.d-grid`, `.d-none`
- **Colors:** Full color palette (slate, blue, green, red, amber, sky, etc.)
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