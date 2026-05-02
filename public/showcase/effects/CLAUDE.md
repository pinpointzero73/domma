# CLAUDE.md - Effects Module

This file provides guidance for working with Domma's Effects module and creating showcase examples.

## What are Effects?

Effects are CSS-powered visual enhancements that add polish and interactivity to UI elements. Unlike UI components (
modals, tabs, etc.), effects are purely visual and don't contain application logic.

## Available Effects

### 1. Glow Effects

Text and box shadows that create a luminous appearance:

- **Size variants**: `.glow-sm`, `.glow`, `.glow-md`, `.glow-lg`, `.glow-xl`
- **Color variants**: `.glow-primary`, `.glow-success`, `.glow-danger`, etc.
- **Hover effects**: `.glow-hover`, `.glow-primary-hover`, etc.

### 2. Fireworks

Animated particle effects for celebrations:

- **Types**: `.firework-burst`, `.firework-sparkle`, `.firework-trail`
- **Sizes**: `.firework-sm`, `.firework-md`, `.firework-lg`, `.firework-xl`
- **Behaviors**: `.firework-continuous`, `.firework-on-hover`
- **Colors**: `.firework-primary`, `.firework-success`, `.firework-rainbow`

### 3. Shadows

Box shadows and elevation utilities:

- **Basic shadows**: `.shadow-sm`, `.shadow`, `.shadow-lg`, `.shadow-xl`, `.shadow-2xl`
- **Inner shadows**: `.shadow-inner`, `.shadow-inner-lg`
- **Colored shadows**: `.shadow-primary`, `.shadow-success`, `.shadow-danger`
- **Elevation**: `.elevation-0` through `.elevation-5`
- **Hover effects**: `.shadow-hover`, `.shadow-lift-hover`

## Implementation Details

All effects are pure CSS implementations using:

- CSS custom properties (variables) for customization
- `@keyframes` for animations
- Hardware-accelerated properties (`transform`, `opacity`)
- Theme-aware color integration

### 4. JavaScript Effects (`Domma.effects`)

Programmatic animation effects accessed via `Domma.effects`:

- **breathe()** - Sinusoidal floating animation
- **pulse()** - Grow-and-shrink scale animation
- **scribe()** - Text animation with configurable granularity (characters, words, or sentences) and action queue
- **reveal()** - Scroll-triggered entrance animations (fade, slide, zoom, flip) using IntersectionObserver
- **scramble()** - Text cipher/decode animation with multiple reveal orders
- **counter()** - Animated number counting with easing, formatting, and scroll trigger
- **ripple()** - Material Design click ripple effect
- **shake()** - Attention/error shake animation
- **twinkle()** - Canvas-based twinkling stars animation (full-page overlay or container-scoped)
- **tickerTape()** - Canvas-based ticker-tape parade — coloured rectangles drop, sway, rotate, and fade. Theme-aware palettes plus 10 named presets; supports continuous and one-shot burst modes.

All JS effects support `respectMotionPreference` and return control objects with `pause()`, `resume()`, `stop()`, `restart()`, `destroy()`.

## File Structure

```
public/showcase/effects/
├── index.html          # Effects hub page
├── glow.html           # Glow effects showcase
├── fireworks.html      # Fireworks animations showcase
├── shadows.html        # Shadow utilities showcase
├── javascript.html     # JS effects overview (breathe, pulse, typewriter)
├── reveal.html         # Reveal effect showcase
├── scramble.html       # Scramble effect showcase
├── counter.html        # Counter effect showcase
├── ripple.html         # Ripple effect showcase
├── shake.html          # Shake effect showcase
├── twinkle.html        # Twinkle (twinkling stars) effect showcase
├── ticker-tape.html    # Ticker-tape parade effect showcase
└── CLAUDE.md           # This file
```

## Creating New Effects

When adding a new effect:

1. **Add CSS to src/css/domma.css**:

```css
/* Effect Name */
.effect-name {
    /* Base styles */
}

@keyframes effect-animation {
    /* Animation keyframes */
}
```

2. **Create showcase page**:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Effect Name - Domma Showcase</title>
    <!-- Standard includes -->
</head>
<body>
    <!-- Demo sections -->
</body>
</html>
```

3. **Update navigation** in `public/layouts/config/nav-showcase.json`

4. **Add to Effects index** at `public/showcase/effects/index.html`

## CSS Variables

Effects use CSS custom properties for customization:

```css
:root {
    /* Glow */
    --dm-glow-sm: 0 0 8px rgba(255, 255, 255, 0.3);
    --dm-glow: 0 0 15px rgba(255, 255, 255, 0.5);
    --dm-glow-primary: 0 0 20px rgba(59, 130, 246, 0.6);
    
    /* Fireworks */
    --dm-fw-duration: 1.5s;
    --dm-fw-delay: 0s;
    --dm-fw-size: 200px;
    
    /* Shadows */
    --dm-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --dm-shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
}
```

## Performance Considerations

1. **Use transform and opacity** for animations (GPU-accelerated)
2. **Limit simultaneous animations** to prevent janky performance
3. **Use will-change sparingly** for frequently animated elements
4. **Test on lower-end devices** to ensure smooth performance

## Showcase Guidelines

When creating effect showcases:

1. **Show all variants** - Size, color, and behavior options
2. **Provide practical examples** - Real-world use cases
3. **Include code examples** - Show the HTML/CSS needed
4. **Document CSS variables** - Explain customization options
5. **Add interactive demos** - Let users trigger effects

## Example Usage

### Glow Effect

```html
<h1 class="glow-primary">Glowing Title</h1>
<button class="btn glow-hover">Hover Me</button>
```

### Fireworks

```html
<div class="firework firework-burst firework-lg"></div>
<button class="firework-on-hover">Celebrate!</button>
```

### Shadows

```html
<div class="card shadow-lg">Elevated Card</div>
<div class="elevation-3">Material Design Elevation</div>
```

## Integration with Domma

Effects integrate with Domma's:

- **Theme system** - Colors adapt to current theme
- **Grid system** - Responsive behavior
- **Components** - Can be applied to any UI element

## Testing Effects

Before committing:

1. Test in multiple browsers (Chrome, Firefox, Safari)
2. Verify theme integration (light/dark modes)
3. Check performance on mobile devices
4. Ensure accessibility (reduced motion preference)

## Related Documentation

- [Main CLAUDE.md](../../../CLAUDE.md) - Project overview
- [CSS Architecture](../../../CLAUDE.md#css-architecture) - CSS build process
- [Showcase Guide](../CLAUDE.md) - General showcase guidelines