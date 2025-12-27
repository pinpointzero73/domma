# CLAUDE.md - Config Module Showcase

This file provides guidance for working with Configuration engine showcase examples.

## Config Module Overview

The configuration engine allows declarative setup of components, styles, and events via `$.setup()`.

## Basic Configuration

```javascript
$.setup({
    '#selector': {
      component: 'modal',           // Component to initialise
        options: {                    // Component options
            backdrop: true,
            keyboard: true
        },
        initial: {                    // Initial state
            css: {
                backgroundColor: '#f0f0f0',
                padding: '20px'
            },
            text: 'Initial content',
            html: '<p>HTML content</p>',
            attr: {
                'data-id': '123'
            }
        },
        events: {                     // Event handlers
            click: (e, $el) => {
                console.log('Clicked', $el);
            },
            mouseenter: handler,
            mouseleave: handler
        }
    }
});
```

## Supported Components (16 total)

Components that can be auto-initialized via config:

- `card`
- `modal`
- `tabs`
- `accordion`
- `tooltip`
- `carousel`
- `dropdown`
- `badge`
- `backToTop`
- `buttonGroup`
- `loader`
- `breadcrumbs`
- `navbar`
- `notification`
- `timer`
- `alarm`

## Not Supported via Config

These require direct instantiation:

- `toast` - Use `Domma.elements.toast()`
- `dialog` - Use `Domma.elements.alert()`, `.confirm()`, `.prompt()`
- `jumbotron` - CSS-only component (no JavaScript)
- `forms` - Documentation only (native HTML forms)
- `autocomplete` - Initialise directly
- `pillbox` - Initialise directly
- `editor` - Initialise directly (tools bundle)
- `themeRoller` - Initialise directly (tools bundle)
- `pageRoller` - Initialise directly (tools bundle)

## Mutable Configuration

Update, retrieve, or reset configuration after setup:

```javascript
// Update configuration (deep merges changes)
$.update('#selector', {
    options: {backdrop: false},
    events: {mouseenter: newHandler}
});

// Retrieve configuration
const config = $.config('#selector');  // Get specific config
const allConfigs = $.config();         // Get all configs

// Reset/destroy (removes component, unbinds events, clears config)
$.reset('#selector');   // Reset specific selector
$.reset();              // Reset all configurations
```

## Multiple Selectors

Configure multiple elements at once:

```javascript
$.setup({
    '#modal-1': {
        component: 'modal',
        options: {backdrop: true}
    },
    '#modal-2': {
        component: 'modal',
        options: {backdrop: false}
    },
    '.tooltip': {
        component: 'tooltip',
        options: {position: 'top'}
    }
});
```

## Initial State Configuration

```javascript
$.setup({
    '#element': {
        initial: {
            // CSS styles
            css: {
                backgroundColor: '#fff',
                padding: '20px',
                'border-radius': '5px'
            },

            // Text content
            text: 'Hello World',

            // HTML content
            html: '<strong>Bold</strong>',

            // Attributes
            attr: {
                'data-id': '123',
                'aria-label': 'Description'
            },

            // Classes
            addClass: 'active highlighted',

            // Properties
            prop: {
                disabled: false
            },

            // Data attributes
            data: {
                userId: 123,
                role: 'admin'
            }
        }
    }
});
```

## Event Configuration

```javascript
$.setup({
    '#button': {
        events: {
            // Simple handler
            click: (e, $el) => {
                console.log('Clicked');
            },

            // Multiple events
            'mouseenter mouseleave': (e, $el) => {
                $el.toggleClass('hover');
            },

            // Event delegation (for dynamic content)
            'click .delete-btn': (e, $el) => {
                $el.closest('.item').remove();
            }
        }
    }
});
```

## Component + Events Example

```javascript
$.setup({
    '#my-modal': {
        component: 'modal',
        options: {
            backdrop: true,
            backdropClose: true,
            keyboard: true,
            onOpen: () => console.log('Modal opened'),
            onClose: () => console.log('Modal closed')
        },
        initial: {
            html: '<h2>Welcome</h2><p>Modal content here</p>'
        },
        events: {
            'click .save-btn': async (e, $el) => {
                const data = $('#form').serialize();
                await Domma.http.post('/api/save', data);
                $.reset('#my-modal'); // Close and cleanup
            }
        }
    }
});
```

## Showcase Example Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Config Showcase - Domma</title>
    <link rel="stylesheet" href="../../../dist/domma-theme.css">
</head>
<body>
    <div class="container">
        <h1>Configuration Engine Showcase</h1>

        <div class="demo-section">
            <button id="trigger-btn" class="btn">Open Modal</button>

            <div id="modal" class="modal">
                <div class="modal-content">
                    <h2>Configured Modal</h2>
                    <p>This modal was configured via $.setup()</p>
                    <button class="close-btn">Close</button>
                </div>
            </div>
        </div>
    </div>

    <script src="../../../dist/domma.min.js"></script>
    <script>
        // Declarative configuration
        $.setup({
            '#modal': {
                component: 'modal',
                options: {
                    backdrop: true,
                    keyboard: true
                },
                events: {
                    'click .close-btn': (e, $el) => {
                        $.reset('#modal'); // or modal.close()
                    }
                }
            },
            '#trigger-btn': {
                events: {
                    click: () => {
                        // Access configured component
                        $('#modal').data('component').open();
                    }
                }
            }
        });
    </script>
</body>
</html>
```

## Common Patterns

### Configuring a Complete Page

```javascript
$.setup({
    // Navigation
    '#navbar': {
        component: 'navbar',
        options: {
            brand: {text: 'My App', url: '/'},
            items: [
                {label: 'Home', url: '/'},
                {label: 'About', url: '/about'}
            ]
        }
    },

    // Tooltips for all elements
    '[data-tooltip]': {
        component: 'tooltip',
        options: {
            position: 'top',
            trigger: 'hover'
        }
    },

    // Modal dialogs
    '.modal': {
        component: 'modal',
        options: {backdrop: true}
    },

    // Tab interfaces
    '.tabs': {
        component: 'tabs',
        options: {animation: true}
    }
});
```

### Dynamic Configuration Updates

```javascript
// Initial setup
$.setup({
    '#theme-btn': {
        events: {
            click: (e, $el) => {
                // Toggle theme
                const isDark = $('body').hasClass('dark-theme');
                $('body').toggleClass('dark-theme');

                // Update config
                $.update('#theme-btn', {
                    initial: {
                        text: isDark ? 'Dark Mode' : 'Light Mode'
                    }
                });
            }
        }
    }
});
```

### Configuration with Models

```javascript
const settings = M.create({
    theme: {type: M.types.string, default: 'light'},
    language: {type: M.types.string, default: 'en'}
});

$.setup({
    '#theme-select': {
        events: {
            change: (e, $el) => {
                settings.set('theme', $el.val());
            }
        }
    }
});

// Bind model to DOM
M.bind(settings, 'theme', 'body', {
    format: (theme) => theme,
    twoWay: false
});
```

## Related Documentation

- [Showcase Meta Guide](../CLAUDE.md)
- [Core Modules](../../../src/CLAUDE.md)
- [API Reference](../../../docs/API.md)
- [Elements Guide](../elements/CLAUDE.md)
