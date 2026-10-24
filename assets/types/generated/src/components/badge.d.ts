/**
 * @typedef {object} BadgeOptions
 * @property {import('../elements.js').BadgeVariant} [variant='primary'] - Badge variant/colour
 * @property {import('../elements.js').BadgeSize|'sm'|'lg'} [size='medium'] - Badge size
 * @property {boolean} [pill=false] - Use pill/rounded style
 * @property {boolean} [outline=false] - Use outline style
 * @property {boolean} [removable=false] - Show remove button
 * @property {boolean} [pulse=false] - Pulse animation
 * @property {((event: MouseEvent, badge: BadgeInstance) => void)|null} [onClick] - Callback on click (not the remove button)
 * @property {((badge: BadgeInstance, event: MouseEvent) => boolean|void)|null} [onRemove] - Callback on remove; return false to keep the badge
 */
/** @typedef {Badge} BadgeInstance */
export class Badge extends Component {
    static defaults: {
        variant: string;
        size: string;
        pill: boolean;
        outline: boolean;
        removable: boolean;
        pulse: boolean;
        onClick: any;
        onRemove: any;
    };
    /**
     * @param {import('./shared.js').ComponentTarget} selector
     * @param {BadgeOptions} [options]
     */
    constructor(selector: import("./shared.js").ComponentTarget, options?: BadgeOptions);
    _had: Set<string>;
    _apply(): void;
    _removeBtn: HTMLButtonElement;
    _applyOptions(): void;
    /**
     * Set the badge variant.
     * @param {import('../elements.js').BadgeVariant} variant
     * @returns {this}
     */
    setVariant(variant: import("../elements.js").BadgeVariant): this;
    /**
     * Set the badge size.
     * @param {import('../elements.js').BadgeSize|'sm'|'lg'} size
     * @returns {this}
     */
    setSize(size: import("../elements.js").BadgeSize | "sm" | "lg"): this;
    /**
     * Replace the text, keeping the remove button.
     * @param {string|number|null} text
     * @returns {this}
     */
    setText(text: string | number | null): this;
    /**
     * Permanent alias of destroy() (the element stays in the page).
     * @returns {void}
     */
    remove(...args: any[]): void;
}
/** @typedef {'primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark'} NumberBadgeVariant */
/**
 * @typedef {object} NumberBadgeOptions
 * @property {number} [count=0] - Initial count to display (0 hides the counter unless `dot`)
 * @property {number|null} [max] - Cap, e.g. 99 shows "99+"
 * @property {NumberBadgeVariant} [variant='danger'] - Colour variant
 * @property {boolean} [dot=false] - Show as dot indicator instead of number
 * @property {boolean} [pulse=false] - Enable pulse animation
 * @property {string|null} [borderColor] - Custom border ring colour
 * @property {string|null} [label] - Accessible name (default: the count, or "New" for a dot)
 * @property {((count: number, previous: number, badge: NumberBadgeInstance) => void)|null} [onChange] - The count changed
 */
/** @typedef {NumberBadge} NumberBadgeInstance */
export class NumberBadge extends Component {
    static defaults: {
        count: number;
        max: any;
        variant: string;
        dot: boolean;
        pulse: boolean;
        borderColor: any;
        label: any;
        onChange: any;
    };
    /**
     * @param {import('./shared.js').ComponentTarget} selector - The element the counter sits on
     * @param {NumberBadgeOptions} [options]
     */
    constructor(selector: import("./shared.js").ComponentTarget, options?: NumberBadgeOptions);
    _holder: HTMLElement;
    _hostClassAdded: boolean;
    /** The `.badge-counter` span. @type {HTMLSpanElement} */
    counter: HTMLSpanElement;
    _paint(): void;
    _applyOptions(): void;
    /**
     * Set the badge count.
     * @param {number} count
     * @returns {this}
     */
    setCount(count: number): this;
    /**
     * Increment the badge count.
     * @param {number} [by=1]
     * @returns {this}
     */
    increment(by?: number): this;
    /**
     * Decrement the badge count (min 0).
     * @param {number} [by=1]
     * @returns {this}
     */
    decrement(by?: number): this;
    /** @returns {number} The current count */
    getCount(): number;
    /**
     * Toggle dot mode.
     * @param {boolean} dot
     * @returns {this}
     */
    setDot(dot: boolean): this;
    /**
     * Set the colour variant.
     * @param {NumberBadgeVariant} variant
     * @returns {this}
     */
    setVariant(variant: NumberBadgeVariant): this;
    /**
     * Toggle pulse animation.
     * @param {boolean} pulse
     * @returns {this}
     */
    setPulse(pulse: boolean): this;
    /**
     * Permanent alias of destroy() (the element stays in the page).
     * @returns {void}
     */
    remove(...args: any[]): void;
}
export default Badge;
export type BadgeOptions = {
    /**
     * - Badge variant/colour
     */
    variant?: import("../elements.js").BadgeVariant;
    /**
     * - Badge size
     */
    size?: import("../elements.js").BadgeSize | "sm" | "lg";
    /**
     * - Use pill/rounded style
     */
    pill?: boolean;
    /**
     * - Use outline style
     */
    outline?: boolean;
    /**
     * - Show remove button
     */
    removable?: boolean;
    /**
     * - Pulse animation
     */
    pulse?: boolean;
    /**
     * - Callback on click (not the remove button)
     */
    onClick?: ((event: MouseEvent, badge: BadgeInstance) => void) | null;
    /**
     * - Callback on remove; return false to keep the badge
     */
    onRemove?: ((badge: BadgeInstance, event: MouseEvent) => boolean | void) | null;
};
export type BadgeInstance = Badge;
export type NumberBadgeVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
export type NumberBadgeOptions = {
    /**
     * - Initial count to display (0 hides the counter unless `dot`)
     */
    count?: number;
    /**
     * - Cap, e.g. 99 shows "99+"
     */
    max?: number | null;
    /**
     * - Colour variant
     */
    variant?: NumberBadgeVariant;
    /**
     * - Show as dot indicator instead of number
     */
    dot?: boolean;
    /**
     * - Enable pulse animation
     */
    pulse?: boolean;
    /**
     * - Custom border ring colour
     */
    borderColor?: string | null;
    /**
     * - Accessible name (default: the count, or "New" for a dot)
     */
    label?: string | null;
    /**
     * - The count changed
     */
    onChange?: ((count: number, previous: number, badge: NumberBadgeInstance) => void) | null;
};
export type NumberBadgeInstance = NumberBadge;
import Component from '../component.js';
