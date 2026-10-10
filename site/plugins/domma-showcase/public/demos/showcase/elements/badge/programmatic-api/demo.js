/**
 * Programmatic API - from public/showcase/elements/badge.
 */
export function mount(root) {
        // Web Components - Programmatic API demo
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
    let currentIndex = 0;
    function changeVariant() {
          const badge = $(root).find('#programmable-badge')[0];
          currentIndex = (currentIndex + 1) % variants.length;
          const newVariant = variants[currentIndex];
          badge.setVariant(newVariant);
          badge.setText(`Changed to ${newVariant}!`);
        };

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        changeVariant();
    });
}
