/**
 * Supported 9. backToTop - from public/showcase/config/all-components.
 */
export function mount(root) {
      // Back to top button demo (manual show/hide based on scroll)
    // The window is not a Domma collection, so its listener is added (and removed) directly.
    let scrollTimeout;
    const onScroll = () => {
        clearTimeout(scrollTimeout);
        const btn = $(root).find('#demo-backtotop-btn');

        if (window.scrollY > 300) {
          btn.show();
        } else {
          scrollTimeout = setTimeout(() => btn.hide(), 100);
        }
      };
    window.addEventListener('scroll', onScroll, {passive: true});
    $(root).find('#demo-backtotop-btn').on('click', () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
      });

    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(scrollTimeout); };
}
