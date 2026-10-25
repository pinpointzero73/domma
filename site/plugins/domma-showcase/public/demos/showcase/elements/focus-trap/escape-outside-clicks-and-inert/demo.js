/**
 * Escape, outside clicks and inert: the panel closes either way, and the page behind is inert meanwhile.
 */
export function mount(root) {
    const $root = $(root);
    const panel = $root.find('#opts-panel');

    const trap = E.focusTrap(panel.get(0), {
        escapeDeactivates: true,
        clickOutsideDeactivates: true,
        inert: true,
        onActivate: () => panel.addClass('is-trapping'),
        onDeactivate: () => panel.removeClass('is-trapping')
    });
    const showState = () => $root.find('#opts-state')
        .text(trap.isActive() ? 'active - the rest of the page is inert' : 'inactive');
    trap.on('activate', showState).on('deactivate', showState);

    $root.find('#opts-on').on('click', () => trap.activate());

    // destroy() deactivates first, so the page loses its inert again.
    return () => trap.destroy();
}
