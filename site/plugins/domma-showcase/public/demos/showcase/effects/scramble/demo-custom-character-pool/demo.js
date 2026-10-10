/**
 * Demo: Custom Character Pool - from public/showcase/effects/scramble.
 */
export function mount(root) {
        // Demo 4: Custom characters
    let ctrlCustom;
    $(root).find('#scramble-start-custom').on('click', () => {
          if (ctrlCustom) ctrlCustom.destroy();
          $(root).find('#scramble-custom').text('01100100');
          ctrlCustom = Domma.effects.scramble('#scramble-custom', {
            characters: '01',
            scrambleDuration: 1500,
            speed: 80,
            respectMotionPreference: false
          });
        });
}
