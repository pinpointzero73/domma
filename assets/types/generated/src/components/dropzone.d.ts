/**
 * "1.5 MB" - powers of 1024, the way file managers show sizes.
 * @param {number|string} bytes
 * @returns {string}
 */
export function formatBytes(bytes: number | string): string;
/**
 * Whether a file matches an accept list (an empty list takes anything).
 * @param {{name?: string, type?: string}|null|undefined} file
 * @param {string|string[]|null} [accept]
 * @returns {boolean}
 */
export function accepts(file: {
    name?: string;
    type?: string;
} | null | undefined, accept?: string | string[] | null): boolean;
/**
 * E.dropzone: one instance per element; a second call updates it.
 * @param {Element} el
 * @param {DropzoneOptions} [options]
 * @returns {Dropzone}
 */
export function dropzoneFor(el: Element, options?: DropzoneOptions): Dropzone;
export function _guardState(): {
    zones: number;
    armed: boolean;
};
/** @typedef {'queued'|'uploading'|'done'|'error'|'cancelled'} DropzoneStatus */
/** @typedef {'type'|'size'|'count'} DropzoneRejectReason */
/**
 * One file in a dropzone, as every event hands it over.
 * @typedef {object} DropzoneEntry
 * @property {string} id
 * @property {File} file
 * @property {string} name
 * @property {number} size
 * @property {string} type
 * @property {DropzoneStatus} status
 * @property {number} progress Upload progress, 0-100
 * @property {any} response The upload's response (parsed when it was JSON)
 * @property {DropzoneUploadError|null} error
 * @property {number} attempts Upload attempts since the last (re)queue
 * @property {string|null} preview Object URL of an image preview, revoked when the file goes
 */
/**
 * @typedef {object} DropzoneUploadError
 * @property {number} status HTTP status, 0 for a network failure
 * @property {string} message
 * @property {any} response
 */
/**
 * @typedef {object} DropzoneUploadOptions
 * @property {string|((entry: DropzoneEntry) => string)} url
 * @property {string} [method] Default 'POST'
 * @property {string} [field] FormData field for the file. Default 'file'
 * @property {Record<string, string>|((entry: DropzoneEntry) => Record<string, string>)} [headers]
 * @property {boolean} [withCredentials]
 * @property {number} [concurrency] Files sent at once. Default 2
 * @property {Record<string, string|Blob>|((entry: DropzoneEntry) => Record<string, string|Blob>)} [data] Extra FormData fields
 * @property {(entry: DropzoneEntry) => XMLHttpRequest} [xhr] Make the request object (tests, pages without a server). Default: new XMLHttpRequest()
 */
/**
 * @typedef {object} DropzoneOptions
 * @property {string|string[]|null} [accept] Like the input's accept: '.pdf,image/*' or ['.pdf', 'image/*']. Default: the input's
 * @property {boolean|null} [multiple] Default: the input's `multiple`, or true when the component makes the input
 * @property {number|null} [maxFiles]
 * @property {number|null} [maxSize] Bytes
 * @property {number|null} [minSize] Bytes
 * @property {boolean} [previews] Image thumbnails. Default true
 * @property {string|null} [name] Form field name. Default: the input's
 * @property {string|HTMLInputElement|null} [input] The file input, when it is not inside or next to the area
 * @property {boolean|string|HTMLElement} [list] true = after the area (default), an element/selector to draw into, false = no list
 * @property {DropzoneUploadOptions|null} [upload]
 * @property {boolean} [autoUpload] Default true
 * @property {number} [retry] Automatic retries per file. Default 0
 * @property {Record<string, string>} [labels] Text: prompt, hint, remove, retry, cancel, added, removed, type, size, small, count, uploading, done, failed, cancelled, required ({name}, {max}, {min}, {percent})
 * @property {boolean} [disabled]
 * @property {string} [className]
 * @property {((entry: DropzoneEntry) => boolean|void)|null} [onBeforeAdd] Return false to refuse the file
 * @property {((entry: DropzoneEntry) => void)|null} [onAdd]
 * @property {((entry: DropzoneEntry, reason: DropzoneRejectReason) => void)|null} [onReject]
 * @property {((entry: DropzoneEntry) => void)|null} [onRemove]
 * @property {((files: File[]) => void)|null} [onChange]
 * @property {((entry: DropzoneEntry) => void)|null} [onUploadStart]
 * @property {((entry: DropzoneEntry, percent: number) => void)|null} [onProgress]
 * @property {((entry: DropzoneEntry, response: any) => void)|null} [onSuccess]
 * @property {((entry: DropzoneEntry, error: DropzoneUploadError) => void)|null} [onError]
 * @property {((entries: DropzoneEntry[]) => void)|null} [onComplete]
 */
/** @typedef {Dropzone} DropzoneInstance */
export class Dropzone extends Component {
    /** @type {DropzoneOptions} */
    static defaults: DropzoneOptions;
    /**
     * @param {string|Element|null} element - The drop area, or the file input itself
     * @param {DropzoneOptions} [options]
     */
    constructor(element: string | Element | null, options?: DropzoneOptions);
    _entries: any[];
    _queue: any[];
    _active: number;
    _batch: boolean;
    _added: any[];
    _canSync: boolean;
    _labels: any;
    _guarded: boolean;
    _setupZone(): void;
    /** The drop area (the element, or the one drawn after a file input given as the target). @type {HTMLElement} */
    zone: HTMLElement;
    _givenInput: HTMLElement;
    _restoreZone: {};
    _zoneClasses: string[];
    _isLabel: boolean;
    _findInput(): any;
    _setupInput(): void;
    _restoreInput: {
        hidden: any;
        name: any;
        multiple: any;
        disabled: any;
        tabindex: any;
        accept: any;
    };
    /** The real file input. @type {HTMLInputElement} */
    input: HTMLInputElement;
    _setupList(): void;
    _hintId: string;
    _live: HTMLDivElement;
    _list: HTMLUListElement;
    _hint(): string;
    _bind(): void;
    _timers: any;
    _applyDisabled(): void;
    _entryFor(ref: any): any;
    _makeEntry(file: any): {
        id: string;
        file: any;
        name: string;
        size: number;
        type: string;
        status: string;
        progress: number;
        response: any;
        error: any;
        attempts: number;
        preview: any;
    };
    _rejectReason(entry: any, countSoFar: any): "size" | "type" | "count";
    _rejectMessage(entry: any, reason: any): string;
    /**
     * Add files (a FileList, an array of File, or one File). Each passes the accept / size /
     * count rules and `beforeadd`, or fires `reject` (type | size | count). Without
     * `multiple`, a new file replaces the one there.
     * @param {FileList|File[]|File} files
     * @returns {DropzoneEntry[]} the entries added
     */
    addFiles(files: FileList | File[] | File): DropzoneEntry[];
    /**
     * Remove a file (by entry, id or File). An upload in progress is cancelled.
     * @param {DropzoneEntry|string|File} ref
     * @returns {boolean}
     */
    removeFile(ref: DropzoneEntry | string | File): boolean;
    _drop(entry: any): void;
    /** Remove every file. @returns {this} */
    clear(): this;
    /** @returns {File[]} the files shown, in order */
    getFiles(): File[];
    /** @returns {DropzoneEntry[]} the entries (file, status, progress, response...) */
    getEntries(): DropzoneEntry[];
    /** Open the file picker. @returns {this} */
    browse(): this;
    /** Keep the real input's FileList in step with the list (no upload), or empty (upload). */
    _syncInput(): void;
    _settingFiles: boolean;
    _announce(message: any): void;
    _preview(entry: any): void;
    _renderEntry(entry: any): void;
    _paintEntry(entry: any): void;
    /**
     * Upload every file not yet uploaded (queued, failed or cancelled). Needs `upload`.
     * @returns {this}
     */
    upload(): this;
    /**
     * Upload failed or cancelled files again - one by id/entry/File, or all of them.
     * @param {string|DropzoneEntry|File} [ref]
     * @returns {this}
     */
    retry(ref?: string | DropzoneEntry | File): this;
    /**
     * Stop uploads - one file, or all of them. Queued files are taken out of the queue.
     * @param {string|DropzoneEntry|File} [ref]
     * @returns {this}
     */
    cancel(ref?: string | DropzoneEntry | File): this;
    _abort(entry: any): void;
    _pump(): void;
    _maybeComplete(): void;
    /**
     * One file, one request. XMLHttpRequest rather than H: H is built on fetch(), and fetch
     * has no upload progress events - `xhr.upload.onprogress` is the only way a browser
     * reports how much of a request body has been sent.
     */
    _send(entry: any): void;
    /** @returns {boolean} */
    isDisabled(): boolean;
    /** @returns {this} */
    enable(): this;
    /** @returns {this} */
    disable(): this;
    _applyOptions(): void;
}
export default Dropzone;
export type DropzoneStatus = "queued" | "uploading" | "done" | "error" | "cancelled";
export type DropzoneRejectReason = "type" | "size" | "count";
/**
 * One file in a dropzone, as every event hands it over.
 */
export type DropzoneEntry = {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    status: DropzoneStatus;
    /**
     * Upload progress, 0-100
     */
    progress: number;
    /**
     * The upload's response (parsed when it was JSON)
     */
    response: any;
    error: DropzoneUploadError | null;
    /**
     * Upload attempts since the last (re)queue
     */
    attempts: number;
    /**
     * Object URL of an image preview, revoked when the file goes
     */
    preview: string | null;
};
export type DropzoneUploadError = {
    /**
     * HTTP status, 0 for a network failure
     */
    status: number;
    message: string;
    response: any;
};
export type DropzoneUploadOptions = {
    url: string | ((entry: DropzoneEntry) => string);
    /**
     * Default 'POST'
     */
    method?: string;
    /**
     * FormData field for the file. Default 'file'
     */
    field?: string;
    headers?: Record<string, string> | ((entry: DropzoneEntry) => Record<string, string>);
    withCredentials?: boolean;
    /**
     * Files sent at once. Default 2
     */
    concurrency?: number;
    /**
     * Extra FormData fields
     */
    data?: Record<string, string | Blob> | ((entry: DropzoneEntry) => Record<string, string | Blob>);
    /**
     * Make the request object (tests, pages without a server). Default: new XMLHttpRequest()
     */
    xhr?: (entry: DropzoneEntry) => XMLHttpRequest;
};
export type DropzoneOptions = {
    /**
     * Like the input's accept: '.pdf,image/*' or ['.pdf', 'image/*']. Default: the input's
     */
    accept?: string | string[] | null;
    /**
     * Default: the input's `multiple`, or true when the component makes the input
     */
    multiple?: boolean | null;
    maxFiles?: number | null;
    /**
     * Bytes
     */
    maxSize?: number | null;
    /**
     * Bytes
     */
    minSize?: number | null;
    /**
     * Image thumbnails. Default true
     */
    previews?: boolean;
    /**
     * Form field name. Default: the input's
     */
    name?: string | null;
    /**
     * The file input, when it is not inside or next to the area
     */
    input?: string | HTMLInputElement | null;
    /**
     * true = after the area (default), an element/selector to draw into, false = no list
     */
    list?: boolean | string | HTMLElement;
    upload?: DropzoneUploadOptions | null;
    /**
     * Default true
     */
    autoUpload?: boolean;
    /**
     * Automatic retries per file. Default 0
     */
    retry?: number;
    /**
     * Text: prompt, hint, remove, retry, cancel, added, removed, type, size, small, count, uploading, done, failed, cancelled, required ({name}, {max}, {min}, {percent})
     */
    labels?: Record<string, string>;
    disabled?: boolean;
    className?: string;
    /**
     * Return false to refuse the file
     */
    onBeforeAdd?: ((entry: DropzoneEntry) => boolean | void) | null;
    onAdd?: ((entry: DropzoneEntry) => void) | null;
    onReject?: ((entry: DropzoneEntry, reason: DropzoneRejectReason) => void) | null;
    onRemove?: ((entry: DropzoneEntry) => void) | null;
    onChange?: ((files: File[]) => void) | null;
    onUploadStart?: ((entry: DropzoneEntry) => void) | null;
    onProgress?: ((entry: DropzoneEntry, percent: number) => void) | null;
    onSuccess?: ((entry: DropzoneEntry, response: any) => void) | null;
    onError?: ((entry: DropzoneEntry, error: DropzoneUploadError) => void) | null;
    onComplete?: ((entries: DropzoneEntry[]) => void) | null;
};
export type DropzoneInstance = Dropzone;
import Component from '../component.js';
