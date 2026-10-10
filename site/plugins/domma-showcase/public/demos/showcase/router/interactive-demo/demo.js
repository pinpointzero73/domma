/**
 * Interactive Demo - from public/showcase/router.
 */
export function mount(root) {
      // Lifecycle logging utility
    function addLog(message) {
        const log = $(root).find('#lifecycle-log');
        if (log.length === 0) return; // Element doesn't exist yet

        const entry = $('<div class="lifecycle-log-entry">').text(`[${D().format('HH:mm:ss')}] ${message}`);
        log.append(entry);

        // Scroll to bottom
        if (log[0]) {
          log[0].scrollTop = log[0].scrollHeight;
        }
      }
      // Demo views with lifecycle hooks
    const demoViews = {
        home: {
          template: `
            <div style="text-align: center;">
              <h2>🏠 Home Page</h2>
              <p>Welcome to the router demo!</p>
              <p class="text-muted">Click the navigation links above to explore different routes.</p>
            </div>
          `,
          onMount($el) {
            addLog('✅ home: onMount called');
          },
          onLeave() {
            addLog('👋 home: onLeave called');
          }
        },

        about: {
          template: `
            <div style="text-align: center;">
              <h2>ℹ️ About Page</h2>
              <p>This demo shows router lifecycle hooks and navigation.</p>
              <p class="text-muted">Watch the lifecycle log below as you navigate!</p>
            </div>
          `,
          onMount($el) {
            addLog('✅ about: onMount called');
          },
          onLeave() {
            addLog('👋 about: onLeave called');
          }
        },

        user: {
          template: (params) => `
            <div style="text-align: center;">
              <h2>👤 User Profile</h2>
              <p>Viewing user ID: <strong style="color: var(--color-primary);">${params.id}</strong></p>
              <p class="text-muted">Notice how the ID changes in the URL and template!</p>
            </div>
          `,
          onEnter(params) {
            addLog(`🔍 user: onEnter with id=${params.id}`);
          },
          onMount($el) {
            addLog('✅ user: onMount called');
          },
          onLeave() {
            addLog('👋 user: onLeave called');
          }
        },

        '404': {
          template: (params) => `
            <div style="text-align: center; padding: 2rem;">
              <h2 style="font-size: 3rem;">404</h2>
              <p>Page not found: <code>${params.path}</code></p>
              <a href="#demo/" class="btn btn-primary mt-3">Go Home</a>
            </div>
          `
        }
      };
      // Initialise demo router
    R.init({
        container: '#router-app',
        routes: [
          { path: '/demo/', view: 'home', title: 'Demo - Home' },
          { path: '/demo/about', view: 'about', title: 'Demo - About' },
          { path: '/demo/user/:id', view: 'user', title: 'Demo - User Profile' }
        ],
        views: demoViews,
        default: '/demo/',
        notFound: '404',
        transitions: { duration: 250 }
      });
      // Log router events
    M.subscribe('router:ready', () => {
        addLog('🚀 Router initialised');
      });
    M.subscribe('router:beforeChange', ({ from, to }) => {
        const fromPath = from?.path || 'none';
        addLog(`🧭 Navigating: ${fromPath} → ${to.path}`);
      });
    M.subscribe('router:afterChange', ({ to }) => {
        addLog(`📍 Navigation complete: ${to.path}`);

        // Update active nav links
        $('.demo-nav-link').removeClass('active');
        $(`.demo-nav-link[href="#${to.path}"]`).addClass('active');
      });
      // History navigation buttons
    $(root).find('#demo-back').on('click', () => {
        addLog('⬅️ Back button clicked');
        R.back();
      });
    $(root).find('#demo-forward').on('click', () => {
        addLog('➡️ Forward button clicked');
        R.forward();
      });
      // Initial log
    addLog('📄 Page loaded - router ready');
}
