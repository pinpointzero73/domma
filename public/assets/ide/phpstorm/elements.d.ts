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

    /** Create Badge(s) - returns array if multiple elements match */
    badge(selector: string | HTMLElement, options?: BadgeOptions): BadgeInstance | BadgeInstance[];

    /** Create a NumberBadge notification counter on an element */
    numberBadge(selector: string | HTMLElement, options?: NumberBadgeOptions): NumberBadgeInstance;

    /** Create a ListGroup component - returns array if multiple elements match */
    listGroup(selector: string | HTMLElement, options?: ListGroupOptions): ListGroupInstance | ListGroupInstance[];

    /** Create a Dropdown component */
    dropdown(selector: string | HTMLElement, options?: DropdownOptions): DropdownInstance;

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
