# CLAUDE.md - Router Module Showcase

This file provides guidance for working with Router showcase examples.

## Router Module Overview

Accessed via `Domma.router` or the `R` alias - provides hash-based client-side routing for single-page applications with lifecycle hooks, middleware support, and smooth transitions.

## Core Concepts

### Hash-Based Routing

Uses URL hash fragments (`#/path`) for client-side navigation without server configuration or page reloads.

```javascript
// URLs use hash prefix
// https://example.com/#/
// https://example.com/#/about
// https://example.com/#/user/123
```

### Route Definitions

Routes map URL patterns to views with optional metadata:

```javascript
R.init({
    routes: [
        { path: '/', view: 'home', title: 'Home' },
        { path: '/about', view: 'about', title: 'About' },
        { path: '/user/:id', view: 'user', title: 'User Profile' },
        {
            path: '/admin',
            view: 'admin',
            title: 'Admin Panel',
            meta: { requiresAuth: true, role: 'admin' }
        }
    ]
});
```

### View Structure

Views can be strings, functions, or objects with lifecycle hooks:

```javascript
// Simple string template
const homeView = {
    template: `<h1>Home</h1><p>Welcome!</p>`
};

// Function template (receives params)
const userView = {
    template: async (params) => {
        const user = await H.get(`/api/users/${params.id}`);
        return `<h1>${user.name}</h1>`;
    }
};

// Object with lifecycle hooks
const dashboardView = {
    template: `<div id="dashboard">...</div>`,

    async onEnter(params) {
        // Before render - fetch data, validate auth
        this.data = await H.get('/api/dashboard');
    },

    onMount($container) {
        // After mount - init components, bind events
        E.tooltip($container.find('[data-tooltip]'));
        $container.find('#refresh').on('click', this.refresh);
    },

    onLeave() {
        // Before leave - cleanup, confirm navigation
        $container.find('#refresh').off('click');
        return true; // or false to cancel
    }
};
```

## Router API

### Initialization

```javascript
R.init({
    container: '#app',           // Required: view container selector
    routes: [],                  // Required: route definitions
    views: {},                   // Required: view registry
    default: '/',                // Default route path
    notFound: '404',             // 404 view name
    transitions: {               // Transition options
        enter: 'fadeIn',
        leave: 'fadeOut',
        duration: 200
    }
});
```

### Navigation Methods

```javascript
// Navigate to route
R.navigate('/about');
R.navigate('/user/123', { replace: true });

// History navigation
R.back();
R.forward();

// Get current route
const current = R.current();
console.log(current.path);     // '/user/123'
console.log(current.params);   // { id: '123' }
```

### Dynamic Registration

```javascript
// Add route at runtime
R.route({
    path: '/settings',
    view: 'settings',
    title: 'Settings'
});

// Register view at runtime
R.view('settings', {
    template: '<div>Settings</div>'
});
```

## Route Parameters

Extract dynamic segments from URLs:

```javascript
// Single parameter
R.route({
    path: '/user/:id',
    view: 'user'
});

// URL: #/user/123
// params = { id: '123' }

// Multiple parameters
R.route({
    path: '/post/:category/:slug',
    view: 'post'
});

// URL: #/post/tech/my-article
// params = { category: 'tech', slug: 'my-article' }

// Access in view
const postView = {
    template: (params) => {
        return `
            <h1>Category: ${params.category}</h1>
            <h2>Slug: ${params.slug}</h2>
        `;
    }
};
```

## Lifecycle Hooks

### onEnter(params)

Called **before** view renders. Use for:
- Fetching data
- Validating authentication
- Pre-loading resources
- Canceling navigation (return false)

```javascript
async onEnter(params) {
    const user = await H.get(`/api/users/${params.id}`);

    if (!user) {
        E.toast('User not found', { type: 'error' });
        return false;  // Cancel navigation
    }

    this.userData = user;
}
```

### onMount($container)

Called **after** view is rendered and in DOM. Use for:
- Initializing UI components
- Binding event handlers
- Starting intervals/timers
- DOM manipulation

```javascript
onMount($container) {
    // Initialise components
    E.modal($container.find('.modal'));
    E.tooltip($container.find('[data-tooltip]'));

    // Bind events
    $container.find('#submit').on('click', this.handleSubmit);

    // Start polling
    this.interval = setInterval(this.poll, 5000);
}
```

### onLeave()

Called **before** leaving view. Use for:
- Cleanup (timers, listeners)
- Confirming navigation
- Saving state

```javascript
onLeave() {
    // Cleanup
    clearInterval(this.interval);
    $('#submit').off('click');

    // Confirm unsaved changes
    if (this.hasUnsavedChanges) {
        return confirm('Discard changes?');
    }

    return true;  // Allow navigation
}
```

## Middleware & Guards

Middleware intercepts navigation for authentication, logging, etc:

```javascript
// Authentication guard
R.use((to, from, next) => {
    if (to.meta?.requiresAuth && !isAuthenticated()) {
        E.toast('Login required', { type: 'warning' });
        R.navigate('/login');
        return;  // Block navigation
    }

    next();  // Allow navigation
});

// Role-based access
R.use((to, from, next) => {
    const userRole = S.get('user_role');
    const requiredRole = to.meta?.role;

    if (requiredRole && userRole !== requiredRole) {
        R.navigate('/forbidden');
        return;
    }

    next();
});

// Logging
R.use((to, from, next) => {
    console.log(`${from?.path} → ${to.path}`);
    next();
});
```

Middleware runs in registration order. Call `next()` to continue, or don't call it to block.

## Pub/Sub Events

Router publishes events via Models pub/sub system:

### router:ready

Fired when router initialises:

```javascript
M.subscribe('router:ready', ({ router }) => {
    console.log('Router ready', router);
});
```

### router:beforeChange

Fired before navigation (before onLeave):

```javascript
M.subscribe('router:beforeChange', ({ from, to }) => {
    console.log(`Leaving ${from?.path} → ${to.path}`);

    // Update navbar active state
    $('.nav-link').removeClass('active');
    $(`.nav-link[href="#${to.path}"]`).addClass('active');
});
```

### router:afterChange

Fired after navigation completes (after onMount):

```javascript
M.subscribe('router:afterChange', ({ from, to }) => {
    console.log(`Now on ${to.path}`);

    // Track pageview
    analytics.track('pageview', { path: to.path });

    // Scroll to top
    window.scrollTo(0, 0);
});
```

## Common Patterns

### Form Submission Navigation

```javascript
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
```

### Loading States

```javascript
const loadingView = {
    template: '<div id="content"></div>',

    async onEnter(params) {
        const loader = E.loader('#content', { type: 'spinner' });
        loader.show();

        this.data = await H.get(`/api/data/${params.id}`);

        loader.hide();
    },

    onMount($container) {
        $container.find('#content').html(
            _.template(this.template)(this.data)
        );
    }
};
```

### Protected Routes

```javascript
// In router init
R.use((to, from, next) => {
    if (to.meta?.requiresAuth && !S.get('auth_token')) {
        R.navigate('/login');
        return;
    }
    next();
});

// Protected route
R.route({
    path: '/dashboard',
    view: 'dashboard',
    title: 'Dashboard',
    meta: { requiresAuth: true }
});
```

### Nested Views

```javascript
// Parent layout view
const layoutView = {
    template: `
        <div class="layout">
            <nav id="nav"></nav>
            <main id="content"></main>
        </div>
    `,

    onMount($container) {
        // Initialise nested navbar
        E.navbar('#nav', { items: navItems });
    }
};

// Child views render in #content
const pageView = {
    template: `<h1>Page Content</h1>`
};
```

### Lazy Loading Views

```javascript
const views = {
    home: homeView,
    about: aboutView,

    // Lazy load admin view
    admin: {
        template: `<div id="admin"></div>`,

        async onEnter() {
            // Load admin module only when needed
            const { AdminComponent } = await import('./admin.js');
            this.adminModule = new AdminComponent();
        },

        onMount($container) {
            this.adminModule.mount($container.find('#admin'));
        }
    }
};
```

## Integration with Models

Sync router state with reactive models:

```javascript
// Create navigation model
const navModel = M.create({
    currentPath: { type: M.types.string },
    params: { type: M.types.object }
});

// Subscribe to router changes
M.subscribe('router:afterChange', ({ to }) => {
    navModel.set('currentPath', to.path);
    navModel.set('params', to.params);
});

// Use model in components
M.subscribe('currentPath', (path) => {
    updateBreadcrumbs(path);
    highlightNavItem(path);
});
```

## Testing Router Views

```javascript
// Mock router for testing
const mockRouter = {
    init: jest.fn(),
    navigate: jest.fn(),
    current: jest.fn(() => ({ path: '/test', params: {} }))
};

// Test view rendering
const view = userView.template({ id: '123' });
expect(view).toContain('User 123');

// Test lifecycle hooks
const $container = $('<div>');
await userView.onEnter({ id: '123' });
userView.onMount($container);
expect($container.find('.user-profile')).toExist();
```

## Best Practices

### View Organization

- Keep views in separate files/modules
- Use lifecycle hooks for proper initialization/cleanup
- Template functions for dynamic content, strings for static
- Fetch data in onEnter, not templates

### Route Design

- RESTful patterns: `/users`, `/posts/:id`
- Descriptive, readable URLs
- Consistent structure across app
- Use meta for permissions, analytics

### Performance

- Lazy load view code when possible
- Clear timers/intervals in onLeave
- Unbind events to prevent memory leaks
- Cache fetched data to avoid redundant requests

### Security

- Validate/sanitise route parameters
- Use middleware for auth checks
- Sanitise user-generated template content
- HTTPS in production

### Error Handling

```javascript
const view = {
    async onEnter(params) {
        try {
            this.data = await H.get(`/api/data/${params.id}`);
        } catch (err) {
            E.toast('Failed to load data', { type: 'error' });
            return false;  // Cancel navigation
        }
    }
};
```

## Showcase Example Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Router Example - Domma</title>
    <link rel="stylesheet" href="../../dist/domma.css">
    <link rel="stylesheet" href="../../dist/elements.css">
</head>
<body>
    <nav>
        <a href="#/">Home</a>
        <a href="#/about">About</a>
        <a href="#/user/123">User</a>
    </nav>

    <div id="app"></div>

    <script src="../../dist/domma.min.js"></script>
    <script>
        // Define views
        const views = {
            home: {
                template: '<h1>Home</h1>'
            },
            about: {
                template: '<h1>About</h1>'
            },
            user: {
                template: (params) => `<h1>User ${params.id}</h1>`
            }
        };

        // Initialise router
        R.init({
            container: '#app',
            routes: [
                { path: '/', view: 'home', title: 'Home' },
                { path: '/about', view: 'about', title: 'About' },
                { path: '/user/:id', view: 'user', title: 'User' }
            ],
            views: views
        });
    </script>
</body>
</html>
```

## Related Documentation

- [Showcase Meta Guide](../CLAUDE.md)
- [Core Modules](../../../src/CLAUDE.md)
- [Router Source](../../../src/router.js)
- [API Reference](../../../docs/API.md)
