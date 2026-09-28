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

# Faces and Fine Print

**Avatars** - `E.avatar()` draws a person as their picture, their initials or an icon, and
`E.avatarGroup()` stacks a team with a "+N" for the rest. Plus a small set of accessibility and text
utilities: screen-reader-only text, skip links, line clamping, whole-card links and a divider with a
word in it.

👤 **Avatar**

*   `E.avatar(target, {name, src, size, shape, status, ring})`. Initials come from the first and last
    word, one letter for a single name, the part before the @ of an email address, in any script.
    The name picks one of eight tints by a stable hash, so a person has the same colour on every page.

*   Every tint follows the theme on both sides - the hue mixed into the surface, the initials into the
    text - so the initials stay AA on all 39 themes (the weakest pair measures 5.2:1).

*   A picture that fails to load falls back to the initials. Five sizes (`xs` to `xl`), circle,
    rounded or square, a status dot (`online`, `away`, `busy`, `offline` - busy barred and offline
    hollow, so colour is not the only cue) and a ring.

*   Each avatar is named for screen readers - "Jane Smith (online)" - and the picture has an empty
    `alt`. `data-avatar="Jane Smith"` with `E.avatar.scan()` does it without script.

👥 **Avatar groups**

*   `E.avatarGroup(target, {people, max, size, overlap})` renders a list of overlapping avatars
    separated by a ring in the background colour, with a small lift on hover. Earlier avatars sit on
    top, so status dots stay in view.

*   Past `max`, a "+N" button names the hidden people for screen readers and opens a popover listing
    them - or calls your `onMore`. People with an `href` become links.

♿ **Accessibility and text utilities**

*   `.sr-only` (Bootstrap's `.visually-hidden` works too) keeps text for screen readers only;
    `.sr-only-focusable` shows it again on focus, and `.skip-link` is a ready-made skip link that
    appears top left when Tab reaches it. `.not-sr-only` undoes it.

*   `.line-clamp-1` to `.line-clamp-5` cut text after that many lines; `.line-clamp-none` undoes it.
    `.text-truncate` joins `.truncate`.

*   `.stretched-link` makes a whole card follow its main link, with the focus ring round the card.

*   `.divider-text` draws a rule either side of a word - "or" between two sign-in buttons.

*   The showcase layout keeps a page's skip link ahead of its navbar.

*   New showcase pages for Avatar and for the utilities, with a tutorial, and `docs/Avatar.md`.

<!-- website -->

<p><strong>Avatars.</strong> <code>E.avatar()</code> shows a person as their picture or their initials, in a colour that stays the same wherever their name appears and readable on every theme; <code>E.avatarGroup()</code> stacks a team with a "+N" that lists the rest.</p>
<p>Plus accessibility and text utilities: <code>.sr-only</code>, a ready-made <code>.skip-link</code>, <code>.line-clamp-*</code>, <code>.stretched-link</code> for whole-card links and <code>.divider-text</code>.</p>

