/**
 * Different Separator Styles - from public/showcase/elements/breadcrumbs.
 */
export function mount(root) {
    const sampleItems = [
            {text: 'Home', url: '#'},
            {text: 'Products', url: '#'},
            {text: 'Electronics', url: '#'},
            {text: 'Smartphones', active: true}
        ];
        // Example 1: Separator Styles
    E.breadcrumbs(root.querySelector('#separator-slash'), {
            items: sampleItems,
            separator: '/'
        });
    E.breadcrumbs(root.querySelector('#separator-angle'), {
            items: sampleItems,
            separator: '>'
        });
    E.breadcrumbs(root.querySelector('#separator-arrow'), {
            items: sampleItems,
            separator: '→'
        });
    E.breadcrumbs(root.querySelector('#separator-chevron'), {
            items: sampleItems,
            separator: 'chevron'
        });
    E.breadcrumbs(root.querySelector('#separator-custom'), {
            items: sampleItems,
          separator: '<span style="color: var(--dm-primary);">•</span>'
        });
}
