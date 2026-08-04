# Reactivity — Dependency Tracking

Domma tracks which fields a derivation actually reads, so a write re-runs exactly the work that depends on it and
nothing else.

The primitives live in the [`domma-reactive`](https://www.npmjs.com/package/domma-reactive) package and are exposed on
the models namespace as `M.observable()`, `M.observableArray()`, `M.computed()`, `M.effect()`,
`M.untracked()` and `M.flush()`.

---

## Why

Before dependency tracking, a component with computed properties re-evaluated **every** computed on **every** field
change, then deep-compared each result against a cache to work out what had actually moved. One keystroke cost N
computed invocations plus N deep comparisons, regardless of relevance. Computeds that read other computeds recomputed
them from scratch, so a chain of N computeds each reading M others cost O(N×M) per change.

Tracking replaces that with a graph walk: a write triggers only the derivations that read that field.

---

## The three ideas

**Tracking.** While a computed or effect is running, every field it reads registers a two-way link. Dependencies are
re-collected on every run, so a derivation whose branches change stops listening to the branch it no longer takes.

**Laziness.** A computed does not run until something reads it, and afterwards the cached value is reused until a
dependency actually changes.

**Batching.** Writes never recompute anything synchronously. They mark dependents dirty and schedule a single microtask
flush, so a burst of writes collapses into one propagation pass — and, in components, one render.

---

## Observables

`M.observable(initial)` is a single reactive value — the primitive beneath Models.
Use `M.create()` when you want a schema, validation and persistence; use an observable
when you want one tracked value and nothing else.

```javascript
const price = M.observable(10);
const qty   = M.observable(3);
const total = M.computed(() => price.value * qty.value);

M.effect(() => console.log('total', total.get()));
qty.value = 4;   // effect re-runs on the next microtask
```

| Member | Description |
|---|---|
| `value` | Read (tracked) and write. Assigning notifies only if the comparator saw a change. |
| `peek()` | Read **without** registering a dependency. |
| `set(next)` | Imperative alias for assigning `.value`. |

`M.observableArray()` is the array form. Its in-place mutators — `push`, `pop`, `shift`,
`unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`, plus Domma's own `remove(item)`
and `removeAll()` — notify unconditionally, because an in-place mutation leaves the array
deep-equal to any copy of it and the equality gate cannot see it. Wholesale assignment to
`.value` is gated, exactly as `observable()` is. It also exposes a tracked `length`.

The initial array, and any array assigned wholesale, is copied rather than adopted, so a push
through your original reference cannot desynchronise the graph. Take `peek()` if you genuinely
want the live array.

Both default to `domma-reactive`'s deep equality, which differs from `utils.isEqual` for NaN,
Dates, class instances, Map/Set/RegExp and typed arrays. Pass `{equals}` if you need Domma's
exact semantics — note that `_.isEqual` must be wrapped (`(a, b) => _.isEqual(a, b)`), as it
recurses through its receiver and throws if handed over bare.

Both are also published standalone as [`domma-reactive`](https://www.npmjs.com/package/domma-reactive),
where they are bare `observable()` / `observableArray()` imports. Reactivity remains innate
to Domma — the package is an additional way in, not a relocation.

---

## `M.computed(fn, options?)`

A lazily-evaluated derived value.

```javascript
const model = M.create({price: {}, qty: {}}, {price: 10, qty: 3});

const total = M.computed(() => model.get('price') * model.get('qty'));

total.get();            // 30 — body runs now
total.get();            // 30 — cached, body does not run

model.set('qty', 4);
total.get();            // 40 — re-evaluated on demand
```

| Member | Description |
|---|---|
| `get()` | Current value, recomputing only if a dependency changed. Registers a dependency on the caller. |
| `peek()` | Current value **without** registering a dependency. |
| `dispose()` | Unlink from the dependency graph. |

**Options:** `label` (used in console warnings), `onChange` (called with the new value when it changes).

Computeds compose — one reading another links the two automatically, and a computed shared by several others is
evaluated once per flush, not once per reader.

```javascript
const subtotal = M.computed(() => model.get('price') * model.get('qty'));
const vat      = M.computed(() => subtotal.get() * 0.2);
const total    = M.computed(() => subtotal.get() + vat.get());
// subtotal evaluates once when total is read, not twice.
```

---

## `M.effect(fn, options?)`

Runs immediately (to collect dependencies), then again whenever anything it read changes. Returns a stop function.

```javascript
const stop = M.effect(() => {
    $('#total').text(model.get('price') * model.get('qty'));
});

model.set('price', 20);   // effect re-runs on the next microtask

stop();                   // unsubscribe
```

Effects are the replacement for hand-wiring `onChange` with a field-name comparison:

```javascript
// ❌ Manual wiring — breaks silently if the field name or callback signature drifts
model.onChange(({field, newValue}) => {
    if (field === 'qty') recalculate();
});

// ✅ Tracked — subscribes to whatever it reads, and only that
M.effect(() => recalculate(model.get('qty')));
```

---

## `M.untracked(fn)`

Read values without registering them as dependencies.

```javascript
M.effect(() => {
    const live = model.get('count');                        // tracked
    const seed = M.untracked(() => model.get('startedAt')); // not tracked
    render(live, seed);
});
```

---

## `M.flush()`

Settles pending reactive work immediately rather than waiting for the microtask. Mainly for tests, and for code that
must observe a derived value synchronously after a write.

```javascript
model.set('v', 7);
M.flush();
// dependent effects have now run
```

---

## `model.tracked()`

A read-tracked, write-through view of a model's data. Reads register dependencies; writes route through `set()`, so
validation, change notification and persistence all still run.

```javascript
const state = model.tracked();

M.effect(() => console.log(state.count));   // re-runs when count changes

state.count = 5;                            // validated, notified, persisted
```

This is what backs `this.data` inside component computeds and methods.

---

## Components

`Domma.component()` uses tracking automatically — no API change:

```javascript
Domma.component('order-total', {
    template: '<p>{{label}}</p>{{#if free}}<span>Free delivery</span>{{/if}}',

    data() { return {price: 10, qty: 1, note: ''}; },

    computed: {
        label() { return `£${this.data.price * this.data.qty}`; },
        free()  { return this.data.price * this.data.qty > 50; }
    }
});
```

- `label` and `free` re-evaluate only when `price` or `qty` change. Writing `note` costs nothing.
- `label` is a text binding → surgical `textContent` update.
- `free` is structural (`{{#if}}`) → full re-render, but only when the boolean actually flips.
- A burst such as `this.set({price: 60, qty: 2})` produces **one** render and **one** `onUpdated` call.

### Propagation policy

1. **Equality short-circuit** — a computed that recomputes to an `isEqual` value does not propagate.
2. **Cascade** — changed computeds push their dependents onto the worklist, so deep chains settle in one pass.
3. **Diamond-safe** — a derivation reachable by two paths may run again once the slower path settles, bounded by a
   visit budget that also breaks dependency cycles (logged as a warning).
4. **Effects last** — effects fire only once the value graph has settled, so a render never sees an intermediate state.

---

## Rules and limits

**Computeds and effects must be synchronous.** Dependency collection ends at the first `await`, so anything read after
it is invisible to the graph. Fetch first, then write to the model.

```javascript
// ❌ Reads after the await are not tracked
M.effect(async () => {
    const id = model.get('id');
    const data = await H.get(`/api/${id}`);
    render(model.get('mode'), data);        // 'mode' never tracked
});

// ✅ Track synchronously, then act
M.effect(() => {
    const id = model.get('id');
    H.get(`/api/${id}`).then(render);
});
```

**Return new values, don't mutate old ones.** The equality short-circuit compares with `utils.isEqual`, so a computed
that edits and returns the same object will not propagate.

```javascript
// ❌ Mutates in place — isEqual sees no change
items() { this._cache.push(x); return this._cache; }

// ✅ New value
items() { return [...this.data.items, x]; }
```

**Props are not tracked.** An attribute change re-renders the component in full via `attributeChangedCallback`, and all
computeds are invalidated first so props-derived values refresh.

**Reading a whole model tracks every field.** `model.get()` with no argument registers a dependency on every field
present — the conservative choice, since the reader could touch any of them. Prefer `model.get('field')` inside
derivations. `model.toJSON()` is deliberately **untracked**, for render-time and serialisation reads.

**Relocated components are inert.** `disconnectedCallback` disposes effects and destroys the model, so an element moved
in the DOM does not rebuild its reactive wiring. This is pre-existing behaviour, unchanged by tracking.

---

## Compatibility

Dependency tracking is **additive**. Existing behaviour is untouched:

- `onChange` and `onFieldChange` still fire **synchronously**, once per field, with their current signatures.
- `M.bind()` DOM bindings still update synchronously.
- Model validation still throws from `set()` at the call site.
- Persistence still auto-saves on write.

Only tracked computations are batched onto the microtask.

> **Note on `onChange` callback shape:** `onChange` passes a **single object** —
> `({field, newValue, oldValue, model})` — whereas `onFieldChange(field, cb)` passes positional
> `(newValue, oldValue, model)`. Code destructuring `onChange` positionally as `(field, newValue)` will silently never
> match. Prefer `M.effect()`, which removes the question entirely.

---

## Related

- [src/CLAUDE.md](../src/CLAUDE.md) — core module architecture
- [docs/Blueprints.md](./Blueprints.md) — schema system powering models and forms
- [docs/Components.md](./Components.md) — standalone component definitions
