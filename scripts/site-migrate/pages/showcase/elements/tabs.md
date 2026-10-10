---
title: Tabs
description: "Organize related content into separate panels with smooth transitions and keyboard navigation"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Tabs" tagline="Organize related content into separate panels with smooth transitions and keyboard navigation" align="center"][/hero]

## Overview

Tabs organise related content into separate panels that users can switch between by clicking tab headers. They're perfect for displaying large amounts of information in a compact, organised way without overwhelming users.

### Key Features

- Multiple visual styles (standard, pills, underline)
- Smooth animated transitions between panels
- Programmatic control (show, next, prev)
- Keyboard navigation (arrow keys, Home, End)
- Event callbacks for tab changes
- Automatic ARIA attributes for accessibility
- Responsive behaviour on mobile devices

### When to Use Tabs

- **Content Organisation**: Product details, documentation, settings panels
- **Alternative Views**: Charts vs tables, grid vs list, different time periods
- **Forms**: Multi-step wizards, categorised form sections
- **Dashboards**: Different data views, analytics categories
- **Navigation**: Profile sections (about, posts, photos), account settings

### Basic Usage

```javascript
// HTML structure
<div id="my-tabs" class="tabs">
    <ul class="tab-list">
        <li class="tab-item active">Tab 1</li>
        <li class="tab-item">Tab 2</li>
        <li class="tab-item">Tab 3</li>
    </ul>
    <div class="tab-content">
        <div class="tab-panel active">Panel 1 content</div>
        <div class="tab-panel">Panel 2 content</div>
        <div class="tab-panel">Panel 3 content</div>
    </div>
</div>

// JavaScript
const tabs = Domma.elements.tabs('#my-tabs', {
    activeIndex: 0,
    animation: true
});

// Programmatic control
tabs.show(1);     // Show second tab
tabs.next();      // Go to next tab
tabs.prev();      // Go to previous tab
tabs.getActive(); // Returns active index
```

## Quick Start

Create basic tabs in under a minute. Tabs work automatically with the correct HTML structure.

### Simple Tabs

```javascript
// HTML
<div id="quick-tabs" class="tabs">
    <ul class="tab-list">
        <li class="tab-item active">Home</li>
        <li class="tab-item">Profile</li>
        <li class="tab-item">Messages</li>
    </ul>
    <div class="tab-content">
        <div class="tab-panel active">
            <h3>Home</h3>
            <p>Welcome to your dashboard.</p>
        </div>
        <div class="tab-panel">
            <h3>Profile</h3>
            <p>Your profile information.</p>
        </div>
        <div class="tab-panel">
            <h3>Messages</h3>
            <p>You have 3 new messages.</p>
        </div>
    </div>
</div>

// JavaScript
Domma.elements.tabs('#quick-tabs');
```

[showcase-demo id="showcase/elements/tabs/simple-tabs" title="Simple Tabs" /]

## Step-by-Step Tutorial

Build a product information page with tabs for Overview, Features, and Reviews.

### Step 1: Create Tab Headers

Start with the tab list structure:

```html
<div id="product-tabs" class="tabs">
    <ul class="tab-list">
        <li class="tab-item active">Overview</li>
        <li class="tab-item">Features</li>
        <li class="tab-item">Reviews</li>
    </ul>
</div>
```

### Step 2: Add Tab Panels

Add corresponding content panels (same order as tabs):

```html
<div id="product-tabs" class="tabs">
    <ul class="tab-list">...</ul>
    <div class="tab-content">
        <div class="tab-panel active">
            <h3>Product Overview</h3>
            <p>Description of the product...</p>
        </div>
        <div class="tab-panel">
            <h3>Key Features</h3>
            <ul>
                <li>Feature 1</li>
                <li>Feature 2</li>
            </ul>
        </div>
        <div class="tab-panel">
            <h3>Customer Reviews</h3>
            <p>⭐⭐⭐⭐⭐ (4.8/5)</p>
        </div>
    </div>
</div>
```

### Step 3: Initialise with Animation

Add smooth transitions between tabs:

```javascript
const productTabs = Domma.elements.tabs('#product-tabs', {
    activeIndex: 0,    // Start with first tab
    animation: true    // Enable smooth transitions
});
```

### Step 4: Add Change Callback

Track which tab users view:

```javascript
const productTabs = Domma.elements.tabs('#product-tabs', {
    activeIndex: 0,
    animation: true,
    onChange: (index, panel) => {
        const tabs = ['Overview', 'Features', 'Reviews'];
        console.log(`User viewing: ${tabs[index]}`);
    }
});
```

### Step 5: Add Next/Previous Buttons

Navigate programmatically with buttons:

```html
<button id="prev-tab">← Previous</button>
<button id="next-tab">Next →</button>

$('#prev-tab').on('click', () => {
    productTabs.prev();
});

$('#next-tab').on('click', () => {
    productTabs.next();
});
```

### Step 6: Complete Working Demo

[showcase-demo id="showcase/elements/tabs/complete-working-demo" title="Step 6: Complete Working Demo" /]

## Examples & Variations

### Example 1: Standard Tabs

Classic tab design with underline indicator:

[showcase-demo id="showcase/elements/tabs/standard-tabs" title="Example 1: Standard Tabs" /]

### Example 2: Pill Tabs

Rounded pill-style tabs for modern interfaces:

[showcase-demo id="showcase/elements/tabs/pill-tabs" title="Example 2: Pill Tabs" /]

### Example 3: Vertical Tabs

Side-by-side layout for settings or profiles:

[showcase-demo id="showcase/elements/tabs/vertical-tabs" title="Example 3: Vertical Tabs" /]

### Example 4: Tabs with Icons

Enhance tabs with icons for better recognition:

[showcase-demo id="showcase/elements/tabs/tabs-with-icons" title="Example 4: Tabs with Icons" /]

### Example 5: Tabs with Badge Counts

Show counts or status with badges:

[showcase-demo id="showcase/elements/tabs/tabs-with-badge-counts" title="Example 5: Tabs with Badge Counts" /]

### Example 6: Dynamic Content Loading

Load panel content dynamically on tab change:

[showcase-demo id="showcase/elements/tabs/dynamic-content-loading" title="Example 6: Dynamic Content Loading" /]

## Best Practices

### Accessibility

- **ARIA Roles**: Domma automatically adds `role="tablist"`, `role="tab"`, `role="tabpanel"`
- **Keyboard Navigation**: Arrow keys to move between tabs, Home/End for first/last, Enter/Space to activate
- **Focus Management**: Visible focus indicators on tabs, focus moves with arrow keys
- **Screen Readers**: Proper labelling with `aria-selected`, `aria-controls`, `aria-labelledby`
- **Tab Order**: Only active tab is in tab order (others reachable via arrow keys)
- **Disabled States**: Use `aria-disabled="true"` for disabled tabs with visual styling

### Performance

- **Lazy Loading**: Load heavy content only when tab is first activated
- **Limit Tabs**: Keep to 5-7 tabs maximum for usability; use dropdowns or accordions for more
- **Content Size**: Keep panel content reasonably sized; long content should scroll within panel
- **Destroy Unused**: Call `destroy()` when removing dynamic tab sets
- **Animation Toggle**: Disable animations (`animation: false`) for faster switching on low-end devices

### Common Gotchas

[table striped="true"]
| Issue | Solution |
| --- | --- |
| Wrong panel shows for tab | Ensure tab items and panels are in the same order. First tab item corresponds to first panel, etc. |
| Content overflows tabs | Set max-width on tab list or make tabs scrollable horizontally on mobile: `.tab-list {
                        overflow-x: auto; }` |
| Active tab not visible | When programmatically switching tabs, scroll the tab list to show active tab if it's off-screen. |
| Animation jank | Ensure panels have consistent heights or set explicit height on `.tab-content` to prevent layout shift. |
| Nested tabs conflict | Give each tab set a unique ID and initialise separately. Nested tabs work but can confuse users. |
[/table]

### Tips & Tricks

- **Deep Linking**: Use URL hash to pre-select tab: `if (location.hash ===
                    '#features') tabs.show(1);`
- **Persistent State**: Save active tab to localStorage and restore on page load
- **Validation**: In forms, validate tab content before allowing switch to next tab
- **Mobile Dropdown**: On small screens, convert tabs to dropdown for better UX
- **Smooth Transitions**: Use `animation: true` for professional feel; crossfade looks better than slide
- **Equal Width Tabs**: Use flexbox for equal-width tabs: `.tab-list { display:
                    flex; } .tab-item { flex: 1; }`

## API Reference

### Constructor Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `activeIndex` | Number | `0` | Index of initially active tab (0-based) |
| `animation` | Boolean | `true` | Enable smooth fade transitions between panels |
| `onChange` | Function | `null` | Callback fired when active tab changes: `(index, panel) => {}` |
[/table]

### Methods

[table striped="true"]
| Method | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `show(index)` | `index: Number` | this | Activates the tab at specified index (0-based) |
| `getActive()` | None | Number | Returns the index of currently active tab |
| `next()` | None | this | Activates the next tab (wraps to first if at end) |
| `prev()` | None | this | Activates the previous tab (wraps to last if at start) |
| `destroy()` | None | void | Removes event listeners and cleans up instance |
[/table]

### Events

[table striped="true"]
| Event | Parameters | Description |
| --- | --- | --- |
| `onChange` | `index: Number, panel: Element` | Fired when user or program switches to a different tab |
[/table]

### CSS Classes

[table striped="true"]
| Class | Description |
| --- | --- |
| `.tabs` | Main container for tab component |
| `.tabs-pills` | Modifier for pill-style tabs with rounded backgrounds |
| `.tabs-vertical` | Modifier for vertical (side-by-side) layout |
| `.tab-list` | Container for tab headers (ul element) |
| `.tab-item` | Individual tab header (li element) |
| `.tab-item.active` | Currently active tab header |
| `.tab-content` | Container for all tab panels |
| `.tab-panel` | Individual content panel (div element) |
| `.tab-panel.active` | Currently visible content panel |
[/table]

## Config Engine Integration

Declaratively initialise tabs using Domma's Config Engine.

### Basic Setup

```javascript
$.setup({
    '#product-tabs': {
        component: 'tabs',
        options: {
            activeIndex: 0,
            animation: true
        }
    }
});
```

### With Change Tracking

```javascript
$.setup({
    '#analytics-tabs': {
        component: 'tabs',
        options: {
            activeIndex: 0,
            animation: true,
            onChange: (index) => {
                const views = ['Today', 'Week', 'Month', 'Year'];
                console.log(`Viewing ${views[index]} analytics`);
                // Could fetch data for selected period
            }
        }
    }
});
```

### Multiple Tab Sets

```javascript
$.setup({
    '.product-tabs': {
        component: 'tabs',
        options: {
            activeIndex: 0,
            animation: true
        }
    },
    '#settings-tabs': {
        component: 'tabs',
        options: {
            activeIndex: 1,  // Start on second tab
            animation: false // No animation
        }
    }
});
```

### Demo

[showcase-demo id="showcase/elements/tabs/demo" title="Demo" /]

## CSS Customisation

Override these CSS variables to customise Tabs appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-tab-border` | `var(--dm-border)` | Tab border colour |
| `--dm-tab-hover-bg` | `var(--dm-hover-bg)` | Tab hover background |
| `--dm-tab-active-border` | `var(--dm-primary)` | Active tab bottom border colour |
| `--dm-tab-active-text` | `var(--dm-primary)` | Active tab text colour |
| `--dm-primary` | `var(--dm-blue-600)` | Primary brand colour |
[/table]

### Example Override

```css
:root {
    /* Custom active tab colour */
    --dm-tab-active-border: #16a34a;  /* Green */
    --dm-tab-active-text: #16a34a;

    /* Subtle hover */
    --dm-tab-hover-bg: rgba(0,0,0,0.02);
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

Tabs work great with these complementary components:

### Accordion

Alternative to tabs when vertical space isn't limited; all content on one page.

### Card

Wrap tab panels in cards for better visual separation and structure.

### Modal

Use tabs within modals for complex forms or multi-section content.

### Loader

Show loading states while tab content loads asynchronously.

### List Group

Use as a vertical tab-style navigation when a sidebar layout suits better than horizontal tabs.
