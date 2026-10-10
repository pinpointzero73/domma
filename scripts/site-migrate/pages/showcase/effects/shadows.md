---
title: Shadow Effects
description: "Box shadows and elevation utilities for depth and visual hierarchy"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Shadow Effects" tagline="Box shadows and elevation utilities for depth and visual hierarchy" align="center"][/hero]

## basic-shadows

Standard box shadow utilities for adding depth to elements

[showcase-demo id="showcase/effects/shadows/basic-shadows" title="basic-shadows" /]

```html
<div class="shadow-sm">Small shadow</div>
<div class="shadow">Default shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-xl">Extra large shadow</div>
```

## inner-shadows

Inset shadows for creating depth within elements

[showcase-demo id="showcase/effects/shadows/inner-shadows" title="inner-shadows" /]

```html
<div class="shadow-inner">Inner shadow for depth</div>
<input class="form-control shadow-inner" placeholder="Input with inner shadow">
```

## coloured-shadows

Theme-aware coloured shadows for visual emphasis

[showcase-demo id="showcase/effects/shadows/coloured-shadows" title="coloured-shadows" /]

```html
<div class="card shadow-primary">Primary shadow</div>
<button class="btn btn-success shadow-success">Success button</button>
<div class="alert alert-danger shadow-danger">Danger alert</div>
```

## elevation-system

Elevation levels inspired by Material Design principles

[showcase-demo id="showcase/effects/shadows/elevation-system" title="elevation-system" /]

**Note:** Hover over elevation cards to see the lift effect

## hover-effects

Add shadow on hover for interactive feedback

[showcase-demo id="showcase/effects/shadows/hover-effects" title="hover-effects" /]

```html
<button class="btn shadow-hover">Hover for shadow</button>
<div class="card shadow-lift-hover">Card lifts on hover</div>
```

## practical-examples

Real-world use cases for shadow effects

[showcase-demo id="showcase/effects/shadows/cards-with-depth" title="Cards with Depth" /]

[showcase-demo id="showcase/effects/shadows/floating-action-button" title="Floating Action Button" /]

[showcase-demo id="showcase/effects/shadows/form-fields" title="Form Fields" /]

[showcase-demo id="showcase/effects/shadows/modal-dialog" title="Modal Dialog" /]

## css-variables

Customize shadows using CSS custom properties

```css
/* Shadow variables */
:root {
    --dm-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --dm-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --dm-shadow-md: 0 6px 12px rgba(0, 0, 0, 0.1);
    --dm-shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
    --dm-shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.15);
    --dm-shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.2);
    
    /* Coloured shadows */
    --dm-shadow-primary: 0 10px 25px rgba(59, 130, 246, 0.3);
    --dm-shadow-success: 0 10px 25px rgba(34, 197, 94, 0.3);
    --dm-shadow-danger: 0 10px 25px rgba(239, 68, 68, 0.3);
}

/* Custom shadow */
.custom-shadow {
    box-shadow: 0 15px 35px rgba(147, 51, 234, 0.4);
}
```

### Custom Example

Custom Purple Shadow

box-shadow: 0 15px 35px rgba(147, 51, 234, 0.4)

## reference

### Basic Shadow Classes

- `.shadow-none` - Remove shadow
- `.shadow-sm` - Small shadow
- `.shadow` - Default shadow
- `.shadow-md` - Medium shadow
- `.shadow-lg` - Large shadow
- `.shadow-xl` - Extra large shadow
- `.shadow-2xl` - 2X large shadow
- `.shadow-3xl` - 3X large shadow

### Inner Shadow Classes

- `.shadow-inner-sm` - Small inner shadow
- `.shadow-inner` - Default inner shadow
- `.shadow-inner-md` - Medium inner shadow
- `.shadow-inner-lg` - Large inner shadow

### Coloured Shadow Classes

- `.shadow-primary` - Primary colour shadow
- `.shadow-secondary` - Secondary colour shadow
- `.shadow-success` - Success colour shadow
- `.shadow-warning` - Warning colour shadow
- `.shadow-danger` - Danger colour shadow
- `.shadow-info` - Info colour shadow

### Elevation Classes

- `.elevation-0` - No elevation (flat)
- `.elevation-1` - 1dp elevation
- `.elevation-2` - 2dp elevation
- `.elevation-3` - 3dp elevation
- `.elevation-4` - 4dp elevation
- `.elevation-5` - 5dp elevation

### Hover Classes

- `.shadow-hover` - Add shadow on hover
- `.shadow-lg-hover` - Large shadow on hover
- `.shadow-lift-hover` - Lift effect with shadow on hover
- `.shadow-none-hover` - Remove shadow on hover
