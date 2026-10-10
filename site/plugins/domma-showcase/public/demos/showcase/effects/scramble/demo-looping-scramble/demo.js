/**
 * Demo: Looping Scramble - from public/showcase/effects/scramble.
 */
export function mount(root) {
        // Demo 3: Loop
    let ctrlLoop;
    $(root).find('#scramble-start-loop').on('click', () => {
          if (ctrlLoop) ctrlLoop.destroy();
          $(root).find('#scramble-loop').text('Build Amazing Apps');
          ctrlLoop = Domma.effects.scramble('#scramble-loop', {
            loop: true,
            loopDelay: 2000,
            scrambleDuration: 1000,
            revealOrder: 'random',
            respectMotionPreference: false
          });
        });
    $(root).find('#scramble-stop-loop').on('click', () => { if (ctrlLoop) ctrlLoop.stop(); });
}
