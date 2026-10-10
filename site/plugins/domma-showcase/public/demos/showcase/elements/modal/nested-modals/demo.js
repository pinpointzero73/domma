/**
 * Example 6: Nested Modals - from public/showcase/elements/modal.
 */
export function mount(root) {
        // Nested modals
    const parentModal = E.modal(root.querySelector('#parent-modal'));
    const childModal = E.modal(root.querySelector('#child-modal'));
    $(root).find('#open-parent').on('click', () => parentModal.open());
    $(root).find('#open-child').on('click', () => childModal.open());
}
