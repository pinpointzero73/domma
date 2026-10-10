/**
 * Submenus - from public/showcase/elements/context-menu.
 */
export function mount(root) {
        // Submenu demo
    E.contextMenu(root.querySelector('#demo-submenu'), {
            inherit: false,
            items: [
                {label: 'Rename', icon: 'edit', action: () => log('Rename')},
                {type: 'divider'},
                {
                    label: 'Export', icon: 'download',
                    submenu: [
                        {label: 'CSV', action: () => log('Exported CSV')},
                        {label: 'JSON', action: () => log('Exported JSON')},
                        {label: 'PDF', action: () => log('Exported PDF')}
                    ]
                }
            ]
        });
}
