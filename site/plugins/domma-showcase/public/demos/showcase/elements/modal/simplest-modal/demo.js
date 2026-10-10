/**
 * Simplest Modal - from public/showcase/elements/modal.
 */
export function mount(root) {
    const quickStartModal = E.modal(root.querySelector('#quick-start-modal'));
    $(root).find('#quick-start-btn').on('click', () => {
            quickStartModal.open();
        });
        // Auto-wire all modal-close-btn buttons
    $('.modal-close-btn').each(function () {
            $(this).on('click', function () {
                const modal = $(this).closest('.modal').get(0);
                if (modal && modal.id) {
                    // Find and close the corresponding modal instance
                    const instances = [quickStartModal, tutorialModal, smallModal, largeModal,
                        noBackdropModal, successModal, scrollModal, parentModal, childModal];
                    instances.forEach(inst => {
                        if (inst && inst.el && inst.el.id === modal.id) {
                            inst.close();
                        }
                    });
                }
            });
        });
}
