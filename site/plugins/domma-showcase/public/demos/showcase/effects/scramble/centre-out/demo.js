/**
 * Centre Out - from public/showcase/effects/scramble.
 */
export function mount(root) {
        // Demo 2: Reveal Orders
    let ctrlLtr, ctrlRtl, ctrlRandom, ctrlCenter;
    $(root).find('#scramble-start-center').on('click', () => {
          if (ctrlCenter) ctrlCenter.destroy();
          $(root).find('#scramble-center').text('Domma Effects');
          ctrlCenter = Domma.effects.scramble('#scramble-center', {
            revealOrder: 'center-out',
            respectMotionPreference: false
          });
        });
}
