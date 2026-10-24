// A user's module importing domma-js. Checked with `tsc --noEmit --strict` by npm run check:types:
// every line must type-check, and every @ts-expect-error must really be an error (so nothing here is `any`).
import Domma, {$, _, D, E, H, M, S, i18n} from 'domma-js';
import type {DommaCollection, DommaDate, DommaLoadOptions, ModalInstance} from 'domma-js';

// $ / Domma: a typed collection, chainable
const items: DommaCollection = $('#x').addClass('active').removeClass('idle');
const first: HTMLElement | undefined = items.get(0);
const width: number | undefined = $('.box').width(); // undefined for an empty collection
$('#list').find('li').each((index, el) => el.classList.add(`row-${index}`));
$(() => console.log('ready'));
// @ts-expect-error - no such method
$('#x').notAMethod();

// Elements: factories return instances with their own methods
const modal: ModalInstance = E.modal({title: 'Hello', content: '<p>Body</p>'});
modal.open();
// @ts-expect-error - no such method
modal.notAMethod();
E.slideover({title: 'Panel'}).on('close', () => console.log('closed'));
const zone = E.dropzone('#drop', {accept: 'image/*', multiple: true});
const files: File[] = zone ? zone.getFiles() : []; // null when '#drop' matches nothing
E.toast('Saved', {type: 'success'});

// HTTP: the response type is the caller's
interface User {
    id: number;
    name: string;
}
async function loadUser(): Promise<string> {
    const user = await H.get<User>('/api/user');
    // @ts-expect-error - not on User
    user.email;
    return user.name;
}

// Dates
const tomorrow: DommaDate = D().add(1, 'day');
const label: string = tomorrow.format('YYYY-MM-DD');
const later: boolean = D('2026-01-01').isAfter(D('2025-01-01'));
// @ts-expect-error - no such method
D().notAMethod();

// Models
const person = M.create({name: {type: 'string', default: ''}, age: {type: 'number', default: 0}});
person.set('name', 'Sam');
person.get('name');
const off = M.subscribe('saved', (data: unknown) => console.log(data));

// Utils and storage
const chunks: number[][] = _.chunk([1, 2, 3, 4], 2);
const debounced = _.debounce(() => 1, 100);
debounced.cancel();
S.set('key', {a: 1});

// i18n
const greeting: string = Domma.i18n.t('hello', {name: 'Sam'});
const same: string = i18n.t('hello');
const short: string = Domma.t('hello');

// noConflict hands back Domma itself
const dm = Domma.noConflict();
dm('#y').removeClass('off');
Domma.noConflict(true).version.toUpperCase();

// Load options
const options: DommaLoadOptions = {globals: 'safe', cloak: false};

export {first, width, files, loadUser, label, later, off, chunks, greeting, same, short, options};
