/** Two thumbs - a price range, kept at least £50 apart. */
export function mount(root) {
    const shown = $(root).find('#demo-price-value');

    const price = E.rangeSlider($(root).find('#demo-price'), {
        range: true,
        min: 0,
        max: 1000,
        step: 10,
        value: [100, 600],
        minDistance: 50,
        name: 'price',
        ariaLabel: 'Price',
        labels: (v) => '£' + v,
        tooltip: 'always',
        onInput: ([low, high]) => shown.text('£' + low + ' and £' + high)
    });

    return () => price.destroy();
}
