/**
 * Step 6: Complete Working Demo - from public/showcase/elements/modal.
 */
export function mount(root) {
        // Tutorial
    const tutorialModal = E.modal(root.querySelector('#tutorial-modal'), {
            backdrop: true,
            backdropClose: true,
            keyboard: true,
            onOpen: () => console.log('Tutorial modal opened'),
            onClosed: () => console.log('Tutorial modal closed')
        });
    $(root).find('#tutorial-delete-btn').on('click', () => {
            tutorialModal.open();
        });
    $(root).find('#tutorial-confirm').on('click', () => {
          $(root).find('#tutorial-result').removeClass('hidden').html('<span class="text-success">✓ Item deleted successfully at ' + D().format('HH:mm:ss') + '</span>');
            tutorialModal.close();
        });
}
