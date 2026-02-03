/**
 * About View
 */
export const aboutView = {
    template: `
        <section class="container py-6">
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <h1 class="display-2 mb-4">About {{projectName}}</h1>
                    <p class="lead text-secondary mb-4">
                        Learn more about our mission and what makes us unique.
                    </p>

                    <div class="card shadow-md mb-4">
                        <div class="card-body">
                            <h2 class="h4 mb-3">
                                <span data-icon="target" data-icon-size="24"></span>
                                Our Mission
                            </h2>
                            <p>
                                We're building modern web applications with cutting-edge technology
                                that prioritizes performance, security, and developer experience.
                            </p>
                        </div>
                    </div>

                    <div class="card shadow-md mb-4">
                        <div class="card-body">
                            <h2 class="h4 mb-3">
                                <span data-icon="code" data-icon-size="24"></span>
                                Technology Stack
                            </h2>
                            <p class="mb-3">
                                Built with Domma, a lightweight JavaScript framework that combines:
                            </p>
                            <ul>
                                <li>jQuery-compatible DOM manipulation</li>
                                <li>Lodash-style utility functions</li>
                                <li>Reactive data models with pub/sub</li>
                                <li>Hash-based SPA routing</li>
                                <li>22+ UI components</li>
                            </ul>
                        </div>
                    </div>

                    <div class="card shadow-md">
                        <div class="card-body">
                            <h2 class="h4 mb-3">
                                <span data-icon="users" data-icon-size="24"></span>
                                Get Involved
                            </h2>
                            <p class="mb-3">
                                We'd love to hear from you! Get in touch to learn more about our project.
                            </p>
                            <a href="#/contact" class="btn btn-primary">
                                <span data-icon="mail" data-icon-size="18"></span>
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `,

    onMount($container) {
        console.log('About view mounted');
    }
};
