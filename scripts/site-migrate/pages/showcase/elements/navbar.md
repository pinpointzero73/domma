---
title: Navbar
description: "Responsive navigation bar with branding, links, dropdowns, and mobile hamburger menu"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Navbar" tagline="Responsive navigation bar with branding, links, dropdowns, and mobile hamburger menu" align="center"][/hero]

## Overview

Navbars provide primary navigation for your application. They display branding, navigation links, dropdown menus, and action buttons in a responsive bar that collapses to a hamburger menu on mobile devices. Domma's Navbar component supports light, dark, and transparent variants, along with fixed and sticky positioning.

### Key Features

- **Brand Section** - Logo, text, and link to homepage
- **Navigation Links** - Primary navigation menu items
- **Dropdown Menus** - Nested navigation for complex sites
- **Action Buttons** - Call-to-action buttons on right side
- **Mobile Responsive** - Hamburger menu with collapse behaviour
- **Theme Variants** - Light, dark, and transparent styles
- **Positioning** - Static, fixed, or sticky positioning

### When to Use Navbars

- **Primary Navigation** - Main site navigation header
- **Application Header** - Dashboard or admin panel navigation
- **Landing Pages** - Marketing site headers
- **Documentation Sites** - API or product documentation navigation

### Basic Usage

```
<!-- HTML Container -->
<nav id="main-nav"></nav>

<!-- JavaScript Initialisation -->
<script>
const navbar = Domma.elements.navbar('#main-nav', {
    brand: {
        text: 'My App',
        logo: '/logo.svg',
        url: '/'
    },
    items: [
        { text: 'Home', url: '/', active: true },
        { text: 'About', url: '/about' },
        { text: 'Contact', url: '/contact' }
    ],
    variant: 'light',
    collapsible: true
});
</script>
```

## Quick Start

Get started with Navbars in seconds. Here's the simplest implementation:

### Basic Light Navbar

Simple navbar with brand and links:

[showcase-demo id="showcase/elements/navbar/basic-light-navbar" title="Basic Light Navbar" /]

```
<nav id="navbar"></nav>

<script>
Domma.elements.navbar('#navbar', {
    brand: { text: 'Domma' },
    items: [
        { text: 'Home', url: '#', active: true },
        { text: 'Features', url: '#' },
        { text: 'Pricing', url: '#' }
    ]
});
</script>
```

### With Action Button

Add a call-to-action button on the right:

[showcase-demo id="showcase/elements/navbar/with-action-button" title="With Action Button" /]

```
Domma.elements.navbar('#navbar', {
    brand: { text: 'Domma' },
    items: [
        { text: 'Home', url: '#' },
        { text: 'Docs', url: '#' }
    ],
    actions: [
        { text: 'Sign Up', variant: 'primary', url: '#' }
    ]
});
```

## Step-by-Step Tutorial

Let's build a complete application navbar with branding, navigation links, a dropdown menu, and action buttons.

### Step 1: Create the HTML Container

Start with a nav element:

```
<nav id="app-navbar"></nav>
```

### Step 2: Add Brand and Basic Links

Initialise with brand and navigation items:

```
const appNav = Domma.elements.navbar('#app-navbar', {
    brand: {
        text: 'My SaaS App',
        logo: '/assets/logo.svg',
        url: '/'
    },
    items: [
        { text: 'Dashboard', url: '/dashboard', active: true },
        { text: 'Analytics', url: '/analytics' },
        { text: 'Settings', url: '/settings' }
    ]
});
```

### Step 3: Add a Dropdown Menu

Create a nested dropdown for related items:

```
const appNav = Domma.elements.navbar('#app-navbar', {
    brand: { text: 'My SaaS App', url: '/' },
    items: [
        { text: 'Dashboard', url: '/dashboard', active: true },
        { text: 'Analytics', url: '/analytics' },
        {
            text: 'Resources',
            items: [  // Dropdown menu
                { text: 'Documentation', url: '/docs' },
                { text: 'API Reference', url: '/api' },
                { text: 'Support', url: '/support' }
            ]
        },
        { text: 'Settings', url: '/settings' }
    ]
});
```

### Step 4: Add Action Buttons

Include call-to-action buttons on the right side:

```
const appNav = Domma.elements.navbar('#app-navbar', {
    brand: { text: 'My SaaS App', url: '/' },
    items: [...],
    actions: [
        { text: 'Upgrade', variant: 'outline', url: '/upgrade' },
        { text: 'Account', variant: 'primary', url: '/account' }
    ]
});
```

### Step 5: Handle Navigation Clicks

Add click callback to handle navigation:

```
const appNav = Domma.elements.navbar('#app-navbar', {
    brand: { text: 'My SaaS App', url: '/' },
    items: [...],
    actions: [...],
    onItemClick: (item, index, event) => {
        event.preventDefault();
        console.log('Navigate to:', item.text, item.url);

        // Update active state
        appNav.setActive(index);

        // Custom navigation logic
        navigateToPage(item.url);
    }
});
```

### Step 6: Complete Working Demo

Try the complete navbar with all features:

[showcase-demo id="showcase/elements/navbar/complete-working-demo" title="Step 6: Complete Working Demo" /]

## Examples & Variations

### Theme Variants

Light, dark, and transparent navbar styles:

[showcase-demo id="showcase/elements/navbar/theme-variants" title="Theme Variants" /]

```
// Light variant (default)
Domma.elements.navbar('#nav', {
    variant: 'light',
    brand: { text: 'App' },
    items: [...]
});

// Dark variant
Domma.elements.navbar('#nav', {
    variant: 'dark',
    brand: { text: 'App' },
    items: [...]
});

// Transparent variant (no background)
Domma.elements.navbar('#nav', {
    variant: 'transparent',
    brand: { text: 'App' },
    items: [...]
});
```

### With Logo Image

Include logo alongside or instead of text:

[showcase-demo id="showcase/elements/navbar/with-logo-image" title="With Logo Image" /]

```
Domma.elements.navbar('#nav', {
    brand: {
        logo: 'https://via.placeholder.com/32x32/2563eb/ffffff?text=D',
        text: 'Domma',
        url: '#'
    },
    items: [
        {text: 'Home', url: '#'},
        {text: 'About', url: '#'}
    ]
});
```

### Dropdown Menus

Multi-level navigation with nested items:

[showcase-demo id="showcase/elements/navbar/dropdown-menus" title="Dropdown Menus" /]

```
Domma.elements.navbar('#nav', {
    brand: { text: 'App' },
    items: [
        { text: 'Home', url: '#' },
        {
            text: 'Products',
            items: [
                { text: 'Product A', url: '#' },
                { text: 'Product B', url: '#' },
                { text: 'Product C', url: '#' }
            ]
        },
        {
            text: 'Resources',
            items: [
                { text: 'Docs', url: '#' },
                { text: 'Blog', url: '#' },
                { text: 'Support', url: '#' }
            ]
        }
    ]
});
```

### Multiple Action Buttons

Add primary, secondary, or outline buttons on the right:

[showcase-demo id="showcase/elements/navbar/multiple-action-buttons" title="Multiple Action Buttons" /]

```
Domma.elements.navbar('#nav', {
    brand: { text: 'SaaS App' },
    items: [
        { text: 'Features', url: '#' },
        { text: 'Pricing', url: '#' }
    ],
    actions: [
        { text: 'Login', variant: 'outline', url: '/login' },
        { text: 'Sign Up', variant: 'primary', url: '/signup' }
    ]
});
```

### Fixed and Sticky Positioning

Keep navbar visible while scrolling:

[showcase-demo id="showcase/elements/navbar/fixed-and-sticky-positioning" title="Fixed and Sticky Positioning" /]

### Mobile Hamburger Menu

Automatically collapses to hamburger menu on mobile (resize browser to test):

[showcase-demo id="showcase/elements/navbar/mobile-hamburger-menu" title="Mobile Hamburger Menu" /]

```
Domma.elements.navbar('#nav', {
    brand: { text: 'Responsive App' },
    items: [
        { text: 'Home', url: '#'},
        { text: 'Features', url: '#'},
        { text: 'Pricing', url: '#'},
        { text: 'Contact', url: '#'}
    ],
    collapsible: true,  // Enable hamburger menu (default)
    collapseAt: 993     // Breakpoint in pixels (default 993)
});
```

### Programmatic Control

Update navbar dynamically via JavaScript:

[showcase-demo id="showcase/elements/navbar/programmatic-control" title="Programmatic Control" /]

```
const navbar = Domma.elements.navbar('#nav', {
    brand: { text: 'App' },
    items: [
        { text: 'Home', url: '#', active: true },
        { text: 'About', url: '#'},
        { text: 'Contact', url: '#'}
    ]
});

// Set active item by index
navbar.setActive(1);  // Make "About" active

// Update all items
navbar.setItems([
    { text: 'Dashboard', url: '/dashboard', active: true },
    { text: 'Profile', url: '/profile'}
]);

// Control mobile menu
navbar.expand();         // Show mobile menu
navbar.collapse();       // Hide mobile menu
navbar.toggle();         // Toggle mobile menu
navbar.isCollapsed();    // Check state → true/false
```

### Real-World Example: Documentation Site

Complete navbar for a documentation website:

[showcase-demo id="showcase/elements/navbar/real-world-example-documentation-site" title="Real-World Example: Documentation Site" /]

```
Domma.elements.navbar('#docs-navbar', {
    brand: {
        logo: 'https://via.placeholder.com/32x32/2563eb/ffffff?text=D',
        text: 'API Docs',
        url: '#'
    },
    items: [
        { text: 'Home', url: '#', active: true },
        {
            text: 'Getting Started',
            items: [
                { text: 'Installation', url: '#'},
                { text: 'Quick Start', url: '#'},
                { text: 'Configuration', url: '#'}
            ]
        },
        {
            text: 'API Reference',
            items: [
                { text: 'Elements', url: '#'},
                { text: 'Utilities', url: '#'},
                { text: 'Models', url: '#'}
            ]
        },
        { text: 'Examples', url: '#'}
    ],
    actions: [
        { text: 'GitHub', variant: 'outline', url: '#'}
    ],
    variant: 'light',
    position: 'static'
});
```

## Best Practices

### Accessibility

- **Semantic HTML** - Navbar automatically uses ```` element with `role="navigation"`
- **ARIA Expanded** - Mobile toggle button includes `aria-expanded` state for screen readers
- **Keyboard Navigation** - All links and buttons are keyboard accessible via Tab key
- **Focus Visible** - Ensure focus rings are visible for keyboard users (don't remove outline)
- **Descriptive Labels** - Toggle button has `aria-label="Toggle navigation"`
- **Skip Link** - Consider adding a skip navigation link for keyboard users to bypass navbar

### Performance

- **Single Instance** - Only create one navbar instance per page, reuse for updates
- **Lazy Dropdowns** - Dropdown menus only activate on click, not on hover for better mobile UX
- **Debounce Resize** - Component debounces window resize events to prevent excessive re-renders
- **CSS Transitions** - Uses CSS for animations, not JavaScript, for GPU acceleration
- **Event Delegation** - Uses single event listener for all navigation links

### Common Gotchas

- **Issue:** Fixed navbar covers page content  
 **Solution:** Add `padding-top` to `` equal to navbar height (~60px)  
 **Example:** `body { padding-top: 60px; }`
- **Issue:** Dropdown menu cut off by container  
 **Solution:** Ensure navbar container doesn't have `overflow: hidden`  
 **Example:** Remove restrictive overflow styles from parent elements
- **Issue:** Mobile menu not appearing  
 **Solution:** Check that viewport width is below `collapseAt` breakpoint (default 768px)  
 **Example:** Test on device or resize browser to mobile width
- **Issue:** Active state not updating  
 **Solution:** Use `setActive(index)` to programmatically update active item  
 **Example:** `navbar.setActive(2)` to activate third item
- **Issue:** Logo image not displaying  
 **Solution:** Verify logo URL is correct and image is accessible  
 **Example:** Check browser console for 404 errors

### Tips & Tricks

- **Sticky Positioning** - Use `position: 'sticky'` for better UX than fixed (allows scrolling past navbar initially)
- **Dark Mode** - Use `variant: 'dark'` for dark theme sites
- **Logo + Text** - Include both logo and text in brand for better recognition
- **Limit Top-Level Items** - Keep 5-7 top-level items max, use dropdowns for more
- **Mobile-First Actions** - Place most important action button first in actions array
- **Prevent Default** - In `onItemClick`, call `event.preventDefault()` to handle navigation via JavaScript

```
<!-- Accessible Navbar with Skip Link -->
<a href="#main-content" class="skip-link">Skip to main content</a>
<nav id="main-nav"></nav>
<main id="main-content">
    <!-- Page content -->
</main>

<style>
/* .skip-link is a Domma utility (domma.css): hidden until focused, then pinned top left */

/* Fixed navbar body padding */
body {
    padding-top: 60px;
}
</style>

<script>
Domma.elements.navbar('#main-nav', {
    brand: {
        logo: 'https://via.placeholder.com/32x32/2563eb/ffffff?text=D',
        text: 'Accessible App',
        url: '/'
    },
    items: [
        { text: 'Home', url: '/', active: true },
        { text: 'Features', url: '/features' },
        {
            text: 'Resources',
            items: [
                { text: 'Installation', url: '/docs/install' },
                { text: 'Quick Start', url: '/docs/quickstart' },
                { text: 'Configuration', url: '/docs/config' }
            ]
        }
    ],
    actions: [
        { text: 'Sign Up', variant: 'primary', url: '/signup' }
    ],
    variant: 'light',
    position: 'fixed',
    onItemClick: (item, index, event) => {
        event.preventDefault();
        // Handle navigation with proper focus management
        navigateToPage(item.url);
    }
});
</script>
```

## API Reference

### Constructor Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `brand` | Object | `null` | Brand configuration: `{ text, logo, url }`. All properties optional |
| `items` | Array | `[]` | Navigation items. Each: `{ text, url, active, items }`. Nested `items` array creates dropdown |
| `position` | String | `'static'` | Navbar position: `'static'`, `'fixed'` (top of viewport), or `'sticky'` (sticks when scrolled to top) |
| `variant` | String | `'light'` | Colour variant: `'light'` (white bg), `'dark'` (dark bg), or `'transparent'` (no bg) |
| `collapsible` | Boolean | `true` | Enable mobile hamburger menu collapse behaviour |
| `collapseAt` | Number | `993` | Viewport width (px) below which the navbar collapses to a hamburger menu. Matches the breakpoint `elements.css` switches the bar to its desktop layout at |
| `appearOnHover` | Boolean | `false` | Desktop only: reveal dropdowns and flyouts on hover. A click *pins* a dropdown open so it survives the pointer moving away; clicking it again, or anywhere outside, releases it |
| `hoverCloseDelay` | Number | `250` | ms of grace once the pointer leaves the bar, so the gap between a toggle and its menu can be crossed without the menu closing. Only used when `appearOnHover` is on |
| `actions` | Array | `[]` | Action buttons on right side. Each: `{ text, url, variant }`. Variant: `'primary'`, `'secondary'`, `'outline'` |
| `onItemClick` | Function | `null` | Callback when navigation item clicked. Receives `(item, index, event)` or `(subItem,
                        subIndex, event, parentItem)` for dropdowns |
[/table]

### Methods

[table striped="true"]
| Method | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `setActive(index)` | Number | this | Set active navigation item by index. Updates visual state and `active` property. Chainable |
| `setItems(items)` | Array | this | Replace all navigation items. Re-renders navbar. Chainable |
| `expand()` | - | this | Expand mobile menu (show navigation items). Only works when navbar is collapsed. Chainable |
| `collapse()` | - | this | Collapse mobile menu (hide navigation items). Only works when navbar is in mobile mode. Chainable |
| `toggle()` | - | this | Toggle mobile menu visibility (expand if collapsed, collapse if expanded). Chainable |
| `isCollapsed()` | - | Boolean | Check if mobile menu is collapsed. Returns `true` if collapsed/hidden, `false` if expanded/visible |
| `destroy()` | - | void | Remove event listeners and clean up. Call before removing navbar from DOM |
[/table]

### Events / Callbacks

[table striped="true"]
| Event | Parameters | Description |
| --- | --- | --- |
| `onItemClick` | `(item, index, event)` | Fired when top-level navigation item clicked.  
 **item:** The clicked item object  
 **index:** Item index in items array  
 **event:** Click event (call `preventDefault()` to prevent default navigation) |
| `onItemClick` | `(subItem, subIndex, event, parentItem)` | Fired when dropdown menu item clicked.  
 **subItem:** The clicked dropdown item  
 **subIndex:** Index within dropdown items  
 **event:** Click event  
 **parentItem:** Parent navigation item containing the dropdown |
[/table]

### CSS Classes

[table striped="true"]
| Class | Description |
| --- | --- |
| `.dm-navbar` | Main navbar container (automatically added) |
| `.dm-navbar-light` | Light variant styling (white background) |
| `.dm-navbar-dark` | Dark variant styling (dark background, white text) |
| `.dm-navbar-transparent` | Transparent variant (no background or border) |
| `.dm-navbar-fixed` | Fixed positioning (stays at top of viewport) |
| `.dm-navbar-sticky` | Sticky positioning (sticks when scrolled to top) |
| `.dm-navbar-brand` | Brand section container (logo + text) |
| `.dm-navbar-toggle` | Mobile hamburger menu button |
| `.dm-navbar-nav` | Navigation items list |
| `.dm-navbar-link` | Individual navigation link |
| `.dm-navbar-dropdown` | Dropdown menu container |
| `.dm-navbar-actions` | Action buttons container (right side) |
| `.active` | Applied to active/current navigation link |
[/table]

```
// Complete API Example
const navbar = Domma.elements.navbar('#nav', {
    brand: {
        text: 'My App',
        logo: '/logo.svg',
        url: '/'
    },
    items: [
        { text: 'Home', url: '/', active: true },
        {
            text: 'Products',
            items: [
                { text: 'Product A', url: '/products/a' },
                { text: 'Product B', url: '/products/b' }
            ]
        }
    ],
    actions: [
        { text: 'Login', variant: 'outline', url: '/login' },
        { text: 'Sign Up', variant: 'primary', url: '/signup' }
    ],
    variant: 'light',
    position: 'sticky',
    collapsible: true,
    collapseAt: 768,
    onItemClick: (item, index, event) => {
        event.preventDefault();
        console.log('Clicked:', item.text);
    }
});

// Methods
navbar.setActive(1);                // Activate second item
navbar.setItems([...]);             // Replace all items
navbar.expand();                    // Show mobile menu
navbar.collapse();                  // Hide mobile menu
navbar.toggle();                    // Toggle mobile menu
const collapsed = navbar.isCollapsed(); // Check state
navbar.destroy();                   // Clean up
```

## Config Engine Integration

Use Domma's declarative `$.setup()` system to configure Navbars without manual initialisation.

### Basic Setup

```
$.setup({
    '#main-nav': {
        component: 'navbar',
        options: {
            brand: { text: 'My App', url: '/' },
            items: [
                { text: 'Home', url: '/', active: true },
                { text: 'About', url: '/about' }
            ],
            variant: 'light'
        }
    }
});
```

### Complete Configuration

```
$.setup({
    '#app-navbar': {
        component: 'navbar',
        options: {
            brand: {
                logo: '/logo.svg',
                text: 'SaaS Platform',
                url: '/'
            },
            items: [
                { text: 'Dashboard', url: '/dashboard', active: true },
                {
                    text: 'Tools',
                    items: [
                        { text: 'Analytics', url: '/tools/analytics' },
                        { text: 'Reports', url: '/tools/reports' }
                    ]
                },
                { text: 'Settings', url: '/settings' }
            ],
            actions: [
                { text: 'Upgrade', variant: 'outline', url: '/upgrade' },
                { text: 'Account', variant: 'primary', url: '/account' }
            ],
            variant: 'dark',
            position: 'sticky',
            onItemClick: (item, index, event) => {
                event.preventDefault();
                navigateToPage(item.url);
            }
        }
    }
});
```

### Live Demo

Navbar configured via Config Engine:

[showcase-demo id="showcase/elements/navbar/live-demo" title="Live Demo" /]

```
// Configuration
$.setup({
    '#config-demo-navbar': {
        component: 'navbar',
        options: {
            brand: { text: 'Config Demo' },
            items: [
                { text: 'Home', url: '#', active: true },
                { text: 'Docs', url: '#'}
            ],
            actions: [
                { text: 'Get Started', variant: 'primary', url: '#'}
            ]
        }
    }
});

// Access instance later
const navbar = Domma.elements.get('#config-demo-navbar');
navbar.setActive(1);
```

## CSS Customisation

Override these CSS variables to customise Navbar appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-navbar-bg` | `var(--dm-surface)` | Navbar background colour |
| `--dm-navbar-text` | `var(--dm-text)` | Navbar text/link colour |
| `--dm-navbar-border` | `var(--dm-border)` | Navbar bottom border |
| `--dm-primary` | `var(--dm-blue-600)` | Active link colour |
| `--dm-hover-bg` | `var(--dm-slate-100)` | Link hover background |
[/table]

### Example Override

```css
:root {
    /* Dark navbar */
    --dm-navbar-bg: #0f172a;
    --dm-navbar-text: #f1f5f9;
    --dm-navbar-border: #1e293b;
    --dm-hover-bg: rgba(255,255,255,0.1);
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/navbar/related-elements" title="Related Elements" /]
