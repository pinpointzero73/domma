---
title: Sidebar Component
description: "JSON-configurable navigation sidebar with unlimited depth nesting, mobile toggle, and theme variants. Perfect for admin panels, documentation sites, and applications with complex navigation."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Sidebar Component" tagline="JSON-configurable navigation sidebar with unlimited depth nesting, mobile toggle, and theme variants. Perfect for admin panels, documentation sites, and applications with complex navigation." align="center"][/hero]

[showcase-demo id="showcase/sidebar/features" title="Features" /]

Add a sidebar to your page in three simple steps

### Step 1: Add HTML Container

Add an `<aside>` element to your page where you want the sidebar to appear:

```
<aside id="my-sidebar"></aside>

<main class="content">
    <!-- Your page content -->
</main>
```

### Step 2: Include Domma

Add Domma CSS and JavaScript to your page:

```
<!-- CSS -->
<link rel="stylesheet" href="dist/domma.css">
<link rel="stylesheet" href="dist/elements.css">

<!-- JavaScript -->
<script src="dist/domma.min.js"></script>
```

### Step 3: Initialize the Sidebar

Call `Domma.elements.sidebar()` with your navigation items:

```
Domma.elements.sidebar('#my-sidebar', {
    items: [
        { text: 'Home', url: '/', icon: 'home' },
        { text: 'About', url: '/about', icon: 'info' },
        { text: 'Contact', url: '/contact', icon: 'mail' }
    ]
});
```

> **Note:** The sidebar component will automatically generate all HTML structure, styling, and interactivity. You only need to provide the empty container element and configuration options.

[showcase-demo id="showcase/sidebar/basic-example" title="Basic Example" /]

[showcase-demo id="showcase/sidebar/nested-menus" title="Nested Menus" /]

[showcase-demo id="showcase/sidebar/navigation-with-badges" title="Navigation with Badges" /]

[showcase-demo id="showcase/sidebar/light-theme-variant" title="Light Theme Variant" /]

[showcase-demo id="showcase/sidebar/state-persistence" title="State Persistence" /]

[showcase-demo id="showcase/sidebar/api-reference" title="API Reference" /]

Use `$.setup()` for declarative initialization

```
$.setup({
    '#my-sidebar': {
        component: 'sidebar',
        options: {
            variant: 'dark',
            items: [
                { text: 'Home', url: '/', icon: 'home' },
                { text: 'About', url: '/about', icon: 'info' }
            ],
            activeSection: 'home'
        }
    }
});
```
