/**
 * Custom Click Handling - from public/showcase/elements/breadcrumbs.
 */
export function mount(root) {
        // Example 4: Click Handling
    E.breadcrumbs(root.querySelector('#click-example'), {
            items: [
                {text: 'Level 1', url: '#'},
                {text: 'Level 2', url: '#'},
                {text: 'Level 3', active: true}
            ],
            onChange: (item, index, event) => {
                event.preventDefault();
                $(root).find('#click-result').text(`${item.text} (index ${index})`);
            }
        });
}
