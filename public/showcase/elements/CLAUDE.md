# CLAUDE.md - Elements Module Showcase

This file provides guidance for working with UI Elements component showcases.

## Elements Module Overview

Accessed via `Domma.elements` - provides 25+ UI components including modals, tabs, carousels, and more.

## Available Components

### Interactive Components

- **Modal** - Dialog overlays
- **Slideover** - Panel overlays that slide from screen edges
- **Tabs** - Tabbed content panels
- **Accordion** - Collapsible content sections
- **Carousel** - Image/content sliders
- **Tooltip** - Hover/click tooltips
- **Dropdown** - Dropdown menus
- **Toast** - Notification messages
- **Dialog** - Alert/confirm/prompt (Promise-based)

### Form Components

- **Autocomplete** - Intelligent suggestion dropdown
- **Pillbox** - Multi-select tag input
- **ButtonGroup** - Radio/checkbox button groups

### Navigation Components

- **Navbar** - Responsive navigation bar
- **Breadcrumbs** - Navigation trail
- **BackToTop** - Scroll-to-top button

### Feedback Components

- **Loader** - Loading indicators
- **Badge** - Status badges
- **DesktopNotification** - Browser notifications

### Tools Components

- **Timer** - Countdown timer
- **Alarm** - Scheduled alerts
- **Editor** - Content editor (in tools bundle)
- **ThemeRoller** - Theme customiser (in tools bundle)
- **PageRoller** - Page builder (in tools bundle)

### Layout Components

- **Card** - Content cards
- **hero** - Hero sections (CSS-only)

## Component Usage Patterns

### Modal Example

**⚠️ Important:** Domma modals use a **flat HTML structure** - do NOT use Bootstrap's `.modal-dialog` and
`.modal-content` wrappers!

```html
<!-- ✅ CORRECT: Domma structure -->
<div id="modal" class="modal">
  <div class="modal-header">
    <h5 class="modal-title">Title</h5>
    <button class="modal-close">&times;</button>
  </div>
  <div class="modal-body">Content</div>
  <div class="modal-footer">Buttons</div>
</div>

<!-- ❌ WRONG: Bootstrap structure -->
<div class="modal">
  <div class="modal-dialog">      <!-- DON'T USE -->
    <div class="modal-content">   <!-- DON'T USE -->
      ...
```

```javascript
const modal = Domma.elements.modal('#modal', {
    backdrop: true,
    backdropClose: true,
    keyboard: true,
    animation: true,
    onOpen: () => console.log('Opened'),
    onClose: () => console.log('Closed')
});

// Control modal
modal.open();
modal.close();
modal.toggle();

if (modal.isOpen()) {
    console.log('Modal is open');
}
```

### Slideover Example

```javascript
// Factory method (recommended)
const slideover = Domma.elements.slideover({
    title: 'Settings Panel',
    content: '<p>Panel content goes here.</p>',
    position: 'right',  // 'left', 'right', 'top', 'bottom'
    size: 'lg',         // 'sm', 'md', 'lg', 'xl', 'full', or custom (e.g., '400px')
    backdrop: true,
    backdropClose: true,
    keyboard: true,
    onOpen: () => console.log('Opened'),
    onClose: () => console.log('Closed')
});

// Control slideover
slideover.open();
slideover.close();
slideover.toggle();
slideover.isOpen();

// Modify on the fly
slideover.setTitle('New Title');
slideover.setContent('<p>Updated content</p>');
slideover.setSize('md');
slideover.setPosition('left');
```

### Tabs Example

```javascript
const tabs = Domma.elements.tabs('#tabs', {
    activeIndex: 0,
    animation: true,
    onChange: (index) => console.log('Tab:', index)
});

// Control tabs
tabs.show(1);  // Show tab by index
tabs.next();
tabs.prev();
const active = tabs.getActive();
```

### Autocomplete Example

```javascript
const autocomplete = Domma.elements.autocomplete('#search', {
    data: ['Apple', 'Banana', 'Cherry', 'Date'],
    minChars: 1,
    maxResults: 10,
    highlightMatches: true,
    onSelect: (value) => {
        console.log('Selected:', value);
    }
});

// Or async data source
const autocomplete2 = Domma.elements.autocomplete('#search', {
    dataSource: async (query) => {
        const response = await Domma.http.get(`/api/search?q=${query}`);
        return response.results;
    }
});
```

### Dialog Example (Promise-based)

```javascript
// Alert
await Domma.elements.alert('Operation successful!');

// Confirm
const confirmed = await Domma.elements.confirm('Are you sure?');
if (confirmed) {
    // User clicked OK
}

// Prompt
const name = await Domma.elements.prompt('Enter your name:');
if (name) {
    console.log('Name:', name);
}
```

## Configuration Engine Integration

Components can be initialized via `$.setup()`:

```javascript
$.setup({
    '#my-modal': {
        component: 'modal',
        options: {
            backdrop: true,
            keyboard: true
        },
        events: {
            click: (e, $el) => {
                // Handle click
            }
        }
    }
});
```

**Supported Components (16):**
`card`, `modal`, `tabs`, `accordion`, `tooltip`, `carousel`, `dropdown`, `badge`, `backToTop`, `buttonGroup`, `loader`,
`breadcrumbs`, `navbar`, `notification`, `timer`, `alarm`

**Not Supported via Config:**
`toast`, `dialog`, `hero`, `autocomplete`, `pillbox`, `slideover`, `editor`, `themeRoller`, `pageRoller`

## Showcase Example Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Component Name - Domma Showcase</title>
    <link rel="stylesheet" href="../../../../dist/domma-theme.css">
</head>
<body>
    <div class="container">
        <h1>Component Name Showcase</h1>

        <div class="demo-section">
            <h2>Basic Example</h2>
            <button id="open-btn" class="btn">Open Component</button>

            <!-- Component HTML here -->
        </div>
    </div>

    <script src="../../../../dist/domma.min.js"></script>
    <script>
        // Initialize component
        const component = Domma.elements.componentName('#selector', {
            // Options here
        });

        // Add interaction
        $('#open-btn').on('click', () => {
            component.open();
        });
    </script>
</body>
</html>
```

## Individual Component Guides

Each UI component has its own showcase folder with examples:

- `modal/` - Modal dialog examples
- `slideover/` - Slideover panel examples
- `tabs/` - Tabbed interface examples
- `accordion/` - Accordion panel examples
- `carousel/` - Carousel slider examples
- `tooltip/` - Tooltip examples
- `autocomplete/` - Autocomplete input examples
- `pillbox/` - Multi-select tag input examples
- `breadcrumbs/` - Navigation trail examples
- `navbar/` - Navigation bar examples
- `loader/` - Loading indicator examples
- `timer/` - Countdown timer examples
- `alarm/` - Scheduled alert examples
- `editor/` - Content editor examples
- `...` and 12+ more

Refer to individual component folders for detailed examples and usage patterns.

## Common Patterns

### Form with Validation and Feedback

```javascript
const form = $('#signup-form');
const loader = Domma.elements.loader('#form-container', {
    type: 'spinner',
    overlay: true
});

form.on('submit', async function(e) {
    e.preventDefault();

    loader.show();

    try {
        const data = {
            username: $('#username').val(),
            email: $('#email').val()
        };

        await Domma.http.post('/api/signup', data);

        loader.hide();
        await Domma.elements.alert('Account created successfully!');

    } catch (error) {
        loader.hide();
        await Domma.elements.alert('Error: ' + error.message);
    }
});
```

### Wizard/Multi-Step Form

```javascript
const tabs = Domma.elements.tabs('#wizard', {
    activeIndex: 0
});

$('#next-btn').on('click', () => {
    tabs.next();
});

$('#prev-btn').on('click', () => {
    tabs.prev();
});
```

### Notification System

```javascript
function notify(title, message, type = 'info') {
    // Desktop notification
    if (Notification.permission === 'granted') {
        Domma.elements.notify(title, {
            body: message,
            icon: '/icon.png'
        });
    }

    // Toast notification
    Domma.elements.toast(message, {
        type: type,
        duration: 3000
    });
}

notify('Success', 'Operation completed', 'success');
```

## Guidelines for Element Showcases

1. **Interactive demos** - Let users interact with components
2. **Multiple variants** - Show different configurations
3. **Integration examples** - Demonstrate with other modules
4. **Real-world scenarios** - Show practical use cases
5. **Accessibility** - Ensure keyboard navigation works
6. **Responsive** - Test on different screen sizes
7. **Theme-aware** - Works with light/dark themes

## Related Documentation

- [Showcase Meta Guide](../CLAUDE.md)
- [Core Modules](../../../src/CLAUDE.md)
- [API Reference](../../../docs/API.md)
- [Config Engine](../config/CLAUDE.md)
