---
title: Config Engine
description: "Declarative component initialisation with JSON configuration. Setup once, update anytime, clean up when done."
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Config Engine" tagline="Declarative component initialisation with JSON configuration. Setup once, update anytime, clean up when done." align="center"][/hero]

## Why Config Engine?

[showcase-demo id="showcase/config/why-config-engine" title="Why Config Engine?" /]

## Basic Setup

Initialise multiple components at once with a single configuration object.

```javascript
// Initialise components declaratively
$.setup({
    // Selector: configuration
    '#my-modal': {
        component: 'modal',
        options: { backdrop: true, keyboard: true }
    },

    '.product-card': {
        component: 'card',
        options: { hover: true }
    },

    '#main-tabs': {
        component: 'tabs',
        options: { animation: true, activeIndex: 0 }
    }
});
```

### Supported Components (16 total)

[grid cols="2" gap="3" class="config-component-list"]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]card[/badge]

Content containers with hover and click behaviour.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]modal[/badge]

Overlays for focused tasks and dialogs.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]tabs[/badge]

Switch between panels without leaving the page.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]accordion[/badge]

Expand and collapse groups of content.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]tooltip[/badge]

Small hints beside controls or links.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]carousel[/badge]

Browse a sequence of slides or images.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]dropdown[/badge]

Open menus and choose from a list.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]badge[/badge]

Highlight a status, label or count.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]backToTop[/badge]

Return to the top of a long page.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]buttonGroup[/badge]

Keep related actions or toggles together.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]loader[/badge]

Show progress while content is loading.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]breadcrumbs[/badge]

Show the path to the current page.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]navbar[/badge]

Build the main site navigation.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]notification[/badge]

Show desktop notifications with permission.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]timer[/badge]

Count down and act when time runs out.
[/box]
[/col]
[col]
[box padding="compact" rounded="sm" hover="off" class="h-full"]
[badge variant="primary" pill]alarm[/badge]

Schedule a notification for a set time.
[/box]
[/col]
[/grid]

[→ View complete component reference with live demos](/showcase/config/all-components)

## Event Binding

Bind event handlers directly in configuration using inline functions or action objects.

```javascript
$.setup({
    // Inline function handler
    '#submit-btn': {
        events: {
            click: (e, $el) => {
                e.preventDefault();
                $el.text('Submitted!');
            }
        }
    },

    // Multiple events
    '#search-input': {
        events: {
            focus: (e, $el) => $el.addClass('focused'),
            blur: (e, $el) => $el.removeClass('focused'),
            input: (e, $el) => console.log($el.val())
        }
    },

    // Action objects for declarative changes
    '#theme-toggle': {
        events: {
            click: [
                { toggleClass: 'active' },
                { target: 'body', toggleClass: 'dm-theme-dark' }
            ]
        }
    }
});
```

[showcase-demo id="showcase/config/try-it" title="Try it" /]

## DOMReady Initialisation

The config engine automatically handles DOMContentLoaded, with support for global and per-selector initialisation callbacks.

### Automatic DOMContentLoaded Detection

```javascript
// Config automatically waits for DOM if needed
$.setup({
    '#my-element': {
        component: 'card',
        options: { collapsible: true }
    }
});
// ✅ If DOM is loading: queued for DOMContentLoaded
// ✅ If DOM is ready: executes immediately
```

### Global $init Callback

Use `$init` for code that should run once when all configs are processed:

```javascript
$.setup({
    $init() {
        // Runs once after all selectors are configured
        console.log('Config engine initialised!');
        Domma.icons.scan(); // Scan for icons
        Domma.theme.init(); // Initialise theme
    },

    '#modal': {
        component: 'modal',
        options: { backdrop: true }
    },

    '#tabs': {
        component: 'tabs',
        options: { activeIndex: 0 }
    }
});
```

### Per-Selector init Callbacks

Each selector can have its own initialisation callback that receives the DommaCollection:

```javascript
$.setup({
    '#user-card': {
        init($el) {
            // Runs when this selector is configured
            // Receives DommaCollection as first argument
            console.log('User card initialised:', $el);

            // Fetch and populate data
            const userId = $el.data('user-id');
            loadUserData(userId).then(data => {
                $el.find('.name').text(data.name);
                $el.find('.avatar').attr('src', data.avatar);
            });
        },
        component: 'card',
        options: { hoverable: true }
    },

    '#status-indicator': {
        init($el) {
            // Check server status on init
            checkServerStatus().then(online => {
                $el.addClass(online ? 'online' : 'offline');
            });
        },
        initial: {
            text: 'Checking...'
        }
    }
});
```

### Standalone ready() Helper

For manual DOMReady callbacks outside of config:

```javascript
// Standard method
Domma.ready(() => {
    console.log('DOM is ready!');
    // Your initialisation code
});

// Alias
$.ready(() => {
    console.log('This also works!');
});

// Executes immediately if DOM is already ready
// Otherwise waits for DOMContentLoaded
```

[showcase-demo id="showcase/config/try-it-2" title="Try it" /]

> **Zero Boilerplate:** No need for manual `DOMContentLoaded` listeners. The config engine handles everything automatically!

## Initial State

Set initial properties like CSS, text, HTML, classes, and attributes.

```javascript
$.setup({
    '#welcome-message': {
        initial: {
            text: 'Welcome to Domma!',
            css: { color: 'var(--dm-primary)', fontWeight: 'bold' },
            addClass: 'animated fadeIn'
        }
    },

    '#status-badge': {
        initial: {
            html: 'Online',
            attr: { 'data-status': 'online', 'aria-label': 'Status' }
        }
    },

    '.disabled-section': {
        initial: {
            addClass: 'opacity-50',
            attr: { 'aria-disabled': 'true' }
        }
    }
});
```

### Available Properties

[table striped="true"]
| Property | Description | Example |
| --- | --- | --- |
| `text` | Set text content | `text: 'Hello'` |
| `html` | Set HTML content | `html: 'Bold'` |
| `css` | Apply CSS styles | `css: { color: 'red' }` |
| `addClass` | Add CSS classes | `addClass: 'active highlighted'` |
| `removeClass` | Remove CSS classes | `removeClass: 'hidden'` |
| `toggleClass` | Toggle CSS classes | `toggleClass: 'expanded'` |
| `attr` | Set attributes | `attr: { disabled: true }` |
[/table]

## Runtime Updates

Modify configuration after initialisation with `$.update()`. Changes are deep-merged.

```javascript
// Initial setup
$.setup({
    '#my-modal': {
        component: 'modal',
        options: { backdrop: true, keyboard: true }
    }
});

// Later: update options
$.update('#my-modal', {
    options: { backdrop: false }  // backdrop changed, keyboard preserved
});

// Add new event handlers
$.update('#my-modal', {
    events: {
        click: () => console.log('Modal clicked')
    }
});

// Update initial state
$.update('#status', {
    initial: {
        text: 'Updated status',
        addClass: 'pulse'
    }
});
```

[showcase-demo id="showcase/config/try-it-3" title="Try it" /]

## Configuration Inspection

Retrieve current configuration for debugging or dynamic adjustments.

```javascript
// Get config for specific selector
const modalConfig = $.config('#my-modal');
console.log(modalConfig);
// { component: 'modal', options: { backdrop: true, keyboard: true } }

// Get all configurations
const allConfigs = $.config();
console.log(allConfigs);
// { '#my-modal': {...}, '.card': {...}, ... }
```

[showcase-demo id="showcase/config/current-page-configurations" title="Current Page Configurations" /]

## Cleanup

Reset configuration, destroy components, and unbind events with `$.reset()`.

```javascript
// Reset specific selector
$.reset('#my-modal');
// - Destroys the modal component
// - Unbinds all event handlers
// - Clears stored configuration

// Reset ALL configurations
$.reset();
// Resets every selector that was configured
```

> **Memory Management:** Always call `$.reset()` when removing configured elements from the DOM to prevent memory leaks.

## Real-World Example

A complete form with validation, dynamic UI, and component integration.

```javascript
$.setup({
    // Form validation and submission
    '#contact-form': {
        events: {
            submit: (e, $form) => {
                e.preventDefault();
                const data = {
                    name: $('#name').val(),
                    email: $('#email').val()
                };

                // Show loading state
                $('#submit-btn').text('Sending...').attr('disabled', true);

                // Simulate API call
                setTimeout(() => {
                    // Show success toast (better UX for transient feedback)
                    Domma.elements.toast('Message sent successfully!', {
                        type: 'success',
                        duration: 3000
                    });

                    // Reset form and button
                    $form[0].reset();
                    $('#email').removeClass('success error');
                    $('#submit-btn').text('Send Message').attr('disabled', false);
                }, 1500);
            }
        }
    },

    // Input validation on blur
    '#email': {
        events: {
            blur: (e, $el) => {
                const valid = $el.val().includes('@');
                $el.removeClass('success error')
                   .addClass(valid ? 'success' : 'error');
            }
        }
    }
});
```

[showcase-demo id="showcase/config/live-demo" title="Live Demo" /]

## API Reference

[table striped="true"]
| Method | Description |
| --- | --- |
| `$.setup(config)` | Process initial configuration object. Keys are CSS selectors, values are config objects with `component`, `options`, `initial`, and `events` properties. |
| `$.update(selector, changes)` | Deep-merge changes into existing configuration. Updates component options, re-applies initial properties, and rebinds events. |
| `$.config(selector?)` | Retrieve configuration. With selector: returns config for that selector. Without: returns all configurations as object. |
| `$.reset(selector?)` | Reset configuration. Destroys components, unbinds events, clears config. Without selector: resets all. |
| `$.ready(callback)` | Register a callback to run when DOM is ready. Executes immediately if DOM is already ready, otherwise waits for DOMContentLoaded. Also available as `Domma.ready()`. |
[/table]

### Configuration Properties

[table striped="true"]
| Property | Description |
| --- | --- |
| `$init` | Global initialisation callback. Runs once when all configs are processed, after DOM is ready. |
| `init` | Per-selector initialisation callback. Receives DommaCollection as first argument. Runs when this selector's config is processed. |
| `component` | Component type to initialise (e.g., 'modal', 'card', 'tabs'). See supported components list above. |
| `options` | Component-specific options object passed to the component factory. |
| `initial` | Initial state properties (css, text, html, addClass, removeClass, toggleClass, attr). |
| `events` | Event handlers object. Keys are event names, values are handler functions or action objects. |
[/table]
