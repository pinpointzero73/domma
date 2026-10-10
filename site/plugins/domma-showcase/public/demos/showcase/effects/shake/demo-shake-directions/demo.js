/**
 * Demo: Shake Directions - from public/showcase/effects/shake.
 */
export function mount(root) {
        // Demo 1: Directions
    $(root).find('#shake-start-h').on('click', () => {
          Domma.effects.shake('#shake-h', {
            direction: 'horizontal',
            respectMotionPreference: false
          });
        });
    $(root).find('#shake-start-v').on('click', () => {
          Domma.effects.shake('#shake-v', {
            direction: 'vertical',
            respectMotionPreference: false
          });
        });
    $(root).find('#shake-start-both').on('click', () => {
          Domma.effects.shake('#shake-both', {
            direction: 'both',
            respectMotionPreference: false
          });
        });
}
