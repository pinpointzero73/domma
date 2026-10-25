/**
 * Formatting: cached Intl formatters in the current locale. Switch language above to see them change.
 */
export function mount(root) {
    const {i18n} = Domma;
    const $root = $(root);

    const formats = {
        number: () => i18n.number(1234567.891),
        percent: () => i18n.number(0.256, {style: 'percent'}),
        currency: () => i18n.currency(1499.5, 'EUR'),
        date: () => i18n.date(D(), {dateStyle: 'full'}),
        dateTime: () => i18n.date(D().subtract(3, 'day'), {dateStyle: 'medium', timeStyle: 'short'}),
        yesterday: () => i18n.relative(-1, 'day', {numeric: 'auto'}),
        inHours: () => i18n.relative(3, 'hour'),
        list: () => i18n.list(['Ann', 'Bo', 'Cy'])
    };

    const render = () => {
        $root.find('#fmt-locale').text(i18n.locale());
        $root.find('[data-fmt]').each(function () {
            $(this).text(formats[$(this).data('fmt')]());
        });
    };

    const stopListening = i18n.on('change', render);
    render();

    return stopListening;
}
