---
title: Router
description: "Hash-based SPA routing with middleware support, view lifecycle hooks, and navigation events."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Router" tagline="Hash-based SPA routing with middleware support, view lifecycle hooks, and navigation events." align="center"][/hero]

## Overview

`Domma.router` provides hash-based client-side routing for single-page applications (SPAs). Build dynamic, multi-page experiences without full page reloads.

> **Alias:** Use `R` as a shorthand for `Domma.router`

### Key Features

- **Hash-based routing** - Works without server configuration (#/path)
- **Dynamic route parameters** - Extract params from URLs (/user/:id)
- **View lifecycle hooks** - onEnter, onMount, onLeave for component control
- **Middleware & guards** - Authentication, logging, and access control
- **Smooth transitions** - Fade animations between views
- **Pub/Sub events** - Integration with Domma's event system
- **Template rendering** - Works with Domma's template engine

## API Reference

[table striped="true"]
| Method | Signature | Description |
| --- | --- | --- |
| `init()` | `R.init(options)` | Initialise router with container, routes, and views |
| `navigate()` | `R.navigate(path, options)` | Navigate to a route programmatically |
| `back()` | `R.back()` | Go back in browser history |
| `forward()` | `R.forward()` | Go forward in browser history |
| `current()` | `R.current()` | Get current route information |
| `route()` | `R.route(config)` | Add a single route definition |
| `view()` | `R.view(name, viewDef)` | Register a view (template or function) |
| `use()` | `R.use(middleware)` | Add middleware function for route guards |
| `destroy()` | `R.destroy()` | Clean up router and remove listeners |
[/table]

### Config Options

```javascript
{
    container: '#app',           // View container selector
    routes: [                    // Route definitions
        { path: '/', view: 'home', title: 'Home' },
        { path: '/about', view: 'about', title: 'About' },
        { path: '/user/:id', view: 'user', title: 'User Profile' }
    ],
    views: {                     // View registry
        home: homeView,
        about: aboutView,
        user: userView
    },
    default: '/',                // Default route
    notFound: '404',             // 404 view name
    transitions: {               // Transition config
        enter: 'fadeIn',
        leave: 'fadeOut',
        duration: 200
    }
}
```

## Basic Setup

Initialise the router with views and routes:

### 1. Define Views

```javascript
// Simple string template
const homeView = {
    template: `
        <div class="page-home">
            <h1>Welcome Home</h1>
            <p>This is the home page.</p>
        </div>
    `
};

// View with lifecycle hooks
const aboutView = {
    template: `
        <div class="page-about">
            <h1>About Us</h1>
            <p>Learn more about our company.</p>
        </div>
    `,

    // Called after view is mounted in DOM
    onMount($container) {
        console.log('About view mounted');
        // Initialise components, bind events, etc.
    }
};

// View registry
const views = {
    home: homeView,
    about: aboutView
};
```

### 2. Initialise Router

```javascript
R.init({
    container: '#app',
    routes: [
        { path: '/', view: 'home', title: 'Home' },
        { path: '/about', view: 'about', title: 'About' }
    ],
    views: views,
    transitions: { duration: 300 }
});

// Router is now active and listening for hash changes
```

### 3. Navigation Links

```html
<nav>
    <a href="#/">Home</a>
    <a href="#/about">About</a>
</nav>

<div id="app">
    <!-- Views render here -->
</div>
```

## Template Files

Keep your HTML markup separate from JavaScript logic using external template files. The `templateUrl` and `partials` properties allow you to load templates from separate `.html` files, improving maintainability and code organisation.

> **Why templateUrl?** Large HTML strings in JavaScript files are hard to maintain, lack syntax highlighting, and mix concerns. External template files solve these problems while keeping your views clean and focused on logic.

### The Problem: Inline Template Strings

```javascript
// ❌ Hard to maintain - 50+ lines of HTML in a string
const homeView = {
    template: `
        <div class="home-page">
            <header class="hero">
                <h1>Welcome to Our Site</h1>
                <p>Discover amazing content...</p>
            </header>
            <section class="features">
                <div class="feature-card">...</div>
                <div class="feature-card">...</div>
                <div class="feature-card">...</div>
            </section>
            <section class="stats">...</section>
            <section class="testimonials">...</section>
            <footer>...</footer>
        </div>
    ` // 50+ more lines...
};
```

### The Solution: External Template Files

```javascript
// ✅ Clean and maintainable
const homeView = {
    templateUrl: 'js/views/templates/home.html',

    onMount($container) {
        console.log('Home view mounted');
        I.scan($container[0]);
    }
};
```

### Template Variables

Templates support Mustache-style syntax for dynamic content. The router uses Domma's template engine (`_.render()`) to render variables, conditionals, and loops.

```html
<!-- js/views/templates/user.html -->
<div class="user-profile">
    <h1>{{name}}</h1>
    <p>Email: {{email}}</p>

    {{#if premium}}
        <span class="badge badge-gold">Premium Member</span>
    {{/if}}

    <h3>Recent Posts</h3>
    <ul>
        {{#each posts}}
            <li>{{this.title}} - {{this.date}}</li>
        {{/each}}
    </ul>
</div>
```

```javascript
// View with template data
const userView = {
    templateUrl: 'js/views/templates/user.html',

    async onEnter(params) {
        // Fetch user data
        const user = await H.get(`/api/users/${params.id}`);

        // Store data for template rendering
        this.templateData = {
            name: user.name,
            email: user.email,
            premium: user.tier === 'premium',
            posts: user.recentPosts
        };
    }
};
```

### Partials - Reusable Template Sections

Use partials to share common sections across multiple views. Partials are loaded in parallel with the main template for optimal performance.

```javascript
// View with partials
const dashboardView = {
    templateUrl: 'js/views/templates/dashboard.html',

    partials: {
        'header': 'js/views/templates/partials/header.html',
        'sidebar': 'js/views/templates/partials/sidebar.html',
        'stats-card': 'js/views/templates/partials/stats-card.html'
    },

    onMount($container) {
        I.scan($container[0]);
    }
};
```

```html
<!-- js/views/templates/dashboard.html -->
<div class="dashboard">
    {{> header}}

    <div class="dashboard-layout">
        {{> sidebar}}

        <main class="dashboard-content">
            <h2>Statistics</h2>
            <div class="stats-grid">
                {{> stats-card}}
                {{> stats-card}}
                {{> stats-card}}
            </div>
        </main>
    </div>
</div>
```

```html
<!-- js/views/templates/partials/header.html -->
<header class="app-header">
    <h1>{{appName}}</h1>
    <nav>
        <a href="#/">Home</a>
        <a href="#/dashboard">Dashboard</a>
    </nav>
</header>
```

### Template Caching

Templates are fetched once and cached for the session. Subsequent navigations to the same view use the cached template, improving performance. The cache is cleared on hard refresh.

```javascript
// First navigation: Fetches template from server
R.navigate('/home');  // HTTP request for home.html

// Second navigation: Uses cached template
R.navigate('/about'); // No request
R.navigate('/home');  // No request - uses cache
```

### Recommended File Organisation

Store templates alongside your view logic for easy maintenance:

```plaintext
js/views/
├── home.js                    # View logic
├── about.js
├── contact.js
└── templates/
    ├── home.html              # Template markup
    ├── about.html
    ├── contact.html
    └── partials/
        ├── header.html         # Reusable sections
        ├── footer.html
        └── stats-card.html
```

### Path Resolution

All template paths are relative to the HTML page serving your SPA (not the JavaScript file). If your SPA is at `/index.html`, template paths resolve from the site root.

```javascript
// If your SPA is at: https://example.com/index.html
const view = {
    // Loads from: https://example.com/js/views/templates/home.html
    templateUrl: 'js/views/templates/home.html'
};

// If your SPA is at: https://example.com/app/index.html
const view = {
    // Loads from: https://example.com/app/js/views/templates/home.html
    templateUrl: 'js/views/templates/home.html'
};
```

### Complete Example

```javascript
// js/views/contact.js
export const contactView = {
    templateUrl: 'js/views/templates/contact.html',

    partials: {
        'form-header': 'js/views/templates/partials/form-header.html'
    },

    onMount($container) {
        // Scan for icons
        I.scan($container[0]);

        // Bind form submit
        $container.find('#contact-form').on('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: $('#name').val(),
                email: $('#email').val(),
                message: $('#message').val()
            };

            try {
                await H.post('/api/contact', formData);
                E.toast('Message sent!', { type: 'success' });
                R.navigate('/thank-you');
            } catch (err) {
                E.toast('Error: ' + err.message, { type: 'error' });
            }
        });
    },

    onLeave() {
        // Clean up event listeners
        $('#contact-form').off('submit');
    }
};
```

## Route Parameters

Extract dynamic segments from URLs:

### Define Dynamic Routes

```javascript
// Route with :id parameter
R.route({
    path: '/user/:id',
    view: 'user',
    title: 'User Profile'
});

// Route with multiple parameters
R.route({
    path: '/post/:category/:slug',
    view: 'post',
    title: 'Blog Post'
});
```

### Access Parameters in Views

```javascript
const userView = {
    // Function template - receives params
    template: async (params) => {
        // params.id contains the :id from URL
        const userId = params.id;

        // Fetch user data
        const user = await H.get(`/api/users/${userId}`);

        return `
            <div class="page-user">
                <h1>${user.name}</h1>
                <p>Email: ${user.email}</p>
                <p>User ID: ${params.id}</p>
            </div>
        `;
    },

    onMount($container) {
        console.log('User view mounted');
    }
};

// Navigate: R.navigate('/user/123')
// params = { id: '123' }
```

### Multiple Parameters

```javascript
const postView = {
    template: (params) => {
        // params = { category: 'tech', slug: 'my-post' }
        return `
            <div class="page-post">
                <h1>Category: ${params.category}</h1>
                <h2>Slug: ${params.slug}</h2>
            </div>
        `;
    }
};

// URL: #/post/tech/my-post
// params = { category: 'tech', slug: 'my-post' }
```

## View Lifecycle Hooks

Control view behavior with lifecycle hooks:

### onEnter - Before Rendering

```javascript
const profileView = {
    template: `<div id="profile"></div>`,

    // Called before view renders
    async onEnter(params) {
        console.log('Entering profile view', params);

        // Fetch data, validate auth, etc.
        const user = await H.get(`/api/users/${params.id}`);

        // Can return false to cancel navigation
        if (!user) {
            E.toast('User not found', { type: 'error' });
            return false;  // Cancel navigation
        }

        // Store data for template
        this.userData = user;
    }
};
```

### onMount - After Rendering

```javascript
const dashboardView = {
    template: `
        <div class="dashboard">
            <button id="refresh-btn">Refresh</button>
            <div id="data-container"></div>
        </div>
    `,

    // Called after view is in DOM
    onMount($container) {
        console.log('Dashboard mounted');

        // Initialise components
        E.tooltip($container.find('[data-tooltip]'));

        // Bind event handlers
        $container.find('#refresh-btn').on('click', () => {
            this.refreshData();
        });

        // Start intervals/timers
        this.interval = setInterval(() => {
            this.updateStats();
        }, 5000);
    }
};
```

### onLeave - Before Leaving

```javascript
const editorView = {
    template: `<textarea id="editor"></textarea>`,

    // Called before leaving view
    onLeave() {
        console.log('Leaving editor');

        // Clean up intervals/timers
        if (this.interval) {
            clearInterval(this.interval);
        }

        // Unbind events
        $('#editor').off('input');

        // Warn about unsaved changes
        if (this.hasUnsavedChanges) {
            const leave = confirm('You have unsaved changes. Leave anyway?');
            return leave;  // false = cancel navigation
        }
    }
};
```

### Complete Lifecycle Example

```javascript
const fullLifecycleView = {
    template: `<div class="view">Content</div>`,

    async onEnter(params) {
        // 1. Before render - fetch data, check auth
        console.log('1. onEnter', params);
        this.data = await H.get('/api/data');
    },

    onMount($container) {
        // 2. After mount - init components, bind events
        console.log('2. onMount', $container);
        $container.find('button').on('click', this.handleClick);
    },

    onLeave() {
        // 3. Before leave - cleanup, confirm navigation
        console.log('3. onLeave');
        $container.find('button').off('click');
        return true;  // Allow navigation
    }
};
```

## Middleware & Route Guards

Use middleware to protect routes, log navigation, or modify behavior:

### Authentication Guard

```javascript
// Add auth middleware
R.use((to, from, next) => {
    console.log(`Navigating from ${from?.path} to ${to.path}`);

    // Check if route requires authentication
    if (to.meta?.requiresAuth) {
        const isAuthenticated = S.get('auth_token');

        if (!isAuthenticated) {
            E.toast('Please login first', { type: 'warning' });
            R.navigate('/login');  // Redirect to login
            return;  // Don't call next() = block navigation
        }
    }

    next();  // Allow navigation
});

// Protected route
R.route({
    path: '/dashboard',
    view: 'dashboard',
    title: 'Dashboard',
    meta: { requiresAuth: true }  // Requires login
});
```

### Logging Middleware

```javascript
// Log all navigation
R.use((to, from, next) => {
    console.log('Router:', {
        from: from?.path,
        to: to.path,
        params: to.params,
        timestamp: new Date().toISOString()
    });

    next();  // Continue
});
```

### Multiple Middleware

```javascript
// Middleware runs in order

// 1. Logging
R.use((to, from, next) => {
    console.log(`Route: ${to.path}`);
    next();
});

// 2. Authentication
R.use((to, from, next) => {
    if (to.meta?.requiresAuth && !isLoggedIn()) {
        R.navigate('/login');
        return;
    }
    next();
});

// 3. Analytics
R.use((to, from, next) => {
    trackPageView(to.path);
    next();
});
```

### Role-Based Access Control

```javascript
R.use((to, from, next) => {
    const userRole = S.get('user_role');
    const requiredRole = to.meta?.role;

    if (requiredRole && userRole !== requiredRole) {
        E.toast('Access denied', { type: 'error' });
        R.navigate('/');
        return;
    }

    next();
});

// Admin-only route
R.route({
    path: '/admin',
    view: 'admin',
    title: 'Admin Panel',
    meta: { requiresAuth: true, role: 'admin' }
});
```

## Programmatic Navigation

Navigate using JavaScript instead of links:

### Navigate to Route

```javascript
// Basic navigation
R.navigate('/about');

// Navigate with parameters
R.navigate('/user/123');

// Navigate with replace (no history entry)
R.navigate('/home', { replace: true });
```

### History Navigation

```javascript
// Go back
R.back();

// Go forward
R.forward();

// Get current route
const current = R.current();
console.log(current.path);    // '/user/123'
console.log(current.params);  // { id: '123' }
```

### After Action Navigation

```javascript
// Navigate after form submission
$('#contact-form').on('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: $('#name').val(),
        email: $('#email').val()
    };

    try {
        await H.post('/api/contact', formData);
        E.toast('Message sent!', { type: 'success' });
        R.navigate('/thank-you');
    } catch (err) {
        E.toast('Error: ' + err.message, { type: 'error' });
    }
});

// Navigate after login
async function login(email, password) {
    const response = await H.post('/api/login', { email, password });
    S.set('auth_token', response.token);
    E.toast('Welcome back!', { type: 'success' });
    R.navigate('/dashboard');
}
```

## Pub/Sub Navigation Events

Router publishes events via the Models pub/sub system:

### Available Events

```javascript
// Router initialization
M.subscribe('router:ready', ({ router }) => {
    console.log('Router initialised', router);
});

// Before navigation
M.subscribe('router:beforeChange', ({ from, to }) => {
    console.log(`Leaving ${from?.path}, going to ${to.path}`);

    // Update navbar active state
    $('.nav-link').removeClass('active');
    $(`.nav-link[href="#${to.path}"]`).addClass('active');
});

// After navigation
M.subscribe('router:afterChange', ({ from, to }) => {
    console.log(`Now on ${to.path}`);

    // Track pageview
    analytics.track('pageview', { path: to.path });

    // Scroll to top
    window.scrollTo(0, 0);
});
```

### Sync Navbar with Router

```javascript
// Highlight active nav item
M.subscribe('router:afterChange', ({ to }) => {
    // Remove all active classes
    $('.nav-item').removeClass('active');

    // Add to current route
    $(`.nav-item[href="#${to.path}"]`).addClass('active');
});

// Handle nested routes
M.subscribe('router:afterChange', ({ to }) => {
    const section = to.path.split('/')[1];
    $(`.nav-item[data-section="${section}"]`).addClass('active');
});
```

### Integration with Components

```javascript
// Notify components of route changes
M.subscribe('router:afterChange', ({ to }) => {
    // Trigger breadcrumb update
    M.publish('breadcrumbs:update', { path: to.path });

    // Update sidebar
    M.publish('sidebar:select', { section: to.params.section });

    // Refresh data tables
    if (to.path.includes('/dashboard')) {
        M.publish('table:refresh');
    }
});
```

## Interactive Demo

A live mini-SPA demonstrating router features:

[showcase-demo id="showcase/router/interactive-demo" title="Interactive Demo" /]

### Demo Source Code

```javascript
// Define views with lifecycle logging
const demoViews = {
    home: {
        template: `
            <h2>🏠 Home Page</h2>
            <p>Welcome to the router demo!</p>
        `,
        onMount($el) {
            addLog('home: onMount called');
        }
    },

    about: {
        template: `
            <h2>ℹ️ About Page</h2>
            <p>This demo shows router lifecycle hooks.</p>
        `,
        onMount($el) {
            addLog('about: onMount called');
        }
    },

    user: {
        template: (params) => `
            <h2>👤 User Profile</h2>
            <p>Viewing user ID: <strong>${params.id}</strong></p>
        `,
        onEnter(params) {
            addLog(`user: onEnter with id=${params.id}`);
        },
        onMount($el) {
            addLog('user: onMount called');
        }
    }
};

// Initialise demo router
R.init({
    container: '#router-app',
    routes: [
        { path: '/demo/', view: 'home', title: 'Demo Home' },
        { path: '/demo/about', view: 'about', title: 'Demo About' },
        { path: '/demo/user/:id', view: 'user', title: 'Demo User' }
    ],
    views: demoViews
});
```

## Best Practices

### View Organization

- **Separate concerns** - Keep views in separate files/modules
- **Use templateUrl** - Use `templateUrl` for views with more than a few lines of HTML
- **Store templates** - Keep templates in `js/views/templates/` directories
- **Use partials** - Extract reusable sections into partials for sharing across views
- **Use lifecycle hooks** - Clean up in onLeave to prevent memory leaks
- **Template functions** - Use functions for dynamic content, strings for static
- **Async loading** - Fetch data in onEnter, not in templates

### Route Design

- **RESTful patterns** - Use resource-based URLs (/users, /posts/:id)
- **Descriptive paths** - Make URLs readable and meaningful
- **Consistent structure** - Follow a predictable pattern
- **Meta data** - Use route.meta for permissions, analytics tags, etc.

### Performance

- **Lazy load views** - Load view code only when needed
- **Cleanup timers** - Clear intervals/timeouts in onLeave
- **Unbind events** - Remove event listeners to prevent memory leaks
- **Cache data** - Store fetched data to avoid redundant requests

### Security

- **Validate params** - Always validate/sanitise route parameters
- **Auth middleware** - Protect routes with authentication checks
- **XSS protection** - Sanitise user-generated content in templates
- **HTTPS required** - Use secure connections in production
