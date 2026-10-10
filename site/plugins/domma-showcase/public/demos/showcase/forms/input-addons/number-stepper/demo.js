/**
 * Number stepper - from public/showcase/forms/input-addons.
 */
export function mount(root) {
    const F = Domma.forms;
    const render = (blueprint, target) => F.create(blueprint, {}, {layout: 'stacked', showSubmitButton: false}).renderTo(target);
    render({
            guests: {type: 'integer', label: 'Guests', min: 1, max: 8, default: 2, formConfig: {stepper: true}},
            rate: {
                type: 'number',
                label: 'Nightly rate',
                min: 0,
                max: 500,
                step: 12.5,
                default: 100,
                formConfig: {prefix: '£', suffix: 'per night', stepper: true}
            }
        }, '#form-stepper');
}
