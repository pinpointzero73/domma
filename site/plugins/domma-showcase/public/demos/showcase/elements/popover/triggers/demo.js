/**
 * Triggers - from public/showcase/elements/popover.
 */
export function mount(root) {
        // ---- Triggers ----------------------------------------------------------
    const profileCard = () => {
            const card = $('<div class="sx-pop-profile">' +
                '<span class="sx-pop-avatar" aria-hidden="true">AL</span>' +
                '<div><p class="m-0 mb-2">Mathematician and writer, best known for her notes on the Analytical Engine.</p>' +
                '<a href="#Triggers">View profile</a></div></div>');
            return card.get(0);
        };
    E.popover(root.querySelector('#demo-hover'), {trigger: 'hover', title: 'Ada Lovelace', content: profileCard, placement: 'top'});
    E.popover(root.querySelector('#demo-focus'), {trigger: 'focus', placement: 'top', content: 'UK numbers only. Spaces are fine.'});
    const manual = E.popover(root.querySelector('#demo-manual'), {
            trigger: 'manual',
            closeOnOutside: false,
            group: null,
            placement: 'top-start',
            content: 'Opened from code. Only hide() - or Esc - closes me.'
        });
    $(root).find('#demo-manual-show').on('click', () => manual.show());
    $(root).find('#demo-manual-hide').on('click', () => manual.hide());
}
