<!--
The next release's notes. Write them here as the work lands.

"Cut a release" (Actions tab) moves them into docs/RELEASE_NOTES.md and
public/data/releases.json, stamped with the version and date, and resets this
file. It refuses to run while the title or either section is empty.

  - The line starting "# " is the release title, e.g. "# Readers That Hear Every Change".
  - Between the title and the website marker: the notes, in RELEASE_NOTES.md
    style - a bold lead paragraph, then emoji-headed groups of bullets.
  - After the website marker: the short HTML summary for releases.json -
    one or two <p> elements.

This comment is instructions only and is never copied.
-->

# Fields That Help

**Four interactive extras for input groups** - a show / hide password button, a clear button, a
number stepper and a character counter, joined to the field in the same style as the addons from
0.46.0. They are real buttons, clickable and in the tab order, and take the same keys in a blueprint's
`formConfig` and in `E.inputGroup()`: `reveal`, `clear`, `stepper` and `counter`.

👁️ **Show / hide password**

*   `reveal: true` on a password field adds an eye button that switches it between hidden and plain
    text. It is a toggle button (`aria-pressed`) and the icon swaps between `eye` and `eye-off`;
    clicking it leaves the caret in the field.

❌ **Clear button**

*   `clear: true` adds an &times; that appears only while the field has a value. It empties the field,
    fires `input` and `change` - so a Forma model and your own listeners see the change - and puts the
    focus back in the field. It works beside an icon prefix, and the field's corner stays rounded
    while the button is hidden.

➕ **Number stepper**

*   `stepper: true` puts &minus; and + either side of a number field. They step by `step`, stop at
    `min` and `max` with the button at a limit disabled, fire `input` and `change` on each step, and
    repeat while held. The browser's own spinner is hidden. A blueprint field's `step` now reaches the
    input as its `step` attribute.

🔢 **Character counter**

*   `counter: true` shows "12 / 200" under a text field or textarea, using its `maxLength`;
    `counter: 280` sets the limit itself. It updates as you type, is announced politely to screen
    readers and linked with `aria-describedby`, and turns amber from 90% of the limit and red past it.

🔗 **One API, two ways in**

*   `E.inputGroup('#pw', {reveal: true})`, `{clear: true}`, `{stepper: true}`, `{counter: 200}` on an
    input already on the page; the same keys in `formConfig` for a blueprint field. An extra the
    control cannot take is skipped, and `labels` renames the buttons.

*   `E.inputGroup` gains `refresh()` (after setting a value from code), `step(dir)` and `extras`, and
    `update()` adds or removes extras. Binding only extras to a group Forma rendered leaves its addons
    alone.

*   `destroy()` removes every extra and listener; Forma binds the extras after render and tears them
    down on a re-render or the new `form.destroy()`.

<!-- website -->

<p>Four interactive extras for input groups: a show / hide password button, a clear button, a number
stepper that honours min, max and step, and a live character counter - joined to the field like an
addon, keyboard reachable and screen-reader friendly.</p>
<p>The same keys work in a blueprint's <code>formConfig</code> and in <code>E.inputGroup()</code>:
<code>reveal</code>, <code>clear</code>, <code>stepper</code> and <code>counter</code>.</p>

