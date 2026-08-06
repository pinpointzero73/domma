# CLAUDE.md - Core Modules Development

This file provides guidance for working with Domma's core framework modules in the `/src` directory.

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

## Core Modules Architecture

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
- **Model Factory**: `create(blueprint, initialData, options)` returns a Model instance
- **Model Instance**: `get()`, `set()`, `toJSON()`, `validate()`, `onChange()`, `offChange()`, `reset()`
- **Persistence**: `save()`, `load()`, `clearStorage()`, `isPersisted()`, `getPersistKey()`
- **Observables**: `M.observable(value)`, `M.observableArray([])` — single reactive values, the primitive
  beneath Models. Also published standalone as `domma-reactive`.
- **Reactivity**: `M.computed(fn)`, `M.effect(fn)`, `M.untracked(fn)`, `M.flush()`, `model.tracked()` — dependency
  tracking with a batched microtask flush. See [docs/Reactivity.md](../docs/Reactivity.md)
- **DOM Binding**: `M.bind(model, field, selector, options)`, `M.unbind()` — one field, one element
- **Declarative Bindings**: `M.applyBindings(data, root, options)` activates every binding attribute under a root —
  `data-bind-*`, `data-model`, `data-on-*`, `data-if`, `data-each="rows key=id"` — on markup that already exists.
  Pass a Model and bindings read and write through it. `M.registerBinding()` / `M.unregisterBinding()` add binding
  kinds; `M.registerHelper()` / `M.unregisterHelper()` add functions callable from an expression. The same bindings
  work in a `Domma.component()` template. See [docs/Bindings.md](../docs/Bindings.md)
- **Types**: `M.types.string`, `M.types.number`, `M.types.boolean`, `M.types.array`, `M.types.object`, `M.types.date`,
  `M.types.any`

**Model Persistence** - auto-save/load from localStorage:

```javascript
const settings = M.create(blueprint, data, {persist: 'app-settings'});
// Auto-loads on creation, auto-saves on every change
settings.save();           // Manual save
settings.load();           // Manual reload
settings.clearStorage();   // Remove from localStorage
settings.reset(true);      // Reset and clear storage
```

### router.js - Hash-based SPA routing

Accessed via `Domma.router` or `R`:

- **Initialization**: `init(options)` - Set up router with container, routes, views
- **Navigation**: `navigate(path, options)`, `back()`, `forward()`, `reload()`
- **Registration**: `route(config)`, `view(name, viewDef)`
- **Middleware**: `use(middleware)`, `clearMiddleware()`
- **State**: `current()`, `getContainer()`

**Router Configuration:**

```javascript
import {views} from './views/index.js';

R.init({
  container: '#app',           // View container selector
  routes: [                    // Route definitions
    { path: '/', view: 'home', title: 'Home', onEnter, onLeave },
    { path: '/about', view: 'about', title: 'About' },
    { path: '/user/:id', view: 'user', title: 'User Profile' }
  ],
  views: views,                // View registry object
  default: '/',                // Default route
  notFound: '404',             // 404 view name
  transitions: {               // Transition config
    enter: 'fadeIn',
    leave: 'fadeOut',
    duration: 200
  }
});
```

**View Structure:**

```javascript
// ✅ RECOMMENDED: External template file
export const homeView = {
  templateUrl: 'js/views/templates/home.html',  // Path to template file

  // Optional: Reusable template sections
  partials: {
    'header': 'js/views/templates/partials/header.html',
    'footer': 'js/views/templates/partials/footer.html'
  },

  // Called before rendering (async supported)
  async onEnter(params) {
    // Fetch data, validate auth, etc.
    const data = await H.get('/api/home');
    return data;  // Can return data to pass to template
  },

  // Called after view is mounted
  onMount($container) {
    // Scan for icons
    I.scan($container[0]);

    // Initialize components
    E.tooltip($container.find('[data-tooltip]'));

    // Bind events
    $container.find('#my-button').on('click', () => {
      E.toast('Clicked!', {type: 'success'});
    });
  },

  // Called when leaving view (cleanup)
  onLeave() {
    // Remove event listeners, timers, etc.
    $('#my-button').off('click');
  }
};

// Alternative: Inline template (use only for simple views <5 lines)
export const simpleView = {
  template: `<div class="simple">Simple content</div>`,
  onMount($container) { I.scan($container[0]); }
};
```

**Template Loading:**
- Router fetches and caches templates automatically
- Templates support Mustache-style syntax: `{{variable}}`, `{{#if}}`, `{{#each}}`
- Partials are loaded in parallel for performance
- All templates cached per-session (cleared on hard refresh)

**Route Parameters:**

```javascript
// Route: /user/:id
// URL: #/user/123

// In view:
onEnter(params) {
  console.log(params.id);  // '123'
}
```

**Middleware (Route Guards):**

```javascript
// Authentication guard
R.use((to, from, next) => {
  if (to.path !== '/login' && !isAuthenticated()) {
    next('/login');  // Redirect to login
  } else {
    next();  // Allow navigation
  }
});

// Logging middleware
R.use((to, from, next) => {
  console.log(`Navigating from ${from?.path} to ${to.path}`);
  next();
});
```

**Pub/Sub Events:**

```javascript
// Router publishes events via M.publish()
M.subscribe('router:ready', ({router}) => {
  console.log('Router initialized');
});

M.subscribe('router:beforeChange', ({from, to}) => {
  console.log(`Leaving ${from?.path}, going to ${to.path}`);
});

M.subscribe('router:afterChange', ({from, to}) => {
  console.log(`Now on ${to.path}`);
  // Update active navbar item, etc.
});

M.subscribe('router:error', ({error, route}) => {
  console.error(`Router error on ${route}:`, error);
});
```

**Programmatic Navigation:**

```javascript
// Navigate to route
R.navigate('/about');

// Navigate with replace (no history entry)
R.navigate('/about', {replace: true});

// History navigation
R.back();
R.forward();

// Reload current route
R.reload();

// Get current route info
const current = R.current();
console.log(current.path, current.params, current.query);
```

**Dynamic Routes:**

```javascript
// Register route at runtime
R.route({
  path: '/settings',
  view: 'settings',
  title: 'Settings',
  onEnter: async (params) => {
    // Pre-load data
  }
});

// Register view at runtime
R.view('settings', {
  template: '<div>Settings</div>',
  onMount($container) { }
});
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
  `elements.carousel(selector, { autoplay, interval, pauseOnHover, loop, animation, animationDuration, animationEasing, showArrows, showIndicators, onChange })` →
  `next()`, `prev()`, `goTo()`, `play()`, `pause()`, `getIndex()`, `getSlide()`
    - `animation`: `'slide'` (default — horizontal track translate), `'fade'` (clean opacity swap), or `'crossfade'` (overlapping opacity in both directions)
    - `animationEasing`: any CSS timing function (`'ease'`, `'linear'`, `'ease-in-out'`, `'cubic-bezier(...)'`)
- **hero**: CSS-only component with Tailwind-inspired utilities for modern hero sections
    - **Base**: `.hero`, `.hero-content`, `.hero-title`, `.hero-subtitle`, `.hero-actions`,
      `.hero-note`
    - **Themes**: `.hero-primary`, `.hero-dark`
    - **Layouts**: `.hero-center`, `.hero-cover`, `.hero-overlay`, `.hero-fluid`, `.hero-full`
    - **Sizes**: `.hero-sm`, `.hero-lg`
    - **Split Layouts (New)**: `.hero-split`, `.hero-split-reverse`, `.hero-split-60-40`,
      `.hero-split-70-30`, `.hero-split-40-60`, `.hero-split-30-70`, `.hero-text`,
      `.hero-media`
    - **Enhanced Overlays (New)**: `.hero-overlay-light`, `.hero-overlay-dark`, `.hero-overlay-darker`,
      `.hero-overlay-gradient`, `.hero-overlay-gradient-reverse`
    - **Badges (New)**: `.hero-badge`, `.hero-badge-secondary`, `.hero-badge-success`,
      `.hero-badge-warning`, `.hero-badge-danger`, `.hero-badge-info`, `.hero-badge-outline`,
      `.hero-badge-icon`
    - **Responsive Utilities (New)**: `.hero-title-responsive`, `.hero-subtitle-responsive`,
      `.hero-responsive`, `.hero-hide-mobile`, `.hero-show-mobile`, `.hero-center-mobile`
    - **Gradients (New)**: `.hero-gradient-purple`, `.hero-gradient-blue`, `.hero-gradient-green`,
      `.hero-gradient-sunset`, `.hero-gradient-ocean`, `.hero-gradient-rose`,
      `.hero-gradient-forest`, `.hero-gradient-night`
- **Slideover**: Panel overlays that slide in from screen edges
    -
    `elements.slideover(selector, { position, size, backdrop, backdropClose, keyboard, closeOnEscape, animation, animationDuration, title, content, closable, closeIcon, onOpen, onClose, onClosed })` →
    `open()`, `close()`, `toggle()`, `isOpen()`, `setTitle()`, `setContent()`, `setSize()`, `setPosition()`, `destroy()`
    - Positions: `'left'`, `'right'`, `'top'`, `'bottom'`
    - Sizes: `'sm'`, `'md'`, `'lg'`, `'xl'`, `'full'`, or custom (e.g., `'400px'`)
    - Factory method: `Slideover.create({ title, content, position, size, ... })`
    - Form blueprint integration supported
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
- **Progression**: Unified timeline and roadmap component with dual-mode functionality
  -
  `elements.progression(selector, { mode, items, layout, theme, animation, showProgress, progressPosition, statusIcons, allowStatusChange, currentItem, icons, onStatusChange })` →
  `setItems()`, `addItem()`, `updateItem()`, `removeItem()`, `setStatus()`, `getProgress()`, `markComplete()`, `markInProgress()`, `markPlanned()`, `markBlocked()`, `getItemsByStatus()`, `setCurrent()`, `destroy()`
    - Modes: `'timeline'` (chronological events) or `'roadmap'` (status-driven milestones)
    - Layouts: `'vertical'`, `'horizontal'`, `'centered'`
    - Themes: `'default'`, `'minimal'`, `'corporate'`, `'modern'`
    - Timeline Items: `{ year, title, description, icon }`
    - Roadmap Items: `{ id, title, status, date, description, progress, priority, tags, assignee }`
    - Status Types: `'planned'`, `'in-progress'`, `'completed'`, `'blocked'`, `'cancelled'`
    - Features: Progress bars, status indicators with pulse animations, priority badges, interactive status changes
    - Backwards Compatible: `elements.timeline()` is an alias for `progression({ mode: 'timeline' })`
- **ListGroup**: `elements.listGroup(selector, { selectable, multiSelect, keyboard, loop, onChange })` → `select()`, `deselect()`, `toggle()`, `selectAll()`, `deselectAll()`, `getSelected()`, `enable()`, `disable()`, `refresh()`, `destroy()`
    - CSS classes: `.list-group`, `.list-group-item`, `.list-group-flush`, `.list-group-sm`, `.list-group-lg`, `.list-group-item-action`
    - Colour variants: `list-group-item-primary/secondary/success/danger/warning/info`
    - Keyboard: Arrow keys, Home/End, Enter/Space; roving tabindex pattern
- **Signature**: `elements.signature(selector, options)` → `toBase64(format?)`, `isEmpty()`, `clear(silent?)`, `undo()`, `redo()`, `disable()`, `enable()`, `destroy()`
    - Pointer Events API — mouse, touch, and stylus (pressure-sensitive line width)
    - Smooth Bézier curves; strokes stored as normalised (0–1) co-ordinates
    - ResizeObserver reflows strokes on container resize
    - Export: `'png'` (canvas data URL) or `'svg'` (rebuilt from stored strokes)
    - `typeFallback: true` shows a Draw / Type toggle; type mode renders cursive text to canvas

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
- **Stripe Configuration**: Control row striping with named variants or custom colours:
    - `evenRowColor`: Colour for even rows (0, 2, 4...) - named variant or hex/rgb value (default: transparent)
    - `oddRowColor`: Colour for odd rows (1, 3, 5...) - named variant or hex/rgb value (default: '#f9f9f9')
    - `hoverColor`: Colour for row hover state - named variant or hex/rgb value (default: '#f0f0f0')
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

- `toast` - Use static method: `Domma.elements.toast()`
- `dialog` - Use static methods: `Domma.elements.alert()`, `.confirm()`, `.prompt()`
- `hero` - CSS-only component (no JavaScript)
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

### effects.js - Visual effects and animations

Accessed via `Domma.effects`:

- **breathe**: `effects.breathe(selector, { amplitude, duration, easing, delay, stagger, iterations, pauseOnHover })` - Sinusoidal floating animation
- **pulse**: `effects.pulse(selector, { scale, duration, easing, delay, stagger, iterations, pauseOnHover })` - Pulsing scale animation
- **scribe**: `effects.scribe(selector, { mode, speed, deleteSpeed, cursor, cursorChar, cursorBlink, loop, loopDelay, pauseOnHover, actions })` - Text animation with configurable granularity
- **reveal**: `effects.reveal(selector, { animation, duration, easing, delay, stagger, threshold, rootMargin, once, onReveal })` - Scroll-triggered entrance animations (fade, slide-up/down/left/right, zoom, flip)
- **scramble**: `effects.scramble(selector, { speed, scrambleSpeed, characters, revealOrder, scrambleDuration, loop, loopDelay, onComplete, onCharacter })` - Text cipher/decode animation
- **counter**: `effects.counter(selector, { from, to, duration, easing, decimals, separator, prefix, suffix, trigger, threshold, onUpdate, onComplete })` - Animated number counting with formatting
- **ripple**: `effects.ripple(selector, { colour, duration, opacity, unbounded, centered, trigger })` - Material Design click ripple effect
- **shake**: `effects.shake(selector, { intensity, duration, direction, easing, iterations, stagger, onComplete })` - Attention/error shake animation
- **twinkle**: `effects.twinkle(selector | null, { count, minSize, maxSize, twinkleSpeed, colour, zIndex, shape, respectMotionPreference })` - Canvas-based twinkling stars; pass `null` for full-page overlay or a selector for container-scoped mode
- **tickerTape**: `effects.tickerTape(selector | null, { palette, density, speed, sway, rotationSpeed, minWidth, maxWidth, minHeight, maxHeight, fadeStart, burst, burstCount, zIndex, respectMotionPreference })` - Canvas-based ticker-tape parade; coloured rectangles drop, sway, rotate, and fade. Pass `null` for full-page overlay. Built-in palettes: `theme`, `rainbow`, `festive`, `gold`, `silver`, `pastel`, `mono`, `sunset`, `ocean`, `forest`, `bridal`, or supply a custom colour array.
- **butterflies**: `effects.butterflies(selector | null, { palette, density, speed, wander, riseSpeed, flapSpeed, minSize, maxSize, twoTone, burst, burstCount, zIndex, respectMotionPreference })` - Canvas-based butterflies that wander and rise with procedurally flapping wings. Pass `null` for a full-page overlay. Palettes: `meadow` (default), `theme`, `pastel`, `rainbow`, `sunset`, or a custom colour array.
- **strobe**: `effects.strobe(selector | null, { preset, origins, motion, sweepArc, speed, beamWidth, flicker, hz, colours, intensity, duration, zIndex, respectMotionPreference })` - Canvas strobe *lighting*: beams from corners sweep/rotate and brighten where they cross (additive blending). Presets: `club` (default), `concert`, `police`, `searchlight`, `scanner`, `mood` — individual options override the preset. Disabled under prefers-reduced-motion; flicker `hz` warns above 5.

**Scribe Modes:**
- `mode: 'typewriter'` - Character-by-character rendering (default)
- `mode: 'word'` - Word-by-word rendering
- `mode: 'sentence'` - Sentence-by-sentence rendering

**Scribe Actions:**
- `{ render: 'text', effect: 'none|fade|bounce|glow' }` - Type text with optional entrance effect
- `{ wait: '2s' }` - Pause for duration (supports '2s', '500ms', or number)
- `{ undoRender: true }` - Delete all units from last render
- `{ undoRender: N }` - Delete last N units (chars/words/sentences based on mode)
- `{ undoRender: 'all' }` - Delete all units

**Control Object** (returned by all effects):
- `pause()` - Pause the effect
- `resume()` - Resume the effect
- `stop()` - Stop the effect
- `restart()` - Restart from beginning
- `destroy()` - Clean up and remove effect
- `isRunning()` - Check if effect is active
- `isPaused()` - Check if effect is paused

```javascript
// Breathing animation
Domma.effects.breathe('.stat-card', {
  amplitude: 8,
  duration: 2000,
  pauseOnHover: true
});

// Scribe with sequence
const scribe = Domma.effects.scribe('.hero-title', {
  mode: 'typewriter',  // or 'word', 'sentence'
  speed: 50,
  actions: [
    { render: 'Hello', effect: 'bounce' },
    { wait: '2s' },
    { undoRender: true },
    { render: 'Welcome to Domma', effect: 'fade' }
  ],
  loop: true
});

// Control the animation
scribe.pause();
scribe.resume();
scribe.destroy();
```

## Aliases

| Full Path        | Alias | Global     | Description                      |
|------------------|-------|------------|----------------------------------|
| `Domma()`        | `$`   | `window.$` | DOM selection/manipulation       |
| `Domma.utils`    | `_`   | `window._` | Utility functions                |
| `Domma.models`   | `M`   | `window.M` | Reactive models & pub/sub        |
| Blueprint        | `B`   | `window.B` | Blueprint composition (extend, pick, omit) |
| `Domma.dates()`  | `D()` | `window.D` | Date manipulation                |
| `Domma.storage`  | `S`   | `window.S` | localStorage wrapper             |
| `Domma.auth`     | `A`   | `window.A` | Authentication module            |
| `Domma.forms`    | `F`   | `window.F` | Form builder                     |
| `Domma.http`     | `H`   | `window.H` | HTTP client                      |
| `Domma.elements` | `E`   | `window.E` | UI components                    |
| `Domma.icons`    | `I`   | `window.I` | SVG icon system                  |
| `Domma.tables`   | `T`   | `window.T` | DataTable functionality          |

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
├── effects.js       # Visual effects (breathe, pulse, scribe, reveal, scramble, counter, ripple, shake)
├── theme.js         # Theme management
├── icons.js         # SVG icon system
├── theme-roller.js  # Theme customisation tool (tools bundle)
├── page-roller.js   # Page builder tool (tools bundle)
└── editor.js        # Content editor tool (tools bundle)
```

## Development Guidelines

- When updating features or adding new ones, the documentation and showcase should be updated in-line
- Where and whenever possible use Domma in the showcase, documentation and tutorials
- When making changes to the namespaces/modules ensure that we update the PHPStorm code intelligence files
  @public/assets/ide/phpstorm
- Do not run a server as I am running one
- Audit your own work and reiterate where possible
- **British English**: Use British spellings in all new code, comments, and documentation (-ise not -ize, -yse not -yze, -our not -or). Existing code may use American spellings for backwards compatibility.

## Related Documentation

- [Main CLAUDE.md](../CLAUDE.md) - Project overview and documentation index
- [Bundles Guide](./bundles/CLAUDE.md) - Custom bundle creation
- [Showcase Development](../public/showcase/CLAUDE.md) - Creating showcase examples
