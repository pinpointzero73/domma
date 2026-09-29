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

# Quiet Card Highlights

**Cards respond to hover without jumping.** The card hover utility now highlights the outline in the active theme's primary colour. Domma CMS cards and boxes use the same treatment by default; colour-tinted boxes highlight in their own theme colour.

🎨 **Theme-aware card hover**

*   `.card-hover` no longer lifts and enlarges its shadow on hover; it highlights the border and outline using `--dm-primary`.
*   Domma CMS shortcode cards and boxes now use the theme-colour outline by default. Tinted boxes use their selected theme tone, and `hover="off"` still disables the effect.

<!-- website -->

<p>Cards and boxes respond to hover with a subtle outline in the active theme colour instead of lifting off the page.</p>
