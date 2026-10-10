/**
 * Try It - from public/showcase/utils.
 */
export function mount(root) {
    const users = [
            {name: 'Alice', age: 25, dept: 'Engineering'},
            {name: 'Bob', age: 30, dept: 'Sales'},
            {name: 'Carol', age: 25, dept: 'Engineering'},
            {name: 'Dave', age: 35, dept: 'Marketing'}
        ];
        // Array demos
    $('[data-util]').on('click', function () {
            const util = $(this).data('util');
            let result;

            switch (util) {
                case 'chunk':
                    result = _.chunk([1, 2, 3, 4, 5], 2);
                    break;
                case 'compact':
                    result = _.compact([0, 1, false, 2, '', 3]);
                    break;
                case 'uniq':
                    result = _.uniq([1, 2, 2, 3, 3, 3]);
                    break;
                case 'flatten':
                    result = _.flattenDeep([[1, [2, [3]]]]);
                    break;
                case 'groupBy':
                    result = _.groupBy(users, 'dept');
                    break;
                case 'sortBy':
                    result = _.sortBy(users, 'age');
                    break;
                case 'filter':
                    result = _.filter(users, {dept: 'Engineering'});
                    break;
                case 'countBy':
                    result = _.countBy(users, 'dept');
                    break;
            }

            const targetId = ['chunk', 'compact', 'uniq', 'flatten'].includes(util) ? 'array-result' : 'collection-result';
            $('#' + targetId).text(JSON.stringify(result, null, 2));
        });
}
