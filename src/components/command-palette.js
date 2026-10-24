/**
 * Command palette - E.commandPalette(options).
 *
 * A Cmd/Ctrl+K launcher: a search box over a list of commands, filtered as you type.
 * The factory builds its own overlay (backdrop and panel) at the end of <body>; the
 * instance's `element` is that overlay.
 *
 * Commands are plain objects - {id, title, subtitle, group, icon, keywords, shortcut,
 * href, action, disabled, keepOpen, children}. `children` (an array, or an async function
 * returning one) makes a command open a nested page; Backspace in the empty box, Escape or
 * the back button goes up again. A `source(query, {signal})` option searches somewhere
 * else (a server), debounced and abortable, with loading, empty and error states.
 *
 * Matching is fuzzy (the letters in order, anywhere), scored so prefixes, word starts and
 * unbroken runs come first. The matched letters are wrapped in spans - built with
 * textContent, so nothing in a title is ever read as HTML.
 *
 * It is the ARIA combobox-with-listbox pattern: the input owns the list through
 * aria-controls and points at the highlighted option with aria-activedescendant, so
 * focus never leaves the box while the arrow keys move. A FocusTrap keeps Tab inside.
 *
 * Events: beforeopen, open, beforeclose, close, query, beforeselect (cancelable), select,
 * run - each as `onX`, `.on('x')` and `dm:command-palette:x` on the overlay element.
 */

import Component from '../component.js';
import {storage} from '../storage.js';
import FocusTrap from './focus-trap.js';
import {num, reducedMotion, scanIcons, uniqueId} from './shared.js';
import {safeUrl} from '../safe-url.js';

const PREFIX = 'dm-command-palette';

// ---- platform and hotkeys -----------------------------------------------

/** Whether this is an Apple platform, where "mod" means Cmd rather than Ctrl. */
export function isMac() {
    if (typeof navigator === 'undefined') return false;
    const platform = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent || '';
    return /mac|iphone|ipad|ipod/i.test(platform);
}

const KEY_ALIASES = {space: ' ', esc: 'escape', return: 'enter', plus: '+', del: 'delete'};

/**
 * 'mod+shift+k' -> {key: 'k', mod: true, shift: true, ...}. `mod` is Cmd on a Mac and
 * Ctrl elsewhere.
 * @param {string} combo
 * @returns {{key: string, mod: boolean, ctrl: boolean, meta: boolean, alt: boolean, shift: boolean}|null}
 */
export function parseHotkey(combo) {
    if (!combo || typeof combo !== 'string') return null;
    const parts = combo.toLowerCase().split('+').map(p => p.trim());
    // 'mod++' ends in an empty part: the key is '+'.
    let key = parts.pop();
    if (key === '' && parts[parts.length - 1] === '') { parts.pop(); key = '+'; }
    if (!key) return null;
    const has = (...names) => parts.some(p => names.includes(p));
    return {
        key: KEY_ALIASES[key] || key,
        mod: has('mod'),
        ctrl: has('ctrl', 'control'),
        meta: has('meta', 'cmd', 'command', 'super'),
        alt: has('alt', 'option', 'opt'),
        shift: has('shift')
    };
}

/**
 * Whether a keydown matches a parsed hotkey.
 * @param {KeyboardEvent} e
 * @param {Object} hotkey - from parseHotkey
 * @param {boolean} [mac]
 */
export function matchesHotkey(e, hotkey, mac = isMac()) {
    if (!hotkey || !e || !e.key) return false;
    const wantMeta = hotkey.meta || (hotkey.mod && mac);
    const wantCtrl = hotkey.ctrl || (hotkey.mod && !mac);
    if (!!e.metaKey !== !!wantMeta || !!e.ctrlKey !== !!wantCtrl || !!e.altKey !== !!hotkey.alt) return false;
    const key = e.key.toLowerCase();
    // Shift changes the character ('?' is shift+/), so it is only checked for letters and named keys.
    if (key.length > 1 || /[a-z]/.test(key)) {
        if (!!e.shiftKey !== !!hotkey.shift) return false;
    }
    if (key === hotkey.key) return true;
    // Alt on a Mac turns 'k' into another character; the physical key still says KeyK.
    return /^[a-z0-9]$/.test(hotkey.key) && (e.code === `Key${hotkey.key.toUpperCase()}` || e.code === `Digit${hotkey.key}`);
}

const KEY_LABELS = {
    enter: '↵', escape: 'Esc', backspace: '⌫', delete: 'Del', tab: 'Tab', ' ': 'Space',
    arrowup: '↑', arrowdown: '↓', arrowleft: '←', arrowright: '→'
};

/**
 * The keys of a shortcut as labels to show: 'mod+s' is ['⌘', 'S'] on a Mac, ['Ctrl', 'S'] elsewhere.
 * @param {string} combo
 * @param {boolean} [mac]
 * @returns {string[]}
 */
export function formatShortcut(combo, mac = isMac()) {
    const h = parseHotkey(combo);
    if (!h) return [];
    const out = [];
    if (h.ctrl || (h.mod && !mac)) out.push(mac ? '⌃' : 'Ctrl');
    if (h.alt) out.push(mac ? '⌥' : 'Alt');
    if (h.shift) out.push(mac ? '⇧' : 'Shift');
    if (h.meta || (h.mod && mac)) out.push(mac ? '⌘' : 'Meta');
    out.push(KEY_LABELS[h.key] || (h.key.length === 1 ? h.key.toUpperCase() : h.key.charAt(0).toUpperCase() + h.key.slice(1)));
    return out;
}

/** The same shortcut in aria-keyshortcuts form ('Control+S'). */
function ariaShortcut(combo, mac) {
    const h = parseHotkey(combo);
    if (!h) return '';
    const out = [];
    if (h.ctrl || (h.mod && !mac)) out.push('Control');
    if (h.alt) out.push('Alt');
    if (h.shift) out.push('Shift');
    if (h.meta || (h.mod && mac)) out.push('Meta');
    const key = h.key === ' ' ? 'Space' : h.key;
    out.push(key.length === 1 ? key.toUpperCase() : key.charAt(0).toUpperCase() + key.slice(1));
    return out.join('+');
}

// ---- matching -----------------------------------------------------------

function isWordStart(text, i) {
    if (i === 0) return true;
    const prev = text[i - 1];
    const ch = text[i];
    if (!/[\p{L}\p{N}]/u.test(prev)) return true;
    return prev === prev.toLowerCase() && ch !== ch.toLowerCase();   // camelCase
}

/**
 * Fuzzy match: the query's letters appear in the text in order. Scored so an exact
 * prefix beats a substring, a substring beats scattered letters, and letters at word
 * starts or in unbroken runs beat ones in the middle of words.
 * @param {string} query
 * @param {string} text
 * @returns {{score: number, indices: number[]}|null} null when it does not match
 */
export function fuzzyMatch(query, text) {
    const q = String(query ?? '').trim().toLowerCase();
    const t = String(text ?? '');
    if (!q) return {score: 0, indices: []};
    const lower = t.toLowerCase();
    if (lower.length !== t.length) return null;   // a case change that alters length - no safe indices

    const at = lower.indexOf(q);
    if (at > -1) {
        const indices = Array.from({length: q.length}, (_, i) => at + i);
        let score = 1000 - at * 2 - (t.length - q.length) * 0.5;
        if (at === 0) score += 300;
        else if (isWordStart(t, at)) score += 150;
        return {score, indices};
    }

    const chars = q.replace(/\s+/g, '');
    const indices = [];
    let score = 0;
    let from = 0;
    let prev = -2;
    for (const ch of chars) {
        let pos = -1;
        if (lower[from] === ch && prev === from - 1) {
            pos = from;   // carry an unbroken run on
        } else {
            for (let j = from; j < lower.length; j++) {
                if (lower[j] !== ch) continue;
                if (pos < 0) pos = j;
                if (isWordStart(t, j)) { pos = j; break; }
            }
        }
        if (pos < 0) return null;
        score += 10;
        if (pos === prev + 1) score += 15;
        if (isWordStart(t, pos)) score += 20;
        score -= Math.min(pos - prev - 1, 20) * 0.75;
        indices.push(pos);
        prev = pos;
        from = pos + 1;
    }
    return {score: score - t.length * 0.1, indices};
}

/** Score a command against a query: the title counts most, then keywords, then the subtitle. */
function scoreCommand(command, query) {
    const title = fuzzyMatch(query, command.title);
    const subtitle = command.subtitle ? fuzzyMatch(query, command.subtitle) : null;
    let best = title ? title.score + 50 : -Infinity;
    for (const kw of Array.isArray(command.keywords) ? command.keywords : []) {
        const m = fuzzyMatch(query, kw);
        if (m) best = Math.max(best, m.score * 0.8);
    }
    if (subtitle) best = Math.max(best, subtitle.score * 0.6);
    if (best === -Infinity) return null;
    return {score: best, title: title ? title.indices : [], subtitle: subtitle ? subtitle.indices : []};
}

/** Put text into an element with the matched characters wrapped in spans. Never HTML. */
function appendHighlighted(el, text, indices) {
    const str = String(text ?? '');
    if (!indices || !indices.length) {
        el.textContent = str;
        return;
    }
    const marks = new Set(indices);
    let run = '';
    let inMark = false;
    const flush = () => {
        if (!run) return;
        if (inMark) {
            const span = document.createElement('span');
            span.className = `${PREFIX}-match`;
            span.textContent = run;
            el.appendChild(span);
        } else {
            el.appendChild(document.createTextNode(run));
        }
        run = '';
    };
    for (let i = 0; i < str.length; i++) {
        const marked = marks.has(i);
        if (marked !== inMark) { flush(); inMark = marked; }
        run += str[i];
    }
    flush();
}

const idOf = (command) => String(command.id ?? command.title ?? '');

/** Live palettes with a hotkey bound - so other page scripts can tell the key is taken. */
const withHotkeys = new Set();

/**
 * Whether a live palette answers this keydown. A page script with its own shortcut
 * (the site search's Ctrl/Cmd+K) asks this rather than relying on listener order.
 * Exposed as E.commandPalette.claims(e).
 * @param {KeyboardEvent} e
 * @returns {boolean}
 */
export function claimsHotkey(e) {
    for (const p of withHotkeys) {
        if (p._hotkeyList.some(h => matchesHotkey(e, h, p._mac))) return true;
    }
    return false;
}

/** Only links a browser can follow safely: http(s), mailto, tel, or relative. */
const safeHref = safeUrl;

function isEditable(node) {
    if (!node || node.nodeType !== 1) return false;
    if (node.isContentEditable) return true;
    return /^(INPUT|TEXTAREA|SELECT)$/.test(node.tagName);
}

export class CommandPalette extends Component {
    static componentName = 'command-palette';

    static defaults = {
        commands: [],
        source: null,               // (query, {signal}) => Promise<command[]>
        debounce: 150,
        hotkey: 'mod+k',            // string | string[] | false
        placeholder: 'Type a command or search…',
        label: 'Command palette',
        maxResults: 50,
        recentKey: null,            // storage key (S) for recent commands; null = off
        recentLimit: 5,
        recentLabel: 'Recent',
        sourceGroup: null,          // heading for source results without their own group
        emptyText: 'No results',
        loadingText: 'Searching…',
        pageLoadingText: 'Loading…', // while a nested page's async children load
        errorText: 'Something went wrong. Try again.',
        backLabel: 'Back',
        footer: true,               // the key hints under the list
        resultsText: (n) => (n === 1 ? '1 result' : `${n} results`),
        navigate: null,             // (href, {newTab, command}) => void - replaces the default
        animationDuration: 150,
        className: '',
        mac: undefined,             // force the Mac (true) or other (false) key names
        onBeforeOpen: null,
        onOpen: null,
        onBeforeClose: null,
        onClose: null,
        onQuery: null,
        onBeforeSelect: null,
        onSelect: null,
        onRun: null
    };

    /**
     * @param {Object} [options]
     */
    constructor(options = {}) {
        super(CommandPalette._makeRoot(), options);
        this._isOpen = false;
        this._commands = Array.isArray(this.options.commands) ? this.options.commands.slice() : [];
        this._pages = [];
        this._query = '';
        this._results = [];
        this._active = -1;
        this._sourceResults = [];
        this._loading = false;
        this._error = null;
        this._timers = new Set();
        this._known = new Map();
        this._abort = null;
        this._sourceToken = 0;
        this._build();
        this._bind();
        this._trap = new FocusTrap(this.element, {
            initialFocus: () => this._input,
            returnFocus: true,
            allowOutsideClick: true,
            register: false
        });
    }

    static _makeRoot() {
        const root = document.createElement('div');
        root.className = PREFIX;
        root.hidden = true;
        return root;
    }

    get _mac() {
        return this.options.mac === undefined ? isMac() : !!this.options.mac;
    }

    _build() {
        const o = this.options;
        const root = this.element;
        if (o.className) root.classList.add(...String(o.className).split(/\s+/).filter(Boolean));
        const listId = uniqueId(`${PREFIX}-list`);
        this._idBase = uniqueId(`${PREFIX}-opt`);

        const backdrop = document.createElement('div');
        backdrop.className = `${PREFIX}-backdrop`;
        this._backdrop = backdrop;

        const panel = document.createElement('div');
        panel.className = `${PREFIX}-panel`;
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-label', String(o.label));
        this._panel = panel;

        const crumbs = document.createElement('div');
        crumbs.className = `${PREFIX}-crumbs`;
        crumbs.hidden = true;
        const back = document.createElement('button');
        back.type = 'button';
        back.className = `${PREFIX}-back`;
        back.setAttribute('aria-label', String(o.backLabel));
        const backIcon = document.createElement('span');
        backIcon.setAttribute('data-icon', 'arrow-left');
        backIcon.setAttribute('data-icon-size', '16');
        backIcon.setAttribute('aria-hidden', 'true');
        back.appendChild(backIcon);
        const trail = document.createElement('ol');
        trail.className = `${PREFIX}-trail`;
        trail.setAttribute('aria-label', 'Location');
        crumbs.append(back, trail);
        this._crumbs = crumbs;
        this._back = back;
        this._trail = trail;

        const search = document.createElement('div');
        search.className = `${PREFIX}-search`;
        const searchIcon = document.createElement('span');
        searchIcon.className = `${PREFIX}-search-icon`;
        searchIcon.setAttribute('data-icon', 'search');
        searchIcon.setAttribute('data-icon-size', '18');
        searchIcon.setAttribute('aria-hidden', 'true');
        const input = document.createElement('input');
        input.type = 'text';
        input.className = `${PREFIX}-input`;
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('aria-controls', listId);
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('aria-label', String(o.label));
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('spellcheck', 'false');
        input.placeholder = String(o.placeholder ?? '');
        const spinner = document.createElement('span');
        spinner.className = `${PREFIX}-spinner`;
        spinner.setAttribute('aria-hidden', 'true');
        spinner.hidden = true;
        search.append(searchIcon, input, spinner);
        this._input = input;
        this._spinner = spinner;

        const list = document.createElement('div');
        list.className = `${PREFIX}-list`;
        list.id = listId;
        list.setAttribute('role', 'listbox');
        list.setAttribute('aria-label', String(o.label));
        this._list = list;

        const status = document.createElement('div');
        status.className = `${PREFIX}-status`;
        status.hidden = true;
        this._status = status;

        const live = document.createElement('div');
        live.className = 'sr-only';
        live.setAttribute('role', 'status');
        live.setAttribute('aria-live', 'polite');
        live.setAttribute('aria-atomic', 'true');
        this._live = live;

        panel.append(crumbs, search, list, status, live);

        if (o.footer !== false) {
            const footer = document.createElement('div');
            footer.className = `${PREFIX}-footer`;
            footer.setAttribute('aria-hidden', 'true');   // the same help is in the keyboard model itself
            const hint = (keys, text) => {
                const item = document.createElement('span');
                item.className = `${PREFIX}-hint`;
                for (const k of keys) {
                    const kbd = document.createElement('kbd');
                    kbd.textContent = k;
                    item.appendChild(kbd);
                }
                item.appendChild(document.createTextNode(` ${text}`));
                footer.appendChild(item);
            };
            hint(['↑', '↓'], 'to move');
            hint(['↵'], 'to run');
            hint(['⌫'], 'to go back');
            hint(['Esc'], 'to close');
            panel.appendChild(footer);
        }

        root.append(backdrop, panel);
        document.body.appendChild(root);
        scanIcons(root);
    }

    _bind() {
        this._addEventListener(this._input, 'input', () => this._setQuery(this._input.value));
        this._addEventListener(this.element, 'keydown', (e) => this._onKeyDown(e));
        this._addEventListener(this._back, 'click', () => this.back());

        // Backdrop: the press and the release both on it, so a drag out of the panel does not close.
        this._addEventListener(this._backdrop, 'pointerdown', () => { this._downOnBackdrop = true; });
        this._addEventListener(this.element, 'click', (e) => {
            const started = this._downOnBackdrop !== false;
            this._downOnBackdrop = false;
            if (e.target === this._backdrop && started && this._isOpen) this.close();
        });
        this._addEventListener(this._panel, 'pointerdown', () => { this._downOnBackdrop = false; });

        // The pointer picks the highlighted row on movement, not on enter - a list that
        // scrolls under a still pointer would otherwise steal the keyboard's choice.
        this._addEventListener(this._list, 'pointermove', (e) => {
            const row = e.target.closest?.(`.${PREFIX}-item`);
            if (!row || row.getAttribute('aria-disabled') === 'true') return;
            const i = Number(row.dataset.index);
            if (i !== this._active) this._setActive(i, {scroll: false});
        });
        // Keep focus in the box when a row is pressed.
        this._addEventListener(this._list, 'mousedown', (e) => e.preventDefault());
        this._addEventListener(this._list, 'click', (e) => {
            const row = e.target.closest?.(`.${PREFIX}-item`);
            if (!row) return;
            const entry = this._results[Number(row.dataset.index)];
            if (entry) this._choose(entry.command, e);
        });

        const hotkeys = this._hotkeys();
        if (hotkeys.length) {
            this._hotkeyList = hotkeys;
            withHotkeys.add(this);
            this._addEventListener(document, 'keydown', (e) => {
                if (e.defaultPrevented || e.repeat || e.isComposing) return;
                const hk = hotkeys.find(h => matchesHotkey(e, h, this._mac));
                if (!hk) return;
                const target = typeof e.composedPath === 'function' ? e.composedPath()[0] : e.target;
                // A bare key ('/') is typing when the focus is in a field; a chord never is.
                const chord = hk.mod || hk.ctrl || hk.meta || hk.alt;
                if (!chord && isEditable(target)) return;
                e.preventDefault();
                this.toggle();
            });
        }
    }

    _hotkeys() {
        const hk = this.options.hotkey;
        if (!hk) return [];
        return (Array.isArray(hk) ? hk : [hk]).map(parseHotkey).filter(Boolean);
    }

    _later(fn, ms) {
        const t = setTimeout(() => {
            this._timers.delete(t);
            fn();
        }, ms);
        this._timers.add(t);
        return t;
    }

    _clearTimer(t) {
        if (!t) return;
        clearTimeout(t);
        this._timers.delete(t);
    }

    _duration() {
        return reducedMotion() ? 0 : num(this.options.animationDuration, 150);
    }

    // ---- public API -----------------------------------------------------

    /**
     * Open at the top level, with an optional query typed in.
     * @param {string} [query]
     * @returns {this}
     */
    open(query) {
        if (this._destroyed) return this;
        if (this._isOpen) {
            if (typeof query === 'string') this._setQuery(query, {write: true});
            return this;
        }
        if (this._fire('beforeOpen', this) === false) return this;
        this._isOpen = true;
        this._clearTimer(this._hideTimer);
        if (!this.element.isConnected) document.body.appendChild(this.element);
        this._pages = [];
        this._sourceResults = [];
        this._error = null;
        this._input.value = typeof query === 'string' ? query : '';
        this._query = this._input.value;
        this.element.hidden = false;
        this._input.setAttribute('aria-expanded', 'true');
        const ms = this._duration();
        this.element.style.setProperty('--dm-command-palette-duration', `${ms}ms`);
        if (ms && typeof requestAnimationFrame === 'function') {
            // Two frames: the un-hidden state has to be painted before the transition runs.
            requestAnimationFrame(() => requestAnimationFrame(() => {
                if (this._isOpen) this.element.classList.add('is-open');
            }));
        } else {
            this.element.classList.add('is-open');
        }
        this._renderCrumbs();
        this._update({resetActive: true});
        if (this._usesSource()) this._runSource(this._query);
        this._trap.activate();
        this._fire('open', this);
        return this;
    }

    /** @returns {this} */
    close() {
        if (!this._isOpen) return this;
        if (!this._mayClose(this)) return this;
        this._isOpen = false;
        this._cancelSource();
        this.element.classList.remove('is-open');
        this._input.setAttribute('aria-expanded', 'false');
        this._input.removeAttribute('aria-activedescendant');
        this._trap.deactivate();
        const finish = () => {
            this._hideTimer = null;
            if (!this._isOpen) this.element.hidden = true;
        };
        const ms = this._duration();
        if (ms) this._hideTimer = this._later(finish, ms);
        else finish();
        this._fire('close', this);
        return this;
    }

    /** @returns {this} */
    toggle(...args) {
        return this._isOpen ? this.close() : this.open(...args);
    }

    /** @returns {boolean} */
    isOpen() {
        return this._isOpen;
    }

    /** Permanent alias of open(), looked up by name. */
    show(...args) {
        return this.open(...args);
    }

    /** Permanent alias of close(), looked up by name. */
    hide(...args) {
        return this.close(...args);
    }

    /** Permanent alias of isOpen(). */
    isVisible() {
        return this.isOpen();
    }

    /**
     * Replace every top-level command.
     * @param {Object[]} list
     * @returns {this}
     */
    setCommands(list) {
        this._commands = Array.isArray(list) ? list.slice() : [];
        this.options.commands = this._commands;
        this._refresh();
        return this;
    }

    /**
     * Add top-level commands (one, or a list). A command with the id of one already
     * there replaces it in place.
     * @param {Object|Object[]} list
     * @returns {this}
     */
    addCommands(list) {
        for (const command of Array.isArray(list) ? list : [list]) {
            if (!command) continue;
            const i = this._commands.findIndex(c => idOf(c) === idOf(command));
            if (i > -1) this._commands[i] = command;
            else this._commands.push(command);
        }
        this._refresh();
        return this;
    }

    /**
     * Remove a top-level command by id.
     * @param {string} id
     * @returns {this}
     */
    removeCommand(id) {
        this._commands = this._commands.filter(c => idOf(c) !== String(id));
        this.options.commands = this._commands;
        this._refresh();
        return this;
    }

    /** @returns {Object[]} the top-level commands */
    getCommands() {
        return this._commands.slice();
    }

    /**
     * Up one nested page. At the top level it does nothing and returns false.
     * @returns {boolean}
     */
    back() {
        if (!this._pages.length) return false;
        const page = this._pages.pop();
        page.abort?.abort();
        this._input.value = page.query || '';
        this._query = this._input.value;
        this._renderCrumbs();
        this._update({resetActive: true});
        if (!this._pages.length && this._usesSource()) this._runSource(this._query);
        this._input.focus({preventScroll: true});
        return true;
    }

    /** The current query. */
    query() {
        return this._query;
    }

    /** The ids of the remembered recent commands, newest first. */
    recent() {
        if (!this.options.recentKey) return [];
        const ids = storage.get(this.options.recentKey, []);
        return Array.isArray(ids) ? ids.map(String) : [];
    }

    /** Forget the remembered recent commands. */
    clearRecent() {
        if (this.options.recentKey) storage.remove(this.options.recentKey);
        this._refresh();
        return this;
    }

    destroy() {
        if (this._destroyed) return;
        if (this._isOpen) this._forcedClose();
        this._destroyed = true;
        withHotkeys.delete(this);
        this._cancelSource();
        for (const t of this._timers) clearTimeout(t);
        this._timers.clear();
        clearTimeout(this._liveTimer);
        this._trap.destroy();
        const el = this.element;
        super.destroy();
        el.remove();
    }

    _applyOptions() {
        if (Array.isArray(this.options.commands) && this.options.commands !== this._commands) {
            this._commands = this.options.commands.slice();
        }
        this._input.placeholder = String(this._currentPage()?.command.placeholder ?? this.options.placeholder ?? '');
        this._refresh();
    }

    // ---- state ----------------------------------------------------------

    _refresh() {
        if (this._isOpen) this._update();
    }

    _currentPage() {
        return this._pages[this._pages.length - 1] || null;
    }

    _usesSource() {
        return !this._pages.length && typeof this.options.source === 'function';
    }

    _setQuery(value, opts = {}) {
        if (opts.write) this._input.value = value;
        if (value === this._query && !opts.write) return;
        this._query = value;
        this._fire('query', value, this);
        this._update({resetActive: true});
        if (this._usesSource()) {
            // The request for the old query is dropped now, so its answer cannot land late.
            this._cancelSource();
            this._loading = true;
            this._renderStatus();
            this._debounceTimer = this._later(() => this._runSource(value), num(this.options.debounce, 150));
        }
    }

    _cancelSource() {
        this._clearTimer(this._debounceTimer);
        this._debounceTimer = null;
        if (this._abort) this._abort.abort();
        this._abort = null;
        this._loading = false;
        this._sourceToken += 1;
    }

    _runSource(query) {
        this._cancelSource();
        const token = this._sourceToken;
        const controller = typeof AbortController === 'function' ? new AbortController() : null;
        this._abort = controller;
        this._loading = true;
        this._error = null;
        this._renderStatus();
        let pending;
        try {
            pending = Promise.resolve(this.options.source(query, {signal: controller?.signal, palette: this}));
        } catch (err) {
            pending = Promise.reject(err);
        }
        pending.then((list) => {
            if (token !== this._sourceToken || !this._isOpen) return;
            this._loading = false;
            this._abort = null;
            this._sourceResults = Array.isArray(list) ? list : [];
            this._update();
        }, (err) => {
            if (token !== this._sourceToken || !this._isOpen) return;
            this._loading = false;
            this._abort = null;
            if (err && err.name === 'AbortError') return;
            this._error = err || new Error('source failed');
            this._sourceResults = [];
            this._update();
        });
    }

    /** Every command reachable without a request: the top level and array children. */
    _findById(id, list = this._commands, depth = 0) {
        for (const command of list) {
            if (idOf(command) === id) return command;
            if (depth < 8 && Array.isArray(command.children)) {
                const found = this._findById(id, command.children, depth + 1);
                if (found) return found;
            }
        }
        return null;
    }

    _remember(command) {
        this._known.set(idOf(command), command);
        const key = this.options.recentKey;
        if (!key) return;
        const id = idOf(command);
        const ids = [id, ...this.recent().filter(x => x !== id)].slice(0, Math.max(1, num(this.options.recentLimit, 5)));
        storage.set(key, ids);
    }

    /** Group and order what is shown now. */
    _compute() {
        const o = this.options;
        const page = this._currentPage();
        const q = this._query.trim();
        const max = Math.max(1, num(o.maxResults, 50));
        const groups = new Map();   // name -> {name, items: [{command, match}], best}
        const add = (name, command, match) => {
            const key = name == null ? '' : String(name);
            if (!groups.has(key)) groups.set(key, {name: key, items: [], best: -Infinity});
            const g = groups.get(key);
            g.items.push({command, match});
            g.best = Math.max(g.best, match ? match.score : 0);
        };

        const local = page ? (page.commands || []) : this._commands;
        const shown = new Set();
        if (!q && !page && o.recentKey) {
            for (const id of this.recent()) {
                const command = this._findById(id) || this._known.get(id);
                if (command && !command.hidden) {
                    add(o.recentLabel, command, null);
                    shown.add(command);
                }
            }
        }
        const scored = [];
        for (const command of local) {
            if (!command || command.hidden || shown.has(command)) continue;
            if (!q) { scored.push({command, match: null}); continue; }
            const match = scoreCommand(command, q);
            if (match) scored.push({command, match});
        }
        if (q) scored.sort((a, b) => b.match.score - a.match.score);
        for (const {command, match} of scored) add(command.group, command, match);

        let ordered = [...groups.values()];
        if (q) {
            // Groups follow their best match; recents are only shown without a query.
            ordered.sort((a, b) => b.best - a.best);
        }

        if (!page && this._sourceResults.length) {
            const sourceGroups = new Map();
            for (const command of this._sourceResults) {
                if (!command) continue;
                const name = command.group ?? o.sourceGroup;
                const key = name == null ? '' : String(name);
                if (!sourceGroups.has(key)) sourceGroups.set(key, {name: key, items: [], best: 0});
                // The source chose and ordered these; the match only lights the letters.
                const m = q ? fuzzyMatch(q, command.title) : null;
                const s = q && command.subtitle ? fuzzyMatch(q, command.subtitle) : null;
                sourceGroups.get(key).items.push({
                    command,
                    match: {score: 0, title: m ? m.indices : [], subtitle: s ? s.indices : []}
                });
            }
            ordered = ordered.concat([...sourceGroups.values()]);
        }

        // Cap the total, keeping group order.
        let left = max;
        const out = [];
        for (const g of ordered) {
            if (left <= 0) break;
            const items = g.items.slice(0, left);
            left -= items.length;
            if (items.length) out.push({name: g.name, items});
        }
        return out;
    }

    _update(opts = {}) {
        const previous = this._results[this._active]?.command;
        const groups = this._compute();
        this._renderList(groups);
        let index = -1;
        if (!opts.resetActive && previous) index = this._results.findIndex(r => r.command === previous);
        if (index < 0 || this._results[index]?.command.disabled) index = this._nextEnabled(-1, 1, false);
        this._setActive(index, {scroll: true});
        this._renderStatus();
    }

    _nextEnabled(from, step, wrap = true) {
        const n = this._results.length;
        if (!n) return -1;
        let i = from;
        for (let k = 0; k < n; k++) {
            i += step;
            if (i >= n) { if (!wrap) return -1; i = 0; }
            if (i < 0) { if (!wrap) return -1; i = n - 1; }
            if (!this._results[i].command.disabled) return i;
        }
        return -1;
    }

    _setActive(index, opts = {}) {
        const old = this._list.querySelector(`.${PREFIX}-item.is-active`);
        if (old) {
            old.classList.remove('is-active');
            old.setAttribute('aria-selected', 'false');
        }
        this._active = index;
        const row = index > -1 ? this._results[index]?.row : null;
        if (row) {
            row.classList.add('is-active');
            row.setAttribute('aria-selected', 'true');
            this._input.setAttribute('aria-activedescendant', row.id);
            if (opts.scroll !== false && typeof row.scrollIntoView === 'function') {
                row.scrollIntoView({block: 'nearest'});
            }
        } else {
            this._input.removeAttribute('aria-activedescendant');
        }
    }

    // ---- rendering ------------------------------------------------------

    _renderList(groups) {
        const list = this._list;
        list.replaceChildren();
        this._results = [];
        const mac = this._mac;
        let n = 0;
        for (const group of groups) {
            let parent = list;
            if (group.name) {
                const wrap = document.createElement('div');
                wrap.className = `${PREFIX}-group`;
                wrap.setAttribute('role', 'group');
                const heading = document.createElement('div');
                heading.className = `${PREFIX}-group-heading`;
                heading.id = `${this._idBase}-g${n}`;
                heading.setAttribute('aria-hidden', 'true');
                heading.textContent = group.name;
                wrap.setAttribute('aria-labelledby', heading.id);
                wrap.appendChild(heading);
                list.appendChild(wrap);
                parent = wrap;
            }
            for (const {command, match} of group.items) {
                const index = this._results.length;
                const row = this._renderItem(command, match, index, mac);
                parent.appendChild(row);
                this._results.push({command, match, row});
                n += 1;
            }
        }
        scanIcons(list);
        const count = this._results.length;
        list.hidden = !count;
        this._input.setAttribute('aria-expanded', String(this._isOpen && count > 0));
    }

    _renderItem(command, match, index, mac) {
        const row = document.createElement('div');
        row.className = `${PREFIX}-item`;
        row.id = `${this._idBase}-${index}`;
        row.dataset.index = String(index);
        row.setAttribute('role', 'option');
        row.setAttribute('aria-selected', 'false');
        if (command.disabled) row.setAttribute('aria-disabled', 'true');

        const icon = document.createElement('span');
        icon.className = `${PREFIX}-icon`;
        icon.setAttribute('aria-hidden', 'true');
        if (command.icon) {
            icon.setAttribute('data-icon', String(command.icon));
            icon.setAttribute('data-icon-size', '16');
        }
        row.appendChild(icon);

        const text = document.createElement('span');
        text.className = `${PREFIX}-text`;
        const title = document.createElement('span');
        title.className = `${PREFIX}-title`;
        appendHighlighted(title, command.title, match?.title);
        text.appendChild(title);
        if (command.subtitle) {
            const sub = document.createElement('span');
            sub.className = `${PREFIX}-subtitle`;
            appendHighlighted(sub, command.subtitle, match?.subtitle);
            text.appendChild(sub);
        }
        row.appendChild(text);

        if (command.shortcut) {
            const keys = document.createElement('span');
            keys.className = `${PREFIX}-shortcut`;
            keys.setAttribute('aria-hidden', 'true');
            for (const label of formatShortcut(command.shortcut, mac)) {
                const kbd = document.createElement('kbd');
                kbd.textContent = label;
                keys.appendChild(kbd);
            }
            row.appendChild(keys);
            const aria = ariaShortcut(command.shortcut, mac);
            if (aria) row.setAttribute('aria-keyshortcuts', aria);
        }
        if (command.children) {
            const more = document.createElement('span');
            more.className = `${PREFIX}-more`;
            more.setAttribute('aria-hidden', 'true');
            more.setAttribute('data-icon', 'chevron-right');
            more.setAttribute('data-icon-size', '16');
            row.appendChild(more);
        }
        return row;
    }

    _renderCrumbs() {
        const page = this._currentPage();
        this._crumbs.hidden = !page;
        this._trail.replaceChildren();
        for (const p of this._pages) {
            const li = document.createElement('li');
            li.textContent = String(p.command.title ?? '');
            this._trail.appendChild(li);
        }
        const last = this._trail.lastElementChild;
        if (last) last.setAttribute('aria-current', 'page');
        this._input.placeholder = String(page?.command.placeholder ?? this.options.placeholder ?? '');
    }

    _renderStatus() {
        const o = this.options;
        const page = this._currentPage();
        const loading = page ? page.loading : (this._loading && this._usesSource());
        const error = page ? page.error : this._error;
        const count = this._results.length;
        this._spinner.hidden = !loading;
        this._list.setAttribute('aria-busy', String(!!loading));
        let message = '';
        let kind = '';
        if (error) { message = String(o.errorText); kind = 'error'; }
        else if (!count && loading) { message = String(page ? o.pageLoadingText : o.loadingText); kind = 'loading'; }
        else if (!count) { message = String(o.emptyText); kind = 'empty'; }
        this._status.textContent = message;
        this._status.hidden = !message;
        this._status.dataset.state = kind;
        this.element.dataset.state = kind || 'results';

        // Announce the count once typing settles, not on every key.
        clearTimeout(this._liveTimer);
        const said = error ? message
            : loading && !count ? message
                : count ? (typeof o.resultsText === 'function' ? o.resultsText(count) : `${count}`) : message;
        this._liveTimer = setTimeout(() => {
            if (this._isOpen) this._live.textContent = said;
        }, 250);
    }

    // ---- choosing -------------------------------------------------------

    _onKeyDown(e) {
        if (e.isComposing) return;
        const inInput = e.target === this._input;
        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                e.stopPropagation();
                if (!this.back()) this.close();
                return;
            case 'ArrowDown':
            case 'ArrowUp':
                if (!inInput) return;
                e.preventDefault();
                this._setActive(this._nextEnabled(this._active, e.key === 'ArrowDown' ? 1 : -1));
                return;
            case 'Home':
            case 'End':
                if (!inInput || e.shiftKey || !this._results.length) return;
                e.preventDefault();
                this._setActive(e.key === 'Home'
                    ? this._nextEnabled(-1, 1)
                    : this._nextEnabled(this._results.length, -1));
                return;
            case 'Enter': {
                if (!inInput) return;
                e.preventDefault();
                const entry = this._results[this._active];
                if (entry) this._choose(entry.command, e);
                return;
            }
            case 'Backspace':
                if (inInput && this._input.value === '' && this._pages.length) {
                    e.preventDefault();
                    this.back();
                }
                return;
            default:
        }
    }

    _choose(command, event) {
        if (!command || command.disabled) return;
        if (this._fire('beforeSelect', command, this) === false) return;
        this._fire('select', command, this);
        if (command.children) {
            this._enter(command);
            return;
        }
        this._run(command, event);
    }

    _enter(command) {
        this._cancelSource();
        this._sourceResults = [];
        this._error = null;
        const page = {command, query: this._query, commands: [], loading: false, error: null, abort: null};
        this._pages.push(page);
        this._input.value = '';
        this._query = '';
        this._renderCrumbs();
        if (Array.isArray(command.children)) {
            page.commands = command.children;
        } else if (typeof command.children === 'function') {
            page.loading = true;
            page.abort = typeof AbortController === 'function' ? new AbortController() : null;
            let pending;
            try {
                pending = Promise.resolve(command.children(command, {signal: page.abort?.signal, palette: this}));
            } catch (err) {
                pending = Promise.reject(err);
            }
            pending.then((list) => {
                page.loading = false;
                page.commands = Array.isArray(list) ? list : [];
                if (this._currentPage() === page) this._update({resetActive: true});
            }, (err) => {
                page.loading = false;
                if (err && err.name === 'AbortError') return;
                page.error = err || new Error('children failed');
                if (this._currentPage() === page) this._update({resetActive: true});
            });
        }
        this._update({resetActive: true});
        this._input.focus({preventScroll: true});
    }

    _run(command, event) {
        this._remember(command);
        if (command.keepOpen !== true) this.close();
        this._fire('run', command, this);
        if (typeof command.action === 'function') {
            command.action(command, this, event);
        } else if (command.href) {
            const href = safeHref(command.href);
            const newTab = command.target === '_blank' || !!(event && (event.metaKey || event.ctrlKey));
            if (href) {
                if (typeof this.options.navigate === 'function') this.options.navigate(href, {newTab, command});
                else if (newTab) window.open(href, '_blank', 'noopener');
                else window.location.assign(href);
            }
        }
        if (this._isOpen) this._update();
    }
}

/**
 * A new command palette.
 * @param {Object} [options]
 * @returns {CommandPalette}
 */
export function createCommandPalette(options = {}) {
    return new CommandPalette(options);
}

export default CommandPalette;
