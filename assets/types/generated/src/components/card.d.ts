/**
 * @typedef {object} CardOptions
 * @property {boolean} [hoverable=true] - Enable hover effects (`hover` is accepted as an alias)
 * @property {boolean} [hover] - Alias of `hoverable`
 * @property {import('../elements.js').ShadowSize|'sm'|'lg'} [shadow='medium'] - Shadow size
 * @property {boolean} [rounded=true] - Apply border radius (false gives square corners)
 * @property {boolean} [animation=true] - Enable animations
 * @property {number} [animationDuration=200] - Animation duration in ms
 * @property {boolean} [collapsible=false] - Clicking the header collapses/expands the body
 * @property {boolean} [collapsed=false] - Start collapsed (a saved state wins)
 * @property {string|null} [persistKey] - Storage key for the collapsed state (default `domma-card-<id>` when the card has an id)
 * @property {string} [title] - Adds a `.card-header` with this title when the card has none
 * @property {string} [icon] - Icon name shown before the title
 * @property {string|Node} [content] - Body content: HTML (sanitised unless `safe: false`) or a Node
 * @property {boolean} [safe=true] - Sanitise string content
 * @property {boolean} [clickable=false] - Clickable style (also on when `onClick` is given)
 * @property {string|null} [color] - Colour variant, e.g. 'primary' adds `.card-primary`
 * @property {((card: CardInstance) => void)|null} [onCollapse] - After the body collapses
 * @property {((card: CardInstance) => void)|null} [onExpand] - After the body expands
 * @property {((card: CardInstance, event: MouseEvent) => void)|null} [onClick] - Click on the card (not a collapsing header click)
 */
/** @typedef {Card} CardInstance */
export class Card extends Component {
    static defaults: {
        hoverable: boolean;
        shadow: string;
        rounded: boolean;
        animation: boolean;
        animationDuration: number;
        collapsible: boolean;
        collapsed: boolean;
        persistKey: any;
        title: string;
        icon: string;
        content: string;
        safe: boolean;
        clickable: boolean;
        color: any;
        onCollapse: any;
        onExpand: any;
        onClick: any;
    };
    /**
     * @param {import('./shared.js').ComponentTarget} selector
     * @param {CardOptions} [options]
     */
    constructor(selector: import("./shared.js").ComponentTarget, options?: CardOptions);
    _added: any[];
    _made: any[];
    _addClass(...names: any[]): void;
    _apply(): void;
    _colorClass: string;
    _headerTabindex: boolean;
    _header(): Element;
    _body(): Element;
    _bind(): void;
    _storageKey(): any;
    _restoreState(): void;
    _saveState(): void;
    _setCollapsed(collapsed: any, save?: boolean, animate?: boolean): void;
    _heightTimer: number;
    /**
     * Collapse the body.
     * @returns {this}
     */
    collapse(): this;
    /**
     * Expand the body.
     * @returns {this}
     */
    expand(): this;
    /**
     * Toggle collapsed/expanded.
     * @returns {this}
     */
    toggle(): this;
    /** @returns {boolean} */
    isCollapsed(): boolean;
    /**
     * Set the shadow size.
     * @param {import('../elements.js').ShadowSize|'sm'|'lg'} size
     * @returns {this}
     */
    setShadow(size: import("../elements.js").ShadowSize | "sm" | "lg"): this;
    /**
     * Turn the hover style on or off.
     * @param {boolean} hoverable
     * @returns {this}
     */
    setHoverable(hoverable: boolean): this;
    /**
     * Replace the body's content. A string is HTML, sanitised like `$().html()` unless
     * `{safe: false}`; a Node is appended.
     * @param {string|Node|null} content
     * @param {{safe?: boolean}} [opts]
     * @returns {this}
     */
    setContent(content: string | Node | null, opts?: {
        safe?: boolean;
    }): this;
    /**
     * The `.card-body`, made if the card has none.
     * @returns {HTMLElement}
     */
    getBody(): HTMLElement;
    /**
     * Re-measure an expanded collapsible body whose content changed.
     * @returns {this}
     */
    updateHeight(): this;
    _applyOptions(): void;
}
export default Card;
export type CardOptions = {
    /**
     * - Enable hover effects (`hover` is accepted as an alias)
     */
    hoverable?: boolean;
    /**
     * - Alias of `hoverable`
     */
    hover?: boolean;
    /**
     * - Shadow size
     */
    shadow?: import("../elements.js").ShadowSize | "sm" | "lg";
    /**
     * - Apply border radius (false gives square corners)
     */
    rounded?: boolean;
    /**
     * - Enable animations
     */
    animation?: boolean;
    /**
     * - Animation duration in ms
     */
    animationDuration?: number;
    /**
     * - Clicking the header collapses/expands the body
     */
    collapsible?: boolean;
    /**
     * - Start collapsed (a saved state wins)
     */
    collapsed?: boolean;
    /**
     * - Storage key for the collapsed state (default `domma-card-<id>` when the card has an id)
     */
    persistKey?: string | null;
    /**
     * - Adds a `.card-header` with this title when the card has none
     */
    title?: string;
    /**
     * - Icon name shown before the title
     */
    icon?: string;
    /**
     * - Body content: HTML (sanitised unless `safe: false`) or a Node
     */
    content?: string | Node;
    /**
     * - Sanitise string content
     */
    safe?: boolean;
    /**
     * - Clickable style (also on when `onClick` is given)
     */
    clickable?: boolean;
    /**
     * - Colour variant, e.g. 'primary' adds `.card-primary`
     */
    color?: string | null;
    /**
     * - After the body collapses
     */
    onCollapse?: ((card: CardInstance) => void) | null;
    /**
     * - After the body expands
     */
    onExpand?: ((card: CardInstance) => void) | null;
    /**
     * - Click on the card (not a collapsing header click)
     */
    onClick?: ((card: CardInstance, event: MouseEvent) => void) | null;
};
export type CardInstance = Card;
import Component from '../component.js';
