/**
 * Domma Elements Module - TypeScript Declarations
 * UI Components: Card, Modal, Tabs, Accordion, Tooltip, Badge, Dropdown, Toast, Carousel, BackToTop
 */

// ============================================
// Common Types
// ============================================

export type AnimationType = 'fade' | 'slide' | 'zoom' | 'none';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type DropdownPosition =
    | 'bottom-start' | 'bottom-end'
    | 'top-start' | 'top-end'
    | 'left-start' | 'left-end'
    | 'right-start' | 'right-end';
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
// Popover Component
// ============================================

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';
export type PopoverPlacement =
    | PopoverSide | 'auto'
    | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
    | 'left-start' | 'left-end' | 'right-start' | 'right-end'
    | 'auto-start' | 'auto-end';
export type PopoverTrigger = 'click' | 'hover' | 'focus' | 'manual' | string;

/** Text, a DOM node or collection, or a function returning either - called on every open */
export type PopoverContent =
    | string
    | Node
    | ArrayLike<Node>
    | null
    | ((popover: PopoverInstance) => string | Node | ArrayLike<Node> | null);

export interface PopoverOptions {
    /** Text (default), a Node, or a function returning either; see `html` */
    content?: PopoverContent;
    /** Heading; empty for none */
    title?: PopoverContent;
    /** Treat string content/title as HTML, passed through Domma's sanitiser (default: false) */
    html?: boolean;
    /** 'click' (default), 'hover', 'focus', 'manual', or several separated by spaces */
    trigger?: PopoverTrigger;
    /** Preferred side and alignment (default: 'bottom') */
    placement?: PopoverPlacement;
    /** Try the other sides when the preferred one has no room (default: true) */
    flip?: boolean;
    /** Gap in px, or [crossAxis, mainAxis] (default: 10) */
    offset?: number | [number, number];
    /** Show the arrow (default: true) */
    arrow?: boolean;
    /** Show a close (x) button (default: false) */
    dismissible?: boolean;
    /** Close on a pointer press or focus outside (default: true) */
    closeOnOutside?: boolean;
    /** Close on Escape (default: true) */
    closeOnEscape?: boolean;
    /** One open at a time per group; null = independent (default: 'default') */
    group?: string | null;
    /** Any CSS width; numbers are px */
    width?: string | number | null;
    /** Any CSS width; the stylesheet default is 20rem */
    maxWidth?: string | number | null;
    /** Extra classes on the panel */
    className?: string;
    /** Panel id (generated when omitted) */
    id?: string | null;
    /** 'dialog', or 'tooltip' for hover/focus-only triggers (default: auto) */
    role?: 'dialog' | 'tooltip' | string | null;
    /** Accessible name when there is no title */
    ariaLabel?: string | null;
    /** Move focus into the panel on open; null = for click popovers */
    autoFocus?: boolean | null;
    /** Tab cycles inside the panel instead of leaving it (default: false) */
    trapFocus?: boolean;
    /** Hover delays in ms (default: {show: 80, hide: 120}) */
    delay?: number | {show?: number; hide?: number};
    /** Fade and scale (default: true; skipped under reduced motion) */
    animation?: boolean;
    /** ms (default: 150) */
    animationDuration?: number;
    /** Where the panel is placed (default: document.body) */
    container?: string | HTMLElement | null;
    /** Override the stylesheet's z-index (10045) */
    zIndex?: number | null;
    /** Before opening; return false to cancel */
    onShow?: (popover: PopoverInstance) => boolean | void;
    /** After the open transition */
    onShown?: (popover: PopoverInstance) => void;
    /** Before closing; return false to cancel */
    onHide?: (popover: PopoverInstance) => boolean | void;
    /** After the panel has been removed */
    onHidden?: (popover: PopoverInstance) => void;
}

/** event.detail of popover:show / popover:shown / popover:hide / popover:hidden (fired on the trigger) */
export interface PopoverEventDetail {
    popover: PopoverInstance;
}

export interface PopoverInstance extends ComponentInstance {
    /** Panel id */
    readonly id: string;
    /** The panel element (created on first show) */
    readonly panel: HTMLElement | null;
    /** The trigger element */
    readonly trigger: HTMLElement | null;

    /** Open; `focus` overrides `autoFocus` for this open */
    show(options?: {focus?: boolean}): this;
    /** Close; focus returns to the trigger by default only when it was inside the panel */
    hide(options?: {returnFocus?: boolean}): this;
    toggle(options?: {focus?: boolean; returnFocus?: boolean}): this;
    isOpen(): boolean;
    /** Replace the content (repositions when open) */
    setContent(content: PopoverContent): this;
    /** Replace the title; empty removes the header */
    setTitle(title: PopoverContent): this;
    /** Reposition after the trigger moved or the content changed size */
    update(): this;
    /** Close at once, remove the panel and listeners, restore the trigger's attributes */
    destroy(): void;
}

export interface PopoverStatic {
    (trigger: string | HTMLElement | ArrayLike<HTMLElement>, options?: PopoverOptions): PopoverInstance;
    /** Create popovers from [data-popover] / [data-popover-content] markup under root; returns the new ones */
    scan(root?: string | Element | Document): PopoverInstance[];
    /** Close every open popover, or one group's */
    closeAll(group?: string | null): void;
    /** The popover bound to a trigger */
    getInstance(trigger: string | HTMLElement): PopoverInstance | null;
    /** The open popovers, oldest first */
    open(): PopoverInstance[];
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

// ============================================
// ListGroup Component
// ============================================

export type ListGroupVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export interface ListGroupOptions {
    /** Enable item selection */
    selectable?: boolean;
    /** Allow multiple items to be selected simultaneously */
    multiSelect?: boolean;
    /** Enable keyboard navigation (arrow keys, Home/End, Enter/Space) */
    keyboard?: boolean;
    /** Wrap keyboard navigation from last item to first (and vice versa) */
    loop?: boolean;
    /** Selector for list items (default: '.list-group-item') */
    itemSelector?: string;
    /** CSS class applied to selected items */
    selectedClass?: string;
    /** CSS class applied to the focused item */
    focusClass?: string;
    /** Initially selected item index or array of indices */
    selected?: number | number[] | null;
    /** Disable the entire list group */
    disabled?: boolean;
    /** Callback fired when selection changes */
    onChange?: (selected: number[], items: HTMLElement[]) => void;
}

export interface ListGroupInstance {
    /** The root list-group element */
    element: HTMLElement;

    /** Select an item by index */
    select(index: number): this;

    /** Deselect an item by index */
    deselect(index: number): this;

    /** Toggle an item's selected state by index */
    toggle(index: number): this;

    /** Select all items */
    selectAll(): this;

    /** Deselect all items */
    deselectAll(): this;

    /** Get the indices of all currently selected items */
    getSelected(): number[];

    /** Enable a specific item by index, or the entire list group if no index is given */
    enable(index?: number): this;

    /** Disable a specific item by index, or the entire list group if no index is given */
    disable(index?: number): this;

    /** Re-query items from the DOM and re-apply state (useful after dynamic updates) */
    refresh(): this;

    /** Destroy the component and clean up event listeners */
    destroy(): void;
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
    /** Preferred menu position - flipped or clamped if it would open off screen */
    position?: DropdownPosition;
    /** Position offset [x, y] */
    offset?: [number, number];
    /** Flip to the opposite side and clamp to the viewport rather than open off screen (default true) */
    flip?: boolean;
    /** Enable animations */
    animation?: boolean;
    /** Animation duration in ms */
    animationDuration?: number;
    /** ms before a hover opens the menu (default 0) */
    hoverOpenDelay?: number;
    /** ms of grace before a hover menu closes once the pointer has left trigger, menu and the gap between (default 300) */
    hoverCloseDelay?: number;
    /** Close menu after item selection */
    closeOnSelect?: boolean;
    /** Close menu when clicking outside */
    closeOnClickOutside?: boolean;
    /** Close on Esc and restore focus to the trigger (default true) */
    closeOnEscape?: boolean;
    /** Opening this dropdown closes any other open one (default true) */
    closeOthers?: boolean;
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
    /** Animation type: 'slide' (track translate), 'fade' (clean swap), or 'crossfade' (overlapping opacity) */
    animation?: 'slide' | 'fade' | 'crossfade';
    /** Animation duration in ms */
    animationDuration?: number;
    /** Any CSS timing function ('ease', 'linear', 'ease-in-out', 'cubic-bezier(...)' etc.) */
    animationEasing?: string;
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
// Signature Component
// ============================================

export interface SignatureOptions {
    /** Canvas height in px (default: 180) */
    height?: number;
    /** Default pen colour (default: '#000000') */
    penColour?: string;
    /** Default pen width in px (default: 2) */
    penWidth?: number;
    /** Export format: 'png' or 'svg' (default: 'png') */
    format?: 'png' | 'svg';
    /** Toolbar label text (default: 'Signature') */
    label?: string;
    /** Show dashed guide line (default: true) */
    guideLine?: boolean;
    /** Placeholder text (default: 'Sign here') */
    placeholder?: string;
    /** Colour swatches to show in toolbar */
    colours?: string[];
    /** Pen width options to show in toolbar */
    widths?: number[];
    /** Show or hide toolbar (default: true) */
    toolbar?: boolean;
    /** Name attribute for the hidden input (default: 'signature') */
    name?: string;
    /** Disable the pad (default: false) */
    disabled?: boolean;
    /** Enable Draw / Type toggle mode (default: false) */
    typeFallback?: boolean;
    /** Minimum number of points to register a stroke (default: 3) */
    minStrokeLength?: number;
    /** Honour prefers-reduced-motion (default: true) */
    respectMotionPreference?: boolean;
    /** Fired when the signature changes - receives base64 data URL */
    onChange?: (base64: string) => void;
    /** Fired when the signature is cleared */
    onClear?: () => void;
    /** Fired when a new stroke begins */
    onBegin?: (stroke: object) => void;
    /** Fired when a stroke ends */
    onEnd?: (stroke: object) => void;
}

export interface SignatureInstance extends ComponentInstance {
    /** Export signature as a base64 data URL */
    toBase64(format?: 'png' | 'svg'): string;

    /** True if no strokes have been drawn */
    isEmpty(): boolean;

    /** Clear the signature (undoable unless silent=true) */
    clear(silent?: boolean): void;

    /** Undo the last stroke */
    undo(): void;

    /** Redo the last undone stroke */
    redo(): void;

    /** Disable the signature pad */
    disable(): void;

    /** Enable the signature pad */
    enable(): void;
}

// ============================================================
// Chooser
// ============================================================

export interface ChooserBadge {
    text: string;
    type?: 'success' | 'info' | 'warning' | 'danger' | 'primary';
}

export interface ChooserOption {
    value: string | number;
    label: string;
    icon?: string;
    description?: string;
    tooltip?: string;
    badge?: ChooserBadge;
    recommended?: boolean;
    disabled?: boolean;
}

export type ChooserSemanticColour = 'primary' | 'success' | 'info' | 'warning' | 'danger';

export interface ChooserOptions {
    variant?: 'card' | 'chip';
    multiple?: boolean;
    density?: 'comfortable' | 'compact';
    columns?: number;
    label?: string;
    required?: boolean;
    name?: string;
    value?: string | string[] | null;
    /** Selected/recommended highlight colour - semantic name or any CSS colour string */
    accent?: ChooserSemanticColour | string;
    /** Visual style of the selected state */
    accentStyle?: 'border' | 'solid' | 'glow' | 'overlay' | 'underline';
    /** Soft outer glow on the selected option */
    glow?: boolean;
    /** Glow colour override - semantic name or any CSS colour string. Defaults to the accent colour. */
    glowColour?: ChooserSemanticColour | string | null;
    /** Shadow weight applied to every option */
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    /** Optional shadow tint - any CSS colour string */
    shadowColour?: string | null;
    options: ChooserOption[];
    onChange?: (value: string | string[] | null) => void;
}

export interface ChooserInstance {
    getValue(): string | string[] | null;
    setValue(value: string | string[] | null): void;
    disable(): void;
    enable(): void;
    destroy(): void;
}

// ============================================
// ContextMenu
// ============================================

export interface ContextMenuContext {
    /** The delegated element the menu was opened against (or the container when no `match` is set) */
    target: HTMLElement;
    /** The bound container that claimed the gesture */
    container: HTMLElement;
    /** Viewport x of the opening point */
    x: number;
    /** Viewport y of the opening point */
    y: number;
    /** Originating event, or null when opened programmatically */
    event: Event | null;
    /** The menu element, once rendered */
    menu: HTMLElement | null;
    /** The instance that owns the menu */
    instance: ContextMenuInstance;
}

export interface ContextMenuItem {
    /** Item text */
    label?: string;
    /** Domma icon name, rendered through data-icon */
    icon?: string;
    /** Arbitrary value carried to onSelect */
    value?: any;
    /** Invoked with the delegated target and the open context */
    action?: (target: HTMLElement | null, ctx: ContextMenuContext) => void | Promise<void>;
    /** Greyed but still shown; a function is resolved per target */
    disabled?: boolean | ((target: HTMLElement, ctx: ContextMenuContext) => boolean);
    /** Omitted entirely when false; a function is resolved per target */
    visible?: boolean | ((target: HTMLElement, ctx: ContextMenuContext) => boolean);
    /** Destructive styling */
    danger?: boolean;
    /** Right-aligned hint text - display only, no key is bound */
    shortcut?: string;
    /** Nested items, to unlimited depth */
    submenu?: ContextMenuItem[] | ((target: HTMLElement, ctx: ContextMenuContext) => ContextMenuItem[]);
    /** Item kind (default 'item') */
    type?: 'item' | 'divider' | 'header' | 'checkbox' | 'radio';
    /** Checked state for checkbox/radio types */
    checked?: boolean | ((target: HTMLElement, ctx: ContextMenuContext) => boolean);
    /** Radio grouping key */
    group?: string;
    /** Shorthand for type: 'divider' */
    divider?: boolean;
    /** Shorthand for type: 'header' */
    header?: string;
}

export interface ContextMenuOptions {
    /** Items, or a resolver called with the delegated target. Accepts a Domma Reactive observable. */
    items?: ContextMenuItem[] | ((target: HTMLElement, ctx: ContextMenuContext) => ContextMenuItem[]) | any;
    /** Delegation selector - the menu claims only descendants matching it (default: the whole container) */
    match?: string | null;
    /** Regions inside the container that decline and fall through outward */
    exclude?: string | null;
    /** False declines the gesture and falls through to the next menu outward */
    enabled?: boolean | ((target: HTMLElement, ctx: ContextMenuContext) => boolean);
    /** Merge ancestor menus' items rather than replacing them (default 'append') */
    inherit?: 'append' | 'prepend' | false;
    /** Tie-break only when two menus bind the SAME element; depth wins otherwise */
    priority?: number;
    /**
     * This menu owns its region: once it encloses the click and accepts it, nothing
     * bound deeper is offered the gesture. For a component that must not be shadowed
     * by application menus. Not a veto - an exclusive menu that declines steps aside.
     */
    exclusive?: boolean;
    /** Shift+right-click passes through to the browser's own menu (default true) */
    nativeOnShift?: boolean;
    /** Close after an item is chosen (default true) */
    closeOnSelect?: boolean;
    /** Close on Esc (default true) */
    closeOnEscape?: boolean;
    /** Close on outside mousedown (default true) */
    closeOnClickOutside?: boolean;
    /** Close on scroll - the anchoring point has moved (default true) */
    closeOnScroll?: boolean;
    /** Long-press duration in ms for touch, or false to disable (default 500) */
    longPress?: number | false;
    /**
     * Pointer shown over a region this menu claims - the only clue a right-click
     * does anything.
     *
     *   'auto'    the CSS `context-menu` keyword (default)
     *   'glyph'   a generated arrow-plus-list cursor, themed and regenerated
     *   false     leave the pointer alone
     *   string    any CSS cursor value, used verbatim
     *
     * 'auto' by default because the keyword honours the viewer's own cursor
     * theme, including an enlarged pointer set for low vision. Its weakness is
     * that Windows renders it identically to the plain arrow, so interfaces
     * that need the affordance to land opt into 'glyph'.
     */
    cursor?: 'auto' | 'glyph' | false | string;
    /** Glyph cursor size in px, clamped to 32 - browsers ignore anything larger (default 26) */
    cursorSize?: number;
    /** Extra class on the menu root */
    className?: string;
    /** Minimum menu width (default '200px') */
    minWidth?: string;
    /** Maximum menu width (default '320px') */
    maxWidth?: string;
    /** Maximum menu height before it scrolls (default '60vh') */
    maxHeight?: string;
    /** Offset [x, y] from the cursor point (default [2, 2]) */
    offset?: [number, number];
    /** Flip across the cursor and clamp to the viewport (default true) */
    flip?: boolean;
    /** Whether to transition on open and close (default true) */
    animation?: boolean;
    /** Transition duration in ms (default 120) */
    animationDuration?: number;
    /** How the panel enters (default 'scale') */
    transition?: 'scale' | 'fade' | 'slide' | 'none';
    /** Any CSS easing (default cubic-bezier(0.16, 1, 0.3, 1)) */
    easing?: string;
    /** Preset key ('primary'|'success'|'danger'|'warning'|'info') or any CSS colour */
    accent?: string;
    /** Overrides the panel background */
    surface?: string;
    /** 'none'|'sm'|'md'|'lg'|'xl', or any CSS length */
    radius?: string;
    /** 'none'|'sm'|'md'|'lg'|'xl' */
    shadow?: string;
    /** 20-100; translucent panel with a blurred backdrop. Clamped. */
    opacity?: number;
    /** Row height and font size (default 'comfortable') */
    density?: 'comfortable' | 'compact';
    /** Custom item renderer returning HTML */
    itemTemplate?: (item: ContextMenuItem, index: number) => string;
    /** Hover grace before a submenu opens, in ms (default 150) */
    submenuDelay?: number;
    /**
     * Render your own panel instead of an item list, for menus that cannot be
     * expressed as items. The cascade still arbitrates; this is called only once
     * this menu has claimed the gesture. Return an element for Domma to position
     * and dismiss, or nothing to manage it yourself.
     */
    render?: (ctx: ContextMenuContext) => HTMLElement | void;
    /** Open on Shift+F10 and the Menu key against the focused element (default true) */
    keyboardTrigger?: boolean;
    /** Jump to an item by typing (default true) */
    typeahead?: boolean;
    /** aria-label for the menu */
    ariaLabel?: string;
    /** Bind items to a Domma Model */
    model?: any;
    /** Model key holding the items array */
    modelKey?: string;
    /** Return false to decline and fall through to the next menu outward */
    onBeforeOpen?: (ctx: ContextMenuContext) => boolean | void;
    /** Fired once the menu is on screen */
    onOpen?: (ctx: ContextMenuContext) => void;
    /** Fired after the menu is dismissed */
    onClose?: (ctx: ContextMenuContext | null) => void;
    /** Fired before the item's own action */
    onSelect?: (item: ContextMenuItem, ctx: ContextMenuContext) => void;
}

export interface ContextMenuInstance extends ComponentInstance {
    /** Open at a viewport point, optionally against a specific target */
    open(x: number, y: number, target?: HTMLElement): ContextMenuInstance;

    /** Close the menu */
    close(): ContextMenuInstance;

    /** Rebuild the open menu in place, keeping its position */
    refresh(): ContextMenuInstance;

    /** Whether this menu is currently open */
    isOpen(): boolean;

    /** Replace the items */
    setItems(items: ContextMenuItem[] | ((target: HTMLElement) => ContextMenuItem[])): ContextMenuInstance;

    /** Re-arm the menu */
    enable(): ContextMenuInstance;

    /** Suppress the menu; right-clicks fall through to the next menu outward */
    disable(): ContextMenuInstance;

    /** Close, deregister and detach */
    destroy(): void;
}

export interface ContextMenuStatic {
    (selector: string | HTMLElement, options?: ContextMenuOptions): ContextMenuInstance;

    /** Close whichever menu is open */
    closeAll(): void;

    /** The open instance, or null - only one can be open at a time */
    active(): ContextMenuInstance | null;

    /** Bound menus; with an element, the resolution chain for it, innermost first */
    registry(forElement?: HTMLElement | null): ContextMenuInstance[];
}

// ============================================
// Sortable
// ============================================

/** Where an indicator-mode drop lands relative to its target */
export type SortableZone = 'before' | 'after' | 'into';

export interface SortableStartDetail {
    item: HTMLElement;
    /** Index of the item when the drag began */
    from: number;
}

export interface SortableMoveDetail {
    item: HTMLElement;
    /** The item under the pointer (indicator mode: the accepted drop target), or null */
    target: HTMLElement | null;
    /** Indicator mode only; null in live mode */
    zone: SortableZone | null;
    x: number;
    y: number;
}

export interface SortableSortDetail {
    item: HTMLElement;
    from: number;
    to: number;
    /** Every item's key, in the new order */
    order: (string | null)[];
    /** Every item's key, in the order before the drag */
    previous: (string | null)[];
}

export interface SortableDropDetail {
    /** The dragged element (it has not moved - the host re-renders) */
    item: HTMLElement;
    /** The item it was dropped on or beside */
    target: HTMLElement;
    zone: SortableZone;
    /** Value of the `key` attribute on the dragged item */
    key: string | null;
    /** Value of the `key` attribute on the target */
    targetKey: string | null;
}

export interface SortableEndDetail {
    item: HTMLElement;
    /** Whether the order changed */
    changed: boolean;
}

export interface SortableOptions {
    /** Selector for the sortable items; null = the container's direct children */
    items?: string | null;
    /** Selector inside an item that starts a drag; null = the whole item */
    handle?: string | null;
    /** Adds an "into" drop zone and switches to indicator mode (for trees) */
    nest?: boolean;
    /** null = !nest. true = siblings slide aside while you drag; false = indicator mode */
    live?: boolean | null;
    /** 'y' for a column, 'x' for a row */
    axis?: 'x' | 'y';
    /** Attribute that identifies an item across re-renders (default 'data-id') */
    key?: string;
    /** Animation duration in ms; 0 turns it off. Reduced motion always does */
    animation?: number;
    /** CSS easing for every glide */
    easing?: string;
    /** Pixels the pointer must travel before a press becomes a drag (default 4) */
    threshold?: number;
    /** Ms a finger must rest on an item with no handle before it drags (default 220) */
    touchDelay?: number;
    /** Share of an item's height, centred, that means "into" (default 0.5) */
    nestZone?: number;
    /** Veto a drop. Live mode passes 'before' or 'after' */
    accepts?: ((item: HTMLElement, target: HTMLElement, zone: SortableZone) => boolean) | null;
    /** Start disabled */
    disabled?: boolean;
    /** Alt+Arrow moves the focused item (live mode). Default true */
    keyboard?: boolean;
    /** Storage key (or true = the container's id): remember the order. Live mode */
    persist?: string | boolean;
    /** Scroll the nearest scrolling ancestor (or the page) near its edges. Default true */
    autoScroll?: boolean;
    /** Where the dragged copy is appended; null = the container */
    ghostParent?: HTMLElement | null;
    onStart?: (detail: SortableStartDetail) => void;
    onMove?: (detail: SortableMoveDetail) => void;
    /** Live mode: the order changed */
    onSort?: (detail: SortableSortDetail) => void;
    /**
     * Indicator mode: update your data and re-render here. Return false (or a
     * promise that rejects) to refuse; a returned promise is awaited before animating.
     */
    onDrop?: (detail: SortableDropDetail) => boolean | void | Promise<any>;
    /** Esc, a refused drop, or a drop over nothing */
    onCancel?: (detail: {item: HTMLElement}) => void;
    /** Every drag, keyboard move and cancel ends here */
    onEnd?: (detail: SortableEndDetail) => void;
}

export interface SortableInstance extends ComponentInstance {
    /** The item keys, in their current order */
    toArray(): (string | null)[];

    /** Put the items in the order of `keys`; items not named keep their slots */
    sort(keys: (string | number)[], options?: {animate?: boolean}): SortableInstance;

    /** Re-apply the saved order (live mode with `persist`) */
    restore(): SortableInstance;

    /** Forget the saved order */
    forget(): SortableInstance;

    /**
     * Run `mutate` (which may re-render the container) and glide every item,
     * matched by `key`, from where it was to where it is afterwards.
     */
    animate<T>(mutate: () => T): T;

    /** Re-arm dragging */
    enable(): SortableInstance;

    /** Stop dragging; a drag in progress is cancelled */
    disable(): SortableInstance;

    /** Whether a drag is in progress */
    readonly dragging: boolean;

    /** Cancel any drag, remove the classes and detach */
    destroy(): void;
}

// ============================================
// Skeleton
// ============================================

export type SkeletonType = 'text' | 'card' | 'list' | 'table' | 'custom';

export interface SkeletonOptions {
    /** Shape to draw (default 'text') */
    type?: SkeletonType;
    /** Lines per paragraph, card or list item (default 3; list 2) */
    lines?: number;
    /** Paragraphs, cards or list items (default 1; list 3) */
    count?: number;
    /** Table rows (default 5) */
    rows?: number;
    /** Table columns (default 4) */
    columns?: number;
    /** Table header row (default true) */
    header?: boolean;
    /** A circle at the start of each list item (default true) */
    avatar?: boolean;
    /** An image block at the top of each card (default true) */
    image?: boolean;
    /** false = still tint, no sweep (default true) */
    animate?: boolean;
    /** Markup for type 'custom', or a function returning it */
    template?: string | ((options: SkeletonOptions) => string) | null;
    /** Screen-reader status text (default 'Loading...') */
    label?: string;
}

export interface SkeletonHandle {
    /** The container */
    readonly element: HTMLElement;
    /** The resolved options */
    readonly options: SkeletonOptions;
    /** Whether the skeleton is still showing */
    readonly active: boolean;
    /** Take the skeleton away and restore the previous children (the same nodes) */
    remove(): HTMLElement;
    /** Take the skeleton away and show content instead: an HTML string (unsanitised) or a node */
    replace(content: string | Node | ArrayLike<Node> | null): HTMLElement;
    /** Alias of remove() */
    destroy(): HTMLElement;
}

export interface SkeletonStatic {
    /**
     * Fill a container with placeholders, mark it aria-busy with a polite
     * "Loading..." status and return a handle. null if nothing matched.
     */
    (target: string | HTMLElement | ArrayLike<HTMLElement>, options?: SkeletonOptions): SkeletonHandle | null;
    /**
     * Show a skeleton until the promise settles. Resolves with its value once
     * the skeleton is gone; on rejection removes it and rethrows.
     */
    while<T>(target: string | HTMLElement | ArrayLike<HTMLElement>, promise: Promise<T> | (() => Promise<T> | T), options?: SkeletonOptions): Promise<T>;
    /** The live handle on a container, or null */
    get(target: string | HTMLElement | ArrayLike<HTMLElement>): SkeletonHandle | null;
    /** Remove the skeleton from a container, restoring its content */
    remove(target: string | HTMLElement | ArrayLike<HTMLElement>): HTMLElement | null;
    /** Fill every [data-skeleton] container under root (options from data-skeleton-*) */
    scan(root?: string | HTMLElement | Document): SkeletonHandle[];
    /** The placeholder markup for some options, as a string */
    markup(options?: SkeletonOptions): string;
}

// ============================================
// Avatar
// ============================================

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'rounded' | 'square';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

export interface AvatarOptions {
    /** The person: initials, tone and accessible name come from it */
    name?: string | null;
    /** Picture URL; falls back to the initials (or icon) if it fails to load */
    src?: string | null;
    /** Accessible name when it should differ from name */
    alt?: string | null;
    /** Size (default 'md') */
    size?: AvatarSize;
    /** Shape (default 'circle') */
    shape?: AvatarShape;
    /** Status dot; the word goes into the accessible name */
    status?: AvatarStatus | null;
    /** Words for the statuses in the accessible name, e.g. {busy: 'in a meeting'} */
    statusLabels?: Partial<Record<AvatarStatus, string>> | null;
    /** Icon name shown instead of initials ('user' when there is no name) */
    icon?: string | null;
    /** Hover text; true = the accessible name */
    title?: string | true | null;
    /** A primary-coloured ring (default false) */
    ring?: boolean;
    /** 0-7 to choose the tint; default is a hash of the name */
    tone?: number | null;
    /** aria-hidden: the name is written next to it (default false) */
    decorative?: boolean;
}

export interface AvatarHandle {
    /** The avatar element */
    readonly element: HTMLElement;
    /** The options in force */
    readonly options: AvatarOptions;
    /** The initials drawn ('' when an icon is shown) */
    readonly initials: string;
    /** The tone 0-7, or null with nothing to hash */
    readonly tone: number | null;
    /** The accessible name, e.g. 'Jane Smith (online)' */
    readonly label: string;
    /** Merge options and redraw */
    update(options?: AvatarOptions): AvatarHandle;
    /** Restore the element's previous children, classes and attributes */
    destroy(): HTMLElement;
}

export interface AvatarStatic {
    /**
     * Turn the element into an avatar. With no target (null, or the options
     * object first) a detached <span> is created. null if a selector matched nothing.
     */
    (target: string | HTMLElement | ArrayLike<HTMLElement> | null, options?: AvatarOptions): AvatarHandle | null;
    (options: AvatarOptions): AvatarHandle;
    /** Every [data-avatar] under root (options from data-avatar-*), once */
    scan(root?: string | HTMLElement | Document): AvatarHandle[];
    /** The live handle on an element, or null */
    get(target: string | HTMLElement | ArrayLike<HTMLElement>): AvatarHandle | null;
    /** Initials for a name: 'Jane Smith' -> 'JS', 'jane.smith@x.com' -> 'JS', 'Madonna' -> 'M' */
    initials(name: string | null | undefined): string;
    /** The tone (0-7) a name gets - stable across pages and sessions */
    tone(name: string): number;
}

export interface AvatarPerson {
    name?: string;
    src?: string;
    status?: AvatarStatus;
    /** Makes the avatar a link */
    href?: string;
    alt?: string;
    icon?: string;
    tone?: number;
    /** Hover text (default: the accessible name) */
    title?: string | true;
}

export interface AvatarGroupOptions {
    /** People, or plain names */
    people?: Array<AvatarPerson | string>;
    /** Show this many, then "+N"; null = everyone */
    max?: number | null;
    /** Size (default 'md') */
    size?: AvatarSize;
    /** Shape (default 'circle') */
    shape?: AvatarShape;
    /** 'none' | 'sm' | 'md' | 'lg', pixels, or any CSS length; null = the stylesheet's 25% */
    overlap?: 'none' | 'sm' | 'md' | 'lg' | number | string | null;
    /** Accessible name for the list */
    label?: string | null;
    statusLabels?: Partial<Record<AvatarStatus, string>> | null;
    /** Called when "+N" is pressed, instead of the popover */
    onMore?: ((hidden: AvatarPerson[], event: MouseEvent) => void) | null;
    /** false: no popover, the hidden names go in the button's title (default true) */
    popover?: boolean;
    /** The "+N" button's accessible name (default '3 more: A, B and C') */
    moreLabel?: ((count: number, names: string[]) => string) | null;
}

export interface AvatarGroupHandle {
    /** The <ul> */
    readonly element: HTMLUListElement | HTMLOListElement;
    readonly options: AvatarGroupOptions;
    readonly people: AvatarPerson[];
    /** Drawn as avatars */
    readonly shown: AvatarPerson[];
    /** Folded into "+N" */
    readonly hidden: AvatarPerson[];
    /** The "+N" button, or null */
    readonly more: HTMLButtonElement | null;
    /** The "+N" popover, or null */
    readonly popover: PopoverInstance | null;
    update(options?: AvatarGroupOptions): AvatarGroupHandle;
    setPeople(people: Array<AvatarPerson | string>): AvatarGroupHandle;
    /** Remove everything and restore the host */
    destroy(): HTMLElement;
}

export interface AvatarGroupStatic {
    /** Fill a <ul>/<ol>, or put a new <ul> into any other element. null if nothing matched */
    (target: string | HTMLElement | ArrayLike<HTMLElement>, options?: AvatarGroupOptions): AvatarGroupHandle | null;
    /** The live group handle on a host, or null */
    get(target: string | HTMLElement | ArrayLike<HTMLElement>): AvatarGroupHandle | null;
}

// ============================================
// InputGroup
// ============================================

/**
 * One addon slot: an icon (a plain icon name), text (set as text, never
 * parsed as HTML), or a string, which is shorthand for `{text}`.
 * `null`, `false` or `''` means no addon.
 */
export type InputGroupSlot =
    | {icon: string}
    | {text: string | number}
    | string
    | number
    | null
    | false;

export interface InputGroupOptions {
    /** Addon joined to the start of the input */
    prefix?: InputGroupSlot;
    /** Addon joined to the end of the input */
    suffix?: InputGroupSlot;
    /** Password inputs: show / hide toggle button (aria-pressed, eye / eye-off) */
    reveal?: boolean;
    /**
     * Text-like inputs and textareas: clear button shown while there is a
     * value; clearing fires input + change and refocuses the input
     */
    clear?: boolean;
    /**
     * Number inputs: - and + buttons honouring min / max / step, disabled at
     * the limits, input + change per step, hold to repeat
     */
    stepper?: boolean;
    /**
     * Text-like inputs and textareas: live "12 / 200" counter after the group
     * (aria-live polite, added to aria-describedby). `true` reads maxLength;
     * a number is the limit. `.is-warning` from 90%, `.is-over` past it
     */
    counter?: boolean | number;
    /** Accessible names for the buttons */
    labels?: {reveal?: string; clear?: string; decrease?: string; increase?: string};
}

/** The extras' elements, present only for the extras in use */
export interface InputGroupExtras {
    reveal?: HTMLButtonElement;
    clear?: HTMLButtonElement;
    decrease?: HTMLButtonElement;
    increase?: HTMLButtonElement;
    counter?: HTMLElement;
}

export interface InputGroupInstance extends ComponentInstance {
    /** The bound input (or select) */
    readonly input: HTMLElement;

    /** The `.input-group-icon` wrapper; null after destroy() */
    readonly wrapper: HTMLElement | null;

    /** The extras' elements (reveal, clear, decrease, increase, counter) */
    readonly extras: InputGroupExtras;

    /**
     * Change addons and / or extras. `null` removes an addon, `false` an
     * extra; a key left out is kept. Returns the instance.
     */
    update(options?: InputGroupOptions): InputGroupInstance;

    /**
     * Re-read the input after setting its value from code without an input
     * event: clear-button visibility, stepper limits, counter text
     */
    refresh(): InputGroupInstance;

    /** Step a stepper input by one step: 1 up, -1 down (fires input + change) */
    step(dir: 1 | -1): InputGroupInstance;

    /**
     * Remove the addons and extras (with their listeners), restore a revealed
     * password and aria-describedby, and remove the wrapper if this instance made it
     */
    destroy(): void;
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
    tooltip(selector: string | HTMLElement, options?: TooltipOptions): TooltipInstance | TooltipInstance[];

    /**
     * Anchor a rich panel (title, text/DOM content, close button) to a trigger,
     * opened by click, hover, focus or code. Portalled to document.body; flips
     * and shifts to stay in the viewport. `E.popover.scan(root)` reads
     * `data-popover` markup.
     */
    popover: PopoverStatic;

    /** Create Badge(s) - returns array if multiple elements match */
    badge(selector: string | HTMLElement, options?: BadgeOptions): BadgeInstance | BadgeInstance[];

    /** Create a NumberBadge notification counter on an element */
    numberBadge(selector: string | HTMLElement, options?: NumberBadgeOptions): NumberBadgeInstance;

    /** Create a ListGroup component - returns array if multiple elements match */
    listGroup(selector: string | HTMLElement, options?: ListGroupOptions): ListGroupInstance | ListGroupInstance[];

    /** Create a Dropdown component */
    dropdown(selector: string | HTMLElement, options?: DropdownOptions): DropdownInstance;

    /**
     * Bind a right-click menu to a container and, by delegation, its children.
     * Menus nest: an inner menu shadows its parent for the region it covers,
     * and by default appends the parent's items beneath its own.
     */
    contextMenu: ContextMenuStatic;

    /**
     * Drag-to-reorder for a container's children, by pointer, touch and keyboard.
     * Live mode slides siblings aside; `nest: true` switches to indicator mode with
     * an "into" zone and hands each drop to `onDrop` for the host to re-render.
     * `persist` remembers the order through Domma storage.
     */
    sortable(selector: string | HTMLElement, options?: SortableOptions): SortableInstance;

    /**
     * Shimmering placeholders shaped like the content on its way (text, card,
     * list, table or custom). E.skeleton.while(target, promise, opts) shows one
     * until a promise settles; .get, .remove, .scan and .markup round it off.
     */
    skeleton: SkeletonStatic;
    /** A picture, initials or icon; E.avatar.scan() for data-avatar */
    avatar: AvatarStatic;
    /** Overlapping avatars with "+N" */
    avatarGroup: AvatarGroupStatic;

    /**
     * Join an icon or short text to the start and/or end of an input already
     * on the page (Bootstrap-style input group) - the same markup Forma writes
     * for `formConfig.prefix` / `formConfig.suffix`. Binding an input Forma
     * already wrapped reuses that group. `reveal`, `clear`, `stepper` and
     * `counter` join interactive extras (the same keys as formConfig).
     */
    inputGroup(selector: string | HTMLElement, options?: InputGroupOptions): InputGroupInstance;

    /** Create a Carousel component */
    carousel(selector: string | HTMLElement, options?: CarouselOptions): CarouselInstance;

    /** Create a BackToTop component */
    backToTop(selector?: string | HTMLElement, options?: BackToTopOptions): BackToTopInstance;

    /** Toast notification system */
    toast: ToastStatic;

    /** Create a Signature capture pad */
    signature(selector: string | HTMLElement, options?: SignatureOptions): SignatureInstance;

    /**
     * Visual option-picker - card or chip variants, single or multi-select,
     * with rich per-option metadata (icon, description, tooltip, badge,
     * recommended, disabled).
     */
    chooser(selector: string | HTMLElement, options: ChooserOptions): ChooserInstance | null;

    /** Get component instance for an element */
    get(selector: string | HTMLElement): ComponentInstance | undefined;

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
