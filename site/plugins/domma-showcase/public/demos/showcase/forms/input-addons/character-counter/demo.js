/**
 * Character counter - from public/showcase/forms/input-addons.
 */
export function mount(root) {
    const F = Domma.forms;
    const render = (blueprint, target) => F.create(blueprint, {}, {layout: 'stacked', showSubmitButton: false}).renderTo(target);
    render({
            headline: {type: 'string', label: 'Headline', formConfig: {counter: 60, clear: true, placeholder: 'Up to 60 characters'}},
            bio: {type: 'textarea', label: 'Short bio', maxLength: 200, formConfig: {rows: 3, counter: true}}
        }, '#form-counter');
}
