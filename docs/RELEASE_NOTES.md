### v0.43.0 - The Node You Never Held (2026-09-05)

**`$('#list').append($row)` did not put `$row` in the page.** It put a copy there. Every insertion
method went through one helper that returned `cloneNode(true)` of whatever it was handed, so the
node you built, held a reference to and bound handlers on was never the node the visitor saw. The
markup was right, nothing threw, and the only symptom was that your listeners stopped existing.

🧩 **One helper, five methods**

*   `_getNodes()` backed `append()`, `prepend()`, `after()`, `before()` and `replaceWith()`, and
    `appendTo()` and friends through them. An `HTMLElement` or a `DommaCollection` came back cloned,
    unconditionally, whether there was one target or twenty.

*   `cloneNode` copies attributes and descendants. It does not copy listeners, and it does not copy
    properties. So a handler bound before the insert fired on a detached node nobody could click,
    and `prop('checked', true)` was dropped on the floor while `attr('checked')` survived - the two
    quietly disagreeing depending on which one you happened to use.

*   `$el[0]` kept pointing at the original for the rest of its life, so there was no way to reach
    the element that actually landed in the document except by querying for it again.

*   An existing node is now **moved**, which is what jQuery does and what the call site assumes.

🔁 **Except when a node has to be in two places**

*   `$('.card').append($badge)` has three targets and one badge, and a node cannot be in three
    places. The extras are still clones; the original goes to the **last** target, as in jQuery.

*   Those clones carry no listeners, and cannot: Domma records delegated handlers on the element but
    not direct ones, so there is nothing to re-bind. Inserting into several targets at once still
    wants a delegated handler on a container. This is documented on the helper rather than left to
    be discovered.

*   A markup string is unaffected. It was always parsed fresh for each target, which was always
    right.

🎄 **The celebrations are their own package now**

*   The eight seasonal themes move to [domma-celebrate](https://www.npmjs.com/package/domma-celebrate),
    developed separately and consumed here, so a site with no Domma in it can use them. 14,700 lines
    leave `public/layouts/js/modules/celebrations/`. Nothing in the npm package changes.

*   The build is code-split: the engine is 31 KB and each theme is a chunk fetched only when it is
    in season, rather than all eight arriving in December and in July alike.

*   Every decoration is now individually configurable. Snow but no steam train, pumpkins but no
    witches, half as many trees: `traits: { train: false, tree: 0.5 }`, or `setTrait()` at runtime.
    Each theme publishes what it draws, so a control panel can be built from `getTraits()`.

*   `public/layouts/js/modules/celebrations/` and `templates/celebrations-toggle.html` are gone. If
    you copied the layout preset system by hand, that is the one thing to know.

**How it was found:** the celebrations demo grew per-trait checkboxes, and they ticked and did
nothing. "All on" and "All off" worked, because those are static buttons bound by id and were never
cloned - which is what made it look like a celebrations bug for as long as it did.

**Not caught by anything:** no test failed, and none of the four validators can see this. There are
nine tests now, six of which fail against the previous implementation, and 605 pass overall
including the 85-page showcase harness.

### v0.42.0 - The Menu That Closed On The Way To Itself (2026-08-22)

**Every menu in Domma is separated from the thing that opens it.** The dropdown renders on
`document.body`, so `offset` px of page always sits between the two. The navbar's panel hangs 4px
below its toggle. That gap is the bug: leaving the trigger looks exactly like leaving for good, so
both components guessed, and both guessed wrong most of the time.

🖱️ **A gap you can only cross by accident**

*   The dropdown bridged it with a 12px transparent CSS strip above the menu. Straight down, it
    worked. Diagonally, with an `offset` above 12px, or with the menu placed above or beside its
    trigger, the pointer went round the strip and the menu shut. Whether it survived came down to
    how fast you moved - fast enough and the pointer jumped the gap between two events.

*   The pointer is now tested against three regions: the trigger, the menu, and the corridor spanning
    the gap. That is geometry rather than guesswork, so it holds for any `offset`, any angle of
    approach, and a menu that has been flipped to the other side. The pseudo-element bridge is
    deleted - while open it also blocked whatever was underneath it.

*   The navbar had the same bug one level up, in Domma CMS, which reimplemented hover-to-open with
    `mouseleave` removing `.open` on the instant. The navbar's own `appearOnHover` already held a
    grace period. That period is now an option, `hoverCloseDelay`, defaulting to 250ms.

🔒 **A click that meant nothing**

*   A navbar toggle did a plain `classList.toggle('open')`, which the next mousemove reconciled
    straight back when `appearOnHover` was on - so clicking a menu to keep it open did nothing you
    could see. A click now **pins** the dropdown: hover reconciliation and the leave timer both
    respect it. A second click, or a click anywhere outside, releases it.

*   A toggle also left its siblings open, so two navbar menus could sit on screen at once.

🧹 **Four more, found alongside**

*   The dropdown trigger called `stopPropagation()`, which killed every *other* dropdown's
    outside-click handler. Opening a second menu left the first one hanging open. Opening one now
    closes the rest.

*   `close()` nulled `_menu` but left the node live and clickable for the whole fade, so re-opening
    inside that window stacked a second node on top with its own listeners. The node is reclaimed
    now, and a closing menu leaves hit-testing at once.

*   `position: 'left-start'` and `'right-start'` silently fell through to bottom - the showcase's own
    *Left* and *Right* buttons were wrong. All eight side/alignment combinations work, and a menu
    that would open off screen flips or clamps.

*   A hover dropdown had no click path, so it could not be opened on a touch device at all.

⚠️ **One default moved**

*   `Navbar.collapseAt` was 768 while `elements.css` switches the bar to its desktop layout at 993.
    Between the two the JS believed it was on desktop while the stylesheet was already showing the
    mobile drawer: hover fired inside the drawer, and menus were positioned as if free-floating. The
    default is now 993. Pass `collapseAt` explicitly if you have restyled the breakpoint.

**Also:** `Esc` closes a dropdown, the trigger carries `aria-haspopup` and a tracked `aria-expanded`,
and per-item click listeners are no longer re-registered on every render and never released. The
showcase documented `closeOnClick`, `closeOnOutside` and `offset: 4` - none of which exist. New
options: `hoverOpenDelay`, `hoverCloseDelay`, `closeOnEscape`, `closeOthers`, `flip`.

**Not fixed:** none of this failed a test, because there were no dropdown tests. There are ten now,
plus three for the navbar; eight of the ten fail against the old implementation.

### v0.41.0 - The Brand That Was Never There (2026-08-22)

**A navbar with `variant: dark` rendered its brand at 1.00 contrast on every dark theme.** Same
colour as the bar it sat on. Not dim, not low-contrast - absent. CSS only; no API changes.

🎨 **One mistake, four rules**

*   `.navbar-dark` painted the bar from `--dm-background` and its text from `--dm-text-inverse`. In a
    dark theme both resolve to the theme's darkest slate, so the two are the same colour.
    `.navbar-light` failed the mirror way in light themes: a white bar with white text.

*   `--dm-text-inverse` means *text that contrasts against `--dm-text`*, so in a dark theme it is
    dark. It reads like the right name at the call site and is the wrong one, which is why the same
    mistake is in three more places.

*   `.card-primary .card-body` took `--dm-primary-text` - the foreground for text drawn **on** a
    primary fill. The header and footer set that fill. The body does not; it sits on the card
    surface. 1.19 on every dark theme.

*   `.navbar-link.active` took `--dm-primary` as its text colour. Primary is a mid-tone in the
    silver, charcoal and lemon families, so against the navbar surface it measured as low as **1.72**.

*   The `.navbar-dark .navbar-dropdown-*` overrides replaced the panel text with a fixed grey and the
    hover with `--dm-text-inverse` over 30% white - **2.56** and **1.00** in every light theme. They
    only ever re-stated the `--dm-surface` background the base rules already set, so they are deleted
    rather than rewritten. The divider among them was painted `--dm-surface`, the panel's own colour,
    and had been invisible since the day it was written.

🧭 **The variants are now relative to the theme, not absolute**

*   Every theme already ships the pair meant for this: `--dm-navbar-bg` and `--dm-navbar-text`. The
    variants become tint modifiers on that surface - `dark` sits a shade below the theme's navbar,
    `light` a shade above. They stay visually distinct, they follow the theme, and neither can
    collide with its own foreground.

*   Measured with computed styles in headless Chrome across 26 themes and three variants: navbar and
    card worst case **1.00 to 5.00**, dropdown worst case **1.00 to 9.57**. Everything clears the 4.5
    AA threshold.

⚠️ **Two visible changes to live sites**

*   The active link loses its pill background. A `--dm-primary` tint shifts the bar *toward* the text
    in themes where primary is light, costing about two points of contrast on the tightest
    combination - a dark theme with `.navbar-light`. The affordance is now the primary underline plus
    the weight, which means the active state can never read worse than the brand beside it.

*   Dropdown panels under a `.navbar-dark` bar follow the theme now instead of being fixed grey on a
    surface that was already correct.

**Not fixed:** `validate:theme` caught none of this. It looks for a fixed background inheriting
themed text, and cannot see two *themed* tokens that happen to resolve to the same value. The
validator that would have caught all four does not exist yet.

### v0.40.0 - Two Levels Up (2026-08-21)

**The inlined binding engine moves from 0.5.1 to 1.0.0, and brings two context names with it.** No new
Domma API of its own; nothing that already worked has changed.

🧭 **`$parents` and `$parentContext` - reaching past the immediate parent**

*   `$parent` is one step out, and until now it was the only step there was. From inside a list inside
    a list, **two levels up could not be reached at all**: a bare name is the item, `$parent` is the
    group, and the root was simply unreachable. `$parents` is the whole ancestor chain, nearest first,
    so `$parents[0]` is `$parent` and `$parents[1]` reads a grandparent with no `$data` in sight.

    It is built only if a template asks for it, by walking the chain on first read and caching the
    result. A keyed list mints a context per item per render whether or not anything mentions the
    name, so a list that never uses it pays nothing for it.

*   `$parentContext` is the enclosing **context** rather than its data - the one name here that is a
    context. It exists because ancestor data cannot answer *which row of the outer list am I in?*:
    position lives on the context, not on the item, so no amount of `$parents` reaches it.
    `$parentContext.$index` answers it, and nothing could before.

    `$parent` stays data and not a context. Making it one would mean writing `$parent.$data.name`
    everywhere, which is why it is data in the first place.

⚠️ **A list inside a list is `{{#each}}`, not a second `data-each`**

*   This was always true and never said anything. `data-each` is the `applyBindings` spelling and the
    compiler discovers lists from `{{#each}}` only - and a list's item template **is** compiled markup.
    So a `data-each` nested inside one was left exactly as written: its body rendered **once**, as
    ordinary markup, with every binding in it resolving against the **outer** item.

    It looks close enough to working to survive review, which is how it survived. Activation now warns
    once, quotes the expression back and names the form to write instead. `{{#each}}` nests to any
    depth, both new context names included.

*   Also arriving with the pin: a binding write to a **frozen** target now warns and skips instead of
    throwing. It was reachable long before either of these names existed - `data-model` against a
    frozen view model has always landed there - and a binding that throws takes the page down with it,
    which is the one thing this layer promises never to do.

📌 **Known limitation - `$parentContext.$index` does not survive a reorder**

*   Appending to the outer list is fine, and so is anything that leaves existing positions alone.
    **Moving** an outer row is not: a sort, a reverse or a prepend relocates the DOM correctly and
    leaves every inner item reading the position its group used to be in. The gate that decides
    whether an inner item needs a new context compares the parent context by its `$data` and `$root`,
    and a move changes neither, so nothing tells the inner items anything happened.

    Ancestor **data** is correct throughout - `$parent` and `$parents[n]` are unaffected. It is only
    the enclosing **position**, and only after a move. It is documented next to the feature, in the
    troubleshooting table and beside the showcase demo rather than left to be discovered, and the
    demo appends rather than reorders for exactly that reason.

📦 **Internal**

*   [domma-reactive](https://www.npmjs.com/package/domma-reactive) moves from 0.5.1 to **1.0.0** - the
    same code as 0.8.0 with a promise attached: thirty-three exported names are the public API, the
    binding spellings are settled, and a breaking change needs a major version. 961 tests there, up
    from 793, and 20 KB gzipped with no dependencies.

*   Components and slots (0.7.0 and 0.8.0) are **not** part of this. Domma has its own web-component
    factory and never imports `registerComponent`, so that half of the package is tree-shaken out of
    the bundle rather than bundled and dormant - it is not reachable through `M`, and this release
    does not pretend otherwise.

*   579 tests here, up from 577: the two new context names are pinned at the Domma seam, because a
    capability that arrives with a pin is exactly the kind that can leave with one.

### v0.39.2 - Carousels With Words In (2026-08-21)

**A carousel whose slides are text rather than pictures did not appear at all.** One CSS rule; no API
changes.

🎠 **Text-only slides have height again**

*   `.carousel-slide-content` was unconditionally `position: absolute` - it is the caption overlay for a
    slide's background image, pinned to the bottom with a dark gradient over it. That works when the
    slide carries an `<img>`. When it does not, the caption was the slide's ONLY child, so nothing was
    left in flow: the slide computed to 0px tall, the track and the carousel with it, and the component
    rendered as a gap between the paragraphs either side of it. Arrows, indicators and slide
    transitions were all present and working the whole time, on an element with no height.

    Slide content now sits in flow by default and inherits its colour, and the overlay is stated as the
    enhancement for `.carousel-slide:has(> img)` rather than the default. A browser without `:has()`
    puts an image slide's caption under the picture instead of over it - degraded, not invisible.

*   In-flow slide content is padded clear of the arrows and indicator dots, which are positioned over
    the slide and would otherwise sit on top of the words.

### v0.39.1 - Options You Can Actually Tap (2026-08-21)

**Forma's option groups get a real appearance, and the chooser stops squeezing itself onto phones.**
Two visual fixes and one spacing fix; no API changes.

🎨 **Radio and checkbox groups are styled**

*   `type: 'radio'` and `type: 'checkbox-group'` rendered bare browser controls: the inputs carried no
    class at all, and there was no CSS anywhere for `.domma-radio-group` or `.domma-checkbox-group`.
    Every other control in Forma is themed, so an option group was the one place a form fell back to
    whatever the browser felt like drawing.

    The inputs now use `.form-check-input` - the same custom control `.form-check` has always had -
    and each option is a selectable tile: the whole label is the hit area rather than a 16px box, the
    checked state tints from `--dm-primary`, and the group lays itself out with
    `repeat(auto-fit, minmax(12rem, 1fr))` so short options sit side by side and wrap when they run
    out of room. One column below 480px.

📱 **The card chooser steps down on narrow screens**

*   `.picker-options` used `repeat(var(--picker-cols, 3), 1fr)` at every width, so a three-across card
    grid stayed three-across on a 360px phone and each card was too narrow to read. The chooser now
    also sets `--picker-cols-md` and `--picker-cols-sm` when it builds, both capped at the configured
    count, and steps down at 720px and 460px. A chooser configured with one or two columns is never
    widened.

*   Dialog footers give the confirm button room to breathe: `E.confirm`'s two buttons sat a hairline
    apart, which is how a "discard" gets clicked by someone aiming at "save".

### v0.39.0 - Six Ways In (2026-08-09)

**Six new binding attributes and two new reactive powers**, all of them things you previously had to
write yourself. Nothing that already worked has changed.

✨ **New bindings**

*   **`data-options`** fills a `<select>` from a collection, with `data-options-text`,
    `data-options-value` and `data-options-caption`. A `data-each` over `<option>` produces the same
    markup - what it does not produce is the **selection**, and that is the whole difficulty:
    rebuilding a select's options resets it, and the selection lives on the select rather than on any
    option, so a keyed list has nothing to preserve it with.

    The three companions are expressions against the item rather than property names, so a label can be
    computed. Option values need not be strings: when the resolved value is an object or a number, the
    real value is kept alongside the option and `data-model` reads back **that**, not
    `"[object Object]"`. And a value the model asked for while no option carried it is remembered and
    applied by the rebuild that brings it - so attribute order does not matter, and neither does a
    collection that arrives from an `H.get()` long afterwards.

*   **`data-focus`** is two-way between a value and focus. Setting it moves the caret into the field;
    the user tabbing in sets it `true`; blurring sets it `false`. Both directions earn their place -
    the first is how a model puts focus in the field it has just revealed without reaching for a DOM
    node, the second is how it knows where the user is without a listener. Unlike `data-model`, an
    expression it cannot write through is not fatal: focus still follows the value, and only the
    write-back warns.

*   **`data-bind-style-<property>`** and **`data-bind-style`** set one CSS property or a whole object of
    them. Two spellings because a binding expression has no object literal and will not grow one -
    parsing `{…}` safely is most of the way to the `eval` that Domma's CSP story depends on avoiding.
    Ownership follows the `class` rule: only the properties this binding set last time are removed, so
    a static `style=` attribute survives. A falsy value removes the property; `0` is kept, because
    `opacity: 0` is a real value.

*   **Virtual bindings** - `<!-- dm if: x -->` … `<!-- /dm -->`, plus `each` and `text`. A binding
    attribute needs an element to sit on, and sometimes there is none to spare: a run of `<li>`s, three
    `<td>`s in a row. Wrapping them in a `<div>` to carry the attribute changes the layout, and inside
    a table it is not even valid HTML a browser will keep. They nest, and a block held out of the
    document keeps its nodes together, so a nested block that changes while its parent is closed still
    lands correctly when the parent reopens.

✨ **New in the reactive core**

*   **`M.observable(x).extend({...})`** layers behaviour onto an observable after it exists:
    `rateLimit` (both methods - quiet-time and fixed-rate), `throttle` as the older name for it, and
    `notify: 'always'`. `M.registerExtender()` opens the same registry to you, exactly as
    `M.registerBinding()` does for bindings.

    **The write is never delayed, only the announcement.** Worth stating plainly, because the obvious
    implementation of a throttle defers the write - and then every read between the write and the
    notification gives you a value that is already out of date. A rate-limited observable always reads
    back what was last written to it.

*   **`M.computed({read, write})`** - a computed you can write through, which is what lets
    `data-model="fahrenheit.value"` bind a derived value. Assigning to one with no `write` now warns and
    names it, rather than storing into the read cache where the next recompute would silently drop it.

*   **`M.observableArray()`** gains `indexOf()` (tracked, unlike `peek().indexOf()`), `replace()`, and
    `destroy()` / `destroyAll()`, which **mark** an item rather than removing it - for servers that
    delete on a flag in the payload, where the array must still carry the item at submit time while no
    longer showing it. Every render path skips a marked one.

📋 **Documented**

*   [Bindings](Bindings.md) gains sections for `data-options`, `data-focus`, style and virtual
    bindings; [Reactivity](Reactivity.md) gains Extenders and Writable computeds; [API](API.md) tracks
    both. The upstream package ships a [tutorial](https://github.com/pinpointzero73/domma-reactive/blob/main/Tutorial.md)
    building a contacts page step by step, whose every listing is under test.

🔧 **Internal**

*   [domma-reactive](https://www.npmjs.com/package/domma-reactive) moves to 0.5.1 - 793 tests there, up
    from 679. All six bindings above arrive with the pin, since the handler registry populates itself at
    import; what needed Domma code was the other two, which were reachable in the package and not
    through `M`. 577 tests here, up from 571.

### v0.38.0 - One Adapter (2026-08-06)

**No new API.** This is the seam between Domma and the binding engine, made single - plus a limitation
found by measuring rather than assuming, and now written down.

🔧 **Internal**

*   **One binding adapter, shared.** The engine resolves every expression against *one* object and
    writes back through that same object. Getting either half wrong fails **silently**, in two ways: a
    read-only snapshot swallows every `data-model` write (the control looks right, because what you see
    while typing is your own keystrokes), and an object carrying no functions resolves no `data-on-*`
    handler while every other binding on the element works.

    Both shipped, and were fixed in v0.37.0 - but the fix then existed **twice**, in
    `component-factory.js` and again in `models.js`, in two slightly different shapes. It is now once,
    in `src/binding-source.js`, with the failure modes documented where the code is rather than in two
    comment blocks that drift apart.

    The callers differ only in what can route a write: `M.applyBindings` passes a model's `tracked()`
    view, which reaches the model itself; a component passes a snapshot, which cannot, so it supplies
    an `onWrite` to tell the model.

    Mutation-tested rather than assumed - skip `onWrite`, let the fallback win over the primary, or
    drop the write to the primary, and a different existing test fails for each.

📋 **Documented**

*   **Writing to a nested path does not notify the model.** `data-model="profile.city"`, where
    `profile` is a Model field holding an object, reads correctly and the write lands - but it mutates
    that object in place, so the field's observable never fires. The model is not told, and no other
    binding on that path updates.

    Found while measuring whether `M.bind()`'s `parse` option could be retired. It cannot: `parse` is
    currently the only way to write a nested path and have the model notice, because it clones the
    field and returns a genuinely new value. Bind a top-level field where you can; where you cannot,
    `parse` is the documented idiom.

    Pinned by a test, so that fixing the behaviour fails it and forces the documentation to move with
    it. A real fix means `tracked()` returning a deep proxy, which has performance implications and is
    a separate decision.

*   `domma-reactive` moves to **0.4.2** - every published artefact now carries a version banner
    (`/*! domma-reactive v0.4.2 | MIT | … */`), kept through minification, so a bundle is no longer
    anonymous and a stale `dist/` cannot be published as a fresh one. The package also gained a
    CHANGELOG.

*   571 tests, up from 570.

### v0.37.0 - The Binding Layer, Reachable (2026-08-06)

**`domma.min.js` has inlined the whole binding engine since v0.34.0, and almost none of it was
reachable.** Domma imported ten names from `domma-reactive` and re-exported nearly none, so the
only route to a binding was a template inside `Domma.component()`. There was no way to bind
server-rendered markup and no way to register a custom binding. The evidence: across all 86
showcase pages there were **zero** live uses of `data-bind-*`, `data-model`, `data-each` or
`data-if` outside a component - because outside a component there was no way to use them.

✨ **New**

*   **`M.applyBindings(data, root, options)`** activates every binding attribute under a root on
    markup that already exists - server-rendered, hand-written, whatever - in place, with no
    build step and no second source of truth for the markup.

    ```html
    <div id="app">
        <h1 data-bind-text="title">Rendered by the server</h1>
        <input data-model="query">
        <p data-if="query">Searching…</p>
        <ul data-each="rows key=id"><li data-bind-text="name">row</li></ul>
        <button data-on-click="clear">Clear</button>
    </div>
    ```

    ```javascript
    const handle = M.applyBindings(model, '#app', {
        methods: { clear() { model.set('query', ''); } }
    });

    handle.dispose();   // on anything that outlives its markup
    ```

    Pass a **Model** and it is converted to `model.tracked()` - the read-tracked, write-through
    view - so a `data-model` write lands in the model with validation, change notification and
    persistence intact, rather than in a snapshot. A Model holds data and not behaviour, so
    handlers arrive as `options.methods` and are layered behind the data; a data field of the
    same name wins, exactly as in a component. The root accepts a selector, an element or a
    Domma collection.

*   **`M.registerBinding(name, handler)`** adds a binding kind, usable as `data-<name>` in both
    entry points. It is not a side door: all eight built-ins are registered through this same
    function, so anything a built-in can do, a custom binding can do.

*   **`M.registerHelper(name, fn)`** adds a function an expression may call. Expressions cannot
    call methods on your data - `{{total.get()}}` will not parse, deliberately - so a helper is
    the supported way to shape a value in markup: `data-bind-text="upper(name)"`.

    Both come with `unregisterBinding` / `unregisterHelper`.

*   **[docs/Bindings.md](./Bindings.md)** - the reference for both entry points, the attribute
    list, the expression grammar, the context keys (`$data`, `$index`, `$parent`, `$root`,
    `$length`) and the full handler contract. Live demos on the
    [bindings showcase](../public/showcase/models/bindings.html), which now binds real in-page
    markup alongside its components.

**Deliberately not exposed:** `compile()` and `renderTemplate()`, because Domma already has
`_.render` and the two **diverge** - publishing both would be a trap - plus the raw expression
API, the context builders and the graph internals. This is the two entry points, not the engine.

🐛 **Bug Fixes**

*   **`data-on-*` never resolved inside a component template.** `_mergeData()` returned
    `{...data, ...props, ...computed}` and methods live on the component context, so every event
    binding in every component logged *"did not resolve to a function"* and did nothing - while
    every other binding on the same element worked perfectly.

*   **`data-model` was one-way in a component.** Write-back assigns to `context.$data[key]`, and
    `$data` was a fresh plain snapshot, so the write hit a throwaway object. It looked correct
    because what you see while typing is your own keystrokes: the model never changed and
    nothing else bound to that field moved.

    Both were in the **adapter** between Domma and the engine, not in `domma-reactive`. Reads
    worked throughout, which is exactly why they survived. The engine expects one object to
    resolve expressions against **that can also be written to**; a read-only snapshot satisfies
    half that contract and fails the other half in silence.

*   **`applyBindings` warned about mustache it was about to substitute.** A `{{name}}` inside a
    `data-each` body drew *"does not interpolate `{{ }}`"* - but a list's contents are a
    *template*, lifted out and cloned per item, and the one place in already-rendered DOM where
    mustache does work. The advice told authors to replace working markup. Fixed in
    `domma-reactive` **0.4.1**; a regression test asserts it renders *and* stays quiet, so a
    downgrade of the pin fails a test.

*   **`validate-classes` read binding expressions as class names.** It matched `class="…"`
    anywhere in a tag, so `data-bind-class="isActive && 'on'"` was reported as dead CSS. It now
    requires a word boundary before the attribute.

🔧 **Internal**

*   **The showcase conventions sweep: 186 → 0.** The showcase teaches by example, and it was
    teaching vanilla JavaScript - 186 call sites across 43 pages used `document.querySelector`,
    `addEventListener`, `new Date()`, `fetch()` and `localStorage` on pages whose purpose is to
    demonstrate `$`, `.on()`, `D()`, `H` and `S`.

    Three of the five are **not** straight swaps, which is why this was done by hand: `S.set()`
    namespaces its keys, `H.get()` resolves to parsed JSON rather than a `Response`, and `D()`
    returns a wrapper rather than a `Date`.

*   **`npm run validate:conventions`** keeps it there - a ratchet like the other two, failing
    when a file gets worse or a new offender appears. `--list` prints every site, which is what
    makes a sweep a work list rather than a number. The baseline is empty.

    `$(window)` is deliberately **not** flagged: it is an empty collection, so `$(window).on(…)`
    silently attaches nothing, and a mechanical sweep would have disabled every window listener
    on the site without a word. The reason is recorded in the validator rather than left for
    someone to rediscover.

*   Every rewrite that touched behaviour was verified by dispatching a real event in jsdom. The
    harness proves a page renders and logs nothing; it cannot prove a handler still fires.

*   570 tests, up from 542. The `applyBindings` merge proxy is mutation-tested: swallow the
    write, let methods win over data, or skip `tracked()`, and a test fails for each.

### v0.36.0 - Thirteen Broken Pages (2026-08-05)

**A browser-level test harness for the showcase, and the thirteen broken pages it found on its
first run.** There was no such coverage before: the unit suite exercises `src/` modules in
isolation and cannot see a page that renders wrong, so the failure mode was invisible - no
error, no failing test, just a page that was broken for every visitor.

✨ **New**

*   **`$('#el')[0]` works.** `DommaCollection` exposed `.elements` and `.get(i)` but no numeric
    index properties, so the most-typed thing in jQuery returned `undefined` - silently, until
    something dereferenced it. The DOM showcase documents `$('.items')[0] // Same as get(0)`,
    and **65 call sites** across the repository use the form.

    ```javascript
    $('#el')[0]                 // the element - same as .get(0)
    $('.row')[1]                // second match
    Array.from($('.row'))       // array-like: length + indices
    ```

    Still not iterable: there is no `Symbol.iterator`, so spread and `for...of` do not work.
    jQuery 3 added one; doing the same here is a separate decision.

*   **Four new icons** - `alert-triangle`, `sidebar`, `window` and `gem` - all of which were
    already being used by showcase pages and silently rendering nothing. 520 icons in total.

🐛 **Bug Fixes**

*   **`Domma.init()` has never existed**, and calling it threw. On the CSS-utilities showcase it
    sat at the top of the page's only script, so everything below it died - that page's
    reference table, its main content, rendered *nothing*. Four separate documents instructed
    you to call it: the SPA scaffold's `CLAUDE.md`, the scaffold's memory file, the global JS
    conventions, and an unexecuted plan. All corrected.

    Domma self-initialises when the bundle loads - it registers its web components, manages the
    anti-FOUC cloak and defines the aliases. The only startup call a page needs is
    `Domma.icons.scan()`, plus `Domma.setup({...})` if you want declarative component or theme
    configuration.

*   **Pillbox was handed a `<select>` and a `<div>`** on the pillbox and themes showcases. It
    transforms an `<input>`; both logged a console error and rendered nothing.

*   **The timeline showcase called its own deprecated alias six times**, on a page headed
    "Component Deprecated". Its demos now use `progression({mode: 'timeline'})`, and the code
    samples and API table moved with them so nothing on the page disagrees with what runs. The
    deprecation notice stays - documenting that `timeline()` still works is the page's job.

*   **Sidebar push mode** targeted its default `.main-content`, which the sidebar showcase does
    not have, warning four times. Each demo's content element now has its own id and each
    sidebar points at it - which demonstrates `contentSelector` properly into the bargain.

*   **`theme: 'light'` is not a theme name.** The theme-roller showcase passed it to both
    `theme.init()` and `themeRoller`'s `baseTheme`, warning twice and silently falling back.
    Themes are `family-variant`; it now uses `charcoal-light`.

🔧 **Internal**

*   **`src/showcase-pages.test.js`** loads every page under `public/showcase/` into a fresh jsdom
    window against the built bundle, runs its scripts in document order, and asserts the page
    rendered and logged nothing.

    | Command | Behaviour |
    |---|---|
    | `npm test` | included, adds roughly 20 seconds |
    | `npm run validate:showcase` | ratchet against the baseline |
    | `npm run validate:showcase:strict` | every finding, baseline ignored |
    | `npm run validate:showcase:baseline` | accept the current state |

    External *classic* scripts are rewritten inline in place, which preserves the browser's
    execution order - bundle first, page code after. `type="module"` scripts are not executed,
    because jsdom cannot; every skip is recorded rather than hidden, and a page consisting only
    of module script is caught by the "rendered something" assertion rather than passing
    vacuously.

    **The baseline is empty.** All 85 pages pass in strict mode, so any finding is a failure.

*   It was built as the prerequisite for the showcase conventions sweep - 191 Domma-convention
    violations across 54 pages. Rewriting that many call sites without a harness is precisely
    how a green suite and a broken site coexist.

*   542 tests, up from 536.

### v0.35.0 - A List's Rows Can Act on the List (2026-08-05)

**One new Domma API: `M.computed().value`.** Everything else arrives through the pinned
`domma-reactive` dependency, which Rollup still inlines - `domma.min.js` remains a single
self-contained file and consumers install nothing extra.

✨ **New**

*   **`M.computed()` is readable as `.value`**, the same read as `get()`.

    ```javascript
    const total = M.computed(() => order.get('price') * order.get('qty'));

    total.value;   // 30 - identical to total.get()
    ```

    `M.observable()` has always been read through `.value`; `M.computed()` was a facade with only
    `get()`, so the two halves of the same idea disagreed about how you read them. It also made a
    computed unreadable from a template expression, where a method cannot be called - `{{total.get()}}`
    does not parse and never will, because a call inside a render is a side effect.

*   **`M.observableArray().remove()` takes a value or a test.**

    ```javascript
    rows.remove(row);              // that exact object, as before
    rows.remove(r => r.id > 2);    // everything the test accepts
    ```

    A function used to be compared against each item by identity, never matched, and removed nothing
    without a word - the failure mode you cannot see. The test is called with `(item, index)`. The one
    case this gives up is an array of bare functions removing one of its own members by passing it;
    `peek()` plus `splice()` still covers that.

🐛 **Bug Fixes** (`domma-reactive` 0.4.0)

*   **`&&` no longer breaks a binding inside a keyed block.** A keyed block's body is captured by
    serialising DOM back to HTML, which escapes every `&` it writes - so
    `data-bind-class="done && 'struck'"`, the documented idiom, came back out as `&amp;&amp;` and
    failed to parse. Attribute values are now entity-decoded where they are read as expressions, in a
    single pass so `&amp;lt;` cannot double-decode. Ordinary attributes are untouched, because there
    the entities are markup.

*   **`data-on-*` may call a method on your data.** Inside a list `$data` is the item, and a bare name
    resolves against `$data` only, so `$parent.remove($data)` was the sole way for a row to reach the
    list that owns it - and it did not parse.

    The restriction is not lifted, it is **scoped**: only the event binding may do this, and the
    evaluator still refuses to perform a method call, so `{{ }}`, `data-if` and `data-bind-*` remain
    reads with no side effects. `this` follows JavaScript - a call keeps its receiver, a reference
    does not. The method name is read through the same guard as any other property, so
    `$data.constructor()` is refused exactly as `{{ $data.constructor }}` is.

    **Note for component authors:** a component's `methods` are attached to the component context, not
    to the data returned by `data()`, so a component template has nothing for `$parent.method()` to
    resolve to. Reaching them from a template is part of the Tier 4 binding work and is not in this
    release.

🔧 **Internal**

*   `domma-reactive` moves from 0.3.0 to **0.4.0** - keyed list reconciliation, instance lifecycle and
    `applyBindings()`, plus the four fixes above. 676 tests, every new guarantee mutation-tested. Its
    README is rewritten around a complete worked application, with every runnable example executed
    against the built bundle.

*   Domma's own suite grows to **448 passing**, pinning `.value` as both a real read and a real
    dependency.

### v0.34.0 - CSP-Safe Expressions & a Binding Registry (2026-08-05)

**No Domma API changes.** Everything below arrives through the pinned `domma-reactive` dependency,
which Rollup still inlines - `domma.min.js` remains a single self-contained file and consumers install
nothing extra.

✨ **New in the reactive core** (`domma-reactive` 0.3.0)

*   **A CSP-safe expression evaluator.** Tokeniser → Pratt parser → AST → tree-walking evaluator, with
    a helper registry. It supports property paths, indexing, comparison, logical operators, ternaries,
    arithmetic, string concatenation, literals, and calls to registered helpers only.

    **There is no `eval` and no `Function` constructor anywhere in the source or in any built bundle.**
    That matters: Knockout evaluates bindings with the `Function` constructor, which fails outright
    under `script-src 'self'` without `unsafe-eval`. Domma's expressions work under a strict CSP.

    Refused by design: arbitrary and member calls (`x.foo()`), assignment, `new`, and property access
    through `__proto__`, `constructor` or `prototype` - in every form, including a computed key whose
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

    The four existing mustache kinds - text, attribute, block and raw - are now registered through the
    same public `registerBinding()` the extension API uses, so a custom binding is not a second-class
    citizen.

    There is deliberately **no `data-bind-html`**: assigning `innerHTML` from data is an XSS hole, and
    `{{{triple-stache}}}` already provides a visible, greppable opt-out.

*   **The package now stands alone for templates.** `compile()` previously threw
    `renderFn is not a function` unless you supplied a template engine. It now defaults to a renderer
    built on the evaluator, so `npm install domma-reactive` gives you working `{{ }}` out of the box.
    Domma continues to pass its own renderer and behaves identically.

🐛 **Bug Fixes**

*   **Seven rules painted with variables that are defined nowhere** - `--dm-bg-secondary`, `--dm-bg`,
    `--dm-purple-50` and `--dm-purple-900`. An undefined variable makes the whole declaration invalid,
    so those backgrounds were simply absent. Repointed at `--dm-surface-secondary`,
    `--dm-background` and `--dm-info-bg`.

🔧 **Internal**

*   **Two repository validators**, wired as `npm run validate`:

    | Command | Catches |
    |---|---|
    | `validate:classes` | CSS classes used in HTML that resolve to no rule |
    | `validate:theme` | Rules painting a fixed background while inheriting a themed text colour |

    Both exist because their failure modes are **invisible** - no error, no failing test, just markup
    that renders wrong. `.form-control`, `.col-md-*` and `.table-responsive` all shipped while defined
    nowhere; eighteen rules set a background from a variable no theme redefines, which is why the
    showcase method chips were illegible in dark mode.

    Both are ratchets against a recorded baseline, so they fail on new violations rather than on the
    known backlog. `--update-baseline` accepts the current state; `--strict` reports everything.

---

### v0.33.1 - Millisecond Waits (2026-08-05)

🐛 **Bug Fixes**

*   **A `'300ms'` wait ran for five minutes.** `parseWait()` in the scribe effect tested
    `endsWith('s')` before `endsWith('ms')` - and because `'ms'` also ends with `'s'`, the millisecond
    branch was unreachable. Every millisecond-suffixed wait was multiplied by 1000, so a sequence like

    ```javascript
    Domma.effects.scribe('.headline', {
        actions: [{render: 'Hello'}, {wait: '300ms'}, {render: ' world'}]
    });
    ```

    appeared to stop after the first render. Seconds (`'2s'`) and raw numbers were unaffected, which is
    why it went unnoticed - the workaround was to pass milliseconds as a number.

    This was reported in the v0.25.2 notes as "fix queued for a future patch release" and has been
    present ever since.

🔧 **Internal**

*   `parseWait` was closure-local inside `scribe()` and therefore impossible to test. It is now a
    module-scope export, matching how `resolvePalette` is already handled in that file, and is pinned
    by tests that fail if the branch ordering is restored. It is not exposed on `Domma.effects` - the
    public surface is unchanged.

*   A non-finite number now returns `0` rather than letting `NaN` reach a timer.

---

### v0.33.0 - Working Scaffolds & a Real Reactivity Showcase (2026-08-05)

🐛 **Bug Fixes**

*   **Every scaffolded project rendered unstyled.** The kickstart templates were written in Bootstrap
    class names while Domma ships Tailwind-style utilities, so **143 class usages across 14 files
    resolved to nothing**. `d-flex`, `justify-content-center`, `align-items-center`, `flex-column`,
    `me-*`/`ms-*`, `lead`, `display-*`, `h3`-`h6`, `btn-outline-primary`, `form-control`, `col-lg-*`
    and Tailwind's `lg:grid-cols-*` are all mapped to their Domma equivalents. Anyone who ran
    `npx domma init` got a project that looked broken on first load.

*   **Two scaffolded components were dead, not merely unstyled.** The contact FAQ and docs pages used
    Bootstrap's `data-bs-toggle="collapse"` markup - and Bootstrap JS is never loaded - while
    `contact.js` and `docs.js` already called `Domma.elements.accordion()` and `.tabs()` against markup
    they could not recognise. Both work now.

✨ **New**

*   **`.list-none` and `.no-underline`** - standard utilities in the vocabulary Domma has adopted, and
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
    named after a mechanism and opening by explaining that mechanism - with no statement of the
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
    machinery without gaining a template engine - which is the seam the expression evaluator plugs into
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
    Domma's semantics, pass it wrapped: `{equals: (a, b) => _.isEqual(a, b)}` - passing `_.isEqual`
    bare loses its receiver and throws.

🐛 **Bug Fixes**

*   **`onUpdated()` never fired for components whose templates contain no `{{ }}` bindings.** Such a
    component rendered once and then stopped updating: the model changed and persisted correctly, but
    the DOM was never told, and nothing was thrown. This affected the todo, notes, contacts and markdown
    examples, which render their lists imperatively from `onUpdated`. Introduced by the fine-grained
    binding work in v0.30.0 and present in v0.30.0 and v0.30.1.

    The cause was that `_wireBindings()` creates one effect per compiled binding and `onUpdated` only
    fired from within those effects, so zero bindings meant zero effects. Components now also carry a
    watcher effect that tracks the whole model. **Writes made from `onUpdated` must converge** - set a
    value that will compare equal on the next pass. A value that differs every time (`Date.now()`, a
    counter) re-triggers the watcher indefinitely, and because it is a microtask chain it locks the page
    rather than throwing.

*   **Outline buttons could render unreadably.** `.btn-outline` used `background-color: transparent`
    with a `color-mix()` blend leaning 55% toward `--dm-text`, so its contrast depended on whatever sat
    behind it and the label could land on top of its own background. It now uses explicit
    `var(--dm-surface)` and `var(--dm-text)`, both of which every theme redefines. `.btn` also gained a
    base `color`, so a variant whose own colour declaration fails to resolve inherits something readable.

*   **Eighteen showcase rules set a background that never changed with the theme.** Chips such as
    `.models-method-item`, `.tables-method-item` and `.utils-method-item` used `var(--dm-gray-100)` -
    a variable no theme overrides - with no `color` at all, so their labels became unreadable under the
    dark variant. All now use themed variables with an explicit colour.

*   **`.table-responsive` was used in 14 places and defined nowhere**, so wide tables overflowed instead
    of scrolling. Added to `elements.css`.

*   **Reactivity showcase** used `.form-control`, which is not a Domma class - the correct classes are
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
it did in v0.30.1 - `M.create()`, `get`/`set`, validation, persistence, `onChange`, `onFieldChange`,
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
    change-detection semantics are byte-identical to v0.30.1 - including its existing treatment of
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

    This is **not** new in v0.31.0 - it was introduced by the fine-grained binding work in v0.30.0 and
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

*   **Modals, cards and badges rendered invisible after v0.30.0.** The element-identity fix in v0.30.0 copied the author element's full class list onto the Web Component that replaces it - including the legacy base class (`.modal`, `.card`, `.badge`). Those `elements.css` rules describe the hand-written, JS-free version of each component and are driven by class toggles the Web Component never performs: `.modal` sets `opacity: 0; pointer-events: none`, undone only by `.modal.active`, while `<domma-modal>` shows itself via `:host([visible])`. Because outer-document CSS overrides `:host` styling, an opened modal was fully invisible and unclickable - while `isOpen()` cheerfully reported `true`. The base class is no longer copied; `id`, `data-*` attributes and author classes still transfer as intended. **If you are on v0.30.0, upgrade.**

*   **Card option callbacks received a useless value.** `onCollapse`, `onExpand` and `onClick` were handed `e.detail`, which is never what the caller wants: the component emits through the base class's `_emit()` with a default detail of `{}`, so callbacks received an empty object - and for native events such as `click`, `detail` is the click *count*, so they received the number `1`. The intended `|| webComponent` fallback never fired, because `{}` and `1` are both truthy. Callbacks now receive the card instance, so `onCollapse: (card) => card.expand()` behaves as documented.

🧪 **Testing**

*   **The suite now loads DOMPurify.** Domma's sanitiser escapes the *entire* string when DOMPurify is absent, so `.html()` and every other sanitised write silently degraded under test - meaning the suite asserted the fallback rather than what Domma actually ships (every documented Domma page loads DOMPurify). Added as a `devDependency`; it does not enter the published bundle.
*   **New `wrapper-identity.test.js` asserts computed style, not just API state.** The v0.30.0 regression slipped through precisely because the existing check asserted `isOpen()`. These tests load the built `elements.css` and assert the component is genuinely visible. Verified to fail against the buggy build.
*   Card tests now assert the Web Component contract (host attributes, shadow-root chrome) rather than the pre-migration light-DOM classes, and HTTP error tests cover the two previously-untested fallback branches. Full suite: 435 passing, 0 failing.

---

### v0.30.0 - Dependency Tracking (2026-08-04)

✨ **Enhancements**

*   **Reactive dependency tracking (`M.computed`, `M.effect`).** Derivations now discover which fields they actually read, so a write re-runs exactly the work that depends on it. `M.computed(fn)` is lazily evaluated and cached until a tracked dependency changes; `M.effect(fn)` runs immediately to collect its dependencies then again whenever any of them move, returning a stop function. Dependencies are re-collected on every run, so a derivation stops listening to the branch it no longer takes. Also adds `M.untracked(fn)` for reads that should not subscribe, `M.flush()` to settle pending work synchronously, and `model.tracked()` - a read-tracked, write-through view of a model whose writes still validate, notify and persist. Updates are batched: a burst of `set()` calls in one tick produces a single re-run on the next microtask. See [Reactivity.md](./Reactivity.md).

*   **Components re-render surgically instead of wholesale.** Component templates now compile to fine-grained bindings - text, attribute, block (`{{#if}}`/`{{#each}}`/`{{#with}}`) and raw (`{{{...}}}`) - each with its own dependencies and its own reactive effect. Flipping a `{{#if}}` re-renders only that block, so focus, scroll position and uncommitted user input elsewhere in the component survive a structural change. Computed properties are memoised, so one shared by several readers is evaluated once per flush rather than once per reader, and the previous strategy of re-evaluating *every* computed and deep-comparing all of them on *every* change is gone. Bindings inside `{{#each}}`/`{{#with}}` are deliberately refreshed by their enclosing block rather than bound independently, because those bodies evaluate against a different data object.

*   **`$.getComponent(selector)`.** `$.setup()` kept component instances in a private map with no public accessor, so page code had no supported way to call a configured component's methods. `$.getComponent('#my-modal').open()` now works; calling it with no argument returns a Map of every configured instance.

*   **`model.onChange(field, callback)`.** The field-scoped overload is now real (see Bug Fixes).

🐛 **Bug Fixes**

*   **Model → component sync was silently dead in Autocomplete, Pillbox and Editor.** `Model.onChange` passes a **single object** - `{field, newValue, oldValue, model}` - but four call sites destructured it positionally as `(field, newVal)`, so the guard compared an object against a string and never matched. Changing the model simply did not update the component. All four now use `onFieldChange`, which is the API designed for this and removes the field-name comparison entirely. Pillbox additionally now only binds once its structure exists - `_init()` bails on a non-input element, and a subscription firing into a half-built Pillbox threw.

*   **`model.onChange('field', callback)` threw on the next `set()`.** The two-argument form is documented and used by the contacts example, but was never implemented: it added the *string* to the callback set and discarded the function, so the callback never fired and the next change threw `cb is not a function`. It is now a genuine overload, and passing a non-callable subscriber throws immediately instead of failing later at notify time.

*   **Badge, Card and Modal lost their element identity on initialisation.** These wrappers replace the author's element with a custom element via `replaceWith()`, but did not carry over its `id`, classes or `data-*` attributes. `#my-modal` therefore stopped existing the moment it was initialised, breaking every subsequent selector lookup - including the config engine's own event bindings and `$.update()` / `$.reset()`. Attributes are now preserved, without clobbering anything the options already configured.

*   **Config showcase did not honour the active theme.** `showcase/config/all-components.html` styled its demo panels with fixed palette values (`--dm-gray-100`, `--dm-gray-800`, `background: white`) which do not change between light and dark variants, leaving the panels light on dark themes. Now uses `--dm-surface-raised`, `--dm-surface-overlay`, `--dm-text` and `--dm-border`.

*   **Web Component test coverage was impossible.** `tests/setup-vitest.js` constructed its own JSDOM instance alongside the one Vitest already provides, leaving two `customElements` registries and two `HTMLElement` constructors - so custom elements could never upgrade under test. Fixing this repaired 7 pre-existing Modal, Card and backToTop failures; the element-identity fix above cleared a further 8.

📚 **Documentation**

*   New [Reactivity guide](./Reactivity.md), a Reactivity section in [API.md](./API.md) and [DommaDocumentation.md](./DommaDocumentation.md), a walkthrough in the SPA QuickStart, and an interactive [Reactivity showcase](../public/showcase/models/reactivity.html).
*   The config showcase guide previously taught `$('#sel').data('component')`, which never worked - it now documents `$.getComponent()`.

⚠️ **Upgrade Notes**

*   No API removals or signature changes. `onChange`, `onFieldChange`, `M.bind()`, validation and persistence all behave exactly as before - only tracked computations are batched onto the microtask.
*   **Badge, Card and Modal now keep their `id` and classes after initialisation.** This is the intended behaviour, but if any CSS or script relied on those attributes disappearing, it will now match where it previously did not.
*   Computeds and effects must be **synchronous** - dependency collection stops at the first `await` - and must **return new values rather than mutating existing ones**, since propagation is gated on deep equality.

---

### v0.29.2 - Tooltip Double-Wrap Fix (2026-06-30)

🐛 **Bug Fixes**

*   **Tooltips no longer disappear when two layers wire the same element.** `createTooltipWrapper` (the `E.tooltip` / `Domma.elements.tooltip` factory) physically wraps each target in a `<domma-tooltip>` element, but was **not idempotent** - calling it twice on the same element nested a second `<domma-tooltip>`, which breaks the tooltip. This regressed admin action-button tooltips after 0.29.1: `Table.render()` now re-wires tooltips on every re-render (so they survive pagination), but the admin views ALSO wire the same buttons after `T.create`, so every button got double-wrapped and showed nothing. `createTooltipWrapper` is now idempotent - it refreshes an existing wrapper instead of nesting a new one - and it **falls back to the element's `data-tooltip` / `title` for content** when no explicit `content` is given (the `<domma-tooltip>` component reads only its `content` attribute, so framework/`forms.js` tooltips wired by `data-tooltip` alone were rendering empty). Verified before/after: a double-wired action button drops from 2 nested `<domma-tooltip>` wrappers to 1, with correct content.

---

### v0.29.1 - Table Re-render Icon & Tooltip Fix (2026-06-30)

🐛 **Bug Fixes**

*   **`Table` icons & tooltips now survive re-renders:** `TableInstance.render()` rebuilds the entire table subtree (`innerHTML`) on every state change - search, sort, pagination, page-size, filter and column toggle all route through it. Consumer cell markup produced by `col.render()` (`data-icon` spans and `data-tooltip` triggers) was only processed after the *initial* render, so action-button icons and tooltip popovers vanished the moment a user paginated, searched or sorted. `render()` now re-scans icons and re-wires tooltips on the rebuilt subtree via a new `_reinitRenderedContent()` step (mirrors `Form._initTooltips`), so table content stays live across every re-render. The icon half completes the long-dormant `_restoreIconsBeforeRebuild()` path, which converted rendered SVGs back to `data-icon` spans but never re-scanned them.

---

### v0.19.7 - Card Accent Variant (2026-03-17)

✨ **Enhancements**

*   **`.card-accent` CSS Classes:** The left-border accent pattern is now a set of five first-class card variant classes instead of an inline style workaround:
    *   `.card-accent` - primary colour left border (`--dm-primary`)
    *   `.card-accent-success` - success green (`--dm-success`)
    *   `.card-accent-danger` - danger red (`--dm-danger`)
    *   `.card-accent-warning` - warning amber (`--dm-warning`)
    *   `.card-accent-info` - info sky (`--dm-info`)
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

*   **Unicorn Light** (`unicorn-light`) - Amethyst purple primary (`#9b59b6`), hot pink secondary (`#e91e90`), white surfaces with faint lavender tint, dark aubergine text (`#2d1b3d`), light purple borders (`#e1bee7`).
*   **Unicorn Dark** (`unicorn-dark`) - Deep purple-black backgrounds (`#1a0e24` / `#241432`), lighter purple primary (`#ce93d8`) and lighter pink secondary (`#f48fb1`) for dark-mode contrast, muted purple borders (`#4a2660`).
*   **Dreamy Light** (`dreamy-light`) - Warm brown primary (`#8d6e63`), dusty rose-brown secondary (`#a1887f`), warm cream surfaces (`#fffdf9` / `#f5f0eb`), dark chocolate text (`#3e2723`), light biscuit borders (`#d7ccc8`).
*   **Dreamy Dark** (`dreamy-dark`) - Dark espresso backgrounds (`#1c1410` / `#2a1f1a`), lighter taupe primary (`#bcaaa4`) for contrast, warm off-white text (`#efebe9`), dark brown borders (`#4e342e`).

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