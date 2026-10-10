/**
 * With Action Button - from public/showcase/elements/navbar.
 */
export function mount(root) {
    E.navbar(root.querySelector('#quick-start-action'), {
        brand: {text: 'Domma'},
        items: [
            {text: 'Home', url: '#'},
            {text: 'Docs', url: '#'}
        ],
        actions: [
            {text: 'Sign Up', variant: 'primary', url: '#'}
        ]
    });
}
