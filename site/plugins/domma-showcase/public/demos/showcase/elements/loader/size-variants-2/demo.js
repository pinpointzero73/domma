/**
 * Size Variants - from public/showcase/elements/loader.
 */
export function mount(root) {
        // Example 2: Size Variants
    E.loader(root.querySelector('#size-small'), {type: 'spinner', size: 'small', color: 'primary'}).show();
    E.loader(root.querySelector('#size-medium'), {type: 'spinner', size: 'medium', color: 'primary'}).show();
    E.loader(root.querySelector('#size-large'), {type: 'spinner', size: 'large', color: 'primary'}).show();
    E.loader(root.querySelector('#size-custom'), {type: 'spinner', size: 80, color: 'primary'}).show();
}
