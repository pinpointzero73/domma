/**
 * Simplest Visual Timer - from public/showcase/elements/timer.
 */
export function mount(root) {
    const quickTimer = E.timer(root.querySelector('#quick-timer'), {
        duration: 30000,
        showControls: true,
        autoStart: false
    });
}
