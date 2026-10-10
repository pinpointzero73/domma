/**
 * With Dividers and Headers - from public/showcase/elements/dropdown.
 */
export function mount(root) {
        // Structured with headers and dividers
    E.dropdown(root.querySelector('#structured-dropdown'), {
            items: [
                {header: 'Navigation'},
                {text: 'Home', value: 'home'},
                {text: 'Dashboard', value: 'dashboard'},
                {divider: true},
                {header: 'Actions'},
                {text: 'New Project', value: 'new'},
                {text: 'Import', value: 'import'},
                {divider: true},
                {text: 'Delete All', value: 'delete-all', class: 'text-danger'}
            ]
        });
}
