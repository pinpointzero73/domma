// src/sortable.test.js
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

const E = Domma.elements;
const S = Domma.storage;

const ROW = 40;

/**
 * jsdom has no layout. Give every item a 40px row stacked in DOM order, and
 * make elementFromPoint find the item under a y co-ordinate.
 */
function fakeLayout(root, selector = '[data-id]') {
    const rows = () => Array.from(root.querySelectorAll(selector))
        .filter((el) => !el.classList.contains('dm-sortable-ghost'));
    const rectOf = (el) => {
        const i = rows().indexOf(el);
        const top = i * ROW;
        return {left: 0, top, right: 300, bottom: top + ROW, width: 300, height: ROW, x: 0, y: top};
    };
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function () {
        if (this.matches?.(selector) && !this.classList.contains('dm-sortable-ghost')) return rectOf(this);
        return {left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0};
    });
    document.elementFromPoint = (x, y) => rows()[Math.floor(y / ROW)] || null;
}

function pointer(type, target, y, extra = {}) {
    const evt = new MouseEvent(type, {bubbles: true, cancelable: true, clientX: 10, clientY: y, button: 0,
        buttons: type === 'pointerup' ? 0 : ('buttons' in extra ? extra.buttons : 1)});
    Object.defineProperty(evt, 'pointerId', {value: 1});
    Object.defineProperty(evt, 'pointerType', {value: extra.pointerType || 'mouse'});
    target.dispatchEvent(evt);
    return evt;
}

/** Press on `el`, move to `y` in steps, release. */
function drag(el, fromY, toY, {release = true} = {}) {
    pointer('pointerdown', el, fromY);
    const steps = 6;
    for (let i = 1; i <= steps; i++) pointer('pointermove', document, fromY + (toY - fromY) * i / steps);
    if (release) pointer('pointerup', document, toY);
}

const order = (root) => Array.from(root.querySelectorAll(':scope > [data-id]')).map((el) => el.dataset.id).join('');

describe('Domma.elements.sortable', () => {
    let root;
    const made = [];
    const make = (sel, options) => {
        const s = E.sortable(sel, {animation: 0, ...options});
        made.push(s);
        return s;
    };

    beforeEach(() => {
        root = document.createElement('ul');
        root.id = 'list';
        root.innerHTML = ['a', 'b', 'c', 'd'].map((k) => `<li data-id="${k}">${k.toUpperCase()}</li>`).join('');
        document.body.appendChild(root);
        window.requestAnimationFrame = (fn) => setTimeout(fn, 0);
        window.cancelAnimationFrame = (id) => clearTimeout(id);
    });

    afterEach(() => {
        while (made.length) made.pop().destroy();
        vi.restoreAllMocks();
        document.body.innerHTML = '';
        S.remove('sortable:test-order');
    });

    it('is exposed on E and in the config engine', () => {
        expect(typeof E.sortable).toBe('function');
        const s = make('#list');
        expect(root.classList.contains('dm-sortable')).toBe(true);
        expect(E.get('#list')).toBe(s);
    });

    it('reports the order by key', () => {
        const s = make('#list');
        expect(s.toArray()).toEqual(['a', 'b', 'c', 'd']);
    });

    it('sort() applies an order and leaves unnamed items in their slots', () => {
        const s = make('#list');
        s.sort(['c', 'a']);
        expect(order(root)).toBe('cbad');
    });

    describe('live mode', () => {
        it('drags an item down past its neighbours and reports the sort', () => {
            fakeLayout(root);
            const onSort = vi.fn();
            make('#list', {onSort});
            drag(root.querySelector('[data-id=a]'), 20, 100);
            expect(order(root)).toBe('bcad');
            expect(onSort).toHaveBeenCalledTimes(1);
            expect(onSort.mock.calls[0][0]).toMatchObject({from: 0, to: 2, order: ['b', 'c', 'a', 'd'], previous: ['a', 'b', 'c', 'd']});
        });

        it('does not start below the threshold, so a click stays a click', () => {
            fakeLayout(root);
            const onStart = vi.fn();
            make('#list', {onStart});
            drag(root.querySelector('[data-id=a]'), 20, 22);
            expect(onStart).not.toHaveBeenCalled();
            expect(order(root)).toBe('abcd');
        });

        it('Escape puts the item back where it started', () => {
            fakeLayout(root);
            const onCancel = vi.fn();
            const onSort = vi.fn();
            make('#list', {onCancel, onSort});
            drag(root.querySelector('[data-id=a]'), 20, 100, {release: false});
            expect(order(root)).toBe('bcad');
            document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
            expect(order(root)).toBe('abcd');
            expect(onCancel).toHaveBeenCalledTimes(1);
            expect(onSort).not.toHaveBeenCalled();
        });

        it('cleans up the ghost and the drag classes', async () => {
            fakeLayout(root);
            make('#list');
            drag(root.querySelector('[data-id=a]'), 20, 100);
            await new Promise((r) => setTimeout(r, 10));
            expect(document.querySelector('.dm-sortable-ghost')).toBeNull();
            expect(root.querySelector('.dm-sortable-placeholder')).toBeNull();
            expect(document.documentElement.classList.contains('dm-sortable-dragging')).toBe(false);
        });

        it('respects a handle', () => {
            root.querySelectorAll('li').forEach((li) => li.insertAdjacentHTML('afterbegin', '<span class="grip">::</span>'));
            fakeLayout(root);
            make('#list', {handle: '.grip'});
            drag(root.querySelector('[data-id=a]'), 20, 100);
            expect(order(root)).toBe('abcd');
            drag(root.querySelector('[data-id=a] .grip'), 20, 100);
            expect(order(root)).toBe('bcad');
            expect(root.querySelector('.grip').classList.contains('dm-sortable-handle')).toBe(true);
        });

        it('accepts can veto a move', () => {
            fakeLayout(root);
            make('#list', {accepts: (item, target) => target.dataset.id !== 'b'});
            drag(root.querySelector('[data-id=a]'), 20, 60);
            expect(order(root)).toBe('abcd');
        });

        it('Alt+Arrow moves the focused item', () => {
            const onSort = vi.fn();
            make('#list', {onSort});
            const c = root.querySelector('[data-id=c]');
            c.tabIndex = 0;
            c.focus();
            c.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp', altKey: true, bubbles: true}));
            expect(order(root)).toBe('acbd');
            expect(onSort.mock.calls[0][0]).toMatchObject({from: 2, to: 1});
            expect(document.querySelector('.dm-sortable-live').textContent).toBe('Moved to position 2 of 4');
        });

        it('disable() stops dragging', () => {
            fakeLayout(root);
            const s = make('#list');
            s.disable();
            drag(root.querySelector('[data-id=a]'), 20, 100);
            expect(order(root)).toBe('abcd');
            s.enable();
            drag(root.querySelector('[data-id=a]'), 20, 100);
            expect(order(root)).toBe('bcad');
        });
    });

    describe('persist - a sticky order', () => {
        it('saves the order and restores it on the next page load', () => {
            fakeLayout(root);
            make('#list', {persist: 'test-order'});
            drag(root.querySelector('[data-id=a]'), 20, 100);
            expect(S.get('sortable:test-order')).toEqual(['b', 'c', 'a', 'd']);

            // A fresh render in the original order, as a reload would give.
            made.pop().destroy();
            root.innerHTML = ['a', 'b', 'c', 'd'].map((k) => `<li data-id="${k}">${k}</li>`).join('');
            make('#list', {persist: 'test-order'});
            expect(order(root)).toBe('bcad');
        });

        it('keeps items added since the order was saved', () => {
            S.set('sortable:test-order', ['d', 'c', 'b', 'a']);
            root.insertAdjacentHTML('beforeend', '<li data-id="e">E</li>');
            make('#list', {persist: 'test-order'});
            expect(order(root)).toBe('dcbae');
        });

        it('forget() clears it', () => {
            S.set('sortable:test-order', ['d', 'c', 'b', 'a']);
            const s = make('#list', {persist: 'test-order'});
            s.forget();
            expect(S.get('sortable:test-order')).toBeNull();
        });

        it('persist: true keys on the container id', () => {
            S.set('sortable:list', ['b', 'a']);
            make('#list', {persist: true});
            expect(order(root)).toBe('bacd');
            S.remove('sortable:list');
        });
    });

    describe('indicator mode (nest)', () => {
        it('marks before / into / after by where the pointer is in the row', () => {
            fakeLayout(root);
            const seen = [];
            make('#list', {nest: true, onMove: (d) => seen.push(d.zone)});
            const a = root.querySelector('[data-id=a]');
            pointer('pointerdown', a, 20);
            pointer('pointermove', document, 30);
            pointer('pointermove', document, 82);   // c, top quarter
            expect(root.querySelector('[data-id=c]').classList.contains('dm-sortable-over-before')).toBe(true);
            pointer('pointermove', document, 100);  // c, middle
            expect(root.querySelector('[data-id=c]').classList.contains('dm-sortable-over-into')).toBe(true);
            pointer('pointermove', document, 118);  // c, bottom quarter
            expect(root.querySelector('[data-id=c]').classList.contains('dm-sortable-over-after')).toBe(true);
            expect(root.querySelector('.dm-sortable-indicator.is-visible')).not.toBeNull();
            // Nothing moves until the drop.
            expect(order(root)).toBe('abcd');
            document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
            expect(root.querySelector('.dm-sortable-indicator')).toBeNull();
        });

        it('hands the drop to onDrop, which re-renders, and finds the item again by key', async () => {
            fakeLayout(root);
            let data = ['a', 'b', 'c', 'd'];
            const render = () => {
                root.innerHTML = data.map((k) => `<li data-id="${k}">${k}</li>`).join('');
            };
            const onDrop = vi.fn(({key, targetKey, zone}) => {
                data = data.filter((k) => k !== key);
                data.splice(data.indexOf(targetKey) + (zone === 'after' ? 1 : 0), 0, key);
                render();
            });
            const onEnd = vi.fn();
            make('#list', {nest: true, onDrop, onEnd});
            drag(root.querySelector('[data-id=a]'), 20, 118);
            expect(onDrop).toHaveBeenCalledTimes(1);
            expect(onDrop.mock.calls[0][0]).toMatchObject({key: 'a', targetKey: 'c', zone: 'after'});
            expect(order(root)).toBe('bcad');
            expect(onEnd.mock.calls[0][0].changed).toBe(true);
            await new Promise((r) => setTimeout(r, 10));
            expect(root.querySelector('.dm-sortable-placeholder')).toBeNull();
        });

        it('the ghost still lands when the re-render wiped it out of the container', () => {
            fakeLayout(root);
            const render = (keys) => {
                root.innerHTML = keys.map((k) => `<li data-id="${k}">${k}</li>`).join('');
            };
            make('#list', {nest: true, animation: 150, onDrop: () => render(['b', 'c', 'a', 'd'])});
            drag(root.querySelector('[data-id=a]'), 20, 118);
            expect(root.querySelector('.dm-sortable-ghost')).not.toBeNull();
            expect(root.querySelector('[data-id=a]').classList.contains('dm-sortable-landing')).toBe(true);
        });

        it('an "into" the host refuses falls back to the nearer edge', () => {
            fakeLayout(root);
            const onDrop = vi.fn();
            make('#list', {nest: true, onDrop, accepts: (item, target, zone) => zone !== 'into'});
            drag(root.querySelector('[data-id=a]'), 20, 95);
            expect(onDrop.mock.calls[0][0].zone).toBe('before');
        });

        it('onDrop returning false cancels', () => {
            fakeLayout(root);
            const onCancel = vi.fn();
            make('#list', {nest: true, onDrop: () => false, onCancel});
            drag(root.querySelector('[data-id=a]'), 20, 118);
            expect(onCancel).toHaveBeenCalledTimes(1);
        });

        it('without onDrop, live: false moves the element itself', () => {
            fakeLayout(root);
            make('#list', {live: false});
            drag(root.querySelector('[data-id=a]'), 20, 118);
            expect(order(root)).toBe('bcad');
        });
    });

    describe('robustness', () => {
        it('a throwing onDrop does not leave the page stuck mid-drag', () => {
            fakeLayout(root);
            const s = make('#list', {nest: true, onDrop: () => { throw new Error('boom'); }});
            // A listener's throw goes to window 'error', not to dispatchEvent's caller.
            const seen = [];
            const onError = (e) => { seen.push(e.error?.message); e.preventDefault(); };
            window.addEventListener('error', onError);
            drag(root.querySelector('[data-id=a]'), 20, 118);
            window.removeEventListener('error', onError);
            expect(seen).toContain('boom');
            expect(s.dragging).toBe(false);
            expect(document.documentElement.classList.contains('dm-sortable-dragging')).toBe(false);
            expect(root.querySelector('.dm-sortable-indicator')).toBeNull();
        });

        it('a throwing accepts() does not leave the page stuck mid-drag', () => {
            fakeLayout(root);
            const s = make('#list', {accepts: () => { throw new Error('nope'); }});
            // A listener's throw goes to window 'error', not to dispatchEvent's caller.
            const seen = [];
            const onError = (e) => { seen.push(e.error?.message); e.preventDefault(); };
            window.addEventListener('error', onError);
            drag(root.querySelector('[data-id=a]'), 20, 100);
            window.removeEventListener('error', onError);
            expect(seen).toContain('nope');
            expect(s.dragging).toBe(false);
        });

        it('an async onDrop swallows the click that follows the release', async () => {
            fakeLayout(root);
            let resolve;
            const clicked = vi.fn();
            root.addEventListener('click', clicked);
            make('#list', {nest: true, onDrop: () => new Promise((r) => { resolve = r; })});
            drag(root.querySelector('[data-id=a]'), 20, 118);
            root.querySelector('[data-id=c]').dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
            expect(clicked).not.toHaveBeenCalled();
            resolve();
            await new Promise((r) => setTimeout(r, 10));
        });

        it('a mouse move with no button held ends the drag as a drop', () => {
            fakeLayout(root);
            const s = make('#list');
            drag(root.querySelector('[data-id=a]'), 20, 100, {release: false});
            expect(s.dragging).toBe(true);
            pointer('pointermove', document, 100, {buttons: 0});
            expect(s.dragging).toBe(false);
            expect(order(root)).toBe('bcad');
        });

        it('losing the window cancels the drag', () => {
            fakeLayout(root);
            const s = make('#list');
            drag(root.querySelector('[data-id=a]'), 20, 100, {release: false});
            window.dispatchEvent(new Event('blur'));
            expect(s.dragging).toBe(false);
            expect(order(root)).toBe('abcd');
        });

        it('Escape does not reach listeners outside the drag', () => {
            fakeLayout(root);
            const outer = vi.fn();
            document.body.addEventListener('keydown', outer);
            make('#list');
            drag(root.querySelector('[data-id=a]'), 20, 100, {release: false});
            document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
            expect(outer).not.toHaveBeenCalled();
            document.body.removeEventListener('keydown', outer);
        });
    });

    it('fires sortable:* events on the container', () => {
        fakeLayout(root);
        const names = [];
        ['start', 'sort', 'end'].forEach((n) => root.addEventListener(`sortable:${n}`, () => names.push(n)));
        make('#list');
        drag(root.querySelector('[data-id=a]'), 20, 100);
        expect(names).toEqual(['start', 'sort', 'end']);
    });

    it('destroy() removes its listeners and classes', () => {
        fakeLayout(root);
        const s = make('#list');
        s.destroy();
        made.pop();
        drag(root.querySelector('[data-id=a]'), 20, 100);
        expect(order(root)).toBe('abcd');
        expect(root.classList.contains('dm-sortable')).toBe(false);
    });
});
