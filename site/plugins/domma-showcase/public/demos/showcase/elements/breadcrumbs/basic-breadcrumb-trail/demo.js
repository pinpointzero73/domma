/**
 * Basic Breadcrumb Trail - from public/showcase/elements/breadcrumbs.
 */
export function mount(root) {
        // Quick Start Examples
    E.breadcrumbs(root.querySelector('#quick-start-breadcrumb'), {
            items: [
                {text: 'Home', url: '#'},
                {text: 'Products', url: '#'},
                {text: 'Widget', active: true}
            ]
        });
}
