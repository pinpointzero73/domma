# Admin Theme Family — Design Spec

**Date:** 2026-06-29
**Status:** Approved for planning
**Author:** Darryl Waterhouse (with Claude)

## Summary

Add a new **Admin** theme family to Domma: a mid-weight, corporate-yet-swish look built for
admin/dashboard UIs. It is neither a "light" nor a "dark" theme in the existing sense — it ships as
its own standalone family with no light/dark toggle.

The family is a **2 × 3 matrix**: two *finishes* × three *accents* = six themes.

|            | Steel Blue            | Indigo                 | Teal                 |
|------------|-----------------------|------------------------|----------------------|
| **Smooth** | `admin-smooth-steel`  | `admin-smooth-indigo`  | `admin-smooth-teal`  |
| **Sharp**  | `admin-sharp-steel`   | `admin-sharp-indigo`   | `admin-sharp-teal`   |

- **Finish** controls surfaces, chrome (sidebar/navbar), text and borders.
- **Accent** controls the `--dm-primary` family (buttons, active nav, links, focus rings, progress).

Both deliverables confirmed in brainstorming:
1. The six CSS files are produced by a **generator** (single source of truth), not hand-authored.
2. A full **two-step Finish → Accent picker** is built into the showcase now.

## Goals

- Six selectable themes via the existing engine (`Theme.set('admin-sharp-steel')`).
- A two-step picker (choose finish, then accent) with a live admin-dashboard preview.
- Zero behavioural change to the existing 14 theme families.
- Body text and primary buttons meet **WCAG AA (4.5:1)** on every finish.

## Non-Goals (explicitly deferred)

- **Global cross-theme accents** (applying Steel/Indigo/Teal to ocean, forest, etc.). This was the
  "Option 2" path; deferred to keep the work contained.
- Light/dark variants of Admin.
- Changing the theme engine's class-swap model.

## Engine Integration

Each theme is one self-contained CSS file scoped to a single class, e.g.
`.dm-theme-admin-sharp-steel { … }` — the same ~80-token contract as `charcoal-dark.css`
(foundational colours, text, borders, primary/secondary/status, plus component-specific tokens that
reference the foundational vars).

The engine applies exactly one class to `<body>` (`dm-theme-<full-name>`), so no engine logic needs
to special-case the family. Name parsing is benign:

- `getBase()` → `split('-').slice(0,-1).join('-')` → `admin-smooth` / `admin-sharp`.
- `getMode()` → `split('-').pop()` → the accent (`steel` / `indigo` / `teal`).
- Only `isDark()` and `_updateMetaThemeColor()` read the mode; both degrade gracefully. We set
  `color-scheme` explicitly in each file (`light` for Sharp, `dark` for Smooth) so native form
  controls render correctly regardless.

## Palette

All values below are **starting points**. The generator owns them; Smooth text tones MUST be
contrast-verified (see Verification) and nudged if they miss AA.

### Finish: Sharp (light composed) — `color-scheme: light`

| Token | Value |
|---|---|
| `--dm-background` | `#eef1f6` |
| `--dm-background-alt` | `#e6ebf3` |
| `--dm-surface` | `#fbfcfe` |
| `--dm-surface-raised` | `#ffffff` |
| `--dm-text` | `#1f2733` |
| `--dm-text-secondary` | `#5a6677` |
| `--dm-text-muted` | `#8893a3` |
| `--dm-text-inverse` | `#ffffff` |
| `--dm-border` | `#e4e8ef` |
| `--dm-border-dark` | `#d5dbe5` |
| `--dm-sidebar-bg` | `#283242` |
| `--dm-sidebar-text` | `#c4cdda` |
| `--dm-navbar-bg` | `#fbfcfe` |
| `--dm-table-header-bg` | `#f0f3f8` |
| `--dm-table-stripe-bg` | `#f7f9fc` |
| `--dm-table-hover-bg` | `#eef4fb` |

### Finish: Smooth (uniform mid-tone) — `color-scheme: dark`

| Token | Value |
|---|---|
| `--dm-background` | `#586170` |
| `--dm-background-alt` | `#4f5764` |
| `--dm-surface` | `#646d7c` |
| `--dm-surface-raised` | `#6c7686` |
| `--dm-text` | `#f7f9fb` *(near-white for AA on `#646d7c`)* |
| `--dm-text-secondary` | `#d2d8e0` |
| `--dm-text-muted` | `#b3bcc8` |
| `--dm-text-inverse` | `#1f2733` |
| `--dm-border` | `#6f7888` |
| `--dm-border-dark` | `#7a8494` |
| `--dm-sidebar-bg` | `#454d5a` |
| `--dm-sidebar-text` | `#d2d8e0` |
| `--dm-navbar-bg` | `#4f5764` |
| `--dm-table-header-bg` | `#535b69` |
| `--dm-table-stripe-bg` | `rgba(255,255,255,0.03)` |
| `--dm-table-hover-bg` | `rgba(255,255,255,0.07)` |

### Accents (shared hue across both finishes)

The hue is identical between finishes; only `*-light`, `*-dark` and the contrast-text tokens adapt.
On the **Smooth** finish, link/active accent text uses a lightened accent so it stays legible on the
mid-tone surfaces (the generator derives this).

| Accent | `--dm-primary` | hover | active | `--dm-primary-dark` | `--dm-primary-light` |
|---|---|---|---|---|---|
| Steel Blue | `#3f7cc4` | `#356bab` | `#2d5c95` | `#274e7d` | `rgba(63,124,196,0.14)` |
| Indigo | `#5b63a8` | `#4f5694` | `#444a80` | `#3a3f6e` | `rgba(91,99,168,0.14)` |
| Teal | `#2f8f86` | `#287d75` | `#226b64` | `#1d564f` | `rgba(47,143,134,0.14)` |

> **Superseded by AA tuning (during implementation):** Steel and Teal `--dm-primary` were darkened
> to meet WCAG AA for white button text — Steel is now `#3b76bc` and Teal `#2a8178` (Indigo
> unchanged). The generator (`scripts/generate-admin-themes.js`) holds the authoritative values.

Each accent also sets `--dm-primary-text: #ffffff`, `--dm-focus-ring`, `--dm-border-focus`,
`--dm-tab-active-border`, `--dm-tab-active-text`, `--dm-progress-bar`, `--dm-selected-bg` (derived
from primary).

### Status colours (desaturated, shared)

- success `#2e8b50`, danger `#c0432f`, warning `#8a6d1f`, info `#2f6fb0`
- Each with hover/active/light/dark + contrast-text tokens, following the `charcoal-dark.css` shape.
- On Smooth, `*-light` tints use `rgba(...,0.15)`; on Sharp they use the pale solid tints
  (`#e3f3e8`, etc.).

## The Generator

`scripts/generate-admin-themes.js` — single source of truth for the six files.

- **Inputs:** a `FINISHES` map (`smooth`, `sharp`) of foundational tokens, and an `ACCENTS` map
  (`steel`, `indigo`, `teal`) of primary-family tokens.
- **Logic:** for each finish × accent, merge `base finish tokens + accent tokens + derived
  component tokens` and emit a `.dm-theme-admin-<finish>-<accent> { … }` rule to
  `public/assets/themes/admin-<finish>-<accent>.css`.
- The component-specific block (cards, inputs, buttons, tables, modals, dropdowns, tooltips, toasts,
  navbar, sidebar, tabs, accordion, badges, progress, scrollbar, code) is emitted from a shared
  template referencing the foundational vars — identical pattern to `charcoal-dark.css`.
- A finish-aware step lightens the accent for on-dark link/active text on the Smooth finish.
- **Wiring:** add an npm script `generate:themes` and run it in the build chain **before**
  `build:css` (which concatenates `public/assets/themes/*` into `domma-themes.css`). The six files
  are committed for diff visibility and regenerated whenever tokens change.

## The Picker (showcase)

Enhance `public/showcase/themes/index.html` with an **Admin** section, built with the layout system
(header/sidebar/footer via `data-layout` + layout JS) and Domma components throughout:

- **Step 1 — Finish:** segmented control (Smooth / Sharp).
- **Step 2 — Accent:** three swatches (Steel / Indigo / Teal).
- Selection composes `admin-<finish>-<accent>` and calls `Theme.set(name)`, persisted to
  localStorage via the engine.
- **Live preview pane:** a representative admin dashboard rendered with Domma — sidebar nav, topbar,
  stat cards, a `T.create` data table, buttons, a blueprint-driven form (`F.create`), badges and a
  progress bar — so each theme is shown in context, not as swatches alone.
- Icons via `data-icon` + `I.scan()`; reuse an existing icon or add one if a needed glyph is missing.

## Files & Wiring Checklist

**New:**
- `scripts/generate-admin-themes.js` (generator)
- `public/assets/themes/admin-{smooth,sharp}-{steel,indigo,teal}.css` (6, generated)

**Register the six theme names in:**
- `src/theme.js` — `AVAILABLE_THEMES`; add `admin-smooth` / `admin-sharp` to `listBases()`
- `scripts/build-css.js` — `themeFiles` array
- `src/theme-roller.js` — theme list
- `public/layouts/js/layout.js` — theme switcher list
- `public/download/kickstart-builder.js` — scaffolder theme options
- `public/assets/ide/phpstorm/theme.d.ts` — IDE typings
- `package.json` — `generate:themes` script + build-chain insertion

**Docs/showcase:**
- `public/showcase/themes/index.html` — Admin section + two-step picker + live preview
- Theme documentation (`docs/`), and `public/sitemap.xml` only if a new page URL is added
- In-line docs updated per project guidelines

**Note on CMS / sibling repos:** `public/cms/*` references the theme list; per project memory,
domma-cms admin cache-busting and the three sibling repos are a separate concern — out of scope here
unless explicitly requested.

## Verification

- `npm run generate:themes` produces six well-formed files; `npm run build:css` concatenates them
  into `public/dist/themes/domma-themes.css` with no warnings.
- All six names resolve via `Theme.set(...)` and appear in the theme-roller, layout switcher and
  kickstart builder.
- **WCAG AA (4.5:1)** verified for body text and primary-button text on each finish; Smooth tones
  nudged if any value misses. (Contrast checked with a tooling pass during implementation.)
- Browser check is **user-driven** — the assistant cannot drive a browser, so after wiring the
  preview the user verifies the six looks and the picker interaction in-browser.

## Open Questions

None outstanding — finish set, accent set, generator approach and picker scope are all confirmed.
