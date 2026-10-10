/**
 * 4. Silent Notifications - from public/showcase/elements/notification.
 */
export function mount(root) {
        // Example: Silent Notification
    $(root).find('#example-silent').on('click', () => {
            E.notify('Silent Notification', {
                body: 'This notification has no sound',
                silent: true
            });
        });
}
