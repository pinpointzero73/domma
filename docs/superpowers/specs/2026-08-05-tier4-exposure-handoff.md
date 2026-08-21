# Tier 4 exposure - handoff

**Date:** 2026-08-05
**Status:** **Done.** See §6 for what was built and how the open decisions were resolved. Sections 1-5 are kept as
written, as the record of the gap this closed.

The extraction (M1-M4) is finished and released as `domma-reactive` 0.4.0. What is missing is the
**Domma side**: the package is bundled but almost none of it is reachable. This note records the
state precisely so the work can start cold.

---

## 1. The gap, measured

`domma.min.js` inlines the whole of `domma-reactive` (~6,100 lines). Domma imports **ten names**
across two files, and re-exports almost none of them:

```javascript
// src/models.js
observable, observableArray, computed, effect, untracked, flushSync
// src/component-factory.js
TemplateCompiler, computed, effect, untracked
```

Checked against the built bundle, `Domma` and `Domma.models` expose:

| Reachable | Not reachable |
|---|---|
| `M.observable`, `M.observableArray` | `applyBindings` |
| `M.computed`, `M.effect`, `M.untracked`, `M.flush` | `registerBinding` / `unregisterBinding` |
| `M.bind` (the older two-way helper) | `compile`, `annotate`, `scanBlocks` |
| | `renderTemplate` |
| | `registerHelper` / `unregisterHelper`, `parseExpression`, `evaluateAst`, `evaluateExpression`, `compileExpression`, `expressionDependencies`, `clearExpressionCache` |
| | `createRootContext` / `createChildContext` |
| | `Dep`, `DepMap`, `Computation`, `trackingProxy`, `isEqual` |

**Consequence:** the only route to the binding layer is writing a template inside
`Domma.component()`. There is no way to bind server-rendered markup, and no way to register a custom
binding. Acceptance criterion 8 of the design doc - *"Public `registerBinding()` can add a working
custom binding"* - is satisfied for a `domma-reactive` consumer and **false** for a Domma user.

Independently confirmed by the conventions sweep: across all 86 showcase pages there were **zero**
live uses of `data-bind-*`, `data-model`, `data-each`, `data-if` or `applyBindings`, because outside
a component there was no way to use them.

---

## 2. What already works, and what had to be fixed to get there

Inside a `Domma.component()` template, verified by driving a real component in jsdom:

| Binding | State |
|---|---|
| `{{ }}` text, `{{#if}}`, `{{{raw}}}`, attribute interpolation | worked already |
| `{{#each xs key=id}}` - keyed, preserves node identity | worked already |
| `data-bind-*` | worked already |
| `data-if` | worked already |
| `data-on-*` | **fixed 2026-08-05** - see below |
| `data-model` write-back | **fixed 2026-08-05** - see below |

Both fixes were in `src/component-factory.js`, in `_mergeData()` - the **adapter** where Domma hands
its component data to the binding engine. Neither was a fault in `domma-reactive`.

- **`data-on-*` never resolved.** `_mergeData()` returned `{...data, ...props, ...computed}`;
  `methods` live on the component context, so every event binding logged *"did not resolve to a
  function"* and did nothing, while every other binding worked. Methods are now merged **first**, so
  a data field of the same name still wins.
- **`data-model` was one-way.** Write-back assigns to `context.$data[key]`, and that was a fresh
  plain snapshot, so the write hit a throwaway object. It looked fine because what you see while
  typing is your own keystrokes. `_mergeData()` now returns a Proxy whose `set` routes through
  `model.set()`.

**This is the lesson for the exposure work:** the binding engine expects *one object to resolve
expressions against, that can also be written to*. Any new entry point has to satisfy that same
contract, or it will fail the same two ways - reads fine, writes and functions silently dead.

---

## 3. Open decisions (need a call before implementing)

1. **Namespace.** `M.applyBindings` / `M.registerBinding` (models), or a new namespace? Note `B` is
   already taken by Blueprint. Models is the closest existing home, but "models" reads oddly for
   `registerBinding`.
2. **How much to expose.** Minimum useful is `applyBindings` + `registerBinding` /
   `unregisterBinding`. Beyond that: the expression API (`registerHelper` is the useful one, for
   `{{upper(name)}}` in templates), `compile`, `renderTemplate`, and the context builders.
   Exposing everything duplicates surface Domma already has in other shapes - `renderTemplate` vs
   `utils.render` in particular, which are **not** identical (see the divergence table in the
   package README).
3. **`applyBindings` and Domma models.** `applyBindings(data, root)` takes a plain object or
   observables. Handing it a Domma `Model` will not work as-is - it would need `model.tracked()`,
   which is the write-through proxy. Decide whether Domma's wrapper does that automatically.
4. **Whether `$(window)` should work.** Unrelated to Tier 4 but adjacent: `$(window)` is an empty
   collection, so `$(window).on(...)` silently attaches nothing. jQuery supports it. Currently
   documented as a deliberate gap in `scripts/validate-conventions.js`.

---

## 4. Verification available

Use these; they are already wired and they caught every bug this session.

```bash
npm test                          # 550 passed | 3 skipped
npm run validate                  # classes, theme contrast, conventions - all clean
npm run validate:showcase:strict  # all 86 showcase pages, no findings
npm run build:js                  # REQUIRED before the harness sees src/ changes
```

The harness only proves a page loads, renders and logs nothing. It does **not** prove a handler
still fires. For anything interactive, drive it: load the page in jsdom, dispatch a real event, and
assert on the DOM. Every fix in section 2 was found that way and would have passed a green suite
otherwise.

A worked example of the whole binding surface now exists at
`public/showcase/models/bindings.html` - six live components, including a keyed list that *measures*
node identity rather than claiming it.

---

## 5. Repository state at handoff

- **Domma:** 57 files staged, unreleased, on `main` at `2c3f803` (`Build v0.36.0`). Nothing unstaged
  or untracked. Two pre-existing user stashes, untouched.
- **domma-reactive:** untouched since `v0.4.0`; published; clean tree. No release needed for this
  work unless the exposure turns up an engine bug.
- Staged work not yet released: the conventions sweep (186 → 0 vanilla-JS call sites), the
  conventions validator, the two `_mergeData()` fixes, the bindings showcase page, and a
  `validate-classes` regex fix.

---

## 6. Outcome

### What was exposed

Five names on `M`, in `src/models.js`:

| Name | |
|---|---|
| `M.applyBindings(data, root, options)` | Activates every binding attribute under a root |
| `M.registerBinding(name, handler)` / `M.unregisterBinding(name)` | Add a binding kind |
| `M.registerHelper(name, fn)` / `M.unregisterHelper(name)` | Add a function callable from an expression |

Acceptance criterion 8 of the design doc - *"Public `registerBinding()` can add a working custom binding"* - is now
true for a Domma user, pinned by a test that registers one, drives it, and asserts on the DOM.

### How the open decisions were resolved

1. **Namespace: `M`.** Models is already Domma's reactive namespace - `M.observable`, `M.computed`, `M.effect`,
   `M.flush`, `M.bind` all live there. A new namespace would have split reactivity across two letters for no gain.
2. **Scope: the two entry points, not the engine.** `applyBindings` + the two registries. Deliberately withheld:
   `compile` and `renderTemplate` (Domma already has `_.render`, and the two **diverge** - publishing both would be a
   trap), the raw expression API, the context builders, and `Dep`/`DepMap`/`Computation`/`trackingProxy`.
3. **Domma models: yes, automatically.** `M.applyBindings` converts a `Model` to `model.tracked()` - the read-tracked,
   write-through proxy. That is exactly the "one object to resolve expressions against that can also be written to"
   contract §2 warned about, and it makes `data-model` land in the model with validation and notification intact.
4. **`$(window)`: untouched.** Genuinely unrelated; still recorded as a deliberate gap in `validate-conventions.js`.

### The one thing §2 predicted, and it happened

A Model holds data, not behaviour, so a bare tracked view resolves **no** `data-on-*` handler - the second of the two
silent failure modes, reproduced exactly. Hence `options.methods`, layered behind the data by a merge proxy
(`bindingSource()`), with data winning on a name collision, matching `Domma.component()`.

### Engine bug found by doing the work

`applyBindings` warned *"does not interpolate `{{ }}`"* for mustache **inside a `data-each` body** - which is the one
documented place mustache does work there. The pre-scan ran before the list body was recognised as a template. Fixed
in `domma-reactive/src/apply-bindings.js` (`insideListTemplate`), with three tests; two fail against the old code.

**Shipped.** Released as `domma-reactive` **0.4.1** and re-pinned; Domma now carries the fix. A regression test in
`src/apply-bindings.test.js` asserts that mustache inside a `data-each` renders **and** draws no warning, so a
downgrade of the pin fails a test rather than quietly reintroducing advice that tells authors to replace working
markup.

Also fixed: the `applyBindings` headline example in the domma-reactive README bound `data-model="query"` against a raw
`observable`, which shows `[object Object]` and drops the write. Corrected to `query.value`, with the reason.

### Documentation

- **`docs/Bindings.md`** - new, the reference: attributes, expressions, context keys, both entry points, the handler
  contract, troubleshooting.
- **`docs/Components.md`** - the Template Binding section predated the attribute bindings entirely and said
  `{{#each}}` was always a full re-render. Rewritten, with a worked example driven in jsdom to confirm every claim.
- `docs/API.md`, `docs/DommaDocumentation.md`, `docs/Reactivity.md`, root + `src/CLAUDE.md`,
  `public/assets/ide/phpstorm/models.d.ts`.
- `public/showcase/models/bindings.html` - a new live section binding real in-page markup, plus a custom binding and a
  helper. Its "this page uses the component route, because that is the one Domma itself exposes" claim was true when
  written and is now false; corrected.

### Verification

- 569 passed | 3 skipped (was 550) - 19 new tests in `src/apply-bindings.test.js`
- `validate:showcase:strict` green across all 86 pages
- All three validators clean
- domma-reactive: 679 passed
- **Mutation-checked.** Three mutations of `bindingSource()` - swallow the write, methods win over data, skip
  `tracked()` - each killed. The `data-model`-with-methods test was added *because* mutation showed the merge proxy's
  `set` trap was otherwise unexercised.
- The showcase demo was driven end to end in jsdom on the real page: typing, `add`, and `$parent.drop($data)` all
  work, console clean.
