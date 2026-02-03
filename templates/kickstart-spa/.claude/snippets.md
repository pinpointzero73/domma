# Domma Code Snippets

Quick-reference code patterns for common tasks. Copy, paste, and adapt to your needs.

## Table of Contents

- [Page Initialization](#page-initialization)
- [Blueprint Definition](#blueprint-definition)
- [Form Generation](#form-generation)
- [Modal Forms](#modal-forms)
- [Reactive Models](#reactive-models)
- [Two-Way Binding](#two-way-binding)
- [CRUD Setup](#crud-setup)
- [Event Handling](#event-handling)
- [HTTP Requests](#http-requests)
- [Toast Notifications](#toast-notifications)
- [Dialog Confirmations](#dialog-confirmations)
- [Utility Functions](#utility-functions)

---

## Page Initialization

```javascript
// Basic page setup
$.ready(() => {
    // Scan and render icons
    I.scan();

    // Initialize theme with persistence
    Domma.theme.init({
        theme: 'ocean-dark',        // Default theme
        autoDetect: true,            // Detect system preference
        persist: true                // Save to localStorage
    });

    // Initialize your app
    initApp();
});

function initApp() {
    // Your initialization code here
    console.log('App initialized');
}
```

```javascript
// With configuration engine
$.ready(() => {
    $.setup({
        // Auto-initialize modal
        '#welcome-modal': {
            component: 'modal',
            options: { backdrop: true, keyboard: true }
        },
        // Auto-initialize tabs
        '#main-tabs': {
            component: 'tabs',
            options: { activeIndex: 0 }
        },
        // Event bindings
        '#theme-toggle': {
            events: {
                click: () => Domma.theme.toggle()
            }
        }
    });

    I.scan();
});
```

---

## Blueprint Definition

```javascript
// Simple blueprint
const userBlueprint = {
    name: {
        type: 'string',
        required: true,
        minLength: 2,
        label: 'Full Name',
        formConfig: {
            placeholder: 'Enter your name',
            tooltip: 'First and last name'
        }
    },
    email: {
        type: 'email',
        required: true,
        label: 'Email Address',
        formConfig: {
            placeholder: 'you@example.com'
        }
    },
    age: {
        type: 'number',
        min: 18,
        max: 120,
        label: 'Age'
    }
};
```

```javascript
// Complex blueprint with all field types
const formBlueprint = {
    // Text input
    username: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
        label: 'Username'
    },
    // Email
    email: {
        type: 'email',
        required: true,
        label: 'Email'
    },
    // Password
    password: {
        type: 'password',
        required: true,
        minLength: 8,
        label: 'Password'
    },
    // Number
    age: {
        type: 'number',
        min: 18,
        max: 100,
        label: 'Age'
    },
    // Textarea
    bio: {
        type: 'textarea',
        maxLength: 500,
        rows: 4,
        label: 'Biography'
    },
    // Select dropdown
    country: {
        type: 'select',
        options: [
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'ca', label: 'Canada' }
        ],
        label: 'Country'
    },
    // Radio buttons
    gender: {
        type: 'radio',
        options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
        ],
        label: 'Gender'
    },
    // Checkbox group
    interests: {
        type: 'checkbox-group',
        options: [
            { value: 'sports', label: 'Sports' },
            { value: 'music', label: 'Music' },
            { value: 'reading', label: 'Reading' }
        ],
        label: 'Interests'
    },
    // Date
    birthdate: {
        type: 'date',
        label: 'Date of Birth'
    },
    // Boolean checkbox
    newsletter: {
        type: 'boolean',
        label: 'Subscribe to newsletter'
    }
};
```

```javascript
// Blueprint composition
const baseBlueprint = {
    name: { type: 'string', required: true, label: 'Name' },
    email: { type: 'email', required: true, label: 'Email' }
};

// Extend with additional fields
const contactBlueprint = B.extend(baseBlueprint, {
    phone: { type: 'string', label: 'Phone' },
    message: { type: 'textarea', required: true, label: 'Message' }
});

// Pick specific fields only
const essentialsBlueprint = B.pick(baseBlueprint, ['name', 'email']);

// Omit sensitive fields
const publicBlueprint = B.omit(contactBlueprint, ['email', 'phone']);
```

---

## Form Generation

```javascript
// Simple form
F.render('#contact-form', contactBlueprint, {}, {
    layout: 'stacked',              // 'stacked', 'grid', 'inline'
    submitText: 'Send Message',
    cancelText: 'Clear',
    showCancel: true,
    onSubmit: (data) => {
        console.log('Form submitted:', data);
        E.toast('Message sent!', { type: 'success' });
    },
    onCancel: () => {
        console.log('Form cancelled');
    }
});
```

```javascript
// Form with grid layout
F.render('#user-form', userBlueprint, { name: 'John', email: '' }, {
    layout: 'grid',                 // Two-column grid
    gridColumns: 2,
    submitText: 'Save User',
    onSubmit: async (data) => {
        try {
            await H.post('/api/users', data);
            E.toast('User created!', { type: 'success' });
        } catch (error) {
            E.toast('Error creating user', { type: 'danger' });
        }
    }
});
```

```javascript
// Form with validation feedback
F.render('#signup-form', signupBlueprint, {}, {
    layout: 'stacked',
    submitText: 'Sign Up',
    onSubmit: (data, form) => {
        // Validate before submitting
        const errors = form.validate();
        if (errors.length > 0) {
            E.toast(`Please fix ${errors.length} error(s)`, { type: 'danger' });
            return false;  // Prevent submission
        }

        // Process valid data
        console.log('Valid data:', data);
        return true;  // Allow submission
    }
});
```

---

## Modal Forms

```javascript
// Simple modal form
F.modal(contactBlueprint, {
    title: 'Contact Us',
    submitText: 'Send',
    onSave: async (data) => {
        await H.post('/api/contact', data);
        E.toast('Message sent!', { type: 'success' });
    },
    onError: (error) => {
        E.toast('Failed to send message', { type: 'danger' });
    }
});
```

```javascript
// Modal form with edit mode
function editUser(userId, userData) {
    F.modal(userBlueprint, {
        title: `Edit User: ${userData.name}`,
        initialData: userData,
        submitText: 'Update',
        onSave: async (data) => {
            await H.put(`/api/users/${userId}`, data);
            E.toast('User updated!', { type: 'success' });
            // Refresh your data/table here
        }
    });
}
```

---

## Reactive Models

```javascript
// Create reactive model
const user = M.create(userBlueprint, {
    name: 'Alice',
    email: 'alice@example.com',
    age: 25
});

// Get/Set values
console.log(user.get('name'));        // 'Alice'
user.set('age', 26);                  // Updates with validation

// Validate
const errors = user.validate();
if (errors.length > 0) {
    console.log('Validation errors:', errors);
}

// React to changes
user.onChange('age', (newAge, oldAge) => {
    console.log(`Age changed from ${oldAge} to ${newAge}`);
});

// Listen to any field change
user.onChange((changes) => {
    console.log('Model changed:', changes);
});

// Export as plain object
const data = user.toJSON();

// Reset to initial values
user.reset();
```

```javascript
// Model with persistence
const settings = M.create(settingsBlueprint, {
    theme: 'light',
    notifications: true,
    language: 'en'
}, {
    persist: 'app-settings'     // Auto-save to localStorage
});

// Changes automatically save
settings.set('theme', 'dark');  // Saved immediately

// Manual operations
settings.save();                // Force save
settings.load();                // Reload from storage
settings.clearStorage();        // Remove from localStorage
```

---

## Two-Way Binding

```javascript
// Bind model to DOM inputs
const user = M.create(userBlueprint);

M.bind(user, 'name', '#name-input');
M.bind(user, 'email', '#email-input');
M.bind(user, 'age', '#age-input');

// Changes in inputs update model automatically
// Changes in model update inputs automatically

// React to model changes
user.onChange('name', (newName) => {
    $('#welcome-text').text(`Hello, ${newName}!`);
});
```

```javascript
// Bind with custom update callback
M.bind(user, 'theme', '#theme-select', {
    onUpdate: (value) => {
        Domma.theme.set(value);
        E.toast(`Theme changed to ${value}`, { type: 'info' });
    }
});

// Unbind when done
M.unbind(user, 'theme', '#theme-select');
```

---

## CRUD Setup

```javascript
// Complete CRUD in 3 lines
F.crud('#users-crud', userBlueprint, {
    title: 'User Management',
    apiEndpoint: '/api/users',
    columns: ['name', 'email', 'age']
});
```

```javascript
// CRUD with custom options
F.crud('#products-crud', productBlueprint, {
    title: 'Product Catalog',
    apiEndpoint: '/api/products',
    columns: ['name', 'price', 'category', 'stock'],
    pageSize: 20,
    sortable: true,
    exportable: true,
    onBeforeSave: (data) => {
        // Transform data before save
        data.price = parseFloat(data.price);
        return data;
    },
    onAfterDelete: (id) => {
        E.toast('Product deleted', { type: 'success' });
    }
});
```

---

## Event Handling

```javascript
// Basic event handling
$('#submit-btn').on('click', function(e) {
    e.preventDefault();
    console.log('Button clicked');
});

// Event delegation (recommended for dynamic content)
$('#user-list').on('click', '.delete-btn', function(e) {
    const userId = $(this).data('user-id');
    deleteUser(userId);
});

// Multiple events
$('#search-input').on('keyup change paste', function() {
    const query = $(this).val();
    performSearch(query);
});

// One-time event
$('#welcome-modal').one('opened', function() {
    console.log('Modal opened for the first time');
});

// Debounced search
const debouncedSearch = _.debounce((query) => {
    H.get('/api/search', { q: query });
}, 300);

$('#search').on('keyup', function() {
    debouncedSearch($(this).val());
});
```

---

## HTTP Requests

```javascript
// GET request
async function loadUsers() {
    try {
        const users = await H.get('/api/users');
        console.log('Users loaded:', users);
    } catch (error) {
        E.toast('Failed to load users', { type: 'danger' });
    }
}

// POST request
async function createUser(userData) {
    try {
        const newUser = await H.post('/api/users', userData);
        E.toast('User created!', { type: 'success' });
        return newUser;
    } catch (error) {
        E.toast('Error creating user', { type: 'danger' });
        throw error;
    }
}

// PUT request
async function updateUser(userId, userData) {
    await H.put(`/api/users/${userId}`, userData);
    E.toast('User updated!', { type: 'success' });
}

// DELETE request
async function deleteUser(userId) {
    const confirmed = await E.confirm('Delete this user?');
    if (!confirmed) return;

    await H.delete(`/api/users/${userId}`);
    E.toast('User deleted', { type: 'success' });
}

// With query parameters
const results = await H.get('/api/search', {
    q: 'query',
    page: 1,
    limit: 10
});
```

---

## Toast Notifications

```javascript
// Basic toasts
E.toast('Operation successful!', { type: 'success' });
E.toast('Something went wrong', { type: 'danger' });
E.toast('Please wait...', { type: 'info' });
E.toast('Warning: Check your input', { type: 'warning' });

// Toast with duration
E.toast('This message disappears in 5 seconds', {
    type: 'info',
    duration: 5000
});

// Persistent toast (no auto-dismiss)
E.toast('Click X to close', {
    type: 'info',
    duration: 0  // 0 = manual dismiss only
});

// Toast with position
E.toast('Top-right notification', {
    type: 'success',
    position: 'top-right'  // top-right, top-left, bottom-right, bottom-left
});
```

---

## Dialog Confirmations

```javascript
// Alert dialog
await E.alert('Welcome to our application!');
console.log('User clicked OK');

// Confirm dialog
const confirmed = await E.confirm('Are you sure you want to delete this?');
if (confirmed) {
    // User clicked OK
    performDelete();
} else {
    // User clicked Cancel
    console.log('Deletion cancelled');
}

// Prompt dialog
const name = await E.prompt('What is your name?');
if (name !== null) {
    console.log('User entered:', name);
    E.toast(`Hello, ${name}!`, { type: 'success' });
} else {
    console.log('User cancelled');
}

// Custom dialog options
const result = await E.confirm('Delete all items?', {
    title: 'Confirm Deletion',
    confirmText: 'Delete All',
    cancelText: 'Keep Items'
});

// Prompt with default value
const email = await E.prompt('Enter your email:', {
    title: 'Email Required',
    inputPlaceholder: 'you@example.com',
    inputValue: 'user@example.com',
    inputType: 'email'
});
```

---

## Utility Functions

```javascript
// Array utilities
const items = [1, 2, 3, 4, 5];
_.chunk(items, 2);                    // [[1,2], [3,4], [5]]
_.uniq([1, 2, 2, 3, 3, 3]);          // [1, 2, 3]
_.sortBy(users, 'name');              // Sort by property

// Object utilities
const user = { name: 'Alice', profile: { age: 25 } };
_.get(user, 'profile.age', 0);       // 25 (with default)
_.pick(user, ['name']);               // { name: 'Alice' }
_.omit(user, ['profile']);            // { name: 'Alice' }

// Collection utilities
const users = [/* array of objects */];
_.groupBy(users, 'role');             // Group by property
_.keyBy(users, 'id');                 // Index by property
_.filter(users, u => u.active);       // Filter collection
_.find(users, { email: 'a@ex.com' }); // Find by properties

// Function utilities
const search = _.debounce(query => {
    H.get('/api/search', { q: query });
}, 300);

const scroll = _.throttle(() => {
    console.log('Scrolling...');
}, 100);

// String utilities
_.camelCase('hello world');           // 'helloWorld'
_.kebabCase('hello world');           // 'hello-world'
_.snakeCase('hello world');           // 'hello_world'
_.capitalize('hello');                // 'Hello'
_.truncate('Long text here', 10);     // 'Long te...'

// Date utilities
D().format('YYYY-MM-DD');             // '2025-01-23'
D().add(7, 'days').format('MMM DD');  // 'Jan 30'
D('2025-01-01').fromNow();            // '23 days ago'

// Storage utilities
S.set('user', { name: 'Alice' });     // Auto-stringify
S.get('user');                        // Auto-parse
S.has('user');                        // Check existence
S.remove('user');                     // Remove item
S.clear();                            // Clear all Domma keys
```

```javascript
// Template rendering
const template = _.template(`
    <div class="user-card">
        <h3>{{name}}</h3>
        <p>{{email}}</p>
        {{#if active}}
            <span class="badge">Active</span>
        {{/if}}
    </div>
`);

const html = template({
    name: 'Alice',
    email: 'alice@example.com',
    active: true
});

$('#container').html(html);
```

---

## Pro Tips

1. **Always check blueprints/** - Reuse existing schemas before creating new ones
2. **Use B.extend()** - Build complex blueprints from simple ones
3. **Leverage F.crud()** - Complete CRUD with 3 lines of code
4. **Debounce searches** - Use `_.debounce()` for input events
5. **Use await E.confirm()** - Better UX than browser `confirm()`
6. **Validate before submit** - Call `model.validate()` before API calls
7. **Persist settings** - Use `{ persist: 'key' }` option with models
8. **Two-way binding** - Use `M.bind()` for reactive forms
9. **Toast feedback** - Always provide user feedback with `E.toast()`
10. **Icons everywhere** - Use `data-icon="icon-name"` and call `I.scan()`

---

For more examples, visit:
- Official Showcase: https://dommajs.org/showcase/
- API Documentation: https://dommajs.org/docs/API.md
- Blueprints Guide: https://dommajs.org/docs/Blueprints.md
