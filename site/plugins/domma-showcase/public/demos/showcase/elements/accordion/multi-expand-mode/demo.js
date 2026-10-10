/**
 * Multi-Expand Mode - from public/showcase/elements/accordion.
 */
export function mount(root) {
    E.accordion(root.querySelector('#multi-accordion'), {multiExpand: true});
}
