/**
 * 404 Not Found View
 */
export const notFoundView = {
    template: `
        <section class="container py-8 text-center">
            <div class="row">
                <div class="col-lg-6 mx-auto">
                    <div class="mb-4">
                        <span data-icon="alert-circle" data-icon-size="96" style="color: var(--dm-danger);"></span>
                    </div>
                    <h1 class="display-1 mb-2">404</h1>
                    <h2 class="h3 mb-4">Page Not Found</h2>
                    <p class="lead text-secondary mb-5">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <div class="d-flex gap-3 justify-content-center">
                        <a href="#/" class="btn btn-lg btn-primary">
                            <span data-icon="home" data-icon-size="20"></span>
                            Go Home
                        </a>
                        <button class="btn btn-lg btn-outline-secondary" onclick="history.back()">
                            <span data-icon="arrow-left" data-icon-size="20"></span>
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `,

    onMount($container) {
        console.log('404 view mounted');
    }
};
