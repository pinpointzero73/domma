// src/skeleton.test.js
import {afterEach, describe, expect, it} from 'vitest';
import Domma from './index.js';
import {configEngine} from './config.js';
import {dom} from './dom.js';

const E = Domma.elements;
const T = Domma.tables;

const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

describe('Domma.elements.skeleton', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    describe('markup per type', () => {
        it('text: one paragraph of three lines by default, lines and count honoured', () => {
            document.body.innerHTML = '<div id="t"></div>';
            E.skeleton('#t');
            expect($$('#t .skeleton-lines')).toHaveLength(1);
            expect($$('#t .skeleton.skeleton-text')).toHaveLength(3);

            E.skeleton('#t', {type: 'text', lines: 5, count: 2});
            expect($$('#t .skeleton-lines')).toHaveLength(2);
            expect($$('#t .skeleton-text')).toHaveLength(10);
        });

        it('card: image, heading and lines; image: false drops the image', () => {
            document.body.innerHTML = '<div id="c"></div>';
            E.skeleton('#c', {type: 'card', count: 3, lines: 2});
            const cards = $$('#c > .skeleton-card');
            expect(cards).toHaveLength(3);
            expect(cards[0].querySelector('.skeleton-image')).not.toBeNull();
            expect(cards[0].querySelector('.skeleton-card-body .skeleton-heading')).not.toBeNull();
            expect($$('.skeleton-text', cards[0])).toHaveLength(2);

            E.skeleton('#c', {type: 'card', image: false});
            expect($$('#c .skeleton-card')).toHaveLength(1);
            expect(document.querySelector('#c .skeleton-image')).toBeNull();
        });

        it('list: items with a circle and two lines; avatar: false drops the circle', () => {
            document.body.innerHTML = '<div id="l"></div>';
            E.skeleton('#l', {type: 'list', count: 4});
            const items = $$('#l .skeleton-list > .skeleton-list-item');
            expect(items).toHaveLength(4);
            expect(items[0].querySelector('.skeleton-circle')).not.toBeNull();
            expect($$('.skeleton-text', items[0])).toHaveLength(2);

            E.skeleton('#l', {type: 'list', avatar: false});
            expect($$('#l .skeleton-list-item')).toHaveLength(3);
            expect(document.querySelector('#l .skeleton-circle')).toBeNull();
        });

        it('table: a header row plus rows x columns', () => {
            document.body.innerHTML = '<div id="g"></div>';
            E.skeleton('#g', {type: 'table', rows: 3, columns: 6});
            const table = document.querySelector('#g .skeleton-table');
            expect(table.style.getPropertyValue('--dm-skeleton-columns').trim()).toBe('6');
            expect($$('.skeleton-table-head', table)).toHaveLength(1);
            const rows = $$('.skeleton-table-row', table);
            expect(rows).toHaveLength(4);
            rows.forEach((r) => expect($$('.skeleton', r)).toHaveLength(6));

            E.skeleton('#g', {type: 'table', header: false, rows: 2});
            expect(document.querySelector('#g .skeleton-table-head')).toBeNull();
            expect($$('#g .skeleton-table-row')).toHaveLength(2);
        });

        it('custom: a template string or a function', () => {
            document.body.innerHTML = '<div id="x"></div>';
            E.skeleton('#x', {type: 'custom', template: '<div class="skeleton skeleton-button"></div>'});
            expect($$('#x .skeleton-button')).toHaveLength(1);

            E.skeleton('#x', {type: 'custom', count: 2, template: (o) => '<i class="skeleton skeleton-circle"></i>'.repeat(o.count)});
            expect($$('#x .skeleton-circle')).toHaveLength(2);
        });

        it('animate: false marks the placeholders static', () => {
            document.body.innerHTML = '<div id="s"></div>';
            E.skeleton('#s', {type: 'card', animate: false});
            expect(document.querySelector('#s > .skeleton-card').classList.contains('skeleton-static')).toBe(true);
            E.skeleton('#s', {type: 'card'});
            expect(document.querySelector('#s > .skeleton-card').classList.contains('skeleton-static')).toBe(false);
        });

        it('accepts an element and a Domma collection, and returns null for nothing', () => {
            document.body.innerHTML = '<div id="a"></div><div id="b"></div>';
            expect(E.skeleton(document.getElementById('a')).element.id).toBe('a');
            expect(E.skeleton(dom('#b')).element.id).toBe('b');
            expect(E.skeleton('#missing')).toBeNull();
        });
    });

    describe('accessibility', () => {
        it('marks the container busy, hides the shapes and announces a status', () => {
            document.body.innerHTML = '<div id="t"></div>';
            E.skeleton('#t', {type: 'list', label: 'Loading users...'});
            const el = document.getElementById('t');
            expect(el.getAttribute('aria-busy')).toBe('true');
            expect(el.classList.contains('is-skeleton-loading')).toBe(true);
            expect(el.querySelector('.skeleton-list').getAttribute('aria-hidden')).toBe('true');
            const status = el.querySelector('.skeleton-status');
            expect(status.getAttribute('role')).toBe('status');
            expect(status.getAttribute('aria-live')).toBe('polite');
            expect(status.textContent).toBe('Loading users...');
        });

        it('defaults the status text to Loading...', () => {
            document.body.innerHTML = '<div id="t"></div>';
            E.skeleton('#t');
            expect(document.querySelector('#t .skeleton-status').textContent).toBe('Loading...');
        });
    });

    describe('remove() and replace()', () => {
        it('remove() puts back the very same nodes and clears busy', () => {
            document.body.innerHTML = '<div id="t"><p id="p1">One</p><p id="p2">Two</p></div>';
            const before = document.getElementById('p1');
            let clicks = 0;
            before.addEventListener('click', () => clicks++);

            const sk = E.skeleton('#t', {type: 'card'});
            expect(document.getElementById('p1')).toBeNull();
            expect(sk.active).toBe(true);

            sk.remove();
            const el = document.getElementById('t');
            expect(el.getAttribute('aria-busy')).toBe('false');
            expect(el.classList.contains('is-skeleton-loading')).toBe(false);
            expect(el.querySelector('.skeleton, .skeleton-card, .skeleton-status')).toBeNull();
            expect(el.children).toHaveLength(2);
            expect(document.getElementById('p1')).toBe(before);
            before.click();
            expect(clicks).toBe(1);
            expect(sk.active).toBe(false);
        });

        it('remove() leaves an empty container empty, and is safe to call twice', () => {
            document.body.innerHTML = '<div id="t"></div>';
            const sk = E.skeleton('#t');
            sk.remove();
            sk.remove();
            expect(document.getElementById('t').childNodes).toHaveLength(0);
        });

        it('replace() swaps in HTML or a node instead of the old content', () => {
            document.body.innerHTML = '<div id="t"><p>Old</p></div>';
            const sk = E.skeleton('#t');
            sk.replace('<ul><li>New</li></ul>');
            const el = document.getElementById('t');
            expect(el.innerHTML).toBe('<ul><li>New</li></ul>');
            expect(el.getAttribute('aria-busy')).toBe('false');

            const sk2 = E.skeleton('#t');
            const node = document.createElement('strong');
            node.textContent = 'Node';
            sk2.replace(node);
            expect(el.children).toHaveLength(1);
            expect(el.firstElementChild).toBe(node);
        });

        it('a second call keeps the original content underneath', () => {
            document.body.innerHTML = '<div id="t"><p id="orig">Keep</p></div>';
            E.skeleton('#t', {type: 'text'});
            const second = E.skeleton('#t', {type: 'list'});
            expect($$('#t .skeleton-status')).toHaveLength(1);
            expect(document.querySelector('#t .skeleton-lines')).toBeNull();
            second.remove();
            expect(document.getElementById('orig')).not.toBeNull();
        });

        it('E.skeleton.get() and E.skeleton.remove() find the live handle', () => {
            document.body.innerHTML = '<div id="t"><span id="k">k</span></div>';
            const sk = E.skeleton('#t');
            expect(E.skeleton.get('#t')).toBe(sk);
            E.skeleton.remove('#t');
            expect(E.skeleton.get('#t')).toBeNull();
            expect(document.getElementById('k')).not.toBeNull();
        });
    });

    describe('E.skeleton.while()', () => {
        it('shows the skeleton until the promise resolves, then resolves with its value', async () => {
            document.body.innerHTML = '<div id="t"></div>';
            let done;
            const p = new Promise((r) => { done = r; });
            const result = E.skeleton.while('#t', p, {type: 'card'});
            expect(document.querySelector('#t .skeleton-card')).not.toBeNull();
            expect(document.getElementById('t').getAttribute('aria-busy')).toBe('true');

            done({ok: 1});
            await expect(result).resolves.toEqual({ok: 1});
            expect(document.querySelector('#t .skeleton-card')).toBeNull();
            expect(document.getElementById('t').getAttribute('aria-busy')).toBe('false');
        });

        it('removes the skeleton and rethrows when the promise rejects', async () => {
            document.body.innerHTML = '<div id="t"><p id="old">Old</p></div>';
            const err = new Error('nope');
            await expect(E.skeleton.while('#t', Promise.reject(err))).rejects.toBe(err);
            expect(document.querySelector('#t .skeleton')).toBeNull();
            expect(document.getElementById('old')).not.toBeNull();
            expect(document.getElementById('t').getAttribute('aria-busy')).toBe('false');
        });

        it('accepts a function returning a promise, including one that throws', async () => {
            document.body.innerHTML = '<div id="t"></div>';
            await expect(E.skeleton.while('#t', () => Promise.resolve(7))).resolves.toBe(7);
            await expect(E.skeleton.while('#t', () => { throw new Error('sync'); })).rejects.toThrow('sync');
            expect(document.querySelector('#t .skeleton')).toBeNull();
        });
    });

    describe('declarative data-skeleton', () => {
        it('scan() fills [data-skeleton] containers from their attributes', () => {
            document.body.innerHTML =
                '<div id="a" data-skeleton="list" data-skeleton-count="2" data-skeleton-avatar="false"></div>' +
                '<div id="b" data-skeleton="table" data-skeleton-rows="1" data-skeleton-columns="2"></div>';
            const handles = E.skeleton.scan();
            expect(handles).toHaveLength(2);
            expect($$('#a .skeleton-list-item')).toHaveLength(2);
            expect(document.querySelector('#a .skeleton-circle')).toBeNull();
            expect($$('#b .skeleton-table-row')).toHaveLength(2);
            expect(E.skeleton.scan()).toHaveLength(0);
        });
    });

    describe('config engine', () => {
        it('is registered as a component', () => {
            document.body.innerHTML = '<div id="cfg"></div>';
            configEngine.initComponent('#cfg', 'skeleton', {type: 'list', count: 2});
            expect($$('#cfg .skeleton-list-item')).toHaveLength(2);
        });
    });
});

describe('T.create loadingSkeleton', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    const columns = [{key: 'name', title: 'Name'}, {key: 'age', title: 'Age'}, {key: 'city', title: 'City'}];

    it('shows skeleton rows until setData(), then the data', () => {
        document.body.innerHTML = '<div id="tbl"></div>';
        const table = T.create('#tbl', {columns, loadingSkeleton: true});
        expect(table.isLoading()).toBe(true);
        const rows = $$('#tbl tbody tr.domma-table-skeleton-row');
        expect(rows).toHaveLength(5);
        expect($$('td .skeleton.skeleton-text', rows[0])).toHaveLength(3);
        expect(document.querySelector('#tbl table').getAttribute('aria-busy')).toBe('true');
        expect(document.querySelector('#tbl .skeleton-status').textContent).toBe('Loading...');
        expect(document.querySelector('#tbl .domma-table-pagination')).toBeNull();

        table.setData([{id: 1, name: 'Ann', age: 30, city: 'Leeds'}]);
        expect(table.isLoading()).toBe(false);
        expect($$('#tbl .domma-table-skeleton-row')).toHaveLength(0);
        expect(document.querySelector('#tbl .skeleton-status')).toBeNull();
        expect(document.querySelector('#tbl table').getAttribute('aria-busy')).toBe('false');
        expect(document.querySelector('#tbl tbody').textContent).toContain('Leeds');
    });

    it('takes a row count, and setLoading() brings the skeleton back', () => {
        document.body.innerHTML = '<div id="tbl"></div>';
        const table = T.create('#tbl', {columns, loadingSkeleton: 2});
        expect($$('#tbl .domma-table-skeleton-row')).toHaveLength(2);
        table.setData([{id: 1, name: 'Ann'}]);
        table.setLoading(true);
        expect($$('#tbl .domma-table-skeleton-row')).toHaveLength(2);
        table.addRow({id: 2, name: 'Bo'});
        expect(table.isLoading()).toBe(false);
        expect($$('#tbl tbody tr')).toHaveLength(2);
    });

    it('is off by default', () => {
        document.body.innerHTML = '<div id="tbl"></div>';
        T.create('#tbl', {columns, data: []});
        expect(document.querySelector('#tbl .skeleton')).toBeNull();
        expect(document.querySelector('#tbl table').hasAttribute('aria-busy')).toBe(false);
    });
});
