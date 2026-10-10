/**
 * Interactive Toggle Group (Single Selection) - from public/showcase/elements/button-group.
 */
export function mount(root) {
    const quickStartLabels = ['Day', 'Week', 'Month'];
    E.buttonGroup(root.querySelector('#quick-start-group'), {
            mode: 'single',
            onChange: (value) => {
                $(root).find('#quick-start-value').text(quickStartLabels[value]);
            }
        });
}
