# Popover

A floating panel anchored to a trigger: an optional title, content that can be text, DOM or a small
form, and an optional close button. Opened by click, hover, focus or code. The panel is moved to
`document.body` and positioned against the viewport, so an ancestor with `overflow: hidden` cannot
clip it. Nothing wraps or moves the trigger.

```javascript
const help = Domma.elements.popover('#billing-help', {
    title: 'Billing date',
    content: 'Invoices are raised on the first working day of each month.',
    placement: 'top',
    dismissible: true
});

help.show();
help.setContent('Changed.');
help.destroy();
```

```html
<button id="billing-help" type="button" aria-label="About the billing date">
    <span data-icon="help-circle" data-icon-size="16"></span>
</button>
```

Use a popover for anything the reader has to stop and read, click inside, or reach on a touch screen.
A one-line label on hover is still a [tooltip](../public/showcase/elements/tooltip/).

## Content

| Value                     | Rendered as                                                         |
|---------------------------|---------------------------------------------------------------------|
| string                    | Text (`textContent`). Markup is shown, not parsed                   |
| string with `html: true`  | HTML, after Domma's sanitiser (DOMPurify when the page loads it)    |
| `Node` / fragment         | Appended as it is                                                   |
| Domma collection / array  | Each node appended                                                  |
| `(popover) => value`      | Called on **every** open; returns any of the above                  |

`title` takes the same values. An empty title removes the header.

A function is the way to show current data, or to build a form whose handlers close over the
instance:

```javascript
const rename = E.popover('#rename', {
    title: 'Rename',
    content: () => {
        const form = $('<form><input class="form-input" name="name"><button class="btn btn-sm">Save</button></form>');
        form.find('input').val(project.name);
        form.on('submit', (e) => {
            e.preventDefault();
            project.name = form.find('input').val();
            rename.hide({returnFocus: true});
        });
        return form.get(0);
    }
});
```

A node passed directly (not from a function) is moved into the panel, so the same node cannot also
stay on the page. Pass a function that clones it if you need both.

## Options

| Option              | Type                          | Default                 | Description |
|---------------------|-------------------------------|-------------------------|-------------|
| `content`           | string, Node, Function        | `''`                    | See [Content](#content) |
| `title`             | string, Node, Function        | `''`                    | Heading; empty for none |
| `html`              | boolean                       | `false`                 | String content and title are sanitised HTML |
| `trigger`           | string                        | `'click'`               | `click`, `hover`, `focus`, `manual`, or several separated by spaces (`'click focus'`) |
| `placement`         | string                        | `'bottom'`              | `top`, `bottom`, `left`, `right` or `auto`, optionally with `-start` / `-end` |
| `flip`              | boolean                       | `true`                  | Try other sides when the preferred one has no room |
| `offset`            | number or `[x, y]`            | `10`                    | Gap between trigger and panel in px, or `[crossAxis, mainAxis]` |
| `arrow`             | boolean                       | `true`                  | Show the arrow |
| `dismissible`       | boolean                       | `false`                 | Show a close (x) button |
| `closeOnOutside`    | boolean                       | `true`                  | A pointer press or focus outside closes it |
| `closeOnEscape`     | boolean                       | `true`                  | Esc closes it |
| `group`             | string or `null`              | `'default'`             | One open at a time per group; `null` = independent |
| `width`             | string or number              | `null`                  | Any CSS width; numbers are px |
| `maxWidth`          | string or number              | `null`                  | Any CSS width; the stylesheet default is `20rem` |
| `className`         | string                        | `''`                    | Extra classes on the panel |
| `id`                | string                        | generated               | Panel id (`dm-popover-N`) |
| `role`              | string                        | auto                    | `dialog`, or `tooltip` when every trigger is `hover` / `focus` |
| `ariaLabel`         | string                        | `null`                  | Accessible name when there is no title |
| `autoFocus`         | boolean or `null`             | `null`                  | Move focus into the panel on open; `null` = when `trigger` includes `click` |
| `trapFocus`         | boolean                       | `false`                 | Tab cycles inside the panel instead of leaving it |
| `delay`             | number or `{show, hide}`      | `{show: 80, hide: 120}` | Hover delays in ms |
| `animation`         | boolean                       | `true`                  | Fade and scale in |
| `animationDuration` | number                        | `150`                   | ms |
| `container`         | Element or selector           | `document.body`         | Where the panel is placed |
| `zIndex`            | number                        | `null`                  | Overrides the stylesheet's `10045` |
| `onShow`            | Function                      | `null`                  | `(popover)`; return `false` to cancel |
| `onShown`           | Function                      | `null`                  | `(popover)`, after the transition |
| `onHide`            | Function                      | `null`                  | `(popover)`; return `false` to cancel |
| `onHidden`          | Function                      | `null`                  | `(popover)`, after the panel is removed |

`setOptions(opts)` changes any of these on a live instance, including the trigger type.

## Methods

| Method                     | Description |
|----------------------------|-------------|
| `show({focus})`            | Open. `focus` overrides `autoFocus` for this open |
| `hide({returnFocus})`      | Close. By default focus returns to the trigger only when it was inside the panel |
| `toggle()`                 | Open or close |
| `isOpen()`                 | Whether it is open |
| `setContent(content)`      | Replace the content; repositions when open |
| `setTitle(title)`          | Replace the title; empty removes the header |
| `update()`                 | Reposition - after the trigger moved or the content changed size |
| `setOptions(opts)`         | Change options |
| `destroy()`                | Close at once, remove the panel and every listener, restore the trigger's attributes |
| `panel` / `trigger`        | Getters for the panel (created on first open) and the trigger |

### Statics

| Static                               | Description |
|--------------------------------------|-------------|
| `E.popover.scan(root = document)`    | Create popovers from `data-popover` markup under `root`; returns the new instances |
| `E.popover.closeAll(group?)`         | Close every open popover, or only one group's |
| `E.popover.getInstance(el)`          | The popover bound to a trigger, or `null` |
| `E.popover.open()`                   | The open popovers, oldest first |

`E.get(trigger)` also finds an instance, as for every element. Creating a second popover on the same
trigger destroys the first.

## Triggers

- **click** (default) - toggles on click. A `<span>` or `<div>` trigger is given `tabindex="0"` and
  `role="button"` and opens on Enter or Space.
- **hover** - opens after `delay.show` when the pointer enters, and stays open while the pointer moves
  from the trigger into the panel. It **also opens on keyboard focus**, or keyboard users would never
  see it.
- **focus** - opens while the trigger (typically a form field) has focus; focus does not move into it.
- **manual** - binds nothing. Call `show()`, `hide()` and `toggle()` yourself. Set
  `closeOnOutside: false` if only your code should close it.

## Placement and collision

The panel is `position: fixed`. On every open, scroll and resize it:

1. Tries the requested side. `auto` picks the first of bottom, top, right, left that fits.
2. If that side has no room, tries the opposite side, then the two perpendicular sides. If none fits,
   it uses whichever of the requested and opposite sides has more room.
3. Shifts along the edge to stay 8px inside the viewport. The arrow keeps pointing at the middle of the
   trigger through the shift.
4. When the trigger scrolls fully out of view the panel is hidden (`.is-detached`) until it comes back,
   rather than being pinned to the edge of the screen.

The side it actually used is on the panel as `data-side` (`top` / `bottom` / `left` / `right`) and
`data-placement` (with `-start` / `-end`). The panel's body scrolls when the content is taller than
the viewport.

## Groups and nesting

Opening a popover closes every other open popover in the same `group` (`'default'` unless you say
otherwise), which is the one-at-a-time behaviour help icons want. `group: null` opts out.

A popover whose trigger sits inside another popover's panel is its **child**. Opening it does not
close the parent through the group rule, a click in the child is not "outside" the parent, Esc closes
the child first, and closing the parent closes the child.

## Keyboard and accessibility

| Input                                  | Does |
|----------------------------------------|------|
| Enter / Space on the trigger           | Opens a click popover and moves focus to its first control, or to the panel itself |
| Tab from the trigger while open        | Moves into the panel |
| Tab in the panel                       | Moves through its controls; past the last, focus goes to the next element after the trigger and the popover closes |
| Shift + Tab from the first control     | Back to the trigger (the popover stays open) |
| Esc                                    | Closes the most recent popover only, returns focus to its trigger, and stops the key there - a modal round it stays open |

The panel is always the next thing in the tab order after its trigger, even though it lives at the
end of `<body>`. With `trapFocus: true` Tab cycles inside the panel instead.

ARIA, set and restored by the component:

- **Dialog** (click / manual): the trigger has `aria-haspopup="dialog"`, `aria-expanded`, and
  `aria-controls` while open. The panel is `role="dialog"`, labelled by its title
  (`aria-labelledby`) or by `ariaLabel`.
- **Tooltip** (hover / focus only): the panel is `role="tooltip"` and its id is added to the
  trigger's `aria-describedby` while open (existing ids are kept).

Give an icon-only trigger an `aria-label`. `destroy()` removes everything the component added,
including a `tabindex` / `role` it gave a non-interactive trigger.

## Events

Each phase calls its callback, then dispatches a bubbling event on the trigger with
`{popover}` as `event.detail`:

| Callback   | Event             | When | Cancelable |
|------------|-------------------|------|------------|
| `onShow`   | `popover:show`    | Before opening | yes - return `false` or `preventDefault()` |
| `onShown`  | `popover:shown`   | After the open transition | no |
| `onHide`   | `popover:hide`    | Before closing | yes |
| `onHidden` | `popover:hidden`  | After the panel is removed from the document | no |

```javascript
$('main').on('popover:shown', (e) => console.log('Opened', e.detail.popover.panel.id));
```

## Declarative markup

`E.popover.scan(root)` turns every `[data-popover]` and `[data-popover-content]` under `root` into a
popover, like `Domma.icons.scan()` does for `data-icon`. It is idempotent - a trigger that already has
a popover is skipped - so call it again after rendering more markup. It is not run automatically.

```html
<button type="button" aria-label="About the URL slug"
        data-popover="The last part of the page address."
        data-popover-title="URL slug"
        data-popover-placement="top">?</button>

<button type="button" aria-label="About visibility"
        data-popover-content="#visibility-help"
        data-popover-title="Who can see this page">?</button>

<template id="visibility-help">
    <ul><li><strong>Public</strong> - anyone with the link</li></ul>
</template>

<script>E.popover.scan();</script>
```

| Attribute                                   | Option |
|---------------------------------------------|--------|
| `data-popover`                              | `content` - **always text**, never HTML |
| `data-popover-content`                      | Selector of a `<template>` (its content is cloned) or an element (cloned without its `id` and `hidden`), on every open |
| `data-popover-title`                        | `title` |
| `data-popover-trigger`                      | `trigger` |
| `data-popover-placement`                    | `placement` |
| `data-popover-dismissible`                  | `dismissible` (present = true, `"false"` = false) |
| `data-popover-arrow`                        | `arrow` (`"false"` hides it) |
| `data-popover-group`                        | `group` (`""` or `"none"` = independent) |
| `data-popover-width`, `data-popover-max-width` | `width`, `maxWidth` |
| `data-popover-class`                        | `className` |

The config engine accepts it too:

```javascript
$.setup({'#help': {component: 'popover', options: {content: 'Hello'}}});
```

## Replacing hand-rolled help popovers

Before this component, apps wrote their own "click a (?) to explain" panel. The equivalent is:

```javascript
// data-help="..." / data-help-title="..." markers → a (?) button each
$('[data-help]').each((i, marker) => {
    const btn = $('<button type="button" class="help-btn"><span data-icon="help-circle" data-icon-size="14"></span></button>');
    btn.attr('aria-label', marker.dataset.helpTitle ? 'Help: ' + marker.dataset.helpTitle : 'Help');
    $(marker).append(btn);
    E.popover(btn.get(0), {
        content: marker.dataset.help,          // text, never HTML
        title: marker.dataset.helpTitle || '',
        placement: 'top'
    });
});
Domma.icons.scan();
```

One open at a time, outside click, Esc with focus back on the button, and the ARIA wiring all come
with it; it also follows scrolling instead of closing.

## CSS

| Class / attribute               | On      | Meaning |
|---------------------------------|---------|---------|
| `.dm-popover`                   | panel   | The panel |
| `.dm-popover-arrow`             | panel   | The arrow |
| `.dm-popover-header`, `.dm-popover-title` | panel | Title row (hidden without a title) |
| `.dm-popover-body`              | panel   | Content; scrolls when too tall |
| `.dm-popover-close`             | panel   | Close button (`dismissible`) |
| `.is-open`                      | panel   | Open (transition target) |
| `.has-title`, `.is-dismissible`, `.no-arrow` | panel | Variants |
| `.is-detached`                  | panel   | Trigger scrolled out of view |
| `data-side`, `data-placement`   | panel   | Where it was actually placed |
| `.dm-popover-trigger`           | trigger | Bound to a popover |
| `.is-popover-open`              | trigger | Its popover is open |

The panel uses theme tokens only: `--dm-surface`, `--dm-text`, `--dm-border`, `--dm-shadow-lg`,
`--dm-radius-md`, `--dm-hover-bg` and `--dm-primary` (focus ring), so it follows every theme, light and
dark.

### Custom properties

```css
.dm-popover.wide-help {
    --dm-popover-max-width: 28rem;   /* also set by the maxWidth option */
    --dm-popover-width: auto;        /* also set by the width option */
}
```

`--dm-popover-duration` carries `animationDuration`.

### Stacking

`z-index: 10045` - above modals, slideovers and the sortable ghost, below the context menu (`10050`),
which can be opened from inside a popover. Override per instance with `zIndex`.

## Reduced motion

Under `prefers-reduced-motion: reduce` the fade and scale are skipped, and `popover:shown` /
`popover:hidden` fire at once instead of after the transition.
