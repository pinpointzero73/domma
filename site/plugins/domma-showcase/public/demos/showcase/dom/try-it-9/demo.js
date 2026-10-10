/**
 * Try It - from public/showcase/dom.
 */
export function mount(root) {
        // Effects demo
    $(root).find('#fx-fade').on('click', function () {
            $(root).find('#fx-target').fadeToggle(400);
        });
    $(root).find('#fx-slide').on('click', function () {
            $(root).find('#fx-target').slideToggle(400);
        });
    $(root).find('#fx-animate').on('click', function () {
            const $target = $(root).find('#fx-target');
            const currentMargin = parseInt($target.css('marginLeft'), 10) || 0;
            $target.animate({
                marginLeft: currentMargin > 100 ? '0px' : '200px',
                opacity: currentMargin > 100 ? 1 : 0.5
            }, 500);
        });
}
