/**
 * Demo: Speed Variations - from public/showcase/effects/scramble.
 */
export function mount(root) {
        // Demo 5: Speed variations
    let ctrlFast, ctrlSlow;
    $(root).find('#scramble-start-fast').on('click', () => {
          if (ctrlFast) ctrlFast.destroy();
          $(root).find('#scramble-fast').text('Quick Decode');
          ctrlFast = Domma.effects.scramble('#scramble-fast', {
            scrambleDuration: 300,
            speed: 20,
            respectMotionPreference: false
          });
        });
    $(root).find('#scramble-start-slow').on('click', () => {
          if (ctrlSlow) ctrlSlow.destroy();
          $(root).find('#scramble-slow').text('Slow Reveal');
          ctrlSlow = Domma.effects.scramble('#scramble-slow', {
            scrambleDuration: 2000,
            speed: 100,
            respectMotionPreference: false
          });
        });
}
