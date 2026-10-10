/**
 * Real-World Example: Filter Panel - from public/showcase/elements/button-group.
 */
export function mount(root) {
        // Examples: Filter Panel
    const categoryLabels = ['All', 'Electronics', 'Clothing', 'Books'];
    const priceLabels = ['Under £20', '£20-£50', '£50-£100', 'Over £100'];
    const categoryFilter = E.buttonGroup(root.querySelector('#category-filter'), {
            mode: 'single',
            allowEmpty: true,
            onChange: updateFilters
        });
    const priceFilter = E.buttonGroup(root.querySelector('#price-filter'), {
            mode: 'single',
            allowEmpty: true,
            onChange: updateFilters
        });
    function updateFilters() {
            const category = categoryFilter.getValue();
            const price = priceFilter.getValue();

            const filters = [];
            if (category !== null) filters.push(categoryLabels[category]);
            if (price !== null) filters.push(priceLabels[price]);

            $(root).find('#filter-summary').text(filters.length ? filters.join(', ') : 'None selected');
        }
}
