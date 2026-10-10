---
title: Context Menu
description: "Right-click menus that bind to a container, delegate to its children, and nest without overriding each other"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Context Menu" tagline="Right-click menus that bind to a container, delegate to its children, and nest without overriding each other" align="center"][/hero]

## Overview

A context menu binds to a container once and covers everything inside it. You do not attach a handler per row: the menu resolves which descendant was right-clicked and hands it to your items, so content rendered later is covered automatically.

Menus nest. Putting one inside another does not override the outer menu - the inner one shadows it for the region it covers, and by default appends the outer menu's items beneath its own.

### Key Features

- **Container binding** - one menu for a whole table, list or page region
- **Delegation** - `match` picks the row, and your items receive it
- **Graceful nesting** - innermost wins, by DOM depth, never by load order
- **Inheritance** - ancestor items appended, prepended, or left out entirely
- **Keyboard access** - Shift+F10 and the Menu key, arrows, typeahead, Escape
- **Touch** - long-press opens the same menu
- **Native escape hatch** - Shift+right-click still gets the browser's own menu

### Basic Usage

```
const menu = Domma.elements.contextMenu('#my-container', {
    items: [
        { label: 'Edit',   icon: 'edit',  action: (target) => edit(target) },
        { label: 'Delete', icon: 'trash', danger: true, action: remove },
        { type: 'divider' },
        { label: 'Copy', icon: 'copy', shortcut: 'Ctrl+C', action: copy }
    ]
});
```

## Getting Started

A working right-click menu in three steps

### Step 1 - Mark the region

Any element can host a menu. Give it something the menu can bind to.

```
<div id="notes" class="dm-context-menu-host">
    <div data-note-id="1">First note</div>
    <div data-note-id="2">Second note</div>
</div>
```

`.dm-context-menu-host` is optional. It sets `cursor: context-menu` so people can tell a menu is there before they try.

### Step 2 - Bind the menu

```
Domma.elements.contextMenu('#notes', {
    match: '[data-note-id]',
    items: [
        { label: 'Open', icon: 'eye',   action: (note) => open(note.dataset.noteId) },
        { label: 'Delete', icon: 'trash', danger: true }
    ]
});
```

### Step 3 - Vary the items per row

Pass a function instead of an array and it is called with the row that was clicked.

```
items: (note) => [
    { label: `Open note ${note.dataset.noteId}`, icon: 'eye' },
    { label: 'Unlock', visible: note.dataset.locked === 'true' },
    { label: 'Delete', danger: true, disabled: note.dataset.locked === 'true' }
]
```

## Live Demo

Right-click anywhere in the panel below. Try a card, then the gap between cards.

[showcase-demo id="showcase/elements/context-menu/live-demo" title="Live Demo" /]

[showcase-demo id="showcase/elements/context-menu/what-happened" title="What happened" /]

## Nesting and the cascade

The demo above has two menus: one on the page region, one on the card grid inside it. Right-click a card and you get the card's items with the page's appended beneath. Right-click the gap between cards and only the page menu opens, because the inner menu's `match` found nothing and declined.

```
// Outer - the page
Domma.elements.contextMenu('#demo-page', {
    items: [
        { label: 'Page settings', icon: 'settings' },
        { label: 'View source',   icon: 'code' }
    ]
});

// Inner - shadows the page menu, but only over the cards
Domma.elements.contextMenu('#demo-collection', {
    match: '[data-entry-id]',
    items: (entry) => [
        { label: `Open "${entry.dataset.title}"`, icon: 'eye' },
        { label: 'Delete', icon: 'trash', danger: true,
          disabled: entry.dataset.locked === 'true' }
    ]
});
```

### How the winner is chosen

1. Walk outward from the element that was right-clicked.
2. The first bound container found is asked whether it wants the gesture.
3. It declines if `enabled` is false, `exclude` matches, `match` finds nothing, or `onBeforeOpen` returns `false`.
4. On a decline the walk continues outward, so the next menu up gets its chance.
5. If nothing claims it, the browser's own menu opens.

DOM depth decides, never script order. Every menu shares one document listener, so a menu registered first cannot shadow one registered later, and rebundling cannot change which menu wins.

### Regions that must not be taken over

Depth normally decides, which is wrong for a component that owns its region and must not be shadowed by application menus. `exclusive: true` inverts the rule for that menu: once it encloses the click and accepts it, nothing bound deeper is offered the gesture. Declare it on the menu being protected, rather than as a guard on every menu that might collide with it.

```
Domma.elements.contextMenu('#data-grid', {
    exclusive: true,
    render: (ctx) => openFilterPanel(ctx)
});

// Bound deeper, and never reached inside the grid:
Domma.elements.contextMenu('[data-row-id]', { items: [...] });
```

It is not a veto: an exclusive menu that declines steps aside completely and the inner menus answer as normal. It says nothing about menus outside it, which still inherit under the usual rules.

### Controlling inheritance

```
inherit: 'append'    // default - own items, then the ancestors' beneath
inherit: 'prepend'   // ancestors' items first
inherit: false       // stand alone; ancestor items stay out
```

## Submenus

Right-click the panel below and hover *Export*.

[showcase-demo id="showcase/elements/context-menu/submenus" title="Submenus" /]

```
items: [
    { label: 'Rename', icon: 'edit' },
    { type: 'divider' },
    {
        label: 'Export', icon: 'download',
        submenu: [
            { label: 'CSV',  action: () => exportAs('csv') },
            { label: 'JSON', action: () => exportAs('json') },
            { label: 'PDF',  action: () => exportAs('pdf') }
        ]
    }
]
```

## Keyboard and touch

Right-click has no keyboard equivalent, so a context menu that only answers the mouse is unreachable for anyone who does not use one. This component opens from the keyboard by default.

[table striped="true"]
| Key | Does |
| --- | --- |
| `Shift` + `F10` | Open against the focused element |
| `Menu` | Open against the focused element |
| `↑` / `↓` | Move between items, skipping disabled ones |
| `Home` / `End` | First / last item |
| `→` / `←` | Open / close a submenu |
| `Enter` / `Space` | Choose the focused item |
| `Esc` | Close one level, then the menu |
| Any letter | Typeahead to the first item starting with it |
| `Shift` + right-click | Pass through to the browser's own menu |
[/table]

On touch, a long press of `longPress` ms (500 by default) opens the same menu. Set `longPress: false` to leave touch alone.

## Theming and transitions

Right-click each panel below to compare. Every themeable value is a custom property with the theme token as its fallback, so a menu given no styling follows the active theme and only what you pass is overridden.

[showcase-demo id="showcase/elements/context-menu/theming-and-transitions" title="Theming and transitions" /]

```
Domma.elements.contextMenu('#panel', {
    accent: 'danger',        // or '#ff8800', or any CSS colour
    radius: 'lg',
    shadow: 'xl',
    opacity: 85,             // translucent, with a blurred backdrop
    density: 'compact',
    transition: 'slide',     // scale | fade | slide | none
    easing: 'ease-out',
    animationDuration: 180
});
```

**The accent tints the border and the hover wash, never the label.** A named colour cannot be guaranteed readable against whatever surface the menu lands on - `--dm-danger` on `--dm-surface` is 1.02:1 on admin-smooth-steel - so labels keep the one pairing every theme guarantees and the accent carries the meaning. For the same reason `opacity` mixes the background with transparent rather than fading the element, which would take the text down with it.

Transitions are CSS-driven, and `prefers-reduced-motion` drops them regardless of what was configured.

## The cursor

A right-click menu is invisible until someone right-clicks, so nothing on the page says the gesture does anything. Hover each panel below - each has the same menu bound, and differs only in `cursor`.

[showcase-demo id="showcase/elements/context-menu/the-cursor" title="The cursor" /]

```
Domma.elements.contextMenu('#invoices', {
    match: 'tr[data-id]',
    cursor: 'glyph',         // 'auto' (default) | 'glyph' | false | any CSS cursor
    cursorSize: 26,          // clamped to 32 - browsers ignore anything larger
    items: (row) => [{label: 'Edit ' + row.dataset.id}]
});
```

**The keyword is the default because it is the safer one.** It costs nothing, can never be wrong, and honours the viewer’s own cursor theme – including the enlarged pointer someone may have set for low vision, which a fixed-size image would quietly replace with something smaller. Its weakness is that on Windows the contextual-menu cursor is by platform convention identical to the plain arrow, so the first two panels above may look the same to you. Interfaces that need the affordance to land opt into `glyph`.

**The glyph is drawn from Domma’s own `list` icon**, taking `--dm-text` for the arrow and `--dm-text-inverse` for its halo, so it stays legible on every theme and is regenerated when the theme changes. Switch the theme with the picker and hover it again. Under `forced-colors` the image is dropped and the keyword stands in, because a baked colour cannot answer a high-contrast palette.

**It is written as a stylesheet rule**, composed from the selector and `match`, not as a class on each element – for the same reason the cascade resolves `match` live. Rows rendered long after the menu was declared are covered with no observer and no re-binding, and `destroy()` removes the rule.

A cursor only reaches mouse users. It does nothing for keyboard or touch, where `keyboardTrigger` and `longPress` carry the load – the cursor is the polish, not the affordance.

## Panels that are not item lists

Some menus cannot be expressed as items - a live attribute editor, a filter builder, anything carrying its own inputs. `render` lets one join the cascade anyway.

```
Domma.elements.contextMenu('[data-ctx]', {
    enabled: (wrapper) => hasModel(wrapper),   // declines, falls through outward
    render: (ctx) => openMyPanel(ctx.x, ctx.y, ctx.container, ctx.target)
});
```

Arbitration is unchanged: `enabled`, `exclude`, `match` and `onBeforeOpen` decide whether this menu claims the gesture, and `render` runs only once it has. Return an element for Domma to position and dismiss, or nothing to manage the panel yourself.

## Options

### Targeting and cascade

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | Array \| Function \| Observable | `[]` | Items, or a resolver called with the delegated target |
| `match` | string | `null` | Delegation selector; null covers the whole container |
| `exclude` | string | `null` | Regions that decline and fall through outward |
| `enabled` | boolean \| Function | `true` | False declines and falls through |
| `inherit` | 'append' \| 'prepend' \| false | `'append'` | Whether ancestor menus' items are merged in |
| `priority` | number | `0` | Tie-break when two menus bind the same element |
| `exclusive` | boolean | `false` | This menu owns its region; nothing bound deeper is offered the click |
[/table]

### Behaviour

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `nativeOnShift` | boolean | `true` | Shift+right-click gets the browser menu |
| `closeOnSelect` | boolean | `true` | Close after an item is chosen |
| `closeOnEscape` | boolean | `true` | Close on Esc |
| `closeOnClickOutside` | boolean | `true` | Close on outside mousedown |
| `closeOnScroll` | boolean | `true` | Close on scroll - the anchor point has moved |
| `longPress` | number \| false | `500` | Touch long-press duration in ms |
[/table]

### Presentation

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | string | `''` | Extra class on the menu root |
| `minWidth` | string | `'200px'` | Minimum menu width |
| `maxWidth` | string | `'320px'` | Maximum menu width |
| `maxHeight` | string | `'60vh'` | Height before the menu scrolls |
| `offset` | [number, number] | `[2, 2]` | Offset from the cursor point |
| `flip` | boolean | `true` | Flip across the cursor rather than open off screen |
| `animation` | boolean | `true` | Whether to transition on open and close |
| `animationDuration` | number | `120` | Transition duration in ms |
| `transition` | string | `'scale'` | `scale`, `fade`, `slide`, `none` |
| `easing` | string | `cubic-bezier(…)` | Any CSS easing |
| `accent` | string | `null` | Preset key or any CSS colour |
| `surface` | string | `null` | Overrides the panel background |
| `radius` | string | `null` | `none\|sm\|md\|lg\|xl` or a CSS length |
| `shadow` | string | `null` | `none\|sm\|md\|lg\|xl` |
| `opacity` | number | `null` | 20-100; translucent with a blurred backdrop |
| `density` | string | `'comfortable'` | `comfortable` or `compact` |
| `itemTemplate` | Function | `null` | Custom item renderer returning HTML |
| `submenuDelay` | number | `150` | Hover grace before a submenu opens |
| `render` | Function | `null` | Render your own panel instead of an item list |
[/table]

### Accessibility

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `keyboardTrigger` | boolean | `true` | Shift+F10 and the Menu key open the menu |
| `typeahead` | boolean | `true` | Jump to an item by typing |
| `ariaLabel` | string | `'Context menu'` | Label announced for the menu |
[/table]

### Callbacks

[table striped="true"]
| Callback | Signature | Description |
| --- | --- | --- |
| `onBeforeOpen` | `(ctx) => boolean` | Return false to decline and fall through outward |
| `onOpen` | `(ctx) => void` | Fired once the menu is on screen |
| `onClose` | `(ctx) => void` | Fired after dismissal |
| `onSelect` | `(item, ctx) => void` | Fired before the item's own action |
[/table]

## Item schema

[table striped="true"]
| Key | Type | Description |
| --- | --- | --- |
| `label` | string | Item text |
| `icon` | string | Domma icon name |
| `value` | any | Carried through to `onSelect` |
| `action` | Function | Called with the delegated target and the context |
| `disabled` | boolean \| Function | Greyed but still shown |
| `visible` | boolean \| Function | Omitted entirely when false |
| `danger` | boolean | Destructive styling |
| `shortcut` | string | Hint text only - no key is bound for you |
| `submenu` | Array \| Function | Nested items, unlimited depth |
| `type` | string | `item`, `divider`, `header`, `checkbox`, `radio` |
| `checked` | boolean \| Function | For checkbox and radio items |
[/table]

Dividers left stranded by hidden items are collapsed automatically, and a menu whose every item resolves away does not open at all - the click falls through to the next menu outward.

## Methods

[table striped="true"]
| Method | Description |
| --- | --- |
| `open(x, y, target)` | Open at a viewport point - for a "..." button that should show the same menu |
| `close()` | Close the menu |
| `refresh()` | Rebuild the open menu in place, keeping its position |
| `isOpen()` | Whether this menu is open |
| `setItems(items)` | Replace the items |
| `enable()` / `disable()` | Arm or suppress the menu |
| `destroy()` | Close, deregister and detach |
[/table]

### Statics

[table striped="true"]
| Member | Description |
| --- | --- |
| `contextMenu.closeAll()` | Close whichever menu is open |
| `contextMenu.active()` | The open instance, or null |
| `contextMenu.registry(el)` | The resolution chain for an element, innermost first |
[/table]

`registry(el)` is the debugging tool for a cascade that is not behaving: it shows exactly which menus enclose an element, in the order they will be offered the gesture.
