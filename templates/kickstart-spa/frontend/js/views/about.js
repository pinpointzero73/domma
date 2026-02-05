/**
 * About View
 * Information about the application
 */
export const aboutView = {
    template: `
        <div class="hero hero-center bg-dark bg-ambient-rotate-glow" style="min-height: 40vh; padding: 3rem 2rem;">
          <div class="hero-content">
            <span data-icon="info" data-icon-size="72" class="mb-3" style="color: var(--dm-white-t85);"></span>
            <h1 class="hero-title" style="color: var(--dm-white);">About {{projectName}}</h1>
            <p class="hero-subtitle" style="color: var(--dm-white-t85);">Built with modern technologies and Domma's powerful features</p>
          </div>
        </div>

        <div class="container py-8">
          <div class="grid grid-cols-3 gap-5 mb-6">
            <div class="card card-hover shadow-lg">
              <div class="card-body text-center p-5">
                <span data-icon="arrow-right" data-icon-size="48" class="text-primary mb-3"></span>
                <h3 class="h5">onEnter()</h3>
                <p class="text-secondary mb-0">Pre-render hook with async support</p>
              </div>
            </div>
            <div class="card card-hover shadow-lg">
              <div class="card-body text-center p-5">
                <span data-icon="check-circle" data-icon-size="48" class="text-success mb-3"></span>
                <h3 class="h5">onMount()</h3>
                <p class="text-secondary mb-0">Post-render, initialize components</p>
              </div>
            </div>
            <div class="card card-hover shadow-lg">
              <div class="card-body text-center p-5">
                <span data-icon="x-circle" data-icon-size="48" class="text-danger mb-3"></span>
                <h3 class="h5">onLeave()</h3>
                <p class="text-secondary mb-0">Cleanup before unmounting</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-5">
            <div class="card card-hover shadow-lg">
              <div class="card-body text-center p-5">
                <span data-icon="settings" data-icon-size="48" class="text-info mb-3"></span>
                <h3 class="h5">Route Params</h3>
                <p class="text-secondary mb-0"><code>/user/:id</code> → params.id</p>
              </div>
            </div>
            <div class="card card-hover shadow-lg">
              <div class="card-body text-center p-5">
                <span data-icon="layers" data-icon-size="48" class="text-warning mb-3"></span>
                <h3 class="h5">Middleware</h3>
                <p class="text-secondary mb-0">Auth guards, logging, validation</p>
              </div>
            </div>
            <div class="card card-hover shadow-lg">
              <div class="card-body text-center p-5">
                <span data-icon="zap" data-icon-size="48" class="text-success mb-3"></span>
                <h3 class="h5">Pub/Sub Events</h3>
                <p class="text-secondary mb-0">router:beforeChange, afterChange</p>
              </div>
            </div>
          </div>
        </div>
    `,

    onMount($container) {
        // Scan for icons
        Domma.icons.scan($container[0]);
        console.log('About view mounted');
    }
};
