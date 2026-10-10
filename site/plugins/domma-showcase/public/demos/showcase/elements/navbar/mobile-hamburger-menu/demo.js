/**
 * Mobile Hamburger Menu - from public/showcase/elements/navbar.
 */
export function mount(root) {
        // Example 5: Fixed Position
    E.navbar(root.querySelector('#mobile-example'), {
          brand: {text: 'Responsive App'},
          items: [
            {text: 'Home', url: '#'},
            {text: 'Features', url: '#'},
            {text: 'Pricing', url: '#'},
            {text: 'Contact', url: '#'}
          ],
          collapsible: true,
          collapseAt: 768
        });
        // Example 6: Mobile Hamburger Menu
    E.navbar(root.querySelector('#mobile-example'), {
            brand: {text: 'Responsive App'},
            items: [
                {text: 'Home', url: '#'},
                {text: 'Features', url: '#'},
                {text: 'Pricing', url: '#'},
                {text: 'Contact', url: '#'}
            ],
            collapsible: true,
            collapseAt: 768
        });
}
