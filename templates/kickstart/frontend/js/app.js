/**
 * Domma Kickstart Application
 *
 * This file initialises your Domma project based on domma.config.json.
 * Customise the config file to change navbar, footer, theme, and features.
 */

$(() => {
  // Determine config path based on page location
  // Root pages (pages/index.html) need ../../domma.config.json (up to project root)
  // Sub-pages (pages/about/index.html) need ../../../domma.config.json
  const pathname = window.location.pathname;
  const isSubPage = pathname.match(/\/pages\/[^/]+\//) !== null;
  const configPath = isSubPage ? '../../../domma.config.json' : '../../domma.config.json';

  // Load configuration
  Domma.http.get(configPath).then(config => {
    // Initialise theme
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

    // Initialise navbar
    if (config.navbar) {
      Domma.elements.navbar('#main-navbar', {
        brand: config.navbar.brand,
        items: config.navbar.items,
        variant: config.navbar.variant || 'dark',
        position: config.navbar.position || 'sticky',
        collapsible: config.navbar.collapsible !== false
      });
    }

    // Initialise footer
    if (config.footer) {
      const $footer = $('.page-footer');
      if ($footer.length) {
        const $footerContent = $('<div class="footer-content"></div>');

        const $copyright = $('<p></p>').text(config.footer.copyright);
        $footerContent.append($copyright);

        const $nav = $('<nav class="footer-nav"></nav>');
        _.each(config.footer.links, link => {
          const $link = $('<a></a>')
            .attr('href', link.url)
            .text(link.text);
          $nav.append($link);
        });
        $footerContent.append($nav);

        $footer.append($footerContent);
      }
    }

    // Initialise features
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
        $('a[href^="#"]').on('click', function (e) {
          e.preventDefault();
          const targetId = $(this).attr('href');
          const $target = $(targetId);

          if ($target.length) {
            $target[0].scrollIntoView({behavior: 'smooth'});
          }
        });
      }

      // Code copy buttons
      if (config.features.codeCopy) {
        $('pre code').each((codeBlock) => {
          const $code = $(codeBlock);
          const $pre = $code.parent();

          const $button = $('<button class="btn btn-sm code-copy-btn">Copy</button>');

          $button.on('click', () => {
            _.copyToClipboard($code.text());
            $button.text('Copied!');
            setTimeout(() => $button.text('Copy'), 2000);
          });

          $pre.css('position', 'relative');
          $pre.prepend($button);
        });
      }
    }

    console.log(`✓ Domma initialised with theme: ${config.theme.default}`);
  }).catch(err => {
    console.warn('Could not load domma.config.json:', err.message);
  });
});

/**
 * Add floating theme selector
 */
function addThemeSelector() {
  const themes = Domma.theme.listThemes();
  const currentTheme = Domma.theme.get();

  const $selector = $('<div class="theme-selector"></div>');
  const $select = $('<select id="theme-select" class="form-select"></select>');

  _.each(themes, theme => {
    const $option = $('<option></option>')
      .attr('value', theme)
      .text(theme);

    if (theme === currentTheme) {
      $option.attr('selected', 'selected');
    }

    $select.append($option);
  });

  $selector.append($select);

  // Add styles
  const $style = $(`<style>
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
    </style>`);

  $('head').append($style);
  $('body').append($selector);

  // Handle theme changes
  $select.on('change', (e) => {
    Domma.theme.set($(e.target).val());
  });
}
