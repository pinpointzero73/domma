---
title: Carousel
description: "Display rotating images or content with navigation arrows, indicators, and optional autoplay"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Carousel" tagline="Display rotating images or content with navigation arrows, indicators, and optional autoplay" align="center"][/hero]

## Overview

Carousels display rotating images or content with navigation arrows, indicators, and optional autoplay.

### Key Features

- **Autoplay** - Automatic slide advancement with configurable interval
- **Navigation** - Arrow buttons and dot indicators
- **Animations** - Slide or fade transitions
- **Loop Mode** - Continuous cycling through slides

```
const carousel = Domma.elements.carousel('#carousel', {
    autoplay: true,
    interval: 5000,
    loop: true
});
```

## Getting Started

Add a carousel to your page in three simple steps

### Step 1: Add HTML Structure

Create the carousel HTML with `.carousel` container and slides:

```
<div id="my-carousel" class="carousel">
    <div class="carousel-track">
        <div class="carousel-slide">
            <img src="slide1.jpg" alt="Slide 1">
        </div>
        <div class="carousel-slide">
            <img src="slide2.jpg" alt="Slide 2">
        </div>
        <div class="carousel-slide">
            <img src="slide3.jpg" alt="Slide 3">
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

### Step 3: Initialize the Carousel

Call `Domma.elements.carousel()` to activate the carousel:

```
Domma.elements.carousel('#my-carousel', {
    autoplay: true,      // Auto-advance slides
    interval: 5000,      // 5 seconds between slides
    loop: true,          // Loop back to start
    showArrows: true,    // Show navigation arrows
    showIndicators: true // Show dot indicators
});
```

> **Note:** The carousel requires the HTML structure above. The JavaScript adds navigation controls (arrows and indicators), autoplay functionality, and smooth transitions between slides.

## Quick Start

[showcase-demo id="showcase/elements/carousel/quick-start" title="Quick Start" /]

## Examples

### With Autoplay

[showcase-demo id="showcase/elements/carousel/with-autoplay" title="With Autoplay" /]

## Transitions

Three transition modes are available via the `animation` option, and any CSS timing function can be supplied via `animationEasing`.

### Fade

Active slide opacity drops to zero before the incoming slide fades in - a clean swap with no overlap.

[showcase-demo id="showcase/elements/carousel/fade" title="Fade" /]

```
Domma.elements.carousel('#fade-carousel', {
    animation: 'fade',
    animationDuration: 900,
    autoplay: true,
    interval: 4000,
    pauseOnHover: true
});
```

### Crossfade

Outgoing and incoming slides transition opacity *at the same time*, briefly overlapping. Softer, more cinematic - particularly good for hero imagery and feature reels.

[showcase-demo id="showcase/elements/carousel/crossfade" title="Crossfade" /]

```
Domma.elements.carousel('#crossfade-carousel', {
    animation: 'crossfade',
    animationDuration: 1400,
    animationEasing: 'ease-in-out',
    autoplay: true,
    interval: 4500,
    pauseOnHover: true
});
```

### Custom Easing

Any CSS timing function works - `'linear'`, `'ease-in-out'`, `'cubic-bezier(...)'`. Here the slide overshoots then settles, courtesy of a bouncy cubic-bezier.

[showcase-demo id="showcase/elements/carousel/custom-easing" title="Custom Easing" /]

```
Domma.elements.carousel('#easing-carousel', {
    animation: 'slide',
    animationDuration: 900,
    animationEasing: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)'
});
```

> **When to choose what:** `slide` for photo galleries where motion implies sequence; `fade` for content slides where motion would distract; `crossfade` for hero imagery where the overlap reads as polish.

## Best Practices

- **Accessibility** - Provide alt text for images, pause controls
- **Performance** - Optimize images, lazy load off-screen slides
- **Mobile** - Ensure touch swipe gestures work properly

## API Reference

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `autoplay` | Boolean | `false` | Auto-advance slides |
| `interval` | Number | `5000` | Autoplay interval (ms) |
| `loop` | Boolean | `true` | Loop to beginning |
| `animation` | String | `'slide'` | `'slide'`, `'fade'`, or `'crossfade'` |
| `animationDuration` | Number | `500` | Transition duration in milliseconds |
| `animationEasing` | String | `'ease'` | Any CSS timing function (`'ease'`, `'linear'`, `'ease-in-out'`, `'cubic-bezier(...)'`) |
[/table]

### Methods

[table striped="true"]
| Method | Description |
| --- | --- |
| `next()` | Go to next slide |
| `prev()` | Go to previous slide |
| `goTo(index)` | Go to specific slide |
| `play()` | Start autoplay |
| `pause()` | Pause autoplay |
[/table]

## Declarative Configuration

Configure carousels declaratively with `$.setup()` for cleaner, more maintainable code.

### Basic Carousel Setup

```javascript
$.setup({
    '#hero-carousel': {
        component: 'carousel',
        options: {
            autoplay: true,
            interval: 5000,
            loop: true,
            animation: 'slide'
        }
    }
});
```

### Product Gallery with Events

```javascript
$.setup({
    '.product-gallery': {
        component: 'carousel',
        options: {
            showArrows: true,
            showIndicators: true,
            pauseOnHover: true,
            onChange: (index, instance) => {
                // Update product URL
                history.replaceState(null, '', `?slide=${index}`);

                // Track view
                analytics.track('Product Image Viewed', {
                    imageIndex: index
                });
            }
        }
    }
});
```

### Side-by-Side: Programmatic vs Declarative

Programmatic

```javascript
const carousel = Domma.elements.carousel(
    '#carousel',
    {
        autoplay: true,
        interval: 5000
    }
);

carousel.play();
```

Declarative (Recommended)

```javascript
$.setup({
    '#carousel': {
        component: 'carousel',
        options: {
            autoplay: true,
            interval: 5000
        }
    }
});
```

## CSS Customisation

Override these CSS variables to customise Carousel appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-radius-lg` | `0.5rem` | Carousel corner radius |
| `--dm-primary` | `var(--dm-blue-600)` | Control/indicator colour |
| `--dm-shadow-md` | `0 4px 6px...` | Carousel shadow |
| `--dm-surface` | `var(--dm-white)` | Carousel background |
[/table]

### Example Override

```css
/* Custom control colour - target via CSS */
.carousel-controls button {
    background: rgba(0,0,0,0.5);
    color: white;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/carousel/related-elements" title="Related Elements" /]
