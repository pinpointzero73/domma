/**
 * HTML suffix - keyboard hint - from public/showcase/forms/input-addons.
 */
export function mount(root) {
    const F = Domma.forms;
    const render = (blueprint, target) => F.create(blueprint, {}, {layout: 'stacked', showSubmitButton: false}).renderTo(target);
    render({
            query: {
                type: 'text',
                label: 'Quick search',
                formConfig: {prefix: {icon: 'search'}, suffix: {html: '<kbd>Ctrl K</kbd>'}, placeholder: 'Search anywhere...'}
            }
        }, '#form-html-suffix');
}
