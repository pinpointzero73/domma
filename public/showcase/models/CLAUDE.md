# CLAUDE.md - Models Module Showcase

This file provides guidance for working with Models module showcase examples.

## Models Module Overview

Accessed via `Domma.models` or `M` - provides reactive models, pub/sub, and data persistence.

## Pub/Sub System

### Basic Pub/Sub

```javascript
// Subscribe to events
M.subscribe('user:login', (data) => {
    console.log('User logged in:', data);
});

// Or use alias
M.on('user:login', (data) => {
    console.log('User logged in:', data);
});

// Publish events
M.publish('user:login', {userId: 123});

// Or use alias
M.emit('user:login', {userId: 123});

// Unsubscribe
M.unsubscribe('user:login', handler);
M.off('user:login', handler);

// One-time subscription
M.once('app:ready', () => {
    console.log('App initialized');
});
```

## Reactive Models

### Creating Models

```javascript
// Define blueprint
const userBlueprint = {
    name: {
        type: M.types.string,
        required: true,
        default: ''
    },
    email: {
        type: M.types.string,
        required: true,
        validate: (val) => /\S+@\S+/.test(val)
    },
    age: {
        type: M.types.number,
        default: 0,
        validate: (val) => val >= 0
    },
    active: {
        type: M.types.boolean,
        default: true
    },
    tags: {
        type: M.types.array,
        default: []
    },
    profile: {
        type: M.types.object,
        default: {}
    }
};

// Create model instance
const user = M.create(userBlueprint, {
    name: 'Alice',
    email: 'alice@example.com',
    age: 30
});
```

### Model Operations

```javascript
// Get values
const name = user.get('name');
const all = user.toJSON();

// Set values
user.set('name', 'Bob');
user.set({
    name: 'Bob',
    age: 31
});

// Validate
const errors = user.validate();
if (errors.length === 0) {
    console.log('Valid');
}

// Reset to defaults
user.reset();
```

### Change Listeners

```javascript
// Listen for changes
const handler = (changes) => {
    console.log('Changed:', changes);
    // changes = {field: 'name', oldValue: 'Alice', newValue: 'Bob'}
};

user.onChange(handler);

// Listen for specific field
user.onChange('name', (changes) => {
    console.log('Name changed:', changes);
});

// Remove listener
user.offChange(handler);
```

### Model Persistence

```javascript
// Auto-save/load from localStorage
const settings = M.create(blueprint, data, {
    persist: 'app-settings'  // Storage key
});

// Auto-loads on creation
// Auto-saves on every change

// Manual operations
settings.save();           // Save to localStorage
settings.load();           // Load from localStorage
settings.clearStorage();   // Remove from localStorage
settings.reset(true);      // Reset and clear storage

// Check persistence
if (settings.isPersisted()) {
    console.log('Key:', settings.getPersistKey());
}
```

### DOM Binding

```javascript
// Two-way binding between model and DOM
const user = M.create(userBlueprint);

// Bind input to model field
M.bind(user, 'name', '#name-input', {
    twoWay: true,              // Update model when input changes
    format: (val) => val.toUpperCase(), // Transform for display
    parse: (val) => val.toLowerCase()   // Transform when saving
});

// Bind display element (one-way)
M.bind(user, 'name', '#name-display', {
    twoWay: false,
    format: (name) => `Hello, ${name}!`
});

// Changes to model update all bound elements
user.set('name', 'Alice');  // Updates #name-input and #name-display

// Unbind
M.unbind(user, 'name', '#name-input');
```

## Type System

```javascript
M.types.string    // String type
M.types.number    // Number type
M.types.boolean   // Boolean type
M.types.array     // Array type
M.types.object    // Object type
M.types.date      // Date type
M.types.any       // Any type
```

## Showcase Example Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Models Showcase - Domma</title>
    <link rel="stylesheet" href="../../../dist/domma-theme.css">
</head>
<body>
    <div class="container">
        <h1>Models Module Showcase</h1>

        <div class="demo-section">
            <h2>Reactive Model</h2>
            <input type="text" id="name" class="form-control" placeholder="Name">
            <input type="email" id="email" class="form-control" placeholder="Email">
            <div id="output"></div>
        </div>
    </div>

    <script src="../../../dist/domma.min.js"></script>
    <script>
        // Always use M alias for models
        const userBlueprint = {
            name: {type: M.types.string, default: ''},
            email: {type: M.types.string, default: ''}
        };

        const user = M.create(userBlueprint);

        // Bind form inputs
        M.bind(user, 'name', '#name', {twoWay: true});
        M.bind(user, 'email', '#email', {twoWay: true});

        // Listen for changes
        user.onChange(() => {
            $('#output').html(`
                <p>Name: ${user.get('name')}</p>
                <p>Email: ${user.get('email')}</p>
            `);
        });
    </script>
</body>
</html>
```

## Common Patterns

### Form Handling with Models

```javascript
const formBlueprint = {
    username: {type: M.types.string, required: true},
    password: {type: M.types.string, required: true}
};

const formModel = M.create(formBlueprint);

// Bind all form fields
M.bind(formModel, 'username', '#username', {twoWay: true});
M.bind(formModel, 'password', '#password', {twoWay: true});

$('#form').on('submit', function(e) {
    e.preventDefault();

    const errors = formModel.validate();
    if (errors.length === 0) {
        console.log('Submit:', formModel.toJSON());
    } else {
        console.error('Validation errors:', errors);
    }
});
```

### Settings Panel with Persistence

```javascript
const settingsBlueprint = {
    theme: {type: M.types.string, default: 'light'},
    language: {type: M.types.string, default: 'en'},
    notifications: {type: M.types.boolean, default: true}
};

const settings = M.create(settingsBlueprint, {}, {
    persist: 'user-settings'  // Auto-save/load
});

// Bind UI controls
M.bind(settings, 'theme', '#theme-select', {twoWay: true});
M.bind(settings, 'notifications', '#notifications-toggle', {twoWay: true});

// Changes auto-save to localStorage
settings.onChange(() => {
    console.log('Settings updated:', settings.toJSON());
});
```

### Event-Driven Architecture

```javascript
// Component A publishes events
$('#login-btn').on('click', () => {
    M.publish('user:login', {userId: 123, name: 'Alice'});
});

// Component B subscribes
M.on('user:login', (user) => {
    $('#user-name').text(user.name);
    $('#user-menu').show();
});

// Component C also subscribes
M.on('user:login', (user) => {
    console.log('Tracking login:', user);
});
```

## Related Documentation

- [Showcase Meta Guide](../CLAUDE.md)
- [Core Modules](../../../src/CLAUDE.md)
- [API Reference](../../../docs/API.md)

## Related Documentation

- **[Blueprints Guide](../../../docs/Blueprints.md)** - Complete Blueprint reference and tutorial
- [Models API Reference](../../../docs/API.md#models) - Full Models API documentation
- [Forms Showcase](../forms/) - Blueprint-driven form generation
- [Main Showcase](../index.html) - All showcases

---

**Note:** Models in Domma are created from Blueprints. See the [Blueprints documentation](../../../docs/Blueprints.md) for comprehensive schema definition guidance and validation options.
