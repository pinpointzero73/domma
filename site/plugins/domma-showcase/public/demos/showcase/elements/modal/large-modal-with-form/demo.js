/**
 * Example 2: Large Modal with Form - from public/showcase/elements/modal.
 */
export function mount(root) {
    const largeModal = E.modal(root.querySelector('#large-modal'));
    $(root).find('#open-large').on('click', () => largeModal.open());
}
