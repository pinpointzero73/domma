# CLAUDE.md - Blueprints Showcase

This file provides guidance for maintaining and extending the Blueprints showcase page.

## Overview

The Blueprints showcase demonstrates Domma's most powerful feature: **unified schema definitions** that drive validation, form generation, models, and CRUD operations.

## Showcase Sections

### 1. Live Blueprint Editor

**Purpose:** Let users define a blueprint and see the generated form in real-time.

**Implementation:**
- Textarea for blueprint definition (JavaScript object)
- "Generate Form" button
- Result pane showing the rendered form
- Syntax highlighting for the blueprint code
- Error handling for invalid blueprints

**Key Features:**
- Real-time validation of blueprint syntax
- Toggle between code view and form view
- Copy blueprint code to clipboard
- Pre-loaded example blueprints

### 2. Blueprint → Form Demo

**Purpose:** Show how blueprints automatically generate forms.

**Pre-built Examples:**
- Simple contact form (name, email, message)
- User registration (email, password, confirm password)
- Settings panel (toggles, selects, radios)
- Complex form (nested fields, conditional logic)

**Features to Demonstrate:**
- Different field types
- Validation in action
- Layout options (stacked, grid, inline)
- Form submission

### 3. Blueprint → Model Demo

**Purpose:** Show reactive models created from blueprints.

**Demonstrations:**
- Creating a model from blueprint
- Setting and getting values
- Validation enforcement
- Data binding to DOM elements
- localStorage persistence

**Interactive Elements:**
- Input fields bound to model
- Live model state display (JSON)
- Validation error display
- Reset and clear buttons

### 4. Full CRUD Demo

**Purpose:** Show complete CRUD functionality from a single blueprint.

**Features:**
- Data table with sorting/filtering
- Create form (modal)
- Edit form (pre-populated)
- Delete confirmation
- Mock API or localStorage backend
- Loading states

**Data Source:**
- Use localStorage for demo (no backend required)
- Pre-populate with sample data
- Allow users to add/edit/delete

### 5. Composition Playground

**Purpose:** Demonstrate blueprint composition methods.

**Interactive Demos:**
- `M.extend()` - Show base + extension + result
- `M.pick()` - Show full blueprint → subset
- `M.omit()` - Show full blueprint → fields removed
- Visual diff showing what changed

**Features:**
- Side-by-side code comparison
- Highlighted differences
- Copy result blueprint

## File Structure

```
showcase/blueprints/
├── CLAUDE.md           # This file (development guide)
└── index.html          # Interactive showcase page
```

## Code Patterns

### Blueprint Definition Template

```javascript
const exampleBlueprint = {
    fieldName: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 50,
        label: 'Field Label',
        placeholder: 'Enter value...',
        help: 'Helper text',
        validate: (value) => {
            // Custom validation
            return true; // or error message
        }
    }
};
```

### Form Generation

```javascript
const form = Domma.forms.create(blueprint, initialData, {
    container: '#form-container',
    layout: 'stacked',
    onSubmit: (data) => {
        console.log('Form submitted:', data);
    }
});
```

### Model Creation

```javascript
const model = M.create(blueprint, {}, {
    persist: 'storage-key',
    autoSave: true
});
```

### CRUD Setup

```javascript
const crud = Domma.forms.crud('#crud-container', blueprint, {
    storage: 'local-storage-key',
    onCreate: (data) => console.log('Created:', data),
    onUpdate: (data) => console.log('Updated:', data),
    onDelete: (id) => console.log('Deleted:', id)
});
```

## Example Blueprints for Showcase

### Simple Contact Form

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
        rows: 4,
        label: 'Message',
        placeholder: 'Your message here...'
    }
};
```

### User Registration

```javascript
const registrationBlueprint = {
    email: {
        type: 'email',
        required: true,
        label: 'Email Address'
    },
    password: {
        type: 'password',
        required: true,
        minLength: 8,
        label: 'Password',
        help: 'At least 8 characters',
        validate: (value) => {
            if (!/[A-Z]/.test(value)) return 'Need uppercase letter';
            if (!/[0-9]/.test(value)) return 'Need a number';
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
        validate: (value) => value ? true : 'You must accept the terms'
    }
};
```

### Settings Panel

```javascript
const settingsBlueprint = {
    notifications: {
        type: 'boolean',
        default: true,
        label: 'Email Notifications'
    },
    theme: {
        type: 'select',
        options: ['light', 'dark', 'auto'],
        default: 'auto',
        label: 'Theme'
    },
    language: {
        type: 'radio',
        options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' }
        ],
        default: 'en',
        label: 'Language'
    }
};
```

### Product Catalogue (Complex)

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
        label: 'SKU'
    },
    price: {
        type: 'number',
        required: true,
        min: 0,
        step: 0.01,
        label: 'Price (£)'
    },
    category: {
        type: 'select',
        required: true,
        options: ['Electronics', 'Clothing', 'Home'],
        label: 'Category'
    },
    description: {
        type: 'textarea',
        required: true,
        maxLength: 1000,
        rows: 5,
        label: 'Description'
    },
    inStock: {
        type: 'boolean',
        default: true,
        label: 'In Stock'
    },
    tags: {
        type: 'pillbox',
        creatable: true,
        label: 'Tags'
    }
};
```

## UI/UX Guidelines

### Layout

- Use tabs or sections to separate different demos
- Clear headings for each section
- Responsive design (mobile-friendly)
- Consistent spacing and typography

### Interactivity

- Immediate visual feedback for all actions
- Loading states for async operations
- Success/error toast notifications
- Smooth transitions between states

### Code Display

- Syntax highlighting for blueprints
- Line numbers for readability
- Copy-to-clipboard functionality
- Toggle between code and result views

### Navigation

- Sticky navigation for sections
- "Jump to" links for quick access
- Back-to-top button
- Breadcrumb navigation

## Testing Checklist

Before deploying the showcase:

- [ ] All example blueprints render correctly
- [ ] Form validation works for all field types
- [ ] Models update reactively
- [ ] CRUD operations (create, read, update, delete) work
- [ ] Composition methods (extend, pick, omit) produce correct results
- [ ] Copy-to-clipboard works
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] All interactive elements respond correctly
- [ ] Icon scanning works (if using icons)

## Related Documentation

- [Blueprints Reference](../../../docs/Blueprints.md) - Comprehensive documentation
- [Forms Showcase](../forms/) - Form generation examples
- [Models Showcase](../models/) - Reactive model examples
- [Main Showcase Guide](../CLAUDE.md) - Showcase development meta guide

## Development Notes

- Use Domma for all DOM manipulation (`$`)
- Use `_` for utilities (groupBy, debounce, etc.)
- Use `S` for localStorage operations
- Always call `Domma.icons.scan()` after DOM updates
- Follow existing showcase patterns for consistency

## Future Enhancements

Potential additions to the showcase:

1. **Blueprint Library** - Pre-made blueprints users can import
2. **Visual Blueprint Builder** - Drag-and-drop blueprint creator
3. **Blueprint Validator** - Check blueprint syntax before use
4. **Blueprint Exporter** - Download blueprints as JSON/JS
5. **Blueprint Importer** - Upload and test existing blueprints
6. **Advanced Examples** - Nested blueprints, conditional fields, dynamic options
