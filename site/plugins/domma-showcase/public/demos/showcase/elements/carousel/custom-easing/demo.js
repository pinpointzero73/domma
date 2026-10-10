/**
 * Custom Easing - from public/showcase/elements/carousel.
 */
export function mount(root) {
    E.carousel(root.querySelector('#easing-carousel'), {animation: 'slide', animationDuration: 900, animationEasing: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)'});
}
