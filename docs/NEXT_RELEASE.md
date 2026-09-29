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

# Subtle Card Hover

**Cards and boxes now change only their border colour on hover.** The border transitions smoothly from its existing colour to the active theme colour, without an outline or lift.

🎨 **Subtle theme-aware card hover**

*   `.card-hover` transitions only its border to `--dm-primary` on hover.
*   Domma CMS shortcode cards and boxes use the same treatment by default; tinted boxes transition to their selected theme tone, and `hover="off"` still disables the effect.

<!-- website -->
<p>Cards and boxes change only their border colour on hover, transitioning smoothly from their existing colour to the active theme colour.</p>
