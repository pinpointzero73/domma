---
title: Popover
description: "Rich panels anchored to a trigger - a title, content, even a form - that open by click, hover or focus, flip to stay on screen, and take the keyboard with them"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Popover" tagline="Rich panels anchored to a trigger - a title, content, even a form - that open by click, hover or focus, flip to stay on screen, and take the keyboard with them" align="center"][/hero]

## Overview

`E.popover()` anchors a floating panel to a trigger. Where a tooltip holds a line of text and vanishes as the pointer leaves, a popover holds whatever you give it - a title, paragraphs, links, a small form - and stays open until it is dismissed. It is what help icons, "quick edit" panels and profile cards are made of.

The panel is moved to the end of `<body>` and positioned against the viewport, so a card with `overflow: hidden` cannot clip it. It prefers the side you ask for, flips when that side has no room, slides along the edge to stay on screen and keeps its arrow on the trigger. Nothing wraps or moves the trigger itself.

### Key Features

- **Four triggers** - click, hover, focus or manual, and combinations such as `'hover focus'`
- **Placement** - top, bottom, left, right or auto, each with `-start` / `-end`
- **Collision handling** - flips, then shifts, and follows scrolling and resizing
- **Safe content** - text by default, DOM nodes as they are, HTML only when asked and then sanitised
- **Accessible** - a real dialog: focus moves in, Tab and Esc behave, focus comes back
- **One at a time** - opening one closes the others in its group
- **Declarative** - `data-popover` markup and `E.popover.scan()`

### Basic Usage

```
E.popover('#billing-help', {
    title: 'Billing date',
    content: 'Invoices are raised on the first working day of each month.',
    dismissible: true
});
```

## Getting Started

A help icon next to a form label, in three steps

### Step 1 - Add a trigger

Any element can be a trigger, but a `<button>` is keyboard-operable already. Give it an `aria-label`, because an icon alone says nothing to a screen reader.

```
<label for="slug">
    URL slug
    <button id="slug-help" type="button" class="sx-pop-help" aria-label="About the URL slug">
        <span data-icon="help-circle" data-icon-size="16"></span>
    </button>
</label>
```

### Step 2 - Attach the popover

```
E.popover('#slug-help', {
    title: 'URL slug',
    content: 'The last part of the page address. Lower case, words joined by hyphens.',
    placement: 'top'
});
```

That is a working popover. A click opens it and moves focus into it; Esc, a click outside or a second click on the trigger closes it and puts focus back on the button. The button gets `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`.

### Step 3 - Or do it all in markup

For many help icons, write the text into the markup and let `E.popover.scan()` find them - the same way `Domma.icons.scan()` finds `data-icon`. It is safe to call again after rendering more content: triggers that already have a popover are skipped.

```
<button type="button" aria-label="About the URL slug"
        data-popover="The last part of the page address."
        data-popover-title="URL slug"
        data-popover-placement="top">?</button>

<script>
    E.popover.scan();          // or E.popover.scan('#settings-form')
</script>
```

`data-popover` is always treated as text, never HTML. For rich declarative content, point `data-popover-content` at a `<template>`; it is cloned each time the popover opens.

## Title, content and a close button

Click the button. The panel takes focus; press `Esc` or use the close button and focus returns to the trigger.

[showcase-demo id="showcase/elements/popover/title-content-and-a-close-button" title="Title, content and a close button" /]

```
E.popover('#demo-basic', {
    title: 'Delivery options',
    content: 'Standard delivery takes 3-5 working days. Next-day delivery is available '
           + 'on orders placed before 2pm.',
    dismissible: true
});

E.popover('#demo-plain', {content: 'A popover needs nothing more than content.'});
```

## Placement

`placement` is a side - `top`, `bottom` (the default), `left`, `right` or `auto` - optionally followed by `-start` or `-end` to line the panel up with one edge of the trigger instead of its middle. Every popover in this grid shares a group, so only one is open at a time.

[showcase-demo id="showcase/elements/popover/placement" title="Placement" /]

```
$('[data-place]').each((i, el) => {
    E.popover(el, {
        placement: el.dataset.place,
        group: 'placement',
        content: 'Placed ' + el.dataset.place + '.'
    });
});
```

### Flipping and shifting

These two ask for `left` and `right` from the very edges of the card. On a narrow screen there is no room, so the popover flips to the other side, and failing that to below or above. Open one and scroll the page: it follows the trigger, and when the trigger scrolls out of view the panel waits for it rather than sticking to the edge of the screen.

[showcase-demo id="showcase/elements/popover/flipping-and-shifting" title="Flipping and shifting" /]

```
// onShown reports where the panel actually went - and shows off setContent().
const whereDidItGo = (asked) => ({
    placement: asked,
    content: 'Asked for ' + asked + '.',
    onShown: (p) => p.setContent('Asked for ' + asked + ', placed ' + p.panel.dataset.side + '.')
});
E.popover('#demo-edge-left',  whereDidItGo('left'));
E.popover('#demo-edge-right', whereDidItGo('right'));
```

## Triggers

`click` is the default and the right choice for anything with controls in it. A `hover` popover stays open while the pointer moves from the trigger into the panel, and also opens on keyboard focus so it is not mouse-only. `focus` suits hints on form fields. `manual` binds nothing and leaves `show()` and `hide()` to you.

[showcase-demo id="showcase/elements/popover/triggers" title="Triggers" /]

```
E.popover('#demo-hover', {trigger: 'hover', title: 'Ada Lovelace', content: profileCard});
E.popover('#demo-focus', {trigger: 'focus', placement: 'top',
                          content: 'UK numbers only. Spaces are fine.'});

const manual = E.popover('#demo-manual', {
    trigger: 'manual', closeOnOutside: false, group: null,
    content: 'Opened from code. Only hide() - or Esc - closes me.'
});
$('#demo-manual-show').on('click', () => manual.show());
$('#demo-manual-hide').on('click', () => manual.hide());
```

## Rich content and forms

`content` takes a string (set as text), a DOM node, or a function that returns either - called every time the popover opens, so it can show current data. Here the function builds a small form; focus lands on its input, Tab moves through the buttons, and Tab past the last one leaves the popover for whatever follows the trigger on the page.

[showcase-demo id="showcase/elements/popover/rich-content-and-forms" title="Rich content and forms" /]

```
const rename = E.popover('#demo-rename', {
    title: 'Rename project',
    placement: 'bottom-start',
    content: () => {
        const form = $('<form class="sx-pop-form">' +
            '<input class="form-input" name="name" aria-label="Project name">' +
            '<div class="sx-pop-actions">' +
            '<button type="button" class="btn btn-sm btn-ghost" data-cancel>Cancel</button>' +
            '<button class="btn btn-sm btn-primary">Save</button>' +
            '</div></form>');
        form.find('input').val($('#demo-name').text());
        form.find('[data-cancel]').on('click', () => rename.hide({returnFocus: true}));
        form.on('submit', (e) => {
            e.preventDefault();
            $('#demo-name').text(form.find('input').val());
            rename.hide({returnFocus: true});
        });
        return form.get(0);
    }
});
```

With `html: true` a string is treated as markup, and goes through Domma's sanitiser (DOMPurify when the page loads it) first. The button above passes a `javascript:` link and an `onmouseover` handler along with the formatting; only the formatting survives.

```
E.popover('#demo-html', {
    html: true,
    title: 'Sanitised',
    content: '<p><strong>Bold</strong>, <em>italic</em> and a <a href="#">link</a> survive.</p>'
           + '<p><a href="javascript:alert(1)">This link</a> loses its href, '
           + '<span onmouseover="alert(1)">this span</span> its handler.</p>'
});
```

## Declarative help icons

This form's help icons are written entirely in markup. One `E.popover.scan('#demo-scan')` call turns them into popovers. The last one takes its content from a `<template>`, so it can hold a list and a link.

[showcase-demo id="showcase/elements/popover/declarative-help-icons" title="Declarative help icons" /]

```
<button type="button" aria-label="About visibility"
        data-popover-content="#visibility-help"
        data-popover-title="Who can see this page">?</button>

<template id="visibility-help">
    <ul><li><strong>Public</strong> - anyone with the link</li> …</ul>
</template>
```

[table striped="true"]
| Attribute | Option |
| --- | --- |
| `data-popover` | `content` (always text) |
| `data-popover-content` | Selector of a `<template>` or element to clone as content |
| `data-popover-title` | `title` |
| `data-popover-trigger` | `trigger` |
| `data-popover-placement` | `placement` |
| `data-popover-dismissible` | `dismissible` (present = true) |
| `data-popover-arrow="false"` | `arrow: false` |
| `data-popover-group` | `group` (`"none"` = independent) |
| `data-popover-width` / `-max-width` | `width` / `maxWidth` |
| `data-popover-class` | `className` |
[/table]

## Inside a modal

Popovers sit above modals and slideovers, so a help icon inside a dialog works. Esc closes the popover first and stops there - the modal stays open until you press it again.

[showcase-demo id="showcase/elements/popover/inside-a-modal" title="Inside a modal" /]

```
E.popover('#demo-modal-help', {
    title: 'Roles',
    content: 'Editors can change pages. Viewers can only read them.',
    placement: 'right'
});
```

## Events

Each phase calls its callback and then fires a bubbling `popover:*` event on the trigger, with `{popover}` as `event.detail`. Return `false` from `onShow` / `onHide`, or call `preventDefault()` on `popover:show` / `popover:hide`, to cancel. This log listens to the whole page.

[showcase-demo id="showcase/elements/popover/events" title="Events" /]

```
$('main').on('popover:shown', (e) => console.log('Opened', e.detail.popover.panel.id));
```

[table striped="true"]
| Callback | Event | When |
| --- | --- | --- |
| `onShow` | `popover:show` | Before opening; cancelable |
| `onShown` | `popover:shown` | After the open transition |
| `onHide` | `popover:hide` | Before closing; cancelable |
| `onHidden` | `popover:hidden` | After the panel has been removed |
[/table]

## Keyboard and screen readers

[table striped="true"]
| Input | Does |
| --- | --- |
| `Enter` / `Space` on the trigger | Opens a click popover and moves focus to its first control (or the panel) |
| `Tab` in the panel | Moves through its controls; past the last one, focus goes to what follows the trigger and the popover closes |
| `Shift` + `Tab` from the first control | Back to the trigger; `Tab` from there goes back in |
| `Esc` | Closes the most recent popover (only) and returns focus to its trigger |
[/table]

A click popover is `role="dialog"`, labelled by its title, and its trigger carries `aria-haspopup="dialog"`, `aria-expanded` and (while open) `aria-controls`. A hover or focus popover is `role="tooltip"` and is joined to its trigger through `aria-describedby`. A `<span>` or `<div>` used as a trigger is given `tabindex="0"` and, for click, `role="button"` with Enter/Space; `destroy()` takes them away again. Under `prefers-reduced-motion` the fade and scale are skipped.

## Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | string \| Node \| Function | `''` | Text, a DOM node, or `(popover) =>` either, called on every open |
| `title` | string \| Node \| Function | `''` | Heading; empty for none |
| `html` | boolean | `false` | Treat string content and title as HTML, sanitised |
| `trigger` | string | `'click'` | `click`, `hover`, `focus`, `manual`, or several separated by spaces |
| `placement` | string | `'bottom'` | `top` / `bottom` / `left` / `right` / `auto`, with optional `-start` / `-end` |
| `flip` | boolean | `true` | Try other sides when the preferred one has no room |
| `offset` | number \| [x, y] | `10` | Gap in px, or `[crossAxis, mainAxis]` |
| `arrow` | boolean | `true` | Show the arrow |
| `dismissible` | boolean | `false` | Show a close button |
| `closeOnOutside` | boolean | `true` | Close on a press or focus outside |
| `closeOnEscape` | boolean | `true` | Close on Esc |
| `group` | string \| null | `'default'` | One open at a time per group; `null` for independent |
| `width` / `maxWidth` | string \| number | `null` | Any CSS width (numbers are px); the stylesheet caps it at 20rem |
| `className` | string | `''` | Extra classes on the panel |
| `id` | string | generated | Panel id |
| `role` | string | auto | `dialog`, or `tooltip` for hover/focus-only |
| `ariaLabel` | string | `null` | Accessible name when there is no title |
| `autoFocus` | boolean \| null | `null` | Move focus in on open; null means "for click popovers" |
| `trapFocus` | boolean | `false` | Tab cycles inside the panel instead of leaving it |
| `delay` | number \| {show, hide} | `{show: 80, hide: 120}` | Hover delays in ms |
| `animation` | boolean | `true` | Fade and scale |
| `animationDuration` | number | `150` | ms |
| `container` | Element \| string | `document.body` | Where the panel is placed |
| `zIndex` | number | `null` | Override the stylesheet's 10045 |
[/table]

## Methods

[table striped="true"]
| Method | Description |
| --- | --- |
| `show({focus})` | Open; `focus` overrides `autoFocus` once |
| `hide({returnFocus})` | Close; focus returns to the trigger by default only when it was inside the panel |
| `toggle()` | Open or close |
| `isOpen()` | Whether it is open |
| `setContent(content)` | Replace the content (repositions when open) |
| `setTitle(title)` | Replace the title; empty removes the header |
| `update()` | Reposition, after the trigger moved or the content changed size |
| `setOptions(opts)` | Change options, including the trigger type |
| `destroy()` | Close, remove the panel and listeners, restore the trigger's attributes |
| `panel` / `trigger` | Getters for the two elements |
| `E.popover.scan(root)` | Create popovers from `data-popover` markup; returns the new instances |
| `E.popover.closeAll(group)` | Close every open popover, or one group's |
| `E.popover.getInstance(el)` | The popover bound to a trigger |
[/table]

## Theming

The panel uses theme tokens only - `--dm-surface`, `--dm-text`, `--dm-border`, `--dm-shadow-lg` and `--dm-radius-md` - so it follows every theme, light and dark. Width goes through custom properties you can set in CSS too.

```
.dm-popover.help-pop {
    --dm-popover-max-width: 24rem;
    border-color: var(--dm-primary);
}
.dm-popover.help-pop .dm-popover-arrow {
    border-color: var(--dm-primary);
}
```

The panel carries `data-side` and `data-placement` with where it actually ended up, `.has-title`, `.is-dismissible` and `.is-open`. The trigger carries `.is-popover-open` while its popover is open. See `docs/Popover.md` for the full reference.
