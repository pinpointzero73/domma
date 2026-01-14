# Domma

**D**ynamic **O**bject **M**anipulation & **M**odeling **A**PI

🌐 **[Live Demo & Showcase](http://domma.dcbw-it.co.uk/)** | 📦 [npm](https://www.npmjs.com/package/domma-js) | 📚 [Documentation](http://domma.dcbw-it.co.uk/showcase/)

A lightweight, zero-dependency JavaScript framework combining jQuery-style DOM manipulation, Lodash utilities, and
modern UI components in one cohesive package.

## Features

- **DOM Manipulation** (`$`) - jQuery-compatible API with 90+ methods
- **Utilities** (`_`) - 120+ Lodash-compatible utility functions with function composition
- **Dates** (`D`) - Moment.js-style chainable date manipulation
- **Models** (`M`) - Reactive data models with pub/sub events and two-way DOM binding
- **Elements** (`E`) - 28 UI components (modals, tabs, carousels, navbars, slideovers, and more)
- **Tables** (`T`) - DataTable-like functionality (sort, filter, paginate, export to CSV/JSON)
- **Forms** (`F`) - Schema-driven form generation with validation, wizards, and CRUD helpers
- **Icons** (`I`) - 200+ SVG icons in 15 categories with auto-scan
- **HTTP Client** (`H`) - Simple async HTTP requests with JSON handling
- **Storage** (`S`) - localStorage wrapper with auto JSON serialization
- **Themes** - 10+ built-in themes with light/dark variants and system detection
- **Config Engine** - Declarative JSON-based behavior configuration with mutable API
- **CSS Features** - Utility classes (glow, shadows, elevation, fireworks, grid)
- **Developer Tools** - Theme Roller, Page Roller, Editor, Print-to-PDF

## Installation

### Quick Start with CLI (Recommended)

Get a complete project structure with 5 sample pages in seconds:

```bash
npm init -y
npm install domma-js
npx domma init
```

This creates:

- ✅ Complete project structure with 5 sample pages
- ✅ JSON configuration (`domma.config.json`)
- ✅ Navbar and footer (configured via JSON)
- ✅ Theme system with 16+ themes
- ✅ All features ready to use

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

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/domma-js/public/dist/domma.css">
<link rel="stylesheet" href="https://unpkg.com/domma-js/public/dist/grid.css">
<link rel="stylesheet" href="https://unpkg.com/domma-js/public/dist/elements.css">
<link rel="stylesheet" href="https://unpkg.com/domma-js/public/dist/themes/domma-themes.css">

<!-- JavaScript -->
<script src="https://unpkg.com/domma-js/public/dist/domma.min.js"></script>
```

## Live Demo

🚀 **[Try Domma Online](http://domma.dcbw-it.co.uk/)** - Interactive showcase with 40+ examples

Explore all features:
- **[Showcase](http://domma.dcbw-it.co.uk/showcase/)** - Component examples and tutorials
- **[MiniApps](http://domma.dcbw-it.co.uk/miniapps/)** - Real-world applications
- **[Download](http://domma.dcbw-it.co.uk/showcase/download/)** - Preset bundles and archives

## Short Aliases

| Namespace | Full Path         | Alias | Description                   |
|-----------|-------------------|-------|-------------------------------|
| DOM       | `Domma()`         | `$`   | jQuery-style DOM manipulation |
| Utils     | `Domma.utils`     | `_`   | Lodash-style utilities        |
| Models    | `Domma.models`    | `M`   | Reactive models & pub/sub     |
| Dates     | `Domma.dates`     | `D`   | Date manipulation             |
| Storage   | `Domma.storage`   | `S`   | localStorage wrapper          |
| Auth      | `Domma.auth`      | `A`   | Authentication module         |
| Forms     | `Domma.forms`     | `F`   | Form builder                  |
| HTTP      | `Domma.http`      | `H`   | HTTP client                   |
| Elements  | `Domma.elements`  | `E`   | UI components                 |
| Icons     | `Domma.icons`     | `I`   | SVG icon system               |
| Tables    | `Domma.tables`    | `T`   | DataTable functionality       |

## Bundle Options

Choose the right bundle for your needs:

| Bundle | Size | Includes |
|--------|------|----------|
| **full** | 390KB | All modules and components |
| **minimal** | 163KB | DOM, utils, dates - zero UI |
| **essentials** | 328KB | Core + models, elements, config |
| **data-focused** | 190KB | Core + models, tables, http, storage |
| **no-ui** | 41KB | Core utilities only (DOM + utils) |

```javascript
// Use specific bundles via CDN
<script src="https://unpkg.com/domma-js/public/dist/domma-minimal.min.js"></script>
<script src="https://unpkg.com/domma-js/public/dist/domma-essentials.min.js"></script>
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
const modal = Domma.elements.modal('#my-modal', {backdrop: true});
modal.open();

// Interactive Tables
const table = Domma.tables.create('#users', {
    data: usersArray,
    columns: [
        {key: 'name', title: 'Name', sortable: true},
        {key: 'email', title: 'Email', sortable: true}
    ],
    pagination: true,
    pageSize: 25
});
```

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

## Themes

10+ built-in themes with light/dark variants and automatic system detection.

```javascript
// Initialize with theme
Domma.theme.init({ theme: 'ocean-dark' });

// Change theme dynamically
Domma.theme.set('forest-light');

// Toggle between light/dark
Domma.theme.toggle();

// Auto-detect system preference
Domma.theme.init({ autoDetect: true });
```

**Available Themes:**
- charcoal (light/dark)
- ocean (light/dark)
- forest (light/dark)
- sunset (light/dark)
- lavender (light/dark)
- crimson (light/dark)
- slate (light/dark)
- amber (light/dark)
- teal (light/dark)
- rose (light/dark)

## Developer Tools

Domma includes powerful developer tools in a separate bundle.

```html
<!-- Load tools bundle -->
<script src="dist/domma-tools.min.js"></script>
```

**Theme Roller** - Visual theme customization tool:
```javascript
Domma.themeRoller.open();
```

**Page Roller** - Drag-and-drop page builder:
```javascript
Domma.pageRoller.init();
```

**Editor** - Rich content editor with export:
```javascript
Domma.editor.create('#editor', {
    toolbar: ['bold', 'italic', 'heading', 'list'],
    onSave: (content) => console.log(content)
});
```

**Print-to-PDF** - Export any element to PDF:
```javascript
Domma.printToPDF('#content', { filename: 'export.pdf' });
```

## Config Engine

Define behavior declaratively with JSON configuration.

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

**Mutable Configuration API:**
```javascript
// Update existing configuration
$.update('#my-modal', {
    options: { backdrop: false }  // Deep merges with existing config
});

// Retrieve configuration
const config = $.config('#my-modal');
console.log(config);

// Reset/destroy configuration
$.reset('#my-modal');  // Removes component and unbinds events
```

**Supported Components (16 total):**
- card, modal, tabs, accordion, tooltip, carousel, dropdown
- badge, backToTop, buttonGroup, loader, breadcrumbs, navbar
- notification, timer, alarm

## Namespaces

### DOM (`$` or `Domma`)

jQuery-compatible DOM manipulation with 90+ methods.

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

120+ Lodash-compatible utility functions.

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

### Models (`M` or `Domma.models`)

Reactive data models with pub/sub events.

```javascript
// Pub/Sub
M.on('user:login', (data) => console.log(data));
M.emit('user:login', { username: 'alice' });
M.off('user:login', handler);

// Reactive Models
const user = M.create({
    name: { type: 'string', required: true },
    age: { type: 'number', min: 0, max: 150 }
}, { name: 'Alice', age: 25 });

user.get('name');
user.set('name', 'Bob');
user.onChange((field, newVal, oldVal) => {});
user.validate();

// DOM Binding
M.bind(user, 'name', '#name-input', { twoWay: true });
M.bind(user, 'name', '#display', { format: v => `Hello, ${v}!` });
```

### Elements (`E` or `Domma.elements`)

28 production-ready UI components with JavaScript interactivity.

**Dialogs & Overlays:**
- `modal()` - Modal dialogs with backdrop
- `dialog` - Promise-based alert/confirm/prompt
- `toast()` - Toast notifications (static method)
- `slideover()` - Panel overlays from screen edges
- `dropdown()` - Dropdown menus

**Navigation:**
- `tabs()` - Tabbed navigation
- `navbar()` - Responsive navigation bar
- `sidebar()` - Sidebar with unlimited nesting
- `breadcrumbs()` - Navigation breadcrumbs
- `backToTop()` - Scroll-to-top button

**Content Display:**
- `card()` - Cards with hover and collapsible support
- `accordion()` - Expandable/collapsible sections
- `carousel()` - Image/content carousels
- `hero` - Hero sections (CSS-only)
- `footer()` - Footer with 3 layout modes

**Form Inputs:**
- `autocomplete()` - Input with suggestions
- `pillbox()` - Multi-select tag input
- `buttonGroup()` - Radio/checkbox button groups

**Feedback & Indicators:**
- `loader()` - Loading indicators (spinner, dots, pulse, bars)
- `badge()` - Badge/notification indicators
- `tooltip()` - Hover tooltips
- `notification()` - Desktop notifications
- `cookieConsent()` - Cookie consent banner

**Data & Visualization:**
- `treeView()` - Hierarchical tree display
- `progression()` - Timeline/roadmap component
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
    dataSource: async (query) => {
        const res = await fetch(`/api/search?q=${query}`);
        return res.json();
    },
    onSelect: (item) => console.log(item)
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

### Tables (`Domma.tables`)

DataTable-like functionality.

```javascript
const table = Domma.tables.create('#users', {
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

Schema-driven form generation with validation, wizards, and CRUD helpers.

```javascript
// Schema-driven form
const form = F.create('#user-form', {
    fields: [
        { name: 'name', type: 'string', label: 'Full Name', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'age', type: 'number', label: 'Age', min: 18, max: 120 },
        { name: 'role', type: 'select', label: 'Role', options: ['Admin', 'User'] }
    ],
    layout: 'grid',      // 'stacked', 'inline', or 'grid'
    onSubmit: (data) => console.log(data)
});

// Multi-step wizard
const wizard = F.wizard('#registration', {
    steps: [
        { title: 'Account', fields: [/*...*/] },
        { title: 'Profile', fields: [/*...*/] },
        { title: 'Confirm', fields: [/*...*/] }
    ],
    onComplete: (data) => saveUser(data)
});

// CRUD helper
const crud = F.crud({
    apiUrl: '/api/users',
    fields: schema,
    table: '#users-table'
});
```

### Icons (`I` or `Domma.icons`)

200+ SVG icons in 15 categories with declarative and imperative APIs.

```javascript
// Declarative (auto-scan on load)
<button data-icon="check">Save</button>
<span data-icon="user" data-icon-size="24"></span>

// Manual scan after DOM updates
I.scan();

// Programmatic rendering
const html = I.render('settings', { size: 32, color: '#007bff' });
$('#icon-container').html(html);

// Inject into existing element
I.inject('#my-icon', 'star');
```

**Categories:** actions, arrows, communication, devices, editor, files, hardware, media, navigation, notifications, social, status, toggle, ui, weather

### HTTP (`H` or `Domma.http`)

Simple async HTTP client with automatic JSON handling.

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

localStorage wrapper with automatic JSON serialization.

```javascript
// Store data (auto-serializes)
S.set('user', { name: 'Alice', role: 'admin' });
S.set('preferences', { theme: 'dark', lang: 'en' });

// Retrieve (auto-parses)
const user = S.get('user');           // Returns object
const theme = S.get('theme', 'light'); // With default

// Other methods
S.has('user');       // Check existence
S.remove('user');    // Delete key
S.keys();            // List all Domma keys
S.clear();           // Clear all Domma data
```

## Demo & Showcase

```bash
# Run the demo
npm run demo

# Run the showcase (comprehensive examples)
npm run showcase
```

## MiniApps

Real-world, production-ready applications built with Domma.

🚀 **[Explore All MiniApps](http://domma.dcbw-it.co.uk/miniapps/)** - Try them live!

### My Garage

Vehicle management system with DVLA integration for UK registration lookups.

- Look up any UK vehicle by registration number
- Display MOT and tax status
- Save vehicle history with Domma.storage
- **Try it:** [My Garage Live](http://domma.dcbw-it.co.uk/miniapps/garage/)

### Domma Docs

Powerful document editor with rich text formatting and export capabilities.

- Rich text editing with toolbar (bold, italic, lists, headings)
- Document management (save, open, delete)
- Export to PDF, HTML, and Markdown
- Auto-save with Domma.storage
- **Try it:** [Domma Docs Live](http://domma.dcbw-it.co.uk/miniapps/docs/)

### Nexus

Project management and collaboration platform.

- Task tracking and assignment
- Team collaboration tools
- Real-time updates
- **Try it:** [Nexus Live](http://domma.dcbw-it.co.uk/miniapps/nexus/)

## Documentation

### For Claude Code Development

Domma uses distributed CLAUDE.md files for focused, context-specific guidance:

- [`CLAUDE.md`](./CLAUDE.md) - Main meta-file with project overview
- [`src/CLAUDE.md`](./src/CLAUDE.md) - Core modules development guide
- [`src/bundles/CLAUDE.md`](./src/bundles/CLAUDE.md) - Custom bundle creation
- Showcase-specific guides in `/public/showcase/*/CLAUDE.md`:
  - [Showcase Meta Guide](./public/showcase/CLAUDE.md)
  - [DOM](./public/showcase/dom/CLAUDE.md), [Utils](./public/showcase/utils/CLAUDE.md), [Dates](./public/showcase/dates/CLAUDE.md), [Models](./public/showcase/models/CLAUDE.md)
  - [Tables](./public/showcase/tables/CLAUDE.md), [Elements](./public/showcase/elements/CLAUDE.md), [Config](./public/showcase/config/CLAUDE.md)
  - [HTTP](./public/showcase/http/CLAUDE.md), [Storage](./public/showcase/storage/CLAUDE.md), [Developer Tools](./public/showcase/theme-roller/CLAUDE.md)

### For Users

- [`docs/GettingStarted.md`](./docs/GettingStarted.md) - Quick start guide
- [`docs/API.md`](./docs/API.md) - Complete API reference
- [`docs/DommaDocumentation.md`](./docs/DommaDocumentation.md) - Comprehensive documentation
- [Showcase](./public/showcase/index.html) - 40+ interactive examples

### For Contributors

- Build system: See `npm run build` and `rollup.config.js`
- Testing: Open `tests/test.html` in browser or run `npm test`
- Custom bundles: See [`src/bundles/CLAUDE.md`](./src/bundles/CLAUDE.md)

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

**MiniApps:**

```bash
npm run build:miniapps              # Build all miniapps
npm run build:miniapp:garage        # Build specific miniapp
NODE_ENV=production npm run build   # Production build
```

## Bundle Size

| Bundle | Size | Description |
|--------|------|-------------|
| **full** | 390KB | Complete framework with all modules |
| **minimal** | 163KB | DOM + Utils + Dates only |
| **essentials** | 328KB | Core + Models + Elements + Config |
| **data-focused** | 190KB | Core + Models + Tables + HTTP + Storage |
| **no-ui** | 41KB | Core utilities without UI components |

All sizes are minified. Choose the bundle that fits your needs!

## Browser Support

Modern browsers (ES6+)

## License

ISC
