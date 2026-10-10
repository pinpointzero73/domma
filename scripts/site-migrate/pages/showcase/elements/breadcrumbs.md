---
title: Breadcrumbs
description: "Navigation trail showing user's location within site hierarchy with customizable separators and responsive collapse"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Breadcrumbs" tagline="Navigation trail showing user's location within site hierarchy with customizable separators and responsive collapse" align="center"][/hero]

## Overview

Breadcrumbs provide a navigation trail showing the user's location within a site's hierarchy. They help users understand where they are and enable quick navigation back to parent pages. Breadcrumbs are essential for sites with deep navigation structures.

### Key Features

- **Hierarchical Navigation** - Show path from root to current page
- **Multiple Separators** - Choose from /, >, →, chevron, or custom HTML
- **Home Icon** - Optional home icon for first breadcrumb
- **Responsive Collapse** - Auto-collapse middle items on mobile
- **Click Callbacks** - Handle breadcrumb navigation via JavaScript
- **Dynamic Updates** - Add, remove, or replace breadcrumb items

### When to Use Breadcrumbs

- **Multi-Level Sites** - Sites with 3+ levels of hierarchy
- **E-commerce** - Category navigation (Home > Electronics > Phones > iPhone)
- **Documentation** - Section navigation (Docs > API > Elements > Modal)
- **Admin Panels** - Dashboard navigation paths

### Basic Usage

```
<!-- HTML Container -->
<nav id="breadcrumb-nav"></nav>

<!-- JavaScript Initialisation -->
<script>
const breadcrumbs = Domma.elements.breadcrumbs('#breadcrumb-nav', {
    items: [
        { text: 'Home', url: '/' },
        { text: 'Products', url: '/products' },
        { text: 'Electronics', url: '/products/electronics' },
        { text: 'Smartphones', active: true }
    ],
    separator: '/',
    homeIcon: false,
    responsive: true
});
</script>
```

## Quick Start

Get started with Breadcrumbs in seconds. Here's the simplest implementation:

### Basic Breadcrumb Trail

Create a simple breadcrumb navigation:

[showcase-demo id="showcase/elements/breadcrumbs/basic-breadcrumb-trail" title="Basic Breadcrumb Trail" /]

```
<nav id="breadcrumb-nav"></nav>

<script>
Domma.elements.breadcrumbs('#breadcrumb-nav', {
    items: [
        { text: 'Home', url: '#' },
        { text: 'Products', url: '#' },
        { text: 'Widget', active: true }
    ]
});
</script>
```

### With Home Icon

Add a home icon to the first breadcrumb:

[showcase-demo id="showcase/elements/breadcrumbs/with-home-icon" title="With Home Icon" /]

```
Domma.elements.breadcrumbs('#breadcrumb-nav', {
    items: [
        { text: 'Home', url: '#' },
        { text: 'Category', url: '#' },
        { text: 'Item', active: true }
    ],
    homeIcon: true  // Show home icon
});
```

## Step-by-Step Tutorial

Let's build an e-commerce category navigation system with dynamic breadcrumbs that update as users browse.

### Step 1: Create the HTML Structure

Set up a container for breadcrumbs and a category list:

```
<nav id="product-breadcrumbs" aria-label="Breadcrumb navigation"></nav>

<div class="mt-4">
    <h4>Browse Categories:</h4>
    <div id="category-list" class="flex gap-2">
        <button class="btn btn-sm btn-outline" data-category="electronics">Electronics</button>
        <button class="btn btn-sm btn-outline" data-category="clothing">Clothing</button>
        <button class="btn btn-sm btn-outline" data-category="books">Books</button>
    </div>
</div>
```

### Step 2: Initialise Breadcrumbs

Create breadcrumbs with initial home item:

```
const productBreadcrumbs = Domma.elements.breadcrumbs('#product-breadcrumbs', {
    items: [
        { text: 'Home', url: '#' }
    ],
    separator: 'chevron',
    homeIcon: true,
    responsive: true
});
```

### Step 3: Handle Category Navigation

Update breadcrumbs when user clicks a category:

```
$('[data-category]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        const categoryName = e.target.textContent;

        // Add category to breadcrumbs
        productBreadcrumbs.addItem({
            text: categoryName,
            active: true
        });
    });
});
```

### Step 4: Enable Breadcrumb Navigation

Handle clicks on breadcrumbs to navigate back:

```
const productBreadcrumbs = Domma.elements.breadcrumbs('#product-breadcrumbs', {
    items: [{ text: 'Home', url: '#' }],
    separator: 'chevron',
    homeIcon: true,
    onChange: (item, index) => {
        console.log('Navigate to:', item.text);

        // Remove items after clicked breadcrumb
        const items = productBreadcrumbs.getItems();
        const newItems = items.slice(0, index + 1);

        // Mark last item as active
        if (newItems.length > 0) {
            newItems[newItems.length - 1].active = true;
        }

        productBreadcrumbs.setItems(newItems);
    }
});
```

### Step 5: Add Subcategory Navigation

Handle deeper navigation levels:

```
const subcategories = {
    electronics: ['Phones', 'Laptops', 'Tablets'],
    clothing: ['Shirts', 'Trousers', 'Shoes'],
    books: ['Fiction', 'Non-Fiction', 'Comics']
};

// Show subcategories when category selected
function showSubcategories(category) {
    const subs = subcategories[category];
    const html = subs.map(sub =>
        `<button class="btn btn-sm btn-secondary" data-subcategory="${sub}">${sub}</button>`
    ).join('');

    $('#subcategory-list')[0].innerHTML = html;

    // Add event listeners
    $('[data-subcategory]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            productBreadcrumbs.addItem({
                text: e.target.textContent,
                active: true
            });
        });
    });
}
```

### Step 6: Complete Working Demo

Try the complete category navigation system:

[showcase-demo id="showcase/elements/breadcrumbs/complete-working-demo" title="Step 6: Complete Working Demo" /]

## Examples & Variations

### Different Separator Styles

Choose from built-in separators or use custom HTML:

[showcase-demo id="showcase/elements/breadcrumbs/different-separator-styles" title="Different Separator Styles" /]

```
// Slash separator (default)
Domma.elements.breadcrumbs('#nav', {
    items: [...],
    separator: '/'
});

// Angle bracket
Domma.elements.breadcrumbs('#nav', {
    items: [...],
    separator: '>'
});

// Right arrow
Domma.elements.breadcrumbs('#nav', {
    items: [...],
    separator: '→'
});

// Chevron icon (SVG)
Domma.elements.breadcrumbs('#nav', {
    items: [...],
    separator: 'chevron'
});

// Custom HTML
Domma.elements.breadcrumbs('#nav', {
    items: [...],
    separator: '<span style="color: #6495ED;">•</span>'
});
```

### With Home Icon

Add a home icon to the first breadcrumb:

[showcase-demo id="showcase/elements/breadcrumbs/with-home-icon-2" title="With Home Icon" /]

```
Domma.elements.breadcrumbs('#nav', {
    items: [
        { text: 'Home', url: '/' },
        { text: 'Dashboard', url: '/dashboard' },
        { text: 'Settings', active: true }
    ],
    homeIcon: true  // Show home icon on first item
});
```

### Responsive Mobile Collapse

On mobile, middle items collapse to save space (resize browser to test):

[showcase-demo id="showcase/elements/breadcrumbs/responsive-mobile-collapse" title="Responsive Mobile Collapse" /]

```
Domma.elements.breadcrumbs('#nav', {
    items: [
        { text: 'Home', url: '/' },
        { text: 'Products', url: '/products' },
        { text: 'Electronics', url: '/products/electronics' },
        { text: 'Phones', url: '/products/electronics/phones' },
        { text: 'iPhone 15', active: true }
    ],
    responsive: true  // Enable mobile collapse (default)
});

// On mobile (<576px), displays: Home > ... > iPhone 15
```

### Custom Click Handling

Handle breadcrumb clicks with onChange callback:

[showcase-demo id="showcase/elements/breadcrumbs/custom-click-handling" title="Custom Click Handling" /]

```
Domma.elements.breadcrumbs('#nav', {
    items: [
        { text: 'Level 1', url: '#' },
        { text: 'Level 2', url: '#' },
        { text: 'Level 3', active: true }
    ],
    onChange: (item, index, event) => {
        event.preventDefault();  // Prevent default navigation
        console.log('Clicked:', item.text, 'at index:', index);

        // Custom navigation logic
        navigateToLevel(index);
    }
});
```

### Dynamic Breadcrumb Updates

Add, remove, or replace breadcrumb items programmatically:

[showcase-demo id="showcase/elements/breadcrumbs/dynamic-breadcrumb-updates" title="Dynamic Breadcrumb Updates" /]

```
const crumbs = Domma.elements.breadcrumbs('#nav', {
    items: [{ text: 'Home', url: '#' }]
});

// Add a new item
crumbs.addItem({ text: 'New Level', active: true });

// Remove an item by index
crumbs.removeItem(1);

// Replace all items
crumbs.setItems([
    { text: 'Home', url: '#' },
    { text: 'Products', active: true }
]);

// Get current items
const items = crumbs.getItems();
```

### Generate from URL Path

Automatically generate breadcrumbs from current URL:

[showcase-demo id="showcase/elements/breadcrumbs/generate-from-url-path" title="Generate from URL Path" /]

```
// Generate breadcrumbs from URL path
function generateBreadcrumbsFromURL() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s);

    const items = [{ text: 'Home', url: '/' }];

    segments.forEach((segment, index) => {
        const text = segment.charAt(0).toUpperCase() + segment.slice(1);
        const url = '/' + segments.slice(0, index + 1).join('/');
        const active = index === segments.length - 1;

        items.push({ text, url, active });
    });

    return Domma.elements.breadcrumbs('#nav', {
        items,
        separator: 'chevron',
        homeIcon: true
    });
}

// Example: /products/electronics/phones
// Generates: Home > Products > Electronics > Phones
```

### Custom Styling

Apply custom colours and styles:

[showcase-demo id="showcase/elements/breadcrumbs/custom-styling" title="Custom Styling" /]

```
<nav id="breadcrumb-nav" class="text-base text-blue-400"></nav>

<script>
Domma.elements.breadcrumbs('#breadcrumb-nav', {
    items: [
        { text: 'Styled', url: '#' },
        { text: 'Breadcrumbs', active: true }
    ],
    separator: 'chevron'
});
</script>

<!-- Custom CSS -->
<style>
#breadcrumb-nav {
    font-size: 1rem;
    color: #6495ED;
}
</style>
```

### Real-World Example: Documentation Site

Build documentation navigation with nested sections:

[showcase-demo id="showcase/elements/breadcrumbs/real-world-example-documentation-site" title="Real-World Example: Documentation Site" /]

```
const docsStructure = {
    'Getting Started': ['Installation', 'Quick Start', 'Configuration'],
    'API Reference': ['DOM', 'Utils', 'Elements', 'Models'],
    'Elements': ['Modal', 'Tabs', 'Accordion', 'Tooltip']
};

const docsBreadcrumbs = Domma.elements.breadcrumbs('#docs-breadcrumbs', {
    items: [
        { text: 'Documentation', url: '#' },
        { text: 'API Reference', url: '#' },
        { text: 'Elements', url: '#' },
        { text: 'Modal', active: true }
    ],
    separator: 'chevron',
    homeIcon: true,
    onChange: (item, index) => {
        // Navigate to clicked section
        const items = docsBreadcrumbs.getItems();
        const newItems = items.slice(0, index + 1);

        // Mark as active
        newItems[newItems.length - 1].active = true;

        docsBreadcrumbs.setItems(newItems);

        // Update content
        updateDocsContent(item.text);
    }
});

function updateDocsContent(section) {
    $('#docs-content')[0].innerHTML =
        `<h5>Current Section: ${section}</h5>
         <p class="text-sm">Documentation for ${section}...</p>`;
}
```

## Best Practices

### Accessibility

- **Semantic HTML** - Use ```` element with `aria-label="Breadcrumb"` (automatically added)
- **Current Page** - Last breadcrumb has `aria-current="page"` for screen readers
- **Descriptive Text** - Use clear, descriptive labels (avoid "Click here" or generic text)
- **Keyboard Navigation** - All breadcrumb links are keyboard accessible via Tab
- **Skip Links** - Consider adding skip link to bypass breadcrumbs for keyboard users
- **Visual Separators** - Separators have `aria-hidden="true"` to prevent screen reader clutter

### Performance

- **Reuse Instances** - Use `setItems()` to update instead of destroying and recreating
- **Minimal DOM Updates** - Component batches changes when adding multiple items
- **CSS Animations** - Hover effects use CSS transitions, not JavaScript
- **Lazy Loading** - Don't initialise breadcrumbs until page content is ready
- **Debounce Updates** - If updating breadcrumbs frequently, debounce with `_.debounce()`

### Common Gotchas

- **Issue:** Breadcrumbs not appearing  
 **Solution:** Ensure container exists in DOM before initialisation  
 **Example:** Wait for DOMContentLoaded or place script after element
- **Issue:** Last breadcrumb is a link instead of plain text  
 **Solution:** Set `active: true` on last item or omit `url` property  
 **Example:** `{ text: 'Current Page', active: true }`
- **Issue:** onChange callback not firing  
 **Solution:** Callback only fires when clicking non-active breadcrumbs with URLs  
 **Example:** Active/current breadcrumb doesn't trigger onChange
- **Issue:** Custom separator not rendering  
 **Solution:** Use HTML string, not plain text with special chars  
 **Example:** `separator: '•'`
- **Issue:** Responsive collapse not working  
 **Solution:** Ensure viewport meta tag is present and `responsive: true`  
 **Example:** ``

### Tips & Tricks

- **Maximum Depth** - Limit breadcrumbs to 4-5 levels to avoid clutter
- **Mobile First** - Enable `responsive: true` (default) for mobile-friendly collapse
- **Home Icon** - Use `homeIcon: true` for better visual hierarchy
- **Consistent Separators** - Use same separator style across your entire site
- **URL Sync** - Keep breadcrumbs synchronized with browser URL and history
- **Schema Markup** - Add JSON-LD breadcrumb schema for SEO benefits

```
<!-- Accessible Breadcrumbs with Schema Markup -->
<nav id="breadcrumb-nav" aria-label="Breadcrumb navigation"></nav>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Products",
      "item": "https://example.com/products"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Electronics"
    }
  ]
}
</script>

<script>
Domma.elements.breadcrumbs('#breadcrumb-nav', {
    items: [
        { text: 'Home', url: 'https://example.com/' },
        { text: 'Products', url: 'https://example.com/products' },
        { text: 'Electronics', active: true }
    ],
    separator: 'chevron',
    homeIcon: true,
    responsive: true
});
</script>
```

## API Reference

### Constructor Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | Array | `[]` | Array of breadcrumb items. Each item: `{ text, url, active }`. Last item or items with `active: true` render as plain text |
| `separator` | String | `'/'` | Separator between items. Built-in: `'/'`, `'>'`, `'→'`, `'chevron'`. Or custom HTML string |
| `homeIcon` | Boolean | `false` | Show home icon on first breadcrumb item |
| `responsive` | Boolean | `true` | Collapse middle items on mobile (<576px). Shows: First ... Last |
| `onChange` | Function | `null` | Callback when breadcrumb clicked. Receives `(item, index, event)`. Only fires for non-active items |
[/table]

### Methods

[table striped="true"]
| Method | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `setItems(items)` | Array | this | Replace all breadcrumb items. Chainable |
| `addItem(item)` | Object | this | Add new item to end. Automatically marks as active and removes active from previous last item. Chainable |
| `removeItem(index)` | Number | this | Remove item at specified index. Chainable |
| `getItems()` | - | Array | Get copy of current items array |
| `destroy()` | - | void | Remove event listeners and clean up. Call before removing from DOM |
[/table]

### Events / Callbacks

[table striped="true"]
| Event | Parameters | Description |
| --- | --- | --- |
| `onChange` | `(item, index, event)` | Fired when user clicks a breadcrumb link (not active items).  
 **item:** The clicked breadcrumb object  
 **index:** Index in items array  
 **event:** Click event (call `event.preventDefault()` to prevent navigation) |
[/table]

### CSS Classes

[table striped="true"]
| Class | Description |
| --- | --- |
| `.dm-breadcrumbs` | Main container element (automatically added to selector) |
| `.dm-breadcrumbs-responsive` | Added when `responsive: true`. Enables mobile collapse behaviour |
| `.dm-breadcrumb-item` | Individual breadcrumb item (both links and active text) |
| `.dm-breadcrumb-link` | Clickable breadcrumb link element |
| `.dm-breadcrumb-separator` | Separator element between breadcrumbs |
| `.active` | Applied to current/active breadcrumb (last item or items with `active: true`) |
[/table]

```
// Complete API Example
const breadcrumbs = Domma.elements.breadcrumbs('#nav', {
    items: [
        { text: 'Home', url: '/' },
        { text: 'Products', url: '/products' },
        { text: 'Widget', active: true }
    ],
    separator: 'chevron',
    homeIcon: true,
    responsive: true,
    onChange: (item, index, event) => {
        event.preventDefault();
        console.log('Navigate to:', item.text);
    }
});

// Methods
breadcrumbs.addItem({ text: 'Details', active: true });
breadcrumbs.removeItem(2);
breadcrumbs.setItems([
    { text: 'Home', url: '/' },
    { text: 'New Path', active: true }
]);
const items = breadcrumbs.getItems();
breadcrumbs.destroy();
```

## Config Engine Integration

Use Domma's declarative `$.setup()` system to configure Breadcrumbs without manual initialisation.

### Basic Setup

```
$.setup({
    '#page-breadcrumbs': {
        component: 'breadcrumbs',
        options: {
            items: [
                { text: 'Home', url: '/' },
                { text: 'Dashboard', url: '/dashboard' },
                { text: 'Settings', active: true }
            ],
            separator: 'chevron',
            homeIcon: true
        }
    }
});
```

### Multiple Breadcrumb Instances

```
$.setup({
    // Main page breadcrumbs
    '#main-breadcrumbs': {
        component: 'breadcrumbs',
        options: {
            items: [
                { text: 'Home', url: '/' },
                { text: 'Products', active: true }
            ],
            separator: 'chevron',
            homeIcon: true,
            onChange: (item) => {
                window.location.href = item.url;
            }
        }
    },

    // Secondary navigation breadcrumbs
    '#docs-breadcrumbs': {
        component: 'breadcrumbs',
        options: {
            items: [
                { text: 'Documentation', url: '/docs' },
                { text: 'API Reference', active: true }
            ],
            separator: '/',
            responsive: true
        }
    }
});
```

### Live Demo

Breadcrumbs configured via Config Engine:

[showcase-demo id="showcase/elements/breadcrumbs/live-demo" title="Live Demo" /]

```
// Configuration
$.setup({
    '#config-demo-breadcrumbs': {
        component: 'breadcrumbs',
        options: {
            items: [
                { text: 'Config', url: '#' },
                { text: 'Engine', url: '#' },
                { text: 'Demo', active: true }
            ],
            separator: 'chevron',
            homeIcon: true
        }
    }
});

// Access instance later
const breadcrumbs = Domma.elements.get('#config-demo-breadcrumbs');
breadcrumbs.addItem({ text: 'New Level', active: true });
```

## CSS Customisation

Override these CSS variables to customise Breadcrumbs appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-primary` | `var(--dm-blue-600)` | Active link colour |
| `--dm-text-muted` | `var(--dm-slate-500)` | Inactive item colour |
| `--dm-text` | `var(--dm-slate-800)` | Current page text |
| `--dm-font-size-sm` | `0.875rem` | Breadcrumb text size |
[/table]

### Example Override

```css
:root {
    /* Larger breadcrumbs */
    --dm-font-size-sm: 1rem;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/breadcrumbs/related-elements" title="Related Elements" /]
