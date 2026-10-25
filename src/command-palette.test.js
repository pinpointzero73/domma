// src/command-palette.test.js - E.commandPalette
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Domma from './index.js';
import {formatShortcut, fuzzyMatch, matchesHotkey, parseHotkey} from './components/command-palette.js';

const E = Domma.elements;
const S = Domma.storage;
const made = [];

function palette(options = {}) {
    const p = E.commandPalette({animationDuration: 0, mac: false, ...options});
    made.push(p);
    return p;
}

const COMMANDS = [
    {id: 'new', title: 'New file', group: 'File', shortcut: 'mod+n', icon: 'plus'},
    {id: 'open', title: 'Open file', group: 'File', keywords: ['load']},
    {id: 'save', title: 'Save', group: 'File', subtitle: 'Write to disk', shortcut: 'mod+s'},
    {id: 'theme', title: 'Change theme', group: 'View', children: [
        {id: 'theme-dark', title: 'Dark'},
        {id: 'theme-light', title: 'Light'}
    ]},
    {id: 'off', title: 'Disabled thing', group: 'View', disabled: true}
];

const input = (p) => p.element.querySelector('.dm-command-palette-input');
const rows = (p) => [...p.element.querySelectorAll('[role="option"]')];
const titles = (p) => rows(p).map(r => r.querySelector('.dm-command-palette-title').textContent);
const active = (p) => p.element.querySelector('[role="option"][aria-selected="true"]');
function type(p, value) {
    input(p).value = value;
    input(p).dispatchEvent(new Event('input', {bubbles: true}));
}
function key(target, k, extra = {}) {
    const e = new KeyboardEvent('keydown', {key: k, bubbles: true, cancelable: true, ...extra});
    target.dispatchEvent(e);
    return e;
}

beforeEach(() => {
    S.clear();
});

afterEach(() => {
    while (made.length) made.pop().destroy();
    document.body.innerHTML = '';
    vi.useRealTimers();
});

describe('matching helpers', () => {
    it('fuzzyMatch: prefix beats substring beats scattered letters; non-matches are null', () => {
        const prefix = fuzzyMatch('sav', 'Save file');
        const sub = fuzzyMatch('ave', 'Save file');
        const scattered = fuzzyMatch('svf', 'Save file');
        expect(prefix.indices).toEqual([0, 1, 2]);
        expect(prefix.score).toBeGreaterThan(sub.score);
        expect(sub.score).toBeGreaterThan(scattered.score);
        expect(scattered.indices).toEqual([0, 2, 5]);
        expect(fuzzyMatch('xyz', 'Save file')).toBeNull();
        expect(fuzzyMatch('', 'x')).toEqual({score: 0, indices: []});
    });

    it('fuzzyMatch prefers word starts', () => {
        expect(fuzzyMatch('ct', 'Change theme').indices).toEqual([0, 7]);
    });

    it('parseHotkey / matchesHotkey: mod is Cmd on a Mac and Ctrl elsewhere', () => {
        const hk = parseHotkey('mod+k');
        const ctrlK = new KeyboardEvent('keydown', {key: 'k', ctrlKey: true});
        const cmdK = new KeyboardEvent('keydown', {key: 'k', metaKey: true});
        expect(matchesHotkey(ctrlK, hk, false)).toBe(true);
        expect(matchesHotkey(cmdK, hk, false)).toBe(false);
        expect(matchesHotkey(cmdK, hk, true)).toBe(true);
        expect(matchesHotkey(new KeyboardEvent('keydown', {key: 'K', ctrlKey: true, shiftKey: true}), hk, false)).toBe(false);
        expect(matchesHotkey(new KeyboardEvent('keydown', {key: '˚', code: 'KeyK', ctrlKey: true}), hk, false)).toBe(true);
    });

    it('formatShortcut gives platform labels', () => {
        expect(formatShortcut('mod+s', true)).toEqual(['⌘', 'S']);
        expect(formatShortcut('mod+shift+p', false)).toEqual(['Ctrl', 'Shift', 'P']);
        expect(formatShortcut('alt+enter', false)).toEqual(['Alt', '↵']);
        expect(E.commandPalette.formatShortcut('ctrl+/', false)).toEqual(['Ctrl', '/']);
    });
});

describe('E.commandPalette', () => {
    it('builds its own overlay on <body>, hidden until opened', () => {
        const p = palette({commands: COMMANDS});
        expect(p.element.parentNode).toBe(document.body);
        expect(p.element.hidden).toBe(true);
        expect(E.get(p.element, 'command-palette')).toBe(p);
        p.open();
        expect(p.isOpen()).toBe(true);
        expect(p.element.hidden).toBe(false);
        expect(document.activeElement).toBe(input(p));
    });

    it('lists commands under group headings, in the order given', () => {
        const p = palette({commands: COMMANDS});
        p.open();
        expect(titles(p)).toEqual(['New file', 'Open file', 'Save', 'Change theme', 'Disabled thing']);
        const headings = [...p.element.querySelectorAll('.dm-command-palette-group-heading')].map(h => h.textContent);
        expect(headings).toEqual(['File', 'View']);
        expect(p.element.querySelector('[role="group"]').getAttribute('aria-labelledby')).toBeTruthy();
    });

    it('ARIA: combobox controls the listbox and points at the active option', () => {
        const p = palette({commands: COMMANDS});
        p.open();
        const box = input(p);
        const list = p.element.querySelector('[role="listbox"]');
        expect(box.getAttribute('role')).toBe('combobox');
        expect(box.getAttribute('aria-controls')).toBe(list.id);
        expect(box.getAttribute('aria-expanded')).toBe('true');
        expect(box.getAttribute('aria-activedescendant')).toBe(active(p).id);
        expect(p.element.querySelector('[role="dialog"]').getAttribute('aria-modal')).toBe('true');
        expect(rows(p)[4].getAttribute('aria-disabled')).toBe('true');
        expect(rows(p)[0].getAttribute('aria-keyshortcuts')).toBe('Control+N');
    });

    it('filters fuzzily, highlights matches in spans and escapes titles', () => {
        const p = palette({commands: [...COMMANDS, {id: 'x', title: '<img src=x onerror=alert(1)> file'}]});
        p.open();
        type(p, 'opfi');
        expect(titles(p)[0]).toBe('Open file');
        const marks = [...rows(p)[0].querySelectorAll('.dm-command-palette-match')].map(m => m.textContent);
        expect(marks).toEqual(['Op', 'fi']);
        type(p, 'img');
        expect(p.element.querySelector('img')).toBeNull();
        expect(titles(p)).toEqual(['<img src=x onerror=alert(1)> file']);
    });

    it('matches keywords and subtitles too', () => {
        const p = palette({commands: COMMANDS});
        p.open();
        type(p, 'load');
        expect(titles(p)).toEqual(['Open file']);
        type(p, 'disk');
        expect(titles(p)).toEqual(['Save']);
    });

    it('shows the empty state and announces the count', async () => {
        vi.useFakeTimers();
        const p = palette({commands: COMMANDS});
        p.open();
        type(p, 'zzzz');
        expect(rows(p)).toHaveLength(0);
        const status = p.element.querySelector('.dm-command-palette-status');
        expect(status.hidden).toBe(false);
        expect(status.textContent).toBe('No results');
        expect(input(p).getAttribute('aria-expanded')).toBe('false');
        type(p, 'file');
        vi.advanceTimersByTime(300);
        expect(p.element.querySelector('[aria-live]').textContent).toBe('2 results');
    });

    it('maxResults caps the list', () => {
        const p = palette({commands: COMMANDS, maxResults: 2});
        p.open();
        expect(rows(p)).toHaveLength(2);
    });

    it('keyboard: arrows wrap and skip disabled rows, Home/End jump, Enter runs', () => {
        const action = vi.fn();
        const p = palette({commands: [
            {id: 'a', title: 'Alpha', action},
            {id: 'b', title: 'Beta', disabled: true},
            {id: 'c', title: 'Gamma'}
        ]});
        p.open();
        const box = input(p);
        expect(active(p).textContent).toContain('Alpha');
        key(box, 'ArrowDown');
        expect(active(p).textContent).toContain('Gamma');
        key(box, 'ArrowDown');
        expect(active(p).textContent).toContain('Alpha');
        key(box, 'ArrowUp');
        expect(active(p).textContent).toContain('Gamma');
        key(box, 'Home');
        expect(active(p).textContent).toContain('Alpha');
        key(box, 'End');
        expect(active(p).textContent).toContain('Gamma');
        key(box, 'Home');
        key(box, 'Enter');
        expect(action).toHaveBeenCalledTimes(1);
        expect(action.mock.calls[0][0].id).toBe('a');
        expect(action.mock.calls[0][1]).toBe(p);
        expect(p.isOpen()).toBe(false);
    });

    it('a click runs the row; keepOpen keeps the palette open', () => {
        const action = vi.fn();
        const p = palette({commands: [{id: 'k', title: 'Keep', keepOpen: true, action}]});
        p.open();
        rows(p)[0].click();
        expect(action).toHaveBeenCalledTimes(1);
        expect(p.isOpen()).toBe(true);
    });

    it('events: open/close/query/select/run via option, .on() and dm:command-palette:*', () => {
        const onOpen = vi.fn();
        const onQuery = vi.fn();
        const onRun = vi.fn();
        const p = palette({commands: COMMANDS, onOpen, onQuery, onRun});
        const viaOn = vi.fn();
        const viaDom = vi.fn();
        p.on('select', viaOn);
        p.element.addEventListener('dm:command-palette:close', viaDom);
        p.open();
        expect(onOpen).toHaveBeenCalledWith(p);
        type(p, 'save');
        expect(onQuery).toHaveBeenCalledWith('save', p);
        key(input(p), 'Enter');
        expect(viaOn.mock.calls[0][0].id).toBe('save');
        expect(onRun.mock.calls[0][0].id).toBe('save');
        expect(viaDom).toHaveBeenCalledTimes(1);
    });

    it('beforeselect, beforeopen and beforeclose are cancelable', () => {
        const action = vi.fn();
        const p = palette({commands: [{id: 'a', title: 'A', action}], onBeforeSelect: () => false});
        p.open();
        key(input(p), 'Enter');
        expect(action).not.toHaveBeenCalled();
        expect(p.isOpen()).toBe(true);

        p.on('beforeclose', () => false);
        key(input(p), 'Escape');
        expect(p.isOpen()).toBe(true);

        const q = palette({onBeforeOpen: () => false});
        q.open();
        expect(q.isOpen()).toBe(false);
    });

    it('Escape closes and focus goes back to where it was', () => {
        document.body.insertAdjacentHTML('afterbegin', '<button id="launch">Go</button>');
        const launch = document.getElementById('launch');
        launch.focus();
        const p = palette({commands: COMMANDS});
        p.open();
        expect(document.activeElement).toBe(input(p));
        key(input(p), 'Escape');
        expect(p.isOpen()).toBe(false);
        expect(p.element.hidden).toBe(true);
        expect(document.activeElement).toBe(launch);
    });

    it('Tab stays inside the palette', () => {
        document.body.insertAdjacentHTML('afterbegin', '<button id="outside">x</button>');
        const p = palette({commands: COMMANDS});
        p.open();
        key(input(p), 'Tab');
        expect(p.element.contains(document.activeElement)).toBe(true);
        key(document.activeElement, 'Tab', {shiftKey: true});
        expect(p.element.contains(document.activeElement)).toBe(true);
    });

    it('nested pages: enter, crumb, Backspace on empty input and Escape go up', () => {
        const select = vi.fn();
        const p = palette({commands: COMMANDS, onSelect: select});
        p.open('theme');
        key(input(p), 'Enter');
        expect(select.mock.calls[0][0].id).toBe('theme');
        expect(p.isOpen()).toBe(true);
        expect(titles(p)).toEqual(['Dark', 'Light']);
        const crumbs = p.element.querySelector('.dm-command-palette-crumbs');
        expect(crumbs.hidden).toBe(false);
        expect(crumbs.textContent).toContain('Change theme');
        expect(input(p).value).toBe('');

        key(input(p), 'Backspace');
        expect(titles(p)).toEqual(['Change theme']);
        expect(input(p).value).toBe('theme');   // the query from before comes back

        key(input(p), 'Enter');
        key(input(p), 'Escape');
        expect(p.isOpen()).toBe(true);
        expect(crumbs.hidden).toBe(true);
        key(input(p), 'Escape');
        expect(p.isOpen()).toBe(false);

        p.open();
        type(p, 'theme');
        key(input(p), 'Enter');
        p.element.querySelector('.dm-command-palette-back').click();
        expect(crumbs.hidden).toBe(true);
    });

    it('nested pages from an async function, with a loading state', async () => {
        let resolve;
        const children = vi.fn(() => new Promise(r => { resolve = r; }));
        const p = palette({commands: [{id: 'repos', title: 'Repositories', children}]});
        p.open();
        key(input(p), 'Enter');
        expect(children).toHaveBeenCalledTimes(1);
        const status = p.element.querySelector('.dm-command-palette-status');
        expect(status.dataset.state).toBe('loading');
        resolve([{id: 'r1', title: 'domma'}, {id: 'r2', title: 'domma-reactive'}]);
        await Promise.resolve();
        await Promise.resolve();
        expect(titles(p)).toEqual(['domma', 'domma-reactive']);
        type(p, 'react');
        expect(titles(p)).toEqual(['domma-reactive']);
    });

    it('async source: debounced, aborts the request it replaces, ignores late answers', async () => {
        vi.useFakeTimers();
        const signals = [];
        const resolvers = [];
        const source = vi.fn((q, {signal}) => {
            signals.push(signal);
            return new Promise(r => resolvers.push(() => r([{id: `s-${q}`, title: `Result for ${q}`}])));
        });
        const p = palette({source, debounce: 100});
        p.open();
        expect(source).toHaveBeenCalledTimes(1);   // the empty query on open
        type(p, 'a');
        type(p, 'ab');
        expect(signals[0].aborted).toBe(true);
        vi.advanceTimersByTime(99);
        expect(source).toHaveBeenCalledTimes(1);
        vi.advanceTimersByTime(1);
        expect(source).toHaveBeenCalledTimes(2);
        expect(source.mock.calls[1][0]).toBe('ab');
        expect(p.element.querySelector('.dm-command-palette-spinner').hidden).toBe(false);
        resolvers[0]();   // the stale first answer
        resolvers[1]();
        await vi.runAllTimersAsync();
        expect(titles(p)).toEqual(['Result for ab']);
        expect(p.element.querySelector('.dm-command-palette-spinner').hidden).toBe(true);
    });

    it('async source: an error shows the error state', async () => {
        const p = palette({source: () => Promise.reject(new Error('down')), errorText: 'Could not search'});
        p.open();
        await Promise.resolve();
        await Promise.resolve();
        const status = p.element.querySelector('.dm-command-palette-status');
        expect(status.dataset.state).toBe('error');
        expect(status.textContent).toBe('Could not search');
    });

    it('recents: remembered under recentKey via S and shown first with no query', () => {
        const p = palette({commands: COMMANDS, recentKey: 'cp-test'});
        p.open('save');
        key(input(p), 'Enter');
        expect(S.get('cp-test')).toEqual(['save']);
        p.open();
        const first = p.element.querySelector('.dm-command-palette-group-heading');
        expect(first.textContent).toBe('Recent');
        expect(titles(p)[0]).toBe('Save');
        expect(titles(p).filter(t => t === 'Save')).toHaveLength(1);
        p.open('dark');
        p.close();
        // nested commands are found again too
        p.open('theme');
        key(input(p), 'Enter');
        key(input(p), 'Enter');
        expect(p.recent()).toEqual(['theme-dark', 'save']);
        p.clearRecent();
        expect(S.get('cp-test')).toBeNull();
    });

    it('recents: a link from an async page comes back after a reload; an action needs resolveRecent', async () => {
        const kids = async () => [
            {id: 'page:/about', title: 'About', group: 'Pages', href: '#/pages/edit/about', keywords: ['us']},
            {id: 'act', title: 'Do it', action: () => {}},
            {id: 'bad', title: 'Bad', href: 'javascript:alert(1)'}
        ];
        const commands = [{id: 'pages', title: 'Pages', children: kids}];
        const first = palette({commands, recentKey: 'cp-reload', navigate: () => {}});
        const pick = async (title) => {
            first.open('pages');
            key(input(first), 'Enter');
            await new Promise(r => setTimeout(r, 0));
            type(first, title);
            key(input(first), 'Enter');
        };
        await pick('Do it');
        await pick('Bad');
        await pick('About');
        expect(first.recent()).toEqual(['page:/about', 'bad', 'act']);
        expect(Object.keys(S.get('cp-reload:saved'))).toEqual(['page:/about']);
        first.destroy();

        // a new page load: nothing has opened the async page yet
        const seen = [];
        const again = palette({commands, recentKey: 'cp-reload', navigate: (href) => seen.push(href)});
        again.open();
        expect(titles(again).slice(0, 1)).toEqual(['About']);
        expect(titles(again)).not.toContain('Do it');
        key(input(again), 'Enter');
        expect(seen).toHaveLength(1);
        expect(seen[0]).toMatch(/#\/pages\/edit\/about$/);
        again.destroy();

        const ran = [];
        const resolved = palette({commands, recentKey: 'cp-reload',
            resolveRecent: (id) => (id === 'act' ? {id: 'act', title: 'Do it', action: () => ran.push(id)} : null)});
        resolved.open();
        expect(titles(resolved).slice(0, 2)).toEqual(['About', 'Do it']);
        resolved.clearRecent();
        expect(S.get('cp-reload:saved')).toBeNull();
        expect(S.get('cp-reload')).toBeNull();
    });

    it('recents off by default', () => {
        const p = palette({commands: COMMANDS});
        p.open('save');
        key(input(p), 'Enter');
        expect(S.keys()).toEqual([]);
    });

    it('hotkey: mod+k toggles; a bare key is ignored while typing in a field', () => {
        document.body.insertAdjacentHTML('afterbegin', '<input id="field">');
        const p = palette({commands: COMMANDS});
        const e = key(document.body, 'k', {ctrlKey: true});
        expect(e.defaultPrevented).toBe(true);
        expect(p.isOpen()).toBe(true);
        key(input(p), 'k', {ctrlKey: true});
        expect(p.isOpen()).toBe(false);

        const q = palette({commands: COMMANDS, hotkey: '/'});
        key(document.getElementById('field'), '/');
        expect(q.isOpen()).toBe(false);
        key(document.body, '/');
        expect(q.isOpen()).toBe(true);
    });

    it('hotkey: false binds nothing', () => {
        const p = palette({hotkey: false});
        key(document.body, 'k', {ctrlKey: true});
        expect(p.isOpen()).toBe(false);
    });

    it('setCommands, addCommands and removeCommand update an open palette', () => {
        const p = palette({commands: COMMANDS});
        p.open();
        p.setCommands([{id: 'one', title: 'One'}]);
        expect(titles(p)).toEqual(['One']);
        p.addCommands([{id: 'two', title: 'Two'}, {id: 'one', title: 'Uno'}]);
        expect(titles(p)).toEqual(['Uno', 'Two']);
        p.removeCommand('one');
        expect(titles(p)).toEqual(['Two']);
    });

    it('href commands go through navigate, refusing javascript: links', () => {
        const navigate = vi.fn();
        const p = palette({navigate, commands: [
            {id: 'docs', title: 'Docs', href: '/docs/'},
            {id: 'bad', title: 'Bad', href: 'javascript:alert(1)'}
        ]});
        p.open('docs');
        key(input(p), 'Enter');
        expect(navigate).toHaveBeenCalledTimes(1);
        expect(navigate.mock.calls[0][0]).toMatch(/\/docs\/$/);
        expect(navigate.mock.calls[0][1].newTab).toBe(false);
        p.open('bad');
        key(input(p), 'Enter');
        expect(navigate).toHaveBeenCalledTimes(1);
    });

    it('show/hide/toggle delegate by name, so a patched close() covers them', () => {
        const p = palette({commands: COMMANDS});
        const guard = vi.fn();
        const close = p.close;
        p.close = function (...args) { guard(); return close.apply(this, args); };
        p.show();
        expect(p.isVisible()).toBe(true);
        p.hide();
        expect(guard).toHaveBeenCalledTimes(1);
        p.toggle();
        key(input(p), 'Escape');
        expect(guard).toHaveBeenCalledTimes(2);
        expect(p.isOpen()).toBe(false);
    });

    it('a backdrop click closes', () => {
        const p = palette({commands: COMMANDS});
        p.open();
        const backdrop = p.element.querySelector('.dm-command-palette-backdrop');
        backdrop.dispatchEvent(new Event('pointerdown', {bubbles: true}));
        backdrop.click();
        expect(p.isOpen()).toBe(false);
    });

    it('waits for the close animation before hiding', () => {
        vi.useFakeTimers();
        const p = palette({commands: COMMANDS, animationDuration: 120});
        p.open();
        p.close();
        expect(p.element.hidden).toBe(false);
        vi.advanceTimersByTime(120);
        expect(p.element.hidden).toBe(true);
    });

    it('destroy() removes the overlay, the hotkey and the trap', () => {
        const p = E.commandPalette({commands: COMMANDS, animationDuration: 0});
        p.open();
        const el = p.element;
        p.destroy();
        expect(el.isConnected).toBe(false);
        expect(E.focusTrap.top()).toBeNull();
        key(document.body, 'k', {ctrlKey: true});
        expect(p.isOpen()).toBe(false);
        expect(E.get(el, 'command-palette')).toBeUndefined();
    });
});

describe('E.commandPalette - the site search shortcut steps aside', () => {
    // public/layouts/js/modules/search.js binds Ctrl/Cmd+K too. It used to back off only
    // when the palette's listener had already run (defaultPrevented), so a palette made
    // AFTER search.js registered lost the key: both opened, or search took it.
    it('claims() says whether a live palette answers a keydown', () => {
        const ctrlK = new KeyboardEvent('keydown', {key: 'k', ctrlKey: true});
        expect(E.commandPalette.claims(ctrlK)).toBe(false);
        const p = palette();
        expect(E.commandPalette.claims(ctrlK)).toBe(true);
        expect(E.commandPalette.claims(new KeyboardEvent('keydown', {key: 'j', ctrlKey: true}))).toBe(false);
        p.destroy();
        expect(E.commandPalette.claims(ctrlK)).toBe(false);
        const off = palette({hotkey: false});
        expect(E.commandPalette.claims(ctrlK)).toBe(false);
        off.destroy();
    });

    it('search.js leaves Ctrl+K to a palette created after it registered', async () => {
        const had = {fetch: globalThis.fetch, Domma: globalThis.Domma};
        globalThis.fetch = vi.fn(async () => ({json: async () => []}));
        globalThis.Domma = Domma;
        try {
            const {SiteSearch} = await import('../public/layouts/js/modules/search.js');
            await SiteSearch.init(0);
            const p = palette();
            document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 'k', ctrlKey: true, bubbles: true, cancelable: true}));
            expect(p.isOpen()).toBe(true);
            const overlay = document.getElementById('site-search-overlay');
            expect(!overlay || !overlay.classList.contains('is-open')).toBe(true);
            p.destroy();
            // With no palette left, search answers the key again
            document.body.dispatchEvent(new KeyboardEvent('keydown', {key: 'k', ctrlKey: true, bubbles: true, cancelable: true}));
            expect(document.getElementById('site-search-overlay').classList.contains('is-open')).toBe(true);
            SiteSearch.close();
        } finally {
            globalThis.fetch = had.fetch;
            if (had.Domma === undefined) delete globalThis.Domma; else globalThis.Domma = had.Domma;
        }
    });
});
