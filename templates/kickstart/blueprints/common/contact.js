/**
 * Contact Blueprint
 *
 * Standard contact form fields for inquiries, support, and feedback.
 *
 * Usage:
 *   import { contactBlueprint } from './blueprints/common/contact.js';
 *   F.modal(contactBlueprint, { title: 'Contact Us', onSave: sendMessage });
 */

export const contactBlueprint = {
    name: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 100,
        label: 'Your Name',
        formConfig: {
            placeholder: 'John Doe',
            tooltip: 'How should we address you?'
        }
    },
    email: {
        type: 'email',
        required: true,
        label: 'Email Address',
        formConfig: {
            placeholder: 'you@example.com',
            tooltip: 'We\'ll reply to this address'
        }
    },
    phone: {
        type: 'string',
        pattern: /^\+?[\d\s\-()]+$/,
        label: 'Phone Number',
        formConfig: {
            placeholder: '+1 (555) 123-4567',
            tooltip: 'Optional: For urgent matters'
        }
    },
    subject: {
        type: 'select',
        required: true,
        options: [
            { value: 'general', label: 'General Inquiry' },
            { value: 'support', label: 'Technical Support' },
            { value: 'sales', label: 'Sales Question' },
            { value: 'feedback', label: 'Feedback' },
            { value: 'other', label: 'Other' }
        ],
        label: 'Subject',
        formConfig: {
            tooltip: 'What is your inquiry about?'
        }
    },
    message: {
        type: 'textarea',
        required: true,
        minLength: 10,
        maxLength: 2000,
        rows: 6,
        label: 'Message',
        formConfig: {
            placeholder: 'Please describe your inquiry in detail...',
            tooltip: 'Tell us how we can help you'
        }
    },
    urgency: {
        type: 'radio',
        options: [
            { value: 'low', label: 'Low - General question' },
            { value: 'medium', label: 'Medium - Need help soon' },
            { value: 'high', label: 'High - Urgent issue' }
        ],
        label: 'Urgency Level',
        formConfig: {
            tooltip: 'How quickly do you need a response?'
        }
    },
    newsletter: {
        type: 'boolean',
        label: 'Subscribe to newsletter',
        formConfig: {
            tooltip: 'Receive updates and news from us'
        }
    }
};

/**
 * Simple contact form (name, email, message only)
 * Minimal fields for quick inquiries
 */
export const simpleContactBlueprint = {
    name: contactBlueprint.name,
    email: contactBlueprint.email,
    message: contactBlueprint.message
};

/**
 * Support ticket blueprint
 * Extended contact form with additional support fields
 */
export const supportTicketBlueprint = {
    ...contactBlueprint,
    priority: {
        type: 'select',
        required: true,
        options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'critical', label: 'Critical' }
        ],
        label: 'Priority'
    },
    category: {
        type: 'select',
        required: true,
        options: [
            { value: 'bug', label: 'Bug Report' },
            { value: 'feature', label: 'Feature Request' },
            { value: 'question', label: 'Question' },
            { value: 'other', label: 'Other' }
        ],
        label: 'Category'
    },
    attachments: {
        type: 'string',
        label: 'Attachments',
        formConfig: {
            placeholder: 'Upload screenshots or files',
            tooltip: 'Optional: Provide supporting files'
        }
    }
};
