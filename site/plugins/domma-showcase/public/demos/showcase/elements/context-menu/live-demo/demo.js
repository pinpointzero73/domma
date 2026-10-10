/**
 * Live Demo - from public/showcase/elements/context-menu.
 */
export function mount(root) {
        // Outer menu - the page region
    E.contextMenu(root.querySelector('#demo-page'), {
            items: [
                {label: 'Page settings', icon: 'settings', action: () => log('Page settings')},
                {label: 'View source', icon: 'code', action: () => log('View source')}
            ]
        });
        // Inner menu - shadows the page menu over the cards only
    E.contextMenu(root.querySelector('#demo-collection'), {
            match: '[data-entry-id]',
            items: (entry) => [
                {
                    label: 'Open "' + entry.dataset.title + '"',
                    icon: 'eye',
                    action: () => log('Opened entry ' + entry.dataset.entryId)
                },
                {
                    label: 'Duplicate', icon: 'copy',
                    action: () => log('Duplicated entry ' + entry.dataset.entryId)
                },
                {type: 'divider'},
                {
                    label: 'Delete', icon: 'trash', danger: true,
                    disabled: entry.dataset.locked === 'true',
                    action: () => log('Deleted entry ' + entry.dataset.entryId)
                }
            ],
            onOpen: (ctx) => log('Collection menu on entry ' + ctx.target.dataset.entryId)
        });
}
