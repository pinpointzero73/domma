---
title: Reveal Effect
description: "Scroll-triggered entrance animations using IntersectionObserver. Elements animate into view as they enter the viewport."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Reveal Effect" tagline="Scroll-triggered entrance animations using IntersectionObserver. Elements animate into view as they enter the viewport." align="center"][/hero]

## Domma.effects.reveal()

The `reveal()` effect uses `IntersectionObserver` to trigger CSS transitions when elements scroll into view. Supports fade, slide, zoom, and flip animations with stagger support for groups of elements.

```javascript
// Simple fade-in on scroll
Domma.effects.reveal('.card');

// Slide up with stagger
const ctrl = Domma.effects.reveal('.feature', {
  animation: 'slide-up',
  duration: 800,
  stagger: 100,
  threshold: 0.2,
  onReveal: (el) => console.log('Revealed:', el)
});

// Clean up
ctrl.destroy();
```

## Demo: Fade (Default)

Elements fade in smoothly as they enter the viewport.

[showcase-demo id="showcase/effects/reveal/demo-fade-default" title="Demo: Fade (Default)" /]

```javascript
Domma.effects.reveal('.reveal-fade-demo', {
  animation: 'fade',
  duration: 600,
  stagger: 150
});
```

## Demo: Slide Up

Elements slide upward from below as they enter.

[showcase-demo id="showcase/effects/reveal/demo-slide-up" title="Demo: Slide Up" /]

```javascript
Domma.effects.reveal('.reveal-slideup-demo', {
  animation: 'slide-up',
  duration: 800,
  stagger: 120,
  easing: 'ease-out'
});
```

## Demo: Slide Left & Right

Elements slide in from the sides.

[showcase-demo id="showcase/effects/reveal/demo-slide-left-and-right" title="Demo: Slide Left & Right" /]

```javascript
// Slide in from right
Domma.effects.reveal('.slide-left', { animation: 'slide-left' });

// Slide in from left
Domma.effects.reveal('.slide-right', { animation: 'slide-right' });
```

## Demo: Zoom

Elements scale up from a smaller size.

[showcase-demo id="showcase/effects/reveal/demo-zoom" title="Demo: Zoom" /]

```javascript
Domma.effects.reveal('.reveal-zoom-demo', {
  animation: 'zoom',
  duration: 700,
  stagger: 200
});
```

## Demo: Flip

Elements flip in with a 3D perspective transform.

[showcase-demo id="showcase/effects/reveal/3d-flip-entrance" title="3D Flip Entrance" /]

```javascript
Domma.effects.reveal('.flip-card', {
  animation: 'flip',
  duration: 900
});
```

## Demo: Re-animate on Re-entry

With `once: false`, elements re-animate every time they enter the viewport. Scroll up and down to see them repeat.

[showcase-demo id="showcase/effects/reveal/demo-re-animate-on-re-entry" title="Demo: Re-animate on Re-entry" /]

```javascript
Domma.effects.reveal('.repeatable', {
  animation: 'slide-up',
  once: false  // Re-animate on re-entry
});
```

## Options Reference

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `animation` | string | 'fade' | Animation type: 'fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'zoom', 'flip' |
| `duration` | number | 600 | Animation duration in ms |
| `easing` | string | 'ease-out' | CSS easing function |
| `delay` | number | 0 | Delay before animation in ms |
| `stagger` | number | 0 | Delay between multiple elements in ms |
| `threshold` | number | 0.1 | IntersectionObserver threshold (0-1) |
| `rootMargin` | string | '0px' | Observer root margin |
| `once` | boolean | true | Only animate once, or re-animate on re-entry |
| `respectMotionPreference` | boolean | true | Honour prefers-reduced-motion |
| `onReveal` | function | null | Callback per element when revealed |
[/table]
