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

# Lists That Make Room

**`E.sortable(selector, options)` is drag-to-reorder for the children of one container**, by mouse,
pen, touch and keyboard. Bind it once to the container: items rendered later are sortable without a
refresh, and every item is identified by a key (`data-id` by default), so an order can be reported,
saved and put back.

↕️ **Two modes**

*   **Live** (the default): the other items slide out of the way while you drag, and the component
    moves the element itself. `onSort` reports `{item, from, to, order, previous}`. `axis: 'x'` sorts
    a row instead of a column.

*   **Indicator** (`nest: true`, or `live: false`): nothing moves until the drop. A marker shows
    where the item would land - before, after, or with `nest` into another item - and `onDrop`
    hands you `{key, targetKey, zone}` to update your data and re-render. The component then
    animates the re-render: every item is matched by its key and glides from where it was to where
    it now is, so a full redraw of a tree still reads as one movement. Return `false` to refuse a
    drop, or a promise to wait for the server first.

*   `accepts(item, target, zone)` vetoes a drop - a node dropped into its own subtree, say. A
    refused "into" falls back to the nearer edge before giving up.

📌 **An order that sticks**

*   `persist: 'tasks'` saves the keys through Domma storage (`sortable:tasks`) after every move
    and restores them when the component is created. Items added since keep their place.
    `forget()` drops the saved order; `sort(keys)` and `restore()` put one on screen.

*   `animate(mutate)` is useful on its own: wrap any change to a keyed list - a filter, a column
    sort, an insert - and it glides instead of jumping.

⌨️ **Keyboard, touch and motion**

*   Alt+Arrow moves the focused item one place, and each move is announced to screen readers.
    Esc cancels a drag, and in live mode everything slides back.

*   On touch a handle drags at once. An item with no handle needs a short press-and-hold
    (`touchDelay`, 220 ms), so a list full of draggable items can still be scrolled with a finger.

*   Pointer events rather than the HTML5 drag-and-drop API, which cannot animate its neighbours,
    draws its own ghost and does not exist on touch screens at all.

*   `prefers-reduced-motion` skips every glide. The ghost, the empty slot and the drop marker are
    themed through `--dm-sortable-*` custom properties with theme tokens as their fallbacks.

🧭 **Where it is already used**

*   The Domma CMS menu editor now uses `E.sortable()` for reordering and nesting menu items.

*   Docs in `docs/Sortable.md`, and a showcase page with a tutorial and four live demos: a list
    that remembers its order, a horizontal row, a tree that re-renders from data, and a list
    dragged by its handles.

<!-- website -->

<p><strong><code>E.sortable(selector, options)</code> is drag-to-reorder for the children of one container</strong>, by mouse, touch and keyboard. In live mode the other items slide out of the way while you drag; with <code>nest: true</code> nothing moves until the drop, a marker shows whether the item lands before, after or into another, and <code>onDrop</code> hands you the move to update your data and re-render - which the component then animates, matching every item by its key. That is what makes it suit trees, and the Domma CMS menu editor now uses it.</p><p><strong>An order that sticks.</strong> <code>persist</code> remembers the order through Domma storage and puts it back on the next visit. Alt+Arrow moves the focused item, Esc cancels a drag, a handle drags at once on touch while a whole item needs a short press-and-hold so the list still scrolls, and reduced motion skips every glide.</p>

