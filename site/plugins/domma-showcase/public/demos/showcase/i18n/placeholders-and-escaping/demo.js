/**
 * Placeholders and escaping: t() returns text, html() keeps the message's markup and escapes the params.
 */
export function mount(root) {
    const {i18n} = Domma;
    const $root = $(root);

    i18n.add('en', {greet: {hello: 'Hello, {name}!', signedIn: 'Signed in as <strong>{name}</strong>'}});
    i18n.add('fr', {greet: {hello: 'Bonjour, {name} !', signedIn: 'Connecté en tant que <strong>{name}</strong>'}});
    i18n.add('de', {greet: {hello: 'Hallo, {name}!', signedIn: 'Angemeldet als <strong>{name}</strong>'}});
    i18n.add('ar', {greet: {hello: 'مرحبًا، {name}!', signedIn: 'تم تسجيل الدخول باسم <strong>{name}</strong>'}});
    i18n.add('pl', {greet: {hello: 'Cześć, {name}!', signedIn: 'Zalogowano jako <strong>{name}</strong>'}});

    const render = () => {
        const name = $root.find('#escape-name').val();
        // Plain text: put it in with .text(), never .html().
        $root.find('#out-t').text(i18n.t('greet.hello', {name}));
        // HTML with the name escaped: show the source, then render it.
        const html = i18n.html('greet.signedIn', {name});
        $root.find('#out-html-src').text(html);
        $root.find('#out-html').html(html);
    };

    $root.find('#escape-name').on('input', render);
    const stopListening = i18n.on('change', render);
    render();

    return stopListening;
}
