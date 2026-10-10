/**
 * Basic Form - from public/showcase/forms.
 */
export function mount(root) {
            // Common blueprints for examples
    const userBlueprint = {
              name: {
                type: 'string',
                label: 'Full Name',
                required: true,
                minLength: 2,
                formConfig: {
                  placeholder: 'Enter your full name'
                }
              },
              email: {
                type: 'email',
                label: 'Email Address',
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                formConfig: {
                  placeholder: 'user@example.com'
                }
              },
              age: {
                type: 'number',
                label: 'Age',
                min: 18,
                max: 120,
                formConfig: {
                  helperText: 'Must be between 18 and 120'
                }
              },
              role: {
                type: 'select',
                label: 'Role',
                options: [
                  {value: 'user', label: 'User'},
                  {value: 'moderator', label: 'Moderator'},
                  {value: 'admin', label: 'Administrator'}
                ],
                default: 'user'
              },
              newsletter: {
                type: 'boolean',
                label: 'Subscribe to Newsletter',
                default: false
              }
            };
    const sampleData = {
              name: 'Alice Johnson',
              email: 'alice@example.com',
              age: 28,
              role: 'user',
              newsletter: true
            };
            // Log function for outputs
    function logToOutput(selector, message) {
              const output = $(root).find(selector);
              if (output.length === 0) {
                console.warn('Output element not found:', selector);
                return;
              }
              const timestamp = D().format('HH:mm:ss');
              output.text(output.text() + `[${timestamp}] ${message}\n`);
              if (output[0]) {
                output.scrollTop(output[0].scrollHeight);
              }
            }
            // The card is in demo.html behind data-if; keep the wrapper node, since
            // data-if detaches it (and puts the same node back) when the card is hidden.
    const wrapper = $(root).find('#basic-form-wrapper')[0];
    const shown = M.observable(false);
    const handle = M.applyBindings({shown}, root);
            // Basic Form Generation
    $(root).find('#generate-basic-form').on('click', () => {
              try {
                const form = Domma.forms.create(userBlueprint, sampleData, {
                  layout: 'grid',
                  columns: 2,
                  onSubmit: (data, formInstance) => {
                    logToOutput('#basic-form-output', 'Form submitted: ' + JSON.stringify(data, null, 2));
                  },
                  onValidationError: (errors, formInstance) => {
                    logToOutput('#basic-form-output', 'Validation errors: ' + JSON.stringify(errors, null, 2));
                  }
                });

                form.renderTo(wrapper);
                shown.value = true;
                logToOutput('#basic-form-output', 'Form generated successfully!');
              } catch (error) {
                logToOutput('#basic-form-output', 'Error: ' + error.message);
              }
            });
    $(root).find('#clear-basic-form').on('click', () => {
              shown.value = false;
              $(wrapper).empty();
              $(root).find('#basic-form-output').text('Cleared. Click "Generate Form" to create a new form...');
            });
    return () => handle.dispose();
}
