/**
 * A new modal in the shared dialog container.
 * @param {ModalOptions} [options]
 * @returns {Modal}
 */
export function createModal(options?: ModalOptions): Modal;
/**
 * Open a new modal and resolve with the id of the button that closed it
 * (null when it was closed another way - X, backdrop or Escape).
 * @param {ModalOptions} [options]
 * @returns {Promise<string|null>}
 */
export function showModal(options?: ModalOptions): Promise<string | null>;
/**
 * A footer button.
 * @typedef {object} ModalButton
 * @property {string} [id] - Passed to onButtonClick (default `btn-<index>`)
 * @property {string} [text='Button'] - Label
 * @property {string} [variant='secondary'] - Adds `btn-<variant>`
 * @property {string} [className] - Extra classes
 * @property {boolean} [close=true] - false keeps the modal open after the click
 * @property {(modal: ModalInstance, event: MouseEvent) => void} [onClick]
 */
/**
 * @typedef {object} ModalOptions
 * @property {boolean} [backdrop=true] - Show backdrop overlay
 * @property {boolean} [backdropClose=true] - Close modal when clicking backdrop
 * @property {boolean} [keyboard=true] - Close modal on Escape key
 * @property {boolean} [closeOnEscape=true] - Same as `keyboard`; either false keeps Escape from closing
 * @property {import('../elements.js').AnimationType|false} [animation='fade'] - Animation type
 * @property {number} [animationDuration=300] - Animation duration in ms
 * @property {boolean} [closeButton=true] - Show close button
 * @property {'small'|'sm'|'medium'|'md'|'large'|'lg'|'xl'|'xlarge'|'full'|(string & {})} [size='medium'] - A named size or any CSS width (the factory's default is 'large')
 * @property {boolean} [centered=true] - Centre vertically (false: near the top)
 * @property {boolean} [scrollable=false] - Scroll the body inside a capped height
 * @property {string} [title] - Title text
 * @property {string|Node} [content] - Body content (factory mode): HTML (sanitised unless `safe: false`) or a Node
 * @property {string} [footer] - Footer text
 * @property {ModalButton[]} [buttons] - Footer buttons (the factory's default is one Close button)
 * @property {boolean} [safe=true] - false: content is trusted HTML (not sanitised)
 * @property {string} [className] - Extra classes on the dialog
 * @property {string} [headerClass] - Extra classes on the header
 * @property {string} [bodyClass] - Extra classes on the body
 * @property {string} [footerClass] - Extra classes on the footer
 * @property {boolean} [focus=true] - Focus the dialog on open
 * @property {boolean} [trapFocus=true] - Keep Tab inside while open (default true; false without a backdrop unless given)
 * @property {boolean} [returnFocus=true] - Put focus back where it was on close
 * @property {boolean} [visible=false] - Open at once
 * @property {((modal: ModalInstance) => void)|null} [onOpen] - When opening starts
 * @property {((modal: ModalInstance) => void)|null} [onOpened] - After open animation completes
 * @property {((modal: ModalInstance) => void)|null} [onClose] - When closing starts
 * @property {((modal: ModalInstance) => void)|null} [onClosed] - After close animation completes
 * @property {((modal: ModalInstance) => boolean|void)|null} [onBeforeOpen] - Return false to refuse the open
 * @property {((modal: ModalInstance) => boolean|void)|null} [onBeforeClose] - Return false to refuse the close
 * @property {((buttonId: string, modal: ModalInstance) => void)|null} [onButtonClick] - A footer button was clicked
 */
/** @typedef {Modal} ModalInstance */
export class Modal extends Component {
    static defaults: {
        backdrop: boolean;
        backdropClose: boolean;
        keyboard: boolean;
        closeOnEscape: boolean;
        animation: string;
        animationDuration: number;
        closeButton: boolean;
        size: string;
        centered: boolean;
        scrollable: boolean;
        title: string;
        content: string;
        footer: string;
        buttons: never[];
        safe: boolean;
        className: string;
        headerClass: string;
        bodyClass: string;
        footerClass: string;
        focus: boolean;
        trapFocus: boolean;
        returnFocus: boolean;
        visible: boolean;
        onOpen: null;
        onOpened: null;
        onClose: null;
        onClosed: null;
        onBeforeOpen: null;
        onBeforeClose: null;
        onButtonClick: null;
    };
    /**
     * @param {import('./shared.js').ComponentTarget} selector - the element to make a modal; null makes one
     * @param {ModalOptions} [options]
     */
    constructor(selector: import("./shared.js").ComponentTarget, options?: ModalOptions);
    _factoryMade: boolean;
    _isOpen: boolean;
    _timers: any[];
    _restoreFocus: Element | null;
    _given: ModalOptions;
    _init(): void;
    _authored: boolean | undefined;
    _host: HTMLElement | HTMLDivElement | null | undefined;
    _addedClasses: string[] | undefined;
    _addedAttrs: any[] | undefined;
    /** Whether this open traps focus: on by default, except over a page left usable (no backdrop). */
    _wantsTrap(): boolean;
    _startTrap(): void;
    _trap: FocusTrap | null | undefined;
    /** Options the caller passed, without the defaults. */
    _givenOptions(): ModalOptions;
    _render(): void;
    _backdrop: HTMLDivElement | null | undefined;
    _dialog: HTMLDivElement | undefined;
    _titleEl: HTMLHeadingElement | undefined;
    _header: HTMLDivElement | undefined;
    _body: HTMLDivElement | undefined;
    _footer: HTMLDivElement | undefined;
    _footerText: HTMLSpanElement | null | undefined;
    _renderButtons(): void;
    _bind(): void;
    _downOnBackdrop: boolean | undefined;
    /** A node is ours unless it sits inside another modal nested in this one. */
    _ownsNode(node: any): boolean;
    _later(fn: any, ms: any): void;
    _clearTimers(): void;
    _duration(): number;
    /**
     * Open the modal.
     * @returns {this}
     */
    open(): this;
    /**
     * Close the modal (a `beforeclose` handler can refuse).
     * @returns {this}
     */
    close(): this;
    /**
     * Toggle modal visibility.
     * @returns {this}
     */
    toggle(): this;
    /**
     * Whether the modal is open.
     * @returns {boolean}
     */
    isOpen(): boolean;
    /**
     * Permanent alias: delegates to open() by name, so a replaced open() is honoured.
     * @returns {this}
     */
    show(...args: any[]): this;
    /**
     * Permanent alias: delegates to close() by name.
     * @returns {this}
     */
    hide(...args: any[]): this;
    /**
     * Replace the title; empty hides it.
     * @param {string|null} title
     * @returns {this}
     */
    setTitle(title: string | null): this;
    /**
     * Replace the body content (the element's children other than a footer slot).
     * A string is HTML, sanitised unless `{safe: false}`; a Node is appended.
     * @param {string|Node|null} content
     * @param {{safe?: boolean}} [opts]
     * @returns {this}
     */
    setContent(content: string | Node | null, opts?: {
        safe?: boolean;
    }): this;
    /**
     * Replace the footer buttons.
     * @param {ModalButton[]|null} buttons
     * @returns {this}
     */
    setButtons(buttons: ModalButton[] | null): this;
    _applyOptions(): void;
    _destroyed: boolean | undefined;
    /**
     * Permanent alias of destroy().
     * @returns {void}
     */
    remove(...args: any[]): void;
}
export default Modal;
/**
 * A footer button.
 */
export type ModalButton = {
    /**
     * - Passed to onButtonClick (default `btn-<index>`)
     */
    id?: string | undefined;
    /**
     * - Label
     */
    text?: string | undefined;
    /**
     * - Adds `btn-<variant>`
     */
    variant?: string | undefined;
    /**
     * - Extra classes
     */
    className?: string | undefined;
    /**
     * - false keeps the modal open after the click
     */
    close?: boolean | undefined;
    onClick?: ((modal: ModalInstance, event: MouseEvent) => void) | undefined;
};
export type ModalOptions = {
    /**
     * - Show backdrop overlay
     */
    backdrop?: boolean | undefined;
    /**
     * - Close modal when clicking backdrop
     */
    backdropClose?: boolean | undefined;
    /**
     * - Close modal on Escape key
     */
    keyboard?: boolean | undefined;
    /**
     * - Same as `keyboard`; either false keeps Escape from closing
     */
    closeOnEscape?: boolean | undefined;
    /**
     * - Animation type
     */
    animation?: false | import("../elements.js").AnimationType | undefined;
    /**
     * - Animation duration in ms
     */
    animationDuration?: number | undefined;
    /**
     * - Show close button
     */
    closeButton?: boolean | undefined;
    /**
     * - A named size or any CSS width (the factory's default is 'large')
     */
    size?: (string & {}) | "small" | "sm" | "md" | "lg" | "xl" | "medium" | "large" | "xlarge" | "full" | undefined;
    /**
     * - Centre vertically (false: near the top)
     */
    centered?: boolean | undefined;
    /**
     * - Scroll the body inside a capped height
     */
    scrollable?: boolean | undefined;
    /**
     * - Title text
     */
    title?: string | undefined;
    /**
     * - Body content (factory mode): HTML (sanitised unless `safe: false`) or a Node
     */
    content?: string | Node | undefined;
    /**
     * - Footer text
     */
    footer?: string | undefined;
    /**
     * - Footer buttons (the factory's default is one Close button)
     */
    buttons?: ModalButton[] | undefined;
    /**
     * - false: content is trusted HTML (not sanitised)
     */
    safe?: boolean | undefined;
    /**
     * - Extra classes on the dialog
     */
    className?: string | undefined;
    /**
     * - Extra classes on the header
     */
    headerClass?: string | undefined;
    /**
     * - Extra classes on the body
     */
    bodyClass?: string | undefined;
    /**
     * - Extra classes on the footer
     */
    footerClass?: string | undefined;
    /**
     * - Focus the dialog on open
     */
    focus?: boolean | undefined;
    /**
     * - Keep Tab inside while open (default true; false without a backdrop unless given)
     */
    trapFocus?: boolean | undefined;
    /**
     * - Put focus back where it was on close
     */
    returnFocus?: boolean | undefined;
    /**
     * - Open at once
     */
    visible?: boolean | undefined;
    /**
     * - When opening starts
     */
    onOpen?: ((modal: ModalInstance) => void) | null | undefined;
    /**
     * - After open animation completes
     */
    onOpened?: ((modal: ModalInstance) => void) | null | undefined;
    /**
     * - When closing starts
     */
    onClose?: ((modal: ModalInstance) => void) | null | undefined;
    /**
     * - After close animation completes
     */
    onClosed?: ((modal: ModalInstance) => void) | null | undefined;
    /**
     * - Return false to refuse the open
     */
    onBeforeOpen?: ((modal: ModalInstance) => boolean | void) | null | undefined;
    /**
     * - Return false to refuse the close
     */
    onBeforeClose?: ((modal: ModalInstance) => boolean | void) | null | undefined;
    /**
     * - A footer button was clicked
     */
    onButtonClick?: ((buttonId: string, modal: ModalInstance) => void) | null | undefined;
};
export type ModalInstance = Modal;
import Component from '../component.js';
import FocusTrap from './focus-trap.js';
