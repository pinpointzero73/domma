---
title: Toast
description: "Temporary notification messages that appear and auto-dismiss with customizable styling and positioning"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Toast" tagline="Temporary notification messages that appear and auto-dismiss with customizable styling and positioning" align="center"][/hero]

## Overview

Toast notifications provide lightweight, non-blocking feedback to users. They appear briefly at screen edges and auto-dismiss, perfect for success confirmations, warnings, and informational messages.

### Key Features

- **Auto-Dismiss** - Configurable duration with optional persistence
- **Multiple Types** - Success, error, warning, info styles
- **Positioning** - 9 position options (top-left, bottom-right, etc.)
- **Queueing** - Stack multiple toasts automatically

### Basic Usage

```
Domma.elements.toast('Operation successful!', {
    type: 'success',
    duration: 3000,
    position: 'top-right'
});
```

## Getting Started

Add toast notifications to your page in two simple steps

### Step 1: Include Domma

Add Domma CSS and JavaScript to your page:

```
<!-- CSS -->
<link rel="stylesheet" href="dist/domma.css">
<link rel="stylesheet" href="dist/elements.css">

<!-- JavaScript -->
<script src="dist/domma.min.js"></script>
```

### Step 2: Show Toast Notifications

Call `Domma.elements.toast()` to display notifications:

```
// Success notification
Domma.elements.toast('Operation successful!', {
    type: 'success',       // 'success', 'error', 'warning', 'info'
    duration: 3000,        // Auto-dismiss after 3 seconds
    position: 'top-right'  // Position on screen
});

// Error notification
Domma.elements.toast('Something went wrong!', {
    type: 'error',
    duration: 5000
});

// With custom action button
Domma.elements.toast('File uploaded', {
    type: 'info',
    action: 'View',
    onAction: () => {
        console.log('Action clicked');
    }
});
```

> **Note:** Toast is a static method that auto-generates and positions notification popups (no HTML required). Toasts auto-dismiss after the specified duration and automatically stack if multiple are shown. Supports 9 position options: top-left, top-center, top-right, center-left, center, center-right, bottom-left, bottom-center, bottom-right.

## Quick Start

### Simple Toast

[showcase-demo id="showcase/elements/toast/simple-toast" title="Simple Toast" /]

```
$('#btn').on('click', () => {
    Domma.elements.toast('Hello, World!', {
        type: 'info',
        duration: 3000
    });
});
```

## Tutorial

Build a form submission flow with toast notifications.

[showcase-demo id="showcase/elements/toast/tutorial" title="Tutorial" /]

```
$('#submit-btn').on('click', () => {
    const email = $('#email').val();
    const password = $('#password').val();

    // Validation with error toast
    if (!email) {
        Domma.elements.toast('Email is required', {
            type: 'error',
            duration: 3000
        });
        return;
    }

    if (password.length < 8) {
        Domma.elements.toast('Password must be at least 8 characters', {
            type: 'warning',
            duration: 4000
        });
        return;
    }

    // Success toast
    Domma.elements.toast('Account created successfully!', {
        type: 'success',
        duration: 5000
    });
});
```

## Examples

### Toast Types

[showcase-demo id="showcase/elements/toast/toast-types" title="Toast Types" /]

### Positioning

[showcase-demo id="showcase/elements/toast/positioning" title="Positioning" /]

### Duration Options

[showcase-demo id="showcase/elements/toast/duration-options" title="Duration Options" /]

### With Actions

[showcase-demo id="showcase/elements/toast/with-actions" title="With Actions" /]

## Best Practices

### Accessibility

- **ARIA Live Regions** - Toasts use `role="status"` and `aria-live="polite"`
- **Avoid Essential Info** - Don't put critical information only in toasts
- **Dismissible** - Provide close button for screen reader users

### UX Guidelines

- **Appropriate Duration** - 3-5 seconds for reading time, longer for actions
- **Type Matching** - Success for confirmations, error for failures, warning for alerts
- **Clear Messages** - Concise text (1-2 sentences maximum)
- **Limit Stack** - Don't overwhelm users with too many simultaneous toasts

### Performance

- **Auto-Cleanup** - Toasts automatically remove themselves from DOM
- **Queue Management** - System handles multiple toasts efficiently

## API Reference

### Static Method

[table striped="true"]
| Method | Description |
| --- | --- |
| `toast(message, options)` | Show toast notification, returns toast instance |
[/table]

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | String | `'info'` | Type: success, error, warning, info |
| `duration` | Number | `3000` | Auto-dismiss time (ms), 0 for persistent |
| `position` | String | `'top-right'` | Position: top-left, top-center, top-right, center-left, center, center-right, bottom-left, bottom-center, bottom-right |
| `closable` | Boolean | `true` | Show close button |
| `animation` | Boolean | `true` | Enable animations |
| `onClick` | Function | `null` | Click handler |
| `onClose` | Function | `null` | Close callback |
[/table]

### Methods

[table striped="true"]
| Method | Description |
| --- | --- |
| `close()` | Manually close the toast |
| `destroy()` | Remove toast and clean up |
[/table]

## Config Engine

Attach toasts to button clicks using the config engine:

```
$.setup({
    '#save-btn': {
        events: {
            click: (e, $el) => {
                Domma.elements.toast('Changes saved successfully!', {
                    type: 'success',
                    duration: 3000
                });
            }
        }
    },
    '#delete-btn': {
        events: {
            click: (e, $el) => {
                Domma.elements.toast('Item deleted', {
                    type: 'error',
                    duration: 4000
                });
            }
        }
    }
});
```

## CSS Customisation

Override these CSS variables to customise Toast appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-slate-800` | `#1e293b` | Toast background (default) |
| `--dm-success` | `var(--dm-green-600)` | Success toast colour |
| `--dm-danger` | `var(--dm-red-600)` | Error toast colour |
| `--dm-radius-md` | `0.375rem` | Toast corner radius |
[/table]

### Example Override

```css
/* Toast positioning/styling via JavaScript options */
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/toast/related-elements" title="Related Elements" /]
