# Form Builder Sweep - Findings & Recommendations

**Date:** 2026-05-09
**Scope:** Page-roller form section, chooser slideover, `Domma.forms.*` (Forma class + helpers), forms showcase, chooser showcase.
**Verdict:** Chooser core is solid. The surrounding **Form Builder experience has real gaps** - three blocker-class issues, several major gaps, and a list of polish items. Current state is "wired up and working in the happy path"; not yet "professional and complete".

---

## 1 - Blocker-class issues (fix before shipping the Form Builder as production)

### 1.1 - Page-roller form section is not a real form

**File:** `src/page-roller.js:302-362` (`SECTION_REGISTRY.form.template`)

The form section's `template()` builds **raw static HTML** - not a Forma instance. Consequences:

- The preview does **not validate** when the user clicks the rendered Submit button.
- It does **not bind** to a model.
- It does **not use** Forma's input pipeline (`.domma-form-field`, helper text, hints, error containers).
- Form authors building a form in the page-roller see a preview that **does not match what `F.create()` produces** at runtime. The contract is broken.

**Recommendation:** Replace the static HTML generator with a real Forma render. Either:
- (a) Convert the field array into a Forma blueprint at template-time and call `Forma(blueprint).render()`, or
- (b) Render a placeholder (`<form data-form-section="<id>">…</form>`) and hydrate it in `_renderCanvasSections` with `Forma(blueprint).renderTo(...)` - same pattern as the chooser hydration.

(b) is the cleanest because the canvas already has a hydration step.

### 1.2 - XSS via untrusted strings in form section template

**File:** `src/page-roller.js:307-345`

Direct interpolation of `${field.label}`, `${field.placeholder}`, `${config.title}`, `${config.description}`, `${config.submitText}`, `${field.name}` into HTML. Anyone editing the JSON can inject `<script>` and have it execute when the canvas re-renders.

**Recommendation:** Escape every interpolated string via `this._escapeHtml(...)`. The helper already exists on the page-roller class (used by `_renderEditorField`). Should be a 5-minute change but high-priority.

### 1.3 - XSS in `forms.js` builders

**File:** `src/forms.js:286-296` (label) and `:213-214` (section title) and `:189-192` (button text)

`${label}`, `${section.title}`, `${hint}`, `${submitText}`, `${resetText}` are interpolated raw. Tooltip strings are correctly escaped via `this.utils.escapeHtml(tooltip)` - same treatment is needed everywhere else.

**Recommendation:** Apply `this.utils.escapeHtml(...)` to every label/title/hint/button-text interpolation in `_buildField`, `_buildSection`, `_buildForm`, and the modal/wizard helpers. Audit every `${…}` in template strings and escape unless the value is a controlled HTML chunk (like `requiredMark`).

---

## 2 - Major gaps (functional shortcomings)

### 2.1 - Form section preview only handles 3 field types

**File:** `src/page-roller.js:307-345`

The fall-through default returns `<input type="${field.type}">` for any non-textarea, non-chooser field. So:
- `field.type: 'select'` → `<input type="select">` (invalid HTML, browser falls back to `text`)
- `field.type: 'radio'` → `<input type="radio">` but with no group structure or options
- `field.type: 'checkbox-group'` → invalid
- `field.type: 'date'`, `'email'`, `'number'` → these accidentally work because they're valid `<input type>` values

**Recommendation:** Once 1.1 is fixed (use Forma to render the form section), this disappears - Forma handles every field type correctly. Until then, at least handle `select`, `radio`, `checkbox-group`, `date`, `email`, `number`, `tel`, `url` explicitly.

### 2.2 - Slideover has no header / no visible title / no close button

**File:** `src/page-roller.js:3334-3343` (`_openChooserSlideover`)

`Domma.elements.slideover(slideoverHost, { title: 'Add Chooser', … })` - the `title` option is silently ignored when you instantiate Slideover directly on an existing element. The `title` only renders when using the static `Slideover.create({title, content})` factory, which builds the `.dm-slideover-header` markup with title and `.dm-slideover-close` button.

Currently the chooser slideover:
- Has no visible title
- Has no × close button (only Cancel/Save, plus Escape key)
- The "Edit Chooser" vs "Add Chooser" distinction never reaches the user's eye

**Recommendation:** Switch to `Domma.elements.slideover({ title: 'Add Chooser', content: bodyEl, position: 'right', size: '520px' })` factory mode. The factory will build the header and close button, and accept the body element via `content`.

### 2.3 - No GUI for non-chooser fields in the formFields editor

**File:** `src/page-roller.js:1810-1825` (`case 'formFields'`)

The "Add Chooser" tile is a single button. Adding any other field type still requires hand-editing the JSON textarea. For a "Form Builder" the palette should also include "Add Text", "Add Email", "Add Select", "Add Textarea", etc.

**Recommendation:** Generalise the palette into a row of tiles (Text / Email / Number / Date / Textarea / Select / Radio / Checkbox-group / Chooser / Signature / File). Clicking a non-chooser tile inserts a default JSON snippet directly (no slideover needed). Clicking Chooser opens the existing slideover. This restores the "drag/drop from a palette" pattern.

### 2.4 - No visual list of existing fields

**File:** `src/page-roller.js:1810-1825`

After fields are added, the only representation is the JSON textarea. There's no inline summary like:

```
Fields:
  ⋮ name (text, required) - edit | delete
  ⋮ email (email, required) - edit | delete
  ⋮ plan (chooser, card, single) - edit | delete
  + Add field…
```

…even though that pattern exists for sections in the canvas.

**Recommendation:** Render a sortable list of field summaries above (or instead of) the JSON textarea, with edit/delete/reorder controls. Keep the JSON textarea as an "advanced" toggle. This is the UI most users would expect for a form builder.

### 2.5 - Default field name collides

**File:** `src/page-roller.js:3308`

A new chooser starts with `name: 'choice'`. Two choosers added in succession both end up named `choice`, which silently overwrites in the data model.

**Recommendation:** When opening the slideover for a NEW chooser, scan existing field names and append a numeric suffix (`choice-2`, `choice-3`).

### 2.6 - No validation in the slideover

**File:** `src/page-roller.js:3408` (Save handler)

Save accepts:
- Empty `name`
- Empty `label`
- Empty `options` array
- Duplicate option values
- `value` containing characters that won't survive form serialisation

**Recommendation:** Before save:
- Require non-empty `name` and `label`
- Require ≥ 1 option
- Detect duplicate option values and refuse with a toast
- Optionally warn on unusual characters in `name` (suggest the slug)

---

## 3 - Polish & UX

### 3.1 - Confirm-on-cancel when there are unsaved edits

Currently Escape or Cancel discards everything silently. If `state` differs from `initial`, prompt before closing.

### 3.2 - Slideover removes host immediately after `close()`

**File:** `src/page-roller.js:3403-3406`

```js
slideover.close();    // 300ms animation
slideoverHost.remove();  // immediate - kills the animation
```

**Recommendation:** Wait for `onClosed` callback (Slideover supports it) before removing the host:
```js
const slideover = Domma.elements.slideover({
    onClosed: () => slideoverHost.remove()
});
```

### 3.3 - Both `input` and `change` bound on every input

**File:** `src/page-roller.js:3396-3397`

For text inputs this fires twice per keystroke (input on type, change on blur). Wasted CPU; preview re-renders twice unnecessarily.

**Recommendation:** Bind only `input` for text/number, only `change` for select/checkbox.

### 3.4 - Options can't be reordered

The slideover lets users add/remove/edit options but not reorder them. For a "professional" feel, drag-handles or up/down arrows on each option row.

### 3.5 - No Field-level affordance shown when editing

When opening "Edit Chooser" for an existing field, the user can't tell at a glance which field they're editing among many.

**Recommendation:** Add a small subtitle under the slideover heading: `Editing field: plan`.

### 3.6 - Visual options input is text - no colour picker

**File:** `src/page-roller.js:3370-3382` (visual section)

`accent` and `glowColour` are text inputs accepting either a semantic name OR a hex. A hybrid input with a colour-picker button next to a free-text field would be friendlier - and would close the gap with users who don't know hex codes.

### 3.7 - `_markDirty?.()` and `_refreshPreview?.()` use optional chaining

**File:** `src/page-roller.js:3420-3421`

Both methods exist on the class (verified). Optional chaining is defensive but gives a false impression they might be missing. Remove the `?.`.

---

## 4 - What works well (don't break)

- Chooser core implementation - clean DOM construction, CSS-variable theming, four matrix combos all working.
- 51/51 chooser tests passing.
- The chooser hydration pattern (`[data-chooser-field]` placeholder + canvas hydrator) is clean and reusable for other rich field types.
- Modal / Wizard / CRUD all route through `Forma._bindEvents` so chooser fields hydrate automatically - confirmed via code reading.
- The `chooser` showcase page is comprehensive (matrix + density + columns + per-option flags + visual options + theme switcher + accessibility + form integration + standalone + tutorial).
- The forms showcase now has a dedicated Chooser section with three live demos and a field reference table.

---

## 5 - Suggested order of operations

Roughly priority-ordered. Each item is self-contained and small enough to land independently.

| # | Task | Effort | Risk | Why |
|---|---|---|---|---|
| **1** | Escape every interpolated string in `page-roller.js:307-345` (1.2) | 15 min | Low | XSS - security |
| **2** | Escape labels/titles/hints/buttons in `forms.js` (1.3) | 30 min | Low | XSS - security |
| **3** | Switch chooser slideover to `Slideover.create({title, content})` factory (2.2) | 30 min | Low | Visible title + close button |
| **4** | Wait for `onClosed` before removing slideover host (3.2) | 5 min | Low | Animation polish |
| **5** | Bind handlers correctly per input type (3.3) | 10 min | Low | Tidy |
| **6** | Auto-suffix duplicate field names (2.5) | 10 min | Low | Common bug |
| **7** | Validate before save (2.6) | 30 min | Low | Quality |
| **8** | Render a visual list of existing fields with edit/delete/reorder (2.4) | 2-3 hrs | Med | Major UX upgrade |
| **9** | Generalise palette to all field types (2.3) | 1-2 hrs | Low | Removes "chooser is special" exception |
| **10** | Convert form section preview to use Forma (1.1, 2.1) | 2-3 hrs | **Med-High** | Restores promise/preview parity; needed for true Form Builder |
| **11** | Slideover polish: confirm-on-cancel, edit-field subtitle, colour picker hybrid (3.1, 3.5, 3.6) | 1 hr | Low | Final polish |
| **12** | Reorderable options (3.4) | 1 hr | Low | Nice-to-have |

**Aim:** Items 1-7 cleared in one session brings us to "professional and works". Items 8-10 are the real upgrade that turns the page-roller form section into a *Form Builder* worth the name. 11-12 are final polish.

---

## 6 - Open questions

- Should the form section's runtime output (the user's published page) use Forma at runtime, or stay as static HTML? My recommendation: render via Forma in the **preview**, but also output Forma-compatible HTML in the published export so consumers can `F.create(blueprint)` if they want a live form, or use the static HTML if they're posting to an external endpoint.
- Should the "Add Field" palette be drag-and-drop or click-to-insert? Both work; click-to-insert is lower-friction but DnD is more visual. Suggest click-to-insert with cursor-position awareness (insert before/after the focused field summary).
