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

## File Structure

```
src/
├── index.js         # Main entry, exports Domma + aliases
├── tools.js         # Tools bundle entry (Theme Roller, Quick Roller, Editor)
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
└── editor.js        # Content editor tool (tools bundle)

showcase/            # Comprehensive demos for each namespace
quickstart/          # Getting started blueprint
public/dist/         # Built bundles (UMD + ESM)
```

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
