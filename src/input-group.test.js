// src/input-group.test.js
import {afterEach, describe, expect, it} from 'vitest';
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
