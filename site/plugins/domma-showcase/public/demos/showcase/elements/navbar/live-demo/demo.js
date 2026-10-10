/**
 * Live Demo - from public/showcase/elements/navbar.
 */
export function mount(root) {
        // Config Engine Demo
    $.setup({
            '#config-demo-navbar': {
                component: 'navbar',
                options: {
                    brand: {text: 'Config Demo'},
                    items: [
                        {text: 'Home', url: '#', active: true},
                        {text: 'Docs', url: '#'}
                    ],
                    actions: [
                        {text: 'Get Started', variant: 'primary', url: '#'}
                    ]
                }
            }
        });
}
