/**
 * Date Difference - from public/showcase/dates.
 */
export function mount(root) {
        // Diff calculator
    $(root).find('#diff-calc').on('click', function () {
            const start = D($(root).find('#diff-start').val());
            const end = D($(root).find('#diff-end').val());

            const days = end.diff(start, 'days');
            const weeks = end.diff(start, 'weeks');
            const months = end.diff(start, 'months');
            const years = end.diff(start, 'years', true).toFixed(2);

            $(root).find('#diff-result').text(
                `Days: ${days}\n` +
                `Weeks: ${weeks}\n` +
                `Months: ${months}\n` +
                `Years: ${years}`
            );
        });
}
