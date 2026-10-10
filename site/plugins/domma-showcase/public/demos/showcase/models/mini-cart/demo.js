/**
 * Shopping cart - events and derived values.
 *
 * Buttons publish cart:add / cart:remove / cart:clear; subscribers change the
 * list; the total is a computed, so it can never disagree with the items.
 * Products and cart rows are bound lists (data-each), so there is no render
 * function. The subscriptions are removed on teardown.
 */
export function mount(root) {
    const money = (n) => `£${n.toFixed(2)}`;
    const products = [
        {name: 'Widget A', price: 9.99},
        {name: 'Widget B', price: 19.99},
        {name: 'Widget C', price: 29.99}
    ].map(p => ({...p, priceText: money(p.price)}));

    const items = M.observable([]);
    const totalText = M.computed(() => money(items.value.reduce((sum, i) => sum + i.price, 0)));
    let seq = 0;

    const subs = [
        ['cart:add', (product) => { items.value = [...items.value, {...product, id: ++seq}]; }],
        ['cart:remove', (id) => { items.value = items.value.filter(i => i.id !== id); }],
        ['cart:clear', () => { items.value = []; }]
    ];
    subs.forEach(([event, handler]) => M.on(event, handler));

    // The handlers live on the data, so rows reach them as $root.add / $root.remove.
    const handle = M.applyBindings({
        products, items, totalText,
        add: (product) => M.emit('cart:add', product),
        remove: (item) => M.emit('cart:remove', item.id),
        clear: () => M.emit('cart:clear')
    }, root);

    return () => {
        subs.forEach(([event, handler]) => M.off(event, handler));
        handle.dispose();
    };
}
