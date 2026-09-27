// src/popover.test.js
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';
import Popover from './popover.js';

const E = Domma.elements;

const key = (target, k, extra = {}) => {
    const evt = new KeyboardEvent('keydown', {key: k, bubbles: true, cancelable: true, ...extra});
    target.dispatchEvent(evt);
    return evt;
};

const pointerDown = (target) => {
    // jsdom has no PointerEvent constructor; the listener only reads target.
    target.dispatchEvent(new MouseEvent('pointerdown', {bubbles: true, cancelable: true}));
};

describe('Domma.elements.popover', () => {
    let btn;
    let other;
    const made = [];
    const make = (el, options = {}) => {
        const p = E.popover(el, {animation: false, ...options});
        made.push(p);
        return p;
    };

    beforeEach(() => {
        document.body.insertAdjacentHTML('beforeend', `
            <button id="pop-btn" type="button">Info</button>
            <button id="pop-other" type="button">Other</button>
            <input id="pop-input">
            <a id="pop-after" href="#after">After</a>
        `);
        btn = document.getElementById('pop-btn');
        other = document.getElementById('pop-other');
    });

    afterEach(() => {
        while (made.length) made.pop().destroy();
        Popover.closeAll();
        vi.useRealTimers();
    });

    describe('opening and closing', () => {
        it('click toggles the panel, portalled to body', () => {
            const p = make(btn, {content: 'Hello'});
            expect(p.isOpen()).toBe(false);
            btn.click();
            expect(p.isOpen()).toBe(true);
            expect(p.panel.parentNode).toBe(document.body);
            expect(p.panel.classList.contains('is-open')).toBe(true);
            expect(p.panel.querySelector('.dm-popover-body').textContent).toBe('Hello');
            btn.click();
            expect(p.isOpen()).toBe(false);
            expect(document.body.contains(p.panel)).toBe(false);
        });

        it('hover opens on mouseenter and closes on mouseleave after the delay', () => {
            vi.useFakeTimers();
            const p = make(btn, {content: 'Tip', trigger: 'hover', delay: {show: 50, hide: 100}});
            btn.dispatchEvent(new MouseEvent('mouseenter'));
            expect(p.isOpen()).toBe(false);
            vi.advanceTimersByTime(60);
            expect(p.isOpen()).toBe(true);

            btn.dispatchEvent(new MouseEvent('mouseleave'));
            // Moving into the panel cancels the pending hide.
            p.panel.dispatchEvent(new MouseEvent('mouseenter'));
            vi.advanceTimersByTime(200);
            expect(p.isOpen()).toBe(true);

            p.panel.dispatchEvent(new MouseEvent('mouseleave'));
            vi.advanceTimersByTime(120);
            expect(p.isOpen()).toBe(false);
        });

        it('focus opens on focus and closes when focus moves elsewhere', () => {
            const input = document.getElementById('pop-input');
            const p = make(input, {content: 'Format: 01234 567890', trigger: 'focus'});
            input.focus();
            expect(p.isOpen()).toBe(true);
            // Focus is not moved into a focus popover.
            expect(document.activeElement).toBe(input);
            other.focus();
            expect(p.isOpen()).toBe(false);
        });

        it('manual binds nothing and answers to show/hide/toggle', () => {
            const p = make(btn, {content: 'x', trigger: 'manual'});
            btn.click();
            expect(p.isOpen()).toBe(false);
            p.show();
            expect(p.isOpen()).toBe(true);
            p.toggle();
            expect(p.isOpen()).toBe(false);
        });

        it('Escape closes the top popover and returns focus to the trigger', () => {
            const p = make(btn, {content: 'x'});
            btn.click();
            expect(document.activeElement).toBe(p.panel);
            const evt = key(document.activeElement, 'Escape');
            expect(p.isOpen()).toBe(false);
            expect(evt.defaultPrevented).toBe(true);
            expect(document.activeElement).toBe(btn);
        });

        it('closeOnEscape: false ignores Escape', () => {
            const p = make(btn, {content: 'x', closeOnEscape: false});
            p.show();
            key(document, 'Escape');
            expect(p.isOpen()).toBe(true);
        });

        it('a press outside closes it; a press inside does not', () => {
            const p = make(btn, {content: 'x'});
            p.show();
            pointerDown(p.panel.querySelector('.dm-popover-body'));
            expect(p.isOpen()).toBe(true);
            pointerDown(other);
            expect(p.isOpen()).toBe(false);
        });

        it('closeOnOutside: false keeps it open', () => {
            const p = make(btn, {content: 'x', closeOnOutside: false, trigger: 'manual'});
            p.show();
            pointerDown(other);
            expect(p.isOpen()).toBe(true);
        });

        it('the dismiss button closes it and returns focus', () => {
            const p = make(btn, {content: 'x', dismissible: true});
            btn.click();
            const close = p.panel.querySelector('.dm-popover-close');
            expect(close.hidden).toBe(false);
            close.click();
            expect(p.isOpen()).toBe(false);
            expect(document.activeElement).toBe(btn);
        });

        it('has no close button unless dismissible', () => {
            const p = make(btn, {content: 'x'});
            p.show();
            expect(p.panel.querySelector('.dm-popover-close').hidden).toBe(true);
        });
    });

    describe('accessibility', () => {
        it('wires aria-haspopup, aria-expanded and aria-controls on a click trigger', () => {
            const p = make(btn, {content: 'x', title: 'About'});
            expect(btn.getAttribute('aria-haspopup')).toBe('dialog');
            expect(btn.getAttribute('aria-expanded')).toBe('false');
            expect(btn.hasAttribute('aria-controls')).toBe(false);

            p.show();
            expect(btn.getAttribute('aria-expanded')).toBe('true');
            expect(btn.getAttribute('aria-controls')).toBe(p.panel.id);
            expect(p.panel.getAttribute('role')).toBe('dialog');
            expect(p.panel.getAttribute('aria-labelledby')).toBe(`${p.panel.id}-title`);
            expect(document.getElementById(`${p.panel.id}-title`).textContent).toBe('About');

            p.hide();
            expect(btn.getAttribute('aria-expanded')).toBe('false');
            expect(btn.hasAttribute('aria-controls')).toBe(false);
        });

        it('a hover popover is a tooltip described-by the trigger', () => {
            btn.setAttribute('aria-describedby', 'existing');
            const p = make(btn, {content: 'x', trigger: 'hover'});
            expect(btn.hasAttribute('aria-haspopup')).toBe(false);
            p.show();
            expect(p.panel.getAttribute('role')).toBe('tooltip');
            expect(btn.getAttribute('aria-describedby')).toBe(`existing ${p.panel.id}`);
            p.hide();
            expect(btn.getAttribute('aria-describedby')).toBe('existing');
        });

        it('uses ariaLabel when there is no title', () => {
            const p = make(btn, {content: 'x', ariaLabel: 'Help'});
            p.show();
            expect(p.panel.getAttribute('aria-label')).toBe('Help');
            expect(p.panel.hasAttribute('aria-labelledby')).toBe(false);
            expect(p.panel.querySelector('.dm-popover-header').hidden).toBe(true);
        });

        it('moves focus to the first control in a click popover', () => {
            const content = document.createElement('div');
            content.innerHTML = '<p>Text</p><input id="inner-a"><button id="inner-b">OK</button>';
            const p = make(btn, {content, dismissible: true});
            btn.click();
            expect(document.activeElement.id).toBe('inner-a');
            expect(p.isOpen()).toBe(true);
        });

        it('Tab past the last control leaves the popover for the element after the trigger', () => {
            const content = document.createElement('div');
            content.innerHTML = '<button id="only">OK</button>';
            const p = make(btn, {content});
            btn.click();
            expect(document.activeElement.id).toBe('only');
            key(document.activeElement, 'Tab');
            expect(p.isOpen()).toBe(false);
            expect(document.activeElement).toBe(other);
        });

        it('Shift+Tab from the first control goes back to the trigger', () => {
            const content = document.createElement('div');
            content.innerHTML = '<button id="only">OK</button>';
            const p = make(btn, {content});
            btn.click();
            key(document.activeElement, 'Tab', {shiftKey: true});
            expect(document.activeElement).toBe(btn);
            expect(p.isOpen()).toBe(true);
            // ...and Tab from the trigger goes back in.
            key(btn, 'Tab');
            expect(document.activeElement.id).toBe('only');
        });

        it('trapFocus cycles inside the panel', () => {
            const content = document.createElement('div');
            content.innerHTML = '<button id="t1">1</button><button id="t2">2</button>';
            const p = make(btn, {content, trapFocus: true});
            btn.click();
            document.getElementById('t2').focus();
            key(document.activeElement, 'Tab');
            expect(document.activeElement.id).toBe('t1');
            expect(p.isOpen()).toBe(true);
        });

        it('makes a non-interactive trigger focusable and keyboard-operable, then restores it', () => {
            const span = document.createElement('span');
            span.textContent = '?';
            document.body.appendChild(span);
            const p = make(span, {content: 'x'});
            expect(span.getAttribute('tabindex')).toBe('0');
            expect(span.getAttribute('role')).toBe('button');
            key(span, 'Enter');
            expect(p.isOpen()).toBe(true);
            p.destroy();
            made.splice(made.indexOf(p), 1);
            expect(span.hasAttribute('tabindex')).toBe(false);
            expect(span.hasAttribute('role')).toBe(false);
            expect(span.hasAttribute('aria-haspopup')).toBe(false);
        });
    });

    describe('content', () => {
        it('treats strings as text by default', () => {
            const p = make(btn, {content: '<img src=x onerror="alert(1)"><b>bold</b>'});
            p.show();
            const body = p.panel.querySelector('.dm-popover-body');
            expect(body.querySelector('img')).toBeNull();
            expect(body.querySelector('b')).toBeNull();
            expect(body.textContent).toContain('<b>bold</b>');
        });

        it('sanitises html: true content', () => {
            const p = make(btn, {html: true, content: '<b>bold</b><img src=x onerror="alert(1)"><script>bad()</script>'});
            p.show();
            const body = p.panel.querySelector('.dm-popover-body');
            expect(body.querySelector('b').textContent).toBe('bold');
            expect(body.querySelector('script')).toBeNull();
            const img = body.querySelector('img');
            if (img) expect(img.hasAttribute('onerror')).toBe(false);
        });

        it('appends a DOM node and calls a function each time it opens', () => {
            let calls = 0;
            const p = make(btn, {
                content: () => {
                    calls++;
                    const el = document.createElement('em');
                    el.textContent = `open ${calls}`;
                    return el;
                }
            });
            p.show();
            expect(p.panel.querySelector('em').textContent).toBe('open 1');
            p.hide();
            p.show();
            expect(p.panel.querySelector('em').textContent).toBe('open 2');
        });

        it('setContent and setTitle update an open panel', () => {
            const p = make(btn, {content: 'one'});
            p.show();
            expect(p.panel.classList.contains('has-title')).toBe(false);
            p.setContent('two').setTitle('Heading');
            expect(p.panel.querySelector('.dm-popover-body').textContent).toBe('two');
            expect(p.panel.querySelector('.dm-popover-title').textContent).toBe('Heading');
            expect(p.panel.classList.contains('has-title')).toBe(true);
            p.setTitle('');
            expect(p.panel.querySelector('.dm-popover-header').hidden).toBe(true);
        });

        it('setContent before the first open is used when it opens', () => {
            const p = make(btn, {content: 'old'});
            p.setContent('new');
            p.show();
            expect(p.panel.querySelector('.dm-popover-body').textContent).toBe('new');
        });
    });

    describe('groups', () => {
        it('keeps one open at a time in a group', () => {
            const a = make(btn, {content: 'a'});
            const b = make(other, {content: 'b'});
            a.show();
            b.show();
            expect(a.isOpen()).toBe(false);
            expect(b.isOpen()).toBe(true);
        });

        it('different groups, or group: null, stay independent', () => {
            const a = make(btn, {content: 'a', group: 'left', closeOnOutside: false});
            const b = make(other, {content: 'b', group: null, closeOnOutside: false});
            a.show();
            b.show();
            expect(a.isOpen()).toBe(true);
            expect(b.isOpen()).toBe(true);
        });

        it('a popover opened from inside another does not close its parent', () => {
            const inner = document.createElement('button');
            inner.textContent = 'more';
            const parent = make(btn, {content: inner});
            parent.show();
            const child = make(inner, {content: 'child'});
            child.show();
            expect(parent.isOpen()).toBe(true);
            // A press in the child is not "outside" the parent.
            pointerDown(child.panel);
            expect(parent.isOpen()).toBe(true);
            // Escape closes the child first.
            key(document, 'Escape');
            expect(child.isOpen()).toBe(false);
            expect(parent.isOpen()).toBe(true);
            // Closing the parent closes any open child.
            child.show();
            parent.hide();
            expect(child.isOpen()).toBe(false);
        });

        it('closeAll closes everything, or one group', () => {
            const a = make(btn, {content: 'a', group: 'g1', closeOnOutside: false});
            const b = make(other, {content: 'b', group: 'g2', closeOnOutside: false});
            a.show();
            b.show();
            E.popover.closeAll('g1');
            expect(a.isOpen()).toBe(false);
            expect(b.isOpen()).toBe(true);
            E.popover.closeAll();
            expect(b.isOpen()).toBe(false);
        });
    });

    describe('events and callbacks', () => {
        it('fires show, shown, hide and hidden on the trigger and calls the callbacks', () => {
            const seen = [];
            ['show', 'shown', 'hide', 'hidden'].forEach((n) =>
                btn.addEventListener(`popover:${n}`, (e) => seen.push(`event:${n}:${e.detail.popover === p}`)));
            const p = make(btn, {
                content: 'x',
                onShow: () => seen.push('cb:show'),
                onShown: () => seen.push('cb:shown'),
                onHide: () => seen.push('cb:hide'),
                onHidden: () => seen.push('cb:hidden')
            });
            p.show();
            p.hide();
            expect(seen).toEqual([
                'cb:show', 'event:show:true', 'cb:shown', 'event:shown:true',
                'cb:hide', 'event:hide:true', 'cb:hidden', 'event:hidden:true'
            ]);
        });

        it('onShow returning false, or preventDefault on popover:show, cancels the open', () => {
            const p = make(btn, {content: 'x', onShow: () => false});
            p.show();
            expect(p.isOpen()).toBe(false);

            const q = make(other, {content: 'y'});
            other.addEventListener('popover:show', (e) => e.preventDefault());
            q.show();
            expect(q.isOpen()).toBe(false);
        });

        it('waits for the transition before shown and hidden when animated', () => {
            vi.useFakeTimers();
            const events = [];
            const p = E.popover(btn, {content: 'x', animationDuration: 100});
            made.push(p);
            btn.addEventListener('popover:shown', () => events.push('shown'));
            btn.addEventListener('popover:hidden', () => events.push('hidden'));
            p.show();
            expect(events).toEqual([]);
            vi.advanceTimersByTime(100);
            expect(events).toEqual(['shown']);
            p.hide();
            expect(document.body.contains(p.panel)).toBe(true);
            vi.advanceTimersByTime(100);
            expect(events).toEqual(['shown', 'hidden']);
            expect(document.body.contains(p.panel)).toBe(false);
        });
    });

    describe('positioning', () => {
        const rect = (left, top, width, height) => ({
            left, top, width, height, right: left + width, bottom: top + height, x: left, y: top
        });

        function layout(triggerRect, w = 200, h = 100) {
            vi.spyOn(btn, 'getBoundingClientRect').mockReturnValue(triggerRect);
            vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function () {
                return this.classList?.contains('dm-popover') ? w : 0;
            });
            vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function () {
                return this.classList?.contains('dm-popover') ? h : 0;
            });
        }

        afterEach(() => vi.restoreAllMocks());

        it('places below by default, centred on the trigger', () => {
            layout(rect(400, 100, 80, 30));
            const p = make(btn, {content: 'x'});
            p.show();
            expect(p.panel.dataset.side).toBe('bottom');
            expect(p.panel.style.top).toBe('140px');
            expect(p.panel.style.left).toBe('340px');
        });

        it('flips to the other side when the preferred one does not fit', () => {
            // jsdom viewport: 1024 x 768. Trigger near the bottom edge.
            layout(rect(400, 700, 80, 30));
            const p = make(btn, {content: 'x', placement: 'bottom'});
            p.show();
            expect(p.panel.dataset.side).toBe('top');
            expect(p.panel.style.top).toBe(`${700 - 10 - 100}px`);
        });

        it('shifts inside the viewport and keeps the arrow on the trigger', () => {
            layout(rect(2, 300, 20, 20));
            const p = make(btn, {content: 'x', placement: 'bottom'});
            p.show();
            expect(p.panel.style.left).toBe('8px');
            // Trigger centre is x = 12, panel left 8: arrow at 12 (clamped to the padding).
            expect(p.panel.querySelector('.dm-popover-arrow').style.left).toBe('12px');
        });

        it('honours start/end alignment and left/right sides', () => {
            layout(rect(400, 300, 80, 30));
            const p = make(btn, {content: 'x', placement: 'top-start'});
            p.show();
            expect(p.panel.dataset.placement).toBe('top-start');
            expect(p.panel.style.left).toBe('400px');
            p.hide();
            p.setOptions({placement: 'right'});
            p.show();
            expect(p.panel.dataset.side).toBe('right');
            expect(p.panel.style.left).toBe(`${480 + 10}px`);
        });

        it('auto picks a side that fits', () => {
            layout(rect(400, 700, 80, 30));
            const p = make(btn, {content: 'x', placement: 'auto'});
            p.show();
            expect(p.panel.dataset.side).toBe('top');
        });
    });

    describe('setOptions', () => {
        it('switches trigger type while open without re-rendering the content', () => {
            const content = document.createElement('div');
            content.innerHTML = '<button id="keep">Keep</button>';
            const p = make(btn, {content});
            btn.click();
            expect(document.activeElement.id).toBe('keep');
            p.setOptions({trigger: 'hover'});
            expect(p.isOpen()).toBe(true);
            expect(document.activeElement.id).toBe('keep');
            expect(p.panel.getAttribute('role')).toBe('tooltip');
            expect(btn.hasAttribute('aria-haspopup')).toBe(false);
            expect(btn.getAttribute('aria-describedby')).toBe(p.panel.id);
            p.setOptions({content: 'new'});
            expect(p.panel.querySelector('.dm-popover-body').textContent).toBe('new');
        });
    });

    describe('destroy', () => {
        it('removes the panel, listeners and ARIA', () => {
            const p = E.popover(btn, {content: 'x', animation: false});
            p.show();
            const panel = p.panel;
            p.destroy();
            expect(document.body.contains(panel)).toBe(false);
            expect(btn.hasAttribute('aria-haspopup')).toBe(false);
            expect(btn.hasAttribute('aria-expanded')).toBe(false);
            expect(btn.hasAttribute('aria-controls')).toBe(false);
            expect(btn.classList.contains('dm-popover-trigger')).toBe(false);
            btn.click();
            expect(p.isOpen()).toBe(false);
            expect(document.querySelector('.dm-popover')).toBeNull();
            expect(Popover.openPopovers()).toEqual([]);
            expect(Popover.getInstance(btn)).toBeNull();
        });

        it('removes the document listeners once nothing is open', () => {
            const add = vi.spyOn(document, 'addEventListener');
            const remove = vi.spyOn(document, 'removeEventListener');
            const p = make(btn, {content: 'x'});
            p.show();
            const bound = add.mock.calls.filter(([t]) => ['pointerdown', 'keydown', 'focusin'].includes(t)).length;
            p.hide();
            const unbound = remove.mock.calls.filter(([t]) => ['pointerdown', 'keydown', 'focusin'].includes(t)).length;
            expect(bound).toBe(3);
            expect(unbound).toBe(3);
            vi.restoreAllMocks();
        });

        it('a second popover on the same trigger replaces the first', () => {
            const a = make(btn, {content: 'a'});
            const b = make(btn, {content: 'b'});
            expect(Popover.getInstance(btn)).toBe(b);
            btn.click();
            expect(a.isOpen()).toBe(false);
            expect(b.isOpen()).toBe(true);
        });
    });

    describe('scan()', () => {
        it('turns data-popover markup into popovers, once', () => {
            document.body.insertAdjacentHTML('beforeend', `
                <section id="scan-root">
                    <button id="s1" data-popover="Plain text" data-popover-title="Title"
                            data-popover-placement="top" data-popover-dismissible>One</button>
                    <span id="s2" data-popover="Hover me" data-popover-trigger="hover">Two</span>
                    <button id="s3" data-popover-content="#tpl">Three</button>
                    <template id="tpl"><strong>Rich</strong> content</template>
                </section>`);
            const found = E.popover.scan('#scan-root');
            made.push(...found);
            expect(found).toHaveLength(3);
            expect(E.popover.scan('#scan-root')).toHaveLength(0);

            const one = E.popover.getInstance('#s1');
            expect(one.options.title).toBe('Title');
            expect(one.options.placement).toBe('top');
            expect(one.options.dismissible).toBe(true);
            one.show();
            expect(one.panel.querySelector('.dm-popover-body').textContent).toBe('Plain text');

            expect(E.popover.getInstance('#s2').options.trigger).toBe('hover');

            const three = E.popover.getInstance('#s3');
            three.show();
            expect(three.panel.querySelector('strong').textContent).toBe('Rich');
            // The template is cloned, not consumed.
            expect(document.getElementById('tpl').content.querySelector('strong')).not.toBeNull();

            // Registered like any other instance.
            expect(E.get(document.getElementById('s1'))).toBe(one);
        });

        it('never treats data-popover as HTML', () => {
            document.body.insertAdjacentHTML('beforeend',
                '<button id="x1" data-popover="<img src=x onerror=alert(1)>">X</button>');
            const [p] = E.popover.scan(document.body);
            made.push(p);
            p.show();
            expect(p.panel.querySelector('img')).toBeNull();
        });
    });

    it('works through $.setup as component: popover', () => {
        Domma.setup({'#pop-btn': {component: 'popover', options: {content: 'from setup', animation: false}}});
        const p = Popover.getInstance(btn);
        made.push(p);
        btn.click();
        expect(p.isOpen()).toBe(true);
        expect(p.panel.textContent).toContain('from setup');
    });
});
