# Deprecated APIs removed

### Removed (breaking)

Everything 0.55 marked as deprecated is gone. Domma CMS 1.10.14 (with Docs 2.14.1) and Docs Pro 0.11.2 no longer use them; update those before this release.

| Removed | Use instead |
|---|---|
| Modal's unprefixed `open` / `close` DOM events on `modal.element` | `modal.on('close', fn)` / `modal.once('close', fn)`, or the bubbling `dm:modal:close` (detail `{instance, args}`) |
| Popover's `popover:show` / `shown` / `hide` / `hidden` DOM events | `pop.on('shown', fn)`, or bubbling, cancelable `dm:popover:<name>`; `e.detail.instance` replaces `e.detail.popover` |
| Sortable's `sortable:start` / `move` / `sort` / `drop` / `cancel` / `end` DOM events | `.on('sort', fn)`, or `dm:sortable:<name>`; the old detail is `e.detail.args[0]` |
| Using `E.tooltip()`, `E.buttonGroup()` or `E.listGroup()` as an array (`[i]`, `length`, `forEach`, `map`, iteration) | `.all()` on the result, or `E.tooltip.all(sel)` / `E.buttonGroup.all(sel)` / `E.listGroup.all(sel)` |
| `E.buttonGroup()` / `E.listGroup()` returning `[]` when nothing matches | They return `null`, like `E.tooltip()`; `.all(sel)` still returns `[]` |
| `E.timeline(selector, options)` | `E.progression(selector, {mode: 'timeline', ...options})` |
| `Domma.theme.setVariant()`, `toggle()`, `listVariants()` | `Domma.theme.set('ocean-dark')`, `listThemes()` / `listBases()` |
| ThemeRoller `loadPreset()` | `Domma.theme.set(name)` |

`show()` / `hide()` / `isVisible()` stay as permanent aliases of `open()` / `close()` / `isOpen()`. `window.DommaOptions.deprecationWarnings` is still read, for future deprecations.

<!-- website -->

<p>The APIs deprecated in 0.55 are removed: the modal's, popover's and sortable's old unprefixed events, the array shape of <code>E.tooltip</code>, <code>E.buttonGroup</code> and <code>E.listGroup</code>, <code>E.timeline()</code> and the old theme variant methods. Each has a direct replacement listed in the release notes.</p>
