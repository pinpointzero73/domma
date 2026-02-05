/**
 * Domma Kickstart Application
 * Simple initialization for navbar, footer, theme, and features
 */

$(() => {
  console.log('[App] Initializing...');

  // Simple navbar initialization
  const initNavbar = () => {
    Domma.elements.navbar('#main-navbar', {
      brand: {
        text: '{{projectName}}',
        url: './'
      },
      items: [
        { text: 'Home', url: './', active: true },
        { text: 'About', url: 'about/' },
        { text: 'Contact', url: 'contact/' },
        { text: 'Blog', url: 'blog/' },
        { text: 'Docs', url: 'docs/' }
      ],
      variant: 'dark',
      position: 'sticky',
      collapsible: true
    });
    console.log('[App] Navbar initialized');
  };

  // Simple footer initialization
  const initFooter = () => {
    const $footer = $('.page-footer');
    if ($footer.length) {
      const footerHTML = `
        <div class="container py-4">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <p class="mb-0 text-secondary">© {{year}} {{projectName}}. All rights reserved.</p>
            <nav class="d-flex gap-3">
              <a href="privacy/" class="text-secondary">Privacy Policy</a>
              <a href="cookies/" class="text-secondary">Cookie Policy</a>
              <a href="terms/" class="text-secondary">Terms of Service</a>
              <a href="contact/" class="text-secondary">Contact Us</a>
            </nav>
          </div>
        </div>
      `;
      $footer.html(footerHTML);
      console.log('[App] Footer initialized');
    }
  };

  // Initialize theme
  if (Domma.theme) {
    Domma.theme.init({
      theme: '{{theme}}',
      persist: true,
      autoDetect: false
    });
    console.log('[App] Theme initialized: {{theme}}');
  }

  // Initialize components
  initNavbar();
  initFooter();

  // Scan for icons
  if (Domma.icons) {
    Domma.icons.scan();
    console.log('[App] Icons scanned');
  }

  // Back to top button
  if (Domma.elements.backToTop) {
    Domma.elements.backToTop({
      scrollThreshold: 300,
      position: 'bottom-right'
    });
    console.log('[App] Back to top initialized');
  }

  // Smooth scroll
  $('a[href^="#"]').on('click', function (e) {
    e.preventDefault();
    const targetId = $(this).attr('href');
    const $target = $(targetId);

    if ($target.length) {
      $target[0].scrollIntoView({behavior: 'smooth'});
    }
  });

  console.log('[App] Initialization complete');
});
