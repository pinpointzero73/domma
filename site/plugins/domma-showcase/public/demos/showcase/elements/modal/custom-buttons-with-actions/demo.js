/**
 * Example 3: Custom Buttons with Actions - from public/showcase/elements/modal.
 */
export function mount(root) {
        // Custom buttons with actions
    $(root).find('#demo-factory-actions').on('click', () => {
          E.createModal({
            title: 'Custom Actions',
            content: '<p>Choose an action to perform:</p>',
            buttons: [
              {id: 'cancel', text: 'Cancel', variant: 'secondary'},
              {id: 'save', text: 'Save', variant: 'primary'},
              {id: 'delete', text: 'Delete', variant: 'danger'}
            ],
            onButtonClick: (buttonId, modal) => {
              console.log('Button clicked:', buttonId);
              if (buttonId === 'save') {
                E.toast('Saved successfully!', {type: 'success'});
              } else if (buttonId === 'delete') {
                E.toast('Deleted!', {type: 'error'});
              }
            }
          }).open();
        });
}
