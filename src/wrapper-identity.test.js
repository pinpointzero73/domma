// src/wrapper-identity.test.js
//
// The legacy wrappers replace the author's element with a Web Component.
// Two things must both hold, and they pull in opposite directions:
//
//   1. The element keeps its identity (id, data-*, author classes) so later
//      selector lookups still work.
//   2. It must NOT keep the legacy base class (.modal/.card/.badge). Those
//      elements.css rules describe the hand-written, JS-free component and are
//      driven by class toggles the Web Component never performs — `.modal` sets
//      opacity:0 / pointer-events:none, undone only by `.modal.active`, while
//      the component shows itself via :host([visible]). Copying it lets outer
//      document CSS override the shadow styling and the component renders
//      invisible.
//
// These tests assert RENDERED state (computed style), not just API state —
// isOpen() returned true the whole time the modal was invisible.

import {beforeEach, describe, expect, it} from 'vitest';
import {readFileSync} from 'fs';
import Domma from './index.js';

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

describe('legacy wrappers - element identity', () => {

    beforeEach(() => {
        document.body.replaceChildren();
        document.head.replaceChildren();
    });

    it('modal keeps its id so selector lookups still resolve', () => {
        const el = document.createElement('div');
        el.id = 'my-modal';
        el.className = 'modal';
        document.body.appendChild(el);

        Domma.elements.modal('#my-modal', {});

        expect(document.querySelectorAll('#my-modal')).toHaveLength(1);
        expect(document.querySelector('#my-modal').tagName).toBe('DOMMA-MODAL');
    });

    it('modal does NOT inherit the legacy .modal class', () => {
        const el = document.createElement('div');
        el.id = 'm';
        el.className = 'modal my-custom-class';
        document.body.appendChild(el);

        const modal = Domma.elements.modal('#m', {});

        expect(modal.element.classList.contains('modal')).toBe(false);
        // Author classes still carry across
        expect(modal.element.classList.contains('my-custom-class')).toBe(true);
    });

    it('an open modal is actually visible under elements.css', () => {
        withElementsCss();

        const el = document.createElement('div');
        el.id = 'm';
        el.className = 'modal';
        document.body.appendChild(el);

        const modal = Domma.elements.modal('#m', {});
        modal.open();

        expect(modal.isOpen()).toBe(true);
        expect(modal.element.hasAttribute('visible')).toBe(true);

        // The regression: .modal from elements.css zeroed these on the host,
        // so the modal was open but invisible and unclickable.
        const styles = getComputedStyle(modal.element);
        expect(styles.opacity).not.toBe('0');
        expect(styles.pointerEvents).not.toBe('none');
    });

    it('card keeps author classes but not the legacy .card class', () => {
        const el = document.createElement('div');
        el.id = 'c';
        el.className = 'card demo-card';
        document.body.appendChild(el);

        const card = Domma.elements.card('#c', {});

        expect(card.element.classList.contains('card')).toBe(false);
        expect(card.element.classList.contains('demo-card')).toBe(true);
        expect(card.element.id).toBe('c');
    });

    it('badge keeps author classes but not the legacy .badge class', () => {
        const el = document.createElement('span');
        el.id = 'b';
        el.className = 'badge tracking-pill';
        el.textContent = '3';
        document.body.appendChild(el);

        const badge = Domma.elements.badge('#b', {});

        expect(badge.element.classList.contains('badge')).toBe(false);
        expect(badge.element.classList.contains('tracking-pill')).toBe(true);
        expect(badge.element.id).toBe('b');
    });

    it('data-* attributes survive the swap', () => {
        const el = document.createElement('div');
        el.id = 'd';
        el.className = 'modal';
        el.setAttribute('data-analytics-id', 'signup-modal');
        document.body.appendChild(el);

        const modal = Domma.elements.modal('#d', {});

        expect(modal.element.getAttribute('data-analytics-id')).toBe('signup-modal');
    });

    it('option-derived attributes are not clobbered by the original element', () => {
        const el = document.createElement('div');
        el.id = 'o';
        el.className = 'modal';
        el.setAttribute('size', 'small');   // author markup
        document.body.appendChild(el);

        const modal = Domma.elements.modal('#o', {size: 'large'});   // option wins

        expect(modal.element.getAttribute('size')).toBe('large');
    });
});
