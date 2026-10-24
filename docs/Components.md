# Domma Components

Vue-style standalone Web Components with reactive data, computed properties, lifecycle hooks, and surgical DOM binding.

## Overview

Domma Components compose the framework's primitives into a single declarative definition:

| Primitive          | Role in Components                              |
|--------------------|-------------------------------------------------|
| `DommaElement`     | Shadow DOM host, lifecycle orchestration        |
| `M.create()`       | Internal reactive model for component state     |
| `TemplateCompiler` | Annotates + renders templates, builds bindings  |
| `utils.render()`   | Mustache template rendering                     |

Every registered component becomes a real Custom Element, usable anywhere in HTML as a tag.

## Defining a Component

```javascript
Domma.component('tag-name', definition);
```

The tag name **must** contain a hyphen (Web Components requirement). If it doesn't, Domma
automatically prefixes it with `domma-` (e.g. `counter` → `<domma-counter>`).

### Full Definition Object

```javascript
Domma.component('user-card', {

    // ── Template ─────────────────────────────────────────────────────────────
    // Use templateUrl for real projects (external .html file, cached).
    // Use template for quick inline templates (< ~20 lines).

    templateUrl: 'components/user-card/template.html',
    // OR:
    template: `
        <div class="card">
            <h2>{{name}}</h2>
            <p>{{email}}</p>
            {{#if loading}}<div class="spinner"></div>{{/if}}
        </div>
    `,

    // ── Props ─────────────────────────────────────────────────────────────────
    // HTML attribute declarations with type coercion and defaults.
    // camelCase prop → kebab-case attribute:  userId → user-id

    props: {
        userId:     { type: M.types.number,  required: true        },
        label:      { type: M.types.string,  default: 'User'       },
        showAvatar: { type: M.types.boolean, default: true         },
        tags:       { type: M.types.array,   default: () => []     }
    },

    // ── Reactive Data ─────────────────────────────────────────────────────────
    // Returns the initial reactive state.  All keys become trackable fields.

    data() {
        return { name: '', email: '', loading: true };
    },

    // ── Computed Properties ───────────────────────────────────────────────────
    // Re-evaluated on every render pass.  Available in templates + context.

    computed: {
        initials() {
            return this.data.name.split(' ').map(n => n[0]).join('').toUpperCase();
        }
    },

    // ── Methods ───────────────────────────────────────────────────────────────
    // All methods receive the same "this" context as lifecycle hooks.

    methods: {
        async fetchUser() {
            const user = await H.get(`/api/users/${this.props.userId}`);
            this.set({ name: user.name, email: user.email, loading: false });
        }
    },

    // ── Lifecycle Hooks ───────────────────────────────────────────────────────

    onBeforeMount() { /* fired before first render */ },
    onMount()       { this.fetchUser(); I.scan(this.root); },
    onUpdated()     { /* fired after any data change, once per flush */ },
    onBeforeUnmount() { /* cleanup before removal */ },
    onUnmount()     { /* element removed from DOM */ },
    onPropsChanged(name, oldValue, newValue) {
        if (name === 'userId') this.fetchUser();
    },

    // ── Scoped Styles ─────────────────────────────────────────────────────────
    // CSS injected into the Shadow DOM - fully encapsulated.
    // Domma theme CSS variables (--dm-primary, --dm-spacing-*, etc.) are
    // automatically inherited from the host document.

    style: `
        .card { padding: var(--spacing-md, 1rem); border-radius: 8px; }
        h2    { color: var(--dm-primary); }
    `
});
```

## HTML Usage

```html
<!-- Attributes map to declared props with automatic type coercion -->
<user-card user-id="42" show-avatar label="Profile"></user-card>

<!-- Boolean props: presence = true, absence = false -->
<user-card user-id="7" show-avatar></user-card>

<!-- Array / object props: JSON-encoded string -->
<user-card user-id="1" tags='["admin","editor"]'></user-card>
```

## The Component Context (`this`)

Inside methods, computed properties, and lifecycle hooks, `this` provides:

| Property / Method       | Description                                          |
|-------------------------|------------------------------------------------------|
| `this.data`             | Reactive state snapshot (`model.toJSON()`)           |
| `this.props`            | Resolved props object (type-coerced)                 |
| `this.root`             | `shadowRoot` reference                               |
| `this.el`               | The host custom element                              |
| `this.set(fields)`      | Batch-update reactive data (triggers DOM bindings)   |
| `this.methodName()`     | Call a declared method                               |
| `this.computedProp`     | Access a computed property                           |

## Template Binding

Templates use the same Mustache syntax as the rest of Domma (`_.render()`), plus the binding attributes described in
**[Bindings](./Bindings.md)** - the full reference for expressions, `data-model`, custom bindings and helpers. This
section covers only what is specific to a component template.

### Mustache

| Pattern                             | Behaviour                                             |
|-------------------------------------|-------------------------------------------------------|
| `{{field}}`                         | **Surgical** - only that text node updates            |
| `{{field.nested}}`                  | **Surgical** - sub-path resolved on root change       |
| `{{{field}}}`                       | Raw HTML, unescaped - only for markup you control     |
| `{{#if field}}…{{/if}}`             | **Full re-render** of the region on condition change  |
| `{{#unless field}}…{{/unless}}`     | **Full re-render** of the region on condition change  |
| `{{#each items}}…{{/each}}`         | **Full re-render** of the block on array change       |
| `{{#each items key=id}}…{{/each}}`  | **Reconciled** - surviving items keep their DOM nodes |
| `class="prefix-{{field}}"`          | **Full re-render** (attribute binding)                |
| `{{computedProp}}`                  | Treated same as a field; full re-render if structural |

**Rule of thumb:** `{{field}}` as standalone text content → surgical update.
Anything inside block tags or HTML attribute values → full re-render of the component content.

**Add `key=` to any list that can change.** With it, deleting the second row leaves the first row's actual DOM node in
place, so focus, uncommitted input, scroll position and animation state survive. Without it the block re-renders
wholesale and warns once.

### Attribute bindings

These work in a component template exactly as they do on a page:

| Attribute | Does |
|---|---|
| `data-bind-text`, `data-bind-class`, `data-bind-<prop>` | Write text, classes, a property or an attribute |
| `data-model` | Two-way binding to a field |
| `data-on-<event>` | Call a method from the `methods` block |
| `data-if` | Include the element, or not |
| `data-each="items key=id"` | A keyed list |

```javascript
Domma.component('user-card', {
    data: () => ({name: '', editing: false}),
    methods: {
        toggle() { this.set({editing: !this.data.editing}); }
    },
    template: `
        <h2 data-bind-text="name"></h2>
        <input data-if="editing" data-model="name">
        <button data-on-click="toggle">Edit</button>
    `
});
```

Methods are in scope for `data-on-*` automatically. A data field of the same name wins over a method.

`data-if` in a template **re-renders** its region, whereas on a page `M.applyBindings` detaches and restores the same
node. Prefer `{{#if}}` in a template, where the re-render is the documented behaviour anyway.

## Lifecycle Sequence

```
1. connectedCallback()
   ├── onBeforeMount()
   ├── _injectStyles()        → theme variables + component style
   ├── _renderComponent()     → fetch template, compile bindings
   ├── _wireBindings()        → one effect per bound field, plus the
   │                            whole-model watcher that fires onUpdated
   └── onMount()

2. On model.set(field, value)
   ├── If structural field  → full re-render
   ├── If text-only field   → surgical textContent
   └── onUpdated()          → once per flush, after the flush that ran the
                              binding effects

3. On attribute change
   ├── Update this.props[propName]
   ├── onPropsChanged(name, old, new)
   ├── full re-render (props are always structural)
   └── onUpdated()          → synchronous, and NOT coalesced with (2): a props
                              change and a data change in the same tick call
                              the hook twice

4. disconnectedCallback()
   ├── onBeforeUnmount()
   ├── Unsubscribe model listeners
   ├── model.destroy()
   └── onUnmount()
```

### onUpdated

`onUpdated()` is a data hook, not a paint hook. It fires once per reactive
flush for **any** change to the component's model - including a field no
`{{ }}` binding mentions - and it runs after the flush that applied the
binding updates, so it can read what was just rendered.

That makes it the place to paint content the template cannot express, which is
the standard pattern for lists:

```javascript
Domma.component('task-list', {
    templateUrl: 'template.html',     // contains <ul class="list"></ul>
    data() { return {tasks: []}; },
    onUpdated() { this._renderList(); }
});
```

#### Writes from onUpdated must converge

Writing to the model from inside `onUpdated()` is legitimate - deriving one
field from another, for instance - but the value **must settle**. What stops
the cycle is the equality check on each field: write the same value twice and
the second write does not propagate, so the hook is not called again.

```javascript
onUpdated() {
    // ✅ converges - after the first pass, slug already equals this value
    this.set({slug: _.kebabCase(this.data.title)});

    // ❌ never converges - a different value every pass, forever
    this.set({lastTouched: Date.now()});
}
```

A non-converging write does not throw and does not stop. The notification
chain is built from microtasks, which run to exhaustion before the browser
gets control back, so the page locks up with no error, no repaint and no
stack trace to point at. Keep the rule in mind for the fields your template
does not bind, too: those now reach `onUpdated` as well.

#### Declare a `data()`, and declare every field in it

Model creates observables lazily, so a key that `data()` never returned is
invisible to the watcher that drives `onUpdated`: writes to it will not fire
the hook until some declared field changes. A component with **no** `data()`
at all has nothing to watch, so its `onUpdated` never fires.

#### Not called when absent

If a component declares no `onUpdated`, no watcher is created - the component
keeps exactly one effect per bound field and pays nothing for the hook.

## Router Integration

Use a component as a route view by specifying `component` instead of `view`:

```javascript
R.route({
    path: '/users/:id',
    component: 'user-card',          // Custom element tag name
    props: (params) => ({             // Props derived from URL params
        userId: parseInt(params.id, 10)
    })
});

// Navigate like any other route
R.navigate('/users/42');
```

The router creates `<user-card user-id="42">` and inserts it into the route container.
The element's normal lifecycle fires - no extra setup needed.

## `.domma` Single-File Format

For build-pipeline projects, the optional Rollup plugin lets you co-locate template,
script, and styles in a single `.domma` file (similar to Vue's `.vue` format).

```html
<!-- components/user-card.domma -->
<template>
    <div class="card">
        <div class="avatar">{{initials}}</div>
        <p class="name">{{name}}</p>
    </div>
</template>

<script>
export default {
    props: { userId: { type: M.types.number, required: true } },
    data() { return { name: '', loading: true }; },
    computed: {
        initials() { return this.data.name.split(' ').map(n => n[0]).join(''); }
    },
    methods: {
        async fetchUser() {
            const u = await H.get('/api/users/' + this.props.userId);
            this.set({ name: u.name, loading: false });
        }
    },
    onMount() { this.fetchUser(); }
};
</script>

<style>
.card   { padding: 1rem; }
.avatar { /* … */ }
</style>
```

### Rollup Config

```javascript
// rollup.config.js
import { dommaPlugin } from './src/plugins/rollup-plugin-domma.js';

export default {
    input: 'src/main.js',
    plugins: [
        dommaPlugin(),  // Must be before terser
        // … other plugins
    ]
};
```

The file's base name (without `.domma`) becomes the component tag name:
`user-card.domma` → `<user-card>`.

## Nesting Components

Components compose naturally - use a registered tag inside another component's template:

```javascript
Domma.component('user-list', {
    template: `
        <div class="list">
            {{#each users}}
            <user-card user-id="{{id}}"></user-card>
            {{/each}}
        </div>
    `,
    data() { return { users: [] }; },
    methods: {
        async load() {
            const users = await H.get('/api/users');
            this.set({ users });
        }
    },
    onMount() { this.load(); }
});
```

> **Note:** Nested components inside `{{#each}}` blocks re-render the whole block on array change.
> The nested Custom Elements themselves still manage their own Shadow DOMs independently.

## `Domma.components` Namespace

```javascript
// Check if registered
Domma.components.has('user-card');  // true / false

// Get a copy of the full registry
const registry = Domma.components.registry();  // Map<tagName, definition>
```

## Comparison with Plain Views

| Feature              | Router Views (`templateUrl`)   | Standalone Components          |
|----------------------|-------------------------------|-------------------------------|
| Shadow DOM           | ✗                             | ✓                             |
| Style encapsulation  | ✗                             | ✓                             |
| Reactive state       | Manual                        | Built-in (`data()` + Model)   |
| Props                | Via JS / URL params           | HTML attributes (type-coerced)|
| Computed             | Manual                        | Built-in                      |
| Reusable instances   | One per route                 | Many per page                 |
| Best for             | Full-page SPA views           | Reusable UI widgets           |

## Conventions

The `E.*` UI components (`Domma.elements`) share one set of rules, implemented once in
[`src/component.js`](../src/component.js). New components follow them; nothing here replaces a
name that already worked.

### 1. Events

Every `onX` option has a matching event. The option still runs exactly as before (same
arguments, same `this`, same use of its return value); `.on()` listeners and a DOM event follow.

| Option             | `.on()` name     | DOM event (bubbles, cancelable)      |
|--------------------|------------------|--------------------------------------|
| `onChange`         | `'change'`       | `dm:<component>:change`              |
| `onOpen`           | `'open'`         | `dm:<component>:open`                |
| `onBeforeClose`    | `'beforeclose'`  | `dm:<component>:beforeclose`         |
| `onItemClick`      | `'itemclick'`    | `dm:<component>:itemclick`           |
| `onStatusChange`   | `'statuschange'` | `dm:<component>:statuschange`        |

The name is the option minus `on`, lower-cased. `<component>` is the class's `componentName`:
`tabs`, `accordion`, `list-group`, `dropdown`, `timer`, `carousel`, `cookie-consent`,
`button-group`, `breadcrumbs`, `navbar`, `sidebar`, `footer`, `autocomplete`, `pillbox`,
`slideover`, `progression`, `signature`, `date-picker`, `context-menu`, `tree-view`, `sortable`,
`input-group`, `popover`. The DOM event's `detail` is `{instance, args}`.

```javascript
const so = E.slideover({title: 'Edit'});
so.on('close', (instance) => save());
document.addEventListener('dm:slideover:open', (e) => track(e.detail.instance));
```

`.once(event, fn)` and `.off(event, fn?)` work too. Sortable and Popover keep their older
`sortable:<x>` / `popover:<x>` events beside these until 1.0. `E.alarm`, `E.notification` and the
dialogs (`E.alert` / `confirm` / `prompt`) are not components and have only their options.

### 2. Overlay verbs

Dropdown, Sidebar, Autocomplete, Pillbox, Slideover, DatePicker, ContextMenu and CookieConsent
answer `open()`, `close()`, `toggle()` and `isOpen()`. `show()`, `hide()` and `isVisible()` are
permanent aliases. Popover's own names are `show()` / `hide()` / `isOpen()`, with `open()`,
`close()` and `isVisible()` as its aliases.

An alias looks the canonical method up **by name when it is called**, and so do the component's
own close button, backdrop and Escape key. A guard patched onto an instance therefore covers every
way the panel can close:

```javascript
const close = so.close;
so.close = function (...args) {
    if (dirty && !window.confirm('Discard changes?')) return this;
    return close.apply(this, args);
};
so.hide();   // runs the guard; so do the X button, the backdrop and Escape
```

### 3. `beforeclose` / `beforeopen`

Slideover, Dropdown, Sidebar, DatePicker, Autocomplete, Pillbox and ContextMenu ask before they
change: `close()` fires `beforeclose`, `open()` fires `beforeopen`, each only when the state would
actually change. Returning `false` from `onBeforeClose` or a `.on('beforeclose')` handler, or
calling `preventDefault()` on `dm:<component>:beforeclose`, keeps the overlay open (and the call
returns as it does when there is nothing to do). `destroy()` always closes. ContextMenu's
`onBeforeOpen(ctx)` keeps its meaning - it decides whether the menu claims the right-click.
Popover's cancelable phases are `show` and `hide` (`onShow` / `onHide` returning `false`).

### 4. Factory returns

A factory returns one instance. `E.buttonGroup(sel)` and `E.listGroup(sel)` used to return an
array when the selector matched several elements; they now set up every match as before and return
the first, with a non-enumerable `all()` for the list (`E.buttonGroup.all(sel, opts)` and
`E.listGroup.all(sel, opts)` return the array directly). Until 1.0 the array shape still answers -
`[i]`, `length`, `forEach`, `map` and iteration - with a one-time warning each
(`window.DommaOptions = {deprecationWarnings: false}` silences it). A selector that matches nothing
still returns `[]` until then. `E.chooser()` with a missing host returns an inert chooser (every
method a no-op, `element` null) rather than `null`. `E.notify({title, ...})` is the same as
`E.notify(title, {...})`.

### 5. Lookup: `E.get`

`E.get(el, name?)` finds whatever a factory made on an element - including slideovers built from
options, popovers, button and list groups from a multi-match, choosers, skeletons, avatars and
avatar groups. `name` is the `componentName` (`'skeleton'`, `'avatar'`, `'avatar-group'`,
`'chooser'`, ...) when an element hosts several. `E.popover.getInstance`, `E.skeleton.get`,
`E.avatar.get` and `E.avatarGroup.get` give the same answer. A destroyed component is
not returned.

### 6. Teardown

`destroy()` takes a component away everywhere. Where `remove` meant something else it keeps that
meaning: `E.skeleton(...).remove()` restores the original content, and `Alarm.remove(id)` is now an
alias of `removeAlarm(id)`.

## Built-in `E.*` components and their `<domma-*>` tags

`Domma.component()` (above) is for your own components. Domma's built-in UI components work differently. `E.card`,
`E.modal`, `E.tooltip`, `E.badge`, `E.numberBadge`, `E.toast`, `E.loader` and `E.backToTop` each have one
implementation in `src/components/`, and the `<domma-*>` tags are thin shells over it:

```html
<domma-badge variant="success" pill>New</domma-badge>
<domma-tooltip content="Saved 2 minutes ago"><button class="btn">Status</button></domma-tooltip>
<domma-number-badge count="3"><button class="btn">Inbox</button></domma-number-badge>
```

```javascript
E.badge('#status', {variant: 'success', pill: true});      // the same code
document.querySelector('domma-badge').setVariant('danger'); // the component's methods are on the tag
E.get(document.querySelector('domma-badge'));              // the instance
```

- **The element you give is the element.** `E.card('#c')` styles `#c` itself; nothing wraps or replaces it, so
  references, listeners and `E.get(el)` keep working.
- **Light DOM, except the modal.** Card, badge, number badge, tooltip (a bubble on `body`), toast, loader and
  back-to-top are page markup styled by `elements.css`, so page CSS and the `--dm-*` theme tokens reach them. The
  modal draws its frame in a shadow root on your element, and your element's children fill its body, so
  `modal.element.appendChild(panel)` works.
- **Tags register lazily.** They are defined on the first `E.*` call of one of these components, or as soon as the
  page contains one of the tags. A changed attribute is passed to the component as an option.
- **Events** follow the shared conventions: `onX` option, `.on('x')`, and a `dm:<component>:x` DOM event.

## See Also

- [domma-reactive](https://www.npmjs.com/package/domma-reactive) - Binding compiler internals. The compiler moved out
  of `src/template-compiler.js` into the `domma-reactive` package; Domma imports `TemplateCompiler` from there and
  injects `utils.render` as the renderer.
- [src/component-factory.js](../src/component-factory.js) - Factory + Custom Element builder
- [src/plugins/rollup-plugin-domma.js](../src/plugins/rollup-plugin-domma.js) - SFC build plugin
- [public/showcase/components/](../public/showcase/components/) - Interactive showcase
- [docs/API.md](./API.md) - Full API reference

## Focus trap - `E.focusTrap(container, options)`

Keeps Tab, Shift+Tab and stray focus inside one or more containers while it is active. Overlays use it so a
keyboard user cannot reach the page behind them. Source: `src/components/focus-trap.js` (also importable on its
own: `import FocusTrap, {tabbables} from 'src/components/focus-trap.js'`).

```javascript
const trap = E.focusTrap('#dialog', {initialFocus: '#name', returnFocus: true});
trap.activate();      // focus moves in; Tab wraps last -> first
trap.deactivate();    // focus goes back to what had it before
```

- **Tabbables are found on every key press**, so controls added later take part. Disabled, `hidden`, `inert`,
  `tabindex="-1"`, invisible and hidden-input elements are skipped; positive tabindex comes first; a radio group
  counts once. Open shadow roots are walked in render order (slotted children at their slot), so a trap round a
  Domma modal reaches its X and footer buttons. `E.focusTrap.tabbables(el)` gives the same list.
- **Nothing tabbable**: the container itself takes focus (`tabindex="-1"` is added, and removed on deactivate).
- **Options**: `initialFocus` (selector | element | function | `false`), `fallbackFocus`, `returnFocus` (`true` |
  `false` | element | selector), `escapeDeactivates` (default `false` - the overlay that owns the trap decides),
  `clickOutsideDeactivates`, `allowOutsideClick` (clicks outside are blocked by default; each of the three may be a
  function of the event), `inert` (`inert` on everything outside while active; only what it set is undone),
  `shadow`, `onActivate` / `onDeactivate` / `onPause` / `onUnpause`.
- **Methods**: `activate(opts)`, `deactivate({returnFocus})`, `pause()`, `unpause()`, `updateContainers([...])`,
  `isActive()`, `isPaused()`, `tabbables()`, `destroy()`.
- **Traps stack.** Activating a trap pauses the one on top; deactivating it unpauses that one.
  `E.focusTrap.top()` is the one listening.
- Events `dm:focus-trap:activate|deactivate|pause|unpause` are dispatched on the first container.

## Command palette - `E.commandPalette(options)`

A Cmd/Ctrl+K launcher: a search box over a filtered list of commands. The factory builds its own overlay at the end
of `<body>`; `palette.element` is that overlay. Source: `src/components/command-palette.js`.

```javascript
const palette = E.commandPalette({
    recentKey: 'app-palette',            // recents remembered with S; null (default) = off
    commands: [
        {id: 'new', title: 'New page', group: 'Pages', icon: 'plus', shortcut: 'mod+n', action: () => newPage()},
        {id: 'docs', title: 'Documentation', href: '/docs/', keywords: ['help', 'manual']},
        {id: 'theme', title: 'Change theme', children: [
            {id: 'dark', title: 'Dark', action: () => setTheme('dark')},
            {id: 'light', title: 'Light', action: () => setTheme('light')}
        ]}
    ],
    source: (q, {signal}) => H.get('/api/search?q=' + encodeURIComponent(q), {signal})
});
```

- **Commands**: `{id, title, subtitle, group, icon, keywords, shortcut, href, target, action(command, palette,
  event), disabled, hidden, keepOpen, children, placeholder}`. `children` is an array or an async function (called
  once on entering) - a nested page. `href` takes http(s), mailto, tel or relative links only; `navigate` replaces
  the default navigation. Running a command closes the palette unless `keepOpen: true`.
- **Matching** is fuzzy (letters in order), scored for prefixes, word starts and unbroken runs; title, then
  keywords, then subtitle. Matched letters are wrapped in `<span class="dm-command-palette-match">`; everything is
  written with `textContent`, never as HTML. `E.commandPalette.fuzzyMatch(q, text)` is the matcher.
- **Async `source(query, {signal})`**: debounced (`debounce`, 150 ms), the previous request aborted, a late answer
  ignored; loading, empty (`emptyText`) and error (`errorText`) states. Its results follow the local ones.
- **Keyboard**: Up/Down (wrapping, skipping disabled rows), Home/End, Enter runs, Escape goes up a page and then
  closes, Backspace in the empty box goes up, Tab stays inside (a FocusTrap). `hotkey` (default `'mod+k'`, `mod` =
  Cmd on a Mac, Ctrl elsewhere; a list, or `false`) toggles it; a bare key such as `'/'` is ignored while typing in
  a field.
- **ARIA**: a modal dialog holding the combobox + listbox pattern - `aria-controls`, `aria-expanded`,
  `aria-activedescendant`, `role="option"` rows in labelled `role="group"`s, `aria-keyshortcuts`, and a polite live
  region with the result count.
- **Methods**: `open(query?)`, `close()`, `toggle()`, `isOpen()`, `show()` / `hide()` / `isVisible()` (aliases by
  name), `setCommands(list)`, `addCommands(list)` (same id replaces), `removeCommand(id)` (top level), `back()`,
  `query()`, `recent()`, `clearRecent()`, `destroy()`.
- **Events**: `beforeopen`, `open`, `beforeclose`, `close`, `query(q)`, `beforeselect(command)` (cancelable),
  `select(command)`, `run(command)` - `onX`, `.on('x')`, `dm:command-palette:x`.
- **Look**: the modal's tokens (`--dm-modal-bg`, `--dm-modal-border`, `--dm-modal-backdrop`, `--dm-modal-shadow`),
  the active row `--dm-selected-bg`; full width from the top under 640px; no transition under reduced motion.
## Split Pane - `E.splitPane(container, options)`

The container's element children become panes; a gutter is inserted between each pair. Layout is flexbox -
each pane gets a `flex-basis` from its share - so the container keeps the size your CSS gives it and a pane can
hold anything, another split pane included.

```javascript
const split = E.splitPane('#editor', {
    direction: 'horizontal',     // side by side; 'vertical' stacks
    sizes: [25, 75],             // percentages; equal by default
    minSize: [160, '30%'],       // px or %, one value or one per pane (maxSize the same)
    snapOffset: 24,              // snap to the minimum within 24px
    collapsible: [true, false],  // double-click / Enter / button collapses pane 0
    collapseButton: true,
    persistKey: 'editor'         // S.set('split-pane:editor', ...) and restored on init
});
split.on('dragend', (sizes) => console.log(sizes));
split.setSizes([40, 60]);
split.collapse(0); split.expand(0);
```

- **Options**: `direction`, `sizes`, `minSize`, `maxSize`, `gutterSize` (8), `snapOffset`, `collapsible`,
  `collapsedSize` (0), `collapseButton`, `persistKey`, `cursor`, `disabled`, `step` (1%), `largeStep` (10%),
  `gutterLabel`.
- **Methods**: `getSizes()`, `setSizes(arr)`, `collapse(i)`, `expand(i)`, `isCollapsed(i)`, `setOptions()`,
  `destroy()` (removes the gutters, restores the panes' own styles), `panes`.
- **Events**: `beforedrag(gutterIndex, event)` (cancelable), `dragstart` / `drag` / `dragend` `(sizes, gutterIndex)`,
  `resize(sizes)` (any size change), `collapse(i)`, `expand(i)` - as options, `.on()` and `dm:split-pane:*`.
- **Accessibility**: gutters are focusable `role="separator"` with `aria-orientation`, `aria-valuenow` (the pane
  before, in %), `aria-valuemin` / `aria-valuemax` and `aria-controls`. Arrow keys move them (Shift for 10%),
  Home / End go to the limits, Enter collapses when a neighbouring pane is collapsible.
- Panes stop taking pointer events during a drag (`.dm-split-dragging`), so an iframe cannot swallow the moves.
  Horizontal splits follow `direction: rtl`.

## Virtual List - `E.virtualList(container, options)`

Renders only the rows in view of a long list. The container is the scroller and needs a height from CSS (a
fixed height, a `max-height`, or a flex child with `min-height: 0`).

```javascript
const list = E.virtualList('#people', {
    items: people,               // or count: 1e6, getItem: (i) => ...
    itemHeight: 40,              // or 'auto' with estimatedItemHeight
    keyField: 'id',
    label: 'People',
    render: (p, i) => `<strong>${_.escape(p.name)}</strong>`,   // string (sanitised) or Element
    onItemClick: (p, i, event) => open(p)
});
list.scrollToIndex(500, {align: 'center'});

// Infinite loading
E.virtualList('#feed', {
    itemHeight: 'auto', estimatedItemHeight: 96, keyField: 'id',
    loadMore: ({count, page}) => H.get('/api/posts?page=' + page),   // items[] or {items, done}
    endTemplate: 'You are all caught up.'
});
```

- **Options**: `items` | `count` + `getItem`, `itemHeight` (40 or `'auto'`), `estimatedItemHeight` (40),
  `overscan` (4), `render(item, index)`, `safe` (true), `keyField` (property or function; default the index),
  `label`, `rowClass`, `loadMore`, `threshold` (200px), `loadingTemplate`, `endTemplate`, `errorTemplate`.
- **Strings are HTML**: what `render()` returns is put in with `sanitise()` (DOMPurify when loaded, escaped
  otherwise) unless `safe: false`. Return an Element to insert your own nodes untouched. A `[data-vlist-retry]`
  element in a custom error template retries.
- **Methods**: `setItems()`, `append()`, `prepend()` (keeps the view still), `update(indexOrKey, item)` (a number is
  an index), `indexOfKey(key)`, `scrollToIndex(i, {align: 'start'|'center'|'end'|'auto', smooth})`, `focusIndex(i)`,
  `refresh()`, `getVisibleRange()`, `getRenderedRange()`, `retry()`, `isDone()`, `setCount(n)`, `destroy()`, `count`.
- **Events**: `render({start, end})`, `scroll({start, end})`, `loadmore({count, page})`, `loaded(items)`, `end`,
  `error(err)`, `itemclick(item, index, event)` - as options, `.on()` and `dm:virtual-list:*`.
- **Accessibility**: rows are `role="listitem"` in a `role="list"`, with `aria-posinset` / `aria-setsize` (-1
  while more can load). One tab stop (roving `tabindex`); arrows, Page Up/Down, Home/End move, Enter fires
  `itemclick`. The focused row stays rendered when it is scrolled out of view.
- **Measured rows** (`'auto'`): heights are cached by key; a row above the view that turns out taller or shorter
  moves the scroll position by the difference, so the content you are reading stays put. Use `keyField` with
  `prepend()`, or heights are re-measured.
- **Not supported**: horizontal lists and sticky group headers. A browser resets the scroll position of an element
  that is moved in the DOM; call `scrollToIndex()` again after moving the container.
