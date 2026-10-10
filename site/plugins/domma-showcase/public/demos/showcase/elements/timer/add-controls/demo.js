/**
 * Step 3: Add Controls - from public/showcase/elements/timer.
 */
export function mount(root) {
        // Tutorial: Pomodoro Timers
    const tutorialWorkTimer = E.timer(root.querySelector('#tutorial-work-timer'), {
            duration: 1500000,
            format: 'mm:ss',
            showControls: true
        });
    const tutorialBreakTimer = E.timer(root.querySelector('#tutorial-break-timer'), {
            duration: 300000,
            format: 'mm:ss',
            showControls: true
        });
}
