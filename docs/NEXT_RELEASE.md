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

<!-- website -->

