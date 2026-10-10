/**
 * Clear button - from public/showcase/forms/input-addons.
 */
export function mount(root) {
    const F = Domma.forms;
    const clearForm = F.create({
            search: {
                type: 'string',
                label: 'Search',
                formConfig: {prefix: {icon: 'search'}, clear: true, placeholder: 'Type, then clear'}
            }
        }, {search: 'quarterly report'}, {layout: 'stacked', showSubmitButton: false});
    clearForm.renderTo('#form-clear');
    const showClearModel = () => $(root).find('#clear-model').text(JSON.stringify(clearForm.getData().search ?? ''));
    $(root).find('#form-clear').on('change', showClearModel);
    showClearModel();
        // ---- E.inputGroup on a hand-written input --------------------------------
    let group = null;
    const change = (slots) => {
            if (!group) return;
            group.update(slots);
            showMarkup();
        };
}
