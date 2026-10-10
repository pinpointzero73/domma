/**
 * 12. Loaders & Progress - from public/showcase/themes.
 */
export function mount(root) {
    E.loader(root.querySelector('#loader-spin'),  { type: 'spinner', size: 'medium' }).show();
    E.loader(root.querySelector('#loader-dots'),  { type: 'dots',    size: 'medium' }).show();
    E.loader(root.querySelector('#loader-pulse'), { type: 'pulse',   size: 'medium' }).show();
    E.loader(root.querySelector('#loader-bars'),  { type: 'bars',    size: 'medium' }).show();
}
