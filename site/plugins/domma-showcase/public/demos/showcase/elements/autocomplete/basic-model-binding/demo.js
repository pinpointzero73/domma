/**
 * Basic Model Binding - from public/showcase/elements/autocomplete.
 */
export function mount(root) {
    const fruits = [
            'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry',
            'Cherry', 'Coconut', 'Date', 'Dragonfruit', 'Elderberry', 'Fig',
            'Grape', 'Grapefruit', 'Guava', 'Kiwi', 'Lemon', 'Lime', 'Mango',
            'Orange', 'Papaya', 'Peach', 'Pear', 'Pineapple', 'Plum', 'Raspberry',
            'Strawberry', 'Tangerine', 'Watermelon'
        ];
        // Model Integration Demo
    const searchModel = M.create({
            query: {type: 'string', default: ''}
        });
    E.autocomplete(root.querySelector('#model-search'), {
            data: fruits,
            model: searchModel,
            modelKey: 'query'
        });
        // Bind model value display
    M.bind(searchModel, 'query', '#model-display', {
            format: (val) => val ? `"${val}"` : '""'
        });
}
