/**
 * Contact View
 * Contact form using Domma Forms with blueprints
 */
export const contactView = {
    templateUrl: 'js/views/templates/contact.html',

    onMount($container) {
        // Scan for icons
        Domma.icons.scan($container[0]);

        // Define Blueprint for contact form
        const contactBlueprint = {
            name: {
                type: M.types.string,
                label: 'Name',
                required: true,
                minLength: 2,
                placeholder: 'John Doe'
            },
            email: {
                type: M.types.string,
                label: 'Email',
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                placeholder: 'john@example.com'
            },
            subject: {
                type: M.types.string,
                label: 'Subject',
                placeholder: "What's this about?"
            },
            message: {
                type: M.types.string,
                label: 'Message',
                inputType: 'textarea',
                required: true,
                minLength: 10,
                placeholder: 'Your message here...'
            }
        };

        // Create form using Domma Forms
        const form = Domma.forms.create('#contact-form', {
            blueprint: contactBlueprint,
            layout: 'grid',
            submitText: 'Send Message',
            submitIcon: 'send',
            onSubmit: (data) => {
                console.log('Form data:', data);
                Domma.elements.toast.success('Message sent! (Demo only)', {
                    position: 'top-center',
                    duration: 3000
                });
                form.reset();
            }
        });

        console.log('Contact view mounted');
    },

    onLeave() {
        // Cleanup is handled by Domma Forms automatically
        console.log('Contact view unmounted');
    }
};
