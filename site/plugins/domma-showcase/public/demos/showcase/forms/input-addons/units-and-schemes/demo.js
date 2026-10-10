/**
 * Units and schemes - from public/showcase/forms/input-addons.
 */
export function mount(root) {
    const F = Domma.forms;
    const render = (blueprint, target) => F.create(blueprint, {}, {layout: 'stacked', showSubmitButton: false}).renderTo(target);
    render({
            weight: {
                type: 'number',
                label: 'Parcel weight',
                formConfig: {suffix: {text: 'kg'}, placeholder: '0.0'}
            },
            website: {
                type: 'string',
                label: 'Website',
                formConfig: {prefix: {text: 'https://'}, placeholder: 'example.com'}
            }
        }, '#form-units');
}
