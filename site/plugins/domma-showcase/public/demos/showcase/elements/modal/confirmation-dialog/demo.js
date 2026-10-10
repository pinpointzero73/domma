/**
 * Example 1: Confirmation Dialog - from public/showcase/elements/modal.
 */
export function mount(root) {
        // Promise Mode Examples
    $(root).find('#demo-promise-confirm').on('click', async () => {
          const result = await E.showModal({
            title: 'Confirm Deletion',
            content: '<p>Are you sure you want to delete this item?</p><p class="text-sm text-danger">This action cannot be undone.</p>',
            buttons: [
              {id: 'cancel', text: 'Cancel', variant: 'secondary'},
              {id: 'delete', text: 'Delete', variant: 'danger'}
            ]
          });

          const resultDiv = $(root).find('#promise-result-1');
          if (result === 'delete') {
            resultDiv.html('<span class="text-danger">✓ Item deleted at ' + D().format('HH:mm:ss') + '</span>');
            E.toast('Item deleted successfully', {type: 'success'});
          } else {
            resultDiv.html('<span class="text-secondary">Deletion cancelled</span>');
          }
        });
}
