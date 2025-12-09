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

Domma has core modules exposed through `src/index.js`:

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
- **Function** (20): `debounce()`, `throttle()`, `memoize()`, `once()`, `curry()`, `partial()`, `flow()`, `compose()`,
  `chain()`, etc.
- **Object** (30+): `get()`, `set()`, `has()`, `pick()`, `omit()`, `merge()`, `cloneDeep()`, `mapKeys()`, `mapValues()`,
  etc.
- **Lang** (18): `isArray()`, `isObject()`, `isPlainObject()`, `isFunction()`, `isEmpty()`, `isEqual()`, etc.
- **Type Conversion** (10): `parseInt()`, `toNumber()`, `toInteger()`, `toFinite()`, `toSafeInteger()`, `toString()`,
  `toArray()`, `castArray()`, `toLength()`, `toPlainObject()`
- **Math** (14): `sum()`, `mean()`, `max()`, `min()`, `clamp()`, `random()`, etc.
- **String** (24): `camelCase()`, `kebabCase()`, `snakeCase()`, `capitalize()`, `truncate()`, etc.
- **Template** (2): `template()` (compile), `render()` (one-shot) - Mustache-style with `{{var}}`, `{{#if}}`,
  `{{#each}}`,
  `{{#with}}`, `{{> partial}}`, `{{{raw}}}`
- **Browser** (1): `copyToClipboard(text)` - async clipboard copy with fallback for older browsers
- **Chaining** (1): `chain(value)` - Lodash-style wrapper for explicit method chaining

**Function Composition:**

```javascript
// flow() - Execute functions left to right
const calculate = _.flow(
        x => x * 2,
        x => x + 10,
        x => x / 3
);
calculate(5); // ((5 * 2) + 10) / 3 = 6.67

// compose() - Execute functions right to left (traditional functional composition)
const calculate = _.compose(
        x => x / 3,
        x => x + 10,
        x => x * 2
);
calculate(5); // ((5 * 2) + 10) / 3 = 6.67

// chain() - Explicit chaining with .value() to extract result
_.chain([1, 2, 3, 4, 5])
        .map(x => x * 2)
        .filter(x => x > 4)
        .sum()
        .value(); // 30 (6 + 8 + 10)

// More complex chaining example
_.chain({a: 1, b: 2, c: 3})
        .values()           // [1, 2, 3]
        .map(x => x * 2)    // [2, 4, 6]
        .sum()              // 12
        .value();           // 12
```

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
- **Model Factory**: `create(schema, initialData, options)` returns a Model instance
- **Model Instance**: `get()`, `set()`, `toJSON()`, `validate()`, `onChange()`, `offChange()`, `reset()`
- **Persistence**: `save()`, `load()`, `clearStorage()`, `isPersisted()`, `getPersistKey()`
- **DOM Binding**: `M.bind(model, field, selector, options)`, `M.unbind()`
- **Types**: `M.types.string`, `M.types.number`, `M.types.boolean`, `M.types.array`, `M.types.object`, `M.types.date`,
  `M.types.any`

**Model Persistence** - auto-save/load from localStorage:

```javascript
const settings = M.create(schema, data, {persist: 'app-settings'});
// Auto-loads on creation, auto-saves on every change
settings.save();           // Manual save
settings.load();           // Manual reload
settings.clearStorage();   // Remove from localStorage
settings.reset(true);      // Reset and clear storage
```

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
- **BackToTop**: `elements.backToTop(selector, { showAfter, duration, position, offset, target, onShow, onHide })` →
  `scroll()`, `show()`, `hide()`, `toggle()`, `isVisible()`, `getButton()`, `destroy()`
- **ButtonGroup**: `elements.buttonGroup(selector, { mode, activeClass, allowEmpty, onChange })` →
  `getValue()`, `getActive()`, `setValue()`, `toggle()`, `selectAll()`, `deselectAll()`
  - CSS classes: `.btn-group`, `.btn-group-vertical`, `.active`
  - Mode: `'single'` (radio) or `'multiple'` (checkbox)
- **Dialog**: Promise-based modal dialogs (replacements for browser `alert`/`confirm`/`prompt`)
  - `elements.alert(message, options)` → `Promise<void>` - Simple message with OK button
  - `elements.confirm(message, options)` → `Promise<boolean>` - OK/Cancel, returns true/false
  - `elements.prompt(message, options)` → `Promise<string|null>` - Text input, returns value or null
  - Options: `title`, `confirmText`, `cancelText`, `inputPlaceholder`, `inputValue`, `inputType`, `animation`,
    `keyboard`
- **Loader**: Loading indicators with multiple animation types
    - `elements.loader(selector, { type, size, color, overlay, text, centered })` →
      `show()`, `hide()`, `toggle()`, `isVisible()`, `setText()`, `destroy()`
    - Types: `'spinner'`, `'dots'`, `'pulse'`, `'bars'`
    - Sizes: `'small'`, `'medium'`, `'large'`, or number (px)
    - Static: `elements.showLoader(selector)`, `elements.hideLoader(selector)`, `elements.fullscreenLoader(text)`
- **Breadcrumbs**: Navigation trail component
    - `elements.breadcrumbs(selector, { items, separator, homeIcon, responsive, onChange })` →
      `setItems()`, `addItem()`, `removeItem()`, `getItems()`, `destroy()`
    - Separators: `'/'`, `'>'`, `'→'`, `'chevron'`, or custom HTML
- **Navbar**: Responsive navigation bar
    - `elements.navbar(selector, { brand, items, position, variant, collapsible, collapseAt, actions, onItemClick })` →
      `setActive()`, `setItems()`, `expand()`, `collapse()`, `toggle()`, `isCollapsed()`, `destroy()`
    - Brand: `{ text, logo, url }`
    - Items: Support nested arrays for dropdowns
    - Variants: `'light'`, `'dark'`, `'transparent'`
    - Position: `'static'`, `'fixed'`, `'sticky'`
- **DesktopNotification**: Browser native notifications wrapper
  -
  `elements.notification({ title, body, icon, badge, tag, requireInteraction, silent, data, onClick, onClose, onError, onShow })` →
  `show()`, `close()`, `isShown()`
  - `elements.notify(title, options)` - Convenience method for quick notifications
  - Static: `DesktopNotification.requestPermission()`, `DesktopNotification.closeAll()`
  - Permission handling: Auto-requests permission on first use
- **Timer**: Countdown timer with optional visual display
  -
  `elements.timer(selector, { duration, autoStart, format, showControls, updateInterval, notification, notificationOptions, sound, soundUrl, onTick, onComplete, onStart, onPause, onReset })` →
  `start()`, `pause()`, `reset()`, `stop()`, `add(ms)`, `subtract(ms)`, `setDuration(ms)`, `isRunning()`,
  `getRemaining()`, `getElapsed()`, `destroy()`
  - Format: `'hh:mm:ss'`, `'mm:ss'`, `'ss'`
  - Works in visual mode (with selector) or headless mode (selector = null)
  - Integrates with DesktopNotification for completion alerts
- **Alarm**: Scheduled time-based alerts with localStorage persistence
  -
  `elements.alarm({ alarms, timezone, checkInterval, storageKey, onTrigger, onSnooze, onDismiss, onAlarmAdd, onAlarmRemove })` →
  `add(alarm)`, `remove(id)`, `update(id, changes)`, `enable(id)`, `disable(id)`, `toggle(id)`, `snooze(id, duration)`,
  `getAlarms()`, `getAlarm(id)`, `getNextAlarm()`, `clearAll()`, `destroy()`
  - Singleton pattern - same instance manages all alarms
  - Alarm structure: `{ time: 'HH:MM', label, enabled, repeat, notification, notificationOptions, sound, soundUrl }`
  - Repeat patterns: `'daily'`, `'weekdays'`, `'weekends'`, `['mon', 'wed', 'fri']`, or `null` (one-time)
  - Persists to localStorage automatically
  - Integrates with DesktopNotification for alarm triggers
- **Autocomplete**: Text input with intelligent suggestion dropdown
  -
  `elements.autocomplete(selector, { data, dataSource, minChars, maxResults, debounce, filterFn, renderItem, highlightMatches, position, placeholder, emptyMessage, loadingMessage, caseSensitive, selectOnEnter, clearOnSelect, model, modelKey, onSelect, onChange, onOpen, onClose, onFilter })` →
  `open()`, `close()`, `toggle()`, `isOpen()`, `setValue()`, `getValue()`, `setData()`, `refresh()`, `clearValue()`,
  `focus()`, `destroy()`
  - Data Sources: Static arrays or async functions (promises)
  - Position: `'auto'`, `'above'`, `'below'` with collision detection
  - Features: Match highlighting, keyboard navigation (arrows, Enter, Escape, Tab), debouncing, loading states
  - Model Integration: Supports two-way binding with `model` and `modelKey` options for reactive synchronisation
- **Pillbox**: Multi-select tag input with removable pills
  -
  `elements.pillbox(selector, { data, value, placeholder, searchable, creatable, maxItems, duplicates, clearable, size, renderPill, renderOption, pillTemplate, validatePill, maxItemsMessage, duplicateMessage, noResultsMessage, model, modelKey, onAdd, onRemove, onChange, onCreate, onMaxReached, onValidationError })` →
  `getValue()`, `setValue()`, `addPill()`, `removePill()`, `removePillAt()`, `clear()`, `getCount()`, `setData()`,
  `open()`, `close()`, `isOpen()`, `focus()`, `enable()`, `disable()`, `destroy()`
  - Modes: Select-only or creatable (allow custom tags)
  - Sizes: `'small'`, `'medium'`, `'large'`
  - Features: Searchable dropdown, validation (max items, duplicates, custom), keyboard support (Backspace to remove)
  - Model Integration: Supports two-way binding with `model` and `modelKey` options for reactive array synchronisation

### tables.js - DataTable-like functionality

Accessed via `Domma.tables`:

- **Create**:
  `tables.create(selector, { data, columns, pagination, pageSize, selectable, selectionMode, exportPanel, columnToggle, regexSearch, evenRowColor, oddRowColor, hoverColor })`
- **Data**: `setData()`, `getData()`, `addRow()`, `addRows()`, `updateRow()`, `removeRow()`, `removeRows()`, `clear()`,
  `refresh()`
- **Sort**: `sort()`, `sortMultiple()`, `clearSort()`, `getSortState()`
- **Filter**: `search()`, `filter()`, `filterBy()`, `clearFilters()`, `getFilters()`
- **Pagination**: `page()`, `pageSize()`, `nextPage()`, `prevPage()`, `firstPage()`, `lastPage()`, `pageInfo()`
- **Selection**: `select()`, `deselect()`, `selectAll()`, `deselectAll()`, `toggleSelect()`, `getSelected()`,
  `getSelectedIndices()`
- **Export**: `toCSV()`, `toJSON()`, `download()`
- **Events**: `on()`, `off()`, `once()`
- **Stripe Configuration**: Control row striping with named variants or custom colors:
  - `evenRowColor`: Color for even rows (0, 2, 4...) - named variant or hex/rgb value (default: transparent)
  - `oddRowColor`: Color for odd rows (1, 3, 5...) - named variant or hex/rgb value (default: '#f9f9f9')
  - `hoverColor`: Color for row hover state - named variant or hex/rgb value (default: '#f0f0f0')
  - Named variants: `'none'`, `'lighter'`, `'light'`, `'medium'`, `'dark'`, `'primary-tint'`, `'success-tint'`,
    `'warning-tint'`, `'danger-tint'`, `'info-tint'`
  - Example:
    `tables.create('#table', { data, columns, striped: true, evenRowColor: 'lighter', oddRowColor: 'light', hoverColor: 'medium' })`

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

**Supported Components (16 total):**

- `card`, `modal`, `tabs`, `accordion`, `tooltip`, `carousel`, `dropdown`
- `badge`, `backToTop`, `buttonGroup`, `loader`, `breadcrumbs`, `navbar`
- `notification`, `timer`, `alarm`

**Not Supported via Config Engine:**

- `toast` - Use static methods: `Domma.elements.showToast()` or instance methods
- `dialog` - Use static methods: `Domma.elements.alert()`, `.confirm()`, `.prompt()`
- `jumbotron` - CSS-only component (no JavaScript)
- `forms` - Documentation only (native HTML forms)

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

### storage.js - localStorage wrapper

Accessed via `Domma.storage` or `S`:

- **Core**: `get(key, default)`, `set(key, value)`, `remove(key)`, `has(key)`, `clear()`, `keys()`
- **Utilities**: `size(key)`, `totalSize()`, `getAll()`, `setAll(data)`, `isAvailable()`
- **Features**: Auto JSON serialisation, `domma:` key prefix, graceful fallbacks

```javascript
S.set('user', { name: 'Alice', role: 'admin' });  // Auto-stringify
S.get('user');                                     // Auto-parse → { name: 'Alice', role: 'admin' }
S.get('missing', []);                              // Default value
S.keys();                                          // List all Domma keys
S.clear();                                         // Clear only Domma keys
```

## Aliases

| Full Path       | Alias | Global     | Description                |
|-----------------|-------|------------|----------------------------|
| `Domma()`       | `$`   | `window.$` | DOM selection/manipulation |
| `Domma.utils`   | `_`   | `window._` | Utility functions          |
| `Domma.models`  | `M`   | `window.M` | Reactive models & pub/sub  |
| `Domma.dates()` | `D()` | `window.D` | Date manipulation          |
| `Domma.storage` | `S`   | `window.S` | localStorage wrapper       |

## File Structure

```
src/
├── index.js         # Main entry, exports Domma + aliases
├── tools.js         # Tools bundle entry (Theme Roller, Quick Roller, Editor)
├── dom.js           # jQuery-compatible DOM API
├── utils.js         # Lodash-compatible utilities
├── dates.js         # Moment-style date manipulation
├── models.js        # Reactive models & pub/sub
├── elements.js      # UI components
├── tables.js        # DataTable functionality
├── config.js        # JSON configuration engine
├── http.js          # HTTP client
├── storage.js       # localStorage wrapper
├── theme.js         # Theme management
├── icons.js         # SVG icon system
├── theme-roller.js  # Theme customisation tool (tools bundle)
├── quick-roller.js  # Page builder tool (tools bundle)
└── editor.js        # Content editor tool (tools bundle)

showcase/            # Comprehensive demos for each namespace
quickstart/          # Getting started blueprint
public/dist/         # Built bundles (UMD + ESM)
```

## Bundles

Domma is split into two bundles:

| Bundle               | Size   | Contents                                                                                          |
|----------------------|--------|---------------------------------------------------------------------------------------------------|
| `domma.min.js`       | ~258KB | Core framework (DOM, utils, dates, models, elements, tables, config, http, storage, theme, icons) |
| `domma-tools.min.js` | ~78KB  | Developer tools (Theme Roller, Quick Roller, Editor)                                              |

**Usage:**

```html
<!-- Core only -->
<script src="dist/domma.min.js"></script>

<!-- With developer tools -->
<script src="dist/domma.min.js"></script>
<script src="dist/domma-tools.min.js"></script>
```

The tools bundle attaches to `Domma.elements` automatically when loaded:

```javascript
// Available after loading domma-tools.min.js
Domma.elements.themeRoller('#container', options);
Domma.elements.quickRoller('#container', options);
Domma.elements.editor('#editor', options);
```

Zero external dependencies.

## Custom Bundles

Domma supports custom bundles for optimised file sizes. Several preset bundles are provided, or you can create your own.

### Preset Bundles

| Bundle                      | Size   | Modules                                  | Use Case                             |
|-----------------------------|--------|------------------------------------------|--------------------------------------|
| `domma-minimal.min.js`      | ~144KB | dom, utils, storage, icons               | Simple DOM manipulation              |
| `domma-essentials.min.js`   | ~211KB | minimal + elements, config, http         | Interactive sites with UI components |
| `domma-data-focused.min.js` | ~172KB | dom, utils, tables, icons, storage, http | Data-heavy applications, dashboards  |
| `domma-no-ui.min.js`        | ~39KB  | utils, http, dates, models, storage      | Headless/BYOS integration            |
| `domma.min.js` (Full)       | ~258KB | All modules                              | Complete framework                   |

**Size Comparison:**

- **Minimal**: 44% smaller than full bundle
- **Essentials**: 18% smaller
- **Data-Focused**: 33% smaller
- **No-UI**: 85% smaller (perfect for headless apps)

### Using Preset Bundles

```html
<!-- Minimal bundle - just DOM and utilities -->
<script src="dist/domma-minimal.min.js"></script>

<!-- Essentials bundle - most common features -->
<script src="dist/domma-essentials.min.js"></script>

<!-- No-UI bundle - BYOS (Bring Your Own Styles) -->
<script src="dist/domma-no-ui.min.js"></script>
```

### Creating Custom Bundles

Visit the [Download Page](./public/showcase/download/index.html) and use the **Bundle Builder** to:

1. Select specific modules you need
2. View automatic dependency resolution (dependencies are selected automatically)
3. Download pre-built preset bundles instantly
4. Generate build instructions for truly custom combinations

**Example:** If you only need DOM manipulation and HTTP requests, select `dom`, `utils`, and `http`. The Bundle Builder
will automatically include `utils` (required by `dom`) and show you the total size.

### Module Dependencies

When creating custom bundles, these dependencies are automatically included:

- **dom** → requires `utils`
- **models** → requires `utils`, `storage`
- **tables** → requires `utils`, `icons`
- **config** → requires `dom`, `elements`, `utils`

The Bundle Builder handles this automatically - when you select a module, its dependencies are selected and locked.

### Build Your Own

To manually create a custom bundle:

1. Create an entry point in `src/bundles/` (or use the Bundle Builder to generate one)
2. Add configuration to `rollup.config.js`
3. Run `npm run build`

See `src/bundles/README.md` for detailed instructions and examples.

## CSS Grid System

Domma provides both modern CSS Grid utilities and Bootstrap-style flexbox grid.

### Bootstrap-Style Row/Column Grid

12-column flexbox grid with mobile-first stacking (columns stack below 576px):

```html
<div class="container">
    <div class="row">
        <div class="col-4">Column 1</div>
        <div class="col-4">Column 2</div>
        <div class="col-4">Column 3</div>
    </div>
</div>
```

**Classes:**

- **Row**: `.row`, `.row.no-gutters`
- **Columns**: `.col` (equal), `.col-auto`, `.col-1` through `.col-12`
- **Offsets**: `.offset-1` through `.offset-11`
- **Alignment**: `.row.justify-center`, `.row.align-center`, etc.
- **Order**: `.order-first`, `.order-last`, `.order-1` through `.order-12`
- **Gap**: `.row.gap-1` through `.row.gap-6`

### CSS Grid (Tailwind-style)

```html
<div class="grid grid-cols-3 gap-4">
    <div>Item 1</div>
    <div class="col-span-2">Item 2 (spans 2)</div>
</div>
```

**Classes:**

- **Grid**: `.grid`
- **Columns**: `.grid-cols-1` through `.grid-cols-12`
- **Span**: `.col-span-1` through `.col-span-6`, `.col-span-full`

### Containers

```css
.container      /* max-width: 1200px, centered */
.container-sm   /* 640px */
.container-md   /* 768px */
.container-lg   /* 1024px */
.container-xl   /* 1280px */
```

### Standalone Usage

Grid system is available as a standalone file:

```html
<link rel="stylesheet" href="showcase/css/grid.css">
```

## CSS-Free Usage (BYOS - Bring Your Own Styles)

Domma's JavaScript functionality works **completely independently** of its CSS. Users integrating into existing
sites or using their own styling can:

### Option 1: Don't Load Domma CSS

Simply don't include the theme CSS file:

```html
<!-- Only load JavaScript - no Domma CSS -->
<script src="dist/domma.min.js"></script>

<!-- Your own styles work fine -->
<link rel="stylesheet" href="your-styles.css">
```

### Option 2: Disable Theme Classes

Prevent Domma from adding any `dm-theme-*` classes to the DOM:

```javascript
// Via setup config
$.setup({
    noStyles: true,
    // ... rest of your config
});

// Or directly via theme API
Domma.theme.init({ disabled: true });

// Can also disable at runtime
Domma.theme.disable();  // Removes all dm-theme-* classes
Domma.theme.enable();   // Re-enables theming
```

### What Works Without CSS

These modules work 100% without any Domma CSS:

| Module    | Alias | Notes                                           |
|-----------|-------|-------------------------------------------------|
| `dom`     | `$`   | Full jQuery-compatible DOM manipulation         |
| `utils`   | `_`   | All 120+ Lodash-compatible utilities            |
| `dates`   | `D`   | All date manipulation/formatting                |
| `models`  | `M`   | Pub/sub, reactive models, persistence           |
| `tables`  |       | Data management, sorting, filtering, pagination |
| `http`    |       | All HTTP requests                               |
| `storage` | `S`   | All localStorage operations                     |

### What Needs CSS (or Your Own Styles)

| Module     | Without CSS                                                                  |
|------------|------------------------------------------------------------------------------|
| `elements` | Components work but need your own styles for visibility (modals, tabs, etc.) |
| `theme`    | Can be disabled entirely - no effect without CSS                             |
| `icons`    | SVGs render, but you'll need to style size/colour                            |

### Integration Example

```javascript
// Use Domma's JS with Bootstrap/Tailwind/your CSS
$.setup({ noStyles: true });

// DOM manipulation works normally
$('.my-element').addClass('tailwind-class').fadeIn();

// Utils work normally
const grouped = _.groupBy(data, 'category');

// Models work normally
const user = M.create({ name: { type: 'string' } });

// Tables - you provide your own table styles
const table = Domma.tables.create('#my-table', {
    data: myData,
    columns: [...]
});
```

## Editor (Developer Tool)

**Editor** is a universal content editor included in `domma-tools.min.js` (requires core framework). It provides three
editing modes (text, rich, code) with features like autosave, undo/redo, model integration, and localStorage
persistence.

### Initialisation

```javascript
// Requires both domma.min.js and domma-tools.min.js
const editor = Domma.elements.editor('#editor', {
    mode: 'rich',               // 'text', 'rich', or 'code'
    placeholder: 'Start writing...',
    autosave: true,
    storage: 'my-document',
    onChange: (content) => console.log('Content changed', content),
    onSave: (content) => console.log('Saved', content)
});
```

### Features

- **Three Modes**
  - **Text Mode**: Enhanced textarea with character/word count
  - **Rich Mode**: WYSIWYG editor with formatting toolbar
  - **Code Mode**: Syntax highlighting, line numbers, tab indentation

- **Toolbar Actions** (Rich Mode)
  - Text formatting: Bold, italic, underline, strikethrough
  - Headings: H1, H2, H3
  - Lists: Bullet, numbered
  - Blocks: Quote, code inline, code block
  - Media: Links, images
  - History: Undo, redo
  - Alignment: Left, centre, right
  - Indentation: Indent, outdent
  - Other: Embed, clear formatting

- **Model Integration**
  - Two-way binding with reactive models
  - Auto-sync content changes to model
  - Model changes update editor content

- **Persistence**
  - Autosave to localStorage with configurable interval
  - Manual save/load via API methods
  - Storage key customisation

- **Image Handling**
  - Paste images directly (Rich Mode)
  - Base64 encoding or custom upload handler
  - `imageMode: 'base64'` (default) or `'upload'`

- **Keyboard Shortcuts**
  - Ctrl+B: Bold
  - Ctrl+I: Italic
  - Ctrl+U: Underline
  - Ctrl+Z: Undo
  - Ctrl+Y: Redo
  - Tab: Indent (Code Mode)

### Options

```javascript
Domma.elements.editor(selector, {
    mode: 'rich',                    // 'text', 'rich', 'code'
    model: null,                     // Model instance
    modelKey: null,                  // Model field to bind
    autosave: false,                 // Enable autosave
    autosaveInterval: 3000,          // Autosave interval (ms)
    storage: null,                   // localStorage key
    toolbar: [...],                  // Custom toolbar actions
    showToolbar: true,               // Show/hide toolbar
    imagePaste: true,                // Enable image paste
    imageMode: 'base64',             // 'base64' or 'upload'
    imageUpload: null,               // Custom upload handler
    language: 'javascript',          // Code mode language
    lineNumbers: true,               // Show line numbers (code)
    theme: 'light',                  // Editor theme
    placeholder: '',                 // Placeholder text
    minHeight: 200,                  // Minimum height (px)
    maxHeight: null,                 // Maximum height (px)
    characterCount: false,           // Show character count
    wordCount: false,                // Show word count
    onChange: null,                  // Content change callback
    onSave: null,                    // Save callback
    onImagePaste: null               // Image paste callback
});
```

### API Methods

```javascript
// Content
editor.getValue();              // Get editor content (HTML or text)
editor.setValue(content);       // Set editor content
editor.getText();               // Get plain text (no HTML)
editor.clear();                 // Clear content

// History
editor.undo();                  // Undo last change
editor.redo();                  // Redo last undone change

// Persistence
editor.save();                  // Manual save to localStorage

// Mode
editor.setMode('rich');         // Switch mode ('text', 'rich', 'code')

// Focus
editor.focus();                 // Focus editor

// Cleanup
editor.destroy();               // Remove editor, unbind events
```

### Model Integration

```javascript
// Create model with content field
const docModel = M.create({
    content: { type: 'string', default: '' }
});

// Bind editor to model
const editor = Domma.elements.editor('#editor', {
    mode: 'rich',
    model: docModel,
    modelKey: 'content'
});

// Model changes update editor
docModel.set('content', '<p>Hello World</p>');

// Typing updates model
// User types → onChange → model.set() → other bindings update

// Display content elsewhere
M.bind(docModel, 'content', '#preview', {
    format: (html) => html,
    twoWay: false
});
```

### Autosave with Persistence

```javascript
const editor = Domma.elements.editor('#editor', {
    mode: 'rich',
    autosave: true,
    autosaveInterval: 5000,         // Save every 5 seconds
    storage: 'blog-post-draft',
    onSave: (content) => {
        console.log('Autosaved', content.length, 'characters');
    }
});

// Content is automatically loaded from localStorage on initialisation
// Content is automatically saved every 5 seconds when changed
```

### Custom Image Upload

```javascript
const editor = Domma.elements.editor('#editor', {
    mode: 'rich',
    imageMode: 'upload',
    imageUpload: async (file) => {
        // Upload to server
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        // Return URL to inserted into editor
        return data.url;
    },
    onImagePaste: (file, url) => {
        console.log('Image pasted:', file.name, url);
    }
});
```

### Code Mode with Line Numbers

```javascript
const editor = Domma.elements.editor('#code-editor', {
    mode: 'code',
    language: 'javascript',
    lineNumbers: true,
    theme: 'dark',
    minHeight: 400,
    placeholder: '// Start coding...',
    onChange: (code) => {
        // Live preview or validation
        console.log('Code changed:', code);
    }
});
```

### Rich Mode with Custom Toolbar

```javascript
const editor = Domma.elements.editor('#editor', {
    mode: 'rich',
    toolbar: [
        'bold', 'italic', 'underline',
        '|',  // Separator
        'h1', 'h2',
        '|',
        'ul', 'ol',
        '|',
        'link', 'image',
        '|',
        'undo', 'redo'
    ],
    showToolbar: true
});
```

## Quick Roller (Developer Tool)

**Page Roller** is a visual page builder included in `domma-tools.min.js`. Build complete web pages with drag-and-drop
sections, configure layouts with Divi-style row/column system, and export production-ready HTML.

### Initialisation

```javascript
// Attach to container
const pageRoller = Domma.elements.pageRoller('#container', {
  onChange: (data) => console.log('Page changed', data),
  onSave: ({name, data}) => console.log('Page saved', name)
});
```

### Features

- **16 Section Types** (6 original + 1 layout + 9 interactive)
  - **Layout**: Navbar, Hero, Card Grid, Content, Form, Footer, **Row Layout**
  - **Interactive**: Carousel, Accordion, Tabs, Modal, Toast, Breadcrumbs, Button Group, Tag Cloud, Dropdown

- **Row/Column System** (Divi-inspired)
  - 22+ layout presets (single, equal-2/3/4/5/6, thirds, quarters, fifths, sixths, asymmetric)
  - Proportional width system (0.0-1.0) for flexible layouts
  - Nested rows (max 3 levels)
  - Column spacing controls (padding, margin, gutter)
  - Height options (auto/min/max/fixed)
  - Alignment controls (horizontal/vertical)
  - Responsive behaviour (stack/keep/hide per breakpoint)
  - Background options (none/colour/gradient/image)

- **Visual Editor**
  - Drag-and-drop sections
  - Real-time preview
  - Property inspector with custom controls
  - Template save/load
  - Version migration (v1 → v2)

- **Export**
  - Standalone HTML with CSS
  - Component auto-initialization script
  - Minification option
  - Copy to clipboard

### Row/Column Layout Presets

```javascript
const LAYOUT_PRESETS = {
    'single': [1.0],                        // 1 Column
    'equal-2': [0.5, 0.5],                  // 1/2 + 1/2
    'third-twothirds': [0.333, 0.667],      // 1/3 + 2/3
    'twothirds-third': [0.667, 0.333],      // 2/3 + 1/3
    'quarter-threequarters': [0.25, 0.75],  // 1/4 + 3/4
    'threequarters-quarter': [0.75, 0.25],  // 3/4 + 1/4
    'equal-3': [0.333, 0.333, 0.333],       // 1/3 × 3
    'quarter-half-quarter': [0.25, 0.5, 0.25], // 1/4 + 1/2 + 1/4
    'equal-4': [0.25, 0.25, 0.25, 0.25],    // 1/4 × 4
    'equal-5': [0.2, 0.2, 0.2, 0.2, 0.2],   // 1/5 × 5
    'equal-6': [0.167, 0.167, 0.167, 0.167, 0.167, 0.167], // 1/6 × 6
    'sidebar-main': [0.3, 0.7],             // Sidebar + Main
    'main-sidebar': [0.7, 0.3],             // Main + Sidebar
    // ... and 9 more asymmetric layouts
};
```

### Section Configuration Examples

**Row Layout:**

```javascript
{
    type: 'row',
    config: {
        layout: 'equal-2',
        columns: [{width: 0.5}, {width: 0.5}],
        spacing: {
            padding: {top: 3, right: 3, bottom: 3, left: 3},
            margin: {top: 0, right: 0, bottom: 0, left: 0},
            gutter: 4,
            locked: false
        },
        height: {type: 'auto', value: null, equalize: false},
        alignment: {horizontal: 'start', vertical: 'start'},
        responsive: {mobile: 'stack', tablet: 'keep', desktop: 'keep'},
        background: {type: 'none', color: '', gradient: '', image: ''}
    },
    children: [
        {columnIndex: 0, section: {type: 'hero', config: {...}}},
        {columnIndex: 1, section: {type: 'cardGrid', config: {...}}}
    ]
}
```

**Carousel:**

```javascript
{
    type: 'carousel',
    config: {
        slides: [
            {image: 'url', caption: 'Title', content: 'Description'},
            {image: 'url', caption: 'Title 2', content: 'Description 2'}
        ],
        autoplay: true,
        interval: 5000,
        pauseOnHover: true,
        loop: true,
        animation: 'slide',      // or 'fade'
        showArrows: true,
        showIndicators: true,
        height: 400
    }
}
```

**Accordion:**

```javascript
{
    type: 'accordion',
    config: {
        title: 'FAQ',
        items: [
            {title: 'Question?', content: 'Answer'},
            {title: 'Another?', content: 'Response'}
        ],
        allowMultiple: false,
        activeIndex: 0,
        animation: true,
        style: 'default'         // or 'bordered', 'minimal'
    }
}
```

**Tabs:**

```javascript
{
    type: 'tabs',
    config: {
        tabs: [
            {label: 'Tab 1', content: '<p>Content</p>'},
            {label: 'Tab 2', content: '<p>More content</p>'}
        ],
        activeIndex: 0,
        style: 'default',        // or 'pills', 'underline'
        animation: 'fade'        // or 'none', 'slide'
    }
}
```

### API Methods

```javascript
// Section management
pageRoller.addSection(type);
pageRoller.removeSection(index);
pageRoller.moveSection(fromIndex, toIndex);
pageRoller.getSections();

// Template management
pageRoller.saveTemplate(name);
pageRoller.loadTemplate(name);
pageRoller.newTemplate();

// Theme
pageRoller.setTheme(theme, variant);  // 'light', 'dark', or null
pageRoller.setGridEnabled(enabled);

// Export
pageRoller.exportHTML(options);       // {minify, includeComments, standalone}
pageRoller.copyToClipboard();
pageRoller.openPreviewWindow();

// Configuration
pageRoller.getPageConfig();
```

### Component Auto-Initialization

Exported HTML includes auto-initialization script for interactive components:

```javascript
document.addEventListener("DOMContentLoaded", function() {
    // Icons
    Domma.icons.scan();

    // Carousels
    document.querySelectorAll("[data-component='carousel']").forEach(el => {
        Domma.elements.carousel(el.querySelector('.carousel'), options);
    });

    // Accordions, Tabs, Modals, Breadcrumbs, etc.
    // ... automatically initialized based on data-component attributes
});
```

### Responsive Behaviour

Row layouts respond to viewport changes:

```css
/* Mobile (<576px) */
.pr-row-stack-mobile { grid-template-columns: 1fr !important; }
.pr-row[data-hide-mobile="true"] { display: none; }

/* Tablet (576-768px) */
.pr-row-stack-tablet { grid-template-columns: 1fr !important; }
.pr-row[data-hide-tablet="true"] { display: none; }

/* Desktop (>768px) */
.pr-row[data-hide-desktop="true"] { display: none; }
```

### Data Structure (v2)

```javascript
{
    version: 2,
    name: 'My Page',
    config: {
        meta: {
            title: 'Page Title',
            description: 'Description',
            charset: 'UTF-8',
            viewport: 'width=device-width, initial-scale=1.0'
        },
        theme: 'light',
        variant: null,
        useTheme: true,
        useGrid: true,
        customCSS: ''
    },
    sections: [...]  // Array of section objects (can be nested for rows)
}
```

### Version Migration

Page Roller automatically migrates v1 documents to v2:

- Wraps v1 sections in single-column rows
- Adds version field
- Maintains backwards compatibility
- No manual intervention required

- When updating features or adding new ones, the documentation and showcase should be updated in-line
- Where and whenever possible use Domma in the showcase, documentation and tutorials
- When making changes to the namespaces/modules ensure that we update the PHPStorm code intelligence files
  @assets/ide/phpstorm