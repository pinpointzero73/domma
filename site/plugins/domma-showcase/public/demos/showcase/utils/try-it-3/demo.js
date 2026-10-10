/**
 * Try It - from public/showcase/utils.
 */
export function mount(root) {
    const obj = {
            user: {name: 'Alice', address: {city: 'NYC'}},
            settings: {theme: 'dark'}
        };
        // Object demos
    $('[data-util="get"]').on('click', function () {
            const result = _.get(obj, 'user.address.city');
            $(root).find('#object-result').text(`_.get(obj, 'user.address.city') = "${result}"`);
        });
    $('[data-util="pick"]').on('click', function () {
            const result = _.pick(obj.user, ['name']);
            $(root).find('#object-result').text(JSON.stringify(result, null, 2));
        });
    $('[data-util="merge"]').on('click', function () {
            const result = _.merge({a: 1}, {b: 2}, {c: 3});
            $(root).find('#object-result').text(JSON.stringify(result, null, 2));
        });
    $('[data-util="invert"]').on('click', function () {
            const result = _.invert({a: '1', b: '2', c: '3'});
            $(root).find('#object-result').text(JSON.stringify(result, null, 2));
        });
}
