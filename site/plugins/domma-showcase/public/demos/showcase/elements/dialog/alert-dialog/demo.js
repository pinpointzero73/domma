/**
 * Alert Dialog - from public/showcase/elements/dialog.
 */
export function mount(root) {
        // Examples
    $(root).find('#ex-alert').on('click', async () => {
            await E.alert('Operation completed successfully!', {
                title: 'Success'
            });
        });
}
