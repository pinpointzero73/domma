/**
 * With Actions - from public/showcase/elements/toast.
 */
export function mount(root) {
        // Action
    $(root).find('#ex-action').on('click', () => {
            E.toast('File uploaded successfully. Click to view.', {
                type: 'success',
                duration: 5000,
                onClick: () => {
                    E.toast('Navigating to file...');
                }
            });
        });
}
