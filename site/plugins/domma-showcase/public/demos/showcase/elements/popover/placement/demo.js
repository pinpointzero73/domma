/**
 * Placement - from public/showcase/elements/popover.
 */
export function mount(root) {
        // ---- Placement -------------------------------------------------------
    $('[data-place]').each((i, el) => {
            E.popover(el, {
                placement: el.dataset.place,
                group: 'placement',
                content: 'Placed ' + el.dataset.place + '.'
            });
        });
}
