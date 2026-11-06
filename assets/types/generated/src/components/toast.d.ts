/**
 * Show a toast.
 * @param {string|Node|ToastOptions} message - the text (or `{message, ...options}`)
 * @param {ToastOptions} [options]
 * @returns {Toast}
 */
export function showToast(message: string | Node | ToastOptions, options?: ToastOptions): Toast;
/**
 * An action button in a toast.
 * @typedef {object} ToastAction
 * @property {string} [label='OK'] - Button label (`text` is accepted too)
 * @property {string} [text] - Alias of `label`
 * @property {(event: MouseEvent, toast: ToastInstance) => void} [onClick] - Click handler
 * @property {boolean} [closeOnClick=true] - Close toast on click
 * @property {boolean} [primary] - Primary style
 */
/**
 * @typedef {object} ToastOptions
 * @property {string|Node} [message] - The message (text unless `html: true`)
 * @property {string} [title] - Toast title
 * @property {import('../elements.js').ToastType} [type='default'] - Toast type
 * @property {import('../elements.js').ToastPosition} [position='top-right'] - Toast position
 * @property {number} [duration=3000] - Auto-dismiss duration in ms (0 = no auto-dismiss)
 * @property {boolean} [pauseOnHover=true] - Pause countdown on hover
 * @property {boolean} [showProgress=true] - Show progress bar
 * @property {'slide'|'fade'|(string & {})} [animation='slide'] - Animation style
 * @property {number} [animationDuration=300] - Animation duration in ms
 * @property {boolean} [closable=true] - Show close button
 * @property {boolean} [html=false] - The message is HTML (sanitised unless `safe: false`)
 * @property {boolean} [safe=true] - Sanitise HTML message / icon
 * @property {string|Node|null} [icon] - Icon name (data-icon), HTML string or Node; the typed helpers default to the type's icon
 * @property {ToastAction[]} [actions] - Action buttons
 * @property {ToastAction} [action] - One action button (used when `actions` is empty)
 * @property {number} [maxToasts=5] - Maximum number of toasts on screen; the oldest closes
 * @property {string} [className] - Extra classes on the toast
 * @property {((toast: ToastInstance) => void)|null} [onShow] - When the toast shows
 * @property {((toast: ToastInstance) => void)|null} [onClose] - After the exit animation, just before removal
 * @property {((toast: ToastInstance) => void)|null} [onPause] - The countdown paused (hover)
 * @property {((toast: ToastInstance) => void)|null} [onResume] - The countdown resumed
 * @property {((detail: {action: ToastAction, index: number}, toast: ToastInstance) => void)|null} [onAction] - An action button was clicked
 */
/** @typedef {Toast} ToastInstance */
/**
 * E.toast: show a toast, with typed helpers.
 * @typedef {((message: string|Node|ToastOptions, options?: ToastOptions) => ToastInstance) & {
 *     show(message: string|Node|ToastOptions, options?: ToastOptions): ToastInstance,
 *     success(message: string|Node, options?: ToastOptions): ToastInstance,
 *     error(message: string|Node, options?: ToastOptions): ToastInstance,
 *     warning(message: string|Node, options?: ToastOptions): ToastInstance,
 *     info(message: string|Node, options?: ToastOptions): ToastInstance,
 *     closeAll(): void
 * }} ToastStatic
 */
export class Toast extends Component {
    static defaults: {
        message: string;
        title: string;
        type: string;
        position: string;
        duration: number;
        pauseOnHover: boolean;
        showProgress: boolean;
        animation: string;
        animationDuration: number;
        closable: boolean;
        html: boolean;
        safe: boolean;
        icon: string;
        actions: never[];
        maxToasts: number;
        className: string;
        onShow: null;
        onClose: null;
        onPause: null;
        onResume: null;
        onAction: null;
    };
    /**
     * @param {string|Node} [message]
     * @param {ToastOptions} [options]
     */
    constructor(message?: string | Node, options?: ToastOptions);
    _visible: boolean;
    _timer: number | null;
    _remaining: number;
    _started: number;
    _paused: boolean;
    _render(): void;
    _titleEl: HTMLDivElement | undefined;
    _messageEl: HTMLDivElement | undefined;
    _actionsEl: HTMLDivElement | undefined;
    _bar: HTMLDivElement | null | undefined;
    _writeMessage(): void;
    _renderActions(): void;
    _bind(): void;
    _startTimer(): void;
    _pause(): void;
    _resume(): void;
    /**
     * Put the toast on screen (E.toast() does this).
     * @returns {this}
     */
    open(): this;
    /**
     * Close the toast (removed after the exit animation).
     * @returns {this}
     */
    close(): this;
    /**
     * Permanent alias of open(), by name.
     * @returns {this}
     */
    show(...args: any[]): this;
    /**
     * Permanent alias of close(), by name.
     * @returns {this}
     */
    hide(...args: any[]): this;
    /** @returns {this} */
    toggle(): this;
    /** @returns {boolean} */
    isVisible(): boolean;
    /** @returns {boolean} */
    isOpen(): boolean;
    /**
     * Update the message.
     * @param {string|Node} message
     * @returns {this}
     */
    setMessage(message: string | Node): this;
    /**
     * @param {string} title - Empty hides the title
     * @returns {this}
     */
    setTitle(title: string): this;
    /**
     * @param {import('../elements.js').ToastType} type
     * @returns {this}
     */
    setType(type: import("../elements.js").ToastType): this;
    /**
     * @param {ToastAction[]|null} actions
     * @returns {this}
     */
    setActions(actions: ToastAction[] | null): this;
    _applyOptions(): void;
}
/**
 * The E.toast function with its statics.
 * @type {ToastStatic}
 */
export const toast: ToastStatic;
export default Toast;
/**
 * An action button in a toast.
 */
export type ToastAction = {
    /**
     * - Button label (`text` is accepted too)
     */
    label?: string | undefined;
    /**
     * - Alias of `label`
     */
    text?: string | undefined;
    /**
     * - Click handler
     */
    onClick?: ((event: MouseEvent, toast: ToastInstance) => void) | undefined;
    /**
     * - Close toast on click
     */
    closeOnClick?: boolean | undefined;
    /**
     * - Primary style
     */
    primary?: boolean | undefined;
};
export type ToastOptions = {
    /**
     * - The message (text unless `html: true`)
     */
    message?: string | Node | undefined;
    /**
     * - Toast title
     */
    title?: string | undefined;
    /**
     * - Toast type
     */
    type?: import("../elements.js").ToastType | undefined;
    /**
     * - Toast position
     */
    position?: import("../elements.js").ToastPosition | undefined;
    /**
     * - Auto-dismiss duration in ms (0 = no auto-dismiss)
     */
    duration?: number | undefined;
    /**
     * - Pause countdown on hover
     */
    pauseOnHover?: boolean | undefined;
    /**
     * - Show progress bar
     */
    showProgress?: boolean | undefined;
    /**
     * - Animation style
     */
    animation?: (string & {}) | "fade" | "slide" | undefined;
    /**
     * - Animation duration in ms
     */
    animationDuration?: number | undefined;
    /**
     * - Show close button
     */
    closable?: boolean | undefined;
    /**
     * - The message is HTML (sanitised unless `safe: false`)
     */
    html?: boolean | undefined;
    /**
     * - Sanitise HTML message / icon
     */
    safe?: boolean | undefined;
    /**
     * - Icon name (data-icon), HTML string or Node; the typed helpers default to the type's icon
     */
    icon?: string | Node | null | undefined;
    /**
     * - Action buttons
     */
    actions?: ToastAction[] | undefined;
    /**
     * - One action button (used when `actions` is empty)
     */
    action?: ToastAction | undefined;
    /**
     * - Maximum number of toasts on screen; the oldest closes
     */
    maxToasts?: number | undefined;
    /**
     * - Extra classes on the toast
     */
    className?: string | undefined;
    /**
     * - When the toast shows
     */
    onShow?: ((toast: ToastInstance) => void) | null | undefined;
    /**
     * - After the exit animation, just before removal
     */
    onClose?: ((toast: ToastInstance) => void) | null | undefined;
    /**
     * - The countdown paused (hover)
     */
    onPause?: ((toast: ToastInstance) => void) | null | undefined;
    /**
     * - The countdown resumed
     */
    onResume?: ((toast: ToastInstance) => void) | null | undefined;
    /**
     * - An action button was clicked
     */
    onAction?: ((detail: {
        action: ToastAction;
        index: number;
    }, toast: ToastInstance) => void) | null | undefined;
};
export type ToastInstance = Toast;
/**
 * E.toast: show a toast, with typed helpers.
 */
export type ToastStatic = ((message: string | Node | ToastOptions, options?: ToastOptions) => ToastInstance) & {
    show(message: string | Node | ToastOptions, options?: ToastOptions): ToastInstance;
    success(message: string | Node, options?: ToastOptions): ToastInstance;
    error(message: string | Node, options?: ToastOptions): ToastInstance;
    warning(message: string | Node, options?: ToastOptions): ToastInstance;
    info(message: string | Node, options?: ToastOptions): ToastInstance;
    closeAll(): void;
};
import Component from '../component.js';
