/**
 * Colour Variants - from public/showcase/elements/loader.
 */
export function mount(root) {
        // Example 3: Colour Variants
    E.loader(root.querySelector('#color-primary'), {type: 'spinner', size: 'medium', color: 'primary'}).show();
    E.loader(root.querySelector('#color-success'), {type: 'spinner', size: 'medium', color: 'success'}).show();
    E.loader(root.querySelector('#color-danger'), {type: 'spinner', size: 'medium', color: 'danger'}).show();
    E.loader(root.querySelector('#color-warning'), {type: 'spinner', size: 'medium', color: 'warning'}).show();
    E.loader(root.querySelector('#color-dark'), {type: 'spinner', size: 'medium', color: 'dark'}).show();
    E.loader(root.querySelector('#color-custom'), {type: 'spinner', size: 'medium', color: 'var(--dm-primary)'}).show();
}
