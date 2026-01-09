# CLAUDE.md - Sidebar Component Showcase

This file provides guidance for working with the Sidebar component showcase.

## Component Overview

The Sidebar component provides a full-featured navigation sidebar with unlimited depth nesting, mobile responsiveness, and theme support.

**Location:** `Domma.elements.sidebar(selector, options)`

## Key Features

1. **Unlimited Depth Nesting** - Recursive submenu rendering supports infinite navigation depth
2. **Mobile Responsive** - Slide-out drawer with overlay on mobile devices
3. **State Persistence** - Remember expanded menus using localStorage
4. **Flexible Positioning** - Left/right alignment, fixed/static, custom width
5. **Theme Variants** - Light and dark themes
6. **Icon Support** - Integrated with Domma icon system
7. **Badges** - Show counts or status indicators
8. **Dividers & Headings** - Organize navigation sections
9. **Active State Management** - Highlight current section
10. **Callback Events** - `onItemClick`, `onToggle`, `onExpand`, `onCollapse`

## Usage Patterns

### Basic Sidebar

```javascript
const sidebar = Domma.elements.sidebar('#sidebar', {
    position: 'left',
    fixed: true,
    width: '250px',
    header: {
        title: 'Navigation',
        toggle: true
    },
    items: [
        { text: 'Dashboard', url: '/', icon: 'layout', section: 'dashboard' },
        { text: 'Users', url: '/users', icon: 'users', section: 'users' }
    ],
    variant: 'dark',
    activeSection: 'dashboard'
});
```

### Nested Navigation

```javascript
items: [
    {
        text: 'Products',
        icon: 'box',
        items: [                      // Level 2
            { text: 'All Products', url: '#' },
            {
                text: 'Advanced',
                items: [                // Level 3
                    { text: 'Import', url: '#' },
                    {
                        text: 'Tools',
                        items: [        // Level 4 (unlimited depth!)
                            { text: 'Bulk Edit', url: '#' }
                        ]
                    }
                ]
            }
        ]
    }
]
```

### Item Types

```javascript
items: [
    // Regular link
    { text: 'Dashboard', url: '/', icon: 'layout', section: 'dashboard' },

    // With badge
    { text: 'Inbox', url: '/inbox', icon: 'mail', badge: '12' },

    // Divider
    { divider: true },

    // Section heading
    { heading: 'ADMIN' },

    // Nested menu
    {
        text: 'Settings',
        icon: 'settings',
        items: [/* sub-items */]
    }
]
```

### State Persistence

```javascript
Domma.elements.sidebar('#sidebar', {
    persistExpanded: true,
    persistKey: 'my-app-sidebar',  // Unique key for this sidebar
    items: [/* ... */]
});
```

Expanded menus will be remembered across page reloads using localStorage.

### Admin Panel Pattern

```javascript
// Typical admin panel setup
Domma.elements.sidebar('#admin-sidebar', {
    position: 'left',
    fixed: true,
    width: '250px',
    top: '60px',              // Below navbar
    header: {
        title: 'Admin Panel',
        toggle: true
    },
    items: [
        { text: 'Overview', url: '/admin/', icon: 'layout', section: 'overview' },
        { text: 'Users', url: '/admin/users/', icon: 'users', section: 'users' },
        { text: 'Settings', url: '/admin/settings/', icon: 'settings', section: 'settings' }
    ],
    variant: 'dark',
    collapsible: true,
    activeSection: 'overview',
    onItemClick: (item, path, event) => {
        console.log('Navigating to:', item.text);
    }
});
```

### Dynamic Updates

```javascript
const sidebar = Domma.elements.sidebar('#sidebar', {/* ... */});

// Change active section
sidebar.setActive('users');

// Replace all items
sidebar.setItems(newItems);

// Add item
sidebar.addItem({ text: 'New Item', url: '#', icon: 'plus' }, 0);

// Remove item
sidebar.removeItem(2);

// Expand/collapse all
sidebar.expandAll();
sidebar.collapseAll();

// Mobile toggle
sidebar.toggle();
sidebar.open();
sidebar.close();
```

## Configuration Engine Integration

```javascript
$.setup({
    '#my-sidebar': {
        component: 'sidebar',
        options: {
            variant: 'dark',
            items: [/* ... */],
            activeSection: 'home'
        }
    }
});
```

## CSS Classes

The component generates these CSS classes:

- `.sidebar` - Base container
- `.sidebar-fixed` - Fixed positioning
- `.sidebar-left` / `.sidebar-right` - Position variants
- `.sidebar-dark` / `.sidebar-light` - Theme variants
- `.sidebar-header` - Header section
- `.sidebar-nav` - Navigation container
- `.sidebar-menu` - Menu list
- `.sidebar-item` - Item wrapper
- `.sidebar-link` - Clickable link
- `.sidebar-icon` - Icon element
- `.sidebar-text` - Text element
- `.sidebar-badge` - Badge element
- `.sidebar-chevron` - Expand/collapse arrow
- `.sidebar-submenu` - Nested menu container
- `.sidebar-divider` - Separator line
- `.sidebar-heading` - Section heading
- `.sidebar-footer` - Footer section
- `.sidebar-overlay` - Mobile backdrop
- `.sidebar.open` - Mobile open state
- `.sidebar-item.has-children` - Has nested items
- `.sidebar-item.open` - Expanded state
- `.sidebar-link.active` - Active state

## Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `position` | String | 'left' | 'left' or 'right' |
| `fixed` | Boolean | true | Fixed or static positioning |
| `width` | String | '250px' | Sidebar width |
| `top` | String | '0' | Top offset (e.g., '60px') |
| `header` | Object | null | { title, toggle, icon } |
| `items` | Array | [] | Navigation items |
| `footer` | Object | null | { text, html } |
| `variant` | String | 'dark' | 'light' or 'dark' |
| `collapsible` | Boolean | true | Mobile toggle |
| `collapseAt` | Number | 768 | Breakpoint (px) |
| `activeSection` | String | null | Current section |
| `expandedSections` | Array | [] | Initially expanded |
| `persistExpanded` | Boolean | false | Persist state |
| `persistKey` | String | null | localStorage key |
| `animationDuration` | Number | 200 | Animation ms |
| `onItemClick` | Function | null | Click callback |
| `onToggle` | Function | null | Toggle callback |
| `onExpand` | Function | null | Expand callback |
| `onCollapse` | Function | null | Collapse callback |

## Methods Reference

| Method | Description |
|--------|-------------|
| `open()` | Open sidebar (mobile) |
| `close()` | Close sidebar (mobile) |
| `toggle()` | Toggle sidebar (mobile) |
| `isOpen()` | Check if open |
| `setActive(section)` | Set active section |
| `setItems(items)` | Replace items |
| `addItem(item, index)` | Add item |
| `removeItem(index)` | Remove item |
| `expandAll()` | Expand all menus |
| `collapseAll()` | Collapse all menus |
| `destroy()` | Clean up component |

## Common Use Cases

### 1. Admin Dashboard Navigation

Fixed left sidebar with icon navigation, nested menus, and active state tracking.

### 2. Documentation Site

Multi-level navigation tree with persistence to remember user's expanded sections.

### 3. Application Menu

Mobile-responsive app navigation with badges for notifications.

### 4. Settings Panel

Grouped settings options with dividers and section headings.

## Best Practices

1. **Use sections** - Assign unique `section` identifiers for active state management
2. **Persist state** - Enable `persistExpanded` for complex navigation structures
3. **Icon consistency** - Use the same icon library throughout
4. **Keep depth reasonable** - While unlimited, 3-4 levels is usually optimal for UX
5. **Mobile first** - Test mobile toggle behavior
6. **Accessibility** - Ensure keyboard navigation works

## Related Components

- **Navbar** - Top navigation bar (complements sidebar)
- **Footer** - Bottom page footer
- **Breadcrumbs** - Navigation trail
- **Tabs** - Alternative navigation pattern

## Related Documentation

- [Elements Showcase](../elements/CLAUDE.md)
- [Showcase Meta Guide](../CLAUDE.md)
- [API Reference](../../docs/API.md)
