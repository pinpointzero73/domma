# Skeleton

Shimmering placeholders shaped like the content on its way - grey bars where text will be, a circle
for an avatar, a block for an image - so the page keeps its layout while data loads. They complement
the Loader (spinner, dots, pulse, bars), which says "busy" but not "what".

```javascript
const posts = await E.skeleton.while('#posts', H.get('/api/posts'), {type: 'card', count: 3});
$('#posts').html(renderPosts(posts));
```

There are two layers:

- **CSS shapes** (`.skeleton`, `.skeleton-text`, `.skeleton-card`, ...) that work in plain HTML, so a
  server-rendered page can ship placeholders in its first paint.
- **`E.skeleton()`**, which writes those shapes into a container, marks it busy for assistive
  technology, and gives back a handle to take them away again.

## E.skeleton(target, options)

`target` is a selector, an element or a Domma collection. The container's current children are moved
aside (not copied), the placeholders go in, and the container gets `aria-busy="true"` plus a visually
hidden `role="status"` saying "Loading...". It returns a handle, or `null` if nothing matched.

```javascript
const sk = E.skeleton('#users', {type: 'list', count: 4});

const users = await H.get('/api/users');
sk.replace(users.map(renderUser).join(''));   // new content instead of the old

// or
sk.remove();                                   // the old content back, exactly as it was
```

`remove()` puts back the very same nodes, so their listeners and state survive. A container that was
empty is left empty. Both `remove()` and `replace()` set `aria-busy="false"`.

Calling `E.skeleton()` on a container that already has a skeleton removes the first one before adding
the new one, so the original content is never lost underneath.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | `'text'` | `'text'`, `'card'`, `'list'`, `'table'` or `'custom'` |
| `lines` | number | 3 (list: 2) | Lines per paragraph, per card, or per list item |
| `count` | number | 1 (list: 3) | Paragraphs, cards or list items |
| `rows` | number | `5` | Table rows |
| `columns` | number | `4` | Table columns |
| `header` | boolean | `true` | Table header row |
| `avatar` | boolean | `true` | A circle at the start of each list item |
| `image` | boolean | `true` | An image block at the top of each card |
| `animate` | boolean | `true` | `false` = a still tint with no sweep (adds `.skeleton-static`) |
| `template` | string \| Function | `null` | Markup for `'custom'`, or `(options) => html` |
| `label` | string | `'Loading...'` | The screen-reader status text |

Counts are capped at 100.

### What each type draws

| Type | Markup |
|------|--------|
| `text` | `count` x `.skeleton-lines` of `lines` x `.skeleton-text`; the last line of each runs to 60% |
| `card` | `count` x `.skeleton-card` - an optional `.skeleton-image` (16:9), then `.skeleton-card-body` with a `.skeleton-heading` and `lines` lines |
| `list` | One `.skeleton-list` of `count` x `.skeleton-list-item` - an optional `.skeleton-circle`, a 50% line and `lines - 1` shorter ones |
| `table` | One `.skeleton-table` with an optional `.skeleton-table-head` row and `rows` x `.skeleton-table-row`, `columns` cells each |
| `custom` | Your `template`, as given |

Cards are siblings in the container, so give the container the layout the real cards will have (a
grid, say) and the placeholders fall into it.

## Handle

| Member | Returns | Does |
|--------|---------|------|
| `remove()` | element | Take the skeleton away and restore the previous children. Safe to call twice |
| `replace(content)` | element | Take it away and show `content` instead. A string is set as HTML (like `$.html()`, but not sanitised - it is your markup); a node or fragment is appended |
| `destroy()` | element | Alias of `remove()` |
| `active` | boolean | Still showing? |
| `element` | Element | The container |
| `options` | Object | The resolved options |

## E.skeleton.while(target, promise, options)

The common case: show a skeleton until a promise settles.

```javascript
try {
    const users = await E.skeleton.while('#users', H.get('/api/users'), {type: 'list'});
    $('#users').html(users.map(renderUser).join(''));
} catch (err) {
    E.toast('Could not load users', {type: 'danger'});
}
```

- **Resolve**: the skeleton is removed (the old content comes back) and `while()` resolves with the
  promise's value. You render into the container as usual.
- **Reject**: the skeleton is removed and the error is rethrown.

`promise` may also be a function returning a promise; a function that throws synchronously rejects
the same way.

## Other helpers

```javascript
E.skeleton.get('#users');      // the live handle, or null
E.skeleton.remove('#users');   // remove by container
E.skeleton.scan(root);         // fill every [data-skeleton] under root (default: document)
E.skeleton.markup({type: 'card'});   // the placeholder HTML as a string
```

## Declarative: data-skeleton

```html
<div id="inbox" data-skeleton="list" data-skeleton-count="2" data-skeleton-avatar="false"></div>
```

```javascript
E.skeleton.scan();
H.get('/api/inbox').then((mail) => E.skeleton.get('#inbox').replace(renderMail(mail)));
```

`data-skeleton` names the type; `data-skeleton-lines`, `-count`, `-rows`, `-columns`, `-avatar`,
`-image`, `-header`, `-animate` and `-label` set the options (`"false"` turns a boolean off). Options
passed to `E.skeleton()` win over the attributes. `scan()` skips containers that already have a
skeleton and returns the new handles. Nothing scans automatically.

`E.skeleton` is also registered with the config engine: `$.setup({'#feed': {component: 'skeleton',
options: {type: 'card'}}})`.

## DataTable: loadingSkeleton

```javascript
const table = T.create('#team', {columns, loadingSkeleton: true});
table.setData(await H.get('/api/team'));        // skeleton rows give way to the data

$('#reload').on('click', async () => {
    table.setLoading(true);                      // skeleton rows again
    table.setData(await H.get('/api/team'));
});
```

With `loadingSkeleton: true` the table draws its real header and `min(pageSize, 5)` skeleton rows
(a number sets the row count) until the first `setData()` or `addRow()`. While loading the `<table>`
has `aria-busy="true"`, a "Loading..." status (`loadingLabel` to change it) is announced, and the
pagination bar is hidden rather than claiming "0 entries". `setLoading(on)` switches it on or off by
hand; `isLoading()` reports it. The rows are `tr.domma-table-skeleton-row`.

## CSS classes

| Class | Shape |
|-------|-------|
| `.skeleton` | The base - tint, sweep, rounded corners. Every shape needs it |
| `.skeleton-text` | A 0.875em line on a 1.5em rhythm, like body copy; `.skeleton-text-sm` is 0.75em |
| `.skeleton-lines` | Groups lines into a paragraph; the last line runs to 60% |
| `.skeleton-w-25`, `-50`, `-75`, `-100` | Line widths (they also override the short last line) |
| `.skeleton-heading` | A card title: 1.25rem high, half width |
| `.skeleton-circle`, `.skeleton-avatar` | 2.5rem circle; `.skeleton-sm` 2rem, `.skeleton-lg` 3.5rem, `.skeleton-xl` 5rem |
| `.skeleton-rect`, `.skeleton-image` | Full-width block, 16:9; `.skeleton-ratio-1x1`, `-4x3`, `-16x9`, `-21x9` |
| `.skeleton-button` | The height of a `.btn`, 6rem wide |
| `.skeleton-card`, `.skeleton-card-body` | The `.card` frame and body padding |
| `.skeleton-list`, `.skeleton-list-item`, `.skeleton-list-item-content` | The `.list-group` frame and item padding |
| `.skeleton-table`, `.skeleton-table-row`, `.skeleton-table-head` | Grid rows with `.table` cell padding |
| `.skeleton-static` | No sweep - on a shape or any ancestor |
| `.skeleton-status` | The visually hidden status text |
| `.is-skeleton-loading` | On a container while `E.skeleton()` has it |

```html
<div class="skeleton-card">
    <div class="skeleton skeleton-image"></div>
    <div class="skeleton-card-body">
        <div class="skeleton skeleton-heading"></div>
        <div class="skeleton-lines">
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
        </div>
    </div>
</div>
```

### Colour and custom properties

The tint is `color-mix(in srgb, var(--dm-text) 10%, var(--dm-surface))`, so it follows every theme:
a light grey on light themes, a slight lift on dark ones. The sweep is a soft band that is lighter
than the shape in both - towards the surface on light themes, towards the text under
`[data-mode="dark"]`.

| Property | Default | Sets |
|----------|---------|------|
| `--dm-skeleton-bg` | the mix above | The shape colour |
| `--dm-skeleton-shine` | surface at 70% / text at 8% | The colour at the centre of the sweep |
| `--dm-skeleton-duration` | `1.6s` | One sweep |
| `--dm-skeleton-columns` | `4` | Columns in a `.skeleton-table` (set inline by `E.skeleton`) |

## Accessibility

- The container is `aria-busy="true"` while the skeleton shows, `"false"` after.
- One visually hidden `role="status"` / `aria-live="polite"` element says "Loading..." (`label`).
- Every shape is `aria-hidden="true"`, so a screen reader hears one status rather than a pile of
  empty boxes.
- The status sits inside the busy container. Most screen readers announce it regardless; if yours
  holds updates in a busy region until it clears, the new content is what gets read, which is also
  fine.

## Reduced motion

Under `prefers-reduced-motion: reduce` the sweep is switched off and the still tint stays.
