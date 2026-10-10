/**
 * Demo: Slide Left & Right - from public/showcase/effects/reveal.
 */
export function mount(root) {
        // Slide left demo
    Domma.effects.reveal('.reveal-slideleft-demo', {
          animation: 'slide-left',
          duration: 700,
          respectMotionPreference: false
        });
        // Slide right demo
    Domma.effects.reveal('.reveal-slideright-demo', {
          animation: 'slide-right',
          duration: 700,
          respectMotionPreference: false
        });
}
