/**
 * Try It - from public/showcase/dom.
 */
export function mount(root) {
        // CSS demo
    let colorIndex = 0;
    const colors = ['var(--dm-primary)', 'var(--dm-success)', 'var(--dm-danger)', 'var(--dm-warning)'];
    $(root).find('#toggle-class').on('click', function () {
            const $target = $(root).find('#css-target');
            $target.toggleClass('special');
            $(root).find('#css-result').text('hasClass("special"): ' + $target.hasClass('special'));
        });
    $(root).find('#change-color').on('click', function () {
            colorIndex = (colorIndex + 1) % colors.length;
            $(root).find('#css-target').css('background', colors[colorIndex]);
            $(root).find('#css-result').text('css("background") changed to: ' + colors[colorIndex]);
        });
    $(root).find('#toggle-vis').on('click', function () {
            $(root).find('#css-target').toggle();
        });
}
