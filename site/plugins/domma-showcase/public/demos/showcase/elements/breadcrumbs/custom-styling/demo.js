/**
 * Custom Styling - from public/showcase/elements/breadcrumbs.
 */
export function mount(root) {
        // Example 7: Styled
    E.breadcrumbs(root.querySelector('#styled-example'), {
            items: [
                {text: 'Styled', url: '#'},
                {text: 'Breadcrumbs', active: true}
            ],
            separator: 'chevron'
        });
}
