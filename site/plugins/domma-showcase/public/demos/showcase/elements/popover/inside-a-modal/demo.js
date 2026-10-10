/**
 * Inside a modal - from public/showcase/elements/popover.
 */
export function mount(root) {
        // ---- Modal -------------------------------------------------------------
    const modal = E.modal(root.querySelector('#demo-modal'));
    $(root).find('#demo-modal-open').on('click', () => modal.open());
    E.popover(root.querySelector('#demo-modal-help'), {
            title: 'Roles',
            content: 'Editors can change pages. Viewers can only read them.',
            placement: 'right'
        });
}
