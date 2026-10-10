/**
 * Live Demo - from public/showcase/elements/button-group.
 */
export function mount(root) {
        // Config Engine Demo
    $.setup({
            '#config-demo-group': {
                component: 'buttonGroup',
                options: {
                    mode: 'single',
                    onChange: (value) => {
                        const labels = ['Option 1', 'Option 2', 'Option 3'];
                        $(root).find('#config-demo-value').text(labels[value]);
                    }
                }
            }
        });
}
