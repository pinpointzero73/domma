# Schema Builder - Visual Blueprint Designer

## Table of Contents

- [What is Schema Builder?](#what-is-schema-builder)
- [Quick Start](#quick-start)
- [UI Overview](#ui-overview)
- [Building Schemas](#building-schemas)
- [Field Types](#field-types)
- [Validation Configuration](#validation-configuration)
- [Export Formats](#export-formats)
- [Blueprint Composition](#blueprint-composition)
- [Template Management](#template-management)
- [Integration with Domma](#integration-with-domma)
- [Tutorial: Contact Form](#tutorial-contact-form)
- [Real-World Examples](#real-world-examples)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)

---

## What is Schema Builder?

**Schema Builder** is a visual drag-and-drop tool for building Domma Blueprints. Instead of writing blueprint objects by hand, you can:

- **Drag fields from a library** into your schema
- **Configure validation rules** through a visual property editor
- **Test your form in real-time** with live preview and validation
- **Export to multiple formats** - JavaScript, JSON, or TypeScript

### Why Use Schema Builder?

1. **Visual Design** - See your form as you build it
2. **No Syntax Errors** - UI prevents invalid configurations
3. **Real-time Testing** - Test validation rules immediately
4. **Multiple Export Formats** - JavaScript, JSON, or TypeScript
5. **Template Library** - Save and reuse schemas
6. **Blueprint Composition** - Extend, pick, and omit fields from existing blueprints

---

## Quick Start

### 5-Minute "Hello Schema"

**Step 1: Load Schema Builder**

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="dist/domma.css">
    <link rel="stylesheet" href="dist/elements.css">
    <link rel="stylesheet" href="dist/domma-tools.css">
</head>
<body>
    <div id="schema-builder"></div>

    <script src="dist/domma.min.js"></script>
    <script src="dist/domma-tools.min.js"></script>
</body>
</html>
```

**Step 2: Initialize Schema Builder**

```javascript
const builder = Domma.elements.schemaBuilder('#schema-builder', {
    autoSave: true,
    showPreview: true
});
```

**Step 3: Build Your Schema**

1. Drag "Text" field from the library
2. Click the field to edit properties
3. Set label to "Name", mark as required
4. Click "Export" → "JavaScript"
5. Copy the generated blueprint code

You now have a working Domma Blueprint ready to use!

---

## UI Overview

Schema Builder uses a 4-panel design:

```
┌─────────────┬───────────────────────┬─────────────────┐
│   LIBRARY   │       CANVAS          │  PROPERTY       │
│             │                       │  EDITOR         │
│ [Search]    │  ┌─────────────────┐  │                 │
│             │  │ Drop Zone       │  │ Core            │
│ Basic       │  └─────────────────┘  │ - Field Name    │
│ ├ Text      │                       │ - Type          │
│ ├ Number    │  ┌─────────────────┐  │ - Required      │
│ ├ Checkbox  │  │ username [str]  │  │                 │
│             │  │ Required        │  │ Validation      │
│ Inputs      │  └─────────────────┘  │ - Min Length    │
│ ├ Email     │                       │ - Max Length    │
│ ├ Password  │  ┌─────────────────┐  │                 │
│ └ URL       │  │ Drop Zone       │  │ Form Display    │
│             │  └─────────────────┘  │ - Label         │
│ Selection   │                       │ - Placeholder   │
│ ├ Select    │  [Export] [Import]    │ - Help Text     │
│ └ Radio     │  [Save] [Load]        │                 │
└─────────────┴───────────────────────┴─────────────────┘
┌─────────────────────────────────────────────────────────┐
│  LIVE PREVIEW                    [Stacked ▾] [Collapse] │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ Generated Form   │  │ Model State      │             │
│  │ [Username: ___]  │  │ { "username": "" }│             │
│  └──────────────────┘  └──────────────────┘             │
└─────────────────────────────────────────────────────────┘
```

### Panel Descriptions

1. **Field Library (Left)**
   - Browse 20+ field types
   - Organized by category (Basic, Inputs, Selection, Advanced)
   - Search filter to find fields quickly
   - Click to add, or drag to canvas

2. **Schema Canvas (Center)**
   - Your schema being built
   - Field cards show field name, type, and required status
   - Drop zones between fields for inserting new fields
   - Drag fields to reorder
   - Click field to select and edit

3. **Property Editor (Right)**
   - Configure the selected field
   - Three sections: Core, Validation, Form Display
   - Changes update canvas and preview in real-time
   - Context-aware - shows relevant options for field type

4. **Live Preview (Bottom)**
   - Real-time form preview using Domma.forms
   - Model state display showing current data
   - Test validation rules immediately
   - Collapsible to save space

---

## Building Schemas

### Adding Fields

**Method 1: Click to Add**

1. Click a field type in the library
2. Field is added to the end of your schema
3. Field is automatically selected for editing

**Method 2: Drag to Insert**

1. Drag a field from the library
2. Drop zones appear between existing fields
3. Drop to insert at specific position

**Method 3: Programmatic**

```javascript
builder.addField('string', 0);  // Add string field at position 0
builder.addField('email', 1);   // Add email field at position 1
```

### Editing Fields

**Click a field card** to select it and open the property editor.

Property editor shows three sections:

**Core Properties:**
- Field Name (JavaScript property name)
- Type (field data type)
- Required (is field required?)
- Default Value

**Validation Rules:**
- Min/Max Length (for strings)
- Min/Max (for numbers)
- Pattern (regex validation)
- Custom Validator (JavaScript function)

**Form Display:**
- Label (display name)
- Placeholder (input hint)
- Help Text (displayed below field)
- Column Span (for grid layouts)

### Removing Fields

**Method 1: Remove Button**

Click the trash icon on a field card.

**Method 2: Programmatic**

```javascript
builder.removeField(0);  // Remove field at index 0
```

### Reordering Fields

**Drag and drop** a field card to a new position.

Or programmatically:

```javascript
builder.moveField(2, 0);  // Move field from index 2 to index 0
```

### Duplicating Fields

Click the duplicate icon on a field card, or:

```javascript
builder.duplicateField(0);  // Duplicate field at index 0
```

---

## Field Types

Schema Builder provides 20+ field types organized by category:

### Basic Types

| Type | Description | Validation Options |
|------|-------------|-------------------|
| **string** | Single-line text | minLength, maxLength, pattern |
| **number** | Numeric input | min, max, step |
| **boolean** | Checkbox (true/false) | default |
| **textarea** | Multi-line text | minLength, maxLength, rows |

### Specialized Inputs

| Type | Description | Validation Options |
|------|-------------|-------------------|
| **email** | Email address | Built-in email validation |
| **password** | Password input (masked) | minLength, maxLength, pattern |
| **url** | URL input | Built-in URL validation |
| **tel** | Phone number | pattern |
| **color** | Color picker | default |
| **range** | Slider input | min, max, step |
| **hidden** | Hidden field | default |

### Date/Time Types

| Type | Description | Validation Options |
|------|-------------|-------------------|
| **date** | Date picker | min, max |
| **datetime** | Date & time picker | min, max |
| **time** | Time picker | min, max |

### Selection Types

| Type | Description | Validation Options |
|------|-------------|-------------------|
| **select** | Dropdown (single selection) | options (required) |
| **multiselect** | Multi-select dropdown | options (required) |
| **radio** | Radio button group | options (required) |
| **checkbox-group** | Checkbox group | options (required) |

### Advanced Types

| Type | Description | Validation Options |
|------|-------------|-------------------|
| **file** | File upload | accept (MIME types) |
| **array** | Array type | default: [] |
| **object** | Object type | default: {} |

### Options for Selection Fields

For `select`, `multiselect`, `radio`, and `checkbox-group` fields, configure options in the property editor:

```javascript
// Options format (set in property editor)
[
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'User' },
    { value: 'guest', label: 'Guest' }
]
```

---

## Validation Configuration

### Common Validation Rules

**Required**
```javascript
required: true  // Field must have a value
```

**String Length**
```javascript
minLength: 3    // Minimum 3 characters
maxLength: 50   // Maximum 50 characters
```

**Numeric Range**
```javascript
min: 0          // Minimum value
max: 100        // Maximum value
step: 5         // Value increment
```

**Pattern Matching**
```javascript
pattern: /^[A-Z]/  // Must start with uppercase letter
```

**Custom Validation**
```javascript
validate: (value) => {
    if (value.includes('spam')) {
        return 'Value cannot contain "spam"';
    }
    return true;
}
```

### Testing Validation

Use the **Live Preview panel** to test validation rules:

1. Enter values in the preview form
2. Blur the input to trigger validation
3. Validation errors appear in real-time
4. Model state shows current form data

---

## Export Formats

Schema Builder can export to three formats:

### 1. JavaScript Object Literal

**Best for:** Direct use in JavaScript files

```javascript
const userBlueprint = {
    username: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 20,
        label: 'Username',
        placeholder: 'Choose a username'
    },
    email: {
        type: 'email',
        required: true,
        label: 'Email Address'
    }
};
```

**Export Options:**
- Include comments (field descriptions as comments)
- Include defaults (omit properties with default values)

### 2. JSON Format

**Best for:** API configuration, data storage

```json
{
    "username": {
        "type": "string",
        "required": true,
        "minLength": 3,
        "maxLength": 20,
        "label": "Username"
    },
    "email": {
        "type": "email",
        "required": true,
        "label": "Email Address"
    }
}
```

**Export Options:**
- Pretty print (formatted with indentation)
- Include defaults

### 3. TypeScript Interface

**Best for:** TypeScript projects with type safety

```typescript
/**
 * User Data
 */
interface UserData {
    username: string;    // Username
    email: string;       // Email Address
}

const userBlueprint: Record<keyof UserData, any> = {
    username: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 20
    },
    email: {
        type: 'email',
        required: true
    }
};
```

**Export Options:**
- Interface name (e.g., `UserData`, `FormData`)
- Include comments (field labels as comments)

### Type Mapping (TypeScript Export)

| Blueprint Type | TypeScript Type |
|----------------|-----------------|
| `string`, `email`, `password`, `url`, `tel`, `textarea` | `string` |
| `number`, `range` | `number` |
| `boolean` | `boolean` |
| `date`, `datetime` | `Date \| string` |
| `time` | `string` |
| `select`, `radio` | `string` |
| `multiselect`, `checkbox-group` | `string[]` |
| `file` | `File \| File[]` |
| `array` | `any[]` |
| `object` | `Record<string, any>` |

---

## Blueprint Composition

Schema Builder supports advanced blueprint composition using M.extend, M.pick, and M.omit.

### Importing Blueprints

**Method 1: Import Modal**

1. Click "Import" button
2. Paste blueprint JSON
3. Give it a name
4. Click "Import"

**Method 2: Programmatic**

```javascript
const baseUser = {
    username: { type: 'string', required: true },
    email: { type: 'email', required: true }
};

builder.importBlueprint(baseUser, 'Base User');
```

### Extending Blueprints

Combine multiple blueprints with `M.extend`:

```javascript
const baseUser = {
    username: { type: 'string', required: true },
    email: { type: 'email', required: true }
};

const adminFields = {
    role: { type: 'select', options: ['admin', 'superadmin'] },
    permissions: { type: 'array', default: [] }
};

// Extend base with admin fields
const adminBlueprint = M.extend(baseUser, adminFields);
builder.importBlueprint(adminBlueprint, 'Admin User');
```

### Picking Fields

Extract specific fields with `M.pick`:

```javascript
const fullUser = {
    username: { type: 'string', required: true },
    email: { type: 'email', required: true },
    bio: { type: 'textarea' },
    avatar: { type: 'file' }
};

// Extract only email for email-only form
const emailOnly = M.pick(fullUser, ['email']);
builder.importBlueprint(emailOnly, 'Email Only');
```

### Omitting Fields

Remove specific fields with `M.omit`:

```javascript
const fullUser = {
    username: { type: 'string', required: true },
    email: { type: 'email', required: true },
    password: { type: 'password', required: true }
};

// Remove password for profile edit (not changing password)
const profileEdit = M.omit(fullUser, ['password']);
builder.importBlueprint(profileEdit, 'Profile Edit');
```

---

## Template Management

Save and load schemas for reuse.

### Saving Templates

**Method 1: Save Button**

1. Click "Save" button
2. Enter template name
3. Click "Save"

**Method 2: Programmatic**

```javascript
builder.saveTemplate('Contact Form');
```

**Auto-Save**

If `autoSave: true` is enabled, Schema Builder automatically saves your work:

```javascript
const builder = Domma.elements.schemaBuilder('#builder', {
    autoSave: true,
    autoSaveInterval: 30000  // Save every 30 seconds
});
```

### Loading Templates

**Method 1: Load Button**

1. Click "Load" button
2. Select template from list
3. Click "Load"

**Method 2: Programmatic**

```javascript
builder.loadTemplate('Contact Form');
```

### Listing Templates

```javascript
const templates = SchemaTemplateManager.list();
console.log(templates);  // ['Contact Form', 'Registration', 'Survey']
```

### Deleting Templates

```javascript
SchemaTemplateManager.delete('Contact Form');
```

---

## Integration with Domma

Once you've built and exported a blueprint, use it with Domma modules:

### With Domma.forms (Form Generation)

```javascript
// 1. Export blueprint from Schema Builder
const contactBlueprint = {
    name: { type: 'string', required: true, label: 'Name' },
    email: { type: 'email', required: true, label: 'Email' },
    message: { type: 'textarea', required: true, label: 'Message' }
};

// 2. Generate form
const form = F.create(contactBlueprint, {}, {
    container: '#contact-form',
    layout: 'stacked',
    submitText: 'Send Message',
    onSubmit: async (data) => {
        await H.post('/api/contact', data);
        Domma.elements.toast('Message sent!', 'success');
    }
});
```

### With Domma.models (Reactive Models)

```javascript
// Create reactive model from blueprint
const userModel = M.create(contactBlueprint, {
    name: '',
    email: '',
    message: ''
}, {
    persist: 'contact-draft'  // Auto-save to localStorage
});

// Listen for changes
userModel.onChange((field, value) => {
    console.log(`${field} changed:`, value);
});

// Validate before submission
if (userModel.validate()) {
    const data = userModel.toJSON();
    await H.post('/api/contact', data);
}
```

### With CRUD Helper (Full Data Management)

```javascript
// Complete CRUD interface from blueprint
F.crud('#user-management', contactBlueprint, {
    apiUrl: '/api/contacts',
    title: 'Contact Messages',
    itemsPerPage: 20,
    searchable: true,
    onCreate: (data) => console.log('Created:', data),
    onUpdate: (id, data) => console.log('Updated:', id),
    onDelete: (id) => console.log('Deleted:', id)
});
```

---

## Tutorial: Contact Form

Let's build a complete contact form from scratch.

### Step 1: Initialize Schema Builder

```javascript
const builder = Domma.elements.schemaBuilder('#schema-builder', {
    autoSave: true,
    showPreview: true,
    previewLayout: 'stacked'
});
```

### Step 2: Add Name Field

1. Click "Text" in the library
2. Field is added to canvas
3. In property editor:
   - Field Name: `name`
   - Required: ✓
   - Label: "Full Name"
   - Placeholder: "Enter your full name"
   - Min Length: 2

### Step 3: Add Email Field

1. Click "Email" in the library
2. In property editor:
   - Field Name: `email`
   - Required: ✓
   - Label: "Email Address"
   - Placeholder: "you@example.com"

### Step 4: Add Message Field

1. Click "Textarea" in the library
2. In property editor:
   - Field Name: `message`
   - Required: ✓
   - Label: "Message"
   - Placeholder: "Your message..."
   - Min Length: 10
   - Rows: 5

### Step 5: Test in Live Preview

1. Preview panel shows generated form
2. Enter values to test validation
3. Try submitting empty fields (required validation)
4. Try entering short messages (min length validation)

### Step 6: Export Blueprint

1. Click "Export" → "JavaScript"
2. Copy generated code:

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
        placeholder: 'Your message...',
        formConfig: { rows: 5 }
    }
};
```

### Step 7: Use in Your App

```javascript
// Generate form
const form = F.create(contactBlueprint, {}, {
    container: '#contact-form',
    layout: 'stacked',
    submitText: 'Send Message',
    resetText: 'Clear',
    onSubmit: async (data) => {
        // Send to API
        const response = await H.post('/api/contact', data);

        // Show success message
        Domma.elements.toast('Message sent successfully!', 'success');

        // Reset form
        form.reset();
    }
});
```

### Step 8: Save Template

Save for future reuse:

```javascript
builder.saveTemplate('Contact Form');
```

---

## Real-World Examples

### User Registration Form

```javascript
// Build in Schema Builder, export blueprint
const registrationBlueprint = {
    username: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
        label: 'Username',
        help: 'Letters, numbers, and underscores only'
    },
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
        help: 'Minimum 8 characters'
    },
    confirmPassword: {
        type: 'password',
        required: true,
        label: 'Confirm Password',
        validate: function(value) {
            const password = this.get('password');
            return value === password || 'Passwords must match';
        }
    },
    agreeToTerms: {
        type: 'boolean',
        required: true,
        label: 'I agree to the Terms of Service',
        validate: (value) => value === true || 'You must agree to the terms'
    }
};
```

### Product Form (E-Commerce)

```javascript
const productBlueprint = {
    name: {
        type: 'string',
        required: true,
        label: 'Product Name'
    },
    description: {
        type: 'textarea',
        required: true,
        label: 'Description',
        formConfig: { rows: 4 }
    },
    price: {
        type: 'number',
        required: true,
        min: 0,
        step: 0.01,
        label: 'Price (USD)'
    },
    category: {
        type: 'select',
        required: true,
        label: 'Category',
        options: [
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' },
            { value: 'books', label: 'Books' },
            { value: 'home', label: 'Home & Garden' }
        ]
    },
    inStock: {
        type: 'boolean',
        default: true,
        label: 'In Stock'
    },
    tags: {
        type: 'array',
        default: [],
        label: 'Tags',
        help: 'Comma-separated tags'
    },
    images: {
        type: 'file',
        label: 'Product Images',
        help: 'Upload product photos'
    }
};
```

### Survey Form

```javascript
const surveyBlueprint = {
    name: {
        type: 'string',
        required: true,
        label: 'Full Name'
    },
    email: {
        type: 'email',
        required: true,
        label: 'Email Address'
    },
    satisfaction: {
        type: 'radio',
        required: true,
        label: 'How satisfied are you with our service?',
        options: [
            { value: '5', label: 'Very Satisfied' },
            { value: '4', label: 'Satisfied' },
            { value: '3', label: 'Neutral' },
            { value: '2', label: 'Dissatisfied' },
            { value: '1', label: 'Very Dissatisfied' }
        ]
    },
    features: {
        type: 'checkbox-group',
        label: 'Which features do you use? (Select all that apply)',
        options: [
            { value: 'feature1', label: 'Feature 1' },
            { value: 'feature2', label: 'Feature 2' },
            { value: 'feature3', label: 'Feature 3' },
            { value: 'feature4', label: 'Feature 4' }
        ]
    },
    improvements: {
        type: 'textarea',
        label: 'Suggestions for improvement',
        formConfig: { rows: 4 }
    },
    wouldRecommend: {
        type: 'boolean',
        label: 'Would you recommend us to others?'
    }
};
```

---

## Best Practices

### Field Naming

✅ **Good:**
```javascript
username      // Clear, concise
emailAddress  // Descriptive
dateOfBirth   // Unambiguous
```

❌ **Bad:**
```javascript
un            // Too cryptic
e_mail        // Inconsistent style
DOB           // Acronyms unclear
user name     // Spaces not allowed
```

### Validation Rules

✅ **Good:**
```javascript
{
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_]+$/,
    help: 'Letters, numbers, and underscores only'
}
```

❌ **Bad:**
```javascript
{
    type: 'string',
    // No validation rules
    // No help text
}
```

### Labels and Placeholders

✅ **Good:**
```javascript
{
    label: 'Email Address',         // Clear, user-friendly
    placeholder: 'you@example.com', // Shows expected format
    help: 'We will never share your email'
}
```

❌ **Bad:**
```javascript
{
    label: 'email',                 // Not capitalized
    placeholder: 'Email',           // Just repeats label
    // No help text
}
```

### Default Values

✅ **Good:**
```javascript
{
    type: 'boolean',
    default: false,     // Explicit default
    label: 'Subscribe to newsletter'
}

{
    type: 'select',
    default: 'guest',   // Safe default
    options: ['guest', 'user', 'admin']
}
```

### Template Organization

- **Save frequently** - Save templates for common form patterns
- **Use descriptive names** - "Contact Form", not "Form1"
- **Version templates** - "User Registration v2" if making major changes
- **Export backups** - Download JSON exports for version control

---

## API Reference

### Constructor

```javascript
Domma.elements.schemaBuilder(selector, options)
```

**Parameters:**
- `selector` (string) - CSS selector for container element
- `options` (object) - Configuration options

**Options:**
```javascript
{
    theme: 'light',              // 'light' or 'dark'
    autoSave: true,              // Auto-save to localStorage
    autoSaveInterval: 30000,     // Auto-save interval (ms)
    showPreview: true,           // Show live preview panel
    previewLayout: 'stacked',    // 'stacked', 'grid-2', 'grid-3', 'inline'
    onChange: (fields) => {},    // Called when schema changes
    onSave: (name, schema) => {},  // Called when template saved
    onExport: (format, data) => {} // Called when exporting
}
```

### Field Management

```javascript
// Add field
builder.addField(type, position)

// Update field
builder.updateField(index, updates)

// Remove field
builder.removeField(index)

// Move field
builder.moveField(fromIndex, toIndex)

// Duplicate field
builder.duplicateField(index)

// Get fields
builder.getFields()

// Get blueprint
builder.getBlueprint()
```

### Export Methods

```javascript
// Export to JavaScript
builder.exportJS({
    comments: true,          // Include field descriptions
    includeDefaults: false   // Omit default values
})

// Export to JSON
builder.exportJSON({
    pretty: true,            // Pretty-print
    includeDefaults: false   // Omit default values
})

// Export to TypeScript
builder.exportTypeScript({
    interfaceName: 'FormData',  // Interface name
    comments: true              // Include field labels
})
```

### Template Management

```javascript
// Save template
builder.saveTemplate(name)

// Load template
builder.loadTemplate(name)

// List templates
SchemaTemplateManager.list()

// Delete template
SchemaTemplateManager.delete(name)

// New schema (clear all)
builder.newSchema(name)
```

### Blueprint Composition

```javascript
// Import blueprint
builder.importBlueprint(blueprint, name)

// Extend (programmatic)
const extended = M.extend(blueprint1, blueprint2)
builder.importBlueprint(extended, name)

// Pick fields (programmatic)
const picked = M.pick(blueprint, ['field1', 'field2'])
builder.importBlueprint(picked, name)

// Omit fields (programmatic)
const omitted = M.omit(blueprint, ['field1', 'field2'])
builder.importBlueprint(omitted, name)
```

### Preview Control

```javascript
// Set preview layout
builder.setPreviewLayout('stacked')  // 'stacked', 'grid-2', 'grid-3', 'inline'

// Toggle preview panel
builder._togglePreview()

// Render preview manually
builder._renderPreview()
```

### Cleanup

```javascript
// Destroy instance
builder.destroy()
```

---

## Related Documentation

- [Blueprints Documentation](./Blueprints.md) - Complete blueprint guide
- [Forms Module](../CLAUDE.md#forms-module) - Form generation
- [Models Module](../CLAUDE.md#models-module) - Reactive models
- [API Reference](./API.md) - Complete API documentation
