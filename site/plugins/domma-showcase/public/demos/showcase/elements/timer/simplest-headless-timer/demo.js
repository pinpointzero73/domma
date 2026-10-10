/**
 * Simplest Headless Timer - from public/showcase/elements/timer.
 */
export function mount(root) {
        // Quick Start: Headless Timer
    $(root).find('#quick-headless').on('click', () => {
            const status = $(root).find('#headless-status')[0];
            status.textContent = 'Timer started (10 seconds)...';

            const headless = E.timer(null, {
                duration: 10000,
                onTick: (remaining) => {
                    status.textContent = `${Math.ceil(remaining / 1000)}s remaining`;
                },
                onComplete: () => {
                    status.textContent = '✓ Headless timer complete!';
                    status.className = 'mt-2 text-success';
                }
            });

            headless.start();
        });
}
