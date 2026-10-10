/**
 * Example 4: Initially Collapsed Card - from public/showcase/elements/card.
 */
export function mount(root) {
            // Example 4: Initially collapsed
    E.card(root.querySelector('#collapsed-card'), {
                title: 'Click to Expand',
                icon: 'info',
                collapsed: true,
                collapsible: true,
                content: '<p>This card was initially collapsed.</p>'
            });
}
