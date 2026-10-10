/**
 * Random - from public/showcase/effects/scramble.
 */
export function mount(root) {
        // Demo 2: Reveal Orders
    let ctrlLtr, ctrlRtl, ctrlRandom, ctrlCenter;
    $(root).find('#scramble-start-random').on('click', () => {
          if (ctrlRandom) ctrlRandom.destroy();
          $(root).find('#scramble-random').text('Domma Effects');
          ctrlRandom = Domma.effects.scramble('#scramble-random', {
            revealOrder: 'random',
            respectMotionPreference: false
          });
        });
}
