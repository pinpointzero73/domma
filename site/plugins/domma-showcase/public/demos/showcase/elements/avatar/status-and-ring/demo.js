/**
 * Status and ring - from public/showcase/elements/avatar.
 */
export function mount(root) {
        // ---- Status and ring ---------------------------------------------------
    [
            {name: 'Amara Okafor', src: '/plugins/domma-showcase/public/assets/elements/avatar/img/amara.svg', status: 'online'},
            {name: 'Priya Shah', status: 'away'},
            {name: 'Tom Hughes', status: 'busy', statusLabels: {busy: 'in a meeting'}},
            {name: 'Rhys Morgan', status: 'offline'},
            {name: 'Sofia Rossi', ring: true},
            {name: 'Mei Chen', src: 'img/does-not-exist.png', ring: true, status: 'online', shape: 'rounded'}
        ].forEach((o) => $(root).find('#demo-status').append(E.avatar({size: 'lg', title: true, ...o}).element));
}
