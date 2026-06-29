# Admin Theme Family Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a six-theme "Admin" family (2 finishes × 3 accents) to Domma, generated from a single source of truth, registered across all theme surfaces, with a two-step Finish→Accent picker in the showcase.

**Architecture:** Each theme is a self-contained CSS class (`.dm-theme-admin-<finish>-<accent>`) defining the full ~80-token contract — same shape as `charcoal-dark.css`. A Node generator emits the six files from two finish token-sets × three accent token-sets. The theme engine needs no logic change; the six names are added to every list/registry that enumerates themes. The showcase gains an Admin section with a finish/accent picker and a live Domma dashboard preview.

**Tech Stack:** Vanilla JS (ES modules), Node build scripts, Vitest, Domma's own CSS-variable theming + components.

**Spec:** `docs/superpowers/specs/2026-06-29-admin-theme-family-design.md`

---

## File Structure

**New files:**
- `scripts/generate-admin-themes.js` — generator; owns all palette values; exports `buildThemeCss(finish, accent)` (pure) + writes the six files when run as `main`.
- `public/assets/themes/admin-smooth-steel.css` … `admin-sharp-teal.css` — 6 generated files.

**Modified files:**
- `src/theme.js` — `AVAILABLE_THEMES` (+6), `listBases()` (+2).
- `src/theme.test.js` — count 16→22, add Admin assertions.
- `package.json` — `generate:themes` script + build-chain insertion.
- `scripts/build-css.js` — `themeFiles` array (+6).
- `src/theme-roller.js` — theme `<option>` list.
- `public/layouts/js/layout.js` — variant dots + dot colours.
- `public/download/kickstart-builder.js` — `THEMES` array.
- `public/assets/ide/phpstorm/theme.d.ts` — typings.
- `public/showcase/themes/index.html` — Admin cards + picker section + preview + JS.
- `docs/DommaDocumentation.md` (theme section) — document the family.

---

## Task 1: Register the six theme names in the engine

**Files:**
- Modify: `src/theme.js` (`AVAILABLE_THEMES` array ~line 12-27; `listBases()` ~line 256)
- Test: `src/theme.test.js` (count assertion ~line 38; new test)

- [ ] **Step 1: Update the count + add Admin assertions in the test**

In `src/theme.test.js`, find the `listThemes()` test asserting `expect(themes.length).toBe(16);` and replace that test body with:

```javascript
  it('listThemes() should return an array of all available themes', () => {
    const themes = Domma.theme.listThemes();
    expect(Array.isArray(themes)).toBe(true);
    expect(themes.length).toBe(22);
    expect(themes).toContain('forest-dark');
    expect(themes).toContain('admin-smooth-steel');
    expect(themes).toContain('admin-sharp-teal');
    expect(themes).not.toContain('light'); // Old format should not exist
  });

  it('should register all six Admin themes', () => {
    const themes = Domma.theme.listThemes();
    const admin = [
      'admin-smooth-steel', 'admin-smooth-indigo', 'admin-smooth-teal',
      'admin-sharp-steel', 'admin-sharp-indigo', 'admin-sharp-teal'
    ];
    admin.forEach(name => expect(themes).toContain(name));
  });

  it('getBase() returns the finish for an Admin theme', () => {
    Domma.theme.set('admin-sharp-steel');
    expect(Domma.theme.getBase()).toBe('admin-sharp');
    Domma.theme.set('charcoal-light'); // restore
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/theme.test.js -t "Admin"`
Expected: FAIL — `admin-*` themes not in list; `set('admin-sharp-steel')` warns "Invalid theme".

- [ ] **Step 3: Add the names to `AVAILABLE_THEMES`**

In `src/theme.js`, change the end of the `AVAILABLE_THEMES` array from:

```javascript
    'wedding-light', 'wedding-dark',
    'core-light'
];
```

to:

```javascript
    'wedding-light', 'wedding-dark',
    'core-light',
    // Admin family — standalone (no light/dark), finish × accent
    'admin-smooth-steel', 'admin-smooth-indigo', 'admin-smooth-teal',
    'admin-sharp-steel', 'admin-sharp-indigo', 'admin-sharp-teal'
];
```

- [ ] **Step 4: Add the finishes to `listBases()`**

In `src/theme.js` `listBases()`, change:

```javascript
        return ['ocean', 'forest', 'sunset', 'royal', 'lemon', 'silver', 'charcoal', 'christmas', 'unicorn', 'dreamy', 'grayve', 'mint', 'wedding'];
```

to:

```javascript
        return ['ocean', 'forest', 'sunset', 'royal', 'lemon', 'silver', 'charcoal', 'christmas', 'unicorn', 'dreamy', 'grayve', 'mint', 'wedding', 'admin-smooth', 'admin-sharp'];
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/theme.test.js`
Expected: PASS (all theme tests green).

- [ ] **Step 6: Commit**

```bash
git add src/theme.js src/theme.test.js
git commit -m "feat(theme): register six Admin themes in engine"
```

---

## Task 2: Build the theme generator

The generator is the single source of truth for all palette values. It exports a pure `buildThemeCss(finishKey, accentKey)` (unit-testable) and, when run directly, writes the six files.

**Files:**
- Create: `scripts/generate-admin-themes.js`
- Test: `scripts/generate-admin-themes.test.js`

- [ ] **Step 1: Write the failing test**

Create `scripts/generate-admin-themes.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { buildThemeCss, FINISHES, ACCENTS } from './generate-admin-themes.js';

describe('generate-admin-themes', () => {
  it('exposes 2 finishes and 3 accents', () => {
    expect(Object.keys(FINISHES).sort()).toEqual(['sharp', 'smooth']);
    expect(Object.keys(ACCENTS).sort()).toEqual(['indigo', 'steel', 'teal']);
  });

  it('emits a correctly scoped rule with the accent primary and finish surface', () => {
    const css = buildThemeCss('sharp', 'steel');
    expect(css).toContain('.dm-theme-admin-sharp-steel {');
    expect(css).toContain('--dm-primary: #3f7cc4;');
    expect(css).toContain('--dm-background: #eef1f6;');
    expect(css).toContain('color-scheme: light;');
  });

  it('uses the dark color-scheme and mid-tone surface for the smooth finish', () => {
    const css = buildThemeCss('smooth', 'teal');
    expect(css).toContain('.dm-theme-admin-smooth-teal {');
    expect(css).toContain('--dm-primary: #2f8f86;');
    expect(css).toContain('--dm-surface: #646d7c;');
    expect(css).toContain('color-scheme: dark;');
  });

  it('defines the full component-token contract', () => {
    const css = buildThemeCss('sharp', 'indigo');
    ['--dm-card-bg', '--dm-input-bg', '--dm-table-header-bg', '--dm-sidebar-bg',
     '--dm-modal-bg', '--dm-tooltip-bg', '--dm-primary-text', '--dm-focus-ring',
     '--dm-success', '--dm-danger', '--dm-warning', '--dm-info'].forEach(tok => {
      expect(css).toContain(tok);
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run scripts/generate-admin-themes.test.js`
Expected: FAIL — cannot resolve `./generate-admin-themes.js`.

- [ ] **Step 3: Write the generator**

Create `scripts/generate-admin-themes.js`:

```javascript
/**
 * Domma Admin Theme Generator
 * Single source of truth for the Admin theme family.
 * 2 finishes (smooth, sharp) x 3 accents (steel, indigo, teal) = 6 themes.
 *
 * Run directly to (re)write the six CSS files into public/assets/themes/.
 */

import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const themesDir = join(rootDir, 'public/assets/themes');

// ---------------------------------------------------------------------------
// Finishes — foundational + chrome tokens. `tintStyle` controls status -light
// tints (solid pale for sharp, translucent for smooth). `accentText` is the
// lightened accent used for on-dark active/selection text on the smooth finish.
// ---------------------------------------------------------------------------
export const FINISHES = {
  smooth: {
    colorScheme: 'dark',
    tintStyle: 'alpha',
    useAccentOnDark: true,
    foundation: {
      'background': '#586170', 'background-alt': '#4f5764',
      'surface': '#646d7c', 'surface-raised': '#6c7686', 'surface-overlay': '#6c7686',
      'text': '#f7f9fb', 'text-secondary': '#d2d8e0', 'text-muted': '#b3bcc8',
      'text-disabled': '#8a93a1', 'text-inverse': '#1f2733',
      'border': '#6f7888', 'border-light': '#5c6573', 'border-dark': '#7a8494',
      'hover-bg': 'rgba(255, 255, 255, 0.07)', 'active-bg': 'rgba(255, 255, 255, 0.10)',
      'disabled-opacity': '0.4',
      'sidebar-bg': '#454d5a', 'sidebar-text': '#d2d8e0', 'sidebar-border': '#3b424d',
      'navbar-bg': '#4f5764', 'navbar-text': '#f7f9fb', 'navbar-border': '#5c6573',
      'table-header-bg': '#535b69', 'table-stripe-bg': 'rgba(255, 255, 255, 0.03)',
      'table-hover-bg': 'rgba(255, 255, 255, 0.07)',
      'modal-backdrop': 'rgba(0, 0, 0, 0.6)',
      'tooltip-bg': '#1f2733', 'tooltip-text': '#ffffff',
      'scrollbar-track': '#4f5764', 'scrollbar-thumb': '#7a8494', 'scrollbar-thumb-hover': '#8b95a5',
      'code-bg': '#454d5a', 'code-text': '#ffd9a8', 'progress-bg': '#535b69'
    }
  },
  sharp: {
    colorScheme: 'light',
    tintStyle: 'solid',
    useAccentOnDark: false,
    foundation: {
      'background': '#eef1f6', 'background-alt': '#e6ebf3',
      'surface': '#fbfcfe', 'surface-raised': '#ffffff', 'surface-overlay': '#ffffff',
      'text': '#1f2733', 'text-secondary': '#5a6677', 'text-muted': '#8893a3',
      'text-disabled': '#aab2bd', 'text-inverse': '#ffffff',
      'border': '#e4e8ef', 'border-light': '#eef1f6', 'border-dark': '#d5dbe5',
      'hover-bg': 'rgba(15, 23, 42, 0.04)', 'active-bg': 'rgba(15, 23, 42, 0.07)',
      'disabled-opacity': '0.5',
      'sidebar-bg': '#283242', 'sidebar-text': '#c4cdda', 'sidebar-border': '#1f2733',
      'navbar-bg': '#fbfcfe', 'navbar-text': '#1f2733', 'navbar-border': '#dde2ea',
      'table-header-bg': '#f0f3f8', 'table-stripe-bg': '#f7f9fc',
      'table-hover-bg': '#eef4fb',
      'modal-backdrop': 'rgba(15, 23, 42, 0.45)',
      'tooltip-bg': '#283242', 'tooltip-text': '#ffffff',
      'scrollbar-track': '#eef1f6', 'scrollbar-thumb': '#c4cdda', 'scrollbar-thumb-hover': '#aab6c6',
      'code-bg': '#f0f3f8', 'code-text': '#b3325a', 'progress-bg': '#e4e8ef'
    }
  }
};

// ---------------------------------------------------------------------------
// Accents — the --dm-primary family. `onDark` is a lightened variant used for
// active/selection text on the smooth finish so it stays legible.
// ---------------------------------------------------------------------------
export const ACCENTS = {
  steel:  { primary: '#3f7cc4', hover: '#356bab', active: '#2d5c95', dark: '#274e7d', rgb: '63, 124, 196',  onDark: '#7fb0e0' },
  indigo: { primary: '#5b63a8', hover: '#4f5694', active: '#444a80', dark: '#3a3f6e', rgb: '91, 99, 168',   onDark: '#9aa0d4' },
  teal:   { primary: '#2f8f86', hover: '#287d75', active: '#226b64', dark: '#1d564f', rgb: '47, 143, 134',  onDark: '#66c2b8' }
};

// ---------------------------------------------------------------------------
// Status colours — shared across the whole family.
// ---------------------------------------------------------------------------
const STATUS = {
  success: { base: '#2e8b50', hover: '#287d49', active: '#226b3f', dark: '#1c5733', rgb: '46, 139, 80',  solidLight: '#e3f3e8', text: '#ffffff' },
  danger:  { base: '#c0432f', hover: '#a93a29', active: '#933223', dark: '#742719', rgb: '192, 67, 47',  solidLight: '#fbe6e1', text: '#ffffff' },
  warning: { base: '#8a6d1f', hover: '#79601b', active: '#675217', dark: '#4e3e11', rgb: '138, 109, 31', solidLight: '#fbf0d6', text: '#ffffff' },
  info:    { base: '#2f6fb0', hover: '#296199', active: '#235485', dark: '#1a3f64', rgb: '47, 111, 176', solidLight: '#e1ecf7', text: '#ffffff' }
};

const FINISH_LABEL = { smooth: 'Smooth', sharp: 'Sharp' };
const ACCENT_LABEL = { steel: 'Steel Blue', indigo: 'Indigo', teal: 'Teal' };

/** Render `  --dm-<key>: <value>;` lines from an object whose keys omit the prefix. */
function vars(map) {
  return Object.entries(map)
    .map(([k, v]) => `    --dm-${k}: ${v};`)
    .join('\n');
}

function statusBlock(tintStyle) {
  let out = '';
  for (const [name, s] of Object.entries(STATUS)) {
    const light = tintStyle === 'solid' ? s.solidLight : `rgba(${s.rgb}, 0.15)`;
    out += vars({
      [`${name}`]: s.base,
      [`${name}-hover`]: s.hover,
      [`${name}-active`]: s.active,
      [`${name}-light`]: light,
      [`${name}-dark`]: s.dark,
      [`${name}-text`]: s.text
    }) + '\n';
  }
  return out.trimEnd();
}

/** Component-specific tokens — identical structure to charcoal-dark.css, all var-referencing. */
function componentBlock() {
  return vars({
    'card-bg': 'var(--dm-surface)',
    'card-border': 'var(--dm-border)',
    'card-shadow': 'var(--dm-shadow-md)',
    'card-header-bg': 'var(--dm-background-alt)',
    'input-bg': 'var(--dm-surface)',
    'input-border': 'var(--dm-border-dark)',
    'input-text': 'var(--dm-text)',
    'input-placeholder': 'var(--dm-text-muted)',
    'input-focus-border': 'var(--dm-primary)',
    'input-disabled-bg': 'var(--dm-background-alt)',
    'btn-text': 'var(--dm-text)',
    'btn-bg': 'var(--dm-surface)',
    'btn-border': 'var(--dm-border-dark)',
    'table-bg': 'transparent',
    'table-border': 'var(--dm-border)',
    'table-header-text': 'var(--dm-text)',
    'table-selected-bg': 'var(--dm-selected-bg)',
    'modal-bg': 'var(--dm-surface)',
    'modal-border': 'var(--dm-border)',
    'modal-shadow': 'var(--dm-shadow-xl)',
    'dropdown-bg': 'var(--dm-surface-raised)',
    'dropdown-border': 'var(--dm-border)',
    'dropdown-shadow': 'var(--dm-shadow-lg)',
    'dropdown-item-hover': 'var(--dm-hover-bg)',
    'dropdown-item-active': 'var(--dm-selected-bg)',
    'toast-bg': 'var(--dm-surface)',
    'toast-border': 'var(--dm-border)',
    'toast-shadow': 'var(--dm-shadow-lg)',
    'sidebar-item-hover': 'var(--dm-hover-bg)',
    'sidebar-item-active': 'var(--dm-selected-bg)',
    'tab-border': 'var(--dm-border)',
    'tab-hover-bg': 'var(--dm-hover-bg)',
    'accordion-bg': 'var(--dm-surface)',
    'accordion-border': 'var(--dm-border)',
    'accordion-header-bg': 'var(--dm-background-alt)',
    'accordion-header-hover': 'var(--dm-hover-bg)',
    'badge-bg': 'var(--dm-secondary)',
    'badge-text': 'var(--dm-text-inverse)',
    'code-border': 'var(--dm-border)'
  });
}

/**
 * Build the full CSS rule string for one Admin theme.
 * @param {'smooth'|'sharp'} finishKey
 * @param {'steel'|'indigo'|'teal'} accentKey
 * @returns {string}
 */
export function buildThemeCss(finishKey, accentKey) {
  const f = FINISHES[finishKey];
  const a = ACCENTS[accentKey];
  if (!f || !a) throw new Error(`Unknown finish/accent: ${finishKey}/${accentKey}`);

  const activeText = f.useAccentOnDark ? a.onDark : a.primary;
  const selectedBg = `rgba(${a.rgb}, ${finishKey === 'smooth' ? '0.22' : '0.12'})`;

  const primaryBlock = vars({
    'primary': a.primary,
    'primary-hover': a.hover,
    'primary-active': a.active,
    'primary-light': `rgba(${a.rgb}, 0.14)`,
    'primary-dark': a.dark,
    'primary-text': '#ffffff',
    'primary-hover-text': '#ffffff',
    'focus-ring': `0 0 0 3px rgba(${a.rgb}, 0.35)`,
    'border-focus': a.primary,
    // Secondary = neutral slate, shared
    'secondary': '#5f6f7a',
    'secondary-hover': '#52606b',
    'secondary-active': '#46535d',
    'secondary-light': finishKey === 'smooth' ? 'rgba(255, 255, 255, 0.10)' : '#eef1f6',
    'secondary-dark': '#3d4a52',
    'secondary-text': '#ffffff',
    'secondary-hover-text': '#ffffff',
    // Selection / tabs / progress derive from accent
    'selected-bg': selectedBg,
    'tab-active-border': a.primary,
    'tab-active-text': activeText,
    'progress-bar': a.primary,
    // Accent ramp (neutral, shared)
    'accent-1': '#78909c',
    'accent-2': '#607d8b',
    'accent-3': '#455a64',
    'accent-4': '#263238'
  });

  const header =
`/**
 * Domma Admin ${FINISH_LABEL[finishKey]} · ${ACCENT_LABEL[accentKey]}
 * GENERATED by scripts/generate-admin-themes.js — do not edit by hand.
 */

.dm-theme-admin-${finishKey}-${accentKey} {
    color-scheme: ${f.colorScheme};

`;

  return header +
    vars(f.foundation) + '\n\n' +
    primaryBlock + '\n\n' +
    statusBlock(f.tintStyle) + '\n\n' +
    componentBlock() + '\n}\n';
}

/** Write all six files. */
function main() {
  let count = 0;
  for (const finishKey of Object.keys(FINISHES)) {
    for (const accentKey of Object.keys(ACCENTS)) {
      const file = join(themesDir, `admin-${finishKey}-${accentKey}.css`);
      writeFileSync(file, buildThemeCss(finishKey, accentKey), 'utf8');
      console.log(`  ✓ admin-${finishKey}-${accentKey}.css`);
      count++;
    }
  }
  console.log(`Generated ${count} Admin theme files.`);
}

// Run when invoked directly (not when imported by tests).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run scripts/generate-admin-themes.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Add the npm script and run the generator**

In `package.json` `scripts`, add after the `generate:bundles` line:

```json
        "generate:themes": "node scripts/generate-admin-themes.js",
```

Then run: `npm run generate:themes`
Expected output: six `✓ admin-*.css` lines and `Generated 6 Admin theme files.`

Verify: `ls public/assets/themes/admin-*.css | wc -l` → `6`

- [ ] **Step 6: Commit**

```bash
git add scripts/generate-admin-themes.js scripts/generate-admin-themes.test.js package.json public/assets/themes/admin-*.css
git commit -m "feat(theme): add Admin theme generator and generated files"
```

---

## Task 3: Wire generated files into the CSS build

**Files:**
- Modify: `scripts/build-css.js` (`themeFiles` array, ~line 65-67)
- Modify: `package.json` (build chain)

- [ ] **Step 1: Add the six files to `themeFiles`**

In `scripts/build-css.js`, change the end of the `themeFiles` array from:

```javascript
  'public/assets/themes/wedding-light.css',
  'public/assets/themes/wedding-dark.css'
];
```

to:

```javascript
  'public/assets/themes/wedding-light.css',
  'public/assets/themes/wedding-dark.css',
  // Admin family (generated)
  'public/assets/themes/admin-smooth-steel.css',
  'public/assets/themes/admin-smooth-indigo.css',
  'public/assets/themes/admin-smooth-teal.css',
  'public/assets/themes/admin-sharp-steel.css',
  'public/assets/themes/admin-sharp-indigo.css',
  'public/assets/themes/admin-sharp-teal.css'
];
```

- [ ] **Step 2: Run the CSS build and verify the themes are bundled**

Run: `npm run build:css`
Then: `grep -c "dm-theme-admin-" public/dist/themes/domma-themes.css`
Expected: `6`

- [ ] **Step 3: Insert `generate:themes` into the build chain (before `build:css`)**

In `package.json`, in both `build` and `dev`/`dev:watch` scripts, insert `npm run generate:themes && ` immediately before `npm run build:css`. For `build` the relevant portion becomes:

```
... && npm run copy:themes && npm run generate:themes && npm run build:css && npm run build:css-bundles && ...
```

Apply the same insertion (`npm run generate:themes && ` before `npm run build:css`) in the `dev` and `dev:watch` scripts.

- [ ] **Step 4: Commit**

```bash
git add scripts/build-css.js package.json
git commit -m "build(theme): bundle Admin themes and regenerate them in the build chain"
```

---

## Task 4: Verify WCAG AA contrast and tune Smooth if needed

The Smooth finish is the contrast risk (mid-tone surfaces). Verify body text and primary-button text hit 4.5:1; adjust generator tokens if not.

**Files:**
- Create (temporary): `scripts/check-admin-contrast.mjs`
- Modify if needed: `scripts/generate-admin-themes.js`

- [ ] **Step 1: Write a contrast checker**

Create `scripts/check-admin-contrast.mjs`:

```javascript
// One-off WCAG AA checker for the Admin finishes. Run with: node scripts/check-admin-contrast.mjs
import { FINISHES, ACCENTS } from './generate-admin-themes.js';

function lum(hex) {
  const c = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map(i => {
    const v = parseInt(c.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

let fail = 0;
for (const [fk, f] of Object.entries(FINISHES)) {
  const surface = f.foundation['surface'];
  const text = f.foundation['text'];
  const r1 = ratio(text, surface);
  const ok1 = r1 >= 4.5;
  if (!ok1) fail++;
  console.log(`${fk}: body text ${text} on surface ${surface} = ${r1.toFixed(2)} ${ok1 ? 'PASS' : 'FAIL'}`);
  for (const [ak, a] of Object.entries(ACCENTS)) {
    const r2 = ratio('#ffffff', a.primary);
    const ok2 = r2 >= 4.5;
    if (!ok2) fail++;
    console.log(`  ${fk}/${ak}: button text #ffffff on ${a.primary} = ${r2.toFixed(2)} ${ok2 ? 'PASS' : 'FAIL'}`);
  }
}
console.log(fail === 0 ? '\nAll AA checks passed.' : `\n${fail} check(s) below 4.5:1.`);
process.exit(fail === 0 ? 0 : 1);
```

- [ ] **Step 2: Run the checker**

Run: `node scripts/check-admin-contrast.mjs`
Expected: every line `PASS` and `All AA checks passed.`

- [ ] **Step 3: If any line FAILs, tune the generator and re-check**

For a failing **body text** line, darken that finish's `surface`/`surface-raised` or lighten `text` in `FINISHES` (in `scripts/generate-admin-themes.js`). For a failing **button text** line, darken that accent's `primary` in `ACCENTS`. Re-run `node scripts/check-admin-contrast.mjs` until it passes, then `npm run generate:themes` to rewrite the files.

(Starting values are expected to pass: `#f7f9fb` on `#646d7c` ≈ 4.7:1; white on all three accents ≥ 4.5:1. This step exists to guarantee it.)

- [ ] **Step 4: Remove the temporary checker and commit any tuning**

```bash
rm scripts/check-admin-contrast.mjs
git add scripts/generate-admin-themes.js public/assets/themes/admin-*.css
git commit -m "fix(theme): verify and lock Admin WCAG AA contrast" --allow-empty
```

---

## Task 5: Register the themes in the remaining surfaces

**Files:**
- Modify: `src/theme-roller.js` (option list, ~line 676)
- Modify: `public/layouts/js/layout.js` (dot colours ~line 360; dot buttons ~line 683)
- Modify: `public/download/kickstart-builder.js` (`THEMES` array ~line 15-19)
- Modify: `public/assets/ide/phpstorm/theme.d.ts` (~line 7)

- [ ] **Step 1: Add Admin options to the theme-roller select**

In `src/theme-roller.js`, find the last theme `<option>` group (the grayve block ending ~line 676) and add an Admin optgroup immediately after the grayve `grayve-dark` option line:

```javascript
                                <optgroup label="Admin (Smooth)">
                                <option value="admin-smooth-steel" ${currentTheme === 'admin-smooth-steel' ? 'selected' : ''}>Admin Smooth · Steel</option>
                                <option value="admin-smooth-indigo" ${currentTheme === 'admin-smooth-indigo' ? 'selected' : ''}>Admin Smooth · Indigo</option>
                                <option value="admin-smooth-teal" ${currentTheme === 'admin-smooth-teal' ? 'selected' : ''}>Admin Smooth · Teal</option>
                                </optgroup>
                                <optgroup label="Admin (Sharp)">
                                <option value="admin-sharp-steel" ${currentTheme === 'admin-sharp-steel' ? 'selected' : ''}>Admin Sharp · Steel</option>
                                <option value="admin-sharp-indigo" ${currentTheme === 'admin-sharp-indigo' ? 'selected' : ''}>Admin Sharp · Indigo</option>
                                <option value="admin-sharp-teal" ${currentTheme === 'admin-sharp-teal' ? 'selected' : ''}>Admin Sharp · Teal</option>
                                </optgroup>
```

(If the surrounding options are not already inside `<optgroup>`s, the new `<optgroup>`s still render correctly within the `<select>`.)

- [ ] **Step 2: Add dot colours to layout.js**

In `public/layouts/js/layout.js`, after the `.variant-dot-grayve-light` rule (~line 360) add:

```javascript
        .variant-dot-admin-smooth-steel { background: linear-gradient(135deg, #586170, #3f7cc4); }
        .variant-dot-admin-smooth-indigo { background: linear-gradient(135deg, #586170, #5b63a8); }
        .variant-dot-admin-smooth-teal { background: linear-gradient(135deg, #586170, #2f8f86); }
        .variant-dot-admin-sharp-steel { background: linear-gradient(135deg, #eef1f6, #3f7cc4); }
        .variant-dot-admin-sharp-indigo { background: linear-gradient(135deg, #eef1f6, #5b63a8); }
        .variant-dot-admin-sharp-teal { background: linear-gradient(135deg, #eef1f6, #2f8f86); }
```

- [ ] **Step 3: Add dot buttons to layout.js**

In the `themeSelectorHtml` template (~line 671-690), after the last existing `variant-dot` button (the grayve/wedding block), add:

```javascript
                    <button class="variant-dot variant-dot-admin-smooth-steel" data-theme="admin-smooth-steel" data-tooltip="Admin Smooth · Steel"></button>
                    <button class="variant-dot variant-dot-admin-smooth-indigo" data-theme="admin-smooth-indigo" data-tooltip="Admin Smooth · Indigo"></button>
                    <button class="variant-dot variant-dot-admin-smooth-teal" data-theme="admin-smooth-teal" data-tooltip="Admin Smooth · Teal"></button>
                    <button class="variant-dot variant-dot-admin-sharp-steel" data-theme="admin-sharp-steel" data-tooltip="Admin Sharp · Steel"></button>
                    <button class="variant-dot variant-dot-admin-sharp-indigo" data-theme="admin-sharp-indigo" data-tooltip="Admin Sharp · Indigo"></button>
                    <button class="variant-dot variant-dot-admin-sharp-teal" data-theme="admin-sharp-teal" data-tooltip="Admin Sharp · Teal"></button>
```

- [ ] **Step 4: Add the names to the kickstart builder**

In `public/download/kickstart-builder.js`, change the `THEMES` array (~line 15-19) to include the Admin names. After the existing `'grayve-light', 'grayve-dark',` entry add:

```javascript
    'admin-smooth-steel', 'admin-smooth-indigo', 'admin-smooth-teal',
    'admin-sharp-steel', 'admin-sharp-indigo', 'admin-sharp-teal',
```

- [ ] **Step 5: Add typings**

In `public/assets/ide/phpstorm/theme.d.ts`, after the `ThemeVariant` line (~line 7) add a dedicated Admin type and document the names:

```typescript
/** Standalone Admin family (no light/dark) — finish-accent full names. */
export type AdminTheme =
    | 'admin-smooth-steel' | 'admin-smooth-indigo' | 'admin-smooth-teal'
    | 'admin-sharp-steel' | 'admin-sharp-indigo' | 'admin-sharp-teal';
```

Also extend `ThemeVariant` to include the finishes:

```typescript
export type ThemeVariant = 'ocean' | 'forest' | 'sunset' | 'royal' | 'lemon' | 'silver' | 'charcoal' | 'christmas' | 'unicorn' | 'dreamy' | 'grayve' | 'mint' | 'wedding' | 'admin-smooth' | 'admin-sharp' | 'default';
```

- [ ] **Step 6: Commit**

```bash
git add src/theme-roller.js public/layouts/js/layout.js public/download/kickstart-builder.js public/assets/ide/phpstorm/theme.d.ts
git commit -m "feat(theme): surface Admin themes in roller, layout, kickstart and IDE typings"
```

---

## Task 6: Add Admin cards to the showcase gallery

**Files:**
- Modify: `public/showcase/themes/index.html` (theme grid, after the `core-light` card ~line 555)

- [ ] **Step 1: Add six Admin theme cards**

In `public/showcase/themes/index.html`, immediately after the closing `</div>` of the `core-light` `theme-pair` (~line 556, before the `theme-grid` container closes), add:

```html
            <div class="theme-pair">
                <div class="theme-card" data-theme="admin-smooth-steel">
                    <div class="theme-card-preview" style="background: linear-gradient(135deg, #586170, #646d7c);">
                        <div class="theme-card-accent" style="background: #3f7cc4;"></div>
                    </div>
                    <div class="theme-card-body">
                        <div class="theme-card-name">Admin Smooth</div>
                        <div class="theme-card-mode">Steel</div>
                    </div>
                </div>
                <div class="theme-card" data-theme="admin-sharp-steel">
                    <div class="theme-card-preview" style="background: linear-gradient(135deg, #eef1f6, #283242);">
                        <div class="theme-card-accent" style="background: #3f7cc4;"></div>
                    </div>
                    <div class="theme-card-body">
                        <div class="theme-card-name">Admin Sharp</div>
                        <div class="theme-card-mode">Steel</div>
                    </div>
                </div>
            </div>
            <div class="theme-pair">
                <div class="theme-card" data-theme="admin-smooth-indigo">
                    <div class="theme-card-preview" style="background: linear-gradient(135deg, #586170, #646d7c);">
                        <div class="theme-card-accent" style="background: #5b63a8;"></div>
                    </div>
                    <div class="theme-card-body">
                        <div class="theme-card-name">Admin Smooth</div>
                        <div class="theme-card-mode">Indigo</div>
                    </div>
                </div>
                <div class="theme-card" data-theme="admin-sharp-indigo">
                    <div class="theme-card-preview" style="background: linear-gradient(135deg, #eef1f6, #283242);">
                        <div class="theme-card-accent" style="background: #5b63a8;"></div>
                    </div>
                    <div class="theme-card-body">
                        <div class="theme-card-name">Admin Sharp</div>
                        <div class="theme-card-mode">Indigo</div>
                    </div>
                </div>
            </div>
            <div class="theme-pair">
                <div class="theme-card" data-theme="admin-smooth-teal">
                    <div class="theme-card-preview" style="background: linear-gradient(135deg, #586170, #646d7c);">
                        <div class="theme-card-accent" style="background: #2f8f86;"></div>
                    </div>
                    <div class="theme-card-body">
                        <div class="theme-card-name">Admin Smooth</div>
                        <div class="theme-card-mode">Teal</div>
                    </div>
                </div>
                <div class="theme-card" data-theme="admin-sharp-teal">
                    <div class="theme-card-preview" style="background: linear-gradient(135deg, #eef1f6, #283242);">
                        <div class="theme-card-accent" style="background: #2f8f86;"></div>
                    </div>
                    <div class="theme-card-body">
                        <div class="theme-card-name">Admin Sharp</div>
                        <div class="theme-card-mode">Teal</div>
                    </div>
                </div>
            </div>
```

The existing click handler (`document.querySelectorAll('.theme-card')...` ~line 1221) and the audit (which uses `Domma.theme.listThemes()`) pick these up automatically — no JS change needed for the gallery.

- [ ] **Step 2: Verify in the running site (user-driven)**

The user reloads `/showcase/themes/` and confirms six new Admin cards appear and clicking each repaints the page. (The assistant cannot drive a browser.)

- [ ] **Step 3: Commit**

```bash
git add public/showcase/themes/index.html
git commit -m "feat(showcase): add Admin theme cards to the gallery"
```

---

## Task 7: Build the two-step Finish → Accent picker with live preview

**Files:**
- Modify: `public/showcase/themes/index.html` (new `<section>` after the Theme Selector section ~line 252; new JS in the DOMContentLoaded block ~line 1180)

- [ ] **Step 1: Add the picker + preview markup**

In `public/showcase/themes/index.html`, immediately after the closing `</section>` of the Theme Selector section (~line 252, before the next section), insert:

```html
    <!-- Admin Theme Builder -->
    <section class="preview-section" data-section="Admin Builder" id="admin-builder">
        <h2 class="themes-section-title">Admin Theme Builder</h2>
        <p class="dm-text-secondary dm-mb-4">Pick a finish, then an accent. Six looks, two clicks.</p>

        <div class="dm-grid dm-grid-cols-1 dm-gap-4" style="grid-template-columns: 280px 1fr;">
            <div class="dm-card" style="padding: var(--dm-space-5);">
                <div class="dm-label">1 · Finish</div>
                <div class="btn-group" id="admin-finish" role="group" style="display:flex; gap:8px; margin-bottom:20px;">
                    <button class="btn" data-finish="smooth">Smooth</button>
                    <button class="btn active" data-finish="sharp">Sharp</button>
                </div>
                <div class="dm-label">2 · Accent</div>
                <div id="admin-accent" style="display:flex; gap:12px; margin-top:8px;">
                    <button class="admin-acc active" data-accent="steel" data-tooltip="Steel Blue" style="flex:1; height:44px; border-radius:8px; border:2px solid var(--dm-text); background:#3f7cc4;"></button>
                    <button class="admin-acc" data-accent="indigo" data-tooltip="Indigo" style="flex:1; height:44px; border-radius:8px; border:2px solid transparent; background:#5b63a8;"></button>
                    <button class="admin-acc" data-accent="teal" data-tooltip="Teal" style="flex:1; height:44px; border-radius:8px; border:2px solid transparent; background:#2f8f86;"></button>
                </div>
                <div class="dm-mt-4 dm-text-sm dm-text-secondary">Theme: <code id="admin-current">admin-sharp-steel</code></div>
            </div>

            <div class="dm-card" id="admin-preview" style="padding:0; overflow:hidden;">
                <div style="display:flex; min-height:300px;">
                    <aside style="width:160px; background:var(--dm-sidebar-bg); color:var(--dm-sidebar-text); padding:16px;">
                        <strong style="color:var(--dm-text-inverse,#fff); display:block; margin-bottom:16px;">Admin</strong>
                        <div style="background:var(--dm-primary); color:#fff; padding:8px; border-radius:6px; margin-bottom:4px;">Dashboard</div>
                        <div style="padding:8px;">Users</div>
                        <div style="padding:8px;">Reports</div>
                    </aside>
                    <div style="flex:1; background:var(--dm-background); padding:16px;">
                        <div class="dm-grid dm-grid-cols-3 dm-gap-3 dm-mb-4">
                            <div class="dm-card" style="padding:12px;"><div class="dm-text-xs dm-text-muted">Revenue</div><div style="font-size:20px; font-weight:700;">£48k</div></div>
                            <div class="dm-card" style="padding:12px;"><div class="dm-text-xs dm-text-muted">Orders</div><div style="font-size:20px; font-weight:700;">1,204</div></div>
                            <div class="dm-card" style="padding:12px;"><div class="dm-text-xs dm-text-muted">Active</div><div style="font-size:20px; font-weight:700;">317</div></div>
                        </div>
                        <div id="admin-preview-table"></div>
                        <div class="dm-mt-4" style="display:flex; gap:8px;">
                            <button class="btn btn-primary">Save</button>
                            <button class="btn">Cancel</button>
                            <span class="badge badge-success">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 2: Add the picker JS**

In `public/showcase/themes/index.html`, inside the existing `document.addEventListener('DOMContentLoaded', () => { ... })` block (~line 1180), before its closing `});`, add:

```javascript
  // --- Admin Theme Builder ---
  (function initAdminBuilder() {
    const state = { finish: 'sharp', accent: 'steel' };
    const currentEl = document.getElementById('admin-current');
    const finishWrap = document.getElementById('admin-finish');
    const accentWrap = document.getElementById('admin-accent');
    if (!finishWrap || !accentWrap) return;

    // Live data table via Domma tables
    if (window.Domma && Domma.tables) {
      Domma.tables.create('#admin-preview-table', {
        data: [
          { customer: 'Acme Ltd', plan: 'Pro', status: 'Active' },
          { customer: 'Globex', plan: 'Team', status: 'Trial' },
          { customer: 'Initech', plan: 'Free', status: 'Active' }
        ],
        columns: [
          { key: 'customer', label: 'Customer' },
          { key: 'plan', label: 'Plan' },
          { key: 'status', label: 'Status' }
        ],
        pagination: false
      });
    }

    function apply() {
      const name = `admin-${state.finish}-${state.accent}`;
      currentEl.textContent = name;
      Domma.theme.set(name);
    }

    finishWrap.querySelectorAll('[data-finish]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.finish = btn.dataset.finish;
        finishWrap.querySelectorAll('[data-finish]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        apply();
      });
    });

    accentWrap.querySelectorAll('[data-accent]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.accent = btn.dataset.accent;
        accentWrap.querySelectorAll('[data-accent]').forEach(b => b.style.borderColor = 'transparent');
        btn.style.borderColor = 'var(--dm-text)';
        apply();
      });
    });
  })();
```

- [ ] **Step 3: Verify in the running site (user-driven)**

The user reloads `/showcase/themes/`, scrolls to "Admin Theme Builder", and confirms: choosing a finish + accent repaints the whole page, the preview dashboard reflects the theme, and the `admin-current` code label updates. (The assistant cannot drive a browser.)

- [ ] **Step 4: Commit**

```bash
git add public/showcase/themes/index.html
git commit -m "feat(showcase): add two-step Admin Finish/Accent picker with live preview"
```

---

## Task 8: Documentation and final full build

**Files:**
- Modify: `docs/DommaDocumentation.md` (theme section)

- [ ] **Step 1: Document the Admin family**

In `docs/DommaDocumentation.md`, find the themes section (search for `charcoal-dark` or "Available Themes") and add a subsection:

```markdown
#### Admin family (standalone)

The **Admin** family is a mid-weight, corporate theme set built for dashboards. It has no
light/dark variant — it is its own family of six themes, a 2 × 3 matrix of **finish** × **accent**:

- **Finishes:** `smooth` (uniform mid-tone surfaces) · `sharp` (dark chrome + tinted-light workspace)
- **Accents:** `steel` (#3f7cc4) · `indigo` (#5b63a8) · `teal` (#2f8f86)

Full names: `admin-smooth-steel`, `admin-smooth-indigo`, `admin-smooth-teal`,
`admin-sharp-steel`, `admin-sharp-indigo`, `admin-sharp-teal`.

```javascript
Domma.theme.set('admin-sharp-steel');
Domma.theme.getBase(); // 'admin-sharp'
```

The six CSS files are generated by `scripts/generate-admin-themes.js` (run via
`npm run generate:themes`) — edit token values there, never the generated files.
```

- [ ] **Step 2: Run the full build and confirm it is clean**

Run: `npm run build`
Expected: completes with no `Warning: ... not found` lines for any `admin-*` file.

Then confirm bundling once more: `grep -c "dm-theme-admin-" public/dist/themes/domma-themes.css` → `6`

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: all tests pass (including the updated theme count and generator tests).

- [ ] **Step 4: Commit**

```bash
git add docs/DommaDocumentation.md
git commit -m "docs(theme): document the Admin theme family"
```

---

## Self-Review Notes

- **Spec coverage:** 6 themes (T1–T3), generator single-source (T2), build wiring + chain (T3), WCAG AA (T4), all registries — theme.js/roller/layout/kickstart/IDE (T1, T5), showcase gallery (T6), two-step picker + live preview (T7), docs (T8). All spec sections map to a task.
- **Non-goals respected:** no global cross-theme accents, no light/dark Admin, no engine logic change.
- **Naming consistency:** full names `admin-<finish>-<accent>` and finish bases `admin-smooth`/`admin-sharp` are used identically across `buildThemeCss`, `AVAILABLE_THEMES`, `listBases`, build list, all registries, and the picker's `apply()`.
- **Browser-dependent steps** (T6 S2, T7 S3) are explicitly user-driven — the assistant cannot drive a browser.
- **Sitemap:** no new page URL is added (the showcase themes page already exists), so `sitemap.xml` needs no change.
- **CMS / sibling repos:** out of scope per the spec.
```
