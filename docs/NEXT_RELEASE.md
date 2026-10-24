# 

<!-- website -->

### Split Pane

`E.splitPane(container, options)` makes resizable panes out of a container's children, with draggable,
focusable `role="separator"` gutters between them. Side by side or stacked, 2 or more panes, nests.
Min/max sizes in px or %, `snapOffset`, collapsible panes (double-click, a gutter button, Enter, or
`collapse(i)` / `expand(i)`), sizes remembered with `persistKey`, RTL, and iframes in panes cannot swallow a
drag. Events: `beforedrag` (cancelable), `dragstart`, `drag`, `dragend`, `resize`, `collapse`, `expand`.
Showcase: `showcase/elements/split-pane/`.

### Virtual List

`E.virtualList(container, options)` renders only the visible rows of a long list in a scrolling container -
100,000 fixed-height rows keep about fifteen rows in the page. Fixed `itemHeight` or `'auto'` with measured,
cached heights and a stable scroll position; `keyField` re-uses rows; `prepend()` keeps your place;
`scrollToIndex(i, {align})`. Infinite loading with `loadMore()` (one load at a time, loading / end / error rows,
retry). Roving-tabindex keyboard navigation (arrows, Page Up/Down, Home/End, Enter) that never loses the
focused row. Strings from `render()` are sanitised unless `safe: false`. Events: `render`, `scroll`,
`loadmore`, `loaded`, `end`, `error`, `itemclick`. Showcase: `showcase/elements/virtual-list/`.
