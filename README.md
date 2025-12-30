# Domma

**D**ynamic **O**bject **M**anipulation & **M**odeling **A**PI

A lightweight, zero-dependency JavaScript framework combining jQuery-style DOM manipulation, Lodash utilities, and
modern UI components in one cohesive package.

## Features

- **DOM Manipulation** - jQuery-compatible API with 90+ methods
- **Utilities** - 120+ Lodash-compatible utility functions
- **Dates** - Moment.js-style chainable date manipulation
- **Models** - Reactive data models with pub/sub events
- **Elements** - UI components (modals, tabs, accordions, tooltips)
- **Tables** - DataTable-like functionality (sort, filter, paginate, export)
- **HTTP Client** - Simple async HTTP requests
- **Config Engine** - Declarative JSON-based behavior configuration

## Installation

### Via npm (Recommended)

To install Domma-js in your project:

```bash
npm install domma-js@alpha
```

Then, import it into your JavaScript:

```javascript
import Domma, { $, _, M, D } from 'domma-js';
```

Or use CommonJS:

```javascript
const Domma = require('domma-js');
const { $, _, M, D } = Domma;
```

### Via jsDelivr CDN

For quick integration, you can directly include Domma-js from jsDelivr in your HTML. Always specify the version to
ensure stability.

```html
<!-- CSS (include these in your <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/domma-js@0.3.0-a/public/dist/domma.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/domma-js@0.3.0-a/public/dist/grid.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/domma-js@0.3.0-a/public/dist/elements.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/domma-js@0.3.0-a/public/dist/themes/domma-themes.css">

<!-- JavaScript (include before your closing </body> tag) -->
<script src="https://cdn.jsdelivr.net/npm/domma-js@0.3.0-a/public/dist/domma.min.js"></script>
```

### Local Files (UMD and ES Module)

You can also download the distribution files and host them yourself.

**Browser (UMD):**

```html
<script src="dist/domma.min.js"></script>
```

**ES Module:**

```javascript
import Domma, { $, _, M, D } from './dist/domma.esm.js';
```

## Short Aliases

| Namespace | Full Path      | Alias | Description                   |
|-----------|----------------|-------|-------------------------------|
| DOM       | `Domma()`      | `$`   | jQuery-style DOM manipulation |
| Utils     | `Domma.utils`  | `_`   | Lodash-style utilities        |
| Models    | `Domma.models` | `M`   | Reactive models & pub/sub     |
| Dates     | `Domma.dates`  | `D`   | Date manipulation             |

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

## Config Engine

Define behavior declaratively with JSON:

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

### Elements (`Domma.elements`)

UI components with JavaScript interactivity.

```javascript
// Modal
const modal = Domma.elements.modal('#dialog', {
    backdrop: true,
    keyboard: true,
    onOpen: () => console.log('Opened')
});
modal.open();
modal.close();

// Tabs
const tabs = Domma.elements.tabs('#product-tabs', {
    activeIndex: 0,
    onChange: (index) => loadContent(index)
});

// Accordion
const accordion = Domma.elements.accordion('#faq', {
    multiExpand: false
});

// Tooltip
Domma.elements.tooltip('.help-icon', {
    content: 'Click for help',
    position: 'top'
});
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

## Demo & Showcase

```bash
# Run the demo
npm run demo

# Run the showcase (comprehensive examples)
npm run showcase
```

## MiniApps

Real-world, production-ready applications built with Domma:

### My Garage

Vehicle management system with DVLA integration for UK registration lookups.

- Look up any UK vehicle by registration number
- Display MOT and tax status
- Save vehicle history with Domma.storage
- **Status:** Coming Soon
- **Repository:** [domma-garage](https://github.com/yourusername/domma-garage)

### Domma Docs

Powerful document editor with rich text formatting and export capabilities.

- Rich text editing with toolbar (bold, italic, lists, headings)
- Document management (save, open, delete)
- Export to PDF, HTML, and Markdown
- Auto-save with Domma.storage
- **Status:** Coming Soon
- **Repository:** [domma-docs](https://github.com/yourusername/domma-docs)

### Invoicing System

Complete invoicing solution for freelancers and small businesses.

- Create and manage invoices with line items
- Client database with full CRUD operations
- Invoice tracking and status management
- Professional PDF export
- Dashboard and reporting
- **Status:** Coming Soon
- **Repository:** [domma-invoicing](https://github.com/yourusername/domma-invoicing)

**Learn More:** Visit the [MiniApps Hub](./public/miniapps/index.html) to explore all available applications.

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

~125KB minified (includes all namespaces)

## Browser Support

Modern browsers (ES6+)

## License

ISC
