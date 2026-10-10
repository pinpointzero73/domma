/**
 * Demo: Basic Breathe - from public/showcase/effects/breathe.
 */
export function mount(root) {
        // Store control objects
    let breathe1, breathe2, breathe3, breathe4;
        // breathe() Demo 1 - Basic
    $(root).find('#breathe-start-1').on('click', () => {
          if (breathe1) breathe1.destroy();
          breathe1 = Domma.effects.breathe('#breathe-demo-1 .demo-item', {
            amplitude: 6,
            duration: 3000,
            respectMotionPreference: false
          });
        });
    $(root).find('#breathe-pause-1').on('click', () => {
          if (breathe1) breathe1.pause();
        });
    $(root).find('#breathe-resume-1').on('click', () => {
          if (breathe1) breathe1.resume();
        });
    $(root).find('#breathe-stop-1').on('click', () => {
          if (breathe1) {
            breathe1.stop();
            breathe1 = null;
          }
        });
}
