/**
 * Simple Autocomplete - from public/showcase/elements/autocomplete.
 */
export function mount(root) {
    const fruits = [
            'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry',
            'Cherry', 'Coconut', 'Date', 'Dragonfruit', 'Elderberry', 'Fig',
            'Grape', 'Grapefruit', 'Guava', 'Kiwi', 'Lemon', 'Lime', 'Mango',
            'Orange', 'Papaya', 'Peach', 'Pear', 'Pineapple', 'Plum', 'Raspberry',
            'Strawberry', 'Tangerine', 'Watermelon'
        ];
        // Quick Start
    E.autocomplete(root.querySelector('#quick-autocomplete'), {
            data: fruits,
            minChars: 1,
            maxResults: 8
        });
}
