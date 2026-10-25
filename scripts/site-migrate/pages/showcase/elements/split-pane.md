---
title: Split Pane
description: "Resizable panes with draggable, keyboard-operable gutters - side by side or stacked, nested, collapsible and remembered"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Split Pane" tagline="Resizable panes with draggable, keyboard-operable gutters - side by side or stacked, nested, collapsible and remembered" align="center"][/hero]

## Overview

`E.splitPane()` turns the children of a container into panes and puts a gutter between each pair. Drag a gutter, or focus it and use the arrow keys, to share the space differently. It is what editors, mail clients and dashboards with a resizable sidebar are made of.

It is plain flexbox: each pane gets a `flex-basis` worked out from its share, nothing is absolutely positioned, and the container keeps its own size from your CSS. Sizes are percentages of the space the panes share, so the layout scales when the window does.

### Key Features

- **Two or more panes**, side by side (`horizontal`) or stacked (`vertical`)
- **Limits** - `minSize` / `maxSize` in px or %, per pane, with `snapOffset`
- **Collapsible** - double-click, a gutter button, Enter, or `collapse(i)` / `expand(i)`
- **Remembered** - `persistKey` stores the sizes with `S` and restores them
- **Nests**, works right to left, and keeps iframes from swallowing a drag
- **Accessible** - gutters are focusable `role="separator"` elements with live values

### Basic Usage

```
<div id="editor" style="height: 20rem">
    <div>Files</div>
    <div>Editor</div>
</div>
```

```
const split = E.splitPane('#editor', {sizes: [30, 70], minSize: 120});
split.on('dragend', (sizes) => console.log(sizes)); // [34.5, 65.5]
```

## Two panes

Drag the gutter, or Tab to it and press the arrow keys (Shift for bigger steps, Home and End for the limits). Neither pane goes below 120px.

[showcase-demo id="showcase/elements/split-pane/two-panes" title="Two panes" /]

```
const basic = E.splitPane('#demo-basic', {sizes: [30, 70], minSize: 120});
basic.on('resize', (sizes) => $('#demo-basic-out').text(sizes.map(Math.round).join(' / ')));
```

## Nested, collapsible and remembered

Three panes across, the middle one split again top to bottom. The file list collapses (double-click its gutter, use the small button, or focus the gutter and press Enter). The preview is an `<iframe>`: dragging over it still works, because the panes stop taking pointer events while a drag is on. The sizes are stored under `persistKey` - reload the page and they come back.

[showcase-demo id="showcase/elements/split-pane/nested-collapsible-and-remembered" title="Nested, collapsible and remembered" /]

```
const ide = E.splitPane('#demo-ide', {
    sizes: [20, 50, 30],
    minSize: [140, 200, 160],
    collapsible: [true, false, false],
    collapseButton: true,
    persistKey: 'showcase-ide'
});
const middle = E.splitPane('#demo-ide-middle', {
    direction: 'vertical',
    sizes: [65, 35],
    minSize: 60,
    persistKey: 'showcase-ide-middle'
});

const label = () => $('#demo-ide-toggle').text(ide.isCollapsed(0) ? 'Expand files' : 'Collapse files');
ide.on('collapse', label);
ide.on('expand', label);

$('#demo-ide-toggle').on('click', () => ide.isCollapsed(0) ? ide.expand(0) : ide.collapse(0));
$('#demo-ide-reset').on('click', () => { ide.setSizes([20, 50, 30]); middle.setSizes([65, 35]); });
```

## Stacked, with snapping

`direction: 'vertical'` stacks the panes. With `snapOffset: 40` a pane dragged within 40px of its minimum snaps to it, so a console can be put "away" without pixel hunting.

[showcase-demo id="showcase/elements/split-pane/stacked-with-snapping" title="Stacked, with snapping" /]

```
E.splitPane('#demo-vertical', {direction: 'vertical', sizes: [70, 30], minSize: 40, snapOffset: 40});
```

## Right to left

In a `dir="rtl"` container the first pane is on the right; dragging and the arrow keys follow what you see.

[showcase-demo id="showcase/elements/split-pane/right-to-left" title="Right to left" /]

```
E.splitPane('#demo-rtl', {sizes: [40, 60]});
```

## Events

Every event is an `onX` option, an `.on('x')` listener and a bubbling `dm:split-pane:x` DOM event (`detail = {instance, args}`). Return `false` from `onBeforeDrag` to refuse a drag. This pane logs its drags through `.on()` and its collapsing through the DOM events.

[showcase-demo id="showcase/elements/split-pane/events" title="Events" /]

```
const split = E.splitPane('#demo-events', {sizes: [30, 70], minSize: 120, collapsible: [true, false]});
split.on('dragend', (sizes) => log('dragend: ' + sizes.map(Math.round).join(' / ')));

// detail = {instance, args}
$('#demo-events').on('dm:split-pane:collapse', (e) => log('collapse: pane ' + e.detail.args[0]));
```

[table striped="true"]
| Event | Arguments | When |
| --- | --- | --- |
| `beforedrag` | `(gutterIndex, event)` | Pointer down on a gutter; cancelable |
| `dragstart` | `(sizes, gutterIndex)` | A drag begins |
| `drag` | `(sizes, gutterIndex)` | Each move that changes the sizes |
| `dragend` | `(sizes, gutterIndex)` | The pointer is released |
| `resize` | `(sizes)` | Any change of size - drag, keys, `setSizes`, collapse |
| `collapse` / `expand` | `(paneIndex)` | A pane collapses or opens again |
[/table]

## Keyboard and screen readers

Each gutter is a focusable `role="separator"` with `aria-orientation`, `aria-valuenow` (the size of the pane before it, in %), `aria-valuemin` / `aria-valuemax` and `aria-controls` pointing at that pane.

[table striped="true"]
| Key | Does |
| --- | --- |
| ← → (side by side) / ↑ ↓ (stacked) | Move the gutter by `step` (1%) |
| Shift + arrow | Move by `largeStep` (10%) |
| Home / End | The pane before the gutter to its minimum / maximum |
| Enter | Collapse or expand, when a pane next to the gutter is collapsible |
[/table]

## Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | string | `'horizontal'` | `'horizontal'` (side by side) or `'vertical'` (stacked) |
| `sizes` | number[] | equal | Percentages, one per pane; scaled to add up to 100 |
| `minSize` / `maxSize` | number \| string \| array | `0` / `null` | px (`120`) or percent (`'20%'`); an array sets each pane |
| `gutterSize` | number | `8` | Gutter thickness in px |
| `snapOffset` | number | `0` | Snap to a limit when dragged within this many px of it |
| `collapsible` | boolean \| boolean[] | `false` | Which panes the gutter gestures collapse |
| `collapsedSize` | number \| string | `0` | What a collapsed pane shrinks to |
| `collapseButton` | boolean | `false` | A small toggle button in gutters next to a collapsible pane |
| `persistKey` | string | `null` | Store sizes and collapse state with `S` under `split-pane:<key>` |
| `cursor` | string | `col-resize` / `row-resize` | Gutter cursor |
| `disabled` | boolean | `false` | No dragging or keys; gutters leave the tab order |
| `step` / `largeStep` | number | `1` / `10` | Percent per arrow key / Shift+arrow |
| `gutterLabel` | string | `'Resize panes'` | The gutters' `aria-label` |
[/table]

## Methods

[table striped="true"]
| Method | Description |
| --- | --- |
| `getSizes()` | Current sizes, percentages that add up to 100 |
| `setSizes(sizes)` | Set every pane's size (clamped to the limits; expands collapsed panes) |
| `collapse(i)` / `expand(i)` | Collapse a pane toward its edge / give it its size back |
| `isCollapsed(i)` | Whether a pane is collapsed |
| `setOptions(opts)` | Change `disabled`, limits, gutter size, cursor, collapsing |
| `destroy()` | Remove the gutters and listeners and give the panes their own styles back |
| `panes` | The pane elements |
[/table]

## Theming

Gutters use `--dm-border`, turning `--dm-primary` on hover and while dragging, with a focus outline in `--dm-primary`. The container carries `.dm-split-horizontal` / `.dm-split-vertical` and `.dm-split-dragging` during a drag; collapsed panes carry `.dm-split-collapsed`.

```
#editor > .dm-split-gutter { background: transparent; }
#editor > .dm-split-gutter:hover { background: var(--dm-hover-bg); }
```
