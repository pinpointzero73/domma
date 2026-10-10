/**
 * FAQ Accordion (Single Expand) - from public/showcase/elements/accordion.
 */
export function mount(root) {
    E.accordion(root.querySelector('#faq-accordion'), {multiExpand: false, activeIndex: 0});
}
