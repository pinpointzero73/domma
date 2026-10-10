---
title: Gradients
description: "Dynamic gradient backgrounds and text effects for modern, vibrant UIs"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Gradients" tagline="Dynamic gradient backgrounds and text effects for modern, vibrant UIs" align="center"][/hero]

## theme-gradients

Gradients based on Domma theme colours

[showcase-demo id="showcase/effects/gradients/theme-gradients" title="theme-gradients" /]

```html
<div class="bg-gradient-primary">Primary</div>
<div class="bg-gradient-secondary">Secondary</div>
<div class="bg-gradient-success">Success</div>
<div class="bg-gradient-danger">Danger</div>
<div class="bg-gradient-warning">Warning</div>
<div class="bg-gradient-info">Info</div>
```

## named-presets

Beautiful pre-designed gradient combinations

[showcase-demo id="showcase/effects/gradients/named-presets" title="named-presets" /]

```html
<div class="bg-gradient-sunset">Sunset</div>
<div class="bg-gradient-ocean">Ocean</div>
<div class="bg-gradient-purple">Purple</div>
<div class="bg-gradient-rose">Rose</div>
<div class="bg-gradient-forest">Forest</div>
<div class="bg-gradient-night">Night</div>
<div class="bg-gradient-warm">Warm</div>
<div class="bg-gradient-cool">Cool</div>
```

## directional

Control gradient direction with utility classes

[showcase-demo id="showcase/effects/gradients/directional" title="directional" /]

```html
<!-- Use CSS variables for custom colours -->
<div class="bg-gradient-to-r" style="--dm-gradient-from: #3b82f6; --dm-gradient-to: #8b5cf6;">
    To Right
</div>

<div class="bg-gradient-to-br" style="--dm-gradient-from: #10b981; --dm-gradient-to: #0ea5e9;">
    To Bottom Right
</div>
```

## radial

Circular gradient patterns radiating from center

[showcase-demo id="showcase/effects/gradients/radial" title="radial" /]

```html
<div class="bg-gradient-radial" style="--dm-gradient-from: #3b82f6; --dm-gradient-to: #1e293b;">
    Radial Gradient
</div>
```

## animated

Moving gradients with background-position animation

[showcase-demo id="showcase/effects/gradients/animated" title="animated" /]

```html
<div class="bg-gradient-sunset bg-gradient-animated">
    Animated Gradient
</div>
```

## text-gradients

Apply gradients to text with background-clip

```html
<h1 class="text-gradient">Gradient Text</h1>
<h1 class="text-gradient-sunset">Sunset Gradient</h1>
<h1 class="text-gradient-ocean">Ocean Gradient</h1>
```

## css-variables

Create custom gradients using CSS custom properties

```css
/* Define custom gradient colours */
.my-element {
    --dm-gradient-from: #ff6b6b;
    --dm-gradient-to: #4ecdc4;
}

/* Use with directional classes */
<div class="bg-gradient-to-r my-element">
    Custom Gradient
</div>

/* Override in inline styles */
<div class="bg-gradient-to-br"
     style="--dm-gradient-from: #667eea; --dm-gradient-to: #764ba2;">
    Inline Custom Gradient
</div>
```

## usage

Practical applications of gradients

```html
<!-- Hero Section -->
<section class="hero bg-gradient-sunset">
    <h1 class="text-white">Welcome!</h1>
</section>

<!-- Button with Gradient -->
<button class="btn bg-gradient-primary">
    Get Started
</button>

<!-- Card with Gradient Background -->
<div class="card bg-gradient-ocean">
    <div class="card-body">
        <h3>Premium Feature</h3>
    </div>
</div>

<!-- Gradient Text Logo -->
<h1 class="text-gradient-purple">
    Brand Name
</h1>

<!-- Animated Background -->
<div class="bg-gradient-cool bg-gradient-animated">
    <p>Moving gradient background</p>
</div>
```

## browser-support

- **Linear & Radial Gradients** - All modern browsers
- **Text Gradients** - Requires `-webkit-background-clip` (widely supported)
- **Animated Gradients** - All browsers with CSS animation support
- **Fallback** - Always provide a solid colour fallback for older browsers
