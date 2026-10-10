/**
 * Icon prefix - search field - from public/showcase/forms/input-addons.
 */
export function mount(root) {
    const F = Domma.forms;
    const render = (blueprint, target) => F.create(blueprint, {}, {layout: 'stacked', showSubmitButton: false}).renderTo(target);
    render({
            search: {
                type: 'text',
                label: 'Search',
                formConfig: {prefix: {icon: 'search'}, placeholder: 'Type to search...'}
            }
        }, '#form-icon-prefix');
}
