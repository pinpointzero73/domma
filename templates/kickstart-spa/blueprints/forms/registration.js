/**
 * Registration Blueprint
 *
 * Complete user registration form with validation.
 * Includes password confirmation and terms acceptance.
 *
 * Usage:
 *   import { registrationBlueprint } from './blueprints/forms/registration.js';
 *
 *   // Render as form
 *   F.render('#signup-form', registrationBlueprint, {}, {
 *       layout: 'stacked',
 *       submitText: 'Create Account',
 *       onSubmit: async (data) => {
 *           await H.post('/api/register', data);
 *           E.toast('Account created!', { type: 'success' });
 *       }
 *   });
 *
 *   // Or as modal
 *   F.modal(registrationBlueprint, {
 *       title: 'Create Your Account',
 *       submitText: 'Sign Up',
 *       onSave: handleRegistration
 *   });
 */

export const registrationBlueprint = {
    // Personal Information
    fullName: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 100,
        label: 'Full Name',
        formConfig: {
            placeholder: 'John Doe',
            tooltip: 'Enter your first and last name',
            class: 'form-input-lg'
        }
    },
    email: {
        type: 'email',
        required: true,
        label: 'Email Address',
        formConfig: {
            placeholder: 'you@example.com',
            tooltip: 'We\'ll send a verification email to this address',
            class: 'form-input-lg'
        }
    },
    username: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
        label: 'Username',
        formConfig: {
            placeholder: 'johndoe',
            tooltip: 'Choose a unique username (letters, numbers, underscore only)',
            class: 'form-input-lg'
        }
    },

    // Password Fields
    password: {
        type: 'password',
        required: true,
        minLength: 8,
        // Must contain: uppercase, lowercase, number, special char
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        label: 'Password',
        formConfig: {
            placeholder: '••••••••',
            tooltip: 'Min 8 characters with uppercase, lowercase, number, and special character',
            class: 'form-input-lg'
        }
    },
    confirmPassword: {
        type: 'password',
        required: true,
        custom: (value, allData) => {
            if (value !== allData.password) {
                return 'Passwords do not match';
            }
        },
        label: 'Confirm Password',
        formConfig: {
            placeholder: '••••••••',
            tooltip: 'Re-enter your password to confirm',
            class: 'form-input-lg'
        }
    },

    // Optional Fields
    phone: {
        type: 'string',
        pattern: /^\+?[\d\s\-()]+$/,
        label: 'Phone Number (Optional)',
        formConfig: {
            placeholder: '+1 (555) 123-4567',
            tooltip: 'For account recovery and notifications'
        }
    },
    dateOfBirth: {
        type: 'date',
        custom: (value) => {
            if (!value) return;
            const birthDate = new Date(value);
            const age = Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
            if (age < 13) {
                return 'You must be at least 13 years old to register';
            }
        },
        label: 'Date of Birth (Optional)',
        formConfig: {
            tooltip: 'Used to provide age-appropriate content'
        }
    },

    // Agreements
    acceptTerms: {
        type: 'boolean',
        required: true,
        custom: (value) => {
            if (!value) {
                return 'You must accept the terms and conditions';
            }
        },
        label: 'I accept the Terms and Conditions',
        formConfig: {
            tooltip: 'Please read and accept our terms to continue',
            class: 'terms-checkbox'
        }
    },
    newsletter: {
        type: 'boolean',
        label: 'Send me updates and newsletters',
        formConfig: {
            tooltip: 'Optional: Stay informed about new features and updates'
        }
    }
};

/**
 * Simple registration (minimal fields)
 * Just email and password for quick signups
 */
export const simpleRegistrationBlueprint = {
    email: registrationBlueprint.email,
    password: registrationBlueprint.password,
    confirmPassword: registrationBlueprint.confirmPassword,
    acceptTerms: registrationBlueprint.acceptTerms
};

/**
 * Extended registration with additional profile fields
 */
export const extendedRegistrationBlueprint = {
    ...registrationBlueprint,
    company: {
        type: 'string',
        label: 'Company (Optional)',
        formConfig: {
            placeholder: 'Acme Inc.',
            tooltip: 'Your company or organization name'
        }
    },
    jobTitle: {
        type: 'string',
        label: 'Job Title (Optional)',
        formConfig: {
            placeholder: 'Software Developer',
            tooltip: 'Your current position'
        }
    },
    country: {
        type: 'select',
        options: [
            { value: '', label: 'Select Country' },
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'ca', label: 'Canada' },
            { value: 'au', label: 'Australia' },
            { value: 'de', label: 'Germany' },
            { value: 'fr', label: 'France' },
            { value: 'other', label: 'Other' }
        ],
        label: 'Country (Optional)',
        formConfig: {
            tooltip: 'Select your country'
        }
    },
    referralSource: {
        type: 'select',
        options: [
            { value: '', label: 'How did you hear about us?' },
            { value: 'search', label: 'Search Engine' },
            { value: 'social', label: 'Social Media' },
            { value: 'friend', label: 'Friend/Colleague' },
            { value: 'ad', label: 'Advertisement' },
            { value: 'other', label: 'Other' }
        ],
        label: 'How did you find us? (Optional)',
        formConfig: {
            tooltip: 'Help us understand how you discovered us'
        }
    }
};

/**
 * Example usage with form submission
 */
export function createRegistrationForm(selector, options = {}) {
    const defaultOptions = {
        layout: 'stacked',
        submitText: 'Create Account',
        onSubmit: async (data) => {
            try {
                // Remove confirmPassword before sending to API
                const { confirmPassword, ...userData } = data;

                // Submit to API
                const response = await H.post('/api/register', userData);

                // Show success message
                E.toast('Account created successfully!', { type: 'success' });

                // Redirect or perform post-registration actions
                if (options.onSuccess) {
                    options.onSuccess(response);
                } else {
                    // Default: redirect to login or dashboard
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1500);
                }
            } catch (error) {
                E.toast('Registration failed. Please try again.', { type: 'danger' });
                console.error('Registration error:', error);

                if (options.onError) {
                    options.onError(error);
                }
            }
        }
    };

    return F.render(selector, registrationBlueprint, {}, {
        ...defaultOptions,
        ...options
    });
}
