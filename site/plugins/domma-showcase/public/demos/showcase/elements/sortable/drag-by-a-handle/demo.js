/**
 * Drag by a handle - from public/showcase/elements/sortable.
 */
export function mount(root) {
        // ---- Handle-only list -------------------------------------------------
    E.sortable(root.querySelector('#demo-fields'), {
            handle: '.sx-sort-grip',
            onSort: ({order}) => log('Fields: ' + order.join(', '))
        });
}
