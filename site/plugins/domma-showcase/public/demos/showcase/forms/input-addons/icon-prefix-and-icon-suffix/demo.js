/**
 * Icon prefix and icon suffix - from public/showcase/forms/input-addons.
 */
export function mount(root) {
    const F = Domma.forms;
    const render = (blueprint, target) => F.create(blueprint, {}, {layout: 'stacked', showSubmitButton: false}).renderTo(target);
    render({
            email: {
                type: 'email',
                label: 'Email',
                formConfig: {prefix: {icon: 'mail'}, suffix: {icon: 'check-circle'}, placeholder: 'you@example.com'}
            }
        }, '#form-mixed');
}
