# Sortable

Drag-to-reorder for the children of one container, by mouse, pen, touch and keyboard. Bind it
once to the container; items rendered later are sortable without a refresh.

```javascript
const list = Domma.elements.sortable('#tasks', {
    persist: 'tasks',                       // remember the order across page loads
    onSort: ({order}) => H.post('/api/tasks/order', {order})
});
```

```html
<ul id="tasks">
    <li data-id="write">Write the brief</li>
    <li data-id="review">Review it</li>
    <li data-id="ship">Ship it</li>
</ul>
```

Every item carries a key (`data-id` by default). Keys are how the component reports an order, how
`persist` restores one, and how an animation finds an item again after the host re-renders.

It uses pointer events rather than the HTML5 drag-and-drop API. Native drag cannot animate its
neighbours, draws its own ghost, and does not exist on touch screens at all.

## Two modes

| | Live (default) | Indicator (`nest: true` or `live: false`) |
|---|---|---|
| While dragging | Siblings slide out of the way | Nothing moves; a marker shows where the item would land |
| Drop zones | Between items | `before` / `after`, plus `into` with `nest` |
| Who moves the element | The component | The host, in `onDrop` (or the component, if there is no `onDrop`) |
| Reports | `onSort({item, from, to, order, previous})` | `onDrop({item, target, zone, key, targetKey})` |
| Keyboard | Alt+Arrow | Not available |
| `persist` | Yes | No - the host owns the data |

**Live mode** is for a flat list the DOM itself represents: a to-do list, a row of cards, a set of
dashboard widgets. The dragged item's own slot travels with the pointer, so what you see while
dragging is what you get on release.

**Indicator mode** is for data the DOM only renders: a tree, a menu structure, anything where a
drop means "update the model, then redraw". The marker is a rule at the edge the item would drop
beside, or an outline round the item it would drop into. On release `onDrop` hands you the move;
you update your data and re-render. The component then animates the re-render: every item keyed by
`key` glides from where it was to where it now is, and the dragged item lands in its new place.

`nest: true` implies indicator mode. `live: false` gives indicator mode without the `into` zone,
for a flat list whose order is owned by data.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | string | `null` | Selector for the sortable items; `null` means the container's direct children |
| `handle` | string | `null` | Selector inside an item that starts a drag; `null` means the whole item |
| `nest` | boolean | `false` | Adds an `into` drop zone and switches to indicator mode |
| `live` | boolean \| null | `null` | `null` means `!nest`. `false` is indicator mode without nesting |
| `axis` | `'y'` \| `'x'` | `'y'` | A column or a row |
| `key` | string | `'data-id'` | Attribute that identifies an item across re-renders |
| `animation` | number | `200` | Glide duration in ms; `0` turns animation off |
| `easing` | string | `'cubic-bezier(0.2, 0.8, 0.2, 1)'` | CSS easing for every glide |
| `threshold` | number | `4` | Pixels the pointer must travel before a press becomes a drag |
| `touchDelay` | number | `220` | Ms a finger must rest on an item with no handle before it drags |
| `nestZone` | number | `0.5` | Share of an item's height, centred, that means `into` |
| `accepts` | Function | `null` | `(item, target, zone) => boolean` - veto a drop |
| `disabled` | boolean | `false` | Start disabled |
| `keyboard` | boolean | `true` | Alt+Arrow moves the focused item (live mode) |
| `persist` | string \| boolean | `false` | Storage key, or `true` for the container's `id`: remember the order |
| `autoScroll` | boolean | `true` | Scroll the nearest scrolling ancestor, or the page, near its edges |
| `ghostParent` | Element | `null` | Where the dragged copy is appended; `null` means the container |

Options can be changed later with `setOptions()`, which re-marks handles and applies `disabled`.

### `items` and nested sortables

Without `items`, every direct child is an item. With it, any descendant matching the selector is,
which is what a tree rendered as nested lists needs.

A sortable inside another sortable's item claims its own items: each container only ever sees items
whose nearest `.dm-sortable` ancestor is itself, and a press claimed by the inner one is not also
started by the outer. So a list of lists sorts at both levels independently.

### `accepts`

Called for every candidate drop. Return `false` to refuse it.

```javascript
accepts: (item, target, zone) => target.dataset.locked !== 'true'
```

In live mode `zone` is `'before'` or `'after'`, and the dragged item will not move past a refused target. In
indicator mode a refused `into` falls back to the nearer edge before giving up, so a node that
cannot hold children can still be dropped beside.

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `toArray()` | `string[]` | The item keys in their current order |
| `sort(keys, {animate = true})` | this | Put the items in the order of `keys`. Items not named keep their slots |
| `restore()` | this | Re-apply the saved order (live mode with `persist`) |
| `forget()` | this | Remove the saved order from storage. The on-screen order is untouched |
| `animate(mutate)` | result of `mutate` | Run `mutate` (which may re-render) and glide every keyed item into its new place. A returned promise is awaited before animating |
| `enable()` | this | Re-arm dragging |
| `disable()` | this | Stop dragging; a drag in progress is cancelled. Adds `.dm-sortable-disabled` |
| `dragging` | boolean | Getter: whether a drag is in progress |
| `destroy()` | void | Cancel any drag, remove every class this component added, and detach |

`sort()` swaps items into the slots the named items already hold, so an item added since an order
was saved stays where the page put it rather than jumping to the end.

`animate()` is useful on its own. Any change you make to a keyed list - filtering, sorting by a
column, inserting a row - glides instead of jumping when it is wrapped:

```javascript
list.animate(() => renderTasks(_.sortBy(tasks, 'due')));
```

## Callbacks and events

Each callback also fires as a bubbling `CustomEvent` on the container, named `sortable:<name>`,
with the same object as `event.detail`.

| Callback | Event | Detail | When |
|----------|-------|--------|------|
| `onStart` | `sortable:start` | `{item, from}` | A press has become a drag |
| `onMove` | `sortable:move` | `{item, target, zone, x, y}` | Every pointer move during a drag |
| `onSort` | `sortable:sort` | `{item, from, to, order, previous}` | Live mode: the order changed (drag or keyboard) |
| `onDrop` | `sortable:drop` | `{item, target, zone, key, targetKey}` | Indicator mode: dropped on a valid target |
| `onCancel` | `sortable:cancel` | `{item}` | Esc, a refused drop, or a drop over nothing |
| `onEnd` | `sortable:end` | `{item, changed}` | Every drag, keyboard move and cancel ends here |

`order` and `previous` are arrays of keys. A drag that ends where it began fires `onEnd` with
`changed: false` and no `onSort`.

```javascript
$('#tasks').on('sortable:sort', (e) => console.log(e.detail.order));
```

### `onDrop`

`onDrop` is where indicator mode hands over. Update your data, re-render, and the component
animates the change.

- Return `false` to refuse the drop. The item flies back and `onCancel` fires.
- Return a promise to make the component wait - for a server round trip, say - before animating.
  A rejected promise cancels.
- Without an `onDrop`, the component moves the element itself for `before` and `after`; `into`
  does nothing, because only the host knows what "into" means.

`key` and `targetKey` are the `key` attribute values of the dragged item and the target, so the
handler rarely needs the elements at all.

## Example: a tree

A tree is where indicator mode earns its keep. The data is a nested array; the DOM is a flat render
of it, indented by depth. `nest: true` gives three zones per row, `accepts` stops a node being
dropped into its own subtree, and `onDrop` edits the data and re-renders. Because every row carries
`data-id`, the component matches rows across the re-render and glides each one to its new place.

```html
<div id="tree"></div>
```

```javascript
const tree = [
    {id: 'home', label: 'Home', children: []},
    {id: 'about', label: 'About', children: [
        {id: 'team', label: 'Team', children: []},
        {id: 'history', label: 'History', children: []}
    ]},
    {id: 'contact', label: 'Contact', children: []}
];

// Find a node's parent array and index
const locate = (nodes, id) => {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) return {list: nodes, index: i, node: nodes[i]};
        const found = locate(nodes[i].children, id);
        if (found) return found;
    }
    return null;
};

const isInside = (node, id) =>
    node.children.some((child) => child.id === id || isInside(child, id));

const render = () => {
    const rows = [];
    const walk = (nodes, depth) => nodes.forEach((node) => {
        rows.push(`<div class="tree-row" data-id="${node.id}" style="padding-left: ${depth * 1.5}rem">${_.escape(node.label)}</div>`);
        walk(node.children, depth + 1);
    });
    walk(tree, 0);
    // Not .html(): it sanitises, and would strip the data-id keys the rows are matched by.
    $('#tree').get(0).innerHTML = rows.join('');
};

render();

Domma.elements.sortable('#tree', {
    nest: true,
    // Never into (or beside) its own descendants
    accepts: (item, target) => !isInside(locate(tree, item.dataset.id).node, target.dataset.id),
    onDrop: ({key, targetKey, zone}) => {
        const from = locate(tree, key);
        from.list.splice(from.index, 1);

        const to = locate(tree, targetKey);
        if (zone === 'into') to.node.children.push(from.node);
        else to.list.splice(zone === 'before' ? to.index : to.index + 1, 0, from.node);

        render();   // the component animates this re-render
    }
});
```

The dragged row is removed from the data before the target is looked up again, so the index used
for `before` and `after` is always the current one.

## Handles

With `handle`, only the handle starts a drag, and the rest of the item behaves normally: text can
be selected, links and buttons work. Handles get `.dm-sortable-handle` (a grab cursor and
`touch-action: none`), and handles rendered later are picked up automatically.

```javascript
Domma.elements.sortable('#fields', {handle: '.drag-grip'});
```

Without a handle, a press on an input, textarea, select, button, link or editable region inside an
item does not start a drag, so forms inside items still work.

## Keyboard

In live mode, focus an item (give it `tabindex="0"`) or its handle and press **Alt+Up / Alt+Down**,
or **Alt+Left / Alt+Right** with `axis: 'x'`. The item moves one place, `onSort` fires, the order is
saved, and a polite live region announces "Moved to position 3 of 5" to screen readers. Keys pressed
in a text field inside an item are left alone.

**Esc** cancels a pointer drag in either mode. In live mode everything slides back to where it
started.

`keyboard: false` turns the Alt+Arrow shortcut off.

## Touch

- **With a handle**, a finger on the handle drags straight away. The handle has
  `touch-action: none`, so the page does not scroll instead.
- **Without a handle**, the whole item is draggable, which would make the list impossible to
  scroll. So a finger must **press and hold** for `touchDelay` ms (220 by default) before the drag
  starts; move it before then and it is a scroll, as normal.

Once a drag has started, finger movement never scrolls the page. Near the edge of the scroll area,
`autoScroll` does it instead, faster the closer you get.

A drag that ends over an item does not also click it.

## Persist: a sticky order

`persist` remembers the order. In live mode the component saves the item keys after every sort -
drag or keyboard - and puts them back in that order on the next page load, as soon as the component is created.

```javascript
const list = Domma.elements.sortable('#widgets', {persist: 'dashboard-widgets'});

$('#reset').on('click', () => {
    list.forget();                       // drop the saved order
    list.sort(['sales', 'traffic', 'tasks']);   // and put the default back on screen
});
```

- The order is stored through Domma storage (`S`) under the key `sortable:<persist>` - in
  `localStorage` that is `domma:sortable:<persist>`, because `S` namespaces every key.
- `persist: true` uses the container's `id` as the name, and does nothing if it has none.
- Items added since the order was saved keep their place; items that no longer exist are ignored.
- Indicator mode does not persist: there the host owns the data and should save it itself.

## CSS

| Class | On | Meaning |
|-------|----|---------|
| `.dm-sortable` | Container | Bound |
| `.dm-sortable-active` | Container | A drag is in progress |
| `.dm-sortable-disabled` | Container | `disable()` was called |
| `.dm-sortable-dragging` | `<html>` | A drag is in progress: grabbing cursor, no text selection |
| `.dm-sortable-handle` | Handle | Grab cursor, `touch-action: none` |
| `.dm-sortable-ghost` | Copy | The copy that follows the pointer |
| `.dm-sortable-ghost-lifted` | Copy | Lifted: scaled up with a shadow |
| `.dm-sortable-placeholder` | Item | The item's own slot while it is dragged (faded, dashed outline) |
| `.dm-sortable-landing` | Item | The ghost is flying home; the slot is hidden so the two never double up |
| `.dm-sortable-over` | Item | Indicator mode: the current drop target |
| `.dm-sortable-over-before` / `-after` / `-into` | Item | Which zone of it |
| `.dm-sortable-indicator` | Marker | Indicator mode: the rule or outline; `.is-visible`, `.is-into` |
| `.dm-sortable-live` | Region | Visually hidden screen-reader announcement |

`.dm-sortable-over-*` carries no styling of its own; it is there for you to add a hint, such as a
tinted background on a row that is about to receive a child.

### Custom properties

Every value falls back to a theme token, so an unstyled sortable follows the active theme.

| Property | Default | Affects |
|----------|---------|---------|
| `--dm-sortable-accent` | `--dm-primary` | Indicator rule and `into` outline |
| `--dm-sortable-radius` | `--dm-radius-sm` | Ghost, placeholder and indicator corners |
| `--dm-sortable-ghost-bg` | `--dm-surface` | Ghost background |
| `--dm-sortable-shadow` | `--dm-shadow-lg` | Ghost shadow while lifted |
| `--dm-sortable-lift` | `1.02` | Ghost scale while lifted |

```css
#kanban {
    --dm-sortable-accent: var(--dm-success);
    --dm-sortable-lift: 1.05;
}
```

The ghost is a clone of the item, so it keeps the item's own classes and looks like it. Since it is
appended to the container, container-scoped styles still reach it; set `ghostParent` if the
container clips its overflow.

## Reduced motion

Under `prefers-reduced-motion: reduce` every glide is skipped regardless of `animation`: items move
instantly, the ghost is removed on release rather than flying home, and the CSS transitions on the
ghost, placeholder and indicator are dropped.
