/**
 * Dropdown Menus - from public/showcase/elements/navbar.
 */
export function mount(root) {
        // Example 3: Dropdowns
    E.navbar(root.querySelector('#dropdown-example'), {
            brand: {text: 'App'},
            items: [
                {text: 'Home', url: '#'},
                {
                    text: 'Products',
                    items: [
                        {text: 'Product A', url: '#'},
                        {text: 'Product B', url: '#'},
                        {text: 'Product C', url: '#'}
                    ]
                },
                {
                    text: 'Resources',
                    items: [
                        {text: 'Docs', url: '#'},
                        {text: 'Blog', url: '#'},
                        {text: 'Support', url: '#'}
                    ]
                }
            ]
        });
}
