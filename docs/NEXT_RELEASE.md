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

# Skeletons and Access

**Skeleton loaders** - shimmering placeholders shaped like the content on its way, so a page keeps its
layout while data loads. Plain CSS shapes for hand-written HTML, `E.skeleton()` to write them into a
container, and `E.skeleton.while()` to show them until a promise settles.

🦴 **Shapes in plain CSS**

*   `.skeleton` plus a shape: `.skeleton-text` (with `.skeleton-lines` the last line runs short),
    `.skeleton-heading`, `.skeleton-circle` / `.skeleton-avatar` (`-sm`, `-lg`, `-xl`),
    `.skeleton-image` / `.skeleton-rect` (16:9, or `.skeleton-ratio-*`) and `.skeleton-button`.
    Composites match the real components' sizes: `.skeleton-card`, `.skeleton-list-item` and
    `.skeleton-table` rows.

*   The tint is the theme's text colour mixed into its surface, so it is a quiet grey on light themes
    and a slight lift on dark ones, and a soft band sweeps across. `prefers-reduced-motion` keeps the
    tint and drops the sweep. `--dm-skeleton-bg`, `--dm-skeleton-shine` and `--dm-skeleton-duration`
    override it.

⏳ **E.skeleton() and E.skeleton.while()**

*   `E.skeleton(target, {type, lines, count, rows, columns, avatar, image, animate})` fills a container
    with `'text'`, `'card'`, `'list'`, `'table'` or `'custom'` placeholders, marks it `aria-busy` with a
    polite "Loading..." status and returns `{remove(), replace(content)}`. `remove()` puts back the very
    same nodes, listeners and all.

*   `await E.skeleton.while('#posts', H.get('/api/posts'), {type: 'card', count: 3})` shows the skeleton
    until the promise settles and resolves with its value; if it rejects, the skeleton goes and the
    error is rethrown.

*   `data-skeleton="card"` with `data-skeleton-*` options and `E.skeleton.scan()` for markup-first pages;
    `skeleton` is also a config-engine component.

📊 **DataTable loading rows**

*   `T.create(sel, {columns, loadingSkeleton: true})` shows skeleton rows under the real header until the
    first `setData()`, and `table.setLoading(true)` brings them back for a reload.

♿ **Accessibility and contrast sweep**

*   Modal, Tabs, Accordion, Toast and Table now add their own ARIA roles and states and keyboard
    navigation, and the CSS styles the ARIA disabled, selected, invalid and current states.

*   A 38-theme contrast sweep (`npm run sweep:themes`) found and fixed 31 contrast failures: the
    admin themes' success fill, the sharp finish's muted text and the dark finishes' focus rings,
    Charcoal Dark's focus border, and text on cyan via new intent text tokens.

<!-- website -->

<p><strong>Skeleton loaders.</strong> Shimmering, theme-aware placeholders shaped like the content on its way: CSS shapes for plain HTML, <code>E.skeleton()</code> for text, card, list and table layouts, <code>E.skeleton.while()</code> to show one until a promise settles, and <code>loadingSkeleton</code> rows for the DataTable.</p>
<p>Plus an accessibility sweep: Modal, Tabs, Accordion, Toast and Table add their own ARIA roles and
keyboard support, and 31 theme contrast failures are fixed.</p>
