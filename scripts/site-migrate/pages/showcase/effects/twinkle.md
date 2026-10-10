---
title: Twinkle Effect
description: "Canvas-based twinkling stars animation. Works as a full-page ambient overlay or scoped to any container."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Twinkle Effect" tagline="Canvas-based twinkling stars animation. Works as a full-page ambient overlay or scoped to any container." align="center"][/hero]

## Domma.effects.twinkle()

Creates an ambient canvas-based starfield animation. Pass `null` (or omit the selector) for a full-page fixed overlay, or provide a selector to scope stars inside a specific container. Stars oscillate in brightness using a sinusoidal function and are drawn as 4-pointed shapes with a centre glow.

```javascript
// Full-page overlay
const stars = Domma.effects.twinkle(null);

// Container-scoped stars
const stars = Domma.effects.twinkle('#hero-section', {
  count: 80,
  colour: 'rgba(200, 220, 255, 0.9)',
  shape: 'circle'
});

// Control methods
stars.pause();
stars.resume();
stars.stop();
stars.restart();
stars.destroy();
```

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `count` | `number` | `100` | Number of stars to render |
| `minSize` | `number` | `1` | Minimum star radius in pixels |
| `maxSize` | `number` | `3` | Maximum star radius in pixels |
| `twinkleSpeed` | `number` | `0.003` | Base oscillation speed per frame (higher = faster twinkling) |
| `colour` | `string` | `'rgba(255, 240, 200, 1)'` | Star colour (any CSS colour value) |
| `zIndex` | `number` | `1` | Canvas stacking order |
| `shape` | `'star' \| 'circle'` | `'star'` | `'star'` draws a 4-pointed shape with glow; `'circle'` draws a soft dot |
| `respectMotionPreference` | `boolean` | `true` | Honour `prefers-reduced-motion` OS setting |
[/table]

### Control Methods

```javascript
const stars = Domma.effects.twinkle('#section');

stars.pause();      // Pause rendering (stars freeze in place)
stars.resume();     // Resume from where it paused
stars.stop();       // Stop and cancel animation frame
stars.restart();    // Recreate stars and restart
stars.destroy();    // Stop + remove canvas from DOM
stars.isRunning();  // true when animating (not paused)
stars.isPaused();   // true when paused mid-animation
```

## Demo: Container-Scoped Stars

Stars rendered inside a dark section element. The canvas is sized to the container and uses `position: absolute` so content above it remains interactive.

[showcase-demo id="showcase/effects/twinkle/demo-container-scoped-stars" title="Demo: Container-Scoped Stars" /]

```javascript
const stars = Domma.effects.twinkle('#star-container', {
  count: 80,
  minSize: 1,
  maxSize: 3,
  colour: 'rgba(255, 240, 200, 0.9)',
  respectMotionPreference: false
});
```

## Demo: Full-Page Overlay

Pass `null` as the selector to create a `position: fixed` canvas overlay that covers the entire viewport. Stars sit behind page content via `pointer-events: none`. This is the mode used on the Domma splash page.

[showcase-demo id="showcase/effects/twinkle/demo-full-page-overlay" title="Demo: Full-Page Overlay" /]

```javascript
// null selector creates a full-page fixed canvas
const stars = Domma.effects.twinkle(null, {
  count: 120,
  colour: 'rgba(255, 240, 200, 0.85)',
  zIndex: 0   // behind all page content
});
```

## Demo: Customisation

Adjust options and click Apply to see the changes.

[showcase-demo id="showcase/effects/twinkle/demo-customisation" title="Demo: Customisation" /]

## Demo: Shape Variants

The `shape` option controls how each star is drawn. `'star'` renders a 4-pointed shape with a centre glow. `'circle'` renders a soft filled dot.

[showcase-demo id="showcase/effects/twinkle/demo-shape-variants" title="Demo: Shape Variants" /]

```javascript
// 4-pointed star (default)
Domma.effects.twinkle('#shape-star', { shape: 'star', count: 60 });

// Circular dot
Domma.effects.twinkle('#shape-circle', { shape: 'circle', count: 60 });
```
