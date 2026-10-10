/**
 * Example 2: Size Variants - from public/showcase/elements/pillbox.
 */
export function mount(root) {
    const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Black'];
        // Size variants
    E.pillbox(root.querySelector('#size-small'), {
            data: colors,
            size: 'small',
            value: ['Red']
        });
    E.pillbox(root.querySelector('#size-medium'), {
            data: colors,
            size: 'medium',
            value: ['Blue', 'Green']
        });
    E.pillbox(root.querySelector('#size-large'), {
            data: colors,
            size: 'large',
            value: ['Yellow']
        });
}
