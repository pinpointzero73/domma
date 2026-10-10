---
title: Card
description: "Flexible content containers with optional headers, footers, hover effects, and collapsible functionality"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Card" tagline="Flexible content containers with optional headers, footers, hover effects, and collapsible functionality" align="center"][/hero]

## Overview

Cards are flexible content containers that display information in a structured, visually appealing format. They're one of the most versatile UI components, perfect for showcasing products, articles, user profiles, or any grouped content.

### Key Features

- Flexible content structure with optional header, body, and footer
- Hover effects with lift animation and shadow enhancement
- Clickable cards that act as interactive links
- Theme-aware styling with automatic light/dark mode support
- Customisable shadows, borders, and spacing

### When to Use Cards

- **Content Collections**: Blog posts, products, team members, portfolio items
- **Dashboards**: Statistics widgets, activity feeds, metric displays
- **Navigation**: Feature highlights, service offerings, call-to-action blocks
- **Forms**: Multi-step wizards, settings panels, grouped inputs

### Basic Usage

```javascript
// Option 1: Enhance existing HTML
<div id="my-card" class="card">
    <div class="card-header">Card Header</div>
    <div class="card-body">
        <h3 class="card-title">Card Title</h3>
        <p class="card-text">Card content goes here.</p>
    </div>
    <div class="card-footer">Card Footer</div>
</div>

const card = Domma.elements.card('#my-card', {
    hover: true,
    clickable: false
});

// Option 2: Generate HTML from options (NEW!)
const generatedCard = Domma.elements.card('#container', {
    title: 'Card Title',
    icon: 'info',
    content: '<p>Card content goes here.</p>',
    collapsible: true
});
```

## Quick Start

Get started with a basic card in seconds. Cards work with pure CSS (no JavaScript required), but you can enhance them with hover effects using the Card component.

### CSS-Only Card (No JavaScript)

```html
<div class="card">
    <div class="card-body">
        <h3 class="card-title">Simple Card</h3>
        <p class="card-text">This card requires no JavaScript.</p>
    </div>
</div>
```

[showcase-demo id="showcase/elements/card/css-only-card-no-javascript" title="CSS-Only Card (No JavaScript)" /]

### Card with Hover Effect (JavaScript)

```javascript
// HTML
<div id="hover-card" class="card">
    <div class="card-body">
        <h3 class="card-title">Hover Me</h3>
        <p class="card-text">Move your cursor over this card.</p>
    </div>
</div>

// JavaScript
Domma.elements.card('#hover-card', { hover: true });
```

[showcase-demo id="showcase/elements/card/card-with-hover-effect-javascript" title="Card with Hover Effect (JavaScript)" /]

## Step-by-Step Tutorial

Learn how to build an interactive product card from scratch, step by step.

### Step 1: HTML Structure

Start with the basic card structure using semantic class names:

```html
<div id="product-card" class="card">
    <div class="card-body">
        <h3 class="card-title">Product Name</h3>
        <p class="card-text">Brief description of the product.</p>
    </div>
</div>
```

### Step 2: Add Header and Footer

Expand the structure with a header (for images or badges) and footer (for actions):

```html
<div id="product-card" class="card">
    <div class="card-header">
        <span class="badge badge-primary">New</span>
    </div>
    <div class="card-body">
        <h3 class="card-title">Premium Headphones</h3>
        <p class="card-text">High-quality wireless headphones with noise cancellation.</p>
        <p class="card-text"><strong>£149.99</strong></p>
    </div>
    <div class="card-footer">
        <button class="btn btn-primary">Add to Cart</button>
    </div>
</div>
```

### Step 3: Enable Hover Effect

Add the hover effect to make the card interactive:

```javascript
const productCard = Domma.elements.card('#product-card', {
    hover: true  // Enables lift animation on hover
});
```

### Step 4: Make It Clickable

Turn the entire card into a clickable link:

```javascript
const productCard = Domma.elements.card('#product-card', {
    hover: true,
    clickable: true,
    onClick: (event) => {
        console.log('Card clicked!');
        window.location.href = '/product/premium-headphones';
    }
});
```

### Step 5: Complete Working Demo

Here's the finished interactive product card:

[showcase-demo id="showcase/elements/card/complete-working-demo" title="Step 5: Complete Working Demo" /]

## Examples & Variations

### Example 1: Basic Card

Simple card with title and content:

[showcase-demo id="showcase/elements/card/basic-card" title="Example 1: Basic Card" /]

### Example 2: Card with Hover Effect

Card that lifts on hover with enhanced shadow:

[showcase-demo id="showcase/elements/card/card-with-hover-effect" title="Example 2: Card with Hover Effect" /]

### Example 3: Clickable Card

Entire card acts as a button:

[showcase-demo id="showcase/elements/card/clickable-card" title="Example 3: Clickable Card" /]

### Example 4: Styled Card (Primary)

Card with primary colour border:

[showcase-demo id="showcase/elements/card/styled-card-primary" title="Example 4: Styled Card (Primary)" /]

### Example 5: Profile Card

User profile with avatar and actions:

[showcase-demo id="showcase/elements/card/profile-card" title="Example 5: Profile Card" /]

### Example 6: Statistics Card

Dashboard metric with icon:

[showcase-demo id="showcase/elements/card/statistics-card" title="Example 6: Statistics Card" /]

### Example 7: Horizontal Card

Card with side-by-side layout:

[showcase-demo id="showcase/elements/card/horizontal-card" title="Example 7: Horizontal Card" /]

### Example 8: Grid of Cards

Multiple cards in a responsive grid:

[showcase-demo id="showcase/elements/card/grid-of-cards" title="Example 8: Grid of Cards" /]

### Example 9: Collapsible Card

Card with collapsible content. Click the header to toggle, state persists via localStorage:

[showcase-demo id="showcase/elements/card/collapsible-card" title="Example 9: Collapsible Card" /]

## Accent Cards

The `.card-accent` variant adds a prominent left border to highlight a card without changing its background colour. It is theme-aware - the border colour updates automatically when the theme changes. Five colour modifiers are available.

### Example 1: Basic Accent Card

Left border using the primary theme colour (`.card-accent`):

[showcase-demo id="showcase/elements/card/basic-accent-card" title="Example 1: Basic Accent Card" /]

```
<div class="card card-accent">
  <div class="card-body">
    <h3 class="card-title">Accent Card</h3>
    <p class="card-text">Content here</p>
  </div>
</div>
```

### Example 2: Colour Variants

Four semantic colour modifiers map to the standard status design tokens:

[showcase-demo id="showcase/elements/card/colour-variants" title="Example 2: Colour Variants" /]

```
<div class="card card-accent-success">...</div>
<div class="card card-accent-danger">...</div>
<div class="card card-accent-warning">...</div>
<div class="card card-accent-info">...</div>
```

### Example 3: Accent + Hover

Combine `.card-accent` with `.card-hover` for an interactive card that lifts on hover while keeping the accent border:

[showcase-demo id="showcase/elements/card/accent-hover" title="Example 3: Accent + Hover" /]

```
<div class="card card-accent card-hover">
  <div class="card-body">...</div>
</div>
```

### Example 4: Full Card Structure

Accent works seamlessly with the full header/body/footer structure:

[showcase-demo id="showcase/elements/card/full-card-structure" title="Example 4: Full Card Structure" /]

```
<div class="card card-accent">
  <div class="card-header">Deployment Status</div>
  <div class="card-body">Build #1,042 passed all tests.</div>
  <div class="card-footer">Deployed 2 minutes ago</div>
</div>
```

### Example 5: Practical - Notification Cards

A real-world pattern: status-aware notification cards using colour variants to convey urgency at a glance:

[showcase-demo id="showcase/elements/card/practical-notification-cards" title="Example 5: Practical - Notification Cards" /]

### Example 6: JS Generation

Pass `color: 'accent'` to generate an accent card via the JavaScript API. The existing `card-${color}` pattern means no extra code is needed:

[showcase-demo id="showcase/elements/card/js-generation" title="Example 6: JS Generation" /]

```
// color: 'accent' produces .card-accent automatically
E.card('#accent-js-card', {
    title: 'Generated Accent Card',
    icon: 'star',
    color: 'accent',
    content: '<p>Generated via JavaScript with color: "accent".</p>',
    collapsible: true
});
```

## HTML Generation (DataCard-style)

The Card component can now generate its HTML structure automatically from options, perfect for creating cards dynamically from data. This provides a "DataCard"-style API while maintaining backwards compatibility with existing HTML-based usage.

### Example 1: Generated Card with Title and Content

Create a card entirely from JavaScript options:

```javascript
Domma.elements.card('#generated-card', {
    title: 'Generated Card',
    content: '<p>This card was created entirely from JavaScript options.</p>',
    collapsible: true
});
```

[showcase-demo id="showcase/elements/card/generated-card-with-title-and-content" title="Example 1: Generated Card with Title and Content" /]

### Example 2: Card with Icon

Add an icon to the card title:

```javascript
Domma.elements.card('#icon-card', {
    title: 'Settings',
    icon: 'settings',
    content: '<p>Configure your application settings here.</p>',
    collapsible: true
});
```

[showcase-demo id="showcase/elements/card/card-with-icon" title="Example 2: Card with Icon" /]

### Example 3: Colored Card Variant

Apply a color variant to the card:

```javascript
Domma.elements.card('#colored-card', {
    title: 'Important Notice',
    icon: 'alert',
    color: 'primary',
    content: '<p>This card uses the primary color variant.</p>',
    collapsible: true
});
```

[showcase-demo id="showcase/elements/card/colored-card-variant" title="Example 3: Colored Card Variant" /]

### Example 4: Initially Collapsed Card

Create a card that starts collapsed:

```javascript
Domma.elements.card('#collapsed-card', {
    title: 'Click to Expand',
    icon: 'info',
    collapsed: true,
    collapsible: true,
    content: '<p>This card was initially collapsed.</p>'
});
```

[showcase-demo id="showcase/elements/card/initially-collapsed-card" title="Example 4: Initially Collapsed Card" /]

### Example 5: Programmatic Control

Control card state with JavaScript methods:

```javascript
const card = Domma.elements.card('#controlled-card', {
    title: 'Controlled Card',
    icon: 'box',
    collapsible: true,
    content: '<p>Use the buttons to control this card.</p>'
});

// Control methods
$('#expand-btn').on('click', () => card.expand());
$('#collapse-btn').on('click', () => card.collapse());
$('#toggle-btn').on('click', () => card.toggle());
```

[showcase-demo id="showcase/elements/card/programmatic-control" title="Example 5: Programmatic Control" /]

### Example 6: Dynamic Content Updates

Update card content dynamically using setContent():

```javascript
const card = Domma.elements.card('#dynamic-card', {
    title: 'Dynamic Content',
    icon: 'refresh',
    collapsible: true,
    content: '<p>Click the button to update this content.</p>'
});

$('#update-btn').on('click', () => {
    const timestamp = new Date().toLocaleTimeString();
    card.setContent(`<p>Content updated at ${timestamp}</p>`);
    card.updateHeight(); // Adjust height after content change
});
```

[showcase-demo id="showcase/elements/card/dynamic-content-updates" title="Example 6: Dynamic Content Updates" /]

### Example 7: Loading Data into Generated Cards

Perfect for dashboard widgets that load data asynchronously:

```javascript
// Create card with loading state
const statsCard = Domma.elements.card('#stats-card', {
    title: 'User Statistics',
    icon: 'database',
    collapsible: true,
    content: '<div class="text-center">Loading...</div>'
});

// Simulate async data load
setTimeout(() => {
    const content = `
        <div class="grid grid-cols-2 gap-3">
            <div><strong>Total Users:</strong> 1,234</div>
            <div><strong>Active:</strong> 987</div>
            <div><strong>New Today:</strong> 42</div>
            <div><strong>Growth:</strong> +12%</div>
        </div>
    `;
    statsCard.setContent(content);
    statsCard.updateHeight();
}, 1500);
```

[showcase-demo id="showcase/elements/card/loading-data-into-generated-cards" title="Example 7: Loading Data into Generated Cards" /]

### Backwards Compatibility

The enhancement is fully backwards compatible. Existing HTML-based card usage continues to work:

```javascript
// Still works - enhances existing HTML
<div id="existing-card" class="card">
    <div class="card-body">Existing HTML</div>
</div>

Domma.elements.card('#existing-card', { hover: true });
```

The Card component automatically detects whether to generate HTML (when `title` or `content` options are provided) or enhance existing HTML.

## Best Practices

### Accessibility

- **Semantic Structure**: Use proper heading hierarchy (h1-h6) within card content
- **Clickable Cards**: If the entire card is clickable, add `role="button"` or wrap in an ``[tag with meaningful `aria-label`]()

### Performance

- **Lazy Initialisation**: Only initialise hover/click effects on cards that need them
- **Event Delegation**: For grids with many cards, consider single parent event listener instead of individual listeners
- **Destroy Instances**: Call `card.destroy()` when removing cards from DOM to prevent memory leaks
- **CSS-First Approach**: Use CSS classes (e.g., `.card-hover`) when JavaScript isn't needed
- **Debounce Hover**: For expensive hover effects, consider debouncing the animation triggers

### Common Gotchas

[table striped="true"]
| Issue | Solution |
| --- | --- |
| Hover effect not working | Ensure you're calling `elements.card()` with `hover: true`. CSS-only cards don't have hover effects unless you add `.card-hover` class manually. |
| Card stretching in grid | Cards in CSS Grid will stretch by default. Add `align-self: start` or use `height:
                        100%` on cards for equal-height rows. |
| Click events not firing | Check z-index of child elements. Buttons/links inside cards may intercept clicks. Use `event.stopPropagation()` on child elements if needed. |
| Theme colours not applying | Ensure `domma-themes.css` is loaded and a theme class (e.g., `.dm-theme-charcoal-dark`) is on `                        
                      `. |
[/table]

### Tips & Tricks

- **Loading States**: Combine cards with the Loader component for skeleton screens
- **Animations**: Stagger card entrance animations for visual interest (use CSS `animation-delay`)
- **Equal Heights**: Use CSS Grid or Flexbox on the parent to create equal-height card rows
- **Responsive Images**: Use `object-fit: cover` for card header images to maintain aspect ratio
- **Truncation**: Limit card text with CSS: `display: -webkit-box;
                    -webkit-line-clamp: 3; overflow: hidden;`
- **Integration**: Cards work great inside Modals, Tabs, and Accordion panels

## API Reference

### Constructor Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `hover` | Boolean | `false` | Enable hover lift effect with enhanced shadow |
| `clickable` | Boolean | `false` | Make the entire card clickable |
| `onClick` | Function | `null` | Callback function when card is clicked (requires `clickable: true`) |
| `collapsible` | Boolean | `false` | Enable collapsible functionality with header click to toggle |
| `collapsed` | Boolean | `false` | Initial collapsed state (requires `collapsible: true`) |
| `persistKey` | String | `null` | localStorage key for persisting collapsed state |
| `onCollapse` | Function | `null` | Callback when card is collapsed |
| `onExpand` | Function | `null` | Callback when card is expanded |
| `title` | String | `null` | Card title (triggers HTML generation if provided) |
| `icon` | String | `null` | Icon name to display next to title |
| `content` | String | `''` | Card body HTML content (triggers HTML generation if `title` or `content` provided) |
| `color` | String | `null` | Color variant (e.g., 'primary', 'secondary', 'success') |
[/table]

### Methods

[table striped="true"]
| Method | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `expand()` | None | this | Expand a collapsed card |
| `collapse()` | None | this | Collapse an expanded card |
| `toggle()` | None | this | Toggle between collapsed and expanded states |
| `isCollapsed()` | None | Boolean | Returns true if card is currently collapsed |
| `setContent(content)` | String (HTML) | this | Update the card body content (HTML is sanitized) |
| `getBody()` | None | HTMLElement | Get the card body element |
| `updateHeight()` | None | this | Recalculate card height after dynamic content changes |
| `destroy()` | None | void | Removes event listeners and cleans up the card instance |
[/table]

### Events

[table striped="true"]
| Event | Parameters | Description |
| --- | --- | --- |
| `onClick` | `event: MouseEvent` | Fired when a clickable card is clicked |
[/table]

### CSS Classes

[table striped="true"]
| Class | Description |
| --- | --- |
| `.card` | Base card container with background, border, and shadow |
| `.card-header` | Optional top section with subtle background |
| `.card-body` | Main content area with padding |
| `.card-footer` | Optional bottom section with subtle background |
| `.card-title` | Primary heading within card body |
| `.card-title-icon` | Icon displayed next to card title |
| `.card-subtitle` | Secondary heading with muted colour |
| `.card-text` | Body text with appropriate line-height |
| `.card-hover` | CSS-only hover effect (alternative to JavaScript) |
| `.card-primary` | Card with primary colour border and themed header |
| `.card-accent` | Left border highlight using the primary theme colour (`--dm-primary`) |
| `.card-accent-success` | Left border in the success colour (`--dm-success`) |
| `.card-accent-danger` | Left border in the danger colour (`--dm-danger`) |
| `.card-accent-warning` | Left border in the warning colour (`--dm-warning`) |
| `.card-accent-info` | Left border in the info colour (`--dm-info`) |
| `.card-collapsible` | Enables collapsible functionality with smooth transitions |
| `.card-collapsed` | Applied when card is in collapsed state |
[/table]

## Hybrid CSS + JavaScript

Cards work beautifully with pure CSS, but you can enhance them with JavaScript for dynamic content loading, filtering, sorting, animations, and interactive features using Domma's declarative configuration.

### Dynamic Content Loading

```javascript
$.setup({
    '#product-grid': {
        events: {
            ready: async (e, $container) => {
                // Load products from API
                const products = await Domma.http.get('/api/products');

                // Render cards
                const html = _.map(products, product => `
                    <div class="card card-hover">
                        <img src="${product.image}" alt="${product.name}" class="card-img-top">
                        <div class="card-body">
                            <h4 class="card-title">${product.name}</h4>
                            <p class="card-text">${_.truncate(product.description, { length: 100 })}</p>
                            <div class="card-footer">
                                <span class="price">$${product.price}</span>
                                <button class="btn btn-primary btn-sm"
                                        data-id="${product.id}">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');

                $container.html(html);
            },

            'click [data-id]': (e) => {
                const productId = $(e.currentTarget).attr('data-id');
                // Add to cart logic
                Domma.elements.toast.success('Added to cart!');
            }
        }
    }
});
```

### Filterable Card Grid

```javascript
$.setup({
    '#blog-grid': {
        initial: {
            data: { posts: [], filteredPosts: [], activeCategory: 'all' }
        },
        events: {
            ready: async (e, $el) => {
                const posts = await Domma.http.get('/api/posts');
                $el.data('posts', posts);
                $el.data('filteredPosts', posts);
                renderCards($el, posts);
            },

            'click [data-category]': (e, $el) => {
                const category = $(e.currentTarget).attr('data-category');
                const allPosts = $el.data('posts');

                // Filter posts
                const filtered = category === 'all'
                    ? allPosts
                    : _.filter(allPosts, { category });

                $el.data('activeCategory', category);
                $el.data('filteredPosts', filtered);

                // Update UI
                $('.category-filter').removeClass('active');
                $(e.currentTarget).addClass('active');

                // Render with animation
                $('.cards-container').fadeOut(200, function() {
                    renderCards($el, filtered);
                    $(this).fadeIn(200);
                });
            }
        }
    }
});

function renderCards($container, posts) {
    const html = _.map(posts, post => `
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">${post.title}</h4>
                <p class="card-text">${_.truncate(post.excerpt, { length: 120 })}</p>
                <a href="/post/${post.slug}" class="btn btn-outline">Read More</a>
            </div>
        </div>
    `).join('');

    $container.find('.cards-container').html(html);
}
```

### Sortable Cards

```javascript
$.setup({
    '#team-grid': {
        initial: {
            data: { members: [] }
        },
        events: {
            ready: async (e, $el) => {
                const members = await Domma.http.get('/api/team');
                $el.data('members', members);
                renderTeam($el, members);
            },

            'change #sort-by': (e, $el) => {
                const sortBy = $(e.target).val();
                const members = $el.data('members');

                // Sort with utils
                const sorted = sortBy === 'name'
                    ? _.sortBy(members, 'name')
                    : _.orderBy(members, ['role', 'name'], ['asc', 'asc']);

                renderTeam($el, sorted);
            }
        }
    }
});

function renderTeam($container, members) {
    const html = _.map(members, member => `
        <div class="card text-center">
            <img src="${member.avatar}" alt="${member.name}"
                 class="card-img-top" class="team-member-avatar">
            <div class="card-body">
                <h4 class="card-title">${member.name}</h4>
                <p class="card-text">${member.role}</p>
            </div>
        </div>
    `).join('');

    $container.find('.team-container').html(html);
}
```

### Interactive Card Actions

```javascript
$.setup({
    '.product-card': {
        component: 'card',
        options: { hover: true, clickable: true },
        events: {
            click: (e, $card) => {
                const productId = $card.attr('data-product');
                window.location.href = `/product/${productId}`;
            },

            'click .btn-favorite': (e) => {
                e.stopPropagation(); // Don't trigger card click

                const $btn = $(e.currentTarget);
                const $card = $btn.closest('.card');
                const productId = $card.attr('data-product');

                // Toggle favorite
                $btn.toggleClass('active');
                const isFavorite = $btn.hasClass('active');

                Domma.http.post('/api/favorites', { productId, favorite: isFavorite })
                    .then(() => {
                        Domma.elements.toast.success(
                            isFavorite ? 'Added to favorites' : 'Removed from favorites'
                        );
                    });
            },

            'mouseenter': (e, $card) => {
                $card.find('.quick-actions').fadeIn(200);
            },

            'mouseleave': (e, $card) => {
                $card.find('.quick-actions').fadeOut(200);
            }
        }
    }
});
```

### Benefits of Hybrid Approach

- **Performance** - CSS handles layout instantly, JS loads dynamic content
- **Flexibility** - Static cards + dynamic data = powerful combination
- **Interactivity** - Filtering, sorting, actions enhance UX
- **Maintainability** - Centralized logic with $.setup()

### CSS-Only vs CSS+JS Hybrid

CSS-Only (Static)

```html
<div class="card">
    <img src="image.jpg"
         class="card-img-top"
         alt="Product">
    <div class="card-body">
        <h4 class="card-title">
            Static Product
        </h4>
        <p class="card-text">
            Fixed content
        </p>
        <a href="#" class="btn">
            View
        </a>
    </div>
</div>

<!-- No dynamic content -->
```

CSS+JS Hybrid (Dynamic)

```html
<div id="products">
    <!-- Cards loaded via JS -->
</div>

<script>
$.setup({
    '#products': {
        events: {
            ready: async (e, $el) => {
                const products = await
                    Domma.http.get('/api/products');

                const html = _.map(products, p => `
                    <div class="card">
                        ...
                    </div>
                `).join('');

                $el.html(html);
            }
        }
    }
});
</script>
```

## CSS Customisation

Override these CSS variables to customise Card appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-card-bg` | `var(--dm-surface)` | Card background colour |
| `--dm-card-border` | `var(--dm-border)` | Card border colour |
| `--dm-card-shadow` | `var(--dm-shadow)` | Card shadow intensity |
| `--dm-radius-lg` | `0.5rem` | Card corner radius |
| `--dm-surface` | `var(--dm-white)` | General surface colour (inherited) |
| `--dm-primary` | `var(--dm-blue-600)` | Primary colour for `.card-primary` and `.card-accent` |
| `--dm-success` | *theme-defined* | Accent border colour for `.card-accent-success` |
| `--dm-danger` | *theme-defined* | Accent border colour for `.card-accent-danger` |
| `--dm-warning` | *theme-defined* | Accent border colour for `.card-accent-warning` |
| `--dm-info` | *theme-defined* | Accent border colour for `.card-accent-info` |
[/table]

### Example Override

```css
:root {
    /* Dark card theme */
    --dm-card-bg: #1e293b;
    --dm-card-border: #334155;
    --dm-card-shadow: 0 10px 15px rgba(0,0,0,0.3);

    /* Or flat design */
    --dm-card-shadow: none;
    --dm-radius-lg: 0;
}
```

[]()[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

Cards work great with these complementary components:

### Modal

Display cards within modals for detailed views or forms.

### Tabs

Organise cards into tabbed sections for categorised content.

### Accordion

Use cards as accordion items for collapsible content.

### Loader

Add loading states to cards for async content.
