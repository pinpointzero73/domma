---
title: Number Badge
description: "Notification counters and presence dots - positioned on icons, buttons, or avatars with a clean JavaScript API"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Number Badge" tagline="Notification counters and presence dots - positioned on icons, buttons, or avatars with a clean JavaScript API" align="center"][/hero]

## Overview

Number Badge extends Domma's badge system with positioned notification counters and presence dots. Use CSS-only classes for static indicators, or the JavaScript API to programmatically manage counters on any element - icons, buttons, avatars, and more.

### Key Features

- **CSS-Only** - standalone circular badges and dot indicators, no JS required
- **JS API** - attach and manage counters on any element with `E.numberBadge()`
- **Web Component** - declarative `<domma-number-badge>` with slot support
- **Auto-Hide** - badge hides automatically when count reaches zero
- **Dot Mode** - small presence indicator with no text
- **Pulse Animation** - draw attention with a pulsing ring
- **8 Colour Variants** - matches all Domma semantic colours

### At a Glance

[showcase-demo id="showcase/elements/number-badge/at-a-glance" title="At a Glance" /]

```
// CSS-only counter
<div class="badge-counter-wrapper">
    <button class="btn"><span data-icon="bell"></span></button>
    <span class="badge-counter">5</span>
</div>

// JavaScript API
const nb = E.numberBadge('#bell-btn', { count: 5, variant: 'danger' });
nb.increment();   // → 6
nb.setCount(0);   // badge hides automatically

// Web Component
<domma-number-badge count="5" variant="primary">
    <button class="btn"><span data-icon="bell"></span></button>
</domma-number-badge>
```

## CSS-Only Usage

No JavaScript required. Apply CSS classes directly for static indicators.

### Standalone Number Badges

Add `.badge-number` to any inline element. Single digits are circular; multi-digit numbers expand to a pill shape automatically via `min-width`.

[showcase-demo id="showcase/elements/number-badge/standalone-number-badges" title="Standalone Number Badges" /]

```
<span class="badge-number">3</span>
<span class="badge-number badge-number-primary">7</span>
<span class="badge-number badge-number-success">42</span>
<span class="badge-number badge-number-danger">99</span>
<span class="badge-number badge-number-warning">8</span>
<span class="badge-number badge-number-info">1</span>
```

### Dot Indicators

Add `.badge-dot` for a small presence indicator with no text content - ideal for online/offline status on avatars.

[showcase-demo id="showcase/elements/number-badge/dot-indicators" title="Dot Indicators" /]

```
<span class="badge-dot"></span>
<span class="badge-dot badge-dot-success"></span>
<span class="badge-dot badge-dot-danger"></span>
```

### Positioned Counters

Wrap any element in `.badge-counter-wrapper` and add a sibling `.badge-counter` to position a counter at the top-right corner with a border ring.

[showcase-demo id="showcase/elements/number-badge/positioned-counters" title="Positioned Counters" /]

```
<!-- Notification counter -->
<div class="badge-counter-wrapper">
    <button class="btn"><span data-icon="bell"></span></button>
    <span class="badge-counter">5</span>
</div>

<!-- Presence dot on avatar -->
<div class="badge-counter-wrapper">
    <div class="avatar">JD</div>
    <span class="badge-counter badge-dot badge-counter-success"></span>
</div>

<!-- Colour variant -->
<div class="badge-counter-wrapper">
    <button class="btn">Cart</button>
    <span class="badge-counter badge-counter-danger">12</span>
</div>

<!-- Pulsing counter -->
<div class="badge-counter-wrapper">
    <button class="btn"><span data-icon="bell"></span></button>
    <span class="badge-counter badge-counter-warning badge-pulse">!</span>
</div>
```

## JavaScript API

Use `E.numberBadge(selector, options)` to attach a managed counter to any element. The badge tracks state, auto-shows/hides, and exposes a chainable API.

### Initialisation

```
const nb = E.numberBadge('#bell-btn', {
    count: 5,           // Initial count (default: 0)
    variant: 'danger',  // Colour variant (default: 'danger')
    dot: false,         // Dot mode - no text
    pulse: false,       // Pulse animation
    borderColor: null   // Custom border ring colour
});

nb.increment();         // +1 → 6
nb.decrement();         // -1 → 5
nb.increment(5);        // +5 → 10
nb.setCount(0);         // Hides the badge automatically
nb.setCount(3);         // Shows the badge again
nb.setVariant('info');  // Change colour
nb.setDot(true);        // Switch to dot mode
nb.setPulse(true);      // Enable pulse
nb.getCount();          // → current count
nb.remove();            // Remove badge and restore element
```

### Interactive Demo

[showcase-demo id="showcase/elements/number-badge/interactive-demo" title="Interactive Demo" /]

### Multiple Independent Counters

Each `E.numberBadge()` call creates an independent instance.

[showcase-demo id="showcase/elements/number-badge/multiple-independent-counters" title="Multiple Independent Counters" /]

```
const bellBadge = E.numberBadge('#bell', { count: 3, variant: 'danger' });
const mailBadge = E.numberBadge('#mail', { count: 12, variant: 'primary' });
const cartBadge = E.numberBadge('#cart', { count: 0, variant: 'success' });

bellBadge.increment();
mailBadge.setCount(0);   // Hides automatically
cartBadge.setCount(5);
```

## Web Component

The `<domma-number-badge>` custom element uses Shadow DOM and a `<slot>` to wrap any child content with a positioned counter. Declare it in HTML or create it with JS.

### Declarative Usage

[showcase-demo id="showcase/elements/number-badge/declarative-usage" title="Declarative Usage" /]

```
<!-- Default counter -->
<domma-number-badge count="5">
    <button class="btn"><span data-icon="bell"></span></button>
</domma-number-badge>

<!-- Primary variant -->
<domma-number-badge count="3" variant="primary">
    <button class="btn">Inbox</button>
</domma-number-badge>

<!-- Presence dot on avatar -->
<domma-number-badge dot variant="success">
    <div class="avatar">AB</div>
</domma-number-badge>

<!-- Pulsing counter -->
<domma-number-badge count="7" pulse variant="warning">
    <button class="btn"><span data-icon="bell"></span></button>
</domma-number-badge>
```

### Programmatic API

[showcase-demo id="showcase/elements/number-badge/programmatic-api" title="Programmatic API" /]

```
const badge = document.getElementById('my-badge');

badge.increment();
badge.decrement();
badge.setCount(10);
badge.setVariant('success');
badge.setDot(true);
badge.setPulse(true);
```

## Real-World Patterns

### App Navigation Bar

[showcase-demo id="showcase/elements/number-badge/app-navigation-bar" title="App Navigation Bar" /]

### Inbox with Unread Counts

[showcase-demo id="showcase/elements/number-badge/inbox-with-unread-counts" title="Inbox with Unread Counts" /]

```
<div class="nav-item">
    Inbox <span class="badge-number badge-number-primary">24</span>
</div>
<div class="nav-item">
    Drafts <span class="badge-number badge-number-warning">3</span>
</div>
```

### Online User List

[showcase-demo id="showcase/elements/number-badge/online-user-list" title="Online User List" /]

## Best Practices

### Accessibility

- **aria-live built-in** - The JS API adds `aria-live="polite"` and `role="status"` automatically so screen readers announce count changes.
- **Label the target** - Add descriptive `aria-label` to icon buttons: `aria-label="Notifications, 5 unread"`
- **Dot mode** - Pair dot-only badges with a visible label or tooltip; the dot alone conveys nothing to screen readers.

### Design Guidelines

- **Trust auto-hide** - The badge hides when count reaches 0; resist the urge to show "0"
- **Danger for alerts** - Red counters signal unread/urgent items; use primary/info for neutral counts
- **Pulse sparingly** - Reserve pulse for genuinely urgent alerts; overuse erodes its impact
- **Dot for presence** - Use dot mode for online/away/offline indicators, not for counts

## API Reference

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `count` | number | `0` | Initial counter value |
| `variant` | string | `'danger'` | Colour variant: primary, secondary, success, danger, warning, info, light, dark |
| `dot` | boolean | `false` | Show as a dot (no text) |
| `pulse` | boolean | `false` | Enable pulse animation |
| `borderColor` | string\|null | `null` | Custom border ring colour (overrides theme default) |
[/table]

### Methods

[table striped="true"]
| Method | Returns | Description |
| --- | --- | --- |
| `setCount(n)` | this | Set count to exact value; hides at 0 in non-dot mode |
| `increment(by?)` | this | Increment count by 1 (or by `by`) |
| `decrement(by?)` | this | Decrement count by 1 (or by `by`); minimum 0 |
| `getCount()` | number | Return current count |
| `setVariant(v)` | this | Change colour variant |
| `setDot(bool)` | this | Toggle dot mode on/off |
| `setPulse(bool)` | this | Toggle pulse animation on/off |
| `remove()` | void | Remove counter and restore element to original DOM position |
| `destroy()` | void | Alias for `remove()` |
[/table]

### CSS Classes

[table striped="true"]
| Class | Description |
| --- | --- |
| `.badge-number` | Standalone circular/pill number badge |
| `.badge-number-{variant}` | Colour variant (primary, success, danger, warning, info, secondary, light, dark) |
| `.badge-dot` | Small circular dot indicator (8px) |
| `.badge-dot-{variant}` | Colour variant for dot |
| `.badge-counter-wrapper` | Relative-positioned container for element + counter |
| `.badge-counter` | Absolute-positioned counter at top-right corner |
| `.badge-counter-{variant}` | Colour variant for counter |
| `.badge-pulse` | Apply pulse animation to `.badge-counter` |
| `.badge-counter-hidden` | Hides the counter (applied automatically when count = 0) |
[/table]

## Config Engine

Number Badge is supported in the declarative config engine via `$.setup()`.

```
$.setup({
    '#bell-btn': {
        component: 'numberBadge',
        options: {
            count: 0,
            variant: 'danger'
        }
    }
});
```

## CSS Customisation

Number Badge uses standard Domma semantic colour tokens. Override globally or per-scope.

[table striped="true"]
| Variable | Controls |
| --- | --- |
| `--dm-danger` | Default counter background colour |
| `--dm-primary` | Primary variant colour |
| `--dm-success` | Success variant colour |
| `--dm-background` | Border ring colour (matches page background by default) |
| `--dm-radius-full` | Border radius (9999px = circular/pill) |
[/table]

```
/* Match border ring to a dark card background */
.dark-card .badge-counter {
    border-color: var(--dm-surface-2);
}

/* Larger counter text */
.badge-counter {
    font-size: 0.75rem;
    min-width: 1.5rem;
    height: 1.5rem;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/number-badge/related-elements" title="Related Elements" /]
