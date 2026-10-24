// src/components-toast.test.js - E.toast keeps its whole option set, in light DOM
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

const E = Domma.elements;

beforeEach(() => { vi.useFakeTimers(); });
afterEach(async () => {
    E.toast.closeAll();
    await vi.runAllTimersAsync();
    vi.useRealTimers();
    document.body.innerHTML = '';
});

const message = (t) => t.element.querySelector('.domma-toast-message');

describe('E.toast', () => {
    it('shows the message as text in a light-DOM toast in the position container', () => {
        const t = E.toast('Saved <b>ok</b>');
        expect(t.element.classList.contains('domma-toast')).toBe(true);
        expect(t.element.shadowRoot).toBeNull();
        expect(message(t).textContent).toBe('Saved <b>ok</b>');
        expect(t.element.parentElement.classList.contains('domma-toast-top-right')).toBe(true);
        expect(t.isVisible()).toBe(true);
    });

    it("'123' stays the string 123, 0 and false are shown, not lost", () => {
        expect(message(E.toast('123')).textContent).toBe('123');
        expect(message(E.toast('007')).textContent).toBe('007');
        expect(message(E.toast(0)).textContent).toBe('0');
        expect(message(E.toast('true')).textContent).toBe('true');
    });

    it('type sets the class and role; success/error/warning/info add their icon', () => {
        const err = E.toast('Bad', {type: 'error'});
        expect(err.element.classList.contains('domma-toast-error')).toBe(true);
        expect(err.element.getAttribute('role')).toBe('alert');
        expect(err.element.querySelector('.domma-toast-icon')).toBeNull();

        for (const type of ['success', 'error', 'warning', 'info']) {
            const t = E.toast[type]('x');
            expect(t.element.classList.contains(`domma-toast-${type}`)).toBe(true);
            expect(t.element.querySelector('.domma-toast-icon svg')).not.toBeNull();
            expect(t.element.getAttribute('role')).toBe(type === 'error' ? 'alert' : 'status');
        }
        expect(E.toast.show('plain').element.classList.contains('domma-toast-default')).toBe(true);
    });

    it('duration closes it (then removes it); 0 keeps it', async () => {
        const onClose = vi.fn();
        const t = E.toast('x', {duration: 1000, onClose});
        const sticky = E.toast('y', {duration: 0});
        await vi.advanceTimersByTimeAsync(1000);
        expect(t.isVisible()).toBe(false);
        await vi.advanceTimersByTimeAsync(400);
        expect(t.element.isConnected).toBe(false);
        expect(onClose).toHaveBeenCalledWith(t);
        expect(sticky.isVisible()).toBe(true);
        expect(sticky.element.querySelector('.domma-toast-progress')).toBeNull();
    });

    it('html: true is sanitised; safe: false keeps trusted markup', () => {
        const t = E.toast('<b>bold</b><img src=x onerror="alert(1)">', {html: true});
        expect(message(t).querySelector('b').textContent).toBe('bold');
        expect(message(t).querySelector('img')?.hasAttribute('onerror') ?? false).toBe(false);

        const trusted = E.toast('<em data-x="1">t</em>', {html: true, safe: false});
        expect(message(trusted).querySelector('em').dataset.x).toBe('1');
    });

    it('actions (and the single action shorthand) call their handler, onAction, and close', () => {
        const onClick = vi.fn();
        const onAction = vi.fn();
        const t = E.toast('Deleted', {actions: [{label: 'Undo', onClick}], onAction, duration: 0});
        const btn = t.element.querySelector('.domma-toast-action');
        expect(btn.textContent).toBe('Undo');
        btn.click();
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onAction).toHaveBeenCalledWith({action: expect.objectContaining({label: 'Undo'}), index: 0}, t);
        expect(t.isVisible()).toBe(false);

        const keep = E.toast('x', {action: {label: 'Keep', closeOnClick: false}, duration: 0});
        keep.element.querySelector('.domma-toast-action').click();
        expect(keep.isVisible()).toBe(true);
    });

    it('title, closable: false, setters, maxToasts and closeAll', () => {
        const t = E.toast('m', {title: 'Heads up', closable: false, duration: 0});
        expect(t.element.querySelector('.domma-toast-title').textContent).toBe('Heads up');
        expect(t.element.querySelector('.domma-toast-close')).toBeNull();
        t.setMessage('n').setTitle('T2').setType('warning');
        expect(message(t).textContent).toBe('n');
        expect(t.element.classList.contains('domma-toast-warning')).toBe(true);

        const many = Array.from({length: 7}, (_, i) => E.toast(`t${i}`, {duration: 0}));
        expect(many.filter(x => x.isVisible())).toHaveLength(5);
        E.toast.closeAll();
        expect(many.some(x => x.isVisible())).toBe(false);
    });

    it('position, dm:toast:* events and hide() as an alias of close()', () => {
        const t = E.toast('x', {position: 'bottom-left', duration: 0});
        expect(t.element.parentElement.classList.contains('domma-toast-bottom-left')).toBe(true);
        const closed = vi.fn();
        t.element.addEventListener('dm:toast:close', closed);
        t.hide();
        vi.advanceTimersByTime(400);
        expect(closed).toHaveBeenCalledTimes(1);
    });

    it('E.toast({message, ...}) is accepted too', () => {
        const t = E.toast({message: 'obj', type: 'info'});
        expect(message(t).textContent).toBe('obj');
        expect(t.element.classList.contains('domma-toast-info')).toBe(true);
    });
});
