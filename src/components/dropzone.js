/**
 * Dropzone - E.dropzone(target, options).
 *
 * The caller's element becomes the drop area (role="button", focusable; Enter / Space or a
 * click opens the file picker, a paste of files into it adds them). The files go into a
 * real `<input type="file">` - the one inside the element, the one next to it, or one this
 * component makes - so the area works inside a plain <form>:
 *
 * - Without `upload`, the input's FileList is rewritten after each add / remove with a
 *   DataTransfer (Chrome, Edge, Firefox, Safari 14.1+), so the form submits exactly the
 *   files shown. Where `new DataTransfer()` is missing, the form's `formdata` event puts
 *   the files in instead (native submission and `new FormData(form)` both raise it); a
 *   page that builds its own request without FormData(form) should use getFiles().
 * - With `upload`, each file is sent on its own with XMLHttpRequest and the input is
 *   left empty so the form does not send the files a second time.
 *
 * The list of files is drawn after the element (a sibling, or into `list`), not inside it:
 * the area is one big button, and buttons cannot hold other buttons.
 *
 * Events (onX option, `.on()`, `dm:dropzone:<event>`): beforeadd (cancelable per file),
 * add, reject, remove, change, uploadstart, progress, success, error, complete. Each
 * gets the file's entry `{id, file, name, size, type, status, progress, response, error}`;
 * change gets the File list.
 */

import Component, {instanceOf} from '../component.js';
import {flag, num, scanIcons, uniqueId} from './shared.js';

const DEFAULT_LABELS = {
    prompt: 'Drop files here or click to browse',
    hint: null,                 // null = built from accept / maxSize / maxFiles
    remove: 'Remove {name}',
    retry: 'Retry',
    cancel: 'Cancel upload of {name}',
    added: '{name} added',
    removed: '{name} removed',
    type: '{name} was not added: that type of file is not accepted',
    size: '{name} was not added: it is larger than {max}',
    small: '{name} was not added: it is smaller than {min}',
    count: '{name} was not added: no more than {max} files',
    uploading: 'Uploading {percent}%',
    done: 'Uploaded',
    failed: 'Upload failed',
    cancelled: 'Cancelled',
    required: 'Please add a file'
};

/** "1.5 MB" - powers of 1024, the way file managers show sizes. */
export function formatBytes(bytes) {
    const n = Number(bytes) || 0;
    if (n < 1024) return `${n} B`;
    const units = ['KB', 'MB', 'GB', 'TB'];
    let v = n;
    let i = -1;
    do {
        v /= 1024;
        i++;
    } while (v >= 1024 && i < units.length - 1);
    return `${v >= 10 ? Math.round(v) : Math.round(v * 10) / 10} ${units[i]}`;
}

/** Accept tokens as the file input reads them: ".pdf", "image/*", "application/json". */
function acceptList(accept) {
    if (!accept) return [];
    const list = Array.isArray(accept) ? accept : String(accept).split(',');
    return list.map(s => String(s).trim().toLowerCase()).filter(Boolean);
}

/** Whether a file matches an accept list (an empty list takes anything). */
export function accepts(file, accept) {
    const tokens = acceptList(accept);
    if (!tokens.length) return true;
    const name = String(file?.name || '').toLowerCase();
    const type = String(file?.type || '').toLowerCase();
    return tokens.some((t) => {
        if (t.startsWith('.')) return name.endsWith(t);
        if (t.endsWith('/*')) return type.startsWith(t.slice(0, -1));
        return type === t;
    });
}

function fill(template, values) {
    return String(template ?? '').replace(/\{(\w+)\}/g, (m, k) => (values[k] !== undefined ? String(values[k]) : m));
}

function hasFiles(e) {
    const types = e?.dataTransfer?.types;
    if (!types) return false;
    return Array.from(types).includes('Files');
}

function canBuildFileList() {
    try {
        return typeof DataTransfer !== 'undefined' && !!new DataTransfer().items;
    } catch {
        return false;
    }
}

// ---- the page-level drop guard ------------------------------------------------
//
// A file dropped a few pixels outside the area makes the browser leave the page to show
// the file. While a file drag is over a page that has a live dropzone, the document
// refuses drops; the moment the drag ends (dropped, left the window, cancelled - noticed
// by dragover stopping) the guard is taken off again. Nothing is held between drags but
// one dragenter listener, and that only while a dropzone exists.

const guard = {zones: 0, armed: false, timer: null};

function guardDragOver(e) {
    if (!hasFiles(e)) return;
    clearTimeout(guard.timer);
    guard.timer = setTimeout(disarm, 1500);
    if (e.defaultPrevented || e.target?.closest?.('input[type="file"]')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'none';
}

function guardDrop(e) {
    // A native file input elsewhere on the page keeps its own drop
    if (!e.defaultPrevented && !e.target?.closest?.('input[type="file"]')) e.preventDefault();
    disarm();
}

function guardLeave(e) {
    if (!e.relatedTarget) disarm();   // left the window
}

function arm(e) {
    if (guard.armed || !hasFiles(e)) return;
    guard.armed = true;
    document.addEventListener('dragover', guardDragOver);
    document.addEventListener('drop', guardDrop);
    document.addEventListener('dragleave', guardLeave);
    guard.timer = setTimeout(disarm, 1500);
}

function disarm() {
    clearTimeout(guard.timer);
    guard.timer = null;
    if (!guard.armed) return;
    guard.armed = false;
    document.removeEventListener('dragover', guardDragOver);
    document.removeEventListener('drop', guardDrop);
    document.removeEventListener('dragleave', guardLeave);
}

function guardAdd() {
    if (guard.zones++ === 0) document.addEventListener('dragenter', arm);
}

function guardRemove() {
    if (guard.zones <= 0) return;
    if (--guard.zones === 0) {
        document.removeEventListener('dragenter', arm);
        disarm();
    }
}

/** For tests: whether the document guard is on. */
export const _guardState = () => ({zones: guard.zones, armed: guard.armed});

export class Dropzone extends Component {
    static componentName = 'dropzone';

    static defaults = {
        accept: null,               // ".pdf,image/*" or ['.pdf', 'image/*']; default: the input's accept
        multiple: null,             // null = the input's `multiple`, or true when there is no input
        maxFiles: null,
        maxSize: null,              // bytes
        minSize: null,              // bytes
        previews: true,             // image thumbnails
        name: null,                 // form field name; default: the input's name
        input: null,                // the file input to use, when it is not inside / next to the area
        list: true,                 // true = after the area, an element/selector, false = no list
        upload: null,               // {url, method, field, headers, withCredentials, concurrency, data, xhr}
        autoUpload: true,
        retry: 0,                   // automatic retries per file after a failed upload
        labels: {},
        disabled: false,
        className: '',
        onBeforeAdd: null,
        onAdd: null,
        onReject: null,
        onRemove: null,
        onChange: null,
        onUploadStart: null,
        onProgress: null,
        onSuccess: null,
        onError: null,
        onComplete: null
    };

    constructor(element, options = {}) {
        super(element, options);
        if (!this.element) return;
        this._entries = [];
        this._queue = [];
        this._active = 0;
        this._batch = false;
        this._added = [];           // DOM this component added
        this._canSync = canBuildFileList();
        this._labels = {...DEFAULT_LABELS, ...(this.options.labels || {})};
        this._setupZone();
        this._setupInput();
        this._setupList();
        this._bind();
        this._applyDisabled();
        guardAdd();
        this._guarded = true;
    }

    // ---- setup ------------------------------------------------------------

    _setupZone() {
        const el = this.element;
        // The caller gave us the file input itself: draw the area after it
        if (el.tagName === 'INPUT' && el.type === 'file') {
            const zone = document.createElement('div');
            el.after(zone);
            this._added.push(zone);
            this.zone = zone;
            this._givenInput = el;
        } else {
            this.zone = el;
        }
        const zone = this.zone;
        this._restoreZone = ['role', 'tabindex', 'aria-disabled', 'aria-describedby'].reduce((acc, a) => {
            acc[a] = zone.getAttribute(a);
            return acc;
        }, {});
        this._zoneClasses = ['dm-dropzone', ...String(this.options.className || '').split(/\s+/).filter(Boolean)]
            .filter(c => !zone.classList.contains(c));
        zone.classList.add(...this._zoneClasses);
        // A <label> wrapping its input already opens the picker on click
        this._isLabel = zone.tagName === 'LABEL';
        if (!this._isLabel) zone.setAttribute('role', 'button');
        zone.setAttribute('tabindex', '0');
    }

    _findInput() {
        const o = this.options;
        if (this._givenInput) return this._givenInput;
        if (o.input) {
            const el = typeof o.input === 'string' ? document.querySelector(o.input) : o.input;
            if (el && el.tagName === 'INPUT') return el;
        }
        const inside = this.zone.querySelector('input[type="file"]');
        if (inside) return inside;
        for (const sib of [this.zone.nextElementSibling, this.zone.previousElementSibling]) {
            if (sib && sib.matches?.('input[type="file"]')) return sib;
        }
        return null;
    }

    _setupInput() {
        let input = this._findInput();
        if (input) {
            this._restoreInput = {
                hidden: input.hidden,
                name: input.getAttribute('name'),
                multiple: input.multiple,
                disabled: input.disabled,
                tabindex: input.getAttribute('tabindex'),
                accept: input.getAttribute('accept')
            };
        } else {
            input = document.createElement('input');
            input.type = 'file';
            this.zone.appendChild(input);
            this._added.push(input);
        }
        this.input = input;
        const o = this.options;
        if (o.accept === null || o.accept === undefined) o.accept = input.getAttribute('accept') || null;
        if (o.multiple === null || o.multiple === undefined) o.multiple = this._restoreInput ? input.multiple : true;
        if (!o.name && input.name) o.name = input.name;
        if (o.name) input.name = o.name;
        input.multiple = flag(o.multiple, true);
        const accept = acceptList(o.accept).join(',');
        if (accept) input.setAttribute('accept', accept);
        input.hidden = true;
        // The input is the form's copy, not something to tab to
        input.tabIndex = -1;
    }

    _setupList() {
        const zone = this.zone;
        const o = this.options;

        // A default prompt, unless the caller wrote their own content into the area
        const own = Array.from(zone.childNodes).some(n => (n.nodeType === 1 && n !== this.input)
            || (n.nodeType === 3 && n.textContent.trim()));
        if (!own) {
            const prompt = document.createElement('span');
            prompt.className = 'dm-dropzone-prompt';
            const icon = document.createElement('span');
            icon.className = 'dm-dropzone-icon';
            icon.setAttribute('aria-hidden', 'true');
            icon.dataset.icon = 'upload';
            const text = document.createElement('span');
            text.className = 'dm-dropzone-text';
            text.textContent = this._labels.prompt;
            prompt.append(icon, text);
            const hintText = this._hint();
            if (hintText) {
                const hint = document.createElement('span');
                hint.className = 'dm-dropzone-hint';
                hint.id = uniqueId('dm-dropzone-hint');
                hint.textContent = hintText;
                prompt.appendChild(hint);
                this._hintId = hint.id;
            }
            zone.insertBefore(prompt, zone.firstChild);
            this._added.push(prompt);
            scanIcons(prompt);
        }
        if (this._hintId) {
            const ids = (zone.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
            zone.setAttribute('aria-describedby', [...ids, this._hintId].join(' '));
        }

        // Announcements of adds and refusals for screen readers
        const live = document.createElement('div');
        live.className = 'sr-only dm-dropzone-live';
        live.setAttribute('aria-live', 'polite');
        live.setAttribute('role', 'status');
        this._live = live;

        if (o.list !== false) {
            const list = document.createElement('ul');
            list.className = 'dm-dropzone-files';
            list.setAttribute('aria-label', 'Selected files');
            list.hidden = true;
            this._list = list;
            const host = o.list === true || o.list === undefined || o.list === null
                ? null
                : (typeof o.list === 'string' ? document.querySelector(o.list) : o.list);
            if (host && host.nodeType === 1) host.appendChild(list);
            else zone.after(list);
            this._added.push(list);
        }
        (this._list || zone).after(live);
        this._added.push(live);
    }

    _hint() {
        if (this._labels.hint !== null && this._labels.hint !== undefined) return String(this._labels.hint);
        const o = this.options;
        const parts = [];
        const tokens = acceptList(o.accept);
        if (tokens.length) parts.push(tokens.join(', '));
        if (o.maxSize) parts.push(`up to ${formatBytes(o.maxSize)}`);
        if (o.maxFiles && flag(o.multiple, true)) parts.push(`at most ${num(o.maxFiles)} files`);
        return parts.join(' · ');
    }

    _bind() {
        const zone = this.zone;
        const input = this.input;
        this._addEventListener(zone, 'click', (e) => {
            if (e.target === input || this._isLabel) return;
            this.browse();
        });
        this._addEventListener(zone, 'keydown', (e) => {
            if (e.target !== zone) return;
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                this.browse();
            }
        });
        this._addEventListener(input, 'change', () => {
            if (this._settingFiles) return;
            const files = Array.from(input.files || []);
            if (files.length) this.addFiles(files);
            else this._syncInput();
        });
        this._addEventListener(zone, 'paste', (e) => {
            const files = Array.from(e.clipboardData?.files || []);
            if (!files.length || this.isDisabled()) return;
            e.preventDefault();
            this.addFiles(files);
        });

        this._addEventListener(zone, 'dragenter', (e) => {
            if (!hasFiles(e) || this.isDisabled()) return;
            e.preventDefault();
            arm(e);
            zone.classList.add('is-dragover');
        });
        this._addEventListener(zone, 'dragover', (e) => {
            if (!hasFiles(e) || this.isDisabled()) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            zone.classList.add('is-dragover');
        });
        this._addEventListener(zone, 'dragleave', (e) => {
            if (e.relatedTarget && zone.contains(e.relatedTarget)) return;
            zone.classList.remove('is-dragover');
        });
        this._addEventListener(zone, 'drop', (e) => {
            zone.classList.remove('is-dragover');
            if (!hasFiles(e)) return;
            e.preventDefault();
            disarm();
            if (this.isDisabled()) return;
            this.addFiles(e.dataTransfer.files);
        });

        // A required input that is hidden cannot show the browser's own message
        this._addEventListener(input, 'invalid', () => {
            zone.classList.add('is-invalid');
            this._announce(this._labels.required);
            zone.focus();
        });

        const form = input.form;
        if (form && !this._canSync) {
            this._addEventListener(form, 'formdata', (e) => {
                if (this.options.upload || this.isDisabled() || !input.name) return;
                e.formData.delete(input.name);
                for (const entry of this._entries) e.formData.append(input.name, entry.file, entry.name);
            });
        }
        if (form) {
            this._addEventListener(form, 'reset', () => {
                this._timers = this._timers || [];
                this._timers.push(setTimeout(() => { if (this._entries) this.clear(); }, 0));
            });
        }
    }

    _applyDisabled() {
        const off = this.isDisabled();
        this.zone.classList.toggle('is-disabled', off);
        this.zone.setAttribute('tabindex', off ? '-1' : '0');
        if (off) this.zone.setAttribute('aria-disabled', 'true');
        else this.zone.removeAttribute('aria-disabled');
        this.input.disabled = off;
        this._list?.querySelectorAll('button').forEach((b) => { b.disabled = off; });
    }

    // ---- files ----------------------------------------------------------

    _entryFor(ref) {
        if (!ref) return null;
        return this._entries.find(e => e === ref || e.id === ref || e.file === ref) || null;
    }

    _makeEntry(file) {
        return {
            id: uniqueId('dm-file'),
            file,
            name: String(file?.name ?? 'file'),
            size: Number(file?.size) || 0,
            type: String(file?.type || ''),
            status: 'queued',
            progress: 0,
            response: null,
            error: null,
            attempts: 0,
            preview: null
        };
    }

    _rejectReason(entry, countSoFar) {
        const o = this.options;
        if (!accepts(entry.file, o.accept)) return 'type';
        if (o.maxSize && entry.size > num(o.maxSize)) return 'size';
        if (o.minSize && entry.size < num(o.minSize)) return 'size';
        const max = flag(o.multiple, true) ? num(o.maxFiles, 0) : 1;
        if (max && countSoFar >= max) return 'count';
        return null;
    }

    _rejectMessage(entry, reason) {
        const o = this.options;
        if (reason === 'size' && o.minSize && entry.size < num(o.minSize)) {
            return fill(this._labels.small, {name: entry.name, min: formatBytes(o.minSize)});
        }
        const max = reason === 'size' ? formatBytes(o.maxSize) : (flag(o.multiple, true) ? num(o.maxFiles) : 1);
        return fill(this._labels[reason], {name: entry.name, max});
    }

    /**
     * Add files (a FileList, an array of File, or one File). Each passes the accept / size /
     * count rules and `beforeadd`, or fires `reject` (type | size | count). Without
     * `multiple`, a new file replaces the one there.
     * @param {FileList|File[]|File} files
     * @returns {Object[]} the entries added
     */
    addFiles(files) {
        if (!this._entries || this.isDisabled() || !files) return [];
        let list = typeof files.length === 'number' ? Array.from(files) : [files];
        list = list.filter(Boolean);
        if (!list.length) return [];
        const single = !flag(this.options.multiple, true);
        const added = [];
        const messages = [];
        for (const file of list) {
            const entry = this._makeEntry(file);
            // In single mode the first good file replaces the current one
            const kept = single ? added.length : this._entries.length + added.length;
            const reason = this._rejectReason(entry, kept);
            if (reason) {
                messages.push(this._rejectMessage(entry, reason));
                this._fire('reject', entry, reason);
                continue;
            }
            if (this._fire('beforeadd', entry) === false) continue;
            added.push(entry);
        }
        if (added.length && single) {
            for (const old of this._entries.slice()) this._drop(old);
        }
        for (const entry of added) {
            this._entries.push(entry);
            this._preview(entry);
            this._renderEntry(entry);
            messages.push(fill(this._labels.added, {name: entry.name}));
            this._fire('add', entry);
        }
        this.zone.classList.remove('is-invalid');
        if (messages.length) this._announce(messages.join('. '));
        if (added.length) {
            this._syncInput();
            this._fire('change', this.getFiles());
            if (this.options.upload && flag(this.options.autoUpload, true)) this.upload();
        } else if (!this._canSync || this.options.upload) {
            this._syncInput();
        }
        return added;
    }

    /**
     * Remove a file (by entry, id or File). An upload in progress is cancelled.
     * @param {Object|string|File} ref
     * @returns {boolean}
     */
    removeFile(ref) {
        const entry = this._entryFor(ref);
        if (!entry) return false;
        this._drop(entry);
        this._announce(fill(this._labels.removed, {name: entry.name}));
        this._syncInput();
        this._fire('change', this.getFiles());
        this._pump();
        return true;
    }

    _drop(entry) {
        this._abort(entry);
        this._queue = this._queue.filter(e => e !== entry);
        this._entries = this._entries.filter(e => e !== entry);
        if (entry.preview) {
            URL.revokeObjectURL(entry.preview);
            entry.preview = null;
        }
        entry._row?.remove();
        entry._row = null;
        if (this._list) this._list.hidden = !this._entries.length;
        this._fire('remove', entry);
    }

    /** Remove every file. @returns {this} */
    clear() {
        if (!this._entries?.length) return this;
        for (const entry of this._entries.slice()) this._drop(entry);
        this._syncInput();
        this._fire('change', this.getFiles());
        return this;
    }

    /** @returns {File[]} the files shown, in order */
    getFiles() {
        return (this._entries || []).map(e => e.file);
    }

    /** @returns {Object[]} the entries (file, status, progress, response...) */
    getEntries() {
        return (this._entries || []).slice();
    }

    /** Open the file picker. @returns {this} */
    browse() {
        if (!this.isDisabled()) this.input.click();
        return this;
    }

    /** Keep the real input's FileList in step with the list (no upload), or empty (upload). */
    _syncInput() {
        const input = this.input;
        if (!input) return;
        this._settingFiles = true;
        try {
            if (this.options.upload || !this._canSync) {
                try { input.value = ''; } catch { /* old engines */ }
                return;
            }
            const dt = new DataTransfer();
            for (const entry of this._entries) dt.items.add(entry.file);
            input.files = dt.files;
        } catch {
            this._canSync = false;
        } finally {
            this._settingFiles = false;
        }
    }

    _announce(message) {
        if (!this._live || !message) return;
        // Clearing first makes a repeat of the same words count as a change
        this._live.textContent = '';
        this._live.textContent = message;
    }

    // ---- drawing ----------------------------------------------------------

    _preview(entry) {
        if (!flag(this.options.previews, true) || !/^image\//.test(entry.type)) return;
        if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return;
        try {
            entry.preview = URL.createObjectURL(entry.file);
        } catch {
            entry.preview = null;
        }
    }

    _renderEntry(entry) {
        if (!this._list) return;
        const row = document.createElement('li');
        row.className = 'dm-dropzone-file';
        row.dataset.id = entry.id;

        const thumb = document.createElement('span');
        thumb.className = 'dm-dropzone-thumb';
        thumb.setAttribute('aria-hidden', 'true');
        if (entry.preview) {
            const img = document.createElement('img');
            img.alt = '';
            img.src = entry.preview;
            thumb.appendChild(img);
        } else {
            const dot = entry.name.lastIndexOf('.');
            thumb.textContent = dot > 0 ? entry.name.slice(dot + 1, dot + 5).toUpperCase() : 'FILE';
        }

        const meta = document.createElement('span');
        meta.className = 'dm-dropzone-meta';
        const name = document.createElement('span');
        name.className = 'dm-dropzone-name';
        // textContent / setAttribute only - a file name is the user's text, never markup
        name.textContent = entry.name;
        name.title = entry.name;
        const size = document.createElement('span');
        size.className = 'dm-dropzone-size';
        size.textContent = formatBytes(entry.size);
        const status = document.createElement('span');
        status.className = 'dm-dropzone-status';
        meta.append(name, size, status);

        const bar = document.createElement('span');
        bar.className = 'dm-dropzone-progress';
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-valuemin', '0');
        bar.setAttribute('aria-valuemax', '100');
        bar.setAttribute('aria-label', entry.name);
        bar.hidden = true;
        const barFill = document.createElement('span');
        barFill.className = 'dm-dropzone-progress-bar';
        bar.appendChild(barFill);

        const retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'btn btn-sm btn-ghost dm-dropzone-retry';
        retry.textContent = this._labels.retry;
        retry.hidden = true;
        retry.addEventListener('click', () => this.retry(entry.id));

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'dm-dropzone-remove';
        remove.setAttribute('aria-label', fill(this._labels.remove, {name: entry.name}));
        const x = document.createElement('span');
        x.setAttribute('aria-hidden', 'true');
        x.dataset.icon = 'x';
        x.dataset.iconSize = '16';
        x.textContent = '×';
        remove.appendChild(x);
        remove.addEventListener('click', () => {
            // Focus would be lost with the row; give it to the next row's button or the area
            const next = row.nextElementSibling || row.previousElementSibling;
            this.removeFile(entry.id);
            (next?.querySelector('.dm-dropzone-remove') || this.zone).focus();
        });

        row.append(thumb, meta, bar, retry, remove);
        entry._row = row;
        entry._ui = {status, bar, barFill, retry, remove};
        this._list.appendChild(row);
        this._list.hidden = false;
        if (x.isConnected && typeof window !== 'undefined' && window.Domma?.icons) {
            x.textContent = '';
            scanIcons(remove);
        }
        this._paintEntry(entry);
    }

    _paintEntry(entry) {
        const ui = entry._ui;
        if (!ui) return;
        entry._row.dataset.status = entry.status;
        const labels = this._labels;
        const text = {
            queued: '',
            uploading: fill(labels.uploading, {percent: entry.progress}),
            done: labels.done,
            error: entry.error?.message ? `${labels.failed}: ${entry.error.message}` : labels.failed,
            cancelled: labels.cancelled
        }[entry.status] || '';
        ui.status.textContent = text;
        ui.bar.hidden = entry.status !== 'uploading' && entry.status !== 'done';
        ui.bar.setAttribute('aria-valuenow', String(entry.progress));
        ui.barFill.style.width = `${entry.progress}%`;
        ui.retry.hidden = !this.options.upload || !['error', 'cancelled'].includes(entry.status);
        ui.remove.setAttribute('aria-label', fill(entry.status === 'uploading' ? labels.cancel : labels.remove, {name: entry.name}));
    }

    // ---- uploading ----------------------------------------------------------

    /**
     * Upload every file not yet uploaded (queued, failed or cancelled). Needs `upload`.
     * @returns {this}
     */
    upload() {
        if (!this.options.upload || !this._entries) return this;
        for (const entry of this._entries) {
            if (['queued', 'error', 'cancelled'].includes(entry.status) && !this._queue.includes(entry)) {
                entry.status = 'queued';
                entry.error = null;
                entry.attempts = 0;
                this._queue.push(entry);
                this._paintEntry(entry);
            }
        }
        if (this._queue.length) this._batch = true;
        this._pump();
        return this;
    }

    /**
     * Upload failed or cancelled files again - one by id/entry/File, or all of them.
     * @param {string|Object|File} [ref]
     * @returns {this}
     */
    retry(ref) {
        if (ref === undefined) return this.upload();
        const entry = this._entryFor(ref);
        if (!entry || !this.options.upload || !['error', 'cancelled'].includes(entry.status)) return this;
        entry.status = 'queued';
        entry.error = null;
        entry.attempts = 0;
        this._queue.push(entry);
        this._batch = true;
        this._paintEntry(entry);
        this._pump();
        return this;
    }

    /**
     * Stop uploads - one file, or all of them. Queued files are taken out of the queue.
     * @param {string|Object|File} [ref]
     * @returns {this}
     */
    cancel(ref) {
        const targets = ref === undefined ? this._entries.slice() : [this._entryFor(ref)].filter(Boolean);
        for (const entry of targets) {
            if (entry.status === 'uploading') this._abort(entry);
            else if (this._queue.includes(entry)) {
                this._queue = this._queue.filter(e => e !== entry);
                entry.status = 'cancelled';
                this._paintEntry(entry);
            }
        }
        this._pump();
        return this;
    }

    _abort(entry) {
        const xhr = entry._xhr;
        if (!xhr) return;
        entry._xhr = null;
        entry._aborted = true;
        try { xhr.abort(); } catch { /* already done */ }
        entry.status = 'cancelled';
        this._active = Math.max(0, this._active - 1);
        this._paintEntry(entry);
    }

    _pump() {
        const cfg = this.options.upload || {};
        const limit = Math.max(1, num(cfg.concurrency, 2));
        while (this._active < limit && this._queue.length) this._send(this._queue.shift());
        this._maybeComplete();
    }

    _maybeComplete() {
        if (this._batch && !this._active && !this._queue.length) {
            this._batch = false;
            this._fire('complete', this.getEntries());
        }
    }

    /**
     * One file, one request. XMLHttpRequest rather than H: H is built on fetch(), and fetch
     * has no upload progress events - `xhr.upload.onprogress` is the only way a browser
     * reports how much of a request body has been sent.
     */
    _send(entry) {
        const cfg = this.options.upload;
        const resolve = (v) => (typeof v === 'function' ? v(entry) : v);
        const url = resolve(cfg.url);
        // `upload.xhr` makes the request object: for tests, or a page with no server to
        // talk to (the showcase). Anything with XMLHttpRequest's shape will do.
        const xhr = typeof cfg.xhr === 'function' ? cfg.xhr(entry) : new XMLHttpRequest();
        entry._xhr = xhr;
        entry._aborted = false;
        entry.status = 'uploading';
        entry.progress = 0;
        entry.attempts += 1;
        this._active++;
        this._paintEntry(entry);
        this._fire('uploadstart', entry);

        const done = () => {
            if (entry._xhr !== xhr) return false;   // removed or cancelled meanwhile
            entry._xhr = null;
            this._active = Math.max(0, this._active - 1);
            return true;
        };
        const fail = (error) => {
            if (entry.attempts <= num(this.options.retry, 0)) {
                entry.status = 'queued';
                this._queue.push(entry);
            } else {
                entry.status = 'error';
                entry.error = error;
                this._fire('error', entry, error);
            }
            this._paintEntry(entry);
            this._pump();
        };

        xhr.upload?.addEventListener?.('progress', (e) => {
            if (entry._xhr !== xhr || !e.lengthComputable || !e.total) return;
            const percent = Math.min(100, Math.round((e.loaded / e.total) * 100));
            if (percent === entry.progress) return;
            entry.progress = percent;
            this._paintEntry(entry);
            this._fire('progress', entry, percent);
        });
        xhr.addEventListener('load', () => {
            if (!done()) return;
            let response = xhr.responseText;
            try { response = JSON.parse(xhr.responseText); } catch { /* not JSON */ }
            if (xhr.status >= 200 && xhr.status < 300) {
                entry.status = 'done';
                entry.progress = 100;
                entry.response = response;
                this._paintEntry(entry);
                this._fire('success', entry, response);
                this._pump();
            } else {
                fail({status: xhr.status, message: xhr.statusText || `HTTP ${xhr.status}`, response});
            }
        });
        xhr.addEventListener('error', () => {
            if (done()) fail({status: 0, message: 'Network error', response: null});
        });
        xhr.addEventListener('abort', () => {
            // _abort() has already accounted for it
            if (!entry._aborted && done()) {
                entry.status = 'cancelled';
                this._paintEntry(entry);
                this._pump();
            }
        });

        try {
            xhr.open(String(cfg.method || 'POST').toUpperCase(), url, true);
            if (cfg.withCredentials) xhr.withCredentials = true;
            const headers = resolve(cfg.headers) || {};
            for (const [k, v] of Object.entries(headers)) {
                if (v !== undefined && v !== null) xhr.setRequestHeader(k, String(v));
            }
            const body = new FormData();
            const extra = resolve(cfg.data) || {};
            for (const [k, v] of Object.entries(extra)) {
                if (v !== undefined && v !== null) body.append(k, v);
            }
            body.append(cfg.field || 'file', entry.file, entry.name);
            xhr.send(body);
        } catch (err) {
            if (done()) fail({status: 0, message: err?.message || 'Upload failed', response: null});
        }
    }

    // ---- state --------------------------------------------------------------

    /** @returns {boolean} */
    isDisabled() {
        return flag(this.options.disabled);
    }

    /** @returns {this} */
    enable() {
        return this.setOptions({disabled: false});
    }

    /** @returns {this} */
    disable() {
        return this.setOptions({disabled: true});
    }

    _applyOptions() {
        if (!this._entries) return;
        this._labels = {...DEFAULT_LABELS, ...(this.options.labels || {})};
        const o = this.options;
        this.input.multiple = flag(o.multiple, true);
        const accept = acceptList(o.accept).join(',');
        if (accept) this.input.setAttribute('accept', accept);
        else this.input.removeAttribute('accept');
        if (o.name) this.input.name = o.name;
        this._applyDisabled();
        this._entries.forEach(e => this._paintEntry(e));
    }

    /** Cancel uploads, release previews, remove what was added and give the element back. */
    destroy() {
        if (!this.element || !this._entries) return super.destroy();
        (this._timers || []).forEach(clearTimeout);
        for (const entry of this._entries) {
            this._abort(entry);
            if (entry.preview) URL.revokeObjectURL(entry.preview);
        }
        this._entries = null;
        this._queue = [];
        if (this._guarded) {
            guardRemove();
            this._guarded = false;
        }
        const zone = this.zone;
        zone.classList.remove(...this._zoneClasses, 'is-dragover', 'is-disabled', 'is-invalid');
        for (const [attr, value] of Object.entries(this._restoreZone)) {
            if (value === null) zone.removeAttribute(attr);
            else zone.setAttribute(attr, value);
        }
        if (this._restoreInput) {
            const input = this.input;
            input.hidden = this._restoreInput.hidden;
            input.multiple = this._restoreInput.multiple;
            input.disabled = this._restoreInput.disabled;
            if (this._restoreInput.tabindex === null) input.removeAttribute('tabindex');
            else input.setAttribute('tabindex', this._restoreInput.tabindex);
            if (this._restoreInput.name === null) input.removeAttribute('name');
            else input.setAttribute('name', this._restoreInput.name);
            if (this._restoreInput.accept === null) input.removeAttribute('accept');
            else input.setAttribute('accept', this._restoreInput.accept);
        }
        for (const node of this._added) node.remove();
        this._added = [];
        super.destroy();
        this._onDestroy?.();
    }
}

/**
 * E.dropzone: one instance per element; a second call updates it.
 * @param {Element} el
 * @param {Object} options
 * @returns {Dropzone}
 */
export function dropzoneFor(el, options = {}) {
    const existing = instanceOf(el, 'dropzone');
    if (existing) return Object.keys(options).length ? existing.setOptions(options) : existing;
    return new Dropzone(el, options);
}

export default Dropzone;
