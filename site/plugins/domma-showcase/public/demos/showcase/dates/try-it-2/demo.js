/**
 * Try It - from public/showcase/dates.
 */
export function mount(root) {
        // Format demos
    $('[data-format]').on('click', function () {
            const format = $(this).data('format');
            $(root).find('#format-input').val(format);
            $(root).find('#format-btn').trigger('click');
        });
    $(root).find('#format-btn').on('click', function () {
            const format = $(root).find('#format-input').val();
            const result = D().format(format);
            $(root).find('#format-result').text(`D().format('${format}')\n= "${result}"`);
        });
}
