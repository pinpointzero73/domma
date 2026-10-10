/**
 * Tutorial - from public/showcase/elements/tooltip.
 */
export function mount(root) {
    E.tooltip(root.querySelector('#username-help'), {
                content: 'Username must be 3-20 characters',
                position: 'right'
            });
    E.tooltip(root.querySelector('#password-help'), {
                content: 'Password must be at least 8 characters',
                position: 'right'
            });
}
