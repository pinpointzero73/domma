# Domma

**D**ynamic **O**bject **M**anipulation & **M**odeling **A**PI

🌐 **[Live Demo & Showcase](https://dommajs.org/)** | 📦 [npm](https://www.npmjs.com/package/domma-js) | 📚 [Documentation](https://dommajs.org/showcase/)

A lightweight, zero-dependency JavaScript framework combining jQuery-style DOM manipulation, Lodash utilities, and
modern UI components in one cohesive package.

## Features

- **DOM Manipulation** (`$`) - jQuery-compatible API with 106 methods
- **Utilities** (`_`) - 202 Lodash-compatible utility functions with function composition
- **Dates** (`D`) - Moment.js-style chainable date manipulation
- **Models** (`M`) - Reactive models, dependency tracking, pub/sub events and declarative DOM bindings
- **Blueprints** (`B`) - One schema definition that drives models, forms and CRUD
- **Elements** (`E`) - 32 UI components (modals, tabs, carousels, navbars, context menus, slideovers, and more)
- **Effects** (`Domma.effects`) - 12 scripted animations (scribe, reveal, counter, ripple, strobe, and more)
- **Tables** (`T`) - DataTable-like functionality (sort, filter, paginate, export to CSV/JSON)
- **Forms** (`F`) - Blueprint-driven form generation with validation, wizards, and CRUD helpers
- **Router** (`R`) - Client-side routing with view registration and middleware
- **Icons** (`I`) - 521 SVG icons in 18 categories with auto-scan
- **Flags** (`FL`) - Nation flags as inline SVG, in an opt-in bundle
- **HTTP Client** (`H`) - Simple async HTTP requests with JSON handling
- **Storage** (`S`) - localStorage wrapper with auto JSON serialisation
- **Auth** (`A`) - Token-based authentication with login, register and profile components
- **Components** - Define real Custom Elements with reactive state and fine-grained bindings
- **Themes** - 33 built-in themes across 13 light/dark families plus a six-theme Admin set
- **Config Engine** - Declarative JSON-based behaviour configuration with a mutable API
- **CSS Features** - Utility classes (glow, shadows, elevation, fireworks, grid)
- **Developer Tools** - Theme Roller, Page Roller, Schema Builder, Editor, Print-to-PDF

Everything above ships in one bundle with no runtime dependencies. Nothing uses `eval` or the `Function`
constructor, so Domma runs under a `script-src 'self'` Content Security Policy.

## Ecosystem

Two pieces of Domma are now published as their own packages, so they can be used **without** Domma. This
repository is simply one consumer of each.

| Package | What it is | Where it lives |
|---------|-----------|----------------|
| [`domma-reactive`](https://www.npmjs.com/package/domma-reactive) | Dependency-tracked reactivity and fine-grained DOM bindings - the engine beneath `M.observable`, `M.computed` and `M.applyBindings` | Bundled into `domma.min.js`; [repo](https://github.com/pinpointzero73/domma-reactive) |
| `domma-celebrate` | Eight seasonal celebration themes and their canvas engine, code-split so each theme loads only when it is in season | Served from `dist/celebrate/` on dommajs.org |

**`domma-reactive` has moved out.** The reactive core was extracted into a standalone MIT-licensed package
and is now consumed from the npm registry rather than lived in this repository. Nothing changes for Domma
users: `M.observable()`, `M.computed()`, `M.effect()` and `M.applyBindings()` behave exactly as before, and
the package is bundled into `domma.min.js` by rollup. What has changed is that the reactivity layer is now
usable on its own - about 20 KB gzipped, no dependencies, no build step - in projects that want bindings
without the rest of the framework.

```bash
npm install domma-reactive   # reactivity and bindings, standalone
```

## Installation

### Quick Start with CLI (Recommended)

Get a complete project structure with development server in seconds:

```bash
npm init -y
npm install domma-js
npx domma-js init      # Creates project structure (prompts to start server)
```

`init` scaffolds a **Single Page Application** by default. Pass `--mpa` for a traditional multi-page site,
or `--quick` to skip the prompts.

```bash
npx domma-js init            # Interactive - choose SPA or MPA (SPA is the default)
npx domma-js init --spa      # Explicit SPA
npx domma-js init --mpa      # Multi-Page Application
npx domma-js init --quick    # Accept every default
```

This creates:

- ✅ Complete project structure with sample pages or views
- ✅ JSON configuration (`domma.config.json`)
- ✅ Navbar and footer (configured via JSON)
- ✅ Theme system with all 33 themes
- ✅ npm scripts (`start`, `serve`) in package.json
- ✅ Development server with live reload
- ✅ All features ready to use

### Growing a Project

The CLI scaffolds new pages and views for you, wiring up paths and routes:

```bash
npx domma-js add page admin                  # MPA: creates admin/
npx domma-js add page pages/dashboard        # MPA: one level deep
npx domma-js add view settings               # SPA: creates the view and its route
npx domma-js setup-ai                        # Add AI assistance files to an existing project
```

Page paths are resolved automatically from folder depth, so a page two levels down still finds its assets.

### Development Server

Start the built-in development server with live reload:

**Using npm scripts (recommended):**
```bash
npm start              # Start on port 3096
npm run serve          # Same as npm start
npm run serve:3096     # Explicit port 3096
```

**Using CLI directly:**
```bash
npx domma-js serve              # Start server (auto-detects MPA/SPA)
npx domma-js serve --port 8080  # Custom port
```

The server auto-detects your project type (MPA/SPA) and serves from the correct directory with live reload enabled.

**Full Development Workflow:**
```bash
# 1. Create project
npm install domma-js
npx domma-js init

# 2. Start developing (auto-starts server or run manually)
npm start                    # Opens http://localhost:3096

# 3. Make changes → browser auto-reloads

# 4. Stop server: Ctrl+C

# 5. Restart anytime: npm start
```

### Via npm (Manual Setup)

Install Domma in your project:

```bash
npm install domma-js
```

Then import it:

```javascript
import Domma, { $, _, M, D } from 'domma-js';
```

Or use CommonJS:

```javascript
const Domma = require('domma-js');
const { $, _, M, D } = Domma;
```

### Via CDN

For quick prototyping without npm:

**Option 1: Official CDN (Recommended)**

```html
<!-- CSS (Load in this order) -->
<link rel="stylesheet" href="https://dommajs.org/dist/domma.css">
<link rel="stylesheet" href="https://dommajs.org/dist/grid.css">
<link rel="stylesheet" href="https://dommajs.org/dist/elements.css">
<link rel="stylesheet" href="https://dommajs.org/dist/themes/domma-themes.css">

<!-- JavaScript -->
<script src="https://dommajs.org/dist/domma.min.js"></script>
```

**Option 2: unpkg CDN**

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/domma-js@latest/public/dist/domma.css">
<link rel="stylesheet" href="https://unpkg.com/domma-js@latest/public/dist/grid.css">
<link rel="stylesheet" href="https://unpkg.com/domma-js@latest/public/dist/elements.css">
<link rel="stylesheet" href="https://unpkg.com/domma-js@latest/public/dist/themes/domma-themes.css">

<!-- JavaScript -->
<script src="https://unpkg.com/domma-js@latest/public/dist/domma.min.js"></script>
```

**Option 3: jsDelivr CDN**

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/domma-js@latest/public/dist/domma.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/domma-js@latest/public/dist/grid.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/domma-js@latest/public/dist/elements.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/domma-js@latest/public/dist/themes/domma-themes.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/domma-js@latest/public/dist/domma.min.js"></script>
```

> **Tip:** Replace `@latest` with a specific version (e.g., `@0.43.0`) for production to ensure stability.

## Live Demo

🚀 **[Try Domma Online](https://dommajs.org/)** - Interactive showcase with 87 example pages

Explore all features:
- **[Showcase](https://dommajs.org/showcase/)** - Component examples and tutorials
- **[MiniApps](https://dommajs.org/miniapps/)** - Real-world applications
- **[Download](https://dommajs.org/download/)** - Preset bundles, archives and the Kickstart Builder

## Short Aliases

| Namespace  | Full Path         | Alias | Description                              |
|------------|-------------------|-------|------------------------------------------|
| DOM        | `Domma()`         | `$`   | jQuery-style DOM manipulation            |
| Utils      | `Domma.utils`     | `_`   | Lodash-style utilities                   |
| Models     | `Domma.models`    | `M`   | Reactive models, bindings & pub/sub      |
| Blueprints | Blueprint Methods | `B`   | Blueprint composition (extend, pick, omit) |
| Dates      | `Domma.dates`     | `D`   | Date manipulation                        |
| Storage    | `Domma.storage`   | `S`   | localStorage wrapper                     |
| Auth       | `Domma.auth`      | `A`   | Authentication module                    |
| Forms      | `Domma.forms`     | `F`   | Form builder                             |
| HTTP       | `Domma.http`      | `H`   | HTTP client                              |
| Elements   | `Domma.elements`  | `E`   | UI components                            |
| Icons      | `Domma.icons`     | `I`   | SVG icon system                          |
| Tables     | `Domma.tables`    | `T`   | DataTable functionality                  |
| Router     | `Domma.router`    | `R`   | Client-side router                       |
| Flags      | `Domma.flags`     | `FL`  | Nation flags (opt-in bundle)             |

`Domma.effects`, `Domma.theme`, `Domma.sanitize` and `Domma.components` have no single-letter alias.

## Bundle Options

Choose the right bundle for your needs. Gzipped is the size that reaches the browser.

| Bundle | Minified | Gzipped | Includes |
|--------|---------:|--------:|----------|
| **full** | 628 KB | 148 KB | All modules and components |
| **essentials** | 518 KB | 120 KB | Core + models, elements, config |
| **data-focused** | 203 KB | 45 KB | Core + models, tables, http, storage |
| **minimal** | 175 KB | 37 KB | DOM, utils, dates - zero UI |
| **no-ui** | 102 KB | 32 KB | Core utilities only (DOM + utils) |

Two further bundles load alongside any of the above:

| Bundle | Minified | Gzipped | Includes |
|--------|---------:|--------:|----------|
| **tools** | 228 KB | 52 KB | Theme Roller, Page Roller, Schema Builder, Editor, Print-to-PDF |
| **flags** | 20 KB | 6 KB | Nation flags (`FL`) |

```html
<!-- Use specific bundles via CDN -->
<script src="https://dommajs.org/dist/domma-minimal.min.js"></script>
<script src="https://dommajs.org/dist/domma-essentials.min.js"></script>
<script src="https://dommajs.org/dist/domma-data-focused.min.js"></script>

<!-- Via unpkg -->
<script src="https://unpkg.com/domma-js@latest/public/dist/domma-minimal.min.js"></script>
<script src="https://unpkg.com/domma-js@latest/public/dist/domma-essentials.min.js"></script>
```

## Quick Start

```javascript
// DOM manipulation (jQuery-style)
$('.btn').on('click', () => alert('Clicked!'));
$('#box').addClass('active').css({color: 'blue'});

// Utilities (Lodash-style)
const grouped = _.groupBy(users, 'department');
const unique = _.uniq([1, 2, 2, 3]);

// Dates (Moment-style)
const nextWeek = D().add(7, 'days').format('MMMM D, YYYY');
const timeAgo = D('2025-01-01').fromNow();

// Reactive Models
const user = M.create({
    name: {type: 'string', required: true},
    email: {type: 'string', validate: v => v.includes('@')}
});
M.bind(user, 'name', '#name-input', {twoWay: true});

// Pub/Sub Events
M.on('cart:add', (item) => updateCart(item));
M.emit('cart:add', {id: 1, name: 'Widget'});

// UI Components
const modal = E.modal('#my-modal', {backdrop: true});
modal.open();

// Interactive Tables
const table = T.create('#users', {
    data: usersArray,
    columns: [
        {key: 'name', title: 'Name', sortable: true},
        {key: 'email', title: 'Email', sortable: true}
    ],
    pagination: true,
    pageSize: 25
});
```

## Reactivity & Bindings

The reactive layer - published standalone as [`domma-reactive`](https://www.npmjs.com/package/domma-reactive)
and bundled here - lets you write down a relationship once and have Domma maintain it.

**Observables and computed values** work out their own dependencies at runtime:

```javascript
const count = M.observable(0);
const doubled = M.computed(() => count.value * 2);

doubled.get();      // 0
count.value = 5;
doubled.get();      // 10

count.peek();       // read without subscribing

M.effect(() => console.log('count is', count.value));  // re-runs on every write
```

Writes are batched and flushed on the next microtask, so ten assignments cause one update.
`M.flush()` forces it synchronously; `M.untracked(fn)` reads without creating a dependency.

**Declarative bindings** activate markup that already exists - they never rewrite your page:

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

M.applyBindings(model, '#app', {
    methods: {
        clear() { model.set('query', ''); }
    }
});
```

The binding vocabulary is `data-bind-text`, `data-bind-class`, `data-bind-style`, `data-bind-style-<prop>`,
`data-bind-<prop>`, `data-model`, `data-on-<event>`, `data-if`, `data-each`, `data-options` and
`data-focus`. `data-each` reconciles by key, so deleting a row leaves every other row's DOM node, focus and
scroll position intact. Extend the vocabulary with `M.registerBinding()` and `M.registerHelper()`.

Expressions are parsed by hand rather than compiled with the `Function` constructor, so bindings work under
a `script-src 'self'` Content Security Policy. A binding whose expression will not parse logs one warning
naming the expression and is skipped; the rest of the page keeps working.

See [docs/Reactivity.md](./docs/Reactivity.md) and [docs/Bindings.md](./docs/Bindings.md).

## Components

Define a real Custom Element with reactive state, props, computed values and lifecycle hooks. The same
bindings work inside a component template.

```javascript
Domma.component('user-card', {
    templateUrl: 'components/user-card/template.html',

    props: {
        userId: {type: M.types.number, required: true},
        label:  {type: M.types.string, default: 'User'}
    },

    data() {
        return {name: '', email: '', loading: true};
    },

    computed: {
        initials() {
            return this.data.name.split(' ').map(n => n[0]).join('').toUpperCase();
        }
    },

    methods: {
        async fetchUser() {
            const user = await H.get(`/api/users/${this.props.userId}`);
            this.set({ name: user.name, email: user.email, loading: false });
        }
    },

    onMount()  { this.fetchUser(); },
    onPropsChanged(name) { if (name === 'userId') this.fetchUser(); },

    // Scoped styles, injected into the Shadow DOM
    style: `.card { padding: var(--dm-spacing-md, 1rem); border-radius: 8px; }`
});
```

```html
<user-card user-id="42" label="Account owner"></user-card>
```

Tag names must contain a hyphen; Domma prefixes `domma-` automatically if yours does not. Lifecycle hooks
are `onBeforeMount`, `onMount`, `onUpdated`, `onPropsChanged`, `onBeforeUnmount` and `onUnmount`.
See [docs/Components.md](./docs/Components.md).

## CSS Features

Domma includes comprehensive utility classes for rapid UI development.

**Glow Effects:**
```html
<button class="btn glow-primary">Primary Glow</button>
<div class="card glow-success">Success Glow</div>
```

**Shadows & Elevation:**
```html
<div class="shadow-sm">Small shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="elevation-3">Elevated card</div>
```

**Firework Animations:**
```html
<button class="firework-on-click">Click Me!</button>
<div class="firework-sparkle">Sparkle Effect</div>
```

**Grid System:**
```html
<!-- Bootstrap-style 12-column grid -->
<div class="row">
    <div class="col-md-6">Half width</div>
    <div class="col-md-6">Half width</div>
</div>

<!-- CSS Grid utilities -->
<div class="grid grid-cols-3 gap-4">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</div>
```

Display utilities use the Tailwind spellings (`.block`, `.flex`, `.grid`, `.hidden`). There are no
Bootstrap-style `.d-*` variants.

## Themes

33 built-in themes: 13 families with light and dark variants, a bare `core-light`, and a six-theme Admin
set that pairs two finishes with three accents.

```javascript
// Initialise with theme
Domma.theme.init({ theme: 'ocean-dark' });

// Change theme dynamically
Domma.theme.set('forest-light');

// Toggle between light/dark
Domma.theme.toggle();

// Auto-detect system preference
Domma.theme.init({ autoDetect: true });

// List everything available
Domma.theme.listThemes();   // also listBases() and listVariants()
```

**Light/dark families:**
charcoal · ocean · forest · sunset · royal · lemon · silver · mint · dreamy · grayve · unicorn ·
christmas · wedding

**Admin family** (standalone, no light/dark variant):
`admin-smooth-steel` · `admin-smooth-indigo` · `admin-smooth-teal` ·
`admin-sharp-steel` · `admin-sharp-indigo` · `admin-sharp-teal`

The default is `charcoal-dark`. Pass `{disabled: true}` to `theme.init()` (or `noStyles: true` to
`$.setup()`) to turn Domma theming off entirely and bring your own stylesheet.

## Developer Tools

Domma includes developer tools in a separate bundle. Load it **after** the core bundle; each tool is then
available as an `Domma.elements` factory taking a host selector.

```html
<script src="https://dommajs.org/dist/domma.min.js"></script>
<script src="https://dommajs.org/dist/domma-tools.min.js"></script>
```

**Theme Roller** - visual theme customisation with live preview:
```javascript
const roller = E.themeRoller('#theme-roller-container', {
    baseTheme: 'charcoal-light',
    showPresets: true,
    livePreview: true,
    onChange: (variable, value) => console.log(variable, value)
});
```

**Page Roller** - drag-and-drop page builder:
```javascript
const builder = E.pageRoller('#page-roller-container');
```

**Schema Builder** - visual Blueprint designer:
```javascript
const schema = E.schemaBuilder('#schema-builder-container');
```

**Editor** - text, rich-text and code modes with autosave:
```javascript
E.editor('#editor', {
    mode: 'rich',                                  // 'text' | 'rich' | 'code'
    toolbar: [['bold', 'italic'], ['link', 'image']],
    imagePaste: true,
    autosave: true,
    storage: 'my-notes'
});
```

**Print-to-PDF** - export any element:
```javascript
const printer = E.printToPDF('#content', {
    pageSize: 'A4',
    orientation: 'portrait',
    margins: 'normal'
});
printer.print();
```

The bundle also registers `window.DommaTools` with the same five factories.

## Config Engine

Define behaviour declaratively with JSON configuration.

**Basic Setup:**
```javascript
$.setup({
    '#header': {
        initial: {
            css: { backgroundColor: '#333' },
            text: 'Welcome!'
        },
        events: {
            click: (e, $el) => $el.toggleClass('active')
        }
    },
    '#my-modal': {
        component: 'modal',
        options: { backdrop: true, keyboard: true }
    },
    '.product-card': {
        component: 'card',
        options: { hover: true }
    }
});
```

`$.setup()` also accepts top-level `theme`, `autoDetectTheme`, `persistTheme`, `scanIcons`, `cloak` and
`noStyles` keys.

**Mutable Configuration API:**
```javascript
// Update existing configuration
$.update('#my-modal', {
    options: { backdrop: false }  // Deep merges with existing config
});

// Retrieve configuration
const config = $.config('#my-modal');

// Reach the live component instance
const modal = $.getComponent('#my-modal');
modal.open();

// Reset/destroy configuration
$.reset('#my-modal');  // Removes component and unbinds events
```

**Recognised component types (29):**
- Overlays: modal, dropdown, contextMenu, cookieConsent, notification
- Navigation: tabs, navbar, sidebar, footer, breadcrumbs, backToTop
- Content: card, accordion, carousel, listGroup, tooltip
- Indicators: badge, numberBadge, loader, timer, alarm
- Input: form, buttonGroup, autocomplete, pillbox, signature
- Effects: breathe, pulse, scribe

## Namespaces

### DOM (`$` or `Domma`)

jQuery-compatible DOM manipulation with 106 methods.

```javascript
// Selecting & traversing
$('.items').find('.active').parent();

// Manipulation
$('#list').append('<li>New item</li>');
$('.box').addClass('highlight').css({ opacity: 0.5 });

// Events
$('button').on('click', handler);
$('#form').submit((e) => e.preventDefault());

// Effects
$('#box').fadeIn(400).slideUp(300);
```

### Utils (`_` or `Domma.utils`)

202 Lodash-compatible utility functions.

```javascript
// Arrays
_.chunk([1, 2, 3, 4], 2);      // [[1, 2], [3, 4]]
_.uniq([1, 1, 2, 2, 3]);       // [1, 2, 3]
_.difference([1, 2, 3], [2]);  // [1, 3]

// Collections
_.groupBy(users, 'role');
_.sortBy(items, 'price');
_.filter(users, { active: true });

// Objects
_.get(obj, 'user.address.city', 'N/A');
_.pick(user, ['name', 'email']);
_.merge({}, defaults, options);

// Functions
_.debounce(search, 300);
_.throttle(scroll, 100);
_.memoize(expensive);

// Strings
_.camelCase('hello world');    // 'helloWorld'
_.kebabCase('helloWorld');     // 'hello-world'
_.truncate(text, { length: 50 });

// Templates (Mustache-style)
_.render('Hello {{name}}', { name: 'Ada' });
```

### Dates (`D` or `Domma.dates`)

Moment.js-style chainable date manipulation.

```javascript
// Create
D();                           // Now
D('2025-12-25');              // Parse string
D(timestamp);                  // From timestamp

// Manipulate
D().add(7, 'days');
D().subtract(1, 'month');
D().startOf('week');
D().endOf('month');

// Format
D().format('MMMM D, YYYY');    // 'December 3, 2025'
D().format('h:mm A');          // '2:30 PM'

// Relative time
D().subtract(5, 'minutes').fromNow();  // 'a few minutes ago'

// Compare
D('2025-01-01').isBefore('2025-12-31');
D().diff(otherDate, 'days');
```

### Blueprints (`B`)

One schema definition, used everywhere: models, forms and CRUD all read the same blueprint.

```javascript
const person = {
    name:  { type: M.types.string, required: true },
    email: { type: M.types.string, pattern: /@/ },
    age:   { type: M.types.number, min: 0, max: 150 }
};

const employee = B.extend(person, {
    department: { type: M.types.string, required: true }
});

const publicView  = B.pick(employee, ['name', 'department']);
const withoutAge  = B.omit(employee, ['age']);

M.create(employee);                        // a reactive model
F.render('#form', employee, {});           // a validated form
F.crud({ schema: employee, endpoint: '/api/staff' });   // the whole CRUD screen
```

See [docs/Blueprints.md](./docs/Blueprints.md).

### Models (`M` or `Domma.models`)

Reactive data models, dependency tracking, pub/sub and DOM bindings.

```javascript
// Pub/Sub  (subscribe/publish are the long forms of on/emit)
M.on('user:login', (data) => console.log(data));
M.emit('user:login', { username: 'alice' });
M.off('user:login', handler);
M.once('app:ready', init);

// Reactive Models
const user = M.create({
    name: { type: 'string', required: true },
    age: { type: 'number', min: 0, max: 150 }
}, { name: 'Alice', age: 25 });

user.get('name');
user.set('name', 'Bob');
user.onChange((field, newVal, oldVal) => {});
user.validate();

// Persistence
user.save();
user.load();

// Shared stores
M.store('settings', { theme: 'dark' });
M.getStore('settings');

// DOM Binding - one field, one element
M.bind(user, 'name', '#name-input', { twoWay: true });
M.bind(user, 'name', '#display', { format: v => `Hello, ${v}!` });

// Declarative bindings - whole subtrees
M.applyBindings(user, '#app');
```

See [Reactivity & Bindings](#reactivity--bindings) above for observables, computeds and `data-bind-*`.

### Elements (`E` or `Domma.elements`)

32 production-ready UI components.

**Dialogs & Overlays:**
- `modal()` - Modal dialogs with backdrop
- `alert()` / `confirm()` / `prompt()` - Promise-based dialogs
- `toast()` - Toast notifications
- `slideover()` - Panel overlays from screen edges
- `dropdown()` - Dropdown menus
- `contextMenu()` - Right-click menus, delegated and nestable

**Navigation:**
- `tabs()` - Tabbed navigation
- `navbar()` - Responsive navigation bar with recursive multi-level dropdowns
- `sidebar()` - Sidebar with unlimited nesting
- `breadcrumbs()` - Navigation breadcrumbs
- `backToTop()` - Scroll-to-top button

**Content Display:**
- `card()` - Cards with hover and collapsible support
- `accordion()` - Expandable/collapsible sections
- `carousel()` - Carousels with slide, fade and crossfade transitions
- `listGroup()` - Selectable lists with keyboard navigation
- `hero` - Hero sections (CSS-only)
- `footer()` - Footer with 3 layout modes

**Form Inputs:**
- `autocomplete()` - Input with suggestions
- `pillbox()` - Multi-select tag input
- `buttonGroup()` - Radio/checkbox button groups
- `chooser()` - Card or chip single/multi-select with theme-aware accents
- `signature()` - Canvas signature pad with undo/redo and PNG/SVG export

**Feedback & Indicators:**
- `loader()` - Loading indicators (spinner, dots, pulse, bars)
- `badge()` - Badge indicators
- `numberBadge()` - Notification counters with dot mode and pulse
- `tooltip()` - Hover tooltips
- `notification()` - Desktop notifications
- `cookieConsent()` - Cookie consent banner

**Data & Time:**
- `treeView()` - Hierarchical tree display
- `progression()` - Unified timeline/roadmap component
- `timer()` - Countdown timer
- `alarm()` - Scheduled alerts

```javascript
// Modal
const modal = E.modal('#dialog', { backdrop: true });
modal.open();

// Tabs
const tabs = E.tabs('#product-tabs', {
    onChange: (index) => loadContent(index)
});

// Autocomplete with async data
E.autocomplete('#search', {
    dataSource: async (query) => H.get(`/api/search?q=${query}`),
    onSelect: (item) => console.log(item)
});

// Right-click menu, bound to a container and delegated to its rows
E.contextMenu('#invoice-table', {
    match: 'tr[data-id]',
    items: (row) => [
        { label: 'Edit',   icon: 'edit',  action: () => edit(row.dataset.id) },
        { label: 'Delete', icon: 'trash', danger: true },
        { type: 'divider' },
        { label: 'Export', icon: 'download', submenu: exportFormats }
    ]
});

// Sidebar with nesting
E.sidebar('#main-nav', {
    mobileBreakpoint: 768,
    persist: true  // Remember state
});

// Promise-based dialog
const confirmed = await E.confirm('Delete this item?');
if (confirmed) deleteItem();
```

> `timeline()` still works but is deprecated - use `progression({ mode: 'timeline' })`.

### Effects (`Domma.effects`)

12 scripted animations. Every effect honours `prefers-reduced-motion` and returns a control object with
`pause()`, `resume()`, `stop()`, `restart()` and `destroy()`.

| Effect | Does |
|--------|------|
| `scribe()` | Types text by character, word or sentence, with undo and looping |
| `reveal()` | Scroll-triggered entrance animations via IntersectionObserver |
| `counter()` | Animated number counting with easing and scroll trigger |
| `scramble()` | Cipher/decode text reveal in four orders |
| `ripple()` | Material-style click ripple |
| `shake()` | Attention/error shake |
| `pulse()` | Pulsing scale |
| `breathe()` | Sinusoidal floating |
| `twinkle()` | Sparkle overlay |
| `tickerTape()` | Canvas ticker-tape parade, continuous or one-shot burst |
| `butterflies()` | Canvas butterflies that wander, rise and flap |
| `strobe()` | Canvas strobe lighting with six presets |

```javascript
Domma.effects.scribe('#headline', {
    mode: 'word',           // 'typewriter' | 'word' | 'sentence'
    speed: 50,
    loop: true,
    actions: [
        { render: 'Hello', effect: 'bounce' },
        { wait: '2s' },
        { undoRender: 'all' },
        { render: 'Welcome to Domma', effect: 'fade' }
    ]
});

Domma.effects.counter('#revenue', {
    to: 148320,
    prefix: '£',
    separator: ',',
    trigger: 'scroll'       // 'immediate' | 'scroll'
});

const party = Domma.effects.tickerTape(null, { palette: 'theme', burst: true });
```

Canvas effects accept a container selector, or `null` for a full-page overlay. `strobe()` warns above 5 Hz
and disables itself under `prefers-reduced-motion`.

### Tables (`T` or `Domma.tables`)

DataTable-like functionality.

```javascript
const table = T.create('#users', {
    data: usersArray,
    columns: [
        { key: 'name', title: 'Name', sortable: true },
        { key: 'email', title: 'Email', editable: true },
        { key: 'role', title: 'Role', filterable: true }
    ],
    pagination: true,
    pageSize: 25,
    selectable: true
});

// Sorting & filtering
table.sort('name', 'asc');
table.search('alice');
table.filter('role', 'Admin');

// Pagination
table.page(2);
table.nextPage();

// Selection
table.selectAll();
const selected = table.getSelected();

// Export
table.download('csv', 'users.csv');
table.toJSON();
```

### Forms (`F` or `Domma.forms`)

Blueprint-driven form generation with validation, wizards, and CRUD helpers.

A form is built from a blueprint and some initial data, then rendered where you want it.

```javascript
const userBlueprint = {
    name:  { type: 'string', label: 'Full Name', required: true },
    email: { type: 'email',  label: 'Email',     required: true },
    age:   { type: 'number', label: 'Age',       min: 18, max: 120 },
    role:  { type: 'select', label: 'Role',      options: ['Admin', 'User'] }
};

// Build, then render
const form = F.create(userBlueprint, initialData, {
    layout: 'grid',      // 'stacked', 'inline', or 'grid'
    onSubmit: (data, instance) => console.log(data)
});
form.renderTo('#user-form');

// Or do both in one call
F.render('#user-form', userBlueprint, initialData, { layout: 'grid' });

// Form in a modal, with save/error handling
F.modal(userBlueprint, initialData, {
    onSave:  async (data) => H.post('/api/users', data),
    onError: (err) => E.toast(err.message, { type: 'danger' })
});

// Multi-step wizard
F.wizard('#registration', {
    schema: {
        steps: [
            { title: 'Account', fields: { email: {...}, password: {...} } },
            { title: 'Profile', fields: { name: {...} } }
        ]
    },
    data: {},
    onComplete: (data) => saveUser(data)
});

// CRUD helper - form, table and API wired together
const crud = F.crud({
    schema: userBlueprint,
    endpoint: '/api/users',
    tableSelector: '#users-table',
    title: 'Manage Users',
    primaryKey: 'id',
    displayField: 'name'
});
await crud.init();
```

### Router (`R` or `Domma.router`)

Hash-based client-side routing for single-page applications - the mode `npx domma-js init` scaffolds by
default. Views render into one container; navigation links are ordinary `<a href="#/about">` anchors.

```javascript
R.init({
    container: '#app',
    views: {
        home:     '<h1>Home</h1>',
        about:    { template: '<h1>About</h1>', onMount: ($el) => {} },
        user:     async (params) => `<h1>User ${params.id}</h1>`
    },
    routes: [
        { path: '/',         view: 'home',  title: 'Home' },
        { path: '/user/:id', view: 'user',  title: 'User Profile',
          onEnter: async (params) => loadUser(params.id) }
    ],
    default: '/',
    notFound: '404',
    transitions: { enter: 'fadeIn', leave: 'fadeOut', duration: 200 }
});

// Register more later
R.view('settings', { templateUrl: 'views/settings.html' });
R.route({ path: '/settings', view: 'settings' });

// Middleware - runs before every navigation
R.use((to, from, next) => {
    if (to.meta?.requiresAuth && !A.isAuthenticated()) R.navigate('/login');
    else next();
});

// Navigate
R.navigate('/user/42');
R.navigate('/login', { replace: true });
R.back();
R.forward();
R.current();     // the current route object
R.destroy();
```

### Icons (`I` or `Domma.icons`)

521 SVG icons in 18 categories, with declarative and imperative APIs.

```html
<button data-icon="check">Save</button>
<span data-icon="user" data-icon-size="24"></span>
```

```javascript
// Manual scan after DOM updates
I.scan();

// Programmatic rendering
const html = I.render('settings', { size: 32, color: '#007bff' });
$('#icon-container').html(html);

// Inject into existing element
I.inject('#my-icon', 'star');
```

**Categories:** ui · navigation · communication · media · files · social · commerce · finance · status ·
devices · weather · health · sport · buildings · transport · code · emojis · seasonal

Icons are single-colour and follow `currentColor`, so they theme for free. `$.setup({ scanIcons: true })`
scans on startup.

### Flags (`FL` or `Domma.flags`)

Nation flags as inline SVG, keyed by ISO 3166-1 alpha-2 code. **Opt-in bundle** - flags are multi-colour
artwork that cannot follow `currentColor`, so they are not in the core bundle.

```html
<script src="dist/domma.min.js"></script>
<script src="dist/domma-flags.min.js"></script>

<span data-flag="gb"></span>
<span data-flag="fr" data-flag-shape="circle"></span>
```

```javascript
FL.render('us', { shape: 'rounded', width: 32, border: true });
FL.scan();                         // activate data-flag attributes
FL.list('europe');                 // codes in a region
FL.search('king');                 // fuzzy name search
FL.register('xx', { /* ... */ });  // add your own
```

56 flags across five regions ship as compact descriptors, expanded to SVG lazily on first render and then
memoised. About 20 KB minified, 6 KB gzipped. See [docs/Flags.md](./docs/Flags.md).

### HTTP (`H` or `Domma.http`)

Simple async HTTP client with automatic JSON handling. `H.get()` resolves to parsed JSON, not a `Response`.

```javascript
// GET request
const users = await H.get('/api/users');

// POST with data
const response = await H.post('/api/users', {
    name: 'Alice',
    email: 'alice@example.com'
});

// PUT and DELETE
await H.put('/api/users/1', updates);
await H.delete('/api/users/1');
```

### Storage (`S` or `Domma.storage`)

localStorage wrapper with automatic JSON serialisation. Keys are namespaced under a `domma:` prefix, so
`S.set('user', …)` does not collide with anything else on the origin.

```javascript
// Store data (auto-serialises)
S.set('user', { name: 'Alice', role: 'admin' });
S.set('preferences', { theme: 'dark', lang: 'en' });

// Retrieve (auto-parses)
const user = S.get('user');            // Returns object
const theme = S.get('theme', 'light'); // With default

// Other methods
S.has('user');       // Check existence
S.remove('user');    // Delete key
S.keys();            // List all Domma keys
S.clear();           // Clear all Domma data
```

### Auth (`A` or `Domma.auth`)

Token-based authentication with ready-made login, register and profile components.

```javascript
A.init({ apiUrl: '/api', autoCheck: true });

await A.login({ email, password });
await A.register({ name, email, password });
A.logout();

A.isAuthenticated();
A.getUser();
A.getHeaders();                 // Authorization header for your own requests

// Role helpers
A.getRole();
A.hasRole('editor');
A.hasAnyRole(['admin', 'editor']);
A.isAdmin();
A.isSubscriber();
A.isGuest();

A.on('login',        (user) => R.navigate('/dashboard'));
A.on('logout',       ()     => R.navigate('/'));
A.on('tokenExpired', ()     => R.navigate('/login'));
```

### Sanitize (`Domma.sanitize`)

HTML sanitisation used wherever user content reaches `innerHTML`. It delegates to **DOMPurify** when that
is present on the page. When it is not, it escapes the HTML entirely and warns - safe, but markup is lost,
so include DOMPurify if you need user formatting to survive.

```html
<script src="https://cdn.jsdelivr.net/npm/dompurify@3/dist/purify.min.js"></script>
```

```javascript
Domma.sanitize.sanitise(userHtml);                      // 'default' preset
Domma.sanitize.sanitise(userHtml, { preset: 'strict' });
Domma.sanitize.sanitiseBasic(comment);                  // only b, i, em, strong, br
Domma.sanitize.sanitiseUserContent(post);               // strict preset
Domma.sanitize.escape(text);                            // no HTML at all
Domma.sanitize.hasDOMPurify();                          // is the real thing loaded?
```

## Demo & Showcase

```bash
npm run dev     # build, then serve public/ with live reload
```

Then open `/showcase/`. 87 showcase pages cover every module. Each one is loaded into jsdom by `npm test`,
which asserts it renders and logs nothing - so an example that stops working fails the build.

## MiniApps

Real-world, production-ready applications built with Domma.

🚀 **[Explore All MiniApps](https://dommajs.org/miniapps/)** - Try them live!

### My Garage

Vehicle management system with DVLA integration for UK registration lookups.

- Look up any UK vehicle by registration number
- Display MOT and tax status
- Save vehicle history with Domma.storage
- **Try it:** [My Garage Live](https://dommajs.org/miniapps/garage/)

### Domma Docs

Powerful document editor with rich text formatting and export capabilities.

- Rich text editing with toolbar (bold, italic, lists, headings)
- Document management (save, open, delete)
- Export to PDF, HTML, and Markdown
- Auto-save with Domma.storage
- **Try it:** [Domma Docs Live](https://dommajs.org/miniapps/docs/)

### Address Lookup

UK postcode and address finder.

- Search by postcode, pick from the matching addresses
- Results cached client-side with Domma.storage
- **Try it:** [Address Lookup Live](https://dommajs.org/miniapps/address/)

### Nexus

Contact management and collaboration platform.

- Contact tracking and organisation
- Team collaboration tools
- **Try it:** [Nexus Live](https://dommajs.org/miniapps/nexus/)

## Documentation

### For Claude Code Development

Domma uses distributed CLAUDE.md files for focused, context-specific guidance:

- [`CLAUDE.md`](./CLAUDE.md) - Main meta-file with project overview
- [`src/CLAUDE.md`](./src/CLAUDE.md) - Core modules development guide
- [`src/bundles/CLAUDE.md`](./src/bundles/CLAUDE.md) - Custom bundle creation
- Showcase-specific guides in `/public/showcase/*/CLAUDE.md`:
  - [Showcase Meta Guide](./public/showcase/CLAUDE.md)
  - [DOM](./public/showcase/dom/CLAUDE.md), [Utils](./public/showcase/utils/CLAUDE.md), [Dates](./public/showcase/dates/CLAUDE.md), [Models](./public/showcase/models/CLAUDE.md)
  - [Tables](./public/showcase/tables/CLAUDE.md), [Elements](./public/showcase/elements/CLAUDE.md), [Effects](./public/showcase/effects/CLAUDE.md), [Config](./public/showcase/config/CLAUDE.md)
  - [HTTP](./public/showcase/http/CLAUDE.md), [Storage](./public/showcase/storage/CLAUDE.md), [Router](./public/showcase/router/CLAUDE.md), [Developer Tools](./public/showcase/theme-roller/CLAUDE.md)

### For Users

- [`docs/GettingStarted.md`](./docs/GettingStarted.md) - Quick start guide
- [`docs/API.md`](./docs/API.md) - Complete API reference
- [`docs/DommaDocumentation.md`](./docs/DommaDocumentation.md) - Comprehensive documentation
- [`docs/Reactivity.md`](./docs/Reactivity.md) - Dependency tracking, computeds, batching
- [`docs/Bindings.md`](./docs/Bindings.md) - `M.applyBindings()` and the `data-bind-*` vocabulary
- [`docs/Blueprints.md`](./docs/Blueprints.md) - One schema for models, forms and CRUD
- [`docs/Components.md`](./docs/Components.md) - Custom Elements with reactive state
- [`docs/ContextMenu.md`](./docs/ContextMenu.md) - Container binding, delegation and the nesting cascade
- [`docs/Flags.md`](./docs/Flags.md) - The opt-in flags module
- [`docs/SchemaBuilder.md`](./docs/SchemaBuilder.md) - Visual Blueprint designer
- [Showcase](./public/showcase/index.html) - 87 interactive examples

### For Contributors

- Build system: See `npm run build` and `rollup.config.js`
- Testing: `npm test` runs the Vitest suite (20 test files, plus the showcase page harness)
- Custom bundles: See [`src/bundles/CLAUDE.md`](./src/bundles/CLAUDE.md)
- Release process: [`docs/RELEASING.md`](./docs/RELEASING.md)

## Development

```bash
# Install dependencies
npm install

# Build (JS bundles, CSS, archives, kickstart files, miniapps)
npm run build

# Build just the JS or just the CSS
npm run build:js
npm run build:css

# Run tests
npm test

# Validators (ratchets - each fails only when a file gets worse)
npm run validate              # classes, theme contrast, conventions
npm run validate:showcase     # load all 87 showcase pages in jsdom
```

**MiniApps:**

```bash
npm run build:miniapps              # Build all miniapps
npm run build:miniapp:garage        # Build specific miniapp
NODE_ENV=production npm run build   # Production build
```

## Browser Support

Modern browsers (ES6+). No `eval` and no `Function` constructor, so Domma runs under a
`script-src 'self'` Content Security Policy.

## License

ISC
