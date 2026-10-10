/**
 * Example 3: Form Submission with Promise - from public/showcase/elements/modal.
 */
export function mount(root) {
        // Form submission with promise
    $(root).find('#demo-promise-form').on('click', async () => {
          const modal = E.createModal({
            title: 'Enter Details',
            content: `
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input type="text" id="user-name-input" class="form-input" placeholder="John Doe">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" id="user-email-input" class="form-input" placeholder="john@example.com">
                    </div>
                `,
            buttons: [
              {id: 'cancel', text: 'Cancel', variant: 'secondary'},
              {id: 'submit', text: 'Submit', variant: 'primary'}
            ]
          });

          const userData = await new Promise((resolve) => {
            modal.options.onButtonClick = (buttonId) => {
              if (buttonId === 'submit') {
                const data = {
                  name: $(root).find('#user-name-input').val(),
                  email: $(root).find('#user-email-input').val()
                };
                resolve(data);
              } else {
                resolve(null);
              }
            };
            modal.open();
          });

          const resultDiv = $(root).find('#promise-result-3');
          if (userData && userData.name && userData.email) {
            resultDiv.html(`<span class="text-success">✓ Submitted: ${userData.name} (${userData.email})</span>`);
          } else {
            resultDiv.html('<span class="text-secondary">Form submission cancelled</span>');
          }
        });
}
