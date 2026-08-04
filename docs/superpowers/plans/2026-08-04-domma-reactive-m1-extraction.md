# domma-reactive M1 (Extraction) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract Domma's reactive core into a separately published `domma-reactive` package that provides `observable()` / `observableArray()`, and rewire Domma's `Model` as an adapter over it — with zero change to Domma's public API.

**Architecture:** The package owns the dependency graph (`Dep`, `Computation`, flush scheduler), a state primitive (observables), and its own deep-equality helper so it has no dependency back on Domma. Domma takes it as an exact-pinned `devDependency`; Rollup inlines it via the already-configured `@rollup/plugin-node-resolve`, so `domma.min.js` stays a single self-contained file.

**Tech Stack:** ES modules, Vitest + jsdom, Rollup, npm.

**Spec:** `docs/superpowers/specs/2026-08-04-domma-reactive-extraction-tier4-design.md` (§3, §4, milestone M1)

---

## Corrections applied during execution

The code blocks below were written as design sketches, not as tested source. Execution found real
defects in three of them. **The corrections are recorded here and applied inline in the affected
tasks** — an implementer following this plan should use the corrected code, not the original.

| Task | Defect found | Resolution |
|------|--------------|------------|
| 2 | `seen = new WeakMap()` as a default parameter allocated on *every* call, including the primitive fast path — a measured 3–5× tax on the hottest path in the package | Public `isEqual(a, b)` wrapper delegating to an inner recursive function; map created lazily at the first structurally-compared pair |
| 2 | All 8 supplied tests passed with the plain-object prototype gate deleted, and with the cycle guard's `return true` flipped to `return false` | Added class-instance, `Map`/`Set`, null-prototype and value-asserting cyclic tests. 15 tests |
| 2 | Two invalid `Date`s compared unequal (`getTime()` is `NaN` on both, compared with `===`), contradicting the NaN rationale the tests state | `Object.is(a.getTime(), b.getTime())` |
| 3 | "There are exactly two [call sites]" — wrong | One real call in `Computation.recompute()`, plus one doc-comment mention. Verify by grep, not by count |
| 3 | The moved test `does not notify when a write sets an equal value` asserts a gate that lives in Domma's `Model.set`, not in the graph. Making it pass required adding a gate to the test's own stand-in, rendering it tautological | Dropped as a 4th Model-specific test. **11 moved tests, not 12.** The behaviour was ported into Domma's `models.test.js`, where it had no coverage at all |
| 3 | `trackingProxy` is a public export with zero tests; four `drainPending` guarantees, `dispose()` and `DepMap.clear()` could each be removed without failing a test | 16 tests added. `graph.test.js` totals 27 |
| 4 | **The supplied setter fails the supplied test.** The early return fires before `current = next`, so a write gated as "equal" never stored — yet `accepts a custom equality function` asserts `v.value` becomes 999 | Assign unconditionally, gate only the notification. Mirrors `models.js:122-125`, which Task 9 requires this primitive to stand in for |
| 4 | `set(next) { this.value = next; }` throws `TypeError` when destructured or passed as a callback | `peek()` and `set()` are closures; `this` leaves the API surface |
| 5 | **The supplied mutators cannot notify.** `inner.peek()` returns the live array, so an in-place mutation has already updated `current`; `arr.slice()` is then deep-equal to it and the gate swallows the change. The comment "new reference → always notifies" is false — the gate is `isEqual`, not reference identity | `observableArray` owns its own `Dep` and triggers it directly. O(1) per mutation; a no-op `sort()` notifying spuriously is the accepted cost. Chosen because the mutator knows it was a `push`, and that trigger point is where M4's keyed reconciler attaches patch information |

**Method that found these:** for every claimed behaviour, apply a mutation that breaks it, confirm a
test fails, restore. Three tasks running, three sets of supplied code with defects — hold the
remaining tasks to the same standard.

**Revised baselines.** Task 3 added two tests to Domma's `models.test.js` pinning the no-op-write
gate, which had no coverage and which Task 9 re-derives by hand. Domma's baseline is therefore
**437 passed | 3 skipped (440)**, not 435/3/438, and Task 10's expected post-deletion figure is
**422**, not 420.

---

## Prerequisites

- Domma repo at `/home/darryl/src/js/domma`, on `main`, clean, tests green (435 passing / 3 skipped).
- New repo will live at `/home/darryl/src/js/domma-reactive` (sibling, matching `domma-backend`, `domma-cms`).
- Node 20+, npm 10+.

**Verify before starting:**

```bash
cd /home/darryl/src/js/domma && git status --short && npx vitest run 2>&1 | tail -3
```
Expected: no output from `git status`; `Tests  435 passed | 3 skipped (438)`.

---

## File Structure

### New repo: `/home/darryl/src/js/domma-reactive`

| File | Responsibility |
|------|----------------|
| `src/equal.js` | Deep-equality helper. No other responsibility. |
| `src/graph.js` | `Dep`, `DepMap`, `Computation`, flush scheduler, `computed`, `effect`, `untracked`, `trackingProxy`. Must not know the DOM or bindings exist. |
| `src/observable.js` | `observable()`, `observableArray()`. Built on `graph.js`. |
| `src/index.js` | Public API surface. Re-exports only. |
| `src/*.test.js` | Co-located tests, mirroring Domma's convention. |
| `package.json`, `vitest.config.js`, `rollup.config.js`, `.gitignore`, `README.md` | Project scaffolding. |

### Modified in Domma

| File | Change |
|------|--------|
| `src/models.js` | `Model` internals move from `DepMap` + `_data` to per-field observables. Public API unchanged. |
| `src/component-factory.js` | Import from `domma-reactive` instead of `./reactive.js`. |
| `src/reactive.js` | **Deleted** — superseded by the package. |
| `src/reactive.test.js` | **Deleted** — moved to the package. |
| `package.json` | Adds exact-pinned `domma-reactive` devDependency. |

---

## Task 1: Scaffold the domma-reactive repo

**Files:**
- Create: `/home/darryl/src/js/domma-reactive/package.json`
- Create: `/home/darryl/src/js/domma-reactive/vitest.config.js`
- Create: `/home/darryl/src/js/domma-reactive/.gitignore`
- Create: `/home/darryl/src/js/domma-reactive/README.md`

- [ ] **Step 1: Create the directory and initialise git**

```bash
mkdir -p /home/darryl/src/js/domma-reactive/src
cd /home/darryl/src/js/domma-reactive
git init
```

- [ ] **Step 2: Write `package.json`**

```json
{
  "name": "domma-reactive",
  "version": "0.1.0",
  "description": "Dependency-tracked reactivity and DOM bindings. The reactive core of Domma, usable standalone.",
  "type": "module",
  "main": "dist/domma-reactive.min.js",
  "module": "dist/domma-reactive.esm.js",
  "exports": {
    ".": {
      "import": "./dist/domma-reactive.esm.js",
      "require": "./dist/domma-reactive.min.js"
    }
  },
  "files": ["dist/", "README.md", "LICENSE"],
  "scripts": {
    "build": "rollup -c",
    "test": "vitest",
    "test:run": "vitest run"
  },
  "keywords": ["reactive", "observable", "computed", "dependency-tracking", "domma"],
  "license": "MIT",
  "devDependencies": {
    "vitest": "^4.0.16",
    "jsdom": "^24.1.3",
    "rollup": "^4.0.0",
    "@rollup/plugin-terser": "^0.4.4"
  }
}
```

- [ ] **Step 3: Write `vitest.config.js`**

```javascript
import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom'
    }
});
```

Note: no `setupFiles`. This package has no DOM-fixture needs in M1, which keeps it free of the
two-window problem that afflicted Domma's harness.

- [ ] **Step 4: Write `.gitignore`**

```
node_modules/
dist/
*.log
.DS_Store
```

- [ ] **Step 5: Write `README.md`**

```markdown
# domma-reactive

Dependency-tracked reactivity: derivations discover which state they actually read, so a write
re-runs exactly the work that depends on it.

This is the reactive core of [Domma](https://github.com/pinpointzero73/domma), published separately
so it can be used on its own.

## Install

    npm install domma-reactive

## Use

```javascript
import {observable, computed, effect} from 'domma-reactive';

const price = observable(10);
const qty   = observable(3);

const total = computed(() => price.value * qty.value);

effect(() => console.log('total is', total.get()));

qty.value = 4;   // effect re-runs on the next microtask
```

Updates are batched: several writes in one tick produce a single re-run.

## Licence

MIT
```

- [ ] **Step 6: Install dependencies**

```bash
cd /home/darryl/src/js/domma-reactive && npm install
```
Expected: `node_modules/` created, no errors.

- [ ] **Step 7: Commit**

```bash
cd /home/darryl/src/js/domma-reactive
git add -A
git commit -m "chore: scaffold domma-reactive package"
```

---

## Task 2: Deep-equality helper

The package must not depend on Domma's `utils.isEqual`. This is the only Domma import `reactive.js`
currently has, and removing it makes the package free-standing.

**Files:**
- Create: `/home/darryl/src/js/domma-reactive/src/equal.js`
- Test: `/home/darryl/src/js/domma-reactive/src/equal.test.js`

- [ ] **Step 1: Write the failing test**

```javascript
// src/equal.test.js
import {describe, expect, it} from 'vitest';
import {isEqual} from './equal.js';

describe('isEqual', () => {
    it('compares primitives', () => {
        expect(isEqual(1, 1)).toBe(true);
        expect(isEqual(1, 2)).toBe(false);
        expect(isEqual('a', 'a')).toBe(true);
        expect(isEqual(true, false)).toBe(false);
        expect(isEqual(null, null)).toBe(true);
        expect(isEqual(undefined, undefined)).toBe(true);
        expect(isEqual(null, undefined)).toBe(false);
    });

    it('treats NaN as equal to itself', () => {
        // Change detection must not fire forever on a NaN field
        expect(isEqual(NaN, NaN)).toBe(true);
    });

    it('distinguishes +0 and -0 as equal values', () => {
        expect(isEqual(0, -0)).toBe(true);
    });

    it('compares arrays deeply', () => {
        expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
        expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
        expect(isEqual([{a: 1}], [{a: 1}])).toBe(true);
        expect(isEqual([{a: 1}], [{a: 2}])).toBe(false);
    });

    it('compares plain objects deeply, ignoring key order', () => {
        expect(isEqual({a: 1, b: 2}, {b: 2, a: 1})).toBe(true);
        expect(isEqual({a: 1}, {a: 1, b: 2})).toBe(false);
        expect(isEqual({a: {b: {c: 1}}}, {a: {b: {c: 1}}})).toBe(true);
    });

    it('compares dates by value', () => {
        expect(isEqual(new Date('2026-01-01'), new Date('2026-01-01'))).toBe(true);
        expect(isEqual(new Date('2026-01-01'), new Date('2026-01-02'))).toBe(false);
    });

    it('falls back to reference equality for other object types', () => {
        const fn = () => {};
        expect(isEqual(fn, fn)).toBe(true);
        expect(isEqual(() => {}, () => {})).toBe(false);
    });

    it('does not recurse infinitely on cyclic structures', () => {
        const a = {name: 'a'}; a.self = a;
        const b = {name: 'a'}; b.self = b;
        expect(() => isEqual(a, b)).not.toThrow();
    });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /home/darryl/src/js/domma-reactive && npx vitest run src/equal.test.js`
Expected: FAIL — `Failed to resolve import "./equal.js"`.

- [ ] **Step 3: Write the implementation**

```javascript
// src/equal.js
/**
 * Deep structural equality.
 *
 * Used as the change-detection gate for observables and the propagation
 * short-circuit for computeds, so it must be cheap and total — never throw,
 * never recurse forever.
 *
 * Handles primitives (with Object.is semantics, so NaN equals itself), Date,
 * Array and plain objects. Everything else falls back to reference equality,
 * which is the correct conservative answer for functions, class instances,
 * DOM nodes and the like.
 *
 * @param {*} a
 * @param {*} b
 * @param {WeakMap} [seen] Internal — guards against cyclic structures
 * @returns {boolean}
 */
export function isEqual(a, b, seen = new WeakMap()) {
    if (Object.is(a, b)) return true;
    // Object.is treats +0/-0 as different; for change detection they are not
    if (a === 0 && b === 0) return true;

    if (a === null || b === null) return false;
    if (typeof a !== 'object' || typeof b !== 'object') return false;

    if (a instanceof Date || b instanceof Date) {
        return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
    }

    const aIsArray = Array.isArray(a);
    if (aIsArray !== Array.isArray(b)) return false;

    // Cycle guard: if we are already comparing this pair, assume equal and let
    // the rest of the structure decide.
    const pending = seen.get(a);
    if (pending && pending.has(b)) return true;
    if (pending) pending.add(b);
    else seen.set(a, new Set([b]));

    if (aIsArray) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!isEqual(a[i], b[i], seen)) return false;
        }
        return true;
    }

    // Only plain objects are compared structurally
    const aProto = Object.getPrototypeOf(a);
    const bProto = Object.getPrototypeOf(b);
    const plain = (p) => p === Object.prototype || p === null;
    if (!plain(aProto) || !plain(bProto)) return false;

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
        if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
        if (!isEqual(a[key], b[key], seen)) return false;
    }
    return true;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /home/darryl/src/js/domma-reactive && npx vitest run src/equal.test.js`
Expected: `Tests  8 passed (8)`.

- [ ] **Step 5: Commit**

```bash
cd /home/darryl/src/js/domma-reactive
git add src/equal.js src/equal.test.js
git commit -m "feat: add deep-equality helper

Removes the package's only dependency back on Domma (utils.isEqual)."
```

---

## Task 3: Move the reactive graph

`src/reactive.js` in Domma moves here verbatim except for the equality import. Its existing test
file comes with it, which proves the move is behaviour-preserving.

**Files:**
- Create: `/home/darryl/src/js/domma-reactive/src/graph.js`
- Test: `/home/darryl/src/js/domma-reactive/src/graph.test.js`

- [ ] **Step 1: Copy the source and swap the equality import**

```bash
cd /home/darryl/src/js/domma-reactive
cp /home/darryl/src/js/domma/src/reactive.js src/graph.js
```

Then edit `src/graph.js`: replace the import line

```javascript
import { utils } from './utils.js';
```

with

```javascript
import { isEqual } from './equal.js';
```

and replace the `utils.isEqual(` references with `isEqual(`. **Corrected:** there is exactly ONE
real call — in `Computation.recompute()` — plus one doc-comment mention in that method's JSDoc. The
`drainPending` doc comment already says plain `isEqual` and needs no change. Verify by grep, not by
count.

Verify none remain:

```bash
grep -n "utils\." src/graph.js || echo "clean"
```
Expected: `clean`.

- [ ] **Step 2: Copy the tests, retargeting them at the package API**

```bash
cp /home/darryl/src/js/domma/src/reactive.test.js src/graph.test.js
```

The Domma tests drive the graph through `M.computed` / `M.effect` on a `Model`. This package has no
`Model`, so rewrite the header and use the graph directly. Replace the import block and the `M`
helper usage at the top of `src/graph.test.js` with:

```javascript
// src/graph.test.js
import {describe, expect, it, vi} from 'vitest';
import {computed, effect, untracked, flushSync, DepMap, trackingProxy} from './graph.js';

/** Let the batched microtask flush run. */
const tick = () => new Promise(resolve => setTimeout(resolve, 0));

/** Minimal field-bag stand-in for a Model, so the graph can be tested alone. */
function bag(initial = {}) {
    const deps = new DepMap();
    const data = {...initial};
    return {
        get: (k) => { deps.for(k).track(); return data[k]; },
        set: (k, v) => { data[k] = v; deps.trigger(k); },
        proxy: () => trackingProxy(data, (k) => deps.for(k))
    };
}
```

Then mechanically convert each test: `M.create({...}, {a: 1})` becomes `bag({a: 1})`,
`model.get('a')` stays `model.get('a')`, `model.set('a', 2)` stays `model.set('a', 2)`,
`M.computed` becomes `computed`, `M.effect` becomes `effect`, `M.untracked` becomes `untracked`,
`M.flush` becomes `flushSync`. Drop the three tests that assert Model-specific behaviour —
`tracked() proxy ... routes writes through validation`, `leaves onChange semantics synchronous`,
and `destroying a model detaches its dependents` — those belong to Domma and stay in its suite.

**Corrected — drop a fourth.** `does not notify when a write sets an equal value` also belongs to
Domma: the gate it asserts lives in `Model.set` (`models.js:125`), not in the graph. `Dep.trigger()`
has no equality gate, so making this test pass requires adding one to the `bag()` stand-in, at which
point the test asserts the stand-in rather than `graph.js`. Drop it, and keep `bag()` exactly as
written above with no gate. **11 moved tests, not 12.**

That behaviour had no coverage anywhere in Domma either — `models.test.js` proved `onChange` *fires*
on a change but never that it stays *silent* on a no-op write, and Task 9 re-derives that gate by
hand. Port it into `models.test.js` now rather than at Task 10. Cover a primitive **and** a
structurally-equal object: degrading the gate to `!==` passes the primitive case and is caught only
by the structural one.

- [ ] **Step 2b: Cover `trackingProxy`, and the guarantees the doc block makes**

`trackingProxy` enters the public API at Task 6 with zero tests. Four `drainPending` guarantees
(effects fire last; unobserved computeds stay lazy; the `onNotify` exemption; cycles terminate with
a warning), plus `Computation.dispose()` and `DepMap.clear()`, can each be removed without failing a
test. Pin them before publication.

Two that need care: reads are tracked one level deep, and the honest assertion is
`expect(state.user).toBe(rawNestedObject)` — a behavioural test catches a *flat*-keyspace recursive
proxy but not a *namespaced* one. And `MAX_VISITS` needs two tests, since "a cycle terminates and
warns" still passes when the budget is crippled to 1 — pin the headroom side too (a legitimate
diamond revisit completes *without* warning), without hard-coding the number.

- [ ] **Step 3: Run the tests**

Run: `cd /home/darryl/src/js/domma-reactive && npx vitest run src/graph.test.js`
Expected: 11 moved tests plus the coverage added in Step 2b (27 as executed). The requirement is
**zero failures**, not a specific count.

- [ ] **Step 4: Commit**

```bash
cd /home/darryl/src/js/domma-reactive
git add src/graph.js src/graph.test.js
git commit -m "feat: move the reactive graph from Domma

Dep, DepMap, Computation, the batched flush scheduler, computed, effect,
untracked and trackingProxy, unchanged except for using the local
equality helper. Tests come with it to prove the move is
behaviour-preserving."
```

---

## Task 4: `observable()`

The state primitive. Domma bootstraps tracking from `Model`; a standalone user needs something that
holds one value.

**Files:**
- Create: `/home/darryl/src/js/domma-reactive/src/observable.js`
- Test: `/home/darryl/src/js/domma-reactive/src/observable.test.js`

- [ ] **Step 1: Write the failing test**

```javascript
// src/observable.test.js
import {describe, expect, it, vi} from 'vitest';
import {observable} from './observable.js';
import {computed, effect} from './graph.js';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

describe('observable', () => {
    it('holds and returns a value', () => {
        const count = observable(5);
        expect(count.value).toBe(5);
    });

    it('updates on write', () => {
        const count = observable(0);
        count.value = 7;
        expect(count.value).toBe(7);
    });

    it('is tracked by a computed', () => {
        const count = observable(2);
        const body = vi.fn(() => count.value * 2);
        const doubled = computed(body);

        expect(doubled.get()).toBe(4);
        expect(body).toHaveBeenCalledTimes(1);

        doubled.get();
        expect(body).toHaveBeenCalledTimes(1);   // cached

        count.value = 5;
        expect(doubled.get()).toBe(10);
        expect(body).toHaveBeenCalledTimes(2);
    });

    it('re-runs an effect on change', async () => {
        const name = observable('alice');
        const seen = [];

        effect(() => seen.push(name.value));
        expect(seen).toEqual(['alice']);

        name.value = 'bob';
        await tick();
        expect(seen).toEqual(['alice', 'bob']);
    });

    it('does not notify when the new value is deeply equal', async () => {
        const config = observable({theme: 'dark'});
        const body = vi.fn(() => config.value);

        effect(body);
        expect(body).toHaveBeenCalledTimes(1);

        config.value = {theme: 'dark'};      // structurally identical
        await tick();
        expect(body).toHaveBeenCalledTimes(1);

        config.value = {theme: 'light'};
        await tick();
        expect(body).toHaveBeenCalledTimes(2);
    });

    it('accepts a custom equality function', async () => {
        // Domma passes utils.isEqual here to preserve its exact semantics
        const alwaysEqual = () => true;
        const v = observable(1, {equals: alwaysEqual});
        const body = vi.fn(() => v.value);

        effect(body);
        v.value = 999;
        await tick();
        expect(body).toHaveBeenCalledTimes(1);   // never considered changed
        expect(v.value).toBe(999);               // but the value did update
    });

    it('peek() reads without registering a dependency', async () => {
        const v = observable(1);
        const body = vi.fn(() => v.peek());

        effect(body);
        v.value = 2;
        await tick();
        expect(body).toHaveBeenCalledTimes(1);
    });

    it('set() is an alias for assigning value', () => {
        const v = observable(1);
        v.set(3);
        expect(v.value).toBe(3);
    });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /home/darryl/src/js/domma-reactive && npx vitest run src/observable.test.js`
Expected: FAIL — `Failed to resolve import "./observable.js"`.

- [ ] **Step 3: Write the implementation**

```javascript
// src/observable.js
/**
 * Observables — the state primitive.
 *
 * The dependency graph in graph.js tracks *reads*, but something has to own
 * the value being read. In Domma that role is played by Model; standalone,
 * this is it.
 *
 * Property-style by design (`count.value`), matching the idiom Domma
 * established with model.tracked(). See the design spec §5.
 */

import {Dep} from './graph.js';
import {isEqual} from './equal.js';

/**
 * Create an observable value.
 *
 * @param {*} initial
 * @param {Object}   [options]
 * @param {Function} [options.equals] Change gate. Defaults to deep equality.
 *                                    Domma passes utils.isEqual to preserve
 *                                    its existing notification semantics.
 * @returns {{value: *, peek: Function, set: Function}}
 */
export function observable(initial, options = {}) {
    const equals = options.equals || isEqual;
    const dep = new Dep();
    let current = initial;

    // The comparator gates the NOTIFICATION, not the write. It answers "is this
    // worth waking the graph for?", not "is this worth remembering?" — a partial
    // comparator (compare by id, compare by version) must not silently discard
    // data, or a read after write returns something the caller never wrote.
    // This mirrors Model._setField (models.js:122-125), which assigns
    // unconditionally and gates only notification. Task 9 needs this primitive
    // to be a drop-in for that field slot.
    const write = (next) => {
        const changed = !equals(current, next);
        current = next;
        if (changed) dep.trigger();
    };

    // peek() and set() are closures, not methods: `set(next) { this.value = next }`
    // throws a bare TypeError when destructured or passed as a callback, which is
    // ordinary usage of a signal-style API.
    return {
        get value() {
            dep.track();
            return current;
        },

        set value(next) {
            write(next);
        },

        /** Read without registering a dependency. */
        peek: () => current,

        /** Imperative alias for assigning `.value`. */
        set: (next) => write(next)
    };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /home/darryl/src/js/domma-reactive && npx vitest run src/observable.test.js`
Expected: `Tests  8 passed (8)`.

- [ ] **Step 5: Commit**

```bash
cd /home/darryl/src/js/domma-reactive
git add src/observable.js src/observable.test.js
git commit -m "feat: add observable() state primitive

Property-style (count.value), matching the idiom Domma established with
model.tracked(). Accepts a custom equality function so Domma can pass
utils.isEqual and keep its notification semantics byte-identical."
```

---

## Task 5: `observableArray()`

Arrays need notifying mutators so a `push` can later become one DOM insert rather than a full diff
(spec §6). M1 delivers the primitive; the reconciler that exploits it lands in M4.

**Files:**
- Modify: `/home/darryl/src/js/domma-reactive/src/observable.js`
- Test: `/home/darryl/src/js/domma-reactive/src/observable-array.test.js`

- [ ] **Step 1: Write the failing test**

```javascript
// src/observable-array.test.js
import {describe, expect, it, vi} from 'vitest';
import {observableArray} from './observable.js';
import {effect} from './graph.js';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

describe('observableArray', () => {
    it('exposes the underlying array via value', () => {
        const items = observableArray([1, 2]);
        expect(items.value).toEqual([1, 2]);
        expect(items.length).toBe(2);
    });

    it('defaults to an empty array', () => {
        expect(observableArray().value).toEqual([]);
    });

    it('notifies on push', async () => {
        const items = observableArray([]);
        const body = vi.fn(() => items.value.length);

        effect(body);
        expect(body).toHaveBeenCalledTimes(1);

        items.push('a');
        await tick();
        expect(body).toHaveBeenCalledTimes(2);
        expect(items.value).toEqual(['a']);
    });

    it('notifies on pop, shift, unshift, splice, reverse and sort', async () => {
        const items = observableArray([3, 1, 2]);
        let runs = 0;
        effect(() => { items.value; runs++; });
        expect(runs).toBe(1);

        items.push(4);      await tick();
        items.pop();        await tick();
        items.unshift(0);   await tick();
        items.shift();      await tick();
        items.splice(0, 1); await tick();
        items.reverse();    await tick();
        items.sort();       await tick();

        expect(runs).toBe(8);   // initial + 7 mutations
    });

    it('remove() deletes by value and notifies', async () => {
        const items = observableArray(['a', 'b', 'c']);
        let runs = 0;
        effect(() => { items.value; runs++; });

        items.remove('b');
        await tick();
        expect(items.value).toEqual(['a', 'c']);
        expect(runs).toBe(2);
    });

    // CORRECTED: as originally written this asserted only that removeAll empties.
    // No effect, no run count — half the name was untested.
    it('removeAll() empties and notifies', async () => {
        const items = observableArray([1, 2, 3]);
        let runs = 0;
        effect(() => { items.value; runs++; });

        items.removeAll();
        await tick();
        expect(items.value).toEqual([]);
        expect(runs).toBe(2);
    });

    // ADDED: the only test that pins the decided design. The seven-mutation test
    // above cannot — every one of those mutations genuinely changes the contents,
    // so a copy-and-compare implementation passes it identically. Only a no-op
    // mutation distinguishes "notifies unconditionally" from "notifies on change".
    it('notifies even when a mutation changes nothing', async () => {
        const items = observableArray([1, 2, 3]);
        let runs = 0;
        effect(() => { items.value; runs++; });

        items.splice(0, 0);          // removes nothing, inserts nothing
        await tick();
        expect(runs).toBe(2);        // notified anyway — the accepted cost
    });

    it('replacing value wholesale notifies', async () => {
        const items = observableArray([1]);
        const body = vi.fn(() => items.value);

        effect(body);
        items.value = [1, 2];
        await tick();
        expect(body).toHaveBeenCalledTimes(2);
    });

    it('does not notify when replaced with a deeply equal array', async () => {
        const items = observableArray([{id: 1}]);
        const body = vi.fn(() => items.value);

        effect(body);
        items.value = [{id: 1}];
        await tick();
        expect(body).toHaveBeenCalledTimes(1);
    });

    it('mutators return what the native array methods return', () => {
        const items = observableArray([1, 2, 3]);
        expect(items.push(4)).toBe(4);          // new length
        expect(items.pop()).toBe(4);            // popped value
        expect(items.splice(0, 1)).toEqual([1]); // removed slice
    });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /home/darryl/src/js/domma-reactive && npx vitest run src/observable-array.test.js`
Expected: FAIL — `observableArray is not a function`.

- [ ] **Step 3: Append the implementation to `src/observable.js`**

```javascript
/** Array methods that mutate in place and must therefore notify. */
const MUTATORS = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'fill', 'copyWithin'];

/**
 * Create an observable array.
 *
 * `.value` is the underlying array and is tracked on read. The in-place
 * mutators notify after running, so `push` is a single notification rather
 * than a wholesale replacement — which the keyed reconciler in M4 turns into
 * a single DOM insert.
 *
 * @param {Array}  [initial=[]]
 * @param {Object} [options] Same options as observable()
 * @returns {Object}
 */
export function observableArray(initial = [], options = {}) {
    const equals = options.equals || isEqual;
    const dep = new Dep();
    let current = Array.isArray(initial) ? initial : [];

    const api = {
        get value() { dep.track(); return current; },

        // Wholesale replacement is gated, exactly like a scalar observable:
        // assign always, notify only on a real difference.
        set value(next) {
            const arr = Array.isArray(next) ? next : [];
            const changed = !equals(current, arr);
            current = arr;
            if (changed) dep.trigger();
        },

        peek: () => current,
        set: (next) => { api.value = next; },

        // Tracked: a computation reading .length depends on the array just as
        // surely as one reading .value. An untracked length would be a trap.
        get length() { dep.track(); return current.length; },

        /** Remove every occurrence of a value. */
        remove(item) {
            current = current.filter(x => x !== item);
            dep.trigger();
            return api;
        },

        /** Empty the array. */
        removeAll() {
            current = [];
            dep.trigger();
            return api;
        }
    };

    // In-place mutators notify UNCONDITIONALLY, bypassing the equality gate.
    //
    // They must: a mutation happens in place, so `current` is already the new
    // value by the time we could compare, and any copy of it is deep-equal.
    // The gate would swallow every push. (The original plan assigned
    // `arr.slice()` and claimed "new reference → always notifies" — false, since
    // the gate is isEqual, not reference identity.)
    //
    // The cost is a spurious notification from a no-op sort() or splice(0, 0).
    // The gain is that this trigger point knows *which* mutation ran, which is
    // where M4's keyed reconciler attaches patch information to turn a push into
    // one DOM insert rather than a full diff (spec §6).
    for (const name of MUTATORS) {
        api[name] = (...args) => {
            const result = Array.prototype[name].apply(current, args);
            dep.trigger();
            return result;
        };
    }

    return api;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /home/darryl/src/js/domma-reactive && npx vitest run src/observable-array.test.js`
Expected: `Tests  9 passed (9)`.

- [ ] **Step 5: Commit**

```bash
cd /home/darryl/src/js/domma-reactive
git add src/observable.js src/observable-array.test.js
git commit -m "feat: add observableArray() with notifying mutators"
```

---

## Task 6: Public API and build

**Files:**
- Create: `/home/darryl/src/js/domma-reactive/src/index.js`
- Create: `/home/darryl/src/js/domma-reactive/rollup.config.js`
- Test: `/home/darryl/src/js/domma-reactive/src/index.test.js`

- [ ] **Step 1: Write the API-surface test**

```javascript
// src/index.test.js
import {describe, expect, it} from 'vitest';
import * as api from './index.js';

describe('public API', () => {
    it('exports exactly the intended surface', () => {
        expect(Object.keys(api).sort()).toEqual([
            'Computation', 'Dep', 'DepMap',
            'computed', 'effect', 'flushSync', 'isEqual',
            'observable', 'observableArray', 'trackingProxy', 'untracked'
        ]);
    });

    it('every export is callable or constructible', () => {
        for (const [name, value] of Object.entries(api)) {
            expect(typeof value, `${name} should be a function`).toBe('function');
        }
    });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd /home/darryl/src/js/domma-reactive && npx vitest run src/index.test.js`
Expected: FAIL — cannot resolve `./index.js`.

- [ ] **Step 3: Write `src/index.js`**

```javascript
/**
 * domma-reactive — public API.
 *
 * Deliberately small. Anything not listed here is an internal detail and may
 * change without a major version bump.
 */

export {isEqual} from './equal.js';
export {observable, observableArray} from './observable.js';
export {
    Dep,
    DepMap,
    Computation,
    computed,
    effect,
    untracked,
    trackingProxy,
    flushSync
} from './graph.js';
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd /home/darryl/src/js/domma-reactive && npx vitest run src/index.test.js`
Expected: `Tests  2 passed (2)`. If the first test fails, reconcile the list in the test with the
actual exports — the test is the specification of the surface.

- [ ] **Step 5: Write `rollup.config.js`**

```javascript
import terser from '@rollup/plugin-terser';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/domma-reactive.min.js',
            format: 'umd',
            name: 'DommaReactive',
            plugins: [terser()]
        },
        {
            file: 'dist/domma-reactive.esm.js',
            format: 'es'
        }
    ]
};
```

- [ ] **Step 6: Build and verify output exists**

```bash
cd /home/darryl/src/js/domma-reactive && npm run build && ls -l dist/
```
Expected: `dist/domma-reactive.min.js` and `dist/domma-reactive.esm.js` both present.

- [ ] **Step 7: Run the whole suite**

Run: `cd /home/darryl/src/js/domma-reactive && npx vitest run`
Expected as executed: **74** — 15 equal + 27 graph + 15 observable + 15 array + 2 index. (The
original estimate of 31 predated the coverage the mutation testing showed was missing.) Accept
whatever the true total is; the requirement is **0 failures**.

- [ ] **Step 8: Commit**

```bash
cd /home/darryl/src/js/domma-reactive
git add -A
git commit -m "feat: public API surface and build config"
```

---

## Task 7: Publish `domma-reactive@0.1.0`

- [ ] **Step 1: Confirm the name is free**

```bash
npm view domma-reactive version 2>&1 | head -2
```
Expected: `npm error code E404` — the name is available. **If it resolves to an existing package,
stop.** Rename to `@dommajs/reactive` in `package.json` (spec §3 records this fallback), and update
every import in Task 8 onwards accordingly.

- [ ] **Step 2: Dry-run the publish**

```bash
cd /home/darryl/src/js/domma-reactive && npm publish --access public --dry-run 2>&1 | tail -12
```
Expected: tarball contains only `dist/`, `README.md`, `package.json`. **No `src/`, no tests.**

- [ ] **Step 3: Publish**

```bash
cd /home/darryl/src/js/domma-reactive && npm publish --access public
```
Expected: `+ domma-reactive@0.1.0`.

- [ ] **Step 4: Tag and verify**

```bash
cd /home/darryl/src/js/domma-reactive
git tag -a v0.1.0 -m "Release v0.1.0"
sleep 10 && npm view domma-reactive version
```
Expected: `0.1.0`.

Note: pushing to GitHub requires the remote to exist. Create
`pinpointzero73/domma-reactive` first, then `git remote add origin` and push `main` plus the tag.
Confirm with the repository owner before pushing — this is the first public appearance of the
package.

---

## Task 8: Domma takes the dependency

**Files:**
- Modify: `/home/darryl/src/js/domma/package.json`

- [ ] **Step 1: Install at an exact pin**

```bash
npm install --save-dev --save-exact domma-reactive@0.1.0
```

- [ ] **Step 2: Verify the pin has no caret**

```bash
node -p "require('./package.json').devDependencies['domma-reactive']"
```
Expected: `0.1.0` — **not** `^0.1.0`. Spec §3 requires an exact pin.

- [ ] **Step 3: Prove Rollup inlines it rather than leaving it external**

Create a throwaway probe:

```bash
cd /home/darryl/src/js/domma
cat > src/zzprobe-bundle.js <<'EOF'
import {observable} from 'domma-reactive';
export const probe = () => observable(1).value;
EOF
```

Temporarily add to `rollup.config.js` a build with `input: 'src/zzprobe-bundle.js'` and
`file: 'public/dist/zzprobe.js'`, run `npx rollup -c`, then:

```bash
grep -c "require('domma-reactive')\|from 'domma-reactive'" public/dist/zzprobe.js || echo "INLINED"
```
Expected: `INLINED` — the import must not survive into the bundle. Then remove the probe file, the
temporary Rollup entry and `public/dist/zzprobe.js`.

- [ ] **Step 4: Commit**

```bash
cd /home/darryl/src/js/domma
git add package.json package-lock.json
git commit -m "build: take domma-reactive as an exact-pinned devDependency

Rollup inlines it via the already-configured node-resolve plugin, so
domma.min.js stays a single self-contained file and consumers install
nothing extra."
```

---

## Task 9: Rewire `Model` onto observables

The riskiest task. **Domma's existing 435 tests are the specification** — the public API must not
move. `models.test.js` and `model-binding.test.js` in particular must pass untouched.

**Files:**
- Modify: `/home/darryl/src/js/domma/src/models.js`

- [ ] **Step 1: Capture the current baseline**

```bash
cd /home/darryl/src/js/domma && npx vitest run 2>&1 | tail -3
```
Expected: **`Tests  437 passed | 3 skipped (440)`** — Task 3 added two tests pinning the no-op-write
gate this task re-derives by hand. Record this number; it must not drop.

- [ ] **Step 2: Replace the imports**

In `src/models.js`, replace the `./reactive.js` import block with:

```javascript
import {
    observable,
    computed as createComputed,
    effect as createEffect,
    untracked as runUntracked,
    flushSync as flushReactive
} from 'domma-reactive';
```

`DepMap` and `trackingProxy` are no longer needed here — `Model` owns observables directly now.

- [ ] **Step 3: Replace the constructor's field storage**

Replace these constructor lines:

```javascript
        this._data = {};
        ...
        this._deps = new DepMap();
        this._trackedView = null;
```

with:

```javascript
        /** field name → observable holding that field's value */
        this._fields = new Map();
        this._trackedView = null;
```

and replace the initialisation loop body so each field gets an observable. `utils.isEqual` is passed
as the equality gate so change-detection semantics stay byte-identical to v0.30.1:

```javascript
        for (const field in schema) {
            const fieldDef = schema[field];
            const defaultVal = fieldDef.default !== undefined ? fieldDef.default : null;
            const initial = data[field] !== undefined ? data[field] : defaultVal;
            this._fields.set(field, observable(initial, {equals: utils.isEqual}));
            this._initialData[field] = initial;
        }
```

- [ ] **Step 4: Add the two private helpers the rest of the class needs**

Add these methods to `Model`:

```javascript
    /**
     * Get (creating if absent) the observable backing a field.
     * Fields not declared in the schema are created on first write, matching
     * the previous behaviour where _data accepted any key.
     * @private
     */
    _field(name) {
        let obs = this._fields.get(name);
        if (!obs) {
            obs = observable(null, {equals: utils.isEqual});
            this._fields.set(name, obs);
        }
        return obs;
    }

    /**
     * Plain-object view of every field, read WITHOUT tracking.
     * Used by toJSON(), persistence and validation — render-time and
     * serialisation reads must not register dependencies.
     * @private
     */
    _snapshot() {
        const out = {};
        for (const [key, obs] of this._fields) out[key] = obs.peek();
        return out;
    }
```

- [ ] **Step 5: Rewrite `get()`**

```javascript
    get(field) {
        if (field) {
            const obs = this._fields.get(field);
            return obs ? obs.value : undefined;
        }

        // No argument: tracks every field, as before
        const out = {};
        for (const [key, obs] of this._fields) out[key] = obs.value;
        return out;
    }
```

- [ ] **Step 6: Rewrite `_setField()`**

Note the ordering: validate first, then write, then notify — and the `isEqual` check is computed
from the pre-write value so callbacks still fire exactly when they did before.

```javascript
    _setField(field, value) {
        const obs = this._field(field);
        const oldValue = obs.peek();

        if (this._schema[field]) {
            const validation = this._validateField(field, value);
            if (!validation.valid) {
                throw new Error(`Validation failed for ${field}: ${validation.error}`);
            }
        }

        const changed = !utils.isEqual(oldValue, value);
        obs.value = value;

        if (changed) {
            this._notifyChange(field, value, oldValue);
            this._updateBindings(field, value);

            if (this._persistKey && this._autoSave) {
                this._saveToStorage();
            }
        }
    }
```

- [ ] **Step 7: Rewrite `tracked()`**

```javascript
    tracked() {
        if (!this._trackedView) {
            const self = this;
            this._trackedView = new Proxy({}, {
                get(_, key) {
                    if (typeof key !== 'string') return undefined;
                    const obs = self._fields.get(key);
                    return obs ? obs.value : undefined;
                },
                set(_, key, value) {
                    if (typeof key === 'string') self._setField(key, value);
                    return true;
                },
                has(_, key) {
                    return typeof key === 'string' && self._fields.has(key);
                },
                ownKeys() {
                    return [...self._fields.keys()];
                },
                getOwnPropertyDescriptor() {
                    return {enumerable: true, configurable: true};
                }
            });
        }
        return this._trackedView;
    }
```

`getOwnPropertyDescriptor` is required — without it, spreading the proxy (`{...state}`) throws.

- [ ] **Step 8: Point the remaining `_data` readers at `_snapshot()`**

Four methods still reference `this._data`. Replace each:

- `toJSON()` → `return runUntracked(() => this._snapshot());`
- `_saveToStorage()` → `return storage.set(\`model:${this._persistKey}\`, this._snapshot());`
- `_validateField` callers in `validate()` → `const data = this._snapshot();` then use `data[field]`
- `_loadFromStorage()` → replace `this._data[field] = stored[field];` with
  `this._field(field).value = stored[field];`

Verify none remain:

```bash
cd /home/darryl/src/js/domma && grep -n "_data" src/models.js || echo "clean"
```
Expected: `clean`.

- [ ] **Step 9: Update `destroy()`**

```javascript
        this._changeCallbacks.clear();
        this._fieldCallbacks.clear();
        this._bindings.clear();
        this._fields.clear();
        this._trackedView = null;
```

- [ ] **Step 10: Run the model tests**

Run: `cd /home/darryl/src/js/domma && npx vitest run src/models.test.js src/model-binding.test.js src/reactive.test.js`
Expected: all pass. If `reactive.test.js` fails on `destroying a model detaches its dependents`,
that is a genuine behaviour question — clearing `_fields` drops the observables, so their `Dep`s go
with them. That is the intended semantics and the test should still pass; if it does not, stop and
investigate rather than editing the test.

- [ ] **Step 11: Run the full suite**

Run: `cd /home/darryl/src/js/domma && npx vitest run 2>&1 | tail -3`
Expected: `Tests  437 passed | 3 skipped (440)` — identical to Step 1.

- [ ] **Step 12: Commit**

```bash
cd /home/darryl/src/js/domma
git add src/models.js
git commit -m "refactor(models): back Model with observables

Model's per-field DepMap is replaced by one observable per field, with
utils.isEqual passed as the equality gate so change-detection semantics
are byte-identical. Public API is unchanged: get/set, validation,
persistence, onChange, onFieldChange and tracked() all behave exactly as
before."
```

---

## Task 10: Delete `src/reactive.js` and re-point imports

**Files:**
- Delete: `/home/darryl/src/js/domma/src/reactive.js`
- Delete: `/home/darryl/src/js/domma/src/reactive.test.js`
- Modify: `/home/darryl/src/js/domma/src/component-factory.js`

- [ ] **Step 1: Re-point `component-factory.js`**

Replace:

```javascript
import { computed as createComputed, effect as createEffect, untracked } from './reactive.js';
```

with:

```javascript
import { computed as createComputed, effect as createEffect, untracked } from 'domma-reactive';
```

- [ ] **Step 2: Confirm nothing else imports the old module**

```bash
cd /home/darryl/src/js/domma && grep -rn "reactive.js" src/ || echo "clean"
```
Expected: `clean` (only `src/reactive.js` and `src/reactive.test.js` themselves may still match).

- [ ] **Step 3: Delete the superseded files**

```bash
cd /home/darryl/src/js/domma && git rm src/reactive.js src/reactive.test.js
```

Their coverage now lives in `domma-reactive/src/graph.test.js`. **Do not assume** the Model-specific
tests are already covered by `models.test.js` and `model-binding.test.js` — check each, and port any
that is not. Task 3 found this is a real risk: `does not notify when a write sets an equal value` had
no equivalent anywhere in Domma and was ported then.

Specifically, `destroying a model detaches its dependents` is currently the **only** coverage
anywhere for the Model-level teardown path, which Task 9 Step 9 rewrites (`_deps.clear()` becomes
`_fields.clear()`). Port it into `models.test.js` before deleting the file, and verify the port
catches a regression — gut `destroy()` and confirm it fails.

- [ ] **Step 4: Run the full suite**

Run: `cd /home/darryl/src/js/domma && npx vitest run 2>&1 | tail -3`
Expected: **`Tests  422 passed | 3 skipped (425)`** — 437 minus the 15 reactive tests that moved to
the package. **Zero failures** is the requirement.

- [ ] **Step 5: Commit**

```bash
cd /home/darryl/src/js/domma
git add -A
git commit -m "refactor: source reactivity from domma-reactive

Deletes src/reactive.js and its tests; their coverage now lives in the
package. component-factory imports from domma-reactive."
```

---

## Task 11: Verify the build and the real pages

Unit tests do not catch bundling or rendering problems. This task exists because the v0.30.0 modal
regression passed every unit test.

- [ ] **Step 1: Rebuild**

```bash
cd /home/darryl/src/js/domma && npm run build:js 2>&1 | tail -3
```
Expected: no errors.

- [ ] **Step 2: Confirm the bundle is self-contained**

```bash
cd /home/darryl/src/js/domma && grep -c "domma-reactive" public/dist/domma.min.js
```
Expected: `0`. Any hit means the import survived and consumers would need to install it — that
breaks the CDN story and must be fixed before proceeding.

- [ ] **Step 3: Confirm the bundle still works standalone**

```bash
cd /home/darryl/src/js/domma
cat > zzcheck.mjs <<'EOF'
import {JSDOM} from 'jsdom';
import {readFileSync} from 'fs';
const d = new JSDOM('<!DOCTYPE html><body></body>', {runScripts: 'dangerously', pretendToBeVisual: true});
const s = d.window.document.createElement('script');
s.textContent = readFileSync('public/dist/domma.min.js', 'utf8');
d.window.document.body.appendChild(s);
const M = d.window.Domma.models;
const m = M.create({a: {}}, {a: 1});
const seen = [];
M.effect(() => seen.push(m.get('a')));
m.set('a', 2);
M.flush();
console.log(seen.join(',') === '1,2' ? 'PASS reactivity works from the bundle' : 'FAIL ' + seen);
EOF
node zzcheck.mjs && rm zzcheck.mjs
```
Expected: `PASS reactivity works from the bundle`.

- [ ] **Step 4: Verify the five example apps**

Use the harness pattern already proven in this repo: load `public/dist/domma.min.js` into jsdom,
stub `fetch` to read `template.html` from disk, load the example's `component.js`, create the custom
element, and assert the shadow root's `.dm-component-root` has non-trivial content and no console
errors. Cover `todo`, `contacts`, `notes`, `calculator` and `markdown`.

Expected: all five render; zero console errors.

- [ ] **Step 5: Verify the calculator computes**

Click `7`, `+`, `8`, `=` on the calculator's shadow-root buttons and assert the display reads `15`.
This exercises computed properties end to end through the rewired `Model`.

Expected: `15`.

- [ ] **Step 6: Commit any fixes**

If Steps 1–5 required changes, commit them with a message describing the actual defect found.

---

## Task 12: Release Domma

Follow the documented manual release process — **not** `npm run release:patch`, which is known to be
broken in this repo.

- [ ] **Step 1: Fetch first**

```bash
cd /home/darryl/src/js/domma && git fetch origin && git rev-list --left-right --count HEAD...origin/main
```
Local main can be stale; building a release on a stale base has clobbered a real tag before.

- [ ] **Step 2: Add release notes**

Prepend a `### v0.31.0 - Reactive Core Extracted (YYYY-MM-DD)` section to `docs/RELEASE_NOTES.md`,
newest first, matching the existing format. State plainly that this is an internal restructuring with
no API change, and that `domma-reactive` is now published separately. Commit as
`docs: add v0.31.0 release notes`.

- [ ] **Step 3: Bump, build, commit, tag**

```bash
cd /home/darryl/src/js/domma
npm version minor --no-git-tag-version
npm run build
git add package.json package-lock.json public/download/kickstart-manifest.json
git commit -m "Build v0.31.0"
git tag -a v0.31.0 -m "Release v0.31.0"
```

Minor, not patch: a new package enters the supply chain and the internals change substantially,
even though the public API does not.

- [ ] **Step 4: Confirm before anything leaves the machine**

Push, `npm publish` and `gh release create` are outward-facing and effectively irreversible.
**Confirm with the repository owner before running them**, then follow the documented order:
`git push origin main`, `git push origin v0.31.0`, `npm publish --access public`,
`gh release create v0.31.0 --title "Domma v0.31.0" --notes "<notes>" public/dist/domma.min.js public/dist/domma.esm.js public/dist/domma.css public/dist/grid.css public/dist/elements.css`.

---

## Self-Review

**Spec coverage (M1 scope only):**

| Spec requirement | Task |
|---|---|
| §3 repo, npm name, exact pin | 1, 7, 8 |
| §4 `graph.js` moved, DOM-agnostic | 3 |
| §4 own deep-equality helper | 2 |
| §4 `observable.js` primitive | 4, 5 |
| §4 `index.js` public surface | 6 |
| §4 Model becomes an adapter | 9 |
| §8 public API unchanged, 435 tests green | 9 (Step 11), 10 (Step 4) |
| §8 five examples behave identically | 11 (Steps 4–5) |
| §11 criterion 1 — works standalone | 6, 7 |
| §11 criterion 2 — bundle self-contained | 8 (Step 3), 11 (Step 2) |

M2–M4 (expression evaluator, binding registry, reconciliation) are deliberately absent; they are
separate milestones with their own plans.

**Naming consistency check:** `observable()` / `observableArray()` / `.value` / `.peek()` / `.set()`
are used identically in Tasks 4, 5, 6 and 9. `_field()` and `_snapshot()` are defined in Task 9
Step 4 before their use in Steps 5–9. `flushSync` is the package's name throughout; Domma continues
to expose it publicly as `M.flush`.

**Known gaps, stated rather than hidden:**
- Task 6 Step 7 gives an approximate test total. The requirement is zero failures, not a specific
  count.
- Task 10 Step 4 predicts 420 tests. If the true figure differs, confirm the difference is exactly
  the moved reactive tests before continuing.
- Pushing the new repo needs a GitHub remote created manually first (Task 7 Step 4).
