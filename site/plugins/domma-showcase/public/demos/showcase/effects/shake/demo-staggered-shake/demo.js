/**
 * Demo: Staggered Shake - from public/showcase/effects/shake.
 */
export function mount(root) {
        // Demo 5: Stagger
    $(root).find('#shake-start-stagger').on('click', () => {
          Domma.effects.shake('.shake-stagger', {
            stagger: 100,
            intensity: 5,
            direction: 'horizontal',
            respectMotionPreference: false
          });
        });
}
