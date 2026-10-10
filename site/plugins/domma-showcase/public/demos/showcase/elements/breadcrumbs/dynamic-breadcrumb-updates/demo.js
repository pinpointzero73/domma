/**
 * Dynamic Breadcrumb Updates - from public/showcase/elements/breadcrumbs.
 */
export function mount(root) {
        // Example 5: Dynamic Updates
    let dynamicCounter = 1;
    const dynamicCrumbs = E.breadcrumbs(root.querySelector('#dynamic-example'), {
            items: [{text: 'Home', url: '#'}]
        });
    $(root).find('#dynamic-add').on('click', () => {
            dynamicCrumbs.addItem({text: `Level ${dynamicCounter++}`, active: true});
        });
    $(root).find('#dynamic-remove').on('click', () => {
            const items = dynamicCrumbs.getItems();
            if (items.length > 1) {
                dynamicCrumbs.removeItem(items.length - 1);
                if (items.length > 1) {
                    items[items.length - 2].active = true;
                    dynamicCrumbs.setItems(items);
                }
            }
        });
    $(root).find('#dynamic-reset').on('click', () => {
            dynamicCrumbs.setItems([{text: 'Home', url: '#'}]);
            dynamicCounter = 1;
        });
}
