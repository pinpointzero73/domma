// src/i18n.test.js
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {i18n} from './i18n.js';
import {dates} from './dates.js';
import {storage} from './storage.js';
import Domma from './index.js';

let warn;
beforeEach(() => {
    i18n.reset();
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    delete window.DommaOptions;
});
afterEach(() => {
    vi.restoreAllMocks();
    delete window.DommaOptions;
});

describe('i18n - messages', () => {
    it('flattens nested objects to dot keys', () => {
        i18n.add('en', {nav: {home: 'Home', account: {settings: 'Settings'}}, n: 5});
        expect(i18n.t('nav.home')).toBe('Home');
        expect(i18n.t('nav.account.settings')).toBe('Settings');
        expect(i18n.t('n')).toBe('5');
        expect(i18n.has('nav.account')).toBe(false);
    });

    it('merges rather than replaces', () => {
        i18n.add('en', {a: 'A', nav: {home: 'Home'}});
        i18n.add('en', {b: 'B', nav: {about: 'About', home: 'Start'}});
        expect(i18n.t('a')).toBe('A');
        expect(i18n.t('nav.about')).toBe('About');
        expect(i18n.t('nav.home')).toBe('Start');
        expect(i18n.locales()).toEqual(['en']);
    });

    it('keeps a __proto__ key as data', () => {
        i18n.add('en', JSON.parse('{"x": {"__proto__": {"polluted": "yes"}, "other": "o"}}'));
        expect(({}).polluted).toBeUndefined();
    });

    it('Domma.t and Domma.i18n are wired', () => {
        i18n.add('en', {hi: 'Hi {name}'});
        expect(Domma.i18n).toBe(i18n);
        expect(Domma.t('hi', {name: 'Ann'})).toBe('Hi Ann');
    });

    it('has() checks the current locale chain or a given locale', () => {
        i18n.add('fr', {only: 'seulement'});
        expect(i18n.has('only')).toBe(false);
        expect(i18n.has('only', {locale: 'fr'})).toBe(true);
    });
});

describe('i18n - locale and fallback chain', () => {
    it('get/set, canonicalises, fires change once', () => {
        const seen = [];
        const off = i18n.on('change', d => seen.push(d));
        expect(i18n.locale()).toBe('en');
        expect(i18n.locale('fr_ca')).toBe('fr-CA');
        i18n.locale('fr-CA');
        expect(seen).toEqual([{locale: 'fr-CA', previous: 'en'}]);
        off();
        i18n.locale('de');
        expect(seen).toHaveLength(1);
    });

    it('rejects nonsense locales', () => {
        expect(() => i18n.locale('not a locale!')).toThrow(RangeError);
    });

    it('searches region -> language -> fallbacks', () => {
        i18n.add('en', {a: 'en-a', b: 'en-b', c: 'en-c'});
        i18n.add('fr', {a: 'fr-a', b: 'fr-b'});
        i18n.add('fr-CA', {a: 'ca-a'});
        i18n.fallback('en');
        i18n.locale('fr-CA');
        expect(i18n.t('a')).toBe('ca-a');
        expect(i18n.t('b')).toBe('fr-b');
        expect(i18n.t('c')).toBe('en-c');
        expect(i18n.fallback(['de', 'en'])).toEqual(['de', 'en']);
        expect(i18n.t('a', null, {locale: 'de'})).toBe('en-a');
    });

    it('dispatches dm:i18n:change on document', () => {
        const fn = vi.fn();
        document.addEventListener('dm:i18n:change', fn);
        i18n.locale('de');
        document.removeEventListener('dm:i18n:change', fn);
        expect(fn).toHaveBeenCalledOnce();
        expect(fn.mock.calls[0][0].detail).toEqual({locale: 'de', previous: 'en'});
    });
});

describe('i18n - interpolation and escaping', () => {
    beforeEach(() => i18n.add('en', {
        hi: 'Hello, {name}!',
        deep: '{user.name} ({user.role})',
        rich: 'Welcome <strong>{name}</strong>',
        left: 'Hi {name} and {missing}'
    }));

    it('fills placeholders, including dotted paths', () => {
        expect(i18n.t('hi', {name: 'Ann'})).toBe('Hello, Ann!');
        expect(i18n.t('deep', {user: {name: 'Bo', role: 'admin'}})).toBe('Bo (admin)');
    });

    it('leaves an unknown placeholder as written', () => {
        expect(i18n.t('left', {name: 'Ann'})).toBe('Hi Ann and {missing}');
    });

    it('t() is plain text: params are not escaped', () => {
        expect(i18n.t('hi', {name: '<b>x</b>'})).toBe('Hello, <b>x</b>!');
    });

    it('html() keeps the message markup and escapes params', () => {
        expect(i18n.html('rich', {name: '<img src=x onerror=alert(1)>'}))
            .toBe('Welcome <strong>&lt;img src=x onerror=alert(1)&gt;</strong>');
        expect(i18n.html('nope.<b>')).toBe('nope.&lt;b&gt;');
    });

    it('never evaluates code in a message', () => {
        i18n.add('en', {evil: '{constructor} ${1+1} {toString}'});
        expect(i18n.t('evil', {})).toBe('{constructor} ${1+1} {toString}');
    });
});

describe('i18n - plurals and select', () => {
    it('English cardinals with =N and zero', () => {
        i18n.add('en', {items: {'=0': 'No items', one: '{count} item', other: '{count} items'}});
        expect(i18n.t('items', {count: 0})).toBe('No items');
        expect(i18n.t('items', {count: 1})).toBe('1 item');
        expect(i18n.t('items', {count: 5})).toBe('5 items');
        expect(i18n.t('items')).toBe('{count} items');
        i18n.add('en', {z: {zero: 'none', one: 'one', other: 'many'}});
        expect(i18n.t('z', {count: 0})).toBe('none');
    });

    it('Polish one/few/many', () => {
        i18n.add('pl', {files: {one: '{count} plik', few: '{count} pliki', many: '{count} plików', other: '{count} pliku'}});
        i18n.locale('pl');
        expect(i18n.t('files', {count: 1})).toBe('1 plik');
        expect(i18n.t('files', {count: 3})).toBe('3 pliki');
        expect(i18n.t('files', {count: 5})).toBe('5 plików');
        expect(i18n.t('files', {count: 22})).toBe('22 pliki');
        expect(i18n.t('files', {count: 1.5})).toBe('1.5 pliku');
    });

    it('Arabic six forms', () => {
        i18n.add('ar', {d: {zero: 'zero', one: 'one', two: 'two', few: 'few', many: 'many', other: 'other'}});
        i18n.locale('ar');
        expect([0, 1, 2, 3, 11, 100].map(count => i18n.t('d', {count})))
            .toEqual(['zero', 'one', 'two', 'few', 'many', 'other']);
    });

    it('uses the rules of the locale the message came from', () => {
        i18n.add('en', {x: {one: 'one', few: 'few', other: 'other'}});
        i18n.fallback('en');
        i18n.locale('pl');
        expect(i18n.t('x', {count: 3})).toBe('other');
    });

    it('ordinals - in the message or as an option', () => {
        i18n.add('en', {
            place: {ordinal: true, one: '{count}st', two: '{count}nd', few: '{count}rd', other: '{count}th'},
            plain: {one: '{count}st', two: '{count}nd', few: '{count}rd', other: '{count}th'}
        });
        expect([1, 2, 3, 4, 11, 21, 22, 103].map(count => i18n.t('place', {count})))
            .toEqual(['1st', '2nd', '3rd', '4th', '11th', '21st', '22nd', '103rd']);
        expect(i18n.t('plain', {count: 2})).toBe('2th');
        expect(i18n.t('plain', {count: 2}, {ordinal: true})).toBe('2nd');
    });

    it('select by a named param', () => {
        i18n.add('en', {reply: {select: 'gender', female: 'She replied', male: 'He replied', other: 'They replied'}});
        expect(i18n.t('reply', {gender: 'female'})).toBe('She replied');
        expect(i18n.t('reply', {gender: 'x'})).toBe('They replied');
        expect(i18n.t('reply')).toBe('They replied');
    });

    it('a namespace that only looks like forms stays a namespace', () => {
        i18n.add('en', {menu: {one: 'First', other: 'Other', extra: 'Extra'}});
        expect(i18n.t('menu.one')).toBe('First');
    });
});

describe('i18n - missing keys', () => {
    it('returns the key or the default (interpolated)', () => {
        expect(i18n.t('a.b')).toBe('a.b');
        expect(i18n.t('a.b', {n: 2}, {default: 'Got {n}'})).toBe('Got 2');
    });

    it('warns once per key and locale; i18nWarnings: false silences', () => {
        i18n.t('gone');
        i18n.t('gone');
        expect(warn).toHaveBeenCalledTimes(1);
        i18n.locale('fr');
        i18n.t('gone');
        expect(warn).toHaveBeenCalledTimes(2);
        window.DommaOptions = {i18nWarnings: false};
        i18n.t('other');
        expect(warn).toHaveBeenCalledTimes(2);
    });

    it('fires missing events and the onMissing hook, whose string wins', () => {
        const events = [];
        i18n.on('missing', d => events.push(d));
        const hook = vi.fn((key) => key === 'x' ? `[${key}]` : undefined);
        i18n.onMissing(hook);
        expect(i18n.t('x')).toBe('[x]');
        expect(i18n.t('y')).toBe('y');
        expect(hook).toHaveBeenCalledWith('x', 'en');
        expect(events).toEqual([{key: 'x', locale: 'en'}, {key: 'y', locale: 'en'}]);
        i18n.onMissing(null);
        expect(i18n.t('x')).toBe('x');
    });
});

describe('i18n - formatters', () => {
    it('number and currency in the current locale', () => {
        expect(i18n.number(1234.5)).toBe('1,234.5');
        i18n.locale('de');
        expect(i18n.number(1234.5)).toBe('1.234,5');
        expect(i18n.currency(9.5, 'EUR')).toBe('9,50 €');
        expect(i18n.number(0.25, {style: 'percent', locale: 'en'})).toBe('25%');
    });

    it('caches Intl instances per locale + options', () => {
        const Real = Intl.NumberFormat;
        const spy = vi.spyOn(Intl, 'NumberFormat').mockImplementation(function (...args) {
            return new Real(...args);
        });
        i18n.number(1, {maximumFractionDigits: 2});
        i18n.number(2, {maximumFractionDigits: 2});
        i18n.number(2, {maximumFractionDigits: 3});
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('date accepts Date, number, string and D()', () => {
        const opts = {year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'};
        const ts = Date.UTC(2026, 9, 24, 12);
        expect(i18n.date(new Date(ts), opts)).toBe('October 24, 2026');
        expect(i18n.date(ts, opts)).toBe('October 24, 2026');
        expect(i18n.date('2026-10-24T12:00:00Z', opts)).toBe('October 24, 2026');
        expect(i18n.date(dates(ts), opts)).toBe('October 24, 2026');
        expect(i18n.date(ts, {...opts, locale: 'fr'})).toBe('24 octobre 2026');
        expect(i18n.date('nonsense')).toBe('');
    });

    it('relative and list', () => {
        expect(i18n.relative(-1, 'day', {numeric: 'auto'})).toBe('yesterday');
        expect(i18n.relative(3, 'hour')).toBe('in 3 hours');
        expect(i18n.list(['a', 'b', 'c'])).toBe('a, b, and c');
        i18n.locale('fr');
        expect(i18n.list(['a', 'b'], {type: 'disjunction'})).toBe('a ou b');
    });
});

describe('i18n - load', () => {
    it('dedupes concurrent loads of a function and caches the result', async () => {
        const loader = vi.fn(async () => ({hello: 'Bonjour'}));
        const loaded = vi.fn();
        i18n.on('loaded', loaded);
        const [a, b] = await Promise.all([i18n.load('fr', loader), i18n.load('fr', loader)]);
        await i18n.load('fr', loader);
        expect(loader).toHaveBeenCalledTimes(1);
        expect(loader).toHaveBeenCalledWith('fr');
        expect(a).toBe(b);
        expect(loaded).toHaveBeenCalledOnce();
        expect(i18n.t('hello', null, {locale: 'fr'})).toBe('Bonjour');
        await i18n.load('fr', loader, {reload: true});
        expect(loader).toHaveBeenCalledTimes(2);
    });

    it('fetches a URL with H.get, replacing {locale}, once', async () => {
        const original = global.fetch;
        const calls = [];
        global.fetch = vi.fn(async (url) => {
            calls.push(url);
            return new Response(JSON.stringify({nav: {home: 'Startseite'}}), {headers: {'content-type': 'application/json'}});
        });
        try {
            await Promise.all([i18n.load('de', '/lang/{locale}.json'), i18n.load('de', '/lang/{locale}.json')]);
        } finally {
            global.fetch = original;
        }
        expect(calls).toEqual(['/lang/de.json']);
        i18n.locale('de');
        expect(i18n.t('nav.home')).toBe('Startseite');
    });

    it('does not cache a failure', async () => {
        let n = 0;
        const loader = async () => {
            if (n++ === 0) throw new Error('offline');
            return {k: 'v'};
        };
        await expect(i18n.load('es', loader)).rejects.toThrow('offline');
        await expect(i18n.load('es', loader)).resolves.toEqual({k: 'v'});
    });

    it('re-translates the page when the current locale loads', async () => {
        document.body.innerHTML = '<p data-i18n="greet">Hello</p>';
        i18n.locale('fr');
        await i18n.load('fr', async () => ({greet: 'Bonjour'}));
        expect(document.querySelector('p').textContent).toBe('Bonjour');
    });
});

describe('i18n - DOM', () => {
    beforeEach(() => {
        i18n.add('en', {title: 'Title', hi: 'Hi {name}', ph: 'Search…', tip: 'Search the site',
            rich: '<em>Rich</em> <script>alert(1)</script><a href="javascript:alert(1)" onclick="x()">link</a> {name}',
            n: {one: '{count} new', other: '{count} new ones'}});
        i18n.add('fr', {title: 'Titre', hi: 'Salut {name}', ph: 'Rechercher…'});
    });

    it('fills text, params, attributes and sanitised html', () => {
        document.body.innerHTML = `
            <h1 data-i18n="title">x</h1>
            <p id="hi" data-i18n="hi" data-i18n-params='{"name":"<b>Ann</b>"}'></p>
            <span id="n" data-i18n="n" data-i18n-params='{"count":2}'></span>
            <input id="q" data-i18n-attr="placeholder:ph; title:tip">
            <div id="r" data-i18n-html="rich" data-i18n-params='{"name":"<img src=x onerror=1>"}'></div>`;
        expect(i18n.translate()).toBe(5);
        expect(document.querySelector('h1').textContent).toBe('Title');
        expect(document.getElementById('hi').textContent).toBe('Hi <b>Ann</b>');
        expect(document.getElementById('hi').children).toHaveLength(0);
        expect(document.getElementById('n').textContent).toBe('2 new ones');
        const q = document.getElementById('q');
        expect(q.getAttribute('placeholder')).toBe('Search…');
        expect(q.getAttribute('title')).toBe('Search the site');
        const r = document.getElementById('r');
        expect(r.querySelector('em').textContent).toBe('Rich');
        expect(r.querySelector('script')).toBeNull();
        expect(r.querySelector('img')).toBeNull();
        expect(r.innerHTML).not.toMatch(/onclick|javascript:/);
        expect(r.textContent).toContain('<img src=x onerror=1>');
    });

    it('switching locale updates the DOM and falls back to the authored text', () => {
        document.body.innerHTML = '<input id="q" placeholder="Find" title="Orig" data-i18n-attr="placeholder:ph; title:tip"><p data-i18n="title">Authored</p><p id="m" data-i18n="nothing">Kept</p>';
        i18n.translate();
        i18n.locale('fr');
        expect(document.querySelector('[data-i18n="title"]').textContent).toBe('Titre');
        expect(document.getElementById('q').getAttribute('placeholder')).toBe('Rechercher…');
        expect(document.getElementById('q').getAttribute('title')).toBe('Orig');
        expect(document.getElementById('m').textContent).toBe('Kept');
    });

    it('data-i18n-attr never writes an event handler, style, srcdoc or formaction', () => {
        i18n.add('en', {by: '{name} wrote this', css: 'color:red'});
        document.body.innerHTML = `
            <span id="a" data-i18n-attr="onclick:by; ONMOUSEOVER:by; style:css; title:by" data-i18n-params='{"name":"window.__pwn=1;//"}'></span>
            <iframe id="f" data-i18n-attr="srcdoc:by"></iframe>
            <button id="b" data-i18n-attr="formaction:by"></button>`;
        i18n.translate();
        const a = document.getElementById('a');
        expect(a.hasAttribute('onclick')).toBe(false);
        expect(a.hasAttribute('onmouseover')).toBe(false);
        expect(a.hasAttribute('style')).toBe(false);
        expect(a.getAttribute('title')).toBe('window.__pwn=1;// wrote this');
        expect(document.getElementById('f').hasAttribute('srcdoc')).toBe(false);
        expect(document.getElementById('b').hasAttribute('formaction')).toBe(false);
        a.click();
        expect(window.__pwn).toBeUndefined();
        // One warning per attribute name, however often it is asked for
        const before = warn.mock.calls.length;
        i18n.translate();
        expect(warn.mock.calls.length).toBe(before);
        expect(warn.mock.calls.some(c => String(c[0]).includes('onclick'))).toBe(true);
    });

    it('data-i18n-attr only puts safe URLs into href, src and the other URL attributes', () => {
        i18n.add('en', {js: 'javascript:alert(1)', tab: 'java\tscript:alert(1)', data: 'data:text/html,<b>x</b>',
            web: 'https://example.com/a', rel: '/docs/{page}', frag: '#top', mail: 'mailto:a@b.c', tel: 'tel:+441234'});
        document.body.innerHTML = `
            <a id="j" href="/kept" data-i18n-attr="href:js"></a>
            <a id="t" data-i18n-attr="href:tab"></a>
            <img id="d" data-i18n-attr="src:data">
            <form id="fm" data-i18n-attr="action:js"></form>
            <svg><a id="x" data-i18n-attr="xlink:href:js"></a></svg>
            <a id="w" data-i18n-attr="href:web"></a>
            <a id="r" data-i18n-attr="href:rel" data-i18n-params='{"page":"intro"}'></a>
            <a id="h" data-i18n-attr="href:frag"></a>
            <a id="m" data-i18n-attr="href:mail"></a>
            <a id="p" data-i18n-attr="href:tel"></a>`;
        i18n.translate();
        const $id = (id) => document.getElementById(id);
        expect($id('j').getAttribute('href')).toBe('/kept');
        expect($id('t').hasAttribute('href')).toBe(false);
        expect($id('d').hasAttribute('src')).toBe(false);
        expect($id('fm').hasAttribute('action')).toBe(false);
        expect($id('w').getAttribute('href')).toBe('https://example.com/a');
        expect($id('r').getAttribute('href')).toBe('/docs/intro');
        expect($id('h').getAttribute('href')).toBe('#top');
        expect($id('m').getAttribute('href')).toBe('mailto:a@b.c');
        expect($id('p').getAttribute('href')).toBe('tel:+441234');
        expect(document.querySelector('svg a').getAttribute('xlink:href')).toBeNull();
    });

    it('translate(el) handles content added later, including the root itself', () => {
        const el = document.createElement('div');
        el.setAttribute('data-i18n', 'title');
        el.innerHTML = '';
        expect(i18n.translate(el)).toBe(1);
        expect(el.textContent).toBe('Title');
        document.body.innerHTML = '<section><b data-i18n="title"></b></section>';
        expect(i18n.translate('section')).toBe(1);
        expect(i18n.translate(Domma('section'))).toBe(1);
    });

    it('bad data-i18n-params JSON is ignored with a warning', () => {
        document.body.innerHTML = '<p data-i18n="hi" data-i18n-params="{nope">x</p>';
        i18n.translate();
        expect(document.querySelector('p').textContent).toBe('Hi {name}');
        expect(warn).toHaveBeenCalled();
    });

    it('sets html lang and dir', () => {
        i18n.locale('ar');
        expect(document.documentElement.getAttribute('lang')).toBe('ar');
        expect(document.documentElement.getAttribute('dir')).toBe('rtl');
        i18n.locale('he-IL');
        expect(document.documentElement.getAttribute('dir')).toBe('rtl');
        i18n.locale('en-GB');
        expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    });

    it('dir() for languages and scripts', () => {
        expect(['ar', 'fa', 'ur', 'he', 'yi', 'en', 'pl', 'ja', 'pa-Arab'].map(c => i18n.dir(c)))
            .toEqual(['rtl', 'rtl', 'rtl', 'rtl', 'rtl', 'ltr', 'ltr', 'ltr', 'rtl']);
    });

    it('works without a DOM (translate no-ops)', async () => {
        const doc = globalThis.document;
        // eslint-disable-next-line no-global-assign
        delete globalThis.document;
        try {
            expect(i18n.translate()).toBe(0);
            i18n.add('en', {a: 'A'});
            expect(i18n.locale('fr')).toBe('fr');
        } finally {
            globalThis.document = doc;
        }
    });
});

describe('i18n - detect', () => {
    it('storage first, then navigator, then html; persists with storageKey', () => {
        const nav = vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['de-AT', 'en']);
        expect(i18n.detect({from: ['navigator'], supported: ['en', 'de']})).toBe('de');
        expect(i18n.locale()).toBe('de');

        storage.set('lang', 'fr');
        expect(i18n.detect({storageKey: 'lang'})).toBe('fr');
        i18n.locale('pl');
        expect(storage.get('lang')).toBe('pl');
        nav.mockRestore();
    });

    it('html lang, supported filter and fallback', () => {
        vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['ja']);
        document.documentElement.setAttribute('lang', 'es-MX');
        expect(i18n.detect({from: ['navigator', 'html'], supported: ['en', 'es']})).toBe('es');
        expect(i18n.detect({from: ['navigator'], supported: ['en', 'es'], fallback: 'en', apply: false})).toBe('en');
        expect(i18n.locale()).toBe('es');
    });
});
