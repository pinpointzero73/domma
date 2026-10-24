# Focus trapping in overlays

### Focus stays in modals, slideovers, dialogs and popovers

*   `E.modal`, `E.slideover` and `E.alert` / `E.confirm` / `E.prompt` now keep Tab and Shift+Tab inside while they
    are open, and put focus back where it was when they close. The modal's cycle runs through its X, the content
    you put in it and the footer buttons in the order they show. A slideover focuses its panel on open, so the
    first Tab reaches its first control; a field you focus after `open()` keeps focus.
*   New options `trapFocus` (default `true`) and `returnFocus` (default `true`) on all three. A modal or slideover
    without a backdrop is not trapped unless you pass `trapFocus: true`, since the page beside it stays usable.
*   Overlays stack: a modal from a slideover, a confirm from a modal, a slideover from a slideover. The newest
    holds Tab; closing it hands focus back to where it was in the one beneath, which holds Tab again. An overlay
    closed underneath a newer one leaves focus alone and passes its own return target up.
*   Toasts and their buttons, popovers, context menus, date pickers and other floating panels opened from an
    overlay keep focus and clicks; Tab moves through them and back into the overlay. The page behind, and an
    overlay beneath, stay out of reach. Mark anything else that should take focus with `data-focus-trap-allow`.
*   Tab is left alone when something used it first: a textarea that indents on Tab, a grid that moves between
    cells, an editor's own Tab handling (anything that calls `preventDefault()`).
*   Popovers keep their non-modal Tab behaviour. Inside an overlay, Tab off the end of one goes to the next
    control in that overlay, not the page behind. `trapFocus: true` on a popover now uses the focus trap.
*   Escape and the close buttons still call `close()`, so a guard you put on `close` still runs. `destroy()`
    removes the trap. Nothing is made `inert`.
*   Focus trap: Tab is decided as the key reaches `window`, so handlers on the way can claim it; new options
    `allowOutsideFocus` (`false` | `true` | `'layers'` | function) and `register`; a trap whose containers left the
    page lets go of focus.

### Types generated from the source

*   The TypeScript declarations (`assets/types/`, the package's `types`) are now generated from the JSDoc in `src/`
    by `npm run build:types` (part of `npm run build`) instead of being written by hand. They cover what they did
    before and more: the router (`R`), auth (`A`), forms (`F`), effects, blueprint helpers (`B`), web components,
    every `E.*` factory and its instance, and the Schema Builder. `H.get<T>()` and the other HTTP methods are
    generic, `$()` events are typed by name (`'click'` gives a `MouseEvent`), and `isDomma()` is a type guard.
*   Every alias Domma puts on `window` is now declared as a global (`E`, `H`, `I`, `T`, `R`, `A`, `F`, `B` joined
    `$`, `_`, `M`, `D`, `S`), plus `FL` from domma-flags.
*   Types now follow the code where the old hand-written ones did not: names and members that never existed are
    gone (`HttpResponse`, `ThemeChangeEvent`, `BackToTopScrollEvent`, `BackToTopShowEvent`, `H.setDefaults`,
    `S.setPrefix`, several DataTable methods), and signatures that were wrong are fixed (`T` `filter` / `filterBy`,
    `PageInfo.page`, `theme.preview(theme)`). Module values such as `utils` or `elements` are type-only exports, since
    the ES module never exported them at runtime.
*   The separate hand-kept copy in `public/assets/ide/phpstorm/` is retired; point an IDE at `assets/types/index.d.ts`.
*   `npm run check:types` (in `make check` and CI) fails when the committed declarations differ from a fresh
    generation, and type-checks a small consumer under `tsc --strict`. See [docs/Types.md](Types.md).

<!-- website -->

