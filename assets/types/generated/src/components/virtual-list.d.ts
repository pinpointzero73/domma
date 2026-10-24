/**
 * E.virtualList: one instance per container; calling it again updates the existing one.
 * @param {Element} el
 * @param {VirtualListOptions} [options]
 * @returns {VirtualList}
 */
export function virtualListFor(el: Element, options?: VirtualListOptions): VirtualList;
/**
 * First and last index, both inclusive (end is -1 for an empty list).
 * @typedef {object} VirtualListRange
 * @property {number} start - First index, inclusive
 * @property {number} end - Last index, inclusive (-1 for an empty list)
 */
/**
 * A loading / end / error row: HTML string, a node, or a function returning either.
 * @typedef {string|Node|((error?: unknown) => string|Node|null)|null} VirtualListTemplate
 */
/**
 * @template [T=any]
 * @typedef {object} VirtualListOptions
 * @property {T[]|null} [items]
 * @property {number} [count] - With getItem, instead of items
 * @property {((index: number) => T)|null} [getItem]
 * @property {number|'auto'} [itemHeight] - px, or 'auto' to measure each row (default 40)
 * @property {number} [estimatedItemHeight] - Height assumed for unmeasured rows in 'auto' mode (default 40)
 * @property {number} [overscan] - Rows rendered beyond each edge (default 4)
 * @property {((item: T, index: number) => string|Node)|null} [render] - A string is HTML (sanitised unless safe: false); an Element goes in as it is
 * @property {boolean} [safe] - false: render() strings are inserted unsanitised (default true)
 * @property {string|((item: T, index: number) => unknown)|null} [keyField] - Property name or function giving each item a stable key (default: the index)
 * @property {string|null} [label] - aria-label for the list
 * @property {string} [rowClass] - Extra class on every row
 * @property {((info: {count: number, page: number}) => Promise<T[]|{items: T[], done?: boolean}>)|null} [loadMore] - Called near the end; resolves to the next items, or {items, done}
 * @property {number} [threshold] - px from the end at which loadMore is called (default 200)
 * @property {VirtualListTemplate} [loadingTemplate]
 * @property {VirtualListTemplate} [endTemplate]
 * @property {VirtualListTemplate} [errorTemplate] - A [data-vlist-retry] element inside it retries
 * @property {((range: VirtualListRange) => void)|null} [onRender]
 * @property {((visible: VirtualListRange) => void)|null} [onScroll]
 * @property {((info: {count: number, page: number}) => void)|null} [onLoadMore]
 * @property {((items: T[]) => void)|null} [onLoaded]
 * @property {(() => void)|null} [onEnd]
 * @property {((error: unknown) => void)|null} [onError]
 * @property {((item: T, index: number, event: MouseEvent|KeyboardEvent) => void)|null} [onItemClick]
 */
/**
 * @template [T=any]
 * @typedef {VirtualList<T>} VirtualListInstance
 */
/**
 * @template [T=any]
 */
export class VirtualList<T = any> extends Component {
    static defaults: {
        items: any;
        count: number;
        getItem: any;
        itemHeight: number;
        estimatedItemHeight: number;
        overscan: number;
        render: any;
        safe: boolean;
        keyField: any;
        label: any;
        loadMore: any;
        threshold: number;
        loadingTemplate: any;
        endTemplate: any;
        errorTemplate: any;
        rowClass: string;
        onRender: any;
        onScroll: any;
        onLoadMore: any;
        onLoaded: any;
        onEnd: any;
        onError: any;
        onItemClick: any;
    };
    /**
     * @param {string|HTMLElement} element - The scrolling container
     * @param {VirtualListOptions<T>} [options]
     */
    constructor(element: string | HTMLElement, options?: VirtualListOptions<T>);
    _id: string;
    _rows: Map<any, any>;
    _rowByEl: WeakMap<object, any>;
    _heights: Map<any, any>;
    _offsets: Float64Array;
    _dirtyFrom: number;
    _active: number;
    _focusWithin: boolean;
    _frame: number;
    _range: {
        start: number;
        end: number;
    };
    _load: {
        busy: boolean;
        done: boolean;
        error: any;
        page: number;
        gen: number;
    };
    _statusHeight: number;
    _setData(items: any, count: any, getItem: any): void;
    _items: any[];
    _count: number;
    _getItem: any;
    /** How many rows there are. */
    get count(): number;
    _itemAt(i: any): any;
    _keyOf(item: any, i: any): any;
    get _fixed(): boolean;
    get _rowHeight(): number;
    get _estimate(): number;
    /** Bring the offset table up to date ('auto' only). Linear from the first change. */
    _syncOffsets(): void;
    _dirty(index: any): void;
    _offset(i: any): number;
    _heightOf(i: any): number;
    _total(): number;
    /** The index of the row covering y (clamped to the list). */
    _indexAt(y: any): number;
    _viewport(): number;
    /**
     * The rows at least partly on screen, first and last index inclusive.
     * @returns {VirtualListRange} end is -1 for an empty list
     */
    getVisibleRange(): VirtualListRange;
    _build(): void;
    _original: DocumentFragment;
    _spacer: HTMLDivElement;
    _list: HTMLDivElement;
    _status: HTMLDivElement;
    _hostObserver: ResizeObserver;
    _rowObserver: ResizeObserver;
    _schedule(): void;
    _onScroll: () => void;
    _makeRow(): HTMLDivElement;
    _fillRow(row: any, item: any, index: any): void;
    /**
     * Render the rows the viewport needs. Synchronous: used by the scroll frame and by
     * every method that changes the data.
     * @param {boolean} [force] - re-render every row's content, not just new ones
     */
    _render(force?: boolean): void;
    /** One placement pass. @returns {{range: boolean, resized: boolean}} */
    _renderPass(force: any): {
        range: boolean;
        resized: boolean;
    };
    _placeStatus(): void;
    _onRowResize(entries: any): void;
    _rowFor(index: any): any;
    /** One tab stop: the active row, or the first row on screen when that is not rendered. */
    _syncTabStop(): void;
    _rowOf(target: any): any;
    _onClick: (e: any) => void;
    _onFocusIn: (e: any) => void;
    _onFocusOut: (e: any) => void;
    _onKey: (e: any) => void;
    /**
     * Make a row the active one, scroll it into view and focus it.
     * @param {number} index
     * @returns {this}
     */
    focusIndex(index: number): this;
    _maybeLoad(): void;
    _loadNext(): void;
    /**
     * Try a failed load again.
     * @returns {this}
     */
    retry(): this;
    /**
     * Whether loadMore has said there is nothing more.
     * @returns {boolean}
     */
    isDone(): boolean;
    _template(kind: any): any;
    _showStatus(kind: any): void;
    /**
     * Replace every item. Resets infinite loading (a new list can load more again).
     * @param {T[]} items
     * @returns {this}
     */
    setItems(items: T[]): this;
    /**
     * Count mode: change how many rows `getItem` serves.
     * @param {number} count
     * @returns {this}
     */
    setCount(count: number): this;
    _resetLoading(): void;
    _materialise(): void;
    _appendItems(items: any): void;
    /**
     * Add items at the end.
     * @param {T[]} items
     * @returns {this}
     */
    append(items: T[]): this;
    /**
     * Add items at the start without moving what is on screen.
     * @param {T[]} items
     * @returns {this}
     */
    prepend(items: T[]): this;
    /**
     * The index of the item with a key, or -1.
     * @param {unknown} key
     * @returns {number}
     */
    indexOfKey(key: unknown): number;
    /**
     * Replace one item. A number is an index; anything else is a key (for numeric keys,
     * pass `list.indexOfKey(key)`).
     * @param {number|unknown} indexOrKey
     * @param {T} item
     * @returns {this}
     */
    update(indexOrKey: number | unknown, item: T): this;
    /**
     * Scroll so a row is in view.
     * @param {number} index
     * @param {{align?: 'start'|'center'|'end'|'auto', smooth?: boolean}} [opts]
     * @returns {this}
     */
    scrollToIndex(index: number, opts?: {
        align?: "start" | "center" | "end" | "auto";
        smooth?: boolean;
    }): this;
    /**
     * Re-render every rendered row (and re-measure them in 'auto' mode), e.g. after
     * the data an item points at has changed.
     * @returns {this}
     */
    refresh(): this;
    /**
     * The rendered range, overscan included.
     * @returns {VirtualListRange}
     */
    getRenderedRange(): VirtualListRange;
    _applyOptions(): void;
    /**
     * Update options at runtime; items / count / getItem replace the data.
     * @param {VirtualListOptions<T>} [newOptions]
     * @returns {this}
     */
    setOptions(newOptions?: VirtualListOptions<T>): this;
}
export default VirtualList;
/**
 * First and last index, both inclusive (end is -1 for an empty list).
 */
export type VirtualListRange = {
    /**
     * - First index, inclusive
     */
    start: number;
    /**
     * - Last index, inclusive (-1 for an empty list)
     */
    end: number;
};
/**
 * A loading / end / error row: HTML string, a node, or a function returning either.
 */
export type VirtualListTemplate = string | Node | ((error?: unknown) => string | Node | null) | null;
export type VirtualListOptions<T = any> = {
    items?: T[] | null;
    /**
     * - With getItem, instead of items
     */
    count?: number;
    getItem?: ((index: number) => T) | null;
    /**
     * - px, or 'auto' to measure each row (default 40)
     */
    itemHeight?: number | "auto";
    /**
     * - Height assumed for unmeasured rows in 'auto' mode (default 40)
     */
    estimatedItemHeight?: number;
    /**
     * - Rows rendered beyond each edge (default 4)
     */
    overscan?: number;
    /**
     * - A string is HTML (sanitised unless safe: false); an Element goes in as it is
     */
    render?: ((item: T, index: number) => string | Node) | null;
    /**
     * - false: render() strings are inserted unsanitised (default true)
     */
    safe?: boolean;
    /**
     * - Property name or function giving each item a stable key (default: the index)
     */
    keyField?: string | ((item: T, index: number) => unknown) | null;
    /**
     * - aria-label for the list
     */
    label?: string | null;
    /**
     * - Extra class on every row
     */
    rowClass?: string;
    /**
     * - Called near the end; resolves to the next items, or {items, done}
     */
    loadMore?: ((info: {
        count: number;
        page: number;
    }) => Promise<T[] | {
        items: T[];
        done?: boolean;
    }>) | null;
    /**
     * - px from the end at which loadMore is called (default 200)
     */
    threshold?: number;
    loadingTemplate?: VirtualListTemplate;
    endTemplate?: VirtualListTemplate;
    /**
     * - A [data-vlist-retry] element inside it retries
     */
    errorTemplate?: VirtualListTemplate;
    onRender?: ((range: VirtualListRange) => void) | null;
    onScroll?: ((visible: VirtualListRange) => void) | null;
    onLoadMore?: ((info: {
        count: number;
        page: number;
    }) => void) | null;
    onLoaded?: ((items: T[]) => void) | null;
    onEnd?: (() => void) | null;
    onError?: ((error: unknown) => void) | null;
    onItemClick?: ((item: T, index: number, event: MouseEvent | KeyboardEvent) => void) | null;
};
export type VirtualListInstance<T = any> = VirtualList<T>;
import Component from '../component.js';
