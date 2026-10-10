/**
 * Sizes and shapes - from public/showcase/elements/avatar.
 */
export function mount(root) {
        // ---- Sizes and shapes ------------------------------------------------
    ['xs', 'sm', 'md', 'lg', 'xl'].forEach((size) =>
            $(root).find('#demo-sizes').append(E.avatar({name: 'Amara Okafor', size, title: size}).element));
    ['circle', 'rounded', 'square'].forEach((shape) =>
            $(root).find('#demo-shapes').append(E.avatar({name: 'Tom Hughes', src: '/plugins/domma-showcase/public/assets/elements/avatar/img/tom.svg', size: 'lg', shape, title: shape}).element));
}
