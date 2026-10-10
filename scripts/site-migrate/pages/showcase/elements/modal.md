---
title: Modal
description: "Dialog windows that overlay main content, focusing attention on specific tasks or messages"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Modal" tagline="Dialog windows that overlay main content, focusing attention on specific tasks or messages" align="center"][/hero]

## Overview

Modals are dialog windows that overlay the main content, focusing user attention on a specific task or message. They're essential for confirmations, forms, alerts, and detailed views without leaving the current page context.

### Key Features

- Semi-transparent backdrop that dims background content
- Keyboard navigation with Escape key to close
- Click outside (backdrop) to close option
- Smooth fade animations for opening and closing
- Multiple size variants (small, default, large)
- Event callbacks for lifecycle management
- Programmatic control (open, close, toggle)

### When to Use Modals

- **Confirmations**: Delete actions, irreversible operations, important decisions
- **Forms**: Login, registration, quick edits, contact forms
- **Detail Views**: Product details, image galleries, extended information
- **Alerts & Messages**: Success notifications, error messages, warnings
- **Multi-Step Processes**: Wizards, guided tours, onboarding flows

### Basic Usage

```javascript
// HTML structure
<div id="my-modal" class="modal">
    <div class="modal-header">
        <h5 class="modal-title">Modal Title</h5>
        <button class="modal-close">×</button>
    </div>
    <div class="modal-body">
        Modal content goes here.
    </div>
    <div class="modal-footer">
        <button class="btn btn-secondary modal-close-btn">Cancel</button>
        <button class="btn btn-primary">Save</button>
    </div>
</div>

// JavaScript
const modal = Domma.elements.modal('#my-modal', {
    backdrop: true,
    backdropClose: true,
    keyboard: true
});

// Control the modal
modal.open();   // Opens the modal
modal.close();  // Closes the modal
modal.toggle(); // Toggles open/close
```

> ⚠️ Important: Domma vs Bootstrap Structure **Domma uses a FLAT structure** - do NOT use Bootstrap's `.modal-dialog` and `.modal-content` wrapper divs!   ❌ WRONG (Bootstrap structure): <div class="modal"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header">...</div> </div> </div> </div>    ✅ CORRECT (Domma structure): <div class="modal"> <div class="modal-header">...</div> <div class="modal-body">...</div> <div class="modal-footer">...</div> </div>

## Quick Start

Create a simple modal in under a minute. This example includes a trigger button and basic modal structure.

### Simplest Modal

```javascript
// HTML
<button class="btn btn-primary" id="open-simple-modal">Open Modal</button>

<div id="simple-modal" class="modal">
    <div class="modal-header">
        <h5 class="modal-title">Welcome!</h5>
        <button class="modal-close">×</button>
    </div>
    <div class="modal-body">
        <p>This is a simple modal dialog.</p>
    </div>
    <div class="modal-footer">
        <button class="btn btn-primary modal-close-btn">Got It</button>
    </div>
</div>

// JavaScript
const modal = Domma.elements.modal('#simple-modal');

$('#open-simple-modal').on('click', () => {
    modal.open();
});
```

[showcase-demo id="showcase/elements/modal/simplest-modal" title="Simplest Modal" /]

## Step-by-Step Tutorial

Build a confirmation modal for deleting items, step by step.

### Step 1: Create the HTML Structure

Start with the modal markup and trigger button:

```html
<button class="btn btn-danger" id="delete-btn">Delete Item</button>

<div id="confirm-modal" class="modal">
    <div class="modal-header">
        <h5 class="modal-title">Confirm Deletion</h5>
        <button class="modal-close">×</button>
    </div>
    <div class="modal-body">
        <p>Are you sure you want to delete this item?</p>
    </div>
    <div class="modal-footer">
        <button class="btn btn-secondary modal-close-btn">Cancel</button>
        <button class="btn btn-danger" id="confirm-delete">Delete</button>
    </div>
</div>
```

### Step 2: Initialise the Modal

Create modal instance with default options:

```javascript
const confirmModal = Domma.elements.modal('#confirm-modal', {
    backdrop: true,      // Show backdrop
    backdropClose: true, // Allow closing by clicking backdrop
    keyboard: true       // Allow closing with Escape key
});
```

### Step 3: Add Open Trigger

Make the delete button open the modal:

```javascript
$('#delete-btn').on('click', () => {
    confirmModal.open();
});
```

### Step 4: Handle Confirmation

Add logic when user confirms deletion:

```javascript
$('#confirm-delete').on('click', () => {
    // Perform deletion
    console.log('Item deleted');

    // Close the modal
    confirmModal.close();

    // Show success message (could use Toast component)
    alert('Item deleted successfully');
});
```

### Step 5: Add Event Callbacks (Optional)

Track modal lifecycle with callbacks:

```javascript
const confirmModal = Domma.elements.modal('#confirm-modal', {
    backdrop: true,
    backdropClose: true,
    keyboard: true,
    onOpen: () => {
        console.log('Modal opened');
        // Could disable page actions
    },
    onClose: () => {
        console.log('Modal closing');
    },
    onClosed: () => {
        console.log('Modal fully closed');
    }
});
```

### Step 6: Complete Working Demo

[showcase-demo id="showcase/elements/modal/complete-working-demo" title="Step 6: Complete Working Demo" /]

## Examples & Variations

### Example 1: Small Modal

Compact modal for simple messages:

[showcase-demo id="showcase/elements/modal/small-modal" title="Example 1: Small Modal" /]

### Example 2: Large Modal with Form

Larger modal for complex content:

[showcase-demo id="showcase/elements/modal/large-modal-with-form" title="Example 2: Large Modal with Form" /]

### Example 3: No Backdrop Close

Modal that requires explicit action to close:

[showcase-demo id="showcase/elements/modal/no-backdrop-close" title="Example 3: No Backdrop Close" /]

### Example 4: Success Message

Modal for positive feedback:

[showcase-demo id="showcase/elements/modal/success-message" title="Example 4: Success Message" /]

### Example 5: Scrollable Content

Modal with long content that scrolls:

[showcase-demo id="showcase/elements/modal/scrollable-content" title="Example 5: Scrollable Content" /]

### Example 6: Nested Modals

Open a modal from within another modal:

[showcase-demo id="showcase/elements/modal/nested-modals" title="Example 6: Nested Modals" /]

## Factory Mode - Programmatic Creation

Create modals programmatically without pre-existing HTML using `createModal()`. Perfect for dynamic content, notifications, and on-demand dialogs.

### Example 1: Basic Factory Modal

Create a modal with title, content, and buttons programmatically:

```javascript
const modal = Domma.elements.createModal({
    title: 'Welcome',
    content: '<p>This modal was created programmatically!</p>',
    size: 'medium',
    buttons: [
        {id: 'close', text: 'Close', variant: 'primary'}
    ]
});

modal.open();
```

[showcase-demo id="showcase/elements/modal/basic-factory-modal" title="Example 1: Basic Factory Modal" /]

### Example 2: Size Variants

Available sizes: `small`, `medium`, `large`, `xl`:

```javascript
Domma.elements.createModal({
    title: 'Large Modal',
    content: '<p>This is a large modal for extensive content.</p>',
    size: 'large'
}).open();
```

[showcase-demo id="showcase/elements/modal/size-variants" title="Example 2: Size Variants" /]

### Example 3: Custom Buttons with Actions

Define multiple buttons with custom actions:

```javascript
Domma.elements.createModal({
    title: 'Custom Actions',
    content: '<p>Choose an action to perform:</p>',
    buttons: [
        {id: 'cancel', text: 'Cancel', variant: 'secondary'},
        {id: 'save', text: 'Save', variant: 'primary'},
        {id: 'delete', text: 'Delete', variant: 'danger'}
    ],
    onButtonClick: (buttonId, modal) => {
        console.log('Button clicked:', buttonId);
        if (buttonId === 'delete') {
            Domma.elements.toast('Deleted!', {type: 'success'});
        }
    }
}).open();
```

[showcase-demo id="showcase/elements/modal/custom-buttons-with-actions" title="Example 3: Custom Buttons with Actions" /]

### Example 4: Dynamic Content Loading

Load content asynchronously and display in modal:

```javascript
async function showUserProfile(userId) {
    const modal = Domma.elements.createModal({
        title: 'User Profile',
        content: '<div class="text-center"><p>Loading...</p></div>',
        size: 'large'
    });

    modal.open();

    // Fetch user data
    const user = await fetch(`/api/users/${userId}`).then(r => r.json());

    // Update modal content
    const content = `
        <h4>${user.name}</h4>
        <p>Email: ${user.email}</p>
        <p>Role: ${user.role}</p>
    `;

    $('#' + modal.element.id + ' .dm-dialog-body').html(content);
}
```

[showcase-demo id="showcase/elements/modal/dynamic-content-loading" title="Example 4: Dynamic Content Loading" /]

### Example 5: Scrollable Content

Create modal with scrollable body for long content:

```javascript
Domma.elements.createModal({
    title: 'Privacy Policy',
    content: `<p>Long content...</p>`.repeat(20),
    size: 'large',
    scrollable: true,
    buttons: [{id: 'accept', text: 'Accept', variant: 'primary'}]
}).open();
```

[showcase-demo id="showcase/elements/modal/scrollable-content-2" title="Example 5: Scrollable Content" /]

## Promise Mode - Async/Await

Use `showModal()` for promise-based modals that resolve with the button ID clicked. Perfect for confirmations, choices, and async workflows.

### Example 1: Confirmation Dialog

Wait for user confirmation with async/await:

```javascript
async function deleteItem() {
    const result = await Domma.elements.showModal({
        title: 'Confirm Deletion',
        content: '<p>Are you sure you want to delete this item?</p>',
        buttons: [
            {id: 'cancel', text: 'Cancel', variant: 'secondary'},
            {id: 'delete', text: 'Delete', variant: 'danger'}
        ]
    });

    if (result === 'delete') {
        console.log('Item deleted!');
        Domma.elements.toast('Item deleted successfully', {type: 'success'});
    } else {
        console.log('Deletion cancelled');
    }
}
```

[showcase-demo id="showcase/elements/modal/confirmation-dialog" title="Example 1: Confirmation Dialog" /]

### Example 2: Multiple Choice Selection

Let user choose from multiple options:

```javascript
async function selectSize() {
    const size = await Domma.elements.showModal({
        title: 'Select Size',
        content: '<p>Choose your preferred size:</p>',
        buttons: [
            {id: 'small', text: 'Small'},
            {id: 'medium', text: 'Medium'},
            {id: 'large', text: 'Large'},
            {id: 'xl', text: 'Extra Large'}
        ]
    });

    console.log('Selected size:', size);
}
```

[showcase-demo id="showcase/elements/modal/multiple-choice-selection" title="Example 2: Multiple Choice Selection" /]

### Example 3: Form Submission with Promise

Combine form input with promise resolution:

```javascript
async function getUserInput() {
    const modal = Domma.elements.createModal({
        title: 'Enter Details',
        content: `
            <div class="form-group">
                <label class="form-label">Name</label>
                <input type="text" id="user-name" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" id="user-email" class="form-input">
            </div>
        `,
        buttons: [
            {id: 'cancel', text: 'Cancel', variant: 'secondary'},
            {id: 'submit', text: 'Submit', variant: 'primary'}
        ]
    });

    return new Promise((resolve) => {
        modal.options.onButtonClick = (buttonId) => {
            if (buttonId === 'submit') {
                const data = {
                    name: $('#user-name').val(),
                    email: $('#user-email').val()
                };
                resolve(data);
            } else {
                resolve(null);
            }
        };
        modal.open();
    });
}

// Usage
const userData = await getUserInput();
if (userData) {
    console.log('User data:', userData);
}
```

[showcase-demo id="showcase/elements/modal/form-submission-with-promise" title="Example 3: Form Submission with Promise" /]

### Example 4: Chained Confirmations

Create multi-step confirmation flows:

```javascript
async function dangerousOperation() {
    // First confirmation
    const firstConfirm = await Domma.elements.showModal({
        title: 'Warning',
        content: '<p>This will permanently delete all data.</p>',
        buttons: [
            {id: 'cancel', text: 'Cancel', variant: 'secondary'},
            {id: 'continue', text: 'Continue', variant: 'warning'}
        ]
    });

    if (firstConfirm !== 'continue') return;

    // Second confirmation
    const secondConfirm = await Domma.elements.showModal({
        title: 'Final Confirmation',
        content: '<p class="text-danger"><strong>Are you absolutely sure?</strong></p>',
        buttons: [
            {id: 'no', text: 'No, Go Back', variant: 'secondary'},
            {id: 'yes', text: 'Yes, Delete Everything', variant: 'danger'}
        ]
    });

    if (secondConfirm === 'yes') {
        console.log('Performing dangerous operation...');
        Domma.elements.toast('All data deleted', {type: 'error'});
    }
}
```

[showcase-demo id="showcase/elements/modal/chained-confirmations" title="Example 4: Chained Confirmations" /]

## Best Practices

### Accessibility

- **Focus Management**: Automatically focus the first interactive element when modal opens, return focus to trigger when closing
- **Keyboard Navigation**: Support Escape key to close (use `keyboard: true`), Tab to cycle through focusable elements
- **ARIA Attributes**: Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title
- **Screen Readers**: Announce modal opening, provide context about purpose and available actions
- **Backdrop Semantics**: Ensure backdrop is properly marked and doesn't interfere with screen reader navigation
- **Close Button**: Always provide visible close button with descriptive `aria-label="Close
                    modal"`

### Performance

- **Lazy Content**: Load modal content only when opened for heavy forms or images
- **Destroy on Close**: For one-time modals, call `modal.destroy()` after closing to free memory
- **Limit Nesting**: Avoid deeply nested modals (max 2 levels) as it confuses users and impacts performance
- **Animation Performance**: Use CSS transforms and opacity for smooth 60fps animations
- **Body Scroll Lock**: Domma automatically prevents body scrolling when modal is open

### Common Gotchas

[table striped="true"]
| Issue | Solution |
| --- | --- |
| Modal appears below other content | Ensure modal has `z-index` higher than other positioned elements. Default z-index is 1050 for modal, 1040 for backdrop. |
| Backdrop click not working | Check `backdropClose: true` is set. Ensure backdrop element isn't blocked by modal content extending beyond modal bounds. |
| Modal not closing programmatically | Store modal instance in accessible scope: `const modal = Domma.elements.modal('#id')`, then call `modal.close()`. |
| Multiple modals open simultaneously | Manage modal state yourself or use nested modal pattern. Ensure only one primary modal is open at a time for UX clarity. |
| Form submission closing modal | Use `e.preventDefault()` in form submit handler to prevent default behaviour, then manually close modal after async operations. |
[/table]

### Tips & Tricks

- **Auto-Open**: Call `modal.open()` immediately after creation for splash screens or important announcements
- **Programmatic Content**: Populate modal content dynamically before opening: `$('#modal
                    .modal-body').html(content); modal.open();`
- **Size Classes**: Use `.modal-sm`, `.modal-lg`, or `.modal-xl` for different sizes
- **Loading States**: Combine with Loader component for async operations inside modals
- **Confirmation Pattern**: Return Promise from modal actions for cleaner async/await code
- **Mobile Optimization**: On small screens, modals automatically use full width with appropriate padding

## Config Engine Integration

Use Domma's Config Engine for declarative modal setup.

### Single Modal

```javascript
$.setup({
    '#login-modal': {
        component: 'modal',
        options: {
            backdrop: true,
            backdropClose: false,  // Require explicit action
            keyboard: true,
            onOpen: () => {
                console.log('Login modal opened');
            }
        }
    }
});
```

### Multiple Modals

```javascript
$.setup({
    '#info-modal': {
        component: 'modal',
        options: {
            backdrop: true,
            animation: 'fade'
        }
    },
    '#confirm-modal': {
        component: 'modal',
        options: {
            backdropClose: false,
            keyboard: false,
            onClose: () => {
                console.log('User made a choice');
            }
        }
    }
});
```

### With Event Handlers

```javascript
$.setup({
    '#contact-modal': {
        component: 'modal',
        options: {
            backdrop: true,
            onOpen: () => {
                // Clear form fields
                $('#contact-modal form')[0].reset();
            },
            onClosed: () => {
                // Reset any state
                console.log('Contact modal closed');
            }
        },
        events: {
            submit: (e) => {
                e.preventDefault();
                // Handle form submission
                const formData = new FormData(e.target);
                console.log('Submitting:', Object.fromEntries(formData));
            }
        }
    }
});
```

## CSS Customisation

Override these CSS variables to customise Modal appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-surface` | `var(--dm-white)` | Modal background colour |
| `--dm-radius-lg` | `0.5rem` | Modal corner radius |
| `--dm-shadow-xl` | `0 20px 25px...` | Modal shadow (elevation) |
| `--dm-transition-normal` | `250ms ease` | Open/close animation speed |
| `--dm-text` | `var(--dm-slate-800)` | Modal text colour |
[/table]

### Example Override

```css
:root {
    /* Smooth modal animations */
    --dm-transition-normal: 400ms cubic-bezier(0.4, 0, 0.2, 1);

    /* Dark modal */
    --dm-surface: #1e293b;
    --dm-text: #f1f5f9;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

Modals work great with these complementary components:

[showcase-demo id="showcase/elements/modal/related-elements" title="Related Elements" /]
