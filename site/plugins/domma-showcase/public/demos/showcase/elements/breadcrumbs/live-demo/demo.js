/**
 * Live Demo - from public/showcase/elements/breadcrumbs.
 */
export function mount(root) {
        // Config Engine Demo
    $.setup({
            '#config-demo-breadcrumbs': {
                component: 'breadcrumbs',
                options: {
                    items: [
                        {text: 'Config', url: '#'},
                        {text: 'Engine', url: '#'},
                        {text: 'Demo', active: true}
                    ],
                    separator: 'chevron',
                    homeIcon: true
                }
            }
        });
}
