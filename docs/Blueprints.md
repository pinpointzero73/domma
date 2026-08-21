# Domma Blueprints - Unified Schema System

## Table of Contents

- [What are Blueprints?](#what-are-blueprints)
- [Quick Start](#quick-start)
- [Blueprint Anatomy](#blueprint-anatomy)
- [Field Types](#field-types)
- [Validation Options](#validation-options)
- [Blueprint Composition](#blueprint-composition)
- [Form Integration](#form-integration)
- [Model Integration](#model-integration)
- [CRUD Integration](#crud-integration)
- [Tutorial: Building a Contact Form](#tutorial-building-a-contact-form)
- [Real-World Examples](#real-world-examples)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)

---

## What are Blueprints?

**Blueprints are the single source of truth for your data structure in Domma.** They're declarative JavaScript objects that define:

- **Field types and validation rules** - What data looks like and how it should be validated
- **Form generation** - How fields should be rendered in forms
- **Model behaviour** - How reactive models validate and persist data
- **CRUD operations** - How data is managed in full CRUD interfaces

### The Power of Blueprints

Write a Blueprint once, use it everywhere:

```javascript
// Define once
const userBlueprint = {
    name: { type: 'string', required: true, minLength: 2 },
    email: { type: 'email', required: true },
    age: { type: 'number', min: 18, max: 120 }
};

// Use for validation
const user = M.create(userBlueprint);
user.set('age', 15); // ❌ Throws error: Value must be at least 18

// Generate form
const form = F.create(userBlueprint);

// Full CRUD with API
F.crud('#crud', userBlueprint, { apiUrl: '/api/users' });
```

### Why "Blueprint"?

Just like architectural blueprints define how a building should be constructed, Domma Blueprints define how your data should be structured, validated, and presented. One definition drives everything.

---

## Quick Start

### 5-Minute "Hello Blueprint"

**Step 1: Define a Blueprint**

```javascript
const contactBlueprint = {
    name: {
        type: 'string',
        required: true,
        minLength: 2,
        label: 'Full Name',
        placeholder: 'Enter your full name'
    },
    email: {
        type: 'email',
        required: true,
        label: 'Email Address',
        placeholder: 'you@example.com'
    },
    message: {
        type: 'textarea',
        required: true,
        minLength: 10,
        label: 'Message',
        rows: 4
    }
};
```

**Step 2: Generate a Form**

```javascript
const form = F.create(contactBlueprint, {}, {
    container: '#contact-form',
    layout: 'stacked',
    onSubmit: (data) => {
        console.log('Form submitted:', data);
        Domma.elements.toast('Thank you for your message!', { type: 'success' });
    }
});
```

**Step 3: See It in Action**

```html
<div id="contact-form"></div>
```

You now have a fully validated, styled contact form with zero manual HTML!

---

## Blueprint Anatomy

### Basic Field Definition

```javascript
const fieldBlueprint = {
    fieldName: {
        // Core properties
        type: 'string',          // Field type (required)
        required: false,         // Is field required?
        default: '',             // Default value

        // Validation
        min: 0,                  // Minimum (number types)
        max: 100,                // Maximum (number types)
        minLength: 3,            // Minimum length (string types)
        maxLength: 255,          // Maximum length (string types)
        pattern: /^[A-Z]/,       // Regex pattern
        validate: (val) => true, // Custom validator

        // Form rendering (optional)
        label: 'Field Label',    // Display label
        placeholder: 'Enter...',  // Input placeholder
        help: 'Helper text',     // Help text below field
        options: ['A', 'B'],     // Options for select/radio
        disabled: false,         // Disable the field

        // Advanced
        formConfig: {            // Additional form options
            span: 2,             // Column span in grid layouts
            rows: 4              // Rows for textarea
        }
    }
};
```

---

## Field Types

Domma provides 7 built-in type validators:

| Type | Validator | Example |
|------|-----------|---------|
| `string` | `M.types.string` | `'John Doe'` |
| `number` | `M.types.number` | `42` |
| `boolean` | `M.types.boolean` | `true` |
| `array` | `M.types.array` | `['a', 'b', 'c']` |
| `object` | `M.types.object` | `{ key: 'value' }` |
| `date` | `M.types.date` | `new Date()` |
| `any` | `M.types.any` | Any value |

### Type Usage

```javascript
const productBlueprint = {
    name: { type: 'string', required: true },
    price: { type: 'number', min: 0 },
    inStock: { type: 'boolean', default: true },
    tags: { type: 'array', default: [] },
    metadata: { type: 'object', default: {} },
    releaseDate: { type: 'date' },
    notes: { type: 'any' }  // Accepts anything
};
```

### Form Input Types

When used with Forms, `type` also determines the HTML input element:

| Blueprint Type | HTML Input | Notes |
|----------------|------------|-------|
| `string` | `<input type="text">` | |
| `email` | `<input type="email">` | Built-in email validation |
| `password` | `<input type="password">` | Masked input |
| `number` | `<input type="number">` | |
| `date` | `<input type="date">` | |
| `datetime` | `<input type="datetime-local">` | |
| `boolean` | `<input type="checkbox">` | |
| `select` | `<select>` | Requires `options` array |
| `radio` | Radio group | Requires `options` array |
| `checkbox-group` | Checkbox group | Requires `options` array |
| `chooser` | Visual option-picker (cards or chips) | Requires `options` array; supports rich per-option metadata |
| `textarea` | `<textarea>` | Use `rows` for height |
| `file` | `<input type="file">` | |

#### Chooser fields

The `chooser` type renders options as visually rich tiles - the form-friendly
equivalent of native radio/checkbox controls when richer presentation is
needed. A single component covers four combinations driven by parameters.

```javascript
plan: {
  type: 'chooser',
  variant: 'card',           // 'card' | 'chip'
  multiple: false,           // false = radio, true = checkbox semantics
  density: 'comfortable',    // 'comfortable' | 'compact'
  columns: 3,                // grid columns (cards only - chips wrap)
  required: true,
  label: 'Choose your plan',
  options: [
    { value: 'starter', label: 'Starter', icon: 'rocket',
      description: 'For solo builders.' },
    { value: 'pro',     label: 'Pro',     icon: 'zap',
      description: 'Teams up to 10.',
      badge: { text: 'POPULAR', type: 'success' },
      recommended: true,
      tooltip: 'Most-bought plan' },
    { value: 'ent',     label: 'Enterprise', icon: 'briefcase',
      description: 'Custom limits + SSO.' }
  ]
}

// Chip variant, multi-select
tags: {
  type: 'chooser',
  variant: 'chip',
  multiple: true,
  options: [
    { value: 'js',   label: 'JavaScript', icon: 'code' },
    { value: 'css',  label: 'CSS',        icon: 'palette' },
    { value: 'wasm', label: 'WASM',       icon: 'cpu', disabled: true }
  ]
}
```

**Per-option keys:** `value`, `label`, `icon`, `description`, `tooltip`,
`badge: { text, type }`, `recommended`, `disabled`.

**Visual options (top-level):**

| Key | Type | Default | Description |
|---|---|---|---|
| `accent` | semantic name or `'#hex'` | `'primary'` | Colour for selected/recommended highlights |
| `accentStyle` | `'border' \| 'solid' \| 'glow' \| 'overlay' \| 'underline'` | `'border'` | Visual treatment of the selected state |
| `glow` | `boolean` | `false` | Soft outer glow on the selected option |
| `glowColour` | semantic name or `'#hex'` | `null` (uses accent) | Glow colour override |
| `shadow` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'none'` | Shadow weight applied to every option |
| `shadowColour` | CSS colour string | `null` | Optional shadow tint |

Semantic colour names (`primary`, `success`, `info`, `warning`, `danger`) map
to existing Domma CSS variables and stay theme-aware. Any other string is
treated as a literal CSS colour and applied as an inline custom property.

**Value shape:** When `multiple: false`, the field stores a string. When
`multiple: true`, it stores an array of strings. The form pipeline handles
both - no separate data-type declaration is needed. Required validation
treats an empty array as empty for multi-select.

See the chooser showcase at `/showcase/elements/chooser/` for a comprehensive
visual reference.

---

## Validation Options

### Required Fields

```javascript
const blueprint = {
    username: {
        type: 'string',
        required: true,  // Field must have a value
        minLength: 3
    }
};
```

### Numeric Range

```javascript
const blueprint = {
    age: {
        type: 'number',
        min: 18,         // Must be at least 18
        max: 120,        // Must be at most 120
        required: true
    },
    rating: {
        type: 'number',
        min: 1,
        max: 5,
        default: 3
    }
};
```

### String Length

```javascript
const blueprint = {
    username: {
        type: 'string',
        minLength: 3,    // At least 3 characters
        maxLength: 20,   // At most 20 characters
        required: true
    },
    bio: {
        type: 'textarea',
        maxLength: 500,
        placeholder: 'Tell us about yourself (max 500 characters)'
    }
};
```

### Pattern Matching (Regex)

```javascript
const blueprint = {
    postcode: {
        type: 'string',
        pattern: /^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/i,
        placeholder: 'SW1A 1AA',
        help: 'UK postcode format'
    },
    phone: {
        type: 'string',
        pattern: /^\+?[\d\s-()]+$/,
        placeholder: '+44 20 1234 5678'
    }
};
```

### Custom Validators

#### Synchronous Validation

```javascript
const blueprint = {
    password: {
        type: 'password',
        required: true,
        minLength: 8,
        validate: (value) => {
            // Return true if valid, error message if invalid
            if (!/[A-Z]/.test(value)) {
                return 'Password must contain at least one uppercase letter';
            }
            if (!/[0-9]/.test(value)) {
                return 'Password must contain at least one number';
            }
            return true;  // Valid
        }
    }
};
```

#### Cross-Field Validation

```javascript
const blueprint = {
    password: {
        type: 'password',
        required: true,
        minLength: 8
    },
    confirmPassword: {
        type: 'password',
        required: true,
        validate: (value, allData) => {
            // Access other fields via allData
            if (value !== allData.password) {
                return 'Passwords do not match';
            }
            return true;
        }
    }
};
```

#### Async Validation

```javascript
const blueprint = {
    username: {
        type: 'string',
        required: true,
        minLength: 3,
        validate: async (value) => {
            // Check username availability via API
            const response = await fetch(`/api/check-username?username=${value}`);
            const { available } = await response.json();

            return available ? true : 'Username already taken';
        }
    }
};
```

---

## Blueprint Composition

### B.extend() - Merge Blueprints

Combine multiple blueprints into one:

```javascript
// Base blueprint
const baseUserBlueprint = {
    name: { type: 'string', required: true },
    email: { type: 'email', required: true }
};

// Admin blueprint extends base
const adminBlueprint = B.extend(baseUserBlueprint, {
    role: { type: 'string', default: 'admin', options: ['admin', 'moderator'] },
    permissions: { type: 'array', default: [] },
    accessLevel: { type: 'number', min: 1, max: 10, default: 5 }
});

// Result: adminBlueprint has all 5 fields
```

### B.pick() - Extract Fields

Create a subset blueprint with only specific fields:

```javascript
const fullUserBlueprint = {
    name: { type: 'string', required: true },
    email: { type: 'email', required: true },
    password: { type: 'password', required: true },
    age: { type: 'number', min: 18 },
    bio: { type: 'textarea', maxLength: 500 }
};

// Public profile blueprint (no password)
const publicProfileBlueprint = B.pick(fullUserBlueprint, ['name', 'bio']);

// Result: Only name and bio fields
```

### B.omit() - Remove Fields

Create a blueprint excluding specific fields:

```javascript
const adminBlueprint = {
    name: { type: 'string', required: true },
    email: { type: 'email', required: true },
    role: { type: 'string', default: 'admin' },
    permissions: { type: 'array', default: [] }
};

// Regular user blueprint (no admin fields)
const userBlueprint = B.omit(adminBlueprint, ['permissions']);

// Result: name, email, role (no permissions)
```

### Composition Patterns

**Progressive Enhancement:**

```javascript
// Start minimal
const basicBlueprint = {
    email: { type: 'email', required: true }
};

// Add registration fields
const registrationBlueprint = B.extend(basicBlueprint, {
    password: { type: 'password', required: true, minLength: 8 },
    confirmPassword: { type: 'password', required: true }
});

// Add full profile fields
const profileBlueprint = B.extend(registrationBlueprint, {
    name: { type: 'string', required: true },
    bio: { type: 'textarea', maxLength: 500 },
    avatar: { type: 'file', accept: 'image/*' }
});
```

**Shared Base + Variants:**

```javascript
const baseProductBlueprint = {
    name: { type: 'string', required: true },
    price: { type: 'number', min: 0, required: true },
    description: { type: 'textarea', maxLength: 1000 }
};

// Physical products
const physicalProductBlueprint = B.extend(baseProductBlueprint, {
    weight: { type: 'number', min: 0, required: true },
    dimensions: { type: 'string' },
    shippingClass: { type: 'select', options: ['standard', 'express', 'freight'] }
});

// Digital products
const digitalProductBlueprint = B.extend(baseProductBlueprint, {
    downloadUrl: { type: 'string', required: true },
    fileSize: { type: 'number' },
    format: { type: 'select', options: ['pdf', 'epub', 'mp3', 'mp4'] }
});
```

---

## Form Integration

### Basic Form Generation

```javascript
const blueprint = {
    name: { type: 'string', required: true, label: 'Full Name' },
    email: { type: 'email', required: true, label: 'Email' }
};

const form = F.create(blueprint, {}, {
    container: '#form-container',
    onSubmit: (data) => {
        console.log('Submitted:', data);
    }
});
```

### Form Layouts

**Stacked Layout** (default):

```javascript
F.create(blueprint, {}, {
    layout: 'stacked'  // One field per row
});
```

**Grid Layout** (2 or 3 columns):

```javascript
F.create(blueprint, {}, {
    layout: 'grid-2'   // 2 columns
});

F.create(blueprint, {}, {
    layout: 'grid-3'   // 3 columns
});
```

**Inline Layout:**

```javascript
F.create(blueprint, {}, {
    layout: 'inline'   // All fields in one row
});
```

### Form with Initial Data

```javascript
const initialData = {
    name: 'John Doe',
    email: 'john@example.com'
};

const form = F.create(blueprint, initialData, {
    container: '#form-container'
});
```

### Modal Forms

```javascript
const form = F.modal(blueprint, {}, {
    title: 'Add New Contact',
    confirmText: 'Save',
    onSave: async (data) => {
        // Save logic
        await Domma.http.post('/api/contacts', data);
    }
});

form.open();
```

### Wizard Forms (Multi-Step)

```javascript
const wizard = F.wizard({
    steps: [
        {
            title: 'Personal Info',
            blueprint: personalInfoBlueprint
        },
        {
            title: 'Account Setup',
            blueprint: accountBlueprint
        },
        {
            title: 'Preferences',
            blueprint: preferencesBlueprint
        }
    ],
    onComplete: (allData) => {
        console.log('Wizard completed:', allData);
    }
});
```

---

## Model Integration

### Creating Reactive Models

```javascript
const userBlueprint = {
    name: { type: 'string', required: true },
    email: { type: 'email', required: true },
    age: { type: 'number', min: 18, max: 120 }
};

// Create model from blueprint
const user = M.create(userBlueprint);

// Set values (with validation)
user.set('name', 'Alice');
user.set('email', 'alice@example.com');
user.set('age', 25);

// Get values
console.log(user.get('name'));  // 'Alice'
console.log(user.get());        // { name: 'Alice', email: 'alice@example.com', age: 25 }
```

### Model Validation

```javascript
// Validation happens automatically on set()
try {
    user.set('age', 15);  // ❌ Throws error
} catch (error) {
    console.error(error.message);  // "Value must be at least 18"
}

// Validate all fields
const result = user.validate();
if (!result.valid) {
    console.error('Validation errors:', result.errors);
}
```

### Model Persistence

```javascript
// Auto-save to localStorage
const settings = M.create(settingsBlueprint, {}, {
    persist: 'app-settings',  // localStorage key
    autoSave: true            // Save on every change
});

// Manual persistence control
settings.save();           // Save to localStorage
settings.load();           // Load from localStorage
settings.clearStorage();   // Remove from localStorage
```

### Reactive Data Binding

```javascript
const model = M.create(blueprint);

// Bind model field to input element
M.bind(model, 'name', '#name-input', {
    twoWay: true,  // Sync both ways
    format: (value) => value.toUpperCase(),  // Format for display
    parse: (value) => value.trim()           // Parse from input
});

// Model changes update the DOM
model.set('name', 'John');  // Input value becomes "JOHN"

// DOM changes update the model
// User types "alice" → model.get('name') === 'alice'
```

### Change Listeners

```javascript
// Listen to any field change
user.onChange((event) => {
    console.log(`${event.field} changed from ${event.oldValue} to ${event.newValue}`);
});

// Listen to specific field
user.onFieldChange('email', (newValue, oldValue) => {
    console.log(`Email changed: ${oldValue} → ${newValue}`);
});
```

---

## CRUD Integration

### Full CRUD with API

```javascript
const crud = F.crud('#crud-container', userBlueprint, {
    apiUrl: '/api/users',
    onCreate: (data) => {
        Domma.elements.toast('User created!', { type: 'success' });
    },
    onUpdate: (data) => {
        Domma.elements.toast('User updated!', { type: 'success' });
    },
    onDelete: (id) => {
        Domma.elements.toast('User deleted!', { type: 'success' });
    }
});
```

### CRUD with localStorage

```javascript
const crud = F.crud('#crud-container', taskBlueprint, {
    storage: 'tasks',  // Use localStorage instead of API
    onCreate: (data) => console.log('Task created:', data)
});
```

### CRUD Features

The CRUD component automatically provides:

- **Data table** with sorting, filtering, pagination
- **Create form** (modal or inline)
- **Edit form** (pre-populated with selected row)
- **Delete confirmation**
- **Validation** (from blueprint)
- **Loading states**
- **Error handling**

---

## Tutorial: Building a Contact Form

Let's build a complete contact management system step by step.

### Step 1: Define the Blueprint

```javascript
const contactBlueprint = {
    firstName: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 50,
        label: 'First Name',
        placeholder: 'Enter first name'
    },
    lastName: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 50,
        label: 'Last Name',
        placeholder: 'Enter last name'
    },
    email: {
        type: 'email',
        required: true,
        label: 'Email Address',
        placeholder: 'contact@example.com',
        validate: async (value) => {
            // Check if email is already in use
            const existing = S.get('contacts', []);
            const duplicate = existing.find(c => c.email === value);
            return duplicate ? 'Email already exists' : true;
        }
    },
    phone: {
        type: 'string',
        pattern: /^[\d\s\-+()]+$/,
        label: 'Phone Number',
        placeholder: '+44 20 1234 5678',
        help: 'Optional contact number'
    },
    company: {
        type: 'string',
        maxLength: 100,
        label: 'Company',
        placeholder: 'Company name (optional)'
    },
    notes: {
        type: 'textarea',
        maxLength: 500,
        label: 'Notes',
        rows: 4,
        placeholder: 'Additional notes about this contact'
    },
    favorited: {
        type: 'boolean',
        default: false,
        label: 'Add to favorites'
    }
};
```

### Step 2: Create a Reactive Model

```javascript
// Create model with localStorage persistence
const contact = M.create(contactBlueprint, {}, {
    persist: 'contact-draft',
    autoSave: true
});

// Listen for changes
contact.onChange((event) => {
    console.log(`${event.field} changed`);
});
```

### Step 3: Generate the Form

```javascript
const form = F.create(contactBlueprint, contact.get(), {
    container: '#contact-form',
    layout: 'grid-2',  // 2-column layout
    submitText: 'Save Contact',
    onSubmit: (data) => {
        // Save to localStorage
        const contacts = S.get('contacts', []);
        contacts.push({ id: Date.now(), ...data });
        S.set('contacts', contacts);

        // Clear form
        contact.reset();
        form.clear();

        // Show success
        Domma.elements.toast('Contact saved!', { type: 'success' });
    }
});
```

### Step 4: Add Validation Feedback

The form automatically shows validation errors. You can customize:

```javascript
const form = F.create(contactBlueprint, {}, {
    container: '#contact-form',
    validateOnBlur: true,    // Validate when leaving field
    validateOnChange: false,  // Don't validate on every keystroke
    showErrors: 'inline'      // Show errors below fields
});
```

### Step 5: Full CRUD

```javascript
// Replace simple form with full CRUD
const crud = F.crud('#contact-manager', contactBlueprint, {
    storage: 'contacts',
    table: {
        columns: ['firstName', 'lastName', 'email', 'company'],
        sortable: true,
        searchable: true,
        pagination: true,
        pageSize: 10
    },
    form: {
        layout: 'grid-2',
        modal: true  // Forms open in modals
    },
    onCreate: (data) => {
        Domma.elements.toast('Contact added!', { type: 'success' });
    },
    onUpdate: (data) => {
        Domma.elements.toast('Contact updated!', { type: 'success' });
    },
    onDelete: (id) => {
        Domma.elements.toast('Contact deleted!', { type: 'success' });
    }
});
```

---

## Real-World Examples

### Example 1: User Registration

```javascript
const registrationBlueprint = {
    email: {
        type: 'email',
        required: true,
        label: 'Email Address',
        validate: async (value) => {
            const res = await fetch(`/api/check-email?email=${value}`);
            const { available } = await res.json();
            return available ? true : 'Email already registered';
        }
    },
    password: {
        type: 'password',
        required: true,
        minLength: 8,
        label: 'Password',
        help: 'At least 8 characters with uppercase, lowercase, and number',
        validate: (value) => {
            if (!/[A-Z]/.test(value)) return 'Need at least one uppercase letter';
            if (!/[a-z]/.test(value)) return 'Need at least one lowercase letter';
            if (!/[0-9]/.test(value)) return 'Need at least one number';
            return true;
        }
    },
    confirmPassword: {
        type: 'password',
        required: true,
        label: 'Confirm Password',
        validate: (value, data) => {
            return value === data.password ? true : 'Passwords do not match';
        }
    },
    agreeToTerms: {
        type: 'boolean',
        required: true,
        label: 'I agree to the Terms of Service',
        validate: (value) => {
            return value === true ? true : 'You must accept the terms';
        }
    }
};

// Use with modal form
F.modal(registrationBlueprint, {}, {
    title: 'Create Account',
    confirmText: 'Sign Up',
    onSave: async (data) => {
        await Domma.http.post('/api/register', {
            email: data.email,
            password: data.password
        });
        Domma.elements.toast('Account created!', { type: 'success' });
    }
});
```

### Example 2: Settings Panel

```javascript
const settingsBlueprint = {
    // Notifications
    emailNotifications: {
        type: 'boolean',
        default: true,
        label: 'Email Notifications',
        help: 'Receive updates via email'
    },
    pushNotifications: {
        type: 'boolean',
        default: false,
        label: 'Push Notifications'
    },
    notificationFrequency: {
        type: 'select',
        options: ['immediately', 'hourly', 'daily', 'weekly'],
        default: 'daily',
        label: 'Notification Frequency'
    },

    // Privacy
    profileVisibility: {
        type: 'radio',
        options: [
            { value: 'public', label: 'Public' },
            { value: 'friends', label: 'Friends Only' },
            { value: 'private', label: 'Private' }
        ],
        default: 'friends',
        label: 'Profile Visibility'
    },
    showEmail: {
        type: 'boolean',
        default: false,
        label: 'Show email on profile'
    },

    // Display
    theme: {
        type: 'select',
        options: ['light', 'dark', 'auto'],
        default: 'auto',
        label: 'Theme'
    },
    language: {
        type: 'select',
        options: ['en', 'es', 'fr', 'de'],
        default: 'en',
        label: 'Language'
    }
};

// Create with persistence
const settings = M.create(settingsBlueprint, {}, {
    persist: 'user-settings',
    autoSave: true
});

const form = F.create(settingsBlueprint, settings.get(), {
    container: '#settings',
    layout: 'stacked',
    submitText: 'Save Settings',
    model: settings  // Two-way binding with model
});
```

### Example 3: Contact Management (with Groups)

```javascript
const contactBlueprint = {
    firstName: {
        type: 'string',
        required: true,
        label: 'First Name'
    },
    lastName: {
        type: 'string',
        required: true,
        label: 'Last Name'
    },
    email: {
        type: 'email',
        required: true,
        label: 'Email'
    },
    phone: {
        type: 'string',
        label: 'Phone'
    },
    groups: {
        type: 'checkbox-group',
        options: ['Family', 'Friends', 'Work', 'VIP'],
        default: [],
        label: 'Groups'
    },
    tags: {
        type: 'pillbox',  // Domma.elements.pillbox integration
        creatable: true,
        maxItems: 5,
        label: 'Tags',
        placeholder: 'Add tags...'
    },
    notes: {
        type: 'textarea',
        rows: 3,
        label: 'Notes'
    }
};

F.crud('#contacts', contactBlueprint, {
    apiUrl: '/api/contacts',
    table: {
        columns: {
            name: {
                label: 'Name',
                render: (row) => `${row.firstName} ${row.lastName}`
            },
            email: { label: 'Email' },
            groups: {
                label: 'Groups',
                render: (row) => row.groups.join(', ')
            }
        },
        searchable: true,
        sortable: true
    }
});
```

### Example 4: E-commerce Product

```javascript
const productBlueprint = {
    name: {
        type: 'string',
        required: true,
        maxLength: 100,
        label: 'Product Name'
    },
    sku: {
        type: 'string',
        required: true,
        pattern: /^[A-Z0-9-]+$/,
        label: 'SKU',
        placeholder: 'PROD-001'
    },
    description: {
        type: 'textarea',
        required: true,
        maxLength: 1000,
        rows: 5,
        label: 'Description'
    },
    category: {
        type: 'select',
        required: true,
        options: ['Electronics', 'Clothing', 'Home', 'Books'],
        label: 'Category'
    },
    price: {
        type: 'number',
        required: true,
        min: 0,
        step: 0.01,
        label: 'Price (£)',
        validate: (value) => {
            return value > 0 ? true : 'Price must be greater than 0';
        }
    },
    compareAtPrice: {
        type: 'number',
        min: 0,
        step: 0.01,
        label: 'Compare at Price (£)',
        help: 'Original price if on sale'
    },
    stock: {
        type: 'number',
        required: true,
        min: 0,
        default: 0,
        label: 'Stock Quantity'
    },
    images: {
        type: 'file',
        accept: 'image/*',
        multiple: true,
        label: 'Product Images'
    },
    active: {
        type: 'boolean',
        default: true,
        label: 'Active',
        help: 'Visible in storefront'
    },
    featured: {
        type: 'boolean',
        default: false,
        label: 'Featured Product'
    },
    tags: {
        type: 'pillbox',
        creatable: true,
        label: 'Tags',
        placeholder: 'Add product tags'
    }
};

F.crud('#products', productBlueprint, {
    apiUrl: '/api/products',
    table: {
        columns: ['name', 'sku', 'category', 'price', 'stock', 'active'],
        sortable: true,
        searchable: true,
        rowClass: (row) => row.stock === 0 ? 'text-muted' : ''
    },
    form: {
        layout: 'grid-2',
        modal: true
    }
});
```

---

## Best Practices

### 1. Blueprint Naming Conventions

Use clear, descriptive names ending with "Blueprint":

```javascript
// ✅ Good
const userBlueprint = { ... };
const productBlueprint = { ... };
const settingsBlueprint = { ... };

// ❌ Avoid
const schema = { ... };
const def = { ... };
const config = { ... };
```

### 2. Field Organisation

Group related fields together:

```javascript
const userProfileBlueprint = {
    // Personal info
    firstName: { ... },
    lastName: { ... },
    email: { ... },

    // Address
    street: { ... },
    city: { ... },
    postcode: { ... },

    // Preferences
    theme: { ... },
    language: { ... }
};
```

### 3. Reuse Blueprints

Don't repeat yourself - use composition:

```javascript
// Define once
const addressBlueprint = {
    street: { type: 'string', required: true },
    city: { type: 'string', required: true },
    postcode: { type: 'string', required: true }
};

// Reuse in multiple contexts
const userBlueprint = B.extend({
    name: { type: 'string', required: true }
}, addressBlueprint);

const storeBlueprint = B.extend({
    storeName: { type: 'string', required: true }
}, addressBlueprint);
```

### 4. Validation Strategies

**Client-side only:**
```javascript
const blueprint = {
    email: {
        type: 'email',
        required: true,
        pattern: /^[^@]+@[^@]+\.[^@]+$/
    }
};
```

**Client + server validation:**
```javascript
const blueprint = {
    username: {
        type: 'string',
        required: true,
        minLength: 3,       // Client-side
        validate: async (value) => {
            // Server-side check
            const res = await fetch(`/api/check-username?name=${value}`);
            const { available } = await res.json();
            return available ? true : 'Username taken';
        }
    }
};
```

### 5. Error Handling

Always handle validation errors gracefully:

```javascript
try {
    user.set('age', -5);
} catch (error) {
    Domma.elements.toast(error.message, { type: 'error' });
}

// Or check validation before setting
const result = user.validate();
if (!result.valid) {
    result.errors.forEach(err => {
        console.error(`${err.field}: ${err.error}`);
    });
}
```

### 6. Default Values

Provide sensible defaults where applicable:

```javascript
const settingsBlueprint = {
    theme: {
        type: 'select',
        options: ['light', 'dark', 'auto'],
        default: 'auto'  // Good default
    },
    notifications: {
        type: 'boolean',
        default: true    // Most users want notifications
    }
};
```

### 7. Help Text

Add helpful guidance for users:

```javascript
const blueprint = {
    password: {
        type: 'password',
        required: true,
        minLength: 8,
        label: 'Password',
        help: 'Must be at least 8 characters with uppercase, lowercase, and numbers'
    }
};
```

---

## API Reference

### Blueprint Field Options

| Option | Type | Description | Example |
|--------|------|-------------|---------|
| `type` | string | Field type (required) | `'string'`, `'number'`, `'email'` |
| `required` | boolean | Field is required | `true` |
| `default` | any | Default value | `''`, `0`, `[]` |
| `min` | number | Minimum value (numbers) | `0`, `18` |
| `max` | number | Maximum value (numbers) | `100`, `120` |
| `minLength` | number | Minimum length (strings) | `3`, `8` |
| `maxLength` | number | Maximum length (strings) | `50`, `255` |
| `pattern` | RegExp | Validation pattern | `/^[A-Z]/` |
| `validate` | function | Custom validator | `(val) => true` |
| `label` | string | Display label | `'Full Name'` |
| `placeholder` | string | Input placeholder | `'Enter your name'` |
| `help` | string | Help text | `'Your legal name'` |
| `options` | array | Options for select/radio | `['A', 'B', 'C']` |
| `disabled` | boolean | Disable the field | `false` |
| `formConfig` | object | Additional form options | `{ span: 2, rows: 4 }` |

### Type Validators

```javascript
M.types = {
    string: (val) => typeof val === 'string',
    number: (val) => typeof val === 'number' && !Number.isNaN(val),
    boolean: (val) => typeof val === 'boolean',
    array: (val) => Array.isArray(val),
    object: (val) => val !== null && typeof val === 'object' && !Array.isArray(val),
    date: (val) => val instanceof Date && !isNaN(val.getTime()),
    any: () => true
};
```

### Composition Methods

```javascript
// Extend blueprints
B.extend(blueprint1, blueprint2, ...blueprintN);

// Pick fields
B.pick(blueprint, ['field1', 'field2']);

// Omit fields
B.omit(blueprint, ['field1', 'field2']);
```

---

## Related Documentation

- [Forms Documentation](./Forms.md) - Form generation and CRUD
- [Models Documentation](./Models.md) - Reactive models and pub/sub
- [API Reference](./API.md) - Complete Domma API
- [Getting Started](./GettingStarted.md) - Quick start guide

---

## Quick Links

- [Blueprint Showcase](../public/showcase/blueprints/) - Interactive demos
- [Forms Showcase](../public/showcase/forms/) - Form generation examples
- [Models Showcase](../public/showcase/models/) - Model examples
- [MiniApps](../public/miniapps/) - Real-world Blueprint usage

---

**Blueprints are the DNA of your data layer in Domma** - define once, validate everywhere, generate forms automatically, and build complete CRUD interfaces with minimal code. Master Blueprints, and you master Domma's most powerful feature.
