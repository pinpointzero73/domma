/**
 * Home View
 * Splash-style hero section with feature showcase
 */
export const homeView = {
    template: `
        <section class="hero hero-fluid bg-dark bg-ambient-rotate-glow text-center" style="min-height: 80vh; display: flex; align-items: center; justify-content: center;">
            <div class="container">
                <div class="hero-content" style="max-width: 900px; margin: 0 auto;">
                    <!-- Logo and Title -->
                    <div style="display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap;">
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                             style="width: 120px; height: 120px; color: var(--dm-white-t85); animation: glow 3s ease-in-out infinite alternate; filter: drop-shadow(0 0 20px var(--dm-white-t30));">
                            <path d="M12 8 L12 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                            <path d="M12 8 L24 8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                            <path d="M12 40 L24 40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                            <path d="M24 8 L36 16" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M36 16 L36 32" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                            <path d="M36 32 L24 40" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="24" cy="24" r="3" fill="currentColor"/>
                        </svg>
                        <h1 class="display-1" style="margin: 0; font-size: 4rem; font-weight: 800; letter-spacing: -0.05em; background: linear-gradient(135deg, var(--dm-white-t90) 0%, var(--dm-white-t70) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                            {{projectName}}
                        </h1>
                    </div>

                    <!-- Tagline -->
                    <p class="lead mb-4" style="font-size: 1.25rem; opacity: 0.9; max-width: 700px; margin: 0 auto 2rem;">
                        Powered by <strong>Domma</strong> — a lightweight, zero-dependency JavaScript framework combining jQuery-style DOM manipulation, Lodash utilities, and 22+ modern UI components
                    </p>

                    <!-- CTA Buttons -->
                    <div class="hero-actions mb-6">
                        <a href="#/about" class="btn btn-lg btn-primary" style="min-width: 160px;">
                            <span data-icon="info" data-icon-size="20"></span>
                            Learn More
                        </a>
                        <a href="#/contact" class="btn btn-lg btn-outline-light" style="min-width: 160px;">
                            <span data-icon="mail" data-icon-size="20"></span>
                            Get in Touch
                        </a>
                    </div>

                    <!-- Feature Pills -->
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-top: 3rem;">
                        <div class="badge badge-lg" style="background: var(--dm-white-t10); border: 1px solid var(--dm-white-t20); padding: 0.75rem 1.5rem; font-size: 0.9rem;">
                            <span data-icon="zap" data-icon-size="16" style="color: var(--dm-warning);"></span>
                            Lightning Fast
                        </div>
                        <div class="badge badge-lg" style="background: var(--dm-white-t10); border: 1px solid var(--dm-white-t20); padding: 0.75rem 1.5rem; font-size: 0.9rem;">
                            <span data-icon="shield" data-icon-size="16" style="color: var(--dm-success);"></span>
                            Secure by Default
                        </div>
                        <div class="badge badge-lg" style="background: var(--dm-white-t10); border: 1px solid var(--dm-white-t20); padding: 0.75rem 1.5rem; font-size: 0.9rem;">
                            <span data-icon="layers" data-icon-size="16" style="color: var(--dm-info);"></span>
                            Zero Dependencies
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Why Domma Section -->
        <section class="container py-8">
            <div class="text-center mb-6">
                <h2 class="display-3 mb-3">Why Domma?</h2>
                <p class="lead text-secondary">Everything you need to build modern web applications</p>
            </div>

            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card shadow-lg hover h-100" style="border: 2px solid transparent; transition: all 0.3s ease;">
                        <div class="card-body text-center py-5">
                            <div class="mb-4">
                                <span data-icon="code" data-icon-size="56" style="color: var(--dm-primary);"></span>
                            </div>
                            <h3 class="h4 mb-3">jQuery-Compatible API</h3>
                            <p class="text-secondary">
                                90+ familiar methods for DOM manipulation, traversal, events, and effects.
                                If you know jQuery, you know Domma.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card shadow-lg hover h-100" style="border: 2px solid transparent; transition: all 0.3s ease;">
                        <div class="card-body text-center py-5">
                            <div class="mb-4">
                                <span data-icon="cpu" data-icon-size="56" style="color: var(--dm-success);"></span>
                            </div>
                            <h3 class="h4 mb-3">Lodash Utilities</h3>
                            <p class="text-secondary">
                                120+ utility functions for arrays, objects, functions, and more.
                                Powerful data manipulation at your fingertips.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card shadow-lg hover h-100" style="border: 2px solid transparent; transition: all 0.3s ease;">
                        <div class="card-body text-center py-5">
                            <div class="mb-4">
                                <span data-icon="box" data-icon-size="56" style="color: var(--dm-info);"></span>
                            </div>
                            <h3 class="h4 mb-3">22+ UI Components</h3>
                            <p class="text-secondary">
                                Modals, tabs, carousels, tooltips, forms, tables, and more.
                                Beautiful components ready out of the box.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Quick Start CTA -->
        <section class="py-8" style="background: linear-gradient(135deg, var(--dm-primary-t10) 0%, var(--dm-secondary-t10) 100%);">
            <div class="container">
                <div class="text-center">
                    <h2 class="display-4 mb-4">Ready to Build Something Amazing?</h2>
                    <p class="lead mb-5" style="max-width: 600px; margin-left: auto; margin-right: auto;">
                        Start building your next web application with Domma's powerful features and intuitive API
                    </p>
                    <div>
                        <a href="#/about" class="btn btn-lg btn-primary me-3">
                            Discover Features
                        </a>
                        <a href="#/contact" class="btn btn-lg btn-outline-primary">
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </section>
    `,

    onMount($container) {
        // Scan for icons in the newly mounted view
        Domma.icons.scan($container[0]);

        // Add hover effects to feature cards
        $container.find('.card.hover').on('mouseenter', function() {
            $(this).css('border-color', 'var(--dm-primary)');
        }).on('mouseleave', function() {
            $(this).css('border-color', 'transparent');
        });

        console.log('Home view mounted');
    }
};
