/**
 * Demo: Notification Dot - from public/showcase/effects/pulse.
 */
export function mount(root) {
        // Store control objects
    let pulse1, pulse2, pulse3;
        // pulse() Demo 3 - Notification Dot
    $(root).find('#pulse-start-3').on('click', () => {
          if (pulse3) pulse3.destroy();
          pulse3 = Domma.effects.pulse('#notification-dot', {
            scale: 1.3,
            duration: 1500,
            respectMotionPreference: false
          });
        });
}
