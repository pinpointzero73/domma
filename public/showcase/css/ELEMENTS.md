# Domma Elements - UI Component Reference

This document provides a complete reference for all UI components available in `elements.css`.

## Table of Contents

1. [Buttons](#buttons)
2. [Cards](#cards)
3. [Modal](#modal)
4. [Tabs](#tabs)
5. [Accordion](#accordion)
6. [Tooltip](#tooltip)
7. [Table](#table)
8. [Form Elements](#form-elements)
9. [Badge](#badge)
10. [Pill](#pill)
11. [Alert](#alert)
12. [Code Block](#code-block)
13. [Pagination](#pagination)
14. [Navbar](#navbar)
15. [Footer](#footer)
16. [hero](#hero)
17. [Carousel](#carousel)
18. [Dialog](#dialog)
19. [Sidebar](#sidebar)

---

## Buttons

Interactive button components with multiple variants and sizes.

**Base Class:** `.btn`

**Variants:**

- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary action button
- `.btn-success` - Success/confirmation button
- `.btn-danger` - Destructive action button
- `.btn-warning` - Warning button
- `.btn-info` - Informational button
- `.btn-outline` - Outlined button style
- `.btn-ghost` - Transparent button

**Sizes:**

- `.btn-sm` - Small button
- `.btn-lg` - Large button

**Example:**

```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary btn-lg">Large Secondary</button>
<button class="btn btn-outline btn-sm">Small Outline</button>
```

---

## Cards

Container components for grouping related content.

**Base Class:** `.card`

**Structure:**

- `.card-header` - Top section
- `.card-body` - Main content area
- `.card-footer` - Bottom section
- `.card-title` - Card heading
- `.card-subtitle` - Secondary heading
- `.card-text` - Body text

**Variants:**

- `.card-hover` - Adds hover lift effect
- `.card-primary` - Primary color variant

**Example:**

```html
<div class="card card-hover">
    <div class="card-header">
        <h3 class="card-title">Card Title</h3>
    </div>
    <div class="card-body">
        <p class="card-text">Card content goes here.</p>
    </div>
    <div class="card-footer">
        <button class="btn btn-primary">Action</button>
    </div>
</div>
```

---

## Modal

Full-screen overlay dialogs.

**Base Class:** `.modal`

**Structure:**

- `.modal.active` - Visible state
- `.modal-header` - Top section with title
- `.modal-body` - Main content
- `.modal-footer` - Bottom actions
- `.modal-title` - Modal heading
- `.modal-close` - Close button

**Sizes:**

- `.modal-sm` - Small modal
- `.modal-lg` - Large modal
- `.modal-xl` - Extra large modal

**Example:**

```html
<div class="modal active">
    <div class="modal-header">
        <h3 class="modal-title">Modal Title</h3>
        <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
        <p>Modal content</p>
    </div>
    <div class="modal-footer">
        <button class="btn btn-secondary">Cancel</button>
        <button class="btn btn-primary">Confirm</button>
    </div>
</div>
```

---

## Tabs

Tabbed content navigation.

**Base Class:** `.tabs`

**Structure:**

- `.tab-list` - Container for tab buttons
- `.tab-item` - Individual tab button
- `.tab-item.active` - Active tab
- `.tab-content` - Container for panels
- `.tab-panel` - Individual panel
- `.tab-panel.active` - Visible panel

**Variants:**

- `.tabs-pills` - Pill-style tabs

**Example:**

```html
<div class="tabs">
    <div class="tab-list">
        <button class="tab-item active">Tab 1</button>
        <button class="tab-item">Tab 2</button>
    </div>
    <div class="tab-content">
        <div class="tab-panel active">Panel 1 content</div>
        <div class="tab-panel">Panel 2 content</div>
    </div>
</div>
```

---

## Accordion

Collapsible content sections.

**Base Class:** `.accordion`

**Structure:**

- `.accordion-item` - Individual accordion section
- `.accordion-item.active` - Expanded state
- `.accordion-header` - Clickable header
- `.accordion-icon` - Rotating indicator
- `.accordion-body` - Expandable content
- `.accordion-content` - Inner content wrapper

**Example:**

```html
<div class="accordion">
    <div class="accordion-item active">
        <div class="accordion-header">
            <span>Section 1</span>
            <span class="accordion-icon">▼</span>
        </div>
        <div class="accordion-body">
            <div class="accordion-content">Content here</div>
        </div>
    </div>
</div>
```

---

## Tooltip

Hover popup information.

**Base Class:** `.tooltip`

**Structure:**

- `.tooltip-content` - Popup content
- `.tooltip-top` - Position above
- `.tooltip-bottom` - Position below
- `.tooltip-left` - Position left
- `.tooltip-right` - Position right

**Example:**

```html
<span class="tooltip">
    Hover me
    <span class="tooltip-content tooltip-top">Tooltip text</span>
</span>
```

---

## Table

Data table styling.

**Base Class:** `.table`

**Variants:**

- `.table-striped` - Alternating row colors
- `.table-bordered` - Cell borders
- `.table-compact` - Reduced padding

**Features:**

- `th.sortable` - Sortable column header
- `th.sort-asc` - Ascending sort indicator
- `th.sort-desc` - Descending sort indicator

**Example:**

```html
<table class="table table-striped">
    <thead>
        <tr>
            <th class="sortable">Name</th>
            <th class="sortable">Age</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Alice</td>
            <td>30</td>
        </tr>
    </tbody>
</table>
```

---

## Form Elements

Styled form controls.

**Classes:**

- `.form-group` - Input wrapper
- `.form-label` - Text label
- `.form-input` - Text input
- `.form-select` - Select dropdown
- `.form-textarea` - Textarea

**Example:**

```html
<div class="form-group">
    <label class="form-label">Email</label>
    <input type="email" class="form-input" placeholder="Enter email">
</div>
```

---

## Badge

Small inline labels.

**Base Class:** `.badge`

**Variants:**

- `.badge-primary`
- `.badge-secondary`
- `.badge-success`
- `.badge-danger`
- `.badge-warning`
- `.badge-info`

**Example:**

```html
<span class="badge badge-primary">New</span>
<span class="badge badge-success">Active</span>
```

---

## Pill

Large pill-shaped buttons.

**Base Class:** `.pill`

**Variants:**

- `.pill-primary` - Solid primary
- `.pill-secondary` - Solid secondary
- `.pill-outline` - Outlined
- `.pill-light` - Semi-transparent

**Sizes:**

- `.pill-sm` - Small
- `.pill-lg` - Large

**Example:**

```html
<button class="pill pill-primary">Pill Button</button>
<button class="pill pill-outline pill-lg">Large Outline</button>
```

---

## Alert

Notification boxes.

**Base Class:** `.alert`

**Variants:**

- `.alert-primary`
- `.alert-success`
- `.alert-danger`
- `.alert-warning`
- `.alert-info`

**Example:**

```html
<div class="alert alert-success">
    Operation completed successfully!
</div>
```

---

## Code Block

Syntax highlighting container.

**Base Class:** `.code-block`

**Structure:**

- `.code-block-wrapper` - Positioning wrapper
- `.code-block-copy` - Copy button overlay
- `.code-block-copy.copied` - Success state

**Example:**

```html
<div class="code-block-wrapper">
    <pre class="code-block"><code>const hello = "world";</code></pre>
    <button class="code-block-copy">Copy</button>
</div>
```

---

## Pagination

Page navigation controls.

**Base Class:** `.pagination`

**Structure:**

- `.pagination-item` - List item
- `.pagination-link` - Clickable page
- `.pagination-link.active` - Current page
- `.pagination-link.disabled` - Inactive state

**Example:**

```html
<ul class="pagination">
    <li class="pagination-item">
        <a href="#" class="pagination-link">1</a>
    </li>
    <li class="pagination-item">
        <a href="#" class="pagination-link active">2</a>
    </li>
</ul>
```

---

## Navbar

Sticky navigation bar.

**Base Class:** `.navbar`

**Structure:**

- `.navbar-brand` - Logo/title
- `.navbar-toggle` - Hamburger button
- `.navbar-nav` - Navigation list
- `.navbar-link` - Navigation item
- `.navbar-link.active` - Active link

**Variants:**

- `.navbar-dark` - Dark theme

**Example:**

```html
<nav class="navbar">
    <div class="navbar-brand">Brand</div>
    <button class="navbar-toggle">☰</button>
    <ul class="navbar-nav">
        <li><a href="#" class="navbar-link active">Home</a></li>
        <li><a href="#" class="navbar-link">About</a></li>
    </ul>
</nav>
```

---

## Footer

Simple footer container.

**Base Class:** `.footer`

**Variants:**

- `.footer-dark` - Dark theme

**Example:**

```html
<footer class="footer">
    <p>&copy; 2025 Company Name</p>
</footer>
```

---

## hero

Hero/banner section.

**Base Class:** `.hero`

**Structure:**

- `.hero-content` - Content container (max-width: 800px)
- `.hero-title` - Main heading
- `.hero-subtitle` - Secondary text
- `.hero-actions` - Button group

**Variants:**

- `.hero-center` - Centered content
- `.hero-fluid` - Full-width
- `.hero-dark` - Dark theme
- `.hero-primary` - Primary gradient
- `.hero-cover` - Background image support
- `.hero-overlay` - Dark overlay

**Sizes:**

- `.hero-sm` - Small padding
- `.hero-lg` - Large padding
- `.hero-full` - Full viewport height

**Example:**

```html
<div class="hero hero-center">
    <div class="hero-content">
        <div class="hero-title">Welcome to Domma</div>
        <div class="hero-subtitle">A modern JavaScript framework</div>
        <div class="hero-actions">
            <a href="#" class="btn btn-primary">Get Started</a>
            <a href="#" class="btn btn-secondary">Learn More</a>
        </div>
    </div>
</div>
```

---

## Carousel

Image carousel with navigation.

**Base Class:** `.carousel`

**Structure:**

- `.carousel-track` - Slide container
- `.carousel-slide` - Individual slide
- `.carousel-slide-content` - Overlay content
- `.carousel-arrow` - Navigation arrows
- `.carousel-prev` / `.carousel-next` - Direction buttons
- `.carousel-indicators` - Dot indicators
- `.carousel-thumbnails` - Thumbnail navigation

**Variants:**

- `.carousel-fade` - Fade animation
- `.carousel-sm` / `.carousel-lg` / `.carousel-full` - Size variants

**Transition modes** *(JavaScript API — `animation` option)*:

| Mode         | Behaviour                                                                          |
|--------------|------------------------------------------------------------------------------------|
| `slide`      | Default. Horizontal track translate, momentum-style sequencing.                    |
| `fade`       | Clean opacity swap — outgoing hits zero before incoming appears.                   |
| `crossfade`  | Outgoing and incoming transition opacity in parallel; brief overlap, cinematic.    |

`animationEasing` accepts any CSS timing function (`'ease'`, `'linear'`, `'ease-in-out'`, `'cubic-bezier(...)'`).

**Demo Gradient Palette** *(showcase-internal, defined in `domma-showcase.css`)*:

Nine reusable decorative gradients available for demo panels — carousels, hero placeholders, anywhere a vivid block of colour is wanted without sourcing an image. **Not part of the public framework API** — use Domma's theme variables for production styling.

| Class                       | Direction | Stops                                                       |
|-----------------------------|-----------|-------------------------------------------------------------|
| `.demo-gradient-aurora-1`   | 135°      | `#6a11cb` → `#2575fc` (amethyst → electric blue)            |
| `.demo-gradient-aurora-2`   | 135°      | `#ee0979` → `#ff6a00` (magenta → molten orange)             |
| `.demo-gradient-aurora-3`   | 135°      | `#00c9ff` → `#92fe9d` (arctic teal → fresh moss)            |
| `.demo-gradient-dusk-1`     | 135°      | `#0f2027` → `#203a43` → `#2c5364` (midnight → slate, 3-stop) |
| `.demo-gradient-dusk-2`     | 135°      | `#5614b0` → `#dbd65c` (imperial purple → pollen gold)       |
| `.demo-gradient-dusk-3`     | 135°      | `#ff512f` → `#dd2476` (cinnamon flame → deep ruby)          |
| `.demo-gradient-pop-1`      | 135°      | `#0061ff` → `#60efff` (electric blue → cyan)                |
| `.demo-gradient-pop-2`      | 135°      | `#11998e` → `#38ef7d` (deep mint → emerald)                 |
| `.demo-gradient-pop-3`      | 135°      | `#f7971e` → `#ffd200` (sunshine → amber); ships with dark text + light text-shadow |

The three palettes are organised by mood: **aurora** for vivid high-saturation pairings, **dusk** for cinematic atmospheric blends, **pop** for bright energetic combinations. Apply any class to a `.carousel-slide` or arbitrary panel.

**Example:**

```html
<div class="carousel">
    <div class="carousel-track">
        <div class="carousel-slide">
            <img src="image1.jpg" alt="Slide 1">
        </div>
        <div class="carousel-slide">
            <img src="image2.jpg" alt="Slide 2">
        </div>
    </div>
    <button class="carousel-arrow carousel-prev">‹</button>
    <button class="carousel-arrow carousel-next">›</button>
    <div class="carousel-indicators">
        <button class="carousel-indicator"></button>
        <button class="carousel-indicator"></button>
    </div>
</div>
```

---

## Dialog

Modal dialog overlay (used by Domma.elements.dialog API).

**Base Classes:**

- `.dm-dialog-container` - Z-index wrapper
- `.dm-dialog-overlay` - Full-screen backdrop
- `.dm-dialog-animate` - Entrance animation
- `.dm-dialog-closing` - Exit animation

**Animations:**

- `dm-dialog-fade-in` / `dm-dialog-fade-out`
- `dm-dialog-slide-in` / `dm-dialog-slide-out`

**Note:** Typically controlled via JavaScript API, not manually constructed.

---

## Sidebar

Fixed sidebar navigation.

**Base Class:** `.sidebar`

**Structure:**

- `.sidebar-header` - Section title
- `.sidebar-nav` - Navigation list
- `.sidebar-link` - Navigation item
- `.sidebar-link.active` - Active link
- `.sidebar-toggle` - Mobile menu button

**Related:**

- `.showcase-content` - Main content offset for sidebar

**Example:**

```html
<aside class="sidebar">
    <div class="sidebar-header">Navigation</div>
    <nav class="sidebar-nav">
        <a href="#" class="sidebar-link active">Home</a>
        <a href="#" class="sidebar-link">About</a>
    </nav>
</aside>
```

---

## Usage Notes

### Loading Elements.css

Always load `elements.css` after `domma.css` and `grid.css`:

```html
<link rel="stylesheet" href="path/to/domma.css">
<link rel="stylesheet" href="path/to/grid.css">
<link rel="stylesheet" href="path/to/elements.css">
<link rel="stylesheet" href="path/to/domma-themes.css">
```

### Theme Support

All components use CSS variables defined in `domma.css` and themed in `domma-themes.css`. Components automatically adapt
to light/dark themes.

### Customization

To customize components:

1. **Override CSS variables** in `domma-themes.css`
2. **Add custom classes** in your own stylesheet
3. **Extend components** by combining base classes

**Example:**

```css
/* Custom button variant */
.btn-custom {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}
```

### JavaScript Integration

Many components work with Domma's JavaScript API:

- **Modal:** `Domma.elements.modal()`
- **Tabs:** `Domma.elements.tabs()`
- **Accordion:** `Domma.elements.accordion()`
- **Carousel:** `Domma.elements.carousel()`
- **Tooltip:** `Domma.elements.tooltip()`

See the main Domma documentation for JavaScript API details.

---

## Component Count

**Total:** 19 UI components
**Total Lines:** ~1,800 lines of CSS
**File Size:** ~50KB (unminified)

## Browser Support

All components support:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Related Documentation

- [Main CLAUDE.md](/CLAUDE.md) - Framework overview
- [Showcase CLAUDE.md](../CLAUDE.md) - Showcase guidelines
- [Grid System](./grid.css) - Layout utilities
- [Themes](../../dist/themes/) - Color schemes
