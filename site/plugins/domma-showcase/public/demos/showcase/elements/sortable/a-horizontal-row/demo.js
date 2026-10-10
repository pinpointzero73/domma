/**
 * A horizontal row - from public/showcase/elements/sortable.
 */
export function mount(root) {
        // ---- Horizontal row --------------------------------------------------
    E.sortable(root.querySelector('#demo-row'), {
            axis: 'x',
            onSort: ({order}) => log('Row: ' + order.join(', '))
        });
}
