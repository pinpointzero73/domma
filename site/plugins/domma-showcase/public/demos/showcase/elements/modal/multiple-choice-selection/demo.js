/**
 * Example 2: Multiple Choice Selection - from public/showcase/elements/modal.
 */
export function mount(root) {
        // Multiple choice
    $(root).find('#demo-promise-choice').on('click', async () => {
          const size = await E.showModal({
            title: 'Select Size',
            content: '<p>Choose your preferred size:</p>',
            buttons: [
              {id: 'small', text: 'Small'},
              {id: 'medium', text: 'Medium'},
              {id: 'large', text: 'Large'},
              {id: 'xl', text: 'Extra Large'}
            ]
          });

          const resultDiv = $(root).find('#promise-result-2');
          resultDiv.html(`<span class="text-success">✓ Selected: <strong>${size.toUpperCase()}</strong></span>`);
          console.log('Selected size:', size);
        });
}
