/** Nested, collapsible and remembered - files, editor over terminal, and a preview. */
export function mount(root) {
    const toggle = $(root).find('#demo-ide-toggle');
    const reset = $(root).find('#demo-ide-reset');

    const ide = E.splitPane($(root).find('#demo-ide'), {
        sizes: [20, 50, 30],
        minSize: [140, 200, 160],
        collapsible: [true, false, false],
        collapseButton: true,
        persistKey: 'showcase-ide'
    });
    // The middle pane is split again, top to bottom
    const middle = E.splitPane($(root).find('#demo-ide-middle'), {
        direction: 'vertical',
        sizes: [65, 35],
        minSize: 60,
        persistKey: 'showcase-ide-middle'
    });

    // The button follows the pane, however it was collapsed
    const label = () => toggle.text(ide.isCollapsed(0) ? 'Expand files' : 'Collapse files');
    label();
    ide.on('collapse', label);
    ide.on('expand', label);

    const flip = () => (ide.isCollapsed(0) ? ide.expand(0) : ide.collapse(0));
    const resetSizes = () => {
        ide.setSizes([20, 50, 30]);
        middle.setSizes([65, 35]);
        label();
    };
    toggle.on('click', flip);
    reset.on('click', resetSizes);

    return () => {
        toggle.off('click', flip);
        reset.off('click', resetSizes);
        middle.destroy();
        ide.destroy();
    };
}
