/**
 * Try It - from public/showcase/dates.
 */
export function mount(root) {
        // Update base date display
    $(root).find('#manip-base').text(D().format('MMMM D, YYYY'));
        // Manipulation demos
    $('[data-manip]').on('click', function () {
            const manip = $(this).data('manip');
            let result, code;
            const base = D();

            switch (manip) {
                case 'add-7-days':
                    result = base.clone().add(7, 'days');
                    code = "D().add(7, 'days')";
                    break;
                case 'add-1-month':
                    result = base.clone().add(1, 'month');
                    code = "D().add(1, 'month')";
                    break;
                case 'sub-1-week':
                    result = base.clone().subtract(1, 'week');
                    code = "D().subtract(1, 'week')";
                    break;
                case 'startOf-month':
                    result = base.clone().startOf('month');
                    code = "D().startOf('month')";
                    break;
                case 'endOf-month':
                    result = base.clone().endOf('month');
                    code = "D().endOf('month')";
                    break;
                case 'startOf-year':
                    result = base.clone().startOf('year');
                    code = "D().startOf('year')";
                    break;
            }

            $(root).find('#manip-result').text(`${code}.format('MMMM D, YYYY HH:mm:ss')\n= "${result.format('MMMM D, YYYY HH:mm:ss')}"`);
        });
}
