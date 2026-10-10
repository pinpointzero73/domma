---
title: Blueprints
description: "Unified schema system - define once, use everywhere for validation, forms, models, and CRUD."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Blueprints" tagline="Unified schema system - define once, use everywhere for validation, forms, models, and CRUD." align="center"][/hero]

## Overview

Blueprints are Domma's unified schema system. Define your data structure once, then use it everywhere:

[showcase-demo id="showcase/blueprints/overview" title="Overview" /]

> [icon name="book" /] **Full Documentation:** See the [Reference Documentation](/showcase/reference) for comprehensive guide with tutorials and examples.

## Blueprint Anatomy

A blueprint is a JavaScript object defining field types, validation, and UI configuration.

```javascript
const userBlueprint = {
    name: {
        type: 'string',           // Field type
        required: true,           // Validation
        minLength: 2,
        maxLength: 50,
        label: 'Full Name',       // Form config
        placeholder: 'Enter name'
    },
    email: {
        type: 'email',
        required: true,
        label: 'Email Address',
        validate: (value) => {    // Custom validator
            return /\S+@\S+/.test(value) || 'Invalid email';
        }
    },
    age: {
        type: 'number',
        min: 0,
        max: 120,
        label: 'Age'
    },
    active: {
        type: 'boolean',
        default: true,
        label: 'Active User'
    }
};
```

[showcase-demo id="showcase/blueprints/field-properties" title="Field Properties" /]

## Built-in Types

Domma provides 7 built-in types for common data structures:

[showcase-demo id="showcase/blueprints/built-in-types" title="Built-in Types" /]

## Blueprint Examples

Explore pre-built blueprints for common use cases.

[showcase-demo id="showcase/blueprints/blueprint-examples" title="Blueprint Examples" /]

## Field-Level Styling

Control form layout and field appearance using `formConfig` properties.

### Form-Level Options

```javascript
F.render('#form', blueprint, {}, {
    layout: 'grid',      // or 'stacked', 'inline'
    columns: 2,          // 2 or 3 columns (grid only)
    labelPosition: 'top', // or 'left', 'floating'
    showLabels: true,
    showHelperText: true
});
```

### Field-Level Options

```javascript
fieldName: {
    type: 'string',
    required: true,
    label: 'Field Label',
    formConfig: {
        span: 2,              // Span 2 columns
        placeholder: 'Text',  // Placeholder
        helperText: 'Help',   // Below field
        hint: '(optional)',   // Next to label
        tooltip: 'Info',      // Hover tooltip (NEW!)
        disabled: false       // Disable field
    }
}
```

### Grid Layout Example

Use `layout: 'grid'` with `columns: 2` and `formConfig.span` to control field width:

```javascript
const addressBlueprint = {
    street: {
        type: 'string',
        required: true,
        label: 'Street Address',
        formConfig: { span: 2 }  // Full width (spans 2 columns)
    },
    city: {
        type: 'string',
        required: true,
        label: 'City'
        // No span = takes 1 column (left side)
    },
    postcode: {
        type: 'string',
        required: true,
        label: 'Postcode'
        // No span = takes 1 column (right side)
    },
    country: {
        type: 'select',
        options: ['UK', 'USA', 'Canada'],
        label: 'Country',
        formConfig: { span: 2 }  // Full width
    }
};

// Render with grid layout
F.render('#form', addressBlueprint, {}, {
    layout: 'grid',
    columns: 2
});
```

> [icon name="info" /] **Tip:** The **Product (Grid)** and **User Profile (Grid)** tabs above demonstrate grid layout with field spanning.

## Blueprint → Form Generation

Automatically generate forms from blueprints with full validation.

[showcase-demo id="showcase/blueprints/blueprint-form-generation" title="Blueprint → Form Generation" /]

## Blueprint → Reactive Model

Create reactive data models with automatic validation and change tracking.

[showcase-demo id="showcase/blueprints/blueprint-reactive-model" title="Blueprint → Reactive Model" /]

## Blueprint Composition

Combine, extend, and modify blueprints with composition methods.

[showcase-demo id="showcase/blueprints/b-extend-merge-blueprints" title="B.extend() - Merge Blueprints" /]

[showcase-demo id="showcase/blueprints/b-pick-extract-fields" title="B.pick() - Extract Fields" /]

[showcase-demo id="showcase/blueprints/b-omit-remove-fields" title="B.omit() - Remove Fields" /]

## Full CRUD System

Blueprints power complete CRUD interfaces with tables, forms, and API integration.

> [icon name="info" /] **CRUD Examples:** For complete CRUD demonstrations with blueprints, see the [Forms Showcase](/showcase/forms) which includes full CRUD functionality with API integration, table management, and modal forms.

A typical CRUD setup with blueprints includes:

- **Data Table** - Display records with sorting, filtering, pagination
- **Create Form** - Modal form generated from blueprint
- **Edit Form** - Pre-populated form for updating records
- **Delete Confirmation** - Safe deletion with confirmation
- **Validation** - Automatic validation from blueprint rules
- **API Integration** - RESTful API calls or localStorage persistence

> [icon name="external-link" /] **See It In Action:** Visit the [Forms Showcase → CRUD Section](/showcase/forms#crud-section) for live interactive examples.
