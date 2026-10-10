/**
 * Demo: Basic Scramble - from public/showcase/effects/scramble.
 */
export function mount(root) {
    let ctrl1;
        // Demo 1: Basic
    $(root).find('#scramble-start-1').on('click', () => {
          if (ctrl1) ctrl1.destroy();
          $(root).find('#scramble-demo-1').text('Welcome to Domma');
          ctrl1 = Domma.effects.scramble('#scramble-demo-1', {
            respectMotionPreference: false
          });
        });
    $(root).find('#scramble-pause-1').on('click', () => { if (ctrl1) ctrl1.pause(); });
    $(root).find('#scramble-resume-1').on('click', () => { if (ctrl1) ctrl1.resume(); });
    $(root).find('#scramble-stop-1').on('click', () => { if (ctrl1) ctrl1.stop(); });
}
