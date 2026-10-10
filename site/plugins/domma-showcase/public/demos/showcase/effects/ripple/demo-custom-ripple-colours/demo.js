/**
 * Demo: Custom Ripple Colours - from public/showcase/effects/ripple.
 */
export function mount(root) {
        // Demo 2: Custom colours
    Domma.effects.ripple('.ripple-colour-blue', {
          colour: 'rgba(21, 101, 192, 0.3)',
          respectMotionPreference: false
        });
    Domma.effects.ripple('.ripple-colour-green', {
          colour: 'rgba(46, 125, 50, 0.3)',
          respectMotionPreference: false
        });
    Domma.effects.ripple('.ripple-colour-red', {
          colour: 'rgba(198, 40, 40, 0.3)',
          respectMotionPreference: false
        });
}
