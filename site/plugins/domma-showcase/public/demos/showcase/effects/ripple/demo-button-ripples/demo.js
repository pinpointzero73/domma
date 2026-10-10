/**
 * Demo: Button Ripples - from public/showcase/effects/ripple.
 */
export function mount(root) {
        // Demo 1: Basic buttons
    Domma.effects.ripple('.ripple-demo-1', {
          colour: 'rgba(255, 255, 255, 0.35)',
          duration: 600,
          respectMotionPreference: false
        });
}
