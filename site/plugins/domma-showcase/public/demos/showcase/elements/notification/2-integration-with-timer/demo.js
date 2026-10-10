/**
 * 2. Integration with Timer - from public/showcase/elements/notification.
 */
export function mount(root) {
        // Example: Timer Integration
    $(root).find('#example-timer').on('click', () => {
          const status = $(root).find('#timer-status');
          status.text('Timer started (5 seconds)...');

            const timer = E.timer(null, {
                duration: 5000,
                onTick: (remaining) => {
                  status.text(`Timer: ${Math.ceil(remaining / 1000)}s remaining`);
                },
                onComplete: () => {
                  status.text('✓ Timer complete! Check your notifications');
                    E.notify('Timer Complete!', {
                        body: 'Your 5-second timer has finished',
                        requireInteraction: true
                    });
                }
            });

            timer.start();
        });
}
