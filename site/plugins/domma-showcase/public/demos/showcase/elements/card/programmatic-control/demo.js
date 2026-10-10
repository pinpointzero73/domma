/**
 * Example 5: Programmatic Control - from public/showcase/elements/card.
 */
export function mount(root) {
    // Example 5: Programmatic control
    const controlledCard = E.card(root.querySelector('#controlled-card'), {
        title: 'Controlled Card',
        icon: 'box',
        collapsible: true,
        content: '<p>Use the buttons to control this card.</p>'
    });
    $(root).find('#expand-btn').on('click', () => controlledCard.expand());
    $(root).find('#collapse-btn').on('click', () => controlledCard.collapse());
    $(root).find('#toggle-btn').on('click', () => controlledCard.toggle());
}
