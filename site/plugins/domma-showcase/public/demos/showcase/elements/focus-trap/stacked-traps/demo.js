/**
 * Stacked traps: the inner trap pauses the outer one, and closing it hands focus back.
 */
export function mount(root) {
    const $root = $(root);
    const marker = (panel) => ({
        onActivate: () => panel.addClass('is-trapping'),
        onDeactivate: () => panel.removeClass('is-trapping')
    });

    const outerPanel = $root.find('#outer-panel');
    const innerPanel = $root.find('#inner-panel');
    const outer = E.focusTrap(outerPanel.get(0), marker(outerPanel));
    const inner = E.focusTrap(innerPanel.get(0), marker(innerPanel));

    const said = (t) => (t.isPaused() ? 'paused' : t.isActive() ? 'active' : 'inactive');
    const showState = () => $root.find('#stack-state').text('outer: ' + said(outer) + ' · inner: ' + said(inner));
    for (const trap of [outer, inner]) {
        for (const name of ['activate', 'deactivate', 'pause', 'unpause']) trap.on(name, showState);
    }

    $root.find('#outer-on').on('click', () => outer.activate());
    $root.find('#outer-off').on('click', () => outer.deactivate());
    $root.find('#inner-on').on('click', () => inner.activate());
    $root.find('#inner-off').on('click', () => inner.deactivate());

    return () => {
        inner.destroy();
        outer.destroy();
    };
}
