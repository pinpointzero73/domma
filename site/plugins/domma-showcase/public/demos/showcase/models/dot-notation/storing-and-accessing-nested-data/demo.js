/**
 * Storing and Accessing Nested Data - from public/showcase/models/dot-notation.
 */
export function mount(root) {
      // Example 1: Basic Nested Data
    let ex1Model;
    $(root).find('#ex1-init').on('click', () => {
        ex1Model = M.create({
          profile: {type: 'object', default: {}},
          address: {type: 'object', default: {}}
        });

        ex1Model.set('profile', {
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Software developer'
        });

        ex1Model.set('address', {
          street: '123 Main St',
          city: 'New York',
          zip: '10001'
        });

        ex1Model.onChange(() => {
          $(root).find('#ex1-display').text(JSON.stringify(ex1Model.toJSON(), null, 2));
        });

        $(root).find('#ex1-display').text(JSON.stringify(ex1Model.toJSON(), null, 2));
      });
    $(root).find('#ex1-update').on('click', () => {
        if (!ex1Model) {
          E.toast('Please initialize the model first');
          return;
        }

        const address = ex1Model.get('address');
        _.set(address, 'city', 'Boston');
        ex1Model.set('address', address);
      });
    $(root).find('#ex1-get').on('click', () => {
        if (!ex1Model) {
          E.toast('Please initialize the model first');
          return;
        }

        const city = _.get(ex1Model.get('address'), 'city');
        const firstName = _.get(ex1Model.get('profile'), 'firstName');

        E.toast(`First Name: ${firstName}\nCity: ${city}`);
      });
}
