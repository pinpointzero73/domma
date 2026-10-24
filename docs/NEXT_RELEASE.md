# 

<!-- website -->


### i18n

*   New `Domma.i18n` module, with `Domma.t(key, params)` as the shortcut: messages as nested JSON
    (flattened to dot keys, merged on `add()`), `load()` from a URL via `H.get` or a loader (cached,
    concurrent loads shared), a fallback chain (`fr-CA` -> `fr` -> fallbacks).
*   Plurals and select as objects of forms (`{one, few, many, other, '=0'}`, `{select: 'gender', ...}`)
    chosen by `Intl.PluralRules`, ordinals included. No ICU parser to ship.
*   `t()` returns plain text; `html()` keeps the message's markup and escapes every param. Messages
    are never evaluated.
*   `number()`, `currency()`, `date()` (Date, timestamp, string or `D()`), `relative()` and `list()`
    over cached `Intl` formatters in the current locale.
*   `translate(root)` fills `data-i18n`, `data-i18n-html` (sanitised) and `data-i18n-attr`, with
    `data-i18n-params`; changing locale sets `<html lang dir>` (rtl for Arabic, Hebrew, Persian,
    Urdu...) and re-translates the page. `detect()` picks a locale from storage, the browser or
    `<html lang>` and can remember it with `S`.
*   Missing keys return the key (or `default`), fire `missing` and an `onMissing` hook, and warn once;
    `window.DommaOptions = {i18nWarnings: false}` silences them. Events `change`, `missing`, `loaded`
    via `i18n.on()` and as `dm:i18n:*` on document.
*   Types in `assets/types/i18n.d.ts`; guide in `docs/I18n.md`; showcase page `showcase/i18n/`.
### Focus trap

`E.focusTrap(container, options)` keeps Tab, Shift+Tab and stray focus inside one or more containers while it is
active. Tabbables are found live (shadow roots included), a container with nothing tabbable takes focus itself, and
traps stack - opening a second pauses the first, closing it hands focus back. Options for initial and returned focus,
Escape, outside clicks and `inert` on the rest of the page. Also importable on its own from
`src/components/focus-trap.js` for other components.

### Command palette

`E.commandPalette(options)` is a Cmd/Ctrl+K launcher: fuzzy search with highlighted matches, groups, recent commands
(remembered with `S`), shortcut hints, nested pages (arrays or async), and an async `source` that is debounced and
abortable with loading, empty and error states. Full keyboard support, the ARIA combobox + listbox pattern, a focus
trap, theme tokens, reduced motion and a full-width panel on phones.
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
