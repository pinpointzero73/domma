/**
 * Try It - from public/showcase/utils.
 */
export function mount(root) {
        // Math demos
    $('[data-math]').on('click', function () {
            const method = $(this).data('math');
            let result, description;

            switch (method) {
                case 'sum':
                    result = _.sum([1, 2, 3, 4, 5]);
                    description = `_.sum([1, 2, 3, 4, 5]) = ${result}`;
                    break;
                case 'mean':
                    result = _.mean([1, 2, 3, 4, 5]);
                    description = `_.mean([1, 2, 3, 4, 5]) = ${result}`;
                    break;
                case 'random':
                    result = _.random(1, 100);
                    description = `_.random(1, 100) = ${result}`;
                    break;
                case 'clamp':
                    result = _.clamp(150, 0, 100);
                    description = `_.clamp(150, 0, 100) = ${result}`;
                    break;
            }

            $(root).find('#math-result').text(description);
        });
}
