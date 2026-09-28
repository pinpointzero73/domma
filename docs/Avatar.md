# Avatar

A person's picture, their initials or an icon - in a circle, a rounded or a square tile - with an
optional status dot and ring. `E.avatarGroup()` stacks several, overlapping, and folds the rest into a
"+N" button that opens a popover naming them.

```javascript
E.avatar('#me', {name: 'Jane Smith', src: '/img/jane.jpg', status: 'online'});

E.avatarGroup('#team', {people: team, max: 4, size: 'sm', label: 'Project team'});
```

There are two layers:

- **CSS** (`.avatar`, `.avatar-lg`, `.avatar-rounded`, `.avatar-tone-3`, `.avatar-status-online`,
  `.avatar-group`, ...) that works in hand-written or server-rendered HTML.
- **`E.avatar()` / `E.avatarGroup()`**, which work out the initials and colour from a name, fall back
  when a picture fails, and write the accessible names.

## E.avatar(target, options)

`target` is a selector, an element or a Domma collection, and that element becomes the avatar: its
children are moved aside (they come back on `destroy()`), and it gets the classes, the content and
the ARIA. With no target - `E.avatar(null, opts)` or just `E.avatar(opts)` - a new `<span>` is made for
you to insert. Returns a handle, or `null` when a selector matches nothing.

```javascript
E.avatar('#author', {name: comment.author, src: comment.photo, size: 'sm'});

const a = E.avatar({name: 'Tom Hughes', status: 'away'});
$('#row').prepend(a.element);
a.update({status: 'online'});
```

Calling `E.avatar()` again on the same element replaces the first avatar.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | string | `null` | The person. Initials, tone and accessible name come from it |
| `src` | string | `null` | Picture URL. If it fails to load, the initials (or icon) take its place |
| `alt` | string | `null` | Accessible name when it should differ from `name` ("Jane, team lead") |
| `size` | string | `'md'` | `xs` 1.5rem, `sm` 2rem, `md` 2.5rem, `lg` 3.5rem, `xl` 5rem |
| `shape` | string | `'circle'` | `circle`, `rounded` or `square` |
| `status` | string | `null` | `online`, `away`, `busy` or `offline` |
| `statusLabels` | object | `null` | Words used for the status in the accessible name, e.g. `{busy: 'in a meeting'}` |
| `icon` | string | `null` | An icon name shown instead of the initials. With no name at all, `user` is shown |
| `title` | string \| `true` | `null` | Hover text; `true` uses the accessible name |
| `ring` | boolean | `false` | A primary-coloured ring, for the current user or a selection |
| `tone` | number | from the name | `0`-`7`, to choose the tint yourself |
| `decorative` | boolean | `false` | `aria-hidden="true"` - for an avatar whose name is written right beside it |

Unknown sizes fall back to `md`, unknown shapes to `circle`, unknown statuses to none.

### Handle

| Member | Description |
|--------|-------------|
| `element` | The avatar element |
| `options` | The options in force |
| `initials`, `tone`, `label` | What was drawn: `'JS'`, `6`, `'Jane Smith (online)'` |
| `update(options)` | Merge options and redraw |
| `destroy()` | Put back the element's previous children, classes, role, aria and title |

### Statics

| Call | Returns | Description |
|------|---------|-------------|
| `E.avatar.scan(root)` | handle[] | Every `[data-avatar]` under `root` (and `root` itself), once |
| `E.avatar.get(el)` | handle \| null | The live handle on an element |
| `E.avatar.initials(name)` | string | The initials rules on their own |
| `E.avatar.tone(name)` | number | The tone the name would get, `0`-`7` |

## Initials

| Name | Initials | Rule |
|------|----------|------|
| `Jane Smith` | `JS` | First and last word |
| `Jane Q. Public` | `JP` | Middle names and initials are skipped |
| `Madonna` | `M` | One word, one letter |
| `jane.smith@example.com` | `JS` | An email address: the part before the `@`, split on `.` `_` `-` `+` |
| `admin@example.com` | `A` | |
| `Jean-Luc Picard` | `JP` | Hyphens split words |
| `Jane Smith (Admin)` | `JS` | Bracketed notes are dropped |
| `"Buzz" Aldrin`, `🚀 Rocket Team` | `BA`, `RT` | Leading punctuation and emoji are skipped |
| `Łukasz Żuk`, `Анна Каренина`, `Νίκος Παππάς` | `ŁŻ`, `АК`, `ΝΠ` | Any alphabet, upper-cased |
| `王小明` | `王` | No spaces: the first character |
| `山田 太郎` | `山太` | |
| `E` + combining acute + `mile Zola` | `ÉZ` | A combining mark stays with its letter |
| empty, `null`, `!!` | `''` | Nothing to use - the `user` icon is shown |

## Colour

The tone is an FNV-1a hash of the name - trimmed, lower-cased, spaces collapsed - modulo eight. It is
the same in every browser, on every page and every visit, and `'jane smith'` matches `'Jane  Smith'`.
When there is no name, `alt` and then `src` are hashed instead.

The eight tints are red, orange, amber, green, teal, sky, blue and violet, built from the fixed palette
tokens (`--dm-red-500` ...; orange, teal and violet are mixes of two). Each is the hue mixed 24% into
`--dm-surface`, with the initials the same hue mixed 30% into `--dm-text`. Because both sides follow the
theme, the tints are pale on light themes and deep on dark ones, and the pair keeps its contrast: across
all 39 themes the weakest measures 5.2:1 (`validate:contrast` checks every one, and it was measured in
Chromium and Firefox). An avatar with no tone - the "+N" bubble, a hand-written `.avatar` - is a neutral
`--dm-text` 12% into `--dm-surface`.

## Declarative: data-avatar

```html
<span data-avatar="Amara Okafor" data-avatar-src="/img/amara.jpg" data-avatar-size="lg" data-avatar-status="online"></span>
<span data-avatar="sofia.rossi@example.com" data-avatar-ring></span>

<script>E.avatar.scan();</script>
```

Attributes: `data-avatar` (the name), `data-avatar-src`, `-alt`, `-size`, `-shape`, `-status`, `-icon`,
`-title`, `-tone`, and the booleans `-ring` and `-decorative` (present = true, `"false"` = false).
`scan()` is not automatic - call it after rendering - and skips elements it has done, including ones
whose avatar was destroyed (`data-avatar-done`).

## E.avatarGroup(target, options)

`target` is a `<ul>` or `<ol>` to fill, or any other element to put a new `<ul>` into (its content
comes back on `destroy()`).

```javascript
const team = E.avatarGroup('#team', {
    people: [
        {name: 'Amara Okafor', src: '/img/amara.jpg', status: 'online', href: '/people/amara'},
        {name: 'Tom Hughes'},
        'Priya Shah'                      // a plain name is fine
    ],
    max: 4,
    size: 'sm',
    label: 'Project team'
});

team.setPeople(await H.get('/api/projects/42/team'));
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `people` | array | `[]` | `{name, src, status, href, alt, icon, tone, title}` or plain names |
| `max` | number | `null` | Show this many, then "+N". `null`, or a number at least the list length, shows everyone |
| `size` | string | `'md'` | As for one avatar; also sets the group's `--dm-avatar-size` |
| `shape` | string | `'circle'` | As for one avatar |
| `overlap` | string \| number | `null` | `none`, `sm` (15%), `md` (25%), `lg` (40%) of the size, a number of pixels, or any CSS length. `null` leaves the stylesheet's 25% |
| `label` | string | `null` | Accessible name for the list |
| `statusLabels` | object | `null` | Passed to every avatar |
| `onMore` | function | `null` | `(hiddenPeople, event)` - called when "+N" is pressed, instead of the popover |
| `popover` | boolean | `true` | `false`: no popover; the hidden names go in the button's `title` |
| `moreLabel` | function | `null` | `(count, names) => string` - the "+N" button's accessible name |

A person with an `href` becomes an `<a class="avatar">`; the others are `<span role="img">`. Every
avatar in a group gets `title` set to its accessible name, so a pointer user can see who is who.

### Group handle

| Member | Description |
|--------|-------------|
| `element` | The `<ul>` |
| `people`, `shown`, `hidden` | Everyone, those drawn, and those folded into "+N" |
| `more` | The "+N" `<button>`, or `null` |
| `popover` | Its `Popover` instance, or `null` |
| `update(options)` | Merge options and redraw |
| `setPeople(people)` | Shorthand for `update({people})` |
| `destroy()` | Remove everything and restore the host |

`E.avatarGroup.get(el)` returns the live handle on a host.

### The "+N" popover

"+N" is a real `<button>`. Its accessible name lists the hidden people - "3 more: Nia Evans, Rhys
Morgan and Sofia Rossi" - so a screen reader hears them without opening anything. Pressing it opens an
`E.popover` (class `avatar-more-popover`, title "3 more") listing each hidden person with a small,
decorative avatar and their name, linked when they have an `href`. It is a click popover: a dialog that
takes focus and gives it back on Esc.

## CSS classes

```html
<ul class="avatar-group avatar-group-md" aria-label="Reviewers">
    <li><span class="avatar avatar-md avatar-tone-3" role="img" aria-label="Nia Evans">
        <span class="avatar-initials" aria-hidden="true">NE</span></span></li>
    <li><span class="avatar avatar-md" role="img" aria-label="Priya Shah (away)">
        <img class="avatar-img" src="/img/priya.jpg" alt="">
        <span class="avatar-status avatar-status-away" aria-hidden="true"></span></span></li>
</ul>
```

| Class | Description |
|-------|-------------|
| `.avatar` | The avatar: neutral tint, content centred, `position: relative` |
| `.avatar-xs` / `-sm` / `-md` / `-lg` / `-xl` | Sizes |
| `.avatar-rounded` / `.avatar-square` | Shapes (circle is the default) |
| `.avatar-tone-0` ... `.avatar-tone-7` | The eight tints |
| `.avatar-ring` | Primary ring |
| `.avatar-img` | The picture, `object-fit: cover` |
| `.avatar-initials`, `.avatar-icon` | The fallbacks |
| `.avatar-img-failed` | Added when the picture failed and the fallback took over |
| `.avatar-status` + `-online` / `-away` / `-busy` / `-offline` | The dot. Busy carries a bar and offline is hollow, so colour is not the only difference |
| `.avatar-group` | A flex row, list styling removed; items overlap |
| `.avatar-group-xs` ... `-xl` | Sets the size for the whole group |
| `.avatar-more` | The "+N" bubble |
| `.avatar-more-list`, `.avatar-more-person`, `.avatar-more-name` | Inside the popover |

### Custom properties

| Property | Default | Description |
|----------|---------|-------------|
| `--dm-avatar-size` | `2.5rem` | Set by the size classes; font, dot and overlap scale from it |
| `--dm-avatar-radius` | `--dm-radius-full` | Set by the shape classes |
| `--dm-avatar-overlap` | 25% of the size | How far each avatar in a group slides under its neighbour |
| `--dm-avatar-gap-color` | `--dm-background` | The ring between stacked avatars and round the status dot. Inside a `.card` it is the card colour, inside a popover the surface. Set it wherever avatars sit on something else |
| `--dm-avatar-z` | none | Set by `E.avatarGroup()` on each item, highest first, so each avatar sits over the next and its dot stays in view. A hand-written group stacks later-on-top unless you set it |

## Accessibility

- An avatar is `role="img"` with `aria-label`: `alt` or `name`, plus the status in words.
- An avatar that is a link or button keeps its role and gets `aria-label`.
- The picture has `alt=""`; initials, icon and dot are `aria-hidden`, so nothing is read twice.
- An avatar with nothing to say (no name, no alt, no status) is `aria-hidden`, as is `decorative: true`.
- A group is a `<ul>`; `label` names it.
- "+N" is a `<button type="button">` named with the hidden people; its popover is a dialog.
- The hover lift in a group is off under `prefers-reduced-motion: reduce`.

## Config engine

`avatar` and `avatarGroup` are registered with `$.setup()`:

```javascript
$.setup({
    '#me':   {component: 'avatar', options: {name: 'Jane Smith', status: 'online'}},
    '#team': {component: 'avatarGroup', options: {people: team, max: 3}}
});
```
