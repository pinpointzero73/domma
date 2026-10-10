/**
 * Quick Start - from public/showcase/elements/carousel.
 */
export function mount(root) {
    E.carousel(root.querySelector('#quick-carousel'), {autoplay: false, showArrows: true, showIndicators: true});
}
