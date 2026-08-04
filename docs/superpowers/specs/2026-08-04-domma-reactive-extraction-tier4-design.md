# domma-reactive: Extraction & Tier 4 Bindings — Design

**Date:** 2026-08-04
**Status:** Approved, ready for implementation planning
**Builds on:** Tiers 1–3, shipped in Domma v0.30.0 / v0.30.1

---

## 1. Motivation

Domma v0.30.0 introduced dependency tracking (`M.computed`, `M.effect`, `model.tracked()`) and
v0.30.1 stabilised it. The reactive **core** is now comparable with KnockoutJS — runtime dependency
tracking, lazy cached computeds, conditional dependency re-collection, batched microtask flush, and
deterministic diamond settling.

The **binding layer** is not comparable. Concretely, against Knockout:

| Gap | Current Domma behaviour |
|-----|-------------------------|
| List reconciliation | `{{#each}}` re-renders the entire block on any collection change |
| Per-item bindings | Nothing inside `{{#each}}` / `{{#with}}` is independently bound |
| Binding context | No `$data`, `$index`, `$parent`, `$root` |
| Event bindings | None — events are wired imperatively in `onMount` |
| Two-way bindings | None in templates; `M.bind()` is imperative and per-field |
| Extensible handlers | Binding kinds are hard-coded (text/attr/block/raw) |
| Expressions | Only dotted paths bind; anything else renders once and goes stale |
| Observables | No standalone state primitive — reactivity is bootstrapped from `Model` |

This project closes those gaps, and does so in a **separately published package** so the binding
system is usable outside Domma while remaining integral to it.

---

## 2. Decisions

Each was chosen explicitly during brainstorming.

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Sequencing | **Extract first, then build Tier 4 in the new repo** | The surface is at its smallest now (~700 lines, two files, one import). Tier 4 roughly triples the binding layer. Building in the new home forces an honest API boundary from day one. |
| Consumption | **Build-time devDependency, bundled by Rollup** | `domma.min.js` stays a single self-contained file; jsDelivr and the CDN story are untouched; consumers install nothing; Domma's zero-runtime-dependency claim stays literally true. |
| Package scope | **Reactivity + DOM binding** | That is the Knockout-equivalent surface. `component-factory` stays in Domma because it depends on `DommaElement` and the theme system. |
| Template syntax | **Hybrid** — extend Domma's own `{{ }}` engine for blocks, add Domma-native `data-*` attributes for behaviour | Existing templates keep working. Behaviour bindings *must* live on attributes: `{{ }}` is a text-substitution construct producing a string, while events and two-way binding need a DOM element reference that survives rendering. |
| Attribute flavour | **Domma-native `data-*`**, not a Knockout `data-bind` clone | Domma already uses `data-icon`, `data-tooltip`, `data-layout`, `data-section`, `data-flag`. |
| State primitive | **Observables, property-style** (`count.value`) | Domma established the property/proxy idiom in v0.30.0 via `model.tracked()`. Call-style (`count()`) would put two competing idioms in one framework. |
| Audience | **Domma users first**, standalone second | Informs naming, docs and idiom choices. |
| Expression evaluation | **CSP-safe parser (subset)** | The `Function` constructor breaks under `script-src 'self'` without `unsafe-eval` — a well-known Knockout deployment flaw. The point is to beat Knockout, not inherit its limitations. |

### Explicitly out of scope

- **Deep/nested tracking** (tracking `user.name` separately from `user`). Largely retired by explicit
  observables — compose them instead.
- **LIS-optimal move minimisation** in the reconciler. The first cut uses in-order placement, which
  is correct for append/prepend/remove/reorder but may perform more DOM moves than strictly minimal.
  This is a deferred refinement and must be logged as such rather than quietly omitted.
- **Server-side rendering / hydration.**
- **Migrating `component-factory` out of Domma.**

---

## 3. Package identity

- **Repo:** `pinpointzero73/domma-reactive`
- **npm package:** `domma-reactive` (verify availability before publishing; fall back to
  `@dommajs/reactive` if taken)
- **Relationship:** Domma declares an **exact pin** in `devDependencies`. Rollup inlines it.

**Accepted cost:** two release cycles. A fix in `domma-reactive` is not live for Domma users until
Domma bumps the pin, rebuilds and re-releases. This is a known, accepted trade-off, and mirrors the
existing `domma-cms` → `domma-js` exact-pin relationship.

---

## 4. Architecture

```
observable / observableArray      ← state primitive (NEW)
        ↑
computed / effect / untracked     ← existing, moved as-is
        ↑
expression evaluator              ← NEW, CSP-safe
        ↑
binding compiler + reconciler     ← Tier 4
─────────── package boundary ───────────
Domma Model                       ← becomes an adapter over observables
        ↑
component-factory                 ← consumer, stays in Domma
```

### Module layout (`domma-reactive`)

| Module | Responsibility |
|--------|----------------|
| `observable.js` | `observable()`, `observableArray()`, and the tracking proxy used by adapters |
| `graph.js` | `Dep`, `Computation`, flush scheduler — moved from `reactive.js` unchanged |
| `expression.js` | Tokeniser, Pratt parser, AST evaluator, helper registry |
| `context.js` | Binding context — `$data`, `$index`, `$parent`, `$root`, child-context creation |
| `compiler.js` | Template parsing, binding extraction, `<template>` capture for blocks |
| `handlers.js` | Built-in binding handlers + `registerBinding()` registry |
| `reconciler.js` | Keyed list diffing and instance lifecycle |
| `index.js` | Public API surface |

Each module must be independently testable and understandable without reading the others'
internals. `graph.js` in particular must not know that bindings or the DOM exist.

### `utils.isEqual`

`reactive.js` currently imports exactly one thing from Domma: `utils.isEqual`, used by the equality
short-circuit. The package will carry **its own** minimal deep-equality helper rather than take a
dependency back on Domma. Domma's `utils.isEqual` stays as-is for its own callers.

---

## 5. Binding syntax

### Block-level (Domma's `{{ }}` engine, extended)

```html
{{#each items key=id}}
    <li>{{name}} — {{$index}}</li>
{{/each}}
```

`key=` names the property that identifies an item. It is **required** for reconciliation; without it
the block falls back to Tier 3 behaviour (full re-render) and logs a one-time console warning naming
the template, so the degradation is visible rather than silent.

### Behaviour-level (`data-*` attributes)

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-on-<event>` | Event binding, any DOM event | `data-on-click="save"` |
| `data-bind-text` | One-way to text content | `data-bind-text="user.name"` |
| `data-bind-<attr>` | One-way to an attribute | `data-bind-class="isActive && 'on'"` |
| `data-model` | **Two-way** — input ↔ observable | `data-model="query"` |
| `data-if` | Conditional without a block | `data-if="isOpen"` |

### Observable shape

Two distinct access styles exist, and they are not interchangeable — this is deliberate:

```javascript
// A single observable: read and write through .value
const count = observable(0);
count.value;            // read (tracked)
count.value = 5;        // write (notifies)

// An observable array: .value is the array; mutators notify granularly
const items = observableArray([]);
items.value;            // the underlying array (tracked)
items.push({id: 1});    // notifies, and feeds the reconciler as one insert

// A tracking proxy over an object: fields are read/written directly.
// This is what Domma's model.tracked() returns, and what adapters use.
const state = trackingProxy(source);
state.count;            // read (tracked)
state.count = 5;        // write (routed through the adapter)
```

`.value` is for a standalone observable holding one value. Direct field access is for a proxy over
an existing object. Domma users continue to meet only the proxy form, via `model.tracked()`.

### Binding context

Inside a list or `with` block, expressions resolve against a child context exposing `$data`,
`$index`, `$parent` and `$root`. Outside such a block these still resolve — `$data` and `$root` are
the top-level context, `$parent` is `null`, `$index` is `null`.

---

## 6. Compilation and reconciliation

The significant architectural shift: **block bodies compile once into a reusable `<template>` and
are cloned per item**, rather than re-rendered to a string. String re-rendering is precisely why
per-item bindings are impossible today.

### Compile phase (once per template)

1. Expand partials.
2. Parse structure; capture each block body as a `<template>` element.
3. Extract bindings — text, attribute, event, two-way, block — each with its parsed expression AST
   and its dependency set.

### Instantiate phase (per item / per block render)

1. Clone the block's `<template>` content.
2. Create a child binding context for the item.
3. Wire one effect per binding within that context.

### Reconcile phase (on collection change)

1. Build `key → existing instance` from the current DOM.
2. For each key in the new collection: reuse the existing instance if present (**keeping its DOM
   nodes and its effects alive**), otherwise clone a fresh one.
3. Place nodes in order.
4. Dispose instances whose keys are gone — dispose effects, then remove nodes.

`observableArray` mutators feed this directly: a `push` is one insert rather than a full diff.

**Disposal is mandatory.** Every instance owns its effects; dropping nodes without disposing effects
leaks the computation graph. This is the single most likely source of subtle bugs.

---

## 7. Expression evaluator

Tokeniser → Pratt parser → AST → evaluate against a binding context.

**Supported:** property paths (`a.b.c`), indexing (`a[0]`, `a[key]`), comparison
(`=== !== < <= > >=`), logical (`&& || !`), ternary, arithmetic (`+ - * / %`), string concatenation,
literals (string, number, boolean, null), and calls to **registered helpers only**.

**Not supported, by design:** arbitrary function calls, member calls (`x.foo()`), assignment,
`new`, property access on `__proto__` / `constructor` / `prototype`, and anything requiring `eval`
or the `Function` constructor.

Parse failures produce a console warning naming the template and the offending expression, and the
binding is skipped — never a thrown error that takes down a render.

Expressions are parsed **once at compile time** and the AST cached; evaluation per update is a
tree-walk with no re-parsing.

---

## 8. Migration and backwards compatibility

**The acceptance bar: every existing Domma template keeps working unchanged, and the full test suite
stays green.**

- Tier 3's four binding kinds (text/attr/block/raw) are re-expressed as **built-in handlers on the
  new registry** — the same mechanism public `registerBinding()` uses. No behaviour change.
- `Model` keeps its exact public API: `M.create`, `set`/`get`, validation, persistence, `onChange`,
  `onFieldChange`, `tracked()`. Only its internals change.
- `M.computed`, `M.effect`, `M.untracked`, `M.flush` keep their signatures and re-export from the
  package.
- The five example apps (`todo`, `contacts`, `notes`, `calculator`, `markdown`) must render and
  behave identically.

---

## 9. Testing strategy

| Area | Approach |
|------|----------|
| Expression parser | Table-driven, including hostile input: `__proto__`, `constructor`, deep nesting, malformed syntax, unicode |
| Reconciler | **Property-based** — random sequences of array mutations; assert final DOM equals a naive full render, and assert node identity is preserved for unchanged keys |
| Effect disposal | Assert no leaked computations after list churn (track live `Computation` count) |
| Bindings | Assert **computed style / rendered state**, not API state — the lesson from the v0.30.0 modal regression, where `isOpen()` returned `true` throughout while the modal was invisible |
| Domma integration | Full existing suite (435 tests) stays green; the five examples verified in jsdom |
| Regression proof | Each bug-fix test must be verified to **fail** against the pre-fix build |

---

## 10. Risks

1. **Two-repo drift and release lag.** Known and accepted (§3). Mitigation: exact pin, and a
   documented release order — publish `domma-reactive`, then bump and release Domma.
2. **The reconciler is the hardest code in the project.** Keyed diffing with preserved effects is
   where subtle bugs live. Mitigation: property-based tests against a naive reference implementation.
3. **Effect leaks on list churn.** Mitigation: explicit disposal contract plus a live-computation
   count assertion.
4. **Scope.** This is larger than Tiers 1–3 combined. Mitigation: the extraction ships and stabilises
   as its own milestone before Tier 4 work begins.
5. **Expression subset frustration.** Some expressions users expect will not parse. Mitigation: clear
   warnings naming the template, and documentation steering view logic into computeds.

---

## 11. Acceptance criteria

1. `domma-reactive` publishes independently and works standalone with no Domma present.
2. Domma bundles it; `domma.min.js` remains a single self-contained file.
3. All 435 existing Domma tests pass unchanged.
4. The five example apps behave identically.
5. `{{#each items key=id}}` preserves DOM node identity, focus and uncommitted input for unchanged
   keys across collection changes.
6. Event bindings, two-way bindings and binding context work as specified.
7. No `eval` and no `Function`-constructor use anywhere in the package; bindings function under
   `script-src 'self'`.
8. Public `registerBinding()` can add a working custom binding.

---

## 12. Milestones

**M1 — Extraction.** New repo; move `graph.js` (from `reactive.js`) and the Tier 3 compiler; add
`observable()` / `observableArray()`; rewire `Model` as an adapter; Domma bundles the pin. Ships when
all 435 Domma tests pass and the examples are verified.

**M2 — Expression evaluator.** Tokeniser, parser, evaluator, helper registry. Ships independently of
any binding work, fully unit-tested.

**M3 — Binding registry + behaviour bindings.** Re-express Tier 3 kinds as handlers; add
`data-on-*`, `data-bind-*`, `data-model`, `data-if`; expose `registerBinding()`.

**M4 — Keyed reconciliation + binding context.** `key=`, per-item bindings, `$data` / `$index` /
`$parent` / `$root`, instance lifecycle and disposal.

Each milestone is independently shippable and independently valuable.
