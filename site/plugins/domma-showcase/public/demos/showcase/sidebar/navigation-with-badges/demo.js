/**
 * Navigation with Badges - from public/showcase/sidebar.
 */
export function mount(root) {
            // Badges Example
    E.sidebar(root.querySelector('#sidebar-badges'), {
                contentSelector: '#demo-content-badges',
                position: 'left',
                fixed: true,
                width: '250px',
                top: '60px',
                header: { title: 'Notifications' },
                items: [
                    { text: 'Inbox', url: '#inbox', icon: 'mail', badge: '12' },
                    { text: 'Notifications', url: '#notifications', icon: 'bell', badge: '3' },
                    { text: 'Messages', url: '#messages', icon: 'message-square', badge: '99+' },
                    { text: 'Tasks', url: '#tasks', icon: 'check-square', badge: '5' }
                ],
                variant: 'dark'
            });
}
