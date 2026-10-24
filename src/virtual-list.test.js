// src/virtual-list.test.js - E.virtualList
import {afterEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

const E = Domma.elements;

const made = [];
const keep = (x) => { made.push(x); return x; };

/** A scroll container `height` px tall (jsdom has no layout, so it is told). */
function host(height = 400, id = 'vl') {
    document.body.innerHTML = `<div id="${id}"><p class="original">Nothing yet</p></div>`;
    const el = document.getElementById(id);
    Object.defineProperty(el, 'clientHeight', {configurable: true, get: () => height});
    return el;
}

const rows = (el) => el.querySelectorAll('.dm-vlist-row');
const range = (n, f = (i) => ({id: i, label: `Row ${i}`})) => Array.from({length: n}, (_, i) => f(i));
const key = (el, k) => el.dispatchEvent(new KeyboardEvent('keydown', {key: k, bubbles: true, cancelable: true}));
const tick = () => new Promise(r => setTimeout(r, 0));
const frame = () => new Promise(r => setTimeout(r, 40));

/** Scroll and run the frame the scroll handler queued. */
async function scrollTo(el, top) {
    el.scrollTop = top;
    el.dispatchEvent(new Event('scroll'));
    await frame();
}

afterEach(() => {
    while (made.length) {
        try { made.pop().destroy(); } catch { /* already gone */ }
    }
    document.body.innerHTML = '';
    vi.restoreAllMocks();
});

describe('E.virtualList: rendering', () => {
    it('returns null for a selector that matches nothing', () => {
        expect(E.virtualList('#nope')).toBeNull();
    });

    it('100,000 fixed-height rows: only the window (plus overscan) is in the DOM', async () => {
        const el = host(400);
        const items = range(100000);
        const vl = keep(E.virtualList(el, {items, itemHeight: 40, overscan: 3}));
        expect(vl.element).toBe(el);
        expect(E.get(el)).toBe(vl);
        // 400 / 40 = 10 visible + 3 below
        expect(rows(el).length).toBe(13);
        expect(el.querySelector('.dm-vlist-spacer').style.height).toBe('4000000px');

        await scrollTo(el, 2000000); // the middle
        const list = rows(el);
        expect(list.length).toBeLessThanOrEqual(16);
        expect(vl.getVisibleRange()).toEqual({start: 50000, end: 50009});
        const first = [...list].find(r => r.dataset.index === '50000');
        expect(first.textContent).toBe('Row 50000');
        expect(first.style.transform).toBe('translateY(2000000px)');
        expect(first.getAttribute('aria-posinset')).toBe('50001');
        expect(first.getAttribute('aria-setsize')).toBe('100000');
        expect(first.getAttribute('role')).toBe('listitem');

        await scrollTo(el, 3999600); // the end
        expect(rows(el).length).toBeLessThanOrEqual(16);
        expect(vl.getVisibleRange().end).toBe(99999);
    });

    it('count + getItem serves rows lazily', () => {
        const el = host(200);
        const getItem = vi.fn(i => `Item ${i}`);
        keep(E.virtualList(el, {count: 1e6, getItem, itemHeight: 20, overscan: 0}));
        expect(rows(el).length).toBe(10);
        expect(getItem.mock.calls.length).toBeLessThan(100);
        expect(rows(el)[0].textContent).toBe('Item 0');
    });

    it('render() strings are sanitised; Elements go in as they are; safe: false trusts strings', () => {
        const el = host(100);
        const vl = keep(E.virtualList(el, {
            items: [{t: '<b>bold</b><img src=x onerror="alert(1)">'}],
            itemHeight: 30,
            render: (item) => item.t
        }));
        const row = rows(el)[0];
        expect(row.querySelector('b').textContent).toBe('bold');
        expect(row.querySelector('img').hasAttribute('onerror')).toBe(false);

        vl.setOptions({render: () => { const s = document.createElement('span'); s.dataset.x = '1'; return s; }});
        expect(rows(el)[0].querySelector('span[data-x="1"]')).not.toBeNull();

        vl.setOptions({safe: false, render: () => '<span data-raw="1">raw</span>'});
        expect(rows(el)[0].querySelector('[data-raw]')).not.toBeNull();
    });

    it('fires render(range) and scroll(visible) through the option, .on() and dm:virtual-list:*', async () => {
        const el = host(400);
        const onScroll = vi.fn();
        const vl = keep(E.virtualList(el, {items: range(1000), itemHeight: 40, overscan: 2, onScroll}));
        const viaOn = vi.fn();
        const viaDom = vi.fn();
        vl.on('render', viaOn);
        el.addEventListener('dm:virtual-list:render', viaDom);
        await scrollTo(el, 400);
        expect(onScroll).toHaveBeenCalledWith({start: 10, end: 19});
        expect(viaOn).toHaveBeenCalledWith({start: 8, end: 21});
        expect(viaDom.mock.calls[0][0].detail.args[0]).toEqual({start: 8, end: 21});
    });

    it('keyField reuses row elements across re-renders', () => {
        const el = host(200);
        const items = range(50);
        const vl = keep(E.virtualList(el, {items, keyField: 'id', itemHeight: 20}));
        const before = rows(el)[3];
        vl.setItems(items.slice());
        expect(rows(el)[3]).toBe(before);
        vl.update(3, {id: 3, label: 'Changed'});
        expect(rows(el)[3]).toBe(before);
        expect(before.textContent).toBe('Changed');
        vl.update('missing', {id: 'x'}); // unknown key: nothing
        vl.update(vl.indexOfKey(4), {id: 4, label: 'By key'});
        expect(rows(el)[4].textContent).toBe('By key');
    });
});

describe('E.virtualList: data changes', () => {
    it('append and setItems', () => {
        const el = host(200);
        const vl = keep(E.virtualList(el, {items: range(3), itemHeight: 20}));
        expect(rows(el).length).toBe(3);
        vl.append(range(5, i => `n${i}`));
        expect(vl.count).toBe(8);
        expect(rows(el).length).toBe(8);
        vl.setItems([]);
        expect(rows(el).length).toBe(0);
    });

    it('prepend keeps the visible rows in place', async () => {
        const el = host(200);
        const vl = keep(E.virtualList(el, {items: range(100), keyField: 'id', itemHeight: 20}));
        await scrollTo(el, 400);
        expect(vl.getVisibleRange().start).toBe(20);
        vl.prepend(range(10, i => ({id: `new${i}`, label: `New ${i}`})));
        expect(el.scrollTop).toBe(600);
        expect(vl.getVisibleRange().start).toBe(30);
        const row = [...rows(el)].find(r => r.dataset.index === '30');
        expect(row.textContent).toBe('Row 20');
    });

    it('scrollToIndex aligns start, center, end and auto', () => {
        const el = host(200);
        const vl = keep(E.virtualList(el, {items: range(1000), itemHeight: 20}));
        vl.scrollToIndex(500, {align: 'start'});
        expect(el.scrollTop).toBe(10000);
        vl.scrollToIndex(500, {align: 'end'});
        expect(el.scrollTop).toBe(10020 - 200);
        vl.scrollToIndex(500, {align: 'center'});
        expect(el.scrollTop).toBe(10010 - 100);
        vl.scrollToIndex(502, {align: 'auto'}); // already in view: no move
        expect(el.scrollTop).toBe(9910);
        vl.scrollToIndex(0);
        expect(el.scrollTop).toBe(0);
        expect([...rows(el)].some(r => r.dataset.index === '0')).toBe(true);
    });

    it("itemHeight 'auto' uses measured heights and estimated ones for the rest", () => {
        const el = host(200);
        // jsdom has no layout: report heights from the content.
        vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function () {
            return this.classList?.contains('dm-vlist-row') ? (Number(this.dataset.index) % 2 ? 60 : 20) : 0;
        });
        const vl = keep(E.virtualList(el, {items: range(1000), itemHeight: 'auto', estimatedItemHeight: 40, overscan: 0}));
        // Rows 0..: 20, 60, 20, 60 ... fill 200px with about 5 rows
        const r = vl.getVisibleRange();
        expect(r.start).toBe(0);
        expect(r.end).toBeGreaterThanOrEqual(4);
        const third = [...rows(el)].find(x => x.dataset.index === '2');
        expect(third.style.transform).toBe('translateY(80px)');
        // measured 1000 rows are not: the total is measured + estimated
        const spacer = parseFloat(el.querySelector('.dm-vlist-spacer').style.height);
        expect(spacer).toBeGreaterThan(39000);
        expect(spacer).toBeLessThan(40100);
    });
});

describe('E.virtualList: keyboard and focus', () => {
    it('one tab stop; arrows / Home / End / PageDown move focus; Enter fires itemclick', () => {
        const el = host(200);
        const onItemClick = vi.fn();
        const items = range(1000);
        const vl = keep(E.virtualList(el, {items, itemHeight: 20, onItemClick}));
        const stops = [...rows(el)].filter(r => r.tabIndex === 0);
        expect(stops.length).toBe(1);
        stops[0].focus();
        key(stops[0], 'ArrowDown');
        expect(document.activeElement.dataset.index).toBe('1');
        key(document.activeElement, 'End');
        expect(document.activeElement.dataset.index).toBe('999');
        expect(el.scrollTop).toBe(20000 - 200);
        key(document.activeElement, 'Home');
        expect(document.activeElement.dataset.index).toBe('0');
        key(document.activeElement, 'PageDown');
        expect(Number(document.activeElement.dataset.index)).toBeGreaterThan(5);
        key(document.activeElement, 'ArrowUp');
        const at = Number(document.activeElement.dataset.index);
        key(document.activeElement, 'Enter');
        expect(onItemClick).toHaveBeenCalledWith(items[at], at, expect.any(KeyboardEvent));
        expect([...rows(el)].filter(r => r.tabIndex === 0).length).toBe(1);
        expect(vl.getRenderedRange().end).toBeLessThan(40);
    });

    it('the focused row stays rendered when it is scrolled far away', async () => {
        const el = host(200);
        const vl = keep(E.virtualList(el, {items: range(10000), itemHeight: 20}));
        vl.focusIndex(2);
        const focused = document.activeElement;
        await scrollTo(el, 100000);
        expect(document.activeElement).toBe(focused);
        expect(focused.isConnected).toBe(true);
        expect(rows(el).length).toBeLessThan(25);
        key(focused, 'ArrowDown'); // brings the row back into view
        expect(document.activeElement.dataset.index).toBe('3');
        expect(el.scrollTop).toBeLessThan(100);
    });

    it('focus moves to the list when the focused row is removed', () => {
        const el = host(200);
        const vl = keep(E.virtualList(el, {items: range(10), keyField: 'id', itemHeight: 20}));
        vl.focusIndex(5);
        vl.setItems([]);
        expect(document.activeElement).toBe(el.querySelector('.dm-vlist-items'));
    });

    it('arrow keys inside an input in a row are left alone', () => {
        const el = host(200);
        keep(E.virtualList(el, {items: range(10), itemHeight: 30, render: () => {
            const i = document.createElement('input');
            return i;
        }}));
        const input = el.querySelector('input');
        input.focus();
        const ev = new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true, cancelable: true});
        input.dispatchEvent(ev);
        expect(ev.defaultPrevented).toBe(false);
        expect(document.activeElement).toBe(input);
    });

    it('click fires itemclick with the item, index and event', () => {
        const el = host(200);
        const items = range(10);
        const vl = keep(E.virtualList(el, {items, itemHeight: 20}));
        const seen = vi.fn();
        vl.on('itemclick', seen);
        rows(el)[4].click();
        expect(seen).toHaveBeenCalledWith(items[4], 4, expect.any(MouseEvent));
    });
});

describe('E.virtualList: infinite loading', () => {
    it('loads when near the end, never twice at once, and stops on done', async () => {
        const el = host(200);
        let calls = 0;
        let release;
        const loadMore = vi.fn(() => {
            calls += 1;
            return new Promise(r => { release = r; });
        });
        const onEnd = vi.fn();
        const onLoaded = vi.fn();
        const vl = keep(E.virtualList(el, {itemHeight: 20, loadMore, threshold: 100, onEnd, onLoaded}));
        expect(calls).toBe(1); // empty list: within the threshold at once
        expect(el.querySelector('.dm-vlist-status').hidden).toBe(false);
        expect(el.querySelector('.dm-vlist-items').getAttribute('aria-busy')).toBe('true');
        vl.refresh();
        await scrollTo(el, 0);
        expect(calls).toBe(1); // still pending: no duplicate

        release(range(30));
        await tick();
        expect(onLoaded).toHaveBeenCalledWith(range(30));
        expect(vl.count).toBe(30);
        expect(rows(el)[0].getAttribute('aria-setsize')).toBe('-1');
        // 30 rows = 600px, viewport 200, threshold 100: not near the end yet
        expect(calls).toBe(1);
        await scrollTo(el, 350);
        expect(calls).toBe(2);
        release({items: range(5, i => ({id: 100 + i})), done: true});
        await tick();
        expect(vl.count).toBe(35);
        expect(vl.isDone()).toBe(true);
        expect(onEnd).toHaveBeenCalledTimes(1);
        expect(rows(el)[0].getAttribute('aria-setsize')).toBe('35');
        await scrollTo(el, 600);
        expect(calls).toBe(2);
    });

    it('an empty page means done; an error shows a retry row that loads again', async () => {
        const el = host(200);
        let fail = true;
        const onError = vi.fn();
        const loadMore = vi.fn(() => (fail ? Promise.reject(new Error('offline')) : Promise.resolve([])));
        const vl = keep(E.virtualList(el, {itemHeight: 20, loadMore, onError}));
        await tick();
        expect(onError).toHaveBeenCalledWith(expect.objectContaining({message: 'offline'}));
        const status = el.querySelector('.dm-vlist-status');
        expect(status.dataset.state).toBe('error');
        const retry = status.querySelector('[data-vlist-retry]');
        expect(retry).not.toBeNull();
        await scrollTo(el, 0);
        expect(loadMore).toHaveBeenCalledTimes(1); // no automatic retry loop
        fail = false;
        retry.click();
        await tick();
        expect(loadMore).toHaveBeenCalledTimes(2);
        expect(vl.isDone()).toBe(true);
        expect(status.hidden).toBe(true); // no end template by default
    });

    it('custom templates and the loadmore event', async () => {
        const el = host(200);
        const onLoadMore = vi.fn();
        keep(E.virtualList(el, {
            itemHeight: 20,
            loadMore: () => Promise.resolve({items: [], done: true}),
            loadingTemplate: '<em>Fetching</em>',
            endTemplate: () => 'All caught up',
            onLoadMore
        }));
        const status = el.querySelector('.dm-vlist-status');
        expect(status.querySelector('em').textContent).toBe('Fetching');
        expect(onLoadMore).toHaveBeenCalledWith({count: 0, page: 0});
        await tick();
        expect(status.textContent).toBe('All caught up');
        expect(status.dataset.state).toBe('end');
    });

    it('setItems during a load discards the stale page', async () => {
        const el = host(200);
        let release;
        const vl = keep(E.virtualList(el, {itemHeight: 20, loadMore: () => new Promise(r => { release = r; })}));
        const first = release;
        vl.setItems(range(100));
        first(range(5, i => ({id: `stale${i}`})));
        await tick();
        expect(vl.count).toBe(100);
    });
});

describe('E.virtualList: destroy', () => {
    it('removes what it added, restores the original children and stops listening', async () => {
        const el = host(200);
        const vl = E.virtualList(el, {items: range(100), itemHeight: 20, label: 'Results'});
        expect(el.querySelector('.dm-vlist-items').getAttribute('aria-label')).toBe('Results');
        const onScroll = vi.fn();
        vl.on('scroll', onScroll);
        vl.destroy();
        expect(el.className).toBe('');
        expect(el.children.length).toBe(1);
        expect(el.querySelector('.original').textContent).toBe('Nothing yet');
        await scrollTo(el, 300);
        expect(onScroll).not.toHaveBeenCalled();
        expect(E.get(el, 'virtual-list')).toBeUndefined();
    });
});
