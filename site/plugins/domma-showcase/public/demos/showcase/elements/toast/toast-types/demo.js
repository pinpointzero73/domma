/**
 * Toast Types - from public/showcase/elements/toast.
 */
export function mount(root) {
        // Toast Types
    $(root).find('#ex-success').on('click', () => {
            E.toast('Operation completed successfully!', {type: 'success'});
        });
    $(root).find('#ex-error').on('click', () => {
            E.toast('An error occurred. Please try again.', {type: 'error'});
        });
    $(root).find('#ex-warning').on('click', () => {
            E.toast('Warning: This action may have consequences.', {type: 'warning'});
        });
    $(root).find('#ex-info').on('click', () => {
            E.toast('For your information: Updates are available.', {type: 'info'});
        });
}
