/**
 * Demo: Slide Up - from public/showcase/effects/reveal.
 */
export function mount(root) {
        // Slide up demo
    Domma.effects.reveal('.reveal-slideup-demo', {
          animation: 'slide-up',
          duration: 800,
          stagger: 120,
          respectMotionPreference: false
        });
}
