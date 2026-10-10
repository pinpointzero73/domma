/**
 * With Home Icon - from public/showcase/elements/breadcrumbs.
 */
export function mount(root) {
    E.breadcrumbs(root.querySelector('#quick-start-home-icon'), {
        items: [
            {text: 'Home', url: '#'},
            {text: 'Category', url: '#'},
            {text: 'Item', active: true}
        ],
        homeIcon: true
    });
}
