/**
 * Debounce - from public/showcase/utils.
 */
export function mount(root) {
        // Debounce demo
    const debouncedSearch = _.debounce(function (value) {
            $(root).find('#debounce-result').text(`Debounced callback fired with: "${value}"`);
        }, 500);
    $(root).find('#debounce-input').on('input', function () {
            const value = $(this).val();
            $(root).find('#debounce-result').text(`Typing... (waiting for 500ms pause)`);
            debouncedSearch(value);
        });
}
