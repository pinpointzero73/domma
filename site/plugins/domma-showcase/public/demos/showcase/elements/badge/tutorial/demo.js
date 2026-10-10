/**
 * Tutorial - from public/showcase/elements/badge.
 */
export function mount(root) {
        // Tutorial
    $(root).find('#clear-notifications').on('click', () => {
          const badge = $(root).find('#notification-count')[0];
          badge.textContent = '0';
          badge.style.display = 'none';
        });
}
