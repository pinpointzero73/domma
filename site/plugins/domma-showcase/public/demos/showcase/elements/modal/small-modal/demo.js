/**
 * Example 1: Small Modal - from public/showcase/elements/modal.
 */
export function mount(root) {
        // Examples
    const smallModal = E.modal(root.querySelector('#small-modal'));
    $(root).find('#open-small').on('click', () => smallModal.open());
}
