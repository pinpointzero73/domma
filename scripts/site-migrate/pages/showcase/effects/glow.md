---
title: Glow Effects
description: "Text and box glow effects to add emphasis and visual interest to your UI"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Glow Effects" tagline="Text and box glow effects to add emphasis and visual interest to your UI" align="center"][/hero]

## text-glow-sizes

Different glow intensities for various emphasis levels

Small Glow

Default Glow

Medium Glow

Large Glow

Extra Large Glow

```html
<h1 class="glow-sm">Small Glow</h1>
<h1 class="glow">Default Glow</h1>
<h1 class="glow-md">Medium Glow</h1>
<h1 class="glow-lg">Large Glow</h1>
<h1 class="glow-xl">Extra Large Glow</h1>
```

## color-variants

Theme-aware glow colours for different contexts

[showcase-demo id="showcase/effects/glow/color-variants" title="color-variants" /]

```html
<h1 class="glow-primary">Primary Glow</h1>
<h1 class="glow-success">Success Glow</h1>
<h1 class="glow-danger">Danger Glow</h1>
```

## hover-effects

Add glow on hover for interactive elements

[showcase-demo id="showcase/effects/glow/hover-effects" title="hover-effects" /]

```html
<button class="glow-hover">Hover for Glow</button>
<a href="#" class="glow-primary-hover">Primary on Hover</a>
<h1 class="glow-success-hover">Success on Hover</h1>
```

## practical-examples

Real-world use cases for glow effects

[showcase-demo id="showcase/effects/glow/hero-title" title="Hero Title" /]

[showcase-demo id="showcase/effects/glow/navigation-links" title="Navigation Links" /]

[showcase-demo id="showcase/effects/glow/call-to-action-button" title="Call to Action Button" /]

[showcase-demo id="showcase/effects/glow/status-badges" title="Status Badges" /]

## css-variables

Customize glow effects using CSS custom properties

```css
/* Default glow variables */
:root {
    --dm-glow-sm: 0 0 8px rgba(255, 255, 255, 0.3);
    --dm-glow: 0 0 15px rgba(255, 255, 255, 0.5);
    --dm-glow-md: 0 0 20px rgba(255, 255, 255, 0.6);
    --dm-glow-lg: 0 0 30px rgba(255, 255, 255, 0.7);
    --dm-glow-xl: 0 0 40px rgba(255, 255, 255, 0.8);
    
    /* Colour variants */
    --dm-glow-primary: 0 0 20px rgba(59, 130, 246, 0.6);
    --dm-glow-success: 0 0 20px rgba(34, 197, 94, 0.6);
    --dm-glow-danger: 0 0 20px rgba(239, 68, 68, 0.6);
}

/* Custom glow */
.custom-glow {
    text-shadow: 0 0 25px rgba(147, 51, 234, 0.8);
}
```

### Custom Example

[showcase-demo id="showcase/effects/glow/custom-purple-glow" title="Custom Purple Glow" /]

## reference

### Size Classes

- `.glow-sm` - Small glow effect (8px)
- `.glow` - Default glow effect (15px)
- `.glow-md` - Medium glow effect (20px)
- `.glow-lg` - Large glow effect (30px)
- `.glow-xl` - Extra large glow effect (40px)

### Colour Classes

- `.glow-primary` - Primary theme colour glow
- `.glow-secondary` - Secondary theme colour glow
- `.glow-success` - Success/green glow
- `.glow-warning` - Warning/yellow glow
- `.glow-danger` - Danger/red glow
- `.glow-info` - Info/blue glow

### Hover Classes

- `.glow-hover` - Default glow on hover
- `.glow-primary-hover` - Primary glow on hover
- `.glow-success-hover` - Success glow on hover
- `.glow-warning-hover` - Warning glow on hover
- `.glow-danger-hover` - Danger glow on hover
