/**
 * Confirm Dialog - from public/showcase/elements/dialog.
 */
export function mount(root) {
    $(root).find('#ex-confirm').on('click', async () => {
        const result = await E.confirm('Do you want to proceed?', {
            title: 'Confirm Action',
            confirmText: 'Yes',
            cancelText: 'No'
        });
      $(root).find('#confirm-result').text(result ? 'Confirmed' : 'Cancelled');
    });
}
