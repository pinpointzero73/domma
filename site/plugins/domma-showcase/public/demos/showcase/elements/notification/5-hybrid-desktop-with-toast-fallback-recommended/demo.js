/**
 * 5. Hybrid: Desktop with Toast Fallback (Recommended) - from public/showcase/elements/notification.
 */
export function mount(root) {
        // Example: Hybrid Notification (Desktop with Toast fallback)
    async function smartNotify(title, options = {}) {
            // Try desktop notification first
            if (Domma.DesktopNotification.isSupported &&
                Domma.DesktopNotification.permission === 'granted') {

                E.notify(title, {
                    body: options.body,
                    ...options.notificationOptions
                });
                return 'desktop';
            }

            // Fallback to toast (always visible in page)
            const message = options.body || title;
            const type = options.type || 'info';

            E.toast[type](message, {
                duration: options.duration || 5000,
                position: 'top-right'
            });
            return 'toast';
        }
    $(root).find('#example-hybrid').on('click', async () => {
            const method = await smartNotify('Hybrid Test', {
                body: 'This notification uses the best available method',
                type: 'success',
                duration: 5000
            });

          const status = $(root).find('#hybrid-status');
          status.text(`✓ Shown using: ${method}`);
          status.attr('class', 'mt-2 text-success');
        });
}
