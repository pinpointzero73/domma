/**
 * With Logo Image - from public/showcase/elements/navbar.
 */
export function mount(root) {
        // Example 2: Logo
    E.navbar(root.querySelector('#logo-example'), {
            brand: {
              logo: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2232%22%20height%3D%2232%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%232563eb%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22central%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23ffffff%22%3ED%3C%2Ftext%3E%3C%2Fsvg%3E',
                text: 'Domma',
                url: '#'
            },
            items: [
                {text: 'Home', url: '#'},
                {text: 'About', url: '#'}
            ]
        });
}
