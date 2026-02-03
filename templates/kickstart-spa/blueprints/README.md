# Blueprint Library

This directory contains reusable blueprint definitions for common data structures and use cases.

## What are Blueprints?

Blueprints are schema definitions that power Domma's forms, models, and CRUD operations. Define your data structure once, and use it everywhere.

## Directory Structure

```
blueprints/
├── README.md           # This file
├── common/             # Common data structures
│   ├── user.js        # User fields
│   ├── contact.js     # Contact form
│   └── settings.js    # Application settings
├── forms/             # Complete form blueprints
│   ├── registration.js # User registration with validation
│   └── login.js       # Login form
└── crud/              # CRUD-ready blueprints
    ├── product.js     # E-commerce product
    └── task.js        # Task/todo management
```

## Usage

### 1. Import Blueprint

```javascript
// Import from your blueprint files
import { userBlueprint } from './blueprints/common/user.js';
import { contactBlueprint } from './blueprints/common/contact.js';
```

### 2. Use Directly

```javascript
// Generate a form
F.render('#user-form', userBlueprint, {}, {
    layout: 'stacked',
    submitText: 'Save User'
});

// Create a reactive model
const user = M.create(userBlueprint, {
    name: 'Alice',
    email: 'alice@example.com'
});

// Complete CRUD
F.crud('#users', userBlueprint, {
    apiEndpoint: '/api/users',
    columns: ['name', 'email', 'role']
});
```

### 3. Compose New Blueprints

Use the `B` alias for blueprint composition:

```javascript
import { userBlueprint } from './blueprints/common/user.js';

// Extend with additional fields
const employeeBlueprint = B.extend(userBlueprint, {
    employeeId: {
        type: 'string',
        required: true,
        label: 'Employee ID'
    },
    department: {
        type: 'select',
        options: [
            { value: 'eng', label: 'Engineering' },
            { value: 'sales', label: 'Sales' },
            { value: 'hr', label: 'Human Resources' }
        ],
        label: 'Department'
    },
    startDate: {
        type: 'date',
        required: true,
        label: 'Start Date'
    }
});

// Pick specific fields only
const publicProfile = B.pick(userBlueprint, ['name', 'bio', 'avatar']);

// Omit sensitive fields
const safeUser = B.omit(userBlueprint, ['password', 'email']);
```

## Blueprint Types

Domma supports these field types:

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text input | Name, username, description |
| `email` | Email validation | Email addresses |
| `password` | Password input (masked) | Passwords |
| `number` | Numeric input | Age, quantity, price |
| `date` | Date picker | Birth date, deadline |
| `url` | URL validation | Website, profile link |
| `textarea` | Multi-line text | Comments, bio, message |
| `select` | Dropdown selection | Country, category |
| `radio` | Single choice from list | Gender, size |
| `checkbox-group` | Multiple selections | Interests, permissions |
| `boolean` | Single checkbox | Terms accepted, active |
| `array` | Array of values | Tags, categories |
| `object` | Nested object | Address, metadata |

## Validation Options

Add validation rules to any field:

```javascript
{
    fieldName: {
        type: 'string',
        required: true,              // Must have value
        minLength: 3,                // Minimum characters
        maxLength: 50,               // Maximum characters
        min: 0,                      // Minimum value (numbers)
        max: 100,                    // Maximum value (numbers)
        pattern: /^[A-Z]/,          // Regex validation
        custom: (value) => {         // Custom validator
            if (!isValid(value)) {
                return 'Custom error message';
            }
        },
        label: 'Field Label',
        formConfig: {
            placeholder: 'Enter value...',
            tooltip: 'Helpful hint',
            class: 'custom-class'
        }
    }
}
```

## Best Practices

### 1. Keep It DRY

Reuse blueprints instead of duplicating:

```javascript
// ❌ Bad: Duplicate definitions
const signupForm = {
    name: { type: 'string', required: true, label: 'Name' },
    email: { type: 'email', required: true, label: 'Email' }
};

const profileForm = {
    name: { type: 'string', required: true, label: 'Name' },
    email: { type: 'email', required: true, label: 'Email' }
};

// ✅ Good: Define once, reuse everywhere
import { userBlueprint } from './blueprints/common/user.js';
const signupForm = B.pick(userBlueprint, ['name', 'email', 'password']);
const profileForm = B.pick(userBlueprint, ['name', 'email', 'bio']);
```

### 2. Use Composition

Build complex blueprints from simple ones:

```javascript
import { userBlueprint } from './blueprints/common/user.js';
import { addressBlueprint } from './blueprints/common/address.js';

const customerBlueprint = B.extend(
    userBlueprint,
    addressBlueprint,
    {
        loyaltyPoints: { type: 'number', label: 'Loyalty Points' },
        memberSince: { type: 'date', label: 'Member Since' }
    }
);
```

### 3. Namespace Your Blueprints

Use clear, descriptive names with 'Blueprint' suffix:

```javascript
// ✅ Good naming
export const userBlueprint = { /* ... */ };
export const productBlueprint = { /* ... */ };
export const orderBlueprint = { /* ... */ };

// ❌ Avoid generic names
export const form = { /* ... */ };
export const data = { /* ... */ };
```

### 4. Document Complex Blueprints

Add comments for non-obvious validation rules:

```javascript
export const passwordBlueprint = {
    password: {
        type: 'password',
        required: true,
        minLength: 8,
        // Must contain: uppercase, lowercase, number, special char
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        label: 'Password',
        formConfig: {
            tooltip: 'Min 8 chars with uppercase, lowercase, number, and special character'
        }
    },
    confirmPassword: {
        type: 'password',
        required: true,
        custom: (value, allData) => {
            if (value !== allData.password) {
                return 'Passwords do not match';
            }
        },
        label: 'Confirm Password'
    }
};
```

## Creating Custom Blueprints

### Basic Template

```javascript
/**
 * Description of what this blueprint represents
 */
export const myBlueprint = {
    fieldName: {
        type: 'string',           // Field type
        required: true,           // Validation
        label: 'Field Label',     // Display label
        formConfig: {             // Form-specific config
            placeholder: 'Enter value...',
            tooltip: 'Helpful hint',
            class: 'custom-class'
        }
    }
    // ... more fields
};
```

### With Select Options

```javascript
export const productBlueprint = {
    name: {
        type: 'string',
        required: true,
        label: 'Product Name'
    },
    category: {
        type: 'select',
        required: true,
        options: [
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' },
            { value: 'books', label: 'Books' }
        ],
        label: 'Category'
    }
};
```

### With Nested Objects

```javascript
export const userWithAddressBlueprint = {
    name: {
        type: 'string',
        required: true,
        label: 'Full Name'
    },
    address: {
        type: 'object',
        schema: {
            street: { type: 'string', required: true, label: 'Street' },
            city: { type: 'string', required: true, label: 'City' },
            zip: { type: 'string', required: true, label: 'ZIP Code' }
        },
        label: 'Address'
    }
};
```

## Quick Examples

### Modal Form

```javascript
import { contactBlueprint } from './blueprints/common/contact.js';

$('#contact-btn').on('click', () => {
    F.modal(contactBlueprint, {
        title: 'Contact Us',
        submitText: 'Send Message',
        onSave: async (data) => {
            await H.post('/api/contact', data);
            E.toast('Message sent!', { type: 'success' });
        }
    });
});
```

### CRUD Setup

```javascript
import { productBlueprint } from './blueprints/crud/product.js';

$.ready(() => {
    F.crud('#products', productBlueprint, {
        title: 'Product Catalog',
        apiEndpoint: '/api/products',
        columns: ['name', 'price', 'category', 'stock']
    });
});
```

### Reactive Model

```javascript
import { settingsBlueprint } from './blueprints/common/settings.js';

const settings = M.create(settingsBlueprint, {}, {
    persist: 'app-settings'  // Auto-save to localStorage
});

// Two-way binding
M.bind(settings, 'theme', '#theme-select');
M.bind(settings, 'notifications', '#notifications-toggle');

// React to changes
settings.onChange(() => {
    console.log('Settings updated:', settings.toJSON());
});
```

## Additional Resources

- **Domma Blueprints Guide:** https://dommajs.org/docs/Blueprints.md
- **Forms Documentation:** https://dommajs.org/showcase/forms/
- **Models Documentation:** https://dommajs.org/showcase/models/
- **CRUD Examples:** https://dommajs.org/showcase/forms/#crud

## Need Help?

Check:
1. `.claude/snippets.md` for code patterns
2. `CLAUDE.md` for framework reference
3. Official docs at https://dommajs.org/docs/
