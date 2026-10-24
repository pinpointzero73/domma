// src/components-light.test.js - tooltip, badge, numberBadge, loader, backToTop, card, and the <domma-*> tags
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';
import {instanceOf} from './component.js';
import {registerComponents} from './web-components/index.js';

const E = Domma.elements;

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
});

describe('E.tooltip', () => {
    it('initialises EVERY match of a selector and returns the first with all()', () => {
        document.body.innerHTML = '<div id="bar"><a data-tooltip="One">1</a><a data-tooltip="Two">2</a><a data-tooltip="Three">3</a></div>';
        const first = E.tooltip('#bar [data-tooltip]', {placement: 'bottom'});
        const links = [...document.querySelectorAll('#bar a')];
        expect(first.element).toBe(links[0]);
        expect(Object.keys(first)).not.toContain('all');
        expect(first.all().map(t => t.element)).toEqual(links);
        for (const link of links) expect(E.get(link, 'tooltip').options.position).toBe('bottom');
    });

    it('shows a page-level bubble at the target, nothing wraps the target', () => {
        document.body.innerHTML = '<p><button id="b" data-tooltip="Hello">B</button></p>';
        const btn = document.getElementById('b');
        const parent = btn.parentNode;
        const tip = E.tooltip(btn);
        btn.dispatchEvent(new MouseEvent('mouseenter'));
        const bubble = document.querySelector('body > .domma-tooltip');
        expect(bubble.textContent).toBe('Hello');
        expect(bubble.getAttribute('role')).toBe('tooltip');
        expect(btn.getAttribute('aria-describedby')).toBe(bubble.id);
        expect(btn.parentNode).toBe(parent);
        expect(tip.isVisible()).toBe(true);

        btn.dispatchEvent(new MouseEvent('mouseleave'));
        vi.advanceTimersByTime(200);
        expect(document.querySelector('.domma-tooltip')).toBeNull();
        expect(btn.hasAttribute('aria-describedby')).toBe(false);
    });

    it('a second call on the same element updates it rather than doubling it; delay {show, hide} is read', () => {
        document.body.innerHTML = '<button id="b">B</button>';
        const a = E.tooltip('#b', {content: 'One'});
        const b = E.tooltip('#b', {content: 'Two', delay: {show: 250, hide: 50}});
        expect(b).toBe(a);
        expect(a.options.delay).toBe(250);
        expect(a.options.hideDelay).toBe(50);
        a.show();
        expect(a.isVisible()).toBe(false);
        vi.advanceTimersByTime(260);
        expect(document.querySelector('.domma-tooltip').textContent).toBe('Two');
    });

    it('html content is sanitised; a title is held aside and given back on destroy', () => {
        document.body.innerHTML = '<button id="b" title="From title">B</button>';
        const t = E.tooltip('#b', {});
        expect(document.getElementById('b').hasAttribute('title')).toBe(false);
        t.show();
        expect(document.querySelector('.domma-tooltip').textContent).toBe('From title');
        t.setOptions({content: '<b>x</b><img src=x onerror="alert(1)">', html: true});
        expect(document.querySelector('.domma-tooltip b')).not.toBeNull();
        expect(document.querySelector('.domma-tooltip img')?.hasAttribute('onerror') ?? false).toBe(false);
        t.destroy();
        expect(document.getElementById('b').getAttribute('title')).toBe('From title');
        expect(document.querySelector('.domma-tooltip')).toBeNull();
    });

    it('onShow / dm:tooltip:show; no match returns null', () => {
        document.body.innerHTML = '<button id="b">B</button>';
        const onShow = vi.fn();
        const dm = vi.fn();
        const t = E.tooltip('#b', {content: 'x', onShow});
        t.element.addEventListener('dm:tooltip:show', dm);
        t.show();
        expect(onShow).toHaveBeenCalledWith(t);
        expect(dm).toHaveBeenCalledTimes(1);
        expect(E.tooltip('.none')).toBeNull();
    });
});

describe('E.badge / E.numberBadge', () => {
    it('badge classes on the element; one click event per click; remove', () => {
        document.body.innerHTML = '<span id="b">JS</span>';
        const onClick = vi.fn();
        const onRemove = vi.fn();
        const badge = E.badge('#b', {variant: 'success', size: 'small', pill: true, outline: true, removable: true, onClick, onRemove});
        const el = document.getElementById('b');
        expect([...el.classList]).toEqual(expect.arrayContaining(['badge', 'badge-outline', 'badge-outline-success', 'badge-sm', 'badge-pill']));
        const native = vi.fn();
        el.addEventListener('click', native);
        el.click();
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(native).toHaveBeenCalledTimes(1);

        badge.setVariant('danger').setText('TS');
        expect(el.classList.contains('badge-outline-danger')).toBe(true);
        expect(el.classList.contains('badge-outline-success')).toBe(false);
        expect(el.firstChild.textContent).toBe('TS');

        el.querySelector('.domma-badge-remove').click();
        expect(onRemove).toHaveBeenCalledWith(badge, expect.any(Event));
        expect(el.isConnected).toBe(false);
    });

    it('numberBadge adds a positioned counter inside the target', () => {
        document.body.innerHTML = '<button id="n">Inbox</button>';
        const onChange = vi.fn();
        const nb = E.numberBadge('#n', {count: 3, variant: 'primary', onChange});
        const btn = document.getElementById('n');
        const counter = btn.querySelector(':scope > .badge-counter');
        expect(nb.element).toBe(btn);
        expect(btn.classList.contains('badge-counter-host')).toBe(true);
        expect(counter.textContent).toBe('3');
        expect(counter.classList.contains('badge-counter-primary')).toBe(true);

        nb.increment(2);
        expect(nb.getCount()).toBe(5);
        expect(onChange).toHaveBeenCalledWith(5, 3, nb);
        nb.setCount(0);
        expect(counter.classList.contains('badge-counter-hidden')).toBe(true);
        nb.setDot(true);
        expect(counter.classList.contains('badge-dot')).toBe(true);
        nb.destroy();
        expect(btn.querySelector('.badge-counter')).toBeNull();
        expect(btn.textContent).toBe('Inbox');
    });
});

describe('E.loader family', () => {
    it('appends an indicator to the container, which stays the instance element', () => {
        document.body.innerHTML = '<div id="c"><p>content</p></div>';
        const c = document.getElementById('c');
        const loader = E.loader(c, {type: 'dots', color: 'success', size: 'large', text: 'Wait'});
        const ind = c.querySelector('.dm-loader');
        expect(loader.element).toBe(c);
        expect(ind.querySelectorAll('.dm-loader-anim-dots span')).toHaveLength(3);
        expect(ind.style.getPropertyValue('--dm-loader-color')).toBe('var(--dm-success)');
        expect(ind.style.getPropertyValue('--dm-loader-size')).toBe('64px');
        expect(ind.querySelector('.dm-loader-text').textContent).toBe('Wait');
        loader.hide();
        expect(ind.hidden).toBe(true);
        loader.destroy();
        expect(c.querySelector('.dm-loader')).toBeNull();
        expect(c.querySelector('p')).not.toBeNull();
    });

    it("centered: 'false' (a string) is false; showLoader / hideLoader reuse the instance", () => {
        document.body.innerHTML = '<div id="c"></div>';
        const l = E.loader('#c', {centered: 'false'});
        expect(l.indicator.classList.contains('dm-loader-centered')).toBe(false);
        expect(E.hideLoader('#c')).toBe(l);
        expect(l.isVisible()).toBe(false);
        expect(E.showLoader('#c')).toBe(l);
        expect(l.isVisible()).toBe(true);
        expect(document.querySelectorAll('#c .dm-loader')).toHaveLength(1);
    });

    it('fullscreenLoader(text, opts) shows one overlay that hideLoader hides', () => {
        const a = E.fullscreenLoader('Saving', {type: 'bars'});
        const b = E.fullscreenLoader('Still saving');
        expect(b).toBe(a);
        const box = document.getElementById('dm-loader-fullscreen');
        expect(box.querySelectorAll('.dm-loader')).toHaveLength(1);
        expect(box.querySelector('.dm-loader-text').textContent).toBe('Still saving');
        E.hideLoader('#dm-loader-fullscreen');
        expect(box.style.display).toBe('none');
    });
});

describe('E.backToTop and E.card', () => {
    it('backToTop adds one themed button to the body; a passed button is used as it is', () => {
        const btt = E.backToTop('body', {showAfter: 100, position: 'bottom-left', offset: 24});
        const btn = btt.getButton();
        expect(btn.parentElement).toBe(document.body);
        expect(btn.classList.contains('dm-back-to-top')).toBe(true);
        expect(btn.style.left).toBe('24px');
        btt.show();
        expect(btn.classList.contains('show')).toBe(true);
        btt.destroy();
        expect(btn.isConnected).toBe(false);

        document.body.insertAdjacentHTML('beforeend', '<button id="top">Top</button>');
        const own = E.backToTop('#top');
        expect(own.element).toBe(document.getElementById('top'));
    });

    it('card content is sanitised like $().html(), safe: false keeps it; onClick gets the card', () => {
        document.body.innerHTML = '<div id="c"></div>';
        const onClick = vi.fn();
        const card = E.card('#c', {title: 'T', content: '<p>a</p><img src=x onerror="x()">', onClick});
        const el = document.getElementById('c');
        expect(el.querySelector('.card-header .card-title').textContent).toBe('T');
        expect(el.querySelector('.card-body p').textContent).toBe('a');
        expect(el.querySelector('img')?.hasAttribute('onerror') ?? false).toBe(false);
        card.setContent('<span data-x="1">t</span>', {safe: false});
        expect(el.querySelector('.card-body span').dataset.x).toBe('1');
        el.querySelector('.card-body').click();
        expect(onClick).toHaveBeenCalledWith(card, expect.any(Event));
    });
});

describe('<domma-*> tags are shells over the same implementation', () => {
    it('registers once and only when asked, and does nothing without customElements', () => {
        registerComponents();
        registerComponents();
        expect(customElements.get('domma-badge')).toBeTypeOf('function');
        expect(customElements.get('domma-tooltip')).toBeTypeOf('function');
    });

    it('<domma-badge> renders as a light-DOM badge with its children, and its methods chain', () => {
        registerComponents();
        document.body.innerHTML = '<domma-badge id="b" variant="success" pill><span class="ic"></span> New</domma-badge>';
        const tag = document.getElementById('b');
        const inst = instanceOf(tag, 'badge');
        expect(inst).not.toBeNull();
        expect(E.get(tag)).toBe(inst);
        expect(tag.shadowRoot).toBeNull();
        expect(tag.classList.contains('badge-success')).toBe(true);
        expect(tag.classList.contains('badge-pill')).toBe(true);
        expect(tag.querySelector('.ic')).not.toBeNull();
        expect(tag.setVariant('danger').setText('Gone')).toBe(tag);
        expect(tag.classList.contains('badge-danger')).toBe(true);
        tag.setAttribute('variant', 'info');
        expect(tag.classList.contains('badge-info')).toBe(true);
    });

    it('<domma-tooltip> shows its content attribute as text ("123" stays a string)', () => {
        registerComponents();
        document.body.innerHTML = '<domma-tooltip id="t" content="123" position="bottom"><button>i</button></domma-tooltip>';
        const tag = document.getElementById('t');
        tag.show();
        const bubble = document.querySelector('.domma-tooltip');
        expect(bubble.textContent).toBe('123');
        expect(instanceOf(tag, 'tooltip').options.content).toBe('123');
        tag.setContent('Changed');
        expect(bubble.textContent).toBe('Changed');
        expect(tag.isVisible()).toBe(true);
    });

    it('<domma-number-badge>, <domma-loader> and moving a tag keeps its instance', () => {
        registerComponents();
        document.body.innerHTML = '<div id="a"><domma-number-badge id="n" count="4"><button>B</button></domma-number-badge></div>' +
            '<domma-loader id="l" type="bars" visible="false"></domma-loader><div id="z"></div>';
        const n = document.getElementById('n');
        expect(n.querySelector('.badge-counter').textContent).toBe('4');
        n.increment();
        expect(n.getCount()).toBe(5);
        const inst = instanceOf(n, 'number-badge');
        document.getElementById('z').appendChild(n);
        expect(instanceOf(n, 'number-badge')).toBe(inst);
        expect(n.querySelectorAll('.badge-counter')).toHaveLength(1);

        const l = document.getElementById('l');
        expect(l.isVisible()).toBe(false);
        l.show();
        expect(l.querySelector('.dm-loader-anim-bars')).not.toBeNull();
        expect(l.isVisible()).toBe(true);
    });
});

describe('calling E.* twice on one element', () => {
    it('updates the one instance instead of stacking a second', () => {
        document.body.innerHTML = '<div id="c" class="card"><div class="card-header">H</div><div class="card-body">B</div></div>';
        const a = E.card('#c', {collapsible: true});
        const b = E.card('#c', {collapsible: true});
        expect(b).toBe(a);
        document.querySelector('#c .card-header').click();
        expect(a.isCollapsed()).toBe(true);
        expect(document.querySelectorAll('#c .card-collapse-icon')).toHaveLength(1);

        document.body.insertAdjacentHTML('beforeend', '<button id="n">N</button>');
        const n1 = E.numberBadge('#n', {count: 1});
        const n2 = E.numberBadge('#n', {count: 2});
        expect(n2).toBe(n1);
        expect(document.querySelectorAll('#n .badge-counter')).toHaveLength(1);
        expect(n1.getCount()).toBe(2);
    });

    it('a modal hidden with style="display: none" shows when opened', () => {
        document.body.innerHTML = '<div id="m" class="modal" style="display: none"><p>x</p></div>';
        const m = E.modal('#m', {animation: false});
        m.open();
        expect(document.getElementById('m').style.display).toBe('');
        expect(document.getElementById('m').classList.contains('dm-modal-visible')).toBe(true);
    });
});

describe('review follow-ups', () => {
    it('a tooltip whose target leaves the page takes its bubble with it', async () => {
        document.body.innerHTML = '<div id="row"><button id="tb" title="Delete">x</button></div>';
        const t = Domma.elements.tooltip('#tb', {content: 'Delete'});
        t.open();
        expect(document.querySelectorAll('.dm-tooltip, [role="tooltip"]').length).toBeGreaterThan(0);
        document.getElementById('row').innerHTML = '<button>new</button>';
        await Promise.resolve(); // MutationObserver callbacks are microtasks
        await vi.runAllTimersAsync();
        expect(t.isVisible()).toBe(false);
    });

    it("a modal's onBeforeClose cannot stop destroy()", () => {
        const m = Domma.elements.modal({title: 'Guarded', onBeforeClose: () => false});
        const closed = vi.fn();
        m.on('close', closed);
        m.open();
        m.close();
        expect(m.isOpen()).toBe(true);
        m.destroy();
        expect(closed).toHaveBeenCalledTimes(1);
    });

    it('E.tooltip on several matches is the first instance, not an array', () => {
        document.body.innerHTML = '<i data-tooltip="a"></i><i data-tooltip="b"></i>';
        const t = Domma.elements.tooltip('[data-tooltip]');
        expect(t.all().length).toBe(2);
        expect(t.length).toBeUndefined();
        expect(t[1]).toBeUndefined();
        expect(Domma.elements.tooltip('#none')).toBeNull();
        expect(Domma.elements.tooltip.all('#none')).toEqual([]);
    });
});
