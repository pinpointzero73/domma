/**
 * Programmatic Control - from public/showcase/elements/button-group.
 */
export function mount(root) {
        // Examples: Programmatic Control
    const progGroup = E.buttonGroup(root.querySelector('#programmatic-group'), {
            mode: 'multiple',
            onChange: (values) => {
                $(root).find('#prog-value').text(JSON.stringify(values));
            }
        });
    $(root).find('#prog-set-0').on('click', () => progGroup.setValue([0]));
    $(root).find('#prog-set-1').on('click', () => progGroup.setValue([1]));
    $(root).find('#prog-toggle-2').on('click', () => progGroup.toggle(2));
    $(root).find('#prog-clear').on('click', () => progGroup.deselectAll());
}
