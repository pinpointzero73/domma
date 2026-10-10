/**
 * 18. Carousel - from public/showcase/themes.
 */
export function mount(root) {
    E.carousel(root.querySelector('#audit-carousel'), { autoplay: true, interval: 5000, pauseOnHover: true });
}
