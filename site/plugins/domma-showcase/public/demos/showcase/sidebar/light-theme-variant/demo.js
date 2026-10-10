/**
 * Light Theme Variant - from public/showcase/sidebar.
 */
export function mount(root) {
            // Light Theme Example
    E.sidebar(root.querySelector('#sidebar-light'), {
                contentSelector: '#demo-content-light',
                position: 'left',
                fixed: true,
                width: '250px',
                top: '60px',
                header: { title: 'Light Theme' },
                items: [
                    { text: 'Home', url: '#', icon: 'home' },
                    { text: 'Profile', url: '#profile', icon: 'user' },
                    { text: 'Settings', url: '#settings', icon: 'settings' }
                ],
                variant: 'light'
            });
}
