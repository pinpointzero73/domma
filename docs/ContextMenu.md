# Context Menu

A right-click menu bound to a container and, by delegation, to everything inside it. Menus nest:
putting one inside another does not override the outer one, it shadows it for the region it covers.

```javascript
Domma.elements.contextMenu('#invoice-table', {
    match: 'tr[data-id]',
    items: (row) => [
        {label: 'Edit',   icon: 'edit',  action: () => edit(row.dataset.id)},
        {label: 'Delete', icon: 'trash', danger: true, disabled: row.dataset.locked === 'true'},
        {type: 'divider'},
        {label: 'Export', icon: 'download', submenu: exportFormats}
    ]
});
```

## Why bind to a container

Binding per element means re-binding every time the content changes. A table that repaints through
`T.setData()` silently loses its handlers; a delegated container binding survives it, because
resolution happens at right-click time rather than at bind time. This is also why the selector is
matched live: `contextMenu('.collection', ...)` covers collections that do not exist yet.

## The cascade

Every context menu shares **one** document-level listener and a registry of bound containers. When a
right-click arrives:

1. Walk outward from the element that was clicked.
2. The first bound container found is asked whether it wants the gesture.
3. It **declines** if `enabled` resolves false, `exclude` matches, `match` finds nothing between the
   target and the container, or `onBeforeOpen` returns `false`.
4. On a decline the walk **continues outward**, so the next menu up gets its chance.
5. If nothing claims it, the browser's own menu opens untouched.

DOM depth decides the winner. Script order cannot, and that is the point of the shared listener: if
each instance owned its own document listener the winner would be whichever registered first, so a
menu could shadow its own parent purely on bundle order - intermittently, and differently in dev and
production.

Nothing in the component calls `stopPropagation()`. A menu that swallowed the event would silence
unrelated `contextmenu` listeners - analytics, editors, the host application - which is the same bug
arriving from the other direction.

### Inheritance

When an inner menu claims a gesture, `inherit` decides what happens to the menus above it. The
**inner** menu's setting governs, because it is the one that knows whether its context is a
refinement of its parent's or a replacement for it.

| Value | Result |
|-------|--------|
| `'append'` (default) | Own items, a divider, then each ancestor's items outward |
| `'prepend'` | Ancestors' items first, then a divider, then its own |
| `false` | Stands alone; ancestor items stay out |

```javascript
// Page level
Domma.elements.contextMenu('#page', {
    items: [{label: 'Page settings'}, {label: 'View source'}]
});

// Collection level - shadows the page menu, appends its items beneath
Domma.elements.contextMenu('[data-ctx]', {
    match: '[data-entry-id]',
    exclude: 'a, button, input',
    items: (entry) => [{label: 'Filter by this'}, {label: 'Search...'}]
});
```

Right-click a card: collection items, then page items. Right-click the gap between cards: `match`
misses, the collection declines, the page menu opens alone. Right-click a link: `exclude` matches,
the collection declines, and since a link is not claimed further out either, the browser menu opens.

### Regions that must not be taken over

Depth normally decides, which is wrong for a component that owns its region and must not be
shadowed by application menus - a data grid with its own filter panel, an editor, a canvas.
`exclusive: true` inverts the rule for that menu: once it encloses the click and accepts it,
nothing bound deeper is offered the gesture.

```javascript
Domma.elements.contextMenu('[data-ctx]', {
    exclusive: true,
    enabled: (display) => hasModel(display),
    render: (ctx) => openFilterPanel(ctx)
});

// Bound deeper, and never reached inside a collection display:
Domma.elements.contextMenu('[data-entry-id]', {items: [...]});
```

Declare it on the menu being protected, not as a guard on every menu that might collide with it -
a guard protects nothing the first time a registration path forgets one.

It is **not a veto**. An exclusive menu that declines (`enabled` false, an `exclude` match, a
`match` miss) steps aside completely, and the inner menus are offered the gesture as normal. It also
says nothing about menus *outside* it: those still inherit into it under the usual `inherit` rules,
since exclusivity is about depth rather than about standing alone. `inherit: false` is the separate
control for that.

A menu it pre-empts never runs its `onBeforeOpen` - the exclusive menu is asked first, rather than
asked last and used to discard work already done.

### Debugging a cascade

```javascript
Domma.elements.contextMenu.registry(document.querySelector('#some-row'));
// -> [collectionMenu, pageMenu]   innermost first, in the order they are offered the gesture
```

## Delegation

`match` names which descendants the menu covers. Without it the whole container is one target.

```javascript
Domma.elements.contextMenu('#grid', {
    match: '[data-entry-id]',
    items: (entry, ctx) => [...]   // entry is the matched element, not the click target
});
```

`items` as a function is what makes a container binding worth having: one binding, different items
per row. Per-item `visible` and `disabled` accept functions too, so a single item list can adapt.

```javascript
items: (row) => [
    {label: 'Publish',   visible: row.dataset.status === 'draft'},
    {label: 'Unpublish', visible: row.dataset.status === 'live'},
    {label: 'Delete', danger: true, disabled: () => row.dataset.locked === 'true'}
]
```

Dividers stranded by hidden items are collapsed, and a menu whose every item resolves away does not
open at all - the gesture falls through to the next menu outward rather than flashing an empty box.

## Keyboard and touch

Right-click has no keyboard equivalent, so a menu that answers only the mouse is unreachable without
one. Keyboard access is on by default.

| Key | Does |
|-----|------|
| `Shift`+`F10`, `Menu` | Open against the focused element |
| `↑` / `↓` | Move between items, skipping disabled ones |
| `Home` / `End` | First / last item |
| `→` / `←` | Open / close a submenu |
| `Enter` / `Space` | Choose the focused item |
| `Esc` | Close one level, then the menu |
| Any letter | Typeahead |
| `Shift`+right-click | Pass through to the browser's own menu |

Suppressing the native menu outright takes away "open in new tab" and spellcheck, which people
resent more than they enjoy a custom menu; `nativeOnShift` is the escape hatch, on by default.

On touch a long press opens the same menu. `longPress` is the duration in ms (500 by default), or
`false` to leave touch alone. Registered containers get `-webkit-touch-callout: none` while it is
enabled, because iOS answers a long press with its own callout and never sends `contextmenu`.

## Reactive items

`items` accepts a Domma Reactive observable. While the menu is open it re-renders in place.

```javascript
const actions = M.observable([{label: 'Edit'}]);
Domma.elements.contextMenu('#panel', {items: actions});

actions([{label: 'Edit'}, {label: 'Archive'}]);   // an open menu updates
```

A Model works too, through `model` and `modelKey`.

## Theming

Every themeable value is a **custom property with the theme token as its fallback**, so a menu given
no styling follows the active theme, and only what you pass is overridden. Nothing generates
per-instance CSS rules.

```javascript
Domma.elements.contextMenu('#panel', {
    accent: 'danger',        // or '#ff8800', or any CSS colour
    radius: 'lg',
    shadow: 'xl',
    opacity: 85,             // translucent, with a blurred backdrop
    density: 'compact',
    transition: 'slide',
    easing: 'ease-out',
    animationDuration: 180
});
```

`accent` takes a preset key (`primary`, `success`, `danger`, `warning`, `info`) or any CSS colour.
`radius` and `shadow` take the scale keys (`none`, `sm`, `md`, `lg`, `xl`) or a raw CSS value.

**The accent tints the border and the hover wash, never the label.** A named colour cannot be
guaranteed readable against whatever surface the menu lands on - `--dm-danger` on `--dm-surface` is
1.02:1 on `admin-smooth-steel` - so labels keep the one pairing every theme guarantees and the
accent carries the meaning. The same reasoning makes `opacity` mix the *background* with transparent
rather than fading the element: `opacity` on the element would fade the text along with the panel
and take the contrast down with it.

A `render` panel gets the custom properties too, so `accent` and friends reach a caller-owned panel
without it having to adopt this component's markup.

Transitions are CSS-driven off `data-transition` on the panel, and `prefers-reduced-motion` drops
them regardless of what was configured.

## Positioning

The menu anchors to the cursor point, not to an element rect, and uses `position: fixed`. A menu
that will not fit below-right of the cursor flips across **the cursor**; a submenu flips across its
parent item. Both clamp to the viewport.

Unlike `dropdown`, a context menu **closes** on scroll rather than chasing its anchor: the point it
was opened against has moved and no longer means anything.

## Panels that are not item lists

Some menus cannot be expressed as items: a live attribute editor, a filter builder, anything with
its own inputs. `render` lets one join the cascade anyway.

```javascript
Domma.elements.contextMenu('[data-ctx]', {
    enabled: (wrapper) => hasModel(wrapper),   // declines, falls through outward
    render: (ctx) => openMyPanel(ctx.x, ctx.y, ctx.container, ctx.target)
});
```

Arbitration is unchanged - `enabled`, `exclude`, `match` and `onBeforeOpen` all decide whether this
menu claims the gesture, and `render` is called only once it has. Return an element for Domma to
position and dismiss, or nothing to manage the panel entirely yourself. A rendered panel is opaque,
so ancestor items are not merged into it.

This is what lets an existing bespoke menu stop owning a private `document` listener. A private
listener is safe only while it is the page's only context menu; add a second and the winner is
decided by which script registered first rather than by which menu is nearer the click - a bundling
accident that differs between dev and production.

## Options

### Targeting and cascade

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `Array \| Function \| Observable` | `[]` | Items, or a resolver called with the delegated target |
| `match` | `string` | `null` | Delegation selector; null covers the whole container |
| `exclude` | `string` | `null` | Regions that decline and fall through outward |
| `enabled` | `boolean \| Function` | `true` | False declines and falls through |
| `inherit` | `'append' \| 'prepend' \| false` | `'append'` | Whether ancestor menus' items are merged in |
| `priority` | `number` | `0` | Tie-break only when two menus bind the same element |
| `exclusive` | `boolean` | `false` | This menu owns its region; nothing bound deeper is offered the click |

### Behaviour

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `nativeOnShift` | `boolean` | `true` | Shift+right-click gets the browser menu |
| `closeOnSelect` | `boolean` | `true` | Close after an item is chosen |
| `closeOnEscape` | `boolean` | `true` | Close on Esc |
| `closeOnClickOutside` | `boolean` | `true` | Close on outside mousedown |
| `closeOnScroll` | `boolean` | `true` | Close on scroll |
| `longPress` | `number \| false` | `500` | Touch long-press duration in ms |

### Presentation

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `className` | `string` | `''` | Extra class on the menu root |
| `minWidth` | `string` | `'200px'` | Minimum menu width |
| `maxWidth` | `string` | `'320px'` | Maximum menu width |
| `maxHeight` | `string` | `'60vh'` | Height before the menu scrolls |
| `offset` | `[number, number]` | `[2, 2]` | Offset from the cursor point |
| `flip` | `boolean` | `true` | Flip across the cursor rather than open off screen |
| `animation` | `boolean` | `true` | Whether to transition on open and close |
| `animationDuration` | `number` | `120` | Transition duration in ms |
| `transition` | `'scale' \| 'fade' \| 'slide' \| 'none'` | `'scale'` | How the panel enters |
| `easing` | `string` | `cubic-bezier(0.16, 1, 0.3, 1)` | Any CSS easing |
| `accent` | `string` | `null` | Preset key or any CSS colour |
| `surface` | `string` | `null` | Overrides the panel background |
| `radius` | `string` | `null` | `none\|sm\|md\|lg\|xl` or any CSS length |
| `shadow` | `string` | `null` | `none\|sm\|md\|lg\|xl` |
| `opacity` | `number` | `null` | 20-100; translucent panel with a blurred backdrop |
| `density` | `'comfortable' \| 'compact'` | `'comfortable'` | Row height and font size |
| `itemTemplate` | `Function` | `null` | Custom item renderer returning HTML |
| `submenuDelay` | `number` | `150` | Hover grace before a submenu opens |
| `render` | `Function` | `null` | Render your own panel instead of an item list - see below |

### Accessibility

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `keyboardTrigger` | `boolean` | `true` | Shift+F10 and the Menu key open the menu |
| `typeahead` | `boolean` | `true` | Jump to an item by typing |
| `ariaLabel` | `string` | `'Context menu'` | Label announced for the menu |

### Callbacks

| Callback | Signature | Description |
|----------|-----------|-------------|
| `onBeforeOpen` | `(ctx) => boolean` | Return false to decline and fall through outward |
| `onOpen` | `(ctx) => void` | Fired once the menu is on screen |
| `onClose` | `(ctx) => void` | Fired after dismissal |
| `onSelect` | `(item, ctx) => void` | Fired before the item's own action |

`ctx` is `{target, container, x, y, event, menu, instance}`.

## Item schema

| Key | Type | Description |
|-----|------|-------------|
| `label` | `string` | Item text |
| `icon` | `string` | Domma icon name |
| `value` | `any` | Carried through to `onSelect` |
| `action` | `(target, ctx) => void` | Called with the delegated target |
| `disabled` | `boolean \| Function` | Greyed but still shown |
| `visible` | `boolean \| Function` | Omitted entirely when false |
| `danger` | `boolean` | Destructive styling |
| `shortcut` | `string` | Hint text only - no key is bound for you |
| `submenu` | `Array \| Function` | Nested items, unlimited depth |
| `type` | `string` | `item`, `divider`, `header`, `checkbox`, `radio` |
| `checked` | `boolean \| Function` | For checkbox and radio items |
| `group` | `string` | Radio grouping key |

## Methods

| Method | Description |
|--------|-------------|
| `open(x, y, target)` | Open at a viewport point - for a "..." button that shows the same menu |
| `close()` | Close the menu |
| `refresh()` | Rebuild the open menu in place, keeping its position |
| `isOpen()` | Whether this menu is open |
| `setItems(items)` | Replace the items |
| `enable()` / `disable()` | Arm or suppress the menu |
| `destroy()` | Close, deregister and detach |

A disabled menu declines rather than swallowing the gesture, so right-clicks fall through to the
next menu outward exactly as they would if it were not bound at all.

## Statics

| Member | Description |
|--------|-------------|
| `contextMenu.closeAll()` | Close whichever menu is open |
| `contextMenu.active()` | The open instance, or null - only one can be open |
| `contextMenu.registry(el)` | The resolution chain for an element, innermost first |

## Styling

The menu is `.dm-context-menu`, items `.dm-context-menu-item`, with `.is-disabled`, `.is-danger`,
`.is-checked` and `.has-submenu` modifiers. `.dm-context-menu-host` on a container sets
`cursor: context-menu`, which is the only cue people get that a menu is there at all.

## See Also

- [Showcase](../public/showcase/elements/context-menu/) - live demo and tutorial
- [docs/Reactivity.md](./Reactivity.md) - observables for reactive items
