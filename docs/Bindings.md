# DOM Bindings

Declarative bindings connect markup to data. Write what a piece of the page *means* and Domma keeps it correct, so
there is no render function to remember to call and no place for the DOM and the data to drift apart.

There are two ways in, depending on **who owns the markup**:

| | Owns the markup | Entry point |
|---|---|---|
| **A component** | The component does - it has a template | `Domma.component({template})` |
| **A page** | The page does - the HTML already exists | `M.applyBindings(data, root)` |

They share every binding, every expression and the same list reconciler. A custom binding written for one works in the
other.

The engine is the [`domma-reactive`](https://www.npmjs.com/package/domma-reactive) package, published standalone and
bundled into Domma. Nothing here uses `eval` or the `Function` constructor, so bindings work under a
`script-src 'self'` Content Security Policy.

**See also:** [Reactivity](./Reactivity.md) for the tracking layer beneath this · [Components](./Components.md) for the
component lifecycle.

---

## Quick start

```html
<div id="app">
    <h1 data-bind-text="title">Rendered by the server</h1>

    <input data-model="query" placeholder="Search…">
    <p data-if="query">Searching for <span data-bind-text="query"></span></p>

    <ul data-each="rows key=id">
        <li data-bind-text="name">template row</li>
    </ul>

    <button data-on-click="clear">Clear</button>
</div>
```

```javascript
const model = M.create({
    title: {type: M.types.string},
    query: {type: M.types.string},
    rows:  {type: M.types.array}
}, {
    title: 'Live',
    query: '',
    rows: [{id: 1, name: 'Ada'}, {id: 2, name: 'Grace'}]
});

const handle = M.applyBindings(model, '#app', {
    methods: {
        clear() { model.set('query', ''); }
    }
});
```

Typing in the input writes to the model - with validation, change notification and persistence - and every other
binding on that field updates. Nothing re-renders that did not have to.

---

## The binding attributes

| Attribute | Does | Example |
|---|---|---|
| `data-bind-text` | Sets `textContent` | `data-bind-text="user.name"` |
| `data-bind-class` | Adds/removes only the classes this binding owns | `data-bind-class="isActive && 'on'"` |
| `data-bind-style-<prop>` | Sets one CSS property | `data-bind-style-color="shade"` |
| `data-bind-style` | Sets every property of an object | `data-bind-style="look"` |
| `data-bind-<prop>` | Sets a property, or an attribute if there is no such property | `data-bind-disabled="isBusy"` |
| `data-model` | Two-way: control ↔ data | `data-model="query"` |
| `data-on-<event>` | Adds a listener | `data-on-click="save"` |
| `data-if` | The element is in the document, or it is not | `data-if="showHelp"` |
| `data-each` | A keyed list; the element's contents are the item template | `data-each="rows key=id"` |
| `data-options` | Fills a `<select>` from a collection | `data-options="cities"` |
| `data-focus` | Two-way: value ↔ focus | `data-focus="editing"` |

Plus any kind added with [`M.registerBinding()`](#mregisterbindingname-handler).

### `data-bind-<name>`

The name after the prefix decides what is written:

- `text` → `textContent`
- `class` → the class tokens this binding evaluated to, swapped for whatever it applied last time. Other classes on the
  element are left alone, so a binding and a stylesheet cannot fight.
- `value`, `checked`, `selected`, `disabled`, `readonly`, `required`, `multiple`, `indeterminate`, `open`, `hidden` →
  the **property**, not the attribute, because for these two the attribute is the initial value and the property is the
  current one.
- anything else → `setAttribute()`. A value of `null`, `undefined` or `false` removes the attribute instead; `true`
  writes it empty, which is what a boolean attribute means in HTML.

`data-bind-html` is **refused**, with a warning. Assigning `innerHTML` from data is an XSS hole. Use `{{{triple-stache}}}`
in a component template, which says what it is doing where an author can see it.

A falsy `data-bind-class` contributes no classes at all. That matters because the documented idiom is
`data-bind-class="isActive && 'on'"`, which evaluates to `false` rather than `''` when it is off - and stringifying that
would add the literal class `false` to the element.

#### Style

```html
<p data-bind-style-color="shade"></p>            <!-- one property        -->
<p data-bind-style-font-weight="weight"></p>     <!-- kebab-cased          -->
<p data-bind-style---brand="accent"></p>         <!-- custom property      -->
<p data-bind-style="look"></p>                   <!-- {color, fontWeight}  -->
```

Two spellings because a binding expression has no object literal - it cannot have one without becoming the
`eval` that Domma's Content Security Policy story depends on avoiding. The single-property form is the common
case anyway; the object form takes a map the model already holds.

Property names are **kebab-cased in the attribute**, because an HTML attribute name is lowercased by the parser
and `data-bind-style-fontWeight` would arrive as `fontweight`. In an object they may be camelCase and are
converted. A falsy value removes the property, so `data-bind-style-color="isError && 'red'"` works the way the
class idiom does - but `0` is kept, since `opacity: 0` is a real value. Ownership follows the same rule as
`class`: only the properties this binding set last time are removed, so a static `style=` attribute survives.

No unit is ever added: `data-bind-style-width="w"` with `w = 40` writes `width: 40`, which the browser ignores.
Write `'40px'`.

### `data-model`

Two-way. The control shows the value; a change writes it back.

| Control | Property read/written | Listens to |
|---|---|---|
| text, textarea, and friends | `value` | `input` |
| checkbox | `checked` (boolean) | `change` |
| radio | `checked`, against its own `value` | `change` |
| select | `value` | `change` |

The write target is a **path**. `data-model="user.name"` evaluates `user`, then assigns `name` on it. Anything that is
not a path - a comparison, a helper call, `$data`/`$root`/`$parent`/`$index` - logs one warning and writes nothing,
because a binding you cannot write through is not two-way. `__proto__`, `constructor` and `prototype` are refused as
keys in every form, including `a[k]` where `k` holds one of them at runtime.

### Writing to a nested path does not notify the model

`data-model="profile.city"` reads correctly and the write lands - but if `profile` is a **Model field
holding an object**, the write mutates that object in place, so the field's observable never fires:

```javascript
const model = M.create({profile: {}}, {profile: {city: 'London', zip: 'E1'}});
M.applyBindings(model, '#app');            // <input data-model="profile.city">

// after typing "Leeds":
model.get('profile');   // {city: 'Leeds', zip: 'E1'}  - the write landed
// …but onChange did not fire, and any other binding on profile.city still shows "London"
```

The engine evaluates `profile`, gets the raw object back, and assigns `city` on it. Nothing tells the
model its field changed, and Domma's change detection is gated on `utils.isEqual` against the *same*
object, so even a subsequent `set()` of it reads as unchanged.

**Bind a top-level field**, and keep nested state as its own field where you can. Where you cannot,
`M.bind()` with `parse` is the working idiom: it clones the field, sets the path, and returns the whole
object, so the model sees a genuinely new value.

```javascript
M.bind(model, 'profile', '#city', {
    format: (data) => _.get(data, 'city', ''),
    parse:  (value) => { const next = _.cloneDeep(model.get('profile')); _.set(next, 'city', value); return next; }
});
```

There is **no observable-unwrapping magic**:

```javascript
// A Model, or a model's tracked view - plain names
M.applyBindings(model, '#app');          // data-model="query"

// A standalone observable - the same .value you read it through in JavaScript
M.applyBindings({count: M.observable(0)}, '#app');   // data-model="count.value"
```

The two never disagree about what a name means. Passing a Model is the ergonomic route, and the one to reach for first.

### `data-on-<event>`

The value names a handler, or calls one:

```html
<button data-on-click="save">Save</button>
<button data-on-click="$parent.remove($data)">Delete</button>
```

The handler receives the DOM event as its last argument. Returning `false` calls `preventDefault()`.

Handlers are looked up on the data. A Model holds data rather than behaviour, so with `M.applyBindings` they are passed
separately:

```javascript
M.applyBindings(model, '#app', {
    methods: {
        save(event) { H.post('/api/save', model.toJSON()); }
    }
});
```

In a component they are the `methods` block, and are already in scope.

**A data field of the same name wins over a method**, in both entry points. A template mostly renders data, and a method
quietly shadowing a rendered value is the worse failure.

### `data-if`

```html
<p data-if="showHelp">Help text.</p>
```

The one place where the two entry points differ in behaviour rather than input:

- **`M.applyBindings`** removes the element and puts **the same node** back, so it keeps its children, its listeners and
  its focus across a toggle.
- **A component template** re-renders the region instead. While an element is detached its bindings are invisible to
  re-indexing, so it would come back stale.

Prefer `{{#if}}` in a component template, and `data-if` on a page.

### `data-each`

```html
<ul data-each="rows key=id">
    <li>
        <span data-bind-text="name"></span>
        <button data-on-click="$parent.remove($data)">×</button>
    </li>
</ul>
```

The element's initial contents are the **item template**: they are lifted out of the document at activation, compiled,
and cloned per item. Mustache works inside a `data-each` - `{{name}}` - because there it is a template rather than
rendered output.

**`key=` is not optional here.** With it, deleting the second row leaves the first row's actual DOM node in place -
focus, uncommitted input, scroll position and animation state all survive. Without it, `M.applyBindings` refuses the
block and says so.

In a component template the same list is `{{#each rows key=id}}…{{/each}}`. There `key=` is optional; omitting it
re-renders the block wholesale and warns once.

### `data-options`

```html
<select data-options="cities" data-model="chosen"></select>

<select data-options="people"
        data-options-text="first + ' ' + last"
        data-options-value="id"
        data-options-caption="'Anyone'"
        data-model="assignee"></select>
```

| Attribute | Meaning |
|---|---|
| `data-options` | The collection |
| `data-options-text` | The label - an expression against the item; defaults to the item |
| `data-options-value` | The value - likewise |
| `data-options-caption` | A leading option with an empty value |

A `data-each` over `<option>` produces the same markup. What it does not produce is the **selection**:
rebuilding a select's options resets it, and the selection lives on the select rather than on any option, so a
keyed list has nothing to preserve it with. This binding rebuilds and puts the selection back.

The three companions are expressions evaluated in the item's own context, so `$index` and `$parent` resolve and
a label can be computed. Note the quotes inside the quotes on the caption - every binding value is an
expression, so a literal string has to look like one, or it is read as a variable name.

**Option values need not be strings.** An `<option>`'s `value` is always a string, so when the resolved value is
not one the real value is kept alongside it and `data-model` reads back the object or the number that went in.
With no `data-options-value` at all, the value **is** the item, matched by identity.

Order does not matter, and neither does timing: `<select data-model="chosen" data-options="cities">` works, and
so does a collection that arrives from an `H.get()` long afterwards. A value the model asked for while no option
carried it is remembered and applied by the rebuild that brings it.

### `data-focus`

```html
<input data-model="title" data-focus="editingTitle">
```

Two-way, between a value and focus. Setting `editingTitle` to `true` moves the caret into the field; the user
tabbing in sets it `true`; blurring sets it `false`. Both directions earn their place - the first is how a model
puts focus in the field it has just revealed without reaching for a DOM node, the second is how it knows where
the user is without a listener.

Unlike `data-model`, an expression it cannot write through is not fatal: `data-focus="isEditing && !isSaving"`
is a sensible way to drive focus from derived state, so the value → focus direction keeps working and only the
write-back warns.

### Virtual bindings

A binding attribute needs an element to sit on, and sometimes there is none to spare - a run of `<li>`s, three
`<td>`s in a row. Wrapping them in a `<div>` to carry the attribute changes the layout, and inside a table it is
not even valid HTML a browser will keep. Comments have no such problem.

```html
<ul>
    <li>Always shown</li>
    <!-- dm if: showExtras -->
        <li>Only when showExtras</li>
        <li>These two travel together</li>
    <!-- /dm -->
</ul>

<p>Signed in as <!-- dm text: user.name -->…<!-- /dm -->.</p>
```

| Form | Behaviour |
|---|---|
| `<!-- dm if: expr -->` | The run of nodes is in the document, or held aside - **the same nodes** come back, with their listeners and their focus |
| `<!-- dm each: expr key=id -->` | The run is the item template, lifted and compiled as `data-each` is; `key=` is required |
| `<!-- dm text: expr -->` | One text node between the anchors, replacing whatever was there as a placeholder |

Every closer is `<!-- /dm -->`, whatever it opened. They nest, and a block held out of the document keeps its
nodes together, so a nested block that changes while its parent is closed still lands correctly when the parent
reopens.

These are a `M.applyBindings` feature. A component template has `{{#if}}` and `{{#each}}`, which already delimit
a region without needing an element - and a virtual binding **inside** a `data-each` body is not read, because
that body is compiled as a template and the compiler knows mustache rather than comments. It warns if you try.

---

## Expressions

Every binding value is an expression, evaluated against the binding context.

**Supported:** property paths (`user.name`, `rows[0].id`), literals, `+ - * / %`, `=== !== == != < <= > >=`,
`&& || !`, ternaries, parentheses, and calls to registered helpers.

**Not supported:** assignment, `new`, arrow functions, array and object literals, and - with one exception -
calling a method on your data. `{{total.get()}}` will not parse. Arbitrary calls are how an expression language turns
into an execution surface, and the whole point of the parser is that there is no execution surface.

The exception is `data-on-*`, where `$parent.remove($data)` is how a row reaches the list that owns it. An event
binding's entire job is to call something.

### Context keys

| Key | Is |
|---|---|
| `$data` | The current data object. Inside a list, the **item** |
| `$root` | The data passed to `applyBindings` or the component |
| `$parent` | The enclosing context's `$data` |
| `$index` | The item's position in its list |
| `$length` | The list's length |

There is **no scope chain**. A bare name inside a list resolves against the item, not the item and then outward. Reach
outward explicitly with `$parent` or `$root` - a name that silently means different things at different depths is
harder to read than one that says where it came from.

### Helpers

Since an expression cannot call a method on your data, a registered helper is the supported way to shape a value in the
markup:

```javascript
M.registerHelper('upper', (s) => String(s).toUpperCase());
M.registerHelper('money', (n) => `£${Number(n).toFixed(2)}`);
```

```html
<p data-bind-text="upper(name)"></p>
<td data-bind-text="money(total)"></td>
```

Helpers are shared by every binding and every component template. Keep them pure and synchronous: they run during
render, possibly often.

---

## `M.applyBindings(data, root, options?)`

Activates every binding attribute under `root`.

| Parameter | |
|---|---|
| `data` | A Model, or a plain object. A Model is converted to its [tracked view](./Reactivity.md#modeltracked) so reads track and writes route through `set()` |
| `root` | A selector, an element, or a Domma collection |
| `options.methods` | Handlers for `data-on-*`, looked up only when the data has no such key |
| `options.render` | Template renderer for `data-each` item bodies. Defaults to `_.render`, so `{{ }}` behaves as it does everywhere else in Domma |

**Returns** `{bindings, context(), update(data), dispose()}`.

```javascript
const handle = M.applyBindings(model, '#app');

handle.bindings.length;   // how many bindings were activated
handle.dispose();         // drop them all
```

### `{{ }}` is not interpolated in markup that already exists

Deliberately. A `{{name}}` sitting in a text node is left exactly as it is, and if the scan finds one that looks like a
binding it says so once, naming the element.

There is nothing coherent to do with it. Either the server rendered the value - in which case the token is gone and
there is only text that happens to say "Ada" - or the server emitted the raw token, in which case the page was broken
until JavaScript ran, which is the one thing server rendering exists to avoid. Guessing which text nodes are dynamic is
not possible, and rewriting every text node into anchored spans would destructively mutate the markup this function
promises to leave alone.

`data-bind-text="name"` is the supported spelling. It is explicit, greppable, and the server can render the text and the
attribute together.

The one exception is the contents of a `data-each`, which are a template rather than rendered output.

### Applying twice is safe

Every activated element is recorded and marked with `data-dm-bound`. A second pass skips anything already bound and
warns once, naming the root. The marker is removed again on `dispose()`.

The record is authoritative and the attribute is only the visible marker - a cloned node carries the attribute but is
genuinely unbound, and treating the attribute as truth would leave every clone dead. It is there so that "why is this
not updating?" is answerable in devtools.

### Dispose on anything that outlives the markup

```javascript
const handle = M.applyBindings(model, '#panel');
// …later
handle.dispose();
```

`dispose()` drops every effect, listener, list instance and marker the call created, and puts a hidden `data-if`
element back where it came from, so the markup ends up as it started.

An effect is a live node in the dependency graph and does not go away because its nodes did. On a page that lives for
hours - a router view, a slideover, a modal - an undisposed handle is a leak.

### Reactivity comes from the data

Each binding gets its own effect, so a view model built from a Model or from observables updates itself. For a plain,
untracked object, nothing is watching: call `handle.update(data)` to re-run everything.

---

## `M.registerBinding(name, handler)`

Adds a binding kind. This is not a side door - all eight built-ins are registered through this same function, so
anything a built-in can do, a custom binding can do.

```javascript
M.registerBinding('uppercase', {
    attribute: 'data-uppercase',
    expression: true,     // parse the attribute value
    tracks: true,         // re-run when what it reads changes
    primes: true,         // run once after the first paint
    update({binding, nodes, context}) {
        const value = binding.evaluate(context);
        for (const el of nodes) el.textContent = String(value).toUpperCase();
        return true;
    }
});
```

```html
<p data-uppercase="name"></p>
```

### The handler contract

Only `update` is required.

**Discovery** - how markup asks for this binding:

| Field | |
|---|---|
| `attribute` | An exact attribute name, e.g. `data-model` |
| `attributePrefix` | A prefix, e.g. `data-on-`; the remainder becomes `binding.arg`, so `data-on-click` gives `arg: 'click'` |

**Compilation** - what is prepared before the first paint:

| Field | |
|---|---|
| `expression` | Parse the value. Sets `binding.ast` and `binding.evaluate`; a value that does not parse skips the binding |
| `tracks` | Contribute the expression's dependencies to `binding.deps` |
| `region` | Wrap the element in comment anchors, so the handler owns a region of DOM rather than an element |
| `capturesBody` | Fill `binding.body` with the annotated source of that region |
| `primes` | Run `update()` once immediately after the initial paint |

**Runtime:**

| Method | |
|---|---|
| `update({binding, nodes, context, render, replaceRegion, reindex, controller})` | Returns whether anything was written |
| `attach({binding, node, controller})` | Once per node, when it is indexed |
| `detach({binding, node, controller})` | On teardown |

`update` receives **all** the binding's nodes at once rather than being called per node, so a region handler re-indexes
exactly once however many regions it owns.

`primes` exists because a component's first paint runs the whole template through the renderer, so a `{{name}}` is
already correct before any binding updates - but a `data-bind-text` is not, since there is no mustache token to
substitute. Declaring `primes: true` is what makes an input with `data-model="query"` show the current query rather than
an empty box until the user types.

A handler declaring `region: true` is refused by `M.applyBindings`, with an explanation: a region handler re-renders
from a captured template body, and there the markup *is* the page.

`M.unregisterBinding(name)` removes it again.

---

## Which entry point?

**Use a component** when the markup is yours to generate: a reusable widget, a router view, anything with a lifecycle.
You get `{{ }}`, `{{#if}}` and `{{#each}}` as well as the attributes, plus `onMounted`/`onUpdated`/`onUnmounted`.

**Use `M.applyBindings`** when the markup already exists and is already correct: a server-rendered page, a form you want
to make live, a region of an existing document. No build step, and no second source of truth for the markup.

They compose. A page can `applyBindings` its shell and mount components inside it.

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| `{{name}}` renders literally | `applyBindings` never interpolates mustache - use `data-bind-text="name"` |
| Nothing updates after a write | The data is a plain object. Pass a Model, or use observables, or call `handle.update()` |
| `data-model` types but nothing else moves | The write is landing on a snapshot. Pass the Model itself, not `model.toJSON()` |
| "did not resolve to a function" | The handler is not on the data. Pass it in `options.methods` |
| A bare name is undefined inside a list | Inside a list a bare name is the item. Use `$parent` or `$root` |
| `data-each` refused | `key=` is required for `applyBindings`. Add `key=id` |
| Applying twice warns | The region is already bound. Dispose the first handle, or bind a narrower root |
| An input shows `[object Object]` | A raw observable bound by name. Use `.value`, or pass a Model |
| `data-model` on a nested path types fine but nothing else moves | The write mutates the object in place and the field's observable never fires - [see above](#writing-to-a-nested-path-does-not-notify-the-model) |

---

## See Also

- [Reactivity](./Reactivity.md) - the tracking layer these bindings are built on
- [Components](./Components.md) - templates, lifecycle and the `methods` block
- [Blueprints](./Blueprints.md) - defining the schema a Model validates against
- [API Reference](./API.md)
- Live examples: `public/showcase/models/bindings.html`
