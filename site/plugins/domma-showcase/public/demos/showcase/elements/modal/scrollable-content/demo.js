/**
 * Example 5: Scrollable Content - from public/showcase/elements/modal.
 */
export function mount(root) {
    const scrollModal = E.modal(root.querySelector('#scroll-modal'));
    $(root).find('#open-scroll').on('click', () => scrollModal.open());
}
