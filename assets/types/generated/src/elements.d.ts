/**
 * @typedef {object} ChooserBadge
 * @property {string} text
 * @property {'success'|'info'|'warning'|'danger'|'primary'} [type='primary']
 */
/**
 * @typedef {object} ChooserOption
 * @property {string|number} value
 * @property {string} label
 * @property {string} [icon] - Domma icon name
 * @property {string} [description] - Card variant, comfortable density only
 * @property {string} [tooltip]
 * @property {ChooserBadge} [badge]
 * @property {boolean} [recommended]
 * @property {boolean} [disabled]
 */
/** @typedef {'primary'|'success'|'info'|'warning'|'danger'} ChooserSemanticColour */
/**
 * @typedef {object} ChooserOptions
 * @property {ChooserOption[]} options - The choices
 * @property {'card'|'chip'} [variant='card']
 * @property {boolean} [multiple=false] - Multi-select
 * @property {'comfortable'|'compact'} [density='comfortable']
 * @property {number} [columns=3] - Grid columns (card variant)
 * @property {string} [label] - Label rendered above
 * @property {boolean} [required=false] - Required indicator
 * @property {string} [name] - Hidden-input name for native form submission
 * @property {string|string[]|null} [value] - Initial selection
 * @property {ChooserSemanticColour|string} [accent='primary'] - Selected/recommended highlight colour - semantic name or any CSS colour string
 * @property {'border'|'solid'|'glow'|'overlay'|'underline'} [accentStyle='border'] - Visual style of the selected state
 * @property {boolean} [glow=false] - Soft outer glow on the selected option
 * @property {ChooserSemanticColour|string|null} [glowColour=null] - Glow colour override - semantic name or any CSS colour string. Defaults to the accent colour.
 * @property {'none'|'sm'|'md'|'lg'|'xl'} [shadow='none'] - Shadow weight applied to every option
 * @property {string|null} [shadowColour=null] - Optional shadow tint - any CSS colour string
 * @property {(value: string|string[]|null) => void} [onChange] - Called with the new value (user changes only, not setValue)
 */
/**
 * What `E.chooser()` returns. A missing host gets an inert one (`element` null, methods do nothing).
 * @typedef {{
 *   readonly element: HTMLElement|null,
 *   _root: HTMLElement|null,
 *   getValue(): string|string[]|null,
 *   setValue(value: string|string[]|null): void,
 *   disable(): void,
 *   enable(): void,
 *   destroy(): void
 * }} ChooserInstance
 */
/**
 * `Domma.elements` / `E` - every UI component factory.
 * @typedef {object} Elements
 * @property {(selector: import('./components/shared.js').ComponentTarget, options?: import('./components/card.js').CardOptions) => import('./components/card.js').CardInstance|null} card
 *   Create a Card component (null when nothing matches)
 * @property {{
 *   (selector: string|Element|ArrayLike<Element>, options?: import('./components/modal.js').ModalOptions): import('./components/modal.js').ModalInstance|null,
 *   (options: import('./components/modal.js').ModalOptions): import('./components/modal.js').ModalInstance
 * }} modal
 *   Create a Modal: on an element (null when nothing matches), or - given only an options object - a new
 *   modal in the shared dialog container
 * @property {(selector: string|HTMLElement, options?: TabsOptions) => TabsInstance} tabs - Create a Tabs component
 * @property {(selector: string|HTMLElement, options?: AccordionOptions) => AccordionInstance} accordion - Create an Accordion component
 * @property {{
 *   (selector: import('./components/shared.js').ComponentTarget, options?: import('./components/tooltip.js').TooltipOptions): (import('./components/tooltip.js').TooltipInstance & {all(): import('./components/tooltip.js').TooltipInstance[]})|null,
 *   all(selector: import('./components/shared.js').ComponentTarget, options?: import('./components/tooltip.js').TooltipOptions): import('./components/tooltip.js').TooltipInstance[]
 * }} tooltip
 *   A tooltip on every match; returns the first (with `all()` for the rest), or null.
 *   `E.tooltip.all()` returns them as an array.
 * @property {(selector: import('./components/shared.js').ComponentTarget, options?: import('./components/badge.js').BadgeOptions) => import('./components/badge.js').BadgeInstance|null} badge
 *   Create a Badge (null when nothing matches)
 * @property {(selector: import('./components/shared.js').ComponentTarget, options?: import('./components/badge.js').NumberBadgeOptions) => import('./components/badge.js').NumberBadgeInstance|null} numberBadge
 *   Create a NumberBadge notification counter on an element (null when nothing matches)
 * @property {(selector: string|HTMLElement, options?: DropdownOptions) => DropdownInstance} dropdown - Create a Dropdown component
 * @property {(selector: string|HTMLElement, options?: CarouselOptions) => CarouselInstance} carousel - Create a Carousel component
 * @property {(options?: CookieConsentOptions) => CookieConsentInstance} cookieConsent - The page's cookie consent banner (one per page)
 * @property {(selector?: string|HTMLElement|null, options?: import('./components/back-to-top.js').BackToTopOptions) => import('./components/back-to-top.js').BackToTopInstance} backToTop
 *   Create a BackToTop button: a button / link selector is used as the button, anything else adds one
 * @property {{
 *   (selector: string|HTMLElement, options?: ButtonGroupOptions): (ButtonGroupInstance & {all(): ButtonGroup[]})|null,
 *   all(selector: string|HTMLElement, options?: ButtonGroupOptions): ButtonGroup[]
 * }} buttonGroup
 *   A button group on every match; returns the first (with `all()` for the rest). `E.buttonGroup.all()`
 *   returns them as an array. A selector that matches nothing returns null.
 * @property {(selector: import('./components/shared.js').ComponentTarget, options?: import('./components/loader.js').LoaderOptions) => import('./components/loader.js').LoaderInstance|null} loader
 *   Create a Loader on an element (null when nothing matches)
 * @property {(selector: import('./components/shared.js').ComponentTarget, options?: import('./components/loader.js').LoaderOptions) => import('./components/loader.js').LoaderInstance|null} showLoader
 *   Show the element's loader, creating it if needed
 * @property {(selector: import('./components/shared.js').ComponentTarget) => import('./components/loader.js').LoaderInstance|undefined} hideLoader
 *   Hide the element's loader
 * @property {(text?: string, options?: FullscreenLoaderOptions) => import('./components/loader.js').LoaderInstance} fullscreenLoader
 *   A full-screen loader (`#dm-loader-fullscreen`), reused on later calls
 * @property {(selector: string|HTMLElement, options?: BreadcrumbsOptions) => BreadcrumbsInstance} breadcrumbs - Render breadcrumbs into an element
 * @property {(selector: string|HTMLElement, options?: NavbarOptions) => NavbarInstance} navbar - Render a navbar into an element
 * @property {(selector: string|HTMLElement, options?: SidebarOptions) => SidebarInstance} sidebar - Render a sidebar into an element
 * @property {(selector: string|HTMLElement, options?: FooterOptions) => FooterInstance} footer - Render a footer into an element
 * @property {(options?: DesktopNotificationOptions) => DesktopNotification} notification - A desktop notification (call show())
 * @property {(title: string|DesktopNotificationOptions, options?: DesktopNotificationOptions) => DesktopNotification} notify
 *   Show a desktop notification now: notify(title, options) or notify({title, ...})
 * @property {(selector?: string|HTMLElement|null, options?: TimerOptions) => TimerInstance} timer
 *   A countdown timer; with no selector it is headless
 * @property {(options?: AlarmOptions) => AlarmInstance} alarm - The page's alarm manager (a singleton)
 * @property {(selector: string|HTMLElement, options?: AutocompleteOptions) => AutocompleteInstance} autocomplete - Suggestions under a text input
 * @property {(selector: string|HTMLElement, options?: PillboxOptions) => PillboxInstance} pillbox - Multi-value pill input
 * @property {(selector: string|HTMLElement, options?: DatePickerOptions) => DatePickerInstance} datePicker
 *   A themed calendar attached to an input, writing ISO `YYYY-MM-DD`
 * @property {(selector: string|HTMLElement, options: ChooserOptions) => ChooserInstance} chooser
 *   Visual option-picker - card or chip variants, single or multi-select, with rich per-option metadata
 *   (icon, description, tooltip, badge, recommended, disabled)
 * @property {{
 *   (selector: string|HTMLElement, options?: import('./context-menu.js').ContextMenuOptions): import('./context-menu.js').ContextMenuInstance,
 *   closeAll(): void,
 *   active(): import('./context-menu.js').ContextMenuInstance|null,
 *   registry(forElement?: HTMLElement|null): import('./context-menu.js').ContextMenuInstance[]
 * }} contextMenu
 *   Bind a right-click menu to a container and, by delegation, its children. Menus nest: an inner menu
 *   shadows its parent for the region it covers, and by default appends the parent's items beneath its own.
 *   `closeAll()` closes the open one, `active()` returns it, `registry(el?)` lists bound menus (for an
 *   element, its resolution chain, innermost first).
 * @property {(selector: string|HTMLElement, options?: import('./sortable.js').SortableOptions) => import('./sortable.js').SortableInstance} sortable
 *   Drag-to-reorder for a container's children, by pointer, touch and keyboard
 * @property {import('./skeleton.js').SkeletonStatic} skeleton
 *   Shimmering placeholders shaped like the content on its way; `.while(target, promise, opts)`, `.get`,
 *   `.remove`, `.scan`, `.markup`
 * @property {import('./avatar.js').AvatarStatic} avatar - A picture, initials or icon; `.scan()` for data-avatar
 * @property {import('./avatar.js').AvatarGroupStatic} avatarGroup - Overlapping avatars with "+N"
 * @property {(selector: string|HTMLElement, options?: import('./input-group.js').InputGroupOptions) => import('./input-group.js').InputGroupInstance} inputGroup
 *   Join an icon or short text (and reveal / clear / stepper / counter extras) to an input already on the page
 * @property {{
 *   (trigger: string|HTMLElement|ArrayLike<HTMLElement>, options?: import('./popover.js').PopoverOptions): import('./popover.js').PopoverInstance,
 *   scan(root?: string|Element|Document): import('./popover.js').PopoverInstance[],
 *   closeAll(group?: string|null): void,
 *   getInstance(trigger: string|HTMLElement): import('./popover.js').PopoverInstance|null,
 *   open(): import('./popover.js').PopoverInstance[]
 * }} popover
 *   Anchor a rich panel (title, text/DOM content, close button) to a trigger, opened by click, hover, focus
 *   or code. `scan(root)` reads `data-popover` markup, `closeAll(group?)`, `getInstance(trigger)`, `open()`
 *   lists the open ones.
 * @property {(selector: string|HTMLElement, options?: import('./treeview.js').TreeViewOptions) => import('./treeview.js').TreeViewInstance} treeView
 *   A tree of expandable nodes
 * @property {{
 *   (options: SlideoverCreateOptions): SlideoverInstance,
 *   (selector: string|HTMLElement, options?: SlideoverOptions): SlideoverInstance
 * }} slideover
 *   A panel sliding in from an edge: on an element, or - given only an options object - a new one
 *   (`Slideover.create()`)
 * @property {(selector: string|HTMLElement, options?: ProgressionOptions) => ProgressionInstance} progression
 *   A timeline or roadmap
 * @property {{
 *   (selector: string|HTMLElement, options?: ListGroupOptions): (ListGroupInstance & {all(): ListGroup[]})|null,
 *   all(selector: string|HTMLElement, options?: ListGroupOptions): ListGroup[]
 * }} listGroup
 *   A list group on every match; returns the first (with `all()` for the rest). `E.listGroup.all()`
 *   returns them as an array. A selector that matches nothing returns null.
 * @property {import('./components/toast.js').ToastStatic} toast
 *   Toast notifications: `E.toast(message, options)` plus `.show/.success/.error/.warning/.info/.closeAll`
 * @property {{
 *   alert(message: string|DialogOptions, options?: DialogOptions): Promise<undefined|false>,
 *   confirm(message: string|DialogOptions, options?: DialogOptions): Promise<boolean>,
 *   prompt(message: string|DialogOptions, options?: DialogOptions): Promise<string|null>
 * }} dialog
 *   Promise-based alert, confirm and prompt dialogs
 * @property {(message: string|DialogOptions, options?: DialogOptions) => Promise<undefined|false>} alert
 *   An alert dialog; resolves undefined on OK, false when dismissed
 * @property {(message: string|DialogOptions, options?: DialogOptions) => Promise<boolean>} confirm
 *   A confirm dialog; true if confirmed
 * @property {(message: string|DialogOptions, options?: DialogOptions) => Promise<string|null>} prompt
 *   A prompt dialog; the input value, or null if cancelled
 * @property {(options?: import('./components/modal.js').ModalOptions) => import('./components/modal.js').ModalInstance} createModal
 *   A new modal in the shared dialog container
 * @property {(options?: import('./components/modal.js').ModalOptions) => Promise<string|null>} showModal
 *   Open a new modal and resolve with the button pressed (null when dismissed)
 * @property {(selector: string|HTMLElement, options?: SignatureOptions) => SignatureInstance} signature - Create a Signature capture pad
 * @property {import('./components/focus-trap.js').FocusTrapFactory} focusTrap
 *   Keep Tab and focus inside containers while active (null when nothing matched); `.tabbables()`, `.top()`
 * @property {import('./components/command-palette.js').CommandPaletteFactory} commandPalette
 *   A Cmd/Ctrl+K command palette (builds its own overlay); `.formatShortcut`, `.fuzzyMatch`, `.claims`
 * @property {(selector: import('./components/shared.js').ComponentTarget, options?: import('./components/split-pane.js').SplitPaneOptions) => import('./components/split-pane.js').SplitPaneInstance|null} splitPane
 *   Resizable panes from a container's children; null when nothing matches
 * @property {<T = any>(selector: import('./components/shared.js').ComponentTarget, options?: import('./components/virtual-list.js').VirtualListOptions<T>) => import('./components/virtual-list.js').VirtualListInstance<T>|null} virtualList
 *   A scrolling list that renders only the visible rows; null when nothing matches
 * @property {(target: import('./components/shared.js').ComponentTarget, options?: import('./components/dropzone.js').DropzoneOptions) => import('./components/dropzone.js').DropzoneInstance|null} dropzone
 *   A file drop / browse / paste area over a real file input; null when the target matches nothing
 * @property {(target: import('./components/shared.js').ComponentTarget, options?: import('./components/range-slider.js').RangeSliderOptions) => import('./components/range-slider.js').RangeSliderInstance|null} rangeSlider
 *   A one- or two-thumb slider over real range inputs; null when the target matches nothing
 * @property {(target: import('./components/shared.js').ComponentTarget, options?: import('./components/range-slider.js').RangeSliderOptions) => import('./components/range-slider.js').RangeSliderInstance|null} slider
 *   Alias of rangeSlider()
 * @property {<T = import('./component.js').ComponentInstance>(selector: string|Element|null|undefined, name?: string) => T|undefined} get
 *   The component on an element - including ones made by a factory (`E.slideover({...})`) or another
 *   component. `name` is the componentName ('slideover', 'popover', ...) when an element hosts several.
 * @property {(selector: string|Element|null|undefined, name?: string) => void} destroy - Destroy the component on an element
 * @property {() => void} destroyAll - Destroy every component made through this object
 * @property {(name: string, ComponentClass: new (selector: any, options?: any) => any) => void} register
 *   Register a custom component class for create()
 * @property {(name: string, selector: string|HTMLElement, options?: Record<string, any>) => import('./component.js').ComponentInstance} create
 *   Create a registered custom component (throws for an unknown name)
 */
/** @type {Elements} */
export const elements: Elements;
export type AnimationType = "fade" | "slide" | "zoom" | "none";
export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type DropdownPosition = "bottom-start" | "bottom-end" | "top-start" | "top-end" | "left-start" | "left-end" | "right-start" | "right-end";
export type ToastPosition = "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
export type ToastType = "default" | "success" | "error" | "warning" | "info";
export type BadgeVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
export type BadgeSize = "small" | "medium" | "large";
export type ShadowSize = "none" | "small" | "medium" | "large";
export type BackToTopPosition = "bottom-right" | "bottom-left";
/**
 * Fired when the active tab changes (onChange option / `.on('change')`).
 */
export type TabChangeEvent = {
    /**
     * - The new active index
     */
    index: number;
    /**
     * - The previous active index
     */
    oldIndex: number;
    /**
     * - The new active tab
     */
    tab: HTMLElement;
    /**
     * - Its panel
     */
    panel: HTMLElement;
};
export type TabsOptions = {
    /**
     * - Initially active tab index
     */
    active?: number;
    /**
     * - Panel animation
     */
    animation?: "fade" | "none";
    /**
     * - Animation duration in ms
     */
    animationDuration?: number;
    /**
     * - Selector for tab items
     */
    tabSelector?: string;
    /**
     * - Selector for tab panels
     */
    panelSelector?: string;
    /**
     * - CSS class for the active tab
     */
    activeClass?: string;
    /**
     * - Called when the active tab changes
     */
    onChange?: ((event: TabChangeEvent) => void) | null;
};
/**
 * Tabs: tab items paired by index with panels, with ARIA roles set up.
 */
export type TabsInstance = Tabs;
/**
 * Fired when a panel opens or closes through toggle() (onChange option / `.on('change')`).
 */
export type AccordionChangeEvent = {
    index: number;
    /**
     * - Whether the panel is now open
     */
    isOpen: boolean;
    header: HTMLElement;
    content: HTMLElement;
};
export type AccordionOptions = {
    /**
     * - Allow several panels open at once
     */
    allowMultiple?: boolean;
    /**
     * - Alias of allowMultiple (wins when set)
     */
    multiExpand?: boolean | null;
    /**
     * - Initially open panel index(es); null keeps the markup's active class
     */
    activeIndex?: number | number[] | null;
    /**
     * - Animate the height
     */
    animation?: boolean;
    /**
     * - Animation duration in ms
     */
    animationDuration?: number;
    /**
     * - Selector for headers
     */
    headerSelector?: string;
    /**
     * - Selector for panels (outermost matches only)
     */
    contentSelector?: string;
    /**
     * - Class put on the open item (the header's parent)
     */
    activeClass?: string;
    /**
     * - Called when toggle() opens or closes a panel
     */
    onChange?: ((event: AccordionChangeEvent) => void) | null;
};
export type AccordionInstance = Accordion;
export type ListGroupVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info";
export type ListGroupOptions = {
    /**
     * - Items can be selected (role="listbox")
     */
    selectable?: boolean;
    /**
     * - Allow several selected items at once
     */
    multiSelect?: boolean;
    /**
     * - Class on selected items
     */
    activeClass?: string;
    /**
     * - Class marking disabled items
     */
    disabledClass?: string;
    /**
     * - Selector for the items
     */
    itemSelector?: string;
    /**
     * - Arrow keys, Home/End, Enter/Space
     */
    keyboard?: boolean;
    /**
     * - Keyboard navigation wraps from last to first
     */
    loop?: boolean;
    /**
     * - Focus the first enabled item on init
     */
    focusOnInit?: boolean;
    /**
     * - Selection changed; the selected items
     */
    onChange?: ((selected: HTMLElement[], event: Event | null) => void) | null;
    /**
     * - An item was selected
     */
    onSelect?: ((item: HTMLElement, index: number, event: Event | null) => void) | null;
    /**
     * - An item was deselected
     */
    onDeselect?: ((item: HTMLElement, index: number, event: Event | null) => void) | null;
};
/**
 * A list group. `E.listGroup()` returns the first instance; `all()` (non-enumerable) lists every
 * instance the selector made.
 */
export type ListGroupInstance = ListGroup & {
    all(): ListGroup[];
};
/**
 * A menu item. A plain string is an item whose label and value are the string.
 */
export type DropdownItem = {
    /**
     * - Display text
     */
    label?: string;
    /**
     * - Alternative to label
     */
    text?: string;
    /**
     * - Alternative to label
     */
    name?: string;
    /**
     * - Value when selected (default: the item's index)
     */
    value?: any;
    /**
     * - Icon HTML
     */
    icon?: string;
    /**
     * - Shown greyed, not selectable
     */
    disabled?: boolean;
    /**
     * - Render as a divider
     */
    divider?: boolean;
    /**
     * - Render as a header with this text
     */
    header?: string;
};
/**
 * Passed to onSelect / `.on('select')`.
 */
export type DropdownSelectEvent = {
    item: DropdownItem | string;
    index: number;
    value: any;
};
export type DropdownOptions = {
    /**
     * - 'hover' also opens on click (touch has no hover)
     */
    trigger?: "click" | "hover";
    /**
     * - Preferred menu position - flipped or clamped if it would open off screen
     */
    position?: DropdownPosition;
    /**
     * - Position offset [x, y]
     */
    offset?: [number, number];
    /**
     * - Flip to the opposite side and clamp to the viewport rather than open off screen
     */
    flip?: boolean;
    /**
     * - Fade the menu
     */
    animation?: boolean;
    /**
     * - Animation duration in ms
     */
    animationDuration?: number;
    /**
     * - ms before a hover opens the menu
     */
    hoverOpenDelay?: number;
    /**
     * - ms of grace before a hover menu closes once the pointer has left trigger, menu and the gap between
     */
    hoverCloseDelay?: number;
    /**
     * - Close after an item is chosen
     */
    closeOnSelect?: boolean;
    /**
     * - Close on a click outside
     */
    closeOnClickOutside?: boolean;
    /**
     * - Close on Esc and restore focus to the trigger
     */
    closeOnEscape?: boolean;
    /**
     * - Opening this dropdown closes any other open one
     */
    closeOthers?: boolean;
    /**
     * - Menu items
     */
    items?: (DropdownItem | string)[];
    /**
     * - A Domma Model holding the items array (with modelKey)
     */
    model?: any;
    /**
     * - Model key for the items array
     */
    modelKey?: string | null;
    /**
     * - Model key the selected value is written to (default `<modelKey>_selected`)
     */
    selectedKey?: string;
    /**
     * - Item HTML for object items
     */
    itemTemplate?: ((item: DropdownItem, index: number) => string) | null;
    /**
     * - Return false to keep it closed
     */
    onBeforeOpen?: ((dropdown: DropdownInstance) => boolean | void) | null;
    /**
     * - Menu opened
     */
    onOpen?: ((dropdown: DropdownInstance) => void) | null;
    /**
     * - Return false to keep it open
     */
    onBeforeClose?: ((dropdown: DropdownInstance) => boolean | void) | null;
    /**
     * - Menu closed
     */
    onClose?: ((dropdown: DropdownInstance) => void) | null;
    /**
     * - An item was chosen
     */
    onSelect?: ((event: DropdownSelectEvent, dropdown: DropdownInstance) => void) | null;
};
export type DropdownInstance = Dropdown;
export type DesktopNotificationOptions = {
    /**
     * - Notification title
     */
    title?: string;
    /**
     * - Body text
     */
    body?: string;
    /**
     * - Icon URL
     */
    icon?: string | null;
    /**
     * - Badge URL
     */
    badge?: string | null;
    /**
     * - Tag: a new notification with the same tag replaces the old one
     */
    tag?: string | null;
    /**
     * - Stay until the user dismisses it
     */
    requireInteraction?: boolean;
    /**
     * - No sound or vibration
     */
    silent?: boolean;
    /**
     * - Data kept on the native notification
     */
    data?: any;
    /**
     * - Notification clicked
     */
    onClick?: ((event: Event, notification: DesktopNotification) => void) | null;
    /**
     * - Notification closed
     */
    onClose?: ((event: Event, notification: DesktopNotification) => void) | null;
    /**
     * - Unsupported, permission denied, or the native notification failed
     */
    onError?: ((error: Error | Event, notification?: DesktopNotification) => void) | null;
    /**
     * - Notification shown
     */
    onShow?: ((event: Event, notification: DesktopNotification) => void) | null;
};
export type TimerOptions = {
    /**
     * - Countdown length in ms
     */
    duration?: number;
    /**
     * - Start at once
     */
    autoStart?: boolean;
    /**
     * - Display format (case-insensitive)
     */
    format?: "hh:mm:ss" | "mm:ss" | "ss" | string;
    /**
     * - Show start/pause/reset buttons
     */
    showControls?: boolean;
    /**
     * - Tick interval in ms
     */
    updateInterval?: number;
    /**
     * - Desktop notification on completion
     */
    notification?: boolean;
    /**
     * - Options for that notification
     */
    notificationOptions?: DesktopNotificationOptions;
    /**
     * - Play soundUrl on completion
     */
    sound?: boolean;
    /**
     * - Sound to play
     */
    soundUrl?: string | null;
    /**
     * - Every tick, with the ms remaining
     */
    onTick?: ((remaining: number) => void) | null;
    /**
     * - Reached zero
     */
    onComplete?: (() => void) | null;
    /**
     * - Started
     */
    onStart?: (() => void) | null;
    /**
     * - Paused
     */
    onPause?: (() => void) | null;
    /**
     * - Reset
     */
    onReset?: (() => void) | null;
};
export type TimerInstance = Timer;
/**
 * One alarm. add() fills in the defaults and the id.
 */
export type AlarmItem = {
    /**
     * - Assigned by add() ('alarm-<n>')
     */
    id?: string;
    /**
     * - Time of day, 'HH:MM'
     */
    time: string;
    /**
     * - Shown in the notification
     */
    label?: string;
    enabled?: boolean;
    /**
     * - null = once; an array of day names ('monday', ...)
     */
    repeat?: null | "daily" | "weekdays" | "weekends" | string[];
    /**
     * - Desktop notification when it goes off
     */
    notification?: boolean;
    /**
     * - Options for that notification
     */
    notificationOptions?: DesktopNotificationOptions;
    /**
     * - Play soundUrl
     */
    sound?: boolean;
    soundUrl?: string | null;
    /**
     * - Timestamp (ms) it last went off
     */
    lastTriggered?: number | null;
    /**
     * - Timestamp (ms) a snooze ends
     */
    snoozedUntil?: number | null;
    /**
     * - Set on the copy getNextAlarm() returns
     */
    nextTrigger?: Date;
};
export type AlarmOptions = {
    /**
     * - Initial alarms, used when storage holds none
     */
    alarms?: AlarmItem[];
    /**
     * - Not read: times are local
     */
    timezone?: string;
    /**
     * - How often alarms are checked, in ms
     */
    checkInterval?: number;
    /**
     * - localStorage key
     */
    storageKey?: string;
    /**
     * - An alarm went off
     */
    onTrigger?: ((alarm: AlarmItem) => void) | null;
    /**
     * - An alarm was snoozed
     */
    onSnooze?: ((alarm: AlarmItem, duration: number) => void) | null;
    /**
     * - Not called by the current code
     */
    onDismiss?: (() => void) | null;
    /**
     * - add() added one
     */
    onAlarmAdd?: ((alarm: AlarmItem) => void) | null;
    /**
     * - removeAlarm() removed one
     */
    onAlarmRemove?: ((alarm: AlarmItem) => void) | null;
};
export type AlarmInstance = Alarm;
/**
 * Passed to onChange / `.on('change')`.
 */
export type CarouselChangeEvent = {
    index: number;
    oldIndex: number;
    slide: HTMLElement;
};
export type CarouselOptions = {
    /**
     * - Advance on a timer
     */
    autoplay?: boolean;
    /**
     * - Autoplay interval in ms
     */
    interval?: number;
    /**
     * - Pause autoplay on hover
     */
    pauseOnHover?: boolean;
    /**
     * - Wrap from the last slide to the first
     */
    loop?: boolean;
    /**
     * - 'slide' (track translate), 'fade' (clean swap), or 'crossfade' (overlapping opacity)
     */
    animation?: "slide" | "fade" | "crossfade";
    /**
     * - Animation duration in ms
     */
    animationDuration?: number;
    /**
     * - Any CSS timing function ('ease', 'linear', 'ease-in-out', 'cubic-bezier(...)' etc.)
     */
    animationEasing?: string;
    /**
     * - Image carousels: 'crop' = the shortest image, 'average' = halfway between shortest and tallest
     */
    heightMode?: "crop" | "average";
    /**
     * - Fixed viewport height in px
     */
    height?: number | null;
    /**
     * - Previous / next arrows
     */
    showArrows?: boolean;
    /**
     * - Indicator dots
     */
    showIndicators?: boolean;
    /**
     * - Selector for slides
     */
    slideSelector?: string;
    /**
     * - Class on the active slide
     */
    activeClass?: string;
    /**
     * - The slide changed
     */
    onChange?: ((event: CarouselChangeEvent) => void) | null;
};
export type CarouselInstance = Carousel;
/**
 * A cookie category in the customise panel.
 */
export type CookieCategory = {
    label: string;
    description?: string;
    /**
     * - Always on; cannot be switched off
     */
    required?: boolean;
};
export type CookieConsentState = "accepted" | "rejected" | "customized" | "undecided";
export type CookieConsentOptions = {
    /**
     * - Banner text
     */
    message?: string;
    acceptAllText?: string;
    rejectAllText?: string;
    customizeText?: string;
    savePreferencesText?: string;
    privacyPolicyText?: string;
    privacyPolicyUrl?: string | null;
    cookiePolicyText?: string;
    cookiePolicyUrl?: string | null;
    /**
     * - Default: necessary, functional, analytics, marketing
     */
    categories?: Record<string, CookieCategory>;
    position?: "bottom" | "top" | "bottom-left" | "bottom-right" | "center-modal";
    /**
     * - 'auto' follows the system
     */
    theme?: "light" | "dark" | "auto";
    layout?: "bar" | "box" | "modal";
    animation?: boolean;
    /**
     * - Backdrop behind the modal layout
     */
    backdrop?: boolean;
    /**
     * - Show on a first visit
     */
    autoShow?: boolean;
    /**
     * - Hide once a choice is made
     */
    hideAfterAction?: boolean;
    /**
     * - Elements that reopen the banner
     */
    reopenSelector?: string;
    storageKey?: string;
    /**
     * - Days the choice is remembered
     */
    storageDuration?: number;
    defaultState?: CookieConsentState;
    /**
     * - GDPR mode: optional categories start off
     */
    requireExplicitConsent?: boolean;
    /**
     * - Bump when the policy changes to ask again
     */
    consentVersion?: string;
    /**
     * - The stored choice was for another version
     */
    onVersionMismatch?: ((oldVersion: string, newVersion: string) => void) | null;
    /**
     * - Accept all, or saved custom preferences
     */
    onAccept?: ((preferences: Record<string, boolean>) => void) | null;
    onReject?: (() => void) | null;
    /**
     * - The customise panel opened
     */
    onCustomize?: ((preferences: Record<string, boolean>) => void) | null;
    onChange?: ((state: CookieConsentState, preferences: Record<string, boolean>) => void) | null;
    onShow?: (() => void) | null;
    onHide?: (() => void) | null;
};
export type CookieConsentInstance = CookieConsent;
/**
 * Options for E.alert / E.confirm / E.prompt (and E.dialog.*).
 */
export type DialogOptions = {
    /**
     * - Heading (basic HTML, sanitised)
     */
    title?: string;
    /**
     * - Message (basic HTML, sanitised); the first argument wins
     */
    message?: string;
    /**
     * - Confirm button label
     */
    confirmText?: string;
    /**
     * - Cancel button label (confirm and prompt)
     */
    cancelText?: string;
    /**
     * - Prompt: input placeholder
     */
    inputPlaceholder?: string;
    /**
     * - Prompt: initial value
     */
    inputValue?: string;
    /**
     * - Prompt: input type
     */
    inputType?: string;
    animation?: boolean;
    backdrop?: boolean;
    /**
     * - A backdrop click cancels
     */
    backdropClose?: boolean;
    /**
     * - Esc cancels, Enter confirms
     */
    keyboard?: boolean;
    /**
     * - Danger-styled confirm; focus starts on Cancel
     */
    danger?: boolean;
    /**
     * - Tab stays in the dialog
     */
    trapFocus?: boolean;
    /**
     * - Answering puts focus back where it was
     */
    returnFocus?: boolean;
    /**
     * - Extra class on the dialog
     */
    className?: string;
};
export type ButtonGroupOptions = {
    /**
     * - 'single' behaves like radios, 'multiple' like checkboxes
     */
    mode?: "single" | "multiple";
    /**
     * - Class on active buttons
     */
    activeClass?: string;
    /**
     * - Single mode: clicking the active button deselects it
     */
    allowEmpty?: boolean;
    /**
     * - Selection changed (index -1 from selectAll/deselectAll)
     */
    onChange?: ((value: number | number[] | null, index: number, button: HTMLElement | null) => void) | null;
};
/**
 * A button group. `E.buttonGroup()` returns the first instance; `all()` (non-enumerable) lists every
 * instance the selector made.
 */
export type ButtonGroupInstance = ButtonGroup & {
    all(): ButtonGroup[];
};
/**
 * A breadcrumb. A plain string is a crumb with that text and no link.
 */
export type BreadcrumbItem = {
    /**
     * - Label (HTML)
     */
    text: string;
    /**
     * - Link (default '#'); the last item is never a link
     */
    url?: string;
    /**
     * - Render as the current page
     */
    active?: boolean;
};
export type BreadcrumbsOptions = {
    items?: (BreadcrumbItem | string)[];
    /**
     * - A preset, or custom HTML
     */
    separator?: "/" | ">" | "\u2192" | "chevron" | string;
    /**
     * - Home icon on the first item
     */
    homeIcon?: boolean;
    /**
     * - Collapse on small screens
     */
    responsive?: boolean;
    /**
     * - A crumb link was clicked (setting it prevents navigation)
     */
    onChange?: ((item: BreadcrumbItem | string, index: number, event: MouseEvent) => void) | null;
};
export type BreadcrumbsInstance = Breadcrumbs;
/**
 * A navbar link; `items` makes it a dropdown (nested `items` make flyouts).
 */
export type NavbarItem = {
    /**
     * - Label
     */
    text?: string;
    /**
     * - Link
     */
    url?: string;
    /**
     * - Domma icon name
     */
    icon?: string;
    /**
     * - Highlighted as the current page
     */
    active?: boolean;
    /**
     * - Opens in a new tab
     */
    external?: boolean;
    /**
     * - Inside a dropdown: a divider
     */
    divider?: boolean;
    /**
     * - Dropdown entries
     */
    items?: NavbarItem[];
};
export type NavbarBrand = {
    text?: string;
    /**
     * - Logo image URL
     */
    logo?: string;
    /**
     * - Brand link
     */
    url?: string;
    /**
     * - Brand markup instead of text/logo
     */
    html?: string;
};
export type NavbarAction = {
    text?: string;
    url?: string;
    /**
     * - Domma icon name
     */
    icon?: string;
    /**
     * - Button variant ('primary', 'outline', ...)
     */
    variant?: string;
};
export type NavbarOptions = {
    brand?: NavbarBrand | null;
    items?: NavbarItem[];
    position?: "static" | "fixed" | "sticky";
    variant?: "light" | "dark" | "transparent" | string;
    /**
     * - Hamburger menu on small screens
     */
    collapsible?: boolean;
    /**
     * - Below this width (px) the bar is collapsed
     */
    collapseAt?: number;
    /**
     * - Desktop: open dropdowns/flyouts on hover (click still works)
     */
    appearOnHover?: boolean;
    /**
     * - ms of grace when the pointer leaves the bar
     */
    hoverCloseDelay?: number;
    /**
     * - Right-side buttons
     */
    actions?: NavbarAction[];
    /**
     * - A link was clicked (sub-items also get the parent)
     */
    onItemClick?: ((item: NavbarItem, index: number, event: MouseEvent, parent?: NavbarItem) => void) | null;
};
export type NavbarInstance = Navbar;
/**
 * A sidebar entry: a link, a heading, a divider, or (with `items`) an expandable group.
 */
export type SidebarItem = {
    /**
     * - Label (HTML)
     */
    text?: string;
    /**
     * - Link
     */
    url?: string;
    /**
     * - Domma icon name
     */
    icon?: string;
    /**
     * - Section key; setActive(section) highlights it, and clicking it makes it active
     */
    section?: string;
    /**
     * - Badge text
     */
    badge?: string | number;
    /**
     * - Render as a heading with this text
     */
    heading?: string;
    /**
     * - Render as a divider
     */
    divider?: boolean;
    /**
     * - Children (an expandable group)
     */
    items?: SidebarItem[];
};
export type SidebarOptions = {
    position?: "left" | "right";
    /**
     * - Fixed rather than static positioning
     */
    fixed?: boolean;
    width?: string;
    /**
     * - Top offset, e.g. '60px' under a navbar
     */
    top?: string;
    /**
     * - Header; `toggle: false` hides its close button
     */
    header?: {
        title?: string;
        toggle?: boolean;
        icon?: string;
    } | null;
    items?: SidebarItem[];
    footer?: {
        text?: string;
        html?: string;
    } | null;
    /**
     * - 'theme' follows the active theme
     */
    variant?: "light" | "dark" | "theme";
    /**
     * - Toggle on small screens
     */
    collapsible?: boolean;
    /**
     * - Breakpoint in px
     */
    collapseAt?: number;
    /**
     * - Initially active section
     */
    activeSection?: string | null;
    /**
     * - Initially expanded groups (their paths)
     */
    expandedSections?: string[];
    /**
     * - Remember expanded groups in localStorage
     */
    persistExpanded?: boolean;
    /**
     * - Storage key for that
     */
    persistKey?: string | null;
    /**
     * - ms
     */
    animationDuration?: number;
    /**
     * - Push the content aside rather than overlay it
     */
    push?: boolean;
    /**
     * - The content pushed aside
     */
    contentSelector?: string;
    /**
     * - Track the active section while scrolling
     */
    scrollSpy?: boolean;
    /**
     * - IntersectionObserver rootMargin
     */
    scrollSpyOffset?: string;
    /**
     * - IntersectionObserver threshold
     */
    scrollSpyThreshold?: number;
    /**
     * - Floating toggle at the bottom left
     */
    floating?: boolean;
    /**
     * - HTML to show instead of items
     */
    customContent?: string | null;
    /**
     * - Desktop collapse to icons only
     */
    collapsibleDesktop?: boolean;
    /**
     * - Width when collapsed
     */
    collapsedWidth?: string;
    /**
     * - Remember the collapsed state
     */
    persistCollapsed?: boolean;
    /**
     * - Storage key for that
     */
    persistCollapseKey?: string | null;
    /**
     * - A link was clicked; path is its index path ('2.0')
     */
    onItemClick?: ((item: SidebarItem | null, path: string, event: MouseEvent) => void) | null;
    /**
     * - Return false to keep it closed
     */
    onBeforeOpen?: (() => boolean | void) | null;
    /**
     * - Return false to keep it open
     */
    onBeforeClose?: (() => boolean | void) | null;
    /**
     * - Opened or closed
     */
    onToggle?: ((isOpen: boolean) => void) | null;
    /**
     * - A group expanded (no arguments: the desktop sidebar expanded)
     */
    onExpand?: ((item?: SidebarItem, depth?: number) => void) | null;
    /**
     * - A group collapsed (no arguments: the desktop sidebar collapsed)
     */
    onCollapse?: ((item?: SidebarItem, depth?: number) => void) | null;
};
export type SidebarInstance = Sidebar;
export type FooterLink = {
    text?: string;
    url?: string;
    /**
     * - Domma icon name
     */
    icon?: string;
};
export type FooterBrand = {
    text?: string;
    /**
     * - Logo image URL
     */
    logo?: string;
    url?: string;
    description?: string;
};
export type FooterColumn = {
    title?: string;
    links?: FooterLink[];
};
export type FooterSocial = {
    /**
     * - Domma icon name
     */
    icon: string;
    url?: string;
    /**
     * - Accessible name (default: the icon name)
     */
    label?: string;
};
export type FooterOptions = {
    variant?: "light" | "dark" | "transparent" | string;
    layout?: "simple" | "columns" | "minimal";
    brand?: FooterBrand | null;
    /**
     * - For the 'columns' layout
     */
    columns?: FooterColumn[];
    /**
     * - Simple link list
     */
    links?: FooterLink[];
    /**
     * - Social icons
     */
    social?: FooterSocial[];
    /**
     * - Text, or the year for '© <year> All rights reserved'
     */
    copyright?: string | {
        text?: string;
        year?: number;
    } | null;
    /**
     * - Extra classes
     */
    className?: string;
    position?: "static" | "fixed" | "sticky";
};
export type FooterInstance = Footer;
/**
 * A suggestion: a string, or an object shown by `label` and written as `value`.
 */
export type AutocompleteItem = string | {
    label?: string;
    value?: string;
    [key: string]: any;
};
export type AutocompleteOptions = {
    /**
     * - Suggestions to filter
     */
    data?: AutocompleteItem[];
    /**
     * - Fetch suggestions instead of filtering data
     */
    dataSource?: ((query: string) => AutocompleteItem[] | Promise<AutocompleteItem[]>) | null;
    /**
     * - Characters typed before suggesting
     */
    minChars?: number;
    maxResults?: number;
    /**
     * - ms
     */
    debounce?: number;
    /**
     * - Replaces the default contains-match
     */
    filterFn?: ((item: AutocompleteItem, query: string) => boolean) | null;
    /**
     * - Suggestion HTML or a node
     */
    renderItem?: ((item: AutocompleteItem, query: string) => string | Node) | null;
    highlightMatches?: boolean;
    /**
     * - Where the list opens; 'auto' picks the side with room
     */
    position?: "auto" | "above" | "below";
    placeholder?: string;
    emptyMessage?: string;
    loadingMessage?: string;
    caseSensitive?: boolean;
    selectOnEnter?: boolean;
    /**
     * - Empty the input after a choice
     */
    clearOnSelect?: boolean;
    /**
     * - A Domma Model the typed value is written to (with modelKey)
     */
    model?: any;
    modelKey?: string;
    /**
     * - A suggestion was chosen
     */
    onSelect?: ((item: AutocompleteItem, event: {
        target: HTMLElement;
    }) => void) | null;
    /**
     * - The input's value changed
     */
    onChange?: ((value: string, event: Event) => void) | null;
    /**
     * - Return false to keep it closed
     */
    onBeforeOpen?: (() => boolean | void) | null;
    onOpen?: (() => void) | null;
    /**
     * - Return false to keep it open
     */
    onBeforeClose?: (() => boolean | void) | null;
    onClose?: (() => void) | null;
    /**
     * - May return a replacement result list
     */
    onFilter?: ((results: AutocompleteItem[], query: string) => AutocompleteItem[] | void) | null;
};
export type AutocompleteInstance = Autocomplete;
/**
 * An option: a string, or an object shown by `label` and stored as `value`.
 */
export type PillboxItem = string | {
    value: string;
    label?: string;
    disabled?: boolean;
    [key: string]: any;
};
export type PillboxOptions = {
    /**
     * - Options to choose from
     */
    data?: PillboxItem[];
    /**
     * - Initial values
     */
    value?: string[];
    placeholder?: string;
    /**
     * - Filter the options while typing
     */
    searchable?: boolean;
    /**
     * - Enter adds typed text that is not an option
     */
    creatable?: boolean;
    maxItems?: number | null;
    duplicates?: boolean;
    /**
     * - Clear-all button
     */
    clearable?: boolean;
    size?: "small" | "medium" | "large" | string;
    /**
     * - Pill HTML or a node
     */
    renderPill?: ((pill: {
        value: string;
        label: string;
    }) => string | Node) | null;
    /**
     * - Option HTML or a node
     */
    renderOption?: ((item: PillboxItem) => string | Node) | null;
    /**
     * - Pill HTML when there is no renderPill
     */
    pillTemplate?: string;
    /**
     * - true/undefined accepts; a string is the error message
     */
    validatePill?: ((value: string) => boolean | string | void) | null;
    maxItemsMessage?: string;
    duplicateMessage?: string;
    noResultsMessage?: string;
    /**
     * - A Domma Model the values are kept in (with modelKey)
     */
    model?: any;
    modelKey?: string;
    /**
     * - Return false to keep it closed
     */
    onBeforeOpen?: (() => boolean | void) | null;
    onOpen?: (() => void) | null;
    /**
     * - Return false to keep it open
     */
    onBeforeClose?: (() => boolean | void) | null;
    onClose?: (() => void) | null;
    onAdd?: ((value: string, pill: HTMLElement) => void) | null;
    onRemove?: ((value: string, pill: HTMLElement) => void) | null;
    onChange?: ((values: string[]) => void) | null;
    /**
     * - Typed text was added (creatable)
     */
    onCreate?: ((text: string) => void) | null;
    onMaxReached?: (() => void) | null;
    onValidationError?: ((error: string, value: string) => void) | null;
};
export type PillboxInstance = Pillbox;
export type SlideoverSize = "sm" | "md" | "lg" | "xl" | "full";
export type SlideoverOptions = {
    /**
     * - Edge it slides from
     */
    position?: "left" | "right" | "top" | "bottom";
    /**
     * - A preset (sm 25%, md 50%, lg 75%, xl 90%, full), a customSizes key, or a CSS length ('400px', '60%', '30rem')
     */
    size?: SlideoverSize | string;
    backdrop?: boolean;
    /**
     * - A backdrop click closes it
     */
    backdropClose?: boolean;
    /**
     * - Esc closes it (with closeOnEscape)
     */
    keyboard?: boolean;
    animation?: boolean;
    /**
     * - ms
     */
    animationDuration?: number;
    closeOnEscape?: boolean;
    /**
     * - Title (create(): the header text)
     */
    title?: string;
    /**
     * - Body (create(): HTML or an element)
     */
    content?: string | Element;
    /**
     * - Close button in the header (create())
     */
    closable?: boolean;
    /**
     * - Domma icon name for it (create())
     */
    closeIcon?: string;
    headerClass?: string;
    bodyClass?: string;
    footerClass?: string;
    /**
     * - Named sizes, e.g. {wide: '640px'}
     */
    customSizes?: Record<string, string>;
    /**
     * - Tab stays in the panel; default off when backdrop is false unless given
     */
    trapFocus?: boolean;
    /**
     * - Closing puts focus back where it was
     */
    returnFocus?: boolean;
    /**
     * - Return false to keep it closed
     */
    onBeforeOpen?: ((slideover: SlideoverInstance) => boolean | void) | null;
    onOpen?: ((slideover: SlideoverInstance) => void) | null;
    /**
     * - Return false to keep it open
     */
    onBeforeClose?: ((slideover: SlideoverInstance) => boolean | void) | null;
    /**
     * - Closing (before the animation)
     */
    onClose?: ((slideover: SlideoverInstance) => void) | null;
    /**
     * - After the close animation
     */
    onClosed?: ((slideover: SlideoverInstance) => void) | null;
};
/**
 * Options for `E.slideover({...})` / `Slideover.create()`: a new panel at the end of `<body>`.
 */
export type SlideoverCreateOptions = SlideoverOptions & {
    schema?: object;
    data?: Record<string, any>;
    onSave?: (formData: Record<string, any>, form: any, slideover: SlideoverInstance) => void;
};
export type SlideoverInstance = Slideover;
export type ProgressionStatus = "planned" | "in-progress" | "completed" | "blocked" | "cancelled";
/**
 * A timeline event or roadmap milestone.
 */
export type ProgressionItem = {
    /**
     * - Lets methods find it by id instead of index
     */
    id?: string | number;
    title?: string;
    /**
     * - Text (HTML when allowHtml, sanitised)
     */
    description?: string;
    date?: string;
    /**
     * - Timeline marker (default: date)
     */
    year?: string | number;
    /**
     * - Roadmap status
     */
    status?: ProgressionStatus | string;
    /**
     * - 0-100, shown for 'in-progress'
     */
    progress?: number;
    priority?: string;
    tags?: string[];
    assignee?: string;
};
/**
 * The loader settings `E.fullscreenLoader()` passes on (the rest are fixed for a full-screen loader).
 */
export type FullscreenLoaderOptions = Pick<import("./components/loader.js").LoaderOptions, "type" | "size" | "color">;
export type ProgressionOptions = {
    /**
     * - 'timeline' (dated events) or 'roadmap' (items with a status)
     */
    mode?: "timeline" | "roadmap";
    items?: ProgressionItem[];
    /**
     * - Items down one side, across, or alternating either side of a centre line
     */
    layout?: "vertical" | "horizontal" | "centered";
    /**
     * - Items animate in
     */
    animation?: boolean;
    /**
     * - ms between items
     */
    animationDelay?: number;
    responsive?: boolean;
    /**
     * - Look of the markers, line and cards
     */
    theme?: "default" | "minimal" | "corporate" | "modern";
    clickable?: boolean;
    onItemClick?: ((item: ProgressionItem, index: number, element: HTMLElement) => void) | null;
    /**
     * - HTML in descriptions (sanitised)
     */
    allowHtml?: boolean;
    /**
     * - Timeline
     */
    yearWidth?: string;
    /**
     * - Timeline
     */
    contentMaxWidth?: string;
    /**
     * - Timeline
     */
    dateFormat?: string;
    /**
     * - Timeline
     */
    showConnector?: boolean;
    /**
     * - Roadmap: overall progress bar
     */
    showProgress?: boolean;
    /**
     * - Roadmap
     */
    progressPosition?: "top" | "bottom" | "none";
    /**
     * - Roadmap
     */
    statusIcons?: boolean;
    /**
     * - Roadmap: status can be changed from the UI
     */
    allowStatusChange?: boolean;
    onStatusChange?: ((item: ProgressionItem, oldStatus: string | undefined, status: string) => void) | null;
    /**
     * - Roadmap: the current item's id or index
     */
    currentItem?: string | number | null;
    completedAnimation?: boolean;
    /**
     * - Domma icon name per status
     */
    icons?: Partial<Record<ProgressionStatus, string>>;
    /**
     * - CSS colour per status
     */
    colors?: Partial<Record<ProgressionStatus, string>>;
};
export type ProgressionInstance = Progression;
/**
 * A drawn stroke, as onBegin / onEnd receive it.
 */
export type SignatureStroke = {
    points: {
        x: number;
        y: number;
        pressure: number;
    }[];
    colour: string;
    width: number;
};
export type SignatureOptions = {
    /**
     * - Not read: the pad fills its container
     */
    width?: number | null;
    /**
     * - Canvas height in px
     */
    height?: number;
    /**
     * - Default pen colour
     */
    penColour?: string;
    /**
     * - Default pen width in px
     */
    penWidth?: number;
    /**
     * - Export format
     */
    format?: "png" | "svg";
    /**
     * - Toolbar label text
     */
    label?: string;
    /**
     * - Dashed guide line
     */
    guideLine?: boolean;
    placeholder?: string;
    /**
     * - Colour swatches in the toolbar
     */
    colours?: string[];
    /**
     * - Pen widths in the toolbar
     */
    widths?: number[];
    /**
     * - Show the toolbar
     */
    toolbar?: boolean;
    /**
     * - Name of the hidden input
     */
    name?: string;
    disabled?: boolean;
    /**
     * - Draw / Type toggle
     */
    typeFallback?: boolean;
    /**
     * - Points needed to keep a stroke
     */
    minStrokeLength?: number;
    /**
     * - Honour prefers-reduced-motion
     */
    respectMotionPreference?: boolean;
    /**
     * - The signature changed - receives the data URL ('' when empty)
     */
    onChange?: ((base64: string) => void) | null;
    onClear?: (() => void) | null;
    /**
     * - A stroke began
     */
    onBegin?: ((stroke: SignatureStroke) => void) | null;
    /**
     * - A stroke ended
     */
    onEnd?: ((stroke: SignatureStroke) => void) | null;
};
export type SignatureInstance = Signature;
export type DatePickerOptions = {
    /**
     * - Initial date; null reads the input
     */
    value?: string | Date | null;
    /**
     * - What the input shows (YYYY YY MMMM MMM MM M DDDD DDD DD D); the value stays ISO
     */
    format?: string;
    /**
     * - Earliest selectable date
     */
    min?: string | Date | null;
    /**
     * - Latest selectable date
     */
    max?: string | Date | null;
    /**
     * - First day of the week: 0 Sunday, 1 Monday
     */
    firstDay?: number;
    /**
     * - true means unavailable
     */
    disabledDates?: ((date: Date) => boolean) | null;
    openOnFocus?: boolean;
    closeOnSelect?: boolean;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    /**
     * - Clear button
     */
    clearable?: boolean;
    todayButton?: boolean;
    /**
     * - Stop typing; only the calendar sets it
     */
    readonlyInput?: boolean;
    /**
     * - Render in place instead of as a popup
     */
    inline?: boolean;
    /**
     * - Popup position
     */
    position?: DropdownPosition;
    /**
     * - Popup offset [x, y]
     */
    offset?: [number, number];
    /**
     * - ISO week numbers
     */
    weekNumbers?: boolean;
    /**
     * - Default: the format
     */
    placeholder?: string | null;
    /**
     * - ISO value ('' when cleared)
     */
    onChange?: ((value: string, date: Date | null, picker: DatePickerInstance) => void) | null;
    /**
     * - Return false to keep it closed
     */
    onBeforeOpen?: ((picker: DatePickerInstance) => boolean | void) | null;
    onOpen?: ((picker: DatePickerInstance) => void) | null;
    /**
     * - Return false to keep it open
     */
    onBeforeClose?: ((picker: DatePickerInstance) => boolean | void) | null;
    onClose?: ((picker: DatePickerInstance) => void) | null;
};
export type DatePickerInstance = DatePicker;
export type ChooserBadge = {
    text: string;
    type?: "success" | "info" | "warning" | "danger" | "primary";
};
export type ChooserOption = {
    value: string | number;
    label: string;
    /**
     * - Domma icon name
     */
    icon?: string;
    /**
     * - Card variant, comfortable density only
     */
    description?: string;
    tooltip?: string;
    badge?: ChooserBadge;
    recommended?: boolean;
    disabled?: boolean;
};
export type ChooserSemanticColour = "primary" | "success" | "info" | "warning" | "danger";
export type ChooserOptions = {
    /**
     * - The choices
     */
    options: ChooserOption[];
    variant?: "card" | "chip";
    /**
     * - Multi-select
     */
    multiple?: boolean;
    density?: "comfortable" | "compact";
    /**
     * - Grid columns (card variant)
     */
    columns?: number;
    /**
     * - Label rendered above
     */
    label?: string;
    /**
     * - Required indicator
     */
    required?: boolean;
    /**
     * - Hidden-input name for native form submission
     */
    name?: string;
    /**
     * - Initial selection
     */
    value?: string | string[] | null;
    /**
     * - Selected/recommended highlight colour - semantic name or any CSS colour string
     */
    accent?: ChooserSemanticColour | string;
    /**
     * - Visual style of the selected state
     */
    accentStyle?: "border" | "solid" | "glow" | "overlay" | "underline";
    /**
     * - Soft outer glow on the selected option
     */
    glow?: boolean;
    /**
     * - Glow colour override - semantic name or any CSS colour string. Defaults to the accent colour.
     */
    glowColour?: ChooserSemanticColour | string | null;
    /**
     * - Shadow weight applied to every option
     */
    shadow?: "none" | "sm" | "md" | "lg" | "xl";
    /**
     * - Optional shadow tint - any CSS colour string
     */
    shadowColour?: string | null;
    /**
     * - Called with the new value (user changes only, not setValue)
     */
    onChange?: (value: string | string[] | null) => void;
};
/**
 * What `E.chooser()` returns. A missing host gets an inert one (`element` null, methods do nothing).
 */
export type ChooserInstance = {
    readonly element: HTMLElement | null;
    _root: HTMLElement | null;
    getValue(): string | string[] | null;
    setValue(value: string | string[] | null): void;
    disable(): void;
    enable(): void;
    destroy(): void;
};
/**
 * `Domma.elements` / `E` - every UI component factory.
 */
export type Elements = {
    /**
     *   Create a Card component (null when nothing matches)
     */
    card: (selector: import("./components/shared.js").ComponentTarget, options?: import("./components/card.js").CardOptions) => import("./components/card.js").CardInstance | null;
    /**
     *   Create a Modal: on an element (null when nothing matches), or - given only an options object - a new
     *   modal in the shared dialog container
     */
    modal: {
        (selector: string | Element | ArrayLike<Element>, options?: import("./components/modal.js").ModalOptions): import("./components/modal.js").ModalInstance | null;
        (options: import("./components/modal.js").ModalOptions): import("./components/modal.js").ModalInstance;
    };
    /**
     * - Create a Tabs component
     */
    tabs: (selector: string | HTMLElement, options?: TabsOptions) => TabsInstance;
    /**
     * - Create an Accordion component
     */
    accordion: (selector: string | HTMLElement, options?: AccordionOptions) => AccordionInstance;
    /**
     *   A tooltip on every match; returns the first (with `all()` for the rest), or null.
     *   `E.tooltip.all()` returns them as an array.
     */
    tooltip: {
        (selector: import("./components/shared.js").ComponentTarget, options?: import("./components/tooltip.js").TooltipOptions): (import("./components/tooltip.js").TooltipInstance & {
            all(): import("./components/tooltip.js").TooltipInstance[];
        }) | null;
        all(selector: import("./components/shared.js").ComponentTarget, options?: import("./components/tooltip.js").TooltipOptions): import("./components/tooltip.js").TooltipInstance[];
    };
    /**
     *   Create a Badge (null when nothing matches)
     */
    badge: (selector: import("./components/shared.js").ComponentTarget, options?: import("./components/badge.js").BadgeOptions) => import("./components/badge.js").BadgeInstance | null;
    /**
     *   Create a NumberBadge notification counter on an element (null when nothing matches)
     */
    numberBadge: (selector: import("./components/shared.js").ComponentTarget, options?: import("./components/badge.js").NumberBadgeOptions) => import("./components/badge.js").NumberBadgeInstance | null;
    /**
     * - Create a Dropdown component
     */
    dropdown: (selector: string | HTMLElement, options?: DropdownOptions) => DropdownInstance;
    /**
     * - Create a Carousel component
     */
    carousel: (selector: string | HTMLElement, options?: CarouselOptions) => CarouselInstance;
    /**
     * - The page's cookie consent banner (one per page)
     */
    cookieConsent: (options?: CookieConsentOptions) => CookieConsentInstance;
    /**
     *   Create a BackToTop button: a button / link selector is used as the button, anything else adds one
     */
    backToTop: (selector?: string | HTMLElement | null, options?: import("./components/back-to-top.js").BackToTopOptions) => import("./components/back-to-top.js").BackToTopInstance;
    /**
     *   A button group on every match; returns the first (with `all()` for the rest). `E.buttonGroup.all()`
     *   returns them as an array. A selector that matches nothing returns null.
     */
    buttonGroup: {
        (selector: string | HTMLElement, options?: ButtonGroupOptions): (ButtonGroupInstance & {
            all(): ButtonGroup[];
        }) | null;
        all(selector: string | HTMLElement, options?: ButtonGroupOptions): ButtonGroup[];
    };
    /**
     *   Create a Loader on an element (null when nothing matches)
     */
    loader: (selector: import("./components/shared.js").ComponentTarget, options?: import("./components/loader.js").LoaderOptions) => import("./components/loader.js").LoaderInstance | null;
    /**
     *   Show the element's loader, creating it if needed
     */
    showLoader: (selector: import("./components/shared.js").ComponentTarget, options?: import("./components/loader.js").LoaderOptions) => import("./components/loader.js").LoaderInstance | null;
    /**
     *   Hide the element's loader
     */
    hideLoader: (selector: import("./components/shared.js").ComponentTarget) => import("./components/loader.js").LoaderInstance | undefined;
    /**
     *   A full-screen loader (`#dm-loader-fullscreen`), reused on later calls
     */
    fullscreenLoader: (text?: string, options?: FullscreenLoaderOptions) => import("./components/loader.js").LoaderInstance;
    /**
     * - Render breadcrumbs into an element
     */
    breadcrumbs: (selector: string | HTMLElement, options?: BreadcrumbsOptions) => BreadcrumbsInstance;
    /**
     * - Render a navbar into an element
     */
    navbar: (selector: string | HTMLElement, options?: NavbarOptions) => NavbarInstance;
    /**
     * - Render a sidebar into an element
     */
    sidebar: (selector: string | HTMLElement, options?: SidebarOptions) => SidebarInstance;
    /**
     * - Render a footer into an element
     */
    footer: (selector: string | HTMLElement, options?: FooterOptions) => FooterInstance;
    /**
     * - A desktop notification (call show())
     */
    notification: (options?: DesktopNotificationOptions) => DesktopNotification;
    /**
     *   Show a desktop notification now: notify(title, options) or notify({title, ...})
     */
    notify: (title: string | DesktopNotificationOptions, options?: DesktopNotificationOptions) => DesktopNotification;
    /**
     *   A countdown timer; with no selector it is headless
     */
    timer: (selector?: string | HTMLElement | null, options?: TimerOptions) => TimerInstance;
    /**
     * - The page's alarm manager (a singleton)
     */
    alarm: (options?: AlarmOptions) => AlarmInstance;
    /**
     * - Suggestions under a text input
     */
    autocomplete: (selector: string | HTMLElement, options?: AutocompleteOptions) => AutocompleteInstance;
    /**
     * - Multi-value pill input
     */
    pillbox: (selector: string | HTMLElement, options?: PillboxOptions) => PillboxInstance;
    /**
     *   A themed calendar attached to an input, writing ISO `YYYY-MM-DD`
     */
    datePicker: (selector: string | HTMLElement, options?: DatePickerOptions) => DatePickerInstance;
    /**
     *   Visual option-picker - card or chip variants, single or multi-select, with rich per-option metadata
     *   (icon, description, tooltip, badge, recommended, disabled)
     */
    chooser: (selector: string | HTMLElement, options: ChooserOptions) => ChooserInstance;
    /**
     *   Bind a right-click menu to a container and, by delegation, its children. Menus nest: an inner menu
     *   shadows its parent for the region it covers, and by default appends the parent's items beneath its own.
     *   `closeAll()` closes the open one, `active()` returns it, `registry(el?)` lists bound menus (for an
     *   element, its resolution chain, innermost first).
     */
    contextMenu: {
        (selector: string | HTMLElement, options?: import("./context-menu.js").ContextMenuOptions): import("./context-menu.js").ContextMenuInstance;
        closeAll(): void;
        active(): import("./context-menu.js").ContextMenuInstance | null;
        registry(forElement?: HTMLElement | null): import("./context-menu.js").ContextMenuInstance[];
    };
    /**
     *   Drag-to-reorder for a container's children, by pointer, touch and keyboard
     */
    sortable: (selector: string | HTMLElement, options?: import("./sortable.js").SortableOptions) => import("./sortable.js").SortableInstance;
    /**
     *   Shimmering placeholders shaped like the content on its way; `.while(target, promise, opts)`, `.get`,
     *   `.remove`, `.scan`, `.markup`
     */
    skeleton: import("./skeleton.js").SkeletonStatic;
    /**
     * - A picture, initials or icon; `.scan()` for data-avatar
     */
    avatar: import("./avatar.js").AvatarStatic;
    /**
     * - Overlapping avatars with "+N"
     */
    avatarGroup: import("./avatar.js").AvatarGroupStatic;
    /**
     *   Join an icon or short text (and reveal / clear / stepper / counter extras) to an input already on the page
     */
    inputGroup: (selector: string | HTMLElement, options?: import("./input-group.js").InputGroupOptions) => import("./input-group.js").InputGroupInstance;
    /**
     *   Anchor a rich panel (title, text/DOM content, close button) to a trigger, opened by click, hover, focus
     *   or code. `scan(root)` reads `data-popover` markup, `closeAll(group?)`, `getInstance(trigger)`, `open()`
     *   lists the open ones.
     */
    popover: {
        (trigger: string | HTMLElement | ArrayLike<HTMLElement>, options?: import("./popover.js").PopoverOptions): import("./popover.js").PopoverInstance;
        scan(root?: string | Element | Document): import("./popover.js").PopoverInstance[];
        closeAll(group?: string | null): void;
        getInstance(trigger: string | HTMLElement): import("./popover.js").PopoverInstance | null;
        open(): import("./popover.js").PopoverInstance[];
    };
    /**
     *   A tree of expandable nodes
     */
    treeView: (selector: string | HTMLElement, options?: import("./treeview.js").TreeViewOptions) => import("./treeview.js").TreeViewInstance;
    /**
     *   A panel sliding in from an edge: on an element, or - given only an options object - a new one
     *   (`Slideover.create()`)
     */
    slideover: {
        (options: SlideoverCreateOptions): SlideoverInstance;
        (selector: string | HTMLElement, options?: SlideoverOptions): SlideoverInstance;
    };
    /**
     *   A timeline or roadmap
     */
    progression: (selector: string | HTMLElement, options?: ProgressionOptions) => ProgressionInstance;
    /**
     *   A list group on every match; returns the first (with `all()` for the rest). `E.listGroup.all()`
     *   returns them as an array. A selector that matches nothing returns null.
     */
    listGroup: {
        (selector: string | HTMLElement, options?: ListGroupOptions): (ListGroupInstance & {
            all(): ListGroup[];
        }) | null;
        all(selector: string | HTMLElement, options?: ListGroupOptions): ListGroup[];
    };
    /**
     *   Toast notifications: `E.toast(message, options)` plus `.show/.success/.error/.warning/.info/.closeAll`
     */
    toast: import("./components/toast.js").ToastStatic;
    /**
     *   Promise-based alert, confirm and prompt dialogs
     */
    dialog: {
        alert(message: string | DialogOptions, options?: DialogOptions): Promise<undefined | false>;
        confirm(message: string | DialogOptions, options?: DialogOptions): Promise<boolean>;
        prompt(message: string | DialogOptions, options?: DialogOptions): Promise<string | null>;
    };
    /**
     *   An alert dialog; resolves undefined on OK, false when dismissed
     */
    alert: (message: string | DialogOptions, options?: DialogOptions) => Promise<undefined | false>;
    /**
     *   A confirm dialog; true if confirmed
     */
    confirm: (message: string | DialogOptions, options?: DialogOptions) => Promise<boolean>;
    /**
     *   A prompt dialog; the input value, or null if cancelled
     */
    prompt: (message: string | DialogOptions, options?: DialogOptions) => Promise<string | null>;
    /**
     *   A new modal in the shared dialog container
     */
    createModal: (options?: import("./components/modal.js").ModalOptions) => import("./components/modal.js").ModalInstance;
    /**
     *   Open a new modal and resolve with the button pressed (null when dismissed)
     */
    showModal: (options?: import("./components/modal.js").ModalOptions) => Promise<string | null>;
    /**
     * - Create a Signature capture pad
     */
    signature: (selector: string | HTMLElement, options?: SignatureOptions) => SignatureInstance;
    /**
     *   Keep Tab and focus inside containers while active (null when nothing matched); `.tabbables()`, `.top()`
     */
    focusTrap: import("./components/focus-trap.js").FocusTrapFactory;
    /**
     *   A Cmd/Ctrl+K command palette (builds its own overlay); `.formatShortcut`, `.fuzzyMatch`, `.claims`
     */
    commandPalette: import("./components/command-palette.js").CommandPaletteFactory;
    /**
     *   Resizable panes from a container's children; null when nothing matches
     */
    splitPane: (selector: import("./components/shared.js").ComponentTarget, options?: import("./components/split-pane.js").SplitPaneOptions) => import("./components/split-pane.js").SplitPaneInstance | null;
    /**
     *   A scrolling list that renders only the visible rows; null when nothing matches
     */
    virtualList: <T = any>(selector: import("./components/shared.js").ComponentTarget, options?: import("./components/virtual-list.js").VirtualListOptions<T>) => import("./components/virtual-list.js").VirtualListInstance<T> | null;
    /**
     *   A file drop / browse / paste area over a real file input; null when the target matches nothing
     */
    dropzone: (target: import("./components/shared.js").ComponentTarget, options?: import("./components/dropzone.js").DropzoneOptions) => import("./components/dropzone.js").DropzoneInstance | null;
    /**
     *   A one- or two-thumb slider over real range inputs; null when the target matches nothing
     */
    rangeSlider: (target: import("./components/shared.js").ComponentTarget, options?: import("./components/range-slider.js").RangeSliderOptions) => import("./components/range-slider.js").RangeSliderInstance | null;
    /**
     *   Alias of rangeSlider()
     */
    slider: (target: import("./components/shared.js").ComponentTarget, options?: import("./components/range-slider.js").RangeSliderOptions) => import("./components/range-slider.js").RangeSliderInstance | null;
    /**
     *   The component on an element - including ones made by a factory (`E.slideover({...})`) or another
     *   component. `name` is the componentName ('slideover', 'popover', ...) when an element hosts several.
     */
    get: <T = import("./component.js").ComponentInstance>(selector: string | Element | null | undefined, name?: string) => T | undefined;
    /**
     * - Destroy the component on an element
     */
    destroy: (selector: string | Element | null | undefined, name?: string) => void;
    /**
     * - Destroy every component made through this object
     */
    destroyAll: () => void;
    /**
     *   Register a custom component class for create()
     */
    register: (name: string, ComponentClass: new (selector: any, options?: any) => any) => void;
    /**
     *   Create a registered custom component (throws for an unknown name)
     */
    create: (name: string, selector: string | HTMLElement, options?: Record<string, any>) => import("./component.js").ComponentInstance;
};
/**
 * @typedef {object} DesktopNotificationOptions
 * @property {string} [title='Notification'] - Notification title
 * @property {string} [body=''] - Body text
 * @property {string|null} [icon=null] - Icon URL
 * @property {string|null} [badge=null] - Badge URL
 * @property {string|null} [tag=null] - Tag: a new notification with the same tag replaces the old one
 * @property {boolean} [requireInteraction=false] - Stay until the user dismisses it
 * @property {boolean} [silent=false] - No sound or vibration
 * @property {any} [data=null] - Data kept on the native notification
 * @property {((event: Event, notification: DesktopNotification) => void)|null} [onClick] - Notification clicked
 * @property {((event: Event, notification: DesktopNotification) => void)|null} [onClose] - Notification closed
 * @property {((error: Error|Event, notification?: DesktopNotification) => void)|null} [onError] - Unsupported, permission denied, or the native notification failed
 * @property {((event: Event, notification: DesktopNotification) => void)|null} [onShow] - Notification shown
 */
/**
 * DesktopNotification - Browser native notification wrapper
 * Provides a clean API for desktop notifications with permission handling
 */
export class DesktopNotification {
    static permission: NotificationPermission;
    static isSupported: boolean;
    static _instances: any[];
    static defaults: {
        title: string;
        body: string;
        icon: any;
        badge: any;
        tag: any;
        requireInteraction: boolean;
        silent: boolean;
        data: any;
        onClick: any;
        onClose: any;
        onError: any;
        onShow: any;
    };
    /**
     * Request notification permission
     * @returns {Promise<NotificationPermission>} Permission state: 'granted', 'denied', or 'default'
     */
    static requestPermission(): Promise<NotificationPermission>;
    /**
     * Quick static method to show a notification
     * @param {string} title - Notification title
     * @param {DesktopNotificationOptions} [options] - Notification options
     * @returns {DesktopNotification} The notification (shown asynchronously; onError reports unsupported/denied)
     */
    static notify(title: string, options?: DesktopNotificationOptions): DesktopNotification;
    /**
     * Close all active notifications
     * @returns {void}
     */
    static closeAll(): void;
    /**
     * Constructor
     * @param {DesktopNotificationOptions} [options] - Notification options
     */
    constructor(options?: DesktopNotificationOptions);
    /** The options in force. @type {DesktopNotificationOptions} */
    options: DesktopNotificationOptions;
    /** The native notification once shown. @type {Notification|null} */
    notification: Notification | null;
    _shown: boolean;
    /**
     * Show the notification (asks for permission first when it has not been decided)
     * @returns {Promise<this>} Resolves once shown, or at once when unsupported/denied (onError is called)
     */
    show(): Promise<this>;
    /**
     * Close the notification
     * @returns {this}
     */
    close(): this;
    /**
     * Check if notification is currently shown
     * @returns {boolean}
     */
    isShown(): boolean;
}
import TreeView from './treeview.js';
import ContextMenu from './context-menu.js';
import Sortable from './sortable.js';
import InputGroup from './input-group.js';
import Popover from './popover.js';
import FocusTrap from './components/focus-trap.js';
import CommandPalette from './components/command-palette.js';
import SplitPane from './components/split-pane.js';
import VirtualList from './components/virtual-list.js';
import Dropzone from './components/dropzone.js';
import RangeSlider from './components/range-slider.js';
/**
 * Fired when the active tab changes (onChange option / `.on('change')`).
 * @typedef {object} TabChangeEvent
 * @property {number} index - The new active index
 * @property {number} oldIndex - The previous active index
 * @property {HTMLElement} tab - The new active tab
 * @property {HTMLElement} panel - Its panel
 */
/**
 * @typedef {object} TabsOptions
 * @property {number} [active=0] - Initially active tab index
 * @property {'fade'|'none'} [animation='fade'] - Panel animation
 * @property {number} [animationDuration=200] - Animation duration in ms
 * @property {string} [tabSelector='.tab-item, [data-tab]'] - Selector for tab items
 * @property {string} [panelSelector='.tab-panel, [data-panel]'] - Selector for tab panels
 * @property {string} [activeClass='active'] - CSS class for the active tab
 * @property {((event: TabChangeEvent) => void)|null} [onChange] - Called when the active tab changes
 */
/**
 * Tabs: tab items paired by index with panels, with ARIA roles set up.
 * @typedef {Tabs} TabsInstance
 */
/**
 * Tabs component.
 */
declare class Tabs extends Component {
    static defaults: {
        active: number;
        animation: string;
        animationDuration: number;
        tabSelector: string;
        panelSelector: string;
        activeClass: string;
        onChange: any;
    };
    /**
     * @param {string|HTMLElement} selector - The tabs container
     * @param {TabsOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: TabsOptions);
    _activeIndex: any;
    _init(): void;
    _tabs: NodeListOf<any>;
    _panels: NodeListOf<any>;
    /**
     * Activate a tab by index, or by its `data-tab` / `href` value.
     * @param {number|string} index
     * @returns {this}
     */
    activate(index: number | string): this;
    _updateState(): void;
    /**
     * The active tab index.
     * @returns {number}
     */
    getActive(): number;
    /**
     * Alias of activate().
     * @param {number|string} index
     * @returns {this}
     */
    show(index: number | string): this;
    /**
     * Go to the next tab (wraps).
     * @returns {this}
     */
    next(): this;
    /**
     * Go to the previous tab (wraps).
     * @returns {this}
     */
    prev(): this;
}
/**
 * Fired when a panel opens or closes through toggle() (onChange option / `.on('change')`).
 * @typedef {object} AccordionChangeEvent
 * @property {number} index
 * @property {boolean} isOpen - Whether the panel is now open
 * @property {HTMLElement} header
 * @property {HTMLElement} content
 */
/**
 * @typedef {object} AccordionOptions
 * @property {boolean} [allowMultiple=false] - Allow several panels open at once
 * @property {boolean|null} [multiExpand=null] - Alias of allowMultiple (wins when set)
 * @property {number|number[]|null} [activeIndex=null] - Initially open panel index(es); null keeps the markup's active class
 * @property {boolean} [animation=true] - Animate the height
 * @property {number} [animationDuration=300] - Animation duration in ms
 * @property {string} [headerSelector='.accordion-header, [data-accordion-header]'] - Selector for headers
 * @property {string} [contentSelector='.accordion-body, .accordion-content, [data-accordion-content]'] - Selector for panels (outermost matches only)
 * @property {string} [activeClass='active'] - Class put on the open item (the header's parent)
 * @property {((event: AccordionChangeEvent) => void)|null} [onChange] - Called when toggle() opens or closes a panel
 */
/**
 * @typedef {Accordion} AccordionInstance
 */
/**
 * Accordion component.
 */
declare class Accordion extends Component {
    static defaults: {
        allowMultiple: boolean;
        multiExpand: any;
        activeIndex: any;
        animation: boolean;
        animationDuration: number;
        headerSelector: string;
        contentSelector: string;
        activeClass: string;
        onChange: any;
    };
    /**
     * @param {string|HTMLElement} selector - The accordion container
     * @param {AccordionOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: AccordionOptions);
    _init(): void;
    _headers: NodeListOf<any>;
    _contents: any[];
    /**
     * Open or close a panel; closes the others unless allowMultiple.
     * @param {number} index
     * @returns {this}
     */
    toggle(index: number): this;
    _open(index: any): void;
    _close(index: any): void;
    /**
     * Open a panel by index.
     * @param {number} index
     * @returns {this}
     */
    open(index: number): this;
    /**
     * Close a panel by index.
     * @param {number} index
     * @returns {this}
     */
    close(index: number): this;
    /**
     * Open every panel.
     * @returns {this}
     */
    openAll(): this;
    /**
     * Close every panel.
     * @returns {this}
     */
    closeAll(): this;
}
/**
 * @typedef {'primary'|'secondary'|'success'|'danger'|'warning'|'info'} ListGroupVariant
 */
/**
 * @typedef {object} ListGroupOptions
 * @property {boolean} [selectable=false] - Items can be selected (role="listbox")
 * @property {boolean} [multiSelect=false] - Allow several selected items at once
 * @property {string} [activeClass='active'] - Class on selected items
 * @property {string} [disabledClass='disabled'] - Class marking disabled items
 * @property {string} [itemSelector='.list-group-item'] - Selector for the items
 * @property {boolean} [keyboard=true] - Arrow keys, Home/End, Enter/Space
 * @property {boolean} [loop=true] - Keyboard navigation wraps from last to first
 * @property {boolean} [focusOnInit=false] - Focus the first enabled item on init
 * @property {((selected: HTMLElement[], event: Event|null) => void)|null} [onChange] - Selection changed; the selected items
 * @property {((item: HTMLElement, index: number, event: Event|null) => void)|null} [onSelect] - An item was selected
 * @property {((item: HTMLElement, index: number, event: Event|null) => void)|null} [onDeselect] - An item was deselected
 */
/**
 * A list group. `E.listGroup()` returns the first instance; `all()` (non-enumerable) lists every
 * instance the selector made.
 * @typedef {ListGroup & {all(): ListGroup[]}} ListGroupInstance
 */
/**
 * ListGroup component.
 */
declare class ListGroup extends Component {
    static defaults: {
        selectable: boolean;
        multiSelect: boolean;
        activeClass: string;
        disabledClass: string;
        itemSelector: string;
        keyboard: boolean;
        loop: boolean;
        focusOnInit: boolean;
        onChange: any;
        onSelect: any;
        onDeselect: any;
    };
    /**
     * @param {string|HTMLElement} selector - The list-group element
     * @param {ListGroupOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: ListGroupOptions);
    _items: any[];
    _focusedIndex: number;
    _init(): void;
    _initTabindex(): void;
    _setupKeyboard(): void;
    _nextEnabledIndex(from: any, direction: any): any;
    _firstEnabledIndex(): number;
    _lastEnabledIndex(): number;
    _moveFocus(index: any): void;
    _handleItemClick(index: any, event: any): void;
    _updateAriaSelected(): void;
    /**
     * Select item at index
     * @param {number} index
     * @returns {this}
     */
    select(index: number): this;
    /**
     * Deselect item at index
     * @param {number} index
     * @returns {this}
     */
    deselect(index: number): this;
    /**
     * Toggle selection at index
     * @param {number} index
     * @returns {this}
     */
    toggle(index: number): this;
    /**
     * Select all non-disabled items (multiSelect mode only)
     * @returns {this}
     */
    selectAll(): this;
    /**
     * Deselect all items
     * @returns {this}
     */
    deselectAll(): this;
    /**
     * Return array of selected DOM elements
     * @returns {HTMLElement[]}
     */
    getSelected(): HTMLElement[];
    /**
     * Return whether item at index is selected
     * @param {number} index
     * @returns {boolean}
     */
    isSelected(index: number): boolean;
    /**
     * Enable item at index (remove disabled class)
     * @param {number} index
     * @returns {this}
     */
    enable(index: number): this;
    /**
     * Disable item at index (add disabled class)
     * @param {number} index
     * @returns {this}
     */
    disable(index: number): this;
    /**
     * Return all item elements as array
     * @returns {HTMLElement[]}
     */
    getItems(): HTMLElement[];
    /**
     * Return single item element at index
     * @param {number} index
     * @returns {HTMLElement|null}
     */
    getItem(index: number): HTMLElement | null;
    /**
     * Re-query items from the DOM (call after dynamic DOM changes)
     * @returns {this}
     */
    refresh(): this;
}
/**
 * A menu item. A plain string is an item whose label and value are the string.
 * @typedef {object} DropdownItem
 * @property {string} [label] - Display text
 * @property {string} [text] - Alternative to label
 * @property {string} [name] - Alternative to label
 * @property {any} [value] - Value when selected (default: the item's index)
 * @property {string} [icon] - Icon HTML
 * @property {boolean} [disabled] - Shown greyed, not selectable
 * @property {boolean} [divider] - Render as a divider
 * @property {string} [header] - Render as a header with this text
 */
/**
 * Passed to onSelect / `.on('select')`.
 * @typedef {object} DropdownSelectEvent
 * @property {DropdownItem|string} item
 * @property {number} index
 * @property {any} value
 */
/**
 * @typedef {object} DropdownOptions
 * @property {'click'|'hover'} [trigger='click'] - 'hover' also opens on click (touch has no hover)
 * @property {DropdownPosition} [position='bottom-start'] - Preferred menu position - flipped or clamped if it would open off screen
 * @property {[number, number]} [offset=[0, 4]] - Position offset [x, y]
 * @property {boolean} [flip=true] - Flip to the opposite side and clamp to the viewport rather than open off screen
 * @property {boolean} [animation=true] - Fade the menu
 * @property {number} [animationDuration=150] - Animation duration in ms
 * @property {number} [hoverOpenDelay=0] - ms before a hover opens the menu
 * @property {number} [hoverCloseDelay=300] - ms of grace before a hover menu closes once the pointer has left trigger, menu and the gap between
 * @property {boolean} [closeOnSelect=true] - Close after an item is chosen
 * @property {boolean} [closeOnClickOutside=true] - Close on a click outside
 * @property {boolean} [closeOnEscape=true] - Close on Esc and restore focus to the trigger
 * @property {boolean} [closeOthers=true] - Opening this dropdown closes any other open one
 * @property {(DropdownItem|string)[]} [items=[]] - Menu items
 * @property {any} [model=null] - A Domma Model holding the items array (with modelKey)
 * @property {string|null} [modelKey=null] - Model key for the items array
 * @property {string} [selectedKey] - Model key the selected value is written to (default `<modelKey>_selected`)
 * @property {((item: DropdownItem, index: number) => string)|null} [itemTemplate=null] - Item HTML for object items
 * @property {((dropdown: DropdownInstance) => boolean|void)|null} [onBeforeOpen] - Return false to keep it closed
 * @property {((dropdown: DropdownInstance) => void)|null} [onOpen] - Menu opened
 * @property {((dropdown: DropdownInstance) => boolean|void)|null} [onBeforeClose] - Return false to keep it open
 * @property {((dropdown: DropdownInstance) => void)|null} [onClose] - Menu closed
 * @property {((event: DropdownSelectEvent, dropdown: DropdownInstance) => void)|null} [onSelect] - An item was chosen
 */
/**
 * @typedef {Dropdown} DropdownInstance
 */
/**
 * Dropdown menu attached to a trigger element.
 */
declare class Dropdown extends Component {
    static defaults: {
        trigger: string;
        position: string;
        offset: number[];
        animation: boolean;
        animationDuration: number;
        hoverOpenDelay: number;
        hoverCloseDelay: number;
        closeOnSelect: boolean;
        closeOnClickOutside: boolean;
        closeOnEscape: boolean;
        closeOthers: boolean;
        flip: boolean;
        items: any[];
        model: any;
        modelKey: any;
        itemTemplate: any;
        onBeforeOpen: any;
        onOpen: any;
        onBeforeClose: any;
        onClose: any;
        onSelect: any;
    };
    static _open: Set<any>;
    /**
     * @param {string|HTMLElement} selector - The trigger element
     * @param {DropdownOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: DropdownOptions);
    _menu: HTMLDivElement;
    _isOpen: boolean;
    _items: any[];
    _selectedValue: any;
    _modelUnsubscribe: any;
    _hoverOpenTimer: number;
    _hoverCloseTimer: any;
    _removeTimer: any;
    _init(): void;
    _outsideClickHandler: (e: any) => void;
    _keydownHandler: (e: any) => void;
    _bindToModel(model: any, key: any): void;
    /**
     * Open the menu (onBeforeOpen may refuse).
     * @returns {this}
     */
    open(): this;
    /**
     * Close the menu (onBeforeClose may refuse).
     * @returns {this}
     */
    close(): this;
    /**
     * @returns {this}
     */
    toggle(): this;
    show(...args: any[]): this;
    hide(...args: any[]): this;
    isVisible(): boolean;
    _hoverIn(): void;
    _hoverOut(): void;
    _scheduleHoverClose(): void;
    /**
     * Is the pointer somewhere that should keep a hover menu open?
     *
     * mouseenter/mouseleave alone cannot answer this. The menu is a document.body
     * sibling separated from its trigger by `offset`, so the two boxes never
     * touch, and the path a user takes between them is whatever angle they
     * happen to choose. Leaving the trigger therefore looks identical to leaving
     * for good, and the menu closed out from under the pointer.
     *
     * So while the menu is open we watch the pointer itself and treat three
     * regions as "still here": the trigger, the menu, and the corridor spanning
     * the gap between them. That is geometric, so it holds for any `offset`, for
     * a diagonal approach, and for a menu that has been flipped to the other
     * side of its trigger.
     */
    _pointerInSafeZone(x: any, y: any): boolean;
    _bindOpenListeners(): void;
    _openListenersBound: boolean;
    _repositionHandler: () => void;
    _pointerMoveHandler: (e: any) => void;
    _pointerLeaveHandler: () => void;
    _unbindOpenListeners(): void;
    _createMenu(): void;
    _renderMenu(): void;
    _selectItem(item: any, index: any, value: any): void;
    /**
     * Place the menu against its trigger and keep it on screen. `position` is a
     * preference, not a promise: a menu that would run off the bottom or the
     * right edge is flipped to the opposite side when there is room there, and
     * clamped to the viewport either way.
     */
    _positionMenu(): void;
    /**
     * Replace the menu items.
     * @param {(DropdownItem|string)[]} items
     * @returns {this}
     */
    setItems(items: (DropdownItem | string)[]): this;
    /**
     * @param {DropdownItem|string} item
     * @returns {this}
     */
    addItem(item: DropdownItem | string): this;
    /**
     * @param {number} index
     * @returns {this}
     */
    removeItem(index: number): this;
    /**
     * The value of the last chosen item, or null.
     * @returns {any}
     */
    getSelected(): any;
    /**
     * @returns {boolean}
     */
    isOpen(): boolean;
}
/**
 * @typedef {object} TimerOptions
 * @property {number} [duration=60000] - Countdown length in ms
 * @property {boolean} [autoStart=false] - Start at once
 * @property {'hh:mm:ss'|'mm:ss'|'ss'|string} [format='mm:ss'] - Display format (case-insensitive)
 * @property {boolean} [showControls=false] - Show start/pause/reset buttons
 * @property {number} [updateInterval=100] - Tick interval in ms
 * @property {boolean} [notification=false] - Desktop notification on completion
 * @property {DesktopNotificationOptions} [notificationOptions] - Options for that notification
 * @property {boolean} [sound=false] - Play soundUrl on completion
 * @property {string|null} [soundUrl=null] - Sound to play
 * @property {((remaining: number) => void)|null} [onTick] - Every tick, with the ms remaining
 * @property {(() => void)|null} [onComplete] - Reached zero
 * @property {(() => void)|null} [onStart] - Started
 * @property {(() => void)|null} [onPause] - Paused
 * @property {(() => void)|null} [onReset] - Reset
 */
/**
 * @typedef {Timer} TimerInstance
 */
/**
 * Timer - Countdown timer with optional visual display
 * Works in both visual mode (with DOM element) and headless mode (pure logic)
 */
declare class Timer extends Component {
    static defaults: {
        duration: number;
        autoStart: boolean;
        format: string;
        showControls: boolean;
        updateInterval: number;
        notification: boolean;
        notificationOptions: {};
        sound: boolean;
        soundUrl: any;
        onTick: any;
        onComplete: any;
        onStart: any;
        onPause: any;
        onReset: any;
    };
    /**
     * @param {string|HTMLElement|null} [selector] - Where to draw the display; null for a headless timer
     * @param {TimerOptions} [options]
     */
    constructor(selector?: string | HTMLElement | null, options?: TimerOptions);
    _running: boolean;
    _remaining: any;
    _intervalId: number;
    _startTime: number;
    _pausedTime: number;
    _display: HTMLDivElement;
    _controls: HTMLDivElement;
    _audio: HTMLAudioElement;
    _init(): void;
    /**
     * Create visual display
     * @private
     */
    private _createDisplay;
    _container: HTMLDivElement;
    /**
     * Create control buttons
     * @private
     */
    private _createControls;
    _startBtn: HTMLButtonElement;
    _pauseBtn: HTMLButtonElement;
    _resetBtn: HTMLButtonElement;
    /**
     * Update visual display
     * @private
     */
    private _updateDisplay;
    /**
     * Format milliseconds to time string
     * @param {number} ms - Milliseconds
     * @returns {string} Formatted time
     * @private
     */
    private _formatTime;
    /**
     * Timer tick - called on each update interval
     * @private
     */
    private _tick;
    /**
     * Timer completion handler
     * @private
     */
    private _complete;
    /**
     * Start the timer
     * @returns {this}
     */
    start(): this;
    /**
     * Pause the timer
     * @returns {this}
     */
    pause(): this;
    /**
     * Reset the timer to initial duration
     * @returns {this}
     */
    reset(): this;
    /**
     * Stop the timer (pause without resuming)
     * @returns {this}
     */
    stop(): this;
    /**
     * Add time to the timer
     * @param {number} ms - Milliseconds to add
     * @returns {this}
     */
    add(ms: number): this;
    /**
     * Subtract time from the timer
     * @param {number} ms - Milliseconds to subtract
     * @returns {this}
     */
    subtract(ms: number): this;
    /**
     * Set a new duration
     * @param {number} ms - New duration in milliseconds
     * @returns {this}
     */
    setDuration(ms: number): this;
    /**
     * Check if timer is running
     * @returns {boolean}
     */
    isRunning(): boolean;
    /**
     * Get remaining time
     * @returns {number} Remaining time in milliseconds
     */
    getRemaining(): number;
    /**
     * Get elapsed time
     * @returns {number} Elapsed time in milliseconds
     */
    getElapsed(): number;
}
/**
 * One alarm. add() fills in the defaults and the id.
 * @typedef {object} AlarmItem
 * @property {string} [id] - Assigned by add() ('alarm-<n>')
 * @property {string} time - Time of day, 'HH:MM'
 * @property {string} [label] - Shown in the notification
 * @property {boolean} [enabled=true]
 * @property {null|'daily'|'weekdays'|'weekends'|string[]} [repeat=null] - null = once; an array of day names ('monday', ...)
 * @property {boolean} [notification=true] - Desktop notification when it goes off
 * @property {DesktopNotificationOptions} [notificationOptions] - Options for that notification
 * @property {boolean} [sound=false] - Play soundUrl
 * @property {string|null} [soundUrl=null]
 * @property {number|null} [lastTriggered=null] - Timestamp (ms) it last went off
 * @property {number|null} [snoozedUntil=null] - Timestamp (ms) a snooze ends
 * @property {Date} [nextTrigger] - Set on the copy getNextAlarm() returns
 */
/**
 * @typedef {object} AlarmOptions
 * @property {AlarmItem[]} [alarms=[]] - Initial alarms, used when storage holds none
 * @property {string} [timezone='local'] - Not read: times are local
 * @property {number} [checkInterval=30000] - How often alarms are checked, in ms
 * @property {string} [storageKey='domma-alarms'] - localStorage key
 * @property {((alarm: AlarmItem) => void)|null} [onTrigger] - An alarm went off
 * @property {((alarm: AlarmItem, duration: number) => void)|null} [onSnooze] - An alarm was snoozed
 * @property {(() => void)|null} [onDismiss] - Not called by the current code
 * @property {((alarm: AlarmItem) => void)|null} [onAlarmAdd] - add() added one
 * @property {((alarm: AlarmItem) => void)|null} [onAlarmRemove] - removeAlarm() removed one
 */
/**
 * @typedef {Alarm} AlarmInstance
 */
/**
 * Alarm - Scheduled time-based alerts with localStorage persistence
 * Singleton pattern - only one instance manages all alarms
 */
declare class Alarm {
    static defaults: {
        alarms: any[];
        timezone: string;
        checkInterval: number;
        storageKey: string;
        onTrigger: any;
        onSnooze: any;
        onDismiss: any;
        onAlarmAdd: any;
        onAlarmRemove: any;
    };
    static _instance: any;
    static _checkInterval: any;
    static _nextAlarmId: number;
    /**
     * Constructor - implements singleton pattern
     * @param {AlarmOptions} [options] - Alarm options (ignored once the instance exists)
     */
    constructor(options?: AlarmOptions);
    /** @type {AlarmOptions} */
    options: AlarmOptions;
    _alarms: any[];
    /**
     * Initialize alarm system
     * @private
     */
    private _init;
    /**
     * Load alarms from localStorage
     * @private
     */
    private _loadAlarms;
    /**
     * Save alarms to localStorage
     * @private
     */
    private _saveAlarms;
    /**
     * Start checking alarms at regular interval
     * @private
     */
    private _startChecking;
    /**
     * Stop checking alarms
     * @private
     */
    private _stopChecking;
    /**
     * Check all alarms and trigger if needed
     * @private
     */
    private _checkAlarms;
    /**
     * Check if alarm should trigger at the given time
     * @param {Object} alarm - Alarm object
     * @param {Date} now - Current time
     * @returns {boolean}
     * @private
     */
    private _shouldTrigger;
    /**
     * Parse time string (HH:MM format)
     * @param {string} timeString - Time in HH:MM format
     * @returns {Object} { hours, minutes }
     * @private
     */
    private _parseTime;
    /**
     * Check if alarm matches repeat pattern for given date
     * @param {Object} alarm - Alarm object
     * @param {Date} date - Date to check
     * @returns {boolean}
     * @private
     */
    private _matchesRepeatPattern;
    /**
     * Trigger an alarm
     * @param {Object} alarm - Alarm to trigger
     * @private
     */
    private _triggerAlarm;
    /**
     * Add a new alarm
     * @param {AlarmItem} alarm - Alarm configuration
     * @returns {AlarmItem} Created alarm with ID
     */
    add(alarm: AlarmItem): AlarmItem;
    /**
     * Remove an alarm by ID. remove(id) is a permanent alias - removeAlarm is the name,
     * because remove() means "take this component away" elsewhere and destroy() does that here.
     * @param {string} id - Alarm ID
     * @returns {boolean} True if removed
     */
    removeAlarm(id: string): boolean;
    /**
     * Alias of removeAlarm(id), looked up by name at call time.
     * @param {string} id
     * @returns {boolean}
     */
    remove(id: string): boolean;
    /**
     * Update an alarm
     * @param {string} id - Alarm ID
     * @param {Partial<AlarmItem>} changes - Changes to apply
     * @returns {AlarmItem|null} Updated alarm or null if not found
     */
    update(id: string, changes: Partial<AlarmItem>): AlarmItem | null;
    /**
     * Enable an alarm
     * @param {string} id - Alarm ID
     * @returns {boolean} True if enabled
     */
    enable(id: string): boolean;
    /**
     * Disable an alarm
     * @param {string} id - Alarm ID
     * @returns {boolean} True if disabled
     */
    disable(id: string): boolean;
    /**
     * Toggle alarm enabled state
     * @param {string} id - Alarm ID
     * @returns {boolean|null} New enabled state or null if not found
     */
    toggle(id: string): boolean | null;
    /**
     * Snooze an alarm for a duration
     * @param {string} id - Alarm ID
     * @param {number} [duration=300000] - Snooze duration in milliseconds (default 5 minutes)
     * @returns {boolean} True if snoozed
     */
    snooze(id: string, duration?: number): boolean;
    /**
     * Get all alarms
     * @returns {AlarmItem[]} Array of alarm objects
     */
    getAlarms(): AlarmItem[];
    /**
     * Get a specific alarm by ID
     * @param {string} id - Alarm ID
     * @returns {AlarmItem|null} Alarm object or null
     */
    getAlarm(id: string): AlarmItem | null;
    /**
     * Get the next alarm that will trigger
     * @returns {AlarmItem|null} Next alarm object with trigger time (`nextTrigger`)
     */
    getNextAlarm(): AlarmItem | null;
    /**
     * Get next occurrence time for an alarm
     * @param {Object} alarm - Alarm object
     * @param {Date} from - Start date
     * @returns {Date|null} Next occurrence date
     * @private
     */
    private _getNextOccurrence;
    /**
     * Clear all alarms
     * @returns {this}
     */
    clearAll(): this;
    /**
     * Destroy alarm system
     */
    destroy(): void;
}
/**
 * Passed to onChange / `.on('change')`.
 * @typedef {object} CarouselChangeEvent
 * @property {number} index
 * @property {number} oldIndex
 * @property {HTMLElement} slide
 */
/**
 * @typedef {object} CarouselOptions
 * @property {boolean} [autoplay=false] - Advance on a timer
 * @property {number} [interval=5000] - Autoplay interval in ms
 * @property {boolean} [pauseOnHover=true] - Pause autoplay on hover
 * @property {boolean} [loop=true] - Wrap from the last slide to the first
 * @property {'slide'|'fade'|'crossfade'} [animation='slide'] - 'slide' (track translate), 'fade' (clean swap), or 'crossfade' (overlapping opacity)
 * @property {number} [animationDuration=500] - Animation duration in ms
 * @property {string} [animationEasing='ease'] - Any CSS timing function ('ease', 'linear', 'ease-in-out', 'cubic-bezier(...)' etc.)
 * @property {'crop'|'average'} [heightMode='crop'] - Image carousels: 'crop' = the shortest image, 'average' = halfway between shortest and tallest
 * @property {number|null} [height=null] - Fixed viewport height in px
 * @property {boolean} [showArrows=true] - Previous / next arrows
 * @property {boolean} [showIndicators=true] - Indicator dots
 * @property {string} [slideSelector='.carousel-slide, [data-slide]'] - Selector for slides
 * @property {string} [activeClass='active'] - Class on the active slide
 * @property {((event: CarouselChangeEvent) => void)|null} [onChange] - The slide changed
 */
/**
 * @typedef {Carousel} CarouselInstance
 */
/**
 * Carousel component.
 */
declare class Carousel extends Component {
    static defaults: {
        autoplay: boolean;
        interval: number;
        pauseOnHover: boolean;
        loop: boolean;
        animation: string;
        animationDuration: number;
        animationEasing: string;
        heightMode: string;
        height: any;
        showArrows: boolean;
        showIndicators: boolean;
        slideSelector: string;
        activeClass: string;
        onChange: any;
    };
    /**
     * @param {string|HTMLElement} selector - The carousel element
     * @param {CarouselOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: CarouselOptions);
    _currentIndex: number;
    _autoplayTimer: number;
    _isAnimating: boolean;
    _init(): void;
    _slides: NodeListOf<any>;
    _track: Element;
    _initHeight(): void;
    _images: any[];
    _originalHeight: string;
    _originalHeightPriority: string;
    _wasSized: boolean;
    _heightObserver: ResizeObserver;
    _sizeSlides(): void;
    _applyOptions(): void;
    _createArrows(): void;
    _prevBtn: HTMLButtonElement;
    _nextBtn: HTMLButtonElement;
    _createIndicators(): void;
    _indicators: HTMLDivElement;
    _updateState(oldIndex?: any): void;
    _applyCrossfade(oldIndex: any, newIndex: any): void;
    _crossfadeSwapTimer: any;
    _startAutoplay(): void;
    _stopAutoplay(): void;
    /**
     * Go to a slide (wraps when loop is on; ignored mid-animation).
     * @param {number} index
     * @returns {this}
     */
    goTo(index: number): this;
    /**
     * @returns {this}
     */
    next(): this;
    /**
     * @returns {this}
     */
    prev(): this;
    /**
     * Start autoplay.
     * @returns {this}
     */
    play(): this;
    /**
     * Stop autoplay.
     * @returns {this}
     */
    pause(): this;
    /**
     * The current slide index.
     * @returns {number}
     */
    getIndex(): number;
    /**
     * A slide element (default: the current one).
     * @param {number} [index]
     * @returns {HTMLElement|undefined}
     */
    getSlide(index?: number): HTMLElement | undefined;
}
/**
 * A cookie category in the customise panel.
 * @typedef {object} CookieCategory
 * @property {string} label
 * @property {string} [description]
 * @property {boolean} [required] - Always on; cannot be switched off
 */
/**
 * @typedef {'accepted'|'rejected'|'customized'|'undecided'} CookieConsentState
 */
/**
 * @typedef {object} CookieConsentOptions
 * @property {string} [message] - Banner text
 * @property {string} [acceptAllText='Accept All']
 * @property {string} [rejectAllText='Reject All']
 * @property {string} [customizeText='Customize']
 * @property {string} [savePreferencesText='Save Preferences']
 * @property {string} [privacyPolicyText='Privacy Policy']
 * @property {string|null} [privacyPolicyUrl='/privacy-policy']
 * @property {string} [cookiePolicyText='Cookie Policy']
 * @property {string|null} [cookiePolicyUrl=null]
 * @property {Record<string, CookieCategory>} [categories] - Default: necessary, functional, analytics, marketing
 * @property {'bottom'|'top'|'bottom-left'|'bottom-right'|'center-modal'} [position='bottom']
 * @property {'light'|'dark'|'auto'} [theme='light'] - 'auto' follows the system
 * @property {'bar'|'box'|'modal'} [layout='bar']
 * @property {boolean} [animation=true]
 * @property {boolean} [backdrop=false] - Backdrop behind the modal layout
 * @property {boolean} [autoShow=true] - Show on a first visit
 * @property {boolean} [hideAfterAction=true] - Hide once a choice is made
 * @property {string} [reopenSelector='[data-cookie-consent-open]'] - Elements that reopen the banner
 * @property {string} [storageKey='domma-cookie-consent']
 * @property {number} [storageDuration=365] - Days the choice is remembered
 * @property {CookieConsentState} [defaultState='undecided']
 * @property {boolean} [requireExplicitConsent=true] - GDPR mode: optional categories start off
 * @property {string} [consentVersion='1.0'] - Bump when the policy changes to ask again
 * @property {((oldVersion: string, newVersion: string) => void)|null} [onVersionMismatch] - The stored choice was for another version
 * @property {((preferences: Record<string, boolean>) => void)|null} [onAccept] - Accept all, or saved custom preferences
 * @property {(() => void)|null} [onReject]
 * @property {((preferences: Record<string, boolean>) => void)|null} [onCustomize] - The customise panel opened
 * @property {((state: CookieConsentState, preferences: Record<string, boolean>) => void)|null} [onChange]
 * @property {(() => void)|null} [onShow]
 * @property {(() => void)|null} [onHide]
 */
/**
 * @typedef {CookieConsent} CookieConsentInstance
 */
/**
 * Cookie consent banner (one per page).
 */
declare class CookieConsent extends Component {
    static defaults: {
        message: string;
        acceptAllText: string;
        rejectAllText: string;
        customizeText: string;
        savePreferencesText: string;
        privacyPolicyText: string;
        privacyPolicyUrl: string;
        cookiePolicyText: string;
        cookiePolicyUrl: any;
        categories: {
            necessary: {
                label: string;
                description: string;
                required: boolean;
            };
            functional: {
                label: string;
                description: string;
                required: boolean;
            };
            analytics: {
                label: string;
                description: string;
                required: boolean;
            };
            marketing: {
                label: string;
                description: string;
                required: boolean;
            };
        };
        position: string;
        theme: string;
        layout: string;
        animation: boolean;
        backdrop: boolean;
        autoShow: boolean;
        hideAfterAction: boolean;
        reopenSelector: string;
        storageKey: string;
        storageDuration: number;
        defaultState: string;
        requireExplicitConsent: boolean;
        consentVersion: string;
        onVersionMismatch: any;
        onAccept: any;
        onReject: any;
        onCustomize: any;
        onChange: any;
        onShow: any;
        onHide: any;
    };
    /**
     * @param {CookieConsentOptions} [options]
     */
    constructor(options?: CookieConsentOptions);
    _state: any;
    _preferences: {};
    _customizeModal: HTMLDivElement;
    _isVisible: boolean;
    _init(): void;
    _loadPreferences(): void;
    _savePreferences(): void;
    _hasConsented(): boolean;
    _createUI(): void;
    _createCustomizeModal(): void;
    _setupEventHandlers(): void;
    _setupModalHandlers(): void;
    _setupReopenTriggers(): void;
    /**
     * Show the banner.
     * @returns {this}
     */
    open(): this;
    /**
     * Hide the banner.
     * @returns {this}
     */
    close(): this;
    /**
     * @returns {this}
     */
    toggle(): this;
    /**
     * @returns {boolean}
     */
    isOpen(): boolean;
    /**
     * Alias of open().
     * @param {...any} args
     * @returns {this}
     */
    show(...args: any[]): this;
    /**
     * Alias of close().
     * @param {...any} args
     * @returns {this}
     */
    hide(...args: any[]): this;
    /**
     * Alias of isOpen().
     * @returns {boolean}
     */
    isVisible(): boolean;
    /**
     * Accept every category.
     * @returns {void}
     */
    accept(): void;
    /**
     * Reject every optional category.
     * @returns {void}
     */
    reject(): void;
    /**
     * Open the customise panel.
     * @returns {void}
     */
    showCustomize(): void;
    /**
     * @returns {void}
     */
    hideCustomize(): void;
    /**
     * Save the customise panel's toggles.
     * @returns {void}
     */
    saveCustomPreferences(): void;
    /**
     * @returns {CookieConsentState|null}
     */
    getState(): CookieConsentState | null;
    /**
     * A copy of the per-category choices.
     * @returns {Record<string, boolean>}
     */
    getPreferences(): Record<string, boolean>;
    /**
     * Whether a category was accepted, or (no category) whether consent was given.
     * @param {string|null} [category]
     * @returns {boolean}
     */
    isAccepted(category?: string | null): boolean;
    /**
     * Forget the stored choice.
     * @returns {void}
     */
    reset(): void;
}
/**
 * @typedef {object} ButtonGroupOptions
 * @property {'single'|'multiple'} [mode='single'] - 'single' behaves like radios, 'multiple' like checkboxes
 * @property {string} [activeClass='active'] - Class on active buttons
 * @property {boolean} [allowEmpty=false] - Single mode: clicking the active button deselects it
 * @property {((value: number|number[]|null, index: number, button: HTMLElement|null) => void)|null} [onChange] - Selection changed (index -1 from selectAll/deselectAll)
 */
/**
 * A button group. `E.buttonGroup()` returns the first instance; `all()` (non-enumerable) lists every
 * instance the selector made.
 * @typedef {ButtonGroup & {all(): ButtonGroup[]}} ButtonGroupInstance
 */
/**
 * Toggle group over a container's `.btn` children.
 */
declare class ButtonGroup extends Component {
    static defaults: {
        mode: string;
        activeClass: string;
        allowEmpty: boolean;
        onChange: any;
    };
    /**
     * @param {string|HTMLElement} selector - The group container
     * @param {ButtonGroupOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: ButtonGroupOptions);
    _init(): void;
    buttons: Element[];
    _handleClick(btn: any, index: any): void;
    /**
     * Get the current value(s)
     * @returns {number|number[]|null} Index (single) or array of indices (multiple)
     */
    getValue(): number | number[] | null;
    /**
     * Get the active button element(s)
     * @returns {HTMLElement|HTMLElement[]|null}
     */
    getActive(): HTMLElement | HTMLElement[] | null;
    /**
     * Set the active button(s) by index
     * @param {number|number[]} value - Index or array of indices
     * @returns {this}
     */
    setValue(value: number | number[]): this;
    /**
     * Toggle a specific button by index
     * @param {number} index
     * @returns {this}
     */
    toggle(index: number): this;
    /**
     * Select all buttons (multiple mode only)
     * @returns {this}
     */
    selectAll(): this;
    /**
     * Deselect all buttons
     * @returns {this}
     */
    deselectAll(): this;
}
/**
 * A breadcrumb. A plain string is a crumb with that text and no link.
 * @typedef {object} BreadcrumbItem
 * @property {string} text - Label (HTML)
 * @property {string} [url] - Link (default '#'); the last item is never a link
 * @property {boolean} [active] - Render as the current page
 */
/**
 * @typedef {object} BreadcrumbsOptions
 * @property {(BreadcrumbItem|string)[]} [items=[]]
 * @property {'/'|'>'|'→'|'chevron'|string} [separator='/'] - A preset, or custom HTML
 * @property {boolean} [homeIcon=false] - Home icon on the first item
 * @property {boolean} [responsive=true] - Collapse on small screens
 * @property {((item: BreadcrumbItem|string, index: number, event: MouseEvent) => void)|null} [onChange] - A crumb link was clicked (setting it prevents navigation)
 */
/**
 * @typedef {Breadcrumbs} BreadcrumbsInstance
 */
/**
 * Breadcrumb trail rendered into an element.
 */
declare class Breadcrumbs extends Component {
    static defaults: {
        items: any[];
        separator: string;
        homeIcon: boolean;
        responsive: boolean;
        onChange: any;
    };
    static separators: {
        '/': string;
        '>': string;
        '\u2192': string;
        chevron: string;
    };
    /**
     * @param {string|HTMLElement} selector - The element to render into
     * @param {BreadcrumbsOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: BreadcrumbsOptions);
    _init(): void;
    _getSeparatorHTML(): any;
    _render(): void;
    _injectStyles(): void;
    _bindEvents(): void;
    /**
     * @param {(BreadcrumbItem|string)[]} items
     * @returns {this}
     */
    setItems(items: (BreadcrumbItem | string)[]): this;
    /**
     * Append a crumb (it becomes the current page).
     * @param {BreadcrumbItem|string} item
     * @returns {this}
     */
    addItem(item: BreadcrumbItem | string): this;
    /**
     * @param {number} index
     * @returns {this}
     */
    removeItem(index: number): this;
    /**
     * @returns {(BreadcrumbItem|string)[]}
     */
    getItems(): (BreadcrumbItem | string)[];
}
/**
 * A navbar link; `items` makes it a dropdown (nested `items` make flyouts).
 * @typedef {object} NavbarItem
 * @property {string} [text] - Label
 * @property {string} [url] - Link
 * @property {string} [icon] - Domma icon name
 * @property {boolean} [active] - Highlighted as the current page
 * @property {boolean} [external] - Opens in a new tab
 * @property {boolean} [divider] - Inside a dropdown: a divider
 * @property {NavbarItem[]} [items] - Dropdown entries
 */
/**
 * @typedef {object} NavbarBrand
 * @property {string} [text]
 * @property {string} [logo] - Logo image URL
 * @property {string} [url] - Brand link
 * @property {string} [html] - Brand markup instead of text/logo
 */
/**
 * @typedef {object} NavbarAction
 * @property {string} [text]
 * @property {string} [url]
 * @property {string} [icon] - Domma icon name
 * @property {string} [variant] - Button variant ('primary', 'outline', ...)
 */
/**
 * @typedef {object} NavbarOptions
 * @property {NavbarBrand|null} [brand=null]
 * @property {NavbarItem[]} [items=[]]
 * @property {'static'|'fixed'|'sticky'} [position='static']
 * @property {'light'|'dark'|'transparent'|string} [variant='light']
 * @property {boolean} [collapsible=true] - Hamburger menu on small screens
 * @property {number} [collapseAt=993] - Below this width (px) the bar is collapsed
 * @property {boolean} [appearOnHover=false] - Desktop: open dropdowns/flyouts on hover (click still works)
 * @property {number} [hoverCloseDelay=250] - ms of grace when the pointer leaves the bar
 * @property {NavbarAction[]} [actions=[]] - Right-side buttons
 * @property {((item: NavbarItem, index: number, event: MouseEvent, parent?: NavbarItem) => void)|null} [onItemClick] - A link was clicked (sub-items also get the parent)
 */
/**
 * @typedef {Navbar} NavbarInstance
 */
/**
 * Responsive navigation bar rendered into an element.
 */
declare class Navbar extends Component {
    static defaults: {
        brand: any;
        items: any[];
        position: string;
        variant: string;
        collapsible: boolean;
        collapseAt: number;
        appearOnHover: boolean;
        hoverCloseDelay: number;
        actions: any[];
        onItemClick: any;
    };
    /**
     * @param {string|HTMLElement} selector - The element to render into
     * @param {NavbarOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: NavbarOptions);
    _isCollapsed: boolean;
    _pinned: any;
    _hoverSuppressed: any;
    _navCloseTimer: number;
    _init(): void;
    _render(): void;
    _toggle: Element;
    _collapse: Element;
    /**
     * Render a list of nav items as <li> markup, recursing into `items` so
     * dropdowns can nest to arbitrary depth.
     *   depth 0  -> top-level bar items (button toggle / plain link)
     *   depth >0 -> dropdown-menu entries (submenu toggle / dropdown item)
     * `pathPrefix` is the dotted index path of the parent ('' at the root),
     * emitted as data-path so click handling works at any depth.
     */
    _renderItems(list: any, depth: any, pathPrefix: any): string;
    _scanIcons(): void;
    _bindEvents(): void;
    /**
     * Open every .navbar-dropdown on the path from `target` up to the navbar - so
     * a hovered flyout keeps its parents open - and close the rest. A pinned
     * dropdown is added to that path whatever the pointer is doing, unless
     * `force` says the pin itself is being cleared.
     */
    _reconcileDropdowns(target: any, force?: boolean): void;
    /**
     * Keep an opening dropdown/flyout inside the viewport. Dropdown menus are
     * absolutely positioned (top-level opens downward at left:0; nested submenus
     * fly out at left:100%/top:0) with no built-in collision handling, so deep or
     * low menus would run off the right/bottom edge and be unreachable. On open we
     * measure and reposition: flip horizontally past the right edge, and either
     * shift a flyout up or cap+scroll a top-level list past the bottom edge.
     * Desktop only - below collapseAt the menu renders inline in the drawer.
     */
    _positionMenu(dropdown: any): void;
    /**
     * Mark one top-level item active.
     * @param {number} index
     * @returns {this}
     */
    setActive(index: number): this;
    /**
     * @param {NavbarItem[]} items
     * @returns {this}
     */
    setItems(items: NavbarItem[]): this;
    /**
     * Open the collapsed (mobile) menu.
     * @returns {this}
     */
    expand(): this;
    /**
     * Close the collapsed (mobile) menu.
     * @returns {this}
     */
    collapse(): this;
    /**
     * @returns {this}
     */
    toggle(): this;
    /**
     * @returns {boolean}
     */
    isCollapsed(): boolean;
}
/**
 * A sidebar entry: a link, a heading, a divider, or (with `items`) an expandable group.
 * @typedef {object} SidebarItem
 * @property {string} [text] - Label (HTML)
 * @property {string} [url] - Link
 * @property {string} [icon] - Domma icon name
 * @property {string} [section] - Section key; setActive(section) highlights it, and clicking it makes it active
 * @property {string|number} [badge] - Badge text
 * @property {string} [heading] - Render as a heading with this text
 * @property {boolean} [divider] - Render as a divider
 * @property {SidebarItem[]} [items] - Children (an expandable group)
 */
/**
 * @typedef {object} SidebarOptions
 * @property {'left'|'right'} [position='left']
 * @property {boolean} [fixed=true] - Fixed rather than static positioning
 * @property {string} [width='250px']
 * @property {string} [top='0'] - Top offset, e.g. '60px' under a navbar
 * @property {{title?: string, toggle?: boolean, icon?: string}|null} [header=null] - Header; `toggle: false` hides its close button
 * @property {SidebarItem[]} [items=[]]
 * @property {{text?: string, html?: string}|null} [footer=null]
 * @property {'light'|'dark'|'theme'} [variant='dark'] - 'theme' follows the active theme
 * @property {boolean} [collapsible=true] - Toggle on small screens
 * @property {number} [collapseAt=768] - Breakpoint in px
 * @property {string|null} [activeSection=null] - Initially active section
 * @property {string[]} [expandedSections=[]] - Initially expanded groups (their paths)
 * @property {boolean} [persistExpanded=false] - Remember expanded groups in localStorage
 * @property {string|null} [persistKey=null] - Storage key for that
 * @property {number} [animationDuration=200] - ms
 * @property {boolean} [push=true] - Push the content aside rather than overlay it
 * @property {string} [contentSelector='.main-content'] - The content pushed aside
 * @property {boolean} [scrollSpy=false] - Track the active section while scrolling
 * @property {string} [scrollSpyOffset='-100px 0px -50% 0px'] - IntersectionObserver rootMargin
 * @property {number} [scrollSpyThreshold=0.5] - IntersectionObserver threshold
 * @property {boolean} [floating=false] - Floating toggle at the bottom left
 * @property {string|null} [customContent=null] - HTML to show instead of items
 * @property {boolean} [collapsibleDesktop=false] - Desktop collapse to icons only
 * @property {string} [collapsedWidth='60px'] - Width when collapsed
 * @property {boolean} [persistCollapsed=false] - Remember the collapsed state
 * @property {string|null} [persistCollapseKey=null] - Storage key for that
 * @property {((item: SidebarItem|null, path: string, event: MouseEvent) => void)|null} [onItemClick] - A link was clicked; path is its index path ('2.0')
 * @property {(() => boolean|void)|null} [onBeforeOpen] - Return false to keep it closed
 * @property {(() => boolean|void)|null} [onBeforeClose] - Return false to keep it open
 * @property {((isOpen: boolean) => void)|null} [onToggle] - Opened or closed
 * @property {((item?: SidebarItem, depth?: number) => void)|null} [onExpand] - A group expanded (no arguments: the desktop sidebar expanded)
 * @property {((item?: SidebarItem, depth?: number) => void)|null} [onCollapse] - A group collapsed (no arguments: the desktop sidebar collapsed)
 */
/**
 * @typedef {Sidebar} SidebarInstance
 */
/**
 * Navigation sidebar rendered into an element.
 */
declare class Sidebar extends Component {
    static defaults: {
        position: string;
        fixed: boolean;
        width: string;
        top: string;
        header: any;
        items: any[];
        footer: any;
        variant: string;
        collapsible: boolean;
        collapseAt: number;
        activeSection: any;
        expandedSections: any[];
        persistExpanded: boolean;
        persistKey: any;
        animationDuration: number;
        push: boolean;
        contentSelector: string;
        scrollSpy: boolean;
        scrollSpyOffset: string;
        scrollSpyThreshold: number;
        floating: boolean;
        customContent: any;
        collapsibleDesktop: boolean;
        collapsedWidth: string;
        persistCollapsed: boolean;
        persistCollapseKey: any;
        onItemClick: any;
        onBeforeOpen: any;
        onBeforeClose: any;
        onToggle: any;
        onExpand: any;
        onCollapse: any;
    };
    /**
     * @param {string|HTMLElement} selector - The element to render into
     * @param {SidebarOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: SidebarOptions);
    _isOpen: boolean;
    _isCollapsed: boolean;
    _expandedItems: Set<any>;
    _init(): void;
    _findContentElement(): void;
    _contentElement: any;
    _handleInitialPushState(): void;
    _render(): void;
    _toggle: Element;
    _nav: Element;
    _overlay: HTMLDivElement;
    _floatingToggle: HTMLButtonElement;
    _renderItems(items: any, depth?: number, parentPath?: string): string;
    _bindEvents(): void;
    _toggleSubmenu(itemElement: any, path: any): void;
    _expandSubmenu(itemElement: any, submenu: any): void;
    _collapseSubmenu(itemElement: any, submenu: any): void;
    _getItemByPath(path: any): any;
    _scanIcons(): void;
    _loadExpandedState(): void;
    _saveExpandedState(): void;
    _loadCollapsedState(): void;
    _saveCollapsedState(): void;
    _initScrollSpy(): void;
    _scrollSpyObserver: IntersectionObserver;
    _createOverlay(): void;
    _removeOverlay(): void;
    _applyPush(): void;
    _removePush(): void;
    /**
     * Open (small screens; onBeforeOpen may refuse).
     * @returns {this}
     */
    open(): this;
    /**
     * Close (onBeforeClose may refuse).
     * @returns {this}
     */
    close(): this;
    /**
     * @returns {this}
     */
    toggle(): this;
    /**
     * @returns {boolean}
     */
    isOpen(): boolean;
    /**
     * Alias of open().
     * @param {...any} args
     * @returns {this}
     */
    show(...args: any[]): this;
    /**
     * Alias of close().
     * @param {...any} args
     * @returns {this}
     */
    hide(...args: any[]): this;
    /**
     * Alias of isOpen().
     * @returns {boolean}
     */
    isVisible(): boolean;
    /**
     * Desktop: collapse to icons only (collapsibleDesktop).
     * @returns {this}
     */
    collapse(): this;
    /**
     * Desktop: expand from icons only.
     * @returns {this}
     */
    expand(): this;
    _createFloatingToggle(): void;
    _removeFloatingToggle(): void;
    _updateToggleIcon(iconName: any): void;
    /**
     * @returns {this}
     */
    toggleCollapse(): this;
    /**
     * @returns {boolean}
     */
    isCollapsed(): boolean;
    /**
     * Highlight the links of a section.
     * @param {string} section
     * @returns {this}
     */
    setActive(section: string): this;
    /**
     * @param {SidebarItem[]} items
     * @returns {this}
     */
    setItems(items: SidebarItem[]): this;
    /**
     * @param {SidebarItem} item
     * @param {number|null} [index=null] - Position; null appends
     * @returns {this}
     */
    addItem(item: SidebarItem, index?: number | null): this;
    /**
     * @param {number} index
     * @returns {this}
     */
    removeItem(index: number): this;
    /**
     * Expand every group.
     * @returns {this}
     */
    expandAll(): this;
    /**
     * Collapse every group.
     * @returns {this}
     */
    collapseAll(): this;
}
/**
 * @typedef {object} FooterLink
 * @property {string} [text]
 * @property {string} [url]
 * @property {string} [icon] - Domma icon name
 */
/**
 * @typedef {object} FooterBrand
 * @property {string} [text]
 * @property {string} [logo] - Logo image URL
 * @property {string} [url]
 * @property {string} [description]
 */
/**
 * @typedef {object} FooterColumn
 * @property {string} [title]
 * @property {FooterLink[]} [links]
 */
/**
 * @typedef {object} FooterSocial
 * @property {string} icon - Domma icon name
 * @property {string} [url]
 * @property {string} [label] - Accessible name (default: the icon name)
 */
/**
 * @typedef {object} FooterOptions
 * @property {'light'|'dark'|'transparent'|string} [variant='light']
 * @property {'simple'|'columns'|'minimal'} [layout='simple']
 * @property {FooterBrand|null} [brand=null]
 * @property {FooterColumn[]} [columns=[]] - For the 'columns' layout
 * @property {FooterLink[]} [links=[]] - Simple link list
 * @property {FooterSocial[]} [social=[]] - Social icons
 * @property {string|{text?: string, year?: number}|null} [copyright=null] - Text, or the year for '© <year> All rights reserved'
 * @property {string} [className=''] - Extra classes
 * @property {'static'|'fixed'|'sticky'} [position='static']
 */
/**
 * @typedef {Footer} FooterInstance
 */
/**
 * Site footer rendered into an element.
 */
declare class Footer extends Component {
    static defaults: {
        variant: string;
        layout: string;
        brand: any;
        columns: any[];
        links: any[];
        social: any[];
        copyright: any;
        className: string;
        position: string;
    };
    /**
     * @param {string|HTMLElement} selector - The element to render into
     * @param {FooterOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: FooterOptions);
    _init(): void;
    _render(): void;
    _renderSimpleLayout(brand: any, links: any, social: any, copyright: any): string;
    _renderColumnsLayout(brand: any, columns: any, social: any, copyright: any): string;
    _renderMinimalLayout(copyright: any, social: any): string;
    _renderSocial(social: any): string;
    _renderCopyright(copyright: any): string;
    _scanIcons(): void;
    /**
     * @param {FooterBrand|null} brand
     * @returns {this}
     */
    setBrand(brand: FooterBrand | null): this;
    /**
     * @param {FooterLink[]} links
     * @returns {this}
     */
    setLinks(links: FooterLink[]): this;
    /**
     * @param {FooterColumn[]} columns
     * @returns {this}
     */
    setColumns(columns: FooterColumn[]): this;
    /**
     * @param {FooterSocial[]} social
     * @returns {this}
     */
    setSocial(social: FooterSocial[]): this;
    /**
     * @param {string|{text?: string, year?: number}|null} copyright
     * @returns {this}
     */
    setCopyright(copyright: string | {
        text?: string;
        year?: number;
    } | null): this;
}
/**
 * A suggestion: a string, or an object shown by `label` and written as `value`.
 * @typedef {string|{label?: string, value?: string, [key: string]: any}} AutocompleteItem
 */
/**
 * @typedef {object} AutocompleteOptions
 * @property {AutocompleteItem[]} [data=[]] - Suggestions to filter
 * @property {((query: string) => AutocompleteItem[]|Promise<AutocompleteItem[]>)|null} [dataSource=null] - Fetch suggestions instead of filtering data
 * @property {number} [minChars=1] - Characters typed before suggesting
 * @property {number} [maxResults=10]
 * @property {number} [debounce=300] - ms
 * @property {((item: AutocompleteItem, query: string) => boolean)|null} [filterFn=null] - Replaces the default contains-match
 * @property {((item: AutocompleteItem, query: string) => string|Node)|null} [renderItem=null] - Suggestion HTML or a node
 * @property {boolean} [highlightMatches=true]
 * @property {'auto'|'above'|'below'} [position='auto'] - Where the list opens; 'auto' picks the side with room
 * @property {string} [placeholder='']
 * @property {string} [emptyMessage='No results found']
 * @property {string} [loadingMessage='Loading...']
 * @property {boolean} [caseSensitive=false]
 * @property {boolean} [selectOnEnter=true]
 * @property {boolean} [clearOnSelect=false] - Empty the input after a choice
 * @property {any} [model] - A Domma Model the typed value is written to (with modelKey)
 * @property {string} [modelKey]
 * @property {((item: AutocompleteItem, event: {target: HTMLElement}) => void)|null} [onSelect] - A suggestion was chosen
 * @property {((value: string, event: Event) => void)|null} [onChange] - The input's value changed
 * @property {(() => boolean|void)|null} [onBeforeOpen] - Return false to keep it closed
 * @property {(() => void)|null} [onOpen]
 * @property {(() => boolean|void)|null} [onBeforeClose] - Return false to keep it open
 * @property {(() => void)|null} [onClose]
 * @property {((results: AutocompleteItem[], query: string) => AutocompleteItem[]|void)|null} [onFilter] - May return a replacement result list
 */
/**
 * @typedef {Autocomplete} AutocompleteInstance
 */
/**
 * Suggestions under a text input.
 */
declare class Autocomplete extends Component {
    static defaults: {
        data: any[];
        dataSource: any;
        minChars: number;
        maxResults: number;
        debounce: number;
        filterFn: any;
        renderItem: any;
        highlightMatches: boolean;
        position: string;
        placeholder: string;
        emptyMessage: string;
        loadingMessage: string;
        caseSensitive: boolean;
        selectOnEnter: boolean;
        clearOnSelect: boolean;
        onSelect: any;
        onChange: any;
        onBeforeOpen: any;
        onOpen: any;
        onBeforeClose: any;
        onClose: any;
        onFilter: any;
    };
    /**
     * @param {string|HTMLElement} selector - The input
     * @param {AutocompleteOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: AutocompleteOptions);
    model: any;
    modelKey: string;
    _isOpen: boolean;
    _activeIndex: number;
    _filteredData: any[];
    _loading: boolean;
    _debounceTimer: number;
    _dropdown: HTMLDivElement;
    _list: HTMLUListElement;
    _loadingEl: HTMLDivElement;
    _emptyEl: HTMLDivElement;
    _modelUnsubscribe: any;
    _init(): void;
    _createDropdown(): void;
    _bindEvents(): void;
    _handleInput(e: any): void;
    _handleKeydown(e: any): void;
    _filterData(query: any): Promise<void>;
    _defaultFilter(item: any, query: any): any;
    _renderResults(query: any): void;
    _highlightMatch(text: any, query: any): any;
    _escapeRegex(str: any): any;
    _updateActive(): void;
    _selectItem(index: any): void;
    _setLoading(loading: any): void;
    _updatePosition(): void;
    /**
     * @returns {this}
     */
    open(): this;
    /**
     * @returns {this}
     */
    close(): this;
    /**
     * @returns {this}
     */
    toggle(): this;
    /**
     * @returns {boolean}
     */
    isOpen(): boolean;
    /**
     * Alias of open().
     * @param {...any} args
     * @returns {this}
     */
    show(...args: any[]): this;
    /**
     * Alias of close().
     * @param {...any} args
     * @returns {this}
     */
    hide(...args: any[]): this;
    /**
     * Alias of isOpen().
     * @returns {boolean}
     */
    isVisible(): boolean;
    /**
     * Set the input's value (no events).
     * @param {string} value
     * @returns {this}
     */
    setValue(value: string): this;
    /**
     * @returns {string}
     */
    getValue(): string;
    /**
     * Replace the suggestions.
     * @param {AutocompleteItem[]} data
     * @returns {this}
     */
    setData(data: AutocompleteItem[]): this;
    /**
     * Filter again for the current value.
     * @returns {this}
     */
    refresh(): this;
    /**
     * @returns {this}
     */
    focus(): this;
    /**
     * Empty the input and close the list.
     * @returns {this}
     */
    clearValue(): this;
}
/**
 * An option: a string, or an object shown by `label` and stored as `value`.
 * @typedef {string|{value: string, label?: string, disabled?: boolean, [key: string]: any}} PillboxItem
 */
/**
 * @typedef {object} PillboxOptions
 * @property {PillboxItem[]} [data=[]] - Options to choose from
 * @property {string[]} [value=[]] - Initial values
 * @property {string} [placeholder='Add items...']
 * @property {boolean} [searchable=true] - Filter the options while typing
 * @property {boolean} [creatable=false] - Enter adds typed text that is not an option
 * @property {number|null} [maxItems=null]
 * @property {boolean} [duplicates=false]
 * @property {boolean} [clearable=true] - Clear-all button
 * @property {'small'|'medium'|'large'|string} [size='medium']
 * @property {((pill: {value: string, label: string}) => string|Node)|null} [renderPill=null] - Pill HTML or a node
 * @property {((item: PillboxItem) => string|Node)|null} [renderOption=null] - Option HTML or a node
 * @property {string} [pillTemplate='<span>{label}</span>'] - Pill HTML when there is no renderPill
 * @property {((value: string) => boolean|string|void)|null} [validatePill=null] - true/undefined accepts; a string is the error message
 * @property {string} [maxItemsMessage='Maximum {max} items allowed']
 * @property {string} [duplicateMessage='Item already exists']
 * @property {string} [noResultsMessage='No results found']
 * @property {any} [model] - A Domma Model the values are kept in (with modelKey)
 * @property {string} [modelKey]
 * @property {(() => boolean|void)|null} [onBeforeOpen] - Return false to keep it closed
 * @property {(() => void)|null} [onOpen]
 * @property {(() => boolean|void)|null} [onBeforeClose] - Return false to keep it open
 * @property {(() => void)|null} [onClose]
 * @property {((value: string, pill: HTMLElement) => void)|null} [onAdd]
 * @property {((value: string, pill: HTMLElement) => void)|null} [onRemove]
 * @property {((values: string[]) => void)|null} [onChange]
 * @property {((text: string) => void)|null} [onCreate] - Typed text was added (creatable)
 * @property {(() => void)|null} [onMaxReached]
 * @property {((error: string, value: string) => void)|null} [onValidationError]
 */
/**
 * @typedef {Pillbox} PillboxInstance
 */
/**
 * Multi-value input that shows each value as a removable pill.
 */
declare class Pillbox extends Component {
    static defaults: {
        data: any[];
        value: any[];
        placeholder: string;
        searchable: boolean;
        creatable: boolean;
        maxItems: any;
        duplicates: boolean;
        clearable: boolean;
        size: string;
        renderPill: any;
        renderOption: any;
        pillTemplate: string;
        validatePill: any;
        maxItemsMessage: string;
        duplicateMessage: string;
        noResultsMessage: string;
        onBeforeOpen: any;
        onOpen: any;
        onBeforeClose: any;
        onClose: any;
        onAdd: any;
        onRemove: any;
        onChange: any;
        onCreate: any;
        onMaxReached: any;
        onValidationError: any;
    };
    /**
     * @param {string|HTMLElement} selector - The input (or select) to enhance
     * @param {PillboxOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: PillboxOptions);
    model: any;
    modelKey: string;
    _pills: any[];
    _isOpen: boolean;
    _activeIndex: number;
    _container: HTMLDivElement;
    _input: HTMLInputElement;
    _clearBtn: HTMLButtonElement;
    _dropdown: HTMLDivElement;
    _optionsList: HTMLUListElement;
    _filteredData: any[];
    _modelUnsubscribe: any;
    _init(): void;
    _createStructure(): void;
    _wrapper: HTMLDivElement;
    _bindEvents(): void;
    _handleInput(e: any): void;
    _handleKeydown(e: any): void;
    _filterOptions(query: any): void;
    _renderOptions(): void;
    _updateActive(): void;
    _selectOption(index: any): void;
    _createPill(text: any): void;
    _addPill(value: any, label: any): void;
    _removePill(pillElement: any): void;
    _validate(value: any): any;
    _findItemByValue(value: any): any;
    _updateHiddenInput(): void;
    _triggerChange(): void;
    /**
     * @returns {this}
     */
    open(): this;
    /**
     * @returns {this}
     */
    close(): this;
    /**
     * @returns {this}
     */
    toggle(): this;
    /**
     * @returns {boolean}
     */
    isOpen(): boolean;
    /**
     * Alias of open().
     * @param {...any} args
     * @returns {this}
     */
    show(...args: any[]): this;
    /**
     * Alias of close().
     * @param {...any} args
     * @returns {this}
     */
    hide(...args: any[]): this;
    /**
     * Alias of isOpen().
     * @returns {boolean}
     */
    isVisible(): boolean;
    /**
     * The pill values, in order.
     * @returns {string[]}
     */
    getValue(): string[];
    /**
     * Replace every pill.
     * @param {string[]} values
     * @returns {this}
     */
    setValue(values: string[]): this;
    /**
     * @param {string} value
     * @param {string} [label] - Default: the value
     * @returns {this}
     */
    addPill(value: string, label?: string): this;
    /**
     * @param {string} value
     * @returns {this}
     */
    removePill(value: string): this;
    /**
     * @param {number} index
     * @returns {this}
     */
    removePillAt(index: number): this;
    /**
     * Remove every pill.
     * @returns {this}
     */
    clear(): this;
    /**
     * @returns {number}
     */
    getCount(): number;
    /**
     * Replace the options.
     * @param {PillboxItem[]} data
     * @returns {this}
     */
    setData(data: PillboxItem[]): this;
    /**
     * @returns {this}
     */
    focus(): this;
    /**
     * @returns {this}
     */
    enable(): this;
    /**
     * @returns {this}
     */
    disable(): this;
}
/**
 * @typedef {'sm'|'md'|'lg'|'xl'|'full'} SlideoverSize
 */
/**
 * @typedef {object} SlideoverOptions
 * @property {'left'|'right'|'top'|'bottom'} [position='right'] - Edge it slides from
 * @property {SlideoverSize|string} [size='lg'] - A preset (sm 25%, md 50%, lg 75%, xl 90%, full), a customSizes key, or a CSS length ('400px', '60%', '30rem')
 * @property {boolean} [backdrop=true]
 * @property {boolean} [backdropClose=true] - A backdrop click closes it
 * @property {boolean} [keyboard=true] - Esc closes it (with closeOnEscape)
 * @property {boolean} [animation=true]
 * @property {number} [animationDuration=300] - ms
 * @property {boolean} [closeOnEscape=true]
 * @property {string} [title=''] - Title (create(): the header text)
 * @property {string|Element} [content=''] - Body (create(): HTML or an element)
 * @property {boolean} [closable=true] - Close button in the header (create())
 * @property {string} [closeIcon='x'] - Domma icon name for it (create())
 * @property {string} [headerClass='']
 * @property {string} [bodyClass='']
 * @property {string} [footerClass='']
 * @property {Record<string, string>} [customSizes={}] - Named sizes, e.g. {wide: '640px'}
 * @property {boolean} [trapFocus=true] - Tab stays in the panel; default off when backdrop is false unless given
 * @property {boolean} [returnFocus=true] - Closing puts focus back where it was
 * @property {((slideover: SlideoverInstance) => boolean|void)|null} [onBeforeOpen] - Return false to keep it closed
 * @property {((slideover: SlideoverInstance) => void)|null} [onOpen]
 * @property {((slideover: SlideoverInstance) => boolean|void)|null} [onBeforeClose] - Return false to keep it open
 * @property {((slideover: SlideoverInstance) => void)|null} [onClose] - Closing (before the animation)
 * @property {((slideover: SlideoverInstance) => void)|null} [onClosed] - After the close animation
 */
/**
 * Options for `E.slideover({...})` / `Slideover.create()`: a new panel at the end of `<body>`.
 * @typedef {SlideoverOptions & {schema?: object, data?: Record<string, any>, onSave?: (formData: Record<string, any>, form: any, slideover: SlideoverInstance) => void}} SlideoverCreateOptions
 */
/**
 * @typedef {Slideover} SlideoverInstance
 */
/**
 * Panel that slides in from an edge of the viewport.
 */
declare class Slideover extends Component {
    /**
     * Open slideovers, oldest first. Escape closes only the last one: every
     * open slideover listens on document, so without this one key press
     * closed the whole stack.
     */
    static _stack: any[];
    /** The top-most slideover that is still open and on the page. */
    static _top(): any;
    /** Drop slideovers that were closed or taken off the page without close(). */
    static _prune(): void;
    static _removeFromStack(instance: any): void;
    static defaults: {
        position: string;
        size: string;
        backdrop: boolean;
        backdropClose: boolean;
        keyboard: boolean;
        animation: boolean;
        animationDuration: number;
        closeOnEscape: boolean;
        title: string;
        content: string;
        closable: boolean;
        closeIcon: string;
        headerClass: string;
        bodyClass: string;
        footerClass: string;
        customSizes: {};
        trapFocus: boolean;
        returnFocus: boolean;
        onBeforeOpen: any;
        onOpen: any;
        onBeforeClose: any;
        onClose: any;
        onClosed: any;
    };
    /**
     * Build a slideover (header, close button, body) at the end of `<body>`. With `schema`, the body
     * is a Domma form built on open, and `onSave` gets its data.
     * @param {SlideoverCreateOptions} [options]
     * @returns {Slideover}
     */
    static create(options?: SlideoverCreateOptions): Slideover;
    /**
     * @param {string|HTMLElement} selector - The panel element
     * @param {SlideoverOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: SlideoverOptions);
    _isOpen: boolean;
    _backdrop: HTMLDivElement;
    _trap: FocusTrap;
    _trapAsked: boolean;
    _originalBodyOverflow: string;
    _keydownHandler: (e: any) => void;
    _init(): void;
    _setupElement(): void;
    _applyPosition(): void;
    _applySize(): void;
    _getSizeValue(): any;
    _applyAnimation(): void;
    _getBoxShadow(): "2px 0 8px rgba(0,0,0,0.15)" | "-2px 0 8px rgba(0,0,0,0.15)" | "0 2px 8px rgba(0,0,0,0.15)" | "0 -2px 8px rgba(0,0,0,0.15)";
    _bindEvents(): void;
    _createBackdrop(): void;
    _showBackdrop(): void;
    _hideBackdrop(): void;
    _getOpenPosition(): {
        left: string;
        right: string;
        top?: undefined;
        bottom?: undefined;
    } | {
        top: string;
        bottom: string;
        left?: undefined;
        right?: undefined;
    };
    /**
     * Open (onBeforeOpen may refuse).
     * @returns {this}
     */
    open(): this;
    /** Whether this open traps focus: on by default, except beside a page left usable (no backdrop). */
    _wantsTrap(): boolean;
    /**
     * Keep Tab inside the panel while it is open. Focus moves to the panel itself (so
     * the first Tab reaches its first control) unless something inside already has it;
     * a caller focusing a field after open() is unaffected.
     */
    _startTrap(): void;
    _addedTabindex: boolean;
    _stopTrap(): void;
    _createForm(): void;
    _formaForm: any;
    /**
     * Close (onBeforeClose may refuse).
     * @returns {this}
     */
    close(): this;
    /**
     * @returns {this}
     */
    toggle(): this;
    /**
     * @returns {boolean}
     */
    isOpen(): boolean;
    /**
     * Alias of open().
     * @param {...any} args
     * @returns {this}
     */
    show(...args: any[]): this;
    /**
     * Alias of close().
     * @param {...any} args
     * @returns {this}
     */
    hide(...args: any[]): this;
    /**
     * Alias of isOpen().
     * @returns {boolean}
     */
    isVisible(): boolean;
    /**
     * @param {string} title - Set as text
     * @returns {this}
     */
    setTitle(title: string): this;
    /**
     * Replace the body: an HTML string (sanitised) or an element.
     * @param {string|Element} content
     * @returns {this}
     */
    setContent(content: string | Element): this;
    /**
     * @param {SlideoverSize|string} size
     * @returns {this}
     */
    setSize(size: SlideoverSize | string): this;
    /**
     * @param {'left'|'right'|'top'|'bottom'} position
     * @returns {this}
     */
    setPosition(position: "left" | "right" | "top" | "bottom"): this;
}
/**
 * @typedef {'planned'|'in-progress'|'completed'|'blocked'|'cancelled'} ProgressionStatus
 */
/**
 * A timeline event or roadmap milestone.
 * @typedef {object} ProgressionItem
 * @property {string|number} [id] - Lets methods find it by id instead of index
 * @property {string} [title]
 * @property {string} [description] - Text (HTML when allowHtml, sanitised)
 * @property {string} [date]
 * @property {string|number} [year] - Timeline marker (default: date)
 * @property {ProgressionStatus|string} [status] - Roadmap status
 * @property {number} [progress] - 0-100, shown for 'in-progress'
 * @property {string} [priority]
 * @property {string[]} [tags]
 * @property {string} [assignee]
 */
/**
 * The loader settings `E.fullscreenLoader()` passes on (the rest are fixed for a full-screen loader).
 * @typedef {Pick<import('./components/loader.js').LoaderOptions, 'type' | 'size' | 'color'>} FullscreenLoaderOptions
 */
/**
 * @typedef {object} ProgressionOptions
 * @property {'timeline'|'roadmap'} [mode='timeline'] - 'timeline' (dated events) or 'roadmap' (items with a status)
 * @property {ProgressionItem[]} [items=[]]
 * @property {'vertical'|'horizontal'|'centered'} [layout='vertical'] - Items down one side, across, or alternating either side of a centre line
 * @property {boolean} [animation=true] - Items animate in
 * @property {number} [animationDelay=100] - ms between items
 * @property {boolean} [responsive=true]
 * @property {'default'|'minimal'|'corporate'|'modern'} [theme='default'] - Look of the markers, line and cards
 * @property {boolean} [clickable=false]
 * @property {((item: ProgressionItem, index: number, element: HTMLElement) => void)|null} [onItemClick]
 * @property {boolean} [allowHtml=false] - HTML in descriptions (sanitised)
 * @property {string} [yearWidth='80px'] - Timeline
 * @property {string} [contentMaxWidth='600px'] - Timeline
 * @property {string} [dateFormat='YYYY'] - Timeline
 * @property {boolean} [showConnector=true] - Timeline
 * @property {boolean} [showProgress=true] - Roadmap: overall progress bar
 * @property {'top'|'bottom'|'none'} [progressPosition='top'] - Roadmap
 * @property {boolean} [statusIcons=true] - Roadmap
 * @property {boolean} [allowStatusChange=false] - Roadmap: status can be changed from the UI
 * @property {((item: ProgressionItem, oldStatus: string|undefined, status: string) => void)|null} [onStatusChange]
 * @property {string|number|null} [currentItem=null] - Roadmap: the current item's id or index
 * @property {boolean} [completedAnimation=true]
 * @property {Partial<Record<ProgressionStatus, string>>} [icons] - Domma icon name per status
 * @property {Partial<Record<ProgressionStatus, string>>} [colors] - CSS colour per status
 */
/**
 * @typedef {Progression} ProgressionInstance
 */
/**
 * Progression Component - Unified timeline and roadmap component
 * Features: Timeline mode (chronological events), Roadmap mode (status-driven milestones)
 * Layouts: vertical, horizontal, centered
 * Backwards compatible with Timeline component
 */
declare class Progression extends Component {
    static defaults: {
        mode: string;
        items: any[];
        layout: string;
        animation: boolean;
        animationDelay: number;
        responsive: boolean;
        theme: string;
        clickable: boolean;
        onItemClick: any;
        allowHtml: boolean;
        yearWidth: string;
        contentMaxWidth: string;
        dateFormat: string;
        showConnector: boolean;
        showProgress: boolean;
        progressPosition: string;
        statusIcons: boolean;
        allowStatusChange: boolean;
        onStatusChange: any;
        currentItem: any;
        completedAnimation: boolean;
        icons: {
            planned: string;
            'in-progress': string;
            completed: string;
            blocked: string;
            cancelled: string;
        };
        colors: {
            planned: string;
            'in-progress': string;
            completed: string;
            blocked: string;
            cancelled: string;
        };
    };
    /**
     * @param {string|HTMLElement} selector - The element to render into
     * @param {ProgressionOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: ProgressionOptions);
    _init(): void;
    _renderItems(): void;
    _renderTimelineItem(item: any, index: any): HTMLDivElement;
    _renderRoadmapItem(item: any, index: any): HTMLDivElement;
    _renderProgressBar(): void;
    _attachEvents(): void;
    _cycleStatus(item: any, index: any): void;
    _animateItems(): void;
    _escapeHtml(text: any): string;
    _sanitizeHtml(html: any): any;
    _renderContent(content: any): any;
    _findItemIndex(indexOrId: any): any;
    /**
     * @param {ProgressionItem[]} items
     * @returns {this}
     */
    setItems(items: ProgressionItem[]): this;
    /**
     * @param {ProgressionItem} item
     * @returns {this}
     */
    addItem(item: ProgressionItem): this;
    /**
     * @returns {ProgressionItem[]}
     */
    getItems(): ProgressionItem[];
    /**
     * A copy of an item, by index or id.
     * @param {number|string} indexOrId
     * @returns {ProgressionItem|null}
     */
    getItem(indexOrId: number | string): ProgressionItem | null;
    /**
     * Merge data into an item.
     * @param {number|string} indexOrId
     * @param {Partial<ProgressionItem>} data
     * @returns {this}
     */
    updateItem(indexOrId: number | string, data: Partial<ProgressionItem>): this;
    /**
     * @param {number|string} indexOrId
     * @returns {this}
     */
    removeItem(indexOrId: number | string): this;
    /**
     * @param {'vertical'|'horizontal'|'centered'} layout
     * @returns {this}
     */
    setLayout(layout: "vertical" | "horizontal" | "centered"): this;
    /**
     * @param {'default'|'minimal'|'corporate'|'modern'} theme
     * @returns {this}
     */
    setTheme(theme: "default" | "minimal" | "corporate" | "modern"): this;
    /**
     * @param {'timeline'|'roadmap'} mode
     * @returns {this}
     */
    setMode(mode: "timeline" | "roadmap"): this;
    /**
     * @returns {'timeline'|'roadmap'}
     */
    getMode(): "timeline" | "roadmap";
    /**
     * Re-render the items.
     * @returns {this}
     */
    refresh(): this;
    /**
     * Roadmap: set an item's status (fires statuschange).
     * @param {number|string} indexOrId
     * @param {ProgressionStatus|string} status
     * @returns {this}
     */
    setStatus(indexOrId: number | string, status: ProgressionStatus | string): this;
    /**
     * @param {number|string} indexOrId
     * @returns {string|null}
     */
    getStatus(indexOrId: number | string): string | null;
    /**
     * @param {ProgressionStatus|string} status
     * @returns {ProgressionItem[]}
     */
    getItemsByStatus(status: ProgressionStatus | string): ProgressionItem[];
    /**
     * Roadmap: mark the current item.
     * @param {number|string} indexOrId
     * @returns {this}
     */
    setCurrent(indexOrId: number | string): this;
    /**
     * @returns {ProgressionItem|null}
     */
    getCurrent(): ProgressionItem | null;
    /**
     * Roadmap: percentage of items completed (0 in timeline mode).
     * @returns {number}
     */
    getProgress(): number;
    /**
     * @param {number|string} indexOrId
     * @returns {this}
     */
    markComplete(indexOrId: number | string): this;
    /**
     * @param {number|string} indexOrId
     * @returns {this}
     */
    markInProgress(indexOrId: number | string): this;
    /**
     * @param {number|string} indexOrId
     * @returns {this}
     */
    markBlocked(indexOrId: number | string): this;
}
/**
 * A drawn stroke, as onBegin / onEnd receive it.
 * @typedef {object} SignatureStroke
 * @property {{x: number, y: number, pressure: number}[]} points
 * @property {string} colour
 * @property {number} width
 */
/**
 * @typedef {object} SignatureOptions
 * @property {number|null} [width=null] - Not read: the pad fills its container
 * @property {number} [height=180] - Canvas height in px
 * @property {string} [penColour='#000000'] - Default pen colour
 * @property {number} [penWidth=2] - Default pen width in px
 * @property {'png'|'svg'} [format='png'] - Export format
 * @property {string} [label='Signature'] - Toolbar label text
 * @property {boolean} [guideLine=true] - Dashed guide line
 * @property {string} [placeholder='Sign here']
 * @property {string[]} [colours] - Colour swatches in the toolbar
 * @property {number[]} [widths=[1, 2, 4]] - Pen widths in the toolbar
 * @property {boolean} [toolbar=true] - Show the toolbar
 * @property {string} [name='signature'] - Name of the hidden input
 * @property {boolean} [disabled=false]
 * @property {boolean} [typeFallback=false] - Draw / Type toggle
 * @property {number} [minStrokeLength=3] - Points needed to keep a stroke
 * @property {boolean} [respectMotionPreference=true] - Honour prefers-reduced-motion
 * @property {((base64: string) => void)|null} [onChange] - The signature changed - receives the data URL ('' when empty)
 * @property {(() => void)|null} [onClear]
 * @property {((stroke: SignatureStroke) => void)|null} [onBegin] - A stroke began
 * @property {((stroke: SignatureStroke) => void)|null} [onEnd] - A stroke ended
 */
/**
 * @typedef {Signature} SignatureInstance
 */
/**
 * Signature capture pad on a canvas, with an optional typed fallback.
 */
declare class Signature extends Component {
    static defaults: {
        width: any;
        height: number;
        penColour: string;
        penWidth: number;
        format: string;
        label: string;
        guideLine: boolean;
        placeholder: string;
        colours: string[];
        widths: number[];
        toolbar: boolean;
        name: string;
        disabled: boolean;
        typeFallback: boolean;
        minStrokeLength: number;
        respectMotionPreference: boolean;
        onChange: any;
        onClear: any;
        onBegin: any;
        onEnd: any;
    };
    /**
     * @param {string|HTMLElement} selector - The container
     * @param {SignatureOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: SignatureOptions);
    _strokes: any[];
    _undoneStrokes: any[];
    _currentStroke: {
        points: {
            x: number;
            y: number;
            pressure: any;
        }[];
        colour: any;
        width: any;
    };
    _mode: string;
    _isDrawing: boolean;
    _currentColour: any;
    _currentWidth: any;
    _resizeObserver: ResizeObserver;
    _canvas: Element;
    _ctx: any;
    _canvasW: number;
    _canvasH: number;
    _dpr: number;
    _esc(str: any): string;
    _render(): void;
    _wrapper: Element;
    _placeholder: Element;
    _statusEl: Element;
    _hiddenInput: Element;
    _typeInput: Element;
    _initCanvas(): void;
    _scaleCanvas(): void;
    _initEvents(): void;
    _onPointerDown(e: any): void;
    _onPointerMove(e: any): void;
    _onPointerUp(e: any): void;
    _getPoint(e: any): {
        x: number;
        y: number;
    };
    _redraw(): void;
    _redrawCurrentStroke(): void;
    _drawStroke(ctx: any, stroke: any, w: any, h: any): void;
    _updateState(): void;
    _setColour(colour: any): void;
    _setPenWidth(width: any): void;
    _setMode(mode: any): void;
    _renderTypeToCanvas(): void;
    _updateHiddenInput(): void;
    /**
     * Export the signature as a base64 data URL.
     * @param {'png'|'svg'} [format] - Override the instance format: 'png' or 'svg'
     * @returns {string} Base64-encoded data URL
     */
    toBase64(format?: "png" | "svg"): string;
    _toSVGBase64(): string;
    /**
     * Check whether the pad contains any drawn content.
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Clear the signature. Undoable unless silent=true.
     * @param {boolean} [silent=false]
     */
    clear(silent?: boolean): void;
    /**
     * Undo the last stroke.
     */
    undo(): void;
    /**
     * Redo the last undone stroke.
     */
    redo(): void;
    /**
     * Disable the signature pad.
     */
    disable(): void;
    /**
     * Enable the signature pad.
     */
    enable(): void;
}
/**
 * @typedef {object} DatePickerOptions
 * @property {string|Date|null} [value=null] - Initial date; null reads the input
 * @property {string} [format='YYYY-MM-DD'] - What the input shows (YYYY YY MMMM MMM MM M DDDD DDD DD D); the value stays ISO
 * @property {string|Date|null} [min=null] - Earliest selectable date
 * @property {string|Date|null} [max=null] - Latest selectable date
 * @property {number} [firstDay=1] - First day of the week: 0 Sunday, 1 Monday
 * @property {((date: Date) => boolean)|null} [disabledDates=null] - true means unavailable
 * @property {boolean} [openOnFocus=true]
 * @property {boolean} [closeOnSelect=true]
 * @property {boolean} [closeOnClickOutside=true]
 * @property {boolean} [closeOnEscape=true]
 * @property {boolean} [clearable=true] - Clear button
 * @property {boolean} [todayButton=true]
 * @property {boolean} [readonlyInput=false] - Stop typing; only the calendar sets it
 * @property {boolean} [inline=false] - Render in place instead of as a popup
 * @property {DropdownPosition} [position='bottom-start'] - Popup position
 * @property {[number, number]} [offset=[0, 4]] - Popup offset [x, y]
 * @property {boolean} [weekNumbers=false] - ISO week numbers
 * @property {string|null} [placeholder=null] - Default: the format
 * @property {((value: string, date: Date|null, picker: DatePickerInstance) => void)|null} [onChange] - ISO value ('' when cleared)
 * @property {((picker: DatePickerInstance) => boolean|void)|null} [onBeforeOpen] - Return false to keep it closed
 * @property {((picker: DatePickerInstance) => void)|null} [onOpen]
 * @property {((picker: DatePickerInstance) => boolean|void)|null} [onBeforeClose] - Return false to keep it open
 * @property {((picker: DatePickerInstance) => void)|null} [onClose]
 */
/**
 * @typedef {DatePicker} DatePickerInstance
 */
/**
 * A calendar, attached to an input.
 *
 * ## Why this exists
 *
 * `<input type="date">` is a different control in every engine, cannot be
 * themed at all, and writes a string that `M.types.date` then refuses - which
 * is why a Forma field declared `type: 'date'` could never be submitted. This
 * is one control everywhere, built from `--dm-*` tokens so it takes the host's
 * theme, and it writes the same ISO string a model expects.
 *
 * ## Contract with the input
 *
 * The INPUT keeps the value; the popup only edits it. So `data-model`,
 * `form.getData()`, a `name` in a real form and anything else reading the
 * element keep working, and every change dispatches `input` and `change`
 * exactly as typing would - without which a bound model would never hear about
 * a click on the calendar.
 *
 * The stored value is ISO `YYYY-MM-DD` and `getValue()` always returns that.
 * `format` changes what is DISPLAYED; when it differs from ISO the element
 * carries the real value in `data-date` as well, because the displayed text is
 * then no longer the value.
 */
declare class DatePicker extends Component {
    static defaults: {
        value: any;
        format: string;
        min: any;
        max: any;
        firstDay: number;
        disabledDates: any;
        openOnFocus: boolean;
        closeOnSelect: boolean;
        closeOnClickOutside: boolean;
        closeOnEscape: boolean;
        clearable: boolean;
        todayButton: boolean;
        readonlyInput: boolean;
        inline: boolean;
        position: string;
        offset: number[];
        weekNumbers: boolean;
        placeholder: any;
        onChange: any;
        onBeforeOpen: any;
        onOpen: any;
        onBeforeClose: any;
        onClose: any;
    };
    /** Only one popup is ever open, exactly as with a dropdown. */
    static _open: any;
    /**
     * @param {string|HTMLElement} selector - The input to attach to
     * @param {DatePickerOptions} [options]
     */
    constructor(selector: string | HTMLElement, options?: DatePickerOptions);
    _panel: HTMLDivElement;
    _isOpen: boolean;
    _value: any;
    _view: any;
    _focused: any;
    _init(): void;
    /**
     * The ISO date currently held, or ''.
     * @returns {string}
     */
    getValue(): string;
    /**
     * The Date currently held, or null.
     * @returns {Date|null}
     */
    getDate(): Date | null;
    /**
     * @param   {string|Date|null} value
     * @param   {{silent?: boolean, fromInput?: boolean}} [options]
     * @returns {this}
     */
    setValue(value: string | Date | null, { silent, fromInput }?: {
        silent?: boolean;
        fromInput?: boolean;
    }): this;
    _suppress: boolean;
    /** @returns {this} */
    clear(): this;
    _renderInput(): void;
    _min(): Date;
    _max(): Date;
    /** Pull a date inside min/max, or null if there is no date. */
    _clamp(date: any): any;
    /** Is this day off limits? */
    _disabled(date: any): boolean;
    _buildPanel(): void;
    _grid: HTMLDivElement;
    _foot: HTMLDivElement;
    _monthSelect: HTMLSelectElement;
    _yearSelect: HTMLSelectElement;
    _shiftMonth(delta: any): void;
    /** Redraw the month on screen. */
    _paint(): void;
    _paintFoot(): void;
    /** ISO week number, for `weekNumbers`. */
    _weekNumber(date: any): number;
    /** @returns {this} */
    open(): this;
    _onOutside: (e: any) => void;
    _onReposition: () => void;
    /**
     * @param   {{focus?: boolean}} [options] - focus true returns the caret to the input
     * @returns {this}
     */
    close({ focus }?: {
        focus?: boolean;
    }): this;
    /** @returns {this} */
    toggle(): this;
    /** @returns {boolean} */
    isOpen(): boolean;
    /**
     * Alias of open().
     * @param {...any} args
     * @returns {this}
     */
    show(...args: any[]): this;
    /**
     * Alias of close().
     * @param {...any} args
     * @returns {this}
     */
    hide(...args: any[]): this;
    /**
     * Alias of isOpen().
     * @returns {boolean}
     */
    isVisible(): boolean;
    _position(): void;
    _onInputKey(e: any): void;
    _onPanelKey(e: any): void;
    /** Move the keyboard cursor, following it into the next month if need be. */
    _moveFocus(date: any): void;
}
import Component from './component.js';
export { TreeView, ContextMenu, Sortable, InputGroup, Popover, FocusTrap, CommandPalette, SplitPane, VirtualList, Dropzone, RangeSlider };
