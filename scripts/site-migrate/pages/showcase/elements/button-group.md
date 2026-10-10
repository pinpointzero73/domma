---
title: Button Group
description: "Combine multiple buttons into a unified component for toggle controls, view switchers, and option selection"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Button Group" tagline="Combine multiple buttons into a unified component for toggle controls, view switchers, and option selection" align="center"][/hero]

## Overview

Button Groups combine multiple buttons into a single unified component with connected borders. They're perfect for creating toggle controls, view switchers, text formatting toolbars, and any interface where users select from a set of related options.

### Key Features

- **Single Mode** - Radio button behaviour (only one active)
- **Multiple Mode** - Checkbox behaviour (multiple active)
- **Horizontal & Vertical** - Layout orientation options
- **Size Variants** - Small, default, and large sizes
- **Programmatic Control** - setValue, toggle, selectAll, deselectAll
- **Change Callbacks** - React to selection changes

### When to Use Button Groups

- **View Toggles** - Day/Week/Month views, grid/list layouts
- **Text Formatting** - Bold/Italic/Underline toolbars
- **Filter Controls** - Single or multi-select filters
- **Segmented Controls** - iOS-style segment pickers

### Basic Usage

```
<!-- HTML Structure -->
<div class="btn-group" id="my-group">
    <button class="btn btn-outline active">Option 1</button>
    <button class="btn btn-outline">Option 2</button>
    <button class="btn btn-outline">Option 3</button>
</div>

<!-- JavaScript Initialisation -->
<script>
const group = Domma.elements.buttonGroup('#my-group', {
    mode: 'single',
    onChange: (value) => {
        console.log('Selected index:', value);
    }
});
</script>
```

## Quick Start

Get started with Button Groups in seconds. Here's the simplest implementation:

### CSS-Only Button Group (No JavaScript)

For visual grouping without interactivity:

[showcase-demo id="showcase/elements/button-group/css-only-button-group-no-javascript" title="CSS-Only Button Group (No JavaScript)" /]

```
<div class="btn-group">
    <button class="btn btn-primary">Left</button>
    <button class="btn btn-primary">Middle</button>
    <button class="btn btn-primary">Right</button>
</div>
```

### Interactive Toggle Group (Single Selection)

With JavaScript for radio button behaviour:

[showcase-demo id="showcase/elements/button-group/interactive-toggle-group-single-selection" title="Interactive Toggle Group (Single Selection)" /]

```
<div class="btn-group" id="view-toggle">
    <button class="btn btn-outline active">Day</button>
    <button class="btn btn-outline">Week</button>
    <button class="btn btn-outline">Month</button>
</div>

<script>
const viewToggle = Domma.elements.buttonGroup('#view-toggle', {
    mode: 'single',
    onChange: (value) => {
        const labels = ['Day', 'Week', 'Month'];
        console.log('Selected:', labels[value]);
    }
});
</script>
```

## Step-by-Step Tutorial

Let's build a text formatting toolbar with bold, italic, and underline controls (multiple selection mode).

### Step 1: Create the HTML Structure

Start with a container and buttons. Add the `.btn-group` class:

```
<div class="btn-group" id="format-toolbar">
    <button class="btn btn-outline">Bold</button>
    <button class="btn btn-outline">Italic</button>
    <button class="btn btn-outline">Underline</button>
</div>
<div id="format-result" class="mt-4"></div>
```

### Step 2: Initialise with Multiple Mode

Enable checkbox behaviour by setting `mode: 'multiple'`:

```
const toolbar = Domma.elements.buttonGroup('#format-toolbar', {
    mode: 'multiple'
});
```

### Step 3: Add Change Callback

React to selection changes. The callback receives an array of active indices:

```
const toolbar = Domma.elements.buttonGroup('#format-toolbar', {
    mode: 'multiple',
    onChange: (values) => {
        const labels = ['Bold', 'Italic', 'Underline'];
        const active = values.map(i => labels[i]).join(', ');
        $('#format-result').text(
            active || 'No formatting selected';
    }
});
```

### Step 4: Add Control Buttons

Provide programmatic control with select all and clear all:

```
<button id="select-all" class="btn btn-sm btn-secondary">Select All</button>
<button id="clear-all" class="btn btn-sm btn-secondary">Clear All</button>

<script>
$('#select-all').on('click', () => {
    toolbar.selectAll();
});

$('#clear-all').on('click', () => {
    toolbar.deselectAll();
});
</script>
```

### Step 5: Add Visual Feedback

Apply styles based on the selected formatting:

```
const toolbar = Domma.elements.buttonGroup('#format-toolbar', {
    mode: 'multiple',
    onChange: (values) => {
        const result = $('#format-result');
        const labels = ['Bold', 'Italic', 'Underline'];

        // Update text
        const active = values.map(i => labels[i]).join(', ');
        result.textContent = active || 'No formatting selected';

        // Apply CSS styles
        result.style.fontWeight = values.includes(0) ? 'bold' : 'normal';
        result.style.fontStyle = values.includes(1) ? 'italic' : 'normal';
        result.style.textDecoration = values.includes(2) ? 'underline' : 'none';
    }
});
```

### Step 6: Complete Working Demo

Try the complete formatting toolbar:

[showcase-demo id="showcase/elements/button-group/complete-working-demo" title="Step 6: Complete Working Demo" /]

## Examples & Variations

### View Toggle (Single Selection)

Radio button behaviour - only one option active at a time:

[showcase-demo id="showcase/elements/button-group/view-toggle-single-selection" title="View Toggle (Single Selection)" /]

```
const viewToggle = Domma.elements.buttonGroup('#view-toggle', {
    mode: 'single',
    onChange: (value) => {
        const labels = ['Day', 'Week', 'Month'];
        $('#view-value').text(labels[value]);
    }
});
```

### Format Toolbar (Multiple Selection)

Checkbox behaviour - multiple options can be active:

[showcase-demo id="showcase/elements/button-group/format-toolbar-multiple-selection" title="Format Toolbar (Multiple Selection)" /]

```
const formatToggle = Domma.elements.buttonGroup('#format-toggle', {
    mode: 'multiple',
    onChange: (values) => {
        const labels = ['Bold', 'Italic', 'Underline'];
        const active = values.map(i => labels[i]).join(', ');
        $('#format-value').text(active || 'None');
    }
});
```

### Vertical Button Group

Stack buttons vertically with `.btn-group-vertical`:

[showcase-demo id="showcase/elements/button-group/vertical-button-group" title="Vertical Button Group" /]

```
<div class="btn-group-vertical" id="vertical-group">
    <button class="btn btn-secondary active">Top</button>
    <button class="btn btn-secondary">Middle</button>
    <button class="btn btn-secondary">Bottom</button>
</div>

<script>
Domma.elements.buttonGroup('#vertical-group', {
    mode: 'single'
});
</script>
```

### Size Variants

Small, default, and large button groups:

[showcase-demo id="showcase/elements/button-group/size-variants" title="Size Variants" /]

```
<!-- Small -->
<div class="btn-group">
    <button class="btn btn-primary btn-sm">Small</button>
    <button class="btn btn-primary btn-sm">Group</button>
</div>

<!-- Default -->
<div class="btn-group">
    <button class="btn btn-primary">Default</button>
    <button class="btn btn-primary">Group</button>
</div>

<!-- Large -->
<div class="btn-group">
    <button class="btn btn-primary btn-lg">Large</button>
    <button class="btn btn-primary btn-lg">Group</button>
</div>
```

### Allow Empty Selection

In single mode, allow deselecting all buttons:

[showcase-demo id="showcase/elements/button-group/allow-empty-selection" title="Allow Empty Selection" /]

```
const optionalGroup = Domma.elements.buttonGroup('#optional-group', {
    mode: 'single',
    allowEmpty: true,  // Allow no selection
    onChange: (value) => {
        const labels = ['Option A', 'Option B', 'Option C'];
        $('#optional-value').text(
            value !== null ? labels[value] : 'None';
    }
});
```

### Programmatic Control

Control selections via JavaScript methods:

[showcase-demo id="showcase/elements/button-group/programmatic-control" title="Programmatic Control" /]

```
const group = Domma.elements.buttonGroup('#programmatic-group', {
    mode: 'multiple',
    onChange: (values) => {
        $('#prog-value').text(JSON.stringify(values));
    }
});

// Programmatic methods
$('#prog-set-0').on('click', () => {
    group.setValue([0]);  // Set active buttons by index
});

$('#prog-set-1').on('click', () => {
    group.setValue([1]);
});

$('#prog-toggle-2').on('click', () => {
    group.toggle(2);  // Toggle specific button
});

$('#prog-clear').on('click', () => {
    group.deselectAll();  // Clear all selections
});
```

### Icon Button Group

Use icons for compact visual controls:

[showcase-demo id="showcase/elements/button-group/icon-button-group" title="Icon Button Group" /]

```
<div class="btn-group" id="icon-group">
    <button class="btn btn-outline active" title="Left Align">
        <svg width="16" height="16">...</svg>
    </button>
    <button class="btn btn-outline" title="Centre Align">
        <svg width="16" height="16">...</svg>
    </button>
    <button class="btn btn-outline" title="Right Align">
        <svg width="16" height="16">...</svg>
    </button>
</div>

<script>
Domma.elements.buttonGroup('#icon-group', {
    mode: 'single'
});
</script>
```

### Real-World Example: Filter Panel

Build a product filter with category and price range controls:

[showcase-demo id="showcase/elements/button-group/real-world-example-filter-panel" title="Real-World Example: Filter Panel" /]

```
// Category filter (single selection, allow empty)
const categoryFilter = Domma.elements.buttonGroup('#category-filter', {
    mode: 'single',
    allowEmpty: true,
    onChange: updateFilters
});

// Price filter (single selection, allow empty)
const priceFilter = Domma.elements.buttonGroup('#price-filter', {
    mode: 'single',
    allowEmpty: true,
    onChange: updateFilters
});

function updateFilters() {
    const categories = ['All', 'Electronics', 'Clothing', 'Books'];
    const prices = ['Under £20', '£20-£50', '£50-£100', 'Over £100'];

    const category = categoryFilter.getValue();
    const price = priceFilter.getValue();

    const filters = [];
    if (category !== null) filters.push(categories[category]);
    if (price !== null) filters.push(prices[price]);

    $('#filter-summary').text(
        filters.length ? filters.join(', ') : 'None selected';
}
```

## Best Practices

### Accessibility

- **Use Semantic Buttons** - Always use ```` elements, not ```` or ``[tags]()

### Performance

- **Single Initialisation** - Initialise once, use programmatic methods for changes
- **Event Delegation** - Component uses event delegation internally - no need to rebind after updates
- **Destroy When Removed** - Call `.destroy()` when removing from DOM to clean up listeners
- **Throttle onChange** - If onChange triggers expensive operations, use `_.throttle()` or `_.debounce()`
- **Cache DOM Queries** - Store component instance instead of re-selecting: `const group
                = Domma.elements.buttonGroup(...)`
- **Get Button Elements** - Use `getActive()` to access actual button elements, not just indices

### Common Gotchas

- **Issue:** onChange callback not firing  
 **Solution:** Ensure buttons have class `.btn` - component only tracks elements with this class  
 **Example:** `Click`
- **Issue:** getValue() returns null in single mode  
 **Solution:** No button is active. Either set initial active button in HTML or use `allowEmpty:
                false`  
 **Example:** `Default`
- **Issue:** selectAll() doesn't work  
 **Solution:** selectAll() only works in `mode: 'multiple'`, not single mode  
 **Example:** `{ mode: 'multiple' }`
- **Issue:** Buttons visually separate instead of connected  
 **Solution:** Missing `.btn-group` class on container  
 **Example:** ````
- **Issue:** Active class not changing  
 **Solution:** Using custom activeClass? Ensure CSS styles it correctly  
 **Example:** `{ activeClass: 'selected' }` requires `.selected { ...
                }` CSS

### Tips & Tricks

- **Default Selection** - Add `.active` class in HTML to pre-select buttons
- **Mixed Sizes** - All buttons in a group should use the same size class for visual consistency
- **Outline Style** - Use `.btn-outline` for toggle groups, `.btn-primary` for static groups
- **Vertical on Mobile** - Switch to `.btn-group-vertical` on small screens for better touch targets
- **Store Instance** - Save returned instance to call methods later: `const group =
                Domma.elements.buttonGroup(...)`
- **Get Button Elements** - Use `getActive()` to access actual button elements, not just indices

```
<!-- Accessible Button Group -->
<div class="btn-group" role="group" aria-label="Text alignment">
    <button class="btn btn-outline" aria-pressed="false" aria-label="Align left">
        <svg>...</svg>
    </button>
    <button class="btn btn-outline active" aria-pressed="true" aria-label="Align centre">
        <svg>...</svg>
    </button>
    <button class="btn btn-outline" aria-pressed="false" aria-label="Align right">
        <svg>...</svg>
    </button>
</div>

<script>
const group = Domma.elements.buttonGroup('.btn-group', {
    mode: 'single',
    onChange: (value, index, button) => {
        // Update ARIA states
        group.buttons.forEach((btn, i) => {
            btn.setAttribute('aria-pressed', i === value);
        });
    }
});
</script>
```

## API Reference

### Constructor Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | String | `'single'` | Selection mode. `'single'` = radio (one active), `'multiple'` = checkbox (many active) |
| `activeClass` | String | `'active'` | CSS class applied to active/selected buttons |
| `allowEmpty` | Boolean | `false` | In single mode, allow deselecting all buttons (clicking active button deselects it) |
| `onChange` | Function | `null` | Callback fired when selection changes. Receives `(value, index, button)`. Value is index (single) or array (multiple) |
[/table]

### Methods

[table striped="true"]
| Method | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `getValue()` | - | Number \| Number[] \| null | Get active button index (single mode) or array of indices (multiple mode). Returns null if none active |
| `getActive()` | - | HTMLElement \| HTMLElement[] \| null | Get active button element (single) or array of elements (multiple). Returns null if none active |
| `setValue(value)` | Number \| Number[] | this | Set active button(s) by index. Pass single index (single mode) or array of indices (multiple). Chainable |
| `toggle(index)` | Number | this | Toggle a specific button by index. In single mode, selects it. In multiple mode, toggles it. Chainable |
| `selectAll()` | - | this | Select all buttons. Only works in `mode: 'multiple'`. Chainable |
| `deselectAll()` | - | this | Deselect all buttons. Works in both single and multiple modes. Chainable |
| `destroy()` | - | void | Remove event listeners and clean up. Call before removing from DOM |
[/table]

### Events / Callbacks

[table striped="true"]
| Event | Parameters | Description |
| --- | --- | --- |
| `onChange` | `(value, index, button)` | Fired when selection changes (button clicked or programmatic change).  
 **value:** Active index (single) or array of indices (multiple)  
 **index:** Index of button that triggered change (-1 for selectAll/deselectAll)  
 **button:** Button element that triggered change (null for selectAll/deselectAll) |
[/table]

### CSS Classes

[table striped="true"]
| Class | Description |
| --- | --- |
| `.btn-group` | Container class for horizontal button groups. Connects borders and removes gaps between buttons |
| `.btn-group-vertical` | Container class for vertical button groups. Stacks buttons vertically with connected borders |
| `.btn` | Required base class for all buttons within the group. Component only tracks elements with this class |
| `.active` | Default class applied to selected/active buttons. Can be customised via `activeClass` option |
| `.btn-primary` | Primary button style (filled blue). Good for static groups |
| `.btn-secondary` | Secondary button style (filled grey) |
| `.btn-outline` | Outline button style (transparent with border). Recommended for toggle groups |
| `.btn-sm` | Small button size |
| `.btn-lg` | Large button size |
[/table]

```
// Complete API Example
const group = Domma.elements.buttonGroup('#my-group', {
    mode: 'multiple',
    activeClass: 'selected',
    allowEmpty: true,
    onChange: (value, index, button) => {
        console.log('Selection changed:', value);
        console.log('Triggered by button at index:', index);
    }
});

// Methods
group.setValue([0, 2]);           // Select first and third buttons
const active = group.getValue();  // Get active indices: [0, 2]
const buttons = group.getActive(); // Get button elements
group.toggle(1);                  // Toggle second button
group.selectAll();                // Select all (multiple mode only)
group.deselectAll();              // Clear all selections
group.destroy();                  // Clean up when done
```

## Config Engine Integration

Use Domma's declarative `$.setup()` system to configure Button Groups without manual initialisation.

### Basic Setup

```
$.setup({
    '#view-toggle': {
        component: 'buttonGroup',
        options: {
            mode: 'single',
            onChange: (value) => {
                console.log('Selected:', value);
            }
        }
    }
});
```

### Multiple Button Groups

```
$.setup({
    // View selector (single mode)
    '#view-selector': {
        component: 'buttonGroup',
        options: {
            mode: 'single',
            allowEmpty: false,
            onChange: (value) => {
                updateView(['day', 'week', 'month'][value]);
            }
        }
    },

    // Format toolbar (multiple mode)
    '#format-toolbar': {
        component: 'buttonGroup',
        options: {
            mode: 'multiple',
            onChange: (values) => {
                applyFormatting(values);
            }
        }
    },

    // Category filter
    '#category-filter': {
        component: 'buttonGroup',
        options: {
            mode: 'single',
            allowEmpty: true,
            activeClass: 'selected'
        }
    }
});
```

### Live Demo

Button Group configured via Config Engine:

[showcase-demo id="showcase/elements/button-group/live-demo" title="Live Demo" /]

```
// Configuration
$.setup({
    '#config-demo-group': {
        component: 'buttonGroup',
        options: {
            mode: 'single',
            onChange: (value) => {
                const labels = ['Option 1', 'Option 2', 'Option 3'];
                $('#config-demo-value').text(labels[value]);
            }
        }
    }
});

// Access instance later
const group = Domma.elements.get('#config-demo-group');
group.setValue(1);  // Programmatic control still works
```

## CSS Customisation

Override these CSS variables to customise Button Group appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-primary` | `var(--dm-blue-600)` | Active button colour |
| `--dm-primary-hover` | `var(--dm-blue-700)` | Active button hover |
| `--dm-border` | `var(--dm-slate-300)` | Button border colour |
| `--dm-radius-md` | `0.375rem` | Button corner radius |
[/table]

### Example Override

```css
:root {
    /* Flat button group */
    --dm-border: transparent;
}
```

[]()[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/button-group/related-elements" title="Related Elements" /]
