---
title: Virtual List
description: "A hundred thousand rows, scrolled like thirty - only what is on screen is rendered, with measured heights, keyboard navigation and infinite loading"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Virtual List" tagline="A hundred thousand rows, scrolled like thirty - only what is on screen is rendered, with measured heights, keyboard navigation and infinite loading" align="center"][/hero]

## Overview

`E.virtualList()` renders a long list inside a scrolling container, but only the rows in view (plus a few either side). Scrolling re-uses the rows it has, places them with a transform and leaves everything else out of the page, so a list of 100,000 records costs about as much as a list of thirty.

The container is the scroller. Give it a height in CSS - a fixed height, a `max-height` or a flex child with `min-height: 0` - and the list fills it.

### Key Features

- **Fixed or measured rows** - `itemHeight: 40`, or `'auto'` with a cached height per row
- **Stable scrolling** - rows above the view that change height do not move what you are reading
- **Infinite loading** - `loadMore()` near the end, with loading, end and retry rows
- **Keyed rows** - `keyField` re-uses rows across updates; `prepend()` keeps your place
- **Keyboard** - arrows, Page Up/Down, Home/End and Enter; the focused row is never lost
- **Safe** - strings from `render()` are sanitised; return an Element for your own nodes

### Basic Usage

```
const list = E.virtualList('#people', {
    items: people,                       // any array
    itemHeight: 40,
    keyField: 'id',
    render: (p) => `<strong>${_.escape(p.name)}</strong> ${_.escape(p.email)}`,
    onItemClick: (p) => openProfile(p.id)
});
list.scrollToIndex(500, {align: 'center'});
```

## 100,000 fixed-height rows

[showcase-demo id="showcase/elements/virtual-list/100-000-fixed-height-rows" title="100,000 fixed-height rows" /]

```
const rows = Array.from({length: 100000}, (_, i) => ({id: i, name: 'Customer ' + i, total: (i * 7919) % 10000}));

const big = E.virtualList('#demo-big', {
    items: rows,
    itemHeight: 40,
    keyField: 'id',
    label: 'Customers',
    render: (r) => `<span class="sx-vl-num">#${r.id}</span>
                   <span class="sx-vl-grow">${_.escape(r.name)}</span>
                   <span class="sx-vl-amount">£${(r.total / 100).toFixed(2)}</span>`,
    onItemClick: (r) => E.toast('Clicked ' + r.name)
});

$('#demo-big-go').on('click', () => big.scrollToIndex(Number($('#demo-big-index').val()), {align: 'center'}));
big.on('scroll', ({start, end}) => $('#demo-big-range').text(start + ' - ' + end));
```

## Rows of different heights

With `itemHeight: 'auto'` each row is measured once it is rendered (and again if it changes size), and rows not yet seen count as `estimatedItemHeight`. The heights are cached by key. "Load older" prepends twenty messages: the one you are reading stays where it is.

[showcase-demo id="showcase/elements/virtual-list/rows-of-different-heights" title="Rows of different heights" /]

```
const chat = E.virtualList('#demo-chat', {
    items: messages,
    itemHeight: 'auto',
    estimatedItemHeight: 72,
    keyField: 'id',
    rowClass: 'sx-vl-msg',
    label: 'Messages',
    render: (m) => `<span class="sx-vl-who">${_.escape(m.who)}</span>
                   <span class="sx-vl-when">${_.escape(m.when)}</span>
                   <p class="sx-vl-text">${_.escape(m.text)}</p>`
});
chat.scrollToIndex(messages.length - 1, {align: 'end'});

$('#demo-chat-older').on('click', () => chat.prepend(olderMessages(20)));
$('#demo-chat-bottom').on('click', () => chat.scrollToIndex(chat.count - 1, {align: 'end'}));
```

## Infinite feed

`loadMore()` is called whenever the end is within `threshold` px. It returns a promise of the next items - or of `{items, done}`. Only one load runs at a time; an empty page or `done: true` ends the list. This fake source takes half a second a page, fails once on page three (press Retry) and stops after eight pages.

[showcase-demo id="showcase/elements/virtual-list/infinite-feed" title="Infinite feed" /]

```
const feed = E.virtualList('#demo-feed', {
    itemHeight: 'auto',
    estimatedItemHeight: 96,
    keyField: 'id',
    rowClass: 'sx-vl-post',
    label: 'Posts',
    threshold: 300,
    loadMore: ({page}) => fetchPage(page),      // H.get('/api/posts?page=' + page) in real life
    endTemplate: 'You are all caught up.',
    render: (p) => `<p class="sx-vl-post-title">${_.escape(p.title)}</p>
                   <p class="sx-vl-post-body">${_.escape(p.body)}</p>`
});
// a failed page shows the error row; its Retry button calls feed.retry()
```

## Events

Every event is an `onX` option, an `.on('x')` listener and a bubbling `dm:virtual-list:x` DOM event (`detail = {instance, args}`). This log is one `document` listener: it hears the feed loading and clicks on any of the lists above.

[showcase-demo id="showcase/elements/virtual-list/events" title="Events" /]

```
const EVENTS = 'dm:virtual-list:loadmore dm:virtual-list:loaded dm:virtual-list:end ' +
    'dm:virtual-list:error dm:virtual-list:itemclick';
const onEvent = (e) => {
    const {instance} = e.detail;          // detail = {instance, args}
    log(instance.options.label + ': ' + e.type.split(':').pop());
};
$(document).on(EVENTS, onEvent);
// teardown: $(document).off(EVENTS, onEvent)

feed.on('error', (err) => console.warn(err.message));   // or on one list
```

[table striped="true"]
| Event | Arguments | When |
| --- | --- | --- |
| `render` | `({start, end})` | The rendered range (overscan included) changed |
| `scroll` | `({start, end})` | Once per frame while scrolling: the rows on screen |
| `loadmore` | `({count, page})` | A `loadMore()` call starts |
| `loaded` | `(items)` | A page arrived |
| `end` | - | `loadMore()` said there is nothing more |
| `error` | `(error)` | `loadMore()` failed; the retry row shows |
| `itemclick` | `(item, index, event)` | A row was clicked, or Enter pressed on it |
[/table]

## Keyboard and screen readers

The rows sit in a `role="list"` and are `role="listitem"` with `aria-posinset` and `aria-setsize` (`-1` while an infinite list can still grow), so a screen reader announces "row 50,001 of 100,000" even though only a handful exist. The list is one tab stop (roving `tabindex`). The focused row stays rendered when you scroll it out of view, so focus is never dropped onto the page.

[table striped="true"]
| Key | Does |
| --- | --- |
| ↑ ↓ | Previous / next row |
| Page Up Page Down | A screenful up / down |
| Home End | First / last row |
| Enter | Fires `itemclick` |
[/table]

## Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | array | `[]` | The data |
| `count` + `getItem` | number, function | - | Instead of `items`: rows served on demand by `getItem(index)` |
| `itemHeight` | number \| `'auto'` | `40` | Fixed px height, or measure each row |
| `estimatedItemHeight` | number | `40` | Height assumed for rows not yet measured |
| `overscan` | number | `4` | Rows rendered beyond each edge |
| `render` | function | the item as text | `(item, index)` → HTML string or Element |
| `safe` | boolean | `true` | `false` inserts `render()` strings without sanitising |
| `keyField` | string \| function | the index | A stable key per item; rows and measured heights follow it |
| `label` | string | `null` | The list's `aria-label` |
| `rowClass` | string | `''` | Extra class on every row |
| `loadMore` | function | `null` | `({count, page})` → Promise of `items[]` or `{items, done}` |
| `threshold` | number | `200` | px from the end at which to load |
| `loadingTemplate` / `endTemplate` / `errorTemplate` | string \| Element \| function | built in / none / built in | The status row; a `[data-vlist-retry]` element in it retries |
[/table]

## Methods

[table striped="true"]
| Method | Description |
| --- | --- |
| `setItems(items)` | Replace the data (and reset infinite loading) |
| `append(items)` / `prepend(items)` | Add at the end / at the start without moving the view |
| `update(indexOrKey, item)` | Replace one item; a number is an index, anything else a key |
| `indexOfKey(key)` | The index of an item by key |
| `scrollToIndex(i, {align, smooth})` | `align`: `start`, `center`, `end` or `auto` (only if out of view) |
| `focusIndex(i)` | Scroll to a row and focus it |
| `getVisibleRange()` / `getRenderedRange()` | `{start, end}`, inclusive |
| `refresh()` | Re-render (and re-measure) the rendered rows |
| `retry()` / `isDone()` | Retry a failed load / whether loading has ended |
| `count` | The number of rows (a property) |
| `setCount(n)` | Count mode: change the number of rows |
| `destroy()` | Remove the rows and listeners and give the container its own children back |
[/table]
