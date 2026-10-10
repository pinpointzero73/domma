---
title: Visual Effects
description: "CSS-powered visual effects and animations to enhance your UI with glow, fireworks, shadows, and more. Pure CSS implementations for performance and simplicity."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Visual Effects" tagline="CSS-powered visual effects and animations to enhance your UI with glow, fireworks, shadows, and more. Pure CSS implementations for performance and simplicity." align="center"][/hero]

[showcase-demo id="showcase/effects/visual-effects" title="Visual Effects" /]

## Section

Domma's visual effects are pure CSS implementations designed to enhance your UI without JavaScript overhead. These effects are hardware-accelerated for smooth performance and work seamlessly with Domma's theme system.

### Key Features

- **Pure CSS:** No JavaScript required for basic effects
- **Performance:** Hardware-accelerated animations
- **Theme Integration:** Works with Domma's colour system
- **Responsive:** Effects scale appropriately on all devices
- **Customizable:** CSS variables for easy customization

### Usage

Effects can be applied directly via CSS classes:

```html
<!-- Glow effect -->
<h1 class="glow-primary">Glowing Title</h1>

<!-- Fireworks on hover -->
<button class="btn firework-on-hover">Celebrate!</button>

<!-- Shadow depth -->
<div class="card shadow-xl">Elevated Card</div>
```

### Performance Tips

- Use `transform` and `opacity` for animations when possible
- Limit the number of animated elements on screen
- Consider using `will-change` for frequently animated properties
- Test on lower-end devices to ensure smooth performance
