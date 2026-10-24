/**
 * Initials for a name.
 *
 *   'Jane Smith'             -> 'JS'   first and last word
 *   'Jane Q. Public'         -> 'JP'
 *   'Madonna'                -> 'M'    one word, one letter
 *   'jane.smith@example.com' -> 'JS'   the part before the @, split on . _ - +
 *   'Jean-Luc Picard'        -> 'JP'
 *   'Łukasz Żuk'             -> 'ŁŻ'
 *   '王小明'                  -> '王'
 *   '', null, '  !! '        -> ''     nothing to go on: callers show an icon
 *
 * Words are split on spaces, dots, underscores, hyphens and plus signs;
 * anything that is not a letter or digit at the start of a word (quotes,
 * brackets, emoji) is skipped, and bracketed notes like "(Admin)" are dropped.
 * @param {string|null|undefined} name
 * @returns {string}
 */
export function avatarInitials(name: string | null | undefined): string;
/**
 * The tone (0-7) for a name: FNV-1a over the trimmed, lower-cased, single-spaced
 * name. Stable across pages, sessions and machines; case and spacing do not
 * change it, so 'jane smith' and 'Jane  Smith' match.
 * @param {string} key
 * @returns {number}
 */
export function avatarTone(key: string): number;
/**
 * Render one avatar.
 * @overload
 * @param {string|Element|ArrayLike<Element>|null} target
 * @param {AvatarOptions} [options]
 * @returns {AvatarHandle|null}
 */
export function avatar(target: string | Element | ArrayLike<Element> | null, options?: AvatarOptions): AvatarHandle | null;
/**
 * Render one avatar into a detached <span> for you to insert.
 * @overload
 * @param {AvatarOptions} options
 * @returns {AvatarHandle}
 */
export function avatar(options: AvatarOptions): AvatarHandle;
export namespace avatar {
    export { avatarInitials as initials };
    export { avatarTone as tone };
    /**
     * The live handle on an element, if any - the same answer as E.get(target, 'avatar').
     * @param {string|Element|ArrayLike<Element>} target
     * @returns {AvatarHandle|null}
     */
    export function get(target: string | Element | ArrayLike<Element>): AvatarHandle | null;
    /**
     * Turn every `[data-avatar]` under `root` (and `root` itself) into an avatar,
     * once. Options come from `data-avatar-*`. Returns the new handles.
     * @param {string|Element|Document} [root]
     * @returns {AvatarHandle[]}
     */
    export function scan(root?: string | Element | Document): AvatarHandle[];
}
/**
 * Render a stack of avatars with a "+N" overflow bubble.
 *
 * @param {string|Element|ArrayLike<Element>} target - a <ul>/<ol> to fill, or any element
 *   to put a new <ul> into (its content comes back on destroy())
 * @param {AvatarGroupOptions} [options] - see GROUP_DEFAULTS
 * @returns {AvatarGroupHandle|null} null if nothing matched
 */
export function avatarGroup(target: string | Element | ArrayLike<Element>, options?: AvatarGroupOptions): AvatarGroupHandle | null;
export namespace avatarGroup {
    /**
     * The live group handle on a host element (or its list), if any - the same answer as E.get(target, 'avatar-group').
     * @param {string|Element|ArrayLike<Element>} target
     * @returns {AvatarGroupHandle|null}
     */
    function get(target: string | Element | ArrayLike<Element>): AvatarGroupHandle | null;
}
/** @type {AvatarSize[]} */
export const AVATAR_SIZES: AvatarSize[];
/** @type {AvatarShape[]} */
export const AVATAR_SHAPES: AvatarShape[];
/** @type {AvatarStatus[]} */
export const AVATAR_STATUSES: AvatarStatus[];
/** How many `.avatar-tone-*` classes elements.css defines. */
export const AVATAR_TONES: 8;
export default avatar;
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "rounded" | "square";
export type AvatarStatus = "online" | "away" | "busy" | "offline";
export type AvatarOptions = {
    /**
     * - The person: initials, tone and accessible name come from it
     */
    name?: string | null;
    /**
     * - Picture URL; falls back to the initials (or icon) if it fails to load
     */
    src?: string | null;
    /**
     * - Accessible name when it should differ from name
     */
    alt?: string | null;
    /**
     * - Size (default 'md')
     */
    size?: AvatarSize;
    /**
     * - Shape (default 'circle')
     */
    shape?: AvatarShape;
    /**
     * - Status dot; the word goes into the accessible name
     */
    status?: AvatarStatus | null;
    /**
     * - Words for the statuses in the accessible name, e.g. {busy: 'in a meeting'}
     */
    statusLabels?: Partial<Record<AvatarStatus, string>> | null;
    /**
     * - Icon name shown instead of initials ('user' when there is no name)
     */
    icon?: string | null;
    /**
     * - Hover text; true = the accessible name
     */
    title?: string | true | null;
    /**
     * - A primary-coloured ring (default false)
     */
    ring?: boolean;
    /**
     * - 0-7 to choose the tint; default is a hash of the name
     */
    tone?: number | null;
    /**
     * - aria-hidden: the name is written next to it (default false)
     */
    decorative?: boolean;
};
/**
 * The handle E.avatar() returns. `options`, `initials`, `tone` and `label` are read only.
 */
export type AvatarHandle = {
    /**
     * - The avatar element
     */
    element: HTMLElement;
    /**
     * - The options in force
     */
    options: AvatarOptions;
    /**
     * - The initials drawn ('' when an icon is shown)
     */
    initials: string;
    /**
     * - The tone 0-7, or null with nothing to hash
     */
    tone: number | null;
    /**
     * - The accessible name, e.g. 'Jane Smith (online)'
     */
    label: string;
    /**
     * - Merge options and redraw
     */
    update: (options?: AvatarOptions) => AvatarHandle;
    /**
     * - Restore the element's previous children, classes and attributes
     */
    destroy: () => HTMLElement;
};
/**
 * `E.avatar` - the factory with `initials`, `tone`, `get` and `scan`.
 */
export type AvatarStatic = typeof avatar;
/**
 * One person in an avatar group.
 */
export type AvatarPerson = {
    name?: string;
    src?: string;
    status?: AvatarStatus;
    /**
     * - Makes the avatar a link
     */
    href?: string;
    alt?: string;
    icon?: string;
    tone?: number;
    /**
     * - Hover text (default: the accessible name)
     */
    title?: string | true;
};
export type AvatarGroupOptions = {
    /**
     * - People, or plain names
     */
    people?: Array<AvatarPerson | string>;
    /**
     * - Show this many, then "+N"; null = everyone
     */
    max?: number | null;
    /**
     * - Size (default 'md')
     */
    size?: AvatarSize;
    /**
     * - Shape (default 'circle')
     */
    shape?: AvatarShape;
    /**
     * - 'none' | 'sm' | 'md' | 'lg', pixels, or any CSS length; null = the stylesheet's 25%
     */
    overlap?: "none" | "sm" | "md" | "lg" | number | string | null;
    /**
     * - Accessible name for the list
     */
    label?: string | null;
    statusLabels?: Partial<Record<AvatarStatus, string>> | null;
    /**
     * - Called when "+N" is pressed, instead of the popover
     */
    onMore?: ((hidden: AvatarPerson[], event: MouseEvent) => void) | null;
    /**
     * - false: no popover, the hidden names go in the button's title (default true)
     */
    popover?: boolean;
    /**
     * - The "+N" button's accessible name (default '3 more: A, B and C')
     */
    moreLabel?: ((count: number, names: string[]) => string) | null;
};
/**
 * The handle E.avatarGroup() returns. Everything but the methods is read only.
 */
export type AvatarGroupHandle = {
    /**
     * - The <ul>
     */
    element: HTMLUListElement | HTMLOListElement;
    options: AvatarGroupOptions;
    people: AvatarPerson[];
    /**
     * - Drawn as avatars
     */
    shown: AvatarPerson[];
    /**
     * - Folded into "+N"
     */
    hidden: AvatarPerson[];
    /**
     * - The "+N" button, or null
     */
    more: HTMLButtonElement | null;
    /**
     * - The "+N" popover, or null
     */
    popover: import("./popover.js").PopoverInstance | null;
    update: (options?: AvatarGroupOptions) => AvatarGroupHandle;
    setPeople: (people: Array<AvatarPerson | string>) => AvatarGroupHandle;
    /**
     * - Remove everything and restore the host
     */
    destroy: () => HTMLElement;
};
/**
 * `E.avatarGroup` - the factory with `get`.
 */
export type AvatarGroupStatic = typeof avatarGroup;
