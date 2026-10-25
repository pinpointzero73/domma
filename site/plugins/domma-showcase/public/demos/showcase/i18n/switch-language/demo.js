/**
 * Switch language: i18n.locale(code) re-translates the page; Polish arrives through load().
 */
export function mount(root) {
    const {i18n} = Domma;
    const $root = $(root);

    i18n.add('en', {lang: {hello: 'Hello - this page is in English.'}});
    i18n.add('fr', {lang: {hello: 'Bonjour - cette page est en français.'}});
    i18n.add('de', {lang: {hello: 'Hallo - diese Seite ist auf Deutsch.'}});
    i18n.add('ar', {lang: {hello: 'مرحبًا - هذه الصفحة بالعربية.'}});

    // Polish is loaded on first use. load() takes a URL ('/lang/{locale}.json') or, as here, a loader function.
    const polish = () => Promise.resolve({lang: {hello: 'Cześć - ta strona jest po polsku.'}});

    // The locale is global: remember it (and <html lang dir>) so teardown can put it back.
    const html = $('html');
    const before = {locale: i18n.locale(), lang: html.attr('lang'), dir: html.attr('dir')};

    const showState = () => {
        $root.find('#lang-current').text(i18n.locale());
        $root.find('#lang-dir').text(i18n.dir());
        $root.find('#lang-switch button').each(function () {
            const on = $(this).data('lang') === i18n.locale();
            $(this).toggleClass('active', on).attr('aria-pressed', on ? 'true' : 'false');
        });
    };
    const stopListening = i18n.on('change', showState);

    $root.find('#lang-switch button').on('click', async function () {
        const code = $(this).data('lang');
        if (code === 'pl') await i18n.load('pl', polish);
        i18n.locale(code);
    });

    i18n.translate(root);
    showState();

    return () => {
        stopListening();
        i18n.locale(before.locale);
        for (const name of ['lang', 'dir']) {
            if (before[name] == null) html.removeAttr(name);
            else html.attr(name, before[name]);
        }
    };
}
