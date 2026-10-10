/**
 * Example 6: Dynamic Content Updates - from public/showcase/elements/card.
 */
export function mount(root) {
    // Example 6: Dynamic content
    const dynamicCard = E.card(root.querySelector('#dynamic-card'), {
        title: 'Dynamic Content',
        icon: 'refresh',
        collapsible: true,
        content: '<p>Click the button to update this content.</p>'
    });
    $(root).find('#update-btn').on('click', () => {
        const timestamp = D().format('HH:mm:ss');
        dynamicCard.setContent(`<p>Content updated at ${timestamp}</p>`);
        dynamicCard.updateHeight();
    });
}
