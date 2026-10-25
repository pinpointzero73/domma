# Fixes: range slider reset, wizard Previous, table rows in .html(), focus trap layers

### Fixed

- **Range slider and form reset.** Inputs the slider creates (a container target, or the second thumb), and a caller's input without a `value` attribute, now get the starting value as their `value` attribute, so a form reset puts the slider back where it started instead of the midpoint. `destroy()` gives the caller's input back its own attribute.
- **`F.wizard` Previous keeps what was typed.** Leaving a step by Previous, `prevStep()`, `nextStep()` or `goToStep()` saves that step's values first (without validating), so coming back shows them and `getStepData()` includes them.
- **`.html()` into a table part.** Rows written into a `<tbody>`, `<thead>`, `<tfoot>` or `<table>`, and cells into a `<tr>`, are no longer dropped by DOMPurify, which parses as if into `<body>`. They are sanitised in their table context, with the same rules as before.
- **Focus trap `allowOutsideFocus: 'layers'`.** A `position: fixed` element that was already on the page and stacks below the trap (a fixed site header under a modal) is now page, not a floating layer, so focus can no longer leave an overlay for it. Toasts, popovers and anything opened after the trap still count as layers. New helper: `stackLevel(el)`.

### Changed

- **Kickstart types.** The MPA kickstart (CLI `init` and `add-ai`, and the browser builder's AI files) now ships `frontend/types/` copied from the declarations generated from the source (`assets/types`), replacing a hand-kept copy that had drifted. `build:types` runs before `build:kickstart-files`.

<!-- website -->

<p>Four fixes: a range slider returns to its starting value on form reset, a wizard keeps what was typed when you go back a step, <code>.html()</code> keeps table rows written into a table body, and an overlay's focus trap no longer treats a fixed page header as a floating layer. Kickstart projects now get the generated TypeScript declarations.</p>
