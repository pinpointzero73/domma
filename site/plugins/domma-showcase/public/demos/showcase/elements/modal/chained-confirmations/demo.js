/**
 * Example 4: Chained Confirmations - from public/showcase/elements/modal.
 */
export function mount(root) {
        // Chained confirmations
    $(root).find('#demo-promise-chain').on('click', async () => {
          // First confirmation
          const firstConfirm = await E.showModal({
            title: 'Warning',
            content: '<p class="mb-2">This will permanently delete all data.</p><p class="text-warning"><strong>Are you sure you want to continue?</strong></p>',
            buttons: [
              {id: 'cancel', text: 'Cancel', variant: 'secondary'},
              {id: 'continue', text: 'Continue', variant: 'warning'}
            ]
          });

          if (firstConfirm !== 'continue') {
            $(root).find('#promise-result-4').html('<span class="text-secondary">Operation cancelled at step 1</span>');
            return;
          }

          // Second confirmation
          const secondConfirm = await E.showModal({
            title: 'Final Confirmation',
            content: '<p class="text-danger"><strong>Are you absolutely sure?</strong></p><p class="text-sm">This action cannot be undone!</p>',
            buttons: [
              {id: 'no', text: 'No, Go Back', variant: 'secondary'},
              {id: 'yes', text: 'Yes, Delete Everything', variant: 'danger'}
            ]
          });

          const resultDiv = $(root).find('#promise-result-4');
          if (secondConfirm === 'yes') {
            resultDiv.html('<span class="text-danger">✓ All data deleted at ' + D().format('HH:mm:ss') + '</span>');
            E.toast('All data deleted', {type: 'error'});
          } else {
            resultDiv.html('<span class="text-secondary">Operation cancelled at step 2</span>');
          }
        });
}
