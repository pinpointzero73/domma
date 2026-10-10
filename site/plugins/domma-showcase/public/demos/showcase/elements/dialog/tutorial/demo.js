/**
 * Tutorial - from public/showcase/elements/dialog.
 *
 * The result panel binds to two observables - the message and its colour
 * class - so each step of the flow just sets them.
 */
export function mount(root) {
    const message = M.observable('Click "Delete Item" to start the flow');
    const tone = M.observable('text-muted');
    const show = (text, cls) => { message.value = text; tone.value = cls; };
    const handle = M.applyBindings({message, tone}, root.querySelector('#tutorial-result'));

    // Tutorial
    $(root).find('#tutorial-delete').on('click', async () => {
        show('Processing...', 'text-muted');

        const confirmed = await E.confirm(
            'Are you sure you want to delete this item?',
            {
                title: 'Confirm Deletion',
                confirmText: 'Delete',
                cancelText: 'Cancel'
            }
        );

        if (!confirmed) {
            show('Deletion cancelled by user.', 'text-warning');
            return;
        }

        const input = await E.prompt(
            'Type "DELETE" to confirm:',
            {
                title: 'Final Confirmation',
                inputPlaceholder: 'Type DELETE'
            }
        );

        if (input === 'DELETE') {
            show('✓ Item deleted successfully!', 'text-success');
        } else {
            show(`Deletion cancelled - you typed "${input || '(nothing)'}" instead of "DELETE".`, 'text-warning');
        }
    });

    return () => handle.dispose();
}
