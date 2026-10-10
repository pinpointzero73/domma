/**
 * Live Demo - from public/showcase/elements/loader.
 */
export function mount(root) {
        // Config Engine Demo
    $.setup({
            '#config-demo-container': {
                component: 'loader',
                options: {
                    type: 'dots',
                    size: 'medium',
                    color: 'primary',
                    overlay: true,
                    text: 'Config Engine Loader'
                }
            },

            '#config-trigger-btn': {
                events: {
                    click: () => {
                        const loader = E.get(root.querySelector('#config-demo-container'));
                        loader.show();
                        setTimeout(() => loader.hide(), 2000);
                    }
                }
            }
        });
}
