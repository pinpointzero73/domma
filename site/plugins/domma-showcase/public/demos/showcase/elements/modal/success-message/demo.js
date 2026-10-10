/**
 * Example 4: Success Message - from public/showcase/elements/modal.
 */
export function mount(root) {
    const successModal = E.modal(root.querySelector('#success-modal'));
    $(root).find('#open-success').on('click', () => successModal.open());
}
