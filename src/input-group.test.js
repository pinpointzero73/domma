// src/input-group.test.js
import {afterEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

const E = Domma.elements;
const F = Domma.forms;

describe('Domma.elements.inputGroup', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('wraps an input and joins a prefix and a suffix to it', () => {
        document.body.innerHTML = '<label>Price <input id="p" class="form-input"></label>';
        const g = E.inputGroup('#p', {prefix: '£', suffix: {text: '.00'}});
        const w = document.querySelector('.input-group-icon');
        expect(w).not.toBeNull();
        expect([...w.children].map((c) => c.className)).toEqual([
            'input-group-addon input-group-addon-left', 'form-input', 'input-group-addon input-group-addon-right']);
        expect(w.classList.contains('has-addon-left')).toBe(true);
        expect(w.classList.contains('has-addon-right')).toBe(true);
        expect(w.children[0].textContent).toBe('£');
        expect(g.input.id).toBe('p');
    });

    it('draws an icon, and treats text as text', () => {
        document.body.innerHTML = '<input id="q">';
        E.inputGroup('#q', {prefix: {icon: 'search'}, suffix: '<b>x</b>'});
        const [left, , right] = document.querySelector('.input-group-icon').children;
        expect(left.querySelector('[data-icon="search"], svg')).not.toBeNull();
        expect(right.textContent).toBe('<b>x</b>');
        expect(right.querySelector('b')).toBeNull();
    });

    it('refuses an icon name that is not a plain name', () => {
        document.body.innerHTML = '<input id="q">';
        E.inputGroup('#q', {prefix: {icon: 'x" onmouseover="alert(1)'}});
        expect(document.querySelector('.input-group-addon')).toBeNull();
        expect(document.querySelector('.input-group-icon').classList.contains('has-addon-left')).toBe(false);
    });

    it('update() changes and removes addons', () => {
        document.body.innerHTML = '<input id="q">';
        const g = E.inputGroup('#q', {prefix: 'a'});
        g.update({prefix: null, suffix: 'kg'});
        const w = document.querySelector('.input-group-icon');
        expect(w.querySelectorAll('.input-group-addon').length).toBe(1);
        expect(w.querySelector('.input-group-addon-right').textContent).toBe('kg');
        expect(w.classList.contains('has-addon-left')).toBe(false);
    });

    it('destroy() puts the input back where it was', () => {
        document.body.innerHTML = '<p><input id="q"></p>';
        const g = E.inputGroup('#q', {prefix: 'a'});
        g.destroy();
        expect(document.querySelector('.input-group-icon')).toBeNull();
        expect(document.querySelector('p > #q')).not.toBeNull();
    });

    it('reuses the group Forma already rendered instead of nesting another', () => {
        document.body.innerHTML = '<div class="input-group-icon has-addon-left"><span class="input-group-addon input-group-addon-left">£</span><input id="q"></div>';
        E.inputGroup('#q', {suffix: 'kg'});
        expect(document.querySelectorAll('.input-group-icon').length).toBe(1);
        const w = document.querySelector('.input-group-icon');
        expect(w.querySelector('.input-group-addon-left')).toBeNull();
        expect(w.querySelector('.input-group-addon-right').textContent).toBe('kg');
    });
});

describe('Forma addons on selects and textareas', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('joins addons to a select and a textarea as well as an input', () => {
        document.body.innerHTML = '<div id="f"></div>';
        F.render(document.getElementById('f'), {
            plan: {type: 'select', label: 'Plan', options: ['a', 'b'], formConfig: {prefix: {icon: 'tag'}}},
            note: {type: 'textarea', label: 'Note', formConfig: {suffix: 'max 200'}},
            price: {type: 'number', label: 'Price', formConfig: {prefix: '£'}}
        }, {});
        const group = (name) => document.querySelector(`[name="${name}"]`).closest('.input-group-icon');
        expect(group('plan')?.classList.contains('has-addon-left')).toBe(true);
        expect(group('note')?.querySelector('.input-group-addon-right')?.textContent).toBe('max 200');
        expect(group('price')?.querySelector('.input-group-addon-left')?.textContent).toBe('£');
    });
});

describe('Input extras - E.inputGroup', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    const events = (el) => {
        const seen = [];
        el.addEventListener('input', () => seen.push('input'));
        el.addEventListener('change', () => seen.push('change'));
        return seen;
    };

    it('reveal toggles a password between hidden and shown, with aria-pressed and the eye icon', () => {
        document.body.innerHTML = '<input id="pw" type="password" value="secret">';
        const g = E.inputGroup('#pw', {reveal: true});
        const btn = document.querySelector('.input-group-reveal');
        expect(btn.tagName).toBe('BUTTON');
        expect(btn.type).toBe('button');
        expect(btn.getAttribute('aria-label')).toBe('Show password');
        expect(btn.getAttribute('aria-pressed')).toBe('false');
        expect(btn.getAttribute('aria-controls')).toBe('pw');
        expect(btn.querySelector('[data-icon="eye"]')).not.toBeNull();
        btn.click();
        expect(g.input.type).toBe('text');
        expect(btn.getAttribute('aria-pressed')).toBe('true');
        expect(btn.querySelector('[data-icon="eye-off"]')).not.toBeNull();
        btn.click();
        expect(g.input.type).toBe('password');
        expect(btn.getAttribute('aria-pressed')).toBe('false');
    });

    it('reveal is ignored on an input that is not a password', () => {
        document.body.innerHTML = '<input id="t" type="text">';
        E.inputGroup('#t', {reveal: true});
        expect(document.querySelector('.input-group-reveal')).toBeNull();
    });

    it('clear shows only with a value, empties the field, fires input and change, and refocuses', () => {
        document.body.innerHTML = '<input id="q" type="search">';
        const g = E.inputGroup('#q', {clear: true});
        const btn = document.querySelector('.input-group-clear');
        const w = g.wrapper;
        expect(btn.hidden).toBe(true);
        expect(w.classList.contains('has-addon-right')).toBe(false);

        g.input.value = 'hello';
        g.input.dispatchEvent(new Event('input', {bubbles: true}));
        expect(btn.hidden).toBe(false);
        expect(w.classList.contains('has-addon-right')).toBe(true);

        const seen = events(g.input);
        btn.click();
        expect(g.input.value).toBe('');
        expect(seen).toEqual(['input', 'change']);
        expect(document.activeElement).toBe(g.input);
        expect(btn.hidden).toBe(true);
    });

    it('clear coexists with an icon prefix and a suffix, in that order', () => {
        document.body.innerHTML = '<input id="q" value="x">';
        const g = E.inputGroup('#q', {prefix: {icon: 'search'}, suffix: 'kg', clear: true});
        const [a, b, c, d] = g.wrapper.children;
        expect(a.classList.contains('input-group-addon-left')).toBe(true);
        expect(b).toBe(g.input);
        expect(c.classList.contains('input-group-clear')).toBe(true);
        expect(d.classList.contains('input-group-addon-right')).toBe(true);
        g.update({suffix: null});
        expect(g.wrapper.lastElementChild.classList.contains('input-group-clear')).toBe(true);
    });

    it('stepper steps by step, honours min and max, and disables at the limits', () => {
        document.body.innerHTML = '<input id="n" type="number" min="0" max="1" step="0.25" value="0.5">';
        const g = E.inputGroup('#n', {stepper: true});
        const dec = document.querySelector('.input-group-decrease');
        const inc = document.querySelector('.input-group-increase');
        expect(g.input.previousElementSibling).toBe(dec);
        expect(g.input.nextElementSibling).toBe(inc);
        expect(dec.getAttribute('aria-label')).toBe('Decrease');

        const seen = events(g.input);
        inc.click();
        expect(g.input.value).toBe('0.75');
        expect(seen).toEqual(['input', 'change']);
        inc.click();
        expect(g.input.value).toBe('1');
        expect(inc.disabled).toBe(true);
        expect(dec.disabled).toBe(false);
        inc.click();
        expect(g.input.value).toBe('1');

        for (let i = 0; i < 6; i++) dec.click();
        expect(g.input.value).toBe('0');
        expect(dec.disabled).toBe(true);
    });

    it('stepper snaps an off-step value and starts an empty field from 0', () => {
        document.body.innerHTML = '<input id="n" type="number" step="2">';
        const g = E.inputGroup('#n', {stepper: true});
        g.step(1);
        expect(g.input.value).toBe('2');
        g.input.value = '3';
        g.step(1);
        expect(g.input.value).toBe('4');
        g.input.value = '3';
        g.step(-1);
        expect(g.input.value).toBe('2');
    });

    it('stepper repeats while held and stops on release', () => {
        vi.useFakeTimers();
        try {
            document.body.innerHTML = '<input id="n" type="number" value="0" max="100">';
            const g = E.inputGroup('#n', {stepper: true});
            const inc = document.querySelector('.input-group-increase');
            const down = new Event('pointerdown', {bubbles: true});
            down.button = 0;
            inc.dispatchEvent(down);
            expect(g.input.value).toBe('1');
            vi.advanceTimersByTime(400 + 70 * 3);
            expect(Number(g.input.value)).toBe(4);
            inc.dispatchEvent(new Event('pointerup'));
            vi.advanceTimersByTime(1000);
            expect(Number(g.input.value)).toBe(4);
        } finally {
            vi.useRealTimers();
        }
    });

    it('counter shows count / maxLength live, is a polite live region and warns near the limit', () => {
        document.body.innerHTML = '<textarea id="t" maxlength="10" aria-describedby="hint"></textarea>';
        const g = E.inputGroup('#t', {counter: true});
        const c = document.querySelector('.form-counter');
        expect(c.textContent).toBe('0 / 10');
        expect(c.getAttribute('aria-live')).toBe('polite');
        expect(g.input.getAttribute('aria-describedby')).toBe(`hint ${c.id}`);
        expect(c.previousElementSibling).toBe(g.wrapper);

        g.input.value = 'abcdefghi';
        g.input.dispatchEvent(new Event('input'));
        expect(c.textContent).toBe('9 / 10');
        expect(c.classList.contains('is-warning')).toBe(true);
    });

    it('counter takes an explicit limit and marks going over it', () => {
        document.body.innerHTML = '<input id="t" value="abcdef">';
        const g = E.inputGroup('#t', {counter: 5});
        const c = document.querySelector('.form-counter');
        expect(c.textContent).toBe('6 / 5');
        expect(c.classList.contains('is-over')).toBe(true);
        g.input.value = 'ab';
        g.refresh();
        expect(c.textContent).toBe('2 / 5');
        expect(c.classList.contains('is-over')).toBe(false);
    });

    it('destroy() removes the extras, restores the input and stops listening', () => {
        document.body.innerHTML = '<p><input id="pw" type="password" value="a" aria-describedby="x"></p>';
        const g = E.inputGroup('#pw', {reveal: true, clear: true, counter: 20});
        const input = g.input;
        document.querySelector('.input-group-reveal').click();
        const counter = document.querySelector('.form-counter');
        g.destroy();
        expect(document.querySelector('.input-group-btn, .form-counter, .input-group-icon')).toBeNull();
        expect(input.type).toBe('password');
        expect(input.getAttribute('aria-describedby')).toBe('x');
        expect(document.querySelector('p > #pw')).toBe(input);
        input.value = 'abc';
        input.dispatchEvent(new Event('input'));
        expect(counter.textContent).toBe('1 / 20');
    });

    it('update() adds and removes extras without touching the addons', () => {
        document.body.innerHTML = '<input id="q" value="x">';
        const g = E.inputGroup('#q', {prefix: '@'});
        g.update({clear: true});
        expect(document.querySelector('.input-group-clear')).not.toBeNull();
        expect(document.querySelector('.input-group-addon-left').textContent).toBe('@');
        g.update({clear: false});
        expect(document.querySelector('.input-group-clear')).toBeNull();
    });

    it('keeps the addons Forma rendered when only extras are asked for', () => {
        document.body.innerHTML = '<div class="input-group-icon has-addon-left"><span class="input-group-addon input-group-addon-left"><kbd>K</kbd></span><input id="q" value="v"></div>';
        const g = E.inputGroup('#q', {clear: true});
        expect(document.querySelector('.input-group-addon-left kbd')).not.toBeNull();
        g.destroy();
        expect(document.querySelector('.input-group-addon-left kbd')).not.toBeNull();
        expect(document.querySelector('.input-group-icon.has-addon-left')).not.toBeNull();
    });
});

describe('Input extras - Forma formConfig', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    const schema = () => ({
        password: {type: 'password', label: 'Password', formConfig: {reveal: true, prefix: {icon: 'lock'}}},
        search: {type: 'string', label: 'Search', formConfig: {clear: true, prefix: {icon: 'search'}}},
        qty: {type: 'integer', label: 'Qty', min: 1, max: 3, formConfig: {stepper: true, suffix: 'items'}},
        bio: {type: 'textarea', label: 'Bio', maxLength: 50, formConfig: {counter: true}},
        plan: {type: 'select', label: 'Plan', options: ['a'], formConfig: {clear: true, counter: true}}
    });

    it('joins each extra to the applicable field type after render', () => {
        document.body.innerHTML = '<div id="f"></div>';
        F.render(document.getElementById('f'), schema(), {qty: 1});
        const at = (name, sel) => document.querySelector(`[name="${name}"]`).closest('.domma-form-field').querySelector(sel);
        expect(at('password', '.input-group-reveal')).not.toBeNull();
        expect(at('password', '.input-group-addon-left')).not.toBeNull();
        expect(at('search', '.input-group-clear')).not.toBeNull();
        expect(at('qty', '.input-group-decrease').disabled).toBe(true);
        expect(at('qty', '.input-group-addon-right').textContent).toBe('items');
        expect(at('bio', '.form-counter').textContent).toBe('0 / 50');
        expect(at('plan', '.input-group-btn, .form-counter')).toBeNull();
        expect(document.querySelectorAll('.input-group-icon').length).toBe(4);
    });

    it('clear and stepper update the form model through input and change', () => {
        document.body.innerHTML = '<div id="f"></div>';
        const form = F.create(schema(), {qty: 1, search: 'abc'});
        form.renderTo('#f');
        document.querySelector('[name="qty"]').closest('.input-group-icon').querySelector('.input-group-increase').click();
        expect(form.getData().qty).toBe(2);
        document.querySelector('.input-group-clear').click();
        expect(form.getData().search).toBe('');
    });

    it('destroy() and a re-render tear the extras down', () => {
        document.body.innerHTML = '<div id="f"></div>';
        const form = F.create(schema(), {});
        form.renderTo('#f');
        const groups = Object.values(form._inputGroups);
        expect(groups.length).toBe(4);
        form.renderTo('#f');
        expect(groups.every((g) => g.wrapper === null)).toBe(true);
        form.destroy();
        expect(document.querySelector('.input-group-btn, .form-counter')).toBeNull();
    });
});
