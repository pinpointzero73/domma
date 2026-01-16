/**
 * Terms of Service Page Initialization
 * Smooth scroll navigation, highlight active sections
 */
$(() => {
  // Smooth scroll for table of contents links
  $('.nav-link').on('click', function(e) {
    e.preventDefault();
    const targetId = $(this).attr('href');
    const $target = $(targetId);

    if ($target.length) {
      $target[0].scrollIntoView({ behavior: 'smooth' });

      // Update active state
      $('.nav-link').removeClass('active');
      $(this).addClass('active');
    }
  });

  // Highlight active section on scroll
  let ticking = false;
  $(window).on('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  });

  function updateActiveSection() {
    const sections = $('section[id]');
    const scrollPos = $(window).scrollTop() + 100;

    sections.each((section) => {
      const $section = $(section);
      const sectionTop = $section.offset().top;
      const sectionBottom = sectionTop + $section.outerHeight();

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        const id = $section.attr('id');
        $('.nav-link').removeClass('active');
        $(`.nav-link[href="#${id}"]`).addClass('active');
      }
    });
  }

  console.log('Terms of Service page initialized');
});
