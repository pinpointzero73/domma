---
title: Back to Top
description: "Floating button that appears when scrolling, allowing quick return to the page top"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Back to Top" tagline="Floating button that appears when scrolling, allowing quick return to the page top" align="center"][/hero]

## Overview

Back to Top provides a floating button that appears when users scroll down, allowing quick return to the page top. Perfect for long pages, documentation, and content-heavy sites.

### Key Features

- **Auto Show/Hide** - Appears after scrolling threshold
- **Smooth Scrolling** - Configurable animation duration
- **Positioning** - Bottom-right, bottom-left, or custom
- **Callbacks** - onShow and onHide events

### Basic Usage

```
const backToTop = Domma.elements.backToTop('#back-to-top', {
    showAfter: 300,
    duration: 600,
    position: 'bottom-right'
});
```

## Getting Started

Add a back to top button to your page in three simple steps

### Step 1: Add Button Element

Create a button element with a class and unique ID:

```
<button id="back-to-top" class="back-to-top-btn">↑</button>
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

### Step 3: Initialize the Button

Call `Domma.elements.backToTop()` to activate the button:

```
Domma.elements.backToTop('#back-to-top', {
    showAfter: 300,   // Show after scrolling 300px
    duration: 500     // Scroll animation duration in ms
});
```

> **Note:** The back to top button automatically shows/hides based on scroll position and smoothly animates scrolling to the top when clicked. The component handles all scroll event listeners and positioning.

## Quick Start

### Simple Back to Top Button

[showcase-demo id="showcase/elements/back-to-top/simple-back-to-top-button" title="Simple Back to Top Button" /]

```
<button id="back-to-top" class="back-to-top-btn">↑</button>

<script>
Domma.elements.backToTop('#back-to-top', {
    showAfter: 200,
    duration: 500
});
</script>
```

## Native Web Component

> **Modern Standard:** BackToTop is now available as a native Web Component with Shadow DOM encapsulation. Use either the traditional API (above) or the native `<domma-back-to-top>` tag below for better style isolation and framework compatibility.

### Native Tag Syntax

Use the native `<domma-back-to-top>` Web Component directly in HTML with attributes for configuration:

```
<!-- Basic Web Component -->
<domma-back-to-top></domma-back-to-top>

<!-- Configured Web Component -->
<domma-back-to-top
    show-after="400"
    duration="500"
    position="bottom-left"
    offset="20"
></domma-back-to-top>

<!-- With Scroll Container -->
<domma-back-to-top
    target="#scrollable-content"
    show-after="300"
></domma-back-to-top>
```

### Live Web Component Demo

[showcase-demo id="showcase/elements/back-to-top/live-web-component-demo" title="Live Web Component Demo" /]

### Available Attributes

[table striped="true"]
| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `show-after` | Number | viewport height | Pixels to scroll before showing |
| `duration` | Number | `300` | Scroll animation duration in ms |
| `position` | String | `'bottom-right'` | Position: bottom-right, bottom-left |
| `offset` | Number | `16` | Distance from screen edge in px |
| `target` | String | `window` | CSS selector for scroll container |
| `z-index` | Number | `1000` | Z-index for stacking context |
| `visible` | Boolean | `false` | Initial visibility state |
[/table]

### JavaScript API

Access the Web Component instance and call methods programmatically:

```
// Get the Web Component element
const btn = $('domma-back-to-top')[0];

// Call methods
btn.scroll();              // Scroll to top
btn.show();                // Show button immediately
btn.hide();                // Hide button
btn.toggle();              // Toggle visibility
btn.isVisible();           // Check visibility → boolean
btn.getButton();           // Get button element

// Update attributes programmatically
btn.setShowAfter(500);     // Change threshold
btn.setPosition('bottom-left'); // Change position
btn.setOffset(24);         // Change offset

// Listen for events
btn.addEventListener('show', (e) => {
    console.log('Button appeared');
});

btn.addEventListener('hide', (e) => {
    console.log('Button hidden');
});
```

### Reactive Attributes Demo

[showcase-demo id="showcase/elements/back-to-top/reactive-attributes-demo" title="Reactive Attributes Demo" /]

### Event Handling

```
<domma-back-to-top id="my-btn"></domma-back-to-top>

<script>
const btn = $('#my-btn')[0];

// Listen for show event
btn.addEventListener('show', (e) => {
    console.log('Button became visible');
    $('#status')[0].textContent = 'Visible';
});

// Listen for hide event
btn.addEventListener('hide', (e) => {
    console.log('Button became hidden');
    $('#status')[0].textContent = 'Hidden';
});
</script>
```

### Benefits of Web Components

> **Shadow DOM Isolation:** Styles don't leak in or out **Native Browser API:** No framework required **Reactive Attributes:** Changes update automatically **Framework Agnostic:** Works with React, Vue, Angular, Svelte **Custom Events:** Standard DOM event system **Backwards Compatible:** Traditional API still available

### Using with Frameworks

### React

```
import { useRef, useEffect } from 'react';

function MyComponent() {
    const btnRef = useRef(null);

    useEffect(() => {
        const btn = btnRef.current;

        const handleShow = () => console.log('Visible');
        btn.addEventListener('show', handleShow);

        return () => btn.removeEventListener('show', handleShow);
    }, []);

    return <domma-back-to-top ref={btnRef} show-after="300" />;
}
```

### Vue

```
<template>
    <domma-back-to-top
        ref="backToTop"
        :show-after="300"
        :duration="500"
        @show="onShow"
        @hide="onHide"
    ></domma-back-to-top>
</template>

<script>
export default {
    methods: {
        onShow() { console.log('Visible'); },
        onHide() { console.log('Hidden'); }
    },
    mounted() {
        this.$refs.backToTop.scroll();
    }
};
</script>
```

### Angular

```
import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-my-component',
    template: `
        <domma-back-to-top
            #backToTop
            show-after="300"
            (show)="onShow()"
            (hide)="onHide()"
        ></domma-back-to-top>
    `
})
export class MyComponent {
    @ViewChild('backToTop') backToTop!: ElementRef;

    onShow() { console.log('Visible'); }
    onHide() { console.log('Hidden'); }

    scrollToTop() {
        this.backToTop.nativeElement.scroll();
    }
}
```

### CSS Part Customization

Customize Web Component styles using CSS `::part()` selectors:

```
/* Target the button inside Shadow DOM */
domma-back-to-top::part(button) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    width: 50px;
    height: 50px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

domma-back-to-top::part(button):hover {
    transform: translateY(-2px) scale(1.15);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}
```

## Tutorial

Build a back to top button with custom styling and callbacks.

[showcase-demo id="showcase/elements/back-to-top/tutorial" title="Tutorial" /]

```
const backToTop = Domma.elements.backToTop('#back-to-top', {
    showAfter: 300,
    duration: 600,
    position: 'bottom-right',
    offset: { bottom: 20, right: 20 },
    target: '#scrollable-container',
    onShow: () => {
        console.log('Button shown');
        $('#status')[0].textContent = 'Visible';
    },
    onHide: () => {
        console.log('Button hidden');
        $('#status')[0].textContent = 'Hidden';
    }
});
```

## Examples

### Different Positions

[showcase-demo id="showcase/elements/back-to-top/different-positions" title="Different Positions" /]

### Custom Duration

[showcase-demo id="showcase/elements/back-to-top/custom-duration" title="Custom Duration" /]

### Programmatic Control

[showcase-demo id="showcase/elements/back-to-top/programmatic-control" title="Programmatic Control" /]

## Best Practices

### Accessibility

- **Keyboard Access** - Ensure button is keyboard focusable
- **ARIA Label** - Add `aria-label="Back to top"` for screen readers
- **Focus Visibility** - Provide clear focus indicator

### UX Guidelines

- **Threshold** - Show after 200-400px scroll for optimal UX
- **Positioning** - Bottom-right is conventional, but avoid blocking content
- **Animation Duration** - 400-800ms provides smooth but quick scrolling
- **Visual Clarity** - Use clear up arrow (↑) or icon

### Performance

- **Throttle Scroll Events** - Component automatically throttles scroll listeners
- **Destroy When Done** - Call `destroy()` on single-page apps when navigating

## API Reference

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `showAfter` | Number | `300` | Scroll pixels before showing button |
| `duration` | Number | `500` | Scroll animation duration (ms) |
| `position` | String | `'bottom-right'` | Position: bottom-right, bottom-left |
| `offset` | Object | `{ bottom: 20, right: 20 }` | Offset from edges (px) |
| `target` | String/Element | `window` | Scroll target (default: window) |
| `onShow` | Function | `null` | Show callback |
| `onHide` | Function | `null` | Hide callback |
[/table]

### Methods

[table striped="true"]
| Method | Parameters | Description |
| --- | --- | --- |
| `scroll(duration)` | duration (optional) | Scroll to top with optional custom duration |
| `show()` | - | Show button immediately |
| `hide()` | - | Hide button immediately |
| `toggle()` | - | Toggle button visibility |
| `isVisible()` | - | Check if button is visible |
| `getButton()` | - | Get button element |
| `destroy()` | - | Remove button and clean up |
[/table]

## Config Engine

```
$.setup({
    '#back-to-top': {
        component: 'backToTop',
        options: {
            showAfter: 400,
            duration: 600,
            position: 'bottom-right',
            onShow: () => console.log('Button appeared'),
            onHide: () => console.log('Button hidden')
        }
    }
});
```

## CSS Customisation

Override these CSS variables to customise Back-to-Top appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-primary` | `var(--dm-blue-600)` | Button background colour |
| `--dm-primary-hover` | `var(--dm-blue-700)` | Button hover colour |
| `--dm-radius-full` | `9999px` | Button shape (circular) |
| `--dm-shadow-md` | `0 4px 6px...` | Button shadow |
[/table]

### Example Override

```css
:root {
    /* Square button */
    --dm-radius-full: 0.5rem;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/back-to-top/related-elements" title="Related Elements" /]
