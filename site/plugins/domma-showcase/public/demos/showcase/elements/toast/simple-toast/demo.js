/**
 * Simple Toast - from public/showcase/elements/toast.
 */
export function mount(root) {
    $(root).find('#quick-toast').on('click', () => {
        E.toast('Hello, World!', {
            type: 'info',
            duration: 3000
        });
    });
}
