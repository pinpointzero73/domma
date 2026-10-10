/**
 * Demo: Re-animate on Re-entry - from public/showcase/effects/reveal.
 */
export function mount(root) {
        // Repeat demo
    Domma.effects.reveal('.reveal-repeat-demo', {
          animation: 'slide-up',
          duration: 600,
          stagger: 100,
          once: false,
          respectMotionPreference: false
        });
}
