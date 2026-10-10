/**
 * Try It - from public/showcase/dom.
 */
export function mount(root) {
        // Events demo
    let clickCount = 0;
    $(root).find('#event-btn').on('click', function () {
            clickCount++;
            $(root).find('#event-result').text(`Button clicked ${clickCount} time(s)`);
        });
    $(root).find('#event-trigger').on('click', function () {
            $(root).find('#event-btn').trigger('click');
        });
    $(root).find('#event-hover').hover(
            function () {
                $(root).find('#event-result').text('Mouse entered!');
                $(this).addClass('bg-success').removeClass('bg-primary');
            },
            function () {
                $(root).find('#event-result').text('Mouse left!');
                $(this).addClass('bg-primary').removeClass('bg-success');
            }
        );
}
