/**
 * Supported 16. alarm - from public/showcase/config/all-components.
 */
export function mount(root) {
      // Update current time for alarm demo
    setInterval(() => {
        $(root).find('#current-time').text(D().format('HH:mm'));
      }, 1000);
}
