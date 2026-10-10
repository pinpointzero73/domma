/**
 * Stretched Link - from public/showcase/css-utilities/accessibility-text.
 */
export function mount(root) {
        // Stretched links go nowhere here; say which one was followed instead.
    $('[data-demo-link]').on('click', (e) => {
            e.preventDefault();
            $(root).find('#demo-stretch-out').text(e.currentTarget.getAttribute('data-demo-link'));
        });
}
