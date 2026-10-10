---
title: Breathe Effect
description: "Sinusoidal floating animation that adds a gentle up-and-down motion to elements."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Breathe Effect" tagline="Sinusoidal floating animation that adds a gentle up-and-down motion to elements." align="center"][/hero]

## Domma.effects.breathe()

Creates a gentle up-and-down floating motion using sinusoidal easing. Perfect for stat cards, feature highlights, pricing tiers, and call-to-action elements.

```javascript
// Basic usage
Domma.effects.breathe('.stat-card');

// With configuration
const breathe = Domma.effects.breathe('.element', {
  amplitude: 6,       // Vertical distance in pixels
  duration: 3000,     // Animation cycle time in ms
  stagger: 200,       // Delay between multiple elements
  pauseOnHover: true, // Pause when hovering
  iterations: 'infinite'
});

// Control methods
breathe.pause();
breathe.resume();
breathe.stop();
breathe.restart();
breathe.destroy();
```

## Demo: Basic Breathe

Simple floating animation with control methods.

[showcase-demo id="showcase/effects/breathe/demo-basic-breathe" title="Demo: Basic Breathe" /]

## Demo: Stagger Effect

Cascading animations with 150ms delay between elements.

[showcase-demo id="showcase/effects/breathe/demo-stagger-effect" title="Demo: Stagger Effect" /]

```javascript
Domma.effects.breathe('#breathe-demo-2 .demo-item', {
  amplitude: 8,
  duration: 2500,
  stagger: 150
});
```

## Demo: Amplitude Variations

Different vertical movement distances.

[showcase-demo id="showcase/effects/breathe/demo-amplitude-variations" title="Demo: Amplitude Variations" /]

```javascript
// Apply different amplitudes to each item
$('#breathe-demo-3 .demo-item').each(function() {
  const amplitude = parseInt($(this).attr('data-amplitude')) || 6;
  Domma.effects.breathe(this, {
    amplitude: amplitude,
    duration: 3000
  });
});
```

## Demo: Pause on Hover

Animation pauses when you hover over elements.

[showcase-demo id="showcase/effects/breathe/demo-pause-on-hover" title="Demo: Pause on Hover" /]

```javascript
Domma.effects.breathe('#breathe-demo-4 .demo-item', {
  amplitude: 10,
  duration: 2000,
  pauseOnHover: true
});
```
