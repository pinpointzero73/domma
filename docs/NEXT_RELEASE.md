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

# One Clear Warning

**Domma Reactive 1.2.1: one cause, one message.** A binding inside an unkeyed `{{#each}}` used to add its own
warning telling you to move it out of the block, which read as "not supported" when a keyed block binds it today.

⚡ **Domma Reactive 1.2.1**

*   An unkeyed `{{#each}}` now gives a single warning that names every binding it dropped - `"data-model",
    "data-on-click"` - and says they bind once the block has `key=`. The advice to move them outside the block
    or wire them up by hand is gone.

*   Inside `{{#with}}`, where there is no key to add, the warning gives the fix that applies there: write the
    full path (`data-model="obj.field"`) without the block.

*   Dropped bindings are still reported when `warnUnkeyed: false` switches the key advice off.

<!-- website -->

<p><strong>One clear warning.</strong> Domma Reactive 1.2.1 names every binding an unkeyed list dropped in a single message, and points at <code>key=</code> - the fix that makes them bind.</p>

