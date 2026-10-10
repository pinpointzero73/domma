/**
 * Wrapper API (Backwards Compatible) - from public/showcase/elements/loader.
 * E.loader() puts a <domma-loader> Web Component in the element.
 */
export function mount(root) {
    E.loader(root.querySelector('#wrapper-loader-demo'), {
        type: 'dots',
        size: 'large',
        color: 'success',
        text: 'Wrapper API!',
        visible: true
    });
}
