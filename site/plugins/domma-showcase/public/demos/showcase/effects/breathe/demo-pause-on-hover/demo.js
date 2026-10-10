/**
 * Demo: Pause on Hover - from public/showcase/effects/breathe.
 */
export function mount(root) {
        // Store control objects
    let breathe1, breathe2, breathe3, breathe4;
        // breathe() Demo 4 - Pause on Hover
    $(root).find('#breathe-start-4').on('click', () => {
          if (breathe4) breathe4.destroy();
          breathe4 = Domma.effects.breathe('#breathe-demo-4 .demo-item', {
            amplitude: 10,
            duration: 2000,
            pauseOnHover: true,
            respectMotionPreference: false
          });
        });
}
