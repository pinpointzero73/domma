/**
 * Demo: Zoom - from public/showcase/effects/reveal.
 */
export function mount(root) {
        // Zoom demo
    Domma.effects.reveal('.reveal-zoom-demo', {
          animation: 'zoom',
          duration: 700,
          stagger: 200,
          respectMotionPreference: false
        });
}
