/**
 * Blueprint → Form Generation - from public/showcase/blueprints.
 */
export function mount(root) {
    // Contact Form Example - ONE-STEP API
    const contactBlueprint = {
        name: {
            type: 'string',
            required: true,
            minLength: 2,
            label: 'Full Name',
            formConfig: {
                tooltip: 'Enter your first and last name'
            }
        },
        email: {
            type: 'email',
            required: true,
            label: 'Email',
            formConfig: {
                tooltip: 'We\'ll never share your email with anyone'
            }
        },
        message: {
            type: 'textarea',
            required: true,
            minLength: 10,
            rows: 4,
            label: 'Message',
            formConfig: {
                tooltip: 'Let us know how we can help you'
            }
        }
    };
    F.render('#contact-form', contactBlueprint, {}, {
        layout: 'stacked',
        submitText: 'Send Message',
        onSubmit: (data) => {
            E.toast('Message sent!', { type: 'success' });
            console.log('Form submitted:', data);
        },
        onValidationError: (errors) => {
            E.toast('Please fix validation errors', { type: 'error' });
            console.error('Validation errors:', errors);
        }
    });
}
