/**
 * Try It - from public/showcase/dom.
 */
export function mount(root) {
        // Dimensions demo
    $(root).find('#dim-btn').on('click', function () {
            const $box = $(root).find('#dim-target');
            const dims = {
                'width()': $box.width(),
                'height()': $box.height(),
                'innerWidth()': $box.innerWidth(),
                'innerHeight()': $box.innerHeight(),
                'outerWidth()': $box.outerWidth(),
                'outerHeight()': $box.outerHeight(),
                'outerWidth(true)': $box.outerWidth(true),
                'offset()': JSON.stringify($box.offset())
            };
            $(root).find('#dim-result').html(Object.entries(dims).map(([k, v]) => `${k}: ${v}`).join('<br>'));
        });
}
