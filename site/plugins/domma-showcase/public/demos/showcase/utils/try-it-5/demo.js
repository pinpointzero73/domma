/**
 * Try It - from public/showcase/utils.
 */
export function mount(root) {
        // Template demo
    $(root).find('#template-run').on('click', function () {
            try {
                const template = $(root).find('#template-input').val();
                const data = JSON.parse($(root).find('#template-data').val());
                const result = _.render(template, data);
                $(root).find('#template-result').text(result);
            } catch (e) {
                $(root).find('#template-result').text('Error: ' + e.message);
            }
        });
}
