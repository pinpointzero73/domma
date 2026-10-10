/**
 * Full Form with Validation - from public/showcase/models/dot-notation.
 */
export function mount(root) {
    function bindNested(model, field, path, selector, options = {}) {
        // Ensure we have a DOM element, not a jQuery object
        const element = typeof selector === 'string' ?
          $(selector)[0] :
          (selector.jquery ? selector[0] : selector);

        return M.bind(model, field, element, {
          ...options,
          format: (data) => _.get(data, path, ''),
          parse: (value) => {
            const data = _.cloneDeep(model.get(field) || {});
            _.set(data, path, value);
            return data;
          }
        });
      }
      // Utility to serialize form with dot notation
    function serializeFormWithDotNotation(formSelector) {
        const data = {};

        $(formSelector).find('input, select, textarea').each(function () {
          const element = $(this);
          const name = element.attr('name');
          if (!name) return;

          let value;
          if (element.attr('type') === 'checkbox') {
            value = element.prop('checked');
          } else if (element.attr('type') === 'radio') {
            if (element.prop('checked')) {
              value = element.val();
            } else {
              return;
            }
          } else {
            value = element.val();
          }

          _.set(data, name, value);
        });

        return data;
      }
      // Example 3: Registration Form
    const registrationModel = M.create({
        formData: {
          type: 'object',
          default: {},
          validate: (data) => {
            const errors = [];

            if (!_.get(data, 'personal.firstName')) {
              errors.push('First name is required');
            }
            if (!_.get(data, 'personal.lastName')) {
              errors.push('Last name is required');
            }
            if (!_.get(data, 'personal.email')?.includes('@')) {
              errors.push('Valid email is required');
            }
            if (!_.get(data, 'address.city')) {
              errors.push('City is required');
            }
            if (!_.get(data, 'address.country')) {
              errors.push('Country is required');
            }
            if (!_.get(data, 'account.terms')) {
              errors.push('You must agree to the terms and conditions');
            }

            return errors.length > 0 ? errors.join(', ') : true;
          }
        }
      });
      // Bind all form fields
    $('#registration-form input, #registration-form select').each(function () {
        const element = this; // Use the DOM element directly
        const name = element.getAttribute('name');
        if (!name) return;

        bindNested(registrationModel, 'formData', name, element, {twoWay: true});
      });
      // Handle form submission
    $(root).find('#registration-form').on('submit', (e) => {
        e.preventDefault();

        const validation = registrationModel.validate();
        const validationMsg = $(root).find('#validation-message');

        if (validation.valid) {
          const data = serializeFormWithDotNotation('#registration-form');
          $(root).find('#ex3-display').text(JSON.stringify(data, null, 2));

          validationMsg
            .removeClass('validation-error')
            .addClass('validation-success')
            .text('✓ Form is valid! Check the serialized data below.')
            .show();
        } else {
          validationMsg
            .removeClass('validation-success')
            .addClass('validation-error')
            .text('✗ Validation failed: ' + validation.errors[0].error)
            .show();
        }
      });
      // Reset form
    $(root).find('#reset-form').on('click', () => {
        $(root).find('#registration-form')[0].reset();
        registrationModel.set('formData', {});
        $(root).find('#ex3-display').text('Submit the form to see the data structure');
        $(root).find('#validation-message').hide();
      });
      // Populate sample data
    $(root).find('#populate-form').on('click', () => {
        const sampleData = {
          personal: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phone: '+1 555 123 4567'
          },
          address: {
            street: '456 Oak Avenue',
            city: 'San Francisco',
            state: 'CA',
            zip: '94102',
            country: 'US'
          },
          account: {
            type: 'premium',
            newsletter: true,
            terms: true
          }
        };

        // Set values in form using dot notation paths
        function setFormValues(obj, prefix = '') {
          for (const [key, value] of Object.entries(obj)) {
            const path = prefix ? `${prefix}.${key}` : key;
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              setFormValues(value, path);
            } else {
              const input = $(`[name="${path}"]`)[0];
              if (input) {
                if (input.type === 'checkbox') {
                  input.checked = value;
                } else {
                  input.value = value;
                }
              }
            }
          }
        }

        setFormValues(sampleData);

        // Update model
        registrationModel.set('formData', sampleData);
        $(root).find('#validation-message').hide();
      });
}
