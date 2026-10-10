/**
 * 4. Multiple Timers - from public/showcase/elements/timer.
 */
export function mount(root) {
        // Example 4: Multiple Timers
    const multiTimers = {
            pasta: E.timer(root.querySelector('#multi-pasta'), {
                duration: 480000,
                format: 'mm:ss',
                showControls: true
            }),
            sauce: E.timer(root.querySelector('#multi-sauce'), {
                duration: 900000,
                format: 'mm:ss',
                showControls: true
            }),
            garlic: E.timer(root.querySelector('#multi-garlic'), {
                duration: 120000,
                format: 'mm:ss',
                showControls: true
            })
        };
    $(root).find('#start-all').on('click', () => {
            Object.values(multiTimers).forEach(timer => {
                timer.reset();
                timer.start();
            });
        });
}
