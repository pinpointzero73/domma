/** Stacked, with snapping - drag the console near 40px and it snaps there. */
export function mount(root) {
    const split = E.splitPane($(root).find('#demo-vertical'), {
        direction: 'vertical',
        sizes: [70, 30],
        minSize: 40,
        snapOffset: 40
    });

    return () => split.destroy();
}
