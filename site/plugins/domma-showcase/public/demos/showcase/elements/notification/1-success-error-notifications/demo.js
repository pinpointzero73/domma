/**
 * 1. Success/Error Notifications - from public/showcase/elements/notification.
 */
export function mount(root) {
        // Example: Success/Error
    $(root).find('#example-success').on('click', () => {
            E.notify('Success', {
                body: 'Operation completed successfully!'
            });
        });
    $(root).find('#example-error').on('click', () => {
            E.notify('Error', {
                body: 'Something went wrong',
                requireInteraction: true
            });
        });
}
