/**
 * Demo: Multiple Iterations - from public/showcase/effects/shake.
 */
export function mount(root) {
        // Demo 4: Iterations
    $(root).find('#shake-1x').on('click', () => {
          Domma.effects.shake('#shake-iter', {
            iterations: 1,
            respectMotionPreference: false
          });
        });
    $(root).find('#shake-2x').on('click', () => {
          Domma.effects.shake('#shake-iter', {
            iterations: 2,
            respectMotionPreference: false
          });
        });
    $(root).find('#shake-3x').on('click', () => {
          Domma.effects.shake('#shake-iter', {
            iterations: 3,
            respectMotionPreference: false
          });
        });
}
