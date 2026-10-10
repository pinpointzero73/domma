/**
 * Form Validation - from public/showcase/forms.
 */
export function mount(root) {
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
            // Validation Form
    const validationBlueprint = {
              username: {
                type: 'string',
                label: 'Username',
                required: true,
                minLength: 3,
                maxLength: 20,
                pattern: /^[a-zA-Z0-9_]+$/,
                formConfig: {
                  hint: 'Only letters, numbers, and underscores',
                  placeholder: 'Enter username'
                },
                validate: (value) => {
                  if (value.toLowerCase().includes('admin')) {
                    return 'Username cannot contain "admin"';
                  }
                  if (value.toLowerCase().includes('test')) {
                    return 'Username cannot contain "test"';
                  }
                  return true;
                }
              },
              email: {
                type: 'email',
                label: 'Email Address',
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                formConfig: {
                  hint: 'Enter a valid email address',
                  placeholder: 'user@example.com'
                },
                validate: (value) => {
                  if (value.includes('spam')) {
                    return 'Email cannot contain "spam"';
                  }
                  return true;
                }
              },
              age: {
                type: 'number',
                label: 'Age',
                required: true,
                min: 13,
                max: 120,
                formConfig: {
                  hint: 'Must be between 13 and 120',
                  placeholder: 'Enter your age'
                },
                validate: (value) => {
                  const num = parseInt(value);
                  if (num < 13) return 'Must be at least 13 years old';
                  if (num > 120) return 'Age cannot exceed 120';
                  if (num >= 13 && num < 18) return 'Warning: Under 18 requires parental consent';
                  return true;
                }
              },
              password: {
                type: 'password',
                label: 'Password',
                required: true,
                minLength: 8,
                formConfig: {
                  hint: 'At least 8 characters with uppercase, number, and special character',
                  placeholder: 'Enter secure password'
                },
                validate: (value) => {
                  if (!/[A-Z]/.test(value)) return 'Must contain uppercase letter';
                  if (!/[a-z]/.test(value)) return 'Must contain lowercase letter';
                  if (!/[0-9]/.test(value)) return 'Must contain number';
                  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Must contain special character';
                  return true;
                }
              },
              confirmPassword: {
                type: 'password',
                label: 'Confirm Password',
                required: true,
                formConfig: {
                  hint: 'Re-enter the password above',
                  placeholder: 'Confirm password'
                },
                validate: (value, allData) => {
                  if (!value) return 'Password confirmation is required';
                  return value === allData.password || 'Passwords do not match';
                }
              }
            };
            // The card is in demo.html behind data-if; keep the wrapper node, since
            // data-if detaches it (and puts the same node back) when the card is hidden.
    const wrapper = $(root).find('#validation-form-wrapper')[0];
    const shown = M.observable(false);
    const handle = M.applyBindings({shown}, root);
    $(root).find('#generate-validation-form').on('click', () => {
              try {
                const form = Domma.forms.create(validationBlueprint, {}, {
                  validationMode: 'blur',
                  layout: 'grid',
                  columns: 2,
                  onSubmit: (data, formInstance) => {
                    logToOutput('#validation-output', 'Validation form submitted: ' + JSON.stringify(data, null, 2));
                  },
                  onValidationError: (errors, formInstance) => {
                    logToOutput('#validation-output', 'Validation errors: ' + JSON.stringify(errors, null, 2));
                  }
                });

                form.renderTo(wrapper);
                shown.value = true;
                logToOutput('#validation-output', 'Validation form generated. Try entering invalid data to see validation in action.');
              } catch (error) {
                logToOutput('#validation-output', 'Error: ' + error.message);
              }
            });
    $(root).find('#clear-validation-form').on('click', () => {
              shown.value = false;
              $(wrapper).empty();
              $(root).find('#validation-output').text('Cleared. Click "Generate Validation Form" to create a new form...');
            });
    return () => handle.dispose();
}
