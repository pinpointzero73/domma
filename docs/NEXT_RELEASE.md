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

# 

**Popovers** - `E.popover()` anchors a panel to a trigger: a title, text, a list or a small form,
opened by click, hover, focus or code, and closed by Esc, a click outside or its own close button. It
is the component help icons, quick-edit panels and profile cards are made of.

💬 **Popover**

*   `E.popover(trigger, {title, content, placement, trigger, dismissible})`. Content is text by
    default; a DOM node, or a function returning one on every open, is used as it is; `html: true`
    sends a string through the sanitiser first.

*   Placement `top`, `bottom`, `left`, `right` or `auto`, each with `-start` / `-end`. The panel
    flips to another side when there is no room, shifts to stay on screen with its arrow still on the
    trigger, and follows scrolling and resizing. It lives at the end of `<body>`, so a card with
    `overflow: hidden` cannot clip it, and sits above modals and slideovers.

*   Accessible by default: a click popover is a dialog - focus moves in, Tab leaves it in page order,
    Esc closes it and puts focus back on the trigger - with `aria-haspopup`, `aria-expanded` and
    `aria-controls` kept up to date. Hover and focus popovers are tooltips joined by
    `aria-describedby`, and hover ones open on keyboard focus too. Reduced motion skips the fade.

*   One open at a time per `group`; a popover opened from inside another keeps its parent open.

*   `show()`, `hide()`, `toggle()`, `setContent()`, `setTitle()`, `update()`, `destroy()`, and
    `popover:show` / `shown` / `hide` / `hidden` events on the trigger (`show` and `hide` can be
    cancelled). Nothing wraps the trigger, and `destroy()` restores every attribute it set.

🏷️ **In markup**

*   `data-popover="..."` (always text), `data-popover-title`, `data-popover-placement` and friends,
    or `data-popover-content="#template"` for rich content, turned into popovers by
    `E.popover.scan(root)`. `$.setup()` takes `component: 'popover'`.

*   New showcase page with a tutorial, and `docs/Popover.md`.

<!-- website -->
<p><strong>Popovers.</strong> <code>E.popover()</code> anchors a panel with a title, text or a small form to a trigger - opened by click, hover or focus, flipped and shifted to stay on screen, with focus moving in and back out for keyboard users. <code>data-popover</code> markup and <code>E.popover.scan()</code> do the same without script.</p>


