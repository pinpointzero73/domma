// src/wrapper-identity.test.js
//
// E.card / modal / tooltip / badge / numberBadge / loader work ON the element they are
// given. The old wrappers swapped it for a <domma-*> custom element with replaceWith(),
// which detached every reference a caller held, dropped listeners bound to it, and
// left E.get(original) finding nothing. These tests hold the opposite: the reference
// passed in IS instance.element, still in the page, with its id, classes and data-*.
//
// They also assert RENDERED state where it matters (computed style under the real
// elements.css): the old modal reported isOpen() true while invisible.

import {beforeEach, describe, expect, it} from 'vitest';
import {readFileSync} from 'fs';
import Domma from './index.js';

const E = Domma.elements;
let elementsCss = null;

/** Load the built elements.css into the document so the cascade is real. */
function withElementsCss() {
    if (elementsCss === null) {
        elementsCss = readFileSync('public/dist/elements.css', 'utf8');
    }
    const style = document.createElement('style');
    style.textContent = elementsCss;
    document.head.appendChild(style);
}

function place(html) {
    const host = document.createElement('div');
    host.innerHTML = html;
    document.body.appendChild(host);
    return host.firstElementChild;
}

describe('E.* keep the caller\'s element', () => {
    beforeEach(() => {
        document.body.replaceChildren();
        document.head.replaceChildren();
    });

    const cases = {
        card: () => [place('<div id="x" class="card demo" data-k="1"><div class="card-body">b</div></div>'), (el) => E.card(el)],
        modal: () => [place('<div id="x" class="modal demo" data-k="1"><p>b</p></div>'), (el) => E.modal(el)],
        tooltip: () => [place('<button id="x" class="demo" data-k="1">t</button>'), (el) => E.tooltip(el, {content: 'Tip'})],
        badge: () => [place('<span id="x" class="demo" data-k="1">3</span>'), (el) => E.badge(el)],
        numberBadge: () => [place('<button id="x" class="demo" data-k="1">Inbox</button>'), (el) => E.numberBadge(el, {count: 2})],
        loader: () => [place('<div id="x" class="demo" data-k="1"></div>'), (el) => E.loader(el)]
    };

    for (const [name, make] of Object.entries(cases)) {
        it(`${name}: the element passed in is instance.element, in place, found by E.get`, () => {
            const [el, init] = make();
            const parent = el.parentNode;
            const viaSelector = name === 'modal' || name === 'card';
            const instance = viaSelector ? (name === 'modal' ? E.modal('#x') : E.card('#x')) : init(el);

            expect(instance.element).toBe(el);
            expect(el.parentNode).toBe(parent);
            expect(document.querySelectorAll('#x')).toHaveLength(1);
            expect(el.classList.contains('demo')).toBe(true);
            expect(el.dataset.k).toBe('1');
            expect(E.get(el)).toBe(instance);
            expect(instance.options).toBeTypeOf('object');
        });
    }

    it('a listener bound to the element before init still fires after', () => {
        const el = place('<span id="b">1</span>');
        let clicks = 0;
        el.addEventListener('click', () => clicks++);
        E.badge(el);
        el.click();
        expect(clicks).toBe(1);
    });

    it('a modal keeps .modal and an open one is visible and clickable under elements.css', () => {
        withElementsCss();
        const el = place('<div id="m" class="modal modal-sm"><div class="modal-body">Hi</div></div>');
        const modal = E.modal('#m', {animation: false});

        expect(el.classList.contains('modal')).toBe(true);
        expect(getComputedStyle(el).display).toBe('none');
        modal.open();

        expect(modal.isOpen()).toBe(true);
        const styles = getComputedStyle(el);
        expect(styles.display).toBe('flex');
        expect(styles.opacity).not.toBe('0');
        expect(styles.pointerEvents).not.toBe('none');
        expect(styles.position).toBe('fixed');
    });

    it('a size class on the markup sets the dialog width, and an option overrides it', () => {
        const a = place('<div class="modal modal-sm"></div>');
        expect(E.modal(a).options.size).toBe('small');
        const b = place('<div class="modal modal-sm"></div>');
        expect(E.modal(b, {size: 'large'}).options.size).toBe('large');
    });

    it('card text that is not in a child element survives', () => {
        const el = place('<div class="card">Loose text <b>bold</b></div>');
        E.card(el, {title: 'T'});
        expect(el.textContent).toContain('Loose text');
        expect(el.querySelector('b').textContent).toBe('bold');
    });

    it('badge child markup (an icon) survives', () => {
        const el = place('<span><span data-icon="star" class="ic"></span> New</span>');
        E.badge(el, {variant: 'success'});
        expect(el.querySelector('.ic')).not.toBeNull();
        expect(el.classList.contains('badge-success')).toBe(true);
    });
});
