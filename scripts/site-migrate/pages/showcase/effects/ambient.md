---
title: Ambient Background Effects
description: "Subtle CSS animations that add visual interest and depth to backgrounds without distracting from content"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Ambient Background Effects" tagline="Subtle CSS animations that add visual interest and depth to backgrounds without distracting from content" align="center"][/hero]

## Section

Ambient background effects use CSS animations and pseudo-elements to create subtle, continuous motion in your backgrounds. All effects are GPU-accelerated for smooth 60fps performance and automatically layer content on top using z-index positioning.

> **Performance Note:** All ambient effects use `will-change: transform` and only animate `transform` and `opacity` properties for optimal GPU acceleration.

## rotating-gradients

Gentle rotating radial and linear gradients that create a sense of subtle motion

### Rotate Glow

A single radial gradient rotating slowly

[showcase-demo id="showcase/effects/ambient/rotate-glow" title="Rotate Glow" /]

```html
<div class="bg-ambient-rotate-glow">
  <h1>Your Content Here</h1>
</div>
```

### Rotate Dual

Two overlapping gradients rotating in opposite directions

[showcase-demo id="showcase/effects/ambient/rotate-dual" title="Rotate Dual" /]

```html
<div class="bg-ambient-rotate-dual">
  <h1>Your Content Here</h1>
</div>
```

### Rotate Spotlight

Off-center rotating light beam effect

[showcase-demo id="showcase/effects/ambient/rotate-spotlight" title="Rotate Spotlight" /]

```html
<div class="bg-ambient-rotate-spotlight">
  <h1>Your Content Here</h1>
</div>
```

## floating-shapes

Soft gradient shapes that drift and morph across the background

### Float Blobs

Morphing gradient circles that drift around

[showcase-demo id="showcase/effects/ambient/float-blobs" title="Float Blobs" /]

```html
<div class="bg-ambient-float-blobs">
  <h1>Your Content Here</h1>
</div>
```

### Float Orbs

Multiple floating semi-transparent orbs

[showcase-demo id="showcase/effects/ambient/float-orbs" title="Float Orbs" /]

```html
<div class="bg-ambient-float-orbs">
  <h1>Your Content Here</h1>
</div>
```

### Float Particles

Tiny dots drifting upward like dust motes

[showcase-demo id="showcase/effects/ambient/float-particles" title="Float Particles" /]

```html
<div class="bg-ambient-float-particles">
  <h1>Your Content Here</h1>
</div>
```

## wave-ripple

Flowing patterns and expanding ripples for dynamic backgrounds

### Wave

Subtle sine wave undulation across the background

[showcase-demo id="showcase/effects/ambient/wave" title="Wave" /]

```html
<div class="bg-ambient-wave">
  <h1>Your Content Here</h1>
</div>
```

### Ripple

Concentric rings expanding outward from center

[showcase-demo id="showcase/effects/ambient/ripple" title="Ripple" /]

```html
<div class="bg-ambient-ripple">
  <h1>Your Content Here</h1>
</div>
```

### Aurora

Northern lights style flowing colours

[showcase-demo id="showcase/effects/ambient/aurora" title="Aurora" /]

```html
<div class="bg-ambient-aurora">
  <h1>Your Content Here</h1>
</div>
```

## modifiers

Adjust speed and intensity of ambient effects to suit your design

### Speed Modifiers

Control animation speed with modifier classes

[showcase-demo id="showcase/effects/ambient/speed-modifiers" title="Speed Modifiers" /]

```html
<div class="bg-ambient-rotate-glow bg-ambient-slow">Slow</div>
<div class="bg-ambient-rotate-glow bg-ambient-normal">Normal</div>
<div class="bg-ambient-rotate-glow bg-ambient-fast">Fast</div>
```

### Intensity Modifiers

Control effect opacity for subtle or intense effects

[showcase-demo id="showcase/effects/ambient/intensity-modifiers" title="Intensity Modifiers" /]

```html
<div class="bg-ambient-aurora bg-ambient-subtle">Subtle</div>
<div class="bg-ambient-aurora bg-ambient-intense">Intense</div>
```

### Combining Modifiers

Speed and intensity modifiers can be combined

[showcase-demo id="showcase/effects/ambient/combining-modifiers" title="Combining Modifiers" /]

```html
<div class="bg-ambient-aurora bg-ambient-fast bg-ambient-intense">
  <h1>Your Content Here</h1>
</div>
```

## usage

[showcase-demo id="showcase/effects/ambient/usage" title="usage" /]

> **Accessibility:** Ambient effects are purely decorative. Ensure sufficient colour contrast between text and background regardless of the effect applied.

[showcase-demo id="showcase/effects/ambient/see-also" title="See Also" /]
