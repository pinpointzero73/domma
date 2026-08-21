---
name: domma-features
description: Complete inventory of every Domma feature — DOM methods, utils, dates, blueprints, models, the 23 UI components, forms, tables, effects, icons, and CSS utilities. Read this before implementing any common functionality (HTTP, storage, DOM, forms, dates, UI) manually, to check whether Domma already provides it.
---

# Domma Features Reference

This comprehensive list covers ALL Domma features. **Always check this list before implementing features manually.**

### JavaScript Modules

#### DOM Manipulation (`$` / `Domma()`)

- 90+ jQuery-compatible methods
- Traversal: `find()`, `children()`, `parent()`, `parents()`, `closest()`, `siblings()`, `next()`, `prev()`, etc.
- Content: `html()`, `text()`, `val()`
- Attributes: `attr()`, `removeAttr()`, `prop()`, `removeProp()`, `data()`, `removeData()`
- CSS/Classes: `css()`, `addClass()`, `removeClass()`, `toggleClass()`, `hasClass()`
- Manipulation: `append()`, `prepend()`, `after()`, `before()`, `wrap()`, `unwrap()`, `remove()`, `clone()`, etc.
- Events: `on()`, `off()`, `one()`, `trigger()`, `hover()` + all event shortcuts
- Effects: `show()`, `hide()`, `toggle()`, `fadeIn()`, `fadeOut()`, `fadeToggle()`, `slideUp()`, `slideDown()`,
  `slideToggle()`, `animate()`
- Dimensions: `width()`, `height()`, `innerWidth()`, `innerHeight()`, `outerWidth()`, `outerHeight()`, `offset()`,
  `position()`, `scrollTop()`, `scrollLeft()`

#### Utils (`_` / `Domma.utils`)

- 120+ Lodash-compatible utilities
- Array: `chunk()`, `compact()`, `difference()`, `flatten()`, `uniq()`, `zip()`, `intersection()`, `union()`, etc.
- Collection: `each()`, `filter()`, `find()`, `groupBy()`, `keyBy()`, `map()`, `orderBy()`, `sortBy()`, `reduce()`, etc.
- Function: `debounce()`, `throttle()`, `memoize()`, `once()`, `curry()`, `partial()`, `flow()`, `compose()`, `chain()`
- Object: `get()`, `set()`, `has()`, `pick()`, `omit()`, `merge()`, `cloneDeep()`, `mapKeys()`, `mapValues()`, etc.
- Lang: `isArray()`, `isObject()`, `isFunction()`, `isEmpty()`, `isEqual()`, etc.
- String: `camelCase()`, `kebabCase()`, `snakeCase()`, `capitalize()`, `truncate()`, etc.
- Math: `sum()`, `mean()`, `max()`, `min()`, `clamp()`, `random()`
- Template: `template()`, `render()` (Mustache-style with `{{}}`, `{{#if}}`, `{{#each}}`, `{{> partial}}`)
- Browser: `copyToClipboard()`

#### Dates (`D()` / `Domma.dates`)

- Moment.js-style API
- Create: `D()`, `D('2025-12-25')`, `D(timestamp)`
- Manipulate: `add()`, `subtract()`, `startOf()`, `endOf()`, `set()`
- Format: `format()`, `toISOString()`, `unix()`
- Getters: `year()`, `month()`, `date()`, `day()`, `hour()`, `minute()`, `second()`
- Compare: `isBefore()`, `isAfter()`, `isSame()`, `isBetween()`, `diff()`
- Relative: `fromNow()`, `from()`, `toNow()`, `to()`

#### Blueprints (`M.extend()`, `M.pick()`, `M.omit()`)

- Unified schema system - define data structure once, use everywhere
- Powers Models, Forms, and CRUD operations
- **Composition:**
  - `M.extend(blueprint1, blueprint2, ...)` - Merge multiple blueprints
  - `M.pick(blueprint, ['field1', 'field2'])` - Extract specific fields
  - `M.omit(blueprint, ['field1', 'field2'])` - Remove specific fields
- **Type System:** `M.types.string`, `number`, `boolean`, `array`, `object`, `date`, `any`
- **Validation:** required, min, max, minLength, maxLength, pattern, custom validators
- **Integration:**
  - Models: `M.create(blueprint)` - Reactive data models
  - Forms: `Domma.forms.create(blueprint)` - Auto-generate forms
  - CRUD: `Domma.forms.crud(selector, blueprint)` - Complete CRUD from single blueprint
- **Documentation:** See [docs/Blueprints.md](./docs/Blueprints.md) for comprehensive guide

#### Models (`M` / `Domma.models`)

- Reactive data models with validation
- Pub/Sub: `subscribe()`, `publish()`, `unsubscribe()`, `once()`
- Model: `create()`, `get()`, `set()`, `toJSON()`, `validate()`, `onChange()`, `reset()`
- Persistence: `save()`, `load()`, `clearStorage()`, `isPersisted()`
- DOM Binding: `M.bind()`, `M.unbind()` (two-way binding)
- Types: `M.types.string`, `M.types.number`, `M.types.boolean`, `M.types.array`, `M.types.object`, `M.types.date`

#### Elements (`Domma.elements`)

- **23 UI Components:**
  - Modal - `modal()` with backdrop, keyboard, animation options
  - Tabs - `tabs()` with active index, onChange
  - Accordion - `accordion()` with multiExpand
  - Tooltip - `tooltip()` with positioning, triggers
  - Carousel - `carousel()` with autoplay, interval, loop, and three transition modes (`slide` / `fade` / `crossfade`) plus configurable easing
  - Card - `card()` with hover, clickable, **collapsible** (with localStorage persistence)
  - Dropdown - `dropdown()` with positioning
  - Toast - Static `toast()` method with types
  - Dialog - Promise-based `alert()`, `confirm()`, `prompt()`
  - Loader - `loader()` with types (spinner, dots, pulse, bars)
  - Badge - `badge()` component
  - NumberBadge - `numberBadge()` notification counter with positioning, dot mode, pulse
  - ListGroup - `listGroup()` selectable lists with keyboard nav, colour variants, flush mode
  - Signature - `signature()` canvas signature pad — mouse/touch/stylus, undo/redo, PNG/SVG export, type fallback
  - BackToTop - `backToTop()` with scroll behavior
  - ButtonGroup - `buttonGroup()` for radio/checkbox groups
  - Breadcrumbs - `breadcrumbs()` with separators
  - Navbar - `navbar()` responsive navigation
  - Sidebar - `sidebar()` with unlimited depth nesting, mobile drawer, state persistence
  - Footer - `footer()` with three layout modes (simple, columns, minimal) and theme variants
  - DesktopNotification - Browser notifications wrapper
  - Timer - `timer()` countdown with visual display
  - Alarm - `alarm()` scheduled alerts with persistence
  - hero - CSS-only hero sections with multiple variants
  - Slideover - `slideover()` panel overlays from screen edges
  - Progression - `progression()` unified timeline/roadmap component with dual modes, status tracking

- **Form Components:**
  - Autocomplete - `autocomplete()` with data/dataSource, highlighting, keyboard nav
  - Pillbox - `pillbox()` multi-select tag input with validation

#### Tables (`Domma.tables`)

- DataTable-like functionality
- Features: Sorting, filtering, pagination, search, row selection
- Export: `toCSV()`, `toJSON()`, `download()`
- Striping: Named color variants or custom colors
- Methods: `setData()`, `addRow()`, `updateRow()`, `removeRow()`, `search()`, `filter()`, `sort()`

#### Forms (`Domma.forms`)

- Blueprint-driven form generation
- **Components:**
  - FormBuilder - `create()` with validation, layouts (stacked/grid/inline)
  - Modal Forms - `modal()` with save/error handling
  - Wizard - `wizard()` multi-step forms
  - CRUD Helper - `crud()` complete CRUD with API integration
- **Features:**
  - Input types: string, email, password, number, date, select, textarea, radio, checkbox-group, file, etc.
  - Validation: required, minLength, maxLength, pattern, custom validators, async validation
  - Layouts: stacked, grid (2/3 columns), inline, sections
  - Model integration: Two-way binding with reactive models

#### Config (`$.setup()` / `Domma.setup`)

- Declarative configuration engine
- **Features:**
  - Component auto-initialization (16 supported components)
  - Event binding with delegation
  - Initial state configuration
  - Mutable config: `$.update()`, `$.config()`, `$.reset()`

#### HTTP (`Domma.http`)

- Fetch-based HTTP client
- Methods: `get()`, `post()`, `put()`, `delete()`
- Auto JSON handling
- Promise-based API

#### Storage (`S` / `Domma.storage`)

- localStorage wrapper with auto JSON serialization
- Methods: `get()`, `set()`, `remove()`, `has()`, `clear()`, `keys()`
- Features: Namespaced keys (`domma:` prefix), size tracking, graceful fallbacks

#### Theme (`Domma.theme`)

- Dynamic theme management
- 10+ built-in themes with light/dark variants
- Methods: `init()`, `set()`, `setVariant()`, `toggle()`
- Auto system preference detection
- Persistence to localStorage

#### Icons (`Domma.icons`)

- 200+ SVG icons in 15 categories
- Methods: `render()`, `inject()`, `scan()` (auto-scan `data-icon` attributes)
- Customizable size and color

#### Flags (`Domma.flags` / `FL`) — opt-in module

- **Separate bundle** (`domma-flags.min.js`), loaded after the core bundle — NOT in `domma.min.js`
- Nation flags as inline SVG, keyed by ISO 3166-1 alpha-2 code (`gb`, `us`, `fr`…)
- Lazy expansion: descriptors → SVG on first render, then memoised (~20 KB bundle)
- Shapes: `rect`, `rounded`, `square`, `circle`; optional border
- Methods: `render()`, `html()`, `inject()`, `scan()` (`data-flag`), `register()`, `search()`, `list(region)`, `name()`
- Curated starter set across 5 regions; extend at runtime with `FL.register(code, def)`
- See [docs/Flags.md](./docs/Flags.md)

#### Effects (`Domma.effects`)

- **breathe()** - Sinusoidal floating animation with configurable amplitude and duration
- **pulse()** - Pulsing scale animation for attention-grabbing elements
- **scribe()** - Text animation with configurable granularity (characters, words, or sentences)
  - Modes: `typewriter` (char-by-char), `word` (word-by-word), `sentence` (sentence-by-sentence)
  - Actions: `render` (type text), `wait` (pause), `undoRender` (delete text)
  - Effects: `none`, `fade`, `bounce`, `glow` (per-unit entrance animations)
  - Features: Blinking cursor, looping, partial undo, pause on hover, mode-aware deletion
- **reveal()** - Scroll-triggered entrance animations using IntersectionObserver
  - Animations: `fade`, `slide-up`, `slide-down`, `slide-left`, `slide-right`, `zoom`, `flip`
  - Features: Stagger, threshold, once/repeat, onReveal callback
- **scramble()** - Text cipher/decode animation
  - Reveal orders: `left-to-right`, `right-to-left`, `random`, `center-out`
  - Features: Custom character pools, looping, per-character callbacks
- **counter()** - Animated number counting with easing
  - Easing: `linear`, `ease-out`, `ease-in-out`
  - Features: Prefix/suffix, thousands separator, decimals, scroll trigger
- **ripple()** - Material Design click ripple effect
  - Features: Custom colour, centred mode, unbounded overflow, configurable trigger
- **shake()** - Attention/error shake animation
  - Directions: `horizontal`, `vertical`, `both`
  - Features: Configurable intensity, iterations, stagger, onComplete callback
- **tickerTape()** - Canvas-based ticker-tape parade — coloured rectangular strips drop from above, sway, rotate, and fade
  - Modes: full-page overlay (`null` selector) or container-scoped
  - Palettes: `'theme'` (auto from CSS variables), `'rainbow'`, `'festive'`, `'gold'`, `'silver'`, `'pastel'`, `'mono'`, `'sunset'`, `'ocean'`, `'forest'`, `'bridal'`, or a custom array of CSS colour strings
  - Behaviour: continuous stream with configurable density, or one-shot `burst` for celebration moments
  - Tunable: `speed`, `sway`, `rotationSpeed`, `fadeStart`, strip width/height ranges, `zIndex`
- **butterflies()** - Canvas-based butterflies that wander and rise with flapping wings
  - Modes: full-page overlay (`null` selector) or container-scoped
  - Palettes: `meadow` (default), `theme`, `pastel`, `rainbow`, `sunset`, or custom colour array
  - Behaviour: continuous stream or one-shot `burst`
  - Tunable: `density`, `speed`, `wander`, `riseSpeed`, `flapSpeed`, `minSize`/`maxSize`, `twoTone`
- **strobe()** - Canvas strobe *lighting* — light beams from corners that sweep/rotate and brighten where they cross
  - Presets: `club` (default), `concert`, `police`, `searchlight`, `scanner`, `mood`; individual options override the preset
  - Tunable: `origins`, `motion` (sweep/rotate), `sweepArc`, `speed`, `beamWidth`, `flicker`, `hz`, `colours`, `intensity`
  - Frequency (`hz`) warns above 5 Hz; disabled under prefers-reduced-motion
- All effects support `respectMotionPreference` and return control objects with `pause()`, `resume()`, `stop()`, `restart()`, `destroy()`

### CSS Features

#### Base Utilities (domma.css)

- **Typography:** Font families, sizes, weights, line heights
- **Spacing:** Margin/padding utilities (`.m-*`, `.p-*`, `.mt-*`, `.mb-*`, etc.)
- **Display:** `.d-block`, `.d-inline`, `.d-flex`, `.d-grid`, `.d-none`
- **Colors:** Full color palette (slate, blue, green, red, amber, sky, etc.)
- **Opacity:** Full scale `.opacity-0` → `.opacity-100` (steps of 10, plus `.opacity-25`, `.opacity-75`)
- **Translucency:**
  - Semantic: `.translucent-light` (0.85), `.translucent` (0.70), `.translucent-heavy` (0.50)
  - Glass: `.translucent-glass` — semi-transparent background + `backdrop-filter: blur()`
  - Hover variants: `.translucent-hover`, `.translucent-light-hover`, `.translucent-heavy-hover`
  - All include `transition: opacity` for smooth state changes
- **Effects:**
  - Glow: `.glow-primary`, `.glow-success`, `.glow-danger`, etc.
  - Shadows: `.shadow-sm`, `.shadow-md`, `.shadow-lg`, `.shadow-xl`
  - Elevation: `.elevation-1` through `.elevation-5`
  - Fireworks: `.firework-on-click`, `.firework-on-hover`, `.firework-sparkle`
  - Text effects: `.text-shadow-sm`, `.text-shadow-md`, `.text-shadow-lg`

#### Grid System (grid.css)

- **Bootstrap-style Grid:** 12-column responsive grid with `.row`, `.col-*`, breakpoints (sm, md, lg, xl)
- **CSS Grid Utilities:** `.grid`, `.grid-cols-*`, `.gap-*`, `.auto-fill`, `.auto-fit`
- **Flexbox:** `.flex`, `.flex-row`, `.flex-col`, `.justify-*`, `.align-*`, `.flex-wrap`

#### Elements (elements.css)

- 22 UI components with full styling
- Buttons, Cards, Modals, Forms, Tables, Navigation (Navbar, Sidebar, Footer), Progression, etc.
- Responsive and theme-aware

#### Themes (domma-themes.css)

- 10+ pre-built themes
- Light/dark variants for each
- Named themes: charcoal, ocean, forest, sunset, etc.

### Tools Bundle

#### Theme Roller

- Visual theme customization tool
- Live preview and export

#### Page Roller

- Page builder tool
- Component library and layout management

#### Editor

- Content editor with rich text
- Export to multiple formats

#### Print-to-PDF

- Print and PDF export functionality

### Advanced Features

#### Stagger Animations

- **IMPORTANT:** Built-in stagger animations for entrance effects
- Used for cascading element appearances
- Check documentation before implementing manually

#### Animation Utilities

- Fireworks animations (`.firework-*`)
- Glow effects (`.glow-*`)
- Fade/slide effects via JavaScript API

#### Accessibility

- ARIA support throughout
- Keyboard navigation for all interactive components
- Reduced motion support (`prefers-reduced-motion`)
- Screen reader friendly

#### Performance

- Lazy loading support
- Event delegation
- Debounce/throttle utilities
- Component cleanup (`destroy()` methods)

