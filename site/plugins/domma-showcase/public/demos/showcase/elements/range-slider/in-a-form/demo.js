/** In a form - the sliders' hidden range inputs submit with it, and Reset puts them back. */
export function mount(root) {
    const form = $(root).find('#demo-form');
    const output = $(root).find('#demo-form-output');

    const guests = E.rangeSlider($(root).find('#demo-form-guests'), {ticks: true});
    const budget = E.rangeSlider($(root).find('#demo-form-budget'), {
        range: true,
        min: 0,
        max: 2000,
        step: 50,
        value: [200, 800],
        names: ['budget_min', 'budget_max'],
        ariaLabels: ['Budget from', 'Budget to'],
        labels: (v) => '£' + v
    });

    // Show what the form would send instead of sending it
    const show = (e) => {
        e.preventDefault();
        const lines = [];
        for (const [key, value] of new FormData(e.currentTarget).entries()) lines.push(key + ' = ' + value);
        output.text(lines.join('\n'));
    };
    form.on('submit', show);

    return () => {
        form.off('submit', show);
        guests.destroy();
        budget.destroy();
    };
}
