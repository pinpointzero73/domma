/**
 * Home View
 */
export const homeView = {
    template: `
        <section class="hero hero-gradient-primary text-center py-8">
            <div class="container">
                <div class="hero-content">
                    <h1 class="display-1 mb-4">Welcome to {{projectName}}</h1>
                    <p class="lead mb-6">
                        A modern Single Page Application powered by Domma
                    </p>
                    <div class="hero-actions">
                        <a href="#/about" class="btn btn-lg btn-primary">
                            <span data-icon="info" data-icon-size="20"></span>
                            Learn More
                        </a>
                        <a href="#/contact" class="btn btn-lg btn-outline-light">
                            <span data-icon="mail" data-icon-size="20"></span>
                            Get in Touch
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <section class="container py-8">
            <h2 class="text-center mb-6">Features</h2>
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card shadow-md hover h-100">
                        <div class="card-body text-center">
                            <div class="mb-3">
                                <span data-icon="zap" data-icon-size="48" style="color: var(--dm-primary);"></span>
                            </div>
                            <h3 class="h5 mb-3">Lightning Fast</h3>
                            <p class="text-secondary">
                                Instant page transitions with no full page reloads
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card shadow-md hover h-100">
                        <div class="card-body text-center">
                            <div class="mb-3">
                                <span data-icon="layers" data-icon-size="48" style="color: var(--dm-success);"></span>
                            </div>
                            <h3 class="h5 mb-3">Zero Dependencies</h3>
                            <p class="text-secondary">
                                Pure JavaScript with no external framework dependencies
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card shadow-md hover h-100">
                        <div class="card-body text-center">
                            <div class="mb-3">
                                <span data-icon="shield" data-icon-size="48" style="color: var(--dm-info);"></span>
                            </div>
                            <h3 class="h5 mb-3">Secure by Default</h3>
                            <p class="text-secondary">
                                Built-in XSS protection and content sanitization
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="container py-8">
            <div class="card bg-light">
                <div class="card-body text-center py-6">
                    <h2 class="mb-3">Ready to Get Started?</h2>
                    <p class="lead text-secondary mb-4">
                        Build your next application with Domma's powerful SPA features
                    </p>
                    <a href="#/about" class="btn btn-lg btn-primary">
                        Learn More
                    </a>
                </div>
            </div>
        </section>
    `,

    onMount($container) {
        console.log('Home view mounted');
    }
};
