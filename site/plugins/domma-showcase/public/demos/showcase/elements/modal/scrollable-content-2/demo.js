/**
 * Example 5: Scrollable Content - from public/showcase/elements/modal.
 */
export function mount(root) {
        // Scrollable content
    $(root).find('#demo-factory-scroll').on('click', () => {
          const longContent = Array(15).fill(null).map((_, i) => `
                <h6 class="mb-2">Section ${i + 1}</h6>
                <p class="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
            `).join('');

          E.createModal({
            title: 'Privacy Policy',
            content: longContent,
            size: 'large',
            scrollable: true,
            buttons: [
              {id: 'decline', text: 'Decline', variant: 'secondary'},
              {id: 'accept', text: 'Accept', variant: 'primary'}
            ],
            onButtonClick: (buttonId) => {
              if (buttonId === 'accept') {
                E.toast('Privacy policy accepted', {type: 'success'});
              }
            }
          }).open();
        });
}
