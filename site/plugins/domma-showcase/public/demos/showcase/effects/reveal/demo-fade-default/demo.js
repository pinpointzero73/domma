/**
 * Demo: Fade (Default) - from public/showcase/effects/reveal.
 */
export function mount(root) {
        // Fade demo
    Domma.effects.reveal('.reveal-fade-demo', {
          animation: 'fade',
          duration: 600,
          stagger: 150,
          respectMotionPreference: false
        });
}
