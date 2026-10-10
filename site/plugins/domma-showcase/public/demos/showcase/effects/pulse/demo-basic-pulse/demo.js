/**
 * Demo: Basic Pulse - from public/showcase/effects/pulse.
 */
export function mount(root) {
        // Store control objects
    let pulse1, pulse2, pulse3;
        // pulse() Demo 1 - Basic
    $(root).find('#pulse-start-1').on('click', () => {
          if (pulse1) pulse1.destroy();
          pulse1 = Domma.effects.pulse('#pulse-demo-1 .badge', {
            scale: 1.1,
            duration: 2000,
            stagger: 100,
            respectMotionPreference: false
          });
        });
    $(root).find('#pulse-pause-1').on('click', () => {
          if (pulse1) pulse1.pause();
        });
    $(root).find('#pulse-resume-1').on('click', () => {
          if (pulse1) pulse1.resume();
        });
    $(root).find('#pulse-stop-1').on('click', () => {
          if (pulse1) {
            pulse1.stop();
            pulse1 = null;
          }
        });
}
