/**
 * Text prefix and suffix - price field - from public/showcase/forms/input-addons.
 */
export function mount(root) {
    const F = Domma.forms;
    const render = (blueprint, target) => F.create(blueprint, {}, {layout: 'stacked', showSubmitButton: false}).renderTo(target);
    render({
            price: {
                type: 'number',
                label: 'Price',
                formConfig: {prefix: {text: '£'}, suffix: {text: '.00'}, placeholder: '0'}
            }
        }, '#form-text-addons');
}
