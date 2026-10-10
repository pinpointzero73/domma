---
title: Integrations
description: "How Domma components work together - blueprint-centric architecture, data flow, and event coordination."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Integrations" tagline="How Domma components work together - blueprint-centric architecture, data flow, and event coordination." align="center"][/hero]

## Overview

Domma uses a **blueprint-centric architecture**. Define your data structure once in a Blueprint, then use it across Forms, Models, Tables, and CRUD operations.

[showcase-demo id="showcase/integrations/overview" title="Overview" /]

## Data Flow Diagram

This diagram shows how data flows through Domma components:

[showcase-demo id="showcase/integrations/data-flow-diagram" title="Data Flow Diagram" /]

> **Key Concept:** The Blueprint is the single source of truth. All components derive their behavior from it.

## The Blueprint-Centric Approach

**Define once, use everywhere.** Create a single Blueprint and use it to power Forms, Models, and CRUD operations automatically.

### Single Blueprint Definition

```javascript
const userBlueprint = {
    name: {
        type: 'string',
        required: true,
        minLength: 2,
        label: 'Full Name'
    },
    email: {
        type: 'email',
        required: true,
        label: 'Email Address'
    },
    age: {
        type: 'number',
        min: 18,
        max: 125,
        label: 'Age'
    }
};
```

### Use Everywhere

```javascript
// Auto-generate a form
const form = F.create(userBlueprint);

// Create a reactive model
const model = M.create(userBlueprint);

// Full CRUD with one line
F.crud('#app', userBlueprint, {
    api: '/api/users'
});
```

[showcase-demo id="showcase/integrations/use-everywhere" title="Use Everywhere" /]

## Data Flow Patterns

Common integration patterns showing how data moves between components.

[showcase-demo id="showcase/integrations/data-flow-patterns" title="Data Flow Patterns" /]

## Event-Driven Communication

Use Pub/Sub for decoupled component coordination. Components can communicate without direct references.

### Publisher

```javascript
// Component A publishes event
M.publish('cart:updated', {
    items: cartItems,
    total: calculateTotal()
});
```

### Subscribers

```javascript
// Component B listens
M.subscribe('cart:updated', (data) => {
    updateBadge(data.items.length);
});

// Component C also listens
M.subscribe('cart:updated', (data) => {
    showNotification(`Cart updated`);
});
```

[showcase-demo id="showcase/integrations/subscribers" title="Subscribers" /]

## CRUD in 3 Lines

The `F.crud()` method combines Forms, Models, Tables, and Validation into a complete CRUD interface with just one function call.

```javascript
F.crud('#users', userBlueprint, {
    api: '/api/users',           // REST API endpoint
    features: ['add', 'edit', 'delete', 'search']
});
```

This single line creates:

- ✓ Sortable, filterable data table
- ✓ Modal form for creating new records
- ✓ Edit functionality with pre-populated data
- ✓ Delete confirmation dialogs
- ✓ Built-in validation from the blueprint
- ✓ API or localStorage persistence

> **Pro Tip:** Use `storage: 'storage-key'` instead of `api` for localStorage-backed CRUD with zero backend code.

## Styling Integration

Domma uses a modular CSS architecture with 4 files loaded in order:

```html
<!-- 1. Base styles + utilities -->
<link rel="stylesheet" href="dist/domma.css">

<!-- 2. Grid system (Bootstrap + CSS Grid) -->
<link rel="stylesheet" href="dist/grid.css">

<!-- 3. UI components (22 elements) -->
<link rel="stylesheet" href="dist/elements.css">

<!-- 4. Theme system (10+ themes) -->
<link rel="stylesheet" href="dist/themes/domma-themes.css">
```

### Theme Integration

All Domma components are theme-aware. Change the theme and everything updates together:

[showcase-demo id="showcase/integrations/theme-integration" title="Theme Integration" /]

### Grid System

Use Bootstrap-style grid or CSS Grid utilities:

```html
<!-- Bootstrap-style -->
<div class="row">
    <div class="col-md-6">Column 1</div>
    <div class="col-md-6">Column 2</div>
</div>

<!-- CSS Grid utilities -->
<div class="grid grid-cols-2 gap-4">
    <div>Column 1</div>
    <div>Column 2</div>
</div>
```

## Quick Integration Reference

[showcase-demo id="showcase/integrations/quick-integration-reference" title="Quick Integration Reference" /]
