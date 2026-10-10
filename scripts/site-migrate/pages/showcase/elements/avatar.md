---
title: Avatar
description: "A person's picture, initials or an icon - alone, or stacked in a group with a \"+N\" for the rest"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Avatar" tagline="A person's picture, initials or an icon - alone, or stacked in a group with a '+N' for the rest" align="center"][/hero]

## Overview

Every app with people in it needs the little circle: the signed-in user in the navbar, the author of a comment, the team on a project card. `E.avatar()` draws one from a name - initials and a colour that stays the same wherever that name appears - or from a picture, falling back to the initials if the picture will not load.

`E.avatarGroup()` stacks several, overlapping, and folds the rest into a **+N** bubble. Press it and a popover lists who is hidden.

### Key Features

- **Initials that make sense** - first and last word, one letter for a single name, the part before the @ of an email, any script
- **Stable colours** - the name picks one of eight tints, the same on every page and every visit
- **AA on every theme** - tints and initials both follow the theme; the weakest pair measures 5.2:1
- **Picture fallback** - a broken image turns back into the initials
- **Five sizes, three shapes**, a status dot and a ring
- **Groups** - overlap, a ring in the background colour, a hover lift, "+N" with a popover
- **Accessible** - each avatar has a name (with its status in words), a group is a list
- **Declarative** - `data-avatar="Jane Smith"` and `E.avatar.scan()`

### Basic Usage

```
E.avatar('#me', {name: 'Jane Smith', src: '/img/jane.jpg', status: 'online'});

E.avatarGroup('#team', {people: team, max: 4, size: 'sm', label: 'Project team'});
```

## Getting Started

A comment header and a project team, in three steps

### Step 1 - One avatar from a name

Give it an element and a name. The element becomes the avatar: initials, a tint, and an accessible name for screen readers. Pass options without a target and you get a new `<span>` back to insert yourself.

```
E.avatar('#author', {name: comment.author, size: 'sm'});

const a = E.avatar({name: 'Tom Hughes'});   // no target: a detached span
$('#row').prepend(a.element);
```

### Step 2 - Add the picture

Add `src`. Until it loads the tint shows; if it fails, the initials take its place. The picture itself has an empty `alt` - the avatar already carries the person's name.

```
E.avatar('#author', {name: comment.author, src: comment.authorPhoto, size: 'sm'});
```

### Step 3 - A team

Hand `E.avatarGroup()` the people. `max` caps how many show; the rest go into "+N", which opens a popover naming them. Give each person an `href` and their avatar becomes a link.

```
const team = await H.get('/api/projects/42/team');
E.avatarGroup('#team', {
    people: team.map((u) => ({name: u.name, src: u.photo, href: `/people/${u.id}`})),
    max: 4,
    size: 'sm',
    label: 'Project team'
});
```

## Try a name

Type anything - a full name, a single name, an email address, a name in another script. The initials and the colour are worked out as you type. The same name always gets the same colour.

[showcase-demo id="showcase/elements/avatar/try-a-name" title="Try a name" /]

```
const me = E.avatar('#demo-try-avatar', {name: 'Jane Smith', size: 'xl'});
$('#demo-try-input').on('input', (e) => me.update({name: e.target.value}));

E.avatar.initials('jane.smith@example.com');   // 'JS'
E.avatar.tone('Jane Smith');                   // 6 - always
```

[table striped="true"]
| Name | Initials | Rule |
| --- | --- | --- |
| Jane Smith | `JS` | First and last word |
| Jane Q. Public | `JP` | Middle names and initials are skipped |
| Madonna | `M` | One word, one letter |
| jane.smith@example.com | `JS` | An email: the part before the @, split on `. _ - +` |
| Jean-Luc Picard | `JP` | Hyphens split words |
| Jane Smith (Admin) | `JS` | Bracketed notes are dropped |
| Łukasz Żuk / Анна Каренина | `ŁŻ` / `АК` | Any alphabet |
| 王小明 | `王` | No spaces: the first character |
| (empty) | - | A person icon instead |
[/table]

## Sizes and shapes

`size`: `xs` (1.5rem), `sm` (2rem), `md` (2.5rem, the default), `lg` (3.5rem), `xl` (5rem). `shape`: `circle` (default), `rounded` or `square`. The initials, dot and overlap scale with the size.

[showcase-demo id="showcase/elements/avatar/sizes-and-shapes" title="Sizes and shapes" /]

```
['xs', 'sm', 'md', 'lg', 'xl'].forEach((size) =>
    $('#demo-sizes').append(E.avatar({name: 'Amara Okafor', size}).element));

['circle', 'rounded', 'square'].forEach((shape) =>
    $('#demo-shapes').append(E.avatar({name: 'Tom Hughes', src: 'img/tom.svg', size: 'lg', shape}).element));
```

## Pictures, initials, icons and fallbacks

A picture; a picture whose address is wrong (the initials take over); no picture; an icon of your choice; and nothing at all, which shows the person icon and is hidden from screen readers because there is nothing to say.

[showcase-demo id="showcase/elements/avatar/pictures-initials-icons-and-fallbacks" title="Pictures, initials, icons and fallbacks" /]

```
E.avatar(el1, {name: 'Priya Shah', src: 'img/priya.svg', size: 'lg'});
E.avatar(el2, {name: 'Callum Reid', src: 'img/does-not-exist.png', size: 'lg'});   // shows CR
E.avatar(el3, {name: 'Nia Evans', size: 'lg'});
E.avatar(el4, {name: 'Support team', icon: 'headphones', size: 'lg'});
E.avatar(el5, {size: 'lg'});                                                       // person icon
```

## Status and ring

`status` adds a dot: `online`, `away`, `busy` (with a bar) or `offline` (hollow), so colour is not the only difference. The word goes into the avatar's accessible name - "Amara Okafor (online)" - and `statusLabels` translates it. `ring: true` draws a primary-coloured ring, for the current user or a selection.

[showcase-demo id="showcase/elements/avatar/status-and-ring" title="Status and ring" /]

```
E.avatar(el, {name: 'Amara Okafor', src: 'img/amara.svg', size: 'lg', status: 'online'});
E.avatar(el, {name: 'Tom Hughes', size: 'lg', status: 'busy', statusLabels: {busy: 'in a meeting'}});
E.avatar(el, {name: 'Priya Shah', size: 'lg', ring: true});
```

## The eight tones

Each tone is a hue mixed a quarter of the way into the theme's surface, with the initials the same hue mixed into the theme's text. Both sides follow the theme, so the pair keeps its contrast on light and dark themes alike. Switch themes and watch them move. `tone: 0-7` picks one by hand.

[showcase-demo id="showcase/elements/avatar/the-eight-tones" title="The eight tones" /]

## Groups and "+N"

Change how many show, the size and the overlap. Press **+N** for the people it hides. Each avatar in a group has a ring in the background colour, so neighbours stay apart, and lifts a little under the pointer.

[showcase-demo id="showcase/elements/avatar/groups-and-n" title="Groups and '+N'" /]

## A team list built with E.avatarGroup

One group per project, three faces each. The last project uses `onMore` instead of the popover - here it raises a toast, but it could open a members page.

[showcase-demo id="showcase/elements/avatar/a-team-list-built-with-e-avatargroup" title="A team list built with E.avatarGroup" /]

```
projects.forEach((p) => {
    const $row = $(renderProjectRow(p));          // name, due date, an empty .team span
    $('#projects').append($row);
    E.avatarGroup($row.find('.team'), {
        people: p.team,
        max: 3,
        size: 'sm',
        label: `${p.name} team`,
        onMore: p.members ? (hidden) => E.toast(`${hidden.length} more on ${p.name}`) : null
    });
});
```

## Declarative: data-avatar

Put the name in `data-avatar` and the options in `data-avatar-*`, then call `E.avatar.scan()` once. It skips anything it has already done.

[showcase-demo id="showcase/elements/avatar/declarative-data-avatar" title="Declarative: data-avatar" /]

```
<span data-avatar="Amara Okafor" data-avatar-src="img/amara.svg" data-avatar-size="lg" data-avatar-status="online"></span>
<span data-avatar="Rhys Morgan" data-avatar-size="lg" data-avatar-shape="rounded"></span>
<span data-avatar="sofia.rossi@example.com" data-avatar-size="lg" data-avatar-ring></span>

<script>E.avatar.scan();</script>
```

Attributes: `data-avatar-src`, `-alt`, `-size`, `-shape`, `-status`, `-icon`, `-title`, `-tone`, `-ring`, `-decorative`.

## CSS only

The classes work in hand-written or server-rendered HTML. Without the script you choose the tone and write the initials yourself - and the accessible name.

- NE
- RM
- 

```
<ul class="avatar-group avatar-group-md" aria-label="Reviewers">
    <li><span class="avatar avatar-md avatar-tone-3" role="img" aria-label="Nia Evans">
        <span class="avatar-initials" aria-hidden="true">NE</span></span></li>
    <li><span class="avatar avatar-md avatar-tone-6" role="img" aria-label="Rhys Morgan (away)">
        <span class="avatar-initials" aria-hidden="true">RM</span>
        <span class="avatar-status avatar-status-away" aria-hidden="true"></span></span></li>
    <li><span class="avatar avatar-md" role="img" aria-label="Priya Shah">
        <img class="avatar-img" src="img/priya.svg" alt=""></span></li>
</ul>
```

[table striped="true"]
| Class | What it does |
| --- | --- |
| `.avatar` | The circle: neutral tint, centred content |
| `.avatar-xs` ... `-xl` | Sizes (set `--dm-avatar-size`) |
| `.avatar-rounded` / `.avatar-square` | Shapes |
| `.avatar-tone-0` ... `-7` | The eight name tints |
| `.avatar-img` / `.avatar-initials` / `.avatar-icon` | What goes inside |
| `.avatar-status` + `-online` / `-away` / `-busy` / `-offline` | The dot |
| `.avatar-ring` | Primary ring |
| `.avatar-group` + `.avatar-group-xs` ... `-xl` | The overlapping stack; children may be `li`s or avatars |
| `.avatar-more` | The "+N" bubble |
[/table]

Custom properties: `--dm-avatar-size`, `--dm-avatar-radius`, `--dm-avatar-overlap`, and `--dm-avatar-gap-color` - the ring between stacked avatars and round the dot. It is the page background by default and the card colour inside a `.card`; set it wherever avatars sit on something else.

## Accessibility

- An avatar is `role="img"` with `aria-label` - the name, or `alt` if given, plus the status in words.
- A linked avatar stays a link and is named with `aria-label`.
- The picture has `alt=""`; initials, icon and dot are `aria-hidden`, so nothing is read twice.
- `decorative: true` hides it altogether - use it when the name is written right next to it.
- A group is a `<ul>`; `label` names the list.
- "+N" is a real button named "3 more: Nia Evans, Rhys Morgan and Sofia Rossi", so the hidden names are heard without opening it. Its popover is a dialog and takes focus.
- Under `prefers-reduced-motion` the hover lift is off.

## Options

### E.avatar(target, options)

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | `null` | Initials, tone and accessible name come from it |
| `src` | string | `null` | Picture; falls back to initials or icon if it fails |
| `alt` | string | `null` | Accessible name when it should differ from `name` |
| `size` | string | `'md'` | `xs`, `sm`, `md`, `lg`, `xl` |
| `shape` | string | `'circle'` | `circle`, `rounded`, `square` |
| `status` | string | `null` | `online`, `away`, `busy`, `offline` |
| `statusLabels` | object | `null` | Words for the statuses in the accessible name |
| `icon` | string | `null` | Icon instead of initials; `user` when there is no name |
| `title` | string \| true | `null` | Hover text; `true` uses the accessible name |
| `ring` | boolean | `false` | Primary ring |
| `tone` | number | from the name | 0-7, to choose the tint |
| `decorative` | boolean | `false` | Hide from assistive technology |
[/table]

### E.avatarGroup(target, options)

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `people` | array | `[]` | `{name, src, status, href, alt, icon, tone, title}` or plain names |
| `max` | number | `null` | Show this many, then "+N"; `null` shows everyone |
| `size` / `shape` | string | `'md'` / `'circle'` | As for one avatar |
| `overlap` | string \| number | stylesheet (`md`) | `none`, `sm`, `md`, `lg`, pixels, or any CSS length |
| `label` | string | `null` | Accessible name for the list |
| `onMore` | function | `null` | `(hiddenPeople, event)`; replaces the popover |
| `popover` | boolean | `true` | `false`: the hidden names go in the button's title instead |
| `moreLabel` | function | `null` | `(count, names) => string` - the "+N" button's accessible name |
| `statusLabels` | object | `null` | Passed to each avatar |
[/table]

### Methods

[table striped="true"]
| Call | Returns | Does |
| --- | --- | --- |
| `E.avatar(target, options)` | handle \| null | Turn the element into an avatar; no target makes a detached span |
| `handle.update(options)` | handle | Merge options and redraw |
| `handle.destroy()` | element | Restore the element's previous content, classes and attributes |
| `handle.initials` / `.tone` / `.label` |  | What was drawn |
| `E.avatar.scan(root)` | handle[] | Every `[data-avatar]` under `root`, once |
| `E.avatar.get(el)` | handle \| null | The live handle |
| `E.avatar.initials(name)` / `E.avatar.tone(name)` | string / number | The rules on their own |
| `E.avatarGroup(target, options)` | handle \| null | Fill a `<ul>`, or put a new one inside any element |
| `group.update(options)` / `group.setPeople(people)` | handle | Redraw |
| `group.shown` / `.hidden` / `.more` / `.popover` |  | Who is visible, who is folded, the "+N" button and its popover |
| `group.destroy()` | element | Restore the host |
[/table]
