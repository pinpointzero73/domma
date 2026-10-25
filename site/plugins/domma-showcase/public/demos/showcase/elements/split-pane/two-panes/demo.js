/** Two panes - 30 / 70 to start, neither narrower than 120px. */
export function mount(root) {
    const shown = $(root).find('#demo-basic-out');

    const basic = E.splitPane($(root).find('#demo-basic'), {sizes: [30, 70], minSize: 120});
    basic.on('resize', (sizes) => shown.text(sizes.map(Math.round).join(' / ')));

    return () => basic.destroy();
}
