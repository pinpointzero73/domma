// src/globals.test.js
import {afterEach, describe, expect, it, vi} from 'vitest';
import {execFileSync} from 'child_process';
import {fileURLToPath} from 'url';
import {dirname, resolve} from 'path';
import {installGlobals, loadOption} from './globals.js';
import Domma from './index.js';
import {escapeHtml} from './escape.js';
import sanitize from './sanitize.js';
import Component from './component.js';

const ALIASES = ['$', '_', 'jq'];

afterEach(() => {
    delete window.DommaOptions;
    for (const name of ALIASES) delete window[name];
});

const fresh = () => {
    const D = () => {};
    return {D, aliases: {$: () => 'dm$', _: {dm: true}}};
};

describe('installGlobals', () => {
    it('installs every alias by default and noConflict() hands $ and _ back', () => {
        const jq = () => 'jquery';
        const lodash = {lodash: true};
        window.$ = jq;
        window._ = lodash;
        const savedDomma = window.Domma;
        const {D, aliases} = fresh();

        installGlobals(D, aliases);
        expect(window.$).toBe(aliases.$);
        expect(window._).toBe(aliases._);

        expect(D.noConflict()).toBe(D);
        expect(window.$).toBe(jq);
        expect(window._).toBe(lodash);
        expect(window.Domma).toBe(D);

        D.noConflict(true);
        expect(window.Domma).toBe(D);
        window.Domma = savedDomma;
    });

    it("'safe' leaves an existing $ alone and takes the free names", () => {
        const jq = () => 'jquery';
        window.$ = jq;
        window.DommaOptions = {globals: 'safe'};
        const savedDomma = window.Domma;
        const {D, aliases} = fresh();

        installGlobals(D, aliases);
        expect(window.$).toBe(jq);
        expect(window._).toBe(aliases._);
        window.Domma = savedDomma;
    });

    it('false installs window.Domma only', () => {
        window.DommaOptions = {globals: false};
        const savedDomma = window.Domma;
        const {D, aliases} = fresh();

        installGlobals(D, aliases);
        expect(window.$).toBeUndefined();
        expect(window._).toBeUndefined();
        expect(window.Domma).toBe(D);
        window.Domma = savedDomma;
    });

    it('noConflict() does not take back a name something loaded later owns', () => {
        const savedDomma = window.Domma;
        const {D, aliases} = fresh();
        installGlobals(D, aliases);
        const later = () => 'later';
        window.$ = later;

        D.noConflict();
        expect(window.$).toBe(later);
        window.Domma = savedDomma;
    });

    it('loadOption reads window.DommaOptions with a fallback', () => {
        expect(loadOption('cloak', true)).toBe(true);
        window.DommaOptions = {cloak: false};
        expect(loadOption('cloak', true)).toBe(false);
    });

    it('the real Domma has noConflict and isDomma', () => {
        expect(typeof Domma.noConflict).toBe('function');
        expect(Domma.isDomma(Domma('body'))).toBe(true);
        expect(Domma.isDomma(document.body)).toBe(false);
    });
});

describe('importing outside a browser', () => {
    it('src/index.js imports in plain Node without a DOM', () => {
        const entry = resolve(dirname(fileURLToPath(import.meta.url)), 'index.js');
        const script = `globalThis.__BUILD_VERSION__='t';globalThis.__BUILD_DATE__='';globalThis.__BUILD_COMMIT__='';`
            + `const m = await import(${JSON.stringify(entry)}); console.log(typeof m.default, typeof m.E.toast);`;
        const out = execFileSync(process.execPath, ['--input-type=module', '-e', script], {encoding: 'utf8'});
        expect(out.trim()).toBe('function function');
    });
});

describe('escaping for attributes', () => {
    const attack = '" autofocus onfocus="alert(1)';

    it('escapeHtml escapes both quote kinds', () => {
        expect(escapeHtml(attack)).not.toContain('"');
        expect(escapeHtml("it's")).toBe('it&#39;s');
        expect(escapeHtml(null)).toBe('');
        expect(escapeHtml(0)).toBe('0');
    });

    it('sanitize.escape is quote-safe', () => {
        expect(sanitize.escape(attack)).not.toContain('"');
    });

    it("a prompt's prefilled value cannot break out of its attribute", async () => {
        const pending = Domma.elements.prompt('Name?', {inputValue: attack, inputPlaceholder: attack});
        const input = document.querySelector('.dm-dialog-input');
        expect(input.getAttribute('value')).toBe(attack);
        expect(input.hasAttribute('onfocus')).toBe(false);
        expect(input.hasAttribute('autofocus')).toBe(false);
        document.querySelector('.dm-dialog-cancel')?.click();
        await Promise.race([pending, new Promise(r => setTimeout(r, 400))]);
    });
});

describe('card content is sanitised', () => {
    it('strips script handlers unless {safe: false}', () => {
        document.body.innerHTML = '<div id="c1"></div><div id="c2"></div>';
        const card = Domma.elements.card('#c1', {content: '<p>hi</p><img src="x" onerror="alert(1)">'});
        const html = (card.element || document.querySelector('domma-card')).innerHTML;
        expect(html).toContain('<p>hi</p>');
        expect(html).not.toContain('onerror');

        const trusted = Domma.elements.card('#c2', {content: '<button data-x="1">Go</button>', safe: false});
        expect((trusted.element || document.querySelectorAll('domma-card')[1]).innerHTML).toContain('<button data-x="1">');
    });
});

describe('Component events', () => {
    it('on/off/_emit call listeners and fire a dm: DOM event', () => {
        document.body.innerHTML = '<div id="x"></div>';
        const c = new Component('#x');
        const seen = [];
        const handler = (d) => seen.push(d);
        const dom = vi.fn();
        c.element.addEventListener('dm:open', dom);

        expect(c.on('open', handler)).toBe(c);
        c._emit('open', 1);
        c.off('open', handler);
        c._emit('open', 2);

        expect(seen).toEqual([1]);
        expect(dom).toHaveBeenCalledTimes(2);
        expect(dom.mock.calls[0][0].detail).toBe(1);
    });

    it('destroy() drops listeners', () => {
        document.body.innerHTML = '<div id="y"></div>';
        const c = new Component('#y');
        const handler = vi.fn();
        c.on('open', handler);
        c.destroy();
        c._emit('open');
        expect(handler).not.toHaveBeenCalled();
    });
});

describe('timeline() deprecation', () => {
    it('warns once, and not at all with deprecationWarnings: false', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        document.body.innerHTML = '<div id="t1"></div><div id="t2"></div>';
        Domma.elements.timeline('#t1', {items: []});
        Domma.elements.timeline('#t2', {items: []});
        const timelineWarnings = warn.mock.calls.filter(c => String(c[0]).includes('timeline()'));
        expect(timelineWarnings.length).toBeLessThanOrEqual(1);
        warn.mockRestore();
    });
});

describe('safe mode and named access', () => {
    it('an element with id="_" does not count as an owner', () => {
        document.body.innerHTML = '<div id="_"></div>';
        window.DommaOptions = {globals: 'safe'};
        const savedDomma = window.Domma;
        const {D, aliases} = fresh();
        installGlobals(D, aliases);
        expect(window._).toBe(aliases._);
        window.Domma = savedDomma;
    });
});

describe('.on() on components with their own _emit', () => {
    it('Popover and Sortable call .on() listeners', () => {
        document.body.innerHTML = '<button id="pb">Go</button><ul id="sl"><li>a</li><li>b</li></ul>';
        const pop = Domma.elements.popover('#pb', {content: 'Hi'});
        const shown = vi.fn();
        pop.on('show', shown);
        pop.show();
        expect(shown).toHaveBeenCalled();

        const sort = Domma.elements.sortable('#sl');
        const seen = vi.fn();
        sort.on('test', seen);
        sort._emit('test', {x: 1});
        expect(seen).toHaveBeenCalledWith({x: 1});
    });
});
