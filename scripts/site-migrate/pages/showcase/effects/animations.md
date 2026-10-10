---
title: Animations
description: "Keyframe animations and transitions for entrance effects, micro-interactions, and UI feedback"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Animations" tagline="Keyframe animations and transitions for entrance effects, micro-interactions, and UI feedback" align="center"][/hero]

> **💡 Interactive Demo:** Click any animation box to replay the effect!

## fade-animations

Smooth opacity-based entrance and exit effects

[showcase-demo id="showcase/effects/animations/fade-animations" title="fade-animations" /]

```html
<div class="animate-fade-in">Fade In</div>
<div class="animate-fade-in-up">Fade In Up</div>
<div class="animate-fade-in-down">Fade In Down</div>
<div class="animate-fade-in-left">Fade In Left</div>
<div class="animate-fade-in-right">Fade In Right</div>
```

## slide-animations

Full-distance slide-in effects from screen edges

[showcase-demo id="showcase/effects/animations/slide-animations" title="slide-animations" /]

```html
<div class="animate-slide-in-up">Slide In Up</div>
<div class="animate-slide-in-down">Slide In Down</div>
<div class="animate-slide-in-left">Slide In Left</div>
<div class="animate-slide-in-right">Slide In Right</div>
```

## zoom-rotate

Scale and rotation-based entrance effects

[showcase-demo id="showcase/effects/animations/zoom-rotate" title="zoom-rotate" /]

```html
<div class="animate-zoom-in">Zoom In</div>
<div class="animate-rotate-in">Rotate In</div>
<div class="animate-flip">Flip</div>
```

## attention

Looping animations for drawing user attention

[showcase-demo id="showcase/effects/animations/attention" title="attention" /]

```html
<div class="animate-bounce animate-infinite">Bounce</div>
<div class="animate-pulse animate-infinite">Pulse</div>
<div class="animate-shake">Shake</div>
<div class="animate-spin animate-infinite">Spin</div>
```

## animation-control

Modify duration, delay, and iteration count

[showcase-demo id="showcase/effects/animations/animation-control" title="animation-control" /]

```html
<!-- Duration Control -->
<div class="animate-fade-in animate-duration-fast">Fast</div>
<div class="animate-fade-in animate-duration-slow">Slow</div>

<!-- Delay Control -->
<div class="animate-fade-in animate-delay-300">Delayed</div>

<!-- Iteration Control -->
<div class="animate-bounce animate-infinite">Infinite</div>
<div class="animate-bounce animate-once">Once</div>
<div class="animate-bounce animate-repeat-3">3 Times</div>
```

## hover-animations

Trigger animations on hover for interactive feedback

[showcase-demo id="showcase/effects/animations/hover-animations" title="hover-animations" /]

```html
<button class="animate-bounce-hover">Hover to Bounce</button>
<div class="animate-pulse-hover">Hover to Pulse</div>
<div class="animate-shake-hover">Hover to Shake</div>
<div class="animate-spin-hover">Hover to Spin</div>
```

## stagger

Create cascading entrance effects using delay classes

[showcase-demo id="showcase/effects/animations/stagger" title="stagger" /]

```html
<div class="animate-fade-in-up">Item 1</div>
<div class="animate-fade-in-up animate-delay-100">Item 2</div>
<div class="animate-fade-in-up animate-delay-200">Item 3</div>
<div class="animate-fade-in-up animate-delay-300">Item 4</div>
```

## css-variables

Customize animations using CSS custom properties

```css
/* Animation Variables */
:root {
    --dm-animate-duration: 1s;
    --dm-animate-delay: 0s;
    --dm-animate-timing: ease;
}

/* Custom Duration */
.my-element {
    --dm-animate-duration: 2s;
}

/* Custom Timing Function */
.my-element {
    --dm-animate-timing: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

## usage

Practical examples of animation usage

```html
<!-- Page Load Entrance -->
<div class="hero animate-fade-in-up">
    <h1>Welcome!</h1>
</div>

<!-- Button Feedback -->
<button class="btn animate-shake-hover">Delete</button>

<!-- Loading Indicator -->
<div class="loader animate-spin animate-infinite">⟳</div>

<!-- Alert Notification -->
<div class="alert animate-bounce animate-repeat-3">
    New message received!
</div>

<!-- Card Grid with Stagger -->
<div class="card animate-fade-in-up">Card 1</div>
<div class="card animate-fade-in-up animate-delay-100">Card 2</div>
<div class="card animate-fade-in-up animate-delay-200">Card 3</div>
```

## performance

- **Use transform and opacity** - These properties are GPU-accelerated
- **Limit simultaneous animations** - Too many at once can cause jank
- **Remove animations after completion** - Use JavaScript to clean up if needed
- **Test on lower-end devices** - Ensure smooth performance across devices
- **Respect prefers-reduced-motion** - Consider users with motion sensitivity
