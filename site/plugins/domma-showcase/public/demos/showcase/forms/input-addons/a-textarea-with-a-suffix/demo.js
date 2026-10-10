/**
 * A textarea with a suffix - from public/showcase/forms/input-addons.
 */
export function mount(root) {
    const F = Domma.forms;
    const render = (blueprint, target) => F.create(blueprint, {}, {layout: 'stacked', showSubmitButton: false}).renderTo(target);
    render({
            message: {
                type: 'textarea',
                label: 'Message',
                formConfig: {rows: 4, suffix: {icon: 'message-square'}, placeholder: 'Write your message...'}
            }
        }, '#form-textarea');
}
