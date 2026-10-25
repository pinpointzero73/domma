/**
 * Overview - the hotkey hint in the platform's own key names (the palette below owns the hotkey).
 */
export function mount(root) {
    $(root).find('#hotkey-hint').text(E.commandPalette.formatShortcut('mod+k').join(' '));
}
