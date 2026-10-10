---
title: SPA QuickStart
description: Build an app-like Domma site with client-side routing, instant view changes and reactive state.
layout: default
status: published
sortOrder: 11
---

[hero title="SPA QuickStart" tagline="An app-like experience with client-side routing and instant view changes. Ideal for dashboards, tools and interactive web apps." align="center"]
[badge variant="primary"]Instant view changes[/badge] [badge variant="primary"]Client-side routing[/badge] [badge variant="primary"]Shared state[/badge]
[/hero]

## Set up your SPA in three steps

[grid cols="3" gap="4"]
[col]
[card title="Create the project" layout="step-numbered" step="1"]
```bash
mkdir my-app
cd my-app
npm init -y
```
[/card]
[/col]
[col]
[card title="Install Domma" layout="step-numbered" step="2"]
```bash
npm install domma-js
```
About 175 KB gzipped.
[/card]
[/col]
[col]
[card title="Generate the SPA" layout="step-numbered" step="3"]
```bash
npx domma-js init --spa
```
A single-page app with client-side routing.
[/card]
[/col]
[/grid]

### What you get

```text
frontend/
├── index.html              single entry point
├── domma.config.json       routes, navbar, theme
├── css/custom.css          your styles
└── js/
    ├── app.js              starts the router
    └── views/
        ├── index.js        the view registry
        ├── home.js  about.js  contact.js  404.js
        └── templates/      each view's HTML
```

Open `frontend/index.html`, or serve it:

```bash
npx live-server frontend
```

## How routing works

Clicking a link swaps the view inside `#app` without reloading the page - the router (`R`) matches the hash, unmounts
the old view and mounts the new one. See it working, with code, in the [Router showcase](/showcase/router).

## The code

### `frontend/domma.config.json`

```json
{
  "project": { "name": "My SPA App", "version": "1.0.0" },
  "spa": {
    "enabled": true,
    "container": "#app",
    "defaultRoute": "/",
    "notFoundView": "404",
    "transitions": { "enter": "fadeIn", "leave": "fadeOut", "duration": 200 }
  },
  "routes": [
    { "path": "/", "view": "home" },
    { "path": "/about", "view": "about" },
    { "path": "/contact", "view": "contact" }
  ],
  "navbar": {
    "brand": { "text": "My App", "url": "#/" },
    "items": [
      { "text": "Home", "url": "#/" },
      { "text": "About", "url": "#/about" },
      { "text": "Contact", "url": "#/contact" }
    ]
  }
}
```

### `frontend/js/views/home.js`

A view points at its template file and has lifecycle hooks:

```js
export const homeView = {
    templateUrl: 'js/views/templates/home.html',

    onMount($container) {
        Domma.icons.scan($container[0]);   // icons in the new view
    },

    onLeave() {
        // tidy up timers, listeners and effects here
    }
};
```

### `frontend/js/app.js`

```js
import { views } from './views/index.js';

$(() => {
    Domma.http.get('domma.config.json').then(config => {
        R.init({
            container: config.spa.container || '#app',
            routes: config.routes || [],
            views,
            default: config.spa.defaultRoute || '/',
            notFound: config.spa.notFoundView || '404'
        });

        // React to route changes
        M.subscribe('router:afterChange', ({ to, from }) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
});
```

## Keeping the UI in sync

Most SPA bugs come from forgetting to update something. Domma's dependency tracking removes that whole class of bug:
you describe what a value *is*, and it stays correct.

### Step 1 - hold state in a model

Start with a blueprint and a model. Nothing new here.

```js
const cart = M.create({
    items:    { type: M.types.array,  default: [] },
    shipping: { type: M.types.number, default: 4.99 },
    query:    { type: M.types.string, default: '' }
});
```

### Step 2 - derive, don't duplicate

A computed describes a value in terms of others. It runs when first read, then caches until something it read changes.

```js
const subtotal = M.computed(() =>
    cart.get('items').reduce((sum, i) => sum + i.price, 0)
);

const total = M.computed(() =>
    subtotal.get() + cart.get('shipping')
);

total.get();   // computed once, then cached
```

### Step 3 - react with an effect

An effect subscribes to whatever it reads. Add a field to the calculation later and the subscription updates itself -
there is no list of field names to keep in step.

```js
M.effect(() => {
    $('#cart-total').text(`£${total.get().toFixed(2)}`);
});

// Anything that changes the total updates the page
cart.set('shipping', 0);
```

### Step 4 - clean up on route change

`M.effect()` returns a stop function. Call it in your view's `onLeave` so effects don't outlive the view that made them.

```js
export const cartView = {
    templateUrl: 'js/views/templates/cart.html',

    onMount($container) {
        this._stop = M.effect(() => {
            $container.find('#total').text(total.get());
        });
    },

    onLeave() {
        this._stop();   // unsubscribe
    }
};
```

### Why this beats wiring it by hand

[grid cols="2" gap="4"]
[col]
**By hand - quietly breaks**

```js
cart.onChange(({ field }) => {
    // Miss a field name here and the
    // total silently goes stale
    if (field === 'items' ||
        field === 'shipping') {
        recalculate();
    }
});
```
[/col]
[col]
**Tracked - cannot go stale**

```js
M.effect(() => {
    // Subscribes to exactly what it
    // reads, every time it runs
    recalculate(
        cart.get('items'),
        cart.get('shipping')
    );
});
```
[/col]
[/grid]

Two rules worth remembering:

- **Keep derivations synchronous.** Dependency tracking stops at the first `await`, so fetch first and write the
  result to the model - don't read model fields after awaiting.
- **Return new values, don't mutate old ones.** A computed that pushes to an existing array and returns it looks
  unchanged, so nothing downstream updates. Return `[...items, newItem]` instead.

Updates are batched: several `set()` calls in the same tick cause one re-run, on the next microtask. If you need a
derived value settled at once - in a test, or reading straight after a write - call `M.flush()`. Try it live in the
[Reactivity showcase](/showcase/models/reactivity).

## You're ready to build

Your SPA is set up. Start editing the views in `frontend/js/views/`.

[button href="/quickstart" variant="secondary"]Back to QuickStart[/button] [button href="/showcase" variant="primary"]Explore the Showcase[/button]
