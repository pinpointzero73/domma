# CLAUDE.md - Integrations Showcase

This file provides guidance for maintaining and extending the Integrations showcase page.

## Purpose

The Integrations showcase demonstrates **how Domma components work together** as a cohesive framework rather than isolated modules. This is the "glue documentation" that helps developers understand the big picture before diving into specific features.

## What This Page Covers

### Key Integration Points

1. **Blueprint-Centric Architecture** - How blueprints drive forms, models, and CRUD
2. **Data Flow** - Visual representation of how data moves through components
3. **Model Binding** - Two-way binding between forms, models, and DOM elements
4. **Event-Driven Communication** - Pub/Sub patterns for decoupled components
5. **HTTP Integration** - Syncing models with REST APIs
6. **Storage Integration** - localStorage persistence patterns
7. **Styling Integration** - CSS load order, theming, grid system

## Page Sections

### 1. Architecture Overview

**Cards showing integration points:**
- Blueprints (Schema definition)
- Models (Reactive data)
- Forms (Auto-generated)
- HTTP (API sync)
- Storage (Persistence)
- Tables (Data display)

### 2. Data Flow Diagram

Visual CSS-based diagram showing:
```
Blueprint → Forms/Models → Validation → HTTP/Storage → Tables/DOM
```

**Why CSS and not SVG:**
- Themes properly with CSS variables
- Easier to maintain
- No external dependencies

### 3. Blueprint-Centric Approach

**Key Concept:** "Define once, use everywhere"

Shows how a single blueprint powers:
- Forms: `F.create(blueprint)`
- Models: `M.create(blueprint)`
- CRUD: `F.crud('#app', blueprint, { api: '/api/users' })`

**Interactive Demo:**
Three view toggles (Form/Model/Table) all rendering from the same blueprint.

### 4. Data Flow Patterns (Tabs)

Four tabs demonstrating common patterns:
1. **Form → Model** - Two-way binding with `model: userModel`
2. **Model → DOM** - `M.bind()` for reactive updates
3. **Model → HTTP** - Manual sync or CRUD helper
4. **Model → Storage** - `persist: 'key'` option

### 5. Event-Driven Communication

**Pub/Sub Pattern:**
```javascript
M.subscribe('cart:updated', updateBadge);
M.publish('cart:updated', data);
```

**Interactive Demo:**
- "Add to Cart" button
- Badge counter updates via Pub/Sub
- Notifications appear via event
- Shows decoupled component coordination

### 6. CRUD in 3 Lines

Shows the power of `F.crud()`:
```javascript
F.crud('#users', userBlueprint, {
    api: '/api/users',
    features: ['add', 'edit', 'delete', 'search']
});
```

Explains what this single line creates:
- Sortable, filterable table
- Modal forms
- Validation
- API/storage persistence

### 7. Styling Integration

**CSS Load Order:**
1. `domma.css` - Base + utilities
2. `grid.css` - Grid system
3. `elements.css` - UI components
4. `domma-themes.css` - Theme system

**Interactive Theme Demo:**
- Buttons to switch themes (Charcoal, Ocean, Forest, Sunset)
- Cards, buttons, and inputs all update together
- Demonstrates theme-aware components

**Grid Examples:**
- Bootstrap-style: `<div class="row"><div class="col-md-6">...</div></div>`
- CSS Grid: `<div class="grid grid-cols-2 gap-4">...</div>`

### 8. Quick Reference (Tabs)

Four reference tabs with badge grids:
1. **Blueprint Methods** - `M.extend()`, `M.pick()`, `M.omit()`, type definitions
2. **Model Methods** - `M.create()`, `get()`, `set()`, `validate()`, `bind()`, `save()`
3. **Form Methods** - `F.create()`, `F.crud()`, `F.modal()`, `F.wizard()`
4. **Event Methods** - `M.subscribe()`, `M.publish()`, `M.unsubscribe()`, `M.once()`

Each tab links to the relevant showcase page for deeper examples.

## Interactive Demos

### Demo 1: Blueprint Power

**Goal:** Show one blueprint rendering as Form/Model/Table

**Implementation:**
- Three toggle buttons (Form View, Model View, Table View)
- Same blueprint definition
- Dynamic rendering based on selected view
- Form shows input fields, Model shows JSON state, Table shows sample data

**Code:**
```javascript
const demoBlueprint = {
    name: { type: 'string', required: true, label: 'Name' },
    email: { type: 'email', required: true, label: 'Email' },
    age: { type: 'number', min: 18, max: 125, label: 'Age' }
};

// Render based on view
if (view === 'form') {
    F.create(demoBlueprint).renderTo(container);
} else if (view === 'model') {
    // Show JSON state
} else if (view === 'table') {
    Domma.tables.create({ data: sampleData }).renderTo(container);
}
```

### Demo 2: Event Bridge

**Goal:** Show Pub/Sub coordination between components

**Implementation:**
- "Add to Cart" button (publisher)
- Badge counter (subscriber)
- Notification alerts (subscriber)
- All three react to the same event

**Code:**
```javascript
// Subscriber 1: Update badge
M.subscribe('cart:updated', (data) => {
    cartBadge.text(data.count);
});

// Subscriber 2: Show notification
M.subscribe('cart:updated', (data) => {
    showNotification(`Cart has ${data.count} items`);
});

// Publisher: Button click
addToCartBtn.on('click', () => {
    cartCount++;
    M.publish('cart:updated', { count: cartCount });
});
```

### Demo 3: Theme Integration

**Goal:** Show all components updating together when theme changes

**Implementation:**
- Theme selector buttons
- Sample components (cards, buttons, inputs)
- All update automatically on theme change

**Code:**
```javascript
$('[data-theme]').on('click', function() {
    const theme = $(this).attr('data-theme');
    Domma.theme.set(theme);
});
```

## File Structure

```
showcase/integrations/
├── CLAUDE.md           # This file (development guide)
└── index.html          # Interactive showcase page
```

## Related Documentation

- [Blueprints Showcase](../blueprints/) - Blueprint deep-dive
- [Models Showcase](../models/) - Reactive model examples
- [Forms Showcase](../forms/) - Form generation examples
- [Main Showcase Guide](../CLAUDE.md) - Showcase development meta guide
- [docs/Blueprints.md](../../../docs/Blueprints.md) - Complete blueprint reference

## Testing Checklist

Before deploying changes:

- [ ] All 3 interactive demos work correctly
- [ ] Blueprint Power demo switches between Form/Model/Table views
- [ ] Event Bridge demo updates badge and shows notifications
- [ ] Theme demo changes all components together
- [ ] All tabs render correctly (Data Flow Patterns, Quick Reference)
- [ ] Code blocks have syntax highlighting
- [ ] Icons render correctly
- [ ] Data flow diagram displays properly
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] Links to other showcase pages work

## Development Notes

- Use Domma for all DOM manipulation (`$`, not `document.querySelector`)
- Use `_` for utilities (groupBy, debounce, etc.)
- Use `M` for models and Pub/Sub
- Use `F` for forms
- Use `S` for storage
- Always call `Domma.icons.scan()` after DOM updates
- Follow existing showcase patterns for consistency

## Future Enhancements

Potential additions:

1. **HTTP + Models Live Demo** - Show real API sync with loading states
2. **Storage + Offline Demo** - Show offline-first patterns with sync
3. **Multi-Model Coordination** - Parent-child relationships, computed state
4. **Config Integration** - `$.setup()` declarative wiring examples
5. **Utilities Integration** - Using `_` utilities with models (debounce, template)
6. **Tables + Models** - Reactive table updates when model changes
7. **Advanced Patterns** - Optimistic updates, conflict resolution

## Key Messages

This page should communicate:

1. **Blueprints are the center** - Everything revolves around the schema
2. **Components work together** - Not just isolated features
3. **Simple is powerful** - One blueprint, many uses
4. **Events decouple components** - Pub/Sub for coordination
5. **Themes unify everything** - All components update together
6. **It's easy** - CRUD in 3 lines, forms auto-generated, models reactive

## Navigation Entry

This page appears in the **Core** menu of the showcase navigation:
- Config
- DOM
- Utils
- Storage
- HTTP
- **Integrations** ← New entry (with "New" badge)
