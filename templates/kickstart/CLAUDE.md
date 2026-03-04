# CLAUDE.md - Domma Framework Reference

**CRITICAL: This project uses Domma, NOT jQuery.**

This file provides guidance to Claude Code when working with this Domma-based project.

## What is Domma?

**D**ynamic **O**bject **M**anipulation & **M**odeling **A**PI

Domma is a lightweight, zero-dependency JavaScript framework combining jQuery-style DOM manipulation, Lodash utilities, and modern UI components.

## Critical Reminders

1. **This is Domma, NOT jQuery** - While the API is jQuery-compatible, always reference it as "Domma"
2. **Use aliases** - Prefer `$()`, `_`, `M`, `B`, etc. over full names like `Domma.utils`
3. **CSS load order matters** - See section below for correct order
4. **Check .claude/snippets.md** - Contains quick-reference code patterns
5. **Check blueprints/** - Pre-built schemas for common data structures

## Aliases Quick Reference

| Alias | Full Path        | Description                      |
|-------|------------------|----------------------------------|
| `$`   | `Domma()`        | DOM selection/manipulation       |
| `_`   | `Domma.utils`    | Utility functions (120+ methods) |
| `M`   | `Domma.models`   | Reactive models & pub/sub        |
| `B`   | Blueprint        | Blueprint composition (extend, pick, omit) |
| `D()` | `Domma.dates()`  | Date manipulation                |
| `S`   | `Domma.storage`  | localStorage wrapper             |
| `A`   | `Domma.auth`     | Authentication (JWT, roles, events) |
| `F`   | `Domma.forms`    | Form builder (blueprints, CRUD)  |
| `H`   | `Domma.http`     | HTTP client (promises)           |
| `E`   | `Domma.elements` | UI components (22 total)         |
| `I`   | `Domma.icons`    | SVG icon system (200+ icons)     |
| `T`   | `Domma.tables`   | DataTable functionality          |
| -     | `Domma.sanitize` | XSS protection (DOMPurify)       |
| -     | `Domma.theme`    | Theme management (16 themes)     |

**Usage:**
```javascript
$('#app').html('Hello World');                // DOM manipulation
const sorted = _.sortBy(items, 'name');      // Utilities
const model = M.create(blueprint);           // Reactive model
const contactForm = B.extend(base, extra);   // Blueprint composition
const user = await A.login(email, password); // Authentication
const safe = Domma.sanitize.sanitize(html);  // XSS protection
I.scan();                                     // Render icons
Domma.theme.set('ocean-dark');               // Set theme
```

## CSS Load Order (CRITICAL)

**Always load CSS in this order:**

```html
<!-- 1. Base styles + utilities -->
<link rel="stylesheet" href="https://dommajs.org/dist/domma.css">

<!-- 2. Grid system -->
<link rel="stylesheet" href="https://dommajs.org/dist/grid.css">

<!-- 3. UI components -->
<link rel="stylesheet" href="https://dommajs.org/dist/elements.css">

<!-- 4. Theming (optional but recommended) -->
<link rel="stylesheet" href="https://dommajs.org/dist/themes/domma-themes.css">
```

**Why?** Each layer builds on the previous one. Loading out of order will cause style conflicts.

## JavaScript Modules

### DOM (`$` / `Domma()`)

90+ jQuery-compatible methods:

```javascript
// Selection & traversal
$('#app').find('.item').addClass('active');
$('.card').parent().css('background', '#f5f5f5');

// Content manipulation
$('#title').html('New Title');
$('input[name="email"]').val('user@example.com');

// Events (with delegation support)
$('#list').on('click', '.item', function(e) {
    $(this).toggleClass('selected');
});

// Effects
$('.modal').fadeIn(300);
$('.alert').slideUp();
```

**Key Methods:** `find()`, `children()`, `parent()`, `closest()`, `html()`, `text()`, `val()`, `addClass()`, `removeClass()`, `on()`, `off()`, `fadeIn()`, `slideUp()`, `animate()`

### Utils (`_` / `Domma.utils`)

120+ Lodash-compatible utilities:

```javascript
// Array operations
_.chunk([1,2,3,4,5], 2);              // [[1,2], [3,4], [5]]
_.uniq([1,2,2,3,3,3]);                // [1, 2, 3]

// Collection operations
_.groupBy(users, 'role');             // { admin: [...], user: [...] }
_.sortBy(products, 'price');          // Sort by property

// Object operations
_.get(user, 'profile.address.city', 'Unknown');
_.pick(user, ['id', 'name', 'email']);
_.merge(defaults, userConfig);

// Function utilities
const search = _.debounce(query => api.search(query), 300);
const throttledScroll = _.throttle(handleScroll, 100);

// Template rendering
const template = _.template('<h1>{{title}}</h1>');
template({ title: 'Hello World' });   // <h1>Hello World</h1>
```

**Categories:** Array (30+), Collection (20+), Function (20), Object (30+), Lang (18), String (24), Math (14)

### Blueprints & Models (`M`, `B`)

**Blueprints** define data structure once, use everywhere (forms, models, CRUD):

```javascript
// Define blueprint
const userBlueprint = {
    name: {
        type: 'string',
        required: true,
        minLength: 2,
        label: 'Full Name',
        formConfig: { placeholder: 'John Doe' }
    },
    email: {
        type: 'email',
        required: true,
        label: 'Email Address'
    },
    age: {
        type: 'number',
        min: 18,
        max: 120,
        label: 'Age'
    }
};

// Composition methods (B alias)
const contactBlueprint = B.extend(userBlueprint, {
    phone: { type: 'string', label: 'Phone' },
    message: { type: 'textarea', label: 'Message' }
});

const publicProfile = B.omit(userBlueprint, ['email']);
const essentials = B.pick(userBlueprint, ['name', 'email']);

// Create reactive model
const user = M.create(userBlueprint, {
    name: 'Alice',
    email: 'alice@example.com',
    age: 25
});

// Model methods
user.get('name');                     // 'Alice'
user.set('age', 26);                  // Updates with validation
user.validate();                      // Returns validation errors
user.toJSON();                        // Export as plain object

// React to changes
user.onChange('age', (newVal, oldVal) => {
    console.log(`Age changed from ${oldVal} to ${newVal}`);
});

// Persistence (auto-save to localStorage)
const settings = M.create(blueprint, data, { persist: 'app-settings' });
```

**Blueprint Types:** `'string'`, `'number'`, `'boolean'`, `'email'`, `'url'`, `'date'`, `'array'`, `'object'`, `'textarea'`, `'select'`, `'radio'`, `'checkbox-group'`

### Forms (`F` / `Domma.forms`)

Generate forms from blueprints:

```javascript
// Simple form
F.render('#contact-form', contactBlueprint, {}, {
    layout: 'stacked',        // 'stacked', 'grid', 'inline'
    submitText: 'Send',
    onSubmit: (data) => {
        console.log('Form data:', data);
    }
});

// Modal form
F.modal(contactBlueprint, {
    title: 'Contact Us',
    submitText: 'Send Message',
    onSave: async (data) => {
        await H.post('/api/contact', data);
        E.toast('Message sent!', { type: 'success' });
    }
});

// Wizard (multi-step form)
F.wizard('#wizard', [
    { title: 'Personal', blueprint: personalBlueprint },
    { title: 'Account', blueprint: accountBlueprint },
    { title: 'Preferences', blueprint: prefsBlueprint }
], {
    onComplete: (data) => {
        console.log('All steps:', data);
    }
});

// Complete CRUD
F.crud('#users-crud', userBlueprint, {
    title: 'User Management',
    apiEndpoint: '/api/users',
    columns: ['name', 'email', 'age']
});
```

### Elements (`E` / `Domma.elements`)

22 UI components:

```javascript
// Modal
const modal = E.modal('#my-modal', {
    backdrop: true,
    keyboard: true,
    onOpen: () => console.log('Opened')
});
modal.open();

// Toast notifications
E.toast('Success!', { type: 'success', duration: 3000 });
E.toast('Error occurred', { type: 'danger' });

// Dialogs (Promise-based)
if (await E.confirm('Delete this item?')) {
    // User clicked OK
}

const name = await E.prompt('Enter your name:');

// Tabs
E.tabs('#my-tabs', {
    activeIndex: 0,
    onChange: (index) => console.log(`Tab ${index} active`)
});

// Tooltip
E.tooltip('.info-icon', {
    content: 'Helpful information',
    position: 'top',
    trigger: 'hover'
});

// Loader
const loader = E.loader('#content', {
    type: 'spinner',
    text: 'Loading...',
    overlay: true
});
loader.show();
// ... async operation
loader.hide();
```

**All Components:** Modal, Tabs, Accordion, Tooltip, Carousel, Card, Dropdown, Toast, Dialog, Loader, Badge, BackToTop, ButtonGroup, Breadcrumbs, Navbar, Sidebar, Footer, hero, Slideover, Progression, Autocomplete, Pillbox

### Tables (`T` / `Domma.tables`)

DataTable-like functionality:

```javascript
const table = T.create('#my-table', {
    data: users,
    columns: [
        { field: 'name', title: 'Name', sortable: true },
        { field: 'email', title: 'Email' },
        { field: 'role', title: 'Role', sortable: true }
    ],
    pagination: true,
    pageSize: 10,
    selectable: true,
    striped: true,
    evenRowColor: 'lighter',
    oddRowColor: 'light'
});

// Table methods
table.search('john');                 // Filter rows
table.sort('name', 'asc');           // Sort column
table.addRow({ name: 'Bob', email: 'bob@ex.com', role: 'user' });
table.getSelected();                  // Get selected rows
table.download('csv', 'users.csv');  // Export data
```

### HTTP (`H` / `Domma.http`)

Promise-based HTTP client:

```javascript
// GET request
const users = await H.get('/api/users');

// POST with data
const newUser = await H.post('/api/users', {
    name: 'Alice',
    email: 'alice@example.com'
});

// PUT (update)
await H.put('/api/users/123', { name: 'Alice Updated' });

// DELETE
await H.delete('/api/users/123');

// With error handling
try {
    const data = await H.get('/api/data');
} catch (error) {
    E.toast('Failed to load data', { type: 'danger' });
}
```

### Storage (`S` / `Domma.storage`)

localStorage wrapper with auto JSON handling:

```javascript
// Set data (auto-stringified)
S.set('user', { name: 'Alice', role: 'admin' });

// Get data (auto-parsed)
const user = S.get('user');           // { name: 'Alice', role: 'admin' }
const theme = S.get('theme', 'light'); // Default value

// Check & remove
if (S.has('user')) {
    S.remove('user');
}

// List all keys & clear
S.keys();                             // ['domma:user', 'domma:theme', ...]
S.clear();                            // Clear all Domma keys
```

### Dates (`D()` / `Domma.dates`)

Moment.js-style date manipulation:

```javascript
// Create dates
const now = D();
const birthday = D('1990-05-15');
const timestamp = D(1609459200000);

// Format
now.format('YYYY-MM-DD');            // '2025-01-23'
now.format('MMM DD, YYYY');          // 'Jan 23, 2025'

// Manipulate
now.add(7, 'days');
now.subtract(1, 'month');
now.startOf('week');

// Compare
if (birthday.isBefore(now)) {
    console.log('Birthday has passed');
}

// Relative time
birthday.fromNow();                  // '35 years ago'
```

### Auth (`A` / `Domma.auth`)

JWT-based authentication with automatic token management:

```javascript
// Initialize auth module
A.init({
    apiUrl: 'https://api.example.com',
    storageKey: 'auth_token',      // localStorage key
    autoCheck: true                // Auto-verify token on init
});

// Login
try {
    const user = await A.login('user@example.com', 'password');
    console.log('Logged in:', user);
    E.toast('Welcome back!', { type: 'success' });
} catch (error) {
    E.toast('Login failed', { type: 'danger' });
}

// Register
const newUser = await A.register('user@example.com', 'password', 'John Doe');

// Check authentication
if (A.isAuthenticated()) {
    console.log('User:', A.getUser());
    console.log('Role:', A.getRole());
}

// Role checking
if (A.isAdmin()) {
    // Admin-only features
}

if (A.hasRole('subscriber')) {
    // Subscriber features
}

if (A.hasAnyRole(['admin', 'moderator'])) {
    // Multiple roles
}

// Get headers for API requests
const headers = A.getHeaders();  // { Authorization: 'Bearer <token>' }
await H.get('/api/protected', { headers });

// Logout
A.logout();
E.toast('Logged out', { type: 'info' });

// Listen to auth events
A.on('login', (user) => {
    console.log('User logged in:', user);
});

A.on('logout', () => {
    window.location.href = '/login';
});

A.on('tokenExpired', () => {
    E.toast('Session expired. Please login again.', { type: 'warning' });
});
```

**Auth Methods:**
- `init(config)` - Initialize with API URL and options
- `login(email, password)` - Authenticate user
- `register(email, password, name)` - Register new user
- `logout()` - Clear session
- `getUser()` - Get current user object
- `isAuthenticated()` - Check if logged in
- `getHeaders()` - Get Authorization headers
- `getRole()` - Get user role
- `hasRole(role)` - Check specific role
- `hasAnyRole(roles)` - Check multiple roles
- `isAdmin()`, `isSubscriber()`, `isGuest()` - Role helpers

**Events:** `'login'`, `'logout'`, `'register'`, `'error'`, `'tokenExpired'`

### Sanitize (`Domma.sanitize`)

XSS protection for user-generated content:

```javascript
// Basic sanitization (with DOMPurify if available)
const clean = Domma.sanitize.sanitize(userInput);
$('#content').html(clean);

// Preset: Basic (only b, i, em, strong, br)
const basic = Domma.sanitize.sanitizeBasic(userInput);

// Preset: Strict (for user-generated content)
// Allows: b, i, em, strong, p, br, a, ul, ol, li
const strict = Domma.sanitize.sanitizeUserContent(userInput);

// Complete HTML escape (no tags allowed)
const escaped = Domma.sanitize.escape(userInput);

// Custom configuration
const custom = Domma.sanitize.sanitize(userInput, {
    preset: 'default',           // 'default', 'strict', 'basic'
    allowedTags: ['p', 'a'],     // Override allowed tags
    allowedAttrs: ['href'],      // Override allowed attributes
    allowDataAttrs: false        // Allow data-* attributes
});

// Check if DOMPurify is loaded
if (Domma.sanitize.hasDOMPurify()) {
    console.log('Using DOMPurify for robust XSS protection');
} else {
    console.log('Using HTML escape fallback');
}
```

**Presets:**
- `'default'` - Full HTML support (paragraphs, lists, links, tables, images, semantic tags)
- `'strict'` - User content only (basic formatting + links + lists)
- `'basic'` - Minimal formatting (bold, italic, emphasis, line breaks)

**Security Note:** For best protection, include DOMPurify before Domma:
```html
<script src="https://cdn.jsdelivr.net/npm/dompurify@3/dist/purify.min.js"></script>
<script src="https://dommajs.org/dist/domma.min.js"></script>
```

### Theme (`Domma.theme`)

Dynamic theme management with 16 built-in themes:

```javascript
// Initialize with theme
Domma.theme.init({
    theme: 'ocean-dark',         // Specific theme
    autoDetect: true,            // Respect system preference
    persist: true                // Save to localStorage
});

// Set theme
Domma.theme.set('forest-light');
Domma.theme.set('sunset-dark');

// Get current theme
const current = Domma.theme.get();        // 'ocean-dark'
const base = Domma.theme.getBase();       // 'ocean'
const mode = Domma.theme.getMode();       // 'dark'

// Check mode
if (Domma.theme.isDark()) {
    console.log('Dark mode active');
}

// Toggle between light/dark variants
Domma.theme.toggle();  // ocean-dark → ocean-light

// Listen to theme changes
$(document.body).on('themechange', (e) => {
    console.log('Theme changed to:', e.detail.theme);
});
```

**Available Themes (16 total):**
- **Ocean:** `ocean-light`, `ocean-dark` - Blue ocean tones
- **Forest:** `forest-light`, `forest-dark` - Green nature tones
- **Sunset:** `sunset-light`, `sunset-dark` - Warm orange/red tones
- **Royal:** `royal-light`, `royal-dark` - Purple/violet tones
- **Lemon:** `lemon-light`, `lemon-dark` - Yellow/citrus tones
- **Silver:** `silver-light`, `silver-dark` - Cool gray tones
- **Charcoal:** `charcoal-light`, `charcoal-dark` - Professional gray (default)
- **Christmas:** `christmas-light`, `christmas-dark` - Festive red/green
- **Grayve:** `grayve-light`, `grayve-dark` - Monochrome slate theme
- **Core:** `core-light` - Minimal, clean theme

### Icons (`I` / `Domma.icons`)

SVG icon system with 200+ icons in 15 categories:

```javascript
// Scan for data-icon attributes (recommended)
I.scan();  // Scan entire document
I.scan('#container');  // Scan specific container

// Use in HTML
<span data-icon="check"></span>
<span data-icon="user" data-icon-size="32"></span>
<span data-icon="heart" data-icon-color="#ff0000"></span>

// Render icon programmatically
const icon = I.render('check', {
    size: 24,
    color: '#28a745',
    class: 'custom-icon'
});
$('#container').append(icon);

// Inject into existing element
I.inject('#my-button', 'download', { size: 20 });
```

**Icon Categories (200+ total):**
- **UI:** check, x, plus, minus, chevron-*, arrow-*, menu, etc.
- **Files:** file, folder, document, image, code, etc.
- **Media:** play, pause, stop, volume, camera, etc.
- **Communication:** mail, message, phone, bell, etc.
- **Social:** facebook, twitter, github, linkedin, etc.
- **E-commerce:** shopping-cart, credit-card, tag, etc.
- **Weather:** sun, moon, cloud, rain, snow, etc.
- **Transportation:** car, plane, ship, bicycle, etc.
- **Health:** heart, activity, thermometer, pill, etc.
- **Business:** briefcase, calendar, clock, chart, etc.
- **Security:** lock, unlock, shield, key, eye, etc.
- **Navigation:** home, map, compass, location, etc.
- **Devices:** smartphone, tablet, laptop, monitor, etc.
- **Editing:** edit, trash, save, copy, paste, etc.
- **Misc:** star, bookmark, flag, gift, trophy, etc.

**Methods:**
- `scan(container)` - Auto-inject icons from data-icon attributes
- `render(name, options)` - Create SVG element
- `inject(selector, name, options)` - Replace element with icon

**Options:**
- `size` - Icon size in pixels (default: 24)
- `color` - Icon color (default: currentColor)
- `class` - Additional CSS classes

## Common Patterns

### Page Initialization

```javascript
// Wait for DOM ready
$.ready(() => {
    // Initialize icons
    I.scan();

    // Setup theme
    Domma.theme.init({ theme: 'ocean-dark', persist: true });

    // Initialize components
    E.modal('#welcome-modal').open();
});
```

### Form Handling with Models

```javascript
// Create model from blueprint
const user = M.create(userBlueprint);

// Bind to form (two-way binding)
M.bind(user, 'name', '#name-input');
M.bind(user, 'email', '#email-input');

// React to changes
user.onChange('email', (newEmail) => {
    console.log('Email changed:', newEmail);
});

// Submit
$('#user-form').on('submit', async (e) => {
    e.preventDefault();

    const errors = user.validate();
    if (errors.length > 0) {
        E.toast('Please fix errors', { type: 'danger' });
        return;
    }

    await H.post('/api/users', user.toJSON());
    E.toast('User created!', { type: 'success' });
});
```

### CRUD in 3 Lines

```javascript
// That's it! Complete CRUD with table, forms, API integration
F.crud('#users', userBlueprint, {
    apiEndpoint: '/api/users',
    columns: ['name', 'email', 'role']
});
```

### Reactive Data Binding

```javascript
const settings = M.create(settingsBlueprint, {}, { persist: 'app-settings' });

// Two-way binding
M.bind(settings, 'theme', '#theme-select');
M.bind(settings, 'notifications', '#notifications-toggle');

// Changes auto-save to localStorage
settings.onChange(() => {
    console.log('Settings updated:', settings.toJSON());
});
```

## Anti-Patterns (Don't Do This)

### ❌ Wrong: Using jQuery

```javascript
// NEVER reference jQuery
import $ from 'jquery';              // Wrong!
console.log('Using jQuery...');      // Wrong!
```

### ✅ Correct: Using Domma

```javascript
// Always reference Domma
import Domma, { $ } from 'domma-js';
console.log('Using Domma...');       // Correct!
```

### ❌ Wrong: Manual Form Generation

```javascript
// Don't manually build forms
const html = `
    <input name="name" />
    <input name="email" />
    <button>Submit</button>
`;
```

### ✅ Correct: Blueprint-Driven Forms

```javascript
// Use blueprints and let Domma handle it
F.render('#form', blueprint, {}, { submitText: 'Save' });
```

### ❌ Wrong: Ignoring CSS Load Order

```javascript
// Don't load CSS randomly
<link href="elements.css" />
<link href="domma.css" />
<link href="grid.css" />
```

### ✅ Correct: Proper CSS Order

```html
<!-- Base → Grid → Elements → Themes -->
<link href="domma.css" />
<link href="grid.css" />
<link href="elements.css" />
<link href="themes/domma-themes.css" />
```

## Project Structure

```
{{projectName}}/
├── frontend/
│   ├── index.html           # Main entry point
│   ├── js/
│   │   └── app.js          # Application logic
│   ├── css/
│   │   └── custom.css      # Custom styles
│   └── types/
│       └── domma.d.ts      # TypeScript definitions
├── backend/                 # Optional backend
├── blueprints/              # Reusable data schemas
│   ├── common/
│   ├── forms/
│   └── crud/
├── .claude/                 # Claude Code settings
│   ├── settings.json
│   └── snippets.md
└── domma.config.json        # Domma configuration
```

## Documentation Resources

- **Official Website:** https://dommajs.org
- **API Reference:** https://dommajs.org/docs/API.md
- **Showcase:** https://dommajs.org/showcase/ (40+ examples)
- **Blueprints Guide:** https://dommajs.org/docs/Blueprints.md
- **Getting Started:** https://dommajs.org/docs/GettingStarted.md

## Quick Tips

1. **Check snippets first** - See `.claude/snippets.md` for ready-to-use code patterns
2. **Reuse blueprints** - Check `blueprints/` directory before creating new ones
3. **Use composition** - Leverage `B.extend()`, `B.pick()`, `B.omit()` to build complex schemas
4. **Validate early** - Use `model.validate()` before API calls
5. **Leverage CRUD** - `F.crud()` handles create, read, update, delete with minimal code
6. **Icons everywhere** - Use `data-icon="icon-name"` and call `I.scan()` to render SVG icons
7. **Toast for feedback** - `E.toast()` provides instant user feedback
8. **Dialogs for confirmation** - Use `await E.confirm()` instead of browser `confirm()`

## Need Help?

- Check `.claude/snippets.md` for code examples
- Check `blueprints/` for pre-built schemas
- Visit https://dommajs.org/showcase/ for live demos
- Read the full API docs at https://dommajs.org/docs/API.md
