/** In an F.create blueprint - slider fields, one of them a [low, high] pair. */
export function mount(root) {
    const output = $(root).find('#demo-blueprint-output');

    const form = F.create({
        brightness: {
            type: 'slider', label: 'Brightness', min: 0, max: 100, default: 70,
            formConfig: {labels: (v) => v + '%'}
        },
        hours: {
            type: 'slider', label: 'Opening hours', min: 0, max: 24, default: [9, 17],
            formConfig: {
                range: true, minDistance: 1, ticks: 6, tickLabels: true,
                labels: (v) => String(v).padStart(2, '0') + ':00'
            }
        }
    }, {}, {
        submitText: 'Save',
        onSubmit: (data) => output.text(JSON.stringify(data))
    });
    const target = $(root).find('#demo-blueprint');
    form.renderTo(target.get(0));

    return () => {
        form.destroy();
        target.empty();
    };
}
