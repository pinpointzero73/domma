/**
 * Real-World Example: Documentation Site - from public/showcase/elements/breadcrumbs.
 */
export function mount(root) {
        // Example 8: Documentation Site
    // The content panel reads these observables (data-bind-text in demo.html)
    const section = M.observable('Modal Component');
    const blurb = M.observable('Complete documentation for the Modal element...');
    const handle = M.applyBindings({section, blurb}, root.querySelector('#docs-content'));
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

                section.value = item.text;
                blurb.value = `Documentation for ${item.text}...`;
            }
        });
    return () => handle.dispose();
}
