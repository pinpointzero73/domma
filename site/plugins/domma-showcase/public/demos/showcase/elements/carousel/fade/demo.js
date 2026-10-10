/**
 * Fade - from public/showcase/elements/carousel.
 */
export function mount(root) {
    E.carousel(root.querySelector('#fade-carousel'), {animation: 'fade', animationDuration: 900, autoplay: true, interval: 4000, pauseOnHover: true});
}
