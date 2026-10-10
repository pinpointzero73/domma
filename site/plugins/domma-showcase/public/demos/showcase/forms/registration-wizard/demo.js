/**
 * Registration Wizard - from public/showcase/forms.
 */
export function mount(root) {
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
            // Wizard Component
    $(root).find('#open-wizard').on('click', () => {
              try {
                // Show the wizard container
                $(root).find('#wizard-container').show();

                const wizard = Domma.forms.wizard('#wizard-container', {
                  blueprint: {
                    steps: [
                      {
                        title: 'Account Details',
                        description: 'Basic account information',
                        fields: [
                          {
                            name: 'username',
                            type: 'text',
                            label: 'Username',
                            required: true,
                            validation: {
                              minLength: 3
                            }
                          },
                          {
                            name: 'email',
                            type: 'email',
                            label: 'Email Address',
                            required: true
                          }
                        ]
                      },
                      {
                        title: 'Profile Information',
                        description: 'Tell us about yourself',
                        fields: [
                          {
                            name: 'name',
                            type: 'text',
                            label: 'Full Name',
                            required: true
                          },
                          {
                            name: 'bio',
                            type: 'textarea',
                            label: 'Biography',
                            formConfig: {
                              rows: 3
                            }
                          }
                        ]
                      },
                      {
                        title: 'Preferences',
                        description: 'Customize your experience',
                        fields: [
                          {
                            name: 'theme',
                            type: 'select',
                            label: 'Theme',
                            options: [
                              {value: 'light', label: 'Light'},
                              {value: 'dark', label: 'Dark'}
                            ]
                          },
                          {
                            name: 'notifications',
                            type: 'checkbox',
                            label: 'Enable Notifications'
                          }
                        ]
                      }
                    ]
                  },
                  layout: 'grid',
                  cols: 2,
                  finishText: 'Complete Registration',
                  onSubmit: (allData) => {
                    logToOutput('#wizard-output', 'Wizard completed! Data: ' + JSON.stringify(allData, null, 2));
                    $(root).find('#wizard-container').hide();
                  },
                  onStepChange: (step, data) => {
                    logToOutput('#wizard-output', `Moved to step ${step + 1}: ${JSON.stringify(data, null, 2)}`);
                  },
                  onValidation: (isValid, errors, step) => {
                    if (!isValid) {
                      logToOutput('#wizard-output', `Validation failed on step ${step + 1}: ${errors.join(', ')}`);
                    }
                  },
                  onError: (error) => {
                    logToOutput('#wizard-output', 'Wizard error: ' + error.message);
                  }
                });

                logToOutput('#wizard-output', 'Wizard created successfully! Use the navigation buttons to proceed.');
              } catch (error) {
                logToOutput('#wizard-output', 'Wizard error: ' + error.message);
                console.error('Wizard creation error:', error);
              }
            });
}
