---
title: Sortable
description: "Drag to reorder - by mouse, touch and keyboard - with lists that slide aside, trees that animate their re-render, and an order that sticks"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Sortable" tagline="Drag to reorder - by mouse, touch and keyboard - with lists that slide aside, trees that animate their re-render, and an order that sticks" align="center"][/hero]

## Overview

`E.sortable()` makes the children of a container draggable into a new order. Bind it once to the container: items rendered later are sortable without a refresh, and every item is identified by a key (`data-id` by default) so an order can be reported, saved and restored.

It has two modes. In **live** mode (the default) the other items slide out of the way while you drag. In **indicator** mode (`nest: true`) nothing moves until you let go: a marker shows where the item would land - before, after or into another item - and your code updates its data and re-renders, which the component then animates.

### Key Features

- **Live reordering** - siblings glide aside as you drag, vertically or horizontally
- **Trees** - `nest: true` adds an "into" zone; `onDrop` hands you the move
- **Animated re-renders** - items are matched by key, so a full redraw still glides
- **Sticky order** - `persist` remembers it through Domma storage
- **Handles** - only the grip drags, and the rest of the item works normally
- **Keyboard** - Alt+Arrow moves the focused item, and Esc cancels a drag
- **Touch** - handles drag at once; whole items need a short press-and-hold, so lists still scroll

### Basic Usage

```
const list = E.sortable('#tasks', {
    persist: 'tasks',
    onSort: ({order}) => H.post('/api/tasks/order', {order})
});
```

## Getting Started

A reorderable list that remembers its order, in three steps

### Step 1 - Key the items

Any container works. Give each item a `data-id`: that is what the order is made of. `tabindex="0"` lets keyboard users focus an item and move it.

```
<ul id="tasks">
    <li data-id="write"  tabindex="0">Write the brief</li>
    <li data-id="review" tabindex="0">Review it</li>
    <li data-id="ship"   tabindex="0">Ship it</li>
</ul>
```

### Step 2 - Make it sortable

```
const tasks = E.sortable('#tasks', {
    onSort: ({order, from, to}) => {
        console.log('Moved from', from, 'to', to, '- now', order);
    }
});
```

That is a working list: drag with the mouse, press and hold on a touch screen, or focus an item and press Alt+Up / Alt+Down. `tasks.toArray()` returns the keys in their current order at any time.

### Step 3 - Make the order stick

Add `persist` and the order survives a reload. It is saved through Domma storage under `sortable:<name>` after every move and put back as soon as the component is created. `forget()` drops it again.

```
const tasks = E.sortable('#tasks', {persist: 'tasks'});

$('#reset').on('click', () => {
    tasks.forget();                            // drop the saved order
    tasks.sort(['write', 'review', 'ship']);   // and animate back to the default
});
```

## Live list with a sticky order

Drag the items, or focus one and press `Alt`+`↑` / `↓`. Then reload the page: the order is remembered. *Reset order* forgets it.

[showcase-demo id="showcase/elements/sortable/live-list-with-a-sticky-order" title="Live list with a sticky order" /]

```
const tasks = E.sortable('#demo-tasks', {
    persist: 'showcase-tasks',
    onSort: ({order}) => showSaved(order)
});

$('#demo-tasks-reset').on('click', () => {
    tasks.forget();
    tasks.sort(['brief', 'design', 'build', 'review', 'launch']);
});
```

## A horizontal row

`axis: 'x'` sorts a row. Alt+Left / Alt+Right move the focused card, and dragging near either end of the row scrolls it.

[showcase-demo id="showcase/elements/sortable/a-horizontal-row" title="A horizontal row" /]

```
E.sortable('#demo-row', {axis: 'x'});
```

## A tree: nest and re-render

This tree is drawn from data. Drag a page onto the top or bottom edge of another to drop it beside it, or onto the middle to make it a child. A page cannot be dropped into its own subtree.

[showcase-demo id="showcase/elements/sortable/a-tree-nest-and-re-render" title="A tree: nest and re-render" /]

`nest: true` switches to indicator mode, so nothing moves until the drop. Then `onDrop` gets the dragged item's key, the target's key and the zone. It edits the data and re-renders the whole tree; because every row carries `data-id`, the component finds each row again afterwards and glides it from its old place to its new one.

```
E.sortable('#demo-tree', {
    nest: true,
    // Never into (or beside) its own descendants
    accepts: (item, target) => !contains(locate(tree, item.dataset.id).node, target.dataset.id),
    onDrop: ({key, targetKey, zone}) => {
        const from = locate(tree, key);
        from.list.splice(from.index, 1);           // take it out...

        const to = locate(tree, targetKey);         // ...then look the target up again
        if (zone === 'into') to.node.children.push(from.node);
        else to.list.splice(zone === 'before' ? to.index : to.index + 1, 0, from.node);

        renderTree();                               // the component animates this
    }
});
```

The target is looked up *after* the dragged node has been removed, so the index used for `before` and `after` is always the current one. Return `false` from `onDrop` to refuse a drop, or a promise to wait for the server first.

## Drag by a handle

With `handle`, only the grip starts a drag. The rest of the row behaves normally, so the fields can be typed in and their text selected. On touch a handle drags straight away, with no press-and-hold.

[showcase-demo id="showcase/elements/sortable/drag-by-a-handle" title="Drag by a handle" /]

```
E.sortable('#demo-fields', {handle: '.sx-sort-grip'});
```

Even without a handle, a press on an input, button, link or select inside an item does not start a drag, so forms inside items keep working.

## Events

Every callback also fires as a bubbling `dm:sortable:*` event on the container, with `{instance, args: [detail]}` as `event.detail`. This log listens to all four demos above.

[showcase-demo id="showcase/elements/sortable/events" title="Events" /]

```
$('#demo-tasks').on('dm:sortable:sort', (e) => console.log(e.detail.args[0].order));
```

[table striped="true"]
| Callback | Event | Detail |
| --- | --- | --- |
| `onStart` | `dm:sortable:start` | `{item, from}` |
| `onMove` | `dm:sortable:move` | `{item, target, zone, x, y}` |
| `onSort` | `dm:sortable:sort` | `{item, from, to, order, previous}` - live mode |
| `onDrop` | `dm:sortable:drop` | `{item, target, zone, key, targetKey}` - indicator mode |
| `onCancel` | `dm:sortable:cancel` | `{item}` |
| `onEnd` | `dm:sortable:end` | `{item, changed}` |
[/table]

## Keyboard and touch

[table striped="true"]
| Input | Does |
| --- | --- |
| `Alt` + `↑` / `↓` | Move the focused item one place (live mode) |
| `Alt` + `←` / `→` | The same with `axis: 'x'` |
| `Esc` | Cancel a drag; in live mode everything slides back |
| Finger on a handle | Drags at once |
| Finger on an item with no handle | Press and hold for `touchDelay` ms (220), otherwise it scrolls |
[/table]

Each keyboard move is announced to screen readers ("Moved to position 3 of 5"), and under `prefers-reduced-motion` every glide is skipped.

## Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | string | `null` | Selector for the items; null means the direct children |
| `handle` | string | `null` | Selector inside an item that starts a drag |
| `nest` | boolean | `false` | Adds an "into" zone and switches to indicator mode |
| `live` | boolean \| null | `null` | null means `!nest`; false is indicator mode without nesting |
| `axis` | 'y' \| 'x' | `'y'` | A column or a row |
| `key` | string | `'data-id'` | Attribute that identifies an item across re-renders |
| `animation` | number | `200` | Glide duration in ms; 0 turns it off |
| `easing` | string | `cubic-bezier(…)` | Any CSS easing |
| `threshold` | number | `4` | Pixels before a press becomes a drag |
| `touchDelay` | number | `220` | Press-and-hold in ms for an item with no handle |
| `nestZone` | number | `0.5` | Share of an item's height, centred, that means "into" |
| `accepts` | Function | `null` | `(item, target, zone) => boolean` - veto a drop |
| `disabled` | boolean | `false` | Start disabled |
| `keyboard` | boolean | `true` | Alt+Arrow moves the focused item |
| `persist` | string \| boolean | `false` | Storage name (true = the container id): remember the order |
| `autoScroll` | boolean | `true` | Scroll near the edges while dragging |
| `ghostParent` | Element | `null` | Where the dragged copy lives; null means the container |
[/table]

## Methods

[table striped="true"]
| Method | Description |
| --- | --- |
| `toArray()` | The item keys in their current order |
| `sort(keys, {animate})` | Put the items in that order; items not named keep their slots |
| `restore()` | Re-apply the saved order |
| `forget()` | Remove the saved order from storage |
| `animate(mutate)` | Run a change (or a re-render) and glide every keyed item into place |
| `enable()` / `disable()` | Arm or suspend dragging |
| `dragging` | Getter: whether a drag is in progress |
| `destroy()` | Cancel any drag and detach |
[/table]

## Theming

The dragged copy, the empty slot and the drop marker all take theme tokens by default. Override them per container with custom properties.

```
#kanban {
    --dm-sortable-accent: var(--dm-success);   /* drop marker */
    --dm-sortable-radius: 12px;
    --dm-sortable-ghost-bg: var(--dm-surface);
    --dm-sortable-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
    --dm-sortable-lift: 1.05;                  /* scale while dragged */
}
```

The target in indicator mode carries `.dm-sortable-over-before`, `-after` or `-into`, which the tree above uses to tint the row about to receive a child. See `docs/Sortable.md` for every class.
