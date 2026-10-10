/**
 * With Home Icon - from public/showcase/elements/breadcrumbs.
 */
export function mount(root) {
        // Example 2: Home Icon
    E.breadcrumbs(root.querySelector('#home-icon-example'), {
            items: [
                {text: 'Home', url: '/'},
                {text: 'Dashboard', url: '/dashboard'},
                {text: 'Settings', active: true}
            ],
            homeIcon: true
        });
}
