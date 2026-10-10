---
title: JavaScript Effects
description: "Breathe life into your UI with smooth, GPU-accelerated animations via Domma.effects."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="JavaScript Effects" tagline="Breathe life into your UI with smooth, GPU-accelerated animations via Domma.effects." align="center"][/hero]

## Domma.effects Module

The effects module provides reusable animation utilities for adding visual polish to your UI elements. All effects support accessibility features like `prefers-reduced-motion` and provide control objects for pause/resume/destroy.

[showcase-demo id="showcase/effects/javascript/domma-effects-module" title="Domma.effects Module" /]

### Available Effects

- **[breathe()](/showcase/effects/javascript/breathe)** - Sinusoidal vertical floating animation
- **[pulse()](/showcase/effects/javascript/pulse)** - Grow-and-shrink scale animation
- **[scribe()](/showcase/effects/javascript/scribe)** - Character-by-character text animation with action queue
- **[reveal()](/showcase/effects/javascript/reveal)** - Scroll-triggered entrance animations (fade, slide, zoom, flip)
- **[scramble()](/showcase/effects/javascript/scramble)** - Text cipher/decode animation with multiple reveal orders
- **[counter()](/showcase/effects/javascript/counter)** - Animated number counting with easing and formatting
- **[ripple()](/showcase/effects/javascript/ripple)** - Material Design click ripple effect
- **[shake()](/showcase/effects/javascript/shake)** - Attention/error shake animation

### Features

- GPU-accelerated CSS animations
- Configurable amplitude, duration, easing, and stagger
- Pause on hover support
- Respects `prefers-reduced-motion`
- Control objects with pause(), resume(), stop(), restart(), destroy()
- Works with selectors, elements, or NodeLists

## Configuration Options

Both `breathe()` and `pulse()` support these options:

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `amplitude` / `scale` | number | 6 / 1.05 | Movement distance (breathe) or scale factor (pulse) |
| `duration` | number | 3000 / 2000 | Complete animation cycle time in milliseconds |
| `easing` | string | 'ease-in-out' | CSS easing function |
| `delay` | number | 0 | Initial delay before animation starts (ms) |
| `stagger` | number | 0 | Delay between multiple elements (ms) |
| `iterations` | number \| 'infinite' | 'infinite' | Number of animation cycles |
| `pauseOnHover` | boolean | false | Pause animation when hovering over element |
| `autoStart` | boolean | true | Start animation immediately |
| `respectMotionPreference` | boolean | true | Honor prefers-reduced-motion setting |
| `onStart` | function | null | Callback when animation starts |
| `onComplete` | function | null | Callback when animation completes (finite iterations only) |
[/table]

### Control Object Methods

[table striped="true"]
| Method | Description |
| --- | --- |
| `pause()` | Pause the animation |
| `resume()` | Resume a paused animation |
| `stop()` | Stop the animation completely |
| `restart()` | Restart the animation from the beginning |
| `destroy()` | Stop animation and clean up all resources |
| `isRunning()` | Check if animation is currently running |
| `isPaused()` | Check if animation is paused |
[/table]

## Accessibility

Domma.effects respects user motion preferences by default.

### prefers-reduced-motion

If a user has enabled "Reduce motion" in their system settings, effects will be automatically disabled. You can override this with `respectMotionPreference: false`.

```javascript
// Respects system preference (default)
Domma.effects.breathe('.element', {
  respectMotionPreference: true
});

// Forces animation even if user prefers reduced motion
Domma.effects.breathe('.element', {
  respectMotionPreference: false
});
```

> **Note:** Always respect user preferences unless there's a compelling reason not to. Animations can cause discomfort or motion sickness for some users.

## Real-World Use Cases

### breathe()

- Stat cards and dashboard widgets
- Feature highlights
- Pricing tiers
- Call-to-action elements
- Hero section elements

### pulse()

- Notification indicators
- Badge counters
- Loading states
- Interactive buttons
- Status indicators

### typewriter()

- Hero section headlines with dynamic messaging
- Landing page taglines and value propositions
- Terminal/CLI-style interfaces
- Storytelling and narrative content
- Code demonstrations and tutorials
- Chat interfaces and message simulations
- Interactive error messages and help text

### butterflies()

- Spring/seasonal landing pages and hero backdrops
- Celebration and success moments (burst mode)
- Empty-state and onboarding delight
- Ambient full-page atmosphere

### strobe()

- Alert / emphasis moments (used sparingly)
- Game and arcade UI effects
- Photography/scanning simulations

### Combined Effects

```javascript
// Stat card with subtle breathe
Domma.effects.breathe('.stat-card', {
  amplitude: 6,
  duration: 3000,
  stagger: 200,
  pauseOnHover: true
});

// Notification badge with pulse
Domma.effects.pulse('.badge-notification', {
  scale: 1.15,
  duration: 1500
});

// Feature cards with staggered entrance
Domma.effects.breathe('.feature-card', {
  amplitude: 8,
  stagger: 150,
  iterations: 3,
  onComplete: () => {
    console.log('All cards animated!');
  }
});

// Hero typewriter with looping messages
Domma.effects.scribe('.hero-headline', {
  speed: 60,
  loop: true,
  loopDelay: 2000,
  actions: [
    { render: 'Build Amazing Apps', effect: 'bounce' },
    { wait: '2.5s' },
    { undoRender: 'all' },
    { render: 'Ship Faster', effect: 'fade' },
    { wait: '2.5s' },
    { undoRender: 'all' }
  ]
});

// Terminal-style command output
Domma.effects.scribe('.terminal-output', {
  speed: 20,
  cursor: true,
  cursorChar: '_',
  actions: [
    { render: '$ npm install domma-js', effect: 'none' },
    { wait: '1s' },
    { render: '\n✓ Installed successfully', effect: 'fade' }
  ]
});
```
