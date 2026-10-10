/**
 * Demo: Duration Comparison - from public/showcase/effects/ripple.
 */
export function mount(root) {
        // Demo 5: Duration comparison
    Domma.effects.ripple('.ripple-fast', {
          duration: 300,
          colour: 'rgba(255, 255, 255, 0.4)',
          respectMotionPreference: false
        });
    Domma.effects.ripple('.ripple-normal', {
          duration: 600,
          colour: 'rgba(255, 255, 255, 0.4)',
          respectMotionPreference: false
        });
    Domma.effects.ripple('.ripple-slow', {
          duration: 1200,
          colour: 'rgba(255, 255, 255, 0.4)',
          respectMotionPreference: false
        });
}
