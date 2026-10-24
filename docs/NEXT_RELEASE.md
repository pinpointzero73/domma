# New components: dropzone, range slider, command palette, focus trap, split pane, virtual list and translations

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
### Dropzone

`E.dropzone(target, options)` turns an element into a place to drop, browse for or paste files. A real
`<input type="file">` (yours, or one it adds) carries them, so inside a `<form>` the files submit with it - the
input's file list is kept in step with what the area shows. Rules: `accept`, `maxSize`, `minSize`, `maxFiles` and
a cancelable `onBeforeAdd`; refusals fire `reject(entry, 'type' | 'size' | 'count')` and are announced to screen
readers. Images get thumbnails. With `upload: {url, field, headers, data, concurrency}` each file is sent on its own
with a progress bar, automatic `retry`, a Retry button and `cancel()`. A file dropped just outside the area no
longer navigates away from the page while a drag is under way. `F.create` takes `type: 'dropzone'`.

```javascript
E.dropzone('#attachments', {accept: 'image/*,.pdf', maxSize: 5 * 1024 * 1024, maxFiles: 4});
```

### Range slider

`E.rangeSlider(target, options)` (alias `E.slider`) - one value or a `[low, high]` range between two thumbs, with
ticks, labelled marks, a tooltip, vertical orientation and right-to-left support. Full keyboard (arrows, Page Up /
Page Down, Home / End), ARIA sliders with `aria-valuetext` from the `labels` formatter, and pointer dragging with a
touch-sized hit area. Real `<input type="range">` elements carry the value and fire native `input` / `change`, so
forms, `FormData` and model bindings see it. `F.create` takes `type: 'slider'`.

```javascript
E.rangeSlider('#price', {range: true, min: 0, max: 1000, step: 10, value: [100, 600], labels: v => '£' + v});
```

<!-- website -->

<p>Seven new pieces built to the 0.55 conventions: a dropzone with upload progress, a single or two-thumb range slider (both also as form blueprint fields), a Cmd/Ctrl+K command palette, a focus trap, resizable split panes, a virtual list that scrolls 100,000 rows with infinite loading, and <code>Domma.i18n</code> translations with plurals, Intl formatting and right-to-left support.</p>
