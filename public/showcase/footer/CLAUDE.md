# CLAUDE.md - Footer Component Showcase

This file provides guidance for working with the Footer component showcase.

## Component Overview

The Footer component provides a flexible, responsive footer with three layout modes and theme variants, perfect for completing your page layout.

**Location:** `Domma.elements.footer(selector, options)`

## Key Features

1. **Three Layout Modes** - Simple horizontal, multi-column grid, or minimal centered
2. **Theme Variants** - Light, dark, and transparent themes
3. **Flexible Content** - Brand logo, navigation links, social icons, copyright
4. **Fully Responsive** - Mobile-first design adapts to all screen sizes
5. **Icon Integration** - Built-in support for Domma icon system
6. **Position Options** - Static, fixed, or sticky positioning
7. **Grid-Based Columns** - Auto-responsive multi-column layout
8. **Social Media Links** - Integrated social icon rendering

## Usage Patterns

### Simple Layout

```javascript
const footer = Domma.elements.footer('#footer', {
    layout: 'simple',
    variant: 'light',
    brand: {
        text: 'Domma',
        logo: '/assets/logo.svg',
        url: '/'
    },
    links: [
        { text: 'Features', url: '/features' },
        { text: 'Pricing', url: '/pricing' },
        { text: 'About', url: '/about' },
        { text: 'Contact', url: '/contact' }
    ],
    social: [
        { icon: 'github', url: 'https://github.com', label: 'GitHub' },
        { icon: 'twitter', url: 'https://twitter.com', label: 'Twitter' }
    ],
    copyright: '© 2026 Domma. All rights reserved.'
});
```

### Columns Layout

```javascript
Domma.elements.footer('#footer', {
    layout: 'columns',
    variant: 'dark',
    brand: {
        text: 'Domma Framework',
        logo: '/assets/logo.svg'
    },
    columns: [
        {
            title: 'Product',
            links: [
                { text: 'Features', url: '/features' },
                { text: 'Pricing', url: '/pricing' },
                { text: 'Changelog', url: '/changelog' }
            ]
        },
        {
            title: 'Resources',
            links: [
                { text: 'Documentation', url: '/docs' },
                { text: 'API Reference', url: '/api' },
                { text: 'Examples', url: '/examples' }
            ]
        },
        {
            title: 'Company',
            links: [
                { text: 'About', url: '/about' },
                { text: 'Blog', url: '/blog' },
                { text: 'Contact', url: '/contact' }
            ]
        }
    ],
    social: [
        { icon: 'github', url: '#', label: 'GitHub' },
        { icon: 'twitter', url: '#', label: 'Twitter' }
    ],
    copyright: '© 2026 Domma. All rights reserved.'
});
```

### Minimal Layout

```javascript
Domma.elements.footer('#footer', {
    layout: 'minimal',
    variant: 'light',
    copyright: '© 2026 Domma',
    social: [
        { icon: 'github', url: '#', label: 'GitHub' },
        { icon: 'twitter', url: '#', label: 'Twitter' },
        { icon: 'linkedin', url: '#', label: 'LinkedIn' }
    ]
});
```

## Layout Modes

### Simple Layout
- Single horizontal row
- Brand + links + social + copyright
- Best for: Landing pages, marketing sites
- Responsive: Stacks vertically on mobile

### Columns Layout
- Multi-column grid (auto-responsive)
- Organized link sections with titles
- Brand section at top
- Best for: Comprehensive footers with many links
- Responsive: Adjusts columns based on screen size

### Minimal Layout
- Centered content
- Copyright + social icons only
- Best for: Clean, simple pages
- Responsive: Always centered

## Configuration Options

### Brand Object
```javascript
brand: {
    text: 'Company Name',    // Brand text
    logo: '/logo.svg',       // Logo URL (optional)
    url: '/'                 // Link URL (optional)
}
```

### Links Array (Simple Layout)
```javascript
links: [
    { text: 'Link Text', url: '/path' },
    { text: 'Another Link', url: '/another' }
]
```

### Columns Array (Columns Layout)
```javascript
columns: [
    {
        title: 'Column Title',
        links: [
            { text: 'Link 1', url: '/link1' },
            { text: 'Link 2', url: '/link2' }
        ]
    }
]
```

### Social Array
```javascript
social: [
    { icon: 'github', url: 'https://github.com', label: 'GitHub' },
    { icon: 'twitter', url: 'https://twitter.com', label: 'Twitter' }
]
```

### Copyright
```javascript
// String
copyright: '© 2026 Company Name'

// Object with auto year
copyright: {
    text: 'Company Name',
    year: true  // Automatically uses current year
}
```

## Theme Variants

### Light Theme
```javascript
variant: 'light'  // Light background, dark text
```

### Dark Theme
```javascript
variant: 'dark'   // Dark background, light text
```

### Transparent Theme
```javascript
variant: 'transparent'  // Transparent background, inherits text color
```

## Position Options

```javascript
// Static (default) - normal flow
position: 'static'

// Fixed - stays at bottom of viewport
position: 'fixed'

// Sticky - sticks to bottom when scrolling
position: 'sticky'
```

## Dynamic Updates

```javascript
const footer = Domma.elements.footer('#footer', {/* ... */});

// Update brand
footer.setBrand({
    text: 'New Brand',
    logo: '/new-logo.svg',
    url: '/new-home'
});

// Update links
footer.setLinks([
    { text: 'New Link', url: '/new' }
]);

// Update columns
footer.setColumns([
    { title: 'New Column', links: [/* ... */] }
]);

// Update social icons
footer.setSocial([
    { icon: 'linkedin', url: '#', label: 'LinkedIn' }
]);

// Update copyright
footer.setCopyright('© 2026 New Copyright');
```

## Configuration Engine Integration

```javascript
$.setup({
    '#site-footer': {
        component: 'footer',
        options: {
            layout: 'columns',
            variant: 'dark',
            brand: { text: 'My App', logo: '/logo.svg' },
            columns: [
                {
                    title: 'Product',
                    links: [
                        { text: 'Features', url: '/features' },
                        { text: 'Pricing', url: '/pricing' }
                    ]
                }
            ],
            copyright: '© 2026 My App'
        }
    }
});
```

## CSS Classes

The component generates these CSS classes:

- `.footer` - Base container
- `.footer-simple` - Simple layout variant
- `.footer-columns` - Columns layout variant
- `.footer-minimal` - Minimal layout variant
- `.footer-light` - Light theme
- `.footer-dark` - Dark theme
- `.footer-transparent` - Transparent theme
- `.footer-fixed` - Fixed positioning
- `.footer-sticky` - Sticky positioning
- `.footer-brand` - Brand section
- `.footer-brand-logo` - Logo image
- `.footer-brand-text` - Brand text
- `.footer-nav` - Navigation links container
- `.footer-nav-link` - Individual link
- `.footer-columns-content` - Columns grid container
- `.footer-column` - Individual column
- `.footer-column-title` - Column heading
- `.footer-column-links` - Column links list
- `.footer-social` - Social icons container
- `.footer-social-link` - Individual social link
- `.footer-copyright` - Copyright text

## Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | String | 'light' | 'light', 'dark', or 'transparent' |
| `layout` | String | 'simple' | 'simple', 'columns', or 'minimal' |
| `brand` | Object | null | { text, logo, url } |
| `columns` | Array | [] | Multi-column layout |
| `links` | Array | [] | Simple link list |
| `social` | Array | [] | Social media icons |
| `copyright` | String/Object | null | Copyright text or {text, year} |
| `className` | String | '' | Additional CSS classes |
| `position` | String | 'static' | 'static', 'fixed', or 'sticky' |

## Methods Reference

| Method | Description |
|--------|-------------|
| `setBrand(brand)` | Update brand information |
| `setLinks(links)` | Update links array |
| `setColumns(columns)` | Update columns array |
| `setSocial(social)` | Update social links |
| `setCopyright(copyright)` | Update copyright text |
| `destroy()` | Clean up component |

## Common Use Cases

### 1. Marketing Site Footer
Simple layout with brand, quick links, and social media.

### 2. Documentation Site Footer
Columns layout with organized link sections and resources.

### 3. Minimal App Footer
Minimal layout with just copyright and social links.

### 4. Multi-Brand Footer
Use columns to organize links by product or brand.

## Best Practices

1. **Use consistent layout** - Match your site's overall design
2. **Keep it concise** - Don't overwhelm with too many links
3. **Mobile first** - Test on small screens
4. **Icon labels** - Always provide accessible labels for social icons
5. **Copyright current** - Use `{year: true}` for automatic year updates
6. **Theme matching** - Choose variant that complements page theme

## Related Components

- **Navbar** - Top navigation bar (complements footer)
- **Sidebar** - Side navigation panel
- **Breadcrumbs** - Navigation trail

## Related Documentation

- [Elements Showcase](../elements/CLAUDE.md)
- [Showcase Meta Guide](../CLAUDE.md)
- [API Reference](../../docs/API.md)
