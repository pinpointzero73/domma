/**
 * Custom Button Text - from public/showcase/elements/dialog.
 */
export function mount(root) {
    $(root).find('#ex-custom').on('click', async () => {
        const confirmed = await E.confirm(
            'This action cannot be undone. Are you absolutely sure?',
            {
                title: 'Delete Account',
                confirmText: 'Yes, Delete My Account',
                cancelText: 'Cancel'
            }
        );
        if (confirmed) {
            await E.alert('Account deletion initiated.', {title: 'Account Deleted'});
        }
    });
}
