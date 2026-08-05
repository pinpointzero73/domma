### v0.35.0 - A List's Rows Can Act on the List (2026-08-05)

**One new Domma API: `M.computed().value`.** Everything else arrives through the pinned
`domma-reactive` dependency, which Rollup still inlines — `domma.min.js` remains a single
self-contained file and consumers install nothing extra.

✨ **New**

*   **`M.computed()` is readable as `.value`**, the same read as `get()`.

    ```javascript
    const total = M.computed(() => order.get('price') * order.get('qty'));

    total.value;   // 30 — identical to total.get()
    ```

    `M.observable()` has always been read through `.value`; `M.computed()` was a facade with only
    `get()`, so the two halves of the same idea disagreed about how you read them. It also made a
    computed unreadable from a template expression, where a method cannot be called — `{{total.get()}}`
    does not parse and never will, because a call inside a render is a side effect.

*   **`M.observableArray().remove()` takes a value or a test.**

    ```javascript
    rows.remove(row);              // that exact object, as before
    rows.remove(r => r.id > 2);    // everything the test accepts
    ```

    A function used to be compared against each item by identity, never matched, and removed nothing
    without a word — the failure mode you cannot see. The test is called with `(item, index)`. The one
    case this gives up is an array of bare functions removing one of its own members by passing it;
    `peek()` plus `splice()` still covers that.

🐛 **Bug Fixes** (`domma-reactive` 0.4.0)

*   **`&&` no longer breaks a binding inside a keyed block.** A keyed block's body is captured by
    serialising DOM back to HTML, which escapes every `&` it writes — so
    `data-bind-class="done && 'struck'"`, the documented idiom, came back out as `&amp;&amp;` and
    failed to parse. Attribute values are now entity-decoded where they are read as expressions, in a
    single pass so `&amp;lt;` cannot double-decode. Ordinary attributes are untouched, because there
    the entities are markup.

*   **`data-on-*` may call a method on your data.** Inside a list `$data` is the item, and a bare name
    resolves against `$data` only, so `$parent.remove($data)` was the sole way for a row to reach the
    list that owns it — and it did not parse.

    The restriction is not lifted, it is **scoped**: only the event binding may do this, and the
    evaluator still refuses to perform a method call, so `{{ }}`, `data-if` and `data-bind-*` remain
    reads with no side effects. `this` follows JavaScript — a call keeps its receiver, a reference
    does not. The method name is read through the same guard as any other property, so
    `$data.constructor()` is refused exactly as `{{ $data.constructor }}` is.

    **Note for component authors:** a component's `methods` are attached to the component context, not
    to the data returned by `data()`, so a component template has nothing for `$parent.method()` to
    resolve to. Reaching them from a template is part of the Tier 4 binding work and is not in this
    release.

🔧 **Internal**

*   `domma-reactive` moves from 0.3.0 to **0.4.0** — keyed list reconciliation, instance lifecycle and
    `applyBindings()`, plus the four fixes above. 676 tests, every new guarantee mutation-tested. Its
    README is rewritten around a complete worked application, with every runnable example executed
    against the built bundle.

*   Domma's own suite grows to **448 passing**, pinning `.value` as both a real read and a real
    dependency.

### v0.34.0 - CSP-Safe Expressions & a Binding Registry (2026-08-05)

**No Domma API changes.** Everything below arrives through the pinned `domma-reactive` dependency,
which Rollup still inlines — `domma.min.js` remains a single self-contained file and consumers install
nothing extra.

✨ **New in the reactive core** (`domma-reactive` 0.3.0)

*   **A CSP-safe expression evaluator.** Tokeniser → Pratt parser → AST → tree-walking evaluator, with
    a helper registry. It supports property paths, indexing, comparison, logical operators, ternaries,
    arithmetic, string concatenation, literals, and calls to registered helpers only.

    **There is no `eval` and no `Function` constructor anywhere in the source or in any built bundle.**
    That matters: Knockout evaluates bindings with the `Function` constructor, which fails outright
    under `script-src 'self'` without `unsafe-eval`. Domma's expressions work under a strict CSP.

    Refused by design: arbitrary and member calls (`x.foo()`), assignment, `new`, and property access
    through `__proto__`, `constructor` or `prototype` — in every form, including a computed key whose
    value is only `'__proto__'` at runtime. A malformed expression warns and yields `undefined`; it
    never throws mid-render.

*   **A binding registry with `registerBinding()`**, plus four behaviour bindings on Domma-native
    attributes:

    | Binding | Purpose |
    |---|---|
    | `data-on-*` | Events. Your arguments first, the event last, `this` is the data; returning `false` calls `preventDefault()` |
    | `data-bind-*` | Property or attribute. `class` is additive and remembers only what it applied, so static classes survive |
    | `data-model` | Two-way. Requires a settable path; refuses the prototype keys in every form |
    | `data-if` | Conditional. **Removes** the element rather than hiding it |

    The four existing mustache kinds — text, attribute, block and raw — are now registered through the
    same public `registerBinding()` the extension API uses, so a custom binding is not a second-class
    citizen.

    There is deliberately **no `data-bind-html`**: assigning `innerHTML` from data is an XSS hole, and
    `{{{triple-stache}}}` already provides a visible, greppable opt-out.

*   **The package now stands alone for templates.** `compile()` previously threw
    `renderFn is not a function` unless you supplied a template engine. It now defaults to a renderer
    built on the evaluator, so `npm install domma-reactive` gives you working `{{ }}` out of the box.
    Domma continues to pass its own renderer and behaves identically.

🐛 **Bug Fixes**

*   **Seven rules painted with variables that are defined nowhere** — `--dm-bg-secondary`, `--dm-bg`,
    `--dm-purple-50` and `--dm-purple-900`. An undefined variable makes the whole declaration invalid,
    so those backgrounds were simply absent. Repointed at `--dm-surface-secondary`,
    `--dm-background` and `--dm-info-bg`.

🔧 **Internal**

*   **Two repository validators**, wired as `npm run validate`:

    | Command | Catches |
    |---|---|
    | `validate:classes` | CSS classes used in HTML that resolve to no rule |
    | `validate:theme` | Rules painting a fixed background while inheriting a themed text colour |

    Both exist because their failure modes are **invisible** — no error, no failing test, just markup
    that renders wrong. `.form-control`, `.col-md-*` and `.table-responsive` all shipped while defined
    nowhere; eighteen rules set a background from a variable no theme redefines, which is why the
    showcase method chips were illegible in dark mode.

    Both are ratchets against a recorded baseline, so they fail on new violations rather than on the
    known backlog. `--update-baseline` accepts the current state; `--strict` reports everything.

---

### v0.33.1 - Millisecond Waits (2026-08-05)

🐛 **Bug Fixes**

*   **A `'300ms'` wait ran for five minutes.** `parseWait()` in the scribe effect tested
    `endsWith('s')` before `endsWith('ms')` — and because `'ms'` also ends with `'s'`, the millisecond
    branch was unreachable. Every millisecond-suffixed wait was multiplied by 1000, so a sequence like

    ```javascript
    Domma.effects.scribe('.headline', {
        actions: [{render: 'Hello'}, {wait: '300ms'}, {render: ' world'}]
    });
    ```

    appeared to stop after the first render. Seconds (`'2s'`) and raw numbers were unaffected, which is
    why it went unnoticed — the workaround was to pass milliseconds as a number.

    This was reported in the v0.25.2 notes as "fix queued for a future patch release" and has been
    present ever since.

🔧 **Internal**

*   `parseWait` was closure-local inside `scribe()` and therefore impossible to test. It is now a
    module-scope export, matching how `resolvePalette` is already handled in that file, and is pinned
    by tests that fail if the branch ordering is restored. It is not exposed on `Domma.effects` — the
    public surface is unchanged.

*   A non-finite number now returns `0` rather than letting `NaN` reach a timer.

---

### v0.33.0 - Working Scaffolds & a Real Reactivity Showcase (2026-08-05)

🐛 **Bug Fixes**

*   **Every scaffolded project rendered unstyled.** The kickstart templates were written in Bootstrap
    class names while Domma ships Tailwind-style utilities, so **143 class usages across 14 files
    resolved to nothing**. `d-flex`, `justify-content-center`, `align-items-center`, `flex-column`,
    `me-*`/`ms-*`, `lead`, `display-*`, `h3`–`h6`, `btn-outline-primary`, `form-control`, `col-lg-*`
    and Tailwind's `lg:grid-cols-*` are all mapped to their Domma equivalents. Anyone who ran
    `npx domma init` got a project that looked broken on first load.

*   **Two scaffolded components were dead, not merely unstyled.** The contact FAQ and docs pages used
    Bootstrap's `data-bs-toggle="collapse"` markup — and Bootstrap JS is never loaded — while
    `contact.js` and `docs.js` already called `Domma.elements.accordion()` and `.tabs()` against markup
    they could not recognise. Both work now.

✨ **New**

*   **`.list-none` and `.no-underline`** — standard utilities in the vocabulary Domma has adopted, and
    genuinely absent from it until now.

*   **Try-it panes in the showcase.** Editable code with live output, on any showcase page:

    ```html
    <div class="try-it" data-try-it="One value, no schema">
        <textarea class="try-it-editor" rows="6">
            const count = M.observable(0);
            log('doubled:', M.computed(() => count.value * 2).get());
        </textarea>
    </div>
    ```

    Panes auto-run on load so a reader sees a result before touching anything, catch errors rather
    than throwing, and render output as text so a snippet cannot inject markup.

📖 **Documentation**

*   **The Reactivity showcase is a showcase now, not a reference.** It had six sections, every one
    named after a mechanism and opening by explaining that mechanism — with no statement of the
    problem it solves, no benefit, no guidance on when *not* to use it, and no mention of
    `M.observable`, `M.observableArray` or `domma-reactive` at all.

    Now twelve sections, each named for an outcome, demonstration before explanation, opening with the
    code you stop writing. A new **"When not to reach for it"** section shows the mutation trap and the
    `Date`-field trap running live rather than describing them. Prose grew from 506 to 4,118 words;
    all 26 existing interactive demos are preserved.

🔧 **Internal**

*   **The template compiler now lives in `domma-reactive` (0.2.0).** The extraction spec's M1 called
    for moving the graph *and* the Tier 3 compiler; only the graph moved, so M1 shipped half-done. The
    compiler takes its mustache renderer as a parameter, so the package gains the anchor and binding
    machinery without gaining a template engine — which is the seam the expression evaluator plugs into
    next. Domma still inlines the package at build time; consumers install nothing extra.

---

### v0.32.0 - Observables, Badges & Readable Buttons (2026-08-04)

✨ **New**

*   **`M.observable()` and `M.observableArray()`.** The reactive primitives beneath Models are now
    reachable from Domma. Use `M.create()` when you want a schema, validation and persistence; use an
    observable when you want one tracked value and nothing else.

    ```javascript
    const price = M.observable(10);
    const qty   = M.observable(3);
    const total = M.computed(() => price.value * qty.value);

    M.effect(() => console.log('total', total.get()));
    qty.value = 4;   // effect re-runs on the next microtask
    ```

    `M.observableArray()` is the array form; its in-place mutators (`push`, `pop`, `shift`, `unshift`,
    `splice`, `sort`, `reverse`, `fill`, `copyWithin`, plus `remove` and `removeAll`) notify
    unconditionally, because an in-place mutation leaves the array deep-equal to any copy of it and the
    equality gate cannot see it. Both are the same functions published standalone as `domma-reactive`.

    Note their `equals` option defaults to **`domma-reactive`'s** `isEqual`, not Domma's `utils.isEqual`.
    The two differ for `NaN`, `Date`, class instances, `Map`/`Set`/`RegExp` and typed arrays. To get
    Domma's semantics, pass it wrapped: `{equals: (a, b) => _.isEqual(a, b)}` — passing `_.isEqual`
    bare loses its receiver and throws.

🐛 **Bug Fixes**

*   **`onUpdated()` never fired for components whose templates contain no `{{ }}` bindings.** Such a
    component rendered once and then stopped updating: the model changed and persisted correctly, but
    the DOM was never told, and nothing was thrown. This affected the todo, notes, contacts and markdown
    examples, which render their lists imperatively from `onUpdated`. Introduced by the fine-grained
    binding work in v0.30.0 and present in v0.30.0 and v0.30.1.

    The cause was that `_wireBindings()` creates one effect per compiled binding and `onUpdated` only
    fired from within those effects, so zero bindings meant zero effects. Components now also carry a
    watcher effect that tracks the whole model. **Writes made from `onUpdated` must converge** — set a
    value that will compare equal on the next pass. A value that differs every time (`Date.now()`, a
    counter) re-triggers the watcher indefinitely, and because it is a microtask chain it locks the page
    rather than throwing.

*   **Outline buttons could render unreadably.** `.btn-outline` used `background-color: transparent`
    with a `color-mix()` blend leaning 55% toward `--dm-text`, so its contrast depended on whatever sat
    behind it and the label could land on top of its own background. It now uses explicit
    `var(--dm-surface)` and `var(--dm-text)`, both of which every theme redefines. `.btn` also gained a
    base `color`, so a variant whose own colour declaration fails to resolve inherits something readable.

*   **Eighteen showcase rules set a background that never changed with the theme.** Chips such as
    `.models-method-item`, `.tables-method-item` and `.utils-method-item` used `var(--dm-gray-100)` —
    a variable no theme overrides — with no `color` at all, so their labels became unreadable under the
    dark variant. All now use themed variables with an explicit colour.

*   **`.table-responsive` was used in 14 places and defined nowhere**, so wide tables overflowed instead
    of scrolling. Added to `elements.css`.

*   **Reactivity showcase** used `.form-control`, which is not a Domma class — the correct classes are
    `.form-input` and `.form-select`, so nine inputs rendered as unstyled native controls. It also used
    `.col-md-*`, which does not exist, and omitted `grid.css` entirely.

🔧 **Internal**

*   New tests pin contracts that previously had none: that a component without an `onUpdated` hook does
    not pay for a watcher, that the hook fires after the flush that ran the binding effects, that it
    coalesces to once per flush, and that it stops after disconnect.

⚠️ **Known Issues**

*   **`onUpdated` does not fire for fields absent from `data()`**, nor at all for a component that
    declares no `data()`. Observables are created lazily, so a field that did not exist when the watcher
    collected its dependencies is not tracked, and stays untracked until some declared field changes.
    Declare every field in `data()`. Closing this properly needs a structural dependency inside `Model`.

*   **Date-valued model fields do not fire change notifications**, because `utils.isEqual` compares any
    two `Date` instances as equal. Long-standing behaviour, preserved deliberately, now pinned by a test.

---

### v0.31.0 - Reactive Core Extracted (2026-08-04)

**This is an internal restructuring. There is no API change.** Every public method behaves exactly as
it did in v0.30.1 — `M.create()`, `get`/`set`, validation, persistence, `onChange`, `onFieldChange`,
`reset`, `destroy`, `toJSON`, `validate`, `model.tracked()`, `M.computed()`, `M.effect()`,
`M.untracked()` and `M.flush()` are all untouched. Nothing to migrate.

📦 **Reactivity is now a separate package**

*   Domma's dependency-tracking core has been extracted into
    [`domma-reactive`](https://www.npmjs.com/package/domma-reactive), published separately so it can
    be used on its own. It provides `observable()`, `observableArray()`, `computed()`, `effect()`,
    `untracked()` and `flushSync()`, with no dependency on Domma.

*   **You do not need to install it.** Domma takes it as an exact-pinned build-time dependency and
    Rollup inlines it, so `domma.min.js` remains a single self-contained file. The CDN story is
    unchanged and consumers install nothing extra.

🔧 **Internal**

*   `Model` no longer stores fields in a plain object with a shared `DepMap`. Each field is now
    backed by its own observable. Domma's `utils.isEqual` is passed explicitly as the change gate, so
    change-detection semantics are byte-identical to v0.30.1 — including its existing treatment of
    Date fields (see Known Issues).

*   `src/reactive.js` has been deleted; its behaviour now lives in the package. `models.js` and
    `component-factory.js` source their reactivity from `domma-reactive`.

*   Test coverage grew from 435 to 436 tests while the reactive suite moved out to the package. The
    additions pin contracts that previously had none: that a no-op write does not fire `onChange`,
    that `toJSON()` and `validate()` do not register dependencies, that the `tracked()` view can be
    spread, that destroying a model detaches its dependents, and that `onChange` stays synchronous
    and per-field across a batch `set()`.

*   New `src/examples.test.js` loads the built bundle into jsdom and verifies all five example apps
    render without console errors, and that the calculator still computes.

⚠️ **Known Issues**

*   **Components whose templates contain no `{{ }}` bindings never fire `onUpdated()`.** Such a
    component renders once and then stops updating: the model changes and persists correctly, but the
    DOM is never told, and no error is raised. This affects the todo, notes, contacts and markdown
    examples, which render their lists imperatively from `onUpdated`.

    This is **not** new in v0.31.0 — it was introduced by the fine-grained binding work in v0.30.0 and
    is present in v0.30.0 and v0.30.1. It is recorded here because it was found while verifying this
    release. The cause is that `_wireBindings()` creates one effect per compiled binding and
    `onUpdated` only fires from within those effects, so zero bindings means zero effects. A fix is
    planned for the next release.

*   **Date-valued fields do not fire change notifications.** `utils.isEqual` compares any two `Date`
    instances as equal, because neither has own enumerable keys. This is long-standing v0.30.1
    behaviour, preserved deliberately here so the extraction changed nothing observable; it is now
    pinned by a test so that fixing it is a conscious decision rather than an accident.

---

### v0.30.1 - Wrapper Regression & Card Callbacks (2026-08-04)

🐛 **Bug Fixes**

*   **Modals, cards and badges rendered invisible after v0.30.0.** The element-identity fix in v0.30.0 copied the author element's full class list onto the Web Component that replaces it — including the legacy base class (`.modal`, `.card`, `.badge`). Those `elements.css` rules describe the hand-written, JS-free version of each component and are driven by class toggles the Web Component never performs: `.modal` sets `opacity: 0; pointer-events: none`, undone only by `.modal.active`, while `<domma-modal>` shows itself via `:host([visible])`. Because outer-document CSS overrides `:host` styling, an opened modal was fully invisible and unclickable — while `isOpen()` cheerfully reported `true`. The base class is no longer copied; `id`, `data-*` attributes and author classes still transfer as intended. **If you are on v0.30.0, upgrade.**

*   **Card option callbacks received a useless value.** `onCollapse`, `onExpand` and `onClick` were handed `e.detail`, which is never what the caller wants: the component emits through the base class's `_emit()` with a default detail of `{}`, so callbacks received an empty object — and for native events such as `click`, `detail` is the click *count*, so they received the number `1`. The intended `|| webComponent` fallback never fired, because `{}` and `1` are both truthy. Callbacks now receive the card instance, so `onCollapse: (card) => card.expand()` behaves as documented.

🧪 **Testing**

*   **The suite now loads DOMPurify.** Domma's sanitiser escapes the *entire* string when DOMPurify is absent, so `.html()` and every other sanitised write silently degraded under test — meaning the suite asserted the fallback rather than what Domma actually ships (every documented Domma page loads DOMPurify). Added as a `devDependency`; it does not enter the published bundle.
*   **New `wrapper-identity.test.js` asserts computed style, not just API state.** The v0.30.0 regression slipped through precisely because the existing check asserted `isOpen()`. These tests load the built `elements.css` and assert the component is genuinely visible. Verified to fail against the buggy build.
*   Card tests now assert the Web Component contract (host attributes, shadow-root chrome) rather than the pre-migration light-DOM classes, and HTTP error tests cover the two previously-untested fallback branches. Full suite: 435 passing, 0 failing.

---

### v0.30.0 - Dependency Tracking (2026-08-04)

✨ **Enhancements**

*   **Reactive dependency tracking (`M.computed`, `M.effect`).** Derivations now discover which fields they actually read, so a write re-runs exactly the work that depends on it. `M.computed(fn)` is lazily evaluated and cached until a tracked dependency changes; `M.effect(fn)` runs immediately to collect its dependencies then again whenever any of them move, returning a stop function. Dependencies are re-collected on every run, so a derivation stops listening to the branch it no longer takes. Also adds `M.untracked(fn)` for reads that should not subscribe, `M.flush()` to settle pending work synchronously, and `model.tracked()` — a read-tracked, write-through view of a model whose writes still validate, notify and persist. Updates are batched: a burst of `set()` calls in one tick produces a single re-run on the next microtask. See [Reactivity.md](./Reactivity.md).

*   **Components re-render surgically instead of wholesale.** Component templates now compile to fine-grained bindings — text, attribute, block (`{{#if}}`/`{{#each}}`/`{{#with}}`) and raw (`{{{...}}}`) — each with its own dependencies and its own reactive effect. Flipping a `{{#if}}` re-renders only that block, so focus, scroll position and uncommitted user input elsewhere in the component survive a structural change. Computed properties are memoised, so one shared by several readers is evaluated once per flush rather than once per reader, and the previous strategy of re-evaluating *every* computed and deep-comparing all of them on *every* change is gone. Bindings inside `{{#each}}`/`{{#with}}` are deliberately refreshed by their enclosing block rather than bound independently, because those bodies evaluate against a different data object.

*   **`$.getComponent(selector)`.** `$.setup()` kept component instances in a private map with no public accessor, so page code had no supported way to call a configured component's methods. `$.getComponent('#my-modal').open()` now works; calling it with no argument returns a Map of every configured instance.

*   **`model.onChange(field, callback)`.** The field-scoped overload is now real (see Bug Fixes).

🐛 **Bug Fixes**

*   **Model → component sync was silently dead in Autocomplete, Pillbox and Editor.** `Model.onChange` passes a **single object** — `{field, newValue, oldValue, model}` — but four call sites destructured it positionally as `(field, newVal)`, so the guard compared an object against a string and never matched. Changing the model simply did not update the component. All four now use `onFieldChange`, which is the API designed for this and removes the field-name comparison entirely. Pillbox additionally now only binds once its structure exists — `_init()` bails on a non-input element, and a subscription firing into a half-built Pillbox threw.

*   **`model.onChange('field', callback)` threw on the next `set()`.** The two-argument form is documented and used by the contacts example, but was never implemented: it added the *string* to the callback set and discarded the function, so the callback never fired and the next change threw `cb is not a function`. It is now a genuine overload, and passing a non-callable subscriber throws immediately instead of failing later at notify time.

*   **Badge, Card and Modal lost their element identity on initialisation.** These wrappers replace the author's element with a custom element via `replaceWith()`, but did not carry over its `id`, classes or `data-*` attributes. `#my-modal` therefore stopped existing the moment it was initialised, breaking every subsequent selector lookup — including the config engine's own event bindings and `$.update()` / `$.reset()`. Attributes are now preserved, without clobbering anything the options already configured.

*   **Config showcase did not honour the active theme.** `showcase/config/all-components.html` styled its demo panels with fixed palette values (`--dm-gray-100`, `--dm-gray-800`, `background: white`) which do not change between light and dark variants, leaving the panels light on dark themes. Now uses `--dm-surface-raised`, `--dm-surface-overlay`, `--dm-text` and `--dm-border`.

*   **Web Component test coverage was impossible.** `tests/setup-vitest.js` constructed its own JSDOM instance alongside the one Vitest already provides, leaving two `customElements` registries and two `HTMLElement` constructors — so custom elements could never upgrade under test. Fixing this repaired 7 pre-existing Modal, Card and backToTop failures; the element-identity fix above cleared a further 8.

📚 **Documentation**

*   New [Reactivity guide](./Reactivity.md), a Reactivity section in [API.md](./API.md) and [DommaDocumentation.md](./DommaDocumentation.md), a walkthrough in the SPA QuickStart, and an interactive [Reactivity showcase](../public/showcase/models/reactivity.html).
*   The config showcase guide previously taught `$('#sel').data('component')`, which never worked — it now documents `$.getComponent()`.

⚠️ **Upgrade Notes**

*   No API removals or signature changes. `onChange`, `onFieldChange`, `M.bind()`, validation and persistence all behave exactly as before — only tracked computations are batched onto the microtask.
*   **Badge, Card and Modal now keep their `id` and classes after initialisation.** This is the intended behaviour, but if any CSS or script relied on those attributes disappearing, it will now match where it previously did not.
*   Computeds and effects must be **synchronous** — dependency collection stops at the first `await` — and must **return new values rather than mutating existing ones**, since propagation is gated on deep equality.

---

### v0.29.2 - Tooltip Double-Wrap Fix (2026-06-30)

🐛 **Bug Fixes**

*   **Tooltips no longer disappear when two layers wire the same element.** `createTooltipWrapper` (the `E.tooltip` / `Domma.elements.tooltip` factory) physically wraps each target in a `<domma-tooltip>` element, but was **not idempotent** — calling it twice on the same element nested a second `<domma-tooltip>`, which breaks the tooltip. This regressed admin action-button tooltips after 0.29.1: `Table.render()` now re-wires tooltips on every re-render (so they survive pagination), but the admin views ALSO wire the same buttons after `T.create`, so every button got double-wrapped and showed nothing. `createTooltipWrapper` is now idempotent — it refreshes an existing wrapper instead of nesting a new one — and it **falls back to the element's `data-tooltip` / `title` for content** when no explicit `content` is given (the `<domma-tooltip>` component reads only its `content` attribute, so framework/`forms.js` tooltips wired by `data-tooltip` alone were rendering empty). Verified before/after: a double-wired action button drops from 2 nested `<domma-tooltip>` wrappers to 1, with correct content.

---

### v0.29.1 - Table Re-render Icon & Tooltip Fix (2026-06-30)

🐛 **Bug Fixes**

*   **`Table` icons & tooltips now survive re-renders:** `TableInstance.render()` rebuilds the entire table subtree (`innerHTML`) on every state change — search, sort, pagination, page-size, filter and column toggle all route through it. Consumer cell markup produced by `col.render()` (`data-icon` spans and `data-tooltip` triggers) was only processed after the *initial* render, so action-button icons and tooltip popovers vanished the moment a user paginated, searched or sorted. `render()` now re-scans icons and re-wires tooltips on the rebuilt subtree via a new `_reinitRenderedContent()` step (mirrors `Form._initTooltips`), so table content stays live across every re-render. The icon half completes the long-dormant `_restoreIconsBeforeRebuild()` path, which converted rendered SVGs back to `data-icon` spans but never re-scanned them.

---

### v0.19.7 - Card Accent Variant (2026-03-17)

✨ **Enhancements**

*   **`.card-accent` CSS Classes:** The left-border accent pattern is now a set of five first-class card variant classes instead of an inline style workaround:
    *   `.card-accent` — primary colour left border (`--dm-primary`)
    *   `.card-accent-success` — success green (`--dm-success`)
    *   `.card-accent-danger` — danger red (`--dm-danger`)
    *   `.card-accent-warning` — warning amber (`--dm-warning`)
    *   `.card-accent-info` — info sky (`--dm-info`)
*   **`--dm-card-accent` Theme Variable:** Added to all 26 theme files as a primary-colour alias, enabling per-theme accent customisation and supporting the JS `color: 'accent'` API option.
*   **Showcase:** Dedicated *Card Accent* section added to the Elements showcase; inline `border-left` style on the elements index replaced with the new class.

🧹 **Repo Hygiene**

*   Removed stale backups: `src/css/domma.css.original`, `public/showcase/css/domma.css.original`.
*   Removed stale TODO file: `public/showcase/elements/CSS_CUSTOMISATION_SECTIONS_TODO.md`.
*   Removed empty directories: `public/showcase/js/`, `public/showcase/examples/`.
*   Added `.superpowers/`, `firebase-debug.log`, and `release.json` to `.gitignore`.
*   Fixed `src/CLAUDE.md` file reference: `quick-roller.js` → `page-roller.js`.

---

### v0.19.0 - Unicorn & Dreamy Themes + Codebase Cleanup (2026-03-04)

✨ **New Themes**

*   **Unicorn Light** (`unicorn-light`) — Amethyst purple primary (`#9b59b6`), hot pink secondary (`#e91e90`), white surfaces with faint lavender tint, dark aubergine text (`#2d1b3d`), light purple borders (`#e1bee7`).
*   **Unicorn Dark** (`unicorn-dark`) — Deep purple-black backgrounds (`#1a0e24` / `#241432`), lighter purple primary (`#ce93d8`) and lighter pink secondary (`#f48fb1`) for dark-mode contrast, muted purple borders (`#4a2660`).
*   **Dreamy Light** (`dreamy-light`) — Warm brown primary (`#8d6e63`), dusty rose-brown secondary (`#a1887f`), warm cream surfaces (`#fffdf9` / `#f5f0eb`), dark chocolate text (`#3e2723`), light biscuit borders (`#d7ccc8`).
*   **Dreamy Dark** (`dreamy-dark`) — Dark espresso backgrounds (`#1c1410` / `#2a1f1a`), lighter taupe primary (`#bcaaa4`) for contrast, warm off-white text (`#efebe9`), dark brown borders (`#4e342e`).

🚀 **Enhancements**

*   **Theme Registration (all 6 surfaces):** Both themes registered in `AVAILABLE_THEMES` and `listBases()` in `src/theme.js`; added to `scripts/build-css.js` so they compile into `domma-themes.css`; added `<optgroup>` blocks to the Theme Roller dropdown; added gradient swatch CSS rules and dot buttons to `public/layouts/js/layout.js` (variant count 16 → 20); added to the Kickstart Builder theme selector.

🧹 **Housekeeping**

*   Removed 3 source backup files (`dom.js.backup-*`, `elements.js.backup-xss-*`), 3 celebration theme `.bak` files (superseded), `debug-wizard.html`, `firebase-debug.log`, `coverage/` directory, and `.playwright-mcp/` screenshot cache.

---

### v0.15.0 - Effects Motion Preference Fix (2026-02-14)

🐛 **Bug Fixes**

*   **Effects Motion Preference Override:** Fixed critical issue where `reveal()` and `ripple()` effects were being disabled by CSS media queries even when JavaScript explicitly set `respectMotionPreference: false`. Effects now properly respect the JavaScript override setting.
    *   Added `data-force-animation` attribute to elements when motion preference should be ignored
    *   Updated CSS `@media (prefers-reduced-motion: reduce)` queries to exclude elements with `data-force-animation` using `:not()` selector
    *   Fixed ripple effect to apply attribute to dynamically created ripple elements
    *   Ensures showcase demo pages work correctly regardless of user's system motion preferences

*   **Showcase Effects Pages:** Cleaned up effects showcase pages by removing references to obsolete `overrideMotionPreference` variable
    *   Updated breathe.html, shake.html, and counter.html to use `respectMotionPreference: false` consistently
    *   Fixed 14 remaining references across 3 showcase files

### v0.13.4 - Enhanced Celebrations & Particle Fixes (2026-02-08)

✨ **Features & Enhancements**

*   **Global Celebrations System:**
    *   **Resolved 'Invalid particle values' errors:** Fixed initialization issues across Halloween, Guy Fawkes, Christmas, St. Patrick's, St. George's, St. David's, and St. Andrew's themes by ensuring proper `vx`, `vy`, `static`, `x`, and `y` initializations for all particles.
    *   **Christmas Snow Rendering:** Corrected Christmas snow rendering to appear as distinct snowflakes instead of amorphous blobs.
    *   **Witch's Broomstick Orientation:** Fixed the witch's broomstick orientation in the Halloween theme.
    *   **Halloween Batman Logo:** Implemented a dynamic Batman logo appearing periodically on the moon in the Halloween theme.
    *   **Halloween Fork-Lighting:** Introduced a procedural fork-lighting effect for the Halloween theme.
    *   **Guy Fawkes Fork-Lighting:** Extended the procedural fork-lighting effect to the Guy Fawkes theme.
    *   **Guy Fawkes Catherine Wheel:** Visually overhauled the Catherine Wheel in the Guy Fawkes theme for a more realistic and dynamic effect, including detailed structure, dynamic spark emission, and pulsing glows.

### ✨ Features

*   **New Timeline Component**: Introducing a versatile, data-driven timeline component with multiple layouts (vertical, horizontal, centered), animations, and theming options.
*   **Privacy & Consent Module**: Added a new consent banner that ensures analytics tracking is performed only after obtaining user consent, enhancing user privacy.
*   **Glow CSS Utilities**: Added a new set of `glow-*` CSS utility classes to apply eye-catching text-shadow effects, including hover variants.
*   **New `help-circle` Icon**: A new `help-circle` icon has been added to the UI icon set.

### 🚀 Enhancements

*   **Analytics Update**: The analytics script now respects user privacy by checking for consent before tracking page views.
*   **Theme Improvements**: The `charcoal-light` theme has been updated with darker text for better contrast and improved primary button colors on hover/active states.
*   **Navigation**: Added a "Privacy Policy" link to the main navigation and footer.
*   **CDN Links**: The download page has been updated to use jsDelivr CDN links for artifact downloads.