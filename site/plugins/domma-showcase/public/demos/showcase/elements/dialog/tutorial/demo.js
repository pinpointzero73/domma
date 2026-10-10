/**
 * Tutorial - from public/showcase/elements/dialog.
 */
export function mount(root) {
        // Tutorial
    $(root).find('#tutorial-delete').on('click', async () => {
          const resultDiv = $(root).find('#tutorial-result');
          resultDiv.html('<p class="text-muted">Processing...</p>');

            const confirmed = await E.confirm(
                'Are you sure you want to delete this item?',
                {
                    title: 'Confirm Deletion',
                    confirmText: 'Delete',
                    cancelText: 'Cancel'
                }
            );

            if (!confirmed) {
              resultDiv.html('<p class="text-warning">Deletion cancelled by user.</p>');
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
              resultDiv.html('<p class="text-success">✓ Item deleted successfully!</p>');
            } else {
              resultDiv.html(`<p class="text-warning">Deletion cancelled - you typed "${input || '(nothing)'}" instead of "DELETE".</p>`);
            }
        });
}
