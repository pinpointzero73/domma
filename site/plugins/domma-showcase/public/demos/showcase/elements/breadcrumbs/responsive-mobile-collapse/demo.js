/**
 * Responsive Mobile Collapse - from public/showcase/elements/breadcrumbs.
 */
export function mount(root) {
        // Example 3: Responsive
    E.breadcrumbs(root.querySelector('#responsive-example'), {
            items: [
                {text: 'Home', url: '/'},
                {text: 'Products', url: '/products'},
                {text: 'Electronics', url: '/products/electronics'},
                {text: 'Phones', url: '/products/electronics/phones'},
                {text: 'iPhone 15', active: true}
            ],
            responsive: true
        });
}
