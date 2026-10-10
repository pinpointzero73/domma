/**
 * Example 3: Colored Card Variant - from public/showcase/elements/card.
 */
export function mount(root) {
            // Example 3: Colored card
    E.card(root.querySelector('#colored-card'), {
                title: 'Important Notice',
                icon: 'alert',
                color: 'primary',
                content: '<p>This card uses the primary color variant.</p>',
                collapsible: true
            });
}
