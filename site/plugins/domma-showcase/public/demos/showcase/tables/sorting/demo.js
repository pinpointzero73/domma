/**
 * Sorting - from public/showcase/tables.
 */
export function mount(root) {
        // Sorting buttons
    $(root).find('#sort-name').on('click', () => table.sort('name', 'asc'));
    $(root).find('#sort-role').on('click', () => table.sort('role', 'asc'));
    $(root).find('#sort-date').on('click', () => table.sort('joined', 'desc'));
    $(root).find('#clear-sort').on('click', () => table.clearSort());
}
