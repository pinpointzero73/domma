---
title: Ripple Effect
description: "Material Design click ripple. Adds a circular wave effect emanating from the click/touch point for tactile UI feedback."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Ripple Effect" tagline="Material Design click ripple. Adds a circular wave effect emanating from the click/touch point for tactile UI feedback." align="center"][/hero]

## Domma.effects.ripple()

The `ripple()` effect creates a Material Design-style circular wave expanding from the click/touch point. The ripple element is absolutely positioned, scales from 0 to 4x, and fades out. Perfect for buttons, cards, and interactive elements.

```javascript
// Add ripple to all buttons
Domma.effects.ripple('.btn');

// Custom colour and duration
Domma.effects.ripple('.card', {
  colour: 'rgba(59, 130, 246, 0.3)',
  duration: 800,
  centered: false
});

// Clean up
ctrl.destroy();
```

## Demo: Button Ripples

Click on these buttons to see the ripple effect. The ripple emanates from the click point.

[showcase-demo id="showcase/effects/ripple/demo-button-ripples" title="Demo: Button Ripples" /]

```javascript
Domma.effects.ripple('.btn', {
  colour: 'rgba(255, 255, 255, 0.35)',
  duration: 600
});
```

## Demo: Custom Ripple Colours

Different ripple colours for different contexts.

[showcase-demo id="showcase/effects/ripple/demo-custom-ripple-colours" title="Demo: Custom Ripple Colours" /]

```javascript
Domma.effects.ripple('.blue', { colour: 'rgba(21, 101, 192, 0.3)' });
Domma.effects.ripple('.green', { colour: 'rgba(46, 125, 50, 0.3)' });
Domma.effects.ripple('.red', { colour: 'rgba(198, 40, 40, 0.3)' });
```

## Demo: Centred Ripple

With `centered: true`, the ripple always starts from the centre of the element regardless of click position.

[showcase-demo id="showcase/effects/ripple/demo-centred-ripple" title="Demo: Centred Ripple" /]

```javascript
Domma.effects.ripple('.element', {
  centered: true
});
```

## Demo: Card Ripples

Ripple effect on cards for interactive list items or dashboards.

[showcase-demo id="showcase/effects/ripple/demo-card-ripples" title="Demo: Card Ripples" /]

```javascript
Domma.effects.ripple('.file-card', {
  colour: 'rgba(13, 110, 253, 0.15)',
  duration: 800
});
```

## Demo: Duration Comparison

Compare different ripple durations.

[showcase-demo id="showcase/effects/ripple/demo-duration-comparison" title="Demo: Duration Comparison" /]

## Options Reference

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `colour` | string | 'rgba(255, 255, 255, 0.35)' | Ripple colour (CSS colour value) |
| `duration` | number | 600 | Ripple animation duration in ms |
| `opacity` | number | 0.35 | Starting opacity |
| `unbounded` | boolean | false | Allow ripple to overflow element |
| `centered` | boolean | false | Always ripple from centre |
| `trigger` | string | 'pointerdown' | 'click', 'mousedown', 'pointerdown' |
| `respectMotionPreference` | boolean | true | Honour prefers-reduced-motion |
[/table]
