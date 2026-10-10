---
title: Pillbox
description: "Multi-select tag interface with removable pills, keyboard support, and validation options"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Pillbox" tagline="Multi-select tag interface with removable pills, keyboard support, and validation options" align="center"][/hero]

## Overview

The Pillbox component transforms inputs into multi-select tag interfaces. Perfect for tagging, categorizing, skill selection, email recipients, and any scenario where users need to select or create multiple items. Each selection appears as a removable "pill" with full keyboard support and validation options.

### Key Features

- **Multi-Select Tags** - Visual pill-based selection with easy removal
- **Searchable Dropdown** - Filter available options as you type
- **Creatable Mode** - Allow users to create custom tags
- **Validation** - Max items, duplicates prevention, custom validators
- **Keyboard Navigation** - Backspace to remove, arrow keys, Enter to add
- **Value Management** - Separate value/label support for complex data
- **Customizable Rendering** - Custom pill and option templates

### When to Use

- Tagging and categorization systems
- Skill or interest selection
- Email recipient fields (To, CC, BCC)
- Multi-select filters and facets
- Product attribute selection

### Basic Usage

```
// Select from predefined options
const pillbox = Domma.elements.pillbox('#tags', {
    data: ['React', 'Vue', 'Angular', 'Svelte'],
    value: ['React'],
    maxItems: 5,
    onChange: (values) => console.log('Selected:', values)
});

// Allow creating custom tags
Domma.elements.pillbox('#custom-tags', {
    data: ['JavaScript', 'Python', 'Java'],
    creatable: true,
    duplicates: false
});
```

## Getting Started

Add a multi-select tag input to your page in three simple steps

### Step 1: Add Input Element

Create a text input that will be transformed into a pillbox:

```
<input type="text" id="my-tags" placeholder="Select tags...">
```

### Step 2: Include Domma

Add Domma CSS and JavaScript to your page:

```
<!-- CSS -->
<link rel="stylesheet" href="dist/domma.css">
<link rel="stylesheet" href="dist/elements.css">

<!-- JavaScript -->
<script src="dist/domma.min.js"></script>
```

### Step 3: Initialize the Pillbox

Call `Domma.elements.pillbox()` to transform the input:

```
// Select from predefined options
Domma.elements.pillbox('#my-tags', {
    data: ['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go'],
    value: ['JavaScript'],   // Initially selected
    maxItems: 5,             // Limit selections
    onChange: (values) => {
        console.log('Selected:', values);
    }
});

// Or allow users to create custom tags
Domma.elements.pillbox('#my-tags', {
    data: ['React', 'Vue', 'Angular'],
    creatable: true,         // Allow custom entries
    duplicates: false        // Prevent duplicates
});
```

> **Note:** The pillbox component transforms a regular text input into a multi-select tag interface. It auto-generates the dropdown and pills UI. Use backspace to remove the last tag, arrow keys to navigate, and Enter to add selections.

## Quick Start

### Simple Tag Selector

Select your favourite programming languages:

[showcase-demo id="showcase/elements/pillbox/simple-tag-selector" title="Simple Tag Selector" /]

```
<input type="text" id="tech-stack">

<script>
const languages = [
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'py', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' }
];

Domma.elements.pillbox('#tech-stack', {
    data: languages,
    value: ['js'],
    maxItems: 3,
    onChange: (values) => {
        console.log('Selected languages:', values);
    }
});
</script>
```

## Tutorial

Let's build an email recipient field with validation and custom rendering.

[showcase-demo id="showcase/elements/pillbox/tutorial" title="Tutorial" /]

**Key Points:** The pillbox validates emails, prevents duplicates, enforces a max limit, and allows creating custom email addresses not in the contacts list.

## Examples

### Example 1: Creatable Tags (Free-Form)

Create custom tags that aren't in the predefined list:

[showcase-demo id="showcase/elements/pillbox/creatable-tags-free-form" title="Example 1: Creatable Tags (Free-Form)" /]

```
Domma.elements.pillbox('#skills-input', {
    data: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    creatable: true,
    searchable: true,
    duplicates: false,
    onCreate: (skill) => {
        console.log('Created new skill:', skill);
    }
});
```

### Example 2: Size Variants

Control the size of pills and input:

[showcase-demo id="showcase/elements/pillbox/size-variants" title="Example 2: Size Variants" /]

```
// Small
Domma.elements.pillbox('#small', {
    data: items,
    size: 'small'
});

// Large
Domma.elements.pillbox('#large', {
    data: items,
    size: 'large'
});
```

### Example 3: Max Items Limit

Limit the number of selections (try adding more than 3):

[showcase-demo id="showcase/elements/pillbox/max-items-limit" title="Example 3: Max Items Limit" /]

```
Domma.elements.pillbox('#limited-input', {
    data: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
    maxItems: 3,
    maxItemsMessage: 'You can only select {max} items',
    onMaxReached: () => {
        alert('Maximum items reached!');
    }
});
```

### Example 4: Custom Pill Rendering

Customize how pills appear with icons and colors:

[showcase-demo id="showcase/elements/pillbox/custom-pill-rendering" title="Example 4: Custom Pill Rendering" /]

```
const team = [
    { value: '1', label: 'Alice', role: 'Admin' },
    { value: '2', label: 'Bob', role: 'Developer' },
    { value: '3', label: 'Carol', role: 'Designer' }
];

Domma.elements.pillbox('#team-select', {
    data: team,
    renderPill: (item) => {
        const icon = item.role === 'Admin' ? '👑' :
                     item.role === 'Developer' ? '💻' : '🎨';
        return `${icon} ${item.label} <span style="opacity: 0.6;">(${item.role})</span>`;
    },
    renderOption: (item) => {
        const icon = item.role === 'Admin' ? '👑' :
                     item.role === 'Developer' ? '💻' : '🎨';
        return `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>${icon}</span>
                <div>
                    <div><strong>${item.label}</strong></div>
                    <div style="font-size: 0.75rem; opacity: 0.7;">${item.role}</div>
                </div>
            </div>
        `;
    }
});
```

### Example 5: Programmatic Control

Control pills via JavaScript API:

[showcase-demo id="showcase/elements/pillbox/programmatic-control" title="Example 5: Programmatic Control" /]

```
const pillbox = Domma.elements.pillbox('#controlled-pillbox', {
    data: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']
});

// Add pill programmatically
pillbox.addPill('Alpha', 'Alpha');

// Remove pill by value
pillbox.removePill('Alpha');

// Remove last pill
pillbox.removePillAt(pillbox.getCount() - 1);

// Clear all
pillbox.clear();

// Get current values
const values = pillbox.getValue();
console.log(values);  // ['Beta', 'Gamma']

// Set values programmatically
pillbox.setValue(['Delta', 'Epsilon']);
```

## Best Practices

### Accessibility

- **Labels:** Always provide visible labels for pillbox inputs
- **ARIA:** Component includes proper ARIA attributes automatically
- **Keyboard:** Ensure Backspace, Arrow keys, Enter, and Escape work
- **Focus Management:** Pills should be removable via keyboard

### UX Guidelines

- **Max Items:** Set reasonable limits (3-10) to prevent overwhelming UI
- **Clear Feedback:** Show validation errors clearly (onValidationError)
- **Duplicate Prevention:** Enable `duplicates: false` in most cases
- **Searchable:** Keep searchable enabled for lists > 10 items
- **Placeholders:** Use descriptive placeholders ("Add skills...", "Type email...")

### Data Management

- **Value/Label:** Use objects with value/label for complex data
- **Validation:** Implement `validatePill` for format checks (emails, URLs)
- **Initial Values:** Set `value` option for pre-selected items
- **onChange:** Track changes to sync with your app state/backend

### Common Pitfalls

- **Avoid:** No max limit on creatable fields - users may add too many
- **Avoid:** Allowing duplicates without clear reason - creates confusion
- **Avoid:** Not validating created pills - can lead to invalid data
- **Avoid:** Hiding the clear button on fields that accumulate many items

## API Reference

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | Array | `[]` | Available options (strings or {value, label} objects) |
| `value` | Array | `[]` | Initial selected values |
| `placeholder` | String | `'Add items...'` | Input placeholder text |
| `searchable` | Boolean | `true` | Enable dropdown search filtering |
| `creatable` | Boolean | `false` | Allow creating custom tags |
| `maxItems` | Number | `null` | Maximum number of pills allowed |
| `duplicates` | Boolean | `false` | Allow duplicate values |
| `clearable` | Boolean | `true` | Show clear-all button |
| `size` | String | `'medium'` | Size variant: 'small', 'medium', 'large' |
| `renderPill` | Function | `null` | Custom pill renderer: (item) => HTML |
| `renderOption` | Function | `null` | Custom option renderer: (item) => HTML |
| `pillTemplate` | String | `'{label}'` | Default pill HTML template |
| `validatePill` | Function | `null` | Validator: (value) => true \| string (error message) |
| `maxItemsMessage` | String | `'Maximum {max} items allowed'` | Message when max items reached |
| `duplicateMessage` | String | `'Item already exists'` | Message when duplicate detected |
| `noResultsMessage` | String | `'No results found'` | Empty dropdown message |
| `onAdd` | Function | `null` | Callback when pill added: (value, element) => {} |
| `onRemove` | Function | `null` | Callback when pill removed: (value, element) => {} |
| `onChange` | Function | `null` | Callback on value change: (values) => {} |
| `onCreate` | Function | `null` | Callback when custom pill created: (value) => {} |
| `onMaxReached` | Function | `null` | Callback when max items reached: () => {} |
| `onValidationError` | Function | `null` | Callback on validation error: (error, value) => {} |
[/table]

### Methods

[table striped="true"]
| Method | Returns | Description |
| --- | --- | --- |
| `getValue()` | Array | Get array of current values |
| `setValue(values)` | this | Set values (clears existing pills first) |
| `addPill(value, label)` | this | Add a single pill |
| `removePill(value)` | this | Remove pill by value |
| `removePillAt(index)` | this | Remove pill at index |
| `clear()` | this | Remove all pills |
| `getCount()` | Number | Get number of pills |
| `setData(data)` | this | Update available options |
| `open()` | this | Open dropdown |
| `close()` | this | Close dropdown |
| `isOpen()` | Boolean | Check if dropdown is open |
| `focus()` | this | Focus the input |
| `enable()` | this | Enable the component |
| `disable()` | this | Disable the component |
| `destroy()` | void | Remove component and clean up |
[/table]

### CSS Classes

[table striped="true"]
| Class | Description |
| --- | --- |
| `.dm-pillbox` | Wrapper container |
| `.dm-pillbox-container` | Pills + input container |
| `.dm-pillbox-input` | The text input |
| `.dm-pill` | Individual pill element |
| `.dm-pill-remove` | Remove button on pill |
| `.dm-pillbox-clear` | Clear all button |
| `.dm-pillbox-dropdown` | Dropdown container |
| `.dm-pillbox-options` | Options list (ul) |
| `.dm-pillbox-option` | Individual option (li) |
| `.dm-pillbox-option.active` | Currently focused option |
| `.dm-pillbox-empty` | Empty state message |
| `.dm-pillbox-small` | Small size variant |
| `.dm-pillbox-large` | Large size variant |
| `.dm-pillbox.disabled` | Disabled state |
[/table]

## Config Engine

Use Domma's declarative configuration system to initialize pillbox components from JSON config.

### Basic Configuration

```
$.setup({
    '#skills-input': {
        component: 'pillbox',
        options: {
            data: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
            maxItems: 5,
            duplicates: false
        }
    }
});
```

### With Creatable Mode

```
$.setup({
    '#tags-input': {
        component: 'pillbox',
        options: {
            data: ['Frontend', 'Backend', 'DevOps'],
            creatable: true,
            searchable: true,
            onCreate: (tag) => {
                console.log('Created new tag:', tag);
            }
        }
    }
});
```

### Multiple Instances

```
$.setup({
    '#skills': {
        component: 'pillbox',
        options: {
            data: ['Python', 'Java', 'C++'],
            size: 'small',
            maxItems: 3
        }
    },
    '#interests': {
        component: 'pillbox',
        options: {
            data: ['Music', 'Sports', 'Reading'],
            size: 'large',
            creatable: true
        }
    }
});
```

## Model Integration

Pillbox integrates seamlessly with Domma's reactive Model system (M) for two-way data binding. When bound to a model, the pillbox automatically syncs with model changes and updates the model when user input changes.

### Basic Model Binding

[showcase-demo id="showcase/elements/pillbox/basic-model-binding" title="Basic Model Binding" /]

```
// Create a model with an array field
const tagsModel = M.create({
    selectedTags: { type: 'array', default: [] }
});

// Bind pillbox to model
Domma.elements.pillbox('#tags', {
    data: ['React', 'Vue', 'Angular', 'Svelte'],
    model: tagsModel,
    modelKey: 'selectedTags'
});

// Display model value elsewhere
M.bind(tagsModel, 'selectedTags', '#tag-display', {
    format: (tags) => tags.length > 0 ? tags.join(', ') : 'None selected'
});
```

### Two-Way Synchronisation

Changes to the model automatically update the pillbox, and vice versa:

```
// Model changes update the pillbox
tagsModel.set('selectedTags', ['React', 'Vue']);  // Pills appear

// Adding/removing pills updates the model
// User adds pill → model.set() called → other bindings update
```

### Config Engine Integration

```
const userModel = M.create({
    skills: { type: 'array', default: [] }
});

$.setup({
    '#skills': {
        component: 'pillbox',
        options: {
            data: ['JavaScript', 'Python', 'Java'],
            model: userModel,
            modelKey: 'skills'
        }
    }
});
```

### Multiple Bindings

Multiple elements can bind to the same model field for synchronised updates:

```
const formModel = M.create({
    tags: { type: 'array', default: [] }
});

// Pillbox component
Domma.elements.pillbox('#tags-input', {
    data: tagOptions,
    model: formModel,
    modelKey: 'tags'
});

// Display tag count
M.bind(formModel, 'tags', '#tag-count', {
    format: (tags) => `${tags.length} tag(s) selected`
});

// Display as JSON
M.bind(formModel, 'tags', '#tags-json', {
    format: (tags) => JSON.stringify(tags, null, 2)
});
```

## CSS Customisation

Override these CSS variables to customise Pillbox appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-pillbox-bg` | `var(--dm-surface)` | Pillbox background |
| `--dm-pillbox-border` | `var(--dm-border)` | Pillbox border |
| `--dm-pill-bg` | `var(--dm-primary-light)` | Individual pill background |
| `--dm-pill-color` | `var(--dm-text)` | Pill text colour |
| `--dm-pill-hover-bg` | `currentColor at 15%` | The x on a pill, hovered |
[/table]

### Example Override

```css
/* Solid brand pills. Set them on .dm-pillbox (or anything inside the
   themed ) rather than :root, so they follow a theme switch. */
.dm-pillbox {
    --dm-pill-bg: var(--dm-primary);
    --dm-pill-color: var(--dm-text-inverse);
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

Explore related Domma components:

[showcase-demo id="showcase/elements/pillbox/related-elements" title="Related Elements" /]
