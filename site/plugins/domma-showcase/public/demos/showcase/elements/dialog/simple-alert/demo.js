/**
 * Simple Alert - from public/showcase/elements/dialog.
 */
export function mount(root) {
    $(root).find('#quick-alert').on('click', async () => {
        await E.alert('This is an alert message!');
    });
}
