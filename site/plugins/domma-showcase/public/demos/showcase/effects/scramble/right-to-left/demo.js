/**
 * Right to Left - from public/showcase/effects/scramble.
 */
export function mount(root) {
        // Demo 2: Reveal Orders
    let ctrlLtr, ctrlRtl, ctrlRandom, ctrlCenter;
    $(root).find('#scramble-start-rtl').on('click', () => {
          if (ctrlRtl) ctrlRtl.destroy();
          $(root).find('#scramble-rtl').text('Domma Effects');
          ctrlRtl = Domma.effects.scramble('#scramble-rtl', {
            revealOrder: 'right-to-left',
            respectMotionPreference: false
          });
        });
}
