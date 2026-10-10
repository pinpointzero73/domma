/**
 * 2. HIIT Workout Timer - from public/showcase/elements/timer.
 */
export function mount(root) {
        // Example 2: HIIT Workout
    let workoutRound = 1;
    const workoutTimer = E.timer(root.querySelector('#example-workout'), {
            duration: 30000,
            format: 'ss',
            showControls: true,
            onComplete: () => {
                if (workoutRound < 3) {
                    workoutRound++;
                    $(root).find('#workout-status')[0].textContent = `Round: ${workoutRound}/3`;
                    workoutTimer.reset();
                    setTimeout(() => workoutTimer.start(), 1000);
                } else {
                    $(root).find('#workout-status')[0].textContent = 'Workout complete!';
                }
            }
        });
}
