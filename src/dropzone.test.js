// src/dropzone.test.js
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';
import {forms} from './forms.js';
import {instanceOf} from './component.js';
import {_guardState, accepts, formatBytes} from './components/dropzone.js';

const E = Domma.elements;
const $1 = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const file = (name, size = 10, type = '') => {
    const f = new File(['x'.repeat(Math.min(size, 64))], name, {type});
    Object.defineProperty(f, 'size', {value: size});
    return f;
};

/** A drag event carrying files (jsdom has no DragEvent / DataTransfer). */
function drag(el, type, files = [], extra = {}) {
    const e = new Event(type, {bubbles: true, cancelable: true});
    Object.defineProperty(e, 'dataTransfer', {value: {types: ['Files'], files, dropEffect: 'none'}});
    for (const [k, v] of Object.entries(extra)) Object.defineProperty(e, k, {value: v});
    el.dispatchEvent(e);
    return e;
}

const key = (el, k) => el.dispatchEvent(new KeyboardEvent('keydown', {key: k, bubbles: true, cancelable: true}));

// ---- a stand-in XMLHttpRequest --------------------------------------------------
class FakeXHR {
    static all = [];
    constructor() {
        this.listeners = {};
        this.uploadListeners = {};
        this.headers = {};
        this.upload = {addEventListener: (t, fn) => { (this.uploadListeners[t] ||= []).push(fn); }};
        this.status = 0;
        this.responseText = '';
        FakeXHR.all.push(this);
    }
    addEventListener(t, fn) { (this.listeners[t] ||= []).push(fn); }
    open(method, url) { this.method = method; this.url = url; }
    setRequestHeader(k, v) { this.headers[k] = v; }
    send(body) { this.body = body; }
    abort() { this.aborted = true; (this.listeners.abort || []).forEach(f => f()); }
    progress(loaded, total) { (this.uploadListeners.progress || []).forEach(f => f({lengthComputable: true, loaded, total})); }
    respond(status, text) {
        this.status = status;
        this.statusText = status === 200 ? 'OK' : 'Server Error';
        this.responseText = text;
        (this.listeners.load || []).forEach(f => f());
    }
    fail() { (this.listeners.error || []).forEach(f => f()); }
}

let realXHR;
beforeEach(() => {
    realXHR = globalThis.XMLHttpRequest;
    globalThis.XMLHttpRequest = FakeXHR;
    FakeXHR.all = [];
    URL.createObjectURL = vi.fn(() => 'blob:preview');
    URL.revokeObjectURL = vi.fn();
});

afterEach(() => {
    E.destroyAll();
    document.body.innerHTML = '';
    globalThis.XMLHttpRequest = realXHR;
});

describe('helpers', () => {
    it('formatBytes and accepts', () => {
        expect(formatBytes(500)).toBe('500 B');
        expect(formatBytes(1536)).toBe('1.5 KB');
        expect(formatBytes(5 * 1024 * 1024)).toBe('5 MB');
        expect(accepts(file('a.PDF'), '.pdf')).toBe(true);
        expect(accepts(file('a.png', 1, 'image/png'), 'image/*')).toBe(true);
        expect(accepts(file('a.txt', 1, 'text/plain'), ['image/*', '.pdf'])).toBe(false);
        expect(accepts(file('a.json', 1, 'application/json'), 'application/json')).toBe(true);
        expect(accepts(file('anything'), '')).toBe(true);
    });
});

describe('E.dropzone - building', () => {
    it('returns null for a selector that matches nothing', () => {
        expect(E.dropzone('#nope')).toBeNull();
    });

    it('makes the element a focusable button, adds a hidden input, a prompt, a list and a live region', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const dz = E.dropzone('#dz', {accept: 'image/*,.pdf', maxSize: 2048, name: 'files'});
        const el = $1('#dz');
        expect(dz.element).toBe(el);
        expect(el.getAttribute('role')).toBe('button');
        expect(el.getAttribute('tabindex')).toBe('0');
        expect(el.classList.contains('dm-dropzone')).toBe(true);
        const input = $1('#dz input[type="file"]');
        expect(input.hidden).toBe(true);
        expect(input.name).toBe('files');
        expect(input.multiple).toBe(true);
        expect(input.getAttribute('accept')).toBe('image/*,.pdf');
        expect($1('.dm-dropzone-text').textContent).toBe('Drop files here or click to browse');
        expect($1('.dm-dropzone-hint').textContent).toContain('up to 2 KB');
        expect(el.getAttribute('aria-describedby')).toBe($1('.dm-dropzone-hint').id);
        expect(el.nextElementSibling.matches('ul.dm-dropzone-files')).toBe(true);
        expect($1('.dm-dropzone-live').getAttribute('aria-live')).toBe('polite');
    });

    it('uses the input inside or next to the area, reading accept / multiple / name from it', () => {
        document.body.innerHTML = '<div id="dz"><p>My own words</p></div><input id="f" type="file" name="doc" accept=".pdf">';
        const dz = E.dropzone('#dz');
        expect(dz.input).toBe($1('#f'));
        expect(dz.options.multiple).toBe(false);
        expect(dz.options.accept).toBe('.pdf');
        expect($1('.dm-dropzone-prompt')).toBeNull(); // caller's own content kept
    });

    it('a file input as the target gets an area drawn after it', () => {
        document.body.innerHTML = '<input id="f" type="file" multiple>';
        const dz = E.dropzone('#f');
        expect(dz.element).toBe($1('#f'));
        expect(dz.zone).toBe($1('#f').nextElementSibling);
        expect(dz.zone.classList.contains('dm-dropzone')).toBe(true);
    });
});

describe('E.dropzone - adding and rejecting', () => {
    it('fires add and change via option, .on() and dm:dropzone:*, and draws escaped names', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const onAdd = vi.fn();
        const onChange = vi.fn();
        const dz = E.dropzone('#dz', {onAdd, onChange});
        const viaOn = vi.fn();
        const viaDom = vi.fn();
        dz.on('add', viaOn);
        dz.element.addEventListener('dm:dropzone:change', viaDom);
        const evil = file('<img src=x onerror=alert(1)>.txt');
        dz.addFiles([evil, file('b.txt')]);
        expect(onAdd).toHaveBeenCalledTimes(2);
        expect(onAdd.mock.calls[0][0].file).toBe(evil);
        expect(viaOn).toHaveBeenCalledTimes(2);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0]).toHaveLength(2);
        expect(viaDom).toHaveBeenCalledTimes(1);
        expect(dz.getFiles()).toHaveLength(2);
        expect($1('.dm-dropzone-name').textContent).toBe(evil.name);
        expect($1('.dm-dropzone-files img')).toBeNull();
        expect($1('.dm-dropzone-live').textContent).toContain('b.txt added');
    });

    it('rejects by type, size and count with a reason, and says so', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const onReject = vi.fn();
        const dz = E.dropzone('#dz', {accept: '.txt', maxSize: 100, minSize: 2, maxFiles: 2, onReject});
        dz.addFiles([file('a.png'), file('big.txt', 500), file('tiny.txt', 1), file('1.txt'), file('2.txt'), file('3.txt')]);
        expect(onReject.mock.calls.map(c => [c[0].name, c[1]])).toEqual([
            ['a.png', 'type'], ['big.txt', 'size'], ['tiny.txt', 'size'], ['3.txt', 'count']
        ]);
        expect(dz.getFiles().map(f => f.name)).toEqual(['1.txt', '2.txt']);
        const said = $1('.dm-dropzone-live').textContent;
        expect(said).toContain('a.png was not added');
        expect(said).toContain('larger than 100 B');
        expect(said).toContain('smaller than 2 B');
        expect(said).toContain('no more than 2 files');
    });

    it('beforeadd refuses one file at a time', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const dz = E.dropzone('#dz', {onBeforeAdd: (entry) => entry.name !== 'no.txt'});
        dz.addFiles([file('yes.txt'), file('no.txt')]);
        expect(dz.getFiles().map(f => f.name)).toEqual(['yes.txt']);
    });

    it('without multiple, a new file replaces the old one', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const onRemove = vi.fn();
        const dz = E.dropzone('#dz', {multiple: false, onRemove});
        dz.addFiles([file('a.txt')]);
        dz.addFiles([file('b.txt'), file('c.txt')]);
        expect(dz.getFiles().map(f => f.name)).toEqual(['b.txt']);
        expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('image previews use object URLs, revoked on remove, clear and destroy', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const dz = E.dropzone('#dz');
        const [a] = dz.addFiles([file('a.png', 10, 'image/png'), file('b.png', 10, 'image/png')]);
        expect($$('.dm-dropzone-thumb img')).toHaveLength(2);
        dz.removeFile(a.id);
        expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
        dz.addFiles([file('c.png', 10, 'image/png')]);
        dz.destroy();
        expect(URL.revokeObjectURL).toHaveBeenCalledTimes(3);
    });

    it('removeFile takes an id, an entry or the File; the row button removes too', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const dz = E.dropzone('#dz');
        const f1 = file('1.txt');
        const [e1, e2, e3] = dz.addFiles([f1, file('2.txt'), file('3.txt')]);
        expect(dz.removeFile(f1)).toBe(true);
        expect(dz.removeFile(e2)).toBe(true);
        expect(dz.removeFile('nope')).toBe(false);
        $1(`[data-id="${e3.id}"] .dm-dropzone-remove`).click();
        expect(dz.getFiles()).toEqual([]);
        expect($1('.dm-dropzone-files').hidden).toBe(true);
        expect(document.activeElement).toBe(dz.zone);
        expect(e1.id).not.toBe(e3.id);
    });
});

describe('E.dropzone - picker, keyboard, paste, drag', () => {
    it('click, Enter and Space open the picker; disabled does not', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const dz = E.dropzone('#dz');
        const click = vi.spyOn(dz.input, 'click').mockImplementation(() => {});
        dz.zone.click();
        key(dz.zone, 'Enter');
        key(dz.zone, ' ');
        expect(click).toHaveBeenCalledTimes(3);
        dz.disable();
        expect(dz.zone.getAttribute('aria-disabled')).toBe('true');
        expect(dz.zone.getAttribute('tabindex')).toBe('-1');
        dz.zone.click();
        key(dz.zone, 'Enter');
        expect(click).toHaveBeenCalledTimes(3);
        dz.addFiles([file('a.txt')]);
        expect(dz.getFiles()).toHaveLength(0);
    });

    it('files chosen in the picker are added', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const dz = E.dropzone('#dz');
        Object.defineProperty(dz.input, 'files', {configurable: true, get: () => [file('p.txt')], set() {}});
        dz.input.dispatchEvent(new Event('change', {bubbles: true}));
        expect(dz.getFiles().map(f => f.name)).toEqual(['p.txt']);
    });

    it('pasting files into the area adds them', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const dz = E.dropzone('#dz');
        const e = new Event('paste', {bubbles: true, cancelable: true});
        Object.defineProperty(e, 'clipboardData', {value: {files: [file('pasted.png', 5, 'image/png')]}});
        dz.zone.dispatchEvent(e);
        expect(e.defaultPrevented).toBe(true);
        expect(dz.getFiles().map(f => f.name)).toEqual(['pasted.png']);
    });

    it('drag-over styling, and a drop adds the files', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const dz = E.dropzone('#dz');
        expect(drag(dz.zone, 'dragenter').defaultPrevented).toBe(true);
        expect(dz.zone.classList.contains('is-dragover')).toBe(true);
        drag(dz.zone, 'dragleave', [], {relatedTarget: document.body});
        expect(dz.zone.classList.contains('is-dragover')).toBe(false);
        drag(dz.zone, 'dragover');
        const drop = drag(dz.zone, 'drop', [file('d.txt')]);
        expect(drop.defaultPrevented).toBe(true);
        expect(dz.zone.classList.contains('is-dragover')).toBe(false);
        expect(dz.getFiles().map(f => f.name)).toEqual(['d.txt']);
    });

    it('guards the page against a missed drop only during a file drag', () => {
        document.body.innerHTML = '<div id="dz"></div><p id="out">outside</p>';
        const dz = E.dropzone('#dz');
        const out = $1('#out');
        // no drag yet: a drop outside is the browser's business
        expect(drag(out, 'drop').defaultPrevented).toBe(false);
        expect(_guardState().armed).toBe(false);
        drag(out, 'dragenter');                 // a file drag comes onto the page
        expect(_guardState().armed).toBe(true);
        expect(drag(out, 'dragover').defaultPrevented).toBe(true);
        expect(drag(out, 'drop').defaultPrevented).toBe(true);
        expect(_guardState().armed).toBe(false); // off again after the drop
        expect(drag(out, 'dragover').defaultPrevented).toBe(false);
        // leaving the window disarms too
        drag(out, 'dragenter');
        drag(out, 'dragleave', [], {relatedTarget: null});
        expect(_guardState().armed).toBe(false);
        dz.destroy();
        expect(_guardState().zones).toBe(0);
        drag(out, 'dragenter');
        expect(_guardState().armed).toBe(false);
    });

    it('a non-file drag (text) is left alone', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const dz = E.dropzone('#dz');
        const e = new Event('dragenter', {bubbles: true, cancelable: true});
        Object.defineProperty(e, 'dataTransfer', {value: {types: ['text/plain']}});
        dz.zone.dispatchEvent(e);
        expect(e.defaultPrevented).toBe(false);
        expect(dz.zone.classList.contains('is-dragover')).toBe(false);
    });
});

describe('E.dropzone - forms', () => {
    it('rewrites the input\'s FileList with a DataTransfer so the form submits the files', () => {
        class FakeDT {
            constructor() { this.list = []; this.items = {add: (f) => this.list.push(f)}; }
            get files() { return this.list; }
        }
        const had = globalThis.DataTransfer;
        globalThis.DataTransfer = FakeDT;
        try {
            document.body.innerHTML = '<form><div id="dz"></div></form>';
            const dz = E.dropzone('#dz', {name: 'docs'});
            let set = null;
            Object.defineProperty(dz.input, 'files', {configurable: true, get: () => set || [], set(v) { set = v; }});
            dz.addFiles([file('a.txt'), file('b.txt')]);
            expect(set.map(f => f.name)).toEqual(['a.txt', 'b.txt']);
            dz.removeFile(dz.getEntries()[0].id);
            expect(set.map(f => f.name)).toEqual(['b.txt']);
        } finally {
            globalThis.DataTransfer = had;
        }
    });

    it('without DataTransfer, the formdata event carries the files', () => {
        document.body.innerHTML = '<form id="f"><div id="dz"></div></form>';
        const had = globalThis.DataTransfer;
        delete globalThis.DataTransfer;
        try {
            const dz = E.dropzone('#dz', {name: 'docs'});
            dz.addFiles([file('a.txt'), file('b.txt')]);
            const fd = new FormData();
            const e = new Event('formdata');
            Object.defineProperty(e, 'formData', {value: fd});
            $1('#f').dispatchEvent(e);
            expect(fd.getAll('docs').map(f => f.name)).toEqual(['a.txt', 'b.txt']);
        } finally {
            if (had) globalThis.DataTransfer = had;
        }
    });

    it('a form reset clears the list', async () => {
        document.body.innerHTML = '<form id="f"><div id="dz"></div></form>';
        const dz = E.dropzone('#dz');
        dz.addFiles([file('a.txt')]);
        $1('#f').reset();
        await new Promise(r => setTimeout(r, 5));
        expect(dz.getFiles()).toEqual([]);
    });
});

describe('E.dropzone - uploading', () => {
    it('uploads each file with progress, success and complete; concurrency limits requests', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const events = [];
        const dz = E.dropzone('#dz', {
            upload: {url: '/up', field: 'doc', headers: {'X-Token': 't'}, data: {folder: 'a'}, concurrency: 1},
            onUploadStart: (e) => events.push(['start', e.name]),
            onProgress: (e, p) => events.push(['progress', e.name, p]),
            onSuccess: (e, res) => events.push(['success', e.name, res.id]),
            onComplete: (all) => events.push(['complete', all.length])
        });
        dz.addFiles([file('a.txt'), file('b.txt')]);
        expect(FakeXHR.all).toHaveLength(1);         // concurrency 1
        const [x1] = FakeXHR.all;
        expect([x1.method, x1.url, x1.headers['X-Token']]).toEqual(['POST', '/up', 't']);
        expect(x1.body.get('doc').name).toBe('a.txt');
        expect(x1.body.get('folder')).toBe('a');
        x1.progress(50, 100);
        expect($1('.dm-dropzone-progress').getAttribute('aria-valuenow')).toBe('50');
        expect($1('.dm-dropzone-status').textContent).toBe('Uploading 50%');
        x1.respond(200, '{"id": 1}');
        expect(FakeXHR.all).toHaveLength(2);
        FakeXHR.all[1].respond(200, '{"id": 2}');
        expect(events).toEqual([
            ['start', 'a.txt'], ['progress', 'a.txt', 50], ['success', 'a.txt', 1],
            ['start', 'b.txt'], ['success', 'b.txt', 2], ['complete', 2]
        ]);
        expect(dz.getEntries().map(e => e.status)).toEqual(['done', 'done']);
    });

    it('autoUpload: false waits for upload(); a failure fires error, retry() sends again', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const onError = vi.fn();
        const dz = E.dropzone('#dz', {upload: {url: '/up'}, autoUpload: false, onError});
        dz.addFiles([file('a.txt')]);
        expect(FakeXHR.all).toHaveLength(0);
        dz.upload();
        FakeXHR.all[0].respond(500, 'nope');
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError.mock.calls[0][1].status).toBe(500);
        const entry = dz.getEntries()[0];
        expect(entry.status).toBe('error');
        const retryBtn = $1('.dm-dropzone-retry');
        expect(retryBtn.hidden).toBe(false);
        retryBtn.click();
        expect(FakeXHR.all).toHaveLength(2);
        FakeXHR.all[1].respond(200, 'ok');
        expect(entry.status).toBe('done');
        expect(entry.response).toBe('ok');
    });

    it('retry: n retries automatically before failing', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const onError = vi.fn();
        const dz = E.dropzone('#dz', {upload: {url: '/up'}, retry: 1, onError});
        dz.addFiles([file('a.txt')]);
        FakeXHR.all[0].fail();
        expect(FakeXHR.all).toHaveLength(2);
        expect(onError).not.toHaveBeenCalled();
        FakeXHR.all[1].fail();
        expect(onError).toHaveBeenCalledTimes(1);
        expect(dz.getEntries()[0].status).toBe('error');
    });

    it('cancel() aborts uploads and empties the queue; removing an uploading file aborts it', () => {
        document.body.innerHTML = '<div id="dz"></div>';
        const onComplete = vi.fn();
        const dz = E.dropzone('#dz', {upload: {url: '/up', concurrency: 1}, onComplete});
        const [a, b] = dz.addFiles([file('a.txt'), file('b.txt')]);
        dz.cancel();
        expect(FakeXHR.all[0].aborted).toBe(true);
        expect([a.status, b.status]).toEqual(['cancelled', 'cancelled']);
        expect(onComplete).toHaveBeenCalledTimes(1);
        dz.upload();
        expect(FakeXHR.all).toHaveLength(2);
        dz.removeFile(a);
        expect(FakeXHR.all[1].aborted).toBe(true);
        expect(FakeXHR.all).toHaveLength(3);          // b starts next
        expect(FakeXHR.all[2].body.get('file').name).toBe('b.txt');
    });

    it('destroy() aborts, removes what it added and restores the element and input', () => {
        document.body.innerHTML = '<div id="dz" class="mine"><input type="file" id="f" name="x"></div>';
        const dz = E.dropzone('#dz', {upload: {url: '/up'}});
        dz.addFiles([file('a.txt')]);
        const onChange = vi.fn();
        dz.on('change', onChange);
        dz.destroy();
        expect(FakeXHR.all[0].aborted).toBe(true);
        const el = $1('#dz');
        expect(el.className).toBe('mine');
        expect(el.hasAttribute('role')).toBe(false);
        expect(el.hasAttribute('tabindex')).toBe(false);
        expect($1('.dm-dropzone-files')).toBeNull();
        expect($1('.dm-dropzone-live')).toBeNull();
        expect($1('.dm-dropzone-prompt')).toBeNull();
        expect($1('#f').hidden).toBe(false);
        expect($1('#f').name).toBe('x');
        expect(instanceOf(el, 'dropzone')).toBeNull();
        el.click();
        expect(onChange).not.toHaveBeenCalled();
    });
});

describe('F blueprint: type dropzone', () => {
    it('renders a dropzone; its files are the field value and satisfy required', () => {
        document.body.innerHTML = '<div id="host"></div>';
        const form = forms.create({
            attachments: {type: 'dropzone', label: 'Attachments', required: true, formConfig: {accept: '.pdf', maxFiles: 3}}
        });
        form.renderTo('#host');
        const zone = $1('#host .dm-dropzone');
        expect(zone).not.toBeNull();
        expect($1('#field-attachments').getAttribute('accept')).toBe('.pdf');
        expect(form.validate()).toBe(false);
        const dz = E.get(zone, 'dropzone');
        dz.addFiles([file('a.pdf'), file('b.png')]);
        expect(form._getFieldValueByName('attachments').map(f => f.name)).toEqual(['a.pdf']);
        expect(form.getData().attachments.map(f => f.name)).toEqual(['a.pdf']);
        expect(form.validate()).toBe(true);
        // a file chosen in the picker: the raw input's change must not overwrite the list
        Object.defineProperty(dz.input, 'files', {configurable: true, get: () => [file('c.pdf')], set() {}});
        dz.input.dispatchEvent(new Event('change', {bubbles: true}));
        expect(form.getData().attachments.map(f => f.name)).toEqual(['a.pdf', 'c.pdf']);
        form.destroy();
        expect($1('#host .dm-dropzone')).toBeNull();
    });
});
