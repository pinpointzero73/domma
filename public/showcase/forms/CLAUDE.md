# CLAUDE.md - Forms Module Showcase

This file provides guidance for working with Forms module showcase examples and the Forms API.

## Forms Module Overview

Accessed via `Domma.forms` - provides schema-driven form generation with validation, modals, wizards, and complete CRUD
operations.

## Core FormBuilder

### Basic Form Creation

```javascript
// Define schema
const userSchema = {
    name: {
        type: 'string',
        label: 'Full Name',
        required: true,
        minLength: 2,
        maxLength: 100,
        formConfig: {
            placeholder: 'Enter your full name',
            helperText: 'First and last name',
            hint: 'Required field'
        }
    },
    email: {
        type: 'email',
        label: 'Email Address',
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        formConfig: {
            placeholder: 'user@example.com'
        }
    },
    age: {
        type: 'number',
        label: 'Age',
        min: 18,
        max: 120,
        default: 25
    },
    role: {
        type: 'select',
        label: 'Role',
        required: true,
        options: [
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Administrator' }
        ],
        default: 'user'
    },
    bio: {
        type: 'textarea',
        label: 'Biography',
        formConfig: {
            rows: 4,
            placeholder: 'Tell us about yourself...'
        }
    },
    newsletter: {
        type: 'boolean',
        label: 'Subscribe to Newsletter',
        default: false
    },
    interests: {
        type: 'checkbox-group',
        label: 'Interests',
        options: [
            { value: 'tech', label: 'Technology' },
            { value: 'sports', label: 'Sports' },
            { value: 'music', label: 'Music' }
        ]
    },
    gender: {
        type: 'radio',
        label: 'Gender',
        options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
        ]
    }
};

// Create form instance
const form = Domma.forms.create(userSchema, initialData, {
    layout: 'stacked',  // 'stacked', 'grid', 'inline'
    onSubmit: (data, formInstance) => {
        console.log('Form submitted:', data);
    },
    onValidationError: (errors, formInstance) => {
        console.error('Validation failed:', errors);
    }
});

// Render to DOM
form.renderTo('#form-container');
```

### Input Type Mapping

The FormBuilder automatically maps schema types to HTML input types:

```javascript
FormBuilder.inputTypes = {
    string: 'text',
    email: 'email',
    password: 'password',
    number: 'number',
    integer: 'number',
    float: 'number',
    boolean: 'checkbox',
    date: 'date',
    datetime: 'datetime-local',
    time: 'time',
    url: 'url',
    tel: 'tel',
    color: 'color',
    range: 'range',
    file: 'file',
    hidden: 'hidden'
    // Special types:
    // select: <select> dropdown
    // textarea: <textarea>
    // radio: radio button group
    // checkbox-group: checkbox group
};
```

### Form Layouts

```javascript
// Stacked layout (default)
const form1 = Domma.forms.create(schema, data, {
    layout: 'stacked'
});

// Grid layout
const form2 = Domma.forms.create(schema, data, {
    layout: 'grid',
    columns: 2  // or 3
});

// Inline layout
const form3 = Domma.forms.create(schema, data, {
    layout: 'inline'
});

// Sections
const form4 = Domma.forms.create(schema, data, {
    layout: 'grid',
    columns: 2,
    sections: [
        {
            title: 'Personal Information',
            fields: ['name', 'email', 'age']
        },
        {
            title: 'Account Settings',
            fields: ['role', 'newsletter']
        }
    ]
});
```

### Form Validation

```javascript
// Schema validation rules
const validationSchema = {
    username: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
        validate: (value) => {
            if (value.includes('admin')) {
                return 'Username cannot contain "admin"';
            }
            return true;
        }
    },
    password: {
        type: 'password',
        required: true,
        minLength: 8,
        validate: (value) => {
            if (!/[A-Z]/.test(value)) return 'Must contain uppercase letter';
            if (!/[0-9]/.test(value)) return 'Must contain number';
            if (!/[!@#$%^&*]/.test(value)) return 'Must contain special character';
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
    email: {
        type: 'email',
        required: true,
        validate: async (value) => {
            // Async validation
            const exists = await checkEmailExists(value);
            return !exists || 'Email already exists';
        }
    }
};

// Manual validation
const form = Domma.forms.create(schema, data);
const isValid = form.validate();
if (!isValid) {
    console.log('Validation errors:', form.errors);
}
```

## Modal Forms

```javascript
// Basic modal form
const modal = Domma.forms.modal(userSchema, userData, {
    title: 'Edit User Profile',
    size: 'medium',  // 'small', 'medium', 'large'
    saveText: 'Update Profile',
    closeOnSave: true,  // Auto-close on successful save
    onSave: async (formData, formInstance) => {
        try {
            await api.updateUser(userData.id, formData);
            Domma.elements.toast('User updated successfully!', { type: 'success' });
        } catch (error) {
            throw error;  // Will trigger onError
        }
    },
    onError: (error, formData, formInstance) => {
        console.error('Save failed:', error);
        Domma.elements.toast('Error: ' + error.message, { type: 'error' });
    }
});

// Open the modal
modal.open();
```

## Wizard Component

```javascript
// Multi-step wizard
const wizard = Domma.forms.wizard([
    {
        title: 'Account Details',
        description: 'Basic account information',
        schema: {
            username: { type: 'string', required: true },
            email: { type: 'email', required: true }
        }
    },
    {
        title: 'Profile Information',
        description: 'Tell us about yourself',
        schema: {
            name: { type: 'string', required: true },
            bio: { type: 'textarea' },
            avatar: { type: 'file', formConfig: { accept: 'image/*' } }
        },
        layout: 'stacked'
    },
    {
        title: 'Preferences',
        description: 'Customize your experience',
        schema: {
            theme: {
                type: 'select',
                options: [
                    { value: 'light', label: 'Light Theme' },
                    { value: 'dark', label: 'Dark Theme' }
                ]
            },
            notifications: { type: 'boolean' }
        }
    }
], initialData, {
    title: 'Account Setup Wizard',
    size: 'large',
    finishText: 'Complete Setup',
    closeOnComplete: true,
    onComplete: async (allData, formInstance) => {
        try {
            await api.createUser(allData);
            Domma.elements.toast('Account created successfully!', { type: 'success' });
        } catch (error) {
            throw error;
        }
    },
    onError: (error, data, formInstance) => {
        console.error('Wizard error:', error);
    }
});

// Open wizard
wizard.open();

// Wizard control methods
wizard.nextStep();        // Go to next step
wizard.prevStep();        // Go to previous step
wizard.goToStep(2);       // Go to specific step (0-indexed)
wizard.getCurrentStep();  // Get current step index
wizard.getStepData();     // Get all collected data
wizard.setStepData({});   // Update step data
```

## CRUD Helper

```javascript
// Complete CRUD setup
const userCrud = Domma.forms.crud({
    schema: userSchema,
    endpoint: '/api/users',  // API endpoint
    tableSelector: '#users-table',
    title: 'Manage Users',
    primaryKey: 'id',
    displayField: 'name',  // Field for display in confirmations
    headers: {
        'X-API-Key': 'your-api-key'  // Custom headers
    },
    onSuccess: (message) => {
        Domma.elements.toast(message, { type: 'success' });
    },
    onError: (error) => {
        Domma.elements.toast('Error: ' + error.message, { type: 'error' });
    }
});

// Initialize CRUD interface
await userCrud.init();

// CRUD methods
await userCrud.loadData();          // Reload data from API
await userCrud.refresh();           // Refresh table
userCrud.create();                  // Open create modal
userCrud.edit(userId);              // Open edit modal
userCrud.delete(userId);            // Delete with confirmation
const data = userCrud.getData();    // Get current data
const table = userCrud.getTable();  // Get table instance

// Real-time updates (optional)
userCrud.addItem(newItem);          // Add to local data
userCrud.updateItem(id, changes);   // Update local data
userCrud.removeItem(id);            // Remove from local data
```

### CRUD Schema Extensions

```javascript
// Add table-specific rendering
const crudSchema = {
    name: {
        type: 'string',
        label: 'Full Name',
        required: true,
        tableRender: (value) => `<strong>${value}</strong>`
    },
    email: {
        type: 'email',
        label: 'Email',
        required: true,
        tableRender: (value) => `<a href="mailto:${value}">${value}</a>`
    },
    role: {
        type: 'select',
        label: 'Role',
        options: [
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' }
        ],
        tableRender: (value) => {
            const badgeClass = value === 'admin' ? 'badge-danger' : 'badge-primary';
            return `<span class="badge ${badgeClass}">${_.capitalize(value)}</span>`;
        }
    },
    created_at: {
        type: 'date',
        label: 'Created',
        formConfig: { disabled: true },  // Read-only in forms
        tableRender: (value) => D(value).format('MMM D, YYYY')
    }
};
```

## Model Integration

```javascript
// Create model with persistence
const userModel = M.create(userSchema, initialData, {
    persist: 'user-profile'  // Auto-save to localStorage
});

// Form with model binding
const form = Domma.forms.create(userSchema, userModel.get(), {
    model: userModel,  // Enable two-way binding
    onSubmit: (data, formInstance) => {
        userModel.set(data);  // Updates model and localStorage
    }
});

// Listen for model changes
userModel.onChange((changes) => {
    console.log('Model updated:', changes);
    // Form will automatically update
});

// Model methods
userModel.save();           // Manual save to localStorage
userModel.load();           // Manual load from localStorage
userModel.clearStorage();   // Clear from localStorage
userModel.reset();          // Reset to initial state
```

## Common Patterns

### User Registration Form

```javascript
const registrationSchema = {
    username: {
        type: 'string',
        required: true,
        minLength: 3,
        validate: async (value) => {
            const available = await checkUsernameAvailability(value);
            return available || 'Username is taken';
        }
    },
    email: {
        type: 'email',
        required: true,
        validate: async (value) => {
            const valid = await validateEmail(value);
            return valid || 'Email is invalid or already registered';
        }
    },
    password: {
        type: 'password',
        required: true,
        minLength: 8,
        validate: passwordValidator
    },
    confirmPassword: {
        type: 'password',
        required: true,
        validate: (value, allData) => value === allData.password || 'Passwords must match'
    },
    terms: {
        type: 'boolean',
        label: 'I agree to the Terms of Service',
        required: true,
        validate: (value) => value || 'You must accept the terms'
    }
};

const form = Domma.forms.create(registrationSchema, {}, {
    onSubmit: async (data, formInstance) => {
        try {
            await api.register(data);
            window.location.href = '/welcome';
        } catch (error) {
            throw error;
        }
    }
});
```

### Settings Panel

```javascript
const settingsSchema = {
    profile: {
        name: { type: 'string', required: true },
        email: { type: 'email', required: true },
        bio: { type: 'textarea' }
    },
    preferences: {
        theme: {
            type: 'select',
            options: [
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'auto', label: 'Auto' }
            ]
        },
        language: {
            type: 'select',
            options: [
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' }
            ]
        },
        notifications: { type: 'boolean' }
    }
};

// Tabbed settings form
const form = Domma.forms.create(settingsSchema, userData, {
    layout: 'grid',
    sections: [
        {
            title: 'Profile Information',
            fields: ['name', 'email', 'bio']
        },
        {
            title: 'Preferences',
            fields: ['theme', 'language', 'notifications']
        }
    ],
    onSubmit: async (data) => {
        await api.updateSettings(data);
        Domma.elements.toast('Settings updated!', { type: 'success' });
    }
});
```

### Contact Form

```javascript
const contactSchema = {
    name: { type: 'string', required: true },
    email: { type: 'email', required: true },
    subject: {
        type: 'select',
        required: true,
        options: [
            { value: 'support', label: 'Technical Support' },
            { value: 'sales', label: 'Sales Inquiry' },
            { value: 'feedback', label: 'Feedback' }
        ]
    },
    message: {
        type: 'textarea',
        required: true,
        minLength: 10,
        formConfig: { rows: 5 }
    },
    urgent: { type: 'boolean', label: 'Urgent' }
};

const form = Domma.forms.create(contactSchema, {}, {
    onSubmit: async (data) => {
        await api.sendContactForm(data);
        Domma.elements.alert('Thank you! We\'ll get back to you soon.');
        form.reset();
    }
});
```

## Showcase Example Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forms Showcase - Domma</title>
    <link rel="stylesheet" href="../../dist/domma.css">
    <link rel="stylesheet" href="../../dist/elements.css">
    <link rel="stylesheet" href="../../dist/themes/domma-themes.css">
</head>
<body>
    <div class="container">
        <h1>Forms Module Showcase</h1>

        <div class="demo-section">
            <h2>User Registration Form</h2>
            <div id="registration-form"></div>
            <div class="mt-4">
                <button class="btn btn-primary" id="open-modal-form">Edit in Modal</button>
                <button class="btn btn-success" id="start-wizard">Registration Wizard</button>
            </div>
        </div>
    </div>

    <script src="../../dist/domma.min.js"></script>
    <script>
        const userSchema = {
            name: { type: 'string', required: true },
            email: { type: 'email', required: true },
            role: {
                type: 'select',
                options: [
                    { value: 'user', label: 'User' },
                    { value: 'admin', label: 'Admin' }
                ]
            }
        };

        // Basic form
        const form = Domma.forms.create(userSchema, {}, {
            onSubmit: (data) => console.log('Submitted:', data)
        });
        form.renderTo('#registration-form');

        // Modal form
        $('#open-modal-form').on('click', () => {
            const modal = Domma.forms.modal(userSchema, {}, {
                title: 'User Registration',
                onSave: async (data) => {
                    console.log('Modal form submitted:', data);
                }
            });
            modal.open();
        });

        // Wizard
        $('#start-wizard').on('click', () => {
            const wizard = Domma.forms.wizard([
                {
                    title: 'Basic Info',
                    schema: { name: { type: 'string', required: true } }
                },
                {
                    title: 'Account',
                    schema: { email: { type: 'email', required: true } }
                }
            ], {}, {
                title: 'Registration Wizard',
                onComplete: (data) => console.log('Wizard completed:', data)
            });
            wizard.open();
        });
    </script>
</body>
</html>
```

## Advanced Features

### Custom Field Renderers

```javascript
const customSchema = {
    tags: {
        type: 'custom',
        label: 'Tags',
        customRender: (fieldName, fieldDef, value) => {
            return `
                <div class="tag-input">
                    <input type="text" id="${fieldName}" class="form-input" placeholder="Add tags...">
                    <div class="tag-list" id="${fieldName}-tags"></div>
                </div>
            `;
        }
    }
};
```

### Conditional Fields

```javascript
const conditionalSchema = {
    accountType: {
        type: 'select',
        options: [
            { value: 'personal', label: 'Personal' },
            { value: 'business', label: 'Business' }
        ]
    },
    companyName: {
        type: 'string',
        label: 'Company Name',
        formConfig: {
            showIf: (allData) => allData.accountType === 'business'
        }
    }
};
```

### File Upload Integration

```javascript
const uploadSchema = {
    avatar: {
        type: 'file',
        formConfig: {
            accept: 'image/*',
            multiple: false,
            preview: true,
            uploadUrl: '/api/upload'
        }
    },
    documents: {
        type: 'file',
        formConfig: {
            accept: '.pdf,.doc,.docx',
            multiple: true,
            uploadUrl: '/api/documents'
        }
    }
};
```

## Error Handling

```javascript
const form = Domma.forms.create(schema, data, {
    onSubmit: async (data, formInstance) => {
        try {
            await api.saveData(data);
        } catch (error) {
            if (error.validationErrors) {
                // Server validation errors
                for (const [field, message] of Object.entries(error.validationErrors)) {
                    formInstance.setFieldError(field, message);
                }
            } else {
                // General error
                throw error;
            }
        }
    },
    onError: (error, data, formInstance) => {
        console.error('Form error:', error);
        Domma.elements.toast('Error: ' + error.message, { type: 'error' });
    }
});
```

## Related Documentation

- [Showcase Meta Guide](../CLAUDE.md)
- [Models Module](../models/CLAUDE.md)
- [Tables Module](../tables/CLAUDE.md)
- [Elements Module](../elements/CLAUDE.md)
- [Core Modules](../../../src/CLAUDE.md)
- [API Reference](../../../docs/API.md)