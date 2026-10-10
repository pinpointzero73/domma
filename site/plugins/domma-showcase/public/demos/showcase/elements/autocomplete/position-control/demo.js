/**
 * Example 3: Position Control - from public/showcase/elements/autocomplete.
 */
export function mount(root) {
    const fruits = [
            'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry',
            'Cherry', 'Coconut', 'Date', 'Dragonfruit', 'Elderberry', 'Fig',
            'Grape', 'Grapefruit', 'Guava', 'Kiwi', 'Lemon', 'Lime', 'Mango',
            'Orange', 'Papaya', 'Peach', 'Pear', 'Pineapple', 'Plum', 'Raspberry',
            'Strawberry', 'Tangerine', 'Watermelon'
        ];
        // Position Examples
    E.autocomplete(root.querySelector('#position-above'), {
            data: fruits,
            position: 'above'
        });
    E.autocomplete(root.querySelector('#position-below'), {
            data: fruits,
            position: 'below'
        });
    E.autocomplete(root.querySelector('#position-auto'), {
            data: fruits,
            position: 'auto'
        });
}
