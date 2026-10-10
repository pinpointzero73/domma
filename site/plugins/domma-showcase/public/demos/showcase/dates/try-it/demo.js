/**
 * Try It - from public/showcase/dates.
 */
export function mount(root) {
        // Create demos
    $('[data-create]').on('click', function () {
            const type = $(this).data('create');
            let result, code;

            switch (type) {
                case 'now':
                    result = D();
                    code = "D()";
                    break;
                case 'string':
                    result = D('2025-12-25');
                    code = "D('2025-12-25')";
                    break;
                case 'timestamp':
                    result = D(1735084800000);
                    code = "D(1735084800000)";
                    break;
                case 'static':
                    result = Domma.dates.now();
                    code = "Domma.dates.now()";
                    $(root).find('#create-result').text(`${code} = ${result}`);
                    return;
            }

            $(root).find('#create-result').text(`${code}.format('MMMM D, YYYY HH:mm:ss')\n= "${result.format('MMMM D, YYYY HH:mm:ss')}"`);
        });
}
