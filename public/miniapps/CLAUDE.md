# CLAUDE.md - MiniApps Development Guide

This file provides comprehensive guidance for building MiniApps in the Domma ecosystem.

## What are MiniApps?

MiniApps are self-contained, production-ready applications built entirely with Domma. They demonstrate real-world usage
patterns and serve as reference implementations for common application types.

**Current MiniApps:**

- **Docs** - Document editor with rich text, version history, and folder management
- **Garage** - Vehicle management system with DVLA API integration
- **Nexus** - Contact manager with offline sync (in development)

## Directory Structure

### Standard MiniApp Structure

```
miniapps/
├── appname/
│   ├── index.html           # Main HTML file
│   ├── src/
│   │   ├── app.js           # Main application class
│   │   └── [modules].js     # Additional modules (optional)
│   └── dist/
│       └── app.min.js       # Built/minified bundle
├── shared/
│   └── config.js            # Shared API configuration
└── index.html               # MiniApps launcher page
```

### Example Apps

**Modular Approach (Docs):**

```
docs/
├── index.html
├── src/
│   ├── app.js              # Main DocsApp class (2582 lines)
│   ├── folders.js          # FolderManager class
│   ├── versions.js         # VersionHistory class
│   ├── templates.js        # DocumentTemplates
│   ├── find-replace.js     # Find/replace functionality
│   └── error-handler.js    # ErrorHandler class
└── dist/
    └── app.min.js
```

**Single-File Approach (Garage):**

```
garage/
├── index.html
├── src/
│   └── app.js              # GarageApp class (878 lines)
└── dist/
    └── app.min.js
```

**Schema-Driven Approach (Nexus):**

```
nexus/
├── index.html
├── src/
│   ├── app.js              # NexusApp class (458 lines)
│   ├── storage.js          # NexusStorage with offline sync
│   └── schemas.js          # Form schemas (Forma-style)
└── dist/
    └── app.min.js
```

---

## Required Standards

### 1. Always Use Domma

**All MiniApps MUST use Domma modules wherever applicable:**

| Module   | Alias            | Required Usage                                           |
|----------|------------------|----------------------------------------------------------|
| DOM      | `$`              | DOM selection, manipulation, events                      |
| Utils    | `_`              | Array/object operations, debouncing, string manipulation |
| Dates    | `D()`            | Date formatting, manipulation, relative times            |
| Storage  | `S`              | localStorage operations                                  |
| Elements | `Domma.elements` | UI components (modals, toasts, tooltips, etc.)           |
| Forms    | `Domma.forms`    | Form generation and CRUD operations                      |
| HTTP     | `Domma.http`     | API calls (or use `fetch()` with auth headers)           |
| Auth     | `Domma.auth`     | Authentication (REQUIRED)                                |
| Icons    | `Domma.icons`    | SVG icon rendering                                       |

**Example:**

```javascript
// ✅ Good - Uses Domma
$('#button').on('click', async () => {
  const data = _.groupBy(items, 'category');
  const formattedDate = D().format('YYYY-MM-DD');
  S.set('cache', data);
  Domma.elements.toast('Success!', { type: 'success' });
});

// ❌ Bad - Not using Domma
document.getElementById('button').addEventListener('click', async () => {
  // Manual implementation instead of Domma
});
```

### 2. Use Domma.auth (Global Authentication)

**ALL MiniApps MUST use the centralised `Domma.auth` module for authentication.**

This provides:

- Single sign-on across all MiniApps
- Consistent auth UI
- Token management
- Session persistence
- Automatic header injection

### 3. Import Shared Configuration

**Import the shared config for API URL detection:**

```javascript
import config from '../shared/config.js';

// config.apiUrl - Auto-detects dev (localhost:3000) vs production (/api)
// config.isDevelopment() - Returns true if running locally
// config.isProduction() - Returns true if in production
```

**Shared config implementation:**

```javascript
// shared/config.js
const isLocal = window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1';

export const config = {
  apiUrl: isLocal ? 'http://localhost:3000/api' : '/api',
  environment: isLocal ? 'development' : 'production',
  version: '%%APP_VERSION%%',
  isDevelopment() { return isLocal; },
  isProduction() { return !isLocal; }
};
```

### 4. Scan Icons After DOM Updates

**Always scan for icons after DOM updates:**

```javascript
// After appending/updating HTML with data-icon attributes
$('#container').html(template);

// Scan for icons
if (Domma.icons) {
  Domma.icons.scan();
}
```

---

## Authentication Pattern

### Full Authentication Template

```javascript
class MyApp {
  constructor() {
    this.config = config;
    this.init();
  }

  async init() {
    // 1. Initialise Domma.auth
    Domma.auth.init({
      apiUrl: this.config.apiUrl
    });

    // 2. Set up auth event listeners
    Domma.auth.on('login', () => this.handleLogin());
    Domma.auth.on('register', () => this.handleLogin());
    Domma.auth.on('logout', () => this.handleLogout());
    Domma.auth.on('tokenExpired', () => this.handleTokenExpired());
    Domma.auth.on('error', (message) => {
      Domma.elements.toast(message, { type: 'error' });
    });

    // 3. Check authentication status
    if (Domma.auth.isAuthenticated()) {
      await this.showApp();
    } else {
      this.showAuth();
    }

    // 4. Scan icons
    if (Domma.icons) {
      Domma.icons.scan();
    }
  }

  showAuth() {
    $('#authSection').css('display', 'block');
    $('#appSection').css('display', 'none');
  }

  showApp() {
    $('#authSection').css('display', 'none');
    $('#appSection').css('display', 'block');

    // Load app data
    this.loadData();
  }

  handleLogin() {
    Domma.elements.toast('Welcome back!', { type: 'success' });
    this.showApp();
  }

  handleLogout() {
    this.showAuth();
    // Clear app data if needed
  }

  handleTokenExpired() {
    Domma.elements.toast('Session expired. Please log in again.', {
      type: 'warning'
    });
    this.showAuth();
  }

  async loadData() {
    try {
      const response = await fetch(`${this.config.apiUrl}/data`, {
        headers: Domma.auth.getHeaders()  // Includes Authorization header
      });

      if (!response.ok) throw new Error('Failed to load data');

      const data = await response.json();
      this.renderData(data);
    } catch (error) {
      Domma.elements.toast(error.message, { type: 'error' });
    }
  }
}

// Initialise app
new MyApp();
```

### Authentication HTML Template

```html
<!-- Auth Section -->
<div id="authSection" style="display: block;">
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center">My App</h2>
            <!-- Domma.auth handles login/register UI -->
            <div id="authContainer"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- App Section -->
<div id="appSection" style="display: none;">
  <!-- Your app UI here -->
</div>
```

---

## HTTP Approaches

MiniApps can use either approach depending on the use case:

### Approach 1: Domma.http (Recommended)

**Use for general API calls:**

```javascript
// GET request
const users = await Domma.http.get('/users');

// POST request
const newUser = await Domma.http.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT request
const updated = await Domma.http.put(`/users/${id}`, userData);

// DELETE request
await Domma.http.delete(`/users/${id}`);
```

**Note:** `Domma.http` automatically includes auth headers if `Domma.auth` is initialised.

### Approach 2: Native fetch() with Auth Headers

**Use when you need more control:**

```javascript
async loadData() {
  try {
    const response = await fetch(`${this.config.apiUrl}/data`, {
      method: 'GET',
      headers: Domma.auth.getHeaders()  // Returns { 'Authorization': 'Bearer token' }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Load failed:', error);
    throw error;
  }
}
```

### Approach 3: Domma.forms.crud() (Data-Driven Apps)

**Use for form-based CRUD applications:**

```javascript
import { contactSchema } from './schemas.js';

// Initialise CRUD with schema
const crud = Domma.forms.crud('#crudContainer', contactSchema, {
  apiUrl: `${config.apiUrl}/contacts`,
  onCreate: (data) => console.log('Created:', data),
  onUpdate: (data) => console.log('Updated:', data),
  onDelete: (id) => console.log('Deleted:', id)
});

// CRUD automatically handles:
// - Form generation from schema
// - Validation
// - API calls (GET, POST, PUT, DELETE)
// - Loading states
// - Error handling
```

**Schema Example:**

```javascript
export const contactSchema = {
  title: 'Contact',
  apiUrl: '/contacts',  // Relative to config.apiUrl
  fields: [
    {
      name: 'firstName',
      type: 'string',
      label: 'First Name',
      required: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      validation: {
        pattern: '^[^@]+@[^@]+\\.[^@]+$',
        message: 'Please enter a valid email'
      }
    }
  ]
};
```

---

## Error Handling Patterns

### Pattern 1: Inline Error Handling

```javascript
async saveData(data) {
  try {
    const result = await Domma.http.post('/data', data);
    Domma.elements.toast('Saved successfully!', { type: 'success' });
    return result;
  } catch (error) {
    Domma.elements.toast(`Error: ${error.message}`, { type: 'error' });
    console.error('Save failed:', error);
    return null;
  }
}
```

### Pattern 2: Centralised Error Handler (Docs App)

```javascript
// error-handler.js
export class ErrorHandler {
  static handle(error, context = '') {
    const message = error.message || 'An error occurred';
    console.error(`[${context}]`, error);

    Domma.elements.toast(message, {
      type: 'error',
      duration: 5000
    });
  }

  static async handleAsync(fn, context = '') {
    try {
      return await fn();
    } catch (error) {
      this.handle(error, context);
      return null;
    }
  }
}

// Usage
const data = await ErrorHandler.handleAsync(
  () => Domma.http.get('/data'),
  'Load Data'
);
```

---

## Common UI Patterns

### Loading States

```javascript
async loadData() {
  // Show loader
  const loader = Domma.elements.fullscreenLoader('Loading...');

  try {
    const data = await Domma.http.get('/data');
    this.renderData(data);
  } catch (error) {
    Domma.elements.toast(error.message, { type: 'error' });
  } finally {
    // Hide loader
    loader.hide();
  }
}
```

### Toast Notifications

```javascript
// Success
Domma.elements.toast('Operation successful!', { type: 'success' });

// Error
Domma.elements.toast('Something went wrong', { type: 'error' });

// Warning
Domma.elements.toast('Please save your work', { type: 'warning' });

// Info
Domma.elements.toast('New version available', { type: 'info' });
```

### Confirmation Dialogs

```javascript
async deleteItem(id) {
  const confirmed = await Domma.elements.confirm(
    'Are you sure you want to delete this item?',
    { title: 'Confirm Delete', confirmText: 'Delete', cancelText: 'Cancel' }
  );

  if (confirmed) {
    await Domma.http.delete(`/items/${id}`);
    Domma.elements.toast('Item deleted', { type: 'success' });
    this.loadItems();
  }
}
```

### Alert Dialogs

```javascript
await Domma.elements.alert('Your session is about to expire', {
  title: 'Session Expiring'
});
```

### Prompt Dialogs

```javascript
const name = await Domma.elements.prompt('Enter item name:', {
  title: 'New Item',
  inputPlaceholder: 'Item name',
  inputValue: ''
});

if (name) {
  await this.createItem({ name });
}
```

---

## Vendoring Policy

### Default: Use Central Distribution

**Recommended approach - reference central Domma files:**

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="../../dist/domma.css">
  <link rel="stylesheet" href="../../dist/grid.css">
  <link rel="stylesheet" href="../../dist/elements.css">
  <link rel="stylesheet" href="../../dist/themes/domma-themes.css">
</head>
<body>
  <script type="module" src="../../dist/domma.min.js"></script>
  <script type="module" src="./src/app.js"></script>
</body>
</html>
```

### Vendoring for Offline/Bundled Apps

**Allowed for apps that need self-contained deployment:**

```
garage/
├── index.html
├── vendor/
│   └── domma/
│       ├── domma.css
│       ├── domma.min.js
│       ├── elements.css
│       ├── grid.css
│       └── themes/
│           └── domma-themes.css
├── src/
│   └── app.js
└── dist/
    └── app.min.js
```

**If vendoring:**

1. Copy from `../../dist/` to `vendor/domma/`
2. Document Domma version in README or comments
3. Update references in HTML:
   ```html
   <link rel="stylesheet" href="vendor/domma/domma.css">
   <script src="vendor/domma/domma.min.js"></script>
   ```

---

## Build Process

### Entry Point

**Create a main app.js file:**

```javascript
// src/app.js
import config from '../shared/config.js';

class MyApp {
  constructor() {
    // App initialisation
  }
}

// Auto-initialise when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new MyApp());
} else {
  new MyApp();
}
```

### Build Configuration (Rollup)

**Example rollup.config.js:**

```javascript
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'public/miniapps/myapp/src/app.js',
  output: {
    file: 'public/miniapps/myapp/dist/app.min.js',
    format: 'iife',
    name: 'MyApp'
  },
  plugins: [
    terser({
      compress: {
        drop_console: false
      }
    })
  ]
};
```

### NPM Scripts

**Add to package.json:**

```json
{
  "scripts": {
    "build:miniapp:myapp": "rollup -c rollup.config.myapp.js",
    "build:miniapps": "npm run build:miniapp:docs && npm run build:miniapp:garage && npm run build:miniapp:nexus"
  }
}
```

---

## Complete Minimal Example

### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My MiniApp</title>
  <link rel="stylesheet" href="../../dist/domma.css">
  <link rel="stylesheet" href="../../dist/grid.css">
  <link rel="stylesheet" href="../../dist/elements.css">
  <link rel="stylesheet" href="../../dist/themes/domma-themes.css">
</head>
<body>
  <!-- Auth Section -->
  <div id="authSection">
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title text-center">My MiniApp</h2>
              <div id="authContainer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- App Section -->
  <div id="appSection" style="display: none;">
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>My MiniApp</h1>
        <button id="logoutBtn" class="btn btn-outline-primary">
          <span data-icon="log-out"></span> Logout
        </button>
      </div>
      <div id="content"></div>
    </div>
  </div>

  <script type="module" src="../../dist/domma.min.js"></script>
  <script type="module" src="./src/app.js"></script>
</body>
</html>
```

### src/app.js

```javascript
import config from '../shared/config.js';

class MyApp {
  constructor() {
    this.config = config;
    this.init();
  }

  async init() {
    // Initialise auth
    Domma.auth.init({ apiUrl: this.config.apiUrl });
    Domma.auth.on('login', () => this.handleLogin());
    Domma.auth.on('logout', () => this.handleLogout());
    Domma.auth.on('tokenExpired', () => this.handleTokenExpired());

    // Check auth status
    if (Domma.auth.isAuthenticated()) {
      await this.showApp();
    } else {
      this.showAuth();
    }

    // Set up logout button
    $('#logoutBtn').on('click', () => Domma.auth.logout());

    // Scan icons
    if (Domma.icons) Domma.icons.scan();
  }

  showAuth() {
    $('#authSection').css('display', 'block');
    $('#appSection').css('display', 'none');
  }

  async showApp() {
    $('#authSection').css('display', 'none');
    $('#appSection').css('display', 'block');
    await this.loadData();
  }

  handleLogin() {
    Domma.elements.toast('Welcome!', { type: 'success' });
    this.showApp();
  }

  handleLogout() {
    this.showAuth();
  }

  handleTokenExpired() {
    Domma.elements.toast('Session expired', { type: 'warning' });
    this.showAuth();
  }

  async loadData() {
    try {
      const data = await Domma.http.get('/data');
      this.renderData(data);
    } catch (error) {
      Domma.elements.toast(error.message, { type: 'error' });
    }
  }

  renderData(data) {
    const html = data.map(item => `
      <div class="card mb-2">
        <div class="card-body">
          <h3>${_.escape(item.title)}</h3>
          <p>${_.escape(item.description)}</p>
          <small class="text-muted">${D(item.createdAt).fromNow()}</small>
        </div>
      </div>
    `).join('');

    $('#content').html(html);
    if (Domma.icons) Domma.icons.scan();
  }
}

// Auto-initialise
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new MyApp());
} else {
  new MyApp();
}
```

---

## Testing Your MiniApp

### Local Development

1. **Ensure backend is running** (if using API):
   ```bash
   cd domma-backend
   npm start  # Runs on localhost:3000
   ```

2. **Open your MiniApp**:
   ```
   http://localhost:8000/miniapps/myapp/
   ```

3. **Check browser console** for errors

4. **Test authentication flow**:
    - Register new account
    - Log in
    - Test token expiry (backend config)
    - Log out

### Production Testing

1. **Build your app**:
   ```bash
   npm run build:miniapp:myapp
   ```

2. **Verify minified bundle** exists in `dist/`

3. **Test with production API** (update `shared/config.js` if needed)

---

## Common Patterns Reference

### Date Formatting

```javascript
// Relative time
D(date).fromNow();           // "2 hours ago"

// Formatted date
D(date).format('D MMM YYYY'); // "8 Jan 2025"
D(date).format('HH:mm');      // "14:30"
```

### Storage Operations

```javascript
// Save data
S.set('userData', { name: 'John', role: 'admin' });

// Retrieve data
const user = S.get('userData');

// Remove data
S.remove('userData');

// Check existence
if (S.has('userData')) { /* ... */ }

// Clear all (Domma-prefixed keys only)
S.clear();
```

### Array Operations

```javascript
// Group by property
const grouped = _.groupBy(items, 'category');

// Unique values
const unique = _.uniq(items);

// Sort by property
const sorted = _.orderBy(items, ['name'], ['asc']);

// Chunk array
const chunks = _.chunk(items, 10);
```

### Debouncing

```javascript
// Debounce search
const debouncedSearch = _.debounce((query) => {
  this.search(query);
}, 300);

$('#searchInput').on('input', (e) => {
  debouncedSearch(e.target.value);
});
```

---

## Cross-References

- **Main Project**: [/CLAUDE.md](../../CLAUDE.md) - Project overview and documentation index
- **Core Modules**: [/src/CLAUDE.md](../../src/CLAUDE.md) - Domma module APIs and architecture
- **Showcase Examples**: [/public/showcase/CLAUDE.md](../showcase/CLAUDE.md) - Feature demonstrations

### Specific Module Documentation

- [DOM API](../../src/CLAUDE.md#domjs---jquery-compatible-dom-api) - jQuery-compatible methods
- [Utils API](../../src/CLAUDE.md#utilsjs---120-lodash-compatible-utilities) - Lodash utilities
- [Dates API](../../src/CLAUDE.md#datesjs---momentjs-style-date-manipulation) - Date manipulation
- [Models API](../../src/CLAUDE.md#modelsjs---reactive-models--pubsub) - Reactive models
- [Elements API](../../src/CLAUDE.md#elementsjs---ui-components) - UI components
- [Forms API](../../docs/API.md#forms) - Form generation and CRUD
- [Storage API](../../src/CLAUDE.md#storagejs---localstorage-wrapper) - Storage wrapper

---

## Best Practices

1. **Always use Domma** - Leverage the framework for consistency
2. **Centralised auth** - Use `Domma.auth` for all authentication
3. **Shared config** - Import from `../shared/config.js`
4. **Icon scanning** - Call `Domma.icons.scan()` after DOM updates
5. **Error handling** - Use try/catch and toast notifications
6. **Loading states** - Show loaders during async operations
7. **Debouncing** - Use `_.debounce()` for search/input handlers
8. **Date formatting** - Use `D()` for consistent date display
9. **Storage** - Use `S` for localStorage operations
10. **Code organisation** - Split large apps into modules

---

## Quick Checklist for New MiniApps

- [ ] Import shared config from `../shared/config.js`
- [ ] Initialise `Domma.auth` with `config.apiUrl`
- [ ] Set up auth event listeners (login, logout, tokenExpired)
- [ ] Show/hide auth and app sections based on auth status
- [ ] Use `Domma.auth.getHeaders()` for API calls
- [ ] Use `$`, `_`, `D()`, `S` instead of native methods
- [ ] Call `Domma.icons.scan()` after DOM updates
- [ ] Handle errors with toast notifications
- [ ] Show loading states during async operations
- [ ] Test with both local and production API
- [ ] Build minified bundle to `dist/`
- [ ] Document any vendored dependencies
