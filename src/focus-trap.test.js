// src/focus-trap.test.js - E.focusTrap
import {afterEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';
import FocusTrap, {tabbables} from './components/focus-trap.js';

const E = Domma.elements;
const made = [];
const keep = (t) => { made.push(t); return t; };

afterEach(() => {
    while (made.length) made.pop()?.destroy();
    document.body.innerHTML = '';
});

function tab(shift = false, target = document.activeElement) {
    const e = new KeyboardEvent('keydown', {key: 'Tab', shiftKey: shift, bubbles: true, cancelable: true});
    (target || document.body).dispatchEvent(e);
    return e;
}

function page(inner) {
    document.body.innerHTML = `<button id="before">before</button><div id="box">${inner}</div><button id="after">after</button>`;
    return document.getElementById('box');
}

describe('tabbables', () => {
    it('skips disabled, hidden, inert, tabindex=-1 and hidden inputs, and puts positive tabindex first', () => {
        const box = page(`
            <button id="a">a</button>
            <button disabled>x</button>
            <input type="hidden">
            <div hidden><button>x</button></div>
            <div inert><button>x</button></div>
            <span tabindex="-1">x</span>
            <a id="link" href="#">l</a>
            <a>no href</a>
            <input id="pos" tabindex="2">
            <fieldset disabled><input></fieldset>`);
        expect(tabbables(box).map(el => el.id)).toEqual(['pos', 'a', 'link']);
    });

    it('takes only the checked radio of a group, or the first', () => {
        const box = page(`<input type="radio" name="r" id="r1"><input type="radio" name="r" id="r2" checked>
            <input type="radio" name="s" id="s1"><input type="radio" name="s" id="s2">`);
        expect(tabbables(box).map(el => el.id)).toEqual(['r2', 's1']);
    });

    it('walks open shadow roots with slotted children at their slot', () => {
        const box = page('<div id="host"><button id="light">light</button></div>');
        const host = box.querySelector('#host');
        const root = host.attachShadow({mode: 'open'});
        root.innerHTML = '<button id="x">x</button><slot></slot><button id="ok">ok</button>';
        expect(tabbables(box).map(el => el.id)).toEqual(['x', 'light', 'ok']);
        expect(tabbables(box, {shadow: false}).map(el => el.id)).toEqual(['light']);
    });
});

describe('E.focusTrap', () => {
    it('returns null for a selector that matches nothing', () => {
        expect(E.focusTrap('#nope')).toBeNull();
    });

    it('moves focus to the first tabbable and wraps Tab / Shift+Tab', () => {
        const box = page('<button id="one">1</button><button id="two">2</button>');
        const trap = keep(E.focusTrap(box));
        trap.activate();
        expect(document.activeElement.id).toBe('one');
        tab();
        expect(document.activeElement.id).toBe('two');
        const e = tab();
        expect(e.defaultPrevented).toBe(true);
        expect(document.activeElement.id).toBe('one');
        tab(true);
        expect(document.activeElement.id).toBe('two');
    });

    it('finds elements added after activation', () => {
        const box = page('<button id="one">1</button>');
        const trap = keep(E.focusTrap(box));
        trap.activate();
        const later = document.createElement('button');
        later.id = 'later';
        box.appendChild(later);
        tab();
        expect(document.activeElement.id).toBe('later');
    });

    it('initialFocus: selector, element, function, false', () => {
        const box = page('<button id="one">1</button><input id="field">');
        const t1 = keep(E.focusTrap(box, {initialFocus: '#field'}));
        t1.activate();
        expect(document.activeElement.id).toBe('field');
        t1.deactivate();

        const t2 = keep(E.focusTrap(box, {initialFocus: () => box.querySelector('#one')}));
        t2.activate();
        expect(document.activeElement.id).toBe('one');
        t2.deactivate();

        document.getElementById('after').focus();
        const t3 = keep(E.focusTrap(box, {initialFocus: false, returnFocus: false}));
        t3.activate();
        expect(document.activeElement.id).toBe('after');
    });

    it('focuses the container (tabindex -1) when nothing inside is tabbable, and takes it off after', () => {
        const box = page('<p>Just text</p>');
        const trap = keep(E.focusTrap(box));
        trap.activate();
        expect(document.activeElement).toBe(box);
        expect(box.getAttribute('tabindex')).toBe('-1');
        tab();
        expect(document.activeElement).toBe(box);
        trap.deactivate();
        expect(box.hasAttribute('tabindex')).toBe(false);
    });

    it('returnFocus: the element focused before, an element, or not at all', () => {
        const box = page('<button id="one">1</button>');
        const before = document.getElementById('before');
        before.focus();
        const trap = keep(E.focusTrap(box));
        trap.activate();
        trap.deactivate();
        expect(document.activeElement).toBe(before);

        const t2 = keep(E.focusTrap(box, {returnFocus: '#after'}));
        t2.activate();
        t2.deactivate();
        expect(document.activeElement.id).toBe('after');

        before.focus();
        trap.activate();
        trap.deactivate({returnFocus: false});
        expect(document.activeElement.id).toBe('one');
    });

    it('brings focus back when it escapes', () => {
        const box = page('<button id="one">1</button><button id="two">2</button>');
        const trap = keep(E.focusTrap(box));
        trap.activate();
        document.getElementById('two').focus();
        document.getElementById('after').focus();
        expect(document.activeElement.id).toBe('two');
    });

    it('escapeDeactivates is off by default; on, Escape deactivates', () => {
        const box = page('<button id="one">1</button>');
        const trap = keep(E.focusTrap(box));
        trap.activate();
        document.activeElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
        expect(trap.isActive()).toBe(true);
        trap.deactivate();

        const t2 = keep(E.focusTrap(box, {escapeDeactivates: true}));
        t2.activate();
        document.activeElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true, cancelable: true}));
        expect(t2.isActive()).toBe(false);
    });

    it('outside clicks: blocked by default, allowed, or deactivating', () => {
        const box = page('<button id="one">1</button>');
        const outside = vi.fn();
        document.getElementById('after').addEventListener('click', outside);
        const trap = keep(E.focusTrap(box));
        trap.activate();
        document.getElementById('after').click();
        expect(outside).not.toHaveBeenCalled();
        trap.deactivate();

        const t2 = keep(E.focusTrap(box, {allowOutsideClick: true}));
        t2.activate();
        document.getElementById('after').click();
        expect(outside).toHaveBeenCalledTimes(1);
        t2.deactivate();

        const t3 = keep(E.focusTrap(box, {clickOutsideDeactivates: (e) => e.target.id === 'after'}));
        t3.activate();
        document.getElementById('after').dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true}));
        expect(t3.isActive()).toBe(false);
    });

    it('stacks: a second trap pauses the first, and deactivating it unpauses the first', () => {
        document.body.innerHTML = '<div id="a"><button id="a1">a</button></div><div id="b"><button id="b1">b</button><button id="b2">b2</button></div>';
        const pause = vi.fn();
        const unpause = vi.fn();
        const a = keep(E.focusTrap('#a', {onPause: pause, onUnpause: unpause}));
        const b = keep(E.focusTrap('#b'));
        a.activate();
        b.activate();
        expect(a.isPaused()).toBe(true);
        expect(pause).toHaveBeenCalledTimes(1);
        expect(FocusTrap.top()).toBe(b);
        tab();
        tab();
        expect(document.activeElement.id).toBe('b1');   // b's cycle, not a's
        b.deactivate();
        expect(a.isPaused()).toBe(false);
        expect(unpause).toHaveBeenCalledTimes(1);
        expect(document.activeElement.id).toBe('a1');   // returnFocus to what had focus before b
        expect(E.focusTrap.top()).toBe(a);
    });

    it('a lower trap deactivating leaves the top one alone', () => {
        document.body.innerHTML = '<div id="a"><button>a</button></div><div id="b"><button id="b1">b</button></div>';
        const a = keep(E.focusTrap('#a'));
        const b = keep(E.focusTrap('#b'));
        a.activate();
        b.activate();
        a.deactivate({returnFocus: false});
        expect(b.isActive()).toBe(true);
        expect(b.isPaused()).toBe(false);
        expect(document.activeElement.id).toBe('b1');
    });

    it('inert: true marks everything outside while active and only what it marked', () => {
        document.body.innerHTML = '<header id="h"></header><main><aside id="side" inert></aside><div id="box"><button>x</button></div><p id="p"></p></main>';
        const trap = keep(E.focusTrap('#box', {inert: true}));
        trap.activate();
        expect(document.getElementById('h').hasAttribute('inert')).toBe(true);
        expect(document.getElementById('p').hasAttribute('inert')).toBe(true);
        expect(document.getElementById('box').hasAttribute('inert')).toBe(false);
        trap.pause();
        expect(document.getElementById('h').hasAttribute('inert')).toBe(false);
        trap.unpause();
        expect(document.getElementById('h').hasAttribute('inert')).toBe(true);
        trap.deactivate();
        expect(document.getElementById('h').hasAttribute('inert')).toBe(false);
        expect(document.getElementById('side').hasAttribute('inert')).toBe(true);
    });

    it('updateContainers: Tab cycles through the new set', () => {
        document.body.innerHTML = '<div id="a"><button id="a1">a</button></div><div id="b"><button id="b1">b</button></div>';
        const trap = keep(E.focusTrap('#a'));
        trap.activate();
        tab();
        expect(document.activeElement.id).toBe('a1');
        trap.updateContainers(['#a', '#b']);
        tab();
        expect(document.activeElement.id).toBe('b1');
        tab();
        expect(document.activeElement.id).toBe('a1');
    });

    it('events: option, .on() and dm:focus-trap:activate / deactivate', () => {
        const box = page('<button>1</button>');
        const onActivate = vi.fn();
        const viaOn = vi.fn();
        const viaDom = vi.fn();
        const trap = keep(E.focusTrap(box, {onActivate}));
        trap.on('deactivate', viaOn);
        box.addEventListener('dm:focus-trap:activate', viaDom);
        trap.activate();
        trap.deactivate();
        expect(onActivate).toHaveBeenCalledWith(trap);
        expect(viaOn).toHaveBeenCalledWith(trap);
        expect(viaDom).toHaveBeenCalledTimes(1);
    });

    it('destroy() stops listening and E.get no longer finds it', () => {
        const box = page('<button id="one">1</button>');
        const trap = E.focusTrap(box);
        trap.activate();
        expect(E.get(box, 'focus-trap')).toBe(trap);
        trap.destroy();
        expect(trap.isActive()).toBe(false);
        expect(E.get(box, 'focus-trap')).toBeUndefined();
        document.getElementById('after').focus();
        expect(document.activeElement.id).toBe('after');
        const e = tab();
        expect(e.defaultPrevented).toBe(false);
    });

    it('leaves Tab alone when another handler already used it', () => {
        const box = page('<textarea id="code"></textarea><button id="b">b</button>');
        const trap = keep(E.focusTrap(box));
        trap.activate();
        // A code editor that claims Tab first (capture on window runs before the trap's
        // capture listener on document).
        const claim = (e) => e.preventDefault();
        window.addEventListener('keydown', claim, true);
        tab();
        window.removeEventListener('keydown', claim, true);
        expect(document.activeElement.id).toBe('code');
    });
});
