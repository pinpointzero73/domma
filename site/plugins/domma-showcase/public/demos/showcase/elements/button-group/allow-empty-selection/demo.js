/**
 * Allow Empty Selection - from public/showcase/elements/button-group.
 */
export function mount(root) {
        // Examples: Allow Empty
    const optionalLabels = ['Option A', 'Option B', 'Option C'];
    E.buttonGroup(root.querySelector('#optional-group'), {
            mode: 'single',
            allowEmpty: true,
            onChange: (value) => {
                $(root).find('#optional-value').text(value !== null ? optionalLabels[value] : 'None');
            }
        });
}
