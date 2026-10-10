/**
 * Demo: Amplitude Variations - from public/showcase/effects/breathe.
 */
export function mount(root) {
        // Store control objects
    let breathe1, breathe2, breathe3, breathe4;
        // breathe() Demo 3 - Amplitude Variations
    $(root).find('#breathe-start-3').on('click', () => {
          if (breathe3) breathe3.destroy();

          // Apply different amplitudes to each item
          $('#breathe-demo-3 .demo-item').each(function() {
            const amplitude = parseInt($(this).attr('data-amplitude')) || 6;
            Domma.effects.breathe(this, {
              amplitude: amplitude,
              duration: 3000,
              respectMotionPreference: false
            });
          });
        });
}
