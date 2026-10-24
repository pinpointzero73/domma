# 

<!-- website -->


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
