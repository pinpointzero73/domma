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

# Menus You Can See Your Way Through

**Context-menu items now highlight on hover in every theme.** The wash was painted with
`--dm-background-alt`, which is identical to the menu surface in every dark theme and one shade off
white in the light ones, so pointing at an item showed nothing.

🖱️ **Context menu**

*   The hover wash is now mixed from the theme's text colour, the one value every theme guarantees
    contrasts with the surface.

*   An item that opens a submenu keeps its highlight while that submenu is open, so the path through
    a nested menu stays visible. An `accent` tints it the same way it tints the hover.

*   Set `--dm-ctx-hover` to choose the wash yourself.

*   Nothing to change when upgrading.

<!-- website -->

<p><strong>Context-menu items now highlight on hover in every theme.</strong> The old wash matched the menu surface in every dark theme, so it was invisible; it is now mixed from the theme's text colour, a submenu's parent stays highlighted while the submenu is open, and <code>--dm-ctx-hover</code> overrides it.</p>

