/**
 * Nested Menus - from public/showcase/sidebar.
 */
export function mount(root) {
            // Nested Example
    const sidebarNested = E.sidebar(root.querySelector('#sidebar-nested'), {
                contentSelector: '#demo-content-nested',
                position: 'left',
                fixed: true,
                width: '250px',
                top: '60px',
                header: { title: 'Multi-Level Menu' },
                items: [
                    { text: 'Dashboard', url: '#', icon: 'layout' },
                    {
                        text: 'Products',
                        icon: 'box',
                        items: [
                            { text: 'All Products', url: '#products' },
                            { text: 'Categories', url: '#categories' },
                            {
                                text: 'Advanced',
                                items: [
                                    { text: 'Import', url: '#import' },
                                    { text: 'Export', url: '#export' },
                                    {
                                        text: 'Tools',
                                        items: [
                                            { text: 'Bulk Edit', url: '#bulk-edit' },
                                            { text: 'Price Update', url: '#price-update' }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        text: 'Orders',
                        icon: 'cart',
                        items: [
                            { text: 'All Orders', url: '#orders' },
                            { text: 'Pending', url: '#pending' },
                            { text: 'Completed', url: '#completed' }
                        ]
                    },
                    { divider: true },
                    { heading: 'SYSTEM' },
                    { text: 'Settings', url: '#settings', icon: 'settings' },
                    { text: 'Help', url: '#help', icon: 'help-circle' }
                ],
                variant: 'dark'
            });
    $(root).find('#expand-all').on('click', () => sidebarNested.expandAll());
    $(root).find('#collapse-all').on('click', () => sidebarNested.collapseAll());
}
