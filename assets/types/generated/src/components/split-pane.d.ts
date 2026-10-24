/**
 * E.splitPane: one instance per container; calling it again updates the existing one.
 * @param {Element} el
 * @param {SplitPaneOptions} [options]
 * @returns {SplitPane}
 */
export function splitPaneFor(el: Element, options?: SplitPaneOptions): SplitPane;
/**
 * A pane size limit: px as a number, or a percentage string such as '20%'.
 * @typedef {number|string} SplitPaneSize
 */
/**
 * @typedef {object} SplitPaneOptions
 * @property {'horizontal'|'vertical'} [direction] - 'horizontal' = side by side (default), 'vertical' = stacked
 * @property {number[]|null} [sizes] - Percentages, one per pane (scaled to add up to 100); equal by default
 * @property {SplitPaneSize|SplitPaneSize[]} [minSize] - Minimum size, one value or one per pane (default 0)
 * @property {SplitPaneSize|null|Array<SplitPaneSize|null>} [maxSize] - Maximum size, one value or one per pane (default none)
 * @property {number} [gutterSize] - Gutter thickness in px (default 8)
 * @property {number} [snapOffset] - Snap to a limit when dragged within this many px of it (default 0)
 * @property {boolean|boolean[]} [collapsible] - Which panes the gutter gestures may collapse
 * @property {SplitPaneSize|SplitPaneSize[]} [collapsedSize] - What a collapsed pane shrinks to (default 0)
 * @property {boolean} [collapseButton] - A small toggle button in gutters next to a collapsible pane
 * @property {string|null} [persistKey] - Remember sizes and collapse state with S under 'split-pane:<key>'
 * @property {string|null} [cursor] - Gutter cursor (default col-resize / row-resize)
 * @property {boolean} [disabled]
 * @property {number} [step] - Percent per arrow key (default 1)
 * @property {number} [largeStep] - Percent per Shift+arrow (default 10)
 * @property {string} [gutterLabel] - The gutters' aria-label
 * @property {((gutterIndex: number, event: PointerEvent) => boolean|void)|null} [onBeforeDrag] - Return false to refuse a drag
 * @property {((sizes: number[], gutterIndex: number) => void)|null} [onDragStart]
 * @property {((sizes: number[], gutterIndex: number) => void)|null} [onDrag]
 * @property {((sizes: number[], gutterIndex: number) => void)|null} [onDragEnd]
 * @property {((sizes: number[]) => void)|null} [onResize] - Any size change: drag, keys, setSizes, collapse
 * @property {((paneIndex: number) => void)|null} [onCollapse]
 * @property {((paneIndex: number) => void)|null} [onExpand]
 */
/** @typedef {SplitPane} SplitPaneInstance */
export class SplitPane extends Component {
    static defaults: {
        direction: string;
        sizes: any;
        minSize: number;
        maxSize: any;
        gutterSize: number;
        snapOffset: number;
        collapsible: boolean;
        collapsedSize: number;
        collapseButton: boolean;
        persistKey: any;
        cursor: any;
        disabled: boolean;
        step: number;
        largeStep: number;
        gutterLabel: string;
        onBeforeDrag: any;
        onDragStart: any;
        onDrag: any;
        onDragEnd: any;
        onResize: any;
        onCollapse: any;
        onExpand: any;
    };
    /**
     * @param {string|HTMLElement} element - The container; its element children are the panes
     * @param {SplitPaneOptions} [options]
     */
    constructor(element: string | HTMLElement, options?: SplitPaneOptions);
    _gutters: any[];
    _drag: {
        index: any;
        pointerId: any;
        start: any;
        startSize: any;
        available: number;
        sign: number;
        gutter: any;
    };
    _collapsed: any[];
    _restoreTo: any[];
    _addedIds: any[];
    _frame: number;
    _containerStyle: string;
    /** The pane elements. @type {HTMLElement[]} */
    panes: HTMLElement[];
    _paneStyles: string[];
    get horizontal(): boolean;
    _build(): void;
    _sizes: any;
    _observer: ResizeObserver;
    _makeGutter(i: any): HTMLDivElement;
    /** Settings that can change after set-up: disabled, gutter size, cursor, label, buttons. */
    _applyOptions(): void;
    _syncButton(gutter: any, i: any): void;
    /** Sizes as percentages that add up to 100, one per pane. */
    _normalise(sizes: any): any[];
    /** Space shared by the panes: the container less its gutters, in px. */
    _available(): number;
    /** A px number or '%' string as a percentage of the shared space. */
    _toPercent(value: any, available: any, fallback: any): any;
    _limits(i: any, available?: number): {
        min: any;
        max: number;
    };
    /** Pull every pane inside its limits, moving the difference to its neighbours. */
    _clampAll(sizes: any): any;
    /** Pane indexes ordered by distance from i, nearest first. */
    _neighbours(i: any): any[];
    _apply(sizes: any): void;
    _syncAria(): void;
    /**
     * Move the boundary between pane i and pane i + 1 so pane i is `want` percent,
     * within both panes' limits.
     */
    _moveBoundary(i: any, want: any, { snap }?: {
        snap?: boolean;
    }): boolean;
    _onPointerDown(e: any, i: any): void;
    _onPointerMove: (e: any) => void;
    _onPointerUp: (e: any) => void;
    /** Dragging either side of a collapsed pane opens it from its collapsed size. */
    _uncollapseForDrag(i: any): void;
    _onKey(e: any, i: any): void;
    _isCollapsible(i: any): boolean;
    /** The pane a gutter collapses: the one before it if it may, else the one after. */
    _collapseTarget(gutter: any): any;
    _toggleFromGutter(i: any): void;
    /**
     * Collapse a pane toward the edge it sits against; the space goes to its neighbour.
     * Works on any pane, collapsible or not (the option only governs the gutter's gestures).
     * @param {number} i - pane index
     * @returns {this}
     */
    collapse(i: number): this;
    /**
     * Restore a collapsed pane to the size it had, taking the space back from its neighbour.
     * @param {number} i - pane index
     * @returns {this}
     */
    expand(i: number): this;
    /** @param {number} i @returns {boolean} whether pane i is collapsed */
    isCollapsed(i: number): boolean;
    /**
     * The pane sizes, as percentages of the space the panes share (they add up to 100).
     * @returns {number[]}
     */
    getSizes(): number[];
    /**
     * Set every pane's size. The array is scaled to add up to 100 and then pulled inside
     * each pane's limits. Collapsed panes are expanded.
     * @param {number[]} sizes - one per pane
     * @returns {this}
     */
    setSizes(sizes: number[]): this;
    _load(): {
        sizes: any[];
        collapsed: any;
        restoreTo: any;
    };
    _save(): void;
}
export default SplitPane;
/**
 * A pane size limit: px as a number, or a percentage string such as '20%'.
 */
export type SplitPaneSize = number | string;
export type SplitPaneOptions = {
    /**
     * - 'horizontal' = side by side (default), 'vertical' = stacked
     */
    direction?: "horizontal" | "vertical";
    /**
     * - Percentages, one per pane (scaled to add up to 100); equal by default
     */
    sizes?: number[] | null;
    /**
     * - Minimum size, one value or one per pane (default 0)
     */
    minSize?: SplitPaneSize | SplitPaneSize[];
    /**
     * - Maximum size, one value or one per pane (default none)
     */
    maxSize?: SplitPaneSize | null | Array<SplitPaneSize | null>;
    /**
     * - Gutter thickness in px (default 8)
     */
    gutterSize?: number;
    /**
     * - Snap to a limit when dragged within this many px of it (default 0)
     */
    snapOffset?: number;
    /**
     * - Which panes the gutter gestures may collapse
     */
    collapsible?: boolean | boolean[];
    /**
     * - What a collapsed pane shrinks to (default 0)
     */
    collapsedSize?: SplitPaneSize | SplitPaneSize[];
    /**
     * - A small toggle button in gutters next to a collapsible pane
     */
    collapseButton?: boolean;
    /**
     * - Remember sizes and collapse state with S under 'split-pane:<key>'
     */
    persistKey?: string | null;
    /**
     * - Gutter cursor (default col-resize / row-resize)
     */
    cursor?: string | null;
    disabled?: boolean;
    /**
     * - Percent per arrow key (default 1)
     */
    step?: number;
    /**
     * - Percent per Shift+arrow (default 10)
     */
    largeStep?: number;
    /**
     * - The gutters' aria-label
     */
    gutterLabel?: string;
    /**
     * - Return false to refuse a drag
     */
    onBeforeDrag?: ((gutterIndex: number, event: PointerEvent) => boolean | void) | null;
    onDragStart?: ((sizes: number[], gutterIndex: number) => void) | null;
    onDrag?: ((sizes: number[], gutterIndex: number) => void) | null;
    onDragEnd?: ((sizes: number[], gutterIndex: number) => void) | null;
    /**
     * - Any size change: drag, keys, setSizes, collapse
     */
    onResize?: ((sizes: number[]) => void) | null;
    onCollapse?: ((paneIndex: number) => void) | null;
    onExpand?: ((paneIndex: number) => void) | null;
};
export type SplitPaneInstance = SplitPane;
import Component from '../component.js';
