---
title: Dropdown
description: "Display contextual menus and option lists with smart positioning and keyboard navigation"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Dropdown" tagline="Display contextual menus and option lists with smart positioning and keyboard navigation" align="center"][/hero]

## Overview

Dropdowns display contextual menus and option lists. They're perfect for navigation menus, action lists, and settings panels. Domma's dropdown supports positioning, triggers, and dynamic content.

### Key Features

- **Multiple Triggers** - Click or hover activation
- **Smart Positioning** - Auto-adjusts to viewport edges
- **Keyboard Navigation** - Arrow keys and Enter/Escape support
- **Close on Outside Click** - Automatic dismiss behaviour

### Basic Usage

```
// Attach to a button element
const dropdown = Domma.elements.dropdown('#my-button', {
    items: [
        { text: 'Edit', value: 'edit' },
        { text: 'Delete', value: 'delete' }
    ],
    trigger: 'click',
    position: 'bottom-start',
    onSelect: (item) => console.log(item.value)
});
```

**Note:** The dropdown component creates menus programmatically from the `items` array. It doesn't use static HTML menu structures.

## Getting Started

Add a dropdown menu to your page in three simple steps

### Step 1: Add Trigger Button

Create a button that will trigger the dropdown:

```
<button id="my-dropdown" class="btn btn-primary">Actions</button>
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

### Step 3: Initialize the Dropdown

Call `Domma.elements.dropdown()` with menu items:

```
Domma.elements.dropdown('#my-dropdown', {
    items: [
        { text: 'Edit', value: 'edit' },
        { text: 'Duplicate', value: 'duplicate' },
        { divider: true },  // Add separator line
        { text: 'Delete', value: 'delete', class: 'text-danger' }
    ],
    trigger: 'click',       // Show on click
    position: 'bottom-start', // Position below button
    onSelect: (item) => {
        console.log('Selected:', item.value);
    }
});
```

> **Note:** The dropdown auto-generates the menu from the items array (no HTML menu required). It handles positioning, keyboard navigation, and automatically closes when clicking outside. Use `divider: true` for separator lines.

## Quick Start

### Simple Dropdown

[showcase-demo id="showcase/elements/dropdown/simple-dropdown" title="Simple Dropdown" /]

```
<button class="btn btn-primary" id="my-dropdown">Actions</button>

<script>
Domma.elements.dropdown('#my-dropdown', {
    items: [
        { text: 'Edit', value: 'edit' },
        { text: 'Duplicate', value: 'duplicate' },
        { divider: true },
        { text: 'Delete', value: 'delete', class: 'text-danger' }
    ],
    onSelect: (item) => console.log('Selected:', item)
});
</script>
```

## Tutorial

Build a user profile dropdown with event handling.

[showcase-demo id="showcase/elements/dropdown/tutorial" title="Tutorial" /]

```
const dropdown = Domma.elements.dropdown('#user-dropdown', {
    items: [
        { header: 'Signed in as user@example.com' },
        { divider: true },
        { text: 'Profile', value: 'profile' },
        { text: 'Settings', value: 'settings' },
        { text: 'Billing', value: 'billing' },
        { divider: true },
        { text: 'Sign Out', value: 'logout' }
    ],
    onOpen: () => console.log('Dropdown opened'),
    onClose: () => console.log('Dropdown closed'),
    onSelect: (item) => {
        console.log(`Action selected: ${item.value}`);
    }
});
```

## Examples

### Hover Trigger

[showcase-demo id="showcase/elements/dropdown/hover-trigger" title="Hover Trigger" /]

### Positioning

[showcase-demo id="showcase/elements/dropdown/positioning" title="Positioning" /]

### With Dividers and Headers

[showcase-demo id="showcase/elements/dropdown/with-dividers-and-headers" title="With Dividers and Headers" /]

### Programmatic Control

[showcase-demo id="showcase/elements/dropdown/programmatic-control" title="Programmatic Control" /]

## Best Practices

### Accessibility

- **Keyboard Navigation** - Use arrow keys to navigate items, Enter to select, Escape to close
- **ARIA Attributes** - Add `aria-haspopup="true"` and `aria-expanded` to toggle button
- **Focus Management** - Focus moves to first item when opened
- **Screen Readers** - Use semantic ```` elements for triggers

### UX Guidelines

- **Clear Trigger** - Make dropdown button visually distinct with chevron icon
- **Logical Grouping** - Use dividers and headers to organise menu items
- **Close on Action** - Enable `closeOnClick` for action menus
- **Hover Delay** - Add slight delay for hover triggers to prevent accidental opens

### Performance

- **Event Delegation** - Attach single listener to menu instead of individual items
- **Destroy When Done** - Call `destroy()` on dynamic dropdowns

## API Reference

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | Array | `[]` | Menu items array. Each item: `{ text, value, class }` or `{ header }` or `{ divider: true }` |
| `trigger` | String | `'click'` | Trigger type: 'click' or 'hover' |
| `position` | String | `'bottom-start'` | Side plus alignment: `bottom`, `top`, `left` or `right`, each with `-start` or `-end` |
| `flip` | Boolean | `true` | Flip to the opposite side, and clamp to the viewport, rather than open off screen |
| `closeOnSelect` | Boolean | `true` | Close when an item is chosen |
| `closeOnClickOutside` | Boolean | `true` | Close when clicking outside the trigger and menu |
| `closeOnEscape` | Boolean | `true` | Close on Esc and return focus to the trigger |
| `closeOthers` | Boolean | `true` | Opening this dropdown closes any other open one |
| `hoverOpenDelay` | Number | `0` | ms to wait before a hover opens the menu - raise it to stop a menu opening when the pointer merely sweeps across the trigger |
| `hoverCloseDelay` | Number | `300` | ms of grace before a hover menu closes once the pointer has left the trigger, the menu and the space between them |
| `animation` | Boolean | `true` | Enable animations |
| `animationDuration` | Number | `150` | ms the open/close transition runs for |
| `offset` | Array | `[0, 4]` | `[x, y]` gap between trigger and menu, in px |
| `onOpen` | Function | `null` | Open callback |
| `onClose` | Function | `null` | Close callback |
| `onSelect` | Function | `null` | Item selection callback - receives selected item object |
[/table]

### Methods

[table striped="true"]
| Method | Description |
| --- | --- |
| `open()` | Open the dropdown |
| `close()` | Close the dropdown |
| `toggle()` | Toggle dropdown state |
| `isOpen()` | Check if dropdown is open |
| `setItems(items)` | Replace the item list, re-rendering if the menu is open |
| `addItem(item)` | Append one item |
| `removeItem(index)` | Remove the item at `index` |
| `getSelected()` | The value of the last selected item |
| `destroy()` | Remove dropdown and clean up |
[/table]

### CSS Classes

[table striped="true"]
| Class | Description |
| --- | --- |
| `.dropdown` | Container element |
| `.dropdown-toggle` | Trigger button |
| `.dropdown-menu` | Menu container |
| `.dropdown-item` | Menu item link |
| `.dropdown-divider` | Visual separator |
| `.dropdown-header` | Section header text |
[/table]

## Config Engine

```
$.setup({
    '#user-menu': {
        component: 'dropdown',
        options: {
            trigger: 'click',
            position: 'bottom-end',
            closeOnClick: true,
            onOpen: () => console.log('Menu opened')
        }
    },
    '#hover-menu': {
        component: 'dropdown',
        options: {
            trigger: 'hover',
            position: 'bottom-start'
        }
    }
});
```

## CSS Customisation

Override these CSS variables to customise Dropdown appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-dropdown-bg` | `var(--dm-surface)` | Dropdown background |
| `--dm-dropdown-border` | `var(--dm-border)` | Dropdown border colour |
| `--dm-dropdown-item-hover` | `var(--dm-hover-bg)` | Item hover background |
| `--dm-shadow-md` | `0 4px 6px...` | Dropdown shadow |
[/table]

### Example Override

```css
:root {
    /* Highlight hover with primary */
    --dm-dropdown-item-hover: var(--dm-primary-light);
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/dropdown/related-elements" title="Related Elements" /]
