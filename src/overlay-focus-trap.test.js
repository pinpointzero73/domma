// src/overlay-focus-trap.test.js - the focus trap wired into modal, slideover, dialog and popover
import {afterEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

const E = Domma.elements;
const made = [];
const keep = (x) => { made.push(x); return x; };

afterEach(() => {
    while (made.length) {
        try { made.pop()?.destroy(); } catch { /* gone */ }
    }
    document.body.innerHTML = '';
});

/** The focused element through open shadow roots. */
function active() {
    let a = document.activeElement;
    while (a && a.shadowRoot && a.shadowRoot.activeElement) a = a.shadowRoot.activeElement;
    return a;
}

/** A Tab key press as the browser sends it: composed, so it leaves a shadow root. */
function tab(shift = false, target = active()) {
    const e = new KeyboardEvent('keydown', {key: 'Tab', shiftKey: shift, bubbles: true, cancelable: true, composed: true});
    (target || document.body).dispatchEvent(e);
    return e;
}

const label = (el) => el?.id || el?.dataset?.buttonId || el?.className || el?.tagName;

function modal(inner, options = {}) {
    const el = document.createElement('div');
    el.innerHTML = inner;
    document.body.appendChild(el);
    return keep(E.modal(el, {animation: false, ...options}));
}

function slideover(inner, options = {}) {
    const el = document.createElement('div');
    el.innerHTML = `<div class="dm-slideover-header"><button class="dm-slideover-close" id="so-x">x</button></div>
        <div class="dm-slideover-body">${inner}</div>`;
    document.body.appendChild(el);
    return keep(E.slideover(el, {animation: false, animationDuration: 0, ...options}));
}

describe('modal', () => {
    it('Tab cycles the shadow chrome and the slotted content in the order they show', () => {
        document.body.insertAdjacentHTML('beforeend', '<button id="opener">open</button>');
        const opener = document.getElementById('opener');
        opener.focus();
        const m = modal('<button id="a">a</button><input id="b">', {
            title: 'T', buttons: [{id: 'cancel', text: 'Cancel'}, {id: 'ok', text: 'OK'}]
        });
        m.open();
        // open() focuses the dialog frame; Tab carries on from there in rendering order.
        expect(active().classList.contains('modal-dialog')).toBe(true);
        const seen = [];
        for (let i = 0; i < 6; i++) {
            tab();
            seen.push(label(active()));
        }
        expect(seen).toEqual(['modal-close', 'a', 'b', 'cancel', 'ok', 'modal-close']);
        tab(true);
        expect(label(active())).toBe('ok');
        m.close();
        expect(document.activeElement).toBe(opener);
    });

    it('keeps E.get(el) on the modal, and trapFocus: false / returnFocus: false opt out', () => {
        document.body.insertAdjacentHTML('beforeend', '<button id="opener">open</button>');
        const opener = document.getElementById('opener');
        const m = modal('<button id="a">a</button>', {trapFocus: false});
        expect(E.get(m.element)).toBe(m);
        opener.focus();
        m.open();
        expect(E.focusTrap.top()).toBeNull();
        m.close();

        const m2 = modal('<button id="b">b</button>', {returnFocus: false});
        opener.focus();
        m2.open();
        expect(E.focusTrap.top()).not.toBeNull();
        expect(E.get(m2.element)).toBe(m2);
        document.getElementById('b').focus();
        m2.close();
        expect(document.activeElement).not.toBe(opener);
        expect(E.focusTrap.top()).toBeNull();
    });

    it('a modal without a backdrop is not trapped unless trapFocus is given', () => {
        const m = modal('<button>a</button>', {backdrop: false});
        m.open();
        expect(E.focusTrap.top()).toBeNull();
        m.close();
        const m2 = modal('<button>a</button>', {backdrop: false, trapFocus: true});
        m2.open();
        expect(E.focusTrap.top()).not.toBeNull();
        m2.close();
    });

    it('destroy() takes the trap off', () => {
        const m = modal('<button>a</button>');
        m.open();
        expect(E.focusTrap.top()).not.toBeNull();
        m.destroy();
        expect(E.focusTrap.top()).toBeNull();
    });

    it('a close() a caller replaced still runs from the X and Escape', () => {
        const m = modal('<button>a</button>', {title: 'T'});
        const patched = vi.fn(function () { return Object.getPrototypeOf(this).close.call(this); });
        m.close = patched;
        m.open();
        m._host.shadowRoot.querySelector('.modal-close').click();
        expect(patched).toHaveBeenCalledTimes(1);
        m.open();
        document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
        expect(patched).toHaveBeenCalledTimes(2);
        expect(E.focusTrap.top()).toBeNull();
    });
});

describe('slideover', () => {
    it('moves focus to the panel, cycles Tab inside and puts focus back on close', () => {
        document.body.insertAdjacentHTML('beforeend', '<button id="opener">open</button>');
        const opener = document.getElementById('opener');
        opener.focus();
        const so = slideover('<input id="f1"><button id="f2">save</button>');
        so.open();
        expect(document.activeElement).toBe(so.element);
        tab();
        expect(active().id).toBe('so-x');
        tab(); tab(); tab();
        expect(active().id).toBe('so-x');
        so.close();
        expect(document.activeElement).toBe(opener);
        expect(so.element.getAttribute('tabindex')).toBe('-1');
        so.destroy();
        expect(so.element.hasAttribute('tabindex')).toBe(false);
    });

    it('a field the caller focuses after open() keeps focus', () => {
        const so = slideover('<input id="f1"><input id="f2">');
        so.open();
        document.getElementById('f2').focus();
        expect(active().id).toBe('f2');
        tab();
        expect(active().id).toBe('so-x');
    });

    it('a textarea that indents on Tab keeps the key', () => {
        const so = slideover('<textarea id="code"></textarea><button id="b">b</button>');
        so.open();
        const ta = document.getElementById('code');
        ta.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            e.preventDefault();
            ta.value += '  ';
        });
        ta.focus();
        tab();
        expect(document.activeElement).toBe(ta);
        expect(ta.value).toBe('  ');
    });

    it('trapFocus: false opts out', () => {
        const so = slideover('<button>b</button>', {trapFocus: false});
        so.open();
        expect(E.focusTrap.top()).toBeNull();
    });
});

describe('stacking', () => {
    it('slideover > modal > confirm: each close hands focus back to the layer below', async () => {
        document.body.insertAdjacentHTML('beforeend', '<button id="page">page</button>');
        document.getElementById('page').focus();
        const so = slideover('<button id="open-modal">modal</button><button id="so-other">other</button>');
        so.open();
        const soTrap = E.focusTrap.top();
        document.getElementById('open-modal').focus();

        const m = modal('<button id="ask">ask</button><button id="m-other">other</button>');
        m.open();
        const mTrap = E.focusTrap.top();
        expect(soTrap.isPaused()).toBe(true);
        document.getElementById('ask').focus();

        const answer = E.confirm('Sure?', {animation: false});
        expect(mTrap.isPaused()).toBe(true);
        const dialog = document.querySelector('.dm-dialog');
        dialog.querySelector('.dm-dialog-cancel').focus();
        tab();
        expect(document.activeElement.classList.contains('dm-dialog-confirm')).toBe(true);
        tab();
        expect(document.activeElement.classList.contains('dm-dialog-cancel')).toBe(true);
        dialog.querySelector('.dm-dialog-cancel').click();
        expect(await answer).toBe(false);
        expect(document.activeElement.id).toBe('ask');
        expect(E.focusTrap.top()).toBe(mTrap);
        expect(mTrap.isPaused()).toBe(false);
        tab();
        expect(active().id).toBe('m-other');

        m.close();
        expect(document.activeElement.id).toBe('open-modal');
        expect(E.focusTrap.top()).toBe(soTrap);
        tab();
        expect(active().id).toBe('so-other');

        so.close();
        expect(document.activeElement.id).toBe('page');
        expect(E.focusTrap.top()).toBeNull();
    });

    it('a slideover closed beneath a confirm hands the confirm its own return target', async () => {
        document.body.insertAdjacentHTML('beforeend', '<button id="page">page</button>');
        document.getElementById('page').focus();
        const so = slideover('<button id="del">delete</button>');
        so.open();
        document.getElementById('del').focus();
        const answer = E.confirm('Close it?', {animation: false});
        so.close();
        document.querySelector('button.dm-dialog-confirm').click();
        expect(await answer).toBe(true);
        expect(document.activeElement.id).toBe('page');
    });

    it('a slideover from a slideover', () => {
        document.body.insertAdjacentHTML('beforeend', '<button id="page">page</button>');
        const a = slideover('<button id="a1">a1</button>');
        a.open();
        document.getElementById('a1').focus();
        const bEl = document.createElement('div');
        bEl.innerHTML = '<button id="b1">b1</button>';
        document.body.appendChild(bEl);
        const b = keep(E.slideover(bEl, {animation: false, animationDuration: 0}));
        b.open();
        expect(document.activeElement).toBe(bEl);
        b.close();
        expect(document.activeElement.id).toBe('a1');
    });

    it('a trap whose overlay was removed from the page lets go', () => {
        document.body.insertAdjacentHTML('beforeend', '<button id="page">page</button>');
        const so = slideover('<button>b</button>');
        so.open();
        so.element.remove();
        const page = document.getElementById('page');
        page.focus();
        const e = tab(false, page);
        expect(document.activeElement).toBe(page);
        expect(e.defaultPrevented).toBe(false);
        expect(E.focusTrap.top()).toBeNull();
    });
});

describe('floating layers over a trapped overlay', () => {
    it('a toast action button can take focus and be clicked', () => {
        const so = slideover('<button id="b">b</button>');
        so.open();
        const onClick = vi.fn();
        E.toast('Saved', {duration: 0, actions: [{label: 'Undo', onClick}]});
        const undo = Array.from(document.querySelectorAll('.domma-toast-container button'))
            .find(b => b.textContent.includes('Undo'));
        expect(undo).toBeTruthy();
        undo.focus();
        expect(document.activeElement).toBe(undo);
        undo.click();
        expect(onClick).toHaveBeenCalled();
    });

    it('the page behind and an overlay beneath stay out of reach', () => {
        document.body.insertAdjacentHTML('beforeend', '<button id="page">page</button>');
        const so = slideover('<button id="so-b">b</button>');
        so.open();
        document.getElementById('so-b').focus();
        const m = modal('<button id="m-b">m</button>');
        m.open();
        document.getElementById('m-b').focus();
        document.getElementById('page').focus();
        expect(document.activeElement.id).toBe('m-b');
        document.getElementById('so-b').focus();
        expect(document.activeElement.id).toBe('m-b');
    });

    it('a popover opened from a slideover keeps focus, and Tab leaves it for the next control in the slideover', () => {
        const so = slideover('<button id="trigger">info</button><button id="next">next</button>');
        so.open();
        const trigger = document.getElementById('trigger');
        const content = document.createElement('div');
        content.innerHTML = '<input id="p1"><button id="p2">ok</button>';
        const p = keep(E.popover(trigger, {content, animation: false}));
        trigger.focus();
        trigger.click();
        expect(p.isOpen()).toBe(true);
        expect(document.activeElement.id).toBe('p1');
        tab();
        expect(document.activeElement.id).toBe('p2');
        tab();
        expect(p.isOpen()).toBe(false);
        expect(document.activeElement.id).toBe('next');
        // Tab from the last control wraps within the slideover, never to the page.
        tab();
        expect(active().id).toBe('so-x');
    });

    it('the next stop after a popover trigger that is last in the slideover wraps round the trap', () => {
        document.body.insertAdjacentHTML('beforeend', '<button id="page">page</button>');
        const so = slideover('<button id="trigger">info</button>');
        so.open();
        const trigger = document.getElementById('trigger');
        const content = document.createElement('div');
        content.innerHTML = '<button id="p1">ok</button>';
        const p = keep(E.popover(trigger, {content, animation: false}));
        trigger.focus();
        trigger.click();
        tab();
        expect(p.isOpen()).toBe(false);
        expect(document.activeElement.id).toBe('so-x');
    });

    it('a trapFocus popover in a slideover cycles in its panel, then gives Tab back to the slideover', () => {
        const so = slideover('<button id="trigger">info</button><button id="next">next</button>');
        so.open();
        const soTrap = E.focusTrap.top();
        const trigger = document.getElementById('trigger');
        const content = document.createElement('div');
        content.innerHTML = '<button id="p1">1</button><button id="p2">2</button>';
        const p = keep(E.popover(trigger, {content, animation: false, trapFocus: true}));
        trigger.focus();
        trigger.click();
        expect(soTrap.isPaused()).toBe(true);
        tab(); tab();
        expect(document.activeElement.id).toBe('p1');
        p.hide({returnFocus: true});
        expect(soTrap.isPaused()).toBe(false);
        expect(document.activeElement).toBe(trigger);
        tab();
        expect(active().id).toBe('next');
    });
});

describe('dialog', () => {
    it('keeps Tab in the dialog and returns focus once answered', async () => {
        document.body.insertAdjacentHTML('beforeend', '<button id="page">page</button>');
        const page = document.getElementById('page');
        page.focus();
        const answer = E.prompt('Name?', {animation: false});
        const input = document.querySelector('.dm-dialog-input');
        input.focus();
        tab();
        expect(document.activeElement.classList.contains('dm-dialog-cancel')).toBe(true);
        tab(); tab();
        expect(document.activeElement).toBe(input);
        tab(true);
        expect(document.activeElement.classList.contains('dm-dialog-confirm')).toBe(true);
        document.querySelector('.dm-dialog-cancel').click();
        expect(await answer).toBe(null);
        expect(document.activeElement).toBe(page);
    });

    it('trapFocus: false and returnFocus: false', async () => {
        document.body.insertAdjacentHTML('beforeend', '<button id="page">page</button>');
        const page = document.getElementById('page');
        page.focus();
        const a = E.alert('Hi', {animation: false, trapFocus: false});
        expect(E.focusTrap.top()).toBeNull();
        document.querySelector('button.dm-dialog-confirm').click();
        await a;

        page.focus();
        const b = E.alert('Hi', {animation: false, returnFocus: false});
        expect(E.focusTrap.top()).not.toBeNull();
        document.querySelector('button.dm-dialog-confirm').focus();
        document.querySelector('button.dm-dialog-confirm').click();
        await b;
        expect(document.activeElement).not.toBe(page);
        expect(E.focusTrap.top()).toBeNull();
    });
});
