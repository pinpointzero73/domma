/**
 * Column titles and option labels are text. They often come from stored data
 * (a collection's field labels, another record's title), so markup in them
 * must be shown, never built.
 */
import {beforeEach, describe, expect, it} from 'vitest';
import Domma from './index.js';

const F = Domma.forms;
const EVIL = '"><img src=x onerror="window.__hit=1"><iframe srcdoc="x"></iframe>';

let host;

beforeEach(() => {
    document.body.replaceChildren();
    host = document.createElement('div');
    host.id = 'host';
    document.body.appendChild(host);
});

describe('a sortable column title', () => {
    it('is written as text, with the sort arrow beside it', () => {
        Domma.tables.create('#host', {
            data: [{a: 1}],
            columns: [{key: 'a', title: EVIL, sortable: true}, {key: 'b', title: 'Plain <b>', sortable: true}]
        });
        const ths = [...host.querySelectorAll('th')];
        expect(host.querySelector('th img, th iframe, th b')).toBeNull();
        expect(ths[0].textContent).toContain(EVIL);
        expect(ths[1].textContent).toContain('Plain <b>');
        const arrow = ths[0].querySelector('span[aria-hidden="true"]');
        expect(arrow.textContent).toBe('⇅');
        expect(ths[0].getAttribute('aria-sort')).toBe('none');
    });

    it('still sorts on a click and shows the direction', () => {
        const table = Domma.tables.create('#host', {
            data: [{a: 2}, {a: 1}],
            columns: [{key: 'a', title: 'A & B', sortable: true}]
        });
        host.querySelector('th').click();
        const th = host.querySelector('th');
        expect(th.textContent).toContain('A & B');
        expect(['▲', '▼']).toContain(th.querySelector('span').textContent);
        expect(table).toBeTruthy();
    });
});

describe('option values and labels', () => {
    const options = [{value: EVIL, label: EVIL}, {value: 'ok', label: 'Fish & <chips>'}, 'it"s'];

    for (const type of ['select', 'multiselect', 'radio', 'checkbox-group']) {
        it(`${type}: markup in an option is shown, not built`, () => {
            F.render(host, {pick: {type, label: 'Pick', options}}, {}, {});
            expect(host.querySelector('img, iframe, chips')).toBeNull();
            expect(host.querySelectorAll('[onerror]').length).toBe(0);
            const controls = type === 'select' || type === 'multiselect'
                ? [...host.querySelectorAll('select option')].filter(o => o.value !== '')
                : [...host.querySelectorAll('input[type="radio"], input[type="checkbox"]')];
            expect(controls.map(c => c.value)).toEqual([EVIL, 'ok', 'it"s']);
            expect(host.textContent).toContain(EVIL);
            expect(host.textContent).toContain('Fish & <chips>');
        });
    }

    it('keeps a stored value chosen when it holds quotes', () => {
        F.render(host, {pick: {type: 'radio', label: 'Pick', options}}, {pick: 'it"s'}, {});
        expect(host.querySelector('input:checked').value).toBe('it"s');
    });
});

describe('attribute values', () => {
    const BRK = '" autofocus onfocus="window.__hit=1" x="';

    it('a placeholder, pattern or accept cannot add an attribute', () => {
        F.render(host, {
            a: {type: 'string', pattern: BRK, formConfig: {placeholder: BRK, autocomplete: BRK}},
            t: {type: 'textarea', formConfig: {placeholder: BRK}},
            s: {type: 'select', options: ['x'], formConfig: {placeholder: BRK}},
            f: {type: 'file', formConfig: {accept: BRK}}
        }, {}, {});
        expect(host.querySelectorAll('[onfocus], [autofocus]').length).toBe(0);
        expect(host.querySelector('input[name="a"]').getAttribute('placeholder')).toBe(BRK);
        expect(host.querySelector('input[name="a"]').getAttribute('pattern')).toBe(BRK);
        expect(host.querySelector('input[type="file"]').getAttribute('accept')).toBe(BRK);
    });

    it('a field name cannot add an attribute', () => {
        const name = 'n" onclick="window.__hit=1';
        F.render(host, {[name]: {type: 'radio', options: ['a']}, [name + '2']: {type: 'string'}}, {}, {});
        expect(host.querySelectorAll('[onclick]').length).toBe(0);
        expect(host.querySelector('[data-field]').getAttribute('data-field')).toBe(name);
        expect(host.querySelector('input[type="radio"]').name).toBe(name);
    });

    it('input extras still read their recipe', () => {
        F.render(host, {p: {type: 'password', formConfig: {reveal: true}}}, {}, {});
        expect(JSON.parse(host.querySelector('[data-input-extras]').getAttribute('data-input-extras'))).toMatchObject({reveal: true});
    });

    it('a chooser option may hold the text &quot;', () => {
        F.render(host, {c: {type: 'chooser', options: [{value: 'a', label: 'say &quot;hi&quot; "now"'}]}}, {}, {});
        expect(host.querySelectorAll('[onclick], img').length).toBe(0);
        expect(host.textContent).toContain('say &quot;hi&quot; "now"');
    });
});

describe('odd option lists', () => {
    for (const type of ['select', 'radio', 'checkbox-group']) {
        it(`${type}: skips an empty entry and shows the value when there is no label`, () => {
            F.render(host, {pick: {type, label: 'Pick', options: [null, {value: 'v1'}, 5]}}, {}, {});
            expect(host.textContent).toContain('v1');
            expect(host.textContent).not.toContain('undefined');
        });
    }
});

describe('CSV header', () => {
    it('doubles a quote in a column title', () => {
        const table = Domma.tables.create('#host', {data: [{a: 1}], columns: [{key: 'a', title: 'He said "hi", ok'}]});
        expect(table.toCSV().split('\n')[0]).toBe('"He said ""hi"", ok"');
    });
});

describe('a field name with a quote, backslash or line break in it', () => {
    for (const name of ['say "hi"', 'back\\slash', 'two\nlines', 'a"] , [x="']) {
        it(`${JSON.stringify(name)}: reads, validates and shows its error`, () => {
            const form = F.create({
                [name]: {type: 'string', label: 'Text', required: true},
                [name + ' r']: {type: 'radio', label: 'R', options: ['a', 'b']},
                [name + ' c']: {type: 'checkbox-group', label: 'C', options: ['a', 'b']}
            }, {}, {});
            form.renderTo(host);
            host.querySelectorAll('input[type="radio"], input[type="checkbox"]')[1].checked = true;
            host.querySelectorAll('input[type="checkbox"]')[0].checked = true;
            expect(() => form.validate()).not.toThrow();
            expect(() => form.setFieldError(name, 'Needed')).not.toThrow();
            const error = [...host.querySelectorAll('[data-error-for]')].find(e => e.getAttribute('data-error-for') === name);
            expect(error.textContent).toBe('Needed');
            form.clearFieldError(name);
            expect(error.textContent).toBe('');
            const radio = host.querySelector('input[type="radio"]');
            expect(form._getFieldValue(radio)).toBe('b');
            expect(form._getFieldValue(host.querySelector('input[type="checkbox"]'))).toEqual(['a']);
        });
    }
});
