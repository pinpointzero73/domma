---
title: Models
description: "Reactive data models with pub/sub events, validation, and two-way DOM binding."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Models" tagline="Reactive data models with pub/sub events, validation, and two-way DOM binding." align="center"][/hero]

## Pub/Sub Events

A simple but powerful event system for decoupled communication between components.

subscribe()

publish()

unsubscribe()

once()

on()

off()

emit()

```javascript
// Subscribe to an event
M.subscribe('user:login', (data) => {
    console.log('User logged in:', data.username);
});

// Aliases
M.on('user:login', callback);  // Same as subscribe

// Publish an event
M.publish('user:login', { username: 'alice' });
M.emit('user:login', data);    // Same as publish

// Unsubscribe
M.unsubscribe('user:login', callback);
M.off('user:login', callback);

// One-time subscription
M.once('app:ready', () => {
    console.log('App initialized!');
});

// Namespace events
M.on('cart:add', handler);
M.on('cart:remove', handler);
M.on('cart:clear', handler);
```

[showcase-demo id="showcase/models/event-console" title="Event Console" /]

## Reactive Models

Create reactive data models with blueprint validation and change detection.

```javascript
// Create a model with blueprint
const user = M.create({
    name: { type: 'string', required: true },
    email: {
        type: 'string',
        required: true,
        validate: v => v.includes('@') || 'Invalid email'
    },
    age: {
        type: 'number',
        min: 0,
        max: 150,
        default: 18
    },
    role: {
        type: 'string',
        enum: ['admin', 'user', 'guest'],
        default: 'user'
    }
}, { name: 'Alice', email: 'alice@example.com' });

// Get values
user.get('name')           // 'Alice'
user.get('email')          // 'alice@example.com'
user.toJSON()              // { name: 'Alice', email: '...', age: 18, role: 'user' }

// Set values (triggers validation)
user.set('name', 'Bob');
user.set('age', 25);

// Set multiple values
user.set({ name: 'Carol', age: 30 });

// Listen for changes
user.onChange((field, newValue, oldValue) => {
    console.log(`${field} changed from ${oldValue} to ${newValue}`);
});

// Listen for specific field
user.onChange('email', (newVal, oldVal) => {
    console.log('Email updated');
});

// Validate
const result = user.validate();
// { valid: true, errors: {} }
// or { valid: false, errors: { email: 'Invalid email' } }
```

[showcase-demo id="showcase/models/user-model" title="User Model" /]

## Blueprint Types

Built-in type validators for common data types.

```javascript
// Available types
M.types.string    // String values
M.types.number    // Numeric values
M.types.boolean   // true/false
M.types.array     // Arrays
M.types.object    // Plain objects
M.types.date      // Date objects
M.types.any       // Any type (no validation)

// Blueprint options
const blueprint = {
    // Basic type
    name: { type: 'string' },

    // Required field
    email: { type: 'string', required: true },

    // Default value
    status: { type: 'string', default: 'active' },

    // Number constraints
    age: { type: 'number', min: 0, max: 120 },
    price: { type: 'number', min: 0 },

    // String constraints
    username: { type: 'string', minLength: 3, maxLength: 20 },

    // Enum values
    role: { type: 'string', enum: ['admin', 'user', 'guest'] },

    // Custom validation
    password: {
        type: 'string',
        validate: (value) => {
            if (value.length < 8) return 'Min 8 characters';
            if (!/[A-Z]/.test(value)) return 'Need uppercase';
            if (!/[0-9]/.test(value)) return 'Need number';
            return true;
        }
    },

    // Array of items
    tags: { type: 'array' },

    // Nested object
    address: { type: 'object' }
};
```

## Two-Way DOM Binding

Keep data and the page in step automatically.

The recommended way is **declarative**: the markup says what each element shows (`data-model` for two-way,
`data-bind-text` for one-way) and `M.applyBindings(data, root)` keeps it true - the live demo below works that way,
with a computed value for the greeting. `M.bind()` is the imperative form, wiring one model field to one element; it
is shown in the code here and still works.

> **Need derived values?** [Reactivity](/showcase/models/reactivity) covers `M.computed()` and `M.effect()` - dependency tracking that re-runs only the work affected by a change, instead of wiring up `onChange` by hand.

> **Binding a whole template?** [Template Bindings](/showcase/models/bindings) covers `data-bind-*`, `data-model`, `data-on-*`, `data-if` and keyed `{{#each}}` lists - declared in the markup, so there is no render function to remember to call.

> **Working with Nested Data?** Check out our [Dot Notation with Forms](/showcase/models/dot-notation) guide for handling complex nested structures using `_.get()` and `_.set()` utilities.

```javascript
const user = M.create({
    name: { type: 'string' },
    email: { type: 'string' }
}, { name: 'Alice' });

// One-way binding (model -> DOM)
M.bind(user, 'name', '#name-display');

// Two-way binding (model <-> DOM)
M.bind(user, 'name', '#name-input', { twoWay: true });

// With formatter
M.bind(user, 'name', '#greeting', {
    format: (value) => `Hello, ${value}!`
});

// Multiple bindings
M.bind(user, 'name', '#display1');
M.bind(user, 'name', '#display2');
M.bind(user, 'name', '#display3');

// All update when model changes
user.set('name', 'Bob');  // All three elements update

// Unbind
M.unbind(user, 'name', '#name-display');
```

[showcase-demo id="showcase/models/live-binding" title="Live Binding" /]

## Practical Example: Shopping Cart

A complete example using pub/sub and reactive models together.

```javascript
// Cart model
const cart = M.create({
    items: { type: 'array', default: [] },
    total: { type: 'number', default: 0 }
});

// Subscribe to cart events
M.on('cart:add', (item) => {
    const items = cart.get('items');
    items.push(item);
    cart.set('items', items);
    cart.set('total', calculateTotal(items));
});

M.on('cart:remove', (index) => {
    const items = cart.get('items');
    items.splice(index, 1);
    cart.set('items', items);
    cart.set('total', calculateTotal(items));
});

// UI updates on cart changes
cart.onChange('total', (newTotal) => {
    $('#cart-total').text('$' + newTotal.toFixed(2));
});

cart.onChange('items', (items) => {
    $('#cart-count').text(items.length);
});

// Add item from anywhere in the app
$('.add-to-cart').on('click', function() {
    const product = {
        name: $(this).data('name'),
        price: $(this).data('price')
    };
    M.emit('cart:add', product);
});
```

[showcase-demo id="showcase/models/mini-cart" title="Mini Cart" /]

## Practical Example: User Management

A complete CRUD example with model-based form validation and clipboard export.

```javascript
// Users collection model
const usersModel = M.create({
    users: { type: 'array', default: [] }
});

// Form validation model
const formModel = M.create({
    name: { type: 'string', required: true },
    email: {
        type: 'string',
        required: true,
        validate: v => v.includes('@') || 'Invalid email'
    },
    role: { type: 'string', enum: ['user', 'admin', 'editor'] },
    status: { type: 'string', enum: ['active', 'inactive'] }
});

// Add user
formModel.set({ name: 'Alice', email: 'alice@example.com', role: 'admin', status: 'active' });
if (formModel.validate().valid) {
    const users = [...usersModel.get('users'), formModel.toJSON()];
    usersModel.set('users', users);
}

// Export to clipboard
navigator.clipboard.writeText(JSON.stringify(usersModel.get('users'), null, 2));
```

[showcase-demo id="showcase/models/user-manager" title="User Manager" /]

## Complete Method Reference

[showcase-demo id="showcase/models/complete-method-reference" title="Complete Method Reference" /]
