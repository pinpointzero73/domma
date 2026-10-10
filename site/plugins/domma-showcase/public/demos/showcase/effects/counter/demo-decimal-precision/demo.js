/**
 * Demo: Decimal Precision - from public/showcase/effects/counter.
 */
export function mount(root) {
        // Demo 5: Decimal
    $(root).find('#counter-start-decimal').on('click', () => {
          $(root).find('#counter-decimal').text('0');
          Domma.effects.counter('#counter-decimal', {
            to: 42867.53,
            prefix: '$',
            decimals: 2,
            separator: ',',
            duration: 2500,
            respectMotionPreference: false
          });
        });
}
