/**
 * Modal Forms - from public/showcase/forms.
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
              const output = $(selector);
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
            // Modal Forms
    $(root).find('#open-edit-modal').on('click', () => {
              try {
                const modal = Domma.forms.modal(userBlueprint, sampleData, {
                  title: 'Edit User Profile',
                  size: 'medium',
                  saveText: 'Update Profile',
                  onSave: async (formData, formInstance) => {
                    logToOutput('#modal-form-output', 'User updated: ' + JSON.stringify(formData, null, 2));
                  },
                  onError: (error, formData, formInstance) => {
                    logToOutput('#modal-form-output', 'Error: ' + error.message);
                  }
                });
                modal.open();
              } catch (error) {
                logToOutput('#modal-form-output', 'Modal error: ' + error.message);
              }
            });
    $(root).find('#open-create-modal').on('click', () => {
              try {
                const modal = Domma.forms.modal(userBlueprint, {}, {
                  title: 'Create New User',
                  size: 'medium',
                  saveText: 'Create User',
                  onSave: async (formData, formInstance) => {
                    logToOutput('#modal-form-output', 'User created: ' + JSON.stringify(formData, null, 2));
                  },
                  onError: (error, formData, formInstance) => {
                    logToOutput('#modal-form-output', 'Error: ' + error.message);
                  }
                });
                modal.open();
              } catch (error) {
                logToOutput('#modal-form-output', 'Modal error: ' + error.message);
              }
            });
}
