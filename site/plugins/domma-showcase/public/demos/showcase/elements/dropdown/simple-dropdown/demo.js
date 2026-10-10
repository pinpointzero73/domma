/**
 * Simple Dropdown - from public/showcase/elements/dropdown.
 */
export function mount(root) {
    E.dropdown(root.querySelector('#quick-dropdown'), {
        items: [
            {text: 'Edit', value: 'edit'},
            {text: 'Duplicate', value: 'duplicate'},
            {divider: true},
            {text: 'Delete', value: 'delete', class: 'text-danger'}
        ],
        onSelect: (item) => console.log('Selected:', item)
    });
}
