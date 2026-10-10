---
title: Dialog
description: "Promise-based modal interactions for alerts, confirmations, and user input collection"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Dialog" tagline="Promise-based modal interactions for alerts, confirmations, and user input collection" align="center"][/hero]

## Overview

Dialogs are promise-based modal interactions that replace browser's native `alert()`, `confirm()`, and `prompt()` with styled, customisable alternatives. Perfect for user confirmations, alerts, and input collection.

### Key Features

- **Promise-Based API** - Modern async/await support
- **Three Types** - Alert, confirm, and prompt dialogs
- **Customisable** - Custom titles, button text, input types
- **Keyboard Support** - Enter to confirm, Escape to cancel

### Basic Usage

```
// Alert
await Domma.elements.alert('Operation successful!');

// Confirm
const confirmed = await Domma.elements.confirm('Delete this item?');

// Prompt
const name = await Domma.elements.prompt('Enter your name:');
```

## Quick Start

### Simple Alert

[showcase-demo id="showcase/elements/dialog/simple-alert" title="Simple Alert" /]

```
$('#btn').on('click', async () => {
    await Domma.elements.alert('This is an alert message!');
    console.log('Alert closed');
});
```

## Tutorial

Build a delete confirmation flow using dialogs.

[showcase-demo id="showcase/elements/dialog/tutorial" title="Tutorial" /]

```
$('#delete-btn').on('click', async () => {
    // Step 1: Confirm deletion
    const confirmed = await Domma.elements.confirm(
        'Are you sure you want to delete this item?',
        {
            title: 'Confirm Deletion',
            confirmText: 'Delete',
            cancelText: 'Cancel'
        }
    );

    if (!confirmed) return;

    // Step 2: Prompt for confirmation text
    const input = await Domma.elements.prompt(
        'Type "DELETE" to confirm:',
        {
            title: 'Final Confirmation',
            inputPlaceholder: 'Type DELETE'
        }
    );

    if (input === 'DELETE') {
        await Domma.elements.alert('Item deleted successfully!', {
            title: 'Success'
        });
    } else {
        await Domma.elements.alert('Deletion cancelled - text did not match.', {
            title: 'Cancelled'
        });
    }
});
```

## Examples

### Alert Dialog

[showcase-demo id="showcase/elements/dialog/alert-dialog" title="Alert Dialog" /]

### Confirm Dialog

[showcase-demo id="showcase/elements/dialog/confirm-dialog" title="Confirm Dialog" /]

### Prompt Dialog (Text)

[showcase-demo id="showcase/elements/dialog/prompt-dialog-text" title="Prompt Dialog (Text)" /]

### Prompt Dialog (Email)

[showcase-demo id="showcase/elements/dialog/prompt-dialog-email" title="Prompt Dialog (Email)" /]

### Custom Button Text

[showcase-demo id="showcase/elements/dialog/custom-button-text" title="Custom Button Text" /]

## Best Practices

### Accessibility

- **Keyboard Support** - Always enabled: Enter confirms, Escape cancels
- **Focus Management** - Auto-focuses confirm button or input field
- **Clear Actions** - Use descriptive button text ("Delete" not "OK")

### UX Guidelines

- **Confirm Destructive Actions** - Always confirm deletes, permanent changes
- **Provide Context** - Use custom titles to clarify the action
- **Handle Cancellation** - Check promise result and handle appropriately

### Performance

- **Await Properly** - Always use `await` or `.then()` to handle results
- **Error Handling** - Wrap in try/catch for production environments

## API Reference

### Static Methods

[showcase-demo id="showcase/elements/dialog/static-methods" title="Static Methods" /]

### Options

[table striped="true"]
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | String | `null` | Dialog title |
| `confirmText` | String | `'OK'` | Confirm button text |
| `cancelText` | String | `'Cancel'` | Cancel button text |
| `inputPlaceholder` | String | `''` | Prompt input placeholder |
| `inputValue` | String | `''` | Prompt input default value |
| `inputType` | String | `'text'` | Input type (text, email, etc.) |
| `animation` | Boolean | `true` | Enable animations |
| `keyboard` | Boolean | `true` | Enable keyboard shortcuts |
[/table]

## Config Engine

Dialogs are typically called programmatically, but you can attach them to buttons:

```
$.setup({
    '#delete-btn': {
        events: {
            click: async (e, $el) => {
                const confirmed = await Domma.elements.confirm(
                    'Delete this item?',
                    { confirmText: 'Delete', cancelText: 'Cancel' }
                );
                if (confirmed) {
                    // Perform deletion
                }
            }
        }
    }
});
```

## CSS Customisation

Override these CSS variables to customise Dialog appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-surface` | `var(--dm-white)` | Dialog background |
| `--dm-radius-lg` | `0.5rem` | Dialog corner radius |
| `--dm-border` | `var(--dm-slate-300)` | Dialog border |
| `--dm-primary` | `var(--dm-blue-600)` | Confirm button colour |
[/table]

### Example Override

```css
:root {
    /* Same as Modal overrides */
    --dm-surface: #1e293b;
    --dm-text: #f1f5f9;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/dialog/related-elements" title="Related Elements" /]
