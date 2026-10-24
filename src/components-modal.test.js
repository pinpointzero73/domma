// src/components-modal.test.js - E.modal: one implementation, both modes
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';
import {instanceOf} from './component.js';

const E = Domma.elements;

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
});

function selectorModal(options = {}) {
    document.body.insertAdjacentHTML('beforeend',
        '<div id="m" class="modal"><div class="modal-header"><h5 class="modal-title">Hi</h5>' +
        '<button class="modal-close">&times;</button></div><div class="modal-body">Body</div></div>');
    return E.modal('#m', {animation: false, ...options});
}

describe('E.modal - shadow root and slotting', () => {
    it('factory mode: appendChild puts content in the body slot, the chrome is in the shadow root', () => {
        const modal = E.modal({title: 'Versions', buttons: [{id: 'close', text: 'Close'}]});
        const panel = document.createElement('div');
        panel.className = 'panel';
        modal.element.appendChild(panel);

        const root = modal.element.shadowRoot;
        expect(root).not.toBeNull();
        expect(root.querySelector('.modal-dialog')).not.toBeNull();
        expect(root.querySelector('.modal-title').textContent).toBe('Versions');
        const slot = root.querySelector('.modal-body slot:not([name])');
        expect(slot.assignedElements()).toContain(panel);
        expect(root.querySelector('[data-button-id="close"]')).not.toBeNull();
    });

    it('selector mode: the shadow root is on the caller\'s own element, its markup slotted in', () => {
        const modal = selectorModal();
        const el = document.getElementById('m');
        expect(modal.element).toBe(el);
        expect(el.shadowRoot.querySelector('.modal-body slot').assignedElements().map(n => n.className))
            .toEqual(['modal-header', 'modal-body']);
        // The markup has its own header and X: no second X in the shadow root.
        expect(el.shadowRoot.querySelector('.modal-close')).toBeNull();
    });

    it('a tag that cannot take a shadow root gets an inner host', () => {
        document.body.insertAdjacentHTML('beforeend', '<dialog id="d"><p>Inside</p></dialog>');
        const el = document.getElementById('d');
        const modal = E.modal(el, {animation: false});
        expect(modal.element).toBe(el);
        const inner = el.querySelector(':scope > .dm-modal-inner');
        expect(inner.shadowRoot.querySelector('.modal-dialog')).not.toBeNull();
        expect(inner.querySelector('p').textContent).toBe('Inside');
    });

    it('style.zIndex and shadowRoot .modal-dialog stay reachable (docs-pro pdf-annotate)', () => {
        const modal = E.modal({title: 'Pages'});
        modal.open();
        modal.element.style.zIndex = '10000';
        expect(modal.element.parentElement.classList.contains('dm-dialog-container')).toBe(true);
        const dialog = modal.element.shadowRoot?.querySelector('.modal-dialog');
        dialog.style.maxWidth = 'min(1140px, 96vw)';
        expect(dialog.style.maxWidth).toBe('min(1140px, 96vw)');
    });
});

describe('E.modal - events', () => {
    it('open and close fire exactly once per open / close, including via the X', async () => {
        const modal = E.modal({title: 'T', animation: false});
        const opens = vi.fn();
        const closes = vi.fn();
        modal.on('open', opens);
        modal.on('close', closes);

        modal.open();
        modal.open();
        modal.element.shadowRoot.querySelector('.modal-close').click();
        await vi.runAllTimersAsync();
        modal.close();
        expect(opens).toHaveBeenCalledTimes(1);
        expect(closes).toHaveBeenCalledTimes(1);

        modal.open();
        modal.close();
        expect(opens).toHaveBeenCalledTimes(2);
        expect(closes).toHaveBeenCalledTimes(2);
    });

    it('no unprefixed open / close DOM events (removed in 0.58)', () => {
        const modal = E.modal({title: 'T', animation: false});
        const plain = vi.fn();
        const prefixed = vi.fn();
        modal.element.addEventListener('open', plain);
        modal.element.addEventListener('close', plain);
        modal.element.addEventListener('dm:modal:close', prefixed);
        modal.open();
        modal.close();
        expect(plain).not.toHaveBeenCalled();
        expect(prefixed).toHaveBeenCalledTimes(1);
    });

    it('a nested modal closing does not count as this one closing', () => {
        const outer = E.modal({title: 'Outer', animation: false});
        const inner = E.modal({title: 'Inner', animation: false});
        const closes = vi.fn();
        outer.on('close', closes);
        outer.open();
        inner.open();
        inner.close();
        expect(closes).not.toHaveBeenCalled();
        outer.close();
        expect(closes).toHaveBeenCalledTimes(1);
    });

    it('dm:modal:* events and onX options fire with the instance; onOpened / onClosed after the animation', async () => {
        const seen = [];
        const modal = E.modal({
            title: 'T',
            animationDuration: 200,
            onOpen: () => seen.push('onOpen'),
            onOpened: (m) => seen.push(m === modal ? 'onOpened' : 'wrong'),
            onClose: () => seen.push('onClose'),
            onClosed: () => seen.push('onClosed')
        });
        for (const name of ['beforeopen', 'open', 'opened', 'beforeclose', 'close', 'closed']) {
            modal.element.addEventListener(`dm:modal:${name}`, (e) => {
                expect(e.detail.instance).toBe(modal);
                seen.push(`dm:${name}`);
            });
        }
        modal.on('open', () => seen.push('on(open)'));

        modal.open();
        await vi.advanceTimersByTimeAsync(250);
        modal.close();
        await vi.advanceTimersByTimeAsync(250);

        expect(seen).toEqual([
            'dm:beforeopen', 'onOpen', 'on(open)', 'dm:open', 'onOpened', 'dm:opened',
            'dm:beforeclose', 'onClose', 'dm:close', 'onClosed', 'dm:closed'
        ]);
    });

    it('beforeclose cancels by option, .on() or preventDefault', () => {
        const modal = E.modal({title: 'T', animation: false, onBeforeClose: () => false});
        modal.open();
        modal.close();
        expect(modal.isOpen()).toBe(true);

        modal.setOptions({onBeforeClose: null});
        modal.on('beforeclose', () => false);
        modal.close();
        expect(modal.isOpen()).toBe(true);

        modal.off('beforeclose');
        modal.element.addEventListener('dm:modal:beforeclose', e => e.preventDefault(), {once: true});
        modal.close();
        expect(modal.isOpen()).toBe(true);

        modal.close();
        expect(modal.isOpen()).toBe(false);
    });

    it('beforeopen cancels', () => {
        const modal = E.modal({title: 'T', onBeforeOpen: () => false});
        modal.open();
        expect(modal.isOpen()).toBe(false);
    });

    it('X, backdrop, Escape and footer buttons call close() by name, so a replaced close() is honoured', () => {
        const modal = E.modal({title: 'T', animation: false, buttons: [{id: 'ok', text: 'OK'}]});
        const calls = [];
        const original = modal.close.bind(modal);
        modal.close = (...args) => { calls.push('patched'); return original(...args); };
        const root = modal.element.shadowRoot;

        modal.open();
        root.querySelector('.modal-close').click();
        modal.open();
        const backdrop = root.querySelector('.modal-backdrop');
        backdrop.dispatchEvent(new MouseEvent('pointerdown', {bubbles: true, composed: true}));
        backdrop.dispatchEvent(new MouseEvent('click', {bubbles: true, composed: true}));
        modal.open();
        document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
        modal.open();
        root.querySelector('[data-button-id="ok"]').click();

        expect(calls).toEqual(['patched', 'patched', 'patched', 'patched']);
        expect(modal.isOpen()).toBe(false);
    });

    it('a close control in the caller\'s markup closes it; hide()/show() delegate by name', () => {
        const modal = selectorModal();
        modal.show();
        expect(modal.isOpen()).toBe(true);
        document.querySelector('#m .modal-close').click();
        expect(modal.isOpen()).toBe(false);

        let opened = 0;
        modal.open = function patched() { opened++; return this; };
        modal.show();
        expect(opened).toBe(1);
    });

    it('Escape closes only the top modal', () => {
        const a = E.modal({title: 'A', animation: false});
        const b = E.modal({title: 'B', animation: false});
        a.open();
        b.open();
        document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
        expect(b.isOpen()).toBe(false);
        expect(a.isOpen()).toBe(true);
    });
});

describe('E.modal - factory options and helpers', () => {
    it('headerClass, bodyClass, footerClass and className reach the chrome', () => {
        const modal = E.modal({title: 'T', headerClass: 'h-x', bodyClass: 'b-x', footerClass: 'f-x', className: 'd-x'});
        const root = modal.element.shadowRoot;
        expect(root.querySelector('.modal-header').classList.contains('h-x')).toBe(true);
        expect(root.querySelector('.modal-body').classList.contains('b-x')).toBe(true);
        expect(root.querySelector('.modal-footer').classList.contains('f-x')).toBe(true);
        expect(root.querySelector('.modal-dialog').classList.contains('d-x')).toBe(true);
    });

    it('content is sanitised like $().html(); safe: false keeps trusted markup', () => {
        const modal = E.modal({content: '<p>ok</p><img src="x" onerror="alert(1)">'});
        expect(modal.element.querySelector('p').textContent).toBe('ok');
        expect(modal.element.querySelector('img').hasAttribute('onerror')).toBe(false);
    });

    it('options are a real object; E.get finds the factory modal', () => {
        const modal = E.modal({title: 'T'});
        expect(modal.options.title).toBe('T');
        expect(E.get(modal.element)).toBe(modal);
        expect(E.get(modal.element, 'modal')).toBe(modal);
    });

    it('showModal resolves with the button id, and with null when closed another way', async () => {
        const p1 = E.showModal({title: 'Q', buttons: [{id: 'yes', text: 'Yes'}], animation: false});
        document.querySelector('.dm-modal:last-child').shadowRoot.querySelector('[data-button-id="yes"]').click();
        await expect(p1).resolves.toBe('yes');

        const p2 = E.showModal({title: 'Q', animation: false});
        document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
        await expect(p2).resolves.toBe(null);
    });

    it('destroy() removes a factory modal and leaves a caller\'s element restored in place', () => {
        const f = E.modal({title: 'T'});
        f.destroy();
        expect(f.element.isConnected).toBe(false);

        const s = selectorModal();
        s.destroy();
        const el = document.getElementById('m');
        expect(el).not.toBeNull();
        expect(el.classList.contains('dm-modal-host')).toBe(false);
        expect(el.shadowRoot.querySelector('.modal-dialog')).toBeNull();
        expect(instanceOf(el, 'modal')).toBeNull();
    });
});
