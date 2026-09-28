// src/avatar.test.js
import {afterEach, describe, expect, it, vi} from 'vitest';
import {readFileSync} from 'fs';
import Domma from './index.js';
import {configEngine} from './config.js';
import {AVATAR_TONES, avatarInitials, avatarTone} from './avatar.js';

const E = Domma.elements;
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const PEOPLE = [
    {name: 'Amara Okafor', status: 'online', href: '/team/amara'},
    {name: 'Tom Hughes', src: '/img/tom.jpg'},
    {name: 'Priya Shah'},
    {name: 'Callum Reid', status: 'busy'},
    {name: 'Nia Evans'},
    {name: 'Rhys Morgan'},
    {name: 'Sofia Rossi'}
];

describe('Domma.elements.avatar', () => {
    afterEach(() => {
        E.popover.closeAll?.();
        document.body.innerHTML = '';
    });

    describe('initials', () => {
        it('first and last word; one letter for a single name', () => {
            expect(avatarInitials('Jane Smith')).toBe('JS');
            expect(avatarInitials('Jane Q. Public')).toBe('JP');
            expect(avatarInitials('  jane   van der smith ')).toBe('JS');
            expect(avatarInitials('Madonna')).toBe('M');
            expect(avatarInitials('cher')).toBe('C');
        });

        it('emails use the part before the @, split on . _ - +', () => {
            expect(avatarInitials('jane.smith@example.com')).toBe('JS');
            expect(avatarInitials('jane_smith+news@example.com')).toBe('JN');
            expect(avatarInitials('admin@example.com')).toBe('A');
        });

        it('hyphens, brackets, quotes and emoji at the start of a word', () => {
            expect(avatarInitials('Jean-Luc Picard')).toBe('JP');
            expect(avatarInitials('Jane Smith (Admin)')).toBe('JS');
            expect(avatarInitials('"Buzz" Aldrin')).toBe('BA');
            expect(avatarInitials('🚀 Rocket Team')).toBe('RT');
        });

        it('non-Latin scripts: accents, Cyrillic, Greek, CJK, Arabic, combining marks', () => {
            expect(avatarInitials('Łukasz Żuk')).toBe('ŁŻ');
            expect(avatarInitials('élodie durand')).toBe('ÉD');
            expect(avatarInitials('Анна Каренина')).toBe('АК');
            expect(avatarInitials('Νίκος Παππάς')).toBe('ΝΠ');
            expect(avatarInitials('王小明')).toBe('王');
            expect(avatarInitials('山田 太郎')).toBe('山太');
            expect(avatarInitials('محمد علي')).toBe('مع');
            // e + combining acute stays one letter
            expect(avatarInitials('Émile Zola')).toBe('ÉZ');
        });

        it('nothing usable gives an empty string', () => {
            expect(avatarInitials('')).toBe('');
            expect(avatarInitials(null)).toBe('');
            expect(avatarInitials(undefined)).toBe('');
            expect(avatarInitials('  !! ')).toBe('');
        });

        it('is exposed as E.avatar.initials', () => {
            expect(E.avatar.initials('Jane Smith')).toBe('JS');
        });
    });

    describe('tone', () => {
        it('is deterministic, in range, and ignores case and spacing', () => {
            const t = avatarTone('Jane Smith');
            expect(t).toBeGreaterThanOrEqual(0);
            expect(t).toBeLessThan(AVATAR_TONES);
            expect(avatarTone('Jane Smith')).toBe(t);
            expect(avatarTone('  jane   SMITH ')).toBe(t);
            expect(E.avatar.tone('Jane Smith')).toBe(t);
        });

        it('pins known values so a change to the hash is deliberate', () => {
            // FNV-1a over the normalised name, mod 8. Changing these recolours every user.
            expect(['Jane Smith', 'Tom Hughes', 'Amara Okafor', '王小明'].map(avatarTone)).toEqual([6, 1, 1, 3]);
        });

        it('spreads a team over several tones', () => {
            const tones = new Set(PEOPLE.map((p) => avatarTone(p.name)));
            expect(tones.size).toBeGreaterThanOrEqual(4);
        });

        it('the rendered avatar carries its tone class; tone option overrides', () => {
            const a = E.avatar(null, {name: 'Jane Smith'});
            expect(a.element.classList.contains(`avatar-tone-${avatarTone('Jane Smith')}`)).toBe(true);
            const b = E.avatar(null, {name: 'Jane Smith', tone: 3});
            expect(b.element.classList.contains('avatar-tone-3')).toBe(true);
            expect(b.tone).toBe(3);
        });
    });

    describe('rendering', () => {
        it('turns the target into an avatar with initials, size and shape', () => {
            document.body.innerHTML = '<span id="a"></span>';
            const a = E.avatar('#a', {name: 'Jane Smith', size: 'lg', shape: 'rounded'});
            const el = document.getElementById('a');
            expect(a.element).toBe(el);
            expect(el.classList.contains('avatar')).toBe(true);
            expect(el.classList.contains('avatar-lg')).toBe(true);
            expect(el.classList.contains('avatar-rounded')).toBe(true);
            expect(el.querySelector('.avatar-initials').textContent).toBe('JS');
            expect(el.querySelector('.avatar-initials').getAttribute('aria-hidden')).toBe('true');
            expect(a.initials).toBe('JS');
        });

        it('falls back to md and circle for unknown size and shape', () => {
            const a = E.avatar(null, {name: 'X', size: 'huge', shape: 'blob'});
            expect(a.element.classList.contains('avatar-md')).toBe(true);
            expect(a.element.classList.contains('avatar-blob')).toBe(false);
        });

        it('with no target (or only options) it makes a detached span', () => {
            const a = E.avatar({name: 'Jane Smith'});
            expect(a.element.tagName).toBe('SPAN');
            expect(a.element.isConnected).toBe(false);
            expect(E.avatar('#missing', {name: 'x'})).toBeNull();
        });

        it('an icon when there is no name, or when icon is asked for', () => {
            const a = E.avatar(null, {});
            expect(a.element.querySelector('.avatar-icon').getAttribute('data-icon')).toBe('user');
            const b = E.avatar(null, {name: 'Support', icon: 'headphones'});
            expect(b.element.querySelector('.avatar-icon').getAttribute('data-icon')).toBe('headphones');
            expect(b.element.querySelector('.avatar-initials')).toBeNull();
        });

        it('an image with empty alt; initials when it fails to load', () => {
            const a = E.avatar(null, {name: 'Tom Hughes', src: '/img/tom.jpg'});
            const img = a.element.querySelector('img.avatar-img');
            expect(img).not.toBeNull();
            expect(img.getAttribute('alt')).toBe('');
            expect(a.element.querySelector('.avatar-initials')).toBeNull();

            img.dispatchEvent(new Event('error'));
            expect(a.element.querySelector('img')).toBeNull();
            expect(a.element.querySelector('.avatar-initials').textContent).toBe('TH');
            expect(a.element.classList.contains('avatar-img-failed')).toBe(true);
        });

        it('a failed image with no name falls back to the icon', () => {
            const a = E.avatar(null, {src: '/nope.png'});
            a.element.querySelector('img').dispatchEvent(new Event('error'));
            expect(a.element.querySelector('.avatar-icon')).not.toBeNull();
        });

        it('status dot and ring', () => {
            const a = E.avatar(null, {name: 'Jane Smith', status: 'away', ring: true});
            const dot = a.element.querySelector('.avatar-status');
            expect(dot.classList.contains('avatar-status-away')).toBe(true);
            expect(dot.getAttribute('aria-hidden')).toBe('true');
            expect(a.element.classList.contains('avatar-ring')).toBe(true);

            const b = E.avatar(null, {name: 'Jane Smith', status: 'asleep'});
            expect(b.element.querySelector('.avatar-status')).toBeNull();
        });

        it('update() redraws with merged options', () => {
            const a = E.avatar(null, {name: 'Jane Smith', status: 'online'});
            a.update({status: 'offline', size: 'sm'});
            expect(a.element.querySelector('.avatar-status-offline')).not.toBeNull();
            expect(a.element.classList.contains('avatar-sm')).toBe(true);
            expect(a.element.classList.contains('avatar-md')).toBe(false);
            expect(a.element.querySelector('.avatar-initials').textContent).toBe('JS');
        });

        it('destroy() puts back the old content, classes and attributes', () => {
            document.body.innerHTML = '<span id="a" class="me" title="old">JS</span>';
            const a = E.avatar('#a', {name: 'Jane Smith', title: true});
            const el = document.getElementById('a');
            expect(el.getAttribute('title')).toBe('Jane Smith');
            a.destroy();
            expect(el.className).toBe('me');
            expect(el.getAttribute('title')).toBe('old');
            expect(el.hasAttribute('role')).toBe(false);
            expect(el.textContent).toBe('JS');
            expect(E.avatar.get(el)).toBeNull();
        });
    });

    describe('accessibility', () => {
        it('role=img named by the name, with the status in words', () => {
            const a = E.avatar(null, {name: 'Jane Smith', status: 'busy'});
            expect(a.element.getAttribute('role')).toBe('img');
            expect(a.element.getAttribute('aria-label')).toBe('Jane Smith (busy)');
        });

        it('alt names it instead of the name; statusLabels translate the status', () => {
            const a = E.avatar(null, {name: 'Jane', alt: 'Jane, team lead', status: 'online', statusLabels: {online: 'en ligne'}});
            expect(a.element.getAttribute('aria-label')).toBe('Jane, team lead (en ligne)');
        });

        it('nothing to say, or decorative: hidden from assistive technology', () => {
            const a = E.avatar(null, {});
            expect(a.element.getAttribute('aria-hidden')).toBe('true');
            expect(a.element.hasAttribute('role')).toBe(false);
            const b = E.avatar(null, {name: 'Jane Smith', decorative: true});
            expect(b.element.getAttribute('aria-hidden')).toBe('true');
            expect(b.element.hasAttribute('aria-label')).toBe(false);
        });

        it('a link keeps its role and gets an aria-label', () => {
            document.body.innerHTML = '<a id="l" href="/u/jane"></a>';
            E.avatar('#l', {name: 'Jane Smith'});
            const el = document.getElementById('l');
            expect(el.hasAttribute('role')).toBe(false);
            expect(el.getAttribute('aria-label')).toBe('Jane Smith');
        });
    });

    describe('declarative', () => {
        it('scan() reads data-avatar-*, once', () => {
            document.body.innerHTML = `
                <div id="root">
                    <span id="d1" data-avatar="Jane Smith" data-avatar-size="xl" data-avatar-status="online"
                          data-avatar-shape="square" data-avatar-ring></span>
                    <span id="d2" data-avatar="Tom Hughes" data-avatar-src="/img/tom.jpg" data-avatar-tone="5"></span>
                </div>`;
            const handles = E.avatar.scan('#root');
            expect(handles).toHaveLength(2);
            const d1 = document.getElementById('d1');
            expect(d1.classList.contains('avatar-xl')).toBe(true);
            expect(d1.classList.contains('avatar-square')).toBe(true);
            expect(d1.classList.contains('avatar-ring')).toBe(true);
            expect(d1.getAttribute('aria-label')).toBe('Jane Smith (online)');
            const d2 = document.getElementById('d2');
            expect(d2.querySelector('img').getAttribute('src')).toBe('/img/tom.jpg');
            expect(d2.classList.contains('avatar-tone-5')).toBe(true);

            expect(E.avatar.scan()).toHaveLength(0);
            expect(E.avatar.get(d1)).toBe(handles[0]);
        });

        it('a destroyed declared avatar is not rescanned', () => {
            document.body.innerHTML = '<span id="d" data-avatar="Jane"></span>';
            const [h] = E.avatar.scan();
            h.destroy();
            expect(E.avatar.scan()).toHaveLength(0);
        });

        it('the config engine knows avatar and avatarGroup', () => {
            document.body.innerHTML = '<span id="c"></span><ul id="g"></ul>';
            configEngine.initComponent('#c', 'avatar', {name: 'Jane Smith'});
            configEngine.initComponent('#g', 'avatarGroup', {people: PEOPLE, max: 2});
            expect(document.querySelector('#c .avatar-initials').textContent).toBe('JS');
            expect($$('#g > li')).toHaveLength(3);
        });
    });
});

describe('Domma.elements.avatarGroup', () => {
    afterEach(() => {
        E.popover.closeAll?.();
        document.body.innerHTML = '';
    });

    it('renders a list of avatars, each with its own accessible name', () => {
        document.body.innerHTML = '<div id="team"></div>';
        const g = E.avatarGroup('#team', {people: PEOPLE.slice(0, 3), label: 'Project team', size: 'sm'});
        const ul = document.querySelector('#team > ul.avatar-group');
        expect(g.element).toBe(ul);
        expect(ul.getAttribute('aria-label')).toBe('Project team');
        expect(ul.classList.contains('avatar-group-sm')).toBe(true);
        const items = $$('li.avatar-group-item', ul);
        expect(items).toHaveLength(3);
        expect(items[0].firstElementChild.tagName).toBe('A');
        expect(items[0].firstElementChild.getAttribute('href')).toBe('/team/amara');
        expect(items[0].firstElementChild.getAttribute('aria-label')).toBe('Amara Okafor (online)');
        expect(items[0].firstElementChild.getAttribute('title')).toBe('Amara Okafor (online)');
        expect(items[1].firstElementChild.getAttribute('role')).toBe('img');
        expect(items[1].querySelector('img').getAttribute('alt')).toBe('');
        expect($$('.avatar-sm', ul)).toHaveLength(3);
        expect(g.more).toBeNull();
    });

    it('max folds the rest into "+N", named with the hidden people', () => {
        document.body.innerHTML = '<ul id="team"></ul>';
        const g = E.avatarGroup('#team', {people: PEOPLE, max: 4});
        const ul = document.getElementById('team');
        expect(g.element).toBe(ul);
        expect($$('li', ul)).toHaveLength(5);
        expect(g.shown).toHaveLength(4);
        expect(g.hidden.map((p) => p.name)).toEqual(['Nia Evans', 'Rhys Morgan', 'Sofia Rossi']);
        const more = ul.querySelector('button.avatar-more');
        expect(more).toBe(g.more);
        expect(more.textContent).toBe('+3');
        expect(more.getAttribute('type')).toBe('button');
        expect(more.getAttribute('aria-label')).toBe('3 more: Nia Evans, Rhys Morgan and Sofia Rossi');
    });

    it('the "+N" opens a popover listing the hidden people', () => {
        document.body.innerHTML = '<ul id="team"></ul>';
        const g = E.avatarGroup('#team', {people: PEOPLE, max: 5});
        expect(g.popover).not.toBeNull();
        expect(g.more.getAttribute('aria-haspopup')).toBe('dialog');
        g.popover.show();
        const panel = g.popover.panel;
        expect(panel.classList.contains('avatar-more-popover')).toBe(true);
        const names = $$('.avatar-more-name', panel).map((n) => n.textContent);
        expect(names).toEqual(['Rhys Morgan', 'Sofia Rossi']);
        // the small avatars beside the names are decorative
        expect($$('.avatar-more-person .avatar', panel).every((a) => a.getAttribute('aria-hidden') === 'true')).toBe(true);
        g.popover.hide();
    });

    it('onMore replaces the popover and receives the hidden people', () => {
        document.body.innerHTML = '<ul id="team"></ul>';
        const onMore = vi.fn();
        const g = E.avatarGroup('#team', {people: PEOPLE, max: 6, onMore});
        expect(g.popover).toBeNull();
        g.more.click();
        expect(onMore).toHaveBeenCalledTimes(1);
        expect(onMore.mock.calls[0][0].map((p) => p.name)).toEqual(['Sofia Rossi']);
    });

    it('popover: false falls back to title text', () => {
        document.body.innerHTML = '<ul id="team"></ul>';
        const g = E.avatarGroup('#team', {people: PEOPLE, max: 5, popover: false});
        expect(g.popover).toBeNull();
        expect(g.more.getAttribute('title')).toBe('Rhys Morgan, Sofia Rossi');
    });

    it('max larger than the list, or missing, shows everyone', () => {
        document.body.innerHTML = '<ul id="a"></ul><ul id="b"></ul>';
        E.avatarGroup('#a', {people: PEOPLE, max: 20});
        E.avatarGroup('#b', {people: PEOPLE});
        expect($$('#a .avatar-more')).toHaveLength(0);
        expect($$('#b li')).toHaveLength(PEOPLE.length);
    });

    it('accepts plain names; overlap sets the custom property', () => {
        document.body.innerHTML = '<ul id="team"></ul>';
        const g = E.avatarGroup('#team', {people: ['Jane Smith', 'Tom Hughes'], overlap: 'lg'});
        expect($$('#team .avatar-initials').map((n) => n.textContent)).toEqual(['JS', 'TH']);
        expect(g.element.style.getPropertyValue('--dm-avatar-overlap')).toContain('0.45');
        g.update({overlap: 6});
        expect(g.element.style.getPropertyValue('--dm-avatar-overlap')).toBe('6px');
    });

    it('setPeople() redraws; destroy() restores the host', () => {
        document.body.innerHTML = '<div id="team"><p>No one yet</p></div>';
        const g = E.avatarGroup('#team', {people: PEOPLE, max: 2});
        g.setPeople(PEOPLE.slice(0, 1));
        expect($$('#team li')).toHaveLength(1);
        expect(g.more).toBeNull();
        g.destroy();
        expect(document.getElementById('team').innerHTML).toBe('<p>No one yet</p>');
        expect(E.avatarGroup.get('#team')).toBeNull();
    });
});

describe('Accessibility and text utilities (domma.css)', () => {
    const css = readFileSync('src/css/domma.css', 'utf8');
    const has = (sel) => new RegExp(`(^|[\\s,}])${sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[,{:]`, 'm').test(css);

    it('defines the screen-reader, clamp, stretched-link, divider and truncate classes', () => {
        for (const sel of [
            '.sr-only', '.visually-hidden', '.sr-only-focusable', '.visually-hidden-focusable', '.not-sr-only',
            '.line-clamp-1', '.line-clamp-2', '.line-clamp-3', '.line-clamp-4', '.line-clamp-5', '.line-clamp-none',
            '.stretched-link', '.divider-text', '.divider-text-start', '.divider-text-end',
            '.truncate', '.text-truncate'
        ]) {
            expect(has(sel), sel).toBe(true);
        }
    });

    it('the -focusable forms only hide while nothing inside has focus', () => {
        expect(css).toContain('.sr-only-focusable:not(:focus):not(:focus-within)');
        expect(css).toContain('.visually-hidden-focusable:not(:focus):not(:focus-within)');
    });
});
