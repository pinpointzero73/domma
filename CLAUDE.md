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

| Full Path       | Alias | Global     | Description                |
|-----------------|-------|------------|----------------------------|
| `Domma()`       | `$`   | `window.$` | DOM selection/manipulation |
| `Domma.utils`   | `_`   | `window._` | Utility functions          |
| `Domma.models`  | `M`   | `window.M` | Reactive models & pub/sub  |
| `Domma.dates()` | `D()` | `window.D` | Date manipulation          |
| `Domma.storage` | `S`   | `window.S` | localStorage wrapper       |

## CSS Architecture

Domma's CSS follows a proper build process with single source of truth:

**Source Files (edit these):**
```
src/css/
├── domma.css           # Base styles, typography, utilities
├── grid.css            # Grid system (Bootstrap + CSS Grid)
└── elements.css        # UI components - 19 components
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

- **elements.css** - UI components (19 total)
  - Buttons, Cards, Modals, Tabs, Accordion
  - Tooltip, Table, Form elements, Badges, Pills
  - Alert, Code blocks, Pagination, Navbar, Footer
  - Jumbotron, Carousel, Dialog, Sidebar

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

## Quick Reference

For detailed module documentation, see:

- **Core modules**: [src/CLAUDE.md](./src/CLAUDE.md)
- **Bundles**: [src/bundles/CLAUDE.md](./src/bundles/CLAUDE.md)
- **Showcase development**: [public/showcase/CLAUDE.md](./public/showcase/CLAUDE.md)
- **Full documentation index**: [Documentation Structure](#documentation-structure) section above
- Use the innate Domma grid system where possible