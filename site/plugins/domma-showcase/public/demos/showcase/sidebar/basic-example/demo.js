/**
 * Basic Example - from public/showcase/sidebar.
 */
export function mount(root) {
    const sidebarBasic = E.sidebar(root.querySelector('#sidebar-basic'), {
                contentSelector: '#demo-content-basic',
                position: 'left',
                fixed: true,
                width: '250px',
                top: '60px',
                header: {
                    title: 'Navigation',
                    toggle: true
                },
                items: [
                    { text: 'Dashboard', url: '#dashboard', icon: 'layout', section: 'dashboard' },
                    { text: 'Users', url: '#users', icon: 'users', section: 'users' },
                    { text: 'Reports', url: '#reports', icon: 'chart-bar', section: 'reports' },
                    { text: 'Settings', url: '#settings', icon: 'settings', section: 'settings' }
                ],
                variant: 'dark',
                activeSection: 'dashboard',
                push: true,                      // Push content instead of overlay
                contentSelector: '.demo-content'  // Element to push
            });
    $(root).find('#toggle-basic').on('click', () => sidebarBasic.toggle());
}
