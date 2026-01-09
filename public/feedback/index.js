/**
 * Feedback Form JavaScript
 * Handles user feedback submissions
 */

$(() => {
    // Determine API URL
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isLocal ? 'http://localhost:3000/api' : '/api';

    console.log('[Feedback] Initialising feedback form with API:', apiUrl);

    // Feedback form schema
    const feedbackSchema = {
        name: {
            type: 'string',
            label: 'Your Name',
            required: true,
            minLength: 2,
            maxLength: 100,
            formConfig: {
                placeholder: 'Enter your name'
            }
        },
        email: {
            type: 'email',
            label: 'Email Address',
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            formConfig: {
                placeholder: 'you@example.com',
                helperText: 'We may contact you for clarification'
            }
        },
        category: {
            type: 'select',
            label: 'Feedback Category',
            required: true,
            options: [
                { value: '', label: 'Select a category...' },
                { value: 'bug-report', label: 'Bug Report' },
                { value: 'feature-request', label: 'Feature Request' },
                { value: 'documentation', label: 'Documentation' },
                { value: 'general', label: 'General Feedback' },
                { value: 'praise', label: 'Praise' },
                { value: 'other', label: 'Other' }
            ]
        },
        subject: {
            type: 'string',
            label: 'Subject',
            required: true,
            minLength: 5,
            maxLength: 200,
            formConfig: {
                placeholder: 'Brief summary of your feedback'
            }
        },
        message: {
            type: 'textarea',
            label: 'Your Feedback',
            required: true,
            minLength: 10,
            maxLength: 5000,
            formConfig: {
                placeholder: 'Please share your thoughts, suggestions, or report any issues...',
                rows: 6
            }
        },
        rating: {
            type: 'number',
            label: 'Overall Rating (Optional)',
            required: false,
            min: 1,
            max: 5,
            formConfig: {
                helperText: 'How would you rate Domma? (1-5 stars)',
                placeholder: 'Enter a number between 1 and 5'
            }
        },
        featuresUsed: {
            type: 'checkbox-group',
            label: 'Features You Use (Optional)',
            required: false,
            options: [
                { value: 'dom', label: 'DOM ($)' },
                { value: 'utils', label: 'Utils (_)' },
                { value: 'dates', label: 'Dates (D)' },
                { value: 'models', label: 'Models (M)' },
                { value: 'elements', label: 'Elements' },
                { value: 'tables', label: 'Tables' },
                { value: 'forms', label: 'Forms' },
                { value: 'config', label: 'Config' },
                { value: 'http', label: 'HTTP' },
                { value: 'storage', label: 'Storage (S)' },
                { value: 'themes', label: 'Themes' },
                { value: 'icons', label: 'Icons' }
            ]
        },
        website: {
            type: 'hidden',
            label: '', // Honeypot field - hidden from users, bots will fill it
            required: false,
            formConfig: {
                value: ''
            }
        }
    };

    // Create form instance
    const form = Domma.forms.create(feedbackSchema, {}, {
        layout: 'stacked',
        submitText: 'Submit Feedback',
        onSubmit: async (formData) => {
            console.log('[Feedback] Submitting feedback:', formData);

            try {
                // Submit to API
                const response = await Domma.http.post(`${apiUrl}/feedback`, formData);

                console.log('[Feedback] Response:', response);

                if (response.success) {
                    // Show success message
                    await Domma.elements.alert(
                        response.message || 'Thank you for your feedback! We appreciate you taking the time to help us improve Domma.',
                        { title: 'Feedback Submitted', type: 'success' }
                    );

                    // Reset form (use native form element reset)
                    if (form.formElement) {
                        form.formElement.reset();
                    }

                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    throw new Error(response.message || 'Failed to submit feedback');
                }
            } catch (error) {
                console.error('[Feedback] Submission failed:', error);

                // Show error message
                await Domma.elements.alert(
                    error.message || 'There was a problem submitting your feedback. Please try again.',
                    { title: 'Submission Failed', type: 'error' }
                );
            }
        }
    });

    // Render the form to the container
    form.renderTo('#feedback-form');

    console.log('[Feedback] Form created and rendered successfully');
});
