/**
 * Contact View
 * Contact form using Domma Forms with blueprints
 */
export const contactView = {
    template: `
        <div class="hero hero-center bg-dark bg-ambient-rotate-glow" style="min-height: 40vh; padding: 3rem 2rem;">
          <div class="hero-content">
            <span data-icon="mail" data-icon-size="72" class="mb-3" style="color: var(--dm-white-t85);"></span>
            <h1 class="hero-title" style="color: var(--dm-white);">Contact Us</h1>
            <p class="hero-subtitle" style="color: var(--dm-white-t85);">Blueprint-driven forms with validation</p>
          </div>
        </div>

        <div class="container py-8">
          <div class="row g-5 mb-6">
            <div class="col-lg-8 mx-auto">
              <div class="card shadow-lg">
                <div class="card-body p-4">
                  <h3 class="h5 mb-4">Send us a Message</h3>
                  <div id="contact-form"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-5">
            <div class="card card-hover shadow-lg">
              <div class="card-body text-center p-5">
                <span data-icon="database" data-icon-size="48" class="text-primary mb-3"></span>
                <h3 class="h5">Blueprint Forms</h3>
                <p class="text-secondary mb-0">Auto-generated from schema</p>
              </div>
            </div>
            <div class="card card-hover shadow-lg">
              <div class="card-body text-center p-5">
                <span data-icon="check" data-icon-size="48" class="text-success mb-3"></span>
                <h3 class="h5">Built-in Validation</h3>
                <p class="text-secondary mb-0">Required, patterns, custom rules</p>
              </div>
            </div>
            <div class="card card-hover shadow-lg">
              <div class="card-body text-center p-5">
                <span data-icon="zap" data-icon-size="48" class="text-warning mb-3"></span>
                <h3 class="h5">Model Binding</h3>
                <p class="text-secondary mb-0">Reactive two-way data binding</p>
              </div>
            </div>
          </div>
        </div>
    `,

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
