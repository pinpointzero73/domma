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

# Readable Everywhere

**A contrast sweep across the library and the whole Domma site.** Buttons, heroes, footers, toggles and
range sliders now take their colours from the theme's own text tokens, so text stays readable on every theme,
light and dark.

🎨 **Library CSS**

*   Primary, secondary and success buttons, active toggles and editor toolbar buttons use
    `--dm-primary-text` / `--dm-secondary-text` / `--dm-success-text`, falling back to white.

*   `.hero-dark`, `.hero-primary` and `.footer-dark` get fixed readable pairs; `.bg-dark`, `.bg-*-light`,
    sidebar and chooser colours are corrected in `elements.css`.

*   Switches, range tracks and the theme toggle use `--dm-border` and surface tokens instead of fixed greys, so
    they show in dark mode. New token `--dm-secondary-dark`.

🌐 **Site**

*   Every page stylesheet and mini-app theme moved to semantic tokens; inline colours fixed.

*   New `npm run sweep:site` check (part of `npm run validate`): 173 pages and 83 stylesheets, 0 issues.
    Theme contrast risks are down from 11 to 0.

<!-- website -->

<p><strong>Readable everywhere.</strong> A contrast sweep moves buttons, heroes, footers and form controls onto the theme's own text colours, so text stays readable on every theme, light and dark.</p>
