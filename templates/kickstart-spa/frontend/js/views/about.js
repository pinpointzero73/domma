/**
 * About View
 * Professional about page with Domma branding
 */
export const aboutView = {
    template: `
        <!-- Hero Header -->
        <section class="hero hero-gradient-primary text-center py-6">
            <div class="container">
                <div class="hero-content">
                    <h1 class="display-2 mb-3">About {{projectName}}</h1>
                    <p class="lead" style="max-width: 700px; margin: 0 auto;">
                        Built with modern technologies and best practices to deliver exceptional user experiences
                    </p>
                </div>
            </div>
        </section>

        <!-- Main Content -->
        <section class="container py-8">
            <div class="row g-5">
                <!-- Mission -->
                <div class="col-lg-6">
                    <div class="card shadow-lg h-100" style="border-left: 4px solid var(--dm-primary);">
                        <div class="card-body p-5">
                            <div class="d-flex align-items-center mb-4">
                                <span data-icon="target" data-icon-size="32" style="color: var(--dm-primary); margin-right: 1rem;"></span>
                                <h2 class="h3 mb-0">Our Mission</h2>
                            </div>
                            <p class="text-secondary mb-0" style="line-height: 1.8;">
                                We're building modern web applications with cutting-edge technology that prioritizes
                                <strong>performance</strong>, <strong>security</strong>, and <strong>developer experience</strong>.
                                Our goal is to deliver fast, reliable, and delightful applications that users love.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Values -->
                <div class="col-lg-6">
                    <div class="card shadow-lg h-100" style="border-left: 4px solid var(--dm-success);">
                        <div class="card-body p-5">
                            <div class="d-flex align-items-center mb-4">
                                <span data-icon="heart" data-icon-size="32" style="color: var(--dm-success); margin-right: 1rem;"></span>
                                <h2 class="h3 mb-0">Our Values</h2>
                            </div>
                            <ul class="text-secondary mb-0" style="line-height: 1.8; list-style: none; padding: 0;">
                                <li class="mb-2">
                                    <span data-icon="check" data-icon-size="18" style="color: var(--dm-success); margin-right: 0.5rem;"></span>
                                    <strong>User-First</strong> — Every decision starts with the user
                                </li>
                                <li class="mb-2">
                                    <span data-icon="check" data-icon-size="18" style="color: var(--dm-success); margin-right: 0.5rem;"></span>
                                    <strong>Quality</strong> — No shortcuts, no compromises
                                </li>
                                <li class="mb-2">
                                    <span data-icon="check" data-icon-size="18" style="color: var(--dm-success); margin-right: 0.5rem;"></span>
                                    <strong>Innovation</strong> — Always pushing boundaries
                                </li>
                                <li class="mb-0">
                                    <span data-icon="check" data-icon-size="18" style="color: var(--dm-success); margin-right: 0.5rem;"></span>
                                    <strong>Transparency</strong> — Open and honest communication
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Technology Stack -->
        <section class="py-8" style="background: var(--dm-gray-100);">
            <div class="container">
                <div class="text-center mb-6">
                    <h2 class="display-4 mb-3">Powered by Domma</h2>
                    <p class="lead text-secondary">A modern JavaScript framework with everything you need</p>
                </div>

                <div class="row g-4">
                    <!-- jQuery-Compatible -->
                    <div class="col-md-3">
                        <div class="card shadow hover h-100 text-center">
                            <div class="card-body py-5">
                                <div class="mb-3">
                                    <span data-icon="code" data-icon-size="48" style="color: var(--dm-primary);"></span>
                                </div>
                                <h3 class="h5 mb-2">DOM API</h3>
                                <p class="text-secondary mb-0" style="font-size: 0.9rem;">
                                    jQuery-compatible DOM manipulation
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Lodash Utilities -->
                    <div class="col-md-3">
                        <div class="card shadow hover h-100 text-center">
                            <div class="card-body py-5">
                                <div class="mb-3">
                                    <span data-icon="cpu" data-icon-size="48" style="color: var(--dm-success);"></span>
                                </div>
                                <h3 class="h5 mb-2">Utilities</h3>
                                <p class="text-secondary mb-0" style="font-size: 0.9rem;">
                                    120+ Lodash-style functions
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Reactive Models -->
                    <div class="col-md-3">
                        <div class="card shadow hover h-100 text-center">
                            <div class="card-body py-5">
                                <div class="mb-3">
                                    <span data-icon="database" data-icon-size="48" style="color: var(--dm-warning);"></span>
                                </div>
                                <h3 class="h5 mb-2">Models</h3>
                                <p class="text-secondary mb-0" style="font-size: 0.9rem;">
                                    Reactive data with pub/sub
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Router -->
                    <div class="col-md-3">
                        <div class="card shadow hover h-100 text-center">
                            <div class="card-body py-5">
                                <div class="mb-3">
                                    <span data-icon="globe" data-icon-size="48" style="color: var(--dm-info);"></span>
                                </div>
                                <h3 class="h5 mb-2">Router</h3>
                                <p class="text-secondary mb-0" style="font-size: 0.9rem;">
                                    Hash-based SPA routing
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- UI Components -->
                    <div class="col-md-3">
                        <div class="card shadow hover h-100 text-center">
                            <div class="card-body py-5">
                                <div class="mb-3">
                                    <span data-icon="box" data-icon-size="48" style="color: var(--dm-danger);"></span>
                                </div>
                                <h3 class="h5 mb-2">Elements</h3>
                                <p class="text-secondary mb-0" style="font-size: 0.9rem;">
                                    22+ UI components
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Forms -->
                    <div class="col-md-3">
                        <div class="card shadow hover h-100 text-center">
                            <div class="card-body py-5">
                                <div class="mb-3">
                                    <span data-icon="edit" data-icon-size="48" style="color: var(--dm-purple);"></span>
                                </div>
                                <h3 class="h5 mb-2">Forms</h3>
                                <p class="text-secondary mb-0" style="font-size: 0.9rem;">
                                    Blueprint-driven forms
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Tables -->
                    <div class="col-md-3">
                        <div class="card shadow hover h-100 text-center">
                            <div class="card-body py-5">
                                <div class="mb-3">
                                    <span data-icon="grid" data-icon-size="48" style="color: var(--dm-teal);"></span>
                                </div>
                                <h3 class="h5 mb-2">Tables</h3>
                                <p class="text-secondary mb-0" style="font-size: 0.9rem;">
                                    DataTable functionality
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Icons -->
                    <div class="col-md-3">
                        <div class="card shadow hover h-100 text-center">
                            <div class="card-body py-5">
                                <div class="mb-3">
                                    <span data-icon="star" data-icon-size="48" style="color: var(--dm-amber);"></span>
                                </div>
                                <h3 class="h5 mb-2">Icons</h3>
                                <p class="text-secondary mb-0" style="font-size: 0.9rem;">
                                    200+ SVG icons
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="container py-8">
            <div class="card shadow-xl" style="background: linear-gradient(135deg, var(--dm-primary) 0%, var(--dm-secondary) 100%); color: white;">
                <div class="card-body text-center py-6">
                    <div class="mb-3">
                        <span data-icon="users" data-icon-size="64" style="opacity: 0.9;"></span>
                    </div>
                    <h2 class="h2 mb-3">Get Involved</h2>
                    <p class="lead mb-4" style="max-width: 600px; margin-left: auto; margin-right: auto; opacity: 0.95;">
                        We'd love to hear from you! Whether you have questions, feedback, or want to collaborate,
                        we're here to help.
                    </p>
                    <a href="#/contact" class="btn btn-lg btn-light">
                        <span data-icon="mail" data-icon-size="20"></span>
                        Contact Us
                    </a>
                </div>
            </div>
        </section>
    `,

    onMount($container) {
        // Scan for icons
        Domma.icons.scan($container[0]);

        // Add subtle animations to cards
        $container.find('.card.hover').each(function(index) {
            const $card = $(this);
            setTimeout(() => {
                $card.css({
                    opacity: '0',
                    transform: 'translateY(20px)'
                }).animate({
                    opacity: 1
                }, 400, () => {
                    $card.css('transform', 'translateY(0)');
                });
            }, index * 50);
        });

        console.log('About view mounted');
    }
};
