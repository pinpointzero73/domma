---
title: Footer Component
description: "A responsive footer in three layouts - simple, columns and minimal - with theme variants, for branding, links and social media."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Footer Component" tagline="Flexible, responsive footer with three layout modes (simple, columns, minimal) and theme variants. Perfect for completing your page layout with branding, links, and social media." align="center"][/hero]

[showcase-demo id="showcase/footer/features" title="Features" /]

Add a footer to your page in three simple steps

### Step 1: Add HTML Container

Add a `<footer>` element to your page, typically at the bottom:

```
<body>
    <main class="content">
        <!-- Your page content -->
    </main>

    <footer id="site-footer"></footer>
</body>
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

### Step 3: Initialize the Footer

Call `Domma.elements.footer()` with your content:

```
Domma.elements.footer('#site-footer', {
    layout: 'simple',
    brand: { text: 'My Site' },
    links: [
        { text: 'About', url: '/about' },
        { text: 'Contact', url: '/contact' }
    ],
    copyright: '© 2026 My Site'
});
```

> **Note:** The footer component will automatically generate all HTML structure, styling, and layout. You only need to provide the empty container element and configuration options.

[showcase-demo id="showcase/footer/simple-layout" title="Simple Layout" /]

[showcase-demo id="showcase/footer/columns-layout" title="Columns Layout" /]

[showcase-demo id="showcase/footer/minimal-layout" title="Minimal Layout" /]

[showcase-demo id="showcase/footer/dark-theme-variant" title="Dark Theme Variant" /]

[showcase-demo id="showcase/footer/api-reference" title="API Reference" /]

Use `$.setup()` for declarative initialization

```
$.setup({
    '#site-footer': {
        component: 'footer',
        options: {
            layout: 'columns',
            variant: 'dark',
            brand: { text: 'My App', logo: '/logo.svg' },
            columns: [/* ... */],
            copyright: '© 2026 My App'
        }
    }
});
```
