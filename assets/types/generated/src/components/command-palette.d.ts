/** Whether this is an Apple platform, where "mod" means Cmd rather than Ctrl. */
export function isMac(): boolean;
/**
 * 'mod+shift+k' -> {key: 'k', mod: true, shift: true, ...}. `mod` is Cmd on a Mac and
 * Ctrl elsewhere.
 * @param {string} combo
 * @returns {{key: string, mod: boolean, ctrl: boolean, meta: boolean, alt: boolean, shift: boolean}|null}
 */
export function parseHotkey(combo: string): {
    key: string;
    mod: boolean;
    ctrl: boolean;
    meta: boolean;
    alt: boolean;
    shift: boolean;
} | null;
/**
 * Whether a keydown matches a parsed hotkey.
 * @param {KeyboardEvent} e
 * @param {NonNullable<ReturnType<typeof parseHotkey>>} hotkey - from parseHotkey
 * @param {boolean} [mac]
 */
export function matchesHotkey(e: KeyboardEvent, hotkey: NonNullable<ReturnType<typeof parseHotkey>>, mac?: boolean): boolean;
/**
 * The keys of a shortcut as labels to show: 'mod+s' is ['⌘', 'S'] on a Mac, ['Ctrl', 'S'] elsewhere.
 * @param {string} combo
 * @param {boolean} [mac]
 * @returns {string[]}
 */
export function formatShortcut(combo: string, mac?: boolean): string[];
/**
 * Fuzzy match: the query's letters appear in the text in order. Scored so an exact
 * prefix beats a substring, a substring beats scattered letters, and letters at word
 * starts or in unbroken runs beat ones in the middle of words.
 * @param {string} query
 * @param {string} text
 * @returns {{score: number, indices: number[]}|null} null when it does not match
 */
export function fuzzyMatch(query: string, text: string): {
    score: number;
    indices: number[];
} | null;
/**
 * Whether a live palette answers this keydown. A page script with its own shortcut
 * (the site search's Ctrl/Cmd+K) asks this rather than relying on listener order.
 * Exposed as E.commandPalette.claims(e).
 * @param {KeyboardEvent} e
 * @returns {boolean}
 */
export function claimsHotkey(e: KeyboardEvent): boolean;
/**
 * A new command palette.
 * @param {CommandPaletteOptions} [options]
 * @returns {CommandPalette}
 */
export function createCommandPalette(options?: CommandPaletteOptions): CommandPalette;
export class CommandPalette extends Component {
    /** @type {CommandPaletteOptions} */
    static defaults: CommandPaletteOptions;
    static _makeRoot(): HTMLDivElement;
    /**
     * @param {CommandPaletteOptions} [options]
     */
    constructor(options?: CommandPaletteOptions);
    _isOpen: boolean;
    _commands: any[];
    _pages: any[];
    _query: string;
    _results: any[];
    _active: number;
    _sourceResults: any[];
    _loading: boolean;
    _error: any;
    _timers: Set<any>;
    _known: Map<any, any>;
    _abort: AbortController;
    _sourceToken: number;
    _trap: FocusTrap;
    get _mac(): boolean;
    _build(): void;
    _idBase: string;
    _backdrop: HTMLDivElement;
    _panel: HTMLDivElement;
    _crumbs: HTMLDivElement;
    _back: HTMLButtonElement;
    _trail: HTMLOListElement;
    _input: HTMLInputElement;
    _spinner: HTMLSpanElement;
    _list: HTMLDivElement;
    _status: HTMLDivElement;
    _live: HTMLDivElement;
    _bind(): void;
    _downOnBackdrop: boolean;
    _hotkeyList: {
        key: string;
        mod: boolean;
        ctrl: boolean;
        meta: boolean;
        alt: boolean;
        shift: boolean;
    }[];
    _hotkeys(): {
        key: string;
        mod: boolean;
        ctrl: boolean;
        meta: boolean;
        alt: boolean;
        shift: boolean;
    }[];
    _later(fn: any, ms: any): number;
    _clearTimer(t: any): void;
    _duration(): number;
    /**
     * Open at the top level, with an optional query typed in.
     * @param {string} [query]
     * @returns {this}
     */
    open(query?: string): this;
    /** @returns {this} */
    close(): this;
    _hideTimer: number;
    /**
     * @overload
     * @param {string} [query]
     * @returns {this}
     */
    toggle(query?: string): this;
    /** @returns {boolean} */
    isOpen(): boolean;
    /**
     * Permanent alias of open(), looked up by name.
     * @overload
     * @param {string} [query]
     * @returns {this}
     */
    show(query?: string): this;
    /**
     * Permanent alias of close(), looked up by name.
     * @overload
     * @returns {this}
     */
    hide(): this;
    /**
     * Permanent alias of isOpen().
     * @returns {boolean}
     */
    isVisible(): boolean;
    /**
     * Replace every top-level command.
     * @param {PaletteCommand[]} list
     * @returns {this}
     */
    setCommands(list: PaletteCommand[]): this;
    /**
     * Add top-level commands (one, or a list). A command with the id of one already
     * there replaces it in place.
     * @param {PaletteCommand|PaletteCommand[]} list
     * @returns {this}
     */
    addCommands(list: PaletteCommand | PaletteCommand[]): this;
    /**
     * Remove a top-level command by id.
     * @param {string} id
     * @returns {this}
     */
    removeCommand(id: string): this;
    /** @returns {PaletteCommand[]} the top-level commands */
    getCommands(): PaletteCommand[];
    /**
     * Up one nested page. At the top level it does nothing and returns false.
     * @returns {boolean}
     */
    back(): boolean;
    /**
     * The current query.
     * @returns {string}
     */
    query(): string;
    /**
     * The ids of the remembered recent commands, newest first.
     * @returns {string[]}
     */
    recent(): string[];
    /**
     * Forget the remembered recent commands.
     * @returns {this}
     */
    clearRecent(): this;
    _destroyed: boolean;
    _applyOptions(): void;
    _refresh(): void;
    _currentPage(): any;
    _usesSource(): boolean;
    _setQuery(value: any, opts?: {}): void;
    _debounceTimer: number;
    _cancelSource(): void;
    _runSource(query: any): void;
    /** Every command reachable without a request: the top level and array children. */
    _findById(id: any, list?: any[], depth?: number): any;
    _remember(command: any): void;
    /** Group and order what is shown now. */
    _compute(): {
        name: any;
        items: any;
    }[];
    _update(opts?: {}): void;
    _nextEnabled(from: any, step: any, wrap?: boolean): any;
    _setActive(index: any, opts?: {}): void;
    _renderList(groups: any): void;
    _renderItem(command: any, match: any, index: any, mac: any): HTMLDivElement;
    _renderCrumbs(): void;
    _renderStatus(): void;
    _liveTimer: number;
    _onKeyDown(e: any): void;
    _choose(command: any, event: any): void;
    _enter(command: any): void;
    _run(command: any, event: any): void;
}
export default CommandPalette;
/**
 * The context a `source` or async `children` function gets.
 */
export type PaletteSourceContext = {
    signal?: AbortSignal;
    palette: CommandPaletteInstance;
};
/**
 * One command in the palette.
 */
export type PaletteCommand = {
    id?: string;
    title: string;
    subtitle?: string;
    /**
     * Heading the command is listed under
     */
    group?: string;
    /**
     * Domma icon name
     */
    icon?: string;
    /**
     * More words that find it
     */
    keywords?: string[];
    /**
     * Shown as a hint, e.g. 'mod+s' (mod = Cmd on a Mac, Ctrl elsewhere)
     */
    shortcut?: string;
    /**
     * Followed when run (http(s), mailto, tel or relative only)
     */
    href?: string;
    /**
     * '_blank' opens href in a new tab
     */
    target?: string;
    action?: (command: PaletteCommand, palette: CommandPaletteInstance, event?: Event) => void;
    disabled?: boolean;
    hidden?: boolean;
    /**
     * Running it leaves the palette open
     */
    keepOpen?: boolean;
    /**
     * A nested page: a list, or a function returning one (called once on entering)
     */
    children?: PaletteCommand[] | ((command: PaletteCommand, ctx: PaletteSourceContext) => Promise<PaletteCommand[]> | PaletteCommand[]);
    /**
     * Placeholder for the box while this command's page is open
     */
    placeholder?: string;
};
export type CommandPaletteOptions = {
    commands?: PaletteCommand[];
    /**
     * Search elsewhere: debounced, the previous request aborted through `signal`
     */
    source?: ((query: string, ctx: PaletteSourceContext) => Promise<PaletteCommand[]> | PaletteCommand[]) | null;
    /**
     * ms (default 150)
     */
    debounce?: number;
    /**
     * 'mod+k' (default), several, or false
     */
    hotkey?: string | string[] | false;
    placeholder?: string;
    /**
     * Accessible name of the dialog and list (default 'Command palette')
     */
    label?: string;
    maxResults?: number;
    /**
     * Storage (S) key for recent commands; null (default) = off
     */
    recentKey?: string | null;
    recentLimit?: number;
    recentLabel?: string;
    /**
     * Heading for source results without their own group
     */
    sourceGroup?: string | null;
    emptyText?: string;
    loadingText?: string;
    /**
     * While a nested page's async children load (default 'Loading…')
     */
    pageLoadingText?: string;
    errorText?: string;
    backLabel?: string;
    /**
     * Key hints under the list (default true)
     */
    footer?: boolean;
    resultsText?: (count: number) => string;
    /**
     * Replaces the default navigation for href commands
     */
    navigate?: ((href: string, ctx: {
        newTab: boolean;
        command: PaletteCommand;
    }) => void) | null;
    animationDuration?: number;
    className?: string;
    /**
     * Force Mac (true) or other (false) key names; default detects
     */
    mac?: boolean;
    onBeforeOpen?: ((palette: CommandPaletteInstance) => boolean | void) | null;
    onOpen?: ((palette: CommandPaletteInstance) => void) | null;
    onBeforeClose?: ((palette: CommandPaletteInstance) => boolean | void) | null;
    onClose?: ((palette: CommandPaletteInstance) => void) | null;
    onQuery?: ((query: string, palette: CommandPaletteInstance) => void) | null;
    onBeforeSelect?: ((command: PaletteCommand, palette: CommandPaletteInstance) => boolean | void) | null;
    onSelect?: ((command: PaletteCommand, palette: CommandPaletteInstance) => void) | null;
    onRun?: ((command: PaletteCommand, palette: CommandPaletteInstance) => void) | null;
};
export type CommandPaletteInstance = CommandPalette;
/**
 * `E.commandPalette(options)` with its helpers.
 */
export type CommandPaletteFactory = ((options?: CommandPaletteOptions) => CommandPaletteInstance) & {
    formatShortcut: (combo: string, mac?: boolean) => string[];
    fuzzyMatch: (query: string, text: string) => ({
        score: number;
        indices: number[];
    } | null);
    claims: (e: KeyboardEvent) => boolean;
};
import Component from '../component.js';
import FocusTrap from './focus-trap.js';
