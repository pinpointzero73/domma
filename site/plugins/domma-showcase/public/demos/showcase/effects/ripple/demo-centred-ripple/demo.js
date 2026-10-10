/**
 * Demo: Centred Ripple - from public/showcase/effects/ripple.
 */
export function mount(root) {
        // Demo 3: Centred
    Domma.effects.ripple('.ripple-centered', {
          centered: true,
          colour: 'rgba(255, 255, 255, 0.4)',
          respectMotionPreference: false
        });
}
