export default Sortable;
/**
 * Where an indicator-mode drop lands relative to its target.
 */
export type SortableZone = "before" | "after" | "into";
export type SortableStartDetail = {
    item: HTMLElement;
    /**
     * - Index of the item when the drag began
     */
    from: number;
};
export type SortableMoveDetail = {
    item: HTMLElement;
    /**
     * - The item under the pointer (indicator mode: the accepted drop target), or null
     */
    target: HTMLElement | null;
    /**
     * - Indicator mode only; null in live mode
     */
    zone: SortableZone | null;
    x: number;
    y: number;
};
export type SortableSortDetail = {
    item: HTMLElement;
    from: number;
    to: number;
    /**
     * - Every item's key, in the new order
     */
    order: (string | null)[];
    /**
     * - Every item's key, in the order before the drag
     */
    previous: (string | null)[];
};
export type SortableDropDetail = {
    /**
     * - The dragged element (it has not moved - the host re-renders)
     */
    item: HTMLElement;
    /**
     * - The item it was dropped on or beside
     */
    target: HTMLElement;
    zone: SortableZone;
    /**
     * - Value of the `key` attribute on the dragged item
     */
    key: string | null;
    /**
     * - Value of the `key` attribute on the target
     */
    targetKey: string | null;
};
export type SortableEndDetail = {
    item: HTMLElement;
    /**
     * - Whether the order changed
     */
    changed: boolean;
};
export type SortableOptions = {
    /**
     * - Selector for the sortable items; null = the container's direct children
     */
    items?: string | null;
    /**
     * - Selector inside an item that starts a drag; null = the whole item
     */
    handle?: string | null;
    /**
     * - Adds an "into" drop zone and switches to indicator mode (for trees)
     */
    nest?: boolean;
    /**
     * - null = !nest. true = siblings slide aside while you drag; false = indicator mode
     */
    live?: boolean | null;
    /**
     * - 'y' for a column, 'x' for a row
     */
    axis?: "x" | "y";
    /**
     * - Attribute that identifies an item across re-renders (default 'data-id')
     */
    key?: string;
    /**
     * - Animation duration in ms; 0 turns it off. Reduced motion always does
     */
    animation?: number;
    /**
     * - CSS easing for every glide
     */
    easing?: string;
    /**
     * - Pixels the pointer must travel before a press becomes a drag (default 4)
     */
    threshold?: number;
    /**
     * - Ms a finger must rest on an item with no handle before it drags (default 220)
     */
    touchDelay?: number;
    /**
     * - Share of an item's height, centred, that means "into" (default 0.5)
     */
    nestZone?: number;
    /**
     * - Veto a drop. Live mode passes 'before' or 'after'
     */
    accepts?: ((item: HTMLElement, target: HTMLElement, zone: SortableZone) => boolean) | null;
    /**
     * - Start disabled
     */
    disabled?: boolean;
    /**
     * - Alt+Arrow moves the focused item (live mode). Default true
     */
    keyboard?: boolean;
    /**
     * - Storage key (or true = the container's id): remember the order. Live mode
     */
    persist?: string | boolean;
    /**
     * - Scroll the nearest scrolling ancestor (or the page) near its edges. Default true
     */
    autoScroll?: boolean;
    /**
     * - Where the dragged copy is appended; null = the container
     */
    ghostParent?: HTMLElement | null;
    onStart?: ((detail: SortableStartDetail) => void) | null;
    onMove?: ((detail: SortableMoveDetail) => void) | null;
    /**
     * - Live mode: the order changed
     */
    onSort?: ((detail: SortableSortDetail) => void) | null;
    /**
     * - Indicator mode: update your data and re-render here. Return false (or a promise that rejects) to refuse; a returned promise is awaited before animating.
     */
    onDrop?: ((detail: SortableDropDetail) => boolean | void | Promise<any>) | null;
    /**
     * - Esc, a refused drop, or a drop over nothing
     */
    onCancel?: ((detail: {
        item: HTMLElement;
    }) => void) | null;
    /**
     * - Every drag, keyboard move and cancel ends here
     */
    onEnd?: ((detail: SortableEndDetail) => void) | null;
};
export type SortableInstance = Sortable;
/**
 * Where an indicator-mode drop lands relative to its target.
 * @typedef {'before'|'after'|'into'} SortableZone
 */
/**
 * @typedef {object} SortableStartDetail
 * @property {HTMLElement} item
 * @property {number} from - Index of the item when the drag began
 */
/**
 * @typedef {object} SortableMoveDetail
 * @property {HTMLElement} item
 * @property {HTMLElement|null} target - The item under the pointer (indicator mode: the accepted drop target), or null
 * @property {SortableZone|null} zone - Indicator mode only; null in live mode
 * @property {number} x
 * @property {number} y
 */
/**
 * @typedef {object} SortableSortDetail
 * @property {HTMLElement} item
 * @property {number} from
 * @property {number} to
 * @property {(string|null)[]} order - Every item's key, in the new order
 * @property {(string|null)[]} previous - Every item's key, in the order before the drag
 */
/**
 * @typedef {object} SortableDropDetail
 * @property {HTMLElement} item - The dragged element (it has not moved - the host re-renders)
 * @property {HTMLElement} target - The item it was dropped on or beside
 * @property {SortableZone} zone
 * @property {string|null} key - Value of the `key` attribute on the dragged item
 * @property {string|null} targetKey - Value of the `key` attribute on the target
 */
/**
 * @typedef {object} SortableEndDetail
 * @property {HTMLElement} item
 * @property {boolean} changed - Whether the order changed
 */
/**
 * @typedef {object} SortableOptions
 * @property {string|null} [items] - Selector for the sortable items; null = the container's direct children
 * @property {string|null} [handle] - Selector inside an item that starts a drag; null = the whole item
 * @property {boolean} [nest] - Adds an "into" drop zone and switches to indicator mode (for trees)
 * @property {boolean|null} [live] - null = !nest. true = siblings slide aside while you drag; false = indicator mode
 * @property {'x'|'y'} [axis] - 'y' for a column, 'x' for a row
 * @property {string} [key] - Attribute that identifies an item across re-renders (default 'data-id')
 * @property {number} [animation] - Animation duration in ms; 0 turns it off. Reduced motion always does
 * @property {string} [easing] - CSS easing for every glide
 * @property {number} [threshold] - Pixels the pointer must travel before a press becomes a drag (default 4)
 * @property {number} [touchDelay] - Ms a finger must rest on an item with no handle before it drags (default 220)
 * @property {number} [nestZone] - Share of an item's height, centred, that means "into" (default 0.5)
 * @property {((item: HTMLElement, target: HTMLElement, zone: SortableZone) => boolean)|null} [accepts] - Veto a drop. Live mode passes 'before' or 'after'
 * @property {boolean} [disabled] - Start disabled
 * @property {boolean} [keyboard] - Alt+Arrow moves the focused item (live mode). Default true
 * @property {string|boolean} [persist] - Storage key (or true = the container's id): remember the order. Live mode
 * @property {boolean} [autoScroll] - Scroll the nearest scrolling ancestor (or the page) near its edges. Default true
 * @property {HTMLElement|null} [ghostParent] - Where the dragged copy is appended; null = the container
 * @property {((detail: SortableStartDetail) => void)|null} [onStart]
 * @property {((detail: SortableMoveDetail) => void)|null} [onMove]
 * @property {((detail: SortableSortDetail) => void)|null} [onSort] - Live mode: the order changed
 * @property {((detail: SortableDropDetail) => boolean|void|Promise<any>)|null} [onDrop] - Indicator mode: update your data and re-render here. Return false (or a promise that rejects) to refuse; a returned promise is awaited before animating.
 * @property {((detail: {item: HTMLElement}) => void)|null} [onCancel] - Esc, a refused drop, or a drop over nothing
 * @property {((detail: SortableEndDetail) => void)|null} [onEnd] - Every drag, keyboard move and cancel ends here
 */
/** @typedef {Sortable} SortableInstance */
declare class Sortable extends Component {
    /** @type {SortableOptions} */
    static defaults: SortableOptions;
    /**
     * @param {string|HTMLElement} selector - The container whose items are sorted
     * @param {SortableOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: SortableOptions);
    _drag: {
        item: Element;
        pointerId: any;
        ghost: Node;
        rect: DOMRect;
        offsetX: number;
        offsetY: number;
        x: any;
        y: any;
        from: number;
        previous: string[];
        origin: {
            parent: ParentNode;
            next: ChildNode;
        };
        key: string;
        target: any;
        zone: any;
        indicator: any;
        scrollRaf: any;
    };
    _pending: {
        item: Element;
        pointerId: any;
        startX: any;
        startY: any;
        ready: boolean;
        timer: any;
    };
    _animating: WeakSet<object>;
    _flips: WeakMap<object, any>;
    _docHandlers: any[];
    _observer: MutationObserver;
    /**
     * The keys of the items, in their current order.
     * @returns {(string|null)[]}
     */
    toArray(): (string | null)[];
    /**
     * Put the items in the order of `keys`. Items not named keep their slots.
     * @param {(string|number)[]} keys
     * @param {{animate?: boolean}} [options]
     * @returns {this}
     */
    sort(keys: (string | number)[], { animate }?: {
        animate?: boolean;
    }): this;
    /**
     * Re-apply the saved order (live mode with `persist`).
     * @returns {this}
     */
    restore(): this;
    /**
     * Forget the saved order.
     * @returns {this}
     */
    forget(): this;
    /**
     * Run `mutate` (which may re-render the container) and animate every item
     * from where it was to where it is afterwards, matched by `key`.
     * Returns whatever `mutate` returns; a promise is awaited before animating.
     * @template T
     * @param {() => T} mutate
     * @returns {T}
     */
    animate<T>(mutate: () => T): T;
    /**
     * Re-arm dragging.
     * @returns {this}
     */
    enable(): this;
    /**
     * Stop dragging; a drag in progress is cancelled.
     * @returns {this}
     */
    disable(): this;
    /**
     * Whether a drag is in progress.
     * @returns {boolean}
     */
    get dragging(): boolean;
    _applyOptions(): void;
    _isLive(): boolean;
    _items(): any[];
    /** The sortable container an element belongs to - a nested sortable claims its own. */
    _ownerOf(el: any): any;
    _itemFrom(node: any): Element;
    _keyOf(el: any): string;
    _byKey(key: any): any;
    _markHandles(): void;
    _storageKey(): string;
    _duration(): number;
    _onPointerDown(e: any): void;
    _onPointerMove(e: any): void;
    /**
     * Run pointer/keyboard work so that a host callback which throws cannot
     * leave the page stuck mid-drag (ghost on screen, grab cursor, listeners on).
     */
    _guard(fn: any): any;
    _onPointerUp(e: any): void;
    _onPointerCancel(e: any): void;
    _listenDoc(event: any, handler: any, opts: any): void;
    _listenWin(event: any, handler: any, opts: any): void;
    _unlistenDoc(): void;
    _clearPending(): void;
    _begin(startX: any, startY: any): void;
    _moveTo(x: any, y: any): void;
    /**
     * Move the placeholder past `target` once the pointer is far enough over it
     * that, after the move, the pointer would sit on the placeholder. Anything
     * less oscillates when the two differ in size.
     */
    _liveSwap(target: any, x: any, y: any): void;
    _zoneFor(target: any, x: any, y: any): "before" | "after" | "into";
    _indicate(target: any, x: any, y: any): void;
    _placeIndicator(): void;
    _drop(): void;
    _cancel(): void;
    /** Land the ghost on the item's (possibly new) element, then tidy up. */
    _finish(landed: any): void;
    /** A drag that ends over an item must not also click it. */
    _suppressClick(): void;
    _scrollLoop(): void;
    _onKeyDown(e: any): void;
    /** Tell screen readers where the item now sits. */
    _announce(item: any): void;
    _liveRegion: HTMLDivElement;
    /** Where every item is now, by element and by key. */
    _snapshot({ withDragged }?: {
        withDragged?: boolean;
    }): Map<any, any>;
    /** Animate each item from its rect in `before` to where it is now. */
    _playFlip(before: any): void;
    /** Live mode: move elements and slide everything, the slot included, into place. */
    _flipItems(mutate: any): void;
    _save(order: any): void;
    /** The onX callback, .on() listeners and `dm:sortable:<name>`, then the older `sortable:<name>` (kept until 1.0). */
    _signal(name: any, detail: any): void;
    _dispatch(name: any, detail: any): void;
}
import Component from './component.js';
