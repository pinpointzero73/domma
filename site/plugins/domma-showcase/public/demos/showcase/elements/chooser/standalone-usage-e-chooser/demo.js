/**
 * Standalone usage (E.chooser) - from public/showcase/elements/chooser.
 */
export function mount(root) {
    const E = Domma.elements;
        // ---- Standalone control demo ----
    const standalone = E.chooser(root.querySelector('#standalone-demo'), {
            variant: 'card',
            columns: 3,
            options: [
                { value: 'alpha', label: 'Alpha', icon: 'star' },
                { value: 'beta',  label: 'Beta',  icon: 'circle' },
                { value: 'gamma', label: 'Gamma', icon: 'square' }
            ],
            onChange: (v) => { $(root).find('#standalone-output').text('value: ' + JSON.stringify(v)); }
        });
    $(root).find('#standalone-set-a').on('click', () => {
            standalone.setValue('alpha');
            $(root).find('#standalone-output').text('value: ' + JSON.stringify(standalone.getValue()));
        });
    $(root).find('#standalone-set-b').on('click', () => {
            standalone.setValue('beta');
            $(root).find('#standalone-output').text('value: ' + JSON.stringify(standalone.getValue()));
        });
    $(root).find('#standalone-clear').on('click', () => {
            standalone.setValue(null);
            $(root).find('#standalone-output').text('value: (none)');
        });
    $(root).find('#standalone-disable').on('click', () => standalone.disable());
    $(root).find('#standalone-enable').on('click', () => standalone.enable());
}
