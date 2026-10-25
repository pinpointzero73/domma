/** A single value - a slider over a range input, which keeps its min, max and value. */
export function mount(root) {
    const shown = $(root).find('#demo-volume-value');

    const volume = E.rangeSlider($(root).find('#demo-volume'), {
        onInput: (value) => shown.text(value)
    });

    return () => volume.destroy();
}
