/**
 * Example 2: Card with Icon - from public/showcase/elements/card.
 */
export function mount(root) {
            // Example 2: Card with icon
    E.card(root.querySelector('#icon-card'), {
                title: 'Settings',
                icon: 'settings',
                content: '<p>Configure your application settings here.</p>',
                collapsible: true
            });
}
