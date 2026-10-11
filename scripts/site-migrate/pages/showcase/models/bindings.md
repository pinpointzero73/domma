---
title: Template Bindings
description: "Say in the markup which data each part of the page shows. Domma updates exactly those parts and leaves the rest of the DOM alone."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Template Bindings" tagline="Say in the markup which piece of data each part of the page shows. Domma updates exactly those parts, and leaves the rest of the DOM - and everything the visitor was doing in it - alone." align="center"][/hero]

## The code you stop writing

Every interface keeps two things in step: the data, and the pixels showing it. Without bindings you write that second job by hand, once per element, and again every time either side changes.

### By hand

```javascript
function render() {
  $('#name').text(user.name);
  $('#email').text(user.email);
  $('#badge').toggleClass('vip', user.vip);
  $('#avatar').attr('src', user.avatar);
}

// …and remember to call it. Every time.
// Miss one and the page quietly lies.
```

### Declared once

```html
<b data-bind-text="name"></b>
<span data-bind-text="email"></span>
<span data-bind-class="vip && 'vip'"></span>
<img data-bind-src="avatar">

<!-- no render(), no call sites -->
```

The difference is not the character count. It is that the second version cannot fall out of step, because there is no step to miss.

## Where bindings live

Two ways in, depending on **who owns the markup**. They share every binding, every expression and the same list reconciler, so anything you learn about one applies to the other.

[table striped="true"]
| Owns the markup | Entry point | You also get |
| --- | --- | --- |
| A **component** - it has a template | `Domma.component()` | `{{ }}`, `{{#if}}`, `{{#each}}`, lifecycle hooks |
| A **page** - the HTML already exists | `M.applyBindings()` | No build step, no second source of truth for the markup |
[/table]

```javascript
// The component route - Domma generates the markup
Domma.component('user-card', {
    template: `<b data-bind-text="name"></b>`,
    data() { return { name: 'Ada' }; }
});

// The page route - the markup is already there
M.applyBindings(model, '#app');
```

Most of this page uses the component route, because it keeps each demo self-contained. [Binding a page you already have](#sec-apply) shows the other one, on real markup sitting in this document. The engine behind both is published standalone as [domma-reactive](https://www.npmjs.com/package/domma-reactive).

## The binding kinds

Five come from mustache syntax, four from `data-*` attributes.

[table striped="true"]
| Write | What it does |
| --- | --- |
| `{{name}}` | Text, into a generated anchor span |
| `class="{{cls}} card"` | An attribute, interpolated |
| `{{#if x}}…{{/if}}` | A re-rendered region |
| `{{{html}}}` | A re-rendered region, unescaped |
| `{{#each xs key=id}}…{{/each}}` | **Reconciles** - see below |
| `data-bind-text="expr"` | A property, an attribute or a class |
| `data-model="path"` | Two-way, control ↔ data |
| `data-on-click="save"` | Any DOM event |
| `data-if="expr"` | In the DOM, or not in it |
[/table]

Every value on the right is an **expression**, not just a property name - see [Expressions](#sec-expressions).

## Text, classes and attributes

The suffix after `data-bind-` is the target. `text` writes `textContent`; `class` adds and removes *only the tokens this binding applied last time*, so static classes survive; anything else is a property when the DOM has one and an attribute otherwise.

[showcase-demo id="showcase/models/bindings/text-classes-and-attributes" title="Text, classes and attributes" /]

```html
<b data-bind-text="label"></b>
<span class="badge" data-bind-class="urgent && 'badge-danger'"></span>
<button data-bind-disabled="!label">Send</button>
<div data-bind-aria-hidden="!urgent"></div>
```

For an attribute, `false`, `null` and `undefined` **remove** it, and `true` sets it to the empty string - so `data-bind-aria-hidden="collapsed"` does what you meant rather than rendering the string `"false"`.

## Two-way with data-model

Type in the box; the data changes, and everything derived from it follows. There is no `onChange` handler in this demo, and no call to re-render.

[showcase-demo id="showcase/models/bindings/two-way-with-data-model" title="Two-way with data-model" /]

```html
<input data-model="query">
<p>Searching for <b>{{query}}</b> ({{query.length}} characters)</p>
```

The expression must be a **settable path** - a name, or a member chain ending in one - because a binding you cannot write back through is not two-way. A comparison or a helper call is refused at compile time with a warning rather than silently going one-way.

Checkboxes bind `checked`, multi-selects bind an array, and number inputs coerce to a `Number` - with an empty box becoming `null` rather than `NaN`. The data → DOM direction writes only when the value actually differs, so a re-render while someone is typing does not jump their caret to the end.

## Events

`data-on-` takes any DOM event name. The value is a method on your component, either as a bare reference or as a call - and your declared arguments come first, with **the event always last**, so a handler that wants only the event and one that wants arguments are spelled the same way round.

[showcase-demo id="showcase/models/bindings/events" title="Events" /]

```html
<button data-on-click="bump">+1</button>
<button data-on-click="add(5)">+5</button>
<input data-on-keyup="onKey">
```

Returning `false` calls `preventDefault()` - the same idiom Domma's `.on()` uses. Event bindings declare no dependencies: the listener is attached once and reads the data when it fires, so there is nothing for an effect to re-run.

## Conditionals

`data-if` means the element is in the document, or it is not. It is not hidden with CSS: a binding named after a conditional that left the element focusable and read aloud by a screen reader would be lying about what it does. Use `data-bind-hidden` when you want it present but invisible.

[showcase-demo id="showcase/models/bindings/conditionals" title="Conditionals" /]

```html
<p data-if="items.length === 0">Nothing yet.</p>
<p data-bind-hidden="items.length === 0">{{items.length}} item(s)</p>
```

Truthiness is *mustache* truthiness, so an **empty array is falsy** - which means `{{#if items}}` and `data-if="items"` can never disagree about an empty list.

## Keyed lists keep the DOM you were using

This is the one worth understanding. `{{#each items key=id}}` **reconciles**: a row that is still in the list after a change keeps the very same DOM nodes it had before. Not equivalent nodes - the same objects.

Which matters because a node carries state the data never sees: keyboard focus, a half-typed value, scroll position, a running CSS transition, a playing video. Rebuild the node and all of it is gone.

[showcase-demo id="showcase/models/bindings/keyed-lists-keep-the-dom-you-were-using" title="Keyed lists keep the DOM you were using" /]

**Try it.** Type into one of the boxes without pressing anything else, then press *Prepend*. The row moves down the page and your text is still there, still focused. The count underneath is measured, not claimed: it reports how many of the original row elements are still the identical object after the change.

```html
{{#each rows key=id}}
  <li><input data-model="note"> {{name}}</li>
{{/each}}
```

`key=` must name an *identity*, not a value. A key that changes when the row's contents change defeats the whole mechanism - every row looks new, and you are back to rebuilding. Without `key=` the block still works, but re-renders wholesale and says so once.

## A whole small app

Everything above, together, in the shape of the smallest application anyone actually writes: add, tick off, delete, and a summary that cannot go stale.

[showcase-demo id="showcase/models/bindings/a-whole-small-app" title="A whole small app" /]

```html
<input data-model="draft" data-on-keyup="onKey">
<button data-on-click="add">Add</button>

{{#each todos key=id}}
  <li>
    <input type="checkbox" data-on-change="$parent.toggle($data)">
    <span data-bind-class="done && 'bind-struck'">{{title}}</span>
    <button data-on-click="$parent.remove($data)">×</button>
  </li>
{{/each}}

<p data-if="todos.length === 0">Nothing to do.</p>
<p>{{summary}}</p>
```

Read that handler carefully: `$parent.remove($data)`. Inside a list a bare name resolves against the *row* - there is no scope walk, deliberately, because a name that silently resolved one level up would mean something different depending on data you are not looking at. So `$parent` names the component and `$data` is the row handing *itself* over. `$index`, `$length` and `$root` are there for the same reason.

## Expressions, and the reason they are hand-parsed

A binding value is a small expression language: paths and indexing, string and number literals, `+ - * / %`, `=== !== < <= > >=`, `&& || !` with short-circuiting, ternaries, and calls to helpers you registered. Precedence is JavaScript's.

```html
<b data-bind-text="count > 0 ? 'in stock' : 'sold out'"></b>
<i data-bind-class="overdue && 'text-danger'"></i>
<span>{{ price * qty }}</span>
```

It is parsed by hand - a tokeniser, a Pratt parser and a tree-walking evaluator - rather than compiled with the `Function` constructor. That is not stylistic. It means bindings work under a strict Content Security Policy (`script-src 'self'`, no `unsafe-eval`), which is the setting where evaluating binding strings at runtime stops working.

Refused on purpose: assignment, `new`, and reads of `__proto__`, `constructor` or `prototype` in any form - including `a[key]` where `key` only holds one of them at runtime. Method calls are refused too, except in `data-on-*`, where invoking a method is the entire point and the call happens on a gesture rather than during a render.

## Binding a page you already have

Everything above lives inside a component, which owns its template. `M.applyBindings()` is the other direction: point it at markup that is *already in the document* - server-rendered, hand-written, whatever - and it activates the binding attributes in place, leaving the markup otherwise as it found it.

The panel below is **not** a component. It is plain HTML written directly into this page, brought to life by one call. View source and you will find it exactly as shown.

[showcase-demo id="showcase/models/bindings/binding-a-page-you-already-have" title="Binding a page you already have" /]

```javascript
// A helper, so the markup can shape a value without calling a method
M.registerHelper('greet', (n) => n ? `Hello, ${n}` : 'Hello');

// A custom binding kind, registered the same way every built-in is
M.registerBinding('uppercase', {
    attribute: 'data-uppercase',
    expression: true, tracks: true, primes: true,
    update({binding, nodes, context}) {
        const value = binding.evaluate(context);
        for (const el of nodes) el.textContent = String(value).toUpperCase();
        return true;
    }
});

const model = M.create({
    name: {type: M.types.string},
    rows: {type: M.types.array}
}, {name: 'Ada', rows: [{id: 1, label: 'First row'}]});

const handle = M.applyBindings(model, '#apply-demo', {
    methods: {
        add()  { /* push a row */ },
        drop(row) { /* remove that row - called as $parent.drop($data) */ },
        reset() { /* back to the start */ }
    }
});
```

A Model is the ergonomic thing to pass: reads track it and writes route back through `set()`, so `data-model` lands in the model with validation and change notification intact - not in a throwaway copy. A plain object works too, but only the parts of it that are observable will be reactive.

[table striped="true"]
| Difference from a component | Why |
| --- | --- |
| `{{ }}` is **not** interpolated | Either the server already rendered the value, or the page was broken until JavaScript ran. Use `data-bind-text`, which the server can render alongside the text. |
| `data-if` keeps the same node | It detaches and restores the element, so children, listeners and focus survive a toggle. A template re-renders its region instead. |
| `key=` is required on `data-each` | There is no template to fall back to re-rendering - the markup *is* the page. |
| Handlers arrive in `options.methods` | A Model holds data, not behaviour. In a component they are the `methods` block. |
[/table]

`applyBindings` returns a handle. Call `handle.dispose()` on anything that outlives its markup - a router view, a modal, a slideover - because an effect is a live node in the dependency graph and does not go away just because its nodes did.

## Reaching past one level

`$parent` is one step out, and for a long time it was the only step there was: from inside a list inside a list, two levels up could not be reached at all.

`$parents` is the whole chain, nearest first - `$parents[0]` is `$parent`, `$parents[1]` is a grandparent. And `$parentContext` is the enclosing *context* rather than its data, which is the only way to ask a question the data cannot answer: **which row of the outer list am I in?** Position lives on the context, not on the item.

[showcase-demo id="showcase/models/bindings/reaching-past-one-level" title="Reaching past one level" /]

**Press it.** The new team arrives with its position already resolved, and every member already listed keeps its team and its season - those are ancestor *data*, and the data did not change. The trailing number is the outer list's `$index`, which is the one fact about a member that lives nowhere in the member.

```html
<ul data-each="teams key=id">
  <li>
    <b data-bind-text="name"></b>
    <ol>
      {{#each members key=id}}
        <li>
          {{name}}
          - on {{$parents[0].name}}       <!-- the team: same as $parent.name -->
          - in {{$parents[1].season}}     <!-- the root: nothing else reaches it -->
          - {{$parentContext.$index}}     <!-- the OUTER list's position -->
        </li>
      {{/each}}
    </ol>
  </li>
</ul>
```

**Read the inner list carefully - it is `{{#each}}`, not a second `data-each`.** An item template is compiled markup, and the compiler finds lists by looking for `{{#each}}`. A `data-each` nested inside one is left exactly as written: its contents render *once*, as ordinary markup, and every binding in them resolves against the *outer* item. It looks close enough to working to survive review, so activation now warns and names the form to write instead.

`$parents` costs nothing to have available: it is built only if a template asks for it, by walking the chain on first read. Both names are frozen, like every context - writing through `$parents[0]` warns and skips rather than throwing, which is the same thing a binding does with any path it cannot set.

> **Known limitation - `$parentContext.$index` does not survive a reorder.** Appending to the outer list is fine, and so is anything that leaves existing positions alone. But *moving* an outer row - a sort, a reverse, a prepend - relocates the DOM correctly while leaving the inner items reading the position their group used to be in. The refresh gate compares the parent context by its `$data` and `$root`, and a move changes neither, so no inner item is told anything happened. Ancestor *data* - `$parents[n]` and `$parent` - is correct throughout; it is only the enclosing *position* that goes stale. Fixed and awaiting a `domma-reactive` release.

## When not to reach for it

- **A one-off write.** If a value is set once and never changes, `$('#el').text(v)` is clearer than a binding. Bindings earn their keep when something changes more than once.
- **There is no `data-bind-html`, deliberately.** Assigning `innerHTML` from data is the shortest route to a cross-site scripting hole. The template already has an explicit, greppable opt-out - `{{{triple-stache}}}` - which says so where a reviewer can see it.
- **A list without a stable id.** Reconciliation needs an identity. If your rows have no id, either give them one or accept the wholesale re-render; a key derived from the contents is worse than no key at all.
- **Anything complicated.** The expression language stops well short of JavaScript on purpose. If a binding needs more than the grammar above, it belongs in a [computed](/showcase/models/bindings/reactivity), where it can be named, tested and read.
