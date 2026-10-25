/**
 * Welcome to the shop: a card translated entirely by data-i18n attributes. Switch language above.
 */
export function mount(root) {
    const {i18n} = Domma;

    i18n.add('en', {shop: {
        title: 'Welcome to the shop',
        intro: 'Everything on this card comes from data-i18n attributes.',
        signedIn: 'Signed in as <strong>{name}</strong>',
        items: {'=0': 'Your cart is empty', one: '{count} item in your cart', other: '{count} items in your cart'},
        searchLabel: 'Search',
        searchPlaceholder: 'Search products',
        searchHint: 'Type a product name',
        onlyInEnglish: 'This line is only written in English - it falls back.'
    }});
    i18n.add('fr', {shop: {
        title: 'Bienvenue dans la boutique',
        intro: 'Tout le contenu de cette carte vient des attributs data-i18n.',
        signedIn: 'Connecté en tant que <strong>{name}</strong>',
        items: {'=0': 'Votre panier est vide', one: '{count} article dans votre panier', other: '{count} articles dans votre panier'},
        searchLabel: 'Rechercher',
        searchPlaceholder: 'Rechercher des produits',
        searchHint: 'Saisissez un nom de produit'
    }});
    i18n.add('de', {shop: {
        title: 'Willkommen im Shop',
        intro: 'Alles auf dieser Karte stammt aus data-i18n-Attributen.',
        signedIn: 'Angemeldet als <strong>{name}</strong>',
        items: {'=0': 'Ihr Warenkorb ist leer', one: '{count} Artikel im Warenkorb', other: '{count} Artikel im Warenkorb'},
        searchLabel: 'Suche',
        searchPlaceholder: 'Produkte suchen',
        searchHint: 'Produktnamen eingeben'
    }});
    i18n.add('ar', {shop: {
        title: 'مرحبًا بك في المتجر',
        intro: 'كل ما في هذه البطاقة يأتي من سمات data-i18n.',
        signedIn: 'تم تسجيل الدخول باسم <strong>{name}</strong>',
        items: {zero: 'سلتك فارغة', one: 'عنصر واحد في سلتك', two: 'عنصران في سلتك', few: '{count} عناصر في سلتك', many: '{count} عنصرًا في سلتك', other: '{count} عنصر في سلتك'},
        searchLabel: 'بحث',
        searchPlaceholder: 'ابحث عن المنتجات',
        searchHint: 'اكتب اسم المنتج'
    }});
    i18n.add('pl', {shop: {
        title: 'Witamy w sklepie',
        intro: 'Wszystko na tej karcie pochodzi z atrybutów data-i18n.',
        signedIn: 'Zalogowano jako <strong>{name}</strong>',
        items: {'=0': 'Koszyk jest pusty', one: '{count} przedmiot w koszyku', few: '{count} przedmioty w koszyku', many: '{count} przedmiotów w koszyku', other: '{count} przedmiotu w koszyku'},
        searchLabel: 'Szukaj',
        searchPlaceholder: 'Szukaj produktów',
        searchHint: 'Wpisz nazwę produktu'
    }});

    // Keys a locale lacks (shop.onlyInEnglish) come from English. fallback() is global, so teardown restores it.
    const fallbacks = i18n.fallback();
    if (!fallbacks.includes('en')) i18n.fallback([...fallbacks, 'en']);

    // i18n.locale(code) re-translates the whole document; this fills the card for the locale already set.
    i18n.translate(root);

    return () => i18n.fallback(fallbacks);
}
