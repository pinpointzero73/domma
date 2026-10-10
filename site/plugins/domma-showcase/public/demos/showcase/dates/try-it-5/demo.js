/**
 * Try It - from public/showcase/dates.
 */
export function mount(root) {
        // Validation demos
    $('[data-valid]').on('click', function () {
            const type = $(this).data('valid');
            let result, code;

            switch (type) {
                case 'valid':
                    result = D('2025-12-25').isValid();
                    code = "D('2025-12-25').isValid()";
                    break;
                case 'invalid':
                    result = D('2025-02-30').isValid();
                    code = "D('2025-02-30').isValid()";
                    break;
                case 'leap2024':
                    result = D('2024-01-01').isLeapYear();
                    code = "D('2024-01-01').isLeapYear()";
                    break;
                case 'leap2025':
                    result = D('2025-01-01').isLeapYear();
                    code = "D('2025-01-01').isLeapYear()";
                    break;
                case 'days':
                    result = D('2025-02-01').daysInMonth();
                    code = "D('2025-02-01').daysInMonth()";
                    break;
            }

            $(root).find('#valid-result').text(`${code} = ${result}`);
        });
}
