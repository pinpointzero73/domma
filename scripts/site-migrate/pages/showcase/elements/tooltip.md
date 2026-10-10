---
title: Tooltip
description: "Display contextual information on hover, focus, or click with smart positioning and auto-adjustment"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Tooltip" tagline="Display contextual information on hover, focus, or click with smart positioning and auto-adjustment" align="center"][/hero]

## Overview

Tooltips display contextual information when users hover over, focus on, or click an element. They're perfect for providing hints, definitions, or additional context without cluttering the interface.

### Key Features

- **Multiple Triggers** - Hover, click, or focus activation
- **Positioning** - Top, bottom, left, or right placement
- **Show Delay** - Configurable delay before display
- **Animations** - Smooth fade-in transitions
- **Dynamic Content** - Update tooltip text on the fly
- **Auto-positioning** - Smart placement to avoid viewport edges

### Basic Usage

```
const tooltip = Domma.elements.tooltip('#my-button', {
    content: 'Helpful information here',
    position: 'top',
    trigger: 'hover',
    delay: 200
});
```

## Getting Started

Add tooltips to your elements in three simple steps

### Step 1: Add HTML Element

Create any HTML element that will trigger the tooltip:

```
<button id="my-button" class="btn btn-primary">Hover Me</button>
<span id="help-icon">?</span>
<a id="info-link" href="#">Learn more</a>
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

### Step 3: Initialize the Tooltip

Call `Domma.elements.tooltip()` to attach a tooltip:

```
// Hover tooltip
Domma.elements.tooltip('#my-button', {
    content: 'Helpful information appears here',
    position: 'top',       // 'top', 'bottom', 'left', 'right'
    trigger: 'hover',      // 'hover', 'click', 'focus'
    delay: 200             // Delay before showing (ms)
});

// Click tooltip with HTML content
Domma.elements.tooltip('#help-icon', {
    content: '<strong>Tip:</strong> Click to continue',
    trigger: 'click',
    position: 'bottom'
});
```

> **Note:** The tooltip auto-generates and positions the tooltip popup (no HTML required). Tooltips intelligently adjust position if near viewport edges. Use `setContent()` to update tooltip text dynamically.

## Web Components

Domma Tooltip is now available as a native Web Component! Use modern `<domma-tooltip>` tags or the traditional wrapper API - both work identically with zero breaking changes.

### Direct Web Component Usage

Wrap trigger elements in `<domma-tooltip>` tags:

[showcase-demo id="showcase/elements/tooltip/direct-web-component-usage" title="Direct Web Component Usage" /]

```
<domma-tooltip content="Top tooltip" position="top">
    <button class="btn btn-primary">Top</button>
</domma-tooltip>

<domma-tooltip content="Bottom tooltip" position="bottom">
    <button class="btn btn-primary">Bottom</button>
</domma-tooltip>
```

### Trigger Types

[showcase-demo id="showcase/elements/tooltip/trigger-types" title="Trigger Types" /]

```
<domma-tooltip content="Hover trigger" trigger="hover">
    <button>Hover</button>
</domma-tooltip>

<domma-tooltip content="Click trigger" trigger="click">
    <button>Click</button>
</domma-tooltip>

<domma-tooltip content="Focus trigger" trigger="focus">
    <input type="text" placeholder="Focus me">
</domma-tooltip>
```

### Delay Configuration

Control show and hide delays:

[showcase-demo id="showcase/elements/tooltip/delay-configuration" title="Delay Configuration" /]

```
<domma-tooltip content="Instant" delay="0">
    <button>No Delay</button>
</domma-tooltip>

<domma-tooltip content="Delayed" delay="500" hide-delay="300">
    <button>With Delays</button>
</domma-tooltip>
```

### Programmatic API

Web Components support dynamic updates:

[showcase-demo id="showcase/elements/tooltip/programmatic-api" title="Programmatic API" /]

```
const tooltip = $('domma-tooltip')[0];

// Update content
tooltip.setContent('New tooltip text!');

// Update position
tooltip.setPosition('bottom');

// Show/hide programmatically
tooltip.show();
tooltip.hide();
tooltip.toggle();

// Check visibility
if (tooltip.isVisible()) {
    console.log('Tooltip is showing');
}
```

### Wrapper API (Backwards Compatible)

Existing code continues to work unchanged! The wrapper API uses Web Components internally:

[showcase-demo id="showcase/elements/tooltip/wrapper-api-backwards-compatible" title="Wrapper API (Backwards Compatible)" /]

```
// Traditional approach - still works!
const tooltip = Domma.elements.tooltip('#my-element', {
    content: 'Helpful information here',
    position: 'top',
    trigger: 'hover',
    delay: 200
});

// Same API as before
tooltip.show();
tooltip.hide();
tooltip.setContent('Updated text');
tooltip.destroy();
```

> **💡 Benefits of Web Components:**  **Encapsulation** - Tooltip styles isolated via Shadow DOM **Smart Positioning** - Auto-adjusts to avoid viewport edges **Standards-based** - Native browser API, future-proof **Backwards Compatible** - Existing code works without changes

## Quick Start

### Hover Tooltip

[showcase-demo id="showcase/elements/tooltip/hover-tooltip" title="Hover Tooltip" /]

```
Domma.elements.tooltip('#button', {
    content: 'This appears on hover',
    position: 'top'
});
```

## Tutorial

Build a form with helpful tooltips on input fields.

[showcase-demo id="showcase/elements/tooltip/tutorial" title="Tutorial" /]

```
Domma.elements.tooltip('#username-help', {
    content: 'Username must be 3-20 characters',
    position: 'right',
    trigger: 'hover'
});

Domma.elements.tooltip('#password-help', {
    content: 'Password must be at least 8 characters',
    position: 'right',
    trigger: 'hover'
});
```

## Examples

### Positioning Options

[showcase-demo id="showcase/elements/tooltip/positioning-options" title="Positioning Options" /]

### Trigger Types

[showcase-demo id="showcase/elements/tooltip/trigger-types-2" title="Trigger Types" /]

### Dynamic Content

[showcase-demo id="showcase/elements/tooltip/dynamic-content" title="Dynamic Content" /]

## Best Practices

### Accessibility

- **Keyboard Access** - Use focus trigger for keyboard users
- **ARIA Labels** - Add aria-describedby linking to tooltip
- **Don't Hide Critical Info** - Essential information shouldn't require tooltip interaction

### Performance

- **Reuse Instances** - Don't recreate tooltips on every interaction
- **Delay Hover** - Use 200ms+ delay to avoid accidental triggers

## API Reference

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | String | `''` | Tooltip text content |
| `position` | String | `'top'` | Position: top, bottom, left, right |
| `trigger` | String | `'hover'` | Trigger: hover, click, focus |
| `delay` | Number | `0` | Show delay in milliseconds |
| `animation` | Boolean | `true` | Enable fade animation |
[/table]

### Methods

[table striped="true"]
| Method | Description |
| --- | --- |
| `show()` | Show tooltip immediately |
| `hide()` | Hide tooltip immediately |
| `toggle()` | Toggle tooltip visibility |
| `setContent(text)` | Update tooltip text |
| `destroy()` | Remove tooltip and clean up |
[/table]

## Config Engine

```
$.setup({
    '#help-icon': {
        component: 'tooltip',
        options: {
            content: 'Click for help documentation',
            position: 'right',
            trigger: 'hover'
        }
    }
});
```

## CSS Customisation

Override these CSS variables to customise Tooltip appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-slate-900` | `#0f172a` | Tooltip background |
| `--dm-radius-md` | `0.375rem` | Tooltip corner radius |
| `--dm-font-size-sm` | `0.875rem` | Tooltip text size |
| `--dm-text-inverse` | `var(--dm-white)` | Tooltip text colour |
[/table]

### Example Override

```css
/* Light tooltip - override inline or create custom class */
.tooltip-light {
    background: #f9fafb;
    color: #1f2937;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/tooltip/related-elements" title="Related Elements" /]
