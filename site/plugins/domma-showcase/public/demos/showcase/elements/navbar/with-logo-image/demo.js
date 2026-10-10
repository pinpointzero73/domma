/**
 * With Logo Image - from public/showcase/elements/navbar.
 */
export function mount(root) {
        // Example 2: Logo
    E.navbar(root.querySelector('#logo-example'), {
            brand: {
              logo: '/plugins/domma-showcase/public/assets/placeholders/32x32-2563eb-ffffff-d.svg',
                text: 'Domma',
                url: '#'
            },
            items: [
                {text: 'Home', url: '#'},
                {text: 'About', url: '#'}
            ]
        });
}
