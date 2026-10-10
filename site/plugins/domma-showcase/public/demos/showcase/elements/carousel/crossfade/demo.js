/**
 * Crossfade - from public/showcase/elements/carousel.
 */
export function mount(root) {
    E.carousel(root.querySelector('#crossfade-carousel'), {animation: 'crossfade', animationDuration: 1400, animationEasing: 'ease-in-out', autoplay: true, interval: 4500, pauseOnHover: true});
}
