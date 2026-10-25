/**
 * Trap a panel: Tab wraps inside it, and focus goes back to Activate when it closes.
 */
export function mount(root) {
    const $root = $(root);
    const panel = $root.find('#basic-panel');

    const trap = E.focusTrap(panel.get(0), {
        initialFocus: '#basic-name',
        onActivate: () => panel.addClass('is-trapping'),
        onDeactivate: () => panel.removeClass('is-trapping')
    });
    const showState = () => $root.find('#basic-state').text(trap.isActive() ? 'active - press Tab' : 'inactive');
    trap.on('activate', showState).on('deactivate', showState);

    $root.find('#basic-on').on('click', () => trap.activate());
    $root.find('#basic-done').on('click', () => trap.deactivate());

    // Controls added while the trap is active join the Tab cycle at once.
    let added = 0;
    $root.find('#basic-add').on('click', () => {
        added += 1;
        const button = $('<button class="btn btn-outline btn-sm" type="button"></button>').text('New ' + added);
        $root.find('#basic-done').before(button);
    });

    return () => trap.destroy();
}
