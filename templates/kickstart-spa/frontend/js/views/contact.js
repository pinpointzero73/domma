/**
 * Contact View
 * Professional contact form using Domma Forms with validation
 */
export const contactView = {
    template: `
        <!-- Hero Header -->
        <section class="hero hero-gradient-secondary text-center py-6">
            <div class="container">
                <div class="hero-content">
                    <div class="mb-3">
                        <span data-icon="mail" data-icon-size="64" style="opacity: 0.9;"></span>
                    </div>
                    <h1 class="display-2 mb-3">Get in Touch</h1>
                    <p class="lead" style="max-width: 700px; margin: 0 auto;">
                        Have a question or want to work together? We'd love to hear from you.
                    </p>
                </div>
            </div>
        </section>

        <!-- Contact Form & Info -->
        <section class="container py-8">
            <div class="row g-5">
                <!-- Contact Form -->
                <div class="col-lg-7">
                    <div class="card shadow-xl">
                        <div class="card-body p-5">
                            <h2 class="h3 mb-4">Send us a Message</h2>
                            <div id="contact-form"></div>
                        </div>
                    </div>
                </div>

                <!-- Contact Information -->
                <div class="col-lg-5">
                    <!-- Why Contact Card -->
                    <div class="card shadow-lg mb-4" style="border-left: 4px solid var(--dm-primary);">
                        <div class="card-body p-4">
                            <h3 class="h5 mb-3">
                                <span data-icon="message-circle" data-icon-size="24" style="color: var(--dm-primary); margin-right: 0.5rem;"></span>
                                Why Reach Out?
                            </h3>
                            <ul class="text-secondary" style="line-height: 2; list-style: none; padding: 0; margin: 0;">
                                <li>
                                    <span data-icon="check" data-icon-size="18" style="color: var(--dm-success); margin-right: 0.5rem;"></span>
                                    General inquiries
                                </li>
                                <li>
                                    <span data-icon="check" data-icon-size="18" style="color: var(--dm-success); margin-right: 0.5rem;"></span>
                                    Technical support
                                </li>
                                <li>
                                    <span data-icon="check" data-icon-size="18" style="color: var(--dm-success); margin-right: 0.5rem;"></span>
                                    Partnership opportunities
                                </li>
                                <li>
                                    <span data-icon="check" data-icon-size="18" style="color: var(--dm-success); margin-right: 0.5rem;"></span>
                                    Feedback & suggestions
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Contact Methods -->
                    <div class="card shadow-lg">
                        <div class="card-body p-4">
                            <h3 class="h5 mb-4">Other Ways to Connect</h3>

                            <div class="d-flex align-items-start mb-3">
                                <span data-icon="mail" data-icon-size="24" style="color: var(--dm-primary); margin-right: 1rem; margin-top: 0.25rem;"></span>
                                <div>
                                    <div class="fw-bold mb-1">Email</div>
                                    <a href="mailto:hello@example.com" class="text-secondary text-decoration-none">
                                        hello@example.com
                                    </a>
                                </div>
                            </div>

                            <div class="d-flex align-items-start mb-3">
                                <span data-icon="phone" data-icon-size="24" style="color: var(--dm-success); margin-right: 1rem; margin-top: 0.25rem;"></span>
                                <div>
                                    <div class="fw-bold mb-1">Phone</div>
                                    <a href="tel:+15551234567" class="text-secondary text-decoration-none">
                                        +1 (555) 123-4567
                                    </a>
                                </div>
                            </div>

                            <div class="d-flex align-items-start">
                                <span data-icon="map-pin" data-icon-size="24" style="color: var(--dm-info); margin-right: 1rem; margin-top: 0.25rem;"></span>
                                <div>
                                    <div class="fw-bold mb-1">Location</div>
                                    <div class="text-secondary">
                                        123 Main Street<br>
                                        Suite 100<br>
                                        City, State 12345
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Response Time Banner -->
        <section class="py-5" style="background: var(--dm-gray-100);">
            <div class="container text-center">
                <div class="row align-items-center">
                    <div class="col-md-4 mb-3 mb-md-0">
                        <span data-icon="clock" data-icon-size="48" style="color: var(--dm-primary);"></span>
                        <div class="mt-2">
                            <div class="fw-bold">Quick Response</div>
                            <div class="text-secondary small">Within 24 hours</div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3 mb-md-0">
                        <span data-icon="shield" data-icon-size="48" style="color: var(--dm-success);"></span>
                        <div class="mt-2">
                            <div class="fw-bold">Privacy Focused</div>
                            <div class="text-secondary small">Your data is secure</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <span data-icon="users" data-icon-size="48" style="color: var(--dm-info);"></span>
                        <div class="mt-2">
                            <div class="fw-bold">Expert Team</div>
                            <div class="text-secondary small">Here to help you</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `,

    onMount($container) {
        // Scan for icons
        Domma.icons.scan($container[0]);

        // Define contact form blueprint
        const contactBlueprint = {
            name: {
                type: 'string',
                label: 'Full Name',
                placeholder: 'Enter your full name',
                required: true,
                minLength: 2,
                maxLength: 100
            },
            email: {
                type: 'email',
                label: 'Email Address',
                placeholder: 'your.email@example.com',
                required: true
            },
            subject: {
                type: 'select',
                label: 'Subject',
                required: true,
                options: [
                    { value: '', label: 'Select a subject...' },
                    { value: 'general', label: 'General Inquiry' },
                    { value: 'support', label: 'Technical Support' },
                    { value: 'partnership', label: 'Partnership' },
                    { value: 'feedback', label: 'Feedback' },
                    { value: 'other', label: 'Other' }
                ]
            },
            message: {
                type: 'textarea',
                label: 'Message',
                placeholder: 'Tell us more about your inquiry...',
                required: true,
                minLength: 10,
                maxLength: 1000,
                rows: 6
            },
            newsletter: {
                type: 'checkbox',
                label: 'Subscribe to our newsletter for updates and news'
            }
        };

        // Create form using Domma Forms
        const form = Domma.forms.render('#contact-form', contactBlueprint, {}, {
            layout: 'stacked',
            submitText: 'Send Message',
            submitIcon: 'send',
            resetText: 'Clear Form',
            showReset: true,
            onSubmit: async (data) => {
                console.log('Contact form submitted:', data);

                // Show loading state
                const submitBtn = $container.find('button[type="submit"]');
                submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Sending...');

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Show success message
                Domma.elements.toast('Message sent successfully! We\'ll get back to you soon.', {
                    type: 'success',
                    duration: 5000
                });

                // Reset form
                form.reset();

                // Re-enable button
                submitBtn.prop('disabled', false).html('<span data-icon="send" data-icon-size="20"></span> Send Message');
                Domma.icons.scan(submitBtn[0]);

                return true;
            },
            onValidationError: (errors) => {
                console.log('Validation errors:', errors);
                Domma.elements.toast('Please fix the errors in the form', {
                    type: 'error'
                });
            }
        });

        // Add custom styling to form elements
        $container.find('.form-control, .form-select').css({
            'border-radius': '0.5rem',
            'border': '2px solid var(--dm-gray-300)',
            'padding': '0.75rem 1rem'
        }).on('focus', function() {
            $(this).css('border-color', 'var(--dm-primary)');
        }).on('blur', function() {
            if (!$(this).hasClass('is-invalid')) {
                $(this).css('border-color', 'var(--dm-gray-300)');
            }
        });

        console.log('Contact view mounted');
    },

    onLeave() {
        // Cleanup is handled by Domma Forms automatically
        console.log('Contact view unmounted');
    }
};
