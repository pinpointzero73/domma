export default ContextMenu;
/**
 * The open context: passed to callbacks, item actions and resolvers.
 */
export type ContextMenuContext = {
    /**
     * - The delegated element the menu was opened against (or the container when no `match` is set)
     */
    target: HTMLElement;
    /**
     * - The bound container that claimed the gesture
     */
    container: HTMLElement;
    /**
     * - Viewport x of the opening point
     */
    x: number;
    /**
     * - Viewport y of the opening point
     */
    y: number;
    /**
     * - Originating event, or null when opened programmatically
     */
    event: Event | null;
    /**
     * - The menu element, once rendered
     */
    menu: HTMLElement | null;
    /**
     * - The instance that owns the menu
     */
    instance: ContextMenu;
};
export type ContextMenuItem = {
    /**
     * - Item text
     */
    label?: string;
    /**
     * - Item text, when there is no label
     */
    text?: string;
    /**
     * - Item text, when there is no label or text
     */
    name?: string;
    /**
     * - Domma icon name, rendered through data-icon
     */
    icon?: string;
    /**
     * - Arbitrary value carried to onSelect (with the item)
     */
    value?: any;
    /**
     * - Invoked with the delegated target and the open context
     */
    action?: (target: HTMLElement | null, ctx: ContextMenuContext) => void | Promise<void>;
    /**
     * - Greyed but still shown; a function is resolved per target
     */
    disabled?: boolean | ((target: HTMLElement, ctx: ContextMenuContext) => boolean);
    /**
     * - Omitted entirely when false; a function is resolved per target
     */
    visible?: boolean | ((target: HTMLElement, ctx: ContextMenuContext) => boolean);
    /**
     * - Destructive styling
     */
    danger?: boolean;
    /**
     * - Extra classes on the item
     */
    className?: string | string[];
    /**
     * - Right-aligned hint text - display only, no key is bound
     */
    shortcut?: string;
    /**
     * - Nested items, to unlimited depth
     */
    submenu?: ContextMenuItem[] | ((target: HTMLElement, ctx: ContextMenuContext) => ContextMenuItem[]);
    /**
     * - Item kind (default 'item')
     */
    type?: "item" | "divider" | "header" | "checkbox" | "radio";
    /**
     * - Checked state for checkbox/radio types
     */
    checked?: boolean | ((target: HTMLElement, ctx: ContextMenuContext) => boolean);
    /**
     * - Shorthand for type: 'divider'
     */
    divider?: boolean;
    /**
     * - Shorthand for type: 'header'
     */
    header?: string;
};
export type ContextMenuOptions = {
    /**
     * - Items, or a resolver called with the delegated target. Accepts a Domma Reactive observable.
     */
    items?: ContextMenuItem[] | ((target: HTMLElement, ctx: ContextMenuContext) => ContextMenuItem[]) | import("../vendor/domma-reactive.js").Observable<ContextMenuItem[]>;
    /**
     * - Delegation selector - the menu claims only descendants matching it (default: the whole container)
     */
    match?: string | null;
    /**
     * - Regions inside the container that decline and fall through outward
     */
    exclude?: string | null;
    /**
     * - False declines the gesture and falls through to the next menu outward
     */
    enabled?: boolean | ((target: HTMLElement, ctx: ContextMenuContext) => boolean);
    /**
     * - Merge ancestor menus' items rather than replacing them (default 'append')
     */
    inherit?: "append" | "prepend" | false;
    /**
     * - Tie-break only when two menus bind the SAME element; depth wins otherwise
     */
    priority?: number;
    /**
     * - This menu owns its region: once it encloses the click and accepts it, nothing bound deeper is offered the gesture. Not a veto - an exclusive menu that declines steps aside.
     */
    exclusive?: boolean;
    /**
     * - Shift+right-click passes through to the browser's own menu (default true)
     */
    nativeOnShift?: boolean;
    /**
     * - Close after an item is chosen (default true)
     */
    closeOnSelect?: boolean;
    /**
     * - Close on Esc (default true)
     */
    closeOnEscape?: boolean;
    /**
     * - Close on outside mousedown (default true)
     */
    closeOnClickOutside?: boolean;
    /**
     * - Close on scroll - the anchoring point has moved (default true)
     */
    closeOnScroll?: boolean;
    /**
     * - Long-press duration in ms for touch, or false to disable (default 500)
     */
    longPress?: number | false;
    /**
     * - Pointer over a claimed region: 'auto' (the CSS `context-menu` keyword, default), 'glyph' (a generated themed cursor), false (leave it alone) or any CSS cursor value
     */
    cursor?: "auto" | "glyph" | false | (string & {});
    /**
     * - Glyph cursor size in px, clamped to 32 - browsers ignore anything larger (default 26)
     */
    cursorSize?: number;
    /**
     * - Extra class on the menu root
     */
    className?: string;
    /**
     * - Minimum menu width (default '200px')
     */
    minWidth?: string;
    /**
     * - Maximum menu width (default '320px')
     */
    maxWidth?: string;
    /**
     * - Maximum menu height before it scrolls (default '60vh')
     */
    maxHeight?: string;
    /**
     * - Offset [x, y] from the cursor point (default [2, 2])
     */
    offset?: [number, number];
    /**
     * - Flip across the cursor and clamp to the viewport (default true)
     */
    flip?: boolean;
    /**
     * - Whether to transition on open and close (default true)
     */
    animation?: boolean;
    /**
     * - Transition duration in ms (default 120)
     */
    animationDuration?: number;
    /**
     * - How the panel enters (default 'scale')
     */
    transition?: "scale" | "fade" | "slide" | "none";
    /**
     * - Any CSS easing (default cubic-bezier(0.16, 1, 0.3, 1))
     */
    easing?: string;
    /**
     * - Preset key ('primary'|'success'|'danger'|'warning'|'info') or any CSS colour
     */
    accent?: string | null;
    /**
     * - Overrides the panel background
     */
    surface?: string | null;
    /**
     * - 'none'|'sm'|'md'|'lg'|'xl', or any CSS length
     */
    radius?: string | null;
    /**
     * - 'none'|'sm'|'md'|'lg'|'xl'
     */
    shadow?: string | null;
    /**
     * - 20-100; translucent panel with a blurred backdrop. Clamped.
     */
    opacity?: number | null;
    /**
     * - Row height and font size (default 'comfortable')
     */
    density?: "comfortable" | "compact";
    /**
     * - Custom item renderer returning HTML
     */
    itemTemplate?: ((item: ContextMenuItem, index: number) => string) | null;
    /**
     * - Hover grace before a submenu opens, in ms (default 150)
     */
    submenuDelay?: number;
    /**
     * - Render your own panel instead of an item list. Called only once this menu has claimed the gesture. Return an element for Domma to position and dismiss, or nothing to manage it yourself.
     */
    render?: ((ctx: ContextMenuContext) => HTMLElement | void) | null;
    /**
     * - Open on Shift+F10 and the Menu key against the focused element (default true)
     */
    keyboardTrigger?: boolean;
    /**
     * - Jump to an item by typing (default true)
     */
    typeahead?: boolean;
    /**
     * - aria-label for the menu
     */
    ariaLabel?: string;
    /**
     * - Bind items to a Domma Model
     */
    model?: {
        get(key: string): any;
    } | null;
    /**
     * - Model key holding the items array
     */
    modelKey?: string | null;
    /**
     * - Return false to decline and fall through to the next menu outward
     */
    onBeforeOpen?: ((ctx: ContextMenuContext) => boolean | void) | null;
    /**
     * - Fired once the menu is on screen
     */
    onOpen?: ((ctx: ContextMenuContext) => void) | null;
    /**
     * - Return false to keep it open
     */
    onBeforeClose?: ((ctx: ContextMenuContext | null) => boolean | void) | null;
    /**
     * - Fired after the menu is dismissed
     */
    onClose?: ((ctx: ContextMenuContext | null) => void) | null;
    /**
     * - Fired before the item's own action
     */
    onSelect?: ((item: ContextMenuItem, ctx: ContextMenuContext) => void) | null;
};
/**
 * One accepted candidate for a gesture.
 */
export type ContextMenuHit = {
    instance: ContextMenu;
    container: HTMLElement;
    target: HTMLElement;
    ctx: ContextMenuContext;
};
export type ContextMenuInstance = ContextMenu;
/**
 * `E.contextMenu` - the factory plus its statics: `closeAll()` closes whichever menu is open;
 * `active()` is the open instance, or null - only one can be open at a time; `registry(el)`
 * lists the bound menus, or with an element the resolution chain for it, innermost first.
 */
export type ContextMenuStatic = {
    (selector: string | HTMLElement, options?: ContextMenuOptions): ContextMenu;
    closeAll(): void;
    active(): ContextMenu | null;
    registry(forElement?: HTMLElement | null): ContextMenu[];
};
/**
 * The open context: passed to callbacks, item actions and resolvers.
 * @typedef {object} ContextMenuContext
 * @property {HTMLElement} target - The delegated element the menu was opened against (or the container when no `match` is set)
 * @property {HTMLElement} container - The bound container that claimed the gesture
 * @property {number} x - Viewport x of the opening point
 * @property {number} y - Viewport y of the opening point
 * @property {Event|null} event - Originating event, or null when opened programmatically
 * @property {HTMLElement|null} menu - The menu element, once rendered
 * @property {ContextMenu} instance - The instance that owns the menu
 */
/**
 * @typedef {object} ContextMenuItem
 * @property {string} [label] - Item text
 * @property {string} [text] - Item text, when there is no label
 * @property {string} [name] - Item text, when there is no label or text
 * @property {string} [icon] - Domma icon name, rendered through data-icon
 * @property {*} [value] - Arbitrary value carried to onSelect (with the item)
 * @property {(target: HTMLElement|null, ctx: ContextMenuContext) => void|Promise<void>} [action] - Invoked with the delegated target and the open context
 * @property {boolean|((target: HTMLElement, ctx: ContextMenuContext) => boolean)} [disabled] - Greyed but still shown; a function is resolved per target
 * @property {boolean|((target: HTMLElement, ctx: ContextMenuContext) => boolean)} [visible] - Omitted entirely when false; a function is resolved per target
 * @property {boolean} [danger] - Destructive styling
 * @property {string|string[]} [className] - Extra classes on the item
 * @property {string} [shortcut] - Right-aligned hint text - display only, no key is bound
 * @property {ContextMenuItem[]|((target: HTMLElement, ctx: ContextMenuContext) => ContextMenuItem[])} [submenu] - Nested items, to unlimited depth
 * @property {'item'|'divider'|'header'|'checkbox'|'radio'} [type] - Item kind (default 'item')
 * @property {boolean|((target: HTMLElement, ctx: ContextMenuContext) => boolean)} [checked] - Checked state for checkbox/radio types
 * @property {boolean} [divider] - Shorthand for type: 'divider'
 * @property {string} [header] - Shorthand for type: 'header'
 */
/**
 * @typedef {object} ContextMenuOptions
 * @property {ContextMenuItem[]|((target: HTMLElement, ctx: ContextMenuContext) => ContextMenuItem[])|import('../vendor/domma-reactive.js').Observable<ContextMenuItem[]>} [items] - Items, or a resolver called with the delegated target. Accepts a Domma Reactive observable.
 * @property {string|null} [match] - Delegation selector - the menu claims only descendants matching it (default: the whole container)
 * @property {string|null} [exclude] - Regions inside the container that decline and fall through outward
 * @property {boolean|((target: HTMLElement, ctx: ContextMenuContext) => boolean)} [enabled] - False declines the gesture and falls through to the next menu outward
 * @property {'append'|'prepend'|false} [inherit] - Merge ancestor menus' items rather than replacing them (default 'append')
 * @property {number} [priority] - Tie-break only when two menus bind the SAME element; depth wins otherwise
 * @property {boolean} [exclusive] - This menu owns its region: once it encloses the click and accepts it, nothing bound deeper is offered the gesture. Not a veto - an exclusive menu that declines steps aside.
 * @property {boolean} [nativeOnShift] - Shift+right-click passes through to the browser's own menu (default true)
 * @property {boolean} [closeOnSelect] - Close after an item is chosen (default true)
 * @property {boolean} [closeOnEscape] - Close on Esc (default true)
 * @property {boolean} [closeOnClickOutside] - Close on outside mousedown (default true)
 * @property {boolean} [closeOnScroll] - Close on scroll - the anchoring point has moved (default true)
 * @property {number|false} [longPress] - Long-press duration in ms for touch, or false to disable (default 500)
 * @property {'auto'|'glyph'|false|(string & {})} [cursor] - Pointer over a claimed region: 'auto' (the CSS `context-menu` keyword, default), 'glyph' (a generated themed cursor), false (leave it alone) or any CSS cursor value
 * @property {number} [cursorSize] - Glyph cursor size in px, clamped to 32 - browsers ignore anything larger (default 26)
 * @property {string} [className] - Extra class on the menu root
 * @property {string} [minWidth] - Minimum menu width (default '200px')
 * @property {string} [maxWidth] - Maximum menu width (default '320px')
 * @property {string} [maxHeight] - Maximum menu height before it scrolls (default '60vh')
 * @property {[number, number]} [offset] - Offset [x, y] from the cursor point (default [2, 2])
 * @property {boolean} [flip] - Flip across the cursor and clamp to the viewport (default true)
 * @property {boolean} [animation] - Whether to transition on open and close (default true)
 * @property {number} [animationDuration] - Transition duration in ms (default 120)
 * @property {'scale'|'fade'|'slide'|'none'} [transition] - How the panel enters (default 'scale')
 * @property {string} [easing] - Any CSS easing (default cubic-bezier(0.16, 1, 0.3, 1))
 * @property {string|null} [accent] - Preset key ('primary'|'success'|'danger'|'warning'|'info') or any CSS colour
 * @property {string|null} [surface] - Overrides the panel background
 * @property {string|null} [radius] - 'none'|'sm'|'md'|'lg'|'xl', or any CSS length
 * @property {string|null} [shadow] - 'none'|'sm'|'md'|'lg'|'xl'
 * @property {number|null} [opacity] - 20-100; translucent panel with a blurred backdrop. Clamped.
 * @property {'comfortable'|'compact'} [density] - Row height and font size (default 'comfortable')
 * @property {((item: ContextMenuItem, index: number) => string)|null} [itemTemplate] - Custom item renderer returning HTML
 * @property {number} [submenuDelay] - Hover grace before a submenu opens, in ms (default 150)
 * @property {((ctx: ContextMenuContext) => HTMLElement|void)|null} [render] - Render your own panel instead of an item list. Called only once this menu has claimed the gesture. Return an element for Domma to position and dismiss, or nothing to manage it yourself.
 * @property {boolean} [keyboardTrigger] - Open on Shift+F10 and the Menu key against the focused element (default true)
 * @property {boolean} [typeahead] - Jump to an item by typing (default true)
 * @property {string} [ariaLabel] - aria-label for the menu
 * @property {{get(key: string): any}|null} [model] - Bind items to a Domma Model
 * @property {string|null} [modelKey] - Model key holding the items array
 * @property {((ctx: ContextMenuContext) => boolean|void)|null} [onBeforeOpen] - Return false to decline and fall through to the next menu outward
 * @property {((ctx: ContextMenuContext) => void)|null} [onOpen] - Fired once the menu is on screen
 * @property {((ctx: ContextMenuContext|null) => boolean|void)|null} [onBeforeClose] - Return false to keep it open
 * @property {((ctx: ContextMenuContext|null) => void)|null} [onClose] - Fired after the menu is dismissed
 * @property {((item: ContextMenuItem, ctx: ContextMenuContext) => void)|null} [onSelect] - Fired before the item's own action
 */
/**
 * One accepted candidate for a gesture.
 * @typedef {object} ContextMenuHit
 * @property {ContextMenu} instance
 * @property {HTMLElement} container
 * @property {HTMLElement} target
 * @property {ContextMenuContext} ctx
 */
/** @typedef {ContextMenu} ContextMenuInstance */
/**
 * `E.contextMenu` - the factory plus its statics: `closeAll()` closes whichever menu is open;
 * `active()` is the open instance, or null - only one can be open at a time; `registry(el)`
 * lists the bound menus, or with an element the resolution chain for it, innermost first.
 * @typedef {{
 *     (selector: string|HTMLElement, options?: ContextMenuOptions): ContextMenu,
 *     closeAll(): void,
 *     active(): ContextMenu|null,
 *     registry(forElement?: HTMLElement|null): ContextMenu[]
 * }} ContextMenuStatic
 */
declare class ContextMenu extends Component {
    /** @type {ContextMenuOptions} */
    static defaults: ContextMenuOptions;
    /**
     * @param {string|HTMLElement} selector - A selector (matched live, so later elements are covered) or one element
     * @param {ContextMenuOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: ContextMenuOptions);
    selector: string;
    _node: HTMLElement;
    _menu: any;
    _submenus: any[];
    _isOpen: boolean;
    _enabledFlag: boolean;
    _focusIndex: number;
    _renderedItems: any[];
    _ctx: any;
    _typeaheadBuffer: string;
    _typeaheadTimer: number;
    _submenuTimer: number;
    _observableDispose: any;
    _restoreFocusTo: Element;
    _chain: any;
    _cursorId: number;
    /**
     * Put this menu's cursor into the shared stylesheet.
     *
     * The rule is composed from the same selector and `match` the cascade
     * resolves against, so it covers elements that do not exist yet - which is
     * the whole reason this is a rule rather than a class applied at bind time.
     *
     * A menu bound to a node rather than a selector has nothing to write a
     * rule against, so the node is stamped with a marker attribute and the
     * rule targets that. Both paths end up as ordinary CSS.
     */
    _applyCursor(): void;
    /**
     * iOS answers a long press with its own text-callout, which arrives before
     * any timer and cannot be cancelled once shown.
     */
    _applyTouchCallout(): void;
    /**
     * Whether `el` is a container this menu is bound to.
     * @param {Element} el
     * @returns {boolean}
     */
    matchesContainer(el: Element): boolean;
    /**
     * Decide whether this instance takes the gesture for `container`. Returning
     * null is not a dead click: the caller carries on walking outward, so the
     * next menu up gets its chance.
     * @param {HTMLElement} container
     * @param {HTMLElement} target
     * @param {MouseEvent|{clientX: number, clientY: number, target: Element}|null} event
     * @returns {ContextMenuHit|null}
     */
    _accept(container: HTMLElement, target: HTMLElement, event: MouseEvent | {
        clientX: number;
        clientY: number;
        target: Element;
    } | null): ContextMenuHit | null;
    _ownItems(hit: any): any[];
    /**
     * The primary menu's items, plus - when it inherits - the items of every
     * ancestor menu that also accepted, each behind a divider. Inheritance is
     * the primary's decision: an inner menu that wants to stand alone sets
     * `inherit: false` and the outer items stay out.
     */
    _assembleItems(chain: any, event: any): any[];
    /** Drop invisible items and collapse the dividers that stranded. */
    _filterItems(items: any, hit: any): any[];
    /**
     * Programmatic open. Resolves the chain itself so a menu opened from a
     * "..." button behaves exactly like the right-click on the same row.
     * @param {number} x - Viewport x
     * @param {number} y - Viewport y
     * @param {HTMLElement} [target] - Open against this element (default: the bound container)
     * @returns {this}
     */
    open(x: number, y: number, target?: HTMLElement): this;
    _openResolved(x: any, y: any, hit: any, items: any, event: any, fromKeyboard?: boolean, chain?: any): void;
    /**
     * Close the menu.
     * @returns {this}
     */
    close(): this;
    /**
     * Rebuild the open menu in place, keeping its position.
     * @returns {this}
     */
    refresh(): this;
    /**
     * Whether this menu is currently open.
     * @returns {boolean}
     */
    isOpen(): boolean;
    /**
     * Close if open, else open at (x, y) as open() does.
     * @param {number} x
     * @param {number} y
     * @param {HTMLElement} [target]
     * @returns {this}
     */
    toggle(x: number, y: number, target?: HTMLElement): this;
    /**
     * Alias of open(x, y, target).
     * @param {...*} args
     * @returns {this}
     */
    show(...args: any[]): this;
    /**
     * Alias of close().
     * @param {...*} args
     * @returns {this}
     */
    hide(...args: any[]): this;
    /** @returns {boolean} */
    isVisible(): boolean;
    /**
     * Replace the items.
     * @param {ContextMenuOptions['items']} items
     * @returns {this}
     */
    setItems(items: ContextMenuOptions["items"]): this;
    /**
     * Re-arm the menu.
     * @returns {this}
     */
    enable(): this;
    /**
     * Suppress the menu; right-clicks fall through to the next menu outward.
     * @returns {this}
     */
    disable(): this;
    _createMenu(isSub?: boolean): HTMLDivElement;
    /**
     * Theming rides on custom properties rather than on generated rules, so a
     * menu left unstyled still follows whatever the active theme sets and only
     * the values actually passed are overridden.
     */
    _applyTheme(menu: any): void;
    _renderInto(menu: any, items: any, hit: any): void;
    _depthOf(menu: any): number;
    _openSubmenu(itemEl: any, item: any, hit: any, depth: any): void;
    _closeSubmenus(fromDepth: any): void;
    _activate(item: any, index: any): void;
    /**
     * Anchored to a point, not to a rect. `position: fixed`, so there is no
     * scroll offset to fold in - and the menu closes on scroll anyway.
     *
     * A menu that will not fit below-right of the cursor flips to the other
     * side OF THE CURSOR rather than to the other side of an element, which is
     * the part that differs from Dropdown._positionMenu().
     */
    _positionAt(menu: any, x: any, y: any, anchorRect?: any): void;
    _bindOpenListeners(): void;
    _outsideHandler: (e: any) => void;
    _contextHandler: (e: any) => void;
    _keyHandler: (e: any) => void;
    _scrollHandler: (event: any) => void;
    _resizeHandler: () => this;
    _unbindOpenListeners(): void;
    _focusableItems(): any[];
    _moveFocus(delta: any): void;
    _onKeyDown(e: any): void;
    _typeahead(char: any): void;
}
declare namespace ContextMenu {
    /**
     * Close whichever menu is open.
     * @returns {void}
     */
    function closeAll(): void;
    /**
     * The open instance, or null - only one can be open at a time.
     * @returns {ContextMenu|null}
     */
    function active(): ContextMenu | null;
    /**
     * Bound containers, innermost-first for a given element, else registration order.
     * @param {Element|null} [forElement]
     * @returns {ContextMenu[]}
     */
    function registry(forElement?: Element | null): ContextMenu[];
}
/** @type {Set<ContextMenu>} */
declare const registry: Set<ContextMenu>;
/**
 * Walk outward from `target` collecting the registered containers that enclose
 * it, innermost first. An element carrying two menus is ordered by `priority`,
 * highest first; depth beats priority in every other case.
 */
declare function collectCandidates(target: any): {
    instance: ContextMenu;
    container: Element;
}[];
import Component from './component.js';
export { registry as _registry, collectCandidates as _collectCandidates };
