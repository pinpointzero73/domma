/**
 * Example 9: Collapsible Card - from public/showcase/elements/card.
 */
export function mount(root) {
          // Collapsible card demo
    E.card(root.querySelector('#collapsible-demo'), {
            collapsible: true,
            onCollapse: () => console.log('Card collapsed'),
            onExpand: () => console.log('Card expanded')
          });
}
