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
    // CSS injected into the Shadow DOM — fully encapsulated.
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
**[Bindings](./Bindings.md)** — the full reference for expressions, `data-model`, custom bindings and helpers. This
section covers only what is specific to a component template.

### Mustache

| Pattern                             | Behaviour                                             |
|-------------------------------------|-------------------------------------------------------|
| `{{field}}`                         | **Surgical** — only that text node updates            |
| `{{field.nested}}`                  | **Surgical** — sub-path resolved on root change       |
| `{{{field}}}`                       | Raw HTML, unescaped — only for markup you control     |
| `{{#if field}}…{{/if}}`             | **Full re-render** of the region on condition change  |
| `{{#unless field}}…{{/unless}}`     | **Full re-render** of the region on condition change  |
| `{{#each items}}…{{/each}}`         | **Full re-render** of the block on array change       |
| `{{#each items key=id}}…{{/each}}`  | **Reconciled** — surviving items keep their DOM nodes |
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
flush for **any** change to the component's model — including a field no
`{{ }}` binding mentions — and it runs after the flush that applied the
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

Writing to the model from inside `onUpdated()` is legitimate — deriving one
field from another, for instance — but the value **must settle**. What stops
the cycle is the equality check on each field: write the same value twice and
the second write does not propagate, so the hook is not called again.

```javascript
onUpdated() {
    // ✅ converges — after the first pass, slug already equals this value
    this.set({slug: _.kebabCase(this.data.title)});

    // ❌ never converges — a different value every pass, forever
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

If a component declares no `onUpdated`, no watcher is created — the component
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
The element's normal lifecycle fires — no extra setup needed.

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

Components compose naturally — use a registered tag inside another component's template:

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

## See Also

- [domma-reactive](https://www.npmjs.com/package/domma-reactive) — Binding compiler internals. The compiler moved out
  of `src/template-compiler.js` into the `domma-reactive` package; Domma imports `TemplateCompiler` from there and
  injects `utils.render` as the renderer.
- [src/component-factory.js](../src/component-factory.js) — Factory + Custom Element builder
- [src/plugins/rollup-plugin-domma.js](../src/plugins/rollup-plugin-domma.js) — SFC build plugin
- [public/showcase/components/](../public/showcase/components/) — Interactive showcase
- [docs/API.md](./API.md) — Full API reference
