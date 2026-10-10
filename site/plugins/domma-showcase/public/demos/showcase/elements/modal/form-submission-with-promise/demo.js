/**
 * Example 3: Form Submission with Promise - from public/showcase/elements/modal.
 */
export function mount(root) {
        // Form submission with promise
    // The result line binds to these observables (data-if / data-bind-text in demo.html)
    const outcome = M.observable('');
    const user = M.observable({name: '', email: ''});
    const handle = M.applyBindings({outcome, user}, root.querySelector('#promise-result-3'));
    $(root).find('#demo-promise-form').on('click', async () => {
          // The answer is a promise: Save resolves it with the form's data; Cancel, the close
          // button or the backdrop all go through close(), which resolves it with null.
          // Whichever happens first wins. F.modal builds the fields from a blueprint, with
          // validation, so Save only fires with a name and a valid email.
          const userData = await new Promise((resolve) => {
            const modal = F.modal({
              name: {type: 'string', label: 'Name', required: true, formConfig: {placeholder: 'Ada Lovelace'}},
              email: {type: 'email', label: 'Email', required: true, formConfig: {placeholder: 'ada@example.com'}}
            }, {}, {
              title: 'Enter Details',
              saveText: 'Submit',
              onSave: (data) => resolve(data)
            });
            const close = modal.close.bind(modal);
            modal.close = () => { resolve(null); close(); };
            modal.open();
          });

          if (userData && userData.name && userData.email) {
            user.value = userData;
            outcome.value = 'submitted';
          } else {
            outcome.value = 'cancelled';
          }
        });
    return () => handle.dispose();
}
