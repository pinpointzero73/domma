/**
 * Try It - from public/showcase/dates.
 */
export function mount(root) {
        // Relative time demos
    $('[data-relative]').on('click', function () {
            const rel = $(this).data('relative');
            const parts = rel.split('-');
            const negative = parts[0] === '';
            const amount = parseInt(negative ? parts[1] : parts[0]);
            const unit = negative ? parts[2] : parts[1];

            let result;
            if (negative) {
                result = D().subtract(amount, unit);
            } else {
                result = D().add(amount, unit);
            }

            const fromNow = result.fromNow();
            const formatted = result.format('MMMM D, YYYY h:mm A');
            $(root).find('#relative-result').text(`Date: ${formatted}\nfromNow(): "${fromNow}"`);
        });
}
