/**
 * Pictures, initials, icons and fallbacks - from public/showcase/elements/avatar.
 */
export function mount(root) {
        // ---- Fallbacks --------------------------------------------------------
    [
            {name: 'Priya Shah', src: '/plugins/domma-showcase/public/assets/elements/avatar/img/priya.svg'},
            {name: 'Callum Reid', src: 'img/does-not-exist.png'},
            {name: 'Nia Evans'},
            {name: 'Support team', icon: 'headphones'},
            {}
        ].forEach((o) => $(root).find('#demo-fallbacks').append(E.avatar({size: 'lg', title: true, ...o}).element));
}
