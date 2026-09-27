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

# Addons That Join

**Input addons now join the field they belong to.** `formConfig.prefix` and `formConfig.suffix` used
to draw an absolutely placed box inside the input and pad the text 3.5rem to make room for it, so the
input kept its own border and anything wider than an icon - "kg", "https://" - ran over the text. An
addon and its field are now one Bootstrap-style group: one shared border, rounded outer corners only,
and each addon as wide as what it holds.

🧩 **Addons that join**

*   The focus ring goes round the whole group rather than the input alone, and the addon takes the
    focus and error colours along with the field.

*   Addon colours come from the theme tokens, so every theme, light or dark, draws them in its own
    colours. The dark-mode rule that used fixed greys is gone.

*   Forma now joins addons to selects and textareas as well as single-line inputs.

*   A string slot is shorthand for `{text}`: `formConfig: {prefix: '£', suffix: 'a year'}`.

🔗 **`E.inputGroup()` for inputs already on the page**

*   `E.inputGroup(selector, {prefix, suffix})` joins an icon or text to a hand-written input and
    writes exactly the markup Forma does, so both look and behave the same. `update()` changes or
    removes either addon, and `destroy()` puts the input back as it was.

*   Binding an input Forma has already wrapped reuses Forma's group, so it is also how to change a
    blueprint field's addons after the form is on screen.

*   Text is set as text, never parsed as HTML, and an icon must be a plain icon name.

📚 **Docs**

*   The Input Addons showcase page is rewritten, with a select, a textarea, units, the string
    shorthand, a live `E.inputGroup` demo and a short tutorial. An "Input groups" section is in the
    documentation, and the PHPStorm typings cover `E.inputGroup` and `formConfig.prefix` / `suffix`.

<!-- website -->

<p>Input addons now join the field they belong to: <code>formConfig.prefix</code> and <code>suffix</code> draw as one Bootstrap-style group with a shared border, sized to what they hold, in the theme's own colours - and they work on selects and textareas too.</p>
<p>New <code>E.inputGroup(selector, {prefix, suffix})</code> does the same for an input already on the page, with <code>update()</code> and <code>destroy()</code>.</p>

