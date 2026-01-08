/**
 * Domma Kickstart Application
 *
 * This file initializes your Domma project based on domma.config.json.
 * Customize the config file to change navbar, footer, theme, and features.
 */

(async function () {
  // Load configuration
  const response = await fetch('/domma.config.json');
  const config = await response.json();

  // Initialize theme
  if (config.theme) {
    Domma.theme.init({
      theme: config.theme.default || 'charcoal-dark',
      persist: config.theme.persist !== false,
      autoDetect: config.theme.autoDetect === true
    });

    // Add theme selector if enabled
    if (config.theme.selector) {
      addThemeSelector();
    }
  }

  // Initialize navbar
  if (config.navbar) {
    Domma.elements.navbar('#main-navbar', {
      brand: config.navbar.brand,
      items: config.navbar.items,
      variant: config.navbar.variant || 'dark',
      position: config.navbar.position || 'sticky',
      collapsible: config.navbar.collapsible !== false
    });
  }

  // Initialize footer
  if (config.footer) {
    const footer = document.querySelector('.page-footer');
    if (footer) {
      const footerContent = document.createElement('div');
      footerContent.className = 'footer-content';

      const copyright = document.createElement('p');
      copyright.textContent = config.footer.copyright;
      footerContent.appendChild(copyright);

      const nav = document.createElement('nav');
      nav.className = 'footer-nav';
      config.footer.links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.text;
        nav.appendChild(a);
      });
      footerContent.appendChild(nav);

      footer.appendChild(footerContent);
    }
  }

  // Initialize features
  if (config.features) {
    // Icon scanning
    if (config.features.icons) {
      Domma.icons.scan();
    }

    // Back to top button
    if (config.features.backToTop) {
      Domma.elements.backToTop({
        scrollThreshold: 300,
        position: 'bottom-right'
      });
    }

    // Smooth scroll
    if (config.features.smoothScroll) {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({behavior: 'smooth'});
          }
        });
      });
    }

    // Code copy buttons
    if (config.features.codeCopy) {
      document.querySelectorAll('pre code').forEach(block => {
        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.className = 'btn btn-sm code-copy-btn';
        button.onclick = () => {
          navigator.clipboard.writeText(block.textContent);
          button.textContent = 'Copied!';
          setTimeout(() => button.textContent = 'Copy', 2000);
        };
        block.parentElement.style.position = 'relative';
        block.parentElement.insertBefore(button, block);
      });
    }
  }

  console.log(`✓ Domma initialized with theme: ${config.theme.default}`);
})();

/**
 * Add floating theme selector
 */
function addThemeSelector() {
  const themes = Domma.theme.listThemes();
  const currentTheme = Domma.theme.get();

  const selector = document.createElement('div');
  selector.className = 'theme-selector';

  const select = document.createElement('select');
  select.id = 'theme-select';
  select.className = 'form-select';

  themes.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme;
    option.textContent = theme;
    if (theme === currentTheme) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  selector.appendChild(select);

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
        .theme-selector {
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 1000;
            background: var(--dm-surface);
            padding: var(--dm-space-3);
            border-radius: var(--dm-radius-md);
            box-shadow: var(--dm-shadow-lg);
        }
        .theme-selector select {
            min-width: 150px;
        }
    `;
  document.head.appendChild(style);
  document.body.appendChild(selector);

  // Handle theme changes
  select.addEventListener('change', (e) => {
    Domma.theme.set(e.target.value);
  });
}
