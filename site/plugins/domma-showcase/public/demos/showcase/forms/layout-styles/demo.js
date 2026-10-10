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
            // Helper function to render layout forms with card wrapper
    function renderLayoutForm(form, layoutType) {
              $(root).find('#layout-form-container').html(`
                <div class="card mt-4">
                    <div class="card-header">
                        <h4 class="card-title mb-0">${layoutType} Layout Demo</h4>
                    </div>
                    <div class="card-body" id="layout-form-wrapper">
                    </div>
                </div>
            `);
              form.renderTo('#layout-form-wrapper');
            }
            // Form Layouts
    $(root).find('#layout-stacked').on('click', () => {
              try {
                const form = Domma.forms.create(userBlueprint, sampleData, {
                  layout: 'grid',
                  columns: 2
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
              $(root).find('#layout-form-container').empty();
            });
}
