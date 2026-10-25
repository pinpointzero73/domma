/**
 * The palette - commands, a nested page, an async page, links and recents. Owns Ctrl/Cmd+K.
 */
export function mount(root) {
    const timers = new Set();

    // A pretend request: resolves after `ms`, or rejects when the signal aborts.
    const later = (ms, value, signal) => new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            timers.delete(timer);
            resolve(value);
        }, ms);
        timers.add(timer);
        signal?.addEventListener('abort', () => {
            clearTimeout(timer);
            timers.delete(timer);
            reject(new DOMException('Aborted', 'AbortError'));
        });
    });

    const repo = (name, subtitle) => ({
        id: 'repo:' + name, title: name, subtitle, icon: 'box',
        action: () => E.toast(name, {type: 'info'})
    });

    const pages = ['Modal', 'Popover', 'Slideover', 'Tooltip', 'Focus Trap', 'Toast'];

    const palette = E.commandPalette({
        recentKey: 'showcase-palette',
        commands: [
            {id: 'toast-ok', title: 'Show a success toast', group: 'Actions', icon: 'check',
                shortcut: 'mod+shift+s', action: () => E.toast('Saved', {type: 'success'})},
            {id: 'toast-info', title: 'Show an info toast', group: 'Actions', icon: 'info',
                keywords: ['message', 'notify'], action: () => E.toast('Just so you know', {type: 'info'})},
            {id: 'copy-link', title: 'Copy link to this page', group: 'Actions', icon: 'link', shortcut: 'mod+l',
                action: () => E.toast('Link copied (pretend)', {type: 'success'})},
            {id: 'count', title: 'Count, and stay open', subtitle: 'keepOpen: true', group: 'Actions', icon: 'plus',
                keepOpen: true, action: (command) => {
                    command.times = (command.times || 0) + 1;
                    command.subtitle = 'Pressed ' + command.times + (command.times === 1 ? ' time' : ' times');
                }},
            {id: 'danger', title: 'Delete everything', subtitle: 'Refused by beforeselect', group: 'Actions',
                icon: 'trash'},
            {id: 'disabled', title: 'Upgrade plan', subtitle: 'disabled: true', group: 'Actions', icon: 'star',
                disabled: true},

            // A nested page from an array.
            {id: 'theme', title: 'Change theme…', group: 'Appearance', icon: 'droplet',
                keywords: ['colour', 'dark'], placeholder: 'Pick a theme…',
                children: Domma.theme.listThemes().map((t) => ({
                    id: 'theme:' + t,
                    title: t,
                    group: /-dark$/.test(t) ? 'Dark' : 'Light',
                    icon: /-dark$/.test(t) ? 'moon' : 'sun',
                    action: () => Domma.theme.set(t)
                }))},

            // A nested page loaded when it is opened.
            {id: 'repos', title: 'Repositories…', subtitle: 'Loaded when you open it', group: 'Go to',
                icon: 'git-branch',
                children: (command, {signal}) => later(600, [
                    repo('domma', 'The framework'),
                    repo('domma-reactive', 'Reactivity'),
                    repo('domma-celebrate', 'Seasonal effects')
                ], signal)},

            // Links.
            ...pages.map((name) => ({
                id: 'go:' + name,
                title: name,
                subtitle: 'Showcase page',
                group: 'Go to',
                icon: 'external-link',
                href: '/showcase/elements/' + name.toLowerCase().replace(/\s+/g, '-')
            }))
        ],
        onBeforeSelect: (command) => {
            if (command.id === 'danger') {
                E.toast('Not today', {type: 'warning'});
                return false;
            }
        }
    });

    // The hint shows the platform's own key names.
    $(root).find('#launch-kbd').text(E.commandPalette.formatShortcut('mod+k').join(' '));
    $(root).find('#open-main').on('click', () => palette.open());
    $(root).find('#clear-recent').on('click', () => {
        palette.clearRecent();
        E.toast('Recents forgotten', {type: 'info'});
    });

    return () => {
        timers.forEach(clearTimeout);
        palette.destroy();
    };
}
