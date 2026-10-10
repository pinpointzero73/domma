/**
 * 4. Forms - from public/showcase/themes.
 */
export function mount(root) {
      // F.create() - schema, data, options → renderTo(selector)
    if (window.F && F.create) {
        try {
          const blueprint = {
            name:    { type: M.types.string, required: true, label: 'Customer name' },
            email:   { type: M.types.string, required: true, label: 'Email', formConfig: { inputType: 'email' } },
            country: { type: M.types.string, label: 'Country', formConfig: { component: 'select', options: ['United Kingdom', 'United States', 'France', 'Germany'] } },
            notes:   { type: M.types.string, label: 'Notes', formConfig: { component: 'textarea' } }
          };
          F.create(blueprint, {}, { layout: 'grid', columns: 2, submitLabel: 'Save customer' }).renderTo('#audit-form-host');
        } catch (err) {
          $(root).find('#audit-form-host').append(
            $('<div class="alert alert-warning"></div>').text(
              'F.create() blueprint demo unavailable: ' + err.message
            )
          );
        }
      }
}
