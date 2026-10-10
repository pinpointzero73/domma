/**
 * Quick Start - from public/showcase/elements/accordion.
 */
export function mount(root) {
    E.accordion(root.querySelector('#quick-accordion'), {multiExpand: false, activeIndex: 0});
}
