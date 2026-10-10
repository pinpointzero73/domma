/**
 * Step 5: Complete Working Demo - from public/showcase/elements/card.
 */
export function mount(root) {
            // Tutorial example
    E.card(root.querySelector('#tutorial-card'), {
                hover: true,
                clickable: true,
                onClick: () => {
                    E.toast('Product added to cart!');
                }
            });
}
