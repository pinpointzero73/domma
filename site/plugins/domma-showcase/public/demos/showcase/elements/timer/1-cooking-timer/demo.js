/**
 * 1. Cooking Timer - from public/showcase/elements/timer.
 */
export function mount(root) {
        // Example 1: Cooking Timer
    const cookingTimer = E.timer(root.querySelector('#example-cooking'), {
            duration: 600000,
            format: 'mm:ss',
            showControls: true
        });
}
