/**
 * Demo: Scale Variations - from public/showcase/effects/pulse.
 */
export function mount(root) {
        // Store control objects
    let pulse1, pulse2, pulse3;
        // pulse() Demo 2 - Scale Variations
    $(root).find('#pulse-start-2').on('click', () => {
          if (pulse2) pulse2.destroy();

          // Apply different scales to each item
          $('#pulse-demo-2 .demo-item').each(function() {
            const scale = parseFloat($(this).attr('data-scale')) || 1.05;
            Domma.effects.pulse(this, {
              scale: scale,
              duration: 2000,
              respectMotionPreference: false
            });
          });
        });
}
