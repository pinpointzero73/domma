/**
 * Theming and transitions - from public/showcase/elements/context-menu.
 */
export function mount(root) {
        // Theming demos
    E.contextMenu(root.querySelector('#theme-accent'), {
            inherit: false, accent: 'danger', radius: 'lg', transition: 'slide',
            animationDuration: 180,
            items: [
                {label: 'Accented hover', icon: 'eye'},
                {label: 'Another item', icon: 'copy'},
                {type: 'divider'},
                {label: 'Delete', icon: 'trash', danger: true}
            ]
        });
    E.contextMenu(root.querySelector('#theme-glass'), {
            inherit: false, opacity: 80, shadow: 'xl', transition: 'fade', accent: '#38bdf8',
            items: [
                {label: 'Blurred backdrop', icon: 'layers'},
                {label: 'Still readable', icon: 'check'}
            ]
        });
    E.contextMenu(root.querySelector('#theme-compact'), {
            inherit: false, density: 'compact', transition: 'none', radius: 'sm',
            items: [
                {label: 'Compact row', icon: 'list'},
                {label: 'Tighter spacing', icon: 'minimize'},
                {label: 'No transition', icon: 'zap'}
            ]
        });
}
