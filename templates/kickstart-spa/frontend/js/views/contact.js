/**
 * Contact View
 */
export const contactView = {
    template: `
        <section class="container py-6">
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <h1 class="display-2 mb-4">Get in Touch</h1>
                    <p class="lead text-secondary mb-5">
                        Have a question or want to work together? We'd love to hear from you.
                    </p>

                    <div class="card shadow-lg mb-5">
                        <div class="card-body p-5">
                            <form id="contact-form">
                                <div class="mb-4">
                                    <label for="name" class="form-label">Name</label>
                                    <input type="text" class="form-control" id="name" required>
                                </div>
                                <div class="mb-4">
                                    <label for="email" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="email" required>
                                </div>
                                <div class="mb-4">
                                    <label for="message" class="form-label">Message</label>
                                    <textarea class="form-control" id="message" rows="5" required></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary btn-lg w-100">
                                    <span data-icon="send" data-icon-size="20"></span>
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>

                    <div class="row g-4">
                        <div class="col-md-4">
                            <div class="card text-center h-100">
                                <div class="card-body">
                                    <span data-icon="mail" data-icon-size="32" class="mb-3 d-block" style="color: var(--dm-primary);"></span>
                                    <h3 class="h6 mb-2">Email</h3>
                                    <p class="text-secondary small">hello@example.com</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card text-center h-100">
                                <div class="card-body">
                                    <span data-icon="phone" data-icon-size="32" class="mb-3 d-block" style="color: var(--dm-success);"></span>
                                    <h3 class="h6 mb-2">Phone</h3>
                                    <p class="text-secondary small">+1 (555) 123-4567</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card text-center h-100">
                                <div class="card-body">
                                    <span data-icon="map-pin" data-icon-size="32" class="mb-3 d-block" style="color: var(--dm-info);"></span>
                                    <h3 class="h6 mb-2">Location</h3>
                                    <p class="text-secondary small">123 Main St, City</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `,

    onMount($container) {
        console.log('Contact view mounted');

        // Handle form submission
        $('#contact-form').on('submit', function (e) {
            e.preventDefault();

            const name = $('#name').val();
            const email = $('#email').val();
            const message = $('#message').val();

            console.log('Contact form submitted:', {name, email, message});

            // Show success message (you would normally send to a server here)
            E.toast('Message sent successfully!', {type: 'success'});

            // Clear form
            this.reset();
        });
    },

    onLeave() {
        // Clean up event handlers
        $('#contact-form').off('submit');
    }
};
