/**
 * Line Clamp - from public/showcase/css-utilities/accessibility-text.
 */
export function mount(root) {
        // Line clamp switcher
    $('[data-clamp]').on('click', (e) => {
            const n = e.currentTarget.getAttribute('data-clamp');
            $('[data-clamp]').removeClass('active');
            $(e.currentTarget).addClass('active');
            $(root).find('#demo-clamp')
                .removeClass('line-clamp-1 line-clamp-2 line-clamp-3 line-clamp-5 line-clamp-none')
                .addClass('line-clamp-' + n);
        });
}
