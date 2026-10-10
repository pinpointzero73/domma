/**
 * Example 6: JS Generation - from public/showcase/elements/card.
 */
export function mount(root) {
    E.card(root.querySelector('#accent-js-card'), {
        title: 'Generated Accent Card',
        icon: 'star',
        color: 'accent',
        content: '<p>Generated via JavaScript with <code>color: "accent"</code>.</p>',
        collapsible: true
    });
}
