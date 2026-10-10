---
title: Opacity & Translucency
description: "A complete opacity scale (0-100) and semantic translucency utilities, including a frosted-glass variant."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Opacity & Translucency" tagline="A complete opacity scale (0-100) and semantic translucency utilities, including a frosted-glass variant." align="center"][/hero]

## Opacity Scale

13 utility classes covering the full opacity range in steps of 10, plus `.opacity-25` and `.opacity-75` for fine-grained control.

[showcase-demo id="showcase/css-utilities/opacity-scale" title="Opacity Scale" /]

Usage

```html
<div class="opacity-50">Half opacity</div>
<div class="opacity-75">Three-quarter opacity</div>
<img class="opacity-30" src="bg.jpg" alt="">
```

## Interactive Demo

Drag the slider to see opacity values in real time.

[showcase-demo id="showcase/css-utilities/interactive-demo" title="Interactive Demo" /]

## Translucent Utilities

Named classes for common translucency patterns. Each class includes a smooth `transition: opacity` so state changes animate automatically.

[showcase-demo id="showcase/css-utilities/translucent-utilities" title="Translucent Utilities" /]

Usage

```html
<nav class="translucent-light">Subtle overlay navigation</nav>
<div class="translucent">Standard transparency for modals or overlays</div>
<img class="translucent-heavy" src="watermark.png" alt="watermark">
```

## Hover Variants

Apply translucency only on hover - useful for image grids, card overlays, and icon buttons. The transition is built in.

[showcase-demo id="showcase/css-utilities/hover-variants" title="Hover Variants" /]

Usage

```html
<!-- Subtle image dimming on hover -->
<img class="translucent-light-hover" src="photo.jpg" alt="">

<!-- Fade-back effect on icon buttons -->
<button class="translucent-hover">...</button>
```

## Frosted Glass

`.translucent-glass` combines a semi-transparent white background with `backdrop-filter: blur()` for a frosted glass effect. Requires content behind the element to be visible.

[showcase-demo id="showcase/css-utilities/frosted-glass" title="Frosted Glass" /]

Usage

```html
<!-- Position over a gradient or image background -->
<div class="hero-cover" style="background-image: url(bg.jpg)">
    <nav class="translucent-glass p-4">Frosted navbar</nav>
</div>
```

> **Browser support:** `backdrop-filter` is supported in all modern browsers. In browsers that don't support it, the panel falls back gracefully to just the semi-transparent background.

## CSS Variables

All translucency values are driven by CSS variables, making them easy to override per-theme.

```css
:root {
    --dm-translucent-light:         0.85;   /* .translucent-light */
    --dm-translucent:               0.7;    /* .translucent */
    --dm-translucent-heavy:         0.5;    /* .translucent-heavy */
    --dm-translucent-glass-blur:    8px;    /* .translucent-glass blur amount */
    --dm-translucent-glass-opacity: 0.75;   /* .translucent-glass background alpha */
}

/* Override in a dark theme to use a dark glass panel */
[data-theme-variant="dark"] .translucent-glass {
    background-color: rgba(0, 0, 0, var(--dm-translucent-glass-opacity));
}
```

## Reference

All opacity and translucency utility classes at a glance.

[showcase-demo id="showcase/css-utilities/reference" title="Reference" /]
