/**
 * Multiple Action Buttons - from public/showcase/elements/navbar.
 */
export function mount(root) {
        // Example 4: Actions
    E.navbar(root.querySelector('#actions-example'), {
            brand: {text: 'SaaS App'},
            items: [
                {text: 'Features', url: '#'},
                {text: 'Pricing', url: '#'}
            ],
            actions: [
              {text: 'Login', variant: 'outline', url: '/login'},
              {text: 'Sign Up', variant: 'primary', url: '/signup'}
            ]
        });
}
