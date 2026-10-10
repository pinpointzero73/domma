---
title: Filters
description: "CSS filter effects for images, elements, and backdrop blur effects"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Filters" tagline="CSS filter effects for images, elements, and backdrop blur effects" align="center"][/hero]

## blur

Apply blur effects with varying intensities

[showcase-demo id="showcase/effects/filters/blur" title="blur" /]

```html
<img src="image.jpg" class="blur-sm">
<img src="image.jpg" class="blur">
<img src="image.jpg" class="blur-lg">
<img src="image.jpg" class="blur-xl">
```

## brightness-contrast

Adjust brightness and contrast levels

[showcase-demo id="showcase/effects/filters/brightness-contrast" title="brightness-contrast" /]

```html
<img src="image.jpg" class="brightness-150">
<img src="image.jpg" class="contrast-125">
```

## grayscale-sepia

Remove colour or add vintage sepia tone

[showcase-demo id="showcase/effects/filters/grayscale-sepia" title="grayscale-sepia" /]

```html
<img src="image.jpg" class="grayscale">
<img src="image.jpg" class="sepia">
```

## saturate-hue

Adjust colour saturation and rotate hues

[showcase-demo id="showcase/effects/filters/saturate-hue" title="saturate-hue" /]

```html
<img src="image.jpg" class="saturate-150">
<img src="image.jpg" class="hue-rotate-90">
```

## invert

Invert colours for negative effect

[showcase-demo id="showcase/effects/filters/invert" title="invert" /]

```html
<img src="image.jpg" class="invert">
```

## drop-shadow

Add shadows to non-rectangular elements (unlike box-shadow)

[showcase-demo id="showcase/effects/filters/drop-shadow" title="drop-shadow" /]

```html
<img src="icon.svg" class="drop-shadow-lg">
<div class="drop-shadow-xl">Elevated Element</div>
```

## backdrop-blur

Blur the background behind an element (glassmorphism effect)

[showcase-demo id="showcase/effects/filters/backdrop-blur" title="backdrop-blur" /]

```html
<div class="backdrop-blur">
    <!-- Content with blurred background -->
</div>

<!-- Glassmorphism Card -->
<div class="card backdrop-blur-lg" style="background: rgba(255,255,255,0.1);">
    <div class="card-body">
        Semi-transparent with blurred backdrop
    </div>
</div>
```

## presets

Pre-configured combinations of multiple filters

[showcase-demo id="showcase/effects/filters/presets" title="presets" /]

```html
<img src="photo.jpg" class="filter-vintage">
<img src="photo.jpg" class="filter-dramatic">
<img src="photo.jpg" class="filter-soft">
```

## usage

Practical applications of CSS filters

```html
<!-- Inactive/Disabled State -->
<img src="icon.svg" class="grayscale opacity-50">

<!-- Glassmorphism Card -->
<div class="card backdrop-blur-lg bg-white-t10">
    <div class="card-body">Frosted Glass Effect</div>
</div>

<!-- Image Gallery with Hover Effect -->
<img src="photo.jpg" class="grayscale hover:grayscale-0">

<!-- Loading State -->
<div class="blur-sm animate-pulse">Loading...</div>

<!-- Dramatic Hero Image -->
<section class="hero filter-dramatic brightness-90">
    <h1>Bold Statement</h1>
</section>
```

## custom

Combine multiple filter functions for unique effects

```css
/* Custom Filter Combination */
.my-custom-filter {
    filter: brightness(1.1) contrast(1.2) saturate(1.3);
}

/* Dynamic Filter with CSS Variable */
.interactive-filter {
    filter: blur(var(--blur-amount, 0px));
    transition: filter 0.3s ease;
}

.interactive-filter:hover {
    --blur-amount: 8px;
}
```

## support

### Browser Support

- **filter** - All modern browsers
- **backdrop-filter** - All modern browsers (requires `-webkit-` prefix in some)
- **Fallback** - Filters gracefully degrade if not supported

### Performance Tips

- **Use sparingly** - Filters can be computationally expensive
- **Avoid animations** - Don't animate filter values excessively
- **will-change** - Add `will-change: filter` for frequently filtered elements
- **Test performance** - Always test on lower-end devices
- **backdrop-filter** - Particularly expensive; use only when necessary
