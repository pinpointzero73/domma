/**
 * Left to Right - from public/showcase/effects/scramble.
 */
export function mount(root) {
        // Demo 2: Reveal Orders
    let ctrlLtr, ctrlRtl, ctrlRandom, ctrlCenter;
    $(root).find('#scramble-start-ltr').on('click', () => {
          if (ctrlLtr) ctrlLtr.destroy();
          $(root).find('#scramble-ltr').text('Domma Effects');
          ctrlLtr = Domma.effects.scramble('#scramble-ltr', {
            revealOrder: 'left-to-right',
            respectMotionPreference: false
          });
        });
}
