/** Ticks and marks - a tick at every step, and labelled marks to jump to. */
export function mount(root) {
    const rating = E.rangeSlider($(root).find('#demo-rating'), {
        ticks: true,
        tickLabels: true,
        labels: (v) => v + '★'
    });

    const temp = E.rangeSlider($(root).find('#demo-temp'), {
        ticks: 10,
        labels: (v) => v + '°C',
        marks: [
            {value: 30, label: 'Delicates'},
            {value: 40, label: 'Everyday'},
            {value: 60, label: 'Towels'},
            {value: 90, label: 'Boil'}
        ]
    });

    return () => {
        rating.destroy();
        temp.destroy();
    };
}
