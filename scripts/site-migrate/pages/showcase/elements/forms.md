---
title: Forms
description: "Comprehensive form controls and layouts with validation styling - CSS-only components"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Forms" tagline="Comprehensive form controls and layouts with validation styling - CSS-only components" align="center"][/hero]

## Overview

Forms provide a comprehensive set of form controls and layouts. Includes inputs, textareas, selects, checkboxes, radios, switches, and validation styling. All components work with native HTML form elements enhanced with Domma's theme-aware styling.

### Key Features

- **Native HTML** - Works with standard form elements
- **Validation States** - Success, error, and warning styling
- **Input Groups** - Addons, icons, and button combinations
- **Layouts** - Vertical, horizontal, and inline forms

### Basic Usage

```
<div class="form-group">
    <label>Email</label>
    <input type="email" class="form-input" placeholder="you@example.com">
</div>
```

## Getting Started

Add styled form controls to your page in two simple steps

### Step 1: Include Domma CSS

Add Domma CSS to your page:

```
<!-- CSS -->
<link rel="stylesheet" href="dist/domma.css">
<link rel="stylesheet" href="dist/elements.css">
```

### Step 2: Add Form HTML

Use form classes with standard HTML elements:

```
<form>
    <!-- Text input -->
    <div class="form-group">
        <label>Email</label>
        <input type="email" class="form-input" placeholder="you@example.com">
    </div>

    <!-- Password input -->
    <div class="form-group">
        <label>Password</label>
        <input type="password" class="form-input">
    </div>

    <!-- Checkbox -->
    <div class="form-group">
        <label class="checkbox">
            <input type="checkbox">
            <span>Remember me</span>
        </label>
    </div>

    <!-- Submit button -->
    <button type="submit" class="btn btn-primary">Sign In</button>
</form>
```

> **Note:** Domma forms are CSS-only and work with native HTML form elements (no JavaScript required). Simply add the appropriate classes to your HTML. For advanced form generation and validation, see the `Domma.forms` module which provides blueprint-driven form building.

## Quick Start

### Simple Form

[showcase-demo id="showcase/elements/forms/simple-form" title="Simple Form" /]

```
<form>
    <div class="form-group">
        <label>Email</label>
        <input type="email" class="form-input" placeholder="you@example.com">
    </div>
    <div class="form-group">
        <label>Password</label>
        <input type="password" class="form-input">
    </div>
    <button type="submit" class="btn btn-primary">Sign In</button>
</form>
```

## Tutorial

Build a registration form with validation.

[showcase-demo id="showcase/elements/forms/tutorial" title="Tutorial" /]

```
$('#form').on('submit', (e) => {
    e.preventDefault();

    // Clear previous validation
    $('.form-group').forEach(group => {
        group.classList.remove('has-error', 'has-success');
    });

    // Validate name
    const name = $('#name')[0];
    if (name.value.length < 2) {
        name.closest('.form-group').classList.add('has-error');
        return;
    }
    name.closest('.form-group').classList.add('has-success');

    // Validate email
    const email = $('#email')[0];
    if (!email.value.includes('@')) {
        email.closest('.form-group').classList.add('has-error');
        return;
    }
    email.closest('.form-group').classList.add('has-success');

    // Form is valid
    console.log('Form submitted successfully!');
});
```

## Examples

### Input Types

[showcase-demo id="showcase/elements/forms/input-types" title="Input Types" /]

### Select Menus

[showcase-demo id="showcase/elements/forms/select-menus" title="Select Menus" /]

### Checkboxes and Radios

[showcase-demo id="showcase/elements/forms/checkboxes-and-radios" title="Checkboxes and Radios" /]

### Input Sizes

[showcase-demo id="showcase/elements/forms/input-sizes" title="Input Sizes" /]

### Validation States

[showcase-demo id="showcase/elements/forms/validation-states" title="Validation States" /]

### Input Groups

[showcase-demo id="showcase/elements/forms/input-groups" title="Input Groups" /]

### Inline Forms

[showcase-demo id="showcase/elements/forms/inline-forms" title="Inline Forms" /]

## Best Practices

### Accessibility

- **Labels** - Always provide `` elements for inputs
- **ARIA Attributes** - Use `aria-required`, `aria-invalid` for validation
- **Error Messages** - Link errors to inputs using `aria-describedby`
- **Keyboard Navigation** - Ensure all form controls are keyboard accessible

### Validation

- **Client-Side First** - Validate on submit before sending to server
- **Clear Feedback** - Use validation states and helper text
- **Real-Time Validation** - Consider validating on blur for better UX
- **Server-Side Required** - Always validate on backend for security

### UX Guidelines

- **Placeholder Text** - Use for examples, not instructions
- **Help Text** - Provide context with `.form-text`
- **Logical Grouping** - Group related fields together
- **Required Fields** - Mark clearly with asterisk or label
- **Button States** - Disable submit while processing

## CSS Classes

[table striped="true"]
| Class | Description |
| --- | --- |
| `.form-group` | Form field container |
| `.form-input` | Text input styling |
| `.form-textarea` | Textarea styling |
| `.form-select` | Select dropdown styling |
| `.form-checkbox` | Checkbox wrapper |
| `.form-radio` | Radio button wrapper |
| `.form-text` | Helper text |
| `.form-input-sm` | Small input size |
| `.form-input-lg` | Large input size |
| `.has-success` | Success validation state |
| `.has-error` | Error validation state |
| `.has-warning` | Warning validation state |
| `.input-group` | Input group container |
| `.input-group-text` | Input group prefix/suffix |
| `.form-inline` | Inline form layout |
[/table]

## Hybrid CSS + JavaScript

Forms work perfectly with pure CSS styling, but you can enhance them with JavaScript for validation, auto-save, dynamic fields, and more using Domma's declarative configuration.

### Form Validation with $.setup()

```javascript
$.setup({
    '#registration-form': {
        initial: {
            data: { touched: {}, errors: {} }
        },
        events: {
            submit: (e, $form) => {
                e.preventDefault();

                // Collect form data
                const formData = {
                    username: $form.find('[name="username"]').val(),
                    email: $form.find('[name="email"]').val(),
                    password: $form.find('[name="password"]').val()
                };

                // Validate with utils
                const errors = {};
                if (_.isEmpty(_.trim(formData.username))) {
                    errors.username = 'Username required';
                }
                if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                    errors.email = 'Invalid email';
                }
                if (formData.password.length < 8) {
                    errors.password = 'Password must be 8+ characters';
                }

                $form.data('errors', errors);

                if (_.isEmpty(errors)) {
                    // Submit
                    Domma.http.post('/api/register', formData)
                        .then(() => {
                            Domma.elements.toast.success('Registered successfully!');
                            window.location = '/dashboard';
                        })
                        .catch(err => {
                            Domma.elements.toast.error(err.message);
                        });
                } else {
                    // Show errors
                    _.forEach(errors, (msg, field) => {
                        $form.find(`[name="${field}"]`)
                            .closest('.form-group')
                            .addClass('has-error')
                            .find('.error-message').text(msg);
                    });
                }
            },

            'blur .form-input': _.debounce((e, $form) => {
                const $input = $(e.target);
                const field = $input.attr('name');
                const value = $input.val();
                const $group = $input.closest('.form-group');

                // Mark as touched
                const touched = $form.data('touched') || {};
                touched[field] = true;
                $form.data('touched', touched);

                // Validate
                let isValid = true;
                if (field === 'email') {
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                } else if (field === 'password') {
                    isValid = value.length >= 8;
                } else {
                    isValid = !_.isEmpty(_.trim(value));
                }

                $group.toggleClass('has-error', !isValid);
                $group.toggleClass('has-success', isValid);
            }, 300)
        }
    }
});
```

### Auto-Save Draft

```javascript
$.setup({
    '#article-form': {
        initial: {
            data: { saveTimer: null, lastSaved: null }
        },
        events: {
            'input .form-input, change select': _.debounce((e, $form) => {
                // Collect current state
                const data = {
                    title: $form.find('[name="title"]').val(),
                    content: $form.find('[name="content"]').val(),
                    category: $form.find('[name="category"]').val()
                };

                // Save draft
                Domma.http.post('/api/drafts/auto-save', data)
                    .then(() => {
                        $form.data('lastSaved', new Date());
                        $('#save-status').text('Draft saved ' + D().format('HH:mm:ss'));
                    });
            }, 2000)
        }
    }
});
```

### Dynamic Form Fields

```javascript
$.setup({
    '#contact-form': {
        events: {
            'click #add-phone': (e, $form) => {
                const phoneCount = $form.find('.phone-input').length;
                const html = `
                    <div class="form-group">
                        <input type="tel" name="phone_${phoneCount}"
                               class="form-input phone-input"
                               placeholder="Phone ${phoneCount + 1}">
                    </div>
                `;
                $form.find('#phone-inputs').append(html);
            },

            'change [name="contact-method"]': (e, $form) => {
                const method = $(e.target).val();

                // Show/hide relevant fields
                $form.find('.email-field').toggle(method === 'email');
                $form.find('.phone-field').toggle(method === 'phone');
                $form.find('.address-field').toggle(method === 'mail');
            }
        }
    }
});
```

### Multi-Step Form

```javascript
$.setup({
    '#wizard-form': {
        initial: {
            data: { currentStep: 1, totalSteps: 3, formData: {} }
        },
        events: {
            'click .next-step': (e, $form) => {
                const data = $form.data();
                if (data.currentStep < data.totalSteps) {
                    // Collect current step data
                    $form.find(`.step-${data.currentStep} .form-input`).each(function() {
                        const $input = $(this);
                        data.formData[$input.attr('name')] = $input.val();
                    });

                    // Move to next step
                    data.currentStep++;
                    $form.data(data);

                    // Update UI
                    $form.find('.step').hide();
                    $form.find(`.step-${data.currentStep}`).fadeIn();

                    $('#step-indicator').text(`Step ${data.currentStep} of ${data.totalSteps}`);
                }
            },

            'click .prev-step': (e, $form) => {
                const data = $form.data();
                if (data.currentStep > 1) {
                    data.currentStep--;
                    $form.data(data);

                    $form.find('.step').hide();
                    $form.find(`.step-${data.currentStep}`).fadeIn();

                    $('#step-indicator').text(`Step ${data.currentStep} of ${data.totalSteps}`);
                }
            }
        }
    }
});
```

### Benefits of Hybrid Approach

- **Progressive Enhancement** - Forms work without JS, enhanced with JS
- **Better UX** - Real-time validation, auto-save, dynamic fields
- **Maintainability** - Centralized logic with $.setup()
- **Accessibility** - CSS provides base styling, JS adds interactivity

### CSS-Only vs CSS+JS Hybrid

CSS-Only (Default)

```html
<form action="/submit" method="POST">
    <div class="form-group">
        <label>Email</label>
        <input type="email"
               class="form-input"
               name="email"
               required>
    </div>

    <button type="submit"
            class="btn btn-primary">
        Submit
    </button>
</form>

<!-- Works with native validation -->
```

CSS+JS Hybrid (Enhanced)

```html
<form id="enhanced-form">
    <div class="form-group">
        <label>Email</label>
        <input type="email"
               class="form-input"
               name="email">
        <span class="error-message"></span>
    </div>

    <button type="submit"
            class="btn btn-primary">
        Submit
    </button>
</form>

<script>
$.setup({
    '#enhanced-form': {
        events: {
            submit: validateAndSubmit,
            'blur .form-input': validateField
        }
    }
});
</script>
```

## CSS Customisation

Override these CSS variables to customise Form elements appearance and match your design system.

[table striped="true"]
| Variable | Default | Controls |
| --- | --- | --- |
| `--dm-input-bg` | `var(--dm-surface)` | Input background colour |
| `--dm-input-border` | `var(--dm-border-dark)` | Input border colour |
| `--dm-input-text` | `var(--dm-text)` | Input text colour |
| `--dm-input-focus-border` | `var(--dm-primary)` | Focus state border colour |
| `--dm-focus-ring` | `rgba(59, 130, 246, 0.25)` | Focus ring (box-shadow) |
[/table]

### Example Override

```css
:root {
    /* Custom focus colour */
    --dm-input-focus-border: #16a34a;  /* Green focus */
    --dm-focus-ring: rgba(22, 163, 74, 0.25);

    /* Subtle borders */
    --dm-input-border: #e5e7eb;
}
```

[Full CSS Customisation Cheat-Sheet →](/showcase/elements/css-customisation)

## Related Elements

[showcase-demo id="showcase/elements/forms/related-elements" title="Related Elements" /]
