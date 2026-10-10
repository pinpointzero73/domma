/**
 * A select with an icon prefix - from public/showcase/forms/input-addons.
 */
export function mount(root) {
    const F = Domma.forms;
    const render = (blueprint, target) => F.create(blueprint, {}, {layout: 'stacked', showSubmitButton: false}).renderTo(target);
    render({
            country: {
                type: 'select',
                label: 'Country',
                options: [
                    {value: 'gb', label: 'United Kingdom'},
                    {value: 'ie', label: 'Ireland'},
                    {value: 'fr', label: 'France'}
                ],
                formConfig: {prefix: {icon: 'globe'}}
            }
        }, '#form-select');
}
