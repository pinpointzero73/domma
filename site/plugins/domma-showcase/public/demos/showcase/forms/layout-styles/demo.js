/**
 * Layout Styles - from public/showcase/forms.
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
            // The card is in demo.html behind data-if, its title bound to layoutType.
            // Keep the wrapper node: data-if detaches it (and puts the same node back).
    const wrapper = $(root).find('#layout-form-wrapper')[0];
    const shown = M.observable(false);
    const layoutType = M.observable('');
    const handle = M.applyBindings({shown, layoutType}, root);
            // Helper function to render layout forms into the card
    function renderLayoutForm(form, type) {
              form.renderTo(wrapper);
              layoutType.value = type;
              shown.value = true;
            }
            // Form Layouts
    $(root).find('#layout-stacked').on('click', () => {
              try {
                const form = Domma.forms.create(userBlueprint, sampleData, {
                  layout: 'stacked'
                });
                renderLayoutForm(form, 'Stacked');
              } catch (error) {
                console.error('Layout error:', error);
              }
            });
    $(root).find('#layout-grid').on('click', () => {
              try {
                const form = Domma.forms.create(userBlueprint, sampleData, {
                  layout: 'grid',
                  columns: 2
                });
                renderLayoutForm(form, 'Grid (2-col)');
              } catch (error) {
                console.error('Layout error:', error);
              }
            });
    $(root).find('#layout-sections').on('click', () => {
              try {
                const form = Domma.forms.create(userBlueprint, sampleData, {
                  layout: 'grid',
                  columns: 2,
                  sections: [
                    {
                      title: 'Personal Information',
                      fields: ['name', 'email', 'age']
                    },
                    {
                      title: 'Account Settings',
                      fields: ['role', 'newsletter']
                    }
                  ]
                });
                renderLayoutForm(form, 'With Sections');
              } catch (error) {
                console.error('Layout error:', error);
              }
            });
    $(root).find('#clear-layout-form').on('click', () => {
              shown.value = false;
              $(wrapper).empty();
            });
    return () => handle.dispose();
}
