/**
 * Format Toolbar (Multiple Selection) - from public/showcase/elements/button-group.
 */
export function mount(root) {
        // Examples: Format Toolbar
    const formatLabels = ['Bold', 'Italic', 'Underline'];
    E.buttonGroup(root.querySelector('#format-toggle'), {
            mode: 'multiple',
            onChange: (values) => {
                const active = values.map(i => formatLabels[i]).join(', ');
                $(root).find('#format-value').text(active || 'None');
            }
        });
}
