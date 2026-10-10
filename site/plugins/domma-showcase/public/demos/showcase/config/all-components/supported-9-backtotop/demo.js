/**
 * Supported 9. backToTop - from public/showcase/config/all-components.
 */
export function mount(root) {
      // Back to top button demo (manual show/hide based on scroll)
    let scrollTimeout;
    $(window).on('scroll', () => {
        clearTimeout(scrollTimeout);
        const btn = $(root).find('#demo-backtotop-btn');

        if (window.scrollY > 300) {
          btn.show();
        } else {
          scrollTimeout = setTimeout(() => btn.hide(), 100);
        }
      });
    $(root).find('#demo-backtotop-btn').on('click', () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
      });
}
