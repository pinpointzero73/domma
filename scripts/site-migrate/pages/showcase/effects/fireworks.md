---
title: Fireworks Effects
description: "CSS-only animated fireworks for celebrations and special moments"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Fireworks Effects" tagline="CSS-only animated fireworks for celebrations and special moments" align="center"][/hero]

## burst-effect

Expanding particle burst animation using multiple radial gradients

[showcase-demo id="showcase/effects/fireworks/burst-effect" title="burst-effect" /]

```html
<div class="firework firework-burst">
    <div class="firework-launch"></div>
    <div class="firework-particles"></div>
</div>
```

## theme-variants

Different colour themes for various occasions

[showcase-demo id="showcase/effects/fireworks/theme-variants" title="theme-variants" /]

## multiple-display

Launch multiple fireworks with different themes simultaneously

[showcase-demo id="showcase/effects/fireworks/multiple-display" title="multiple-display" /]

```javascript
// Launch multiple fireworks
function launchMultipleFireworks(containerId, theme, count) {
    const themes = ['celebration', 'special', 'birthday', 'newyear'];
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const currentTheme = theme === 'mixed' ? 
                themes[Math.floor(Math.random() * themes.length)] : theme;
            const position = 20 + Math.random() * 60;
            launchFirework(containerId, currentTheme, position);
        }, i * 300 + Math.random() * 200);
    }
}
```

## color-variants

Click each card to launch themed fireworks

[showcase-demo id="showcase/effects/fireworks/color-variants" title="color-variants" /]

## continuous-animation

Loop the fireworks animation infinitely for ongoing celebrations

[showcase-demo id="showcase/effects/fireworks/continuous-animation" title="continuous-animation" /]

```javascript
// Start continuous fireworks display
startContinuousDisplay('container-id');

// Stop the display
stopContinuousDisplay();
```

## hover-trigger

Trigger fireworks animation on hover for interactive elements

[showcase-demo id="showcase/effects/fireworks/hover-trigger" title="hover-trigger" /]

```javascript
// Add hover trigger to button
button.addEventListener('mouseenter', () => {
    launchFirework('container-id', 'celebration');
});
```

## click-to-launch

Click anywhere on the canvas to launch fireworks at that position

[showcase-demo id="showcase/effects/fireworks/click-to-launch" title="click-to-launch" /]

```javascript
// Click to launch at mouse position
container.addEventListener('click', (e) => {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    launchFirework('container-id', 'celebration', x);
});
```

## usage-examples

Real-world applications of fireworks effects

### Success Message

> **Congratulations!** Your form was submitted successfully.  Celebrate

### Achievement Badge

[showcase-demo id="showcase/effects/fireworks/achievement-badge" title="Achievement Badge" /]

### Celebration Button

[showcase-demo id="showcase/effects/fireworks/celebration-button" title="Celebration Button" /]

## css-reference

### Base Classes

- `.firework` - Base firework container
- `.firework-burst` - Expanding particle burst effect
- `.firework-sparkle` - Twinkling stars effect
- `.firework-trail` - Falling particle trail effect

### Size Modifiers

- `.firework-sm` - Small size (100px)
- `.firework-md` - Medium size (300px)
- `.firework-lg` - Large size (400px)
- `.firework-xl` - Extra large size (500px)

### Colour Modifiers

- `.firework-primary` - Primary theme colours
- `.firework-success` - Success theme colours
- `.firework-rainbow` - Rainbow colours

### Behavior Modifiers

- `.firework-continuous` - Loop animation infinitely
- `.firework-on-hover` - Trigger on hover

### CSS Variables

- `--dm-fw-duration` - Animation duration (default: 1.5s)
- `--dm-fw-delay` - Animation delay (default: 0s)
- `--dm-fw-color-1` through `--dm-fw-color-8` - Custom colours
