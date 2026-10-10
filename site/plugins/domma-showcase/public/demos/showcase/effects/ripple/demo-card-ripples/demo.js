/**
 * Demo: Card Ripples - from public/showcase/effects/ripple.
 */
export function mount(root) {
        // Demo 4: Card ripples
    Domma.effects.ripple('.ripple-card-demo', {
          colour: 'rgba(13, 110, 253, 0.15)',
          duration: 800,
          respectMotionPreference: false
        });
}
