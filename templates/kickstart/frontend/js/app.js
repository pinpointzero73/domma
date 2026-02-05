/**
 * Domma Kickstart Application
 * Configuration-driven initialization using JSON configs
 */

$(() => {
  console.log('[App] Initializing...');

  // Calculate path prefix based on current page location
  const currentPath = window.location.pathname;
  const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/'));
  const depth = (currentDir.match(/\//g) || []).length;
  const prefix = '../'.repeat(depth);

  console.log('[App] Path:', currentPath, 'Depth:', depth, 'Prefix:', prefix);

  // Helper to adjust URLs in config based on page depth
  const adjustUrls = (config) => {
    const adjusted = _.cloneDeep(config);

    if (adjusted.brand?.url) {
      adjusted.brand.url = prefix + adjusted.brand.url;
    }

    if (adjusted.items) {
      adjusted.items = adjusted.items.map(item => ({
        ...item,
        url: prefix + item.url
      }));
    }

    if (adjusted.links) {
      adjusted.links = adjusted.links.map(link => ({
        ...link,
        url: prefix + link.url
      }));
    }

    return adjusted;
  };

  // Load navbar config and initialize
  fetch(prefix + 'config/navbar.json')
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load navbar.json: ${response.status}`);
      return response.json();
    })
    .then(config => {
      const navConfig = adjustUrls(config);
      console.log('[App] Navbar config:', navConfig);
      Domma.elements.navbar('#main-navbar', navConfig);
      console.log('[App] Navbar initialized');
    })
    .catch(error => {
      console.error('[App] Navbar error:', error);
    });

  // Load footer config and initialize
  fetch(prefix + 'config/footer.json')
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load footer.json: ${response.status}`);
      return response.json();
    })
    .then(config => {
      const footerConfig = adjustUrls(config);
      const $footer = $('.page-footer');

      if ($footer.length) {
        const footerHTML = `
          <div class="container py-4">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <p class="mb-0 text-secondary">${footerConfig.copyright}</p>
              <nav class="d-flex gap-3">
                ${footerConfig.links.map(link =>
                  `<a href="${link.url}" class="text-secondary">${link.text}</a>`
                ).join('')}
              </nav>
            </div>
          </div>
        `;
        $footer.html(footerHTML);
        console.log('[App] Footer initialized');
      }
    })
    .catch(error => {
      console.error('[App] Footer error:', error);
    });

  // Initialize theme
  if (Domma.theme) {
    Domma.theme.init({
      theme: '{{theme}}',
      persist: true,
      autoDetect: false
    });
    console.log('[App] Theme initialized');
  }

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
