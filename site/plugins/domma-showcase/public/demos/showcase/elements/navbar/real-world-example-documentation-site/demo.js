/**
 * Real-World Example: Documentation Site - from public/showcase/elements/navbar.
 */
export function mount(root) {
        // Example 8: Documentation Site
    E.navbar(root.querySelector('#docs-navbar'), {
            brand: {
              logo: '/plugins/domma-showcase/public/assets/placeholders/32x32-2563eb-ffffff-d.svg',
                text: 'API Docs',
                url: '#'
            },
            items: [
                {text: 'Home', url: '#', active: true},
                {
                    text: 'Getting Started',
                    items: [
                        {text: 'Installation', url: '#'},
                        {text: 'Quick Start', url: '#'},
                        {text: 'Configuration', url: '#'}
                    ]
                },
                {
                    text: 'API Reference',
                    items: [
                        {text: 'Elements', url: '#'},
                        {text: 'Utilities', url: '#'},
                        {text: 'Models', url: '#'}
                    ]
                },
                {text: 'Examples', url: '#'}
            ],
            actions: [
                {text: 'GitHub', variant: 'outline', url: '#'}
            ],
            variant: 'light',
            position: 'static'
        });
}
