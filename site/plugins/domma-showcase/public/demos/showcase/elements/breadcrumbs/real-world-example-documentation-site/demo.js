/**
 * Real-World Example: Documentation Site - from public/showcase/elements/breadcrumbs.
 */
export function mount(root) {
        // Example 8: Documentation Site
    const docsBreadcrumbs = E.breadcrumbs(root.querySelector('#docs-breadcrumbs'), {
            items: [
                {text: 'Documentation', url: '#'},
                {text: 'API Reference', url: '#'},
                {text: 'Elements', url: '#'},
                {text: 'Modal', active: true}
            ],
            separator: 'chevron',
            homeIcon: true,
            onChange: (item, index) => {
                const items = docsBreadcrumbs.getItems();
                const newItems = items.slice(0, index + 1);
                newItems[newItems.length - 1].active = true;
                docsBreadcrumbs.setItems(newItems);

                $(root).find('#docs-content').html(`
                    <h5>Current Section: ${item.text}</h5>
                    <p class="text-sm">Documentation for ${item.text}...</p>
                `);
            }
        });
}
