/** Right to left - in a dir="rtl" container the first pane is on the right. */
export function mount(root) {
    const split = E.splitPane($(root).find('#demo-rtl'), {sizes: [40, 60]});

    return () => split.destroy();
}
