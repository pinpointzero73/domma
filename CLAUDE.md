# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Domma?

**D**ynamic **O**bject **M**anipulation & **M**odeling **A**PI

A lightweight, zero-dependency JavaScript framework combining jQuery-style DOM manipulation, Lodash utilities, and
modern UI components.

## Commands

**Build:**
```bash
npm install
npm run build
```

Outputs minified + obfuscated bundles to `dist/`.

**Showcase:**

```bash
npm run showcase  # Comprehensive showcase with all features
```

**Tests:**
Open `tests/test.html` in a browser.

## Architecture

Domma has six core modules exposed through `src/index.js`:

### dom.js - jQuery-compatible DOM API

The main `Domma(selector)` / `$(selector)` function returns a `DommaCollection` with 90+ chainable methods:

- **Traversal** (22): `find()`, `children()`, `parent()`, `parents()`, `closest()`, `siblings()`, `next()`, `prev()`,
  `nextAll()`, `prevAll()`, `first()`, `last()`, `eq()`, `get()`, `filter()`, `not()`, `is()`, `has()`, `add()`,
  `contents()`, `toArray()`, `index()`
- **Content** (3): `html()`, `text()`, `val()`
- **Attributes** (6): `attr()`, `removeAttr()`, `prop()`, `removeProp()`, `data()`, `removeData()`
- **CSS/Classes** (5): `css()`, `addClass()`, `removeClass()`, `toggleClass()`, `hasClass()`
- **Manipulation** (16): `append()`, `prepend()`, `after()`, `before()`, `appendTo()`, `prependTo()`, `insertAfter()`,
  `insertBefore()`, `wrap()`, `wrapAll()`, `wrapInner()`, `unwrap()`, `remove()`, `detach()`, `empty()`, `clone()`,
  `replaceWith()`, `replaceAll()`
- **Events** (22+): `on()` (with delegation), `off()`, `one()`, `trigger()`, `hover()` + shortcuts
- **Effects** (12): `show()`, `hide()`, `toggle()`, `fadeIn()`, `fadeOut()`, `fadeToggle()`, `fadeTo()`, `slideUp()`,
  `slideDown()`, `slideToggle()`, `animate()`, `stop()`, `delay()`
- **Dimensions** (11): `width()`, `height()`, `innerWidth()`, `innerHeight()`, `outerWidth()`, `outerHeight()`,
  `offset()`, `position()`, `scrollTop()`, `scrollLeft()`, `offsetParent()`

### utils.js - 120+ Lodash-compatible utilities

Accessed via `Domma.utils` or `_`:

- **Array** (30+): `chunk()`, `compact()`, `difference()`, `flatten()`, `flattenDeep()`, `uniq()`, `uniqBy()`, `zip()`,
  `intersection()`, `union()`, etc.
- **Collection** (20+): `each()`, `filter()`, `find()`, `groupBy()`, `keyBy()`, `map()`, `orderBy()`, `sortBy()`,
  `reduce()`, `partition()`, etc.
- **Function** (18): `debounce()`, `throttle()`, `memoize()`, `once()`, `curry()`, `partial()`, `flow()`, etc.
- **Object** (30+): `get()`, `set()`, `has()`, `pick()`, `omit()`, `merge()`, `cloneDeep()`, `mapKeys()`, `mapValues()`,
  etc.
- **Lang** (18): `isArray()`, `isObject()`, `isPlainObject()`, `isFunction()`, `isEmpty()`, `isEqual()`, etc.
- **Math** (14): `sum()`, `mean()`, `max()`, `min()`, `clamp()`, `random()`, etc.
- **String** (24): `camelCase()`, `kebabCase()`, `snakeCase()`, `capitalize()`, `truncate()`, etc.
- **Template** (2): `template()` (compile), `render()` (one-shot) - Mustache-style with `{{var}}`, `{{#if}}`,
  `{{#each}}`,
  `{{#with}}`, `{{> partial}}`, `{{{raw}}}`

### dates.js - Moment.js-style date manipulation

Accessed via `Domma.dates` or `D()`:

- **Create**: `D()`, `D('2025-12-25')`, `D(timestamp)`
- **Manipulate**: `add()`, `subtract()`, `startOf()`, `endOf()`, `set()`
- **Format**: `format()`, `toISOString()`, `unix()`
- **Getters**: `year()`, `month()`, `date()`, `day()`, `hour()`, `minute()`, `second()`
- **Compare**: `isBefore()`, `isAfter()`, `isSame()`, `isBetween()`, `diff()`
- **Relative**: `fromNow()`, `from()`, `toNow()`, `to()`
- **Static**: `dates.now()`, `dates.parse()`, `dates.isValid()`, `dates.min()`, `dates.max()`

### models.js - Reactive models & pub/sub

Accessed via `Domma.models` or `M`:

- **Pub/Sub**: `subscribe()`/`on()`, `publish()`/`emit()`, `unsubscribe()`/`off()`, `once()`
- **Model Factory**: `create(schema, initialData)` returns a Model instance
- **Model Instance**: `get()`, `set()`, `toJSON()`, `validate()`, `onChange()`, `offChange()`, `reset()`
- **DOM Binding**: `M.bind(model, field, selector, options)`, `M.unbind()`
- **Types**: `M.types.string`, `M.types.number`, `M.types.boolean`, `M.types.array`, `M.types.object`, `M.types.date`,
  `M.types.any`

### elements.js - UI components

Accessed via `Domma.elements`:

- **Card**: `elements.card(selector, { hover, clickable, onClick })`
- **Modal**: `elements.modal(selector, { backdrop, backdropClose, keyboard, animation, onOpen, onClose, onClosed })` →
  `open()`, `close()`, `toggle()`, `isOpen()`
- **Tabs**: `elements.tabs(selector, { activeIndex, animation, onChange })` → `show()`, `getActive()`, `next()`,
  `prev()`
- **Accordion**: `elements.accordion(selector, { multiExpand, animation, activeIndex, onChange })` → `open()`,
  `close()`, `toggle()`, `openAll()`, `closeAll()`
- **Tooltip**: `elements.tooltip(selector, { content, position, trigger, delay, animation })` → `show()`, `hide()`,
  `toggle()`, `setContent()`
- **Carousel**:
  `elements.carousel(selector, { autoplay, interval, pauseOnHover, loop, animation, showArrows, showIndicators, onChange })` →
  `next()`, `prev()`, `goTo()`, `play()`, `pause()`, `getIndex()`, `getSlide()`
- **Jumbotron**: CSS-only component using classes: `.jumbotron`, `.jumbotron-primary`, `.jumbotron-dark`,
  `.jumbotron-center`, `.jumbotron-cover`, `.jumbotron-overlay`, `.jumbotron-sm`, `.jumbotron-lg`

### tables.js - DataTable-like functionality

Accessed via `Domma.tables`:

- **Create**: `tables.create(selector, { data, columns, pagination, pageSize, selectable, selectionMode })`
- **Data**: `setData()`, `getData()`, `addRow()`, `addRows()`, `updateRow()`, `removeRow()`, `removeRows()`, `clear()`,
  `refresh()`
- **Sort**: `sort()`, `sortMultiple()`, `clearSort()`, `getSortState()`
- **Filter**: `search()`, `filter()`, `filterBy()`, `clearFilters()`, `getFilters()`
- **Pagination**: `page()`, `pageSize()`, `nextPage()`, `prevPage()`, `firstPage()`, `lastPage()`, `pageInfo()`
- **Selection**: `select()`, `deselect()`, `selectAll()`, `deselectAll()`, `toggleSelect()`, `getSelected()`,
  `getSelectedIndices()`
- **Export**: `toCSV()`, `toJSON()`, `download()`
- **Events**: `on()`, `off()`, `once()`

### config.js - Declarative configuration engine

`Domma.setup(config)` / `$.setup(config)` processes config objects:

```javascript
$.setup({
    '#selector': {
        component: 'modal',           // Auto-init Elements component
        options: { backdrop: true },
        initial: { css: {...}, text: '...' },
        events: {
            click: (e, $el) => { }    // Inline callbacks supported
        }
    }
});
```

**Mutable Configuration** - update, retrieve, or reset configuration after setup:

```javascript
// Update configuration (deep merges changes)
$.update('#selector', {
    options: { backdrop: false },
    events: { mouseenter: handler }
});

// Retrieve configuration
$.config('#selector');  // Returns config for selector
$.config();             // Returns all stored configs

// Reset/destroy (removes component, unbinds events, clears config)
$.reset('#selector');   // Reset specific selector
$.reset();              // Reset all configurations
```

### http.js - Fetch-based HTTP client

`Domma.http.get()`, `.post()`, `.put()`, `.delete()` - all return promises resolving to JSON.

## Aliases

| Full Path       | Alias | Global     | Description                |
|-----------------|-------|------------|----------------------------|
| `Domma()`       | `$`   | `window.$` | DOM selection/manipulation |
| `Domma.utils`   | `_`   | `window._` | Utility functions          |
| `Domma.models`  | `M`   | `window.M` | Reactive models & pub/sub  |
| `Domma.dates()` | `D()` | `window.D` | Date manipulation          |

## File Structure

```
src/
├── index.js      # Main entry, exports Domma + aliases
├── dom.js        # jQuery-compatible DOM API
├── utils.js      # Lodash-compatible utilities
├── dates.js      # Moment-style date manipulation
├── models.js     # Reactive models & pub/sub
├── elements.js   # UI components
├── tables.js     # DataTable functionality
├── config.js     # JSON configuration engine
└── http.js       # HTTP client

showcase/         # Comprehensive demos for each namespace
quickstart/       # Getting started blueprint
dist/             # Built bundles (UMD + ESM)
```

## Bundle

~160KB minified, includes all namespaces, zero external dependencies.

- When updating features or adding new ones, the documentation and showcase should be updated in-line
- Where and whenever possible use Domma in the showcase, documentation and tutorials