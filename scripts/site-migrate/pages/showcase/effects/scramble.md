---
title: Scramble Effect
description: "Text cipher/decode animation. Characters cycle through random glyphs before settling on the correct character."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Scramble Effect" tagline="Text cipher/decode animation. Characters cycle through random glyphs before settling on the correct character." align="center"][/hero]

## Domma.effects.scramble()

The `scramble()` effect wraps text characters and rapidly cycles through random glyphs before resolving each character to its final value. Supports multiple reveal orders and looping.

```javascript
// Basic usage
Domma.effects.scramble('.hero-title');

// With options
const ctrl = Domma.effects.scramble('.heading', {
  scrambleDuration: 1200,
  revealOrder: 'random',
  loop: true,
  loopDelay: 3000,
  onComplete: () => console.log('Decoded!')
});

// Control
ctrl.pause();
ctrl.resume();
ctrl.restart();
ctrl.destroy();
```

## Demo: Basic Scramble

Click to decode the text left-to-right.

[showcase-demo id="showcase/effects/scramble/demo-basic-scramble" title="Demo: Basic Scramble" /]

## Demo: Reveal Orders

Different orders for character resolution.

### Left to Right

[showcase-demo id="showcase/effects/scramble/left-to-right" title="Left to Right" /]

### Right to Left

[showcase-demo id="showcase/effects/scramble/right-to-left" title="Right to Left" /]

### Random

[showcase-demo id="showcase/effects/scramble/random" title="Random" /]

### Centre Out

[showcase-demo id="showcase/effects/scramble/centre-out" title="Centre Out" /]

```javascript
Domma.effects.scramble('#el', { revealOrder: 'left-to-right' });
Domma.effects.scramble('#el', { revealOrder: 'right-to-left' });
Domma.effects.scramble('#el', { revealOrder: 'random' });
Domma.effects.scramble('#el', { revealOrder: 'center-out' });
```

## Demo: Looping Scramble

Infinite loop with configurable delay between cycles.

[showcase-demo id="showcase/effects/scramble/demo-looping-scramble" title="Demo: Looping Scramble" /]

```javascript
Domma.effects.scramble('.headline', {
  loop: true,
  loopDelay: 2000,
  scrambleDuration: 1000,
  revealOrder: 'random'
});
```

## Demo: Custom Character Pool

Use custom characters for the scramble animation.

[showcase-demo id="showcase/effects/scramble/demo-custom-character-pool" title="Demo: Custom Character Pool" /]

```javascript
Domma.effects.scramble('#binary', {
  characters: '01',
  scrambleDuration: 1500,
  speed: 80
});
```

## Demo: Speed Variations

Adjust scramble duration and resolve speed.

[showcase-demo id="showcase/effects/scramble/demo-speed-variations" title="Demo: Speed Variations" /]

## Options Reference

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `speed` | number | 50 | Ms per character resolve |
| `scrambleSpeed` | number | 30 | Ms between scramble frame updates |
| `characters` | string | A-Z, a-z, 0-9, symbols | Character pool for scramble glyphs |
| `revealOrder` | string | 'left-to-right' | 'left-to-right', 'right-to-left', 'random', 'center-out' |
| `scrambleDuration` | number | 800 | How long each char scrambles before resolving (ms) |
| `stagger` | number | 0 | Delay between multiple elements (ms) |
| `loop` | boolean\|number | false | false, true (infinite), or number of loops |
| `loopDelay` | number | 2000 | Ms between loops |
| `respectMotionPreference` | boolean | true | Honour prefers-reduced-motion |
| `onComplete` | function | null | Callback when animation completes |
| `onCharacter` | function | null | Callback per character resolved (char, index) |
[/table]
