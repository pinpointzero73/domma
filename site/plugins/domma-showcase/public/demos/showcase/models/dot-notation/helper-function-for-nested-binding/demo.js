/**
 * Helper Function for Nested Binding - from public/showcase/models/dot-notation.
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
      // Example 2: Form Binding
    const ex2Model = M.create({
        userData: {type: 'object', default: {}}
      });
      // Bind inputs with nested paths
    bindNested(ex2Model, 'userData', 'user.name', '#user-name', {twoWay: true});
    bindNested(ex2Model, 'userData', 'user.email', '#user-email', {twoWay: true});
    bindNested(ex2Model, 'userData', 'address.city', '#address-city', {twoWay: true});
      // Display updates
    ex2Model.onChange(() => {
        $(root).find('#ex2-display').text(JSON.stringify(ex2Model.get('userData'), null, 2));
      });
}
