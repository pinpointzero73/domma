/**
 * String shorthand - from public/showcase/forms/input-addons.
 */
export function mount(root) {
    const F = Domma.forms;
    const render = (blueprint, target) => F.create(blueprint, {}, {layout: 'stacked', showSubmitButton: false}).renderTo(target);
    render({
            salary: {
                type: 'number',
                label: 'Salary',
                formConfig: {prefix: '£', suffix: 'a year', placeholder: '32000'}
            }
        }, '#form-shorthand');
}
