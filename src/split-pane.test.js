// src/split-pane.test.js - E.splitPane
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';

const E = Domma.elements;
const S = Domma.storage;

const made = [];
const keep = (x) => { made.push(x); return x; };

/** A container of `n` panes that reports `width` x `height` px. */
function host(n = 2, {width = 1008, height = 508, id = 'sp'} = {}) {
    document.body.innerHTML = `<div id="${id}">${Array.from({length: n}, (_, i) => `<div class="p${i}" style="color: red">Pane ${i}</div>`).join('')}</div>`;
    const el = document.getElementById(id);
    el.getBoundingClientRect = () => ({width, height, top: 0, left: 0, right: width, bottom: height, x: 0, y: 0});
    return el;
}

const pointer = (type, init = {}) => new MouseEvent(type, {bubbles: true, cancelable: true, button: 0, ...init});

function drag(sp, gutterIndex, fromX, toX, axis = 'clientX') {
    const g = sp.element.querySelectorAll(':scope > .dm-split-gutter')[gutterIndex];
    g.dispatchEvent(pointer('pointerdown', {[axis]: fromX}));
    g.dispatchEvent(pointer('pointermove', {[axis]: toX}));
    g.dispatchEvent(pointer('pointerup', {[axis]: toX}));
    return g;
}

const key = (el, k, extra = {}) => el.dispatchEvent(new KeyboardEvent('keydown', {key: k, bubbles: true, cancelable: true, ...extra}));

beforeEach(() => { S.clear?.(); });

afterEach(() => {
    while (made.length) {
        try { made.pop().destroy(); } catch { /* already gone */ }
    }
    document.body.innerHTML = '';
    vi.restoreAllMocks();
});

describe('E.splitPane: set-up', () => {
    it('returns null for a selector that matches nothing', () => {
        expect(E.splitPane('#nope')).toBeNull();
    });

    it('keeps the caller element, inserts n-1 gutters and gives equal sizes by default', () => {
        const el = host(3);
        const sp = keep(E.splitPane(el));
        expect(sp.element).toBe(el);
        expect(E.get(el)).toBe(sp);
        expect(el.classList.contains('dm-split-horizontal')).toBe(true);
        const gutters = el.querySelectorAll(':scope > .dm-split-gutter');
        expect(gutters.length).toBe(2);
        expect(el.children[1]).toBe(gutters[0]);
        expect(sp.getSizes().map(Math.round)).toEqual([33, 33, 33]);
        expect(sp.panes[0].style.flex).toContain('calc(');
    });

    it('scales given sizes to 100 and takes direction, gutterSize and cursor', () => {
        const el = host(2);
        const sp = keep(E.splitPane(el, {sizes: [1, 3], direction: 'vertical', gutterSize: 12, cursor: 'ns-resize'}));
        expect(sp.getSizes()).toEqual([25, 75]);
        const g = el.querySelector('.dm-split-gutter');
        expect(el.classList.contains('dm-split-vertical')).toBe(true);
        expect(g.style.flex).toBe('0 0 12px');
        expect(g.style.cursor).toBe('ns-resize');
        expect(g.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('gutters are focusable separators with aria values and aria-controls', () => {
        const el = host(2);
        keep(E.splitPane(el, {sizes: [40, 60], minSize: ['10%', '20%']}));
        const g = el.querySelector('.dm-split-gutter');
        expect(g.getAttribute('role')).toBe('separator');
        expect(g.tabIndex).toBe(0);
        expect(g.getAttribute('aria-orientation')).toBe('vertical');
        expect(g.getAttribute('aria-valuenow')).toBe('40');
        expect(g.getAttribute('aria-valuemin')).toBe('10');
        expect(g.getAttribute('aria-valuemax')).toBe('80');
        expect(g.getAttribute('aria-controls')).toBe(el.children[0].id);
    });

    it('calling it again updates the same instance', () => {
        const el = host(2);
        const a = keep(E.splitPane(el));
        const b = E.splitPane(el, {gutterSize: 4});
        expect(b).toBe(a);
        expect(el.querySelectorAll('.dm-split-gutter').length).toBe(1);
        expect(el.querySelector('.dm-split-gutter').style.flex).toBe('0 0 4px');
    });
});

describe('E.splitPane: dragging', () => {
    it('moves the boundary by the pointer delta and fires dragstart / drag / dragend through all three channels', () => {
        const el = host(2); // 1008 - 8 gutter = 1000 px shared
        const onDrag = vi.fn();
        const onDragEnd = vi.fn();
        const sp = keep(E.splitPane(el, {onDrag, onDragEnd}));
        const viaOn = vi.fn();
        const viaDom = vi.fn();
        sp.on('dragstart', viaOn);
        el.addEventListener('dm:split-pane:dragend', viaDom);
        drag(sp, 0, 500, 600);
        expect(sp.getSizes()).toEqual([60, 40]);
        expect(onDrag).toHaveBeenCalledWith([60, 40], 0);
        expect(onDragEnd).toHaveBeenCalledWith([60, 40], 0);
        expect(viaOn).toHaveBeenCalled();
        expect(viaDom).toHaveBeenCalledTimes(1);
        expect(el.classList.contains('dm-split-dragging')).toBe(false);
    });

    it('marks the container while dragging so panes (and iframes) stop taking pointer events', () => {
        const el = host(2);
        const sp = keep(E.splitPane(el));
        const g = el.querySelector('.dm-split-gutter');
        g.dispatchEvent(pointer('pointerdown', {clientX: 500}));
        expect(el.classList.contains('dm-split-dragging')).toBe(true);
        expect(g.classList.contains('is-dragging')).toBe(true);
        g.dispatchEvent(pointer('pointerup', {clientX: 500}));
        expect(el.classList.contains('dm-split-dragging')).toBe(false);
        expect(sp.getSizes()).toEqual([50, 50]);
    });

    it('beforedrag can cancel', () => {
        const el = host(2);
        const sp = keep(E.splitPane(el, {onBeforeDrag: () => false}));
        const onDragStart = vi.fn();
        sp.on('dragstart', onDragStart);
        drag(sp, 0, 500, 700);
        expect(onDragStart).not.toHaveBeenCalled();
        expect(sp.getSizes()).toEqual([50, 50]);

        const el2 = host(2, {id: 'sp2'});
        const sp2 = keep(E.splitPane(el2));
        el2.addEventListener('dm:split-pane:beforedrag', e => e.preventDefault());
        drag(sp2, 0, 500, 700);
        expect(sp2.getSizes()).toEqual([50, 50]);
    });

    it('respects px and % minimum and maximum sizes', () => {
        const el = host(2);
        const sp = keep(E.splitPane(el, {minSize: [100, '30%'], maxSize: ['65%', null]}));
        drag(sp, 0, 500, 0);
        expect(sp.getSizes()).toEqual([10, 90]);
        drag(sp, 0, 0, 1000);
        expect(sp.getSizes()).toEqual([65, 35]);
    });

    it('snaps to the minimum within snapOffset px', () => {
        const el = host(2);
        const sp = keep(E.splitPane(el, {minSize: 100, snapOffset: 30}));
        drag(sp, 0, 500, 120); // pane 0 would be 120px: within 30px of 100
        expect(sp.getSizes()).toEqual([10, 90]);
    });

    it('inverts horizontal movement in RTL', () => {
        const el = host(2);
        el.style.direction = 'rtl';
        const sp = keep(E.splitPane(el));
        drag(sp, 0, 500, 400); // moving left grows the first (right-hand) pane
        expect(sp.getSizes()).toEqual([60, 40]);
    });

    it('vertical splits follow clientY', () => {
        const el = host(2, {height: 1008});
        const sp = keep(E.splitPane(el, {direction: 'vertical'}));
        drag(sp, 0, 500, 300, 'clientY');
        expect(sp.getSizes()).toEqual([30, 70]);
    });

    it('disabled: no drag, no keys, gutters out of the tab order', () => {
        const el = host(2);
        const sp = keep(E.splitPane(el, {disabled: true}));
        const g = drag(sp, 0, 500, 800);
        key(g, 'ArrowRight');
        expect(sp.getSizes()).toEqual([50, 50]);
        expect(g.tabIndex).toBe(-1);
        expect(g.getAttribute('aria-disabled')).toBe('true');
        sp.setOptions({disabled: false});
        expect(g.tabIndex).toBe(0);
        key(g, 'ArrowRight');
        expect(sp.getSizes()).toEqual([51, 49]);
    });
});

describe('E.splitPane: keyboard', () => {
    it('arrow keys step 1% (10% with Shift); Home and End go to the limits', () => {
        const el = host(2);
        const onResize = vi.fn();
        const sp = keep(E.splitPane(el, {minSize: 100, onResize}));
        const g = el.querySelector('.dm-split-gutter');
        key(g, 'ArrowRight');
        expect(sp.getSizes()).toEqual([51, 49]);
        key(g, 'ArrowLeft', {shiftKey: true});
        expect(sp.getSizes()).toEqual([41, 59]);
        key(g, 'Home');
        expect(sp.getSizes()).toEqual([10, 90]);
        key(g, 'End');
        expect(sp.getSizes()).toEqual([90, 10]);
        expect(g.getAttribute('aria-valuenow')).toBe('90');
        expect(onResize).toHaveBeenCalledTimes(4);
    });

    it('vertical splits answer Up / Down, not Left / Right', () => {
        const el = host(2, {height: 1008});
        const sp = keep(E.splitPane(el, {direction: 'vertical'}));
        const g = el.querySelector('.dm-split-gutter');
        key(g, 'ArrowRight');
        expect(sp.getSizes()).toEqual([50, 50]);
        key(g, 'ArrowDown');
        expect(sp.getSizes()).toEqual([51, 49]);
    });

    it('Enter toggles collapse only when collapsible', () => {
        const el = host(2);
        const sp = keep(E.splitPane(el));
        const g = el.querySelector('.dm-split-gutter');
        key(g, 'Enter');
        expect(sp.isCollapsed(0)).toBe(false);
        sp.setOptions({collapsible: [false, true]});
        key(g, 'Enter');
        expect(sp.isCollapsed(1)).toBe(true);
        expect(sp.getSizes()).toEqual([100, 0]);
        key(g, 'Enter');
        expect(sp.isCollapsed(1)).toBe(false);
        expect(sp.getSizes()).toEqual([50, 50]);
    });
});

describe('E.splitPane: collapse / expand', () => {
    it('collapse(i) gives the space to the neighbour and expand(i) restores it, with events', () => {
        const el = host(3);
        const onCollapse = vi.fn();
        const onExpand = vi.fn();
        const sp = keep(E.splitPane(el, {sizes: [20, 50, 30], onCollapse, onExpand}));
        const dom = vi.fn();
        el.addEventListener('dm:split-pane:collapse', dom);
        sp.collapse(2);
        expect(sp.getSizes()).toEqual([20, 80, 0]);
        expect(sp.panes[2].classList.contains('dm-split-collapsed')).toBe(true);
        expect(onCollapse).toHaveBeenCalledWith(2);
        expect(dom).toHaveBeenCalledTimes(1);
        sp.collapse(2); // already collapsed: nothing
        expect(onCollapse).toHaveBeenCalledTimes(1);
        sp.expand(2);
        expect(sp.getSizes()).toEqual([20, 50, 30]);
        expect(onExpand).toHaveBeenCalledWith(2);
    });

    it('collapses to collapsedSize and double-click on the gutter toggles', () => {
        const el = host(2);
        const sp = keep(E.splitPane(el, {collapsible: true, collapsedSize: 50, minSize: 200}));
        const g = el.querySelector('.dm-split-gutter');
        g.dispatchEvent(new MouseEvent('dblclick', {bubbles: true}));
        expect(sp.isCollapsed(0)).toBe(true);
        expect(sp.getSizes()).toEqual([5, 95]);
        g.dispatchEvent(new MouseEvent('dblclick', {bubbles: true}));
        expect(sp.getSizes()).toEqual([50, 50]);
    });

    it('collapseButton adds a pointer-only button that toggles', () => {
        const el = host(2);
        const sp = keep(E.splitPane(el, {collapsible: [true, false], collapseButton: true}));
        const btn = el.querySelector('.dm-split-gutter .dm-split-toggle');
        expect(btn).not.toBeNull();
        expect(btn.tabIndex).toBe(-1);
        btn.click();
        expect(sp.isCollapsed(0)).toBe(true);
        btn.click();
        expect(sp.isCollapsed(0)).toBe(false);
    });

    it('dragging a collapsed pane opens it', () => {
        const el = host(2);
        const onExpand = vi.fn();
        const sp = keep(E.splitPane(el, {collapsible: true, onExpand}));
        sp.collapse(0);
        drag(sp, 0, 0, 300);
        expect(sp.isCollapsed(0)).toBe(false);
        expect(onExpand).toHaveBeenCalledWith(0);
        expect(sp.getSizes()).toEqual([30, 70]);
    });
});

describe('E.splitPane: setSizes, persistence, nesting, destroy', () => {
    it('setSizes clamps to the limits', () => {
        const el = host(2);
        const sp = keep(E.splitPane(el, {minSize: '20%'}));
        sp.setSizes([5, 95]);
        expect(sp.getSizes()).toEqual([20, 80]);
        sp.setSizes([70, 30]);
        expect(sp.getSizes()).toEqual([70, 30]);
    });

    it('persistKey stores sizes (and collapse state) with S and restores them', () => {
        let el = host(2);
        let sp = E.splitPane(el, {persistKey: 'editor', collapsible: true});
        drag(sp, 0, 500, 700);
        expect(S.get('split-pane:editor').sizes).toEqual([70, 30]);
        sp.collapse(1);
        sp.destroy();

        el = host(2);
        sp = keep(E.splitPane(el, {persistKey: 'editor', collapsible: true}));
        expect(sp.getSizes()).toEqual([100, 0]);
        expect(sp.isCollapsed(1)).toBe(true);
        sp.expand(1);
        expect(sp.getSizes()).toEqual([70, 30]);
    });

    it('ignores a stored value of the wrong shape', () => {
        S.set('split-pane:bad', {sizes: [10, 20, 70]});
        const sp = keep(E.splitPane(host(2), {persistKey: 'bad'}));
        expect(sp.getSizes()).toEqual([50, 50]);
    });

    it('nested split panes keep their own gutters and drags', () => {
        document.body.innerHTML = '<div id="outer"><div>Left</div><div id="inner"><div>Top</div><div>Bottom</div></div></div>';
        const outerEl = document.getElementById('outer');
        const innerEl = document.getElementById('inner');
        outerEl.getBoundingClientRect = () => ({width: 1008, height: 500});
        innerEl.getBoundingClientRect = () => ({width: 500, height: 1008});
        const outer = keep(E.splitPane(outerEl));
        const inner = keep(E.splitPane(innerEl, {direction: 'vertical'}));
        drag(inner, 0, 500, 600, 'clientY');
        expect(inner.getSizes()).toEqual([60, 40]);
        expect(outer.getSizes()).toEqual([50, 50]);
        expect(outerEl.querySelectorAll(':scope > .dm-split-gutter').length).toBe(1);
    });

    it('destroy removes gutters, listeners and classes and restores pane styles and ids', () => {
        const el = host(2);
        const sp = E.splitPane(el, {collapsible: true});
        const panes = sp.panes;
        const g = el.querySelector('.dm-split-gutter');
        const onResize = vi.fn();
        sp.on('resize', onResize);
        sp.destroy();
        expect(el.querySelector('.dm-split-gutter')).toBeNull();
        expect(el.className).toBe('');
        expect(panes[0].getAttribute('style')).toBe('color: red');
        expect(panes[0].hasAttribute('id')).toBe(false);
        expect(panes[0].className).toBe('p0');
        key(g, 'ArrowRight');
        expect(onResize).not.toHaveBeenCalled();
        expect(E.get(el, 'split-pane')).toBeUndefined();
    });

    it('a pane that already had an id keeps it after destroy', () => {
        document.body.innerHTML = '<div id="h"><div id="mine">A</div><div>B</div></div>';
        const sp = E.splitPane('#h');
        expect(document.getElementById('h').querySelector('.dm-split-gutter').getAttribute('aria-controls')).toBe('mine');
        sp.destroy();
        expect(document.getElementById('mine')).not.toBeNull();
    });
});
