/**
 * State Persistence - from public/showcase/sidebar.
 */
export function mount(root) {
            // Persistence Example
    E.sidebar(root.querySelector('#sidebar-persist'), {
                contentSelector: '#demo-content-persist',
                position: 'left',
                fixed: true,
                width: '250px',
                top: '60px',
                header: { title: 'Persistent State' },
                items: [
                    { text: 'Dashboard', url: '#', icon: 'layout' },
                    {
                        text: 'Menu 1',
                        icon: 'folder',
                        items: [
                            { text: 'Item 1.1', url: '#' },
                            { text: 'Item 1.2', url: '#' }
                        ]
                    },
                    {
                        text: 'Menu 2',
                        icon: 'folder',
                        items: [
                            { text: 'Item 2.1', url: '#' },
                            { text: 'Item 2.2', url: '#' }
                        ]
                    }
                ],
                variant: 'dark',
                persistExpanded: true,
                persistKey: 'showcase-sidebar-persist'
            });
    $(root).find('#reload-demo').on('click', () => location.reload());
}
