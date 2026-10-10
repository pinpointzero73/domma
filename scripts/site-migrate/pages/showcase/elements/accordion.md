---
title: Accordion
description: "Organize content into collapsible sections, perfect for FAQs, product details, and navigation menus"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Accordion" tagline="Organize content into collapsible sections, perfect for FAQs, product details, and navigation menus" align="center"][/hero]

## Overview

Accordions organize content into collapsible sections, perfect for FAQs, product details, and navigation menus.

### Key Features

- **Single/Multi Expand** - Control how many panels can be open
- **Smooth Animations** - Configurable slide transitions
- **Programmatic Control** - Open, close, toggle panels via API

```
const accordion = Domma.elements.accordion('#accordion', {
    multiExpand: false,
    activeIndex: 0
});
```

## Getting Started

Add an accordion to your page in three simple steps

### Step 1: Add HTML Structure

Create the accordion HTML with `.accordion` container and `.accordion-item` elements:

```
<div id="my-accordion" class="accordion">
    <div class="accordion-item">
        <div class="accordion-header">
            <span>Section 1</span>
            <span class="accordion-icon">&#9660;</span>
        </div>
        <div class="accordion-body">
            <div class="accordion-content">Content here</div>
        </div>
    </div>
    <div class="accordion-item">
        <div class="accordion-header">
            <span>Section 2</span>
            <span class="accordion-icon">&#9660;</span>
        </div>
        <div class="accordion-body">
            <div class="accordion-content">More content</div>
        </div>
    </div>
</div>
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

### Step 3: Initialize the Accordion

Call `Domma.elements.accordion()` to activate the accordion:

```
Domma.elements.accordion('#my-accordion', {
    multiExpand: false,  // Only one panel open at a time
    activeIndex: 0       // First panel open by default
});
```

> **Note:** The accordion requires the HTML structure above. The JavaScript adds interactivity, animations, and programmatic control.

## Quick Start

[showcase-demo id="showcase/elements/accordion/quick-start" title="Quick Start" /]

## Examples

### FAQ Accordion (Single Expand)

[showcase-demo id="showcase/elements/accordion/faq-accordion-single-expand" title="FAQ Accordion (Single Expand)" /]

### Multi-Expand Mode

[showcase-demo id="showcase/elements/accordion/multi-expand-mode" title="Multi-Expand Mode" /]

## Best Practices

- **Accessibility** - Use semantic HTML, ARIA attributes for screen readers
- **Clear Headers** - Make accordion headers descriptive and actionable
- **Initial State** - Consider opening first panel by default for discoverability

## API Reference

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `multiExpand` | Boolean | `false` | Allow multiple panels open |
| `animation` | Boolean | `true` | Enable animations |
| `activeIndex` | Number/Array | `null` | Initially open panel(s) |
| `onChange` | Function | `null` | Panel change callback |
[/table]

### Methods

[table striped="true"]
| Method | Description |
| --- | --- |
| `open(index)` | Open panel by index |
| `close(index)` | Close panel by index |
| `toggle(index)` | Toggle panel |
| `openAll()` | Open all panels |
| `closeAll()` | Close all panels |
[/table]

## Declarative Configuration

Use Domma's config engine for declarative accordion setup with `$.setup()`. This approach is cleaner, more maintainable, and allows you to configure multiple components at once.

### Single Accordion Setup

```javascript
$.setup({
    '#my-accordion': {
        component: 'accordion',
        options: {
            multiExpand: false,
            activeIndex: 0,
            animation: 'slide'
        }
    }
});
```

### Multiple Accordions at Once

```javascript
// Configure all FAQ accordions site-wide
$.setup({
    '.faq-accordion': {
        component: 'accordion',
        options: {
            multiExpand: false,
            activeIndex: 0
        },
        events: {
            // Add click tracking
            change: (index, $item, instance) => {
                console.log(`FAQ ${index + 1} opened`);
            }
        }
    },
    '#settings-accordion': {
        component: 'accordion',
        options: {
            multiExpand: true  // Allow multiple sections open
        }
    }
});
```

### With Initial State & Events

```javascript
$.setup({
    '#product-details': {
        component: 'accordion',
        options: {
            activeIndex: 0,
            onChange: (index) => {
                // Track which section users view
                analytics.track('Product Section Viewed', {
                    section: ['specs', 'reviews', 'shipping'][index]
                });
            }
        },
        initial: {
            // Apply additional styling
            css: {
                border: '1px solid #e0e0e0',
                borderRadius: '8px'
            }
        }
    }
});
```

### Benefits of Declarative Config

- **Centralized Configuration** - All component setup in one place
- **Easier Maintenance** - Update options without touching HTML
- **Batch Operations** - Configure multiple components at once
- **Mutable Config** - Update with `$.update()`, query with `$.config()`, reset with `$.reset()`

### Programmatic vs Declarative

Programmatic (Traditional)

```javascript
// Scattered throughout code
const acc1 = Domma.elements.accordion(
    '#accordion-1',
    {multiExpand: false}
);

const acc2 = Domma.elements.accordion(
    '#accordion-2',
    {multiExpand: true}
);
```

Declarative (Recommended)

```javascript
// Clean, centralized config
$.setup({
    '#accordion-1': {
        component: 'accordion',
        options: {multiExpand: false}
    },
    '#accordion-2': {
        component: 'accordion',
        options: {multiExpand: true}
    }
});
```

## CSS Customisation

Override these CSS variables to customise Accordion appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-accordion-border` | `var(--dm-border)` | Accordion border colour |
| `--dm-accordion-header-hover` | `var(--dm-hover-bg)` | Header hover background |
| `--dm-radius-lg` | `0.5rem` | Accordion corner radius |
| `--dm-primary` | `var(--dm-blue-600)` | Active item indicator colour |
[/table]

### Example Override

```css
:root {
    /* Borderless accordion */
    --dm-accordion-border: transparent;
    --dm-accordion-header-hover: rgba(0,0,0,0.02);
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/accordion/related-elements" title="Related Elements" /]
