/**
 * Demo: Easing Comparison - from public/showcase/effects/counter.
 */
export function mount(root) {
        // Demo 3: Easing Comparison
    $(root).find('#counter-start-3').on('click', () => {
          $(root).find('#counter-linear').text('0');
          $(root).find('#counter-easeout').text('0');
          $(root).find('#counter-easeinout').text('0');
          Domma.effects.counter('#counter-linear', {
            to: 1000, easing: 'linear', duration: 3000, separator: ',',
            respectMotionPreference: false
          });
          Domma.effects.counter('#counter-easeout', {
            to: 1000, easing: 'ease-out', duration: 3000, separator: ',',
            respectMotionPreference: false
          });
          Domma.effects.counter('#counter-easeinout', {
            to: 1000, easing: 'ease-in-out', duration: 3000, separator: ',',
            respectMotionPreference: false
          });
        });
}
