# Chooser — visual option-picker form input

**Date:** 2026-05-08
**Status:** Approved (brainstorming)
**Owner:** Darryl Waterhouse

## 1 — Summary

Add a new form input type, **`chooser`**, that renders a set of options as
visually rich, click-to-select tiles instead of native `<input type="radio">`
or `<input type="checkbox">` controls. A single component covers four
combinations driven by blueprint parameters:

|                | `multiple: false`           | `multiple: true`              |
|----------------|-----------------------------|-------------------------------|
| `variant: 'card'` | Single-select cards     | Multi-select cards            |
| `variant: 'chip'` | Single-select chips     | Multi-select chips            |

Each combination supports `density: 'comfortable' \| 'compact'` and per-option
metadata (icon, description, tooltip, badge, recommended, disabled).

The component is fully integrated into Domma's blueprint-driven form pipeline,
so validation, model binding, and submission work without additional wiring.
A standalone `E.chooser()` helper is also exposed for use outside forms.

In the Domma CMS Page Editor (page-roller) the chooser is wired up as a
draggable field-palette tile. Dropping the tile opens a **slideover GUI** —
a structured editor with live preview — that lets non-developers configure
every chooser option visually. The slideover saves back to the existing
`formFields` JSON textarea, which remains the canonical configuration store.

## 2 — Motivation

Native radio buttons and checkboxes are functionally adequate but visually
weak for high-stakes selections — pricing plans, feature toggles, theme
choice, tag selection. Many modern product surfaces render these as cards or
chips with descriptive copy, icons, and badges. Domma already has the
building blocks (cards, badges, icons, tooltips, blueprints), but no single
form-friendly control that combines them. `chooser` fills that gap and gives
authors one consistent API regardless of whether they need radio- or
checkbox-style behaviour, card- or chip-style presentation.

## 3 — Public API

### 3.1 — Blueprint usage

```js
F.create('#form', {
  blueprint: {
    plan: {
      type: 'chooser',                 // ← the new input type (matches 'radio', 'select' convention)
      variant: 'card',                 // 'card' | 'chip'
      density: 'comfortable',          // 'comfortable' (default) | 'compact'
      columns: 3,                      // grid columns; cards only — chips wrap
      required: true,
      label: 'Choose your plan',
      options: [
        { value: 'starter',
          label: 'Starter',
          icon: 'rocket',
          description: 'For solo builders.' },
        { value: 'pro',
          label: 'Pro',
          icon: 'zap',
          description: 'Teams up to 10.',
          badge: { text: 'POPULAR', type: 'success' },
          recommended: true,
          tooltip: 'Most-bought plan' },
        { value: 'ent',
          label: 'Enterprise',
          icon: 'briefcase',
          description: 'Custom limits + SSO.',
          badge: { text: 'CONTACT', type: 'info' } }
      ]
    },

    tags: {
      type: 'chooser',
      variant: 'chip',
      multiple: true,                  // ← checkbox semantics
      label: 'Tags',
      options: [
        { value: 'js', label: 'JavaScript', icon: 'code',
          tooltip: 'Vanilla JS, ES2022+' },
        { value: 'css', label: 'CSS', icon: 'palette' },
        { value: 'wasm', label: 'WASM', icon: 'cpu', disabled: true }
      ]
    }
  }
});
```

The `type: 'chooser'` string follows the same pattern used by existing input
types (`'radio'`, `'select'`, `'checkbox-group'`, `'textarea'`, etc.). The
data shape (single string vs string array) is inferred from `multiple`:
when `false`, the field stores a string; when `true`, it stores an array.

### 3.2 — Top-level options

| Key       | Type                                | Default          | Notes |
|-----------|-------------------------------------|------------------|-------|
| `type`    | `'chooser'`                         | —                | Required to opt into this control |
| `variant` | `'card' \| 'chip'`                  | `'card'`         | Visual presentation |
| `multiple`| `boolean`                           | `false`          | Toggles single ↔ multi-select; when `true`, field value is an array |
| `density` | `'comfortable' \| 'compact'`        | `'comfortable'`  | Compact removes description, tightens padding |
| `columns` | `number` (1–6)                      | `3`              | Grid columns for `variant: 'card'`; ignored for chips |
| `options` | `Array<Option>`                     | `[]`             | Required, non-empty |
| `label`   | `string`                            | —                | Standard form-field label, rendered above the picker |
| `required`| `boolean`                           | `false`          | Standard validation flag |
| `default` | `string \| string[]`                | —                | Initial selection; string for single, array for multi |

### 3.3 — Per-option keys

| Key            | Type                                         | Notes |
|----------------|----------------------------------------------|-------|
| `value`        | `string \| number`                           | Required |
| `label`        | `string`                                     | Required |
| `icon`         | `string` (Domma icon name)                   | Optional |
| `description`  | `string`                                     | Optional; shown in `card` + `comfortable` only |
| `tooltip`      | `string`                                     | Optional; uses `E.tooltip()` |
| `badge`        | `{ text: string, type: 'success' \| 'info' \| 'warning' \| 'danger' \| 'primary' }` | Optional; reuses `.badge`/`.badge-*` from `elements.css` |
| `recommended`  | `boolean`                                    | Optional; renders success-coloured border |
| `disabled`     | `boolean`                                    | Optional; non-interactive, muted |

### 3.4 — Validation

- `required` honoured by the existing form pipeline. For `multiple: false`,
  validates that a value is selected. For `multiple: true`, validates that
  the array is non-empty.
- Field value shape is inferred from `multiple`: a string for single-select,
  an array of strings for multi-select. The blueprint does not need a separate
  data-type declaration.
- Standard blueprint validators (`min`, `max`, custom validator functions)
  apply to the array length when `multiple: true`.

### 3.5 — Standalone helper (optional)

`E.chooser(selector, options)` — same render path as the form input, usable
outside a form. Mirrors `E.pillbox()`. Returns a control object with
`getValue()`, `setValue(v)`, `disable()`, `enable()`, `destroy()`.

## 4 — Visual design

The component uses a single `.domma-chooser` block with attribute selectors
(`[data-variant]`, `[data-density]`) so all four matrix combinations share one
CSS rule set. Selected, hover, recommended, and disabled states are signalled
through state classes (`is-selected`, `is-recommended`, `is-disabled`).

All colours reference Domma CSS variables (`--dm-primary`, `--dm-card-bg`,
`--dm-border`, `--dm-success`, `--dm-text-muted`) so the component retints
automatically across all themes (charcoal, ocean, forest, sunset, lemon,
mint, dreamy, christmas) and both light and dark variants without per-theme
overrides.

The mockup at `.superpowers/brainstorm/262628-1778261295/content/variants-domma-v2.html`
demonstrates the proposed visual treatment using real Domma CSS, real Domma
icons, and live theme switching. That mockup is the visual contract for
implementation.

## 5 — File touch points

1. **`src/forms.js`**
   - Add `case 'chooser':` to the `_buildField()` switch (~line 357).
   - New private method `_buildChooser(fieldName, fieldDef, attrs, currentValue)`.
   - Add chooser handling to `_getFieldValue()` (reads selected values from the
     hidden native inputs the chooser maintains).
   - Add chooser tooltip-init to the post-render hooks alongside the signature-field hook.

2. **`src/css/elements.css`**
   - Append a `.domma-chooser` block: layout, variant rules, density rules,
     state classes, badge slot, recommended ring, disabled state.
   - Reuse existing `.badge` / `.badge-*` classes for per-option badges — no
     new badge styles introduced.

3. **`src/elements.js`**
   - New public method `Domma.elements.chooser(selector, options)` wrapping the
     same DOM builder so the CMS preview and arbitrary pages can use the
     control without going through `F.create()`. Mirrors `E.pillbox()` shape.
   - Export `chooser` in the elements alias surface.

4. **`src/page-roller.js`**
   - Add a **field-palette tile** for "Chooser" in the form-section editor.
     The tile is `draggable="true"`.
   - Dropping the tile into the form's field list opens a **chooser-builder
     slideover** (uses `E.slideover()` from the right edge) instead of
     inserting raw JSON. The slideover is the GUI for constructing a chooser
     field.
   - The slideover form contains:
     - Field-level inputs: `name` (data key), `label`, `required`, `default`.
     - Chooser-level inputs: `variant` (card/chip toggle), `multiple` (single
       /multi toggle), `density` (comfortable/compact toggle), `columns`
       (number stepper, hidden when chip).
     - Options editor: an add/remove/reorder list. Each row is a sub-form for
       one option with inputs for `value`, `label`, `icon` (text input with
       Domma-icon autocomplete via `E.autocomplete()` sourced from the
       icon-name list), `description`, `tooltip`, `badge.text`, `badge.type`
       (select), `recommended` (checkbox), `disabled` (checkbox).
     - **Live preview pane** at the top of the slideover that re-renders
       through `E.chooser()` whenever any input changes.
     - **Save / Cancel** buttons. Save serialises the form state back to a
       JSON object and inserts/updates the entry in the existing `formFields`
       JSON textarea (still the canonical store).
   - Editing an existing chooser field (clicking it in the form preview)
     re-opens the same slideover pre-populated from the JSON.
   - **The JSON textarea remains the source of truth.** The slideover is a
     structured build helper that produces and consumes that JSON. Authors
     can still hand-edit the JSON if they prefer.
   - All page-roller code paths added for chooser must include JSDoc inline
     documentation describing the schema produced and the slideover lifecycle.
   - Update `SECTION_REGISTRY.form` so the form section's preview correctly
     renders chooser fields (delegate to `E.chooser()` or the same builder
     used by `_buildChooser`).

5. **`src/web-components/`** (if a corresponding `<dm-chooser>` web component
   is desired) — out of scope for this spec; can be added later.

6. **Showcase** (comprehensive — this page is the canonical visual reference)
   - New directory `public/showcase/elements/chooser/` with `index.html`
     covering, at minimum:
     - **The four matrix combinations** (card × chip, single × multi), each
       in its own demo block with copy-paste blueprint snippet.
     - **Density toggle** demo (comfortable vs compact, side by side).
     - **Columns** demo (1, 2, 3, 4, 6 columns; cards only).
     - **Per-option flags**, one demo each: `icon`, `description`, `tooltip`,
       `badge` (all five badge types: success, info, warning, danger,
       primary), `recommended`, `disabled`.
     - **Theme-awareness demo** with a built-in theme switcher (Charcoal,
       Ocean, Forest, Sunset, Lemon, Mint, Dreamy × Light/Dark) showing the
       chooser retinting live across all themes.
     - **Accessibility demo** showing keyboard navigation (arrow keys for
       radio mode, tab for checkbox mode, Space to toggle, focus rings).
     - **Inside-a-form** demo using `F.create()` with a chooser field, model
       binding, validation, and submit-handler echoing the value.
     - **Standalone usage** demo using `E.chooser()` directly.
     - **Tutorial section** at the bottom: step-by-step guide to adding a
       chooser to a form, an explanation of every blueprint key, common
       patterns (pricing-plan picker, tag picker, theme picker), and a
       "gotchas" section.
   - **Add a card** for chooser in `public/showcase/elements/index.html`
     using the existing card pattern (icon, title, short description, link
     to the showcase page).
   - Add `<url>` entry to `public/sitemap.xml`.

7. **Documentation**
   - `docs/API.md` — chooser entry under Forms / Input Types with full
     option table and per-option flag table.
   - `docs/DommaDocumentation.md` — feature section with the four matrix
     combinations, theme-awareness note, and links to the showcase page.
   - `docs/Blueprints.md` — chooser-specific blueprint shape, validation
     behaviour, and value-shape inference from `multiple`.
   - **Inline documentation**: every public method on the chooser path
     (`_buildChooser`, `_getChooserValue`, `E.chooser`, page-roller's
     slideover open/save handlers) carries a JSDoc block describing
     parameters, return shape, and side effects.

8. **IDE intelligence**
   - `public/assets/ide/phpstorm/` — add chooser to the relevant
     code-intelligence file so JetBrains autocomplete recognises the type.

## 6 — Accessibility

- Wraps options in a `<fieldset>` with a `<legend>` (visually hidden by
  default; the field's label is still rendered alongside as the visible
  caption).
- `multiple: false` → wrapper `role="radiogroup"`; each option is
  `role="radio"` with `aria-checked` and roving `tabindex`.
- `multiple: true` → wrapper `role="group"`; each option is `role="checkbox"`
  with `aria-checked` and individual `tabindex="0"`.
- Keyboard:
  - Radio mode: Arrow keys move focus and select; Space/Enter confirm.
  - Checkbox mode: Tab between options; Space toggles.
  - Disabled options are skipped in both modes.
- Hidden native `<input type="radio">` (single) or `<input type="checkbox">`
  (multiple) siblings inside each option carry the value into native form
  submission, so the component degrades gracefully when JS is unavailable
  and is captured by `FormData` without custom serialisation.
- Tooltips render via `E.tooltip()` with `aria-describedby` linkage.
- Respects `prefers-reduced-motion` for the selected-state transition.

## 7 — Testing

- New file `src/forms.test.js` additions (or `src/chooser.test.js` if logic
  becomes substantial) covering:
  - All four matrix combinations render correctly.
  - `_getFieldValue()` returns string for single, array for multi.
  - `required` validation behaves correctly for both modes.
  - `disabled` options cannot be selected.
  - Keyboard navigation visits all enabled options and skips disabled ones.
  - Theme variables produce correct selected-state colours after a theme
    change (via `Domma.theme.set()`).
  - Round-trip with a model: setting model value updates the chooser; user
    selection updates the model.
- Manual test plan documented in the showcase page tutorial section.

## 8 — Out of scope

- Per-option image instead of icon. Re-evaluate after launch if requested.
- Per-option custom accent colour overriding the picker's primary tint.
- Replacing the existing `formFields` JSON textarea as the canonical store.
  The new slideover is a structured build helper that produces and consumes
  the JSON; the textarea stays.
- A structured slideover for non-chooser field types. Other field types
  (text, email, etc.) continue to use the JSON textarea directly.
- A web component wrapper (`<dm-chooser>`).
- Drag-to-reorder options at runtime in the rendered chooser (the slideover
  options editor handles authoring-time reorder).

## 9 — Implementation sequencing

Suggested sequence (detailed plan to follow in writing-plans):

1. **Element CSS** in `elements.css` (the visual foundation).
2. **Standalone `E.chooser()`** in `elements.js` with full JSDoc — the lowest
   layer, used by every consumer below.
3. **Forms input type** in `forms.js`: `case 'chooser'`, `_buildChooser`,
   `_getChooserValue`, validation, model binding, tests.
4. **Showcase page** (`public/showcase/elements/chooser/`) — validates the
   visual contract end-to-end and serves as the canonical reference.
5. **Showcase index card** + sitemap entry.
6. **Documentation** (`API.md`, `DommaDocumentation.md`, `Blueprints.md`)
   plus inline JSDoc throughout.
7. **Page-roller integration**:
   - Field-palette tile.
   - Slideover GUI (live preview, options editor, save back to JSON).
   - Edit-on-click for existing chooser fields.
   - Inline JSDoc for the new slideover lifecycle.
8. **IDE intelligence** file in `public/assets/ide/phpstorm/`.
9. **Final smoke pass**: run the showcase across every theme × variant,
   verify accessibility (keyboard, screen reader), verify CMS slideover
   round-trips JSON correctly, run all tests.

## 10 — Open questions

None blocking. Anything that arises during implementation should be raised
in a code review.
