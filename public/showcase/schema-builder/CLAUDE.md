# CLAUDE.md - Schema Builder Showcase

This file provides guidance for working with Domma's Schema Builder developer tool.

Schema Builder is part of the `domma-tools.min.js` bundle and requires the core framework.

## What is Schema Builder?

**Schema Builder** is a visual drag-and-drop interface for building Domma Blueprints. It allows you to design form schemas, configure field properties, test validation in real-time, and export to JavaScript, JSON, or TypeScript.

### Key Features

- **20+ Field Types**: string, number, email, password, date, select, textarea, file, array, object, and more
- **Drag-and-Drop Interface**: 4-panel design with field library, canvas, property editor, and live preview
- **Live Form Preview**: See your form in real-time with validation testing and model state display
- **Multi-Format Export**: Export to JavaScript object literals, JSON, or TypeScript interfaces
- **Blueprint Composition**: Import existing blueprints, use M.extend, M.pick, M.omit for schema composition
- **Template Management**: Save/load schemas to localStorage with auto-save
- **Validation Testing**: Test field validation rules in the live preview panel

## Basic Usage

```javascript
const builder = Domma.elements.schemaBuilder('#container', {
    theme: 'light',                 // Theme variant
    autoSave: true,                 // Auto-save to localStorage
    autoSaveInterval: 30000,        // Auto-save interval (ms)
    showPreview: true,              // Show live preview panel
    previewLayout: 'stacked',       // 'stacked', 'grid-2', 'grid-3', 'inline'
    onChange: (fields) => console.log('Schema changed', fields),
    onSave: (name, schema) => console.log('Saved', name),
    onExport: (format, data) => console.log('Exported', format, data)
});
```

## Field Types (20+ Types)

### Basic Types
- **string** - Single-line text input
- **number** - Numeric input with min/max
- **boolean** - True/false checkbox
- **textarea** - Multi-line text input

### Specialized Inputs
- **email** - Email input with validation
- **password** - Password input
- **url** - URL input with validation
- **tel** - Telephone number input
- **color** - Color picker
- **range** - Slider input
- **hidden** - Hidden field

### Date/Time Types
- **date** - Date picker
- **datetime** - Date and time picker
- **time** - Time picker

### Selection Types
- **select** - Dropdown select (single)
- **multiselect** - Multi-select dropdown
- **radio** - Radio button group
- **checkbox-group** - Checkbox group

### Advanced Types
- **file** - File upload input
- **array** - Array field type
- **object** - Object field type

## API Methods

### Field Management

```javascript
// Add field at specific position
builder.addField('string', 0);
builder.addField('email', 1);

// Update field properties
builder.updateField(0, {
    required: true,
    minLength: 3,
    maxLength: 20,
    label: 'Username',
    placeholder: 'Enter username...',
    help: 'Username must be 3-20 characters'
});

// Remove field
builder.removeField(1);

// Move field (reorder)
builder.moveField(2, 0);  // Move field from index 2 to index 0

// Duplicate field
builder.duplicateField(0);

// Get all fields
const fields = builder.getFields();

// Get blueprint object
const blueprint = builder.getBlueprint();
```

### Template Management

```javascript
// Save template
builder.saveTemplate('Contact Form');

// Load template
builder.loadTemplate('Contact Form');

// List all templates
const templates = SchemaTemplateManager.list();

// Delete template
SchemaTemplateManager.delete('Contact Form');

// New schema (clear all fields)
builder.newSchema('My New Schema');
```

### Export Methods

```javascript
// Export to JavaScript object literal
const js = builder.exportJS({
    comments: true,              // Include field descriptions as comments
    includeDefaults: false       // Omit default values
});

// Export to JSON
const json = builder.exportJSON({
    pretty: true,                // Pretty-print with indentation
    includeDefaults: false       // Omit default values
});

// Export to TypeScript interface
const ts = builder.exportTypeScript({
    interfaceName: 'UserData',   // Interface name
    comments: true               // Include field labels as comments
});
```

### Blueprint Composition

```javascript
// Import existing blueprint
const userBlueprint = {
    username: { type: 'string', required: true },
    email: { type: 'email', required: true }
};
builder.importBlueprint(userBlueprint, 'User');

// Extend with additional fields
const extended = M.extend(
    userBlueprint,
    {
        role: { type: 'select', options: ['admin', 'user'] },
        active: { type: 'boolean', default: true }
    }
);
builder.importBlueprint(extended, 'Extended User');

// Pick specific fields
const emailOnly = M.pick(userBlueprint, ['email']);
builder.importBlueprint(emailOnly, 'Email Only');

// Omit fields
const withoutEmail = M.omit(userBlueprint, ['email']);
builder.importBlueprint(withoutEmail, 'Without Email');
```

### Preview Control

```javascript
// Set preview layout
builder.setPreviewLayout('stacked');   // 'stacked', 'grid-2', 'grid-3', 'inline'

// Toggle preview visibility
builder._togglePreview();

// Render preview manually
builder._renderPreview();
```

## Export Format Examples

### JavaScript Object Literal

```javascript
const contactBlueprint = {
    name: {
        type: 'string',
        required: true,
        minLength: 2,
        label: 'Full Name',
        placeholder: 'John Doe'
    },
    email: {
        type: 'email',
        required: true,
        label: 'Email Address',
        placeholder: 'john@example.com'
    },
    message: {
        type: 'textarea',
        required: true,
        minLength: 10,
        label: 'Message',
        placeholder: 'Your message...'
    }
};
```

### TypeScript Interface

```typescript
/**
 * Contact Form Data
 */
interface ContactFormData {
    name: string;      // Full Name
    email: string;     // Email Address
    message: string;   // Message
}

const contactFormBlueprint: Record<keyof ContactFormData, any> = {
    name: { type: 'string', required: true, minLength: 2 },
    email: { type: 'email', required: true },
    message: { type: 'textarea', required: true, minLength: 10 }
};
```

### JSON Format

```json
{
    "name": {
        "type": "string",
        "required": true,
        "minLength": 2,
        "label": "Full Name"
    },
    "email": {
        "type": "email",
        "required": true,
        "label": "Email Address"
    },
    "message": {
        "type": "textarea",
        "required": true,
        "minLength": 10,
        "label": "Message"
    }
}
```

## Integration with Domma

### Using with Domma.forms

```javascript
// 1. Build your blueprint in Schema Builder
// 2. Export as JavaScript
const registrationBlueprint = {
    username: {
        type: 'string',
        required: true,
        minLength: 3,
        label: 'Username'
    },
    email: {
        type: 'email',
        required: true,
        label: 'Email'
    },
    password: {
        type: 'password',
        required: true,
        minLength: 8,
        label: 'Password'
    }
};

// 3. Generate form automatically
const form = Domma.forms.create('#registration-form', {
    blueprint: registrationBlueprint,
    layout: 'stacked',
    submitText: 'Register',
    onSubmit: async (data) => {
        await Domma.http.post('/api/register', data);
        await Domma.elements.alert('Registration successful!');
    }
});
```

### Using with Domma.models

```javascript
// Create reactive model from blueprint
const userModel = M.create(registrationBlueprint, {
    username: '',
    email: '',
    password: ''
}, { persist: 'registration-draft' });

// Listen for changes
userModel.onChange((field, value) => {
    console.log(`${field} changed to:`, value);
});

// Bind to form inputs
M.bind(userModel, 'username', '#username-input', { twoWay: true });
M.bind(userModel, 'email', '#email-input', { twoWay: true });
M.bind(userModel, 'password', '#password-input', { twoWay: true });

// Validate before submission
if (userModel.validate()) {
    const data = userModel.toJSON();
    await Domma.http.post('/api/register', data);
}
```

### Using with CRUD Helper

```javascript
// Complete CRUD interface from single blueprint
Domma.forms.crud('#user-management', {
    blueprint: registrationBlueprint,
    endpoint: '/api/users',
    title: 'User Management',
    itemsPerPage: 10,
    searchable: true,
    onCreate: (data) => console.log('User created:', data),
    onUpdate: (id, data) => console.log('User updated:', id, data),
    onDelete: (id) => console.log('User deleted:', id)
});
```

## Common Patterns

### Contact Form Builder

```javascript
const builder = Domma.elements.schemaBuilder('#schema-builder', {
    autoSave: true,
    onChange: (fields) => {
        // Update preview in real-time
        console.log('Schema has', fields.length, 'fields');
    },
    onExport: (format, data) => {
        if (format === 'js') {
            // Copy to clipboard
            _.copyToClipboard(data);
            Domma.elements.toast('Copied to clipboard!', 'success');
        }
    }
});

// Pre-populate with common contact fields
builder.addField('string', 0);
builder.updateField(0, {
    required: true,
    label: 'Name',
    placeholder: 'Your name'
});

builder.addField('email', 1);
builder.updateField(1, {
    required: true,
    label: 'Email',
    placeholder: 'your@email.com'
});

builder.addField('textarea', 2);
builder.updateField(2, {
    required: true,
    minLength: 10,
    label: 'Message',
    placeholder: 'Your message...'
});

// Save as template
builder.saveTemplate('Basic Contact Form');
```

### User Registration Form

```javascript
const builder = Domma.elements.schemaBuilder('#registration-builder', {
    autoSave: true,
    previewLayout: 'stacked'
});

// Build registration schema
const fields = [
    { type: 'string', props: { required: true, label: 'Username', minLength: 3 } },
    { type: 'email', props: { required: true, label: 'Email' } },
    { type: 'password', props: { required: true, label: 'Password', minLength: 8 } },
    { type: 'select', props: {
        required: true,
        label: 'Role',
        options: [
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' }
        ]
    }},
    { type: 'boolean', props: { label: 'Active', default: true } }
];

fields.forEach((field, i) => {
    builder.addField(field.type, i);
    builder.updateField(i, field.props);
});

// Export and use
$('#generate-form-btn').on('click', () => {
    const blueprint = builder.getBlueprint();

    // Create form from blueprint
    Domma.forms.create('#output-form', {
        blueprint,
        layout: 'stacked',
        submitText: 'Register',
        onSubmit: async (data) => {
            console.log('Registration data:', data);
        }
    });
});
```

### Survey Builder

```javascript
const builder = Domma.elements.schemaBuilder('#survey-builder', {
    autoSave: true,
    previewLayout: 'stacked'
});

// Load saved survey template or create new
const savedSurvey = S.get('current-survey');
if (savedSurvey) {
    builder._fields = savedSurvey;
    builder._renderCanvas();
    builder._renderPreview();
} else {
    // Start with basic fields
    builder.addField('string', 0);
    builder.updateField(0, { label: 'Full Name', required: true });

    builder.addField('radio', 1);
    builder.updateField(1, {
        label: 'How satisfied are you?',
        required: true,
        options: [
            { value: '5', label: 'Very Satisfied' },
            { value: '4', label: 'Satisfied' },
            { value: '3', label: 'Neutral' },
            { value: '2', label: 'Dissatisfied' },
            { value: '1', label: 'Very Dissatisfied' }
        ]
    });

    builder.addField('textarea', 2);
    builder.updateField(2, { label: 'Additional Comments', required: false });
}

// Export survey schema
$('#export-survey').on('click', () => {
    const json = builder.exportJSON({ pretty: true });

    // Save to server or download
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = $('<a>')
        .attr('href', url)
        .attr('download', 'survey-schema.json')[0];
    a.click();
});
```

### E-Commerce Product Form

```javascript
const builder = Domma.elements.schemaBuilder('#product-builder');

// Import base product blueprint
const baseProduct = {
    name: { type: 'string', required: true, label: 'Product Name' },
    price: { type: 'number', required: true, min: 0, label: 'Price' },
    description: { type: 'textarea', required: true, label: 'Description' }
};

builder.importBlueprint(baseProduct, 'Base Product');

// Extend with additional fields
builder.addField('select', 3);
builder.updateField(3, {
    label: 'Category',
    required: true,
    options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'books', label: 'Books' }
    ]
});

builder.addField('number', 4);
builder.updateField(4, {
    label: 'Stock Quantity',
    required: true,
    min: 0,
    default: 0
});

builder.addField('file', 5);
builder.updateField(5, {
    label: 'Product Images',
    required: false,
    help: 'Upload product images'
});

// Export extended product blueprint
const productBlueprint = builder.getBlueprint();

// Use with CRUD
Domma.forms.crud('#product-management', {
    blueprint: productBlueprint,
    endpoint: '/api/products',
    title: 'Products'
});
```

## Field Configuration Options

Each field type supports different configuration options:

### Common Properties (All Types)
- `type` - Field type (required)
- `required` - Whether field is required (boolean)
- `default` - Default value
- `label` - Display label
- `placeholder` - Placeholder text
- `help` - Help text displayed below field

### String/Text Fields
- `minLength` - Minimum character length
- `maxLength` - Maximum character length
- `pattern` - Regex pattern for validation

### Number Fields
- `min` - Minimum value
- `max` - Maximum value
- `step` - Step increment

### Select/Radio/Checkbox-Group Fields
- `options` - Array of `{ value, label }` objects

### Form Display Options
- `formConfig.columns` - Column span (1-12)
- `formConfig.class` - Custom CSS classes

## UI Layout

Schema Builder uses a 4-panel design:

1. **Field Library (Left)** - Browse and drag field types
2. **Schema Canvas (Center)** - Drop zone for building your schema
3. **Property Editor (Right)** - Configure selected field properties
4. **Live Preview (Bottom)** - Real-time form preview with validation

### Responsive Behavior

- Desktop (>1024px): Full 4-panel layout
- Tablet (768-1024px): Stacked panels
- Mobile (<768px): Single column, collapsible panels

## Related Documentation

- [Showcase Meta Guide](../CLAUDE.md)
- [Core Modules](../../../src/CLAUDE.md)
- [API Reference](../../../docs/API.md)
- [Models Module](../../models/CLAUDE.md)
- [Forms Module Documentation](../../../CLAUDE.md#forms-module)

## Development Notes

- Tools bundle (`domma-tools.min.js`) is required
- Core framework (`domma.min.js`) must be loaded first
- Schema Builder attaches to `Domma.elements.schemaBuilder` automatically
- Auto-save stores to localStorage with key `domma:schema-builder-active`
- Templates stored with key `domma:schema-builder-templates`
- All export formats are sanitized and escaped for security
- Live preview uses `Domma.forms.create()` internally
