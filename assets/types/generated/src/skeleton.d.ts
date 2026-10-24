/**
 * Placeholder markup for one type. Exported for tests and for hosts (such as
 * the DataTable) that want the shapes without the container handling.
 * @param {SkeletonOptions} [options]
 * @returns {string}
 */
export function skeletonMarkup(options?: SkeletonOptions): string;
/**
 * Fill a container with placeholders.
 *
 * Fills the container, marks it aria-busy with a polite "Loading..." status and
 * returns a handle; null if nothing matched.
 *
 * @param {string|Element|ArrayLike<Element>|null} target - selector, element or Domma collection
 * @param {SkeletonOptions} [options]
 * @returns {SkeletonHandle|null}
 */
export function skeleton(target: string | Element | ArrayLike<Element> | null, options?: SkeletonOptions): SkeletonHandle | null;
export namespace skeleton {
    /**
     * Show a skeleton until a promise settles. Resolves with the promise's value
     * once the skeleton is gone, so the caller renders into a clean container;
     * rejects with the promise's error, also with the skeleton gone.
     * `promise` may be a function returning one.
     * @template T
     * @param {string|Element|ArrayLike<Element>|null} target
     * @param {Promise<T>|(() => Promise<T>|T)} promise
     * @param {SkeletonOptions} [options]
     * @returns {Promise<T>}
     */
    function _while<T>(target: string | Element | ArrayLike<Element> | null, promise: Promise<T> | (() => Promise<T> | T), options?: SkeletonOptions): Promise<T>;
    export { _while as while };
    /**
     * The live handle on a container, if any - the same answer as E.get(target, 'skeleton').
     * @param {string|Element|ArrayLike<Element>|null} target
     * @returns {SkeletonHandle|null}
     */
    export function get(target: string | Element | ArrayLike<Element> | null): SkeletonHandle | null;
    /**
     * Remove the skeleton from a container, restoring its content.
     * @param {string|Element|ArrayLike<Element>|null} target
     * @returns {HTMLElement|null}
     */
    export function remove(target: string | Element | ArrayLike<Element> | null): HTMLElement | null;
    /**
     * Fill every `[data-skeleton]` container under `root` that has no skeleton
     * yet and has not had one removed (`data-skeleton-done`). Options come from
     * `data-skeleton-*` attributes. Returns the handles.
     * @param {string|Element|Document} [root]
     * @returns {SkeletonHandle[]}
     */
    export function scan(root?: string | Element | Document): SkeletonHandle[];
    export { skeletonMarkup as markup };
}
export default skeleton;
export type SkeletonType = "text" | "card" | "list" | "table" | "custom";
export type SkeletonOptions = {
    /**
     * - Shape to draw (default 'text')
     */
    type?: SkeletonType;
    /**
     * - Lines per paragraph, card or list item (default 3; list 2)
     */
    lines?: number | string | null;
    /**
     * - Paragraphs, cards or list items (default 1; list 3)
     */
    count?: number | string | null;
    /**
     * - Table rows (default 5)
     */
    rows?: number | string;
    /**
     * - Table columns (default 4)
     */
    columns?: number | string;
    /**
     * - Table header row (default true)
     */
    header?: boolean;
    /**
     * - A circle at the start of each list item (default true)
     */
    avatar?: boolean;
    /**
     * - An image block at the top of each card (default true)
     */
    image?: boolean;
    /**
     * - false = still tint, no sweep (default true)
     */
    animate?: boolean;
    /**
     * - Markup for type 'custom', or a function returning it
     */
    template?: string | ((options: SkeletonOptions) => string) | null;
    /**
     * - Screen-reader status text (default 'Loading...')
     */
    label?: string;
};
/**
 * The handle E.skeleton() returns.
 */
export type SkeletonHandle = {
    /**
     * - The container
     */
    element: HTMLElement;
    /**
     * - The resolved options
     */
    options: SkeletonOptions;
    /**
     * - Whether the skeleton is still showing (read only)
     */
    active: boolean;
    /**
     * - Take the skeleton away and restore the previous children (the same nodes)
     */
    remove: () => HTMLElement;
    /**
     * - Take the skeleton away and show content instead: an HTML string (unsanitised) or a node
     */
    replace: (content: string | Node | ArrayLike<Node> | null) => HTMLElement;
    /**
     * - Alias of remove()
     */
    destroy: () => HTMLElement;
};
/**
 * `E.skeleton` - the factory with its helpers (`while`, `get`, `remove`, `scan`, `markup`).
 */
export type SkeletonStatic = typeof skeleton;
