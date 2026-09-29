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

# Lists Without the Boilerplate

**Binding expressions can now ask questions of a list.** Twelve array helpers ship built in - no
`M.registerHelper` needed - so "is it empty?", "how many are done?" and "only the open ones" no longer
each need a computed.

🧮 **Built-in array helpers** (domma-reactive 1.3.0)

*   `len`, `includes`, `some`, `every`, `count`, `where`, `sum`, `pluck`, `sortBy`, `first`, `last` and `join`, callable from any `data-bind-*`, `data-if`, `data-each` or `{{ }}` expression.
*   They take an `M.observable` or observable array directly (`len(todos)`), read observable fields on each row (`count(todos, 'done')`), and those reads are tracked - ticking one row re-runs the count.
*   `where` and `sortBy` return new arrays, so they can drive a list: `data-each="where(todos, 'done', false) key=id"`.
*   Keys may be dotted paths (`'meta.tag'`) and go through the same prototype guard as every other read. A helper you register under the same name still wins.

🔁 **domma-reactive 1.3.0**

*   Domma is now built against domma-reactive 1.3.0 - see [its release notes](https://github.com/pinpointzero73/domma-reactive/blob/v1.3.0/CHANGELOG.md).

<!-- website -->

<p>Built-in array helpers for binding expressions: <code>len</code>, <code>includes</code>, <code>count</code>, <code>where</code>, <code>sortBy</code> and more - no computed needed to ask whether a list is empty or how many rows are done.</p>
