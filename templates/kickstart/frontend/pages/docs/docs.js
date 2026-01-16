/**
 * Documentation Page Initialization
 * Tabs, code highlighting, sidebar navigation
 */
$(() => {
  // Initialize tabs
  Domma.elements.tabs('#install-tabs');

  // Initialize accordion
  Domma.elements.accordion('#docs-faq');

  // Smooth scroll for sidebar links
  $('.docs-sidebar a').on('click', function(e) {
    e.preventDefault();
    const targetId = $(this).attr('href');
    const $target = $(targetId);

    if ($target.length) {
      $target[0].scrollIntoView({ behavior: 'smooth' });

      // Update active state
      $('.docs-sidebar .nav-link').removeClass('active');
      $(this).addClass('active');
    }
  });

  console.log('Docs page initialized');
});
