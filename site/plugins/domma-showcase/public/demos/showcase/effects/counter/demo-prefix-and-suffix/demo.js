/**
 * Demo: Prefix & Suffix - from public/showcase/effects/counter.
 */
export function mount(root) {
        // Demo 2: Prefix & Suffix
    $(root).find('#counter-start-2').on('click', () => {
          Domma.effects.counter('#counter-revenue', {
            to: 84750, prefix: '$', separator: ',', duration: 2000,
            respectMotionPreference: false
          });
          Domma.effects.counter('#counter-percent', {
            to: 98.7, suffix: '%', decimals: 1, duration: 2000,
            respectMotionPreference: false
          });
          Domma.effects.counter('#counter-temp', {
            to: 23.5, suffix: '°C', decimals: 1, duration: 2000,
            respectMotionPreference: false
          });
        });
}
