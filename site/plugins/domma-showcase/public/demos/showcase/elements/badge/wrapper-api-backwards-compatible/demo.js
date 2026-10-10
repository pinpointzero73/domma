/**
 * Wrapper API (Backwards Compatible) - from public/showcase/elements/badge.
 * E.badge() wraps the element in a <domma-badge> Web Component.
 */
export function mount(root) {
    E.badge(root.querySelector('#wrapper-badge-1'), {
        variant: 'info',
        size: 'large',
        pill: true
    });
}
