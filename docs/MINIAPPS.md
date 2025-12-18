# Domma MiniApps

**Production-ready applications built with the Domma framework**

## What are MiniApps?

MiniApps are full-featured, production-ready applications built entirely with the Domma framework. They demonstrate
real-world usage patterns and best practices whilst providing genuinely useful functionality.

Unlike typical framework examples or demos, MiniApps are:

- **Production-ready**: Fully functional applications you can use immediately
- **Feature-complete**: Real implementations with authentication, data persistence, and proper error handling
- **Open source**: MIT licensed and available on GitHub for study and modification
- **Educational**: Demonstrate best practices and advanced Domma patterns

## Available MiniApps

### My Garage

**Status**: ✅ Available Now
**URL**: [/miniapps/garage/](/miniapps/garage/)
**GitHub**: [darryl-dcbw/domma-garage](https://github.com/darryl-dcbw/domma-garage)

Vehicle management system with DVLA integration for UK registration lookups, MOT/tax checking, and saved vehicles.

**Features**:

- DVLA registration lookup (UK vehicles)
- MOT & tax status checking with expiry dates
- Vehicle history tracking
- Save vehicles to your personal garage
- Real-time search and filtering
- User authentication with JWT
- 24-hour caching to reduce API calls

**Domma Modules Used**:

- `Domma.http` - API calls to backend
- `Domma.storage` - Local data persistence
- `Domma.auth` - User authentication and session management
- `Domma.icons` - SVG icon system

**Backend Requirements**:

- Node.js/Express backend with PostgreSQL
- DVLA API integration
- JWT authentication
- Available at: [darryl-dcbw/domma-backend](https://github.com/darryl-dcbw/domma-backend)

---

### Domma Docs

**Status**: 🚧 Coming Soon
**URL**: _Not yet available_

A powerful document editor with rich text formatting, markdown support, and export capabilities.

**Planned Features**:

- Rich text editing with formatting toolbar
- Document management (save, open, delete)
- Export to PDF, HTML, and Markdown
- Auto-save with browser storage
- Keyboard shortcuts
- Syntax highlighting for code blocks

**Domma Modules Planned**:

- `Domma.storage` - Document persistence
- `Domma.elements` - UI components

---

### Domma Invoicing

**Status**: 🚧 Coming Soon
**URL**: _Not yet available_

Complete invoicing solution for freelancers and small businesses with client management and PDF export.

**Planned Features**:

- Create & manage invoices
- Client database with full CRUD
- Invoice tracking & status management
- Professional PDF export
- Dashboard & reporting
- Email integration

**Domma Modules Planned**:

- `Domma.models` - Reactive data models
- `Domma.tables` - DataTable functionality
- `Domma.auth` - User authentication

---

## Building Your Own MiniApp

### Getting Started

Creating a MiniApp with Domma is straightforward. Here's the basic structure:

```html
<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>My MiniApp</title>

  <!-- Domma Core Styles -->
  <link rel="stylesheet" href="../dist/domma.css">
  <link rel="stylesheet" href="../dist/grid.css">
  <link rel="stylesheet" href="../dist/elements.css">
  <link rel="stylesheet" href="../dist/themes/domma-themes.css">

  <!-- Domma Core -->
  <script src="../dist/domma.min.js" defer></script>
</head>
<body data-theme="default">

<main class="container">
  <!-- Your app content here -->
</main>

<script>
  // Initialize your app
  const MyApp = {
    async init() {
      console.log('App initialized');

      // Scan for icons
      if (Domma.icons) {
        Domma.icons.scan();
      }
    }
  };

  // Start when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    MyApp.init();
  });
</script>

</body>
</html>
```

### Environment Configuration

MiniApps use build-time environment variables for optimal performance and security.

#### Using the Shared Config Module

```javascript
import config from '../../miniapps/shared/config.js';

const MyApp = {
    async init() {
        // Use environment-aware API URL
        Domma.auth.init({ apiUrl: config.apiUrl });

        // Check environment
        if (config.isDevelopment()) {
            console.log('Development mode');
        }

        // Access version
        console.log('App version:', config.version);
    }
};
```

#### Building for Different Environments

```bash
# Development (default) - uses http://localhost:3001/api
npm run build:miniapp:garage

# Production - uses https://domma.dcbw-it.co.uk:3000/api
NODE_ENV=production npm run build:miniapp:garage

# Custom API URL
API_URL=https://staging.example.com/api npm run build:miniapp:garage
```

#### How It Works

1. Source files contain placeholders: `%%API_URL%%`, `%%NODE_ENV%%`
2. During build, Rollup replaces placeholders with actual values
3. Output contains hardcoded URLs for zero runtime overhead
4. Each environment gets its own optimized build

#### Environment URLs

- **Development**: `http://localhost:3001/api`
- **Production**: `https://domma.dcbw-it.co.uk:3000/api`

Configuration values are replaced at build time, so there's no runtime overhead or exposed configuration in the browser.

### Using Domma.auth

All MiniApps can use the authentication module for user management. Here's how:

#### 1. Initialize Auth Module

```javascript
// In your app's init() method
Domma.auth.init({
  apiUrl: 'http://localhost:3001/api'  // Your backend API URL
});
```

#### 2. Listen to Auth Events

```javascript
// Handle login event
Domma.auth.on('login', (user) => {
  console.log('User logged in:', user);
  showApp();
});

// Handle logout event
Domma.auth.on('logout', () => {
  console.log('User logged out');
  showAuth();
});

// Handle token expiration
Domma.auth.on('tokenExpired', () => {
  showAuth();
  showAlert('Session expired. Please login again.', 'error');
});

// Handle errors
Domma.auth.on('error', (message) => {
  showAlert(message, 'error');
});
```

#### 3. Create Login/Register Forms

```javascript
// Setup event listeners for forms
$('#loginForm').on('submit', async (e) => {
  e.preventDefault();
  const email = $('#loginEmail').val();
  const password = $('#loginPassword').val();

  try {
    await Domma.auth.login(email, password);
    // Success handled by 'login' event listener
  } catch (error) {
    // Error handled by 'error' event listener
  }
});

$('#registerForm').on('submit', async (e) => {
  e.preventDefault();
  const name = $('#registerName').val();
  const email = $('#registerEmail').val();
  const password = $('#registerPassword').val();

  try {
    await Domma.auth.register(email, password, name);
    // Success handled by 'register' event listener
  } catch (error) {
    // Error handled by 'error' event listener
  }
});

$('#logoutBtn').on('click', () => {
  Domma.auth.logout();
  // Success handled by 'logout' event listener
});
```

#### 4. Check Authentication Status

```javascript
// Check if user is authenticated
if (Domma.auth.isAuthenticated()) {
  showApp();
} else {
  showAuth();
}

// Get current user
const user = Domma.auth.getUser();
if (user) {
  console.log('Current user:', user.email);
}
```

#### 5. Add Auth Headers to API Calls

```javascript
// Automatically include auth headers in fetch calls
const response = await fetch(`${apiUrl}/api/data`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...Domma.auth.getHeaders()  // Adds: 'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({data: 'example'})
});
```

### Using Domma.storage

Persist data locally using browser localStorage:

```javascript
// Save data
S.set('myData', {name: 'Alice', role: 'admin'});

// Retrieve data
const data = S.get('myData');  // { name: 'Alice', role: 'admin' }

// Get with default
const theme = S.get('theme', 'light');  // Returns 'light' if not found

// Check if key exists
if (S.has('userData')) {
  console.log('User data exists');
}

// Remove data
S.remove('myData');

// Clear all Domma storage
S.clear();
```

### Using Domma.http

Make HTTP requests with automatic JSON handling:

```javascript
// GET request
const data = await Domma.http.get('/api/users');

// POST request
const response = await Domma.http.post('/api/users', {
  name: 'Alice',
  email: 'alice@example.com'
});

// PUT request
const updated = await Domma.http.put('/api/users/123', {
  name: 'Alice Updated'
});

// DELETE request
await Domma.http.delete('/api/users/123');
```

### Using UI Components

Domma provides rich UI components for common patterns:

```javascript
// Create a modal
const modal = Domma.elements.modal('#myModal', {
  backdrop: true,
  backdropClose: true,
  onOpen: () => console.log('Modal opened'),
  onClose: () => console.log('Modal closed')
});

modal.open();

// Create tabs
const tabs = Domma.elements.tabs('#myTabs', {
  activeIndex: 0,
  onChange: (index, tab) => {
    console.log('Tab changed:', index);
  }
});

// Show alert dialog
const confirmed = await Domma.elements.confirm(
  'Are you sure you want to delete this item?',
  {title: 'Confirm Deletion'}
);

if (confirmed) {
  // User clicked OK
}

// Show loading spinner
const loader = Domma.elements.loader('#container', {
  text: 'Loading...',
  type: 'spinner'
});

loader.show();
// ... do async work
loader.hide();
```

## Best Practices

### 1. Structure Your Code

Organise your app using a simple object pattern:

```javascript
const MyApp = {
  apiUrl: 'http://localhost:3001/api',
  currentData: null,

  async init() {
    // Initialize modules
    Domma.auth.init({apiUrl: this.apiUrl});

    // Setup event listeners
    this.setupEventListeners();

    // Check authentication
    if (Domma.auth.isAuthenticated()) {
      await this.loadData();
      this.showApp();
    } else {
      this.showAuth();
    }
  },

  setupEventListeners() {
    // Bind events
  },

  async loadData() {
    // Load app data
  },

  showApp() {
    // Show main app UI
  },

  showAuth() {
    // Show auth UI
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MyApp.init();
});
```

### 2. Handle Errors Gracefully

Always provide user feedback for errors:

```javascript
try {
  await Domma.auth.login(email, password);
} catch (error) {
  showAlert(error.message || 'Login failed', 'error');
}
```

### 3. Use Event-Driven Architecture

Listen to Domma module events rather than calling methods directly:

```javascript
// Good - Event-driven
Domma.auth.on('login', () => {
  loadUserData();
  showDashboard();
});

// Not ideal - Imperative
await Domma.auth.login(email, password);
loadUserData();
showDashboard();
```

### 4. Leverage Domma's Grid System

Use the responsive grid for layouts:

```html

<div class="container">
  <div class="row g-4">
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card">Card 1</div>
    </div>
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card">Card 2</div>
    </div>
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card">Card 3</div>
    </div>
  </div>
</div>
```

### 5. Use Icons Consistently

Leverage Domma's icon system:

```html
<span data-icon="search" data-icon-size="20"></span>
<button class="btn btn-primary">
  <span data-icon="save" data-icon-size="16"></span>
  Save
</button>
```

Don't forget to scan for icons after DOM changes:

```javascript
// After adding new icons to the DOM
Domma.icons.scan();
```

## Backend Requirements

Most MiniApps require a backend API for data persistence and authentication.

### Recommended Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful with JSON responses

### API Endpoints

A typical MiniApp backend should provide:

#### Authentication

```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
GET  /api/auth/me       - Get current user (requires auth)
```

#### Data Operations

```
GET    /api/resource       - List resources
GET    /api/resource/:id   - Get resource
POST   /api/resource       - Create resource
PUT    /api/resource/:id   - Update resource
PATCH  /api/resource/:id   - Partial update
DELETE /api/resource/:id   - Delete resource
```

### Example Backend Setup

See the [domma-backend](https://github.com/darryl-dcbw/domma-backend) repository for a complete reference implementation
with:

- User authentication with JWT
- PostgreSQL database with migrations
- DVLA API integration example
- Rate limiting
- Request caching
- Error handling

## Deployment

### Frontend Deployment

MiniApps are static HTML/JS/CSS and can be deployed anywhere:

- **GitHub Pages**: Free hosting for static sites
- **Netlify**: Automatic deployments from git
- **Vercel**: Zero-config deployments
- **Cloudflare Pages**: Fast global CDN
- **AWS S3 + CloudFront**: Scalable static hosting

### Backend Deployment

Recommended hosting options:

- **Railway**: Easy Node.js deployment
- **Render**: Free tier with PostgreSQL
- **Heroku**: Well-established PaaS
- **DigitalOcean App Platform**: Simple VPS alternative
- **AWS Elastic Beanstalk**: Auto-scaling production hosting

## Requirements

### Browser Support

MiniApps work in all modern browsers:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Dependencies

- **Domma Framework**: `domma.min.js` (v0.8.0+)
- **Optional Backend**: Node.js 18+ with Express and PostgreSQL

### Development Tools

Recommended for development:

- Code editor (VS Code, WebStorm, etc.)
- Modern browser with DevTools
- Git for version control
- Node.js for backend development

## Examples & Resources

### Code Examples

All MiniApp source code is available on GitHub:

- [My Garage](https://github.com/darryl-dcbw/domma-garage) - Complete vehicle management app
- [Backend API](https://github.com/darryl-dcbw/domma-backend) - Reference backend implementation

### Documentation

- [Domma Documentation](/docs/DommaDocumentation.md) - Complete framework reference
- [API Reference](/docs/API.md) - Detailed API documentation
- [Getting Started](/docs/GettingStarted.md) - Quick start guide

### Community

- **GitHub Issues**: Report bugs or request features
- **Discussions**: Ask questions and share ideas
- **Pull Requests**: Contribute improvements

## Licence

All MiniApps are released under the **MIT Licence**, allowing you to:

- Use commercially
- Modify and adapt
- Distribute freely
- Incorporate into proprietary software

See the [LICENCE](../LICENCE) file for details.

---

**Ready to build?** Start with the [My Garage source code](https://github.com/darryl-dcbw/domma-garage) or create your
own from scratch using the examples above.
