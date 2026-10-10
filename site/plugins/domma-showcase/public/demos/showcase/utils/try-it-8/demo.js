/**
 * Try It - from public/showcase/utils.
 */
export function mount(root) {
        // Utility demos
    $('[data-utility]').on('click', function () {
            const method = $(this).data('utility');
            let result, description;

            switch (method) {
                case 'range':
                    result = _.range(0, 10, 2);
                    description = `_.range(0, 10, 2) = [${result.join(', ')}]`;
                    break;
                case 'uniqueId':
                    result = _.uniqueId('id_');
                    description = `_.uniqueId('id_') = "${result}"`;
                    break;
                case 'times':
                    result = _.times(5, i => i * i);
                    description = `_.times(5, i => i*i) = [${result.join(', ')}]`;
                    break;
            }

            $(root).find('#utility-result').text(description);
        });
}
