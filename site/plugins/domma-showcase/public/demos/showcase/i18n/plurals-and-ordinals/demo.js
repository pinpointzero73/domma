/**
 * Plurals and ordinals: params.count picks the form through Intl.PluralRules, in the current locale.
 */
export function mount(root) {
    const {i18n} = Domma;
    const $root = $(root);

    i18n.add('en', {
        cart: {items: {'=0': 'Your cart is empty', one: '{count} item', other: '{count} items'}},
        race: {place: {ordinal: true, one: '{count}st', two: '{count}nd', few: '{count}rd', other: '{count}th'}}
    });
    i18n.add('fr', {
        cart: {items: {'=0': 'Votre panier est vide', one: '{count} article', other: '{count} articles'}},
        race: {place: {ordinal: true, one: '{count}er', other: '{count}e'}}
    });
    i18n.add('de', {
        cart: {items: {'=0': 'Ihr Warenkorb ist leer', one: '{count} Artikel', other: '{count} Artikel'}},
        race: {place: {ordinal: true, other: '{count}.'}}
    });
    i18n.add('ar', {
        cart: {items: {zero: 'لا توجد عناصر', one: 'عنصر واحد', two: 'عنصران', few: '{count} عناصر', many: '{count} عنصرًا', other: '{count} عنصر'}},
        race: {place: {ordinal: true, other: 'المركز {count}'}}
    });
    i18n.add('pl', {
        cart: {items: {'=0': 'Koszyk jest pusty', one: '{count} przedmiot', few: '{count} przedmioty', many: '{count} przedmiotów', other: '{count} przedmiotu'}},
        race: {place: {ordinal: true, other: '{count}.'}}
    });

    const render = () => {
        const count = Math.max(0, parseInt($root.find('#plural-count').val(), 10) || 0);
        $root.find('#plural-locale').text(i18n.locale());
        $root.find('#out-items').text(i18n.t('cart.items', {count}));
        $root.find('#out-place').text(i18n.t('race.place', {count: Math.max(1, count)}));
    };

    $root.find('#plural-count').on('input', render);
    const stopListening = i18n.on('change', render);
    render();

    return stopListening;
}
