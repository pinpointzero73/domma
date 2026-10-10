/**
 * 3D Flip Entrance - from public/showcase/effects/reveal.
 */
export function mount(root) {
        // Flip demo
    Domma.effects.reveal('.reveal-flip-demo', {
          animation: 'flip',
          duration: 900,
          respectMotionPreference: false
        });
}
