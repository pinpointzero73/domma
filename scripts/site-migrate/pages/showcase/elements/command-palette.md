---
title: Command Palette
description: "A Cmd/Ctrl+K launcher - every action and page a few keystrokes away, with fuzzy search, nested pages, async results and recents"
layout: with-sidebar
status: published
sortOrder: 50
---

[hero title="Command Palette" tagline="A Cmd/Ctrl+K launcher - every action and page a few keystrokes away, with fuzzy search, nested pages, async results and recents" align="center"][/hero]

## Overview

[showcase-demo id="showcase/elements/command-palette/overview" title="Overview" /]

### Key Features

- **Fuzzy search** - "chth" finds "Change theme"; matched letters are highlighted (always as text, never HTML)
- **Groups and recents** - headings per group; recently run commands first, remembered with `S`
- **Nested pages** - from an array or an async function; Backspace or Escape goes back up
- **Async source** - debounced, aborted when the query changes, with loading, empty and error states
- **Keyboard first** - arrows, Home/End, Enter, Escape; Tab stays inside (a focus trap)
- **Accessible** - the ARIA combobox + listbox pattern, with the result count announced

### Basic Usage

```
const palette = E.commandPalette({
    commands: [
        {id: 'new', title: 'New page', group: 'Pages', icon: 'plus', shortcut: 'mod+n', action: newPage},
        {id: 'docs', title: 'Documentation', href: '/docs/', keywords: ['help']}
    ]
});
// Cmd+K on a Mac, Ctrl+K elsewhere - or palette.open()
```

## The palette

Open it with the button or the hotkey. Try *"toast"*, *"chth"* (then Enter for the nested theme page), *"pop"* for a link, or the **Repositories** page, which loads its commands asynchronously. Run a command or two and open the palette again: they appear under **Recent**.

[showcase-demo id="showcase/elements/command-palette/the-palette" title="The palette" /]

```
const palette = E.commandPalette({
    recentKey: 'showcase-palette',
    commands: [
        {id: 'toast-ok', title: 'Show a success toast', group: 'Actions', icon: 'check',
         shortcut: 'mod+shift+s', action: () => E.toast('Saved', {type: 'success'})},
        {id: 'theme', title: 'Change theme…', group: 'Appearance', icon: 'droplet',
         children: Domma.theme.listThemes().map(t => ({
             id: 'theme:' + t, title: t, action: () => Domma.theme.set(t)
         }))},
        {id: 'repos', title: 'Repositories…', group: 'Go to', icon: 'git-branch',
         children: async (command, {signal}) => loadRepos(signal)},
        {id: 'go-popover', title: 'Popover', subtitle: 'Showcase page', group: 'Go to',
         icon: 'external-link', href: '/showcase/elements/popover'}
    ],
    onBeforeSelect: (command) => {
        if (command.id === 'danger') {
            E.toast('Not today', {type: 'warning'});
            return false;               // refuse it
        }
    }
});
$('#open-main').on('click', () => palette.open());
// teardown: palette.destroy()
```

## Searching a server

With `source(query, {signal})` the palette asks somewhere else. Here a pretend people directory answers after 400 ms. Each keystroke waits out the `debounce` before asking, and a new query aborts the request still running through `signal` - the counters show it. Tick the box to make the "server" fail and see the error state; search for something nobody is called to see the empty state.

[showcase-demo id="showcase/elements/command-palette/searching-a-server" title="Searching a server" /]

```
const people = E.commandPalette({
    hotkey: false,
    placeholder: 'Search people…',
    debounce: 200,
    source: (query, {signal}) => new Promise((resolve, reject) => {
        const timer = setTimeout(() => resolve(search(query)), 400);
        signal.onabort = () => {
            clearTimeout(timer);
            reject(new DOMException('Aborted', 'AbortError'));
        };
    })
    // in a real page: (query, {signal}) => H.get('/api/people?q=' + encodeURIComponent(query), {signal})
});
```

## Keyboard

[table striped="true"]
| Key | Does |
| --- | --- |
| Ctrl K / ⌘ K | Open or close (the `hotkey` option; `false` for none) |
| ↑ ↓ | Move through the results, wrapping, skipping disabled ones |
| Home End | First and last result |
| Enter | Run the highlighted command, or open its page |
| Backspace | In an empty box: up one page |
| Esc | Up one page; at the top, close |
| Tab | Stays inside the palette |
[/table]

Shortcuts on commands (`shortcut: 'mod+s'`) are shown as hints in the platform's own names and given to screen readers as `aria-keyshortcuts`; binding them is up to you.

## Events

`beforeopen`, `open`, `beforeclose`, `close`, `query`, `beforeselect` (cancelable), `select` and `run` - as `onX` options, `.on('x')` listeners and bubbling `dm:command-palette:x` DOM events (`detail = {instance, args}`). Return `false` from `beforeopen`, `beforeclose` or `beforeselect` to refuse: the **Delete everything** command above is refused by `onBeforeSelect`. This log is one `document` listener, so it hears both palettes.

[showcase-demo id="showcase/elements/command-palette/events" title="Events" /]

```
const EVENTS = 'dm:command-palette:open dm:command-palette:close dm:command-palette:select dm:command-palette:run';
const onEvent = (e) => {
    const command = e.detail.args[0];       // select and run: the command
    log(e.type.split(':').pop() + (command.title ? ' "' + command.title + '"' : ''));
};
$(document).on(EVENTS, onEvent);
// teardown: $(document).off(EVENTS, onEvent)

palette.on('run', (command) => console.log(command.id));   // or on one palette
```

## API

```
const palette = E.commandPalette({
    commands: [],          // {id, title, subtitle, group, icon, keywords, shortcut, href, target,
                           //  action(command, palette, event), disabled, hidden, keepOpen, children}
    source: null,          // (query, {signal}) => Promise<commands>
    debounce: 150,
    hotkey: 'mod+k',       // or ['mod+k', '/'], or false
    placeholder: 'Type a command or search…',
    label: 'Command palette',
    sourceGroup: null,     // heading for source results without a group
    maxResults: 50,
    recentKey: null,       // S key; null = no recents
    recentLimit: 5,
    emptyText, loadingText, errorText, footer: true,
    navigate: null,        // (href, {newTab, command}) => void
    onOpen, onClose, onQuery, onBeforeSelect, onSelect, onRun
});

palette.open('query'); palette.close(); palette.toggle(); palette.isOpen();
palette.setCommands(list); palette.addCommands(list); palette.removeCommand('id'); palette.getCommands();
palette.back(); palette.query(); palette.recent(); palette.clearRecent(); palette.destroy();

E.commandPalette.formatShortcut('mod+k');   // ['Ctrl', 'K'] - or ['⌘', 'K'] on a Mac
E.commandPalette.fuzzyMatch('chth', 'Change theme');   // {score, indices} or null
E.commandPalette.claims(event);   // true when a palette's hotkey owns this keydown
```
