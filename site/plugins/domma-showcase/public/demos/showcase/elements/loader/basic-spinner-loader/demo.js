/**
 * Basic Spinner Loader - from public/showcase/elements/loader.
 */
export function mount(root) {
    const quickStartLoader = E.loader(root.querySelector('#quick-start-demo'), {
            type: 'spinner',
            size: 'medium',
            color: 'primary'
        });
    quickStartLoader.show();
}
