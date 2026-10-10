/**
 * Step 3: Show and Control - from public/showcase/elements/notification.
 */
export function mount(root) {
        // Tutorial Demo
    $(root).find('#tutorial-demo').on('click', async () => {
          const status = $(root).find('#tutorial-status');
          status.text('Creating notification...');

            const notification = E.notification({
                title: 'Tutorial Demo',
                body: 'Click this notification to see the onClick handler',
                onClick: () => {
                  status.text('✓ Notification clicked!');
                  status.attr('class', 'mt-2 text-success');
                },
                onShow: () => {
                  status.text('✓ Notification shown (waiting for click)');
                },
                onClose: () => {
                    if (status.textContent.includes('waiting')) {
                        status.textContent = 'Notification closed without clicking';
                    }
                }
            });

            await notification.show();
        });
}
