/**
 * Example 2: Multiple Choice Selection - from public/showcase/elements/modal.
 */
export function mount(root) {
        // Multiple choice - the chosen size is an observable the result line binds to
    const size = M.observable('');
    const sizeLabel = M.computed(() => size.value.toUpperCase());
    const handle = M.applyBindings({size, sizeLabel}, root.querySelector('#promise-result-2'));
    $(root).find('#demo-promise-choice').on('click', async () => {
          const choice = await E.showModal({
            title: 'Select Size',
            content: '<p>Choose your preferred size:</p>',
            buttons: [
              {id: 'small', text: 'Small'},
              {id: 'medium', text: 'Medium'},
              {id: 'large', text: 'Large'},
              {id: 'xl', text: 'Extra Large'}
            ]
          });

          size.value = choice;
          console.log('Selected size:', choice);
        });
    return () => handle.dispose();
}
