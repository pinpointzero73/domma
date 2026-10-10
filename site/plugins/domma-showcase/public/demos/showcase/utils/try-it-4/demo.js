/**
 * Try It - from public/showcase/utils.
 */
export function mount(root) {
        // String demos
    $('[data-string]').on('click', function () {
            const method = $(this).data('string');
            const input = $(root).find('#string-input').val();
            const result = _[method](input);
            $(root).find('#string-result').text(`_.${method}("${input}") = "${result}"`);
        });
}
