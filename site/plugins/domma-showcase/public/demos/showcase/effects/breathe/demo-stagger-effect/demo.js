/**
 * Demo: Stagger Effect - from public/showcase/effects/breathe.
 */
export function mount(root) {
        // Store control objects
    let breathe1, breathe2, breathe3, breathe4;
        // breathe() Demo 2 - Stagger
    $(root).find('#breathe-start-2').on('click', () => {
          if (breathe2) breathe2.destroy();
          breathe2 = Domma.effects.breathe('#breathe-demo-2 .demo-item', {
            amplitude: 8,
            duration: 2500,
            stagger: 150,
            respectMotionPreference: false
          });
        });
}
