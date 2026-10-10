---
title: Hero
description: "Large hero sections for showcasing key content, announcements, and calls-to-action"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Hero" tagline="Large hero sections for showcasing key content, announcements, and calls-to-action" align="center"][/hero]

## Overview

Heroes are large hero sections designed to showcase key content, announcements, or calls-to-action. They're perfect for landing pages, marketing content, and feature highlights. Domma's hero is a CSS-only component requiring no JavaScript.

### Key Features

- **CSS-Only** - No JavaScript required
- **Theme Variants** - Default, dark, and primary gradient
- **Background Images** - Support for hero images with overlay
- **Size Options** - Small, default, and large padding
- **Flexible Layout** - Left-aligned or centred content
- **Responsive** - Mobile-optimised typography and spacing

### Basic Usage

```
<div class="hero">
    <div class="hero-content">
        <h1 class="hero-title">Welcome</h1>
        <p class="hero-subtitle">Subtitle text</p>
        <div class="hero-actions">
            <button class="btn btn-primary btn-lg">Get Started</button>
        </div>
    </div>
</div>
```

## Getting Started

Add a hero section to your page in two simple steps

### Step 1: Include Domma CSS

Add Domma CSS to your page:

```
<!-- CSS -->
<link rel="stylesheet" href="dist/domma.css">
<link rel="stylesheet" href="dist/elements.css">
```

### Step 2: Add hero HTML

Use hero classes for hero sections:

```
<div class="hero">
    <div class="hero-content">
        <h1 class="hero-title">Welcome to Domma</h1>
        <p class="hero-subtitle">
            A lightweight JavaScript framework combining jQuery-style DOM,
            Lodash utilities, and modern UI components.
        </p>
        <div class="hero-actions">
            <button class="btn btn-primary btn-lg">Get Started</button>
            <button class="btn btn-outline btn-lg">Learn More</button>
        </div>
    </div>
</div>

<!-- With gradient variant -->
<div class="hero hero-gradient-primary">
    <div class="hero-content">
        <h1 class="hero-title">Gradient Hero</h1>
        <p class="hero-subtitle">Eye-catching gradient background</p>
    </div>
</div>
```

> **Note:** Heroes are CSS-only components (no JavaScript required). Simply add the hero classes to your HTML. Use `.hero-gradient-*` for gradient variants, `.hero-dark` for dark theme, or `.hero-sm` / `.hero-lg` for size variations.

## Quick Start

### Basic hero

[showcase-demo id="showcase/elements/hero/basic-hero" title="Basic hero" /]

## Examples

### Primary Gradient (Centred)

[showcase-demo id="showcase/elements/hero/primary-gradient-centred" title="Primary Gradient (Centred)" /]

### Dark Theme

[showcase-demo id="showcase/elements/hero/dark-theme" title="Dark Theme" /]

### With Background Image

[showcase-demo id="showcase/elements/hero/with-background-image" title="With Background Image" /]

### Size Variants

[showcase-demo id="showcase/elements/hero/size-variants" title="Size Variants" /]

## Split Layouts (New)

Create modern text + image hero sections with CSS Grid. Split layouts automatically stack on mobile and display side-by-side on desktop (768px+).

### Basic Split (50/50)

[showcase-demo id="showcase/elements/hero/basic-split-50-50" title="Basic Split (50/50)" /]

### Reversed Split

[showcase-demo id="showcase/elements/hero/reversed-split" title="Reversed Split" /]

### Asymmetric Splits

[showcase-demo id="showcase/elements/hero/asymmetric-splits" title="Asymmetric Splits" /]

## Enhanced Overlays (New)

Multiple overlay variants for better contrast control on background images. Choose light overlays for dark images, dark overlays for bright images, or gradient overlays for fade effects.

### Light Overlay

[showcase-demo id="showcase/elements/hero/light-overlay" title="Light Overlay" /]

### Dark Overlay

[showcase-demo id="showcase/elements/hero/dark-overlay" title="Dark Overlay" /]

### Darker Overlay

[showcase-demo id="showcase/elements/hero/darker-overlay" title="Darker Overlay" /]

### Gradient Overlay (Bottom-Up)

[showcase-demo id="showcase/elements/hero/gradient-overlay-bottom-up" title="Gradient Overlay (Bottom-Up)" /]

### Gradient Overlay (Top-Down)

[showcase-demo id="showcase/elements/hero/gradient-overlay-top-down" title="Gradient Overlay (Top-Down)" /]

## Announcement Badges (New)

Small notification badges to highlight announcements, new releases, or special features above your main hero heading.

### Primary Badge

[showcase-demo id="showcase/elements/hero/primary-badge" title="Primary Badge" /]

### Badge with Icon

[showcase-demo id="showcase/elements/hero/badge-with-icon" title="Badge with Icon" /]

### Badge Variants

[showcase-demo id="showcase/elements/hero/badge-variants" title="Badge Variants" /]

## Responsive Utilities (New)

Advanced responsive behaviors using CSS clamp for fluid typography and conditional display utilities for mobile/desktop content.

### Responsive Typography

[showcase-demo id="showcase/elements/hero/responsive-typography" title="Responsive Typography" /]

### Conditional Display

[showcase-demo id="showcase/elements/hero/conditional-display" title="Conditional Display" /]

## Additional Gradients (New)

8 modern gradient backgrounds beyond the default primary gradient, perfect for creating visually stunning hero sections.

[showcase-demo id="showcase/elements/hero/additional-gradients-new" title="Additional Gradients (New)" /]

## Best Practices

- **Above the Fold** - Place heroes at top of page for maximum impact
- **Clear CTA** - Include obvious call-to-action buttons
- **Contrast** - Ensure text is readable against background (4.5:1 ratio minimum)
- **Mobile Responsive** - Test on mobile devices for proper text sizing
- **Image Optimisation** - Compress background images for fast loading

## CSS Classes

[table striped="true"]
| Class | Description |
| --- | --- |
| `.hero` | Base hero container |
| `.hero-primary` | Primary colour gradient background |
| `.hero-dark` | Dark background theme |
| `.hero-center` | Centre-aligned content |
| `.hero-cover` | Background image cover mode |
| `.hero-overlay` | Dark overlay for background images |
| `.hero-sm` | Smaller padding |
| `.hero-lg` | Larger padding |
| `.hero-content` | Content wrapper |
| `.hero-title` | Main heading |
| `.hero-subtitle` | Subtitle text |
| `.hero-actions` | Button container |
| **Split Layouts (New)** |  |
| `.hero-split` | Text + image split layout (50/50 on desktop, stacked on mobile) |
| `.hero-split-reverse` | Reversed split (image left, text right) |
| `.hero-split-60-40` | Asymmetric 60% / 40% split |
| `.hero-split-70-30` | Asymmetric 70% / 30% split |
| `.hero-split-40-60` | Asymmetric 40% / 60% split |
| `.hero-split-30-70` | Asymmetric 30% / 70% split |
| `.hero-text` | Text content container for split layouts |
| `.hero-media` | Image/media container for split layouts |
| **Enhanced Overlays (New)** |  |
| `.hero-overlay-light` | 30% white overlay for dark backgrounds |
| `.hero-overlay-dark` | 60% black overlay for bright backgrounds |
| `.hero-overlay-darker` | 80% black overlay for maximum contrast |
| `.hero-overlay-gradient` | Gradient overlay (dark bottom to transparent top) |
| `.hero-overlay-gradient-reverse` | Gradient overlay (dark top to transparent bottom) |
| **Announcement Badges (New)** |  |
| `.hero-badge` | Primary badge (default blue) |
| `.hero-badge-secondary` | Secondary badge variant |
| `.hero-badge-success` | Success badge (green) |
| `.hero-badge-warning` | Warning badge (yellow) |
| `.hero-badge-danger` | Danger badge (red) |
| `.hero-badge-info` | Info badge (cyan) |
| `.hero-badge-outline` | Transparent badge with border |
| `.hero-badge-icon` | Icon/emoji wrapper for badges |
| **Responsive Utilities (New)** |  |
| `.hero-title-responsive` | Fluid title sizing (2rem to 3.5rem) |
| `.hero-subtitle-responsive` | Fluid subtitle sizing (1rem to 1.5rem) |
| `.hero-responsive` | Fluid spacing (padding scales with viewport) |
| `.hero-hide-mobile` | Hidden on mobile (<768px), visible on desktop |
| `.hero-show-mobile` | Visible on mobile, hidden on desktop |
| `.hero-center-mobile` | Centred on mobile, left-aligned on desktop |
| **Gradient Variants (New)** |  |
| `.hero-gradient-purple` | Purple gradient background |
| `.hero-gradient-blue` | Blue gradient background |
| `.hero-gradient-green` | Green gradient background |
| `.hero-gradient-sunset` | Orange-to-red gradient background |
| `.hero-gradient-ocean` | Cyan-blue gradient background |
| `.hero-gradient-rose` | Pink-red gradient background |
| `.hero-gradient-forest` | Green forest gradient background |
| `.hero-gradient-night` | Dark slate gradient background |
[/table]

## Hybrid CSS + JavaScript

While heroes work perfectly as CSS-only components, you can enhance them with JavaScript for dynamic content, animations, and interactivity using Domma's declarative configuration.

### Dynamic Content Updates

```javascript
// Rotate through multiple messages
$.setup({
    '#hero-hero': {
        initial: {
            data: {
                messages: [
                    { title: 'Launch Your Project', subtitle: 'Build amazing apps with Domma' },
                    { title: 'Ship Faster', subtitle: 'Zero dependencies, maximum productivity' },
                    { title: 'Scale Confidently', subtitle: 'Lightweight and performant' }
                ],
                currentIndex: 0
            }
        },
        events: {
            ready: (e, $el) => {
                const data = $el.data();
                setInterval(() => {
                    data.currentIndex = (data.currentIndex + 1) % data.messages.length;
                    const msg = data.messages[data.currentIndex];

                    $el.find('.hero-title').fadeOut(300, function() {
                        $(this).text(msg.title).fadeIn(300);
                    });
                    $el.find('.hero-subtitle').fadeOut(300, function() {
                        $(this).text(msg.subtitle).fadeIn(300);
                    });
                }, 4000);
            }
        }
    }
});
```

### Scroll-Based Animations

```javascript
// Animate hero on scroll into view
$.setup({
    '.hero': {
        initial: {
            css: { opacity: 0, transform: 'translateY(30px)' }
        },
        events: {
            ready: (e, $el) => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            $el.animate({
                                opacity: 1,
                                transform: 'translateY(0)'
                            }, 800);
                            observer.unobserve(entry.target);
                        }
                    });
                });
                observer.observe($el.get(0));
            }
        }
    }
});
```

### Interactive CTA Tracking

```javascript
// Track user interactions with analytics
$.setup({
    '#marketing-hero': {
        events: {
            'click .btn-primary': (e, $el) => {
                const title = $el.find('.hero-title').text();

                // Track with analytics
                if (typeof analytics !== 'undefined') {
                    analytics.track('hero CTA Clicked', {
                        hero: title,
                        button: $(e.target).text()
                    });
                }

                // Show feedback
                Domma.elements.toast.success('Thanks for your interest!');
            },
            'mouseenter': (e, $el) => {
                $el.find('.hero-actions .btn').addClass('pulse');
            },
            'mouseleave': (e, $el) => {
                $el.find('.hero-actions .btn').removeClass('pulse');
            }
        }
    }
});
```

### Personalised Content

```javascript
// Customise hero based on user data
const user = { name: 'Alice', plan: 'Pro' };

$.setup({
    '#dashboard-hero': {
        initial: {
            html: (el) => {
                const $content = $(el).find('.hero-content');
                $content.find('.hero-title').text(`Welcome back, ${user.name}!`);
                $content.find('.hero-subtitle').text(`You're on the ${user.plan} plan`);

                if (user.plan === 'Free') {
                    $content.find('.hero-actions').html(`
                        <button class="btn btn-primary btn-lg">Upgrade to Pro</button>
                    `);
                }
            }
        }
    }
});
```

### Benefits of Hybrid Approach

- **Performance** - CSS handles layout/styling instantly, JS adds interactivity only when needed
- **Progressive Enhancement** - Works without JS, enhanced with JS
- **Maintainability** - Centralised configuration for all dynamic behaviour
- **Flexibility** - Mix static and dynamic content as needed

### CSS-Only vs CSS+JS Hybrid

CSS-Only (Default)

```javascript
    
        
            Static Title
        
        
            Static subtitle
        
        
            
                Click Me
```

CSS+JS Hybrid (Enhanced)

```javascript
    
        
            Dynamic Title
        
        
            Dynamic subtitle
        
        
            
                Click Me
            
        
    

<script>
$.setup({
    '#hero': {
        events: {
            'click .btn': () => {
                // Analytics, animations, etc.
            }
        }
    }
});
</script>
```

## CSS Customisation

Override these CSS variables to customise Hero appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-primary` | `var(--dm-blue-600)` | Primary hero background/gradient |
| `--dm-text-inverse` | `var(--dm-white)` | Text on dark hero |
| `--dm-font-size-4xl` | `2.25rem` | Hero title size |
| `--dm-font-size-xl` | `1.25rem` | Hero subtitle size |
[/table]

### Example Override

```css
/* Custom gradient - create new class */
.hero-custom {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/hero/related-elements" title="Related Elements" /]
