/**
 * Domma Elements Module - TypeScript Declarations
 * UI Components: Card, Modal, Tabs, Accordion, Tooltip, Badge, Dropdown, Toast, Carousel, BackToTop
 */

// ============================================
// Common Types
// ============================================

export type AnimationType = 'fade' | 'slide' | 'zoom' | 'none';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type DropdownPosition = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
export type ToastPosition = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';
export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
export type BadgeSize = 'small' | 'medium' | 'large';
export type ShadowSize = 'none' | 'small' | 'medium' | 'large';
export type BackToTopPosition = 'bottom-right' | 'bottom-left';

// ============================================
// Base Component
// ============================================

export interface ComponentInstance {
    /** The DOM element this component is attached to */
    element: HTMLElement | null;
    /** Component options */
    options: Record<string, any>;

    /** Update component options at runtime */
    setOptions(newOptions: Record<string, any>): this;

    /**
     * Listen for a component event - the name of an `onX` option without `on`, lower-cased
     * ('change', 'open', 'beforeclose'). The handler gets the same arguments as the option;
     * returning false from a `before...` handler cancels. The same event is dispatched on
     * `element` as `dm:<component>:<event>` with `detail = {instance, args}`.
     */
    on(event: string, handler: (...args: any[]) => any): this;
    /** Listen once */
    once(event: string, handler: (...args: any[]) => any): this;
    /** Stop listening (every handler for the event when none is given) */
    off(event: string, handler?: (...args: any[]) => any): this;

    /** Destroy the component and cleanup event listeners */
    destroy(): void;
}

// ============================================
// Card Component
// ============================================

export interface CardOptions {
    /** Enable hover effects */
    hoverable?: boolean;
    /** Shadow size: 'none', 'small', 'medium', 'large' */
    shadow?: ShadowSize;
    /** Apply border radius */
    rounded?: boolean;
    /** Enable animations */
    animation?: boolean;
    /** Animation duration in ms */
    animationDuration?: number;
    /** Callback on mouse enter */
    onHover?: (event: MouseEvent, card: CardInstance) => void;
    /** Callback on mouse leave */
    onLeave?: (event: MouseEvent, card: CardInstance) => void;
    /** Callback on click */
    onClick?: (event: MouseEvent, card: CardInstance) => void;
}

export interface CardInstance extends ComponentInstance {
    /** Set the shadow size */
    setShadow(size: ShadowSize): this;
}

// ============================================
// Modal Component
// ============================================

export interface ModalOptions {
    /** Show backdrop overlay */
    backdrop?: boolean;
    /** Close modal when clicking backdrop */
    backdropClose?: boolean;
    /** Close modal on Escape key */
    keyboard?: boolean;
    /** Animation type: 'fade', 'slide', 'zoom' */
    animation?: AnimationType;
    /** Animation duration in ms */
    animationDuration?: number;
    /** Show close button */
    closeButton?: boolean;
    /** Return false to keep the modal closed (also `.on('beforeopen')`, `dm:modal:beforeopen`) */
    onBeforeOpen?: (modal: ModalInstance) => boolean | void;
    /** Return false to keep the modal open (also `.on('beforeclose')`, `dm:modal:beforeclose`) */
    onBeforeClose?: (modal: ModalInstance) => boolean | void;
    /** Modal content (HTML, sanitised like $().html() unless `safe: false`) */
    content?: string;
    /** false: insert `content` as trusted markup */
    safe?: boolean;
    /** Callback before opening */
    onOpen?: (modal: ModalInstance) => void;
    /** Callback after open animation completes */
    onOpened?: (modal: ModalInstance) => void;
    /** Callback before closing */
    onClose?: (modal: ModalInstance) => void;
    /** Callback after close animation completes */
    onClosed?: (modal: ModalInstance) => void;
}

export interface ModalInstance extends ComponentInstance {
    /** Open the modal */
    open(): this;

    /** Close the modal */
    close(): this;

    /** Toggle modal visibility */
    toggle(): this;

    /** Check if modal is currently open */
    isOpen(): boolean;
}

// ============================================
// Tabs Component
// ============================================

export interface TabChangeEvent {
    index: number;
    oldIndex: number;
    tab: HTMLElement;
    panel: HTMLElement;
}

export interface TabsOptions {
    /** Initially active tab index */
    active?: number;
    /** Animation type */
    animation?: 'fade' | 'none';
    /** Animation duration in ms */
    animationDuration?: number;
    /** Selector for tab items */
    tabSelector?: string;
    /** Selector for tab panels */
    panelSelector?: string;
    /** CSS class for active state */
    activeClass?: string;
    /** Callback when tab changes */
    onChange?: (event: TabChangeEvent) => void;
}

export interface TabsInstance extends ComponentInstance {
    /** Activate a tab by index */
    activate(index: number): this;

    /** Alias for activate */
    show(index: number): this;

    /** Get the current active tab index */
    getActive(): number;

    /** Go to the next tab */
    next(): this;

    /** Go to the previous tab */
    prev(): this;
}

// ============================================
// Accordion Component
// ============================================

export interface AccordionChangeEvent {
    index: number;
    isOpen: boolean;
    header: HTMLElement;
    content: HTMLElement;
}

export interface AccordionOptions {
    /** Allow multiple panels open at once */
    allowMultiple?: boolean;
    /** Alias for allowMultiple */
    multiExpand?: boolean;
    /** Initially open panel index(es) */
    activeIndex?: number | number[] | null;
    /** Enable animations */
    animation?: boolean;
    /** Animation duration in ms */
    animationDuration?: number;
    /** Selector for accordion headers */
    headerSelector?: string;
    /** Selector for accordion content */
    contentSelector?: string;
    /** CSS class for active state */
    activeClass?: string;
    /** Callback when panel state changes */
    onChange?: (event: AccordionChangeEvent) => void;
}

export interface AccordionInstance extends ComponentInstance {
    /** Toggle a panel by index */
    toggle(index: number): this;

    /** Open a panel by index */
    open(index: number): this;

    /** Close a panel by index */
    close(index: number): this;

    /** Open all panels */
    openAll(): this;

    /** Close all panels */
    closeAll(): this;
}

// ============================================
// Tooltip Component
// ============================================

export interface TooltipDelay {
    show: number;
    hide: number;
}

export interface TooltipOptions {
    /** Tooltip content */
    content?: string;
    /** Position relative to element */
    position?: TooltipPosition;
    /** How to trigger: 'hover', 'click', 'focus' */
    trigger?: 'hover' | 'click' | 'focus';
    /** Show/hide delay in ms */
    delay?: TooltipDelay;
    /** Enable animations */
    animation?: boolean;
    /** Animation duration in ms */
    animationDuration?: number;
    /** Allow HTML content */
    html?: boolean;
    /** Position offset [x, y] */
    offset?: [number, number];
    /** Container element for tooltip */
    container?: HTMLElement | null;
    /** Callback when tooltip shows */
    onShow?: (tooltip: TooltipInstance) => void;
    /** Callback when tooltip hides */
    onHide?: (tooltip: TooltipInstance) => void;
}

export interface TooltipInstance extends ComponentInstance {
    /** Show the tooltip */
    show(): this;

    /** Hide the tooltip */
    hide(): this;

    /** Toggle tooltip visibility */
    toggle(): this;

    /** Update tooltip content */
    setContent(content: string): this;
}

// ============================================
// Badge Component
// ============================================

export interface BadgeOptions {
    /** Badge variant/colour */
    variant?: BadgeVariant;
    /** Badge size */
    size?: BadgeSize;
    /** Use pill/rounded style */
    pill?: boolean;
    /** Use outline style */
    outline?: boolean;
    /** Show remove button */
    removable?: boolean;
    /** Callback on click */
    onClick?: (event: MouseEvent, badge: BadgeInstance) => void;
    /** Callback on remove */
    onRemove?: (event: MouseEvent, badge: BadgeInstance) => void;
}

export interface BadgeInstance extends ComponentInstance {
    /** Set the badge variant */
    setVariant(variant: BadgeVariant): this;

    /** Set the badge text */
    setText(text: string): this;

    /** Remove the badge from DOM */
    remove(): void;
}

/** Number badge colour variant */
export type NumberBadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

export interface NumberBadgeOptions {
    /** Initial count to display */
    count?: number;
    /** Colour variant (default: 'danger') */
    variant?: NumberBadgeVariant;
    /** Show as dot indicator instead of number */
    dot?: boolean;
    /** Enable pulse animation */
    pulse?: boolean;
    /** Custom border ring colour */
    borderColor?: string;
}

export interface NumberBadgeInstance {
    /** The wrapper web component element */
    element: HTMLElement;

    /** Set the badge count */
    setCount(count: number): this;

    /** Increment the badge count */
    increment(by?: number): this;

    /** Decrement the badge count (min 0) */
    decrement(by?: number): this;

    /** Toggle dot mode */
    setDot(dot: boolean): this;

    /** Set the colour variant */
    setVariant(variant: NumberBadgeVariant): this;

    /** Toggle pulse animation */
    setPulse(pulse: boolean): this;

    /** Get the current count */
    getCount(): number;

    /** Remove the badge and unwrap the element */
    remove(): void;

    /** Destroy the component */
    destroy(): void;
}

// ============================================
// Dropdown Component
// ============================================

export interface DropdownItem {
    /** Display text */
    label?: string;
    /** Alternative to label */
    text?: string;
    /** Alternative to label */
    name?: string;
    /** Value when selected */
    value?: any;
    /** Icon HTML */
    icon?: string;
    /** Disable item */
    disabled?: boolean;
    /** Render as divider */
    divider?: boolean;
    /** Render as header */
    header?: string;
}

export interface DropdownSelectEvent {
    item: DropdownItem | string;
    index: number;
    value: any;
}

export interface DropdownOptions {
    /** How to trigger: 'click' or 'hover' */
    trigger?: 'click' | 'hover';
    /** Menu position */
    position?: DropdownPosition;
    /** Position offset [x, y] */
    offset?: [number, number];
    /** Enable animations */
    animation?: boolean;
    /** Animation duration in ms */
    animationDuration?: number;
    /** Close menu after item selection */
    closeOnSelect?: boolean;
    /** Close menu when clicking outside */
    closeOnClickOutside?: boolean;
    /** Menu items */
    items?: (DropdownItem | string)[];
    /** Bind to a Domma Model */
    model?: any;
    /** Model key for items array */
    modelKey?: string;
    /** Custom item template function */
    itemTemplate?: (item: DropdownItem, index: number) => string;
    /** Callback when menu opens */
    onOpen?: (dropdown: DropdownInstance) => void;
    /** Callback when menu closes */
    onClose?: (dropdown: DropdownInstance) => void;
    /** Callback when item is selected */
    onSelect?: (event: DropdownSelectEvent, dropdown: DropdownInstance) => void;
}

export interface DropdownInstance extends ComponentInstance {
    /** Open the dropdown menu */
    open(): this;

    /** Close the dropdown menu */
    close(): this;

    /** Toggle dropdown visibility */
    toggle(): this;

    /** Check if dropdown is open */
    isOpen(): boolean;

    /** Set menu items */
    setItems(items: (DropdownItem | string)[]): this;

    /** Add a menu item */
    addItem(item: DropdownItem | string): this;

    /** Remove item by index */
    removeItem(index: number): this;

    /** Get currently selected value */
    getSelected(): any;
}

// ============================================
// Toast Component
// ============================================

export interface ToastAction {
    /** Button label */
    label: string;
    /** Click handler */
    onClick?: (toast: ToastInstance) => void;
    /** Close toast on click */
    closeOnClick?: boolean;
    /** Primary style */
    primary?: boolean;
}

export interface ToastOptions {
    /** Toast position */
    position?: ToastPosition;
    /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
    duration?: number;
    /** Pause countdown on hover */
    pauseOnHover?: boolean;
    /** Show progress bar */
    showProgress?: boolean;
    /** Animation style */
    animation?: 'slide' | 'fade';
    /** Animation duration in ms */
    animationDuration?: number;
    /** Show close button */
    closable?: boolean;
    /** Maximum number of toasts */
    maxToasts?: number;
    /** Toast type */
    type?: ToastType;
    /** Toast title */
    title?: string;
    /** Custom icon HTML */
    icon?: string;
    /** Allow HTML content */
    html?: boolean;
    /** Action buttons */
    actions?: ToastAction[];
    /** Callback when toast closes */
    onClose?: (toast: ToastInstance) => void;
}

export interface ToastInstance {
    /** Close the toast */
    close(): void;

    /** Update toast message */
    update(message: string, options?: { html?: boolean }): this;
}

export interface ToastStatic {
    /** Default options */
    defaults: ToastOptions;

    /** Show a toast message */
    show(message: string, options?: ToastOptions): ToastInstance;

    /** Show success toast */
    success(message: string, options?: ToastOptions): ToastInstance;

    /** Show error toast */
    error(message: string, options?: ToastOptions): ToastInstance;

    /** Show warning toast */
    warning(message: string, options?: ToastOptions): ToastInstance;

    /** Show info toast */
    info(message: string, options?: ToastOptions): ToastInstance;

    /** Close all toasts */
    closeAll(): void;
}

// ============================================
// Carousel Component
// ============================================

export interface CarouselChangeEvent {
    index: number;
    oldIndex: number;
    slide: HTMLElement;
}

export interface CarouselOptions {
    /** Enable autoplay */
    autoplay?: boolean;
    /** Autoplay interval in ms */
    interval?: number;
    /** Pause autoplay on hover */
    pauseOnHover?: boolean;
    /** Loop back to start */
    loop?: boolean;
    /** Animation type */
    animation?: 'slide' | 'fade' | 'crossfade';
    /** Use the shortest scaled image height, or the midpoint of shortest and tallest */
    heightMode?: 'crop' | 'average';
    /** Optional fixed viewport height in pixels */
    height?: number;
    /** Animation duration in ms */
    animationDuration?: number;
    /** Show navigation arrows */
    showArrows?: boolean;
    /** Show indicator dots */
    showIndicators?: boolean;
    /** Selector for slide elements */
    slideSelector?: string;
    /** CSS class for active state */
    activeClass?: string;
    /** Callback when slide changes */
    onChange?: (event: CarouselChangeEvent) => void;
}

export interface CarouselInstance extends ComponentInstance {
    /** Go to a specific slide */
    goTo(index: number): this;

    /** Go to next slide */
    next(): this;

    /** Go to previous slide */
    prev(): this;

    /** Start autoplay */
    play(): this;

    /** Stop autoplay */
    pause(): this;

    /** Get current slide index */
    getIndex(): number;

    /** Get slide element by index */
    getSlide(index?: number): HTMLElement;
}

// ============================================
// BackToTop Component
// ============================================

export interface BackToTopScrollEvent {
    scrollY: number;
    isVisible: boolean;
}

export interface BackToTopShowEvent {
    button: HTMLElement;
}

export interface BackToTopOptions {
    /** Scroll distance to show button (null = viewport height) */
    showAfter?: number | null;
    /** Scroll animation duration in ms */
    duration?: number;
    /** Button position */
    position?: BackToTopPosition;
    /** Distance from edge in px */
    offset?: number;
    /** Existing button selector (null = create new) */
    target?: string | HTMLElement | null;
    /** z-index for button */
    zIndex?: number;
    /** Callback when button shows */
    onShow?: (event: BackToTopShowEvent) => void;
    /** Callback when button hides */
    onHide?: (event: BackToTopShowEvent) => void;
    /** Callback on scroll */
    onScroll?: (event: BackToTopScrollEvent) => void;
}

export interface BackToTopInstance extends ComponentInstance {
    /** Scroll to top */
    scroll(): this;

    /** Show the button */
    show(): this;

    /** Hide the button */
    hide(): this;

    /** Toggle button visibility */
    toggle(): this;

    /** Check if button is visible */
    isVisible(): boolean;

    /** Get the button element */
    getButton(): HTMLElement;
}

// ============================================
// Elements Module
// ============================================

// ============================================
// Focus trap
// ============================================

type FocusTarget = string | HTMLElement;

export interface FocusTrapOptions {
    /** Where focus goes on activate: a selector, an element, a function returning one, or false to leave it. Default: focus already inside stays, else the first tabbable, else the container. */
    initialFocus?: FocusTarget | (() => HTMLElement | null) | false;
    /** Where focus goes when nothing is tabbable (default: the first container, given tabindex="-1") */
    fallbackFocus?: FocusTarget | (() => HTMLElement | null);
    /** true (default): back to what had focus before activate(); or an element / selector; false: nowhere */
    returnFocus?: boolean | FocusTarget;
    /** Escape deactivates (default false - the owning overlay decides) */
    escapeDeactivates?: boolean | ((e: KeyboardEvent) => boolean);
    /** A press outside deactivates (default false) */
    clickOutsideDeactivates?: boolean | ((e: MouseEvent) => boolean);
    /** Let clicks outside through (default false: they are blocked) */
    allowOutsideClick?: boolean | ((e: MouseEvent) => boolean);
    /** Set `inert` on everything outside the containers while active (default false) */
    inert?: boolean;
    /** Walk open shadow roots (default true) */
    shadow?: boolean;
    preventScroll?: boolean;
    onActivate?: (trap: FocusTrapInstance) => void;
    onDeactivate?: (trap: FocusTrapInstance) => void;
    onPause?: (trap: FocusTrapInstance) => void;
    onUnpause?: (trap: FocusTrapInstance) => void;
}

export interface FocusTrapInstance extends ComponentInstance {
    /** Start trapping; pauses the trap that was on top */
    activate(opts?: {initialFocus?: FocusTrapOptions['initialFocus']}): this;
    /** Stop trapping; unpauses the trap beneath */
    deactivate(opts?: {returnFocus?: boolean | FocusTarget}): this;
    pause(): this;
    unpause(opts?: {focus?: boolean}): this;
    updateContainers(containers: FocusTarget | FocusTarget[]): this;
    containers(): HTMLElement[];
    isActive(): boolean;
    isPaused(): boolean;
    /** The tabbable elements in the containers right now, in Tab order */
    tabbables(): HTMLElement[];
    destroy(): void;
}

export interface FocusTrapFactory {
    (containers: FocusTarget | FocusTarget[], options?: FocusTrapOptions): FocusTrapInstance | null;
    /** What Tab would reach in some containers, in order */
    tabbables(containers: HTMLElement | HTMLElement[], opts?: {shadow?: boolean}): HTMLElement[];
    /** The trap that currently listens */
    top(): FocusTrapInstance | null;
}

// ============================================
// Command palette
// ============================================

export interface PaletteCommand {
    id?: string;
    title: string;
    subtitle?: string;
    /** Heading the command is listed under */
    group?: string;
    /** Domma icon name */
    icon?: string;
    /** More words that find it */
    keywords?: string[];
    /** Shown as a hint, e.g. 'mod+s' (mod = Cmd on a Mac, Ctrl elsewhere) */
    shortcut?: string;
    /** Followed when run (http(s), mailto, tel or relative only) */
    href?: string;
    /** '_blank' opens href in a new tab */
    target?: string;
    action?: (command: PaletteCommand, palette: CommandPaletteInstance, event?: Event) => void;
    disabled?: boolean;
    hidden?: boolean;
    /** Running it leaves the palette open */
    keepOpen?: boolean;
    /** A nested page: a list, or a function returning one (called once on entering) */
    children?: PaletteCommand[] | ((command: PaletteCommand, ctx: {signal?: AbortSignal, palette: CommandPaletteInstance}) => Promise<PaletteCommand[]> | PaletteCommand[]);
    /** Placeholder for the box while this command's page is open */
    placeholder?: string;
    [key: string]: any;
}

export interface CommandPaletteOptions {
    commands?: PaletteCommand[];
    /** Search elsewhere: debounced, the previous request aborted through `signal` */
    source?: (query: string, ctx: {signal?: AbortSignal, palette: CommandPaletteInstance}) => Promise<PaletteCommand[]> | PaletteCommand[];
    /** ms (default 150) */
    debounce?: number;
    /** 'mod+k' (default), several, or false */
    hotkey?: string | string[] | false;
    placeholder?: string;
    /** Accessible name of the dialog and list (default 'Command palette') */
    label?: string;
    maxResults?: number;
    /** Storage (S) key for recent commands; null (default) = off */
    recentKey?: string | null;
    recentLimit?: number;
    recentLabel?: string;
    sourceGroup?: string | null;
    emptyText?: string;
    loadingText?: string;
    /** While a nested page's async children load (default 'Loading…') */
    pageLoadingText?: string;
    errorText?: string;
    backLabel?: string;
    /** Key hints under the list (default true) */
    footer?: boolean;
    resultsText?: (count: number) => string;
    /** Replaces the default navigation for href commands */
    navigate?: (href: string, ctx: {newTab: boolean, command: PaletteCommand}) => void;
    animationDuration?: number;
    className?: string;
    /** Force Mac (true) or other (false) key names; default detects */
    mac?: boolean;
    onBeforeOpen?: (palette: CommandPaletteInstance) => boolean | void;
    onOpen?: (palette: CommandPaletteInstance) => void;
    onBeforeClose?: (palette: CommandPaletteInstance) => boolean | void;
    onClose?: (palette: CommandPaletteInstance) => void;
    onQuery?: (query: string, palette: CommandPaletteInstance) => void;
    onBeforeSelect?: (command: PaletteCommand, palette: CommandPaletteInstance) => boolean | void;
    onSelect?: (command: PaletteCommand, palette: CommandPaletteInstance) => void;
    onRun?: (command: PaletteCommand, palette: CommandPaletteInstance) => void;
}

export interface CommandPaletteInstance extends ComponentInstance {
    open(query?: string): this;
    close(): this;
    toggle(query?: string): this;
    isOpen(): boolean;
    show(query?: string): this;
    hide(): this;
    isVisible(): boolean;
    setCommands(list: PaletteCommand[]): this;
    addCommands(list: PaletteCommand | PaletteCommand[]): this;
    removeCommand(id: string): this;
    getCommands(): PaletteCommand[];
    /** Up one nested page; false at the top */
    back(): boolean;
    query(): string;
    recent(): string[];
    clearRecent(): this;
    destroy(): void;
}

export interface CommandPaletteFactory {
    (options?: CommandPaletteOptions): CommandPaletteInstance;
    formatShortcut(combo: string, mac?: boolean): string[];
    fuzzyMatch(query: string, text: string): {score: number, indices: number[]} | null;
}

export interface Elements {
    /** Create a Card component */
    card(selector: string | HTMLElement, options?: CardOptions): CardInstance;

    /** Create a Modal component */
    modal(selector: string | HTMLElement, options?: ModalOptions): ModalInstance;

    /** Create a Tabs component */
    tabs(selector: string | HTMLElement, options?: TabsOptions): TabsInstance;

    /** Create an Accordion component */
    accordion(selector: string | HTMLElement, options?: AccordionOptions): AccordionInstance;

    /** Create Tooltip(s) - returns array if multiple elements match */
    /** Sets up every match; returns the first, with `all()` for every instance */
    tooltip(selector: string | HTMLElement, options?: TooltipOptions): TooltipInstance & {all(): TooltipInstance[]};

    /** Create Badge(s) - returns array if multiple elements match */
    badge(selector: string | HTMLElement, options?: BadgeOptions): BadgeInstance | BadgeInstance[];

    /** Create a NumberBadge notification counter on an element */
    numberBadge(selector: string | HTMLElement, options?: NumberBadgeOptions): NumberBadgeInstance;

    /** Create a Dropdown component */
    dropdown(selector: string | HTMLElement, options?: DropdownOptions): DropdownInstance;

    /** Create a Carousel component */
    carousel(selector: string | HTMLElement, options?: CarouselOptions): CarouselInstance;

    /** Create a BackToTop component */
    backToTop(selector?: string | HTMLElement, options?: BackToTopOptions): BackToTopInstance;

    /** Toast notification system */
    toast: ToastStatic;

    /** Keep Tab and focus inside containers while active */
    focusTrap: FocusTrapFactory;

    /** A Cmd/Ctrl+K command palette (builds its own overlay) */
    commandPalette: CommandPaletteFactory;

    /** Get the component on an element - factory-made ones too. `name` picks one when an element hosts several. */
    get(selector: string | HTMLElement, name?: string): ComponentInstance | undefined;

    /** Destroy a component */
    destroy(selector: string | HTMLElement): void;

    /** Destroy all components */
    destroyAll(): void;

    /** Register a custom component class */
    register(name: string, ComponentClass: new (selector: any, options?: any) => ComponentInstance): void;

    /** Create a registered custom component */
    create(name: string, selector: string | HTMLElement, options?: Record<string, any>): ComponentInstance;
}

export declare const elements: Elements;
