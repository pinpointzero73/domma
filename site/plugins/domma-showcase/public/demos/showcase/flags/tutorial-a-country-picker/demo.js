/**
 * Tutorial: a country picker - from public/showcase/flags.
 */
export function mount(root) {
        // ---- Tutorial picker ----
    _.sortBy(FL.list(), c => FL.name(c)).forEach(code => {
            $(root).find('#country-picker').append(`<option value="${code}">${FL.name(code)}</option>`);
        });
    function updatePicker() {
            const code = $(root).find('#country-picker').val();
            FL.inject('#picker-flag', code, {size: 40, shape: 'rounded', border: true, position: 'replace'});
            $(root).find('#picker-name').text(FL.name(code));
            $(root).find('#picker-code').text(code.toUpperCase());
        }
    $(root).find('#country-picker').on('change', updatePicker);
    updatePicker();
}
