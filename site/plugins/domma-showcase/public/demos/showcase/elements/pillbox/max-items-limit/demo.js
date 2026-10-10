/**
 * Example 3: Max Items Limit - from public/showcase/elements/pillbox.
 */
export function mount(root) {
    const items = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];
        // Max items example
    E.pillbox(root.querySelector('#max-items-pillbox'), {
            data: items,
            maxItems: 3,
            maxItemsMessage: 'Maximum {max} items allowed',
            onChange: (values) => {
                const remaining = 3 - values.length;
                $(root).find('#max-items-status')[0].textContent =
                    remaining > 0 ? `You can add ${remaining} more item(s)` : 'Maximum reached!';
            },
            onMaxReached: () => {
                $(root).find('#max-items-status')[0].style.color = 'var(--dm-danger)';
            }
        });
}
