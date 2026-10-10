/**
 * Example 1: Basic Factory Modal - from public/showcase/elements/modal.
 */
export function mount(root) {
        // Factory Mode Examples
    $(root).find('#demo-factory-basic').on('click', () => {
          const modal = E.createModal({
            title: 'Welcome',
            content: '<p>This modal was created programmatically using <code>createModal()</code>!</p><p>No pre-existing HTML required.</p>',
            size: 'medium',
            buttons: [
              {id: 'close', text: 'Close', variant: 'primary'}
            ]
          });
          modal.open();
        });
}
