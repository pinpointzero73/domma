---
title: Timeline Component
description: "Data-driven timelines with multiple layouts and animations"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Timeline Component" tagline="Data-driven timelines with multiple layouts and animations" align="center"][/hero]

> ⚠️ Component Deprecated  The `timeline()` component has been superseded by the new unified **Progression** component, which combines Timeline and Roadmap functionality.   **Good news:** Your existing timeline code continues to work! The `timeline()` method is now an alias for `progression({ mode: 'timeline' })`.   [View Progression Component →](/showcase/elements/progression)

## Getting Started

Add a timeline to your page in three simple steps

### Step 1: Add Container Element

Create a container div for the timeline:

```
<div id="my-timeline"></div>
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

### Step 3: Initialize the Timeline

Call `Domma.elements.progression()` in `timeline` mode with your timeline data:

```
// Prepare your timeline data
const events = [
    {
        year: '2020',
        title: 'Project Start',
        description: 'Initial planning began'
    },
    {
        year: '2021',
        title: 'Beta Release',
        description: 'First public beta with core features'
    },
    {
        year: '2022',
        title: 'Version 1.0',
        description: 'Stable release'
    }
];

// Initialize the timeline
Domma.elements.progression('#my-timeline', {
    mode: 'timeline',
    items: events,           // Timeline data array
    layout: 'vertical',      // 'vertical' or 'centered'
    animation: true,         // Animate items on scroll
    animationDelay: 100      // Delay between items (ms)
});
```

> **Note:** The timeline auto-generates the complete UI from your data array (no HTML structure required). Each item needs at least a `title`. Optional fields include `year`, `description`, `icon`, and `image`.

## basic-timeline

A simple vertical timeline with data-driven content and smooth animations.

[showcase-demo id="showcase/elements/timeline/basic-timeline" title="basic-timeline" /]

```javascript
// JavaScript
const timelineData = [
    { year: '2020', title: 'Project Start', description: 'Initial planning and development began' },
    { year: '2021', title: 'Beta Release', description: 'First public beta with core features' },
    { year: '2022', title: 'Version 1.0', description: 'Stable release with full feature set' },
    { year: '2023', title: 'Major Update', description: 'Added new components and improved performance' }
];

Domma.elements.progression('#basic-timeline', {
    mode: 'timeline',
    items: timelineData,
    animation: true,
    animationDelay: 100
});
```

## centered-timeline

A centered timeline layout with items alternating on both sides of a central line.

[showcase-demo id="showcase/elements/timeline/centered-timeline" title="centered-timeline" /]

```javascript
Domma.elements.progression('#centered-timeline', {
    mode: 'timeline',
    items: companyHistory,
    layout: 'centered',
    animation: true,
    theme: 'default'
});
```

## horizontal-timeline

A horizontal scrollable timeline perfect for mobile devices or constrained layouts.

[showcase-demo id="showcase/elements/timeline/horizontal-timeline" title="horizontal-timeline" /]

```javascript
Domma.elements.progression('#horizontal-timeline', {
    mode: 'timeline',
    items: projectMilestones,
    layout: 'horizontal',
    animation: true,
    animationDelay: 150
});
```

## theme-variants

Different visual themes for various design contexts.

[showcase-demo id="showcase/elements/timeline/theme-variants" title="theme-variants" /]

```javascript
// Minimal theme
Domma.elements.progression('#minimal-timeline', {
    mode: 'timeline',
    items: shortData,
    theme: 'minimal',
    animation: true
});

// Corporate theme
Domma.elements.progression('#corporate-timeline', {
    mode: 'timeline',
    items: shortData,
    theme: 'corporate',
    animation: true
});
```

## interactive-timeline

A clickable timeline with event handling and dynamic updates.

[showcase-demo id="showcase/elements/timeline/interactive-timeline" title="interactive-timeline" /]

```javascript
const timeline = Domma.elements.progression('#interactive-timeline', {
    mode: 'timeline',
    items: interactiveData,
    clickable: true,
    onItemClick: (item, index, element) => {
        $('#click-output').show().html(
            `Clicked: ${item.title} (${item.year})`
        );
    }
});

// Add new item
$('#add-item').on('click', () => {
    const newItem = {
        year: '2026',
        title: 'Future Update',
        description: 'Exciting new features coming soon!'
    };
    timeline.addItem(newItem);
});

// Toggle layout
let isVertical = true;
$('#change-layout').on('click', () => {
    timeline.setLayout(isVertical ? 'horizontal' : 'vertical');
    isVertical = !isVertical;
});
```

## api-reference

### Constructor

Domma.elements.progression(selector, {mode: 'timeline', ...})

Creates a new timeline instance. `Domma.elements.timeline(selector, options)` remains as a deprecated alias for exactly this call, so existing code keeps working - it logs a deprecation warning.

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | Array | `[]` | Array of timeline item objects |
| `layout` | String | `'vertical'` | Layout type: 'vertical', 'horizontal', 'centered' |
| `animation` | Boolean | `true` | Enable entrance animations |
| `animationDelay` | Number | `100` | Delay between item animations (ms) |
| `theme` | String | `'default'` | Visual theme: 'default', 'minimal', 'corporate' |
| `clickable` | Boolean | `false` | Enable click events on timeline items |
| `onItemClick` | Function | `null` | Callback for item clicks: (item, index, element) |
[/table]

### Methods

setItems(items)

Replace all timeline items with new data.

addItem(item)

Add a single item to the end of the timeline.

getItems()

Get a copy of all timeline items.

setLayout(layout)

Change the timeline layout: 'vertical', 'horizontal', 'centered'.

refresh()

Re-render the timeline with current data and settings.

### Item Object Structure

```javascript
{
    year: '2024',           // String - displayed in the year badge
    title: 'Event Title',   // String - main heading
    description: '...'      // String - descriptive text
}
```

## CSS Customisation

Override these CSS variables to customise Timeline appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-primary` | `var(--dm-blue-600)` | Timeline line/marker colour |
| `--dm-surface` | `var(--dm-white)` | Event card background |
| `--dm-border` | `var(--dm-slate-300)` | Event card border |
[/table]

### Example Override

```css
:root {
    /* Custom timeline accent */
    --dm-primary: #8b5cf6;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)
