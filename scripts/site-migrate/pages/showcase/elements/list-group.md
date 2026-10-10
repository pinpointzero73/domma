---
title: List Group
description: "Flexible and powerful lists for content display, navigation, and interactive item selection - with full keyboard navigation and accessibility support"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="List Group" tagline="Flexible and powerful lists for content display, navigation, and interactive item selection - with full keyboard navigation and accessibility support" align="center"][/hero]

## Overview

List Group is a flexible component for rendering sequential content - from simple navigation links to rich content rows with icons, descriptive text, and trailing badges. Items can be made interactive with hover states, active selection, and full JavaScript control via `E.listGroup()`.

### Key Features

- **CSS-Only** - works with plain HTML classes, no JavaScript required for static lists
- **JS API** - `E.listGroup()` enables single- and multi-select, keyboard navigation, and callbacks
- **Colour Variants** - six semantic colour modifiers (primary, secondary, success, danger, warning, info)
- **Size Variants** - compact `.list-group-sm` and spacious `.list-group-lg`
- **Flush Mode** - `.list-group-flush` removes outer border for embedding inside cards
- **Rich Items** - icon, heading, descriptive text, and trailing area all built-in
- **Full Accessibility** - roving tabindex, ARIA roles, keyboard navigation (arrows, Home, End)

### At a Glance

[showcase-demo id="showcase/elements/list-group/at-a-glance" title="At a Glance" /]

```
<!-- CSS-only static list -->
<ul class="list-group">
    <li class="list-group-item active">Dashboard</li>
    <li class="list-group-item">Profile</li>
    <li class="list-group-item disabled">Admin</li>
</ul>

<!-- Interactive JS API -->
const lg = E.listGroup('#my-list', {
    selectable: true,
    onChange: (selected) => console.log(selected)
});
```

## Getting Started

The simplest List Group is a `<ul>` with `.list-group` and `<li>` children with `.list-group-item`. No JavaScript needed.

[showcase-demo id="showcase/elements/list-group/getting-started" title="Getting Started" /]

```
<ul class="list-group">
    <li class="list-group-item">Apples</li>
    <li class="list-group-item">Oranges</li>
    <li class="list-group-item">Bananas</li>
    <li class="list-group-item">Strawberries</li>
</ul>
```

Add `.list-group-item-action` to make items interactive - cursor pointer and hover highlight:

[showcase-demo id="showcase/elements/list-group/getting-started-2" title="Getting Started" /]

```
<ul class="list-group">
    <li class="list-group-item list-group-item-action active">Dashboard</li>
    <li class="list-group-item list-group-item-action">Analytics</li>
    <li class="list-group-item list-group-item-action">Reports</li>
    <li class="list-group-item list-group-item-action disabled">Archive</li>
</ul>
```

## Basic Variants

### Plain Items

The default appearance - a clean bordered list.

[showcase-demo id="showcase/elements/list-group/plain-items" title="Plain Items" /]

```
<ul class="list-group">
    <li class="list-group-item">First item</li>
    <li class="list-group-item">Second item</li>
    <li class="list-group-item">Third item</li>
</ul>
```

### With Icons

Use `.list-group-item-icon` for a left-aligned icon or avatar area. Pair with `<span data-icon="...">` and call `I.scan()`.

[showcase-demo id="showcase/elements/list-group/with-icons" title="With Icons" /]

```
<ul class="list-group">
    <li class="list-group-item">
        <span class="list-group-item-icon">
            <span data-icon="mail"></span>
        </span>
        Inbox
    </li>
    <li class="list-group-item">
        <span class="list-group-item-icon">
            <span data-icon="send"></span>
        </span>
        Sent
    </li>
</ul>
```

### With Content (Heading + Text + Trailing)

Combine `.list-group-item-content`, `.list-group-item-heading`, `.list-group-item-text`, and `.list-group-item-trailing` for rich rows.

[showcase-demo id="showcase/elements/list-group/with-content-heading-text-trailing" title="With Content (Heading + Text + Trailing)" /]

```
<li class="list-group-item list-group-item-action">
    <span class="list-group-item-icon">
        <span data-icon="user"></span>
    </span>
    <span class="list-group-item-content">
        <span class="list-group-item-heading">Alice Brennan</span>
        <span class="list-group-item-text">alice@example.com</span>
    </span>
    <span class="list-group-item-trailing">
        <span class="badge badge-success">Admin</span>
    </span>
</li>
```

## Colour Variants

Add a semantic colour class to any `.list-group-item` - it applies a left border accent and a lightly tinted background.

[showcase-demo id="showcase/elements/list-group/colour-variants" title="Colour Variants" /]

```
<ul class="list-group">
    <li class="list-group-item list-group-item-primary">Primary</li>
    <li class="list-group-item list-group-item-secondary">Secondary</li>
    <li class="list-group-item list-group-item-success">Success</li>
    <li class="list-group-item list-group-item-danger">Danger</li>
    <li class="list-group-item list-group-item-warning">Warning</li>
    <li class="list-group-item list-group-item-info">Info</li>
</ul>
```

## Size Variants

Apply `.list-group-sm` for a compact list or `.list-group-lg` for extra padding and larger text - useful in sidebars or content-heavy interfaces.

[showcase-demo id="showcase/elements/list-group/size-variants" title="Size Variants" /]

```
<!-- Compact -->
<ul class="list-group list-group-sm"> ... </ul>

<!-- Default -->
<ul class="list-group"> ... </ul>

<!-- Spacious -->
<ul class="list-group list-group-lg"> ... </ul>
```

## Flush

`.list-group-flush` removes the outer border and border-radius so the list blends seamlessly when embedded inside a card. A top border is added to the first item to maintain separation from card content above it.

[showcase-demo id="showcase/elements/list-group/flush" title="Flush" /]

```
<div class="card">
    <div class="card-header">Recent Notifications</div>
    <ul class="list-group list-group-flush">
        <li class="list-group-item list-group-item-action">
            <span class="list-group-item-content">
                <span class="list-group-item-heading">New comment on your post</span>
                <span class="list-group-item-text">5 minutes ago</span>
            </span>
        </li>
        ...
    </ul>
</div>
```

## Numbered

Add `.list-group-numbered` to an `<ol>` to prepend auto-incrementing numbers to each item via CSS counters - no JavaScript required. Works with all size and colour variants.

[showcase-demo id="showcase/elements/list-group/numbered" title="Numbered" /]

```
<ol class="list-group list-group-numbered">
    <li class="list-group-item">Cras justo odio</li>
    <li class="list-group-item">Dapibus ac facilisis in</li>
    <li class="list-group-item">Morbi leo risus</li>
</ol>

<!-- With badges -->
<ol class="list-group list-group-numbered">
    <li class="list-group-item">
        Inbox
        <span class="list-group-item-trailing"><span class="badge badge-primary">14</span></span>
    </li>
</ol>
```

## Horizontal

Change the layout from vertical to horizontal with `.list-group-horizontal`. Use the responsive variants - `.list-group-horizontal-sm`, `-md`, `-lg`, `-xl` - to switch to horizontal only above a given breakpoint.

[showcase-demo id="showcase/elements/list-group/horizontal" title="Horizontal" /]

```
<!-- Always horizontal -->
<ul class="list-group list-group-horizontal">
    <li class="list-group-item">An item</li>
    <li class="list-group-item active">Active</li>
    <li class="list-group-item">A third item</li>
</ul>

<!-- Horizontal above md breakpoint (768px) -->
<ul class="list-group list-group-horizontal-md">
    <li class="list-group-item">One</li>
    <li class="list-group-item">Two</li>
    <li class="list-group-item">Three</li>
</ul>

<!-- Available breakpoints: -sm (576px), -md (768px), -lg (992px), -xl (1200px) -->
```

## Interactive - JavaScript API

Use `E.listGroup(selector, options)` to enable selectable behaviour, keyboard navigation, and callbacks. Set `selectable: true` and add `.list-group-item-action` to items.

### Single Select

Clicking an item selects it and deselects any previously selected item. The `onChange` callback receives an array of the currently selected DOM elements.

[showcase-demo id="showcase/elements/list-group/single-select" title="Single Select" /]

```
const lg = E.listGroup('#my-list', {
    selectable: true,
    onChange: (selected) => {
        const label = selected[0]
            ? selected[0].querySelector('.list-group-item-heading').textContent
            : 'None selected';
        $('#output').text(label);
    }
});

// Programmatic selection
lg.select(1);         // Select item at index 1
lg.deselect(1);       // Deselect item at index 1
lg.deselectAll();     // Clear all selections
lg.getSelected();     // → [HTMLElement, ...]
```

## Multi-Select

Set `multiSelect: true` alongside `selectable: true` to allow multiple items to be active simultaneously. The list container receives `aria-multiselectable="true"` automatically.

[showcase-demo id="showcase/elements/list-group/multi-select" title="Multi-Select" /]

```
const lg = E.listGroup('#my-list', {
    selectable: true,
    multiSelect: true,    // Allow multiple active items
    onChange: (selected) => {
        const labels = selected.map(el =>
            el.querySelector('.list-group-item-heading').textContent
        );
        console.log('Selected:', labels);
    }
});

lg.selectAll();     // Select every non-disabled item
lg.deselectAll();   // Clear all selections
lg.toggle(2);       // Toggle item at index 2
```

## Tutorial - Settings Panel

Build a settings panel where the left-hand List Group acts as a navigation menu and the right panel updates to show the relevant settings on each selection.

### Step 1: Create the HTML structure

```
<div class="settings-layout">
    <ul id="settings-nav" class="list-group list-group-sm settings-sidebar">
        <li class="list-group-item list-group-item-action active">
            <span class="list-group-item-icon"><span data-icon="settings"></span></span>
            <span class="list-group-item-heading">General</span>
        </li>
        <li class="list-group-item list-group-item-action">
            <span class="list-group-item-icon"><span data-icon="lock"></span></span>
            <span class="list-group-item-heading">Security</span>
        </li>
        ...
    </ul>
    <div id="settings-panel" class="settings-panel"></div>
</div>
```

### Step 2: Initialise with onChange callback

```
const panels = {
    0: { title: 'General', body: 'Manage your language, timezone, and display preferences.' },
    1: { title: 'Security', body: 'Update your password and configure two-factor authentication.' },
    2: { title: 'Notifications', body: 'Choose how and when you receive alerts.' },
    3: { title: 'Privacy', body: 'Control data sharing and visibility settings.' },
};

const settingsNav = E.listGroup('#settings-nav', {
    selectable: true,
    onChange: (selected) => {
        const index = lg.getItems().indexOf(selected[0]);
        const p = panels[index];
        $('#settings-panel').html(
            `<h4>${p.title}</h4><p>${p.body}</p>`
        );
    }
});
```

### Step 3: Live Demo

[showcase-demo id="showcase/elements/list-group/live-demo" title="Step 3: Live Demo" /]

## JavaScript API

### Initialisation

```
const lg = E.listGroup('#my-list', {
    selectable: true,         // Enable click-to-select behaviour
    multiSelect: false,       // Allow multiple active items (default: false)
    activeClass: 'active',    // CSS class for selected state (default: 'active')
    disabledClass: 'disabled',// CSS class for disabled items (default: 'disabled')
    itemSelector: '.list-group-item', // Item query selector (default: '.list-group-item')
    keyboard: true,           // Enable arrow-key navigation (default: true)
    loop: true,               // Wrap focus at list boundaries (default: true)
    focusOnInit: false,       // Focus first enabled item on init (default: false)
    onChange:  (selected, event) => {},  // Fires on selection change
    onSelect:  (item, index, event) => {},  // Fires when item selected
    onDeselect:(item, index, event) => {},  // Fires when item deselected
});
```

### Selection Methods

```
lg.select(index)       // Select item at index (fires callbacks)
lg.deselect(index)     // Deselect item at index (fires callbacks)
lg.toggle(index)       // Toggle selection at index
lg.selectAll()         // Select all non-disabled items (multiSelect mode only)
lg.deselectAll()       // Deselect all items
lg.getSelected()       // → HTMLElement[] of currently active items
lg.isSelected(index)   // → boolean
```

### Item Methods

```
lg.getItems()          // → HTMLElement[] - all items
lg.getItem(index)      // → HTMLElement | null
lg.enable(index)       // Remove disabled class and aria-disabled
lg.disable(index)      // Add disabled class and aria-disabled
lg.refresh()           // Re-query items from DOM (use after dynamic changes)
lg.destroy()           // Remove event listeners and clean up ARIA attributes
```

## Keyboard Navigation

When keyboard navigation is enabled (default), users can move between items without using the mouse. The component uses a roving `tabindex` pattern - only the focused item is in the tab order at any time.

[table striped="true"]
| Key | Action |
| --- | --- |
| `Tab` | Move focus into (or away from) the list |
| `↓` / `→` | Move focus to the next enabled item |
| `↑` / `←` | Move focus to the previous enabled item |
| `Home` | Move focus to the first enabled item |
| `End` | Move focus to the last enabled item |
| `Enter` / `Space` | Select (or toggle) the focused item (when `selectable: true`) |
[/table]

```
// Disable keyboard navigation
const lg = E.listGroup('#my-list', {
    selectable: true,
    keyboard: false   // Turn off arrow-key navigation
});

// Disable looping at boundaries
const lg = E.listGroup('#my-list', {
    selectable: true,
    loop: false  // Focus stops at first / last item
});
```

## Accessibility

### Automatic ARIA Attributes

When `selectable: true` is set, the JS API manages ARIA attributes automatically - no manual `aria-*` attributes needed in your HTML.

[table striped="true"]
| Element | Attribute | Value |
| --- | --- | --- |
| `.list-group` | `role` | `"listbox"` |
| `.list-group` (multi) | `aria-multiselectable` | `"true"` |
| `.list-group-item` | `aria-selected` | `"true"` or `"false"` |
| `.list-group-item.disabled` | `aria-disabled` | `"true"` |
| `.list-group-item` | `tabindex` | Roving: `0` (focused) or `-1` |
[/table]

### CSS-Only Guidance

For CSS-only (non-JS) lists, add ARIA attributes yourself when semantics matter:

```
<!-- Navigation list - use <nav> + <ul> -->
<nav aria-label="Main navigation">
    <ul class="list-group">
        <li class="list-group-item">
            <a href="/dashboard" aria-current="page">Dashboard</a>
        </li>
        <li class="list-group-item"><a href="/reports">Reports</a></li>
    </ul>
</nav>

<!-- Content list - plain <ul> is fine -->
<ul class="list-group" aria-label="Notifications">
    <li class="list-group-item">...</li>
</ul>
```

### Screen Reader Notes

- In `selectable` mode the list is announced as a *listbox*; each item as an *option*.
- Selected state is announced via `aria-selected`, so avoid relying on colour alone.
- Icon-only list items should include visually-hidden text or an `aria-label` on the item for context.
- Disabled items receive `aria-disabled="true"` and `pointer-events: none`, so keyboard focus skips them automatically.

## Config Engine

List Group is supported in the declarative config engine via `$.setup()`, allowing you to initialise the component without writing imperative JavaScript.

```
$.setup({
    '#my-list': {
        component: 'listGroup',
        options: {
            selectable: true,
            multiSelect: false,
            onChange: (selected) => {
                console.log('Selection changed:', selected.length, 'item(s) selected');
            }
        }
    }
});
```

### Live Config Engine Demo

[showcase-demo id="showcase/elements/list-group/live-config-engine-demo" title="Live Config Engine Demo" /]

## CSS Customisation

List Group uses standard Domma design tokens. Override these variables globally or scoped to a specific container.

[table striped="true"]
| Variable | Controls |
| --- | --- |
| `--dm-border` | Outer border colour of the list group |
| `--dm-border-light` | Separator colour between items |
| `--dm-surface` | Item background colour |
| `--dm-background-alt` | Item hover background colour |
| `--dm-border-focus` | Focus ring colour (inset box-shadow) |
| `--dm-primary` | Active item background colour |
| `--dm-radius-md` | Border radius of the list group container |
| `--dm-space-3` / `--dm-space-4` | Default item padding |
[/table]

```
/* Tighter separators and softer border */
#my-list {
    --dm-border: rgba(0, 0, 0, 0.08);
    --dm-border-light: rgba(0, 0, 0, 0.04);
}

/* Custom active colour (override primary) */
#my-list .list-group-item.active {
    background-color: #16a34a;   /* Green */
    border-bottom-color: #15803d;
}

/* Borderless items with rounded container */
#my-list {
    --dm-radius-md: 1rem;
}
#my-list .list-group-item {
    border-bottom: none;
    margin-bottom: 2px;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## API Reference

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `selectable` | boolean | `false` | Enable click-to-select behaviour and ARIA listbox roles |
| `multiSelect` | boolean | `false` | Allow more than one item to be active at a time |
| `activeClass` | string | `'active'` | CSS class applied to selected items |
| `disabledClass` | string | `'disabled'` | CSS class that marks items as non-interactive |
| `itemSelector` | string | `'.list-group-item'` | Query selector used to discover child items |
| `keyboard` | boolean | `true` | Enable arrow-key / Home / End navigation |
| `loop` | boolean | `true` | Wrap focus when navigating past first / last item |
| `focusOnInit` | boolean | `false` | Automatically focus the first enabled item on initialisation |
| `onChange` | function | `null` | `(selected: HTMLElement[], event) => void` - fires on any selection change |
| `onSelect` | function | `null` | `(item: HTMLElement, index: number, event) => void` - fires when an item is selected |
| `onDeselect` | function | `null` | `(item: HTMLElement, index: number, event) => void` - fires when an item is deselected |
[/table]

### Methods

[table striped="true"]
| Method | Returns | Description |
| --- | --- | --- |
| `select(index)` | this | Select item at index; fires onSelect and onChange |
| `deselect(index)` | this | Deselect item at index; fires onDeselect and onChange |
| `toggle(index)` | this | Toggle selection at index |
| `selectAll()` | this | Select all non-disabled items (multiSelect mode only) |
| `deselectAll()` | this | Deselect all items; fires callbacks |
| `getSelected()` | HTMLElement[] | Returns array of currently active items |
| `isSelected(index)` | boolean | Whether item at index is currently selected |
| `getItems()` | HTMLElement[] | Returns all item elements as a shallow copy |
| `getItem(index)` | HTMLElement\|null | Returns single item element at index |
| `enable(index)` | this | Remove disabled class and aria-disabled from item |
| `disable(index)` | this | Add disabled class and aria-disabled to item |
| `refresh()` | this | Re-query items from DOM; call after dynamic content changes |
| `destroy()` | void | Remove event listeners and clean up all ARIA attributes |
[/table]

### CSS Classes

[table striped="true"]
| Class | Description |
| --- | --- |
| `.list-group` | Container - flex column, rounded border, overflow hidden |
| `.list-group-flush` | Modifier - remove outer border and radius (for card embedding) |
| `.list-group-sm` | Modifier - reduced padding and smaller font size |
| `.list-group-lg` | Modifier - increased padding and base font size |
| `.list-group-item` | Item - flex row, vertically centred, bottom separator |
| `.list-group-item-action` | Modifier - pointer cursor and hover highlight |
| `.list-group-item.active` | Selected/active state - primary background, white text |
| `.list-group-item.disabled` | Non-interactive state - dimmed, no pointer events |
| `.list-group-item-icon` | Left-aligned icon/avatar slot |
| `.list-group-item-content` | Flex-grow text wrapper |
| `.list-group-item-heading` | Primary text - semi-bold, truncated with ellipsis |
| `.list-group-item-text` | Secondary/muted text - smaller, truncated |
| `.list-group-item-trailing` | Right-aligned area (badges, timestamps, icons) |
| `.list-group-item-primary` | Colour variant - left border + tinted background |
| `.list-group-item-secondary` | Colour variant |
| `.list-group-item-success` | Colour variant |
| `.list-group-item-danger` | Colour variant |
| `.list-group-item-warning` | Colour variant |
| `.list-group-item-info` | Colour variant |
[/table]

## Related Elements

[showcase-demo id="showcase/elements/list-group/related-elements" title="Related Elements" /]
