/**
 * Theme Variants - from public/showcase/elements/navbar.
 */
export function mount(root) {
    const sampleItems = [
            {text: 'Home', url: '#', active: true},
            {text: 'Features', url: '#'},
            {text: 'Pricing', url: '#'}
        ];
        // Example 1: Variants
    E.navbar(root.querySelector('#variant-light'), {
            variant: 'light',
            brand: {text: 'Light App'},
            items: sampleItems
        });
    E.navbar(root.querySelector('#variant-dark'), {
            variant: 'dark',
            brand: {text: 'Dark App'},
            items: sampleItems
        });
    E.navbar(root.querySelector('#variant-transparent'), {
            variant: 'transparent',
            brand: {text: 'Transparent App'},
            items: sampleItems
        });
}
