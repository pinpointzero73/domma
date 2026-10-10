/**
 * Demo: Scroll Triggered - from public/showcase/effects/counter.
 */
export function mount(root) {
        // Demo 4: Scroll triggered
    Domma.effects.counter('.counter-scroll', {
          trigger: 'scroll',
          threshold: 0.5,
          stagger: 150,
          separator: ',',
          respectMotionPreference: false
        });
}
