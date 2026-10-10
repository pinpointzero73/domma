---
title: Reactivity
description: "Declare what a value is made of, once. Domma works out when it has to change, and re-runs exactly the work that depends on it - and nothing else."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Reactivity" tagline="Declare what a value is made of, once. Domma works out when it has to change, and re-runs exactly the work that depends on it - and nothing else." align="center"][/hero]

## Why you'd want this

Before - you own the wiring, and you own the bugs

```javascript
let total = price * qty;

priceInput.addEventListener('input', () => {
    price = +priceInput.value;
    total = price * qty;            // remember to recalculate
    totalEl.textContent = total;    // remember to repaint
    updateShippingBanner();         // remember what else depends on it
});

qtyInput.addEventListener('input', () => {
    qty = +qtyInput.value;
    total = price * qty;            // …all of it again
    totalEl.textContent = total;
    updateShippingBanner();
});
```

After - you declare the relationship once

```javascript
const order = M.create(
    {price: {}, qty: {}},
    {price: 10, qty: 3}
);

const total = M.computed(
    () => order.get('price') * order.get('qty')
);

M.effect(() => totalEl.textContent = total.get());
M.effect(() => updateShippingBanner(total.get()));
```

Everything worth caring about is visible in that difference. On the left, the fact that `total` is *made of* price and quantity is not written down anywhere. It is implied, twice, by two handlers that happen to agree with each other. Nothing in the language, the framework or your editor knows that they are supposed to agree - so the day someone adds a third input, or a discount, or a currency selector, the two handlers quietly stop agreeing and the page shows a number that was true a moment ago.

On the left you are responsible for four separate things, and every one of them is a place to be wrong:

- **Knowing what changed.** Each listener knows only its own input.
- **Knowing what that affects.** You hold the dependency graph in your head and retype it in every handler.
- **Recalculating.** By hand, in the right order, so nothing reads a value that has not caught up yet.
- **Repainting.** Also by hand, and also in every handler - the classic bug where the number is right in memory and stale on screen.

On the right, you write down the *relationship* - total is price times quantity - and stop there. Domma watches which values that expression actually reads while it runs, remembers them, and re-runs the expression when one of them moves. Add a third input and you change nothing but the expression. Add a fourth thing that depends on the total and you add one more `M.effect()`; no existing line is touched. The wiring is not *simpler* - it is gone, because nobody wrote it.

The pitch for reactivity is subtraction. It is not a faster way to update the page; it is a way to stop maintaining the list of things to update. That list is where the bugs live, and it is the part that grows fastest as a screen gets more interesting.

There is a second, quieter benefit, and the demos below put a number on it. Because Domma knows precisely which values each expression read, a write to something irrelevant costs nothing at all - not a cheap re-run, not a fast comparison, but **zero** re-evaluations. Type into a field the total does not read and the total's body does not run. You will see the counter refuse to move.

## In thirty seconds

This is a complete, working program - it has already run, and its output is underneath it. Change a number and press **Run**.

[showcase-demo id="showcase/models/reactivity/in-thirty-seconds" title="In thirty seconds" /]

Three lines are doing the work, and each names one of the three ideas the rest of this page expands on.

- `M.create()` - the **state**. Plain fields you write to.
- `M.computed()` - a **derived value**. You give it an expression; it gives you back something you read with `.get()`. It works out its own inputs by noticing what it reads.
- `M.effect()` - **work to repeat**. It runs once straight away, notes what it read, and runs again whenever any of that changes. Updating the DOM is the usual job.

The one line that will look odd is `M.flush()`. By default Domma does not recalculate the moment you write; it waits until the end of the current tick, so ten writes in a row cost one re-run rather than ten (that is section 7). Inside a snippet like this we want the output to appear in reading order, so we ask it to settle immediately. In an application you almost never write `M.flush()` - the wait is what makes it fast.

Nothing above subscribes to anything, names a field twice, or says which things to update. That is the entire premise: you describe relationships, and the dependencies are discovered by running the code.

## Derived values that can't go stale

Type in the three fields and watch the right-hand counter. It shows how many times the expression `price × qty` has actually been evaluated since the page loaded.

[showcase-demo id="showcase/models/reactivity/derived-values-that-can-t-go-stale" title="Derived values that can't go stale" /]

Say the numbers out loud, because they are the point. Twenty keystrokes in **Note**: **zero** re-evaluations. Ten presses of **Read total again**: **zero**. One keystroke in **Quantity**: exactly **one**. A hand-written version gets that last case right and the first two wrong, because a change handler that fires on any change has no way to tell whether the change mattered.

Two behaviours produce that. The first is that a computed is **lazy**: its expression does not run when you create it, and does not run when something it depends on changes. It runs when somebody asks for the value and the cached answer is known to be out of date. Work you never look at is work that never happens. The second is that it **caches**: having run once, it hands back the same answer to every subsequent reader until a value it genuinely read moves. Sharing one computed between five parts of a screen costs one evaluation, not five.

Note what is *not* here: you never told Domma that the total depends on price and quantity. It found out by watching the expression run. That matters more than it first appears - a declared dependency list is another thing that can disagree with the code, and it always eventually does.

M.computed()

.get()

.peek()

.dispose()

```javascript
const order = M.create(
    { price: {}, qty: {}, note: {} },
    { price: 10, qty: 3, note: '' }
);

const total = M.computed(() => order.get('price') * order.get('qty'));

total.get();              // 30 - body runs now
total.get();              // 30 - cached, body does not run

order.set('note', 'hi');  // 'note' was never read → no re-evaluation
total.get();              // 30 - still cached

order.set('qty', 4);
total.get();              // 40 - a dependency moved, so it re-evaluates
```

Computeds compose. One computed reading another links the two automatically, and a computed shared by several others is evaluated once per settle, not once per reader - so `subtotal → vat → total` costs one evaluation of `subtotal`, not two. Use `.peek()` to read a value without becoming dependent on it, and `.dispose()` when a long-lived computed outlives the screen that needed it.

## One value, no schema

[showcase-demo id="showcase/models/reactivity/one-value-no-schema" title="One value, no schema" /]

An observable is a box with one value in it. Read it with `.value` and whatever derivation is running becomes a dependent; write `.value` and every dependent is told. That is the whole primitive, and everything else on this page is built on it - a model is, quite literally, one observable per field.

Use `M.create()` when the data is a *record*: it has named fields, those fields have types and validation rules, you want the same shape to drive a form via `F.create()`, and you may want it persisted to storage. Use `M.observable()` when the data is *one thing* and a schema would be ceremony: a sidebar's open/closed flag, a search term, the id of the currently selected row, a loading boolean. Writing a three-line blueprint to hold a boolean is the sort of friction that makes people give up and reach for a global variable.

[table striped="true"]
| Reach for | When | Because |
| --- | --- | --- |
| `M.create(blueprint)` | A record with several named fields | You get validation, defaults, `toJSON()`, persistence, and a shape that `F.create()` can turn into a form |
| `M.observable(value)` | One value, on its own | No schema to write and nothing to name twice; the tracking is identical |
[/table]

They mix freely. A computed can read three model fields and two loose observables in the same expression, and the dependency graph does not care which is which.

```javascript
const query   = M.observable('');
const loading = M.observable(false);
const results = M.observable([]);

const summary = M.computed(() => {
    if (loading.value) return 'Searching…';
    if (!query.value)  return 'Type to search';
    return `${results.value.length} match(es) for “${query.value}”`;
});

M.effect(() => $('#status').text(summary.get()));

// Later, from anywhere - no subscription, no event name, no repaint call
loading.value = true;
```

> **One gotcha worth knowing early.** An observable only tells its dependents when the new value differs from the old one, and it decides that by comparison. So changing an object or array *in place* and assigning it back is invisible - the old and new values are the same thing. Always assign a new value: `list.value = [...list.value, item]`, not `list.value.push(item)`. Section 10 has a runnable demonstration, and the next section explains why arrays get an exception.

## Lists that update themselves

[showcase-demo id="showcase/models/reactivity/lists-that-update-themselves" title="Lists that update themselves" /]

A shopping list, a table's rows, a set of selected ids - most application state that is interesting is a list, and the ordinary way to change a list is to mutate it. `M.observableArray()` exists so that the natural code works: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill` and `copyWithin` all notify, as do Domma's own `remove(item)` and `removeAll()`.

Those mutators notify **unconditionally**, and the reason is the gotcha from the last section. A comparison cannot detect an in-place change: after a `push`, the array is still the same array, so comparing it against itself reports no difference no matter what happened. Rather than keep a shadow copy and diff it on every mutation - O(n) per push, for a result that throws away the useful detail - the array simply announces that it changed. The accepted cost is the occasional notification from a mutator that changed nothing, such as a `sort()` on an already-sorted list. That errs towards telling you too often rather than too rarely, which is the safe direction: a redundant repaint is a wasted frame, a missed one is a bug your users report.

Assigning the whole array (`items.value = [...]`) behaves like an ordinary observable and *is* compared, so replacing a list with an identical one stays quiet. Reading `.length` is tracked, because rendering a count is the obvious use and a count that never updated would be a trap.

One deliberate asymmetry to know about: the initial array, and any array assigned wholesale, is **copied** rather than adopted. If it held your reference, a `push` through your original variable would change what `.value` returns without ever reaching the dependency graph - the data and the screen would disagree silently, with no event left to recover by. `M.observable()` can safely adopt by reference precisely because it offers no in-place path. If you genuinely want the live array, take it from `.peek()`; that is the intended escape hatch.

M.observable()

M.observableArray()

.value

.length

.peek()

.remove()

.removeAll()

```javascript
const todos = M.observableArray([]);

const outstanding = M.computed(
    () => todos.value.filter(t => !t.done).length
);

M.effect(() => $('#badge').text(outstanding.get()));

todos.push({text: 'Buy milk', done: false});   // badge → 1
todos.push({text: 'Post letter', done: false}); // badge → 2
todos.removeAll();                              // badge → 0
```

> **Comparison semantics differ slightly from `_.isEqual`.** `M.observable()` and `M.observableArray()` default to the reactive core's own deep equality, which treats `NaN`, `Date`, class instances, `Map`/`Set`/`RegExp` and typed arrays differently from Domma's `utils.isEqual`. Pass `{equals}` if you need Domma's exact rules - and wrap it, `{equals: (a, b) => _.isEqual(a, b)}`, because handing over `_.isEqual` bare loses its receiver and throws.

## React to changes without wiring subscriptions

Edit the fields on the left. The log on the right is written by a single effect that nobody calls.

[showcase-demo id="showcase/models/reactivity/react-to-changes-without-wiring-subscriptions" title="React to changes without wiring subscriptions" /]

An effect is the answer to "when this changes, do that". It runs once immediately - which is how it learns what it reads - and then again whenever any of those values move. It returns a stop function, and calling it detaches the effect from everything at once. There is no event name to invent, no handler to keep a reference to, and no list of fields to keep in step with the body.

Compare it with the version you would otherwise write. The manual form has a failure mode that nothing catches: it is a string compared against a field name, so renaming `qty` leaves you with code that runs, throws nothing, and silently never fires again.

Hand-wired - a string that has to match a field name

```javascript
model.onChange(({field, newValue}) => {
    if (field === 'qty') recalculate();
});

// Renaming the field breaks this silently.
// Reading a second field means editing the
// condition as well as the body.
```

Tracked - subscribes to whatever it reads, and only that

```javascript
M.effect(() => recalculate(model.get('qty')));

// Read a second field and it is a dependency
// from that moment on. Nothing else to update.
```

`M.untracked()` is the escape hatch for the case where you need a value but must not depend on it - a session id, a start timestamp, a debug flag. Read it inside `M.untracked(() => …)` and the graph looks the other way. Without it, effects have an unfortunate habit of accumulating dependencies on things they merely mention.

M.effect()

M.untracked()

M.flush()

model.tracked()

```javascript
const stop = M.effect(() => {
    const user  = prefs.get('username');   // tracked
    const theme = prefs.get('theme');      // tracked

    // Read without subscribing to it
    const session = M.untracked(() => prefs.get('sessionId'));

    render(user, theme, session);
});

stop();   // unsubscribe from everything, in one call
```

If you prefer property syntax to `get()`, `model.tracked()` hands back a read-tracked, write-through view: `state.count` reads and tracks, `state.count = 5` writes through `set()` so validation, notification and persistence all still run. It is exactly what backs `this.data` inside components.

## One render per change, not one per write

Each button below writes to three fields that a single effect reads. Watch the counter: whichever button you press, it goes up by **one**.

[showcase-demo id="showcase/models/reactivity/one-render-per-change-not-one-per-write" title="One render per change, not one per write" /]

A write never recomputes anything on the spot. It marks whatever depends on it as out of date and books a single tidy-up for the end of the current tick. Everything that fell out of date in that tick is then settled together, in dependency order, once each. The benefit is not only speed - it is that nobody ever observes a half-updated screen. If you set a price and a currency on consecutive lines, no render happens in between showing the new price against the old currency.

This is also what makes the "write freely" style safe. A loop that assigns fifty fields costs one settle. An event handler that touches four models costs one settle. You are never punished for writing state in the order that reads most clearly, which is the usual reason people start batching things by hand and end up with a manual `render()` call they must remember.

Ordering is guaranteed inside a settle: derived values are brought up to date first and effects run last, so an effect never sees a computed that has not caught up. A computed that recomputes to the same answer stops there and does not wake its own dependents, so a chain settles as soon as it stops actually changing.

```javascript
// Three separate writes, same tick → ONE effect run
form.set('a', 1);
form.set('b', 2);
form.set('c', 3);

// One batched write → also ONE effect run
form.set({ a: 1, b: 2, c: 3 });

// Need it settled right now (tests, or reading straight after a write)?
form.set('a', 9);
M.flush();
```

`M.flush()` forces the settle to happen immediately. It exists for tests and for the rare place that must read a derived value on the very next line after a write. Reaching for it in ordinary application code usually means something is being read too eagerly - the wait is the optimisation.

## It stops listening to what it stopped reading

One effect, two possible inputs, and a switch that decides which one it reads. Edit the field the effect is not currently reading and nothing happens at all.

[showcase-demo id="showcase/models/reactivity/it-stops-listening-to-what-it-stopped-reading" title="It stops listening to what it stopped reading" /]

Dependencies are collected afresh on every run, not once when the derivation is created. So a derivation that took the `else` branch this time is subscribed to what the `else` branch read, and to nothing the `if` branch touched. Take the other branch next time and the subscriptions swap with it.

This is what stops reactivity degenerating as an application grows. Real screens are full of conditions - a panel that only reads the filter when it is expanded, a total that only reads the discount when one applies, a row that only reads the edit buffer while being edited. With a declared dependency list, each of those has to declare everything either branch *might* read, so the collapsed panel wakes up on every keystroke in a filter nobody can see. Here, the cost of a branch you did not take is nothing, and it stays nothing without anybody maintaining it.

It also means a derivation cannot leak subscriptions over time. Whatever it read on its last run is the complete set - old links are dropped rather than accumulated - so a long-lived effect whose conditions shift does not slowly become subscribed to the whole application.

```javascript
M.effect(() => {
    // Only ONE of x / y is a dependency at any moment
    const value = state.get('mode') === 'x'
        ? state.get('x')
        : state.get('y');

    log(value);
});
```

## Already on in your components

The component below is an ordinary `Domma.component()` with two computed properties. The log records every render, and how many times the `label` expression has run.

[showcase-demo id="showcase/models/reactivity/already-on-in-your-components" title="Already on in your components" /]

There is no opt-in and no new syntax. If you already write components with a `data()` and a `computed:` block, you are already getting all of this: each computed re-evaluates only when a field it read changes, each `{{ }}` binding updates only the text it owns rather than re-rendering the template, and a burst of writes such as `this.set({price: 60, qty: 2})` produces one render and one `onUpdated()` call.

The distinction worth knowing is between the two kinds of binding. A plain `{{label}}` is a text binding, so a change updates that one text node surgically. A structural binding such as `{{#if free}}` has to add or remove elements, so it re-renders - but only when the condition actually flips, not every time something it reads is written. In practice that means the expensive path is taken rarely and by itself.

Inside a component, `this.data` is a tracked view of the model, which is why reading `this.data.items` in a computed is enough to subscribe to it. Writes go through `this.set()` so validation and persistence still run.

```javascript
Domma.component('order-summary', {
    template: '<p>{{label}}</p>{{#if freeDelivery}}<em>Free delivery</em>{{/if}}',

    data() { return { items: 1, unitPrice: 25, discount: false, note: '' }; },

    computed: {
        // Re-evaluates only when items / unitPrice / discount change
        label() {
            const gross = this.data.items * this.data.unitPrice;
            return `${this.data.items} item(s) - £${this.data.discount ? gross * 0.9 : gross}`;
        },
        freeDelivery() { return this.data.items * this.data.unitPrice > 50; }
    }
});
```

> **Computeds must be synchronous.** Dependency collection ends at the first `await`, so anything read after it is invisible to the graph. Fetch first, then write the result to the model and let the derivations react to that. The same applies to effects: track synchronously, then act.

## When not to reach for it

Reactivity is not free and it is not universal. Here is where it is the wrong tool, and where it has edges you will otherwise find the hard way.

### A value nothing derives from does not need to be observable

The whole benefit is that dependents are told. State with no dependents has no benefit to collect, and wrapping it costs you a box to open on every read plus a graph node that will never fire. A configuration object read once at start-up, a constant, a cached lookup table, a value used only inside the function that produced it - leave them as plain variables. Reach for an observable at the moment something else needs to follow the value, not before. Making everything reactive on principle is the reactive equivalent of making every field private with a getter: ceremony that obscures the three places where it mattered.

### Derivations must return new values, not edit old ones

Change is detected by comparing the new value with the old one. If you mutate an object or array in place and hand back the same reference, there is nothing to compare - the value is identical to itself - and the change does not propagate. This one is not rare and it is not obvious, so run it:

[showcase-demo id="showcase/models/reactivity/derivations-must-return-new-values-not-edit-old-" title="Derivations must return new values, not edit old ones" /]

Note the last line: the data was never wrong. The write always lands - only the *notification* is gated. That is what makes the bug quietly awful, because the model and the screen disagree while every value you inspect looks right. The rule is short: in a computed, return `[...items, x]` rather than `items.push(x); return items`. The exception is `M.observableArray()`, whose mutators exist precisely to make in-place list edits safe; section 5 explains why it can afford to skip the comparison.

### Date-valued model fields do not notify

A real, documented limitation, pinned by a test so that changing it has to be a deliberate decision: `utils.isEqual` considers *any* two `Date` instances equal, because neither has own enumerable keys. A model field holding a `Date` therefore stores the new value and tells nobody.

[showcase-demo id="showcase/models/reactivity/date-valued-model-fields-do-not-notify" title="Date-valued model fields do not notify" /]

Store timestamps (numbers) or ISO strings in reactive fields and turn them into dates at the point of display with `D()`. That is good practice for serialisation and persistence anyway. Note that `M.observable()` is *not* affected - its default comparison handles `Date` correctly; the limitation belongs to model fields, which are deliberately gated with Domma's own `utils.isEqual` to preserve long-standing behaviour.

### Other edges worth knowing

- **Nothing asynchronous is tracked past the first `await`.** Tracking is collected while the function runs; once it suspends, the collector has moved on. Read what you need synchronously, then await.
- **Reading a whole model tracks every field.** `model.get()` with no argument subscribes to all of them - the conservative choice, since the caller could touch any. Prefer `model.get('field')` inside derivations. `model.toJSON()` is deliberately untracked, for render-time and serialisation reads.
- **Writes made from `onUpdated()` must converge.** Set a value that will compare equal on the next pass. A value that differs every time - `Date.now()`, an incrementing counter - re-triggers the watcher indefinitely, and because it is a microtask chain it locks the page rather than throwing.
- **Declare every field in `data()`.** Observables are created lazily, so a component field that did not exist when the watcher collected its dependencies stays untracked until some declared field changes.
- **A moved component is inert.** Disconnecting disposes its effects and destroys its model, so relocating an element in the DOM does not rebuild its reactive wiring. Pre-existing behaviour, unchanged by tracking.
- **Effects are not a place for imperative sequences.** If code must run once, in order, in response to a user action, that is a click handler. An effect answers "keep this in step with that", and an effect that submits a form or navigates will eventually do so at a moment you did not intend.

None of this argues against reactivity - it argues for using it where derivation is the actual shape of the problem. The good instinct is: state that other state or the screen is a *function of* belongs in the graph; everything else is just a variable.

## Use it without Domma

Everything on this page is a thin namespace over a package published on its own: `domma-reactive`. If you like the tracking but do not want a framework, install just that.

```bash
npm install domma-reactive
```

```javascript
import {observable, computed, effect} from 'domma-reactive';

const price = observable(10);
const qty   = observable(3);

const total = computed(() => price.value * qty.value);

effect(() => console.log('total is', total.get()));

qty.value = 4;   // effect re-runs on the next microtask
```

The snippet below is that example with one substitution: `M.observable` for `observable`. They are not merely similar - they are the same functions, since Domma takes the package as an exact-pinned build-time dependency and inlines it. Run it, then mentally swap the names back.

[showcase-demo id="showcase/models/reactivity/use-it-without-domma" title="Use it without Domma" /]

The package exports `observable()`, `observableArray()`, `computed()`, `effect()`, `untracked()` and `flushSync()`, has no dependency on Domma and no dependency on the DOM. It ships ESM, CJS and a browser build.

> **You do not need to install it to use Domma.** Reactivity is innate - the package is an additional way in, not a relocation. Rollup inlines it at build time, so `domma.min.js` stays a single self-contained file and the CDN story is unchanged.

## Method reference

[table striped="true"]
| Method | Returns | Description |
| --- | --- | --- |
| `M.observable(value, options?)` | `Observable` | One tracked value, with no schema. Reading `.value` subscribes; writing it notifies when the comparison sees a change. |
| `M.observableArray(array?, options?)` | `ObservableArray` | Tracked array. In-place mutators notify unconditionally; wholesale assignment is compared. Copies rather than adopts. |
| `M.computed(fn, options?)` | `ComputedRef` | Lazily-evaluated derived value. Caches until a tracked dependency changes. Options: `label`, `onChange`. |
| `M.effect(fn, options?)` | `Function` | Runs now, and again on dependency change. Returns a stop function. |
| `M.untracked(fn)` | `any` | Read values without registering them as dependencies. |
| `M.flush()` | `void` | Settle pending reactive work immediately rather than on the microtask. |
| `model.tracked()` | `Proxy` | Read-tracked, write-through view. Writes still validate, notify and persist. |
| `observable.value` | `any` | Read (tracked) and write. Assigning notifies only on a real change. |
| `observable.set(next)` | `void` | Imperative alias for assigning `.value`. |
| `observableArray.length` | `number` | Tracked length, so a rendered count stays current. |
| `observableArray.remove(item)` | `ObservableArray` | Remove every occurrence in place, then notify. Chainable. |
| `observableArray.removeAll()` | `ObservableArray` | Empty the array in place, then notify. Chainable. |
| `ref.get()` | `any` | Current value; registers a dependency on the caller. |
| `ref.peek()` | `any` | Current value *without* registering a dependency. |
| `ref.dispose()` | `void` | Unlink from the dependency graph. |
[/table]

> **Going further:** the full rules, propagation policy and compatibility notes are in `docs/Reactivity.md`; component specifics are in `docs/Components.md`; the schema system that `M.create()` builds on is in `docs/Blueprints.md`.
