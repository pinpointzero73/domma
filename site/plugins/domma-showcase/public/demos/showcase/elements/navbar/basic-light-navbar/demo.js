/**
 * Basic Light Navbar - from public/showcase/elements/navbar.
 */
export function mount(root) {
    const sampleItems = [
            {text: 'Home', url: '#', active: true},
            {text: 'Features', url: '#'},
            {text: 'Pricing', url: '#'}
        ];
        // Quick Start Examples
    E.navbar(root.querySelector('#quick-start-navbar'), {
            brand: {text: 'Domma'},
            items: sampleItems
        });
}
