/**
 * With Autoplay - from public/showcase/elements/carousel.
 */
export function mount(root) {
    E.carousel(root.querySelector('#autoplay-carousel'), {autoplay: true, interval: 3000, pauseOnHover: true});
}
