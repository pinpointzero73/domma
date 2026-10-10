/**
 * Example 8: Grid of Cards - from public/showcase/elements/card.
 */
export function mount(root) {
            // Grid cards with hover
    ['#grid-card-1', '#grid-card-2', '#grid-card-3'].forEach(id => {
                E.card(id, {hover: true});
            });
}
