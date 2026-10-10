/**
 * Choose a Theme - from public/showcase/themes.
 */
export function mount(root) {
    function updateActiveStates() {
        const current = Domma.theme.get();
        $('.theme-card').removeClass('active');
        $(`.theme-card[data-theme="${current}"]`).addClass('active');
      }
    $('.theme-card').on('click', function () {
        Domma.theme.set($(this).data('theme'));
      });
    updateActiveStates();
}
