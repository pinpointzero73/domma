---
title: CSS Customisation Cheat-Sheet
description: "Override Domma's CSS variables to match your existing project's design system - no need to rewrite component styles"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="CSS Customisation Cheat-Sheet" tagline="Override Domma's CSS variables to match your existing project's design system - no need to rewrite component styles" align="center"][/hero]

## Overview

Domma can be dropped into existing projects without disrupting your design system. This cheat-sheet shows you exactly which CSS variables and classes to override to make Domma elements match your brand colours, typography, spacing, and more.

### Three-Tier CSS Variable Architecture

Domma uses a cascading variable system that gives you flexibility at multiple levels:

1. **Palette tier** - Raw colour values (e.g., `--dm-blue-600`, `--dm-slate-300`)
2. **Semantic tier** - Contextual tokens (e.g., `--dm-primary`, `--dm-border`, `--dm-text`)
3. **Component tier** - Element-specific (e.g., `--dm-card-bg`, `--dm-navbar-text`)

### Override Strategy

**Override at the highest tier for maximum impact.** Changing `--dm-primary` affects buttons, badges, links, focus states, and 15+ components. Changing `--dm-blue-600` (the default value of `--dm-primary`) affects *everything* that references blue.

### Minimal CSS Inclusion for Existing Projects

If you already have a design system, you only need to load Domma's component CSS:

```html
<!-- Load only what you need -->
<link rel="stylesheet" href="dist/elements.css">  <!-- UI components -->

<!-- Optional: grid system if you don't have one -->
<link rel="stylesheet" href="dist/grid.css">

<!-- Override Domma variables to match your system -->
<style>
:root {
    --dm-primary: #your-brand-colour;
    --dm-font-sans: 'Your Font', sans-serif;
    /* ...more overrides */
}
</style>
```

## Quick Start - 10 Variables That Change Everything

These 10 high-impact variables adapt the entire Domma framework to your brand in under 30 seconds.

[table striped="true"]
| Intent | Variable | Default | Affects |
| --- | --- | --- | --- |
| Brand colour | `--dm-primary` | `var(--dm-blue-600)` | Buttons, links, badges, focus states, progress bars |
| Brand hover | `--dm-primary-hover` | `var(--dm-blue-700)` | Button hover, link hover, active states |
| Secondary colour | `--dm-secondary` | `var(--dm-slate-600)` | Secondary buttons, muted elements |
| Page background | `--dm-background` | `var(--dm-slate-100)` | Body background, page wrapper |
| Card/panel surface | `--dm-surface` | `var(--dm-white)` | Cards, modals, dropdowns, panels |
| Text colour | `--dm-text` | `var(--dm-slate-800)` | Body text, headings, labels |
| Border colour | `--dm-border` | `var(--dm-slate-300)` | Inputs, cards, tables, dividers |
| Border radius | `--dm-radius-md` | `0.375rem` | Buttons, inputs, cards, badges |
| Font family | `--dm-font-sans` | `Roboto, ...` | All text elements |
| Base shadow | `--dm-shadow` | `0 1px 3px ...` | Cards, dropdowns, modals |
[/table]

### Copy-Paste Override Template

```css
:root {
    /* Brand colours */
    --dm-primary: #0066cc;               /* Your brand blue */
    --dm-primary-hover: #0052a3;         /* Darker for hover */
    --dm-secondary: #6c757d;             /* Secondary/muted colour */

    /* Backgrounds */
    --dm-background: #f5f5f5;            /* Page background */
    --dm-surface: #ffffff;               /* Card/panel background */

    /* Text */
    --dm-text: #2c3e50;                  /* Body text */
    --dm-text-secondary: #7f8c8d;        /* Muted text */

    /* Borders & shapes */
    --dm-border: #dee2e6;                /* Border colour */
    --dm-radius-md: 0.5rem;              /* Corner radius */

    /* Typography */
    --dm-font-sans: 'Inter', sans-serif; /* Your font stack */
}
```

### Before / After Demo

See the impact of custom variables in real-time:

[showcase-demo id="showcase/elements/css-customisation/before-after-demo" title="Before / After Demo" /]

## Global Variable Reference

Complete list of semantic CSS variables organised by category. These control appearance across *all* components.

### Semantic Colours

[table striped="true"]
| Variable | Default | Usage |
| --- | --- | --- |
| `--dm-primary` | `var(--dm-blue-600)` | Primary brand colour |
| `--dm-primary-hover` | `var(--dm-blue-700)` | Primary hover state |
| `--dm-primary-active` | `var(--dm-blue-800)` | Primary active/pressed state |
| `--dm-primary-light` | `var(--dm-blue-200)` | Primary tint (backgrounds) |
| `--dm-primary-dark` | `var(--dm-blue-800)` | Primary shade |
| `--dm-secondary` | `var(--dm-slate-600)` | Secondary colour |
| `--dm-secondary-hover` | `var(--dm-slate-700)` | Secondary hover |
| `--dm-success` | `var(--dm-green-600)` | Success state |
| `--dm-success-hover` | `var(--dm-green-700)` | Success hover |
| `--dm-success-light` | `var(--dm-green-100)` | Success background tint |
| `--dm-danger` | `var(--dm-red-600)` | Error/danger state |
| `--dm-danger-hover` | `var(--dm-red-700)` | Danger hover |
| `--dm-danger-light` | `var(--dm-red-100)` | Danger background tint |
| `--dm-warning` | `var(--dm-amber-500)` | Warning state |
| `--dm-warning-hover` | `var(--dm-amber-600)` | Warning hover |
| `--dm-warning-light` | `var(--dm-amber-100)` | Warning background tint |
| `--dm-info` | `var(--dm-sky-500)` | Info state |
| `--dm-info-hover` | `var(--dm-sky-600)` | Info hover |
| `--dm-info-light` | `var(--dm-sky-100)` | Info background tint |
[/table]

### Backgrounds & Surfaces

[table striped="true"]
| Variable | Default | Usage |
| --- | --- | --- |
| `--dm-background` | `var(--dm-slate-100)` | Page background |
| `--dm-background-alt` | `var(--dm-slate-200)` | Alternate background (stripes) |
| `--dm-surface` | `var(--dm-white)` | Card/modal/dropdown background |
| `--dm-surface-raised` | `var(--dm-slate-50)` | Elevated surfaces |
| `--dm-surface-overlay` | `var(--dm-white)` | Overlay panels (modal backdrop) |
[/table]

### Text Colours

[table striped="true"]
| Variable | Default | Usage |
| --- | --- | --- |
| `--dm-text` | `var(--dm-slate-800)` | Primary body text |
| `--dm-text-secondary` | `var(--dm-slate-600)` | Secondary text (subtitles) |
| `--dm-text-muted` | `var(--dm-slate-500)` | Muted/placeholder text |
| `--dm-text-disabled` | `var(--dm-slate-400)` | Disabled text |
| `--dm-text-inverse` | `var(--dm-white)` | Text on dark backgrounds |
[/table]

### Borders & Focus States

[table striped="true"]
| Variable | Default | Usage |
| --- | --- | --- |
| `--dm-border` | `var(--dm-slate-300)` | Default border colour |
| `--dm-border-light` | `var(--dm-slate-200)` | Subtle borders |
| `--dm-border-dark` | `var(--dm-slate-400)` | Prominent borders |
| `--dm-border-focus` | `var(--dm-blue-500)` | Focus border colour |
| `--dm-focus-ring` | `rgba(59, 130, 246, 0.25)` | Focus outline (box-shadow) |
[/table]

### Spacing

[table striped="true"]
| Variable | Value | Usage |
| --- | --- | --- |
| `--dm-space-0` | `0` | No spacing |
| `--dm-space-1` | `0.25rem` | 4px |
| `--dm-space-2` | `0.5rem` | 8px |
| `--dm-space-3` | `0.75rem` | 12px |
| `--dm-space-4` | `1rem` | 16px (default button padding) |
| `--dm-space-5` | `1.25rem` | 20px |
| `--dm-space-6` | `1.5rem` | 24px |
| `--dm-space-8` | `2rem` | 32px |
| `--dm-space-10` | `2.5rem` | 40px |
| `--dm-space-12` | `3rem` | 48px |
| `--dm-space-16` | `4rem` | 64px |
[/table]

### Typography

[table striped="true"]
| Variable | Value |
| --- | --- |
| `--dm-font-sans` | `Roboto, ui-sans-serif, system-ui, ...` |
| `--dm-font-mono` | `ui-monospace, SFMono-Regular, ...` |
| `--dm-font-size-xs` | `0.75rem` (12px) |
| `--dm-font-size-sm` | `0.875rem` (14px) |
| `--dm-font-size-base` | `1rem` (16px) |
| `--dm-font-size-lg` | `1.125rem` (18px) |
| `--dm-font-size-xl` | `1.25rem` (20px) |
| `--dm-font-size-2xl` | `1.5rem` (24px) |
| `--dm-font-size-3xl` | `1.875rem` (30px) |
| `--dm-font-size-4xl` | `2.25rem` (36px) |
| `--dm-font-size-5xl` | `3rem` (48px) |
[/table]

### Border Radius

[table striped="true"]
| Variable | Value | Usage |
| --- | --- | --- |
| `--dm-radius-none` | `0` | Sharp corners |
| `--dm-radius-sm` | `0.125rem` | Subtle rounding |
| `--dm-radius` | `0.25rem` | Base radius |
| `--dm-radius-md` | `0.375rem` | Default (buttons, inputs) |
| `--dm-radius-lg` | `0.5rem` | Cards, modals |
| `--dm-radius-xl` | `0.75rem` | Large panels |
| `--dm-radius-2xl` | `1rem` | Very rounded |
| `--dm-radius-full` | `9999px` | Pill shape (badges, chips) |
[/table]

### Shadows

[table striped="true"]
| Variable | Usage |
| --- | --- |
| `--dm-shadow-sm` | Subtle lift (hover states) |
| `--dm-shadow` | Base shadow (cards) |
| `--dm-shadow-md` | Medium elevation (dropdowns) |
| `--dm-shadow-lg` | High elevation (modals) |
| `--dm-shadow-xl` | Very high elevation |
| `--dm-shadow-2xl` | Dramatic depth |
[/table]

### Transitions

[table striped="true"]
| Variable | Value | Usage |
| --- | --- | --- |
| `--dm-transition-fast` | `150ms ease` | Quick interactions (hover) |
| `--dm-transition-normal` | `250ms ease` | Standard animations |
| `--dm-transition-slow` | `350ms ease` | Deliberate transitions |
[/table]

## Per-Component Override Reference

Component-specific variables for fine-tuned control. Override these when global changes aren't enough.

### Button

**Classes:** `.btn`, `.btn-primary`, `.btn-outline-*`

**Variables:** `--dm-primary`, `--dm-primary-hover`, `--dm-radius-md`, `--dm-space-2`, `--dm-space-4`, `--dm-focus-ring`

**Common override:** Change brand → `--dm-primary: #your-colour;` | Rounder → `--dm-radius-md: var(--dm-radius-full);`

### Card

**Classes:** `.card`, `.card-header`, `.card-body`, `.card-footer`

**Variables:** `--dm-card-bg`, `--dm-card-border`, `--dm-card-shadow`, `--dm-radius-lg`

**Common override:** Dark cards → `--dm-card-bg: var(--dm-slate-800);` | Flat design → `--dm-card-shadow: none; --dm-radius-lg: 0;`

### Modal

**Classes:** `.modal`, `.modal-header`, `.modal-body`, `.modal-footer`

**Variables:** `--dm-surface`, `--dm-radius-lg`, `--dm-shadow-xl`, `--dm-transition-normal`

**Common override:** Smooth modals → `--dm-transition-normal: 400ms cubic-bezier(0.4, 0, 0.2, 1);`

### Tabs

**Classes:** `.tabs`, `.tab-item`, `.tab-content`

**Variables:** `--dm-tab-border`, `--dm-tab-hover-bg`, `--dm-tab-active-border`, `--dm-tab-active-text`

**Common override:** Custom active colour → `--dm-tab-active-border: #your-colour; --dm-tab-active-text: #your-colour;`

### Accordion

**Classes:** `.accordion`, `.accordion-item`, `.accordion-header`

**Variables:** `--dm-accordion-border`, `--dm-accordion-header-hover`, `--dm-radius-lg`

**Common override:** Borderless → `--dm-accordion-border: transparent;`

### Tooltip

**Classes:** `.tooltip`, `.tooltip-arrow`

**Variables:** `--dm-slate-900` (background), `--dm-radius-md`, `--dm-font-size-sm`

**Common override:** Light tooltip → Override with inline style on tooltip element or create custom CSS class

### Table

**Classes:** `.table`, `.table-striped`, `.table-hover`

**Variables:** `--dm-table-border`, `--dm-table-hover-bg`, `--dm-table-stripe-bg`

**Common override:** Zebra stripes → `--dm-table-stripe-bg: var(--dm-slate-50);`

### Forms (Inputs, Select, Textarea)

**Classes:** `.form-input`, `.form-select`, `.form-textarea`

**Variables:** `--dm-input-bg`, `--dm-input-border`, `--dm-input-text`, `--dm-input-focus-border`

**Common override:** Outline focus → `--dm-input-focus-border: #your-brand-colour;`

### Badge

**Classes:** `.badge`, `.badge-primary`, `.badge-success`, etc.

**Variables:** `--dm-primary` (+ status colours), `--dm-radius-full`

**Common override:** Square badges → `--dm-radius-full: var(--dm-radius-sm);`

### Alert

**Classes:** `.alert`, `.alert-success`, `.alert-danger`, etc.

**Variables:** Status colour variants (`--dm-*-light`, `--dm-*-dark`)

**Common override:** Subtle alerts → Lighten `--dm-success-light`, `--dm-danger-light`, etc.

### Navbar

**Classes:** `.navbar`, `.navbar-item`, `.navbar-brand`

**Variables:** `--dm-navbar-bg`, `--dm-navbar-text`, `--dm-navbar-border`

**Common override:** Dark navbar → `--dm-navbar-bg: var(--dm-slate-900); --dm-navbar-text: var(--dm-white);`

### Sidebar

**Classes:** `.sidebar`, `.sidebar-item`

**Variables:** `--dm-sidebar-bg`, `--dm-sidebar-border`, `--dm-sidebar-item-hover`, `--dm-sidebar-item-active`

**Common override:** Match navbar → Use same background/text variables as navbar

### Dropdown

**Classes:** `.dropdown`, `.dropdown-item`

**Variables:** `--dm-dropdown-bg`, `--dm-dropdown-border`, `--dm-dropdown-item-hover`

**Common override:** Hover highlight → `--dm-dropdown-item-hover: var(--dm-primary-light);`

### Autocomplete

**Classes:** `.autocomplete`, `.autocomplete-item`

**Variables:** `--dm-autocomplete-bg`, `--dm-autocomplete-border`, `--dm-autocomplete-highlight`

**Common override:** Match highlight → `--dm-autocomplete-highlight: #your-yellow;`

### Pillbox

**Classes:** `.pillbox`, `.pill`

**Variables:** `--dm-pillbox-bg`, `--dm-pillbox-border`, `--dm-pill-bg`, `--dm-pill-color`

**Common override:** Brand-coloured pills → `--dm-pill-bg: var(--dm-primary); --dm-pill-color: var(--dm-text-inverse);` on `.dm-pillbox`

### Toast

**Classes:** `.toast`, `.toast-success`, `.toast-error`

**Variables:** `--dm-slate-800` (background), status colours, `--dm-radius-md`

**Common override:** Position or styling requires JavaScript options (not CSS variables)

### Loader

**Classes:** `.loader`, `.loader-spinner`, `.loader-dots`

**Variables:** `--dm-primary` (spinner colour)

**Common override:** White spinner → Override via JavaScript `color` option or target `.loader-spinner` CSS

### Hero

**Classes:** `.hero`, `.hero-primary`, `.hero-dark`

**Variables:** `--dm-primary`, gradient definitions

**Common override:** Custom gradient → Define new `.hero-custom` class with `background` property

### Carousel

**Classes:** `.carousel`, `.carousel-item`, `.carousel-controls`

**Variables:** `--dm-radius-lg`, `--dm-primary`, `--dm-shadow-md`

**Common override:** Control colour → Target `.carousel-controls button` with `background` or `color`

### Dialog

**Classes:** `.dialog` (same as modal)

**Variables:** `--dm-surface`, `--dm-radius-lg`, `--dm-border`

**Common override:** Same as Modal

### Breadcrumbs

**Classes:** `.breadcrumbs`, `.breadcrumb-item`

**Variables:** `--dm-primary`, `--dm-text-muted`

**Common override:** Active crumb → Target `.breadcrumb-item.active` with `color`

### Timer

**Classes:** `.timer`

**Variables:** `--dm-success`, `--dm-warning`, `--dm-secondary`

**Common override:** Time colour thresholds → Pass `color` via JavaScript options

### Footer

**Classes:** `.footer`, `.footer-simple`, `.footer-columns`

**Variables:** `--dm-surface`, `--dm-border`, `--dm-text-muted`

**Common override:** Dark footer → `--dm-surface: var(--dm-slate-900); --dm-text-muted: var(--dm-slate-400);`

### Back-to-Top

**Classes:** `.back-to-top`

**Variables:** `--dm-primary`, `--dm-primary-hover`, `--dm-radius-full`

**Common override:** Icon size or position → Target `.back-to-top` with `width`/`height` or `bottom`/`right`

### Progression (Timeline/Roadmap)

**Classes:** `.progression`, `.progression-item`

**Variables:** Status colours (`--dm-success`, `--dm-warning`, `--dm-info`, `--dm-danger`), `--dm-primary`, `--dm-surface`

**Common override:** Status indicators → Override status colour variables

## Integration Recipes

Practical examples for integrating Domma into existing projects with popular frameworks and design systems.

### Recipe 1: Bootstrap Project

Map Bootstrap's CSS variables to Domma's for consistent branding:

```css
:root {
    /* Map Bootstrap primary to Domma primary */
    --dm-primary: var(--bs-primary, #0d6efd);
    --dm-primary-hover: var(--bs-primary-dark, #0a58ca);

    /* Map Bootstrap surfaces */
    --dm-surface: var(--bs-body-bg, #fff);
    --dm-background: var(--bs-light, #f8f9fa);

    /* Map Bootstrap text */
    --dm-text: var(--bs-body-color, #212529);
    --dm-text-secondary: var(--bs-secondary, #6c757d);

    /* Map Bootstrap borders */
    --dm-border: var(--bs-border-color, #dee2e6);
    --dm-radius-md: var(--bs-border-radius, 0.375rem);

    /* Map Bootstrap status colours */
    --dm-success: var(--bs-success, #198754);
    --dm-danger: var(--bs-danger, #dc3545);
    --dm-warning: var(--bs-warning, #ffc107);
    --dm-info: var(--bs-info, #0dcaf0);
}
```

### Recipe 2: Tailwind Project

Map Tailwind colour tokens to Domma variables:

```css
:root {
    /* Map Tailwind primary (e.g., indigo) */
    --dm-primary: rgb(99 102 241);          /* indigo-500 */
    --dm-primary-hover: rgb(79 70 229);     /* indigo-600 */
    --dm-primary-active: rgb(67 56 202);    /* indigo-700 */

    /* Map Tailwind surfaces */
    --dm-background: rgb(249 250 251);      /* gray-50 */
    --dm-surface: rgb(255 255 255);         /* white */

    /* Map Tailwind text */
    --dm-text: rgb(17 24 39);               /* gray-900 */
    --dm-text-secondary: rgb(107 114 128);  /* gray-500 */
    --dm-text-muted: rgb(156 163 175);      /* gray-400 */

    /* Map Tailwind borders */
    --dm-border: rgb(229 231 235);          /* gray-200 */

    /* Match Tailwind radius */
    --dm-radius-md: 0.375rem;               /* rounded */
    --dm-radius-lg: 0.5rem;                 /* rounded-lg */
}
```

### Recipe 3: Dark Theme Integration

Override variables for a dark-themed site:

```css
/* Dark theme overrides */
:root {
    /* Dark backgrounds */
    --dm-background: #0f172a;               /* slate-900 */
    --dm-surface: #1e293b;                  /* slate-800 */
    --dm-surface-raised: #334155;           /* slate-700 */

    /* Dark text */
    --dm-text: #f1f5f9;                     /* slate-100 */
    --dm-text-secondary: #cbd5e1;           /* slate-300 */
    --dm-text-muted: #94a3b8;               /* slate-400 */

    /* Dark borders */
    --dm-border: #334155;                   /* slate-700 */
    --dm-border-light: #1e293b;             /* slate-800 */

    /* Adjust status colours for dark bg */
    --dm-primary-light: #1e3a8a;            /* blue-900 */
    --dm-success-light: #14532d;            /* green-900 */
    --dm-danger-light: #7f1d1d;             /* red-900 */

    /* Component-specific for dark */
    --dm-card-bg: var(--dm-surface);
    --dm-navbar-bg: var(--dm-slate-900);
    --dm-navbar-text: var(--dm-text);
}
```

## Scoping Overrides

Override variables for specific sections of your page by scoping them to a container element. This lets you have different colour schemes in sidebars, admin panels, or feature sections.

### Scoped Example

```css
/* Entire page uses default Domma theme */
:root {
    --dm-primary: #2563eb;  /* Blue */
}

/* Sidebar uses green accent */
.my-sidebar {
    --dm-primary: #198754;  /* Green */
    --dm-primary-hover: #157347;
}

/* Admin panel uses red accent */
.admin-section {
    --dm-primary: #dc2626;  /* Red */
    --dm-primary-hover: #b91c1c;
}
```

### Result

Elements inside `.my-sidebar` will have green buttons, badges, and links. Elements inside `.admin-section` will be red. Everything else stays blue.

## Custom Themes

Domma ships with 10+ built-in themes (charcoal, ocean, forest, sunset, etc.), but you can also create custom themes by defining your own CSS classes.

### Difference Between Approaches

- **Overriding `:root`** - Changes apply globally and immediately
- **Using `.dm-theme-*` classes** - Apply pre-built Domma themes by adding class to `<body>`
- **Creating a custom theme file** - Bundle your overrides into a reusable theme that can be toggled

### Minimal Custom Theme Template

```css
/* custom-theme.css */
.dm-theme-corporate {
    /* Brand */
    --dm-primary: #003d7a;              /* Corporate blue */
    --dm-primary-hover: #002f5f;
    --dm-secondary: #6c757d;

    /* Backgrounds */
    --dm-background: #f8f9fa;
    --dm-surface: #ffffff;

    /* Text */
    --dm-text: #2c3e50;
    --dm-text-secondary: #546e7a;

    /* Shapes */
    --dm-radius-md: 0.25rem;            /* Sharp corners for corporate look */
    --dm-radius-lg: 0.5rem;

    /* Typography */
    --dm-font-sans: 'Helvetica Neue', Arial, sans-serif;
}
```

### Usage

```html
<link rel="stylesheet" href="custom-theme.css">
<body class="dm-theme-corporate">
    <!-- Your content -->
</body>
```

For advanced theme creation with light/dark variants and automatic switching, see the [Theme Roller](/showcase/theme-roller) tool.

## Related Resources

Explore these resources for more on theming and customisation:

[showcase-demo id="showcase/elements/css-customisation/related-resources" title="Related Resources" /]
