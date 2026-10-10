/**
 * View Toggle (Single Selection) - from public/showcase/elements/button-group.
 */
export function mount(root) {
        // Examples: View Toggle
    const viewLabels = ['Day', 'Week', 'Month'];
    E.buttonGroup(root.querySelector('#view-toggle'), {
            mode: 'single',
            onChange: (value) => {
                $(root).find('#view-value').text(viewLabels[value]);
            }
        });
}
