/**
 * Demo: Intensity Levels - from public/showcase/effects/shake.
 */
export function mount(root) {
        // Demo 2: Intensity
    $(root).find('#shake-start-subtle').on('click', () => {
          Domma.effects.shake('#shake-subtle', {
            intensity: 2,
            respectMotionPreference: false
          });
        });
    $(root).find('#shake-start-normal').on('click', () => {
          Domma.effects.shake('#shake-normal', {
            intensity: 6,
            respectMotionPreference: false
          });
        });
    $(root).find('#shake-start-intense').on('click', () => {
          Domma.effects.shake('#shake-intense', {
            intensity: 12,
            respectMotionPreference: false
          });
        });
}
