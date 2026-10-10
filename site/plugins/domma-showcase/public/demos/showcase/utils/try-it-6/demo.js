/**
 * Try It - from public/showcase/utils.
 */
export function mount(root) {
        // Lang demos
    $('[data-lang]').on('click', function () {
            const method = $(this).data('lang');
            let result, description;

            switch (method) {
                case 'isEqual':
                    result = _.isEqual({a: 1}, {a: 1});
                    description = `_.isEqual({a: 1}, {a: 1}) = ${result}`;
                    break;
                case 'isEmpty':
                    result = _.isEmpty([]);
                    description = `_.isEmpty([]) = ${result}`;
                    break;
                case 'cloneDeep':
                    const original = {a: {b: 1}};
                    const cloned = _.cloneDeep(original);
                    cloned.a.b = 999;
                    description = `Original: ${JSON.stringify(original)}
    Cloned (modified): ${JSON.stringify(cloned)}`;
                    break;
                case 'isMatch':
                    result = _.isMatch({a: 1, b: 2}, {a: 1});
                    description = `_.isMatch({a:1, b:2}, {a:1}) = ${result}`;
                    break;
                case 'parseInt':
                    result = _.parseInt('42');
                    description = `_.parseInt('42') = ${result}\n_.parseInt('08', 10) = ${_.parseInt('08', 10)}
    _.parseInt('0xff', 16) = ${_.parseInt('0xff', 16)}`;
                    break;
                case 'toNumber':
                    result = _.toNumber('3.14');
                    description = `_.toNumber('3.14') = ${result}\n_.toNumber('0b101') = ${_.toNumber('0b101')}\n_.toNumber(null) = ${_.toNumber(null)}`;
                    break;
            }

            $(root).find('#lang-result').text(description);
        });
}
