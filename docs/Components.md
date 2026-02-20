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
    onUpdated()     { /* fired after each reactive DOM update */ },
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

Templates use the same Mustache syntax as the rest of Domma (`_.render()`).

### Binding Types

| Pattern                              | Behaviour                                           |
|--------------------------------------|-----------------------------------------------------|
| `{{field}}`                          | **Surgical** — only that text node updates          |
| `{{field.nested}}`                   | **Surgical** — sub-path resolved on root change     |
| `{{#if field}}…{{/if}}`             | **Full re-render** on condition change              |
| `{{#unless field}}…{{/unless}}`     | **Full re-render** on condition change              |
| `{{#each items}}…{{/each}}`         | **Full re-render** on array change                  |
| `class="prefix-{{field}}"`          | **Full re-render** (attribute binding)              |
| `{{computedProp}}`                   | Treated same as a field; full re-render if structural |

**Rule of thumb:** `{{field}}` as standalone text content → surgical update.
Anything inside block tags or HTML attribute values → full re-render of the component content.

## Lifecycle Sequence

```
1. connectedCallback()
   ├── onBeforeMount()
   ├── _injectStyles()        → theme variables + component style
   ├── _renderComponent()     → fetch template, compile bindings
   ├── _subscribeToModel()    → wire model.onChange to DOM updates
   └── onMount()

2. On model.set(field, value)
   ├── If structural field  → full re-render → onUpdated()
   └── If text-only field   → surgical textContent → onUpdated()

3. On attribute change
   ├── Update this.props[propName]
   ├── onPropsChanged(name, old, new)
   └── full re-render (props are always structural)

4. disconnectedCallback()
   ├── onBeforeUnmount()
   ├── Unsubscribe model listeners
   ├── model.destroy()
   └── onUnmount()
```

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

- [src/template-compiler.js](../src/template-compiler.js) — Binding compiler internals
- [src/component-factory.js](../src/component-factory.js) — Factory + Custom Element builder
- [src/plugins/rollup-plugin-domma.js](../src/plugins/rollup-plugin-domma.js) — SFC build plugin
- [public/showcase/components/](../public/showcase/components/) — Interactive showcase
- [docs/API.md](./API.md) — Full API reference
