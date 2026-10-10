/**
 * Export Methods - from public/showcase/tables.
 */
export function mount(root) {
        // Export buttons
    $(root).find('#export-csv').on('click', () => table.download('csv', 'users.csv'));
    $(root).find('#export-excel').on('click', () => table.download('excel', 'users.xls'));
    $(root).find('#export-json').on('click', () => table.download('json', 'users.json'));
    $(root).find('#copy-clipboard').on('click', async function () {
            await table.copyToClipboard();
            $(this).text('Copied!').addClass('btn-success').removeClass('btn-outline');
            setTimeout(() => {
                $(this).text('Copy to Clipboard').removeClass('btn-success').addClass('btn-outline');
            }, 1500);
        });
}
