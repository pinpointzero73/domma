/**
 * Programmatic Control - from public/showcase/elements/dropdown.
 */
export function mount(root) {
        // Programmatic Control
    const programmaticDropdown = E.dropdown(root.querySelector('#programmatic-dropdown'), {
            items: [
                {text: 'Item 1', value: '1'},
                {text: 'Item 2', value: '2'},
                {text: 'Item 3', value: '3'}
            ]
        });
    $(root).find('#prog-open').on('click', () => programmaticDropdown.open());
    $(root).find('#prog-close').on('click', () => programmaticDropdown.close());
    $(root).find('#prog-toggle').on('click', () => programmaticDropdown.toggle());
}
