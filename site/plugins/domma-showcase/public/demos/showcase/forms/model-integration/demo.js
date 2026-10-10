/**
 * Model Integration - from public/showcase/forms.
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
    const wrapper = $(root).find('#model-form-wrapper')[0];
    const shown = M.observable(false);
    const handle = M.applyBindings({shown}, root);
            // Model Integration
    let userModel = null;
    $(root).find('#create-model-form').on('click', () => {
              try {
                // Create model with persistence
                userModel = M.create(userBlueprint, sampleData, {
                  persist: 'forms-showcase-user'
                });

                // Listen for model changes
                userModel.onChange((changes) => {
                  logToOutput('#model-output', 'Model changed: ' + JSON.stringify(changes, null, 2));
                });

                const form = Domma.forms.create(userBlueprint, userModel.get(), {
                  layout: 'grid',
                  columns: 2,
                  onSubmit: (data, formInstance) => {
                    userModel.set(data);
                    userModel.save(); // Explicitly save to localStorage
                    logToOutput('#model-output', 'Form submitted and model updated: ' + JSON.stringify(data, null, 2));
                    logToOutput('#model-output', 'Data automatically saved to localStorage with key: forms-showcase-user');
                  },
                  onChange: (data, formInstance) => {
                    // Auto-save on field changes for real-time persistence
                    userModel.set(data);
                    userModel.save();
                  }
                });

                form.renderTo(wrapper);
                shown.value = true;
                logToOutput('#model-output', 'Model form created with persistence. Data will be saved to localStorage.');
              } catch (error) {
                logToOutput('#model-output', 'Error: ' + error.message);
              }
            });
    $(root).find('#load-saved-data').on('click', () => {
              if (userModel) {
                userModel.load();
                logToOutput('#model-output', 'Data loaded from localStorage: ' + JSON.stringify(userModel.get(), null, 2));
              } else {
                logToOutput('#model-output', 'No model created yet. Create a form first.');
              }
            });
    $(root).find('#clear-saved-data').on('click', () => {
              if (userModel) {
                userModel.clearStorage();
                logToOutput('#model-output', 'Saved data cleared from localStorage.');
              } else {
                S.remove('forms-showcase-user');
                logToOutput('#model-output', 'Storage cleared manually.');
              }
            });
    return () => handle.dispose();
}
