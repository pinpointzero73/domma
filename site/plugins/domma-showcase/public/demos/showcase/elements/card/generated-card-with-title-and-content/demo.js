/**
 * Example 1: Generated Card with Title and Content - from public/showcase/elements/card.
 */
export function mount(root) {
            // HTML Generation Examples
            // Example 1: Basic generated card
    E.card(root.querySelector('#generated-card'), {
                title: 'Generated Card',
                content: '<p>This card was created entirely from JavaScript options.</p>',
                collapsible: true
            });
}
