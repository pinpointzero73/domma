---
title: Dot Notation with Models
description: "Working with nested data in Domma Models using dot notation for forms"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Dot Notation with Models" tagline="Working with nested data in Domma Models using dot notation for forms" align="center"][/hero]

## Using Dot Notation in Forms

While Domma Models store flat key-value pairs, you can work with nested data structures by combining Models with utility functions. This enables dot notation in forms through `_.get()` and `_.set()` utilities.

Key Concept:

## Example 1: Basic Nested Data Access

[showcase-demo id="showcase/models/dot-notation/storing-and-accessing-nested-data" title="Storing and Accessing Nested Data" /]

## Example 2: Form Binding with Dot Notation

[showcase-demo id="showcase/models/dot-notation/helper-function-for-nested-binding" title="Helper Function for Nested Binding" /]

## Example 3: Complete Registration Form

[showcase-demo id="showcase/models/dot-notation/full-form-with-validation" title="Full Form with Validation" /]

## Example 4: Form Auto-Serialization

```javascript
// Utility to serialize form with dot notation support
function serializeFormWithDotNotation(formSelector) {
    const data = {};

    $(formSelector).find('input, select, textarea').each(function() {
        const element = $(this);
        const name = element.attr('name');
        if (!name) return;

        let value;
        if (element.attr('type') === 'checkbox') {
            value = element.prop('checked');
        } else if (element.attr('type') === 'radio') {
            if (element.prop('checked')) {
                value = element.val();
            } else {
                return; // Skip unchecked radio
            }
        } else {
            value = element.val();
        }

        // Use _.set to handle dot notation
        _.set(data, name, value);
    });

    return data;
}

// Usage
const formData = serializeFormWithDotNotation('#my-form');
// Returns nested object: { user: { name: '...', email: '...' }, address: { ... } }
```

Pro Tip:

## Best Practices

- **Use consistent naming:** Stick to a naming convention like `section.field` throughout your forms
- **Validate nested data:** Use custom validation functions that can check nested properties with `_.get()`
- **Create reusable helpers:** Build utility functions like `bindNested()` for common patterns
- **Leverage persistence:** Models with nested data can still use the `persist` option for localStorage
- **Handle undefined paths:** Always provide default values when using `_.get()` to avoid errors
- **Trigger change events:** After modifying nested data, always `set()` the parent object to trigger model change events
