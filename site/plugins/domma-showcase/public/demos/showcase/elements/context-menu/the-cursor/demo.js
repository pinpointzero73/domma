/**
 * The cursor - from public/showcase/elements/context-menu.
 */
export function mount(root) {
        // Cursor demos - the same menu three times, differing only in `cursor`.
    const cursorItems = [
            {label: 'Open', icon: 'folder'},
            {label: 'Rename', icon: 'edit'},
            {type: 'divider'},
            {label: 'Delete', icon: 'trash', danger: true}
        ];
    E.contextMenu(root.querySelector('#cursor-auto'), {
            inherit: false, cursor: 'auto', items: cursorItems
        });
    E.contextMenu(root.querySelector('#cursor-glyph'), {
            inherit: false, cursor: 'glyph', cursorSize: 26, items: cursorItems
        });
    E.contextMenu(root.querySelector('#cursor-off'), {
            inherit: false, cursor: false, items: cursorItems
        });
}
