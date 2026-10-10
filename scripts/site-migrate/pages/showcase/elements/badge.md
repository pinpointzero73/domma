---
title: Badge
description: "Small labels that highlight counts, status, or categories - CSS-only component with multiple style variants"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Badge" tagline="Small labels that highlight counts, status, or categories - CSS-only component with multiple style variants" align="center"][/hero]

## Overview

Badges are small labels that highlight counts, status, or categories. They're perfect for notification counts, status indicators, labels, and tags. Domma's Badge is a CSS-only component with multiple style variants.

### Key Features

- **CSS-Only** - No JavaScript required
- **Colour Variants** - Primary, success, danger, warning, info styles
- **Size Options** - Small, default, and large badges
- **Pill Style** - Fully rounded corners for tags

### Basic Usage

```
<span class="badge">Default</span>
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
```

## Getting Started

Add badges to your page in two simple steps

### Step 1: Include Domma CSS

Add Domma CSS to your page:

```
<!-- CSS -->
<link rel="stylesheet" href="dist/domma.css">
<link rel="stylesheet" href="dist/elements.css">
```

### Step 2: Add Badge HTML

Use `<span>` elements with badge classes:

```
<span class="badge">Default</span>
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-danger">Urgent</span>

<!-- Small size -->
<span class="badge badge-sm badge-primary">Small</span>

<!-- Pill style for tags -->
<span class="badge badge-pill badge-info">Tag</span>
```

> **Note:** Badges are CSS-only components and require no JavaScript. Simply add the badge classes to your HTML elements. For dynamic updates (e.g., notification counts), use JavaScript to modify the badge text or visibility.

## Web Components

Domma Badge is now available as a native Web Component! Use modern `<domma-badge>` tags or the traditional wrapper API - both work identically with zero breaking changes.

### Direct Web Component Usage

Use custom HTML elements for clean, semantic markup:

[showcase-demo id="showcase/elements/badge/direct-web-component-usage" title="Direct Web Component Usage" /]

```
<domma-badge variant="primary">Primary</domma-badge>
<domma-badge variant="success">Success</domma-badge>
<domma-badge variant="danger">Danger</domma-badge>
```

### Size Variants

[showcase-demo id="showcase/elements/badge/size-variants" title="Size Variants" /]

```
<domma-badge variant="primary" size="small">Small</domma-badge>
<domma-badge variant="primary" size="medium">Medium</domma-badge>
<domma-badge variant="primary" size="large">Large</domma-badge>
```

### Pill & Outline Styles

[showcase-demo id="showcase/elements/badge/pill-and-outline-styles" title="Pill & Outline Styles" /]

```
<domma-badge variant="primary" pill>Pill Badge</domma-badge>
<domma-badge variant="success" outline>Outline</domma-badge>
<domma-badge variant="danger" pill outline>Pill Outline</domma-badge>
```

### Removable Badges

Click the × to remove:

[showcase-demo id="showcase/elements/badge/removable-badges" title="Removable Badges" /]

```
<domma-badge variant="primary" removable>JavaScript</domma-badge>
<domma-badge variant="success" removable>CSS</domma-badge>

<script>
// Listen for remove event
$('domma-badge').on('remove', (e) => {
    console.log('Badge removed!');
});
</script>
```

### Programmatic API

Web Components support dynamic updates:

[showcase-demo id="showcase/elements/badge/programmatic-api" title="Programmatic API" /]

```
const badge = $('domma-badge')[0];

// Update variant
badge.setVariant('success');

// Update text
badge.setText('Updated!');

// Update size
badge.setSize('large');

// Chain methods
badge.setVariant('danger').setText('Error!').setSize('small');
```

### Wrapper API (Backwards Compatible)

Existing code continues to work unchanged! The wrapper API uses Web Components internally:

[showcase-demo id="showcase/elements/badge/wrapper-api-backwards-compatible" title="Wrapper API (Backwards Compatible)" /]

```
// Traditional approach - still works!
const badge = Domma.elements.badge('#my-badge', {
    variant: 'success',
    size: 'large',
    pill: true,
    removable: true
});

// Same API as before
badge.setVariant('danger');
badge.setText('Updated!');
badge.destroy();
```

> **💡 Benefits of Web Components:**  **Encapsulation** - Styles and behaviour isolated via Shadow DOM **Reusability** - Use anywhere without framework dependencies **Standards-based** - Native browser API, future-proof **Backwards Compatible** - Existing code works without changes

## Quick Start

### Simple Badge

[showcase-demo id="showcase/elements/badge/simple-badge" title="Simple Badge" /]

```
<span class="badge badge-primary">New</span>
<span class="badge badge-success">Active</span>
<span class="badge badge-danger">Urgent</span>
```

## Tutorial

Build a notification indicator with dynamic badge count.

[showcase-demo id="showcase/elements/badge/tutorial" title="Tutorial" /]

```
<div class="flex items-center justify-between">
    <h3>Notifications</h3>
    <span class="badge badge-danger">3</span>
</div>

<script>
const badge = $('.badge')[0];
let count = 3;

$('#clear-btn').on('click', () => {
    count = 0;
    badge.textContent = count;
    if (count === 0) {
        badge.style.display = 'none';
    }
});
</script>
```

## Examples

### Colour Variants

[showcase-demo id="showcase/elements/badge/colour-variants" title="Colour Variants" /]

### Sizes

[showcase-demo id="showcase/elements/badge/sizes" title="Sizes" /]

### Pill Style

[showcase-demo id="showcase/elements/badge/pill-style" title="Pill Style" /]

### In Buttons

[showcase-demo id="showcase/elements/badge/in-buttons" title="In Buttons" /]

### Status Indicators

[showcase-demo id="showcase/elements/badge/status-indicators" title="Status Indicators" /]

### Category Tags

[showcase-demo id="showcase/elements/badge/category-tags" title="Category Tags" /]

## Best Practices

### Accessibility

- **Descriptive Text** - Use clear, meaningful badge text
- **Colour Independence** - Don't rely solely on colour to convey meaning
- **ARIA Labels** - Add `aria-label` for icon-only or number badges

### Design Guidelines

- **Consistent Meaning** - Use colour variants consistently (red for errors/urgent, green for success/active)
- **Appropriate Size** - Match badge size to surrounding content
- **Limit Usage** - Don't overuse badges; they lose impact when too common
- **Pill vs Default** - Use pills for tags/categories, default for counts/status

### Common Use Cases

- **Notification Counts** - Unread messages, pending tasks
- **Status Indicators** - Online/offline, active/inactive
- **Category Tags** - Content classification, filtering
- **Labels** - New features, beta status, version numbers

## CSS Classes

[table striped="true"]
| Class | Description |
| --- | --- |
| `.badge` | Base badge class (required) |
| `.badge-primary` | Primary colour variant |
| `.badge-success` | Success/green variant |
| `.badge-danger` | Danger/red variant |
| `.badge-warning` | Warning/yellow variant |
| `.badge-info` | Info/blue variant |
| `.badge-light` | Light background variant |
| `.badge-dark` | Dark background variant |
| `.badge-sm` | Small size |
| `.badge-lg` | Large size |
| `.badge-pill` | Fully rounded corners |
[/table]

## Config Engine

Badges are CSS-only, but you can dynamically update them:

```
$.setup({
    '#notification-badge': {
        initial: {
            text: '0',
            css: { display: 'none' }
        },
        events: {
            // Update badge when notifications change
        }
    }
});

// Dynamic update
function updateBadge(count) {
    const $badge = $('#notification-badge');
    $badge.text(count);
    $badge.css('display', count > 0 ? 'inline-block' : 'none');
}
```

## CSS Customisation

Override these CSS variables to customise Badge appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-primary` | `var(--dm-blue-600)` | Primary badge colour |
| `--dm-success` | `var(--dm-green-600)` | Success badge colour |
| `--dm-danger` | `var(--dm-red-600)` | Danger badge colour |
| `--dm-radius-full` | `9999px` | Badge shape (pill) |
[/table]

### Example Override

```css
:root {
    /* Square badges */
    --dm-radius-full: 0.25rem;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/badge/related-elements" title="Related Elements" /]
