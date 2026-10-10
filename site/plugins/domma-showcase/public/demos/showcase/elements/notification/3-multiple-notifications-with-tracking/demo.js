/**
 * 3. Multiple Notifications with Tracking - from public/showcase/elements/notification.
 */
export function mount(root) {
        // Example: Multiple Notifications
    let multipleNotifications = [];
    $(root).find('#example-multiple').on('click', async () => {
            multipleNotifications = [];

            for (let i = 0; i < 3; i++) {
                const notif = E.notification({
                    title: `Notification ${i + 1}`,
                    body: `This is message number ${i + 1}`,
                    tag: `multi-${i}`
                });

                multipleNotifications.push(notif);
                await notif.show();
            }
        });
    $(root).find('#example-close-all').on('click', () => {
            Domma.DesktopNotification.closeAll();
        });
}
