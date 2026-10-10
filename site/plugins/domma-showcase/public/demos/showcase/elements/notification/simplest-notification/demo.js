/**
 * Simplest Notification - from public/showcase/elements/notification.
 */
export function mount(root) {
    $(root).find('#quick-demo').on('click', async () => {
        // Check if notifications are supported
        if (!Domma.DesktopNotification.isSupported) {
            await E.alert(
                'Desktop notifications are not supported in your browser.',
                {title: 'Not Supported'}
            );
            return;
        }

        // Check permission
        if (Domma.DesktopNotification.permission === 'denied') {
            await E.alert(
                'Notifications are blocked. Please enable them in your browser settings.',
                {title: 'Permission Denied'}
            );
            return;
        }

        E.notify('Quick Demo', {
            body: 'This is a quick notification!',
            onError: async (error) => {
                await E.alert(
                    'Failed to show notification. Check browser permissions.',
                    {title: 'Error'}
                );
            }
        });
    });
}
