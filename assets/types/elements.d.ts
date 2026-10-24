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
// Split Pane
// ============================================

/** A pane size limit: px as a number, or a percentage string such as '20%' */
export type SplitPaneSize = number | string;

export interface SplitPaneOptions {
    /** 'horizontal' = side by side (default), 'vertical' = stacked */
    direction?: 'horizontal' | 'vertical';
    /** Percentages, one per pane (scaled to add up to 100); equal by default */
    sizes?: number[];
    /** Minimum size, one value or one per pane (default 0) */
    minSize?: SplitPaneSize | SplitPaneSize[];
    /** Maximum size, one value or one per pane (default none) */
    maxSize?: SplitPaneSize | null | Array<SplitPaneSize | null>;
    /** Gutter thickness in px (default 8) */
    gutterSize?: number;
    /** Snap to a limit when dragged within this many px of it (default 0) */
    snapOffset?: number;
    /** Which panes the gutter gestures may collapse */
    collapsible?: boolean | boolean[];
    /** What a collapsed pane shrinks to (default 0) */
    collapsedSize?: SplitPaneSize | SplitPaneSize[];
    /** A small toggle button in gutters next to a collapsible pane */
    collapseButton?: boolean;
    /** Remember sizes and collapse state with S under 'split-pane:<key>' */
    persistKey?: string | null;
    /** Gutter cursor (default col-resize / row-resize) */
    cursor?: string | null;
    disabled?: boolean;
    /** Percent per arrow key (default 1) */
    step?: number;
    /** Percent per Shift+arrow (default 10) */
    largeStep?: number;
    /** The gutters' aria-label */
    gutterLabel?: string;
    /** Return false to refuse a drag */
    onBeforeDrag?: (gutterIndex: number, event: PointerEvent) => boolean | void;
    onDragStart?: (sizes: number[], gutterIndex: number) => void;
    onDrag?: (sizes: number[], gutterIndex: number) => void;
    onDragEnd?: (sizes: number[], gutterIndex: number) => void;
    /** Any size change: drag, keys, setSizes, collapse */
    onResize?: (sizes: number[]) => void;
    onCollapse?: (paneIndex: number) => void;
    onExpand?: (paneIndex: number) => void;
}

export interface SplitPaneInstance extends ComponentInstance {
    /** The pane elements */
    readonly panes: HTMLElement[];
    /** Current sizes, percentages that add up to 100 */
    getSizes(): number[];
    /** Set every pane's size (clamped to the limits) */
    setSizes(sizes: number[]): this;
    collapse(index: number): this;
    expand(index: number): this;
    isCollapsed(index: number): boolean;
    /** Remove the gutters and listeners and restore the panes' own styles */
    destroy(): void;
}

// ============================================
// Virtual List
// ============================================

export interface VirtualListRange {
    /** First index, inclusive */
    start: number;
    /** Last index, inclusive (-1 for an empty list) */
    end: number;
}

export type VirtualListTemplate = string | Node | ((error?: unknown) => string | Node | null) | null;

export interface VirtualListOptions<T = any> {
    items?: T[] | null;
    /** With getItem, instead of items */
    count?: number;
    getItem?: ((index: number) => T) | null;
    /** px, or 'auto' to measure each row (default 40) */
    itemHeight?: number | 'auto';
    /** Height assumed for unmeasured rows in 'auto' mode (default 40) */
    estimatedItemHeight?: number;
    /** Rows rendered beyond each edge (default 4) */
    overscan?: number;
    /** A string is HTML (sanitised unless safe: false); an Element goes in as it is */
    render?: ((item: T, index: number) => string | Node) | null;
    /** false: render() strings are inserted unsanitised (default true) */
    safe?: boolean;
    /** Property name or function giving each item a stable key (default: the index) */
    keyField?: string | ((item: T, index: number) => unknown) | null;
    /** aria-label for the list */
    label?: string | null;
    /** Extra class on every row */
    rowClass?: string;
    /** Called near the end; resolves to the next items, or {items, done} */
    loadMore?: ((info: {count: number; page: number}) => Promise<T[] | {items: T[]; done?: boolean}>) | null;
    /** px from the end at which loadMore is called (default 200) */
    threshold?: number;
    loadingTemplate?: VirtualListTemplate;
    endTemplate?: VirtualListTemplate;
    /** A [data-vlist-retry] element inside it retries */
    errorTemplate?: VirtualListTemplate;
    onRender?: (range: VirtualListRange) => void;
    onScroll?: (visible: VirtualListRange) => void;
    onLoadMore?: (info: {count: number; page: number}) => void;
    onLoaded?: (items: T[]) => void;
    onEnd?: () => void;
    onError?: (error: unknown) => void;
    onItemClick?: (item: T, index: number, event: MouseEvent | KeyboardEvent) => void;
}

export interface VirtualListInstance<T = any> extends ComponentInstance {
    /** Number of rows */
    readonly count: number;
    setItems(items: T[]): this;
    append(items: T[]): this;
    /** Add at the start without moving what is on screen */
    prepend(items: T[]): this;
    /** A number is an index; anything else is a key */
    update(indexOrKey: number | unknown, item: T): this;
    indexOfKey(key: unknown): number;
    scrollToIndex(index: number, options?: {align?: 'start' | 'center' | 'end' | 'auto'; smooth?: boolean}): this;
    /** Scroll to a row and focus it */
    focusIndex(index: number): this;
    /** Re-render (and re-measure) the rendered rows */
    refresh(): this;
    /** Rows at least partly on screen */
    getVisibleRange(): VirtualListRange;
    /** Rows in the DOM, overscan included */
    getRenderedRange(): VirtualListRange;
    /** Retry a failed load */
    retry(): this;
    /** Whether loadMore has said there is nothing more */
    isDone(): boolean;
    /** Count mode: change the number of rows */
    setCount(count: number): this;
    /** Remove the rows and listeners and give the container its children back */
    destroy(): void;
}

// ============================================
// Elements Module
// ============================================

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

    /** Resizable panes from a container's children; null when nothing matches */
    splitPane(container: string | HTMLElement, options?: SplitPaneOptions): SplitPaneInstance | null;

    /** A scrolling list that renders only the visible rows; null when nothing matches */
    virtualList<T = any>(container: string | HTMLElement, options?: VirtualListOptions<T>): VirtualListInstance<T> | null;

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
