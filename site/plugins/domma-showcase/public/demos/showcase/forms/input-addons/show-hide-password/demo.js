/**
 * Show / hide password - from public/showcase/forms/input-addons.
 */
export function mount(root) {
    const F = Domma.forms;
    const render = (blueprint, target) => F.create(blueprint, {}, {layout: 'stacked', showSubmitButton: false}).renderTo(target);
        // ---- Interactive extras ----------------------------------------------------
    render({
            password: {
                type: 'password',
                label: 'Password',
                formConfig: {prefix: {icon: 'lock'}, reveal: true, placeholder: 'Try typing, then the eye'}
            }
        }, '#form-reveal');
}
