// A classic script: no imports, using the globals Domma puts on window (declared by domma-js's types).
/// <reference path="../../assets/types/index.d.ts" />

window.DommaOptions = {globals: true, i18nWarnings: false};

$('#save').on('click', (event: Event) => {
    event.preventDefault();
    E.toast('Saved');
});
const total: number = _.sum([1, 2, 3]);
const when: string = D().format('HH:mm');
S.set('last', when);
E.modal({title: 'From a script'}).open();
H.post('/api/log', {total}).then(() => undefined);
Domma.elements.toast('Same object');
