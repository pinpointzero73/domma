# CLAUDE.md - Domma Layout System

This file provides guidance for working with Domma's preset-based, configuration-driven layout injection system.

## What is the Layout System?

The Layout System is a powerful configuration-driven framework that automatically injects navigation, footers, sidebars, theme controls, and other UI elements into pages based on preset configurations. It eliminates the need for duplicate HTML across pages while maintaining flexibility and customization.

**Location:** `/public/layouts/`

## Directory Structure

```
layouts/
├── config/                      # Configuration files (JSON)
│   ├── presets.json            # Master preset definitions
│   ├── nav-public.json         # Public navigation items
│   ├── nav-showcase.json       # Showcase navigation items
│   ├── nav-elements.json       # Element navigation items
│   ├── footer-landing.json     # Landing page footer (NEW: type "element")
│   ├── footer-showcase.json    # Showcase footer (legacy)
│   └── footer-public.json      # Public footer (legacy)
├── js/                         # JavaScript modules
│   ├── layout.js               # Main layout system
│   └── modules/                # Modular components
│       ├── detector.js         # Preset detection from data-layout
│       ├── path-resolver.js    # URL depth and path resolution
│       ├── template-loader.js  # HTML template loading
│       ├── features.js         # Feature modules (back-to-top, code-copy)
│       ├── sidebar.js          # Auto-generated sidebar navigation
│       └── consent.js          # Cookie consent management
└── templates/                  # HTML templates
    ├── navbar.html
    ├── footer.html
    └── theme-controls.html
```

### Celebrations are not in this folder

The seasonal celebrations used to be `js/modules/celebrations/`. They are now their own package,
[`domma-celebrate`](https://github.com/pinpointzero73/domma-celebrate), developed in
`../domma-celebrate` and copied to `public/dist/celebrate/` by `npm run copy:celebrate`.

`layout.js` loads it through `loadCelebrate()`, declared at **module scope** rather than inside
the layout IIFE. That placement is load-bearing: as a `let` inside the IIFE it sat in the
temporal dead zone, because the main flow calls it within the first hundred lines while the
declaration is hundreds of lines further down the same function body. Every call threw and the
toggle silently never rendered.

The `celebrations` preset key still works exactly as before - `{ "toggle": true }` renders the
disc during a celebration period and nothing outside one.

## How It Works

### 1. Preset Detection

Pages specify their layout via the `data-layout` attribute:

```html
<body data-layout="splash">        <!-- Landing page -->
<body data-layout="public">        <!-- Public content pages -->
<body data-layout="showcase">      <!-- Showcase index -->
<body data-layout="showcase:subpage">  <!-- Showcase subpages -->
<body data-layout="showcase:element">  <!-- Element demos -->
```

The layout system:
1. Reads `data-layout` attribute
2. Loads corresponding preset from `config/presets.json`
3. Renders navbar, footer, sidebar, theme controls based on preset config
4. Activates feature modules (back-to-top, code-copy, icon-scan, scroll-spy)

### 2. Preset Configuration

**File:** `/layouts/config/presets.json`

Each preset defines:
- `navbar` - Navigation configuration
- `footer` - Footer configuration (string reference to config file)
- `sidebar` - Sidebar settings
- `theme` - Theme control options
- `snow` - Snow effect toggle
- `features` - Feature modules to activate

**Example Preset:**
```json
{
  "splash": {
    "navbar": {
      "type": "flat",
      "brand": { "text": "Domma", "url": "index.html", "showVersion": true },
      "items": "nav-public",
      "actions": [ /* buttons */ ]
    },
    "footer": "footer-landing",
    "sidebar": { "enabled": false },
    "theme": { "variantSelector": true, "position": "fixed-right" },
    "snow": { "toggle": true },
    "features": ["back-to-top", "code-copy", "icon-scan"]
  }
}
```

---

## Footer System (NEW: Domma Element Integration)

The layout system now supports **three footer rendering modes**:

### Mode 1: Domma Footer Element (NEW - Recommended) ✨

Use the full-featured `Domma.elements.footer()` component with all its capabilities.

**Config Format:**
```json
{
  "type": "element",
  "layout": "columns",
  "variant": "dark",
  "position": "static",
  "brand": {
    "text": "Domma",
    "url": "index.html",
    "description": "Dynamic Object Manipulation & Modeling API"
  },
  "columns": [
    {
      "title": "Product",
      "links": [
        { "text": "Features", "url": "#features" },
        { "text": "Showcase", "url": "showcase/index.html" }
      ]
    },
    {
      "title": "Resources",
      "links": [
        { "text": "Documentation", "url": "https://github.com/...", "external": true }
      ]
    }
  ],
  "social": [
    { "icon": "github", "url": "https://github.com/dcbw-it/domma", "label": "GitHub" },
    { "icon": "twitter", "url": "#", "label": "Twitter" },
    { "icon": "linkedin", "url": "#", "label": "LinkedIn" }
  ],
  "copyright": "© {{year}} Darryl Waterhouse & DCBW-IT. All rights reserved."
}
```

**Benefits:**
- ✅ **Professional multi-column layout** - Up to 4+ organized sections
- ✅ **Social media integration** - Icons with brand colors and hover effects
- ✅ **Three layout modes** - `simple`, `columns`, `minimal`
- ✅ **Theme variants** - `light`, `dark`, `transparent`
- ✅ **Responsive design** - Mobile-first, adaptive breakpoints
- ✅ **Dynamic updates** - Methods like `setBrand()`, `setLinks()`, `setSocial()`
- ✅ **Position control** - `static`, `fixed`, `sticky`
- ✅ **Template variables** - `{{year}}`, `{{version}}`, `{{buildDate}}` auto-replaced

**Example:** `/layouts/config/footer-landing.json` (used by splash/landing page)

### Mode 2: Simple Legacy Footer

Basic left/right content layout with template rendering.

**Config Format:**
```json
{
  "class": "footer footer-dark",
  "layout": "simple",
  "content": {
    "left": "v{{version}} · {{buildDate}}",
    "right": "© Darryl Waterhouse & DCBW-IT {{year}}"
  }
}
```

**Example:** `/layouts/config/footer-showcase.json`

### Mode 3: Navigation Legacy Footer

Public footer with navigation links.

**Config Format:**
```json
{
  "class": "page-footer",
  "layout": "nav",
  "content": {
    "left": "© DCBW-IT ({{year}})",
    "nav": [
      { "text": "About Us", "url": "about/index.html" },
      { "text": "FAQs", "url": "faq/index.html" },
      {
        "text": "Cookie Settings",
        "url": "#",
        "attributes": { "data-cookie-consent-open": "true" }
      }
    ]
  }
}
```

**Example:** `/layouts/config/footer-public.json`

---

## Template Variables

The layout system processes template variables in footer configs:

| Variable | Description | Example Output |
|----------|-------------|----------------|
| `{{year}}` | Current year | `2026` |
| `{{version}}` | Domma version | `0.7.6-alpha` |
| `{{buildDate}}` | Build timestamp | `09/01/2026 11:28` |
| `{{left}}` | Preset default left text | `v0.7.6-alpha · 09/01/2026 11:28` |
| `{{right}}` | Preset default right text | `© Darryl Waterhouse & DCBW-IT 2026` |

**Usage:**
```json
{
  "copyright": "© {{year}} Company Name"
}
```

Automatically becomes: `© 2026 Company Name`

---

## Navigation System

### Navigation Types

**Flat Navigation** (`type: "flat"`):
- Single-level horizontal links
- Used on public pages and landing page

**Dropdown Navigation** (`type: "dropdowns"`):
- Multi-level dropdown menus
- Used on showcase pages

### Navigation Configuration

**Config File Format:**
```json
{
  "type": "flat",
  "items": [
    { "text": "QuickStart", "url": "quickstart/index.html", "page": "quickstart" },
    { "text": "Showcase", "url": "showcase/index.html", "page": "showcase" }
  ]
}
```

**Active State Detection:**
The system automatically highlights active navigation items based on current URL.

---

## Feature Modules

The layout system supports pluggable feature modules:

| Feature | Description | Activation |
|---------|-------------|------------|
| `back-to-top` | Scroll-to-top button | `features: ["back-to-top"]` |
| `code-copy` | Copy buttons for code blocks | `features: ["code-copy"]` |
| `icon-scan` | Auto-inject SVG icons from `data-icon` | `features: ["icon-scan"]` |
| `scroll-spy` | Sidebar navigation scroll tracking | `features: ["scroll-spy"]` |

**Example:**
```json
{
  "splash": {
    "features": ["back-to-top", "code-copy", "icon-scan"]
  }
}
```

---

## Sidebar System

The layout system can auto-generate sidebar navigation from page headings.

**Configuration:**
```json
{
  "sidebar": {
    "enabled": true,
    "autoGenerate": true,
    "selector": "[data-section]",
    "fallbackSelector": ".card-header h2, .card-header h3",
    "prependNav": "nav-elements"
  }
}
```

**Options:**
- `enabled` - Enable sidebar
- `autoGenerate` - Generate from page headings
- `selector` - Primary heading selector
- `fallbackSelector` - Fallback if primary not found
- `prependNav` - Add navigation config before auto-generated items

---

## Theme Controls

Theme variant selector and snow toggle.

**Configuration:**
```json
{
  "theme": {
    "toggle": true,              // Show theme toggle button
    "variantSelector": true,     // Show variant selector dropdown
    "position": "fixed-right"    // Position: "fixed-right" or default
  },
  "snow": {
    "toggle": true               // Show snow effect toggle
  }
}
```

---

## Creating a New Footer

### Using Domma Footer Element (Recommended)

1. **Create footer config** in `/layouts/config/footer-mypage.json`:
```json
{
  "type": "element",
  "layout": "columns",
  "variant": "dark",
  "brand": { "text": "My Brand", "url": "index.html" },
  "columns": [
    {
      "title": "Section 1",
      "links": [ { "text": "Link", "url": "#" } ]
    }
  ],
  "social": [
    { "icon": "github", "url": "https://github.com/...", "label": "GitHub" }
  ],
  "copyright": "© {{year}} My Company"
}
```

2. **Reference in preset** (`presets.json`):
```json
{
  "mypreset": {
    "footer": "footer-mypage"
  }
}
```

3. **Use preset** on your page:
```html
<body data-layout="mypreset">
```

### Benefits Over Manual HTML

| Manual HTML | Layout System Footer Element |
|-------------|------------------------------|
| Copy/paste footer to every page | Single config file |
| Update copyright in 50+ files | Update once, changes everywhere |
| No social media integration | Built-in icon + hover states |
| Fixed layout | 3 layouts (simple/columns/minimal) |
| No responsive design | Mobile-first responsive |
| No theme support | Light/dark/transparent variants |
| Static content | Dynamic updates via API |

---

## Path Resolution

The layout system automatically resolves relative URLs based on page depth:

- `/index.html` (depth 0) → `showcase/index.html`
- `/showcase/index.html` (depth 1) → `../index.html`
- `/showcase/dom/index.html` (depth 2) → `../../index.html`

**Handled automatically** - no manual path adjustments needed.

---

## Integration with Domma Elements

The layout system integrates seamlessly with Domma's element components:

- **Footer:** `Domma.elements.footer()` (NEW - via `type: "element"`)
- **Navbar:** Custom navbar renderer (uses templates)
- **Back to Top:** `Domma.elements.backToTop()`
- **Cookie Consent:** `Domma.elements.cookieConsent()`

---

## Debugging

The layout system logs to console:

```
[Domma Layout] Detected preset: splash
[Domma Layout] Has navbar: true
[Domma Layout] Has footer: true
[Domma Layout] Navbar rendered
[Domma Layout] Theme controls rendered
[Domma Layout] Footer Element rendered  // NEW
[Domma Layout] Cookie consent initialized
[Domma Layout] Initialization complete
```

**Common Issues:**

1. **Footer not rendering** - Check `Domma.elements.footer` is available (Domma loaded)
2. **Wrong footer** - Verify preset → footer config reference
3. **Template vars not replaced** - Ensure using `{{var}}` syntax
4. **Social icons missing** - Check icon names match `Domma.icons` registry

---

## Best Practices

1. **Use `type: "element"` for new footers** - Modern, feature-rich, maintainable
2. **Keep legacy footers for compatibility** - Don't break existing pages
3. **Centralize navigation** - Use shared `nav-*.json` files
4. **Test at multiple depths** - Ensure path resolution works
5. **Leverage template variables** - Auto-update year, version, etc.
6. **Use semantic presets** - Name by purpose: `splash`, `public`, `showcase`

---

## Related Documentation

- **Footer Component:** `/public/showcase/footer/CLAUDE.md` - Complete footer element reference
- **Main Project:** `/CLAUDE.md` - Project overview
- **API Reference:** `/docs/API.md` - Footer API documentation (lines 1445-1574)

---

## Maintenance Notes

When adding a new layout preset:
1. Add preset to `config/presets.json`
2. Create footer config if needed (`footer-*.json`)
3. Create navigation config if needed (`nav-*.json`)
4. Update this documentation
5. Test on pages at different depths
