/**
 * Generate from URL Path - from public/showcase/elements/breadcrumbs.
 */
export function mount(root) {
        // Example 6: URL-Based
    E.breadcrumbs(root.querySelector('#url-example'), {
            items: [
                {text: 'Home', url: '/'},
                {text: 'Products', url: '/products'},
                {text: 'Electronics', url: '/products/electronics'},
                {text: 'Phones', active: true}
            ],
            separator: 'chevron',
            homeIcon: true
        });
}
