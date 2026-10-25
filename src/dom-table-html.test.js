/**
 * `.html()` into a table part: DOMPurify parses markup as if it went into <body>, where
 * a lone <tr> or <td> is dropped, so rows written into a <tbody> used to vanish.
 */
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import createDOMPurify from 'dompurify';
import Domma from './index.js';

const $ = Domma;

describe('.html() into table parts keeps rows and cells', () => {
    beforeAll(() => { window.DOMPurify = createDOMPurify(window); });
    afterAll(() => { delete window.DOMPurify; });

    it('a <tbody> gets its rows, still sanitised', () => {
        document.body.innerHTML = '<table><tbody id="b"></tbody></table>';
        $('#b').html('<tr><td onclick="alert(1)">Ann</td><td><script>x()</script>42</td></tr><tr><td>Bo</td></tr>');
        const rows = document.querySelectorAll('#b tr');
        expect(rows.length).toBe(2);
        expect(rows[0].cells[0].textContent).toBe('Ann');
        expect(rows[0].cells[0].hasAttribute('onclick')).toBe(false);
        expect(document.querySelector('#b script')).toBeNull();
    });

    it('a <tr> gets its cells, a <table> its parts', () => {
        document.body.innerHTML = '<table id="t"><tbody><tr id="r"></tr></tbody></table>';
        $('#r').html('<td>a</td><th>b</th>');
        expect(document.querySelector('#r').cells.length).toBe(2);
        $('#t').html('<thead><tr><th>Name</th></tr></thead><tbody><tr><td>Ann</td></tr></tbody>');
        expect(document.querySelector('#t thead th').textContent).toBe('Name');
        expect(document.querySelector('#t tbody td').textContent).toBe('Ann');
    });

    it('text and non-table markup in a table part are kept, as before', () => {
        document.body.innerHTML = '<table><tbody id="b"></tbody><tbody><tr id="r"></tr></tbody></table>';
        $('#b').html('No results');
        expect(document.querySelector('#b').textContent).toBe('No results');
        $('#b').html('<div class="spinner">Loading</div>');
        expect(document.querySelector('#b .spinner')).not.toBeNull();
        $('#b').html(5);
        expect(document.querySelector('#b').textContent).toBe('5');
        $('#r').html('x');
        expect(document.querySelector('#r').textContent).toBe('x');
    });

    it('a nested table cannot stand in for the rows', () => {
        document.body.innerHTML = '<table><tbody id="b"></tbody></table>';
        $('#b').html('<tr><td><table><tbody><tr><td>inner</td></tr></tbody></table></td></tr><tr><td>real</td></tr>');
        const rows = document.querySelectorAll('#b > tr');
        expect(rows.length).toBe(2);
        expect(rows[1].textContent).toBe('real');
    });

    it('other elements are unchanged', () => {
        document.body.innerHTML = '<div id="d"></div>';
        $('#d').html('<p>Hi <img src=x onerror="alert(1)"></p>');
        expect(document.querySelector('#d p').textContent).toBe('Hi ');
        expect(document.querySelector('#d img').hasAttribute('onerror')).toBe(false);
    });
});
