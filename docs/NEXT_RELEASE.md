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

# Sidebars That Wear The Theme

**Every left-hand menu now takes its colours from the active theme.** The site's page, admin and
miniapp sidebars were switched between `.sidebar-light` and `.sidebar-dark`, which paint with
`--dm-white` and `--dm-gray-900` - colours no theme redefines - so every dark theme got the same
generic grey panel and the themes' own `--dm-sidebar-*` tokens went unused.

🧭 **A `theme` sidebar variant**

*   `E.sidebar(sel, {variant: 'theme'})` follows the active theme, light or dark, with no JavaScript
    on a theme change. `'light'` and `'dark'` are unchanged, and `'dark'` stays the default.

*   Every part of the sidebar - header, title, toggle, links, headings, dividers and footer - now
    reads `--dm-sidebar-bg`, `--dm-sidebar-text` and `--dm-sidebar-border`, plus two new optional
    tokens, `--dm-sidebar-text-muted` and `--dm-sidebar-header-bg`. Each falls back to the value it
    used before, so a theme that sets none of them looks as it did.

*   The showcase, CMS, admin, address-lookup and docs sidebars all use it.

🎨 **Themes**

*   The Admin themes' dark sidebar now has light-on-dark hover and active washes, and a muted text
    colour that reads on it, instead of the page's own dark-on-light ones.

*   `sunset-dark` never defined `--dm-selected-bg`, so it inherited the light default: pale blue
    behind light text in selected table rows, dropdown items and sidebar links. It is now a
    terracotta wash.

*   `grayve-dark`'s sidebar active item is a translucent teal rather than the solid selection colour,
    which light text could not be read against.

*   Four of the five sidebar contrast failures the validator carried are gone.

🆕 **What's New**

*   The What's New pill pulsed forever: the changelog stored the version it had shown through
    `S.set()`, which serialises it, and the navbar compared that against a raw `localStorage` read.
    Both now go through `S`, and cutting a release keeps `latestVersion` in `releases.json` current.

<!-- website -->

<p><strong>Every left-hand menu now takes its colours from the active theme.</strong> A new <code>theme</code> sidebar variant follows the theme's <code>--dm-sidebar-*</code> tokens, light or dark, and the showcase, admin and miniapp sidebars all use it.</p>
<p>The Admin themes' dark sidebars get washes that show, <code>sunset-dark</code> and <code>grayve-dark</code> selections are readable again, and the What's New pill stops pulsing once you have seen the latest release.</p>
