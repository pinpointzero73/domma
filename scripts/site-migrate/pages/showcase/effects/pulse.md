---
title: Pulse Effect
description: "Grow-and-shrink scale animation perfect for notification indicators and status badges."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Pulse Effect" tagline="Grow-and-shrink scale animation perfect for notification indicators and status badges." align="center"][/hero]

## Domma.effects.pulse()

Creates a grow-and-shrink breathing effect using scale transforms. Ideal for notification dots, badge counters, loading states, and interactive buttons.

```javascript
// Basic usage
Domma.effects.pulse('.badge');

// With configuration
const pulse = Domma.effects.pulse('.element', {
  scale: 1.05,        // Scale factor (1.05 = 5% larger)
  duration: 2000,     // Animation cycle time in ms
  stagger: 100,       // Delay between multiple elements
  pauseOnHover: true  // Pause when hovering
});

// Control methods
pulse.pause();
pulse.resume();
pulse.stop();
pulse.destroy();
```

## Demo: Basic Pulse

Simple pulsing animation on badge elements.

[showcase-demo id="showcase/effects/pulse/demo-basic-pulse" title="Demo: Basic Pulse" /]

```javascript
Domma.effects.pulse('#pulse-demo-1 .badge', {
  scale: 1.1,
  duration: 2000,
  stagger: 100
});
```

## Demo: Scale Variations

Different scale factors for varying intensity.

[showcase-demo id="showcase/effects/pulse/demo-scale-variations" title="Demo: Scale Variations" /]

```javascript
// Apply different scales to each item
$('#pulse-demo-2 .demo-item').each(function() {
  const scale = parseFloat($(this).attr('data-scale')) || 1.05;
  Domma.effects.pulse(this, {
    scale: scale,
    duration: 2000
  });
});
```

## Demo: Notification Dot

A pulsing notification indicator.

[showcase-demo id="showcase/effects/pulse/demo-notification-dot" title="Demo: Notification Dot" /]

```javascript
Domma.effects.pulse('#notification-dot', {
  scale: 1.3,
  duration: 1500
});
```
