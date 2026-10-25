/** Vertical and right-to-left - a three-band equaliser, and a slider in an Arabic block. */
export function mount(root) {
    const bands = [['#demo-eq-1', 'Bass', 3], ['#demo-eq-2', 'Middle', -2], ['#demo-eq-3', 'Treble', 6]];
    const sliders = bands.map(([selector, name, value]) => E.rangeSlider($(root).find(selector), {
        orientation: 'vertical',
        min: -12,
        max: 12,
        value,
        ariaLabel: name,
        labels: (v) => (v > 0 ? '+' : '') + v + ' dB'
    }));

    // The block is dir="rtl", so the minimum is on the right
    sliders.push(E.rangeSlider($(root).find('#demo-rtl'), {ticks: true}));

    return () => sliders.forEach(s => s.destroy());
}
