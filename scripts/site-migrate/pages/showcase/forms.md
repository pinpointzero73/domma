---
title: Form Generation
description: "Blueprint-driven forms with validation, modals, wizards, and complete CRUD operations."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Form Generation" tagline="Blueprint-driven forms with validation, modals, wizards, and complete CRUD operations." align="center"][/hero]

## Basic Form Generation

Generate forms automatically from blueprint definitions with built-in validation and type mapping.

```javascript
// Define a blueprint
const userBlueprint = {
    name: {
        type: 'string',
        label: 'Full Name',
        required: true,
        minLength: 2
    },
    email: {
        type: 'email',
        label: 'Email Address',
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    age: {
        type: 'number',
        label: 'Age',
        min: 18,
        max: 120
    },
    role: {
        type: 'select',
        label: 'Role',
        options: [
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Administrator' }
        ]
    },
    newsletter: {
        type: 'boolean',
        label: 'Subscribe to Newsletter'
    }
};

// Create form
const form = Domma.forms.create(userBlueprint, initialData, {
    onSubmit: (data, formInstance) => {
        console.log('Form submitted:', data);
    }
});

// Render to DOM
form.renderTo('#form-container');
```

[showcase-demo id="showcase/forms/basic-form" title="Basic Form" /]

## Form Layouts

Support for different layout styles: stacked, grid, and inline layouts with customizable sections.

```javascript
// Grid layout with sections
const profileForm = Domma.forms.create(blueprint, data, {
    layout: 'grid',
    columns: 2,
    sections: [
        {
            title: 'Personal Information',
            fields: ['name', 'email', 'phone']
        },
        {
            title: 'Account Settings', 
            fields: ['role', 'newsletter', 'notifications']
        }
    ]
});
```

[showcase-demo id="showcase/forms/layout-styles" title="Layout Styles" /]

## Chooser - Visual Option-Picker

A blueprint-driven option picker that replaces native radio/checkbox controls when the choice deserves visual weight. `type: 'chooser'` covers all four *variant × multiple* combinations from one config and integrates with the same validation, model binding, and submission pipeline as every other field type.

```javascript
// Card-style single-select with rich per-option metadata
const planBlueprint = {
    plan: {
        type: 'chooser',
        variant: 'card',           // 'card' | 'chip'
        multiple: false,           // false = radio, true = checkbox semantics
        density: 'comfortable',    // 'comfortable' | 'compact'
        columns: 3,                // grid columns (cards only - chips wrap)
        required: true,
        label: 'Choose your plan',
        accent: 'primary',                       // semantic name OR '#hex'
        accentStyle: 'border',                    // 'border' | 'solid' | 'glow' | 'overlay' | 'underline'
        options: [
            { value: 'starter', label: 'Starter', icon: 'rocket',
              description: 'For solo builders.' },
            { value: 'pro',     label: 'Pro',     icon: 'zap',
              description: 'Teams up to 10.', recommended: true,
              badge: { text: 'POPULAR', type: 'success' } },
            { value: 'ent',     label: 'Enterprise', icon: 'briefcase',
              description: 'Custom limits + SSO.' }
        ]
    }
};

// Chip-style multi-select tag picker
const tagsBlueprint = {
    tags: {
        type: 'chooser',
        variant: 'chip',
        multiple: true,
        label: 'Pick your tags',
        options: [
            { value: 'js',   label: 'JavaScript', icon: 'code' },
            { value: 'css',  label: 'CSS',        icon: 'palette' },
            { value: 'a11y', label: 'A11y',       icon: 'eye' },
            { value: 'perf', label: 'Performance', icon: 'zap' }
        ]
    }
};
```

[showcase-demo id="showcase/forms/live-demo-card-single-select-with-required-valid" title="Live demo - card single-select with required validation" /]

[showcase-demo id="showcase/forms/field-reference" title="Field reference" /]

## Modal Forms

Create professional modal forms with automatic event handling and error management.

```javascript
// Modal form
const modal = Domma.forms.modal(userBlueprint, userData, {
    title: 'Edit User Profile',
    size: 'medium',
    saveText: 'Update Profile',
    onSave: async (formData, formInstance) => {
        // Handle form submission
        await updateUserProfile(formData);
    },
    onError: (error, formData, formInstance) => {
        console.error('Form error:', error);
    }
});

modal.open();
```

[showcase-demo id="showcase/forms/modal-forms" title="Modal Forms" /]

## Multi-Step Wizard

Create multi-step workflows with progress tracking and step validation.

```javascript
// Multi-step wizard
const wizard = Domma.forms.wizard([
    {
        title: 'Account Details',
        description: 'Basic account information',
        blueprint: {
            username: { type: 'string', required: true },
            email: { type: 'email', required: true }
        }
    },
    {
        title: 'Profile Information',
        description: 'Tell us about yourself',
        blueprint: {
            name: { type: 'string', required: true },
            bio: { type: 'textarea' }
        }
    },
    {
        title: 'Preferences',
        description: 'Customize your experience',
        blueprint: {
            theme: { type: 'select', options: ['light', 'dark'] },
            notifications: { type: 'boolean' }
        }
    }
], {}, {
    title: 'Account Setup Wizard',
    onComplete: async (allData, formInstance) => {
        console.log('Wizard completed:', allData);
    }
});

wizard.open();
```

[showcase-demo id="showcase/forms/registration-wizard" title="Registration Wizard" /]

## Complete CRUD Operations

Zero-configuration CRUD interfaces with automatic table generation and form modals.

```javascript
// Complete CRUD setup
const userCrud = Domma.forms.crud({
    blueprint: userBlueprint,
    endpoint: '/api/users',
    tableSelector: '#users-table',
    title: 'Manage Users',
    primaryKey: 'id',
    displayField: 'name',
    onSuccess: (message) => console.log(message),
    onError: (error) => console.error(error)
});

// Initialize CRUD interface
await userCrud.init();
```

[showcase-demo id="showcase/forms/crud-operations-mock-data" title="CRUD Operations (Mock Data)" /]

## Validation & Error Handling

Built-in and custom validators with real-time feedback and comprehensive error handling.

```javascript
// Blueprint with various validation rules
const validationBlueprint = {
    username: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
        formConfig: {
            hint: 'Only letters, numbers, and underscores'
        }
    },
    password: {
        type: 'password',
        required: true,
        minLength: 8,
        validate: (value) => {
            if (!/[A-Z]/.test(value)) return 'Must contain uppercase letter';
            if (!/[0-9]/.test(value)) return 'Must contain number';
            return true;
        }
    },
    confirmPassword: {
        type: 'password',
        required: true,
        validate: (value, allData) => {
            return value === allData.password || 'Passwords do not match';
        }
    },
    age: {
        type: 'number',
        min: 13,
        max: 120,
        validate: (value) => {
            if (value < 18) return 'Must be 18 or older for full access';
            return true;
        }
    }
};
```

[showcase-demo id="showcase/forms/form-validation" title="Form Validation" /]

## Integration with Domma Models

Seamless integration with Domma's reactive model system for two-way data binding and persistence.

```javascript
// Create model with persistence
const userModel = M.create(userBlueprint, initialData, {
    persist: 'user-profile'  // Auto-save to localStorage
});

// Form automatically binds to model
const form = Domma.forms.create(userBlueprint, userModel.get(), {
    model: userModel,  // Two-way binding
    onSubmit: (data, formInstance) => {
        userModel.set(data);  // Updates model and saves to storage
    }
});

// Listen for model changes
userModel.onChange((changes) => {
    console.log('Model updated:', changes);
});
```

[showcase-demo id="showcase/forms/model-integration" title="Model Integration" /]

## Complete Forms Reference

[showcase-demo id="showcase/forms/domma-forms-reference" title="Domma Forms Reference" /]

[showcase-demo id="showcase/forms/domma-forms-reference-2" title="Domma Forms Reference" /]

### [icon name="edit" /] Basic Form

[showcase-demo id="showcase/forms/basic-form-2" title="Basic Form" /]

```javascript
const form = Domma.forms.create({
  name: { type: 'string', required: true },
  email: { type: 'email', required: true }
}, {}, {
  onSubmit: (data) => console.log(data)
});
form.renderTo('#container');
```

### [icon name="external-link" /] Modal Form

[showcase-demo id="showcase/forms/modal-form" title="Modal Form" /]

```javascript
const modal = Domma.forms.modal(blueprint, data, {
  title: 'Edit User',
  onSave: async (data) => await api.save(data)
});
modal.open();
```

### [icon name="star" /] Wizard

[showcase-demo id="showcase/forms/wizard" title="Wizard" /]

```javascript
const wizard = Domma.forms.wizard(steps, data, {
  title: 'Setup Wizard',
  onComplete: async (data) => await api.setup(data)
});
wizard.open();
```

### [icon name="database" /] CRUD Interface

[showcase-demo id="showcase/forms/crud-interface" title="CRUD Interface" /]

```javascript
const crud = Domma.forms.crud({
  blueprint: userBlueprint,
  endpoint: '/api/users',
  tableSelector: '#users-table'
});
await crud.init();
```
