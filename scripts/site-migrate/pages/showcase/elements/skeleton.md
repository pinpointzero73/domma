---
title: Skeleton
description: "Shimmering placeholders shaped like the content on its way - so the page keeps its layout while data loads"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Skeleton" tagline="Shimmering placeholders shaped like the content on its way - so the page keeps its layout while data loads" align="center"][/hero]

## Overview

A spinner says "busy". A skeleton says *what* is coming: grey bars where the text will be, a circle for the avatar, a block for the image. The page does not jump when the data lands, and the wait feels shorter because the shape is already there.

The shapes are plain CSS classes - `.skeleton-text`, `.skeleton-card` and friends - so they work in hand-written HTML. `E.skeleton()` writes them into a container for you, tells screen readers the container is loading, and puts things back when you are done. `E.skeleton.while()` does all of that around a promise.

### Key Features

- **Ready-made shapes** - text, card, list and table, or your own markup
- **Theme-aware** - tinted from the theme's own text and surface, quiet on light and dark
- **Promise helper** - `E.skeleton.while(target, promise)` shows it until the promise settles
- **Nothing lost** - `remove()` puts back the very same nodes, listeners and all
- **Accessible** - `aria-busy` and a polite "Loading..." status; the shapes are hidden from screen readers
- **Reduced motion** - no sweep, just the still tint
- **DataTable** - `loadingSkeleton: true` shows skeleton rows until the data arrives

### Basic Usage

```
const posts = await E.skeleton.while('#posts', H.get('/api/posts'), {type: 'card', count: 3});
$('#posts').html(renderPosts(posts));
```

## Getting Started

A list that shows placeholders while it loads, in three steps

### Step 1 - A container

Any element will do. The skeleton goes inside it, so give it the layout the real content will have - a grid for cards, a plain block for a list.

```
<div id="users"></div>
```

### Step 2 - Show a skeleton while you load

Hand `E.skeleton.while()` the container, the promise and the shape. It resolves with the promise's value once the skeleton has gone, so you render into a clean container.

```
const users = await E.skeleton.while('#users', H.get('/api/users'), {type: 'list', count: 4});
$('#users').html(users.map(renderUser).join(''));
```

### Step 3 - Handle failure

If the promise rejects, the skeleton is removed - whatever was in the container before comes back - and the error is rethrown for you to catch.

```
try {
    const users = await E.skeleton.while('#users', H.get('/api/users'), {type: 'list'});
    $('#users').html(users.map(renderUser).join(''));
} catch (err) {
    E.toast('Could not load users', {type: 'danger'});
}
```

Want to drive it yourself? `E.skeleton()` returns a handle: `remove()` restores the old content, `replace(html)` swaps in new content.

```
const sk = E.skeleton('#users', {type: 'list'});
const users = await H.get('/api/users');
sk.replace(users.map(renderUser).join(''));
```

## Cards: load with E.skeleton.while

Press *Load*: a pretend request takes a moment and the cards swap in where the placeholders were. The skeleton card has the same frame, padding and 16:9 image as a real `.card`.

[showcase-demo id="showcase/elements/skeleton/cards-load-with-e-skeleton-while" title="Cards: load with E.skeleton.while" /]

```
$('#demo-cards-load').on('click', async () => {
    const posts = await E.skeleton.while('#demo-cards', pretendLoad(POSTS), {type: 'card', count: 3});
    $('#demo-cards').html(posts.map(renderPost).join(''));
});
```

## A list, and what happens on failure

*Load* fills the list. *Load and fail* rejects instead: the skeleton goes, the list you had comes back untouched, and the error reaches your `catch`.

[showcase-demo id="showcase/elements/skeleton/a-list-and-what-happens-on-failure" title="A list, and what happens on failure" /]

```
try {
    const people = await E.skeleton.while('#demo-list', pretendLoad(PEOPLE, fail), {type: 'list', count: 4});
    $('#demo-list').html(renderPeople(people));
} catch (err) {
    E.toast(err.message, {type: 'danger'});   // the old list is back already
}
```

## DataTable: loadingSkeleton

`T.create(sel, {loadingSkeleton: true})` draws skeleton rows under the real header until the first `setData()` or `addRow()`. `setLoading(true)` brings them back for a reload. Pass a number instead of `true` for that many rows.

[showcase-demo id="showcase/elements/skeleton/datatable-loadingskeleton" title="DataTable: loadingSkeleton" /]

```
const table = T.create('#demo-table', {
    columns: ['name', 'role', 'city'].map((key) => ({key, title: _.capitalize(key)})),
    loadingSkeleton: true,
    pageSize: 5
});
table.setData(await H.get('/api/team'));

$('#demo-table-reload').on('click', async () => {
    table.setLoading(true);
    table.setData(await H.get('/api/team'));
});
```

## Every type

The same call with a different `type`. Untick *Animate* for `animate: false`, a still tint with no sweep.

[showcase-demo id="showcase/elements/skeleton/every-type" title="Every type" /]

## CSS only: the shapes by hand

No JavaScript needed. Put the shapes in your markup - server-rendered pages can ship them in the first paint - and swap the content in when it is ready.

[showcase-demo id="showcase/elements/skeleton/css-only-the-shapes-by-hand" title="CSS only: the shapes by hand" /]

```
<div class="skeleton skeleton-circle skeleton-lg"></div>
<div class="skeleton skeleton-heading"></div>
<div class="skeleton-lines">
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text"></div>   <!-- the last line runs short -->
</div>
<span class="skeleton skeleton-button"></span>
<div class="skeleton skeleton-image skeleton-ratio-4x3"></div>
```

[table striped="true"]
| Class | Shape |
| --- | --- |
| `.skeleton` | The base: tint, sweep and rounded corners. Every shape needs it |
| `.skeleton-text` | A line of body text; `.skeleton-text-sm` for small print |
| `.skeleton-lines` | Wraps lines as a paragraph; its last line runs to 60% |
| `.skeleton-w-25` / `-50` / `-75` / `-100` | Line widths |
| `.skeleton-heading` | A card title |
| `.skeleton-circle` / `.skeleton-avatar` | 2.5rem circle; `.skeleton-sm`, `-lg`, `-xl` |
| `.skeleton-rect` / `.skeleton-image` | Full-width 16:9 block; `.skeleton-ratio-1x1`, `-4x3`, `-16x9`, `-21x9` |
| `.skeleton-button` | The size of a `.btn` |
| `.skeleton-card` | Card frame; holds `.skeleton-image` and `.skeleton-card-body` |
| `.skeleton-list` / `.skeleton-list-item` | List-group frame; items hold a circle and `.skeleton-list-item-content` |
| `.skeleton-table` / `.skeleton-table-row` | Rows of cells; `.skeleton-table-head` for the header, `--dm-skeleton-columns` for the count |
| `.skeleton-static` | No sweep, on a shape or any ancestor |
[/table]

## Declarative: data-skeleton

Mark containers with `data-skeleton="type"` and `data-skeleton-*` options, then call `E.skeleton.scan()` once. Take one away with `E.skeleton.remove(el)` or the handle's `replace()`.

[showcase-demo id="showcase/elements/skeleton/declarative-data-skeleton" title="Declarative: data-skeleton" /]

```
<div id="inbox" data-skeleton="list" data-skeleton-count="2" data-skeleton-avatar="false"></div>

<script>
    E.skeleton.scan();
    H.get('/api/inbox').then((mail) => E.skeleton.get('#inbox').replace(renderMail(mail)));
</script>
```

## Accessibility and motion

- The container gets `aria-busy="true"` while the skeleton is up and `"false"` after.
- A visually hidden `role="status"` (`aria-live="polite"`) says "Loading..." - change it with `label`.
- The shapes carry `aria-hidden="true"`: a screen reader hears one status, not forty grey boxes.
- Under `prefers-reduced-motion: reduce` the sweep is switched off and the still tint stays.

The tint is the theme's text colour mixed 10% into its surface, so it follows every theme. Override it with `--dm-skeleton-bg`, the sweep with `--dm-skeleton-shine` and its speed with `--dm-skeleton-duration`.

## Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | string | `'text'` | `'text'`, `'card'`, `'list'`, `'table'` or `'custom'` |
| `lines` | number | 3 (list: 2) | Lines per paragraph, per card, or per list item |
| `count` | number | 1 (list: 3) | How many paragraphs, cards or list items |
| `rows` | number | `5` | Table rows |
| `columns` | number | `4` | Table columns |
| `header` | boolean | `true` | Table header row |
| `avatar` | boolean | `true` | A circle at the start of each list item |
| `image` | boolean | `true` | An image block at the top of each card |
| `animate` | boolean | `true` | false = still tint, no sweep |
| `template` | string \| Function | `null` | Markup for `'custom'`, or `(options) => html` |
| `label` | string | `'Loading...'` | The screen-reader status |
[/table]

### Methods

[table striped="true"]
| Call | Returns | Does |
| --- | --- | --- |
| `E.skeleton(target, options)` | handle | Fill the container; a second call starts again from the original content |
| `handle.remove()` | element | Take the skeleton away and restore the previous children |
| `handle.replace(content)` | element | Take it away and show `content` instead - an HTML string or a node |
| `handle.active` | boolean | Whether it is still showing |
| `E.skeleton.while(target, promise, options)` | Promise | Show it until the promise (or a function returning one) settles; resolves or rejects with it |
| `E.skeleton.get(target)` | handle \| null | The live handle on a container |
| `E.skeleton.remove(target)` | element \| null | Remove by container |
| `E.skeleton.scan(root)` | handle[] | Fill every `[data-skeleton]` under `root` |
| `E.skeleton.markup(options)` | string | The placeholder HTML alone |
[/table]
