/**
 * Example 3: No Backdrop Close - from public/showcase/elements/modal.
 */
export function mount(root) {
    const noBackdropModal = E.modal(root.querySelector('#no-backdrop-modal'), {
            backdropClose: false,
            keyboard: false
        });
    $(root).find('#open-no-backdrop').on('click', () => noBackdropModal.open());
}
